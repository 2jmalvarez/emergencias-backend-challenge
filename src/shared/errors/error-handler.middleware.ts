import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { AppError } from './app-error';

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ZodError) {
    res.status(422).json({
      message: 'Validation error',
      issues: error.issues,
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: 'Unexpected internal error' });
};
