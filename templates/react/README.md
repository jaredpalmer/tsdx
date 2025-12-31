# TSDX React Component Library

Zero-config React component library development powered by modern tools.

## Quick Start

```bash
# Install dependencies
bun install

# Start development mode
bun run dev

# Build for production
bun run build

# Run tests
bun run test

# Lint code
bun run lint

# Format code
bun run format
```

## Project Structure

```
/src
  index.tsx       # Your component entry point
/test
  index.test.tsx  # Tests using bun test + Testing Library
/example
  index.tsx       # Demo app using Vite
.gitignore
package.json
README.md
tsconfig.json
```

## Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start development mode with watch |
| `bun run build` | Build for production |
| `bun run test` | Run tests |
| `bun run test:watch` | Run tests in watch mode |
| `bun run lint` | Lint code |
| `bun run format` | Format code |
| `bun run format:check` | Check if code is formatted |
| `bun run typecheck` | Run TypeScript type checking |

## Tools

TSDX wraps these modern, high-performance tools:

- **[Bunchee](https://github.com/huozhi/bunchee)** - Zero-config bundler for npm packages
- **[Bun Test](https://bun.sh/docs/cli/test)** - Fast, built-in test runner
- **[Testing Library](https://testing-library.com/)** - React testing utilities
- **[Oxlint](https://oxc.rs/docs/guide/usage/linter.html)** - Rust-powered linter (50-100x faster than ESLint)
- **[Oxfmt](https://oxc.rs/docs/guide/usage/formatter)** - Rust-powered formatter (35x faster than Prettier)
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

## Development with Example

To test your component in a real React app:

```bash
# In one terminal, start the library in watch mode
bun run dev

# In another terminal, run the example app
cd example
bun install
bun run dev
```

## Module Formats

This library exports both ESM and CommonJS formats, with full TypeScript support:

- `dist/index.js` - ESM
- `dist/index.cjs` - CommonJS
- `dist/index.d.ts` - TypeScript declarations

## Publishing

```bash
# Build the package
bun run build

# Publish to npm
npm publish
```

We recommend using [np](https://github.com/sindresorhus/np) for publishing.

## License

MIT
