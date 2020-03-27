module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*(*.)@(test).[tj]s?(x)'],
  testPathIgnorePatterns: [
    '/node_modules/', // default
    '<rootDir>/templates/', // don't run tests in the templates
    '<rootDir>/test/.*/fixtures/', // don't run tests in fixtures
    '<rootDir>/stage-.*/', // don't run tests in auto-generated (and auto-removed) test dirs
  ],
};
