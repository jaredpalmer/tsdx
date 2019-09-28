import path from 'path';
const createLogger = require('progress-estimator');

export const logger = createLogger({
  storagePath: path.join(__dirname, '.progress-estimator'),
});
