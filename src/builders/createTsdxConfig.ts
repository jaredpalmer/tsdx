import { TemplateStaticsBuilderOptions } from '../types';
import * as fs from 'fs-extra';

export function getTsdxConfig(opts: TemplateStaticsBuilderOptions) {
  let tsdxConfig = {
    rollup(config: any, _options: any) {
      return config;
    },
  };
  if (fs.existsSync(opts.paths.appConfig)) {
    tsdxConfig = require(opts.paths.appConfig);
  }
  return tsdxConfig;
}
