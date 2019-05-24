# Contributing to TSDX

Thanks for your interest in TSDX! You are very welcome to contribute. If you are proposing a new feature, make sure to [open an issue](https://github.com/palmerhq/tsdx/issues/new/choose) to make sure it is inline with the project goals.

0. Make sure you dont have existing `tsdx` global installations that may conflict: `npm uninstall -g tsdx`.
1. Fork this repository to your own GitHub account and then clone it to your local device.
2. Install the dependencies: `yarn install`
3. Run `yarn build` to build the typescript files to javascript
4. Run `yarn link` to link the local repo to NPM

You can now use `tsdx` locally as you work on `tsdx` code. Be sure to run `yarn test` before you make your PR to make sure you haven't broken anything.
