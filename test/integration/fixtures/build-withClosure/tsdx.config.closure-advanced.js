const closureCompiler = require('@ampproject/rollup-plugin-closure-compiler');

const closureCompilerPlugin = closureCompiler({
  compilation_level: 'ADVANCED_OPTIMIZATIONS',
});

module.exports = {
  rollup(config) {
    config.plugins = config.plugins.map(plugin => {
      // override closure compiler plugin's default config
      if (plugin && plugin.name === closureCompilerPlugin.name) {
        return closureCompilerPlugin;
      }
      return plugin;
    });

    return config;
  },
};
