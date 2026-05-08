import { pool } from '../src/config/db';

beforeAll(async () => {
  if (process.env.INTEGRATION_TESTS !== 'true') {
    return;
  }

  try {
    await pool.query('SELECT 1');
  } catch {
    throw new Error(
      [
        'No se pudo conectar a la base de datos de test.',
        'Levanta la DB de test con: npm run db:test:up',
        'Si necesitas reiniciarla limpia: npm run db:test:reset',
      ].join(' '),
    );
  }
});

afterAll(async () => {
  await pool.end();
});
