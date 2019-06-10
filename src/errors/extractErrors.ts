/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

import fs from 'fs';
import path from 'path';
import * as babylon from 'babylon';
import traverse from 'babel-traverse';
import { invertObject } from './invertObject';
import { evalToString } from './evalToString';
import { paths } from '../constants';
import { safeVariableName } from '../utils';
import pascalCase from 'pascal-case';

const babylonOptions = {
  sourceType: 'module',
  // As a parser, babylon has its own options and we can't directly
  // import/require a babel preset. It should be kept **the same** as
  // the `babel-plugin-syntax-*` ones specified in
  // https://github.com/facebook/fbjs/blob/master/packages/babel-preset-fbjs/configure.js
  plugins: [
    'classProperties',
    'flow',
    'jsx',
    'trailingFunctionCommas',
    'objectRestSpread',
  ],
};

export function extractErrors(opts: any) {
  if (!opts || !('errorMapFilePath' in opts)) {
    throw new Error(
      'Missing options. Ensure you pass an object with `errorMapFilePath`.'
    );
  }

  if (!opts.name || !('name' in opts)) {
    throw new Error('Missing options. Ensure you pass --name flag to tsdx');
  }

  const errorMapFilePath = opts.errorMapFilePath;
  let existingErrorMap: any;
  try {
    // Using `fs.readFileSync` instead of `require` here, because `require()`
    // calls are cached, and the cache map is not properly invalidated after
    // file changes.
    existingErrorMap = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, path.basename(errorMapFilePath)),
        'utf8'
      )
    );
  } catch (e) {
    existingErrorMap = {};
  }

  const allErrorIDs = Object.keys(existingErrorMap);
  let currentID: any;

  if (allErrorIDs.length === 0) {
    // Map is empty
    currentID = 0;
  } else {
    currentID = Math.max.apply(null, allErrorIDs as any) + 1;
  }

  // Here we invert the map object in memory for faster error code lookup
  existingErrorMap = invertObject(existingErrorMap);

  function transform(source: string) {
    const ast = babylon.parse(source, babylonOptions);

    traverse(ast, {
      CallExpression: {
        exit(astPath: any) {
          if (astPath.get('callee').isIdentifier({ name: 'invariant' })) {
            const node = astPath.node;

            // error messages can be concatenated (`+`) at runtime, so here's a
            // trivial partial evaluator that interprets the literal value
            const errorMsgLiteral = evalToString(node.arguments[1]);
            addToErrorMap(errorMsgLiteral);
          }
        },
      },
    });
  }

  function addToErrorMap(errorMsgLiteral: any) {
    if (existingErrorMap.hasOwnProperty(errorMsgLiteral)) {
      return;
    }
    existingErrorMap[errorMsgLiteral] = '' + currentID++;
  }

  function flush(cb?: any) {
    const prettyName = pascalCase(safeVariableName(opts.name));
    fs.writeFileSync(
      errorMapFilePath,
      JSON.stringify(invertObject(existingErrorMap), null, 2) + '\n',
      'utf-8'
    );
    fs.writeFileSync(
      paths.appSrc + '/_error.ts',
      `
function ${prettyName}Error(message: string) {
  const error = new Error(message);
  error.name = 'Invariant Violation';
  return error;
}

export default ${prettyName}Error;      
      `
    );

    fs.writeFileSync(
      paths.appSrc + '/_error.production.ts',
      `// Do not require this module directly! Use a normal error constructor with
// template literal strings. The messages will be converted to ReactError during
// build, and in production they will be minified.

function ${prettyName}ErrorProd(code: string | number) {
  let url = '${opts.extractErrors}' + code;
  for (let i = 1; i < arguments.length; i++) {
    url += '&args[]=' + encodeURIComponent(arguments[i]);
  }
  return new Error(
    \`Minified ${prettyName} error #\$\{code\}; visit \$\{url\} for the full message or \` +
      'use the non-minified dev environment for full errors and additional \' +
      'helpful warnings. '
  );
}

export default ${prettyName}ErrorProd;
`
    );
  }

  return function extractErrors(source: any) {
    transform(source);
    flush();
  };
}
