'use strict'

var gulp = require('gulp')
var plumber = require('gulp-plumber')
var stylus = require('gulp-stylus')
var sourcemaps = require('gulp-sourcemaps')
var prefix = require('gulp-autoprefixer')
var imagemin = require('gulp-imagemin')
var spritesmith = require('gulp.spritesmith')
var svgSymbols = require('gulp-svg-symbols')
var rename = require('gulp-rename')
var clean = require('gulp-clean')
var os = require('os')
var htmlreplace = require('gulp-html-replace')
var pngquant = require('imagemin-pngquant')
var makeWebpackConfig = require('./webpack/makeconfig')
var webpackBuild = require('./webpack/build')
var webpackDevServer = require('./webpack/devserver')
var browserSync = require('browser-sync').create()
var reload = browserSync.reload

var config = require('./config')

gulp.task('browser-sync', function() {
    browserSync.init({
      server: {
        baseDir: './' + config.outputPath
      }
    });
});

// clean image folder
gulp.task('cleanup', function() {
  return gulp.src(config.outputPath + config.imageFolder, {read: false})
          .pipe(clean())
})

// development css
gulp.task('css-dev', function() {
  return gulp.src([config.assetsPath + config.cssPreprocessor + '/' + config.mainCssFile + '.' + config.cssPreprocessor])
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(stylus())
    .pipe(sourcemaps.write())
    .pipe(prefix())
    .pipe(gulp.dest(config.outputPath + 'css'))
    .pipe(browserSync.stream())
})

// production css
gulp.task('css-prod', function() {
  return gulp.src([config.assetsPath + config.cssPreprocessor + '/' + config.mainCssFile + '.' + config.cssPreprocessor])
    .pipe(stylus({
      compress: true
    }))
    .pipe(prefix('last 10 versions', '> 1%', 'Firefox >= 10'))
    .pipe(gulp.dest(config.outputPath + 'css'))
})

// png sprite
gulp.task('img-sprite', function() {
  var spriteData = gulp.src(config.assetsPath + config.imageFolder + '/' + config.spritesFolder + '/*.png')
    .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'img-sprite.' + config.cssPreprocessor,
        algorithm: 'binary-tree',
        imgPath: '../' + config.imageFolder + '/sprite.png?v=' + Date.now(),
        padding: 10
    }))

  spriteData.img
      .pipe(gulp.dest(config.assetsPath + config.imageFolder))

  spriteData.css
      .pipe(gulp.dest(config.assetsPath + config.cssPreprocessor))

  return spriteData
})

// svg sprite
gulp.task('svg-sprite', function() {
  return gulp.src(config.assetsPath + config.imageFolder + '/' + config.svgFolder + '/*.svg')
          .pipe(svgSymbols({
            className:  '.icon--%f',
            title: false
          }))
          .pipe(rename(function(path) {
            path.dirname = './'
            path.dirname += (path.extname === '.svg') ? config.imageFolder : config.cssPreprocessor
            path.basename = (path.extname === '.svg') ? 'sprite' : 'svg-symbols'
            path.extname = (path.extname === '.svg') ? '.svg' : '.' + config.cssPreprocessor
          }))
          .pipe(gulp.dest(config.assetsPath))
})

