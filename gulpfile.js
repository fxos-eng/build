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
		'./app_files/.bowerrc',
		'./app_files/.editorconfig',
		'./app_files/.jshintrc',
		'./app_files/gulpfile.js',
		'./app_files/deploy.sh'
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

	// Make sure we have bower componenets to install.
	if (!fs.existsSync(APP_ROOT + 'bower.json')) {
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
 * Install pre-commit hook for app.
 */
gulp.task('app-pre-commit', function() {
	if (!isAppInstall()) {
		return;
	}

	return gulp.src(['./app_files/pre-commit'])
		.pipe(gulp.dest(APP_ROOT + '.git/hooks/'));
});

/**
 * Check if we are in app, and if so install app components.
 */
gulp.task('install', ['app-copy', 'app-bower-install', 'app-pre-commit']);

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
