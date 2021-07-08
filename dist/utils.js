"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodeEngineRequirement = exports.getReactVersion = exports.clearConsole = exports.resolveApp = exports.appDirectory = exports.external = exports.safePackageName = exports.safeVariableName = exports.removeScope = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const path_1 = tslib_1.__importDefault(require("path"));
const camelcase_1 = tslib_1.__importDefault(require("camelcase"));
// Remove the package name scope if it exists
exports.removeScope = (name) => name.replace(/^@.*\//, '');
// UMD-safe package name
exports.safeVariableName = (name) => camelcase_1.default(exports.removeScope(name)
    .toLowerCase()
    .replace(/((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, ''));
exports.safePackageName = (name) => name
    .toLowerCase()
    .replace(/(^@.*\/)|((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, '');
exports.external = (id) => !id.startsWith('.') && !path_1.default.isAbsolute(id);
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
exports.appDirectory = fs_extra_1.default.realpathSync(process.cwd());
exports.resolveApp = function (relativePath) {
    return path_1.default.resolve(exports.appDirectory, relativePath);
};
// Taken from Create React App, react-dev-utils/clearConsole
// @see https://github.com/facebook/create-react-app/blob/master/packages/react-dev-utils/clearConsole.js
function clearConsole() {
    process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
}
exports.clearConsole = clearConsole;
function getReactVersion({ dependencies, devDependencies, }) {
    return ((dependencies && dependencies.react) ||
        (devDependencies && devDependencies.react));
}
exports.getReactVersion = getReactVersion;
function getNodeEngineRequirement({ engines }) {
    return engines && engines.node;
}
exports.getNodeEngineRequirement = getNodeEngineRequirement;
