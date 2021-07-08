"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composePackageJson = void 0;
exports.composePackageJson = (template) => ({ name, author, }) => {
    return Object.assign(Object.assign({}, template.packageJson), { name,
        author, 'size-limit': [
            {
                path: `dist/${name}.production.min.cjs`,
                limit: '10 KB',
            },
            {
                path: `dist/${name}.mjs`,
                limit: '10 KB',
            },
        ] });
};
