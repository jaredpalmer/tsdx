import path from 'path';
import fs from 'fs-extra';
import type { InputOptions, OutputOptions } from 'rolldown';
import type {
  BuildContext,
  BuildOptions,
  EntryPoint,
  ModuleFormat,
  PackageExportConditions,
  PackageExports,
  PackageJson,
  TsdxConfig,
} from './types.js';

/**
 * Default build options
 */
const DEFAULT_OPTIONS: Required<BuildOptions> = {
  cwd: process.cwd(),
  clean: true,
  minify: false,
  sourcemap: true,
  declaration: true,
  watch: false,
  entry: '',
  outDir: 'dist',
  target: 'es2022',
};

/**
 * Determine module format from file extension
 */
function getFormatFromExtension(filePath: string): ModuleFormat {
  if (filePath.endsWith('.cjs') || filePath.endsWith('.cjs.js')) {
    return 'cjs';
  }
  if (filePath.endsWith('.mjs') || filePath.endsWith('.esm.js')) {
    return 'esm';
  }
  // Default to esm for .js files in ESM packages
  return 'esm';
}

/**
 * Determine module format from package.json type field and extension
 */
function getFormat(filePath: string, pkgType?: 'module' | 'commonjs'): ModuleFormat {
  const ext = path.extname(filePath);

  // Explicit extensions take precedence
  if (filePath.endsWith('.cjs')) return 'cjs';
  if (filePath.endsWith('.mjs')) return 'esm';

  // .js files depend on package.json type field
  if (ext === '.js') {
    return pkgType === 'module' ? 'esm' : 'cjs';
  }

  return getFormatFromExtension(filePath);
}

/**
 * Find source file for an output path
 */
async function findSourceFile(outputPath: string, srcDir: string): Promise<string | null> {
  // Remove dist prefix and extension
  const relativePath = outputPath.replace(/^\.?\/?(dist|build|lib)\//, '');
  const baseName = relativePath.replace(/\.(c|m)?js$/, '');

  // Try common source extensions
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '.mts', '.cts'];

  for (const ext of extensions) {
    const sourcePath = path.join(srcDir, baseName + ext);
    if (await fs.pathExists(sourcePath)) {
      return sourcePath;
    }
  }

  // Try index file in directory
  for (const ext of extensions) {
    const indexPath = path.join(srcDir, baseName, 'index' + ext);
    if (await fs.pathExists(indexPath)) {
      return indexPath;
    }
  }

  return null;
}

/**
 * Parse package.json exports field into entry points
 */
