# TSDX [![Blazing Fast](https://badgen.now.sh/badge/speed/blazing%20%F0%9F%94%A5/green)](https://npm.im/tsdx)

**Zero-config TypeScript package development.**

Despite all the recent hype, setting up a new TypeScript library can be tough. Between Rollup, Jest, `tsconfig`, TSLint, and getting VSCode to play nicely....there is just a whole lot of stuff to do (and things to fuck up). TSDX is a zero-config CLI that helps you develop, test, and publish modern TypeScript packages with ease--so you can focus on your awesome new library and not waste another afternoon on the configuration.

## Features

TSDX comes with the "battery-pack included" and is part of a complete TypeScript breakfast:

- Bundles your code with Rollup and outputs multiple module formats (CJS, UMD & ESM) plus development and production builds
- Comes with treeshaking, ready-to-rock lodash optimizations, and minification/compression
- Live reload / watch-mode
- Works with React
- Human readable error messages (and in VSCode-friendly format)
- Bundle size snapshots
- Jest test runner setup with sensible defaults via `tsdx test`
- Zero-config, single dependency

## Quick Start

```
npx tsdx create my-lib
cd my-lib
npm start
```

That's it. You don't need to worry about setting up Typescript or Rollup or Jest or other plumbing. Just start editing `src/index.ts` and go!

Below is a list of commands you will probably find useful.

### `npm start` or `yarn start`

Runs the project in development/watch mode.

Your library will be rebuilt if you make edits.

### `npm run build` or `yarn build`

Builds the package to the `dist` folder.

The package is optimized and bundled into multiple formats.
Your package is ready to be published!

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.

## Inspiration

TSDX is ripped out of [Formik's](https://github.com/jaredpalmer/formik) build tooling. TSDX is very similar to [@developit/microbundle](https://github.com/developit/microbundle), but that is because Formik's Rollup configuration and Microbundle's internals have converged around similar plugins over the last year or so.

### Comparison to Microbundle

- TSDX includes out-of-the-box test running via Jest
- TSDX includes a bootstrap command and default package template
- TSDX is 100% TypeScript focused. While yes, TSDX does use Babel to run a few optimizations (related to treeshaking and lodash), it does not support custom babel configurations.
- TSDX outputs distinct development and production builds (like React does) for CJS and UMD builds. This means you can include rich error messages and other dev-friendly goodies without sacrificing final bundle size.

## Author

- [Jared Palmer](https://twitter.com/jaredpalmer)
