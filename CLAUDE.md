# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TSDX is a zero-config CLI for TypeScript package development. Version 2.0 is a complete rewrite using modern Rust-based tooling: bunchee (bundling), vitest (testing), oxlint (linting), and oxfmt (formatting).

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

## Documentation Website

The documentation site is in `./website/` and built with:
- **Next.js 16** - React framework
- **Fumadocs** - Documentation framework (fumadocs-core, fumadocs-mdx, fumadocs-ui)
- **Tailwind CSS v4** - CSS-first configuration
- **IBM Plex Sans/Mono** - Typography via next/font/google

### Website Commands

```bash
cd website
bun install              # Install dependencies
bun run dev              # Start dev server
bun run build            # Build for production
```

### Content Structure

- `content/docs/` - MDX documentation files
- `content/docs/meta.json` - Sidebar navigation structure
- `app/` - Next.js App Router pages
- `app/layout.config.tsx` - Navigation and logo configuration

### Adding Documentation Pages

1. Create `.mdx` file in `content/docs/`
2. Add frontmatter with `title` and `description`
3. Add page to `content/docs/meta.json` in desired position
4. Use `---Section Name---` syntax in meta.json for sidebar sections

## Commit Convention

Uses Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`

## Release Process

Uses [changesets](https://github.com/changesets/changesets) for version management and npm publishing.

### Creating a Changeset

When making changes that should be released:
```bash
bun run changeset
```
Follow the prompts to select version bump type (patch/minor/major) and describe the change.

### Release Workflow

1. Create a changeset with your PR
2. Merge PR to main
3. GitHub Action creates a "Release" PR with version bumps
4. Merge the Release PR to publish to npm

### Manual Release

```bash
bun run changeset version  # Apply version bumps from changesets
bun run release            # Build and publish to npm
```
