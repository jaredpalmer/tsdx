// this file contains helper utils for working with shell.js functions
const shell = require('shelljs');

shell.config.silent = true;

// simple shell.exec "cache" that doesn't re-run the same command twice in a row
let prevCommand = '';
let prevCommandOutput = {};
function execWithCache(command, { noCache = false } = {}) {
  // return the old output
  if (!noCache && prevCommand === command) return prevCommandOutput;

  const output = shell.exec(command);

  // reset if command is not to be cached
  if (noCache) {
    prevCommand = '';
    prevCommandOutput = {};
  } else {
    prevCommand = command;
    prevCommandOutput = output;
  }

  return output;
}

module.exports = {
  execWithCache,
};
