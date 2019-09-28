import { TemplateStaticsBuilderOptions } from '../types';
import { generatePackageJson, logger, writeJson } from '../helpers';

export function buildBasicPackageJson(opts: TemplateStaticsBuilderOptions) {
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

export async function generateBasicConfig(opts: TemplateStaticsBuilderOptions) {
  const pkgJson = generatePackageJson(opts);
  try {
    await writeJson({ file: 'package.json', json: pkgJson }, opts);
    return { pkgJson };
  } catch (e) {
    logger(e);
  }
}
