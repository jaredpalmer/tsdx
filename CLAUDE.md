# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TSDX is a zero-config CLI for TypeScript package development. Version 1.0 is a complete rewrite using modern Rust-based tooling: bunchee (bundling), vitest (testing), oxlint (linting), and oxfmt (formatting).

## Development Commands

```bash
bun install              # Install dependencies
bun run build            # Build CLI with bunchee
bun run dev              # Watch mode (rebuilds on changes)
bun run test             # Run all tests with vitest
bun run test:watch       # Run tests in watch mode
bun run test test/cli.test.ts   # Run a specific test file
bun run lint             # Lint with oxlint
bun run typecheck        # TypeScript type checking
bun run format           # Format with oxfmt
bun run format:check     # Check formatting
```

## Testing Notes

Tests require a build first since they test the compiled CLI:
```bash
bun run build && bun run test
```

The e2e tests create projects in temp directories and have longer timeouts (60s).

## Architecture

**Single CLI Entry Point**: `src/index.ts` contains all CLI commands using Commander.js:
- `create` - scaffolds projects from templates, installs deps with bun
- `build/dev` - wraps bunchee
- `test` - wraps vitest
- `lint` - wraps oxlint
- `format` - wraps oxfmt
- `typecheck` - wraps tsc
- `init` - adds tsdx config to existing project

**Templates**: `templates/basic/` and `templates/react/` are copied directly during `create`. Template `gitignore` files are renamed to `.gitignore` post-copy. `<year>` and `<author>` placeholders in LICENSE are replaced.

## Adding a New Template

1. Create directory in `templates/`
2. Register in `src/index.ts` in the `templates` object
3. Include: package.json, tsconfig.json, vitest.config.ts, src/, test/, gitignore (not .gitignore), LICENSE with `<year>` and `<author>` placeholders

## Commit Convention

Uses Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`
