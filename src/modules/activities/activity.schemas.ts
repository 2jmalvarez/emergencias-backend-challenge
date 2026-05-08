import { z } from 'zod';

const activityTypeSchema = z.enum(['call', 'meeting', 'email']);

export const createActivityBodySchema = z.object({
  personId: z.number().int().positive(),
  activityType: activityTypeSchema,
  activityDate: z.iso.datetime(),
  description: z.string().max(1000).optional(),
});

export const createActivitySchema = z.object({
  body: createActivityBodySchema,
});

export const searchActivitiesSchema = z.object({
  query: z.object({
    personId: z.coerce.number().int().positive(),
    activityType: activityTypeSchema,
  }),
});
