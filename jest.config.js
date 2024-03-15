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

  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};
