var fs = require('fs');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var bower = require('gulp-bower');

var APP_ROOT = '../../';

/**
 * TODO: figure out a better way to detect if we are installing
 *       app modules vs. build repo modules
 * Are we installing an app modules, or the build repo modules?
 */
function isAppInstall() {
	return fs.existsSync(APP_ROOT + 'app/manifest.webapp');
}

/**
 * Copy needed files into app directory.
 */
gulp.task('app-copy', function() {
	if (!isAppInstall()) {
		return;
	}

	return gulp.src([
		'./app_files/.editconfig',
		'./app_files/.jshintrc',
		'./app_files/gulpfile.js'
		])
		.pipe(gulp.dest(APP_ROOT));
});

/**
 * Install bower components into app's path.
 */
gulp.task('app-bower-install', function() {
	if (!isAppInstall()) {
		return;
	}

	return bower({
		directory: './app/components',
		cwd: APP_ROOT
		}).on('error', function(e) {
			console.log('error running bower', e);
		})
		.pipe(gulp.dest('.'));
});

/**
 * Check if we are in app, and if so install app components.
 */
gulp.task('install', ['app-copy', 'app-bower-install']);

/**
 * Runs JSLint on all javascript files found in the app dir.
 */
gulp.task('lint', function () {
	// Note: To have the process exit with an error code (1) on
	//  lint error, return the stream and pipe to failOnError last.
	return gulp.src(['./app_files/**/*.js', './gulpfile.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
});

/**
 * Runs travis tests
 */
gulp.task('travis', ['lint']);
gulp.task('default', ['lint']);
