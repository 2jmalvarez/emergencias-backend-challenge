import morgan from 'morgan';

import type { Request } from 'express';

import { ansi } from './ansi';

export const toSafeJson = (value: unknown): string => {
  if (value === null || value === undefined) {
    return ansi.gray('-');
  }

  if (typeof value !== 'object') {
    return String(value);
  }

  if (Array.isArray(value) && value.length === 0) {
    return ansi.gray('[]');
  }

  if (!Array.isArray(value) && Object.keys(value as Record<string, unknown>).length === 0) {
    return ansi.gray('{}');
  }

  return JSON.stringify(value, null, 2);
};

export const methodColor = (method: string): string => {
  switch (method) {
    case 'GET':
      return ansi.cyan(method);
    case 'POST':
      return ansi.green(method);
    case 'PATCH':
    case 'PUT':
      return ansi.yellow(method);
    case 'DELETE':
      return ansi.red(method);
    default:
      return ansi.magenta(method);
  }
};

export const statusColor = (status: number): string => {
  if (status >= 500) {
    return ansi.red(String(status));
  }
  if (status >= 400) {
    return ansi.yellow(String(status));
  }
  if (status >= 300) {
    return ansi.magenta(String(status));
  }
  return ansi.green(String(status));
};

morgan.token('metodo-color', (req) => methodColor(req.method ?? 'UNKNOWN'));
morgan.token('estado-color', (_req, res) => statusColor(res.statusCode));
morgan.token('query', (req) => toSafeJson((req as Request).query));
morgan.token('params', (req) => toSafeJson((req as Request).params));
morgan.token('body', (req) => toSafeJson((req as Request).body));

const formatLine = [
  '',
  `${ansi.bold('┌─ Peticion HTTP')}  ${ansi.gray(':date[iso]')}`,
  `│ ${ansi.bold('Metodo')}   : :metodo-color`,
  `│ ${ansi.bold('Endpoint')} : ${ansi.blue(':url')}`,
  `│ ${ansi.bold('Estado')}   : :estado-color`,
  `│ ${ansi.bold('Duracion')} : ${ansi.yellow(':response-time ms')}`,
  `│ ${ansi.bold('Tamano')}   : ${ansi.gray(':res[content-length] bytes')}`,
  `│ ${ansi.bold('IP')}       : ${ansi.gray(':remote-addr')}`,
  `│ ${ansi.bold('Query')}    : :query`,
  `│ ${ansi.bold('Params')}   : :params`,
  `│ ${ansi.bold('Body')}     : :body`,
  `└────────────────────────────────────────────────────────────────────`,
].join('\n');

export const httpLogger = morgan(formatLine, {
  skip: () => process.env.NODE_ENV === 'test',
});
