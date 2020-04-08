import * as fs from 'fs-extra';

import { paths } from './constants';

/*
  This was originally needed because the default
  tsconfig.compilerOptions.rootDir was set to './' instead of './src'.
  Now that it's set to './src', this is now deprecated.
  To ensure a stable upgrade path for users, leave the warning in for
  6 months - 1 year, then change it to an error in a breaking bump and leave
  that in for some time too.
*/
export async function moveTypes() {
  const appDistSrc = paths.appDist + '/src';

  const pathExists = await fs.pathExists(appDistSrc);
  if (!pathExists) return;

  // see note above about deprecation window
  console.warn(
    '[tsdx]: Your rootDir is currently set to "./". Please change your ' +
      'rootDir to "./src".\n' +
      'TSDX has deprecated setting tsconfig.compilerOptions.rootDir to ' +
      '"./" as it caused buggy output for declarationMaps and occassionally ' +
      'for type declarations themselves.\n' +
      'You may also need to change your include to remove "test", which also ' +
      'caused declarations to be unnecessarily created for test files.'
  );

  try {
    // Move the typescript types to the base of the ./dist folder
    await fs.copy(appDistSrc, paths.appDist, {
      overwrite: true,
    });
  } catch (err) {
    // ignore errors about the destination dir already existing or files not
    // existing as those always occur for some reason, re-throw any other
    // unexpected failures
    // NOTE: these errors mean that sometimes files don't get moved properly,
    // meaning that it's buggy / unreliable (see console.warn above)
    if (err.code !== 'EEXIST' && err.code !== 'ENOENT') {
      throw err;
    }
  }

  await fs.remove(appDistSrc);
}
