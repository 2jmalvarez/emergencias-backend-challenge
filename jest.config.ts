import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  clearMocks: true,
  verbose: true,
  silent: false,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};

export default config;
