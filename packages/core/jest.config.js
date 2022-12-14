const path = require('path');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  silent: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/src/$1',
    '^@common/(.*)': path.join(__dirname, '..', 'common', '$1'),
  },
  testTimeout: 10 * 1000,
};
