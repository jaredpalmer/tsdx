import { RollupOptions, OutputOptions } from 'rollup';
import * as fs from 'fs-extra';
import { concatAllArray } from 'jpjs';

import { paths } from './constants';
import { TsdxOptions, NormalizedOpts } from './types';

import { createRollupConfig } from './createRollupConfig';

// check for custom tsdx.config.js
let tsdxConfig = {
  rollup(config: RollupOptions, _options: TsdxOptions): RollupOptions {
    return config;
  },
};

if (fs.existsSync(paths.appConfig)) {
  tsdxConfig = require(paths.appConfig);
}

export async function createBuildConfigs(
  opts: NormalizedOpts
): Promise<Array<RollupOptions & { output: OutputOptions }>> {
  const allInputs = concatAllArray(
    opts.input.map((input: string, index: number) =>
      createAllFormats(opts, input, index).map(
        (options: TsdxOptions, index: number) => ({
          ...options,
          // We want to know if this is the first run for each entryfile
          // for certain plugins (e.g. css)
          writeMeta: index === 0,
        })
      )
    )
  );

  return await Promise.all(
    allInputs.map(async (options: TsdxOptions, index: number) => {
      // pass the full rollup config to tsdx.config.js override
      const config = await createRollupConfig(options, index);
      return tsdxConfig.rollup(config, options);
    })
  );
}

function createAllFormats(
  opts: NormalizedOpts,
  input: string,
  index: number
): [TsdxOptions, ...TsdxOptions[]] {
  const sharedOpts = {
    ...opts,
    input,
    name: opts.name[index],
    output: {
      file: opts.output.file[index],
    },
  };

  return [
    opts.format.includes('cjs') && {
      ...sharedOpts,
      format: 'cjs',
      env: 'development',
    },
    opts.format.includes('cjs') && {
      ...sharedOpts,
      format: 'cjs',
      env: 'production',
    },
    opts.format.includes('esm') && { ...sharedOpts, format: 'esm' },
    opts.format.includes('umd') && {
      ...sharedOpts,
      format: 'umd',
      env: 'development',
    },
    opts.format.includes('umd') && {
      ...sharedOpts,
      format: 'umd',
      env: 'production',
    },
    opts.format.includes('system') && {
      ...sharedOpts,
      format: 'system',
      env: 'development',
    },
    opts.format.includes('system') && {
      ...sharedOpts,
      format: 'system',
      env: 'production',
    },
  ].filter(Boolean) as [TsdxOptions, ...TsdxOptions[]];
}
