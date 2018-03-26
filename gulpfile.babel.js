import {
    port,
    assetsPath,
    outputPath,
    staticTemplatesFolder,
    imageFolder,
    spritesFolder,
    svgFolder,
    cssFolder
} from './config';
import gulp              from 'gulp';
import sourcemaps        from 'gulp-sourcemaps';
import plumber           from 'gulp-plumber';
import pug               from 'gulp-pug';
import svgSymbols        from 'gulp-svg-symbols';
import rename            from 'gulp-rename';
import image             from 'gulp-imagemin';
import del               from 'del';
import runSequence       from 'run-sequence';
import prettify          from 'gulp-html-prettify';
import webp              from 'gulp-webp';
import notify            from 'gulp-notify';
import eslint            from 'gulp-eslint';

/* postcss plugins */
import postcss           from 'gulp-postcss';
import cssnext           from 'postcss-cssnext';
import csscalc           from 'postcss-calc';
import cssassets         from 'postcss-assets';
import cssnano           from 'gulp-cssnano';
import precss            from 'precss';
import sugarss           from 'sugarss';
import easyImport        from 'postcss-easy-import';
import discardEmpty      from 'postcss-discard-empty';
import colorFunction     from 'postcss-color-function';
import objectFit         from 'postcss-object-fit-images';

const hexrgba = require('postcss-hexrgba');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

gulp.task('browser-sync', () => {
    browserSync.init({
        port: port,
        open: false,
        server: {
            baseDir: `./${outputPath}`,
            index: `${staticTemplatesFolder}/index.html`
        }
    });
});

/* postcss plugins */
const supportedBrowsers = ['last 2 versions', 'not ie <= 10', 'Safari 8'];

const postCSSplugins = [
    easyImport(),
    precss(),
    csscalc(),
    colorFunction(),
    hexrgba(),
    objectFit(),
    cssnext({ browsers: supportedBrowsers }),
    cssassets({
        cachebuster: true,
        relative: true,
        loadPaths: [
            `./${assetsPath}${imageFolder}/png/`,
            `./${assetsPath}${imageFolder}/png-src/`,
            `./${assetsPath}${imageFolder}/jpg/`,
            `./${assetsPath}${imageFolder}/svg/`
        ]
    }),
    discardEmpty()
];

/**
* CSS-dev
*/
gulp.task('css-dev', () => {
    return gulp.src(`${assetsPath}css/style.sss`)
        .pipe(sourcemaps.init())
        .pipe(postcss(postCSSplugins, { parser: sugarss }))
        .on('error', function(err) {
            notify({
                title: 'css',
                message: err,
                sound: 'Beep'
            }).write(err);
            this.emit('end');
        })
        .pipe(sourcemaps.write())
        .pipe(rename({ extname: '.css' }))
        .pipe(gulp.dest(`${outputPath}css/`))
        .pipe(browserSync.stream());
});

/**
* CSS-prod
*/
gulp.task('css-prod', () => {
    return gulp.src(`${assetsPath}css/style.sss`)
        .pipe(postcss(postCSSplugins, { parser: sugarss }))
        .pipe(rename({ extname: '.css' }))
        .pipe(cssnano({ autoprefixer: { browsers: supportedBrowsers } }))
        .pipe(gulp.dest(`${outputPath}css/`));
});

/**
* Pug
*/
gulp.task('pug', () => {
    var YOUR_LOCALS = {
        js_path: process.env.NODE_ENV === 'development' ? 'http://localhost:8000/' : '/js/'
    };

    gulp.src([`${assetsPath}pug/*.pug`, '!' + `${assetsPath}pug/layout.pug`])
        .pipe(plumber())
        .pipe(pug({
            locals: YOUR_LOCALS,
            pretty: true
        }))
        .on('error', function(err) {
            notify({
                title: 'Pug',
                message: err,
                sound: 'Beep'
            }).write(err);
            this.emit('end');
        })
        .pipe(gulp.dest(`${assetsPath}${staticTemplatesFolder}`))
        .pipe(gulp.dest(`${outputPath}${staticTemplatesFolder}`));
});

/**
* Adjust indentation
*/
gulp.task('prettify', () => {
    gulp.src(`${assetsPath}${staticTemplatesFolder}/*.html`)
        .pipe(prettify({ indent_char: ' ', indent_size: 4 }))
        .pipe(gulp.dest(`${outputPath}${staticTemplatesFolder}`));
});

