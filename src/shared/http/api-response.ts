import type { Response } from 'express';

type ApiErrorPayload = {
  message: string;
  code?: string;
  details?: unknown;
};

type ApiResponsePayload<T> = {
  data: T | null;
  error: ApiErrorPayload | null;
};

export const sendSuccess = <T>(res: Response, statusCode: number, data: T): void => {
  const payload: ApiResponsePayload<T> = { data, error: null };
  res.status(statusCode).json(payload);
};

export const sendNoContent = (res: Response): void => {
  res.status(204).send();
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  options?: { code?: string; details?: unknown },
): void => {
  const payload: ApiResponsePayload<null> = {
    data: null,
    error: {
      message,
      code: options?.code,
      details: options?.details,
    },
  };
  res.status(statusCode).json(payload);
};
