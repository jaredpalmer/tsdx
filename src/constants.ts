import path from 'path';
import { resolveApp } from './utils';

const cache = resolveApp('node_modules/.cache');

export const paths = {
  appPackageJson: resolveApp('package.json'),
  testsSetup: resolveApp('test/setupTests.ts'),
  appRoot: resolveApp('.'),
  cache,
  appSrc: resolveApp('src'),
  appErrorsJson: resolveApp('errors/codes.json'),
  appErrors: resolveApp('errors'),
  appDist: resolveApp('dist'),
  appConfig: resolveApp('tsdx.config.js'),
  jestConfig: resolveApp('jest.config.js'),
  storagePath: path.join(cache, '.progress-estimator'),
};
