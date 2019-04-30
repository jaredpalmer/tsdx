export default function getInstallArgs(cmd, packages) {
  if (cmd === 'npm') {
    return ['install', ...packages, '--save-dev'];
  } else if (cmd === 'yarn') {
    return ['add', ...packages, '--dev'];
  }
}
