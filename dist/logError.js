"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const stderr = console.error.bind(console);
function logError(err) {
    const error = err.error || err;
    const description = `${error.name ? error.name + ': ' : ''}${error.message ||
        error}`;
    const message = error.plugin
        ? error.plugin === 'rpt2'
            ? `(typescript) ${description}`
            : `(${error.plugin} plugin) ${description}`
        : description;
    stderr(chalk_1.default.bold.red(message));
    if (error.loc) {
        stderr();
        stderr(`at ${error.loc.file}:${error.loc.line}:${error.loc.column}`);
    }
    if (error.frame) {
        stderr();
        stderr(chalk_1.default.dim(error.frame));
    }
    else if (err.stack) {
        const headlessStack = error.stack.replace(message, '');
        stderr(chalk_1.default.dim(headlessStack));
    }
    stderr();
}
exports.default = logError;
