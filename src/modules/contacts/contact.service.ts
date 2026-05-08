import { ContactRepository } from './contact.repository';
import type { ContactDetails, ContactSummary, CreateContactDto, UpdateContactDto } from './contact.types';
import { AppError } from '../../shared/errors/app-error';
import { PG_ERROR_CODES } from '../../shared/errors/db-error-codes';
import { throwMappedDbError } from '../../shared/errors/db-error-mapper';

export class ContactService {
  private readonly repository = new ContactRepository();

  public async create(input: CreateContactDto): Promise<ContactDetails> {
    try {
      return await this.repository.create(input);
    } catch (error: unknown) {
      this.mapDbError(error);
    }
  }

  public async findByEmail(email: string): Promise<ContactDetails> {
    const contact = await this.repository.findByEmail(email);
    if (!contact) {
      throw new AppError('Contacto no encontrado.', 404);
    }
    return contact;
  }

  public async search(filters: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    limit: number;
    offset: number;
  }): Promise<ContactSummary[]> {
    return this.repository.search(filters);
  }

  public async findByPhone(number: string, type: string): Promise<ContactSummary[]> {
    return this.repository.findByPhone(number, type);
  }

  public async update(id: number, input: UpdateContactDto): Promise<ContactDetails> {
    try {
      const updated = await this.repository.update(id, input);
      if (!updated) {
        throw new AppError('Contacto no encontrado.', 404);
      }
      return updated;
    } catch (error: unknown) {
      this.mapDbError(error);
    }
  }

  public async delete(id: number): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new AppError('Contacto no encontrado.', 404);
    }
  }

  private mapDbError(error: unknown): never {
    return throwMappedDbError(error, {
      [PG_ERROR_CODES.UNIQUE_VIOLATION]: {
        message: 'El email ya existe.',
        statusCode: 409,
      },
      [PG_ERROR_CODES.FOREIGN_KEY_VIOLATION]: {
        message: 'Entidad relacionada no encontrada.',
        statusCode: 400,
      },
      [PG_ERROR_CODES.CHECK_VIOLATION]: {
        message: 'Los datos enviados no cumplen las reglas de la base.',
        statusCode: 400,
      },
      [PG_ERROR_CODES.INVALID_TEXT_REPRESENTATION]: {
        message: 'Los datos enviados no cumplen las reglas de la base.',
        statusCode: 400,
      },
    });
  }
}
