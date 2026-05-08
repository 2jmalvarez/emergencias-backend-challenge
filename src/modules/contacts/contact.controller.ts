import type { Request, Response } from 'express';

import { ContactService } from './contact.service';
import type { CreateContactDto, UpdateContactDto } from './contact.types';

const getQueryString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

const getQueryNumber = (value: unknown, fallback: number): number => {
  if (typeof value !== 'string') {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export class ContactController {
  private readonly service = new ContactService();

  public create = async (req: Request, res: Response): Promise<void> => {
    const input = req.body as CreateContactDto;
    const created = await this.service.create(input);
    res.status(201).json(created);
  };

  public byEmail = async (req: Request, res: Response): Promise<void> => {
    const email = getQueryString(req.query.email) ?? '';
    const contact = await this.service.findByEmail(email);
    res.status(200).json(contact);
  };

  public search = async (req: Request, res: Response): Promise<void> => {
    const filters = {
      firstName: getQueryString(req.query.firstName),
      lastName: getQueryString(req.query.lastName),
      dateOfBirth: getQueryString(req.query.dateOfBirth),
      limit: getQueryNumber(req.query.limit, 20),
      offset: getQueryNumber(req.query.offset, 0),
    };
    const contacts = await this.service.search(filters);
    res.status(200).json(contacts);
  };

  public byPhone = async (req: Request, res: Response): Promise<void> => {
    const number = getQueryString(req.query.number) ?? '';
    const type = getQueryString(req.query.type) ?? '';
    const contacts = await this.service.findByPhone(number, type);
    res.status(200).json(contacts);
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const input = req.body as UpdateContactDto;
    const updated = await this.service.update(id, input);
    res.status(200).json(updated);
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    await this.service.delete(id);
    res.status(204).send();
  };
}
