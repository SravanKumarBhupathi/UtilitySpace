module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFiles: ['jest-canvas-mock'],
  testMatch: ['**/*.test.ts'],
};
