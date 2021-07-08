"use strict";
// largely borrowed from https://github.com/facebook/react/blob/2c8832075b05009bd261df02171bf9888ac76350/scripts/error-codes/transform-error-messages.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const invertObject_1 = require("./invertObject");
const evalToString_1 = require("./evalToString");
const helper_module_imports_1 = require("@babel/helper-module-imports");
const constants_1 = require("../constants");
function transformErrorMessages(babel) {
    const t = babel.types;
    const DEV_EXPRESSION = t.identifier('__DEV__');
    return {
        visitor: {
            CallExpression(path, file) {
                const node = path.node;
                const noMinify = file.opts.noMinify;
                if (path.get('callee').isIdentifier({ name: 'invariant' })) {
                    // Turns this code:
                    //
                    // invariant(condition, 'A %s message that contains %s', adj, noun);
                    //
                    // into this:
                    //
                    // if (!condition) {
                    //   if (__DEV__) {
                    //     throw ReactError(`A ${adj} message that contains ${noun}`);
                    //   } else {
                    //     throw ReactErrorProd(ERR_CODE, adj, noun);
                    //   }
                    // }
                    //
                    // where ERR_CODE is an error code: a unique identifier (a number
                    // string) that references a verbose error message. The mapping is
                    // stored in `paths.appErrorsJson`.
                    const condition = node.arguments[0];
                    const errorMsgLiteral = evalToString_1.evalToString(node.arguments[1]);
                    const errorMsgExpressions = Array.from(node.arguments.slice(2));
                    const errorMsgQuasis = errorMsgLiteral
                        .split('%s')
                        .map((raw) => t.templateElement({ raw, cooked: String.raw({ raw }) }));
                    // Import ReactError
                    const reactErrorIdentfier = helper_module_imports_1.addDefault(path, constants_1.paths.appRoot + '/errors/ErrorDev.js', {
                        nameHint: 'InvariantError',
                    });
                    // Outputs:
                    //   throw ReactError(`A ${adj} message that contains ${noun}`);
                    const devThrow = t.throwStatement(t.callExpression(reactErrorIdentfier, [
                        t.templateLiteral(errorMsgQuasis, errorMsgExpressions),
                    ]));
                    if (noMinify) {
                        // Error minification is disabled for this build.
                        //
                        // Outputs:
                        //   if (!condition) {
                        //     throw ReactError(`A ${adj} message that contains ${noun}`);
                        //   }
                        path.replaceWith(t.ifStatement(t.unaryExpression('!', condition), t.blockStatement([devThrow])));
                        return;
                    }
                    // Avoid caching because we write it as we go.
                    const existingErrorMap = JSON.parse(fs_1.default.readFileSync(constants_1.paths.appErrorsJson, 'utf-8'));
                    const errorMap = invertObject_1.invertObject(existingErrorMap);
                    let prodErrorId = errorMap[errorMsgLiteral];
                    if (prodErrorId === undefined) {
                        // There is no error code for this message. Add an inline comment
                        // that flags this as an unminified error. This allows the build
                        // to proceed, while also allowing a post-build linter to detect it.
                        //
                        // Outputs:
                        //   /* FIXME (minify-errors-in-prod): Unminified error message in production build! */
                        //   if (!condition) {
                        //     throw ReactError(`A ${adj} message that contains ${noun}`);
                        //   }
                        path.replaceWith(t.ifStatement(t.unaryExpression('!', condition), t.blockStatement([devThrow])));
                        path.addComment('leading', 'FIXME (minify-errors-in-prod): Unminified error message in production build!');
                        return;
                    }
                    prodErrorId = parseInt(prodErrorId, 10);
                    // Import ReactErrorProd
                    const reactErrorProdIdentfier = helper_module_imports_1.addDefault(path, constants_1.paths.appRoot + '/errors/ErrorProd.js', {
                        nameHint: 'InvariantErrorProd',
                    });
                    // Outputs:
                    //   throw ReactErrorProd(ERR_CODE, adj, noun);
                    const prodThrow = t.throwStatement(t.callExpression(reactErrorProdIdentfier, [
                        t.numericLiteral(prodErrorId),
                        ...errorMsgExpressions,
                    ]));
                    // Outputs:
                    //   if (!condition) {
                    //     if (__DEV__) {
                    //       throw ReactError(`A ${adj} message that contains ${noun}`);
                    //     } else {
                    //       throw ReactErrorProd(ERR_CODE, adj, noun);
                    //     }
                    //   }
                    path.replaceWith(t.ifStatement(t.unaryExpression('!', condition), t.blockStatement([
                        t.ifStatement(DEV_EXPRESSION, t.blockStatement([devThrow]), t.blockStatement([prodThrow])),
                    ])));
                }
            },
        },
    };
}
exports.default = transformErrorMessages;
