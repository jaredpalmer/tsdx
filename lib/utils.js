const fs = require('fs-extra');
const path = require('path');
const camelCase = require('camelcase');
// Remove the package name scope if it exists
const removeScope = name => name.replace(/^@.*\//, '');

// UMD-safe package name
const safeVariableName = name =>
  camelCase(
    removeScope(name)
      .toLowerCase()
      .replace(/((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, '')
  );

const safePackageName = name =>
  name.toLowerCase().replace(/((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, '');

const external = id => !id.startsWith('.') && !id.startsWith('/');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = function(relativePath) {
  return path.resolve(appDirectory, relativePath);
};

module.exports = {
  safePackageName,
  safeVariableName,
  resolveApp,
  removeScope,
};
