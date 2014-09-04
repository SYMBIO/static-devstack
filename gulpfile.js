var gulp 	= require('gulp');
var stylus 	= require('gulp-stylus');
var nib 	= require('nib');


gulp.task('stylus', function () {
	var location;
	gulp.src('./web/**/main.styl', {base: './'})
		.pipe(stylus({
			use: [nib()],
			sourcemap: {inline: true}
		}))
		.pipe(gulp.dest('./'));
});

gulp.task('stylus-buld', function () {
	var location;
	gulp.src('./web/**/main.styl', {base: './'})
		.pipe(stylus({
			use: [nib()]
		}))
		.pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
	gulp.watch('./web/**/*.styl', ['stylus']);
});

gulp.task('default', ['stylus', 'watch']);

gulp.task('build', ['stylus-build']);
