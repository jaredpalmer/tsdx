import { generatePackageJson, logger, writeJson } from '../helpers';
import { TsdxBag } from '../types';

export function generateManifestJson(opts: TsdxBag) {
  return {
    name: opts.safeName,
    version: opts.version,
    description: 'Sweet Browser Extension taht I Build with TsDx',
    manifestVersion: 2,
    icons: {
      '16': 'icons/favicon-16x16.png',
      '32': 'icons/favicon-32x32.png',
      '96': 'icons/favicon-96x96.png',
    },
    permissions: ['activeTab'],
  };
}

export function buildChromePackageJson(opts: TsdxBag) {
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

export async function generateChromeExtensionConfig(opts: TsdxBag) {
  const pkgJson = generatePackageJson(opts);
  const manifestJson = generateManifestJson(opts);

  try {
    await writeJson({ file: 'package.json', json: pkgJson }, opts);
    await writeJson({ file: 'manifest.json', json: manifestJson }, opts);
    return { pkgJson, manifestJson };
  } catch (e) {
    logger(e);
  }
}

export const chromeDeps = [
  '@types/react',
  '@types/react-dom',
  'react',
  'react-dom',
  '@types/chrome',
];
