# TSDX Monorepo User Guide

## Usage

This monorepo is setup for a dummy `@mono/` NPM organization. There are 2 packages by default:

- `@mono/react` - A placholder React component
- `@mono/utils` - A utils packages

Unlike other TSDX templates, the developer experience for this template is currently a bit more manual.

Your first order of business will be to search and replace `@mono` for the npm organization of your own.

After that you can install all the dependencies in the root directory

```sh
npm install # or yarn install
```

This will install all dependencies in each project, build them, and symlink them via Lerna

## Development workflow

```sh
npm start # or yarn start
```

This builds each package to `<packages>/<package>/dist` and runs the project in watch mode so any edits you save inside `<packages>/<package>/src` causes a rebuild to `<packages>/<package>/dist`.

In addition, this will start the example/playground on `localhost:1234`
