import { appPackageJson } from './constants';

export function createJestConfig(resolve, rootDir) {
  return {
    transform: {
      '.(ts|tsx)': resolve('../ts-jest'),
    },
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    testMatch: ['<rootDir>/test/**/?(*.)(spec|test).{ts,tsx}'],
    rootDir,
  };
}
