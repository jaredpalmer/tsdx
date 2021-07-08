"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProgressEstimator = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const constants_1 = require("./constants");
const progressEstimator = require('progress-estimator');
async function createProgressEstimator() {
    await fs_extra_1.default.ensureDir(constants_1.paths.progressEstimatorCache);
    return progressEstimator({
        // All configuration keys are optional, but it's recommended to specify a storage location.
        storagePath: constants_1.paths.progressEstimatorCache,
    });
}
exports.createProgressEstimator = createProgressEstimator;
