import 'dotenv/config';
import { z } from 'zod';

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z.string().optional(),
    DATABASE_URL_TEST: z.string().optional(),
  })
  .superRefine((value, context) => {
    if (value.NODE_ENV === 'test' && !value.DATABASE_URL_TEST) {
      context.addIssue({
        code: 'custom',
        path: ['DATABASE_URL_TEST'],
        message: 'DATABASE_URL_TEST es obligatoria en entorno de test.',
      });
    }

    if (value.NODE_ENV !== 'test' && !value.DATABASE_URL) {
      context.addIssue({
        code: 'custom',
        path: ['DATABASE_URL'],
        message: 'DATABASE_URL es obligatoria en entorno de desarrollo/produccion.',
      });
    }
  });

const parsed = envSchema.parse(process.env);

export const env = {
  ...parsed,
  DATABASE_URL_ACTIVE:
    parsed.NODE_ENV === 'test' ? (parsed.DATABASE_URL_TEST as string) : (parsed.DATABASE_URL as string),
};
