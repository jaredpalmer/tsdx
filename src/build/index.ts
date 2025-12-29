/**
 * TSDX Build System
 *
 * Modern TypeScript bundling powered by Rolldown
 */

export { build, watch, getBuildInfo, createBuildContext } from './build.js';
export type {
  BuildOptions,
  BuildContext,
  EntryPoint,
  TsdxConfig,
  ModuleFormat,
  PackageJson,
} from './types.js';
