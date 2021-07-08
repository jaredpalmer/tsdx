"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composePackageJson = void 0;
exports.composePackageJson = (template) => ({ name, author, }) => {
    return Object.assign(Object.assign({}, template.packageJson), { name,
        author, module: `dist/${name}.esm.js`, 'size-limit': [
            {
                path: `dist/${name}.cjs.production.min.js`,
                limit: '10 KB',
            },
            {
                path: `dist/${name}.esm.js`,
                limit: '10 KB',
            },
        ] });
};
