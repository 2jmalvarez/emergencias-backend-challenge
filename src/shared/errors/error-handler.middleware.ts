import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { AppError } from './app-error';
import { sendError } from '../http/api-response';

const zodIssueMessageEs: Record<string, string> = {
  invalid_type: 'Tipo de dato invalido.',
  invalid_format: 'Formato invalido.',
  too_small: 'El valor es menor al minimo permitido.',
  too_big: 'El valor es mayor al maximo permitido.',
  invalid_value: 'Valor invalido.',
  custom: 'Valor invalido.',
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ZodError) {
    sendError(res, 422, 'Error de validacion.', {
      code: 'VALIDATION_ERROR',
      details: error.issues.map((issue) => ({
        path: issue.path,
        message: zodIssueMessageEs[issue.code] ?? 'Dato invalido.',
        code: issue.code,
      })),
    });
    return;
  }

  if (error instanceof AppError) {
    sendError(res, error.statusCode, error.message);
    return;
  }

  sendError(res, 500, 'Error interno inesperado.');
};
