'use strict';

const chalk = require('chalk');
const getInstallCmd = require('./getInstallCmd');
const output = require('./output');

const program = {
  name: 'tsdx',
};

exports.help = function() {
  return `
    Only ${chalk.green('<project-directory>')} is required.
    If you have any problems, do not hesitate to file an issue:
      ${chalk.cyan('https://github.com/jaredpalmer/tsdx/issues/new')}
  `;
};

exports.missingProjectName = function() {
  return `
Please specify the project directory:
  ${chalk.cyan(program.name)} ${chalk.green('<project-directory>')}
For example:
  ${chalk.cyan(program.name)} ${chalk.green('my-tsdx-lib')}
Run ${chalk.cyan(`${program.name} --help`)} to see all options.
`;
};

exports.alreadyExists = function(projectName) {
  return `
Uh oh! Looks like there's already a directory called ${chalk.red(
    projectName
  )}. Please try a different name or delete that folder.`;
};

exports.installing = function(packages) {
  const pkgText = packages
    .map(function(pkg) {
      return `    ${chalk.cyan(chalk.bold(pkg))}`;
    })
    .join('\n');

  return `Installing npm modules:
${pkgText}
`;
};

exports.installError = function(packages) {
  const pkgText = packages
    .map(function(pkg) {
      return `${chalk.cyan(chalk.bold(pkg))}`;
    })
    .join(', ');

  output.error(`Failed to install ${pkgText}, try again.`);
};

exports.copying = function(projectName) {
  return `
Creating ${chalk.bold(chalk.green(projectName))}...
`;
};

exports.start = function(projectName) {
  const cmd = getInstallCmd();

  const commands = {
    install: cmd === 'npm' ? 'npm install' : 'yarn install',
    build: cmd === 'npm' ? 'npm run build' : 'yarn build',
    start: cmd === 'npm' ? 'npm run start' : 'yarn start',
    test: cmd === 'npm' ? 'npm test' : 'yarn test',
  };

  return `
  ${chalk.green('Awesome!')} You're now ready to start coding.
  
  I already ran ${output.cmd(commands.install)} for you, so your next steps are:
    ${output.cmd(`cd ${projectName}`)}
  
  To start developing (rebuilds on changes):
    ${output.cmd(commands.start)}
  
  To build for production:
    ${output.cmd(commands.build)}

  To test your library with Jest:
    ${output.cmd(commands.test)}
    
  Questions? Feedback? Please let me know!
  ${chalk.green('https://github.com/jaredpalmer/tsdx/issues')}
`;
};
