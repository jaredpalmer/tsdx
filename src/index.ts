#!/usr/bin/env node

import { program } from 'commander';
import pc from 'picocolors';
import fs from 'fs-extra';
import path from 'path';
import { execa, execaCommand } from 'execa';
import ora from 'ora';
import Enquirer from 'enquirer';

const { Select, Input } = Enquirer as unknown as {
  Select: new (options: { message: string; choices: { name: string; message: string }[] }) => { run: () => Promise<string> };
  Input: new (options: { message: string; initial?: string }) => { run: () => Promise<string> };
};

// Read package.json for version
const pkgPath = path.resolve(__dirname, '../package.json');
const pkg = fs.readJSONSync(pkgPath);

// Path constants
const paths = {
  appRoot: process.cwd(),
  appPackageJson: path.resolve(process.cwd(), 'package.json'),
  appDist: path.resolve(process.cwd(), 'dist'),
  appSrc: path.resolve(process.cwd(), 'src'),
};

// Template definitions
const templates = {
  basic: {
    name: 'basic',
    description: 'A basic TypeScript library',
  },
  react: {
    name: 'react',
    description: 'A React component library',
  },
} as const;

type TemplateName = keyof typeof templates;

// ASCII banner
const banner = `
${pc.cyan('████████╗███████╗██████╗ ██╗  ██╗')}
${pc.cyan('╚══██╔══╝██╔════╝██╔══██╗╚██╗██╔╝')}
${pc.cyan('   ██║   ███████╗██║  ██║ ╚███╔╝ ')}
${pc.cyan('   ██║   ╚════██║██║  ██║ ██╔██╗ ')}
${pc.cyan('   ██║   ███████║██████╔╝██╔╝ ██╗')}
${pc.cyan('   ╚═╝   ╚══════╝╚═════╝ ╚═╝  ╚═╝')}
${pc.dim('Zero-config TypeScript package development')}
${pc.dim('Powered by bunchee, oxlint, vitest')}
`;

program
  .name('tsdx')
  .description('Zero-config TypeScript package development')
  .version(pkg.version);

// CREATE command
program
  .command('create <name>')
  .description('Create a new TypeScript package')
  .option('-t, --template <template>', 'Template to use (basic, react)')
  .action(async (name: string, options: { template?: string }) => {
    console.log(banner);

    const spinner = ora();

    try {
      // Check if folder exists
      const projectPath = path.resolve(process.cwd(), name);
      if (await fs.pathExists(projectPath)) {
        console.log(pc.red(`Error: Directory "${name}" already exists`));
        process.exit(1);
      }

      // Select template
      let templateName: TemplateName;
      if (options.template && options.template in templates) {
        templateName = options.template as TemplateName;
      } else {
        const prompt = new Select({
          message: 'Choose a template',
          choices: Object.entries(templates).map(([key, val]) => ({
            name: key,
            message: `${key} - ${val.description}`,
          })),
        });
        templateName = (await prompt.run()) as TemplateName;
      }

      spinner.start(`Creating ${pc.green(name)}...`);

      // Copy template
      const templatePath = path.resolve(__dirname, `../templates/${templateName}`);
      await fs.copy(templatePath, projectPath);

      // Rename gitignore
      const gitignorePath = path.resolve(projectPath, 'gitignore');
      if (await fs.pathExists(gitignorePath)) {
        await fs.move(gitignorePath, path.resolve(projectPath, '.gitignore'));
      }

      // Get author name
      let author = '';
      try {
        const { stdout } = await execa('git', ['config', '--global', 'user.name']);
        author = stdout.trim();
      } catch {
        // Ignore if git config fails
      }

      if (!author) {
        spinner.stop();
        const authorPrompt = new Input({
          message: 'Who is the package author?',
          initial: '',
        });
        author = await authorPrompt.run();
        spinner.start();
      }

      // Update package.json
      const pkgJsonPath = path.resolve(projectPath, 'package.json');
      const pkgJson = await fs.readJSON(pkgJsonPath);
      pkgJson.name = name;
      pkgJson.author = author;
      await fs.writeJSON(pkgJsonPath, pkgJson, { spaces: 2 });

      // Update LICENSE
      const licensePath = path.resolve(projectPath, 'LICENSE');
      if (await fs.pathExists(licensePath)) {
        let license = await fs.readFile(licensePath, 'utf-8');
        license = license.replace(/<year>/g, new Date().getFullYear().toString());
        license = license.replace(/<author>/g, author);
        await fs.writeFile(licensePath, license);
      }

      spinner.succeed(`Created ${pc.green(name)}`);

      // Install dependencies
      spinner.start('Installing dependencies with bun...');
      process.chdir(projectPath);
      await execa('bun', ['install']);
      spinner.succeed('Installed dependencies');

      // Success message
      console.log(`
${pc.green('Success!')} Created ${pc.cyan(name)} at ${pc.dim(projectPath)}

Inside that directory, you can run:

  ${pc.cyan('bun run dev')}      Start the dev server
  ${pc.cyan('bun run build')}    Build for production
  ${pc.cyan('bun run test')}     Run tests
  ${pc.cyan('bun run lint')}     Lint the codebase
  ${pc.cyan('bun run format')}   Format the codebase

We suggest that you begin by typing:

  ${pc.cyan('cd')} ${name}
  ${pc.cyan('bun run dev')}
`);
    } catch (error) {
      spinner.fail('Failed to create project');
      console.error(error);
      process.exit(1);
    }
  });

