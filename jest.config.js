/** @type {import('jest').Config} */
module.exports = {
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    testEnvironment: 'node',
    testMatch: [
      '**/__tests__/**/*.+(ts|tsx|js)', 
      '**/?(*.)+(spec|test).+(ts|tsx|js)'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };
  