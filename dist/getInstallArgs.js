"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getInstallArgs(cmd, packages) {
    switch (cmd) {
        case 'npm':
            return ['install', ...packages, '--save-dev'];
        case 'yarn':
            return ['add', ...packages, '--dev'];
    }
}
exports.default = getInstallArgs;
