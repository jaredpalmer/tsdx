import fs from 'fs-extra';

import { paths } from './constants';
import { PackageJson } from './types';

export let appPackageJson: PackageJson;
function setAppPackageJson() {
  try {
    appPackageJson = fs.readJSONSync(paths.appPackageJson);
  } catch (e) {}
}
setAppPackageJson();
