var gulp = require('gulp');
var jshint = require('gulp-jshint');

/**
 * Runs JSLint on all javascript files found in the app dir.
 */
gulp.task('lint', function () {
	// Note: To have the process exit with an error code (1) on
	//  lint error, return the stream and pipe to failOnError last.
	return gulp.src(['./lib/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
});

/**
 * Runs travis tests
 */
gulp.task('travis', ['lint']);

gulp.task('default', ['lint']);

exports = gulp;