// BUILD command
program
  .command('build')
  .description('Build the package for production')
  .option('--no-clean', 'Skip cleaning the dist folder')
  .action(async (options: { clean: boolean }) => {
    const spinner = ora();

    try {
      if (options.clean) {
        spinner.start('Cleaning dist folder...');
        await fs.remove(paths.appDist);
        spinner.succeed('Cleaned dist folder');
      }

      spinner.start('Building with bunchee...');
      await execaCommand('bunchee', { stdio: 'inherit' });
      spinner.succeed('Build complete');
    } catch (error) {
      spinner.fail('Build failed');
      console.error(error);
      process.exit(1);
    }
  });

// DEV/WATCH command
program
  .command('dev')
  .alias('watch')
  .description('Start development mode with watch')
  .action(async () => {
    console.log(pc.cyan('Starting development mode...'));
    try {
      await execaCommand('bunchee --watch', { stdio: 'inherit' });
    } catch {
      console.error(pc.red('Development mode failed'));
      process.exit(1);
    }
  });

// TEST command
program
  .command('test')
  .description('Run tests with vitest')
  .option('-w, --watch', 'Run in watch mode')
  .option('-c, --coverage', 'Run with coverage')
  .option('-u, --update', 'Update snapshots')
  .allowUnknownOption(true)
  .action(async (options: { watch?: boolean; coverage?: boolean; update?: boolean }, command) => {
    const args = ['vitest'];

    if (!options.watch) {
      args.push('run');
    }

    if (options.coverage) {
      args.push('--coverage');
    }

    if (options.update) {
      args.push('--update');
    }

    // Pass through any additional arguments
    const extraArgs = command.args || [];
    args.push(...extraArgs);

    try {
      await execa('bunx', args, { stdio: 'inherit' });
    } catch (error: unknown) {
      // Vitest exits with non-zero on test failure, which is expected
      const exitCode = (error as { exitCode?: number }).exitCode ?? 1;
      process.exit(exitCode);
    }
  });

// LINT command
program
  .command('lint')
  .description('Lint and type-check the codebase with oxlint (type-aware)')
  .option('-f, --fix', 'Auto-fix fixable issues')
  .option('--no-typecheck', 'Disable type-checking (only lint)')
  .option('--no-type-aware', 'Disable type-aware rules (faster, but fewer checks)')
  .option('--config <path>', 'Path to config file')
  .argument('[paths...]', 'Paths to lint', ['src', 'test'])
  .action(
    async (
      lintPaths: string[],
      options: { fix?: boolean; typecheck?: boolean; typeAware?: boolean; config?: string }
    ) => {
      const args = ['oxlint'];

      // Filter to existing paths
      const existingPaths = lintPaths.filter((p) => fs.existsSync(path.resolve(process.cwd(), p)));

      if (existingPaths.length === 0) {
        console.log(pc.yellow('No valid paths to lint'));
        return;
      }

      args.push(...existingPaths);

      // Enable type-aware linting by default (requires oxlint-tsgolint)
      if (options.typeAware !== false) {
        args.push('--type-aware');

        // Enable type-checking alongside linting by default
        if (options.typecheck !== false) {
          args.push('--type-check');
        }
      }

      if (options.fix) {
        args.push('--fix');
      }

      if (options.config) {
        args.push('--config', options.config);
      }

      try {
        await execa('bunx', args, { stdio: 'inherit' });
        console.log(pc.green('Linting complete'));
      } catch (error: unknown) {
        const exitCode = (error as { exitCode?: number }).exitCode ?? 1;
        process.exit(exitCode);
      }
    }
  );

