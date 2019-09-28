import { TemplateStaticsBuilderOptions } from '../types';
import { generatePackageJson, logger, writeJson } from '../helpers';

export function buildReactPackageJson(opts: TemplateStaticsBuilderOptions) {
  return {
    scripts: {
      start: 'tsdx watch',
      build: 'tsdx build',
      test: 'tsdx test --env=jsdom',
      lint: 'tsdx lint',
    },
    peerDependencies: {
      react: '>=16',
    },
  };
}

export async function generateReactConfig(opts: TemplateStaticsBuilderOptions) {
  const pkgJson = generatePackageJson(opts);
  try {
    await writeJson({ file: 'package.json', json: pkgJson }, opts);
    return { pkgJson };
  } catch (e) {
    logger(e);
  }
}
