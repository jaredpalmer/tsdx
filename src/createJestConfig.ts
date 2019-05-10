import fs from 'fs';
import path from 'path';

export function createJestConfig(
  _: (relativePath: string) => void,
  rootDir: string
) {
  const config = {
    transform: {
      '.(ts|tsx)': require.resolve('ts-jest/dist'),
    },
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    testMatch: ['<rootDir>/test/**/*.(spec|test).{ts,tsx}'],
    testURL: 'http://localhost',
    rootDir,
    watchPlugins: [
      require.resolve('jest-watch-typeahead/filename'),
      require.resolve('jest-watch-typeahead/testname'),
    ],
  };

  return config;
}
