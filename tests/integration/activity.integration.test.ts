import request from 'supertest';

import { app } from '../../src/app';
import { pool } from '../../src/config/db';

describe('Integracion activities (DB test)', () => {
  let phoneTypeId: number;

  beforeEach(() => {
    const testName = expect.getState().currentTestName;
    console.log(`\n[TEST] ${testName}`);
  });

  const createContact = async (overrides?: Record<string, unknown>) => {
    const timestamp = Date.now();
    const payload: Record<string, unknown> = {
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: '1992-04-20',
      email: `test.${timestamp}@example.com`,
      phones: [{ number: `11-66${String(timestamp).slice(-4)}`, phoneTypeId }],
      addresses: [{ locality: 'CABA', street: 'Corrientes', number: 1234 }],
    };

    if (overrides) {
      Object.assign(payload, overrides);
    }

    return request(app).post('/contacts').send(payload);
  };

  beforeAll(async () => {
    await pool.query(
      "INSERT INTO phone_type (type_name) VALUES ('mobile') ON CONFLICT (type_name) DO NOTHING",
    );
    const result = await pool.query<{ id: number }>(
      "SELECT id FROM phone_type WHERE type_name = 'mobile' LIMIT 1",
    );
    phoneTypeId = Number(result.rows[0].id);
  });

  beforeEach(async () => {
    await pool.query('DELETE FROM contact_activities');
    await pool.query('DELETE FROM address');
    await pool.query('DELETE FROM phone');
    await pool.query('DELETE FROM person');
  });

  it('POST /activities crea una actividad para un contacto existente y devuelve 201 con el registro creado', async () => {
    const created = await createContact({
      firstName: 'Rocio',
      lastName: 'Fernandez',
      email: `rocio.${Date.now()}@example.com`,
    });
    const personId = Number(created.body.data.id);

    const response = await request(app).post('/activities').send({
      personId,
      activityType: 'call',
      activityDate: '2026-05-08T14:30:00.000Z',
      description: 'Llamada de seguimiento.',
    });

    expect(response.status).toBe(201);
    expect(response.body.data.activityType).toBe('call');
  });

  it('POST /activities rechaza la creacion cuando activityType no pertenece al enum y devuelve 422', async () => {
    const created = await createContact({
      firstName: 'Rocio',
      lastName: 'Fernandez',
      email: `rocio.${Date.now()}@example.com`,
    });
    const personId = Number(created.body.data.id);

    const response = await request(app).post('/activities').send({
      personId,
      activityType: 'sms',
      activityDate: '2026-05-08T14:30:00.000Z',
    });

    expect(response.status).toBe(422);
    expect(response.body.error.message).toBe('Error de validacion.');
  });

  it('GET /activities/search devuelve actividades filtradas por contacto y tipo incluyendo detalle de contacto', async () => {
    const created = await createContact({
      firstName: 'Clara',
      lastName: 'Ruiz',
      email: `clara.${Date.now()}@example.com`,
    });
    const personId = Number(created.body.data.id);

    await request(app).post('/activities').send({
      personId,
      activityType: 'meeting',
      activityDate: '2026-05-09T10:00:00.000Z',
      description: 'Reunion presencial.',
    });

    const response = await request(app)
      .get('/activities/search')
      .query({ personId, activityType: 'meeting' });

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0].contact.email).toBeDefined();
  });

  it('GET /activities/search rechaza la busqueda cuando personId es invalido y devuelve 422', async () => {
    const response = await request(app)
      .get('/activities/search')
      .query({ personId: 0, activityType: 'meeting' });

    expect(response.status).toBe(422);
    expect(response.body.error.message).toBe('Error de validacion.');
  });
});
