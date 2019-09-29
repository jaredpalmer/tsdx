import asyncro from 'asyncro';
import { rollup, RollupOptions, OutputOptions } from 'rollup';
import {
  ensureDistFolder,
  writeCjsEntryFile,
  moveTypes,
  logger,
} from '../../helpers';
import * as builder from '../../builders';
import { logError, normalizeOpts } from '../utils';

export async function build(dirtyOpts: any) {
  const opts = await normalizeOpts(dirtyOpts);
  const { rollupConfig: buildConfigs } = builder.generateBuildConfig(opts);
  await ensureDistFolder();
  if (opts.format.includes('cjs')) {
    const promise = writeCjsEntryFile(opts.name).catch(logError);
    logger(promise, 'Creating entry file');
  }
  try {
    const promise = asyncro
      .map(
        buildConfigs,
        async (inputOptions: RollupOptions & { output: OutputOptions }) => {
          let bundle = await rollup(inputOptions);
          await bundle.write(inputOptions.output);
          await moveTypes();
        }
      )
      .catch((e: any) => {
        throw e;
      });
    logger(promise, 'Building modules');
    await promise;
  } catch (error) {
    logError(error);
    process.exit(1);
  }
}
