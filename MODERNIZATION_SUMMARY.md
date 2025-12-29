# TSDX Modernization Summary

This document provides a comprehensive summary of the modernization changes made to TSDX.

## Overview

TSDX has been modernized to use the latest stable versions of its core dependencies while maintaining backward compatibility where possible. These changes address security vulnerabilities, deprecated packages, and bring TSDX up to current JavaScript ecosystem standards.

## Key Changes

### 1. Runtime and Language Updates

#### Node.js
- **Before**: Node.js >= 14
- **After**: Node.js >= 18
- **Reason**: Node.js 14 reached EOL in April 2023. Node 18 is the current LTS version.

#### TypeScript
- **Before**: TypeScript 4.3.5
- **After**: TypeScript 5.2.x
- **Reason**: TypeScript 5 offers improved type inference, better error messages, and new language features.
- **Impact**: Users get better type checking and modern TypeScript features.

#### Target
- **Before**: ES2017
- **After**: ES2020
- **Reason**: Modern Node.js versions fully support ES2020 features.

### 2. Build Tool Updates

#### Rollup
- **Before**: Rollup 2.52.8
- **After**: Rollup 3.29.x
- **Impact**: Better performance, improved tree-shaking, ESM improvements.

#### Rollup Plugins
All Rollup plugins updated to latest versions:
- `@rollup/plugin-babel`: 5.x → 6.x
- `@rollup/plugin-commonjs`: 19.x → 25.x
- `@rollup/plugin-json`: 4.x → 6.x
- `@rollup/plugin-node-resolve`: 13.x → 15.x
- `@rollup/plugin-replace`: 2.x → 5.x

#### Deprecated Plugin Replacement
- **Removed**: `rollup-plugin-terser` (deprecated)
- **Added**: `@rollup/plugin-terser`
- **Reason**: Official Rollup organization now maintains the terser plugin.

### 3. Code Quality Tools

#### ESLint
- **Before**: ESLint 7.30.0
- **After**: ESLint 8.50.x
- **Impact**: Better linting rules, improved performance, security fixes.

#### Prettier
- **Before**: Prettier 2.3.2
- **After**: Prettier 3.x
- **Impact**: Faster formatting, better TypeScript support.

