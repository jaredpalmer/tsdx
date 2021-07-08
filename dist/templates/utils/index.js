"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composePackageJson = void 0;
const composePackageJson = (template) => ({ name, author, }) => {
    return Object.assign(Object.assign({}, template.packageJson), { name,
        author, 'size-limit': [
            {
                path: `dist/${name}.production.min.cjs`,
                limit: '10 KB',
            },
            {
                path: `dist/${name}.min.mjs`,
                limit: '10 KB',
            },
        ] });
};
exports.composePackageJson = composePackageJson;
