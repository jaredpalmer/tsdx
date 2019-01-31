import fs from 'fs-extra';
import path from 'path';
import { resolveApp } from './utils';

let paths = {};

try {
  paths = {
    appPackageJson: resolveApp('package.json'),
    testsSetup: resolveApp('test/setupTests.ts'),
    appRoot: resolveApp('.'),
    appSrc: resolveApp('src'),
    appDist: resolveApp('dist'),
  };
} catch (e) {}

export { paths };
