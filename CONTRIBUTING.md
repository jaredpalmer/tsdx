# Contributing to TSDX

Thanks for your interest in TSDX! Contributions are welcome.

If you're proposing a new feature, please [open an issue](https://github.com/jaredpalmer/tsdx/issues/new/choose) first to discuss it.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ (LTS)
- [Bun](https://bun.sh/) (latest version)

### Installing Bun

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1 | iex"
```

## Setup

1. Fork this repository to your own GitHub account and clone it:

   ```bash
   git clone https://github.com/your-username/tsdx.git
   cd tsdx
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Build the CLI:

   ```bash
   bun run build
   ```

4. Link for local development:

   ```bash
   bun link
   ```

   Now you can use `tsdx` commands globally and they'll run your local version.

## Development Workflow

### Building

```bash
# Build once
bun run build

# Watch mode (rebuilds on changes)
bun run dev
```

### Testing

```bash
# Run all tests
bun run test

# Watch mode
bun run test:watch

# Run specific test file
bun run test test/cli.test.ts
```

### Linting

```bash
# Lint the codebase
bun run lint

# Auto-fix issues
bun run lint --fix
```

### Type Checking

```bash
bun run typecheck
```

### Formatting

```bash
# Format all files
bun run format

# Check formatting
bun run format:check
```

## Testing Your Changes

### Testing the CLI

After building, test your changes by creating a new project:

```bash
# Create a test project
cd /tmp
tsdx create test-project --template basic
cd test-project

# Verify it works
bun run build
bun run test
```

### Testing Templates

Templates are in the `templates/` directory. After modifying a template:

1. Build tsdx: `bun run build`
2. Create a new project: `tsdx create test-project --template <template-name>`
3. Verify the generated project works correctly

## Project Structure

```
tsdx/
├── src/
│   └── index.ts          # CLI entry point
├── templates/
│   ├── basic/            # Basic TypeScript template
│   └── react/            # React component template
├── test/
│   ├── cli.test.ts       # CLI unit tests
│   └── e2e.test.ts       # End-to-end tests
├── package.json
└── tsconfig.json
```

## Submitting a PR

1. Create a feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes

3. Run all checks:
   ```bash
   bun run lint
   bun run typecheck
   bun run test
   bun run build
   ```

4. Commit your changes with a descriptive message:
   ```bash
   git commit -m "feat: add new feature"
   ```

5. Push and create a pull request:
   ```bash
   git push origin feature/my-feature
   ```

### Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Test changes
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

## Adding a New Template

1. Create a new directory in `templates/`:
   ```bash
   mkdir templates/my-template
   ```

2. Add the template files (use `basic` as reference)

3. Register the template in `src/index.ts`:
   ```typescript
   const templates = {
     basic: { ... },
     react: { ... },
     'my-template': {
       name: 'my-template',
       description: 'Description of my template',
     },
   };
   ```

4. Add tests for the new template

5. Update the README to document the new template

## Questions?

Feel free to [open an issue](https://github.com/jaredpalmer/tsdx/issues) if you have questions or need help.