// FORMAT command
program
  .command('format')
  .description('Format the codebase with oxfmt')
  .option('-c, --check', 'Check if files are formatted')
  .argument('[paths...]', 'Paths to format', ['.'])
  .action(async (formatPaths: string[], options: { check?: boolean }) => {
    const args = ['oxfmt'];

    if (options.check) {
      args.push('--check');
    } else {
      args.push('--write');
    }

    args.push(...formatPaths);

    try {
      await execa('bunx', args, { stdio: 'inherit' });
      if (options.check) {
        console.log(pc.green('All files are formatted'));
      } else {
        console.log(pc.green('Formatting complete'));
      }
    } catch (error: unknown) {
      const exitCode = (error as { exitCode?: number }).exitCode ?? 1;
      process.exit(exitCode);
    }
  });

// TYPECHECK command
program
  .command('typecheck')
  .description('Run TypeScript type checking')
  .option('-w, --watch', 'Run in watch mode')
  .action(async (options: { watch?: boolean }) => {
    const args = ['tsc', '--noEmit'];

    if (options.watch) {
      args.push('--watch');
    }

    try {
      await execa('bunx', args, { stdio: 'inherit' });
      console.log(pc.green('Type checking complete'));
    } catch (error: unknown) {
      const exitCode = (error as { exitCode?: number }).exitCode ?? 1;
      process.exit(exitCode);
    }
  });

// INIT command - initialize tsdx in an existing project
program
  .command('init')
  .description('Initialize tsdx configuration in an existing project')
  .action(async () => {
    const spinner = ora();

    try {
      // Check if package.json exists
      if (!(await fs.pathExists(paths.appPackageJson))) {
        console.log(pc.red('No package.json found. Run this command in a project directory.'));
        process.exit(1);
      }

      spinner.start('Initializing tsdx configuration...');

      // Read current package.json
      const pkgJson = await fs.readJSON(paths.appPackageJson);

      // Add/update exports field for bunchee
      if (!pkgJson.exports) {
        pkgJson.exports = {
          '.': {
            import: './dist/index.js',
            require: './dist/index.cjs',
            types: './dist/index.d.ts',
          },
          './package.json': './package.json',
        };
      }

      // Add main/module/types
      pkgJson.main = './dist/index.cjs';
      pkgJson.module = './dist/index.js';
      pkgJson.types = './dist/index.d.ts';
      pkgJson.type = 'module';

      // Add scripts
      pkgJson.scripts = {
        ...pkgJson.scripts,
        dev: 'bunchee --watch',
        build: 'bunchee',
        test: 'vitest run',
        'test:watch': 'vitest',
        lint: 'oxlint',
        format: 'oxfmt --write .',
        'format:check': 'oxfmt --check .',
        typecheck: 'tsc --noEmit',
      };

      await fs.writeJSON(paths.appPackageJson, pkgJson, { spaces: 2 });

      // Create tsconfig.json if it doesn't exist
      const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json');
      if (!(await fs.pathExists(tsconfigPath))) {
        const tsconfig = {
          compilerOptions: {
            target: 'ES2022',
            module: 'ESNext',
            moduleResolution: 'bundler',
            lib: ['ES2022', 'DOM'],
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
            declaration: true,
            declarationMap: true,
            outDir: './dist',
            rootDir: './src',
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
          },
          include: ['src'],
          exclude: ['node_modules', 'dist'],
        };
        await fs.writeJSON(tsconfigPath, tsconfig, { spaces: 2 });
      }

      // Create vitest.config.ts if it doesn't exist
      const vitestConfigPath = path.resolve(process.cwd(), 'vitest.config.ts');
      if (!(await fs.pathExists(vitestConfigPath))) {
        const vitestConfig = `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
`;
        await fs.writeFile(vitestConfigPath, vitestConfig);
      }

      spinner.succeed('Initialized tsdx configuration');

      console.log(`
${pc.green('Configuration added!')}

Install the required dev dependencies:

  ${pc.cyan('bun add -D bunchee vitest typescript')}
  ${pc.cyan('bun add -D oxlint oxlint-tsgolint')}

Then you can run:

  ${pc.cyan('bun run dev')}      Start development mode
  ${pc.cyan('bun run build')}    Build for production
  ${pc.cyan('bun run test')}     Run tests
  ${pc.cyan('bun run lint')}     Lint and type-check the codebase
`);
    } catch (error) {
      spinner.fail('Failed to initialize');
      console.error(error);
      process.exit(1);
    }
  });

program.parse();
