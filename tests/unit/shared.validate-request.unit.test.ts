import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { validateRequest } from '../../src/shared/middleware/validate-request';

describe('validate-request unit', () => {
  it('llama next cuando el payload es valido', () => {
    const schema = z.object({
      body: z.object({ name: z.string() }),
      query: z.object({}).passthrough(),
      params: z.object({}).passthrough(),
    });

    const middleware = validateRequest(schema);
    const req = { body: { name: 'ok' }, query: {}, params: {} } as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('lanza error zod cuando el payload es invalido', () => {
    const schema = z.object({
      body: z.object({ name: z.string() }),
      query: z.object({}).passthrough(),
      params: z.object({}).passthrough(),
    });

    const middleware = validateRequest(schema);
    const req = { body: { name: 123 }, query: {}, params: {} } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    expect(() => middleware(req, res, next)).toThrow();
    expect(next).not.toHaveBeenCalled();
  });
});
