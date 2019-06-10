import { resolveApp } from './utils';

export const paths = {
  appPackageJson: resolveApp('package.json'),
  testsSetup: resolveApp('test/setupTests.ts'),
  appRoot: resolveApp('.'),
  appSrc: resolveApp('src'),
  appErrorsJson: resolveApp('./codes.json'),
  appDist: resolveApp('dist'),
};
