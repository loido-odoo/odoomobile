import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/client/src/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1'
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'server/**/*.{ts,tsx}',
    'shared/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/dist/**'
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75
    }
  }
};

export default config;
