declare module 'asyncro'; // doesn't have types (unmerged 2+ year old PR: https://github.com/developit/asyncro/pull/10)
declare module 'enquirer'; // doesn't have types for Input or Select
declare module 'jpjs'; // doesn't ship types (written in TS though)
declare module 'tiny-glob/sync'; // /sync isn't typed (but maybe we can use async?)

// Patch Babel
// @see line 226 of https://unpkg.com/@babel/core@7.4.4/lib/index.js
declare module '@babel/core' {
  export const DEFAULT_EXTENSIONS: string[];
  export function createConfigItem(boop: any[], options: any): any[];
}

// Rollup plugins
declare module 'rollup-plugin-terser';
declare module '@babel/traverse';
declare module '@babel/helper-module-imports';

declare module 'lodash.merge';
