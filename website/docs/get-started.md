---
id: get-started
title: Getting Started
---

## Overview

Despite all the recent hype, setting up a new TypeScript (x React) library can be tough. Between [Rollup](https://github.com/rollup/rollup), [Jest](https://github.com/facebook/jest), `tsconfig`, [Yarn resolutions](https://yarnpkg.com/en/docs/selective-version-resolutions), ESLint, and getting VSCode to play nicely....there is just a whole lot of stuff to do (and things to screw up). TSDX is a zero-config CLI that helps you develop, test, and publish modern TypeScript packages with ease--so you can focus on your awesome new library and not waste another afternoon on the configuration.

## Features

TSDX comes with the "battery-pack included" and is part of a complete TypeScript breakfast:

- Bundles your code with [Rollup](https://github.com/rollup/rollup) and outputs multiple module formats (CJS & ESM by default, and also UMD if you want) plus development and production builds
- Comes with treeshaking, ready-to-rock lodash optimizations, and minification/compression
- Live reload / watch-mode
- Works with React
- Human readable error messages (and in VSCode-friendly format)
- Bundle size snapshots
- Opt-in to extract `invariant` error codes
- Jest test runner setup with sensible defaults via `tsdx test`
- Zero-config, single dependency

## Quick Start

```
npx tsdx create mylib
cd mylib
yarn start
```

That's it. You don't need to worry about setting up Typescript or Rollup or Jest or other plumbing. Just start editing `src/index.ts` and go!

Below is a list of commands you will probably find useful:

### `npm start` or `yarn start`

Runs the project in development/watch mode. Your project will be rebuilt upon changes. TSDX has a special logger for your convenience. Error messages are pretty printed and formatted for compatibility VS Code's Problems tab.

<img src="https://user-images.githubusercontent.com/4060187/52168303-574d3a00-26f6-11e9-9f3b-71dbec9ebfcb.gif" width="600" />

Your library will be rebuilt if you make edits.

### `npm run build` or `yarn build`

Bundles the package to the `dist` folder.
The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).

<img src="https://user-images.githubusercontent.com/4060187/52168322-a98e5b00-26f6-11e9-8cf6-222d716b75ef.gif" width="600" />

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.

### `npm run lint` or `yarn lint`

Runs Eslint with Prettier on .ts and .tsx files.
If you want to customize eslint you can add an `eslint` block to your package.json, or you can run `yarn lint --write-file` and edit the generated `.eslintrc.js` file.
