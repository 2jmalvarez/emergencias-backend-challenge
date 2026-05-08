import type { NextFunction, Request, Response } from 'express';
import type { z } from 'zod';

export const validateRequest =
  (schema: z.ZodTypeAny) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  };
