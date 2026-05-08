import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const sqlCache = new Map<string, string>();

export const loadSql = (baseDir: string, fileName: string): string => {
  const distCandidatePath = join(baseDir, 'sql', fileName);
  const srcFallbackPath = distCandidatePath.replace('\\dist\\', '\\src\\');
  const fullPath = existsSync(distCandidatePath) ? distCandidatePath : srcFallbackPath;

  const cached = sqlCache.get(fullPath);
  if (cached) {
    return cached;
  }

  const content = readFileSync(fullPath, 'utf-8');
  sqlCache.set(fullPath, content);
  return content;
};

export const createSqlLoader = (baseDir: string) => {
  return (fileName: string): string => loadSql(baseDir, fileName);
};
