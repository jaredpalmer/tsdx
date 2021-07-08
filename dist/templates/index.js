"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templates = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("./react"));
const basic_1 = tslib_1.__importDefault(require("./basic"));
const react_with_storybook_1 = tslib_1.__importDefault(require("./react-with-storybook"));
exports.templates = {
    basic: basic_1.default,
    react: react_1.default,
    'react-with-storybook': react_with_storybook_1.default,
};
