import gulp              from 'gulp';
import config            from './config';
import sass              from 'gulp-sass';
import sourcemaps        from 'gulp-sourcemaps';
import webpackConfigDev  from './webpack/webpack.config';
import webpackConfigProd from './webpack/webpack.config.prod';
import webpack           from 'webpack';
import plumber           from 'gulp-plumber';
import pug               from 'gulp-pug';
import svgSymbols        from 'gulp-svg-symbols';
import rename            from 'gulp-rename';
import image             from 'gulp-imagemin';
import del               from 'del';
import runSequence       from 'run-sequence';
import gutil             from 'gulp-util';
import prettify          from 'gulp-html-prettify';
import webp              from 'gulp-webp';

import postcss           from 'gulp-postcss';
import cssnext           from 'postcss-cssnext';
import cssassets         from 'postcss-assets';
import cssnano           from 'gulp-cssnano';

const sprites   = require('postcss-sprites').default;
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const bundler = webpack(webpackConfigDev);

gulp.task('browser-sync', () => {
    browserSync.init({
        port: config.localPort,
        server: {
            baseDir: `./${config.outputPath}`,
            index: `${config.staticTemplatesFolder}/index.html`,

            middleware: [
                webpackDevMiddleware(bundler, {
                    publicPath: webpackConfigDev.output.publicPath,
                    noInfo: true,
                    inline: true,
                    stats: {
                        assets: false,
                        colors: true,
                        warnings: false
                    }
                }),
                webpackHotMiddleware(bundler)
            ]
        }
    });
});

// because of multiple extensions possibility [sass,scss]
const getCssSrcArray = () => {
    let retArr = [];

    config.mainCssFiles.map((cssFile) => {
        config.cssPreprocessor.map((preprocessor) => {
            retArr.push(`${config.assetsPath}${config.cssFolder}/${cssFile}.${preprocessor}`);
        });
    });

    return retArr;
};

// postCSS plugins
const processors = [
    cssnext({ browsers: ['last 2 versions', 'iOS 7', 'ie 10-11', 'Safari 8'] }),
    cssassets({
        cachebuster: true,
        loadPaths: [`../${config.imageFolder}/`]
    }),
    sprites({
        stylesheetPath: `${config.outputPath}${config.cssFolder}`,
        spritePath: `${config.outputPath}${config.imageFolder}`,
        filterBy: function(image) {
            // Allow png files only
            if (!/\.png$/.test(image.url) || image.path.indexOf('png-src') !== -1) {
                return Promise.reject();
            }
            return Promise.resolve();
        }
    }),
];

/***
* CSS-dev
*/
gulp.task('css-dev', () => {
    const cssFilesArray = getCssSrcArray();
    return gulp.src(cssFilesArray)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(`${config.outputPath}css`))
        .pipe(browserSync.stream());
});

/***
* CSS-prod
*/
gulp.task('css-prod', () => {
    const cssFilesArray = getCssSrcArray();
    return gulp.src(cssFilesArray)
        .pipe(sass())
        .pipe(postcss(processors))
        .pipe(cssnano())
        .pipe(gulp.dest(`${config.outputPath}css`))
});

/***
* Pug
*/
gulp.task('pug', () => {
    var YOUR_LOCALS = {};
    gulp.src([`${config.assetsPath}pug/*.pug`, '!' + `${config.assetsPath}pug/layout.pug`])
        .pipe(plumber())
        .pipe(pug({
            locals: YOUR_LOCALS,
            pretty: true
        }))
        .pipe(gulp.dest(`${config.assetsPath}${config.staticTemplatesFolder}`))
        .pipe(gulp.dest(`${config.outputPath}${config.staticTemplatesFolder}`));
});

/***
* Adjust indentation
*/
gulp.task('prettify', function() {
    gulp.src(`${config.assetsPath}${config.staticTemplatesFolder}/*.html`)
        .pipe(prettify({indent_char: ' ', indent_size: 4}))
        .pipe(gulp.dest(`${config.outputPath}${config.staticTemplatesFolder}`))
});

/***
*  Images
*/
gulp.task('images', ['cleanup','svg-sprite'], () => {
    return gulp.src([`${config.assetsPath}${config.imageFolder}/**/*`,
                    `!${config.assetsPath}${config.imageFolder}/${config.spritesFolder}/`,
                    `!${config.assetsPath}${config.imageFolder}/${config.spritesFolder}/*`,
                    `!${config.assetsPath}${config.imageFolder}/${config.svgFolder}/`,
                    `!${config.assetsPath}${config.imageFolder}/${config.svgFolder}/*`])
        .pipe(image([
            image.svgo({
                plugins: [
                    {removeUselessDefs: false},
                    {cleanupIDs: false},
                    {removeViewBox:false},
                    {removeUselessStrokeAndFill:false}
                ]
            })
        ]))
        .pipe(gulp.dest(`${config.outputPath}${config.imageFolder}`));
});

