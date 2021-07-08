"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("./react"));
const storybookTemplate = {
    dependencies: [
        ...react_1.default.dependencies,
        '@babel/core',
        '@storybook/addon-essentials',
        '@storybook/addon-links',
        '@storybook/addon-info',
        '@storybook/addons',
        '@storybook/react',
        'react-is',
        'babel-loader',
    ],
    name: 'react-with-storybook',
    packageJson: Object.assign(Object.assign({}, react_1.default.packageJson), { scripts: Object.assign(Object.assign({}, react_1.default.packageJson.scripts), { storybook: 'start-storybook -p 6006', 'build-storybook': 'build-storybook' }) }),
};
exports.default = storybookTemplate;
