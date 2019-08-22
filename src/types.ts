export interface TsdxOptions {
  input: string;
  name: string;
  target: 'node' | 'browser';
  format: 'cjs' | 'umd' | 'esm';
  env: 'development' | 'production';
  tsconfig?: string;
  extractErrors?: string;
  minify?: boolean;
  writeMeta?: boolean;
}
