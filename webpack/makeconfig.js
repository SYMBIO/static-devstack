'use strict';

var NotifyPlugin = require('./notifyplugin');
var path = require('path');
var webpack = require('webpack');
var gulpConfig = require('../config')

module.exports = function(isDevelopment) {

  var config = {
    cache: isDevelopment,
    debug: isDevelopment,
    devtool: isDevelopment ? 'eval-source-map' : '',
    entry: {
      app: isDevelopment ? [
        'webpack-dev-server/client?http://localhost:8888',
        // Why only-dev-server instead of dev-server:
        // https://github.com/webpack/webpack/issues/418#issuecomment-54288041
        'webpack/hot/only-dev-server',
        './' + gulpConfig.assetsPath + 'js/' + gulpConfig.mainJsFile + '.js'
      ] : [
        './' + gulpConfig.assetsPath + 'js/' + gulpConfig.mainJsFile + '.js'
      ],
    },
    module: {
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
      filename: gulpConfig.mainJsFile + '.js',
      publicPath: 'http://localhost:8888/js/'
    } : {
      path: gulpConfig.outputPath + 'js/',
      filename: gulpConfig.mainJsFile + '.js'
    },
    plugins: (function() {
      var plugins = [];
      if (isDevelopment)
        plugins.push(
          NotifyPlugin,
          new webpack.HotModuleReplacementPlugin(),
          // Tell reloader to not reload if there is an error.
          new webpack.NoErrorsPlugin()
        );
      else
        plugins.push(
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
      extensions: ['', '.js', '.jsx', '.json']
    }
  };

  return config;

};
