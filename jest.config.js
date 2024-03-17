/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-unresolved
const { pathsToModuleNameMapper } = require('ts-jest');

const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  detectOpenHandles: true,
  detectLeaks: true,
  watch: false,
  // debug: true, // Habilita o modo de depuração do Jest

  bail: true,

  clearMocks: true,

  coverageProvider: 'v8',
  preset: 'ts-jest',

  setupFilesAfterEnv: ['<rootDir>/setupTest.ts'],

  testEnvironment: 'node',

  testMatch: ['<rootDir>/src/**/*.spec.ts'],

  verbose: true,

  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),

  // moduleNameMapper: {
  //   '^src/(.*)$': '<rootDir>/src/$1',
  // },
};
