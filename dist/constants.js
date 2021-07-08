"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paths = void 0;
const utils_1 = require("./utils");
exports.paths = {
    appPackageJson: utils_1.resolveApp('package.json'),
    tsconfigJson: utils_1.resolveApp('tsconfig.json'),
    testsSetup: utils_1.resolveApp('test/setupTests.ts'),
    appRoot: utils_1.resolveApp('.'),
    appSrc: utils_1.resolveApp('src'),
    appErrorsJson: utils_1.resolveApp('errors/codes.json'),
    appErrors: utils_1.resolveApp('errors'),
    appDist: utils_1.resolveApp('dist'),
    appConfig: utils_1.resolveApp('tsdx.config.js'),
    jestConfig: utils_1.resolveApp('jest.config.js'),
    progressEstimatorCache: utils_1.resolveApp('node_modules/.cache/.progress-estimator'),
};