/**
*  Images
*/
gulp.task('images', ['cleanup', 'svg-sprite'], () => {
    return gulp.src([
        `${assetsPath}${imageFolder}/**/*`,
        `!${assetsPath}${imageFolder}/${spritesFolder}/`,
        `!${assetsPath}${imageFolder}/${spritesFolder}/*`,
        `!${assetsPath}${imageFolder}/${svgFolder}/`,
        `!${assetsPath}${imageFolder}/${svgFolder}/*`
    ])
        .pipe(image([
            image.svgo({
                plugins: [
                    { removeUselessDefs: false },
                    { cleanupIDs: false },
                    { removeViewBox: false },
                    { removeUselessStrokeAndFill: false }
                ]
            })
        ]))
        .pipe(gulp.dest(`${outputPath}${imageFolder}`));
});

/**
* SVG - sprite
*/
gulp.task('svg-sprite', () => {
    return gulp.src(`${assetsPath}${imageFolder}/${svgFolder}/*.svg`)
        .pipe(svgSymbols({
            class: '.icon--%f',
            title: false
        }))
        .pipe(rename(path => {
            path.dirname = './';
            path.dirname += (path.extname === '.svg') ? imageFolder : cssFolder;
            path.basename = (path.extname === '.svg') ? 'sprite' : 'svg-symbols';
            path.extname = (path.extname === '.svg') ? '.svg' : '.css';
        }))
        .pipe(gulp.dest(assetsPath));
});

/**
* Webp - image format
*/
gulp.task('webp', () => {
    return gulp.src(`${outputPath}${imageFolder}/jpg/**/*.jpg`)
        .pipe(webp())
        .pipe(gulp.dest(`${outputPath}${imageFolder}/webp/`));
});

/**
* Static analysis => ESlint
*/
gulp.task('eslint', () => {
    return gulp.src([`${assetsPath}/js/**/*.js`, '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format());
});

/**
* Cleanup images
*/
gulp.task('cleanup', () => {
    return del([`${outputPath}${imageFolder}`]);
});

/**
* DEVELOPMENT
*/
gulp.task('default', ['pug', 'css-dev', 'images', 'browser-sync', 'eslint'], () => {
    // watch pug
    gulp.watch(`${assetsPath}pug/**/*.pug`, ['pug']);

    // watch html
    gulp.watch(`${outputPath}${staticTemplatesFolder}/*.html`).on('change', reload);

    // watch js
    gulp.watch(`${assetsPath}js/**/*.js`, ['eslint']);

    // watch css
    gulp.watch(`${assetsPath}${cssFolder}/**/*.sss`, ['css-dev']);

    // watch images except sprites folders
    gulp.watch([
        `${assetsPath}${imageFolder}/**/*.{jpg,jpeg,png,gif,svg}`,
        `!${assetsPath}${imageFolder}/${spritesFolder}/`,
        `!${assetsPath}${imageFolder}/${spritesFolder}/*`,
        `!${assetsPath}${imageFolder}/${svgFolder}/`,
        `!${assetsPath}${imageFolder}/${svgFolder}/*`,
        `!${assetsPath}${imageFolder}/sprite.svg`
    ])
        .on('change', (file) => {
            if (file.type !== 'deleted') {
                var sourceFolder = assetsPath + imageFolder,
                    folderIndex = file.path.indexOf(sourceFolder) + sourceFolder.length + 1,
                    subFolders = file.path.substr(folderIndex).split('/'),
                    outputFolder = outputPath + imageFolder;

                if (subFolders.length > 1) {
                    let fileOffsetLen = subFolders.length - 1;
                    if (subFolders[fileOffsetLen] === '') {
                        fileOffsetLen = subFolders.length - 2;
                    }
                    for (let s = 0; s < fileOffsetLen; s++) {
                        outputFolder += '/' + subFolders[s];
                    }
                }
                gulp.src(file.path)
                    .pipe(image())
                    .pipe(gulp.dest(outputFolder));
            }
        });

    // watch svg sprites
    gulp.watch([`${assetsPath}${imageFolder}/${svgFolder}/*`]).on('change', () => {
        runSequence(['svg-sprite'], function() {
            gulp.src(`${assetsPath}${imageFolder}/sprite.svg`)
                .pipe(gulp.dest(`${outputPath}${imageFolder}`));
        });
    });
});

/**
* PRODUCTION
*/
gulp.task('build', ['pug', 'css-prod', 'images'], () => {
    runSequence(['prettify']);
});
