declare module 'asyncro';
declare module 'enquirer';
declare module 'jpjs';
declare module 'ora';
declare module 'tiny-glob/sync';
declare module 'ansi-escapes';
declare module 'eslint-config-react-app';

// Patch Babel
// @see line 226 of https://unpkg.com/@babel/core@7.4.4/lib/index.js
declare module '@babel/core' {
  export const DEFAULT_EXTENSIONS: string[];
  export function createConfigItem(boop: any[], options: any) {}
}

// Rollup plugins
declare module '@jaredpalmer/rollup-plugin-preserve-shebang';
declare module 'rollup-plugin-babel';
declare module 'rollup-plugin-size-snapshot';
declare module 'rollup-plugin-terser';
declare module 'camelcase';
declare module 'babel-traverse';
declare module 'babylon';
declare module '@babel/helper-module-imports';

declare module 'lodash.merge';
