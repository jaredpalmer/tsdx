![tsdx](https://user-images.githubusercontent.com/4060187/56918426-fc747600-6a8b-11e9-806d-2da0b49e89e4.png)

[![Blazing Fast](https://badgen.now.sh/badge/speed/blazing%20%F0%9F%94%A5/green)](https://npm.im/tsdx) [![Blazing Fast](https://badgen.now.sh/badge/speed/blazing%20%F0%9F%94%A5/green)](https://npm.im/tsdx) [![Blazing Fast](https://badgen.now.sh/badge/speed/blazing%20%F0%9F%94%A5/green)](https://npm.im/tsdx) [![Greenkeeper badge](https://badges.greenkeeper.io/jaredpalmer/tsdx.svg)](https://greenkeeper.io/)

Despite all the recent hype, setting up a new TypeScript (x React) library can be tough. Between [Rollup](https://github.com/rollup/rollup), [Jest](https://github.com/facebook/jest), `tsconfig`, [Yarn resolutions](https://yarnpkg.com/en/docs/selective-version-resolutions), ESLint, and getting VSCode to play nicely....there is just a whole lot of stuff to do (and things to screw up). TSDX is a zero-config CLI that helps you develop, test, and publish modern TypeScript packages with ease--so you can focus on your awesome new library and not waste another afternoon on the configuration.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Features](#features)
- [Quick Start](#quick-start)
  - [`npm start` or `yarn start`](#npm-start-or-yarn-start)
  - [`npm run build` or `yarn build`](#npm-run-build-or-yarn-build)
  - [`npm test` or `yarn test`](#npm-test-or-yarn-test)
  - [`npm run lint` or `yarn lint`](#npm-run-lint-or-yarn-lint)
  - [`prepare` script](#prepare-script)
- [Optimizations](#optimizations)
  - [Development-only Expressions + Treeshaking](#development-only-expressions--treeshaking)
    - [Rollup Treeshaking](#rollup-treeshaking)
    - [Advanced `babel-plugin-dev-expressions`](#advanced-babel-plugin-dev-expressions)
      - [`__DEV__`](#__dev__)
      - [`invariant`](#invariant)
      - [`warning`](#warning)
  - [Using lodash](#using-lodash)
  - [Error extraction](#error-extraction)
- [Customization](#customization)
  - [Rollup](#rollup)
    - [Example: Adding Postcss](#example-adding-postcss)
  - [Babel](#babel)
- [Inspiration](#inspiration)
  - [Comparison to Microbundle](#comparison-to-microbundle)
- [API Reference](#api-reference)
  - [`tsdx watch`](#tsdx-watch)
  - [`tsdx build`](#tsdx-build)
  - [`tsdx test`](#tsdx-test)
  - [`tsdx lint`](#tsdx-lint)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)
- [Contributors ✨](#contributors-)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

```bash
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

### `prepare` script

Bundles and packages to the `dist` folder.
Runs automatically when you run either `npm publish` or `yarn publish`. The `prepare` script will run the equivalent of `npm run build` or `yarn build`. It will also be run if your module is installed as a git dependency (ie: `"mymodule": "github:myuser/mymodule#some-branch"`) so it can be depended on without checking the transpiled code into git.

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

`tsdx build` will output an ES module file and 3 CommonJS files (dev, prod, and an entry file). If you want to specify a UMD build, you can do that as well. For brevity, let's examine the CommonJS output (comments added for emphasis):

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

AS you can see, TSDX stripped out the development check from the production code. **This allows you to safely add development-only behavior (like more useful error messages) without any production bundle size impact.**

For ESM build, it's up to end-user to build environment specific build with NODE_ENV replace (done by Webpack 4 automatically).

#### Rollup Treeshaking

TSDX's rollup config [removes getters and setters on objects](https://github.com/palmerhq/tsdx/blob/1f6a1b6819bb17678aa417f0df5349bec12f59ac/src/createRollupConfig.ts#L73) so that property access has no side effects. Don't do it.

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
invariant(condition, 'error message here');
```

with

```js
if (!condition) {
  if ('production' !== process.env.NODE_ENV) {
    invariant(false, 'error message here');
  } else {
    invariant(false);
  }
}
```

Note: TSDX doesn't supply an `invariant` function for you, you need to import one yourself. We recommend https://github.com/alexreardon/tiny-invariant.

To extract and minify `invariant` error codes in production into a static `codes.json` file, specify the `--extractErrors` flag in command line. For more details see [Error extraction docs](#error-extraction).

##### `warning`

Replaces

```js
warning(condition, 'dev warning here');
```

with

```js
if ('production' !== process.env.NODE_ENV) {
  warning(condition, 'dev warning here');
}
```

Note: TSDX doesn't supply a `warning` function for you, you need to import one yourself. We recommend https://github.com/alexreardon/tiny-warning.

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
//# sourceMappingURL=test-react-tsdx.esm.production.js.map
```

TSDX will rewrite your `import kebabCase from 'lodash/kebabCase'` to `import o from 'lodash-es/kebabCase'`. This allows your library to be treeshakable to end consumers while allowing to you to use `@types/lodash` for free.

> Note: TSDX will also transform destructured imports. For example, `import { kebabCase } from 'lodash'` would have also been transformed to `import o from "lodash-es/kebabCase".

### Error extraction

After running `--extractErrors`, you will have a `./errors/codes.json` file with all your extracted `invariant` error codes. This process scans your production code and swaps out your `invariant` error message strings for a corresponding error code (just like React!). This extraction only works if your error checking/warning is done by a function called `invariant`.

Note: We don't provide this function for you, it is up to you how you want it to behave. For example, you can use either `tiny-invariant` or `tiny-warning`, but you must then import the module as a variable called `invariant` and it should have the same type signature.

⚠️Don't forget: you will need to host the decoder somewhere. Once you have a URL, look at `./errors/ErrorProd.js` and replace the `reactjs.org` URL with yours.

> Known issue: our `transformErrorMessages` babel plugin currently doesn't have sourcemap support, so you will see "Sourcemap is likely to be incorrect" warnings. [We would love your help on this.](https://github.com/palmerhq/tsdx/issues/184)

_TODO: Simple guide to host error codes to be completed_

## Customization

### Rollup

> **❗⚠️❗ Warning**: <br>
> These modifications will override the default behavior and configuration of TSDX. As such they can invalidate internal guarantees and assumptions. These types of changes can break internal behavior and can be very fragile against updates. Use with discretion!

TSDX uses Rollup under the hood. The defaults are solid for most packages (Formik uses the defaults!). However, if you do wish to alter the rollup configuration, you can do so by creating a file called `tsdx.config.js` at the root of your project like so:

```js
// Not transpiled with TypeScript or Babel, so use plain Es6/Node.js!
module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    return config; // always return a config.
  },
};
```

The `options` object contains the following:

```tsx
export interface TsdxOptions {
  // path to file
  input: string;
  // Name of package
  name: string;
  // JS target
  target: 'node' | 'browser';
  // Module format
  format: 'cjs' | 'umd' | 'esm' | 'system';
  // Environment
  env: 'development' | 'production';
  // Path to tsconfig file
  tsconfig?: string;
  // Is error extraction running?
  extractErrors?: boolean;
  // Is minifying?
  minify?: boolean;
  // Is this the very first rollup config (and thus should one-off metadata be extracted)?
  writeMeta?: boolean;
  // Only transpile, do not type check (makes compilation faster)
  transpileOnly?: boolean;
}
```

#### Example: Adding Postcss

```js
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        plugins: [
          autoprefixer(),
          cssnano({
            preset: 'default',
          }),
        ],
        inject: false,
        // only write out CSS for the first bundle (avoids pointless extra files):
        extract: !!options.writeMeta,
      })
    );
    return config;
  },
};
```

### Babel

You can add your own `.babelrc` to the root of your project and TSDX will **merge** it with its own babel transforms (which are mostly for optimization).

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
  -i, --entry           Entry module(s)
  --target              Specify your target environment  (default web)
  --name                Specify name exposed in UMD builds
  --format              Specify module format(s)  (default cjs,esm)
  --tsconfig            Specify your custom tsconfig path (default <root-folder>/tsconfig.json)
  --verbose             Keep outdated console output in watch mode instead of clearing the screen
  --onFirstSuccess      Run a command on the first successful build
  --onSuccess           Run a command on a successful build
  --onFailure           Run a command on a failed build
  --noClean             Don't clean the dist folder
  --transpileOnly       Skip type checking
  -h, --help            Displays this message

Examples
  $ tsdx watch --entry src/foo.tsx
  $ tsdx watch --target node
  $ tsdx watch --name Foo
  $ tsdx watch --format cjs,esm,umd
  $ tsdx watch --tsconfig ./tsconfig.foo.json
  $ tsdx watch --noClean
  $ tsdx watch --onFirstSuccess "echo The first successful build!"
  $ tsdx watch --onSuccess "echo Successful build!"
  $ tsdx watch --onFailure "echo The build failed!"
  $ tsdx watch --transpileOnly
```

### `tsdx build`

```shell
Description
  Build your project once and exit

Usage
  $ tsdx build [options]

Options
  -i, --entry           Entry module(s)
  --target              Specify your target environment  (default web)
  --name                Specify name exposed in UMD builds
  --format              Specify module format(s)  (default cjs,esm)
  --extractErrors       Opt-in to extracting invariant error codes
  --tsconfig            Specify your custom tsconfig path (default <root-folder>/tsconfig.json)
  --transpileOnly       Skip type checking
  -h, --help            Displays this message

Examples
  $ tsdx build --entry src/foo.tsx
  $ tsdx build --target node
  $ tsdx build --name Foo
  $ tsdx build --format cjs,esm,umd
  $ tsdx build --extractErrors
  $ tsdx build --tsconfig ./tsconfig.foo.json
  $ tsdx build --transpileOnly
```

### `tsdx test`

This runs Jest v24.x. See [https://jestjs.io](https://jestjs.io) for options. For example, if you would like to run in watch mode, you can run `tsdx test --watch`. So you could set up your `package.json` `scripts` like:

```json
{
  "scripts": {
    "test": "tsdx test",
    "test:watch": "tsdx test --watch",
    "test:coverage": "tsdx test --coverage"
  }
}
```

### `tsdx lint`

```shell
Description
  Run eslint with Prettier

Usage
  $ tsdx lint [options]

Options
  --fix               Fixes fixable errors and warnings
  --ignore-pattern    Ignore a pattern
  --write-file        Write the config file locally
  --report-file       Write JSON report to file locally
  -h, --help          Displays this message

Examples
  $ tsdx lint src
  $ tsdx lint src --fix
  $ tsdx lint src test --ignore-pattern test/foo.ts
  $ tsdx lint src --write-file
  $ tsdx lint src --report-file report.json
```

## Contributing

Please see the [Contributing Guidelines](./CONTRIBUTING.md).

## Author

- [Jared Palmer](https://twitter.com/jaredpalmer)

## License

[MIT](https://oss.ninja/mit/jaredpalmer/)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>   
    <td align="center"><a href="https://jaredpalmer.com"><img src="https://avatars2.githubusercontent.com/u/4060187?v=4" width="100px;" alt="Jared Palmer"/><br /><sub><b>Jared Palmer</b></sub></a><br /><a href="https://github.com/jaredpalmer/tsdx/commits?author=jaredpalmer" title="Documentation">📖</a> <a href="#design-jaredpalmer" title="Design">🎨</a> <a href="#review-jaredpalmer" title="Reviewed Pull Requests">👀</a> <a href="#tool-jaredpalmer" title="Tools">🔧</a> <a href="https://github.com/jaredpalmer/tsdx/commits?author=jaredpalmer" title="Tests">⚠️</a> <a href="#maintenance-jaredpalmer" title="Maintenance">🚧</a> <a href="https://github.com/jaredpalmer/tsdx/commits?author=jaredpalmer" title="Code">💻</a></td>
    <td align="center"><a href="https://twitter.com/swyx"><img src="https://avatars1.githubusercontent.com/u/6764957?v=4" width="100px;" alt="swyx"/><br /><sub><b>swyx</b></sub></a><br /><a href="https://github.com/jaredpalmer/tsdx/issues?q=author%3Asw-yx" title="Bug reports">🐛</a> <a href="https://github.com/jaredpalmer/tsdx/commits?author=sw-yx" title="Code">💻</a> <a href="https://github.com/jaredpalmer/tsdx/commits?author=sw-yx" title="Documentation">📖</a> <a href="#design-sw-yx" title="Design">🎨</a> <a href="#ideas-sw-yx" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-sw-yx" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-sw-yx" title="Maintenance">🚧</a> <a href="#review-sw-yx" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://jasonet.co"><img src="https://avatars1.githubusercontent.com/u/10660468?v=4" width="100px;" alt="Jason Etcovitch"/><br /><sub><b>Jason Etcovitch</b></sub></a><br /><a href="https://github.com/jaredpalmer/tsdx/issues?q=author%3AJasonEtco" title="Bug reports">🐛</a> <a href="https://github.com/jaredpalmer/tsdx/commits?author=JasonEtco" title="Tests">⚠️</a></td>
     <td align="center"><a href="https://github.com/skvale"><img src="https://avatars0.githubusercontent.com/u/5314713?v=4" width="100px;" alt="Sam Kvale"/><br /><sub><b>Sam Kvale</b></sub></a><br /><a href="https://github.com/jaredpalmer/tsdx/commits?author=skvale" title="Code">💻</a> <a href="https://github.com/jaredpalmer/tsdx/commits?author=skvale" title="Tests">⚠️</a> <a href="https://github.com/jaredpalmer/tsdx/issues?q=author%3Askvale" title="Bug reports">🐛</a> <a href="https://github.com/jaredpalmer/tsdx/commits?author=skvale" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
