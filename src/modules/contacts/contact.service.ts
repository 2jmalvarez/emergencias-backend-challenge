import { ContactRepository } from './contact.repository';
import type { ContactDetails, ContactSummary, CreateContactDto, UpdateContactDto } from './contact.types';
import { AppError } from '../../shared/errors/app-error';

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
      throw new AppError('Contact not found', 404);
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
        throw new AppError('Contact not found', 404);
      }
      return updated;
    } catch (error: unknown) {
      this.mapDbError(error);
    }
  }

  public async delete(id: number): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new AppError('Contact not found', 404);
    }
  }

  private mapDbError(error: unknown): never {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = String(error.code);
      if (code === '23505') {
        throw new AppError('Email already exists', 409);
      }
      if (code === '23503') {
        throw new AppError('Related entity not found', 400);
      }
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Database operation failed', 500);
  }
}
