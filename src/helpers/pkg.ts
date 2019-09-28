import path from 'path';
import { concatAllArray } from 'jpjs';
import glob from 'tiny-glob/sync';
import { TemplateStaticsBuilderOptions } from '../types';
import {
  isDir,
  resolveApp,
  jsOrTs,
  getCommonPackageJsonConfig,
  getTemplatePackageJson,
} from '.';

export const pkg = require(path.resolve(__dirname, 'package.json'));

export async function getInputs(entries: string[], source?: string) {
  let inputs: any[] = [];
  let stub: any[] = [];
  stub
    .concat(
      entries && entries.length
        ? entries
        : (source && resolveApp(source)) ||
            ((await isDir(resolveApp('src'))) && (await jsOrTs('src/index')))
    )
    .map(file => glob(file))
    .forEach(input => inputs.push(input));

  return concatAllArray(inputs);
}

export function generatePackageJson(opts: TemplateStaticsBuilderOptions) {
  const common = getCommonPackageJsonConfig(opts);
  const specific = getTemplatePackageJson(opts);
  return Object.assign({}, common, specific);
}
