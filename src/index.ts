import { program } from 'commander';
import pc from 'picocolors';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { execa } from 'execa';
import ora from 'ora';
import Enquirer from 'enquirer';
import { build, watch, getBuildInfo } from './build/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  ${pc.cyan('bun run dev')}      Start development mode
  ${pc.cyan('bun run build')}    Build for production
  ${pc.cyan('bun run test')}     Run tests
  ${pc.cyan('bun run lint')}     Lint the codebase

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
  .option('--no-sourcemap', 'Disable source maps')
  .option('--no-declaration', 'Skip TypeScript declaration generation')
  .option('-e, --entry <path>', 'Custom entry point')
  .option('-o, --out-dir <path>', 'Output directory', 'dist')
  .option('--minify', 'Enable minification')
  .action(async (options: {
    clean: boolean;
    sourcemap: boolean;
    declaration: boolean;
    entry?: string;
    outDir: string;
    minify?: boolean;
  }) => {
    const spinner = ora();

    try {
      // Get build info for display
      const info = await getBuildInfo({
        entry: options.entry,
        outDir: options.outDir,
      });

      console.log(pc.cyan(`\n  Building ${pc.bold(info.pkg.name)}...\n`));

      await build({
        clean: options.clean,
        sourcemap: options.sourcemap,
        declaration: options.declaration,
        entry: options.entry,
        outDir: options.outDir,
        minify: options.minify,
      });

      console.log(pc.green('\n  Build complete!\n'));
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
  .option('--no-declaration', 'Skip TypeScript declaration generation')
  .option('-e, --entry <path>', 'Custom entry point')
  .option('-o, --out-dir <path>', 'Output directory', 'dist')
  .action(async (options: {
    declaration: boolean;
    entry?: string;
    outDir: string;
  }) => {
    try {
      const info = await getBuildInfo({
        entry: options.entry,
        outDir: options.outDir,
      });

      console.log(pc.cyan(`\n  Watching ${pc.bold(info.pkg.name)}...\n`));

      await watch({
        declaration: options.declaration,
        entry: options.entry,
        outDir: options.outDir,
      });
    } catch (error) {
      console.error(pc.red('Development mode failed'));
      console.error(error);
      process.exit(1);
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

      // Add/update exports field
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

      // Add scripts (only build/dev use tsdx, others use tools directly)
      pkgJson.scripts = {
        ...pkgJson.scripts,
        dev: 'tsdx dev',
        build: 'tsdx build',
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

      spinner.succeed('Initialized tsdx configuration');

      console.log(`
${pc.green('Configuration added!')}

Install tsdx as a dev dependency:

  ${pc.cyan('bun add -D tsdx')}

Then you can run:

  ${pc.cyan('bun run dev')}      Start development mode
  ${pc.cyan('bun run build')}    Build for production
`);
    } catch (error) {
      spinner.fail('Failed to initialize');
      console.error(error);
      process.exit(1);
    }
  });

program.parse();
