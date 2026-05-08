import request from 'supertest';

import { app } from '../../src/app';

describe('health', () => {
  beforeEach(() => {
    const testName = expect.getState().currentTestName;
    console.log(`\n[TEST] ${testName}`);
  });

  it('returns ok', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: { status: 'ok' }, error: null });
  });
});
