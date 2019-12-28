

const shell = require('shelljs');
const path = require('path');
const rootDir = process.cwd();

shell.config.silent = true;

module.exports = {
  setupStageWithFixture: (stageName, fixtureName) => {
    const stagePath = path.join(rootDir, stageName);
    shell.chmod(755, rootDir);
    shell.ls(rootDir);
    shell.ls(stagePath);
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
    shell.cd(rootDir);
    shell.rm('-rf', path.join(rootDir, stageName));
  },

  rootDir,
};
