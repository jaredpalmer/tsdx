// this file contains helper utils for working with shell.js functions
import * as shell from 'shelljs';

shell.config.silent = true;

// simple shell.exec "cache" that doesn't re-run the same command twice in a row
let prevCommand = '';
let prevCommandOutput = {} as shell.ShellReturnValue;
export function execWithCache(
  command: string,
  { noCache = false } = {}
): shell.ShellReturnValue {
  // return the old output
  if (!noCache && prevCommand === command) return prevCommandOutput;

  const output = shell.exec(command);

  // reset if command is not to be cached
  if (noCache) {
    prevCommand = '';
    prevCommandOutput = {} as shell.ShellReturnValue;
  } else {
    prevCommand = command;
    prevCommandOutput = output;
  }

  return output;
}

// shell.js grep wrapper returns true if pattern has matches in file
export function grep(pattern: RegExp, fileName: string[]): boolean {
  const output = shell.grep(pattern, fileName);
  // output.code is always 0 regardless of matched/unmatched patterns
  // so need to test output.stdout
  // https://github.com/jaredpalmer/tsdx/pull/525#discussion_r395571779
  return Boolean(output.stdout.match(pattern));
}