// copy images to outputPath and optimize them
gulp.task('img-optimize', ['cleanup', 'img-sprite', 'svg-sprite'], function () {
  return gulp.src([config.assetsPath + config.imageFolder + '/**/*',
                  '!' + config.assetsPath + config.imageFolder + '/' + config.spritesFolder +'/',
                  '!' + config.assetsPath + config.imageFolder + '/' + config.spritesFolder +'/*',
                  '!' + config.assetsPath + config.imageFolder + '/' + config.svgFolder + '/',
                  '!' + config.assetsPath + config.imageFolder + '/' + config.svgFolder + '/*'])
    .pipe(imagemin({
        progressive: true,
        // svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest(config.outputPath + config.imageFolder))
})

// get local ip
var _ip = null;
gulp.task('local-ip', function(){
  var ifaces = os.networkInterfaces();
  for (var dev in ifaces) {
    if(dev != "en1" && dev != "en0") {
      continue;
    }
    ifaces[dev].forEach(function(details){
      if (details.family=='IPv4') {
        _ip = details.address;
      }
    });
  };
});

// set js path
gulp.task('js-path', function(){
  var host = _ip !== null ? 'http://' + _ip + ':' + config.localPort : '';
  var scripts = [];
  config.mainJsFiles.map(function(file, index){
    scripts.push(host + '/js/' + file + '.js?v=' + new Date().getTime() );
  });

  gulp.src(['src/**/*.twig', 'web/static/**/*.html'], { base: './' })
      .pipe(htmlreplace(
        { js: scripts },
        {
          keepBlockTags: true,
          resolvePaths: false
        }
      ))
      .pipe(gulp.dest('.'));
});

// just function triggers
gulp.task('images', ['img-optimize'])
gulp.task('webpack-prod', webpackBuild(makeWebpackConfig(false)))
gulp.task('webpack-dev', webpackDevServer(makeWebpackConfig(true)))

gulp.task('default', ['local-ip', 'js-path', 'browser-sync', 'images', 'css-dev', 'webpack-dev'], function() {
  // watch css files and image files, js is watched automatically by webpack-dev-server
  gulp.watch(config.outputPath + config.staticTemplatesFolder + '/**/*.html').on('change', reload)
  gulp.watch(config.assetsPath + config.cssPreprocessor + '/**/*.' + config.cssPreprocessor, ['css-dev'])
  
  // watch png sprites
  gulp.watch([config.assetsPath + config.imageFolder + '/' + config.spritesFolder + '/*']).on('change', function(){
    gulp.start('img-sprite');
  });

  // watch svg sprites
  gulp.watch([config.assetsPath + config.imageFolder + '/' + config.svgFolder + '/*']).on('change', function(){
    gulp.start('svg-sprite');
  });
  
  // watch all other images, except for generated sprite.png, sprite.svg and sprites/svg folders
  gulp.watch([
              config.assetsPath + config.imageFolder + '/**/*.{jpg,jpeg,png,gif,svg}', 
              '!' + config.assetsPath + config.imageFolder + '/sprite.png',
              '!' + config.assetsPath + config.imageFolder + '/sprite.svg',
              '!' + config.assetsPath + config.imageFolder + '/' + config.spritesFolder +'/',
              '!' + config.assetsPath + config.imageFolder + '/' + config.spritesFolder +'/*',
              '!' + config.assetsPath + config.imageFolder + '/' + config.svgFolder + '/',
              '!' + config.assetsPath + config.imageFolder + '/' + config.svgFolder + '/*'
            ]).on('change', function(file){

              var outputFolder = config.outputPath + config.imageFolder;

              if(file.type === 'deleted'){
                
                gulp
                .src(file.path)
                .pipe(clean({force: true}))
                .pipe( gulp.dest(outputFolder) );

              }else{

                var sourceFolder = config.assetsPath + config.imageFolder,
                    folderIndex = file.path.indexOf(sourceFolder) + sourceFolder.length + 1,
                    subFolders = file.path.substr(folderIndex).split('/');

                if(subFolders.length > 1){

                  var fileOffsetLen = subFolders.length - 1;
                  if(subFolders[fileOffsetLen] == ''){
                    fileOffsetLen = subFolders.length - 2;
                  }
                  for(var s = 0; s < fileOffsetLen; s++){
                    outputFolder += '/' + subFolders[s];
                  }
                }


                console.log("SUB INDEX", subFolders);

                gulp
                .src(file.path)
                .pipe(imagemin({
                    progressive: true,
                    use: [pngquant()]
                }))
                .pipe( gulp.dest(outputFolder) );
              }

            }).on('error', function(){
              console.log("File watch error...")
            });
})

gulp.task('build', ['js-path', 'images', 'css-prod', 'webpack-prod'])




