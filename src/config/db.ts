import { Pool } from 'pg';

import { env } from './env';

export const pool = new Pool({
  connectionString: env.DATABASE_URL_ACTIVE,
});

export const checkDatabaseConnection = async (): Promise<void> => {
  await pool.query('SELECT 1');
};