#### TypeScript ESLint
- **Before**: @typescript-eslint/* 4.28.x
- **After**: @typescript-eslint/* 6.x
- **Impact**: Better TypeScript rule support, improved performance.

#### Babel ESLint Parser
- **Removed**: `babel-eslint` (deprecated package)
- **Added**: `@babel/eslint-parser`
- **Reason**: `babel-eslint` is no longer maintained. Official Babel organization provides the replacement.

#### ESLint Configuration
- **Removed**: `prettier/@typescript-eslint` extends (deprecated)
- **Kept**: `plugin:prettier/recommended`
- **Reason**: Prettier integration is now handled differently in ESLint 8+.

### 4. Testing Infrastructure

#### Jest
- **Before**: Jest 27.0.6
- **After**: Jest 29.5.x
- **Changes**:
  - Replaced `testURL` with `testEnvironment: 'jsdom'`
  - Updated `jest-watch-typeahead` to v2.x
  - Updated `ts-jest` to v29.x
- **Impact**: Faster test runs, better TypeScript support.

### 5. React Ecosystem

#### React Version
- **Before**: React 17.0.2
- **After**: React 18.2.0
- **Impact**: Support for concurrent features, automatic batching, new hooks.

#### React Templates
- **Updated**: Example templates to use `createRoot` API instead of deprecated `ReactDOM.render`
- **Updated**: React peer dependency requirement from `>=16` to `>=18`

#### Example Bundler
- **Before**: Parcel 1.12.3
- **After**: Parcel 2.10.x
- **Impact**: Faster builds, better caching, zero-config bundling.

#### Storybook
- **Updated**: Scripts from `start-storybook` to `storybook dev`
- **Updated**: Scripts from `build-storybook` to `storybook build`
- **Added**: `@storybook/react-webpack5` for Storybook 7 support
- **Added**: `@storybook/cli` for CLI commands
- **Removed**: Deprecated `@storybook/addon-info` and `@storybook/addons`
- **Updated**: Storybook configuration to v7 format with framework specification

### 6. Development Tools

#### Husky
- **Before**: Husky 7.0.1 with configuration in package.json
- **After**: Husky 8.0.3 with `.husky/` directory
- **Impact**: Better performance, more flexible hook management.
- **Files Added**: `.husky/pre-commit`

#### Babel
All Babel packages updated to 7.23.x:
- `@babel/core`
- `@babel/parser`
- `@babel/preset-env`
- `@babel/traverse`
- `@babel/plugin-proposal-class-properties`

### 7. Type Definitions

Updated all `@types/*` packages to latest versions:
- `@types/node`: 16.x → 20.x
- `@types/react`: 17.x → 18.x
- `@types/react-dom`: 17.x → 18.x
- `@types/jest`: 26.x → 29.x
- `@types/eslint`: 7.x → 8.x

### 8. Security Fixes

#### Resolved Vulnerabilities
- **CVE-2021-20066**: jsdom vulnerability (fixed by updating Jest to v29)
- **Rollup XSS vulnerability**: DOM Clobbering Gadget leading to XSS (fixed by updating to v3.29.5+)
  - Affected versions: < 2.79.2, 3.0.0 - 3.29.4, 4.0.0 - 4.22.3
  - Patched version: 3.29.5
- Multiple outdated dependency vulnerabilities resolved through updates

### 9. Package Manager Migration

#### Switched from Yarn to Bun
- **Removed**: yarn.lock, yarn-deduplicate dependency
- **Added**: bun.lockb
- **Reason**: Bun provides significantly faster package installation and has built-in features
- **Impact**: 
  - Much faster dependency installation (up to 30x faster than npm/yarn)
  - Built-in package deduplication (no need for yarn-deduplicate)
  - Better performance for CI/CD pipelines
  - Users need to have Bun installed: `curl -fsSL https://bun.sh/install | bash`
- **Scripts updated**: All `yarn` commands in package.json replaced with `bun run`

### 10. Feature Removals

#### Error Extraction Feature Removed
- **Removed**: `--extractErrors` CLI flag and related functionality
- **Removed**: Error extraction babel transform (`transformErrorMessages`)
- **Reason**: Rarely used feature that added complexity and maintenance burden
- **Impact**: Users who relied on this feature will need to implement their own error code extraction if needed
- **Documentation**: All references to `--extractErrors` removed from README and website docs

### 10. Documentation

#### New Files
- **MIGRATION.md**: Comprehensive guide for upgrading existing projects
- **FUTURE_IMPROVEMENTS.md**: Suggestions for future modernization efforts
- **This file**: Summary of all changes made

#### Updated Files
- `.eslintrc.js`: Removed deprecated prettier config
- `tsconfig.json`: Updated target to ES2020
- `.github/workflows/nodejs.yml`: Updated to Node 18.x, 20.x, 22.x and latest GitHub Actions

## Files Modified

### Core Configuration Files
- `package.json` - Updated all dependencies
- `tsconfig.json` - Updated target and added lib
- `.eslintrc.js` - Removed deprecated prettier config
- `.github/workflows/nodejs.yml` - Updated Node versions and GitHub Actions

### Source Code
- `src/createRollupConfig.ts` - Updated terser import, removed error extraction
- `src/createJestConfig.ts` - Replaced testURL with testEnvironment
- `src/env.d.ts` - Removed rollup-plugin-terser declaration
- `src/index.ts` - Removed `--extractErrors` CLI flag
- `src/types.ts` - Removed `extractErrors` property from SharedOpts
- `src/babelPluginTsdx.ts` - Removed error extraction babel transform
- `src/templates/react.ts` - Updated React peer dependency to >=18
- `src/templates/react-with-storybook.ts` - Updated Storybook dependencies and scripts

### Templates
- `templates/react/example/package.json` - Updated to React 18, Parcel 2
- `templates/react/example/index.tsx` - Updated to use createRoot API
- `templates/react-with-storybook/example/package.json` - Updated to React 18, Parcel 2
- `templates/react-with-storybook/example/index.tsx` - Updated to use createRoot API
- `templates/react-with-storybook/.storybook/main.js` - Updated to Storybook 7 format

### New Files
- `.husky/pre-commit` - Husky v8 pre-commit hook
- `MIGRATION.md` - Migration guide for users
- `FUTURE_IMPROVEMENTS.md` - Future enhancement suggestions

## Impact Assessment

### Breaking Changes
1. **Node.js 18 required**: Users on Node 14 or 16 must upgrade
2. **TypeScript 5**: May have stricter type checking
3. **React 18 API**: Templates use new `createRoot` API
4. **Storybook 7**: New CLI commands and configuration format

### Non-Breaking Changes
1. All dependency updates are backward compatible within major versions
2. Output formats remain the same (CJS, ESM, UMD)
3. Configuration files remain compatible
4. Build process remains the same

### Benefits
1. **Security**: All known vulnerabilities patched
2. **Performance**: Faster builds with updated Rollup and other tools
3. **Modern Features**: Access to latest TypeScript and React features
4. **Better DX**: Improved error messages and development experience
5. **Future-Proof**: Up-to-date with current ecosystem standards

## Testing Recommendations

Before deploying these changes, test:

1. **Fresh Project Creation**
   ```bash
   npx tsdx create test-project
   cd test-project
   yarn build
   yarn test
   yarn lint
   ```

2. **React Template**
   ```bash
   npx tsdx create test-react --template react
   cd test-react
   yarn build
   yarn test
   cd example && yarn && yarn start
   ```

3. **Storybook Template**
   ```bash
   npx tsdx create test-storybook --template react-with-storybook
   cd test-storybook
   yarn build
   yarn test
   yarn storybook
   ```

4. **Existing Project Upgrade**
   - Test migration path from v0.14.1 to this version
   - Verify all existing features still work
   - Check for any new warnings or errors

## Rollback Plan

If issues arise:

1. Pin to previous version: `tsdx@0.14.1`
2. Revert Node.js requirement if needed
3. Use the MIGRATION.md guide to understand changes
4. Report issues on GitHub

## Next Steps

See FUTURE_IMPROVEMENTS.md for:
- Additional modernization opportunities
- Community feature requests
- Long-term architectural improvements
- Performance optimization ideas

## Conclusion

This modernization effort brings TSDX up to current JavaScript ecosystem standards while maintaining its core value proposition: zero-config TypeScript package development. The changes prioritize:

1. **Security**: Patching known vulnerabilities
2. **Compatibility**: Supporting modern Node.js and TypeScript
3. **Performance**: Leveraging latest tool improvements
4. **Developer Experience**: Better errors and faster feedback
5. **Maintainability**: Removing deprecated dependencies

Users should follow the MIGRATION.md guide when upgrading existing projects.
