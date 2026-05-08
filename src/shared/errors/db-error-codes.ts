// Codigos SQLSTATE de PostgreSQL:
// Referencia oficial: https://www.postgresql.org/docs/current/errcodes-appendix.html
export const PG_ERROR_CODES = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  CHECK_VIOLATION: '23514',
  INVALID_TEXT_REPRESENTATION: '22P02',
} as const;
