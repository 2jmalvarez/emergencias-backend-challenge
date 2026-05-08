import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z
    .string()
    .default('postgresql://emergencias:emergencias@localhost:55433/emergencias'),
});

export const env = envSchema.parse(process.env);
