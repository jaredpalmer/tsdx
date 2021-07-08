"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.param = exports.code = exports.cmd = exports.wait = exports.success = exports.error = exports.info = void 0;
const tslib_1 = require("tslib");
const ansi_escapes_1 = require("ansi-escapes");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ora_1 = tslib_1.__importDefault(require("ora"));
// This was copied from Razzle. Lots of unused stuff.
exports.info = (msg) => {
    console.log(`${chalk_1.default.gray('>')} ${msg}`);
};
exports.error = (msg) => {
    if (msg instanceof Error) {
        msg = msg.message;
    }
    console.error(`${chalk_1.default.red('> Error!')} ${msg}`);
};
exports.success = (msg) => {
    console.log(`${chalk_1.default.green('> Success!')} ${msg}`);
};
exports.wait = (msg) => {
    const spinner = ora_1.default(chalk_1.default.green(msg));
    spinner.color = 'blue';
    spinner.start();
    return () => {
        spinner.stop();
        process.stdout.write(ansi_escapes_1.eraseLine);
    };
};
exports.cmd = (cmd) => {
    return chalk_1.default.bold(chalk_1.default.cyan(cmd));
};
exports.code = (cmd) => {
    return `${chalk_1.default.gray('`')}${chalk_1.default.bold(cmd)}${chalk_1.default.gray('`')}`;
};
exports.param = (param) => {
    return chalk_1.default.bold(`${chalk_1.default.gray('{')}${chalk_1.default.bold(param)}${chalk_1.default.gray('}')}`);
};
