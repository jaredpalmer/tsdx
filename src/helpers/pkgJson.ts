import { TsdxBag } from '../types';
import {
  buildChromePackageJson,
  buildReactPackageJson,
  buildBasicPackageJson,
} from '../generators';

import { readJson } from '../helpers';

const pkgJsonStrategy = {
  chrome: buildChromePackageJson,
  basic: buildBasicPackageJson,
  react: buildReactPackageJson,
};

export function getTemplatePackageJson(opts: TsdxBag) {
  return pkgJsonStrategy[opts.template](opts);
}

export function getCommonPackageJsonConfig(opts: TsdxBag) {
  return {
    name: opts.safeName,
    version: opts.version,
    main: 'dist/index.js',
    module: `dist/${opts.safeName}.esm.js`,
    typings: 'dist/index.d.ts',
    files: ['dist'],
    husky: {
      hooks: {
        'pre-commit': 'tsdx lint',
      },
    },
    prettier: {
      printWidth: 80,
      semi: true,
      singleQuote: true,
      trailingComma: 'es5',
    },
  };
}

export function getAppPackageJson() {
  let appPackageJson: {
    name: string;
    source?: string;
    jest?: any;
    eslint?: any;
  };
  try {
    appPackageJson = readJson({ file: 'package.json' });
  } catch (e) {
    appPackageJson = { name: e };
  }
  return appPackageJson;
}
