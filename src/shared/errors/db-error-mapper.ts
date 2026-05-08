import { AppError } from './app-error';

type DbErrorDescriptor = {
  message: string;
  statusCode: number;
};

type DbErrorMappings = Record<string, DbErrorDescriptor>;

const hasCode = (error: unknown): error is { code: unknown } => {
  return typeof error === 'object' && error !== null && 'code' in error;
};

const toErrorCode = (value: unknown): string | null => {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return String(value);
  }
  return null;
};

export const throwMappedDbError = (
  error: unknown,
  mappings: DbErrorMappings,
  fallbackMessage = 'Fallo una operacion de base de datos.',
): never => {
  if (error instanceof AppError) {
    throw error;
  }

  if (hasCode(error)) {
    const code = toErrorCode(error.code);
    const mapping = code ? mappings[code] : undefined;
    if (mapping) {
      throw new AppError(mapping.message, mapping.statusCode);
    }
  }

  throw new AppError(fallbackMessage, 500);
};
