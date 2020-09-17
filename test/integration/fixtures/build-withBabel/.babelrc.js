module.exports = {
  presets: [
    // ensure Babel presets are merged and applied
    './test-babel-preset'
  ],
  plugins: [
   ['@babel/plugin-transform-runtime', { helpers: false }],
  ]
}
