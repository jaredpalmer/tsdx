module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/**/*(*.)@(test).[tj]s?(x)'
  ],
  testPathIgnorePatterns: [
    '/node_modules/', // default
    '<rootDir>/templates/' // don't run tests in the templates
  ]
}
