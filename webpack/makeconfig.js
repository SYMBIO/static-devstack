'use strict';

var NotifyPlugin = require('./notifyplugin');
var path = require('path');
var webpack = require('webpack');
var gulpConfig = require('../config')


var externalPlugins = {
  svg4everybody: 'svg4everybody/svg4everybody.js',
  myPlugin: 'plugin.js'
}
// substitutions for dependencies in some bower plugins
// var bowerSubstitutions = {
//   $: "jquery",
//   jQuery: "jquery",
//   "window.jQuery": "jquery",
//   "root.jQuery": "jquery"
// }

module.exports = function(isDevelopment) {

  var config = {
    cache: isDevelopment,
    debug: isDevelopment,
    devtool: isDevelopment ? 'eval-source-map' : '',
    entry: {
      // this is entry just for other other files, entry point for main frontend file is below because of dynamic naming
      backend: isDevelopment ? [
        'webpack-dev-server/client?http://localhost:8888',
        'webpack/hot/only-dev-server',
        './static/js/backend.js'
      ] : [
        './static/js/backend.js'
      ]
    },
    module: {
      noParse: Object.keys(externalPlugins).map(function(k){return externalPlugins[k]}),
      loaders: [{
        exclude: /node_modules/,
        loaders: [
          'babel-loader'
        ],
        test: /\.js$/
      }]
    },
    output: isDevelopment ? {
      path: path.join(__dirname, '/js/'),
      filename: '[name].js',
      publicPath: 'http://localhost:8888/js/'
    } : {
      path: gulpConfig.outputPath + 'js/',
      filename: '[name].js'
    },
    plugins: (function() {
      var plugins = [];
      if (isDevelopment)
        plugins.push(
          NotifyPlugin,
          new webpack.HotModuleReplacementPlugin(),
          // new webpack.ProvidePlugin(bowerSubstitutions),
          // Tell reloader to not reload if there is an error.
          new webpack.NoErrorsPlugin()
        );
      else
        plugins.push(
          // new webpack.ProvidePlugin(bowerSubstitutions),
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.OccurenceOrderPlugin(),
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              // Because uglify reports so many irrelevant warnings.
              warnings: false
            }
          })
        );
      return plugins;
    })(),
    resolve: {
      modulesDirectories: ['node_modules', 'bower_components', 'static/js/vendor'],
      alias: externalPlugins,
      extensions: ['', '.js', '.jsx', '.json']
    }
  };

  config.entry[gulpConfig.mainJsFile] = isDevelopment ? [
    'webpack-dev-server/client?http://localhost:8888',
    // Why only-dev-server instead of dev-server:
    // https://github.com/webpack/webpack/issues/418#issuecomment-54288041
    'webpack/hot/only-dev-server',
    './' + gulpConfig.assetsPath + 'js/' + gulpConfig.mainJsFile + '.js'
  ] : [
    './' + gulpConfig.assetsPath + 'js/' + gulpConfig.mainJsFile + '.js'
  ];

  return config;

};
