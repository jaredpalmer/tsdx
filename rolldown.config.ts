import { defineConfig } from 'rolldown';

export default defineConfig({
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'esm',
    sourcemap: true,
    banner: '#!/usr/bin/env node',
  },
  platform: 'node',
  external: [
    'commander',
    'enquirer',
    'execa',
    'fs-extra',
    'ora',
    'picocolors',
    'rolldown',
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
});
