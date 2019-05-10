declare module 'asyncro';
declare module 'enquirer';
declare module 'jpjs';
declare module 'ora';
declare module 'sade';
declare module 'tiny-glob/sync';
declare module 'ansi-escapes';

// Patch Babel
// @see line 226 of https://unpkg.com/@babel/core@7.4.4/lib/index.js
declare module '@babel/core' {
  export const DEFAULT_EXTENSIONS: string[];
}

// Rollup plugins
declare module '@jaredpalmer/rollup-plugin-preserve-shebang';
declare module 'rollup-plugin-babel';
declare module 'rollup-plugin-size-snapshot';
declare module 'rollup-plugin-terser';
declare module 'camelcase';
