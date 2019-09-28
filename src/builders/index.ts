import { createRollupConfig } from './createRollupConfig';
import { getBuildOptions } from './createBuildOptions';
import { getTsdxConfig } from './createTsdxConfig';
import { TsdxOptions, RollupOptions, OutputOptions } from '../types';

export function generateBuildConfig(opts: any) {
  const buildOptions = getBuildOptions(opts);
  const tsdxConfig = getTsdxConfig(opts);
  const rollupConfig: Array<
    RollupOptions & { output: OutputOptions }
  > = buildOptions.map((options: TsdxOptions) =>
    // pass the full rollup config to tsdx.config.js override
    tsdxConfig.rollup(createRollupConfig(options), options)
  );

  return { buildOptions, tsdxConfig, rollupConfig };
}

export { createRollupConfig, getBuildOptions, getTsdxConfig };
export * from './createEslintConfig';
export * from './createJestConfig';
