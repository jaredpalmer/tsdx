import { TsdxBag } from '../types';
import { generatePackageJson, logger, writeJson } from '../helpers';

export function buildBasicPackageJson(opts: TsdxBag) {
  return {
    scripts: {
      start: 'tsdx watch',
      build: 'tsdx build',
      test: 'tsdx test',
      lint: 'tsdx lint',
    },
    peerDependencies: {},
  };
}

export async function generateBasicConfig(opts: TsdxBag) {
  const pkgJson = generatePackageJson(opts);
  try {
    await writeJson({ file: 'package.json', json: pkgJson }, opts);
    return { pkgJson };
  } catch (e) {
    logger(e);
  }
}

export const basicDeps = [];
