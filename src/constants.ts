import { resolveApp } from './utils';

let paths = {
  appPackageJson: '',
  testsSetup: '',
  appRoot: '',
  appSrc: '',
  appDist: '',
};

try {
  paths = {
    appPackageJson: resolveApp('package.json'),
    testsSetup: resolveApp('test/setupTests.ts'),
    appRoot: resolveApp('.'),
    appSrc: resolveApp('src'),
    appDist: resolveApp('dist'),
  };
} catch (_error) {}

export { paths };
