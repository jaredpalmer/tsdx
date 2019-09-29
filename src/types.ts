export interface TsdxOptions {
  // path to file
  input: string;
  // Name of package
  name: string;
  // JS target
  target: 'node' | 'browser';
  // Module format
  format: 'cjs' | 'umd' | 'esm';
  // Environment
  env: 'development' | 'production';
  // Path to tsconfig file
  tsconfig?: string;
  // Is error extraction running?
  extractErrors?: boolean;
  // Is minifying?
  minify?: boolean;
  // Is this the very first rollup config (and thus should one-off metadata be extracted)?
  writeMeta?: boolean;
}

export interface TsdxBag {
  projectPath: string;
  logger?: any;
  bootSpinner: any;
  installSpinner: any;
  safeName: string;
  version: string;
  template: TemplateTypes;
  paths: Paths;
  pkg: string;
  deps: string[];
  tsdxOpts: TsdxOptions;
}

export type Paths = {
  appPackageJson: string;
  testsSetup: string;
  appRoot: string;
  appSrc: string;
  appErrorsJson: string;
  appErrors: string;
  appDist: string;
  appConfig: string;
};

export {
  RollupOptions,
  OutputOptions,
  RollupWatchOptions,
  WatcherOptions,
} from 'rollup';

export type TemplateTypes = 'react' | 'basic' | 'chrome';
