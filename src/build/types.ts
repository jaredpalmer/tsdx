import type { InputOptions, OutputOptions } from 'rolldown';

/**
 * Output format for the bundle
 */
export type ModuleFormat = 'esm' | 'cjs';

/**
 * Entry point configuration parsed from package.json exports
 */
export interface EntryPoint {
  /** Source file path (e.g., src/index.ts) */
  source: string;
  /** Output file path (e.g., dist/index.js) */
  output: string;
  /** Module format based on file extension or exports condition */
  format: ModuleFormat;
  /** Export path (e.g., ".", "./utils") */
  exportPath: string;
}

/**
 * Parsed package.json with relevant fields
 */
export interface PackageJson {
  name: string;
  version?: string;
  type?: 'module' | 'commonjs';
  main?: string;
  module?: string;
  types?: string;
  exports?: PackageExports;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

/**
 * Package.json exports field structure
 */
export type PackageExports =
  | string
  | {
      [key: string]: string | PackageExportConditions | PackageExports;
    };

/**
 * Export conditions (import, require, types, etc.)
 */
export interface PackageExportConditions {
  import?: string;
  require?: string;
  types?: string;
  default?: string;
  node?: string;
  browser?: string;
  [condition: string]: string | undefined;
}

/**
 * Build options passed to the build function
 */
export interface BuildOptions {
  /** Current working directory */
  cwd?: string;
  /** Clean dist folder before build */
  clean?: boolean;
  /** Enable minification */
  minify?: boolean;
  /** Enable source maps */
  sourcemap?: boolean;
  /** Generate TypeScript declarations */
  declaration?: boolean;
  /** Watch mode */
  watch?: boolean;
  /** Custom entry point (overrides package.json) */
  entry?: string;
  /** Custom output directory */
  outDir?: string;
  /** Target environment */
  target?: 'es2020' | 'es2021' | 'es2022' | 'esnext';
}

/**
 * tsdx.config.ts configuration
 */
export interface TsdxConfig {
  /**
   * Modify the Rolldown input options
   */
  rolldown?: (
    config: InputOptions,
    options: BuildOptions & { format: ModuleFormat }
  ) => InputOptions | Promise<InputOptions>;

  /**
   * Modify the Rolldown output options
   */
  output?: (
    config: OutputOptions,
    options: BuildOptions & { format: ModuleFormat }
  ) => OutputOptions | Promise<OutputOptions>;

  /**
   * Called when build starts
   */
  onBuildStart?: () => void | Promise<void>;

  /**
   * Called when build succeeds
   */
  onBuildEnd?: () => void | Promise<void>;

  /**
   * Called when build fails
   */
  onBuildError?: (error: Error) => void | Promise<void>;
}

/**
 * Internal build context
 */
export interface BuildContext {
  /** Package.json contents */
  pkg: PackageJson;
  /** Resolved entry points */
  entries: EntryPoint[];
  /** Build options */
  options: Required<BuildOptions>;
  /** User config from tsdx.config.ts */
  config: TsdxConfig;
  /** Absolute paths */
  paths: {
    root: string;
    src: string;
    dist: string;
    packageJson: string;
    tsconfig: string;
  };
}
