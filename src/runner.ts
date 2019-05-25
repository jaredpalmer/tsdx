import spawn from 'cross-spawn';
import killer from './killer';

function runCommand(command: string) {
  if (command) {
    const [exec, ...args] = command.split(' ');

    return spawn(exec, args, {
      stdio: 'inherit',
    });
  }
}

function run(command: string) {
  const process = runCommand(command);
  const exitPromise = new Promise(
    resolve => process && process.on('exit', resolve)
  );

  return function kill() {
    return Promise.all([killer(process), exitPromise]);
  };
}

export default run;
