const fs = require('fs-extra');

module.exports = {
  rollup(config, options) {
    const plugins = config.plugins.map(plugin => plugin.name);
    fs.writeJSON('./plugins.json', plugins);
    return config;
  },
  closureCompilerOptions: {
    compilation_level: 'ADVANCED_OPTIMIZATIONS',
  },
};
