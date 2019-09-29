import { getInputs, getAppPackageJson } from '../../helpers';

const appPackageJson = getAppPackageJson();

export async function normalizeOpts(opts: any) {
  return {
    ...opts,
    name: opts.name || appPackageJson.name,
    input: await getInputs(opts.entry, appPackageJson.source),
    format: opts.format.split(',').map((format: string) => {
      if (format === 'es') {
        return 'esm';
      }
      return format;
    }),
  };
}
