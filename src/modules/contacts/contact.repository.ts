import type { PoolClient } from 'pg';

import type { ContactDetails, ContactSummary, CreateContactDto, UpdateContactDto } from './contact.types';
import { pool } from '../../config/db';

const normalizePhone = (value: string): string =>
  value.replaceAll(' ', '').replaceAll('-', '');

export class ContactRepository {
  public async create(input: CreateContactDto): Promise<ContactDetails> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const personResult = await client.query<{ id: number }>(
        `INSERT INTO person (first_name, last_name, date_of_birth, email)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [input.firstName, input.lastName, input.dateOfBirth, input.email],
      );

      const personId = personResult.rows[0].id;

      await this.insertPhones(client, personId, input.phones);
      await this.insertAddresses(client, personId, input.addresses);

      await client.query('COMMIT');
      return this.findByIdOrThrow(personId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  public async findByEmail(email: string): Promise<ContactDetails | null> {
    const person = await pool.query<{ id: number }>('SELECT id FROM person WHERE email = $1', [email]);
    if (person.rowCount === 0) {
      return null;
    }
    return this.findByIdOrThrow(person.rows[0].id);
  }

  public async search(filters: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    limit: number;
    offset: number;
  }): Promise<ContactSummary[]> {
    const clauses: string[] = [];
    const values: Array<string | number> = [];

    if (filters.firstName) {
      values.push(`%${filters.firstName}%`);
      clauses.push(`first_name ILIKE $${values.length}`);
    }
    if (filters.lastName) {
      values.push(`%${filters.lastName}%`);
      clauses.push(`last_name ILIKE $${values.length}`);
    }
    if (filters.dateOfBirth) {
      values.push(filters.dateOfBirth);
      clauses.push(`date_of_birth = $${values.length}`);
    }

    values.push(filters.limit);
    const limitIndex = values.length;
    values.push(filters.offset);
    const offsetIndex = values.length;

    const where = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
    const result = await pool.query<ContactSummary>(
      `SELECT id, first_name AS "firstName", last_name AS "lastName", date_of_birth AS "dateOfBirth", email
       FROM person
       ${where}
       ORDER BY id
       LIMIT $${limitIndex} OFFSET $${offsetIndex}`,
      values,
    );

    return result.rows;
  }

  public async findByPhone(number: string, type: string): Promise<ContactSummary[]> {
    const normalized = normalizePhone(number);
    const result = await pool.query<ContactSummary>(
      String.raw`SELECT DISTINCT p.id, p.first_name AS "firstName", p.last_name AS "lastName", p.date_of_birth AS "dateOfBirth", p.email
       FROM person p
       JOIN phone ph ON ph.person_id = p.id
       JOIN phone_type pt ON pt.id = ph.phone_type_id
       WHERE REGEXP_REPLACE(ph.number, '[\\s-]', '', 'g') = $1
         AND LOWER(pt.type_name) = LOWER($2)
       ORDER BY p.id`,
      [normalized, type],
    );
    return result.rows;
  }

  public async update(id: number, input: UpdateContactDto): Promise<ContactDetails | null> {
    const entries = Object.entries(input) as Array<[keyof UpdateContactDto, string]>;
    if (entries.length === 0) {
      return this.findById(id);
    }

    const setClauses = entries.map(([key], idx) => `${this.toDbColumn(key)} = $${idx + 1}`);
    const values = entries.map(([, value]) => value);
    values.push(String(id));

    const result = await pool.query(
      `UPDATE person SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING id`,
      values,
    );

    if (result.rowCount === 0) {
      return null;
    }
    return this.findByIdOrThrow(id);
  }

  public async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM person WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  public async findById(id: number): Promise<ContactDetails | null> {
    const person = await pool.query<ContactSummary>(
      `SELECT id, first_name AS "firstName", last_name AS "lastName", date_of_birth AS "dateOfBirth", email
       FROM person WHERE id = $1`,
      [id],
    );
    if (person.rowCount === 0) {
      return null;
    }
    const phones = await pool.query<ContactDetails['phones'][number]>(
      `SELECT ph.id, ph.number, ph.phone_type_id AS "phoneTypeId", pt.type_name AS "phoneTypeName"
       FROM phone ph
       JOIN phone_type pt ON pt.id = ph.phone_type_id
       WHERE ph.person_id = $1
       ORDER BY ph.id`,
      [id],
    );
    const addresses = await pool.query<ContactDetails['addresses'][number]>(
      `SELECT id, locality, street, number, notes
       FROM address
       WHERE person_id = $1
       ORDER BY id`,
      [id],
    );

    return {
      ...person.rows[0],
      phones: phones.rows,
      addresses: addresses.rows,
    };
  }

  private async findByIdOrThrow(id: number): Promise<ContactDetails> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error('Contact not found after operation');
    }
    return entity;
  }

  private async insertPhones(
    client: PoolClient,
    personId: number,
    phones: CreateContactDto['phones'],
  ): Promise<void> {
    for (const phone of phones) {
      await client.query(
        `INSERT INTO phone (number, person_id, phone_type_id)
         VALUES ($1, $2, $3)`,
        [phone.number, personId, phone.phoneTypeId],
      );
    }
  }

  private async insertAddresses(
    client: PoolClient,
    personId: number,
    addresses: CreateContactDto['addresses'],
  ): Promise<void> {
    for (const address of addresses) {
      await client.query(
        `INSERT INTO address (person_id, locality, street, number, notes)
         VALUES ($1, $2, $3, $4, $5)`,
        [personId, address.locality, address.street, address.number, address.notes ?? null],
      );
    }
  }

  private toDbColumn(key: keyof UpdateContactDto): string {
    switch (key) {
      case 'firstName':
        return 'first_name';
      case 'lastName':
        return 'last_name';
      case 'dateOfBirth':
        return 'date_of_birth';
      case 'email':
        return 'email';
      default:
        return key;
    }
  }
}
