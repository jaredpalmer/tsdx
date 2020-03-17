import { resolveApp } from './utils';

export const paths = {
  appPackageJson: resolveApp('package.json'),
  tsconfigJson: resolveApp('tsconfig.json'),
  testsSetup: resolveApp('test/setupTests.ts'),
  appRoot: resolveApp('.'),
  appSrc: resolveApp('src'),
  appErrorsJson: resolveApp('errors/codes.json'),
  appErrors: resolveApp('errors'),
  appDist: resolveApp('dist'),
  appConfig: resolveApp('tsdx.config.js'),
  jestConfig: resolveApp('jest.config.js'),
  cacheRoot: resolveApp('node_modules/.cache/tsdx'),
  progressEstimatorCache: resolveApp(
    'node_modules/.cache/tsdx/.progress-estimator'
  ),
};