/***
* SVG - sprite
*/
gulp.task('svg-sprite', () => {
  return gulp.src(`${config.assetsPath}${config.imageFolder}/${config.svgFolder}/*.svg`)
        .pipe(svgSymbols({
            className:  '.icon--%f',
            title: false
        }))
        .pipe(rename((path) => {
            path.dirname = './'
            path.dirname += (path.extname === '.svg') ? config.imageFolder : config.cssFolder
            path.basename = (path.extname === '.svg') ? 'sprite' : 'svg-symbols'
            path.extname = (path.extname === '.svg') ? '.svg' : '.scss'
        }))
        .pipe(gulp.dest(config.assetsPath));
});

/***
* Webp - image format
*/
gulp.task('webp', function () {
    return gulp.src(`${config.outputPath}${config.imageFolder}/jpg/**/*.jpg`)
        .pipe(webp())
        .pipe(gulp.dest(`${config.outputPath}${config.imageFolder}/webp/`));
});

/***
* Webpack - production
*/
gulp.task('webpack-prod', function() {

    webpack(webpackConfigProd, function(err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack:build', err);
        }
        gutil.log('[webpack:build]', stats.toString({
            colors: true,
            noInfo: true
        }));
    })
});

/***
* Cleanup images
*/
gulp.task('cleanup', () => {
    return del([`${config.outputPath}${config.imageFolder}`]);
});

/***
* DEVELOPMENT
*/
gulp.task('default', ['pug','css-dev','images','browser-sync'], () => {
    // runSequence(['webp']);

    // watch pug
    gulp.watch(`${config.assetsPath}pug/**/*.pug`, ['pug']);

    // watch html
    gulp.watch(`${config.outputPath}${config.staticTemplatesFolder}/*.html`).on('change', reload);

    // watch css
    gulp.watch(`${config.assetsPath}${config.cssFolder}/**/*.sass`, ['css-dev']);

    // prettify html templates from pug
    // gulp.watch(`${config.assetsPath}${config.staticTemplatesFolder}/*.html`, ['prettify']);

    // watch images except sprites folders
    gulp.watch([`${config.assetsPath}${config.imageFolder}/**/*.{jpg,jpeg,png,gif,svg}`,
              `!${config.assetsPath}${config.imageFolder}/${config.spritesFolder}/`,
              `!${config.assetsPath}${config.imageFolder}/${config.spritesFolder}/*`,
              `!${config.assetsPath}${config.imageFolder}/${config.svgFolder}/`,
              `!${config.assetsPath}${config.imageFolder}/${config.svgFolder}/*`,
              `!${config.assetsPath}${config.imageFolder}/sprite.svg`])
        .on('change', (file) => {
            if(file.type !== 'deleted') {
                var sourceFolder = config.assetsPath + config.imageFolder,
                    folderIndex = file.path.indexOf(sourceFolder) + sourceFolder.length + 1,
                    subFolders = file.path.substr(folderIndex).split('/'),
                    outputFolder = config.outputPath + config.imageFolder;

                if(subFolders.length > 1){

                    var fileOffsetLen = subFolders.length - 1;
                    if(subFolders[fileOffsetLen] == '') {
                        fileOffsetLen = subFolders.length - 2;
                    }
                    for(var s = 0; s < fileOffsetLen; s++){
                        outputFolder += '/' + subFolders[s];
                    }
                }
                gulp.src(file.path)
                    .pipe(image())
                    .pipe(gulp.dest(outputFolder));
            }
        });

    // watch svg sprites
    gulp.watch([`${config.assetsPath}${config.imageFolder}/${config.svgFolder}/*`]).on('change', () => {
        runSequence(['svg-sprite'], function() {
            gulp.src(`${config.assetsPath}${config.imageFolder}/sprite.svg`)
                .pipe(gulp.dest(`${config.outputPath}${config.imageFolder}`));
        });
    });
});

/***
* PRODUCTION
*/
gulp.task('build', ['pug','webpack-prod','css-prod','images'], () => {
    runSequence(['prettify']);
    // runSequence(['webp','prettify']);
});