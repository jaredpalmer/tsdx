import fs from 'fs-extra';
import path from 'path';
import camelCase from 'camelcase';

// Remove the package name scope if it exists
export const removeScope = (name: string) => name.replace(/^@.*\//, '');

// UMD-safe package name
export const safeVariableName = (name: string) =>
  camelCase(
    removeScope(name)
      .toLowerCase()
      .replace(/((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, '')
  );

export const safePackageName = (name: string) =>
  name
    .toLowerCase()
    .replace(/(^@.*\/)|((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, '');

export const external = (id: string) =>
  !id.startsWith('.') && !path.isAbsolute(id);

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
export const appDirectory = fs.realpathSync(process.cwd());
export const resolveApp = function(relativePath: string) {
  return path.resolve(appDirectory, relativePath);
};

// Taken from Create React App, react-dev-utils/clearConsole
// @see https://github.com/facebook/create-react-app/blob/master/packages/react-dev-utils/clearConsole.js
export function clearConsole() {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  );
}

// Convert booleans and int define= values to literals.
// This is more intuitive than `microbundle --define A=1` producing A="1".
export const toReplacementExpression = (value: string, name: string) => {
  // --define A="1",B='true' produces string:
  const matches = value.match(/^(['"])(.+)\1$/);
  if (matches) {
    return [JSON.stringify(matches[2]), name];
  }

  // --define A=1,B=true produces int/boolean literal:
  if (/^(true|false|\d+)$/i.test(value)) {
    return [value, name];
  }

  // default: string literal
  return [JSON.stringify(value), name];
};

// Parses values of the form "$=jQuery,React=react" into key-value object pairs.
export const parseMappingArgument = (
  globalStrings: string,
  processValue: (value: string, name: string) => any
) => {
  const globals: any = {};
  globalStrings.split(',').forEach(globalString => {
    let [key, value] = globalString.split('=');
    if (processValue) {
      const r = processValue(value, key);
      if (r !== undefined) {
        if (Array.isArray(r)) {
          [value, key] = r;
        } else {
          value = r;
        }
      }
    }
    globals[key] = value;
  });
  return globals;
};
