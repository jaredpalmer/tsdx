import { Config } from '@jest/types';
import path from 'path';
import createRequire from 'create-require';

export type JestConfigOptions = Partial<Config.InitialOptions>;

export function createJestConfig(
  _: (relativePath: string) => void,
  rootDir: string
): JestConfigOptions {
  function resolveRelativeTo(file: string, moduleSpecifier: string) {
    const req = createRequire(file);
    try {
      return req.resolve(moduleSpecifier);
    } catch {
      return null;
    }
  }
  function resolveBabelJest() {
    const jestLocation =
      resolveRelativeTo(path.join(rootDir, 'file.js'), 'jest') ||
      require.resolve('jest');
    const jestCoreLocation = resolveRelativeTo(jestLocation, '@jest/core')!;
    const jestConfigLocation = resolveRelativeTo(
      jestCoreLocation,
      'jest-config'
    )!;
    return (
      resolveRelativeTo(path.join(rootDir, 'file.js'), 'babel-jest') ||
      resolveRelativeTo(jestConfigLocation, 'babel-jest')!
    );
  }
  const config: JestConfigOptions = {
    transform: {
      '.(ts|tsx)$': require.resolve('ts-jest/dist'),
      '.(js|jsx)$': resolveBabelJest(), // jest's default
    },
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}'],
    testMatch: ['<rootDir>/**/*.(spec|test).{ts,tsx,js,jsx}'],
    testURL: 'http://localhost',
    rootDir,
    watchPlugins: [
      require.resolve('jest-watch-typeahead/filename'),
      require.resolve('jest-watch-typeahead/testname'),
    ],
  };

  return config;
}
