import execa from 'execa';

let cmd: InstallCommand;

export type InstallCommand = 'yarn' | 'npm';

export default function getInstallCmd(): InstallCommand {
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
}
