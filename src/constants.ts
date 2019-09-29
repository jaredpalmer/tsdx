import * as fs from 'fs-extra';
import path from 'path';

const appDirectory = fs.realpathSync(process.cwd());

const resolveApp = function(relativePath: string) {
  return path.resolve(appDirectory, relativePath);
};

export const paths = {
  appPackageJson: resolveApp('package.json'),
  testsSetup: resolveApp('test/setupTests.ts'),
  appRoot: resolveApp('.'),
  appSrc: resolveApp('src'),
  appErrorsJson: resolveApp('errors/codes.json'),
  appErrors: resolveApp('errors'),
  appDist: resolveApp('dist'),
  appConfig: resolveApp('tsdx.config.js'),
};

export const commonDeps = [
  '@types/jest',
  'husky',
  'tsdx',
  'tslib',
  'typescript',
].sort();

export const defaultVersion = `0.1.0`;
