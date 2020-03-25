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

// shelljs.grep wrapper
// @param {RegExp} pattern
// @param {string} fileName
// @returns {boolean} true if pattern has matches in file
function grep(pattern, fileName) {
  const output = shell.grep(pattern, fileName);
  // output.code is always 0 regardless of matched/unmatched patterns
  // so need to test output.stdout
  // https://github.com/jaredpalmer/tsdx/pull/525#discussion_r395571779
  return Boolean(output.stdout.match(pattern));
}

module.exports = {
  execWithCache,
  grep,
};
