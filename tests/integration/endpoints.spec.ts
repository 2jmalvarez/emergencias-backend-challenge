import request from 'supertest';

import { app } from '../../src/app';
import { pool } from '../../src/config/db';

describe('Integracion real de endpoints (DB test)', () => {
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
      phones: [{ number: `11-55${String(timestamp).slice(-4)}`, phoneTypeId }],
      addresses: [{ locality: 'CABA', street: 'Corrientes', number: 1234 }],
    };

    if (overrides) {
      Object.assign(payload, overrides);
    }

    return request(app).post('/contacts').send(payload);
  };

  beforeAll(async () => {
    await pool.query("INSERT INTO phone_type (type_name) VALUES ('mobile') ON CONFLICT (type_name) DO NOTHING");
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

  describe('POST /contacts - Creacion de contacto', () => {
    it('crea un contacto con telefonos y direcciones y devuelve 201 con el detalle persistido', async () => {
      const response = await createContact({
        firstName: 'Ana',
        lastName: 'Garcia',
        email: `ana.${Date.now()}@example.com`,
      });

      expect(response.status).toBe(201);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.phones.length).toBeGreaterThan(0);
      expect(response.body.data.addresses.length).toBeGreaterThan(0);
      expect(response.body.error).toBeNull();
    });

    it('rechaza la creacion con body invalido y devuelve 422 de validacion', async () => {
      const response = await request(app).post('/contacts').send({ firstName: 'A' });

      expect(response.status).toBe(422);
      expect(response.body.error.message).toBe('Error de validacion.');
    });
  });

  describe('GET /contacts/by-email - Busqueda por email', () => {
    it('recupera un contacto existente por email y devuelve 200 con su detalle completo', async () => {
      const email = `luis.${Date.now()}@example.com`;
      await createContact({ firstName: 'Luis', lastName: 'Perez', email });

      const response = await request(app).get('/contacts/by-email').query({ email });

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe(email);
      expect(response.body.data.firstName).toBe('Luis');
    });

    it('rechaza la busqueda cuando el email tiene formato invalido y devuelve 422', async () => {
      const response = await request(app).get('/contacts/by-email').query({ email: 'email-invalido' });

      expect(response.status).toBe(422);
      expect(response.body.error.message).toBe('Error de validacion.');
    });
  });

  describe('GET /contacts/search - Busqueda por datos personales', () => {
    it('busca por datos personales con paginacion y devuelve una lista con resultados', async () => {
      await createContact({ firstName: 'Maria', lastName: 'Lopez', email: `maria.${Date.now()}@example.com` });

      const response = await request(app)
        .get('/contacts/search')
        .query({ firstName: 'Maria', limit: 20, offset: 0 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('rechaza la busqueda cuando limit es menor al minimo y devuelve 422', async () => {
      const response = await request(app).get('/contacts/search').query({ limit: 0 });

      expect(response.status).toBe(422);
      expect(response.body.error.message).toBe('Error de validacion.');
    });
  });

  describe('GET /contacts/by-phone - Busqueda por telefono y tipo', () => {
    it('encuentra contactos por numero y tipo de telefono y responde 200 con resultados', async () => {
      await createContact({
        firstName: 'Pedro',
        lastName: 'Sosa',
        email: `pedro.${Date.now()}@example.com`,
        phones: [{ number: '11-1234-5678', phoneTypeId }],
      });

      const response = await request(app).get('/contacts/by-phone').query({ number: '11-1234-5678', type: 'mobile' });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('rechaza la consulta si falta el tipo de telefono y devuelve 422', async () => {
      const response = await request(app).get('/contacts/by-phone').query({ number: '11-1234-5678' });

      expect(response.status).toBe(422);
      expect(response.body.error.message).toBe('Error de validacion.');
    });
  });

  describe('PATCH /contacts/:id - Edicion de datos personales', () => {
    it('actualiza datos personales de un contacto existente y devuelve 200 con los cambios', async () => {
      const created = await createContact({ firstName: 'Paula', lastName: 'Diaz', email: `paula.${Date.now()}@example.com` });
      const id = Number(created.body.data.id);

      const response = await request(app).patch(`/contacts/${id}`).send({
        firstName: 'Paula Maria',
        lastName: 'Diaz',
        dateOfBirth: '1991-01-22',
        email: `paula.maria.${Date.now()}@example.com`,
      });

      expect(response.status).toBe(200);
      expect(response.body.data.firstName).toBe('Paula Maria');
    });

    it('rechaza la edicion cuando el body llega vacio y devuelve 422', async () => {
      const created = await createContact({ firstName: 'Paula', lastName: 'Diaz', email: `paula.${Date.now()}@example.com` });
      const id = Number(created.body.data.id);

      const response = await request(app).patch(`/contacts/${id}`).send({});

      expect(response.status).toBe(422);
      expect(response.body.error.message).toBe('Error de validacion.');
    });
  });

  describe('DELETE /contacts/:id - Eliminacion de contacto', () => {
    it('elimina un contacto existente y responde 204 sin contenido', async () => {
      const created = await createContact({ firstName: 'Juan', lastName: 'Mendez', email: `juan.${Date.now()}@example.com` });
      const id = Number(created.body.data.id);

      const response = await request(app).delete(`/contacts/${id}`);

      expect(response.status).toBe(204);
    });

    it('informa 404 cuando se intenta eliminar un contacto inexistente', async () => {
      const response = await request(app).delete('/contacts/999999');

      expect(response.status).toBe(404);
      expect(response.body.error.message).toBe('Contacto no encontrado.');
    });
  });

  describe('POST /activities - Creacion de actividad', () => {
    it('crea una actividad para un contacto existente y devuelve 201 con el registro creado', async () => {
      const created = await createContact({ firstName: 'Rocio', lastName: 'Fernandez', email: `rocio.${Date.now()}@example.com` });
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

    it('rechaza la creacion cuando activityType no pertenece al enum y devuelve 422', async () => {
      const created = await createContact({ firstName: 'Rocio', lastName: 'Fernandez', email: `rocio.${Date.now()}@example.com` });
      const personId = Number(created.body.data.id);

      const response = await request(app).post('/activities').send({
        personId,
        activityType: 'sms',
        activityDate: '2026-05-08T14:30:00.000Z',
      });

      expect(response.status).toBe(422);
      expect(response.body.error.message).toBe('Error de validacion.');
    });
  });

  describe('GET /activities/search - Busqueda por contacto y tipo', () => {
    it('devuelve actividades filtradas por contacto y tipo incluyendo detalle de contacto', async () => {
      const created = await createContact({ firstName: 'Clara', lastName: 'Ruiz', email: `clara.${Date.now()}@example.com` });
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

    it('rechaza la busqueda cuando personId es invalido y devuelve 422', async () => {
      const response = await request(app).get('/activities/search').query({ personId: 0, activityType: 'meeting' });

      expect(response.status).toBe(422);
      expect(response.body.error.message).toBe('Error de validacion.');
    });
  });
});
