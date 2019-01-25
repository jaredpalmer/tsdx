# TSDX [![Blazing Fast](https://badgen.now.sh/badge/speed/blazing%20%F0%9F%94%A5/green)](https://npm.im/tsdx)

**Zero-config TypeScript package development.**

---

Setting up a new TypeScript package is kinda tough. While there are several starter kits and zero-config toolchains for apps and servers, there really isn't a tool that's purpose built for TS package development. To make matters worse, the main TypeScript compiler (i.e. `tsc`) is inadequate for building a modern TS library for wide consumption as it lacks key optimizations such as treeshaking, minification, bundling. **TSDX is a minimalist, zero-config, _and blazing fast_ CLI wrapper around [Rollup](https://github.com/rollup/rollup)** that makes bootstrapping, developing, building, and testing TypeScript libraries a breeze.

**TSDX comes with the "battery-pack included":**

- Zero-config, single dependency
- Outputs multiple module formats (CJS, UMD & ESM) and development and production build
- Comes with tree-shaking, ready to rumble lodash/lodash-es optimizations, and minification/compression
- Works with React
- Live reload / watch-mode
- Human readable error messages
- Bundle size snapshots
- Jest test runner setup with sensible defaults via `tsdx test`

## Quick Start

```
npx tsdx create my-lib
cd my-lib
npm start
```

That's it. You don't need to worry about setting up Typescript or rollup or Jest or other build tools. Just start editing src/index.ts and go!

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
