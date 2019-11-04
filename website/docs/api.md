---
id: api
title: API Reference
---

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
  --noClean             Don't clean the dist folder
  -h, --help            Displays this message

Examples
  $ tsdx watch --entry src/foo.tsx
  $ tsdx watch --target node
  $ tsdx watch --name Foo
  $ tsdx watch --format cjs,esm,umd
  $ tsdx watch --tsconfig ./tsconfig.foo.json
  $ tsdx watch --noClean
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
  -h, --help            Displays this message

Examples
  $ tsdx build --entry src/foo.tsx
  $ tsdx build --target node
  $ tsdx build --name Foo
  $ tsdx build --format cjs,esm,umd
  $ tsdx build --extractErrors
  $ tsdx build --tsconfig ./tsconfig.foo.json
```

### `tsdx test`

This runs Jest v24.x in watch mode. See [https://jestjs.io](https://jestjs.io) for options. If you are using the React template, jest uses the flag `--env=jsdom` by default.

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