async function parseExports(
  exports: PackageExports,
  pkg: PackageJson,
  srcDir: string,
  _distDir: string
): Promise<EntryPoint[]> {
  const entries: EntryPoint[] = [];

  async function processExportValue(
    exportPath: string,
    value: string | PackageExportConditions | PackageExports
  ): Promise<void> {
    if (typeof value === 'string') {
      // Simple string export
      if (value.endsWith('.json')) return; // Skip JSON exports

      const format = getFormat(value, pkg.type);
      const source = await findSourceFile(value, srcDir);

      if (source) {
        entries.push({
          source,
          output: value.replace(/^\.\//, ''), // Use export path directly
          format,
          exportPath,
        });
      }
    } else if (typeof value === 'object' && value !== null) {
      // Conditional exports
      const conditions = value as PackageExportConditions;

      // Process import condition (ESM)
      if (conditions.import && typeof conditions.import === 'string') {
        if (!conditions.import.endsWith('.json')) {
          const source = await findSourceFile(conditions.import, srcDir);
          if (source) {
            entries.push({
              source,
              output: conditions.import.replace(/^\.\//, ''),
              format: 'esm',
              exportPath,
            });
          }
        }
      }

      // Process require condition (CJS)
      if (conditions.require && typeof conditions.require === 'string') {
        if (!conditions.require.endsWith('.json')) {
          const source = await findSourceFile(conditions.require, srcDir);
          if (source) {
            entries.push({
              source,
              output: conditions.require.replace(/^\.\//, ''),
              format: 'cjs',
              exportPath,
            });
          }
        }
      }

      // If no import/require, check for default
      if (!conditions.import && !conditions.require && conditions.default) {
        await processExportValue(exportPath, conditions.default);
      }
    }
  }

  if (typeof exports === 'string') {
    await processExportValue('.', exports);
  } else if (typeof exports === 'object') {
    for (const [key, value] of Object.entries(exports)) {
      if (key.startsWith('.')) {
        // It's an export path
        await processExportValue(key, value);
      } else {
        // It's a condition at the root level (e.g., { import: ..., require: ... })
        await processExportValue('.', exports);
        break;
      }
    }
  }

  return entries;
}

/**
 * Parse entry points from package.json
 */
async function parseEntryPoints(pkg: PackageJson, srcDir: string, distDir: string): Promise<EntryPoint[]> {
  const entries: EntryPoint[] = [];

  // First, try exports field (modern approach)
  if (pkg.exports) {
    const exportEntries = await parseExports(pkg.exports, pkg, srcDir, distDir);
    entries.push(...exportEntries);
  }

  // Fallback to main/module fields if no exports
  if (entries.length === 0) {
    // Try module field (ESM)
    if (pkg.module) {
      const source = await findSourceFile(pkg.module, srcDir);
      if (source) {
        entries.push({
          source,
          output: pkg.module.replace(/^\.\//, ''),
          format: 'esm',
          exportPath: '.',
        });
      }
    }

    // Try main field (CJS usually)
    if (pkg.main) {
      const source = await findSourceFile(pkg.main, srcDir);
      if (source) {
        entries.push({
          source,
          output: pkg.main.replace(/^\.\//, ''),
          format: getFormat(pkg.main, pkg.type),
          exportPath: '.',
        });
      }
    }
  }

  // Last resort: look for src/index.ts
  if (entries.length === 0) {
    const defaultSource = path.join(srcDir, 'index.ts');
    if (await fs.pathExists(defaultSource)) {
      entries.push({
        source: defaultSource,
        output: path.join(distDir, 'index.js'),
        format: pkg.type === 'module' ? 'esm' : 'cjs',
        exportPath: '.',
      });

      // Also add CJS if package is ESM
      if (pkg.type === 'module') {
        entries.push({
          source: defaultSource,
          output: path.join(distDir, 'index.cjs'),
          format: 'cjs',
          exportPath: '.',
        });
      }
    }
  }

  // Deduplicate entries by output path
  const seen = new Set<string>();
  return entries.filter((entry) => {
    const key = `${entry.output}:${entry.format}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Load tsdx.config.ts if it exists
 */
async function loadConfig(cwd: string): Promise<TsdxConfig> {
  const configPaths = ['tsdx.config.ts', 'tsdx.config.js', 'tsdx.config.mjs'];

  for (const configPath of configPaths) {
    const fullPath = path.join(cwd, configPath);
    if (await fs.pathExists(fullPath)) {
      try {
        // Dynamic import for ES modules
        const configModule = await import(fullPath);
        return configModule.default || configModule;
      } catch (error) {
        // If TypeScript config fails, try transpiling with esbuild or just skip
        console.warn(`Warning: Failed to load ${configPath}:`, error);
      }
    }
  }

  return {};
}

/**
 * Get external dependencies from package.json
 */
function getExternals(pkg: PackageJson): (string | RegExp)[] {
  const externals: (string | RegExp)[] = [];

  // All dependencies should be external
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ];

  for (const dep of allDeps) {
    externals.push(dep);
    // Also match subpath imports like 'lodash/get'
    externals.push(new RegExp(`^${dep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(/.*)?$`));
  }

  // Node built-ins
  externals.push(/^node:/);

  return externals;
}

/**
 * Create build context
 */
export async function createBuildContext(options: BuildOptions = {}): Promise<BuildContext> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const cwd = path.resolve(opts.cwd);

  const paths = {
    root: cwd,
    src: path.join(cwd, 'src'),
    dist: path.join(cwd, opts.outDir),
    packageJson: path.join(cwd, 'package.json'),
    tsconfig: path.join(cwd, 'tsconfig.json'),
  };

  // Load package.json
  if (!(await fs.pathExists(paths.packageJson))) {
    throw new Error(`package.json not found in ${cwd}`);
  }
  const pkg: PackageJson = await fs.readJSON(paths.packageJson);

  // Parse entry points
  let entries: EntryPoint[];

  if (opts.entry) {
    // Custom entry point
    const sourcePath = path.resolve(cwd, opts.entry);
    entries = [
      {
        source: sourcePath,
        output: path.join(opts.outDir, 'index.js'),
        format: 'esm',
        exportPath: '.',
      },
      {
        source: sourcePath,
        output: path.join(opts.outDir, 'index.cjs'),
        format: 'cjs',
        exportPath: '.',
      },
    ];
  } else {
    entries = await parseEntryPoints(pkg, paths.src, paths.dist);
  }

  if (entries.length === 0) {
    throw new Error('No entry points found. Add an "exports" field to package.json or create src/index.ts');
  }

  // Load user config
  const config = await loadConfig(cwd);

  return {
    pkg,
    entries,
    options: opts,
    config,
    paths,
  };
}

/**
 * Create Rolldown input options for an entry point
 */
export async function createInputOptions(
  entry: EntryPoint,
  context: BuildContext
): Promise<InputOptions> {
  const { pkg, options, config } = context;

  let inputOptions: InputOptions = {
    input: entry.source,
    external: getExternals(pkg),
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.mts', '.cts', '.mjs', '.cjs'],
    },
  };

  // Apply user config
  if (config.rolldown) {
    inputOptions = await config.rolldown(inputOptions, { ...options, format: entry.format });
  }

  return inputOptions;
}

/**
 * Create Rolldown output options for an entry point
 */
export async function createOutputOptions(
  entry: EntryPoint,
  context: BuildContext
): Promise<OutputOptions> {
  const { options, config, paths } = context;

  let outputOptions: OutputOptions = {
    file: path.join(paths.root, entry.output),
    format: entry.format,
    sourcemap: options.sourcemap,
    exports: 'named',
  };

  // Apply user config
  if (config.output) {
    outputOptions = await config.output(outputOptions, { ...options, format: entry.format });
  }

  return outputOptions;
}

/**
 * Group entries by source file to enable multiple outputs per input
 */
export function groupEntriesBySource(entries: EntryPoint[]): Map<string, EntryPoint[]> {
  const groups = new Map<string, EntryPoint[]>();

  for (const entry of entries) {
    const existing = groups.get(entry.source) || [];
    existing.push(entry);
    groups.set(entry.source, existing);
  }

  return groups;
}
