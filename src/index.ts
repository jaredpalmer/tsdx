#!/usr/bin/env node

import sade from 'sade';
import { pkg } from './helpers';
import { create, watch, build, test, lint } from './cli';

const prog = sade('tsdx');

prog
  .version(pkg.version)
  .command('create <pkg>')
  .describe('Create a new package with TSDX')
  .example('create mypackage')
  .option(
    '--template',
    'Specify a template. Allowed choices: [basic, react, chrome]'
  )
  .example('create --template react mypackage')
  .action(create);

prog
  .command('watch')
  .describe('Rebuilds on any change')
  .option('--entry, -i', 'Entry module(s)')
  .example('watch --entry src/foo.tsx')
  .option('--target', 'Specify your target environment', 'web')
  .example('watch --target node')
  .option('--name', 'Specify name exposed in UMD builds')
  .example('watch --name Foo')
  .option('--format', 'Specify module format(s)', 'cjs,esm')
  .example('watch --format cjs,esm')
  .option(
    '--verbose',
    'Keep outdated console output in watch mode instead of clearing the screen'
  )
  .example('watch --verbose')
  .option('--tsconfig', 'Specify custom tsconfig path')
  .example('watch --tsconfig ./tsconfig.foo.json')
  .option('--extractErrors', 'Extract invariant errors to ./errors/codes.json.')
  .example('build --extractErrors')
  .action(watch);

prog
  .command('build')
  .describe('Build your project once and exit')
  .option('--entry, -i', 'Entry module(s)')
  .example('build --entry src/foo.tsx')
  .option('--target', 'Specify your target environment', 'web')
  .example('build --target node')
  .option('--name', 'Specify name exposed in UMD builds')
  .example('build --name Foo')
  .option('--format', 'Specify module format(s)', 'cjs,esm')
  .example('build --format cjs,esm')
  .option('--tsconfig', 'Specify custom tsconfig path')
  .example('build --tsconfig ./tsconfig.foo.json')
  .option(
    '--extractErrors',
    'Extract errors to ./errors/codes.json and provide a url for decoding.'
  )
  .example(
    'build --extractErrors=https://reactjs.org/docs/error-decoder.html?invariant='
  )
  .action(build);

prog
  .command('test')
  .describe(
    'Run jest test runner in watch mode. Passes through all flags directly to Jest'
  )
  .action(test);

prog
  .command('lint')
  .describe('Run eslint with Prettier')
  .example('lint src test')
  .option('--fix', 'Fixes fixable errors and warnings')
  .example('lint src test --fix')
  .option('--ignore-pattern', 'Ignore a pattern')
  .example('lint src test --ignore-pattern test/foobar.ts')
  .option('--write-file', 'Write the config file locally')
  .example('lint --write-file')
  .action(lint);

prog.parse(process.argv);
