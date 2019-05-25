import spawn from 'cross-spawn';
import psTree from 'ps-tree';
import { exec } from 'child_process';

let KILL_SIGNAL = 'SIGUSR2';
let hasPS = true;

const isWindows = process.platform === 'win32';

// discover if the OS has `ps`, and therefore can use psTree
exec('ps', function(error: any) {
  if (error) {
    hasPS = false;
  }
});

export default function kill(child: any) {
  return new Promise(resolve => {
    if (isWindows) {
      exec('taskkill /pid ' + child.pid + ' /T /F', () => resolve());
    } else {
      if (hasPS) {
        psTree(child.pid, function(err: any, kids: any) {
          spawn(
            'kill',
            ['-s', KILL_SIGNAL, child.pid].concat(
              kids.map(function(p: any) {
                return p.PID;
              })
            )
          ).on('close', () => resolve());
        });
      } else {
        exec('kill -s ' + KILL_SIGNAL + ' ' + child.pid, () => resolve());
      }
    }
  });
}
