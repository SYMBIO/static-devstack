'use strict';

var gutil = require('gulp-util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('../config')

module.exports = function(webpackConfig) {
  return function(callback) {
    new WebpackDevServer(webpack(webpackConfig), {
      contentBase: 'http://localhost:' + config.localPort,
      hot: true,
      publicPath: webpackConfig.output.publicPath,
      // Unfortunately quiet swallows everything even error so it can't be used.
      quiet: false,
      // No info filters only initial compilation it seems.
      noInfo: true,
      // Remove console.log mess during watch.
      stats: {
        assets: false,
        colors: true,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false
      }
    }).listen(config.localPort, '0.0.0.0', function(err) {
      // Callback is called only once, can't be used to catch compilation errors.
      if (err)
        throw new gutil.PluginError('webpack-dev-server', err);

      config.mainJsFiles.map(function(file, index) {
        gutil.log('[webpack-dev-server]', 'localhost:' + config.localPort + '/js/' + file + '.js');
      });

      callback();
    });
  };
};
