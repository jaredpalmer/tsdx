"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveTypes = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs-extra"));
const constants_1 = require("./constants");
/*
  This was originally needed because the default
  tsconfig.compilerOptions.rootDir was set to './' instead of './src'.
  Now that it's set to './src', this is now deprecated.
  To ensure a stable upgrade path for users, leave the warning in for
  6 months - 1 year, then change it to an error in a breaking bump and leave
  that in for some time too.
*/
async function moveTypes() {
    const appDistSrc = constants_1.paths.appDist + '/src';
    const pathExists = await fs.pathExists(appDistSrc);
    if (!pathExists)
        return;
    // see note above about deprecation window
    console.warn('[tsdx]: Your rootDir is currently set to "./". Please change your ' +
        'rootDir to "./src".\n' +
        'TSDX has deprecated setting tsconfig.compilerOptions.rootDir to ' +
        '"./" as it caused buggy output for declarationMaps and more.\n' +
        'You may also need to change your include to remove "test", which also ' +
        'caused declarations to be unnecessarily created for test files.');
    // Move the type declarations to the base of the ./dist folder
    await fs.copy(appDistSrc, constants_1.paths.appDist, {
        overwrite: true,
    });
    await fs.remove(appDistSrc);
}
exports.moveTypes = moveTypes;
