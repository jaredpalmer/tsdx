import execa from 'execa';

let cmd: InstallCmd;

export type InstallCmd = 'yarn' | 'npm';

export default function getInstallCmd(): InstallCmd {
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
