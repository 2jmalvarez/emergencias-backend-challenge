import request from 'supertest';

import { app } from '../../src/app';

describe('Integracion system (DB test)', () => {
  beforeEach(() => {
    const testName = expect.getState().currentTestName;
    console.log(`\n[TEST] ${testName}`);
  });

  it('GET /health responde 200 e informa estado operativo de la API', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: { status: 'ok' }, error: null });
  });
});
