import path from 'path';
import jest from 'jest';

import { paths } from '../constants';
import { appPackageJson } from '../files';

import { createJestConfig } from './createJestConfig';

export function addTestCommand(prog: any) {
  prog
    .command('test')
    .describe(
      'Run jest test runner in watch mode. Passes through all flags directly to Jest'
    )
    .action(testAction);
}

async function testAction() {
  // Do this as the first thing so that any code reading it knows the right env.
  process.env.BABEL_ENV = 'test';
  process.env.NODE_ENV = 'test';
  // Makes the script crash on unhandled rejections instead of silently
  // ignoring them. In the future, promise rejections that are not handled will
  // terminate the Node.js process with a non-zero exit code.
  process.on('unhandledRejection', err => {
    throw err;
  });

  const argv = process.argv.slice(2);
  let jestConfig = {
    ...createJestConfig(
      relativePath => path.resolve(__dirname, '..', relativePath),
      paths.appRoot
    ),
    ...appPackageJson.jest,
  };
  try {
    // Allow overriding with jest.config
    const jestConfigContents = require(paths.jestConfig);
    jestConfig = { ...jestConfig, ...jestConfigContents };
  } catch {}

  argv.push(
    '--config',
    JSON.stringify({
      ...jestConfig,
    })
  );

  if (!process.env.CI) {
    argv.push('--watch'); // run jest in watch mode unless in CI
  }

  const [, ...argsToPassToJestCli] = argv;
  jest.run(argsToPassToJestCli);
}
