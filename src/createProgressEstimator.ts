import { paths } from './constants';
import util from 'util';
import mkdirp from 'mkdirp';
const progressEstimator = require('progress-estimator');

export async function createProgressEstimator() {
  await util.promisify(mkdirp)(paths.progressEstimatorCache);
  return progressEstimator({
    // All configuration keys are optional, but it's recommended to specify a storage location.
    // Learn more about configuration options below.
    storagePath: paths.progressEstimatorCache,
  });
}
