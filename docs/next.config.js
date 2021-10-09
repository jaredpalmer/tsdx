const compose = require('compose-function');
const { withDokz } = require('dokz/dist/plugin');
const composed = compose(withDokz);

const debug = process.env.NODE_ENV !== 'production';

module.exports = composed({
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  assetPrefix: !debug ? 'https://weiran-zsd.github.io/dts-cli/' : '',
  basePath: '/dts-cli',
});
