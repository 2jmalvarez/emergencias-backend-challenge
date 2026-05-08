import { z } from 'zod';

export const phoneSchema = z.object({
  number: z.string().min(3).max(30),
  phoneTypeId: z.number().int().positive(),
});

export const addressSchema = z.object({
  locality: z.string().min(2).max(120),
  street: z.string().min(2).max(120),
  number: z.number().int().positive(),
  notes: z.string().max(500).optional(),
});

export const createContactBodySchema = z.object({
  firstName: z.string().min(2).max(120),
  lastName: z.string().min(2).max(120),
  dateOfBirth: z.iso.date(),
  email: z.email(),
  phones: z.array(phoneSchema).default([]),
  addresses: z.array(addressSchema).default([]),
});

export const createContactSchema = z.object({
  body: createContactBodySchema,
});

export const updateContactBodySchema = createContactBodySchema.pick({
  firstName: true,
  lastName: true,
  dateOfBirth: true,
  email: true,
});

export const updateContactSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: updateContactBodySchema.partial().refine((value) => Object.keys(value).length > 0),
});

export const byEmailSchema = z.object({
  query: z.object({ email: z.email() }),
});

export const searchContactsSchema = z.object({
  query: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    dateOfBirth: z.iso.date().optional(),
    limit: z.coerce.number().int().positive().max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
  }),
});

export const byPhoneSchema = z.object({
  query: z.object({
    number: z.string().min(3).max(30),
    type: z.string().min(2).max(120),
  }),
});

export const byIdSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
});
