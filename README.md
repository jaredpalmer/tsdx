# TSDX

Zero-config CLI for TypeScript package development.

[![CI](https://github.com/jaredpalmer/tsdx/actions/workflows/nodejs.yml/badge.svg)](https://github.com/jaredpalmer/tsdx/actions/workflows/nodejs.yml)
[![npm](https://img.shields.io/npm/v/tsdx.svg)](https://www.npmjs.com/package/tsdx)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Modern TypeScript library development, simplified. TSDX provides a zero-config CLI that helps you develop, test, and publish TypeScript packages with ease.

> **TSDX 2.0** is a complete rewrite using modern, high-performance Rust-based tooling. See the [Migration Guide](./MIGRATION.md) if upgrading from v0.x

## Features

- **Zero config** - Sensible defaults, just start coding
- **Modern tooling** - Built on [bunchee](https://github.com/huozhi/bunchee), [vitest](https://vitest.dev/), [oxlint](https://oxc.rs/docs/guide/usage/linter.html), and [oxfmt](https://oxc.rs/docs/guide/usage/formatter)
- **Dual ESM/CJS** - Automatic dual module builds with proper exports
- **TypeScript first** - Full TypeScript support with declaration generation
- **Lightning fast** - Rust-powered linting (50-100x faster than ESLint) and formatting (35x faster than Prettier)
- **Bun-native** - Uses bun for package management
- **Modern Node.js** - Supports Node.js 20+ (LTS)

## Quick Start

```bash
# Create a new package
bunx tsdx create mylib

# Navigate to the project
cd mylib

# Start development
bun run dev
```

That's it! Start editing `src/index.ts` and build your library.

## Installation

### Global Installation (recommended for creating projects)

```bash
bun add -g tsdx
```

### Per-Project Installation

```bash
bun add -D tsdx
```

## Commands

### `tsdx create <name>`

Create a new TypeScript package from a template.

```bash
# Interactive template selection
bunx tsdx create mylib

# Specify template directly
bunx tsdx create mylib --template react
```

**Available Templates:**

| Template | Description |
|----------|-------------|
| `basic` | A basic TypeScript library with vitest |
| `react` | A React component library with Testing Library |

### `tsdx build`

Build the package for production using [bunchee](https://github.com/huozhi/bunchee).

```bash
tsdx build

# Skip cleaning dist folder
tsdx build --no-clean
```

Outputs ESM and CommonJS formats with TypeScript declarations.

### `tsdx dev` / `tsdx watch`

Start development mode with file watching.

```bash
tsdx dev
```

Rebuilds automatically when files change.

### `tsdx test`

Run tests using [vitest](https://vitest.dev/).

```bash
# Run tests once
tsdx test

# Watch mode
tsdx test --watch

# With coverage
tsdx test --coverage

# Update snapshots
tsdx test --update
```

### `tsdx lint`

Lint the codebase using [oxlint](https://oxc.rs/docs/guide/usage/linter.html).

```bash
# Lint src and test directories (default)
tsdx lint

# Lint specific paths
tsdx lint src lib

# Auto-fix issues
tsdx lint --fix

# Use custom config
tsdx lint --config .oxlintrc.json
```

### `tsdx format`

Format the codebase using [oxfmt](https://oxc.rs/docs/guide/usage/formatter).

```bash
# Format all files
tsdx format

# Check formatting without changes
tsdx format --check

# Format specific paths
tsdx format src test
```

### `tsdx typecheck`

Run TypeScript type checking.

```bash
tsdx typecheck

# Watch mode
tsdx typecheck --watch
```

### `tsdx init`

Initialize tsdx configuration in an existing project.

```bash
bunx tsdx init
```

This adds the necessary configuration to your `package.json`, creates `tsconfig.json` and `vitest.config.ts` if they don't exist.

## Project Structure

Projects created with tsdx follow this structure:

```
mylib/
├── src/
│   └── index.ts          # Library entry point
├── test/
│   └── index.test.ts     # Tests (vitest)
├── dist/                  # Build output (generated)
│   ├── index.js          # ESM
│   ├── index.cjs         # CommonJS
│   └── index.d.ts        # TypeScript declarations
├── .github/
│   └── workflows/        # CI/CD workflows
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── LICENSE
└── README.md
```

### React Template Additional Structure

```
mylib/
├── src/
│   └── index.tsx         # React component entry
├── test/
│   └── index.test.tsx    # Tests with Testing Library
├── example/              # Demo app (Vite-powered)
│   ├── index.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── ...
```

## Module Formats

TSDX outputs both ESM and CommonJS formats:

| File | Format | Usage |
|------|--------|-------|
| `dist/index.js` | ESM | Modern bundlers, Node.js with `type: "module"` |
| `dist/index.cjs` | CommonJS | Legacy Node.js, older bundlers |
| `dist/index.d.ts` | TypeScript | Type definitions |
| `dist/index.d.cts` | TypeScript | CJS type definitions |

The `package.json` exports field is configured automatically:

```json
{
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./package.json": "./package.json"
  }
}
```

## Tool Stack

TSDX 2.0 uses modern, high-performance tools:

| Tool | Purpose | Performance |
|------|---------|-------------|
| [bunchee](https://github.com/huozhi/bunchee) | Bundling | Zero-config, built on Rollup + SWC |
| [vitest](https://vitest.dev/) | Testing | Vite-native, Jest-compatible API |
| [oxlint](https://oxc.rs/docs/guide/usage/linter.html) | Linting | 50-100x faster than ESLint |
| [oxfmt](https://oxc.rs/docs/guide/usage/formatter) | Formatting | 35x faster than Prettier |
| [bun](https://bun.sh/) | Package Management | Native speed, npm-compatible |

## Configuration

### TypeScript (`tsconfig.json`)

TSDX creates a modern TypeScript configuration:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "declaration": true,
    "declarationMap": true
  }
}
```

### Vitest (`vitest.config.ts`)

Default test configuration:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // or 'jsdom' for React
  },
});
```

### Linting (`.oxlintrc.json`)

Optional oxlint configuration:

```json
{
  "rules": {
    "no-unused-vars": "warn"
  }
}
```

### Formatting (`.oxfmtrc.json`)

Optional oxfmt configuration:

```json
{
  "indentWidth": 2,
  "lineWidth": 100
}
```

## Requirements

- **Node.js**: 20+ (LTS)
- **Bun**: Latest version

### Installing Bun

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1 | iex"

# npm (alternative)
npm install -g bun
```

## Migrating from TSDX v0.x

See the [Migration Guide](./MIGRATION.md) for detailed instructions on upgrading from the original TSDX.

**Quick summary:**
1. Install bun
2. Update `package.json` scripts to use tsdx commands
3. Replace Jest with vitest
4. Replace ESLint with oxlint (optional)
5. Replace Prettier with oxfmt (optional)
6. Run `bun install`

## Publishing

```bash
# Build the package
bun run build

# Publish to npm
npm publish
```

We recommend using [np](https://github.com/sindresorhus/np) or [changesets](https://github.com/changesets/changesets) for publishing.

## FAQ

### Why bun?

Bun provides significantly faster package installation and script execution. It's compatible with npm packages and the Node.js ecosystem.

### Can I still use npm/yarn/pnpm?

The generated projects use bun for package management, but the built packages are compatible with any package manager. Your library consumers can use npm, yarn, pnpm, or bun.

### Why oxlint instead of ESLint?

oxlint is 50-100x faster than ESLint while catching the most important issues. For comprehensive linting, you can still use ESLint alongside oxlint.

### Is this compatible with the old TSDX?

The build output format is fully compatible. Your library consumers won't notice any difference. However, the development workflow and configuration are different.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Acknowledgments

TSDX 2.0 is built on the shoulders of giants:

- [bunchee](https://github.com/huozhi/bunchee) by Jiachi Liu
- [vitest](https://vitest.dev/) by the Vitest team
- [oxc](https://oxc.rs/) by the OXC team
- [bun](https://bun.sh/) by the Bun team

## Author

- [Jared Palmer](https://twitter.com/jaredpalmer)

## License

[MIT](./LICENSE)
