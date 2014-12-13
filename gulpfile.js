var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('lint', function () {
	// Note: To have the process exit with an error code (1) on
	//  lint error, return the stream and pipe to failOnError last.
	return gulp.src(['./../../app/js/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

/**
 * Moves files into place for travis or local testing.
 */
gulp.task('ci', function () {
	// Copies files
	return gulp.src(['./.travis.yml', './.jshintrc'])
		.pipe(gulp.dest('./../..'));
});

gulp.task('default', ['lint'], function () {
	// This will only run if the lint task is successful...
});