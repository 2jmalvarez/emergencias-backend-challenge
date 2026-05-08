const reset = '\x1b[0m';

const paint = (code: string, text: string): string => `${code}${text}${reset}`;

export const ansi = {
  bold: (text: string): string => paint('\x1b[1m', text),
  dim: (text: string): string => paint('\x1b[2m', text),
  red: (text: string): string => paint('\x1b[31m', text),
  green: (text: string): string => paint('\x1b[32m', text),
  yellow: (text: string): string => paint('\x1b[33m', text),
  blue: (text: string): string => paint('\x1b[34m', text),
  magenta: (text: string): string => paint('\x1b[35m', text),
  cyan: (text: string): string => paint('\x1b[36m', text),
  gray: (text: string): string => paint('\x1b[90m', text),
};
