"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const basic_1 = tslib_1.__importDefault(require("./basic"));
const reactTemplate = {
    name: 'react',
    dependencies: [
        ...basic_1.default.dependencies,
        '@types/react',
        '@types/react-dom',
        'react',
        'react-dom',
    ],
    packageJson: Object.assign(Object.assign({}, basic_1.default.packageJson), { peerDependencies: {
            react: '>=16',
        }, scripts: Object.assign(Object.assign({}, basic_1.default.packageJson.scripts), { test: 'tsdx test --passWithNoTests' }) }),
};
exports.default = reactTemplate;
