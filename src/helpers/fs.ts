import * as fs from 'fs-extra';
import path from 'path';
import util from 'util';
import mkdirp from 'mkdirp';
import { paths } from '../constants';
import { TsdxBag } from '../types';
import { safePackageName } from '.';

export const isDir = (name: string) =>
  fs
    .stat(name)
    .then(stats => stats.isDirectory())
    .catch(() => false);

export const isFile = (name: string) =>
  fs
    .stat(name)
    .then(stats => stats.isFile())
    .catch(() => false);

export async function moveTypes() {
  try {
    // Move the typescript types to the base of the ./dist folder
    await fs.copy(paths.appDist + '/src', paths.appDist, {
      overwrite: true,
    });
    await fs.remove(paths.appDist + '/src');
  } catch (e) {}
}

export async function jsOrTs(filename: string) {
  const extension = (await isFile(resolveApp(filename + '.ts')))
    ? '.ts'
    : (await isFile(resolveApp(filename + '.tsx')))
    ? '.tsx'
    : '.js';

  return resolveApp(`${filename}${extension}`);
}

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
export const appDirectory = fs.realpathSync(process.cwd());
export const resolveApp = function(relativePath: string) {
  return path.resolve(appDirectory, relativePath);
};

export function ensureDistFolder() {
  return util.promisify(mkdirp)(resolveApp('dist'));
}

export function readJson(opts: { file: string }) {
  try {
    return fs.readJSONSync(resolveApp(opts.file));
  } catch (e) {}
}

export async function writeJson(
  opts: {
    file: string;
    json: object;
  },
  bag: TsdxBag
) {
  try {
    await fs.outputJSON(path.resolve(bag.projectPath), opts.json);
  } catch (e) {
    throw new Error(e);
  }
}

export function writeCjsEntryFile(name: string) {
  const baseLine = `module.exports = require('./${safePackageName(name)}`;
  const contents = `
'use strict'

if (process.env.NODE_ENV === 'production') {
  ${baseLine}.cjs.production.min.js')
} else {
  ${baseLine}.cjs.development.js')
}
`;
  return fs.writeFile(resolveApp(`./dist/index.js`), contents);
}
