import { InstallCmd } from './getInstallCmd';

export default function getInstallArgs(cmd: InstallCmd, packages: string[]) {
  switch (cmd) {
    case 'npm':
      return ['install', ...packages, '--save-dev'];
    case 'yarn':
      return ['add', ...packages, '--dev'];
  }
}
