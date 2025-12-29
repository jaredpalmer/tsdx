# Migration Guide: TSDX v0.x to v1.0

This guide helps you migrate from the original TSDX (v0.x) to the modern TSDX 1.0.

## What's Changed

TSDX 1.0 is a complete rewrite that replaces the original toolchain with modern, high-performance alternatives:

| Old (v0.x) | New (v1.0) | Why |
|------------|------------|-----|
| Rollup + Babel | [bunchee](https://github.com/huozhi/bunchee) | Zero-config, SWC-powered, faster |
| Jest | [vitest](https://vitest.dev/) | Vite-native, faster, Jest-compatible |
| ESLint | [oxlint](https://oxc.rs/) | 50-100x faster, Rust-powered |
| Prettier | [oxfmt](https://oxc.rs/) | 35x faster, Rust-powered |
| yarn/npm | [bun](https://bun.sh/) | Faster installs and execution |
| Node 10+ | Node 20+ | LTS only |

## Quick Migration

For most projects, follow these steps:

### 1. Install Bun

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1 | iex"
```

### 2. Update package.json

Replace your scripts:

```json
{
  "scripts": {
    "dev": "tsdx dev",
    "build": "tsdx build",
    "test": "tsdx test",
    "lint": "tsdx lint",
    "format": "tsdx format",
    "typecheck": "tsdx typecheck",
    "prepublishOnly": "bun run build"
  }
}
```

### 3. Update Dependencies

Remove old dependencies and add new ones:

```bash
# Remove old dependencies
bun remove tsdx rollup @rollup/plugin-* babel-* @babel/* jest ts-jest eslint @typescript-eslint/* prettier husky lint-staged

# Add new tsdx
bun add -D tsdx typescript
```

### 4. Replace Jest with Vitest

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // or 'jsdom' for React/DOM testing
  },
});
```

Update test files:
- Change `import { describe, it, expect } from 'jest'` to `import { describe, it, expect } from 'vitest'`
- Or use `globals: true` in vitest.config.ts to avoid imports

**Jest to Vitest Cheatsheet:**

| Jest | Vitest |
|------|--------|
| `jest.fn()` | `vi.fn()` |
| `jest.mock()` | `vi.mock()` |
| `jest.spyOn()` | `vi.spyOn()` |
| `jest.useFakeTimers()` | `vi.useFakeTimers()` |
| `beforeAll/afterAll` | Same |
| `beforeEach/afterEach` | Same |
| `describe/it/test` | Same |
| `expect()` | Same |

### 5. Remove Old Config Files

Delete these files (they're no longer needed):

```bash
rm -f tsdx.config.js
rm -f jest.config.js
rm -f .babelrc babel.config.js babel.config.json
rm -f .eslintrc .eslintrc.js .eslintrc.json .eslintignore
rm -f .prettierrc .prettierrc.js .prettierrc.json .prettierignore
rm -f rollup.config.js
rm -f yarn.lock package-lock.json
```

### 6. Update tsconfig.json

Update to modern settings:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### 7. Update package.json Exports

Ensure your package.json has modern exports:

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
  },
  "files": ["dist", "src"],
  "engines": {
    "node": ">=20"
  }
}
```

### 8. Install and Test

```bash
# Install dependencies
bun install

# Run tests
bun run test

# Build
bun run build

# Lint
bun run lint
```

## Detailed Migration

### Build Configuration

**Old TSDX (tsdx.config.js):**
```javascript
module.exports = {
  rollup(config, options) {
    // Custom rollup config
    return config;
  },
};
```

**New TSDX:** No configuration needed! bunchee reads your `package.json` exports field.

For advanced customization, create `bunchee.config.ts`:
```typescript
import { BuncheeConfig } from 'bunchee';

export default {
  // See bunchee documentation
} satisfies BuncheeConfig;
```

### Testing

**Old Jest test:**
```typescript
import { sum } from './index';

describe('sum', () => {
  it('adds numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
```

**New Vitest test (same syntax!):**
```typescript
import { describe, it, expect } from 'vitest';
import { sum } from './index';

describe('sum', () => {
  it('adds numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
```

Or with `globals: true` in vitest.config.ts:
```typescript
import { sum } from './index';

describe('sum', () => {
  it('adds numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
```

### React Testing

**Old (enzyme/react-testing-library with Jest):**
```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

test('renders', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

**New (same, just with Vitest!):**
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeDefined();
  });
});
```

Note: Replace `toBeInTheDocument()` with `toBeDefined()` or add `@testing-library/jest-dom` and configure in vitest setup.

### Linting

**Old ESLint (.eslintrc.js):**
```javascript
module.exports = {
  extends: ['react-app', 'prettier'],
  rules: {
    'no-unused-vars': 'warn',
  },
};
```

**New oxlint (.oxlintrc.json) - optional:**
```json
{
  "rules": {
    "no-unused-vars": "warn"
  }
}
```

Most ESLint rules have equivalents in oxlint. Check [oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules.html).

### Formatting

**Old Prettier (.prettierrc):**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2
}
```

**New oxfmt (.oxfmtrc.json) - optional:**
```json
{
  "indentWidth": 2,
  "lineWidth": 100
}
```

### GitHub Actions

**Old workflow:**
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [12, 14, 16]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node }}
      - run: yarn install
      - run: yarn build
      - run: yarn test
```

**New workflow:**
```yaml
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        node: ['20', '22']
        os: [ubuntu-latest, windows-latest, macos-latest]
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: bun install
      - run: bun run lint
      - run: bun run typecheck
      - run: bun run build
      - run: bun run test
```

## Breaking Changes

### Removed Features

1. **Storybook template** - Use [Storybook CLI](https://storybook.js.org/docs/get-started/install) directly
2. **Custom Rollup config** - Use bunchee config or raw rollup if needed
3. **tsdx lint** - Now wraps oxlint instead of ESLint
4. **Node.js < 20** - Only Node.js 20+ (LTS) is supported

### Changed Behavior

1. **Build output** - Slightly different but compatible
2. **Watch mode** - Now uses bunchee's watch, may have different behavior
3. **Test runner** - Vitest instead of Jest (mostly compatible API)
4. **Default branch** - Uses `main` instead of `master` in templates

## Compatibility

### Your Library Consumers

**No changes needed!** The build output format is compatible:
- ESM and CommonJS dual publish
- TypeScript declarations
- Same export patterns

### Your Development Workflow

| Task | Old Command | New Command |
|------|-------------|-------------|
| Create project | `npx tsdx create mylib` | `bunx tsdx create mylib` |
| Development | `yarn start` | `bun run dev` |
| Build | `yarn build` | `bun run build` |
| Test | `yarn test` | `bun run test` |
| Lint | `yarn lint` | `bun run lint` |
| Format | `yarn prettier --write .` | `bun run format` |

## Troubleshooting

### "bun: command not found"

Install bun:
```bash
curl -fsSL https://bun.sh/install | bash
```

### Tests fail with "vi is not defined"

Add vitest imports:
```typescript
import { describe, it, expect, vi } from 'vitest';
```

Or enable globals in `vitest.config.ts`:
```typescript
export default defineConfig({
  test: {
    globals: true,
  },
});
```

### TypeScript errors with moduleResolution

Update tsconfig.json:
```json
{
  "compilerOptions": {
    "moduleResolution": "bundler"
  }
}
```

### ESM/CJS interop issues

Ensure your package.json has:
```json
{
  "type": "module"
}
```

### "Cannot find module" in tests

Check your vitest.config.ts has correct paths:
```typescript
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
  },
});
```

## Getting Help

- [TSDX GitHub Issues](https://github.com/jaredpalmer/tsdx/issues)
- [Vitest Documentation](https://vitest.dev/)
- [bunchee Documentation](https://github.com/huozhi/bunchee)
- [oxlint Documentation](https://oxc.rs/docs/guide/usage/linter.html)
- [Bun Documentation](https://bun.sh/docs)
