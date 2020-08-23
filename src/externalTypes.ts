interface SharedOpts {
  // JS target
  target: 'node' | 'browser';
  // Path to tsconfig file
  tsconfig?: string;
  // Is error extraction running?
  extractErrors?: boolean;
}

type ModuleFormat = 'cjs' | 'umd' | 'esm' | 'system';

export interface TsdxOptions extends SharedOpts {
  // Name of package
  name: string;
  // path to file
  input: string;
  // Environment
  env: 'development' | 'production';
  // Module format
  format: ModuleFormat;
  // Is minifying?
  minify?: boolean;
  // Is this the very first rollup config (and thus should one-off metadata be extracted)?
  writeMeta?: boolean;
  // Only transpile, do not type check (makes compilation faster)
  transpileOnly?: boolean;
}
