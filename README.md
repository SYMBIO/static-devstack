# static-sandbox
* `sudo npm i -g gulp` - skip this step if you run gulp v3.9.0 at least
* `sudo npm i`
* `gulp` - dev mode
* `gulp -s` / `gulp --sync` - dev mode with browser sync
* `gulp build` - production build
* **TODO: fill in description in main css file (project, author,etc.)**

## SASS
[Normalize.css](https://www.npmjs.com/package/normalize.css-importable), [Bourbon](http://bourbon.io/) and [Neat](http://neat.bourbon.io/) are included and linked in main Sass file.

## Retina sprites
Sprites are set to generate retina variant too.
But you has to follow these rules, otherwise will gulp task fail:
* Every image in `frontend/img/sprites` has to have both variants - regular and double sized with `_2x` suffix (for ex. `some-icon.png` and `some-icon_2x.png`).
* Retina version has to be **exactly** double sized in compare to regular version.
* In mixin `@include retine-sprite()` you has to use `-global` variable (for ex. `$some-icon-global`).

## Create local app
You can build whole app using nw (formerly node-webkit). Just run:
> gulp build-app
> npm start
