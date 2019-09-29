import path from 'path';
import jest from 'jest';
import * as builder from '../../builders';
import { paths } from '../../constants';
import { getAppPackageJson } from '../../helpers';
const appPackageJson = getAppPackageJson();

export async function test() {
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

  argv.push(
    '--config',
    JSON.stringify({
      ...builder.createJestConfig(
        relativePath => path.resolve(__dirname, '..', relativePath),
        paths.appRoot
      ),
      ...appPackageJson.jest,
    })
  );

  const [, ...argsToPassToJestCli] = argv;
  jest.run(argsToPassToJestCli);
}
