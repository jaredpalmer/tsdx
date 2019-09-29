'use strict';

const shell = require('shelljs');
const path = require('path');
const rootDir = process.cwd();

shell.config.silent = true;

module.exports = {
  setupStageWithFixture: (stageName, fixtureName) => {
    const stagePath = path.join(rootDir, stageName);
    shell.mkdir(stagePath);
    shell.exec(`cp -a ${rootDir}/test/fixtures/${fixtureName}/. ${stagePath}/`);
    shell.ln(
      '-s',
      path.join(rootDir, 'node_modules'),
      path.join(stagePath, 'node_modules')
    );
    shell.cd(stagePath);
  },

  teardownStage: stageName => {
    const stagePath = path.join(rootDir, stageName);
    shell.cd(rootDir);
    if (shell.test('-d', `${rootDir}/.result/${stageName}`)) {
      shell.rm('-rf', `${rootDir}/.result/${stageName}`);
    }
    shell.exec(`mkdir -p ${rootDir}/.result/${stageName}`);
    shell.exec(`cp -R ${stagePath} ${rootDir}/.result/`);
    shell.rm('-rf', stagePath);
  },
};
