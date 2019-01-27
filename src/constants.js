const fs = require('fs-extra');
const path = require('path');
const { resolveApp } = require('./utils');

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

exports.paths = paths;
