"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incorrectNodeVersion = exports.start = exports.copying = exports.installError = exports.installing = exports.alreadyExists = exports.missingProjectName = exports.help = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const getInstallCmd_1 = tslib_1.__importDefault(require("./getInstallCmd"));
const Output = tslib_1.__importStar(require("./output"));
// This was copied from Razzle. Lots of unused stuff.
const program = {
    name: 'tsdx',
};
const help = function () {
    return `
    Only ${chalk_1.default.green('<project-directory>')} is required.
    If you have any problems, do not hesitate to file an issue:
    ${chalk_1.default.cyan('https://github.com/formium/tsdx/issues/new')}
  `;
};
exports.help = help;
const missingProjectName = function () {
    return `
Please specify the project directory:
  ${chalk_1.default.cyan(program.name)} ${chalk_1.default.green('<project-directory>')}
For example:
  ${chalk_1.default.cyan(program.name)} ${chalk_1.default.green('my-tsdx-lib')}
Run ${chalk_1.default.cyan(`${program.name} --help`)} to see all options.
`;
};
exports.missingProjectName = missingProjectName;
const alreadyExists = function (projectName) {
    return `
Uh oh! Looks like there's already a directory called ${chalk_1.default.red(projectName)}. Please try a different name or delete that folder.`;
};
exports.alreadyExists = alreadyExists;
const installing = function (packages) {
    const pkgText = packages
        .map(function (pkg) {
        return `    ${chalk_1.default.cyan(chalk_1.default.bold(pkg))}`;
    })
        .join('\n');
    return `Installing npm modules:
${pkgText}
`;
};
exports.installing = installing;
const installError = function (packages) {
    const pkgText = packages
        .map(function (pkg) {
        return `${chalk_1.default.cyan(chalk_1.default.bold(pkg))}`;
    })
        .join(', ');
    Output.error(`Failed to install ${pkgText}, try again.`);
};
exports.installError = installError;
const copying = function (projectName) {
    return `
Creating ${chalk_1.default.bold(chalk_1.default.green(projectName))}...
`;
};
exports.copying = copying;
const start = async function (projectName) {
    const cmd = await getInstallCmd_1.default();
    const commands = {
        install: cmd === 'npm' ? 'npm install' : 'yarn install',
        build: cmd === 'npm' ? 'npm run build' : 'yarn build',
        start: cmd === 'npm' ? 'npm run start' : 'yarn start',
        test: cmd === 'npm' ? 'npm test' : 'yarn test',
    };
    return `
  ${chalk_1.default.green('Awesome!')} You're now ready to start coding.
  
  I already ran ${Output.cmd(commands.install)} for you, so your next steps are:
    ${Output.cmd(`cd ${projectName}`)}
  
  To start developing (rebuilds on changes):
    ${Output.cmd(commands.start)}
  
  To build for production:
    ${Output.cmd(commands.build)}

  To test your library with Jest:
    ${Output.cmd(commands.test)}
    
  Questions? Feedback? Please let me know!
  ${chalk_1.default.green('https://github.com/formium/tsdx/issues')}
`;
};
exports.start = start;
const incorrectNodeVersion = function (requiredVersion) {
    return `Unsupported Node version! Your current Node version (${chalk_1.default.red(process.version)}) does not satisfy the requirement of Node ${chalk_1.default.cyan(requiredVersion)}.`;
};
exports.incorrectNodeVersion = incorrectNodeVersion;
