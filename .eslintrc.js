module.exports = {
  ignorePatterns: ['test/tests/lint'], // ignore lint tests
  extends: [
    'react-app',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
};
