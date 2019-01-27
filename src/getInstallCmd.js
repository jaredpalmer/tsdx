'use strict';

const execa = require('execa');

let cmd;

module.exports = function getInstallCmd() {
  if (cmd) {
    return cmd;
  }

  try {
    execa.sync('yarnpkg', ['--version']);
    cmd = 'yarn';
  } catch (e) {
    cmd = 'npm';
  }

  return cmd;
};
