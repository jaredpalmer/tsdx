![tsdx](https://user-images.githubusercontent.com/4060187/56918426-fc747600-6a8b-11e9-806d-2da0b49e89e4.png)

[![Blazing Fast](https://badgen.now.sh/badge/speed/blazing%20%F0%9F%94%A5/green)](https://npm.im/tsdx) [![Blazing Fast](https://badgen.now.sh/badge/speed/blazing%20%F0%9F%94%A5/green)](https://npm.im/tsdx) [![Blazing Fast](https://badgen.now.sh/badge/speed/blazing%20%F0%9F%94%A5/green)](https://npm.im/tsdx) [![CircleCI](https://circleci.com/gh/palmerhq/tsdx.svg?style=svg)](https://circleci.com/gh/palmerhq/tsdx)

Despite all the recent hype, setting up a new TypeScript (x React) library can be tough. Between [Rollup](https://github.com/rollup/rollup), [Jest](https://github.com/facebook/jest), `tsconfig`, [Yarn resolutions](https://yarnpkg.com/en/docs/selective-version-resolutions), TSLint, and getting VSCode to play nicely....there is just a whole lot of stuff to do (and things to screw up). TSDX is a zero-config CLI that helps you develop, test, and publish modern TypeScript packages with ease--so you can focus on your awesome new library and not waste another afternoon on the configuration.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Features](#features)
- [Quick Start](#quick-start)
  - [`npm start` or `yarn start`](#npm-start-or-yarn-start)
  - [`npm run build` or `yarn build`](#npm-run-build-or-yarn-build)
  - [`npm test` or `yarn test`](#npm-test-or-yarn-test)
- [Optimizations](#optimizations)
  - [Development-only Expressions + Treeshaking](#development-only-expressions--treeshaking)
  - [Using lodash](#using-lodash)
- [Inspiration](#inspiration)
  - [Comparison to Microbundle](#comparison-to-microbundle)
- [API Reference](#api-reference)
  - [`tsdx watch`](#tsdx-watch)
  - [`tsdx build`](#tsdx-build)
  - [`tsdx test`](#tsdx-test)
- [Author](#author)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Features

TSDX comes with the "battery-pack included" and is part of a complete TypeScript breakfast:

- Bundles your code with [Rollup](https://github.com/rollup/rollup) and outputs multiple module formats (CJS, UMD & ESM) plus development and production builds
- Comes with treeshaking, ready-to-rock lodash optimizations, and minification/compression
- Live reload / watch-mode
- Works with React
- Human readable error messages (and in VSCode-friendly format)
- Bundle size snapshots
- Jest test runner setup with sensible defaults via `tsdx test`
- Zero-config, single dependency

## Quick Start

```
npx tsdx create mylib
cd mylib
yarn start
```

That's it. You don't need to worry about setting up Typescript or Rollup or Jest or other plumbing. Just start editing `src/index.ts` and go!

Below is a list of commands you will probably find useful.

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

## Optimizations

Aside from just bundling your module into different formats, TSDX comes with some optimizations for your convenience. They yield objectively better code and smaller bundle sizes.

After TSDX compiles your code with TypeScript, it processes your code with 3 Babel plugins:

- [`babel-plugin-annotate-pure-calls`](https://github.com/Andarist/babel-plugin-annotate-pure-calls): Injects for `#__PURE` annotations to enable treeshaking
- [`babel-plugin-dev-expressions`](https://github.com/4Catalyzer/babel-plugin-dev-expression): A mirror of Facebook's dev-expression Babel plugin. It reduces or eliminates development checks from production code
- [`babel-plugin-rename-import`](https://github.com/laat/babel-plugin-transform-rename-import): Used to rewrite any `lodash` imports

### Development-only Expressions + Treeshaking

`babel-plugin-annotate-pure-calls` + `babel-plugin-dev-expressions` work together to fully eliminate dead code (aka treeshake) development checks from your production code. Let's look at an example to see how it works.

Imagine our source code is just this:

```tsx
// ./src/index.ts
export const sum = (a: number, b: number) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Helpful dev-only error message');
  }
  return a + b;
};
```

`tsdx build` will output an ES module file, 2 UMD files (dev and prod), and 3 CommonJS files (dev, prod, and an entry file). For brevity, let's examine the CommonJS output (comments added for emphasis):

```js
// Entry File
// ./dist/index.js
'use strict';

// This determines which build to use based on the `NODE_ENV` of your end user.
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./mylib.cjs.production.js');
} else {
  module.exports = require('./mylib.cjs.development.js');
}
```

```js
// CommonJS Development Build
// ./dist/mylib.cjs.development.js
'use strict';

const sum = (a, b) => {
  {
    console.log('Helpful dev-only error message');
  }

  return a + b;
};

exports.sum = sum;
//# sourceMappingURL=mylib.cjs.development.js.map
```

```js
// CommonJS Production Build
// ./dist/mylib.cjs.production.js
'use strict';
exports.sum = (s, t) => s + t;
//# sourceMappingURL=test-react-tsdx.cjs.production.js.map
```

AS you can see, TSDX stripped out the development check from the production code. **This allows you can to safely add development-only behavior (like more useful error messages) without any production bundle size impact.**

#### Advanced `babel-plugin-dev-expressions`

TSDX will use `babel-plugin-dev-expressions` to make the following replacements _before_ treeshaking.

##### `__DEV__`

Replaces

```ts
if (__DEV__) {
  console.log('foo');
}
```

with

```js
if (process.env.NODE_ENV !== 'production') {
  console.log('foo');
}
```

**IMPORTANT:** To use `__DEV__` in TypeScript, you need add `declare var __DEV__: boolean` somewhere in your project's type path (e.g. `./types/index.d.ts`).

```ts
// ./types/index.d.ts
declare var __DEV__: boolean;
```

> **Note:** The `dev-expression` transform does not run when `NODE_ENV` is `test`. As such, if you use `__DEV__`, you will need to define it as a global constant in your test environment.

##### `invariant`

Replaces

```js
invariant(condition, argument, argument);
```

with

```js
if (!condition) {
  if ('production' !== process.env.NODE_ENV) {
    invariant(false, argument, argument);
  } else {
    invariant(false);
  }
}
```

Recommended for use with smaller https://github.com/alexreardon/tiny-invariant.

##### `warning`

Replaces

```js
warning(condition, argument, argument);
```

with

```js
if ('production' !== process.env.NODE_ENV) {
  warning(condition, argument, argument);
}
```

Recommended for use with https://github.com/alexreardon/tiny-warning.

### Using lodash

If you want to use a lodash function in your package, TSDX will help you do it the _right_ way so that your library does not get fat shamed on Twitter. However, before you continue, seriously consider rolling whatever function you are about to use on your own. Anyways, here is how to do it right.

First, install `lodash` and `lodash-es` as _dependencies_

```bash
yarn add lodash lodash-es
```

Now install `@types/lodash` to your development dependencies.

```bash
yarn add @types/lodash --dev
```

Import your lodash method however you want, TSDX will optimize it like so.

```tsx
// ./src/index.ts
import kebabCase from 'lodash/kebabCase';

export const KebabLogger = (msg: string) => {
  console.log(kebabCase(msg));
};
```

For brevity let's look at the ES module output.

<!-- prettier-ignore -->
```js
import o from"lodash-es/kebabCase";const e=e=>{console.log(o(e))};export{e as KebabLogger};
//# sourceMappingURL=test-react-tsdx.es.production.js.map
```

TSDX will rewrite your `import kebabCase from 'lodash/kebabCase'` to `import o from 'lodash-es/kebabCase'`. This allows your library to be treeshakable to end consumers while allowing to you to use `@types/lodash` for free.

> Note: TSDX will also transform destructured imports. For example, `import { kebabCase } from 'lodash'` would have also been transformed to `import o from "lodash-es/kebabCase".

## Inspiration

TSDX is ripped out of [Formik's](https://github.com/jaredpalmer/formik) build tooling. TSDX is very similar to [@developit/microbundle](https://github.com/developit/microbundle), but that is because Formik's Rollup configuration and Microbundle's internals have converged around similar plugins over the last year or so.

### Comparison to Microbundle

- TSDX includes out-of-the-box test running via Jest
- TSDX includes a bootstrap command and default package template
- TSDX is 100% TypeScript focused. While yes, TSDX does use Babel to run a few optimizations (related to treeshaking and lodash), it does not support custom babel configurations.
- TSDX outputs distinct development and production builds (like React does) for CJS and UMD builds. This means you can include rich error messages and other dev-friendly goodies without sacrificing final bundle size.

## API Reference

### `tsdx watch`

```shell
Description
  Rebuilds on any change

Usage
  $ tsdx watch [options]

Options
  -i, --entry    Entry module(s)
  --target       Specify your target environment  (default web)
  --name         Specify name exposed in UMD builds
  --format       Specify module format(s)  (default cjs,es,umd)
  -h, --help     Displays this message

Examples
  $ tsdx watch --entry src/foo.tsx
  $ tsdx watch --target node
  $ tsdx watch --name Foo
  $ tsdx watch --format cjs,es
```

### `tsdx build`

```shell
Description
  Build your project once and exit

Usage
  $ tsdx build [options]

Options
  -i, --entry    Entry module(s)
  --target       Specify your target environment  (default web)
  --name         Specify name exposed in UMD builds
  --format       Specify module format(s)  (default cjs,es,umd)
  -h, --help     Displays this message

Examples
  $ tsdx build --entry src/foo.tsx
  $ tsdx build --target node
  $ tsdx build --name Foo
  $ tsdx build --format cjs,es
```

### `tsdx test`

This runs Jest v24.x in watch mode. See [https://jestjs.io](https://jestjs.io) for options. If you are using the React template, jest uses the flag `--env=jsdom` by default.

## Author

- [Jared Palmer](https://twitter.com/jaredpalmer)

## License

[MIT](https://oss.ninja/mit/jaredpalmer/)
