import type { z } from 'zod';

import type {
  createContactBodySchema,
  updateContactBodySchema,
} from './contact.schemas';

export type CreateContactDto = z.infer<typeof createContactBodySchema>;
export type UpdateContactDto = z.infer<typeof updateContactBodySchema>;

export type ContactSummary = {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
};

export type ContactDetails = ContactSummary & {
  phones: Array<{
    id: number;
    number: string;
    phoneTypeId: number;
    phoneTypeName: string;
  }>;
  addresses: Array<{
    id: number;
    locality: string;
    street: string;
    number: number;
    notes: string | null;
  }>;
};
