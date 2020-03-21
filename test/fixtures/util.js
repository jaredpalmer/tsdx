const shell = require('shelljs');
const path = require('path');
const rootDir = process.cwd();

shell.config.silent = true;

// shelljs.grep wrapper
// @param {string|RegExp} pattern
// @param {string} fileName
// @returns {boolean} true if pattern has matches in file
function grep(pattern, fileName) {
  const output = shell.grep(pattern, fileName);
  // output.code is always 0 regardless of matched/unmatched patterns
  // so need to test output.stdout
  return Boolean(output.stdout.match(pattern));
}

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
    shell.cd(rootDir);
    shell.rm('-rf', path.join(rootDir, stageName));
  },

  grep,
  rootDir,
};
