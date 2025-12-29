import path from 'path';
import fs from 'fs-extra';
import pc from 'picocolors';
import { rolldown, watch as rolldownWatch } from 'rolldown';
import { execa } from 'execa';
import type { RolldownWatcher } from 'rolldown';
import {
  createBuildContext,
  createInputOptions,
  createOutputOptions,
  groupEntriesBySource,
} from './config.js';
import type { BuildOptions, BuildContext, EntryPoint } from './types.js';

/**
 * Build a single entry point
 */
async function buildEntry(entry: EntryPoint, context: BuildContext): Promise<void> {
  const inputOptions = await createInputOptions(entry, context);
  const outputOptions = await createOutputOptions(entry, context);

  const bundle = await rolldown(inputOptions);
  await bundle.write(outputOptions);
  await bundle.close();
}

/**
 * Build all entry points
 */
export async function build(options: BuildOptions = {}): Promise<void> {
  const context = await createBuildContext(options);
  const { entries, config, paths } = context;

  // Call onBuildStart hook
  if (config.onBuildStart) {
    await config.onBuildStart();
  }

  try {
    // Clean dist folder
    if (context.options.clean) {
      await fs.remove(paths.dist);
      await fs.ensureDir(paths.dist);
    }

    // Build all entries
    const grouped = groupEntriesBySource(entries);

    for (const [, sourceEntries] of grouped) {
      // For entries with the same source, we can potentially optimize
      // by building once and generating multiple outputs
      // For now, build each separately for simplicity
      for (const entry of sourceEntries) {
        await buildEntry(entry, context);

        const relativePath = path.relative(paths.root, entry.output);
        console.log(
          pc.green('  \u2713'),
          pc.dim(relativePath),
          pc.cyan(`(${entry.format})`)
        );
      }
    }

    // Generate TypeScript declarations
    if (context.options.declaration) {
      await generateDeclarations(context);
    }

    // Call onBuildEnd hook
    if (config.onBuildEnd) {
      await config.onBuildEnd();
    }
  } catch (error) {
    // Call onBuildError hook
    if (config.onBuildError) {
      await config.onBuildError(error as Error);
    }
    throw error;
  }
}

/**
 * Generate TypeScript declaration files using tsc
 */
async function generateDeclarations(context: BuildContext): Promise<void> {
  const { paths } = context;

  // Check if tsconfig exists
  if (!(await fs.pathExists(paths.tsconfig))) {
    console.log(pc.yellow('  Skipping declarations: tsconfig.json not found'));
    return;
  }

  try {
    await execa('tsc', ['--emitDeclarationOnly', '--declaration', '--outDir', paths.dist], {
      cwd: paths.root,
      stdio: 'pipe',
    });
    console.log(pc.green('  \u2713'), pc.dim('TypeScript declarations'));
  } catch (error: unknown) {
    const execaError = error as { stderr?: string };
    // Log TypeScript errors but don't fail the build
    if (execaError.stderr) {
      console.log(pc.yellow('  TypeScript declaration warnings:'));
      console.log(pc.dim(execaError.stderr));
    }
  }
}

/**
 * Watch mode - rebuild on file changes
 */
export async function watch(options: BuildOptions = {}): Promise<RolldownWatcher> {
  const context = await createBuildContext({ ...options, watch: true });
  const { entries, config, paths } = context;

  // Clean dist folder initially
  if (context.options.clean) {
    await fs.remove(paths.dist);
    await fs.ensureDir(paths.dist);
  }

  // Create watch configs for all entries
  const watchConfigs = await Promise.all(
    entries.map(async (entry) => {
      const inputOptions = await createInputOptions(entry, context);
      const outputOptions = await createOutputOptions(entry, context);

      return {
        ...inputOptions,
        output: outputOptions,
        watch: {
          include: ['src/**'],
          exclude: ['node_modules/**', 'dist/**'],
        },
      };
    })
  );

  const watcher = rolldownWatch(watchConfigs);

  watcher.on('event', async (event) => {
    if (event.code === 'START') {
      console.log(pc.cyan('\n  Building...'));
      if (config.onBuildStart) {
        await config.onBuildStart();
      }
    }

    if (event.code === 'BUNDLE_END') {
      const duration = event.duration;
      console.log(pc.green(`  \u2713 Built in ${duration}ms`));
      await event.result.close();
    }

    if (event.code === 'END') {
      // Generate declarations after all bundles complete
      if (context.options.declaration) {
        await generateDeclarations(context);
      }

      if (config.onBuildEnd) {
        await config.onBuildEnd();
      }

      console.log(pc.dim('\n  Watching for changes...'));
    }

    if (event.code === 'ERROR') {
      console.log(pc.red('\n  Build failed:'));
      console.error(event.error);

      if (config.onBuildError) {
        await config.onBuildError(event.error);
      }
    }
  });

  // Handle process termination
  const cleanup = () => {
    watcher.close();
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  return watcher;
}

/**
 * Get build info for display
 */
export async function getBuildInfo(options: BuildOptions = {}): Promise<{
  entries: EntryPoint[];
  pkg: { name: string; version?: string };
}> {
  const context = await createBuildContext(options);
  return {
    entries: context.entries,
    pkg: {
      name: context.pkg.name,
      version: context.pkg.version,
    },
  };
}

// Re-export types and config utilities
export { createBuildContext } from './config.js';
export type { BuildOptions, BuildContext, EntryPoint, TsdxConfig, ModuleFormat } from './types.js';
