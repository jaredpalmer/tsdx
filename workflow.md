# GitHub Actions Workflow Updates

This document contains the updated GitHub Actions workflow configurations that need to be applied to complete the TSDX modernization. These changes require `workflows` permission to push.

## Instructions

Replace the contents of each workflow file with the corresponding configuration below.

---

## `.github/workflows/nodejs.yml`

Replace the entire file with:

```yaml
name: CI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  build:
    name: Build, lint, and test on Node ${{ matrix.node }} and ${{ matrix.os }}
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        node: ['20', '22']
        os: [ubuntu-latest, windows-latest, macos-latest]

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Setup Node.js ${{ matrix.node }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}

      - name: Install dependencies
        run: bun install

      - name: Lint
        run: bun run lint

      - name: Type check
        run: bun run typecheck

      - name: Build
        run: bun run build

      - name: Test
        run: bun run test
```

---

## `templates/basic/.github/workflows/main.yml`

Replace the entire file with:

```yaml
name: CI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  build:
    name: Build, lint, and test on Node ${{ matrix.node }} and ${{ matrix.os }}
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        node: ['20', '22']
        os: [ubuntu-latest, windows-latest, macos-latest]

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Setup Node.js ${{ matrix.node }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}

      - name: Install dependencies
        run: bun install

      - name: Lint
        run: bun run lint

      - name: Type check
        run: bun run typecheck

      - name: Test
        run: bun run test

      - name: Build
        run: bun run build
```

---

## `templates/basic/.github/workflows/size.yml`

Replace the entire file with:

```yaml
name: Size

on:
  pull_request:
    branches: [main, master]

jobs:
  size:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Build
        run: bun run build

      - name: Check bundle size
        run: |
          echo "📦 Bundle size:"
          du -sh dist/*
```

---

## `templates/react/.github/workflows/main.yml`

Replace the entire file with:

```yaml
name: CI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  build:
    name: Build, lint, and test on Node ${{ matrix.node }} and ${{ matrix.os }}
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        node: ['20', '22']
        os: [ubuntu-latest, windows-latest, macos-latest]

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Setup Node.js ${{ matrix.node }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}

      - name: Install dependencies
        run: bun install

      - name: Lint
        run: bun run lint

      - name: Type check
        run: bun run typecheck

      - name: Test
        run: bun run test

      - name: Build
        run: bun run build
```

---

## `templates/react/.github/workflows/size.yml`

Replace the entire file with:

```yaml
name: Size

on:
  pull_request:
    branches: [main, master]

jobs:
  size:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Build
        run: bun run build

      - name: Check bundle size
        run: |
          echo "📦 Bundle size:"
          du -sh dist/*
```

---

## Key Changes Summary

1. **Node versions**: Updated from `10.x, 12.x, 14.x` to `20, 22` (LTS only)
2. **Package manager**: Changed from `yarn` to `bun`
3. **Actions versions**: Updated to v4 (`actions/checkout@v4`, `actions/setup-node@v4`)
4. **Added Bun setup**: Using `oven-sh/setup-bun@v2`
5. **Simplified jobs**: Removed separate lint-and-dedupe job, combined into single build job
6. **Added type checking**: New `bun run typecheck` step
7. **Removed old scripts**: No more `yarn lint:post-build`, `yarn deduplicate:check`, etc.
8. **macOS naming**: Changed `macOS-latest` to `macos-latest` (lowercase)
