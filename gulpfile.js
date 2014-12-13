var gulp = require('gulp');
var eslint = require('gulp-eslint');

gulp.task('lint', function () {
	// Note: To have the process exit with an error code (1) on
	//  lint error, return the stream and pipe to failOnError last.
	return gulp.src(['./../../app/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

/**
 * Moves the travis.yml file into place for travis testing.
 */
gulp.task('travis', function () {
	return gulp.src('./.travis.yml')
		.pipe(gulp.dest('./../..'));
});

gulp.task('default', ['lint'], function () {
	// This will only run if the lint task is successful...
});