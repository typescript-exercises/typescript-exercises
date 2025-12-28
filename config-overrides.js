const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = function override(config) {
    config.plugins.push(
        new MonacoWebpackPlugin({
            languages: ['typescript', 'json']
        })
    );

    // Add webpack 5 polyfills for Node.js core modules
    config.resolve.fallback = {
        ...config.resolve.fallback,
        path: 'path-browserify'
    };

    return config;
};
