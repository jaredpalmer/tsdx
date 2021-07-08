"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEslintConfig = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const path_1 = tslib_1.__importDefault(require("path"));
const utils_1 = require("./utils");
async function createEslintConfig({ pkg, rootDir, writeFile, }) {
    const isReactLibrary = Boolean(utils_1.getReactVersion(pkg));
    const config = {
        extends: [
            'react-app',
            'prettier/@typescript-eslint',
            'plugin:prettier/recommended',
        ],
        settings: {
            react: {
                // Fix for https://github.com/jaredpalmer/tsdx/issues/279
                version: isReactLibrary ? 'detect' : '999.999.999',
            },
        },
    };
    if (!writeFile) {
        return config;
    }
    const file = path_1.default.join(rootDir, '.eslintrc.js');
    try {
        await fs_extra_1.default.writeFile(file, `module.exports = ${JSON.stringify(config, null, 2)}`, { flag: 'wx' });
    }
    catch (e) {
        if (e.code === 'EEXIST') {
            console.error('Error trying to save the Eslint configuration file:', `${file} already exists.`);
        }
        else {
            console.error(e);
        }
        return config;
    }
}
exports.createEslintConfig = createEslintConfig;
