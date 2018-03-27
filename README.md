# SYMBIO static-devstack

### Version
1.5.0

### Description
Frontend static devstack including:
* [Webpack 4](https://webpack.github.io/) a module bundler
* [Hot Module Replacement](https://webpack.github.io/docs/hot-module-replacement.html) (HMR) is a feature to inject updated modules into the active runtime
* [Gulp](http://gulpjs.com/) a JavaScript task manager
* [Babel](https://babeljs.io/) a JavaScript compiler
* [Pug](http://jade-lang.com/) a HTML template engine
* [Postcss](http://postcss.org/) a tool for transforming CSS with JavaScript

### Installation
```sh
$ git clone https://github.com/SYMBIO/static-devstack.git
$ yarn
```

### Development
```sh
$ yarn run dev
```

### Production
```sh
$ yarn run build
```

### PostCSS plugins
PostCSS plugins reference:
* [PostCSS](https://github.com/postcss/postcss)
* [precss](https://github.com/jonathantneal/precss) Sass-like markup in your CSS.
* [sugarss](https://github.com/postcss/sugarss) Indent-based CSS syntax for PostCSS.
* [cssnext](http://cssnext.io/features/#automatic-vendor-prefixes) Discover the future of CSS (includes autoprefixer).
* [postcss-assets](https://github.com/assetsjs/postcss-assets) PostCSS Assets is an asset manager for CSS. It isolates stylesheets from environmental changes, gets image sizes and inlines files.
* [postcss-sprites](https://github.com/2createStudio/postcss-sprites) PostCSS plugin that generates spritesheets from your stylesheets.
* [postcss-calc](https://github.com/postcss/postcss-calc) This plugin reduce calc() references whenever it's possible.
* [cssnano](http://cssnano.co/) A modular minifier, built on top of the PostCSS ecosystem.
* [postcss-color-function](https://github.com/postcss/postcss-color-function) PostCSS plugin to transform W3C CSS color function to more compatible CSS

**postcss-sprites** -
sprite is generated only from .png files , if you don't want a particular file to be included in sprite (file size) , move it to the 'png-src' folder.
