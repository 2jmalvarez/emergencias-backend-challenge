import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { AppError } from './app-error';

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
    res.status(422).json({
      message: 'Error de validacion.',
      issues: error.issues.map((issue) => ({
        path: issue.path,
        message: zodIssueMessageEs[issue.code] ?? 'Dato invalido.',
        code: issue.code,
      })),
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: 'Error interno inesperado.' });
};
