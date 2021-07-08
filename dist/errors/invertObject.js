"use strict";
// largely borrowed from https://github.com/facebook/react/blob/8b2d3783e58d1acea53428a10d2035a8399060fe/scripts/error-codes/invertObject.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.invertObject = void 0;
function invertObject(targetObj) {
    const result = {};
    const mapKeys = Object.keys(targetObj);
    for (const originalKey of mapKeys) {
        const originalVal = targetObj[originalKey];
        result[originalVal] = originalKey;
    }
    return result;
}
exports.invertObject = invertObject;
