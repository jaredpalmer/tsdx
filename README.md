# TSDX

Zero-config CLI for TypeScript package development.

[![CI](https://github.com/jaredpalmer/tsdx/actions/workflows/nodejs.yml/badge.svg)](https://github.com/jaredpalmer/tsdx/actions/workflows/nodejs.yml)

Modern TypeScript library development, simplified. TSDX provides a zero-config CLI that helps you develop, test, and publish TypeScript packages with ease.

## Features

- **Zero config** - Sensible defaults, just start coding
- **Modern tooling** - Built on [bunchee](https://github.com/huozhi/bunchee), [vitest](https://vitest.dev/), [oxlint](https://oxc.rs/docs/guide/usage/linter.html), and [oxfmt](https://oxc.rs/docs/guide/usage/formatter)
- **Dual ESM/CJS** - Automatic dual module builds with proper exports
- **TypeScript first** - Full TypeScript support with declaration generation
- **Lightning fast** - Rust-powered linting (50-100x faster than ESLint) and formatting (35x faster than Prettier)
- **Bun-native** - Uses bun for package management

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

## Commands

### `tsdx create <name>`

Create a new TypeScript package from a template.

```bash
# Interactive template selection
bunx tsdx create mylib

# Specify template directly
bunx tsdx create mylib --template react
```

**Templates:**
- `basic` - A basic TypeScript library
- `react` - A React component library

### `tsdx build`

Build the package for production using [bunchee](https://github.com/huozhi/bunchee).

```bash
bun run build
```

Outputs ESM and CommonJS formats with TypeScript declarations.

### `tsdx dev` / `tsdx watch`

Start development mode with file watching.

```bash
bun run dev
```

### `tsdx test`

Run tests using [vitest](https://vitest.dev/).

```bash
# Run tests once
bun run test

# Watch mode
bun run test:watch

# With coverage
bun run test --coverage
```

### `tsdx lint`

Lint the codebase using [oxlint](https://oxc.rs/docs/guide/usage/linter.html).

```bash
# Lint src and test directories
bun run lint

# Auto-fix issues
bun run lint --fix
```

### `tsdx format`

Format the codebase using [oxfmt](https://oxc.rs/docs/guide/usage/formatter).

```bash
# Format all files
bun run format

# Check formatting without changes
bun run format --check
```

### `tsdx typecheck`

Run TypeScript type checking.

```bash
bun run typecheck

# Watch mode
bun run typecheck --watch
```

### `tsdx init`

Initialize tsdx configuration in an existing project.

```bash
bunx tsdx init
```

## Project Structure

Projects created with tsdx follow this structure:

```
mylib/
├── src/
│   └── index.ts        # Library entry point
├── test/
│   └── index.test.ts   # Tests
├── dist/               # Build output
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

## Module Formats

TSDX outputs both ESM and CommonJS formats:

- `dist/index.js` - ESM module
- `dist/index.cjs` - CommonJS module
- `dist/index.d.ts` - TypeScript declarations

The `package.json` exports field is configured automatically for proper resolution.

## Tool Stack

| Tool | Purpose | Speed |
|------|---------|-------|
| [bunchee](https://github.com/huozhi/bunchee) | Bundling | Built on Rollup + SWC |
| [vitest](https://vitest.dev/) | Testing | Powered by Vite |
| [oxlint](https://oxc.rs/docs/guide/usage/linter.html) | Linting | 50-100x faster than ESLint |
| [oxfmt](https://oxc.rs/docs/guide/usage/formatter) | Formatting | 35x faster than Prettier |
| [bun](https://bun.sh/) | Package management | Native speed |

## Requirements

- Node.js 20+ (LTS)
- Bun (for package management)

## Migration from TSDX v0.x

If you're migrating from the original TSDX:

1. Install bun: `curl -fsSL https://bun.sh/install | bash`
2. Update your `package.json` scripts to use the new commands
3. Replace Jest config with `vitest.config.ts`
4. Replace ESLint config with `.oxlintrc.json` (optional)
5. Replace Prettier config with `.oxfmtrc.jsonc` (optional)
6. Run `bun install` to install dependencies

The build output format is compatible - your consumers won't notice any difference.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Author

- [Jared Palmer](https://twitter.com/jaredpalmer)

## License

[MIT](./LICENSE)
