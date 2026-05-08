import type { PoolClient } from 'pg';

import type { ContactDetails, ContactSummary, CreateContactDto, UpdateContactDto } from './contact.types';
import { pool } from '../../config/db';
import { createSqlLoader } from '../../shared/utils/sql-loader';

const normalizePhone = (value: string): string =>
  value.replaceAll(' ', '').replaceAll('-', '');

const sql = createSqlLoader(__dirname);

export class ContactRepository {
  public async create(input: CreateContactDto): Promise<ContactDetails> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const personResult = await client.query<{ id: number }>(sql('create-person.sql'), [
        input.firstName,
        input.lastName,
        input.dateOfBirth,
        input.email,
      ]);

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
    const person = await pool.query<{ id: number }>(sql('find-person-id-by-email.sql'), [email]);
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

    const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
    const searchContactsSql = sql('search-contacts.sql')
      .replace('{{WHERE_CLAUSE}}', whereClause)
      .replace('${{LIMIT_INDEX}}', String(limitIndex))
      .replace('${{OFFSET_INDEX}}', String(offsetIndex));
    const result = await pool.query<ContactSummary>(
      searchContactsSql,
      values,
    );

    return result.rows;
  }

  public async findByPhone(number: string, type: string): Promise<ContactSummary[]> {
    const normalized = normalizePhone(number);
    const result = await pool.query<ContactSummary>(sql('find-contacts-by-phone-and-type.sql'), [
      normalized,
      type,
    ]);
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
    const updatePersonSql = sql('update-person-by-id.sql')
      .replace('{{SET_CLAUSES}}', setClauses.join(', '))
      .replace('${{ID_INDEX}}', String(values.length));

    const result = await pool.query(updatePersonSql, values);

    if (result.rowCount === 0) {
      return null;
    }
    return this.findByIdOrThrow(id);
  }

  public async delete(id: number): Promise<boolean> {
    const result = await pool.query(sql('delete-person-by-id.sql'), [id]);
    return (result.rowCount ?? 0) > 0;
  }

  public async findById(id: number): Promise<ContactDetails | null> {
    const person = await pool.query<ContactSummary>(sql('find-contact-summary-by-id.sql'), [id]);
    if (person.rowCount === 0) {
      return null;
    }
    const phones = await pool.query<ContactDetails['phones'][number]>(
      sql('find-phones-by-person-id.sql'),
      [id],
    );
    const addresses = await pool.query<ContactDetails['addresses'][number]>(
      sql('find-addresses-by-person-id.sql'),
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
      throw new Error('No se encontro el contacto luego de la operacion.');
    }
    return entity;
  }

  private async insertPhones(
    client: PoolClient,
    personId: number,
    phones: CreateContactDto['phones'],
  ): Promise<void> {
    for (const phone of phones) {
      await client.query(sql('insert-phone.sql'), [phone.number, personId, phone.phoneTypeId]);
    }
  }

  private async insertAddresses(
    client: PoolClient,
    personId: number,
    addresses: CreateContactDto['addresses'],
  ): Promise<void> {
    for (const address of addresses) {
      await client.query(sql('insert-address.sql'), [
        personId,
        address.locality,
        address.street,
        address.number,
        address.notes ?? null,
      ]);
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
