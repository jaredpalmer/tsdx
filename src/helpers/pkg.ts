import path from 'path';
import { concatAllArray } from 'jpjs';
import glob from 'tiny-glob/sync';
import { TsdxBag } from '../types';
import {
  isDir,
  resolveApp,
  jsOrTs,
  getCommonPackageJsonConfig,
  getTemplatePackageJson,
} from '.';

const pkg = require(path.resolve('package.json'));

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

export function generatePackageJson(opts: TsdxBag) {
  const common = getCommonPackageJsonConfig(opts);
  const specific = getTemplatePackageJson(opts);
  return Object.assign({}, common, specific);
}

export { pkg };
