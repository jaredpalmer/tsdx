import util from 'util';
import mkdirp from 'mkdirp';

import { paths } from '../constants';

const progressEstimator = require('progress-estimator');

export async function createProgressEstimator() {
  await util.promisify(mkdirp)(paths.progressEstimatorCache);
  return progressEstimator({
    // All configuration keys are optional, but it's recommended to specify a storage location.
    storagePath: paths.progressEstimatorCache,
  });
}
