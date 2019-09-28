import { TsdxOptions } from '../types';
import { concatAllArray } from 'jpjs';

export const getBuildOptions = (opts: any) =>
  concatAllArray(
    opts.input.map((input: string) =>
      [
        opts.format.includes('cjs') && {
          ...opts,
          format: 'cjs',
          env: 'development',
          input,
        },
        opts.format.includes('cjs') && {
          ...opts,
          format: 'cjs',
          env: 'production',
          input,
        },
        opts.format.includes('esm') && { ...opts, format: 'esm', input },
        opts.format.includes('umd') && {
          ...opts,
          format: 'umd',
          env: 'development',
          input,
        },
        opts.format.includes('umd') && {
          ...opts,
          format: 'umd',
          env: 'production',
          input,
        },
      ]
        .filter(Boolean)
        .map((options: TsdxOptions, index: number) => ({
          ...options,
          // We want to know if this is the first run for each entryfile
          // for certain plugins (e.g. css)
          writeMeta: index === 0,
        }))
    )
  );
