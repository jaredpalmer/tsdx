"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJestConfig = void 0;
function createJestConfig(_, rootDir) {
    const config = {
        transform: {
            '.(ts|tsx)$': require.resolve('ts-jest/dist'),
            '.(js|jsx)$': require.resolve('babel-jest'),
        },
        transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
        moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
        collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}'],
        testMatch: ['<rootDir>/**/*.(spec|test).{ts,tsx,js,jsx}'],
        testURL: 'http://localhost',
        rootDir,
        watchPlugins: [
            require.resolve('jest-watch-typeahead/filename'),
            require.resolve('jest-watch-typeahead/testname'),
        ],
    };
    return config;
}
exports.createJestConfig = createJestConfig;
