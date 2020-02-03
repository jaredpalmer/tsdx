const psTree = require('ps-tree');

// Loops through processes and kills them
module.exports = (pid, signal = 'SIGKILL', callback) => {
  psTree(pid, (err, children) => {
    let arr = [pid].concat(children.map(p => p.PID));
    arr = arr.filter((item, poss) => arr.indexOf(item) === poss);
    arr.forEach(tpid => {
      try {
        process.kill(tpid, signal);
      } catch (ex) {
        const logger = console;
        logger.log('Could not kill process', tpid, ex);
      }
    });
    if (callback) {
      callback();
    }
  });
};
