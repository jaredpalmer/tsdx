# Migration Guide

This document outlines the modernization changes made to TSDX and provides guidance for upgrading existing projects.

## Breaking Changes

### 1. Node.js Version Requirement

- **Old**: Node.js >= 14
- **New**: Node.js >= 18

**Action Required**: Upgrade your Node.js installation to version 18 or higher.

### 2. TypeScript Version

- **Old**: TypeScript 4.3.5
- **New**: TypeScript 5.2.x

**Action Required**: Update your project's TypeScript version and fix any type errors that may arise from stricter type checking in TypeScript 5.

### 3. React Version (for React templates)

- **Old**: React 17
- **New**: React 18

**Action Required**: 
- Update React imports to use `createRoot` from `react-dom/client` instead of `ReactDOM.render`
- Review React 18 migration guide: https://react.dev/blog/2022/03/08/react-18-upgrade-guide

### 4. Rollup Version Update (Security Fix)

- **Old**: Rollup 2.x
- **New**: Rollup 3.29.5+

**Security Issue Fixed**: DOM Clobbering Gadget vulnerability leading to XSS
- Affected versions: < 2.79.2, 3.0.0 - 3.29.4, 4.0.0 - 4.22.3
- Patched in: 3.29.5

**Action Required**: No action needed unless you have custom Rollup configuration that depends on version-specific features.

### 5. Rollup Plugin Changes

- **Removed**: `rollup-plugin-terser` (deprecated)
- **Added**: `@rollup/plugin-terser`

**Action Required**: If you have a custom `tsdx.config.js`, update any references from `rollup-plugin-terser` to `@rollup/plugin-terser`.

### 5. Babel ESLint Parser

- **Removed**: `babel-eslint` (deprecated)
- **Added**: `@babel/eslint-parser`

**Action Required**: If you use a custom ESLint configuration, update your parser from `babel-eslint` to `@babel/eslint-parser`.

### 6. ESLint Configuration

- **Removed**: `prettier/@typescript-eslint` (deprecated)
- **Updated**: ESLint now uses the modern prettier integration

**Action Required**: Update your `.eslintrc.js` to remove the deprecated `prettier/@typescript-eslint` extension.

### 7. Husky Configuration

- **Old**: Husky v7 with configuration in `package.json`
- **New**: Husky v8 with `.husky/` directory

**Action Required**: If you use Husky hooks, migrate to the new configuration format. See: https://typicode.github.io/husky/

## Updated Dependencies

### Major Version Updates

- **ESLint**: 7.x → 8.x
- **Jest**: 27.x → 29.x
- **Prettier**: 2.x → 3.x
- **Rollup**: 2.x → 3.x
- **@typescript-eslint/***: 4.x → 6.x

### Dependency Security Improvements

- Fixed CVE-2021-20066 (jsdom vulnerability)
- Updated all Babel packages to latest secure versions
- Updated all Rollup plugins to latest versions

## New Features & Improvements

1. **Better TypeScript Support**: Updated to TypeScript 5.2 with improved type inference and error messages
2. **Faster Builds**: Updated Rollup and plugins for better performance
3. **Modern Tooling**: All dev dependencies updated to latest stable versions
4. **Improved Security**: Resolved known security vulnerabilities in dependencies
5. **React 18 Support**: Full support for React 18 concurrent features

## Migration Steps

### For Existing TSDX Projects

1. **Update Node.js**
   ```bash
   # Check your Node.js version
   node --version
   # Should be >= 18
   ```

2. **Update TSDX**
   ```bash
   yarn upgrade tsdx@latest
   # or
   npm update tsdx@latest
   ```

3. **Update Dependencies**
   ```bash
   # Update your project's dependencies
   yarn upgrade-interactive --latest
   # or
   npm update
   ```

4. **Update TypeScript**
   ```bash
   yarn add -D typescript@^5.2.0
   # or
   npm install --save-dev typescript@^5.2.0
   ```

5. **For React Projects - Update to React 18**
   ```bash
   yarn add react@^18.2.0 react-dom@^18.2.0
   yarn add -D @types/react@^18.2.0 @types/react-dom@^18.2.0
   ```

6. **Update React Render Code** (if using React templates)
   
   Replace:
   ```tsx
   import * as ReactDOM from 'react-dom';
   ReactDOM.render(<App />, document.getElementById('root'));
   ```
   
   With:
   ```tsx
   import { createRoot } from 'react-dom/client';
   const container = document.getElementById('root');
   const root = createRoot(container!);
   root.render(<App />);
   ```

7. **Update Custom Configuration** (if applicable)
   
   - If you have `tsdx.config.js`, update any rollup plugin imports
   - If you have `.eslintrc.js`, remove deprecated prettier config
   - If you use Husky, migrate to v8 configuration

8. **Test Your Build**
   ```bash
   yarn build
   yarn test
   yarn lint
   ```

## Troubleshooting

### TypeScript Errors After Upgrade

TypeScript 5 has stricter type checking. Common issues:

1. **Implicit any**: Enable `noImplicitAny` and add type annotations
2. **Template literal types**: Update usage if you use template literal types
3. **Enum changes**: Review enum usage for breaking changes

### ESLint Issues

If you encounter ESLint errors:

1. Update your ESLint configuration to remove deprecated rules
2. Run `yarn lint --fix` to auto-fix formatting issues
3. Update peer dependencies if warnings appear

### Jest Test Failures

Jest 29 has some breaking changes:

1. Update test snapshots if needed
2. Review async testing patterns
3. Update custom test configurations

## Getting Help

If you encounter issues during migration:

1. Check the [GitHub Issues](https://github.com/jaredpalmer/tsdx/issues)
2. Review the [TypeScript 5 Release Notes](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/)
3. Review the [React 18 Upgrade Guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
4. Review the [Jest 29 Changelog](https://jestjs.io/blog/2022/08/25/jest-29)

## Rollback

If you need to rollback to the previous version:

```bash
yarn add tsdx@0.14.1 -D
# or
npm install --save-dev tsdx@0.14.1
```

Then revert your Node.js, TypeScript, and other dependency versions to their previous states.
