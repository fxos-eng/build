var gulp = require('gulp');
var to5 = require('gulp-6to5');
var jshint = require('gulp-jshint');

gulp.task('lint', function () {
	// Note: To have the process exit with an error code (1) on
	//  lint error, return the stream and pipe to failOnError last.
	return gulp.src(['./../../app/js/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
});

/**
 * Moves files into place for travis or local testing.
 */
gulp.task('ci', function () {
	// Copies files
	return gulp.src(['./.jshintrc'])
		.pipe(gulp.dest('./../..'));
});

gulp.task('to5', function () {
	return gulp.src(['./../../app/js/**/*.js'])
		.pipe(to5())
		.pipe(gulp.dest('./../../app/dist'));
});

gulp.task('default', ['lint', 'to5'], function () {
	// This will only run if the lint task is successful...
});
