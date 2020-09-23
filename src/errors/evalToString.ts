// largely borrowed from https://github.com/facebook/react/blob/8b2d3783e58d1acea53428a10d2035a8399060fe/scripts/shared/evalToString.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function evalToString(ast: any): string {
  switch (ast.type) {
    case 'StringLiteral':
    case 'Literal': // ESLint
      return ast.value;
    case 'BinaryExpression': // `+`
      if (ast.operator !== '+') {
        throw new Error('Unsupported binary operator ' + ast.operator);
      }
      return evalToString(ast.left) + evalToString(ast.right);
    default:
      throw new Error('Unsupported type ' + ast.type);
  }
}
