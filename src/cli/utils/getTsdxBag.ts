import { getSpinner, getProjectPath, getTemplate, getDeps } from '../utils';
import { safePackageName, logger } from '../../helpers';
import { paths, defaultVersion as version } from '../../constants';
import * as Messages from '../messages';

export async function getTsdxBag(args: { pkg: string; opts: any }) {
  const { pkg, opts: tsdxOpts } = args;
  const bootSpinner = getSpinner('boot', pkg);
  const template = await getTemplate(tsdxOpts, bootSpinner);
  const deps = getDeps(template);
  const installSpinner = getSpinner('install', Messages.installing(deps));
  const safeName = safePackageName(pkg);
  const projectPath = await getProjectPath({ pkg, bootSpinner });

  return {
    safeName,
    template,
    logger,
    bootSpinner,
    installSpinner,
    version,
    projectPath,
    paths,
    pkg,
    deps,
    tsdxOpts,
  };
}
