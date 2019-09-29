import { TsdxBag } from '../types';
import { paths } from '../constants';
import * as fs from 'fs-extra';

export function getTsdxConfig(opts: TsdxBag) {
  let tsdxConfig = {
    rollup(config: any, _options: any) {
      return config;
    },
  };
  if (fs.existsSync(paths.appConfig)) {
    tsdxConfig = require(paths.appConfig);
  }
  return tsdxConfig;
}
