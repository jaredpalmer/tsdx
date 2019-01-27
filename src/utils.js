import fs from 'fs-extra';
import path from 'path';
import camelCase from 'camelcase';

// Remove the package name scope if it exists
export const removeScope = name => name.replace(/^@.*\//, '');

// UMD-safe package name
export const safeVariableName = name =>
  camelCase(
    removeScope(name)
      .toLowerCase()
      .replace(/((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, '')
  );

export const safePackageName = name =>
  name.toLowerCase().replace(/((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, '');

export const external = id => !id.startsWith('.') && !id.startsWith('/');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
export const appDirectory = fs.realpathSync(process.cwd());
export const resolveApp = function(relativePath) {
  return path.resolve(appDirectory, relativePath);
};
