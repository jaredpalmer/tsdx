import * as fs from 'fs-extra';
import path from 'path';
import { resolveApp } from './utils';

export const paths = {
  appPackageJson: resolveApp('package.json'),
  testsSetup: resolveApp('test/setupTests.ts'),
  appRoot: resolveApp('.'),
  appSrc: resolveApp('src'),
  appDist: resolveApp('dist'),
};

export const templates = [
  ...new Set(
    fs
      .readdirSync(path.resolve(__dirname, '../templates'))
      .map(template => template.replace(/-monorepo$/, ''))
  ),
];

export const monorepos = fs
  .readdirSync(path.resolve(__dirname, '../templates'))
  .filter(template => template.endsWith('-monorepo'));

export const structures = ['basic', 'monorepo'];
