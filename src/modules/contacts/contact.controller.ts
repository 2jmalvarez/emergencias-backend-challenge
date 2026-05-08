import type { Request, Response } from 'express';

import {
  byEmailSchema,
  byIdSchema,
  byPhoneSchema,
  createContactSchema,
  searchContactsSchema,
  updateContactSchema,
} from './contact.schemas';
import { ContactService } from './contact.service';
import { sendNoContent, sendSuccess } from '../../shared/http/api-response';

export class ContactController {
  private readonly service = new ContactService();

  public create = async (req: Request, res: Response): Promise<void> => {
    const { body } = createContactSchema.parse({ body: req.body });
    const created = await this.service.create(body);
    sendSuccess(res, 201, created);
  };

  public byEmail = async (req: Request, res: Response): Promise<void> => {
    const { query } = byEmailSchema.parse({ query: req.query });
    const email = query.email;
    const contact = await this.service.findByEmail(email);
    sendSuccess(res, 200, contact);
  };

  public search = async (req: Request, res: Response): Promise<void> => {
    const { query } = searchContactsSchema.parse({ query: req.query });
    const contacts = await this.service.search(query);
    sendSuccess(res, 200, contacts);
  };

  public byPhone = async (req: Request, res: Response): Promise<void> => {
    const { query } = byPhoneSchema.parse({ query: req.query });
    const contacts = await this.service.findByPhone(query.number, query.type);
    sendSuccess(res, 200, contacts);
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const { params, body } = updateContactSchema.parse({ params: req.params, body: req.body });
    const updated = await this.service.update(params.id, body);
    sendSuccess(res, 200, updated);
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    const { params } = byIdSchema.parse({ params: req.params });
    await this.service.delete(params.id);
    sendNoContent(res);
  };
}
