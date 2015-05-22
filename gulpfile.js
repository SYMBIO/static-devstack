'use strict';

var gulp = require('gulp');
var stylus = require('gulp-stylus');
var sourcemaps = require('gulp-sourcemaps');
var prefix = require('gulp-autoprefixer');
var makeWebpackConfig = require('./webpack/makeconfig');
var webpackBuild = require('./webpack/build');
var webpackDevServer = require('./webpack/devserver');

var config = require('./config');


gulp.task('css-dev', function() {
  gulp.src([config.staticPath + config.cssPreprocessor + '/' + config.mainCssFile + '.' + config.cssPreprocessor])
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(sourcemaps.write())
    .pipe(prefix())
    .pipe(gulp.dest(config.outputPath + 'css'))
});

gulp.task('css-prod', function() {
  gulp.src([config.staticPath + config.cssPreprocessor + '/' + config.mainCssFile + '.' + config.cssPreprocessor])
    .pipe(stylus({
      compress: true
    }))
    .pipe(prefix('last 10 versions', '> 1%', 'Firefox >= 10'))
    .pipe(gulp.dest(config.outputPath + 'css'));
});

gulp.task('webpack-prod', webpackBuild(makeWebpackConfig(false)));
gulp.task('webpack-dev', webpackDevServer(makeWebpackConfig(true)));

gulp.task('default', ['css-dev', 'webpack-dev'], function() {
  gulp.watch(config.staticPath + config.cssPreprocessor + '/**/*.' + config.cssPreprocessor, ['css-dev'])
});

gulp.task('build', ['css-prod', 'webpack-prod'])