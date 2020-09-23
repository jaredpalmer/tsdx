// largely borrowed from https://github.com/facebook/react/blob/8b2d3783e58d1acea53428a10d2035a8399060fe/scripts/error-codes/invertObject.js

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * turns
 *   { 'MUCH ERROR': '0', 'SUCH WRONG': '1' }
 * into
 *   { 0: 'MUCH ERROR', 1: 'SUCH WRONG' }
 */

type Dict = { [key: string]: any };

export function invertObject(targetObj: Dict) {
  const result: Dict = {};
  const mapKeys = Object.keys(targetObj);

  for (const originalKey of mapKeys) {
    const originalVal = targetObj[originalKey];

    result[originalVal] = originalKey;
  }

  return result;
}
