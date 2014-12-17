/**
 * IMPORTANT: This file is installed into the app directory as part of the
 * npm install fxos-build process. Please do not try to modify this file
 * or create additional build steps without checking with the team first.
 *
 * For any build system feature requests or bugs, please open
 * an issue in the fxos-build project: https://github.com/fxos/build/issues
 */

var gulp = require('gulp');

var buildModules = __dirname + '/node_modules/fxos-build/node_modules/';
var concat = require(buildModules + 'gulp-concat');
var to5 = require(buildModules + 'gulp-6to5');
var jshint = require(buildModules + 'gulp-jshint');
var yargs = require(buildModules + 'yargs')
var zip = require(buildModules + 'gulp-zip');

/**
 * Runs JSLint on all javascript files found in the app dir.
 */
gulp.task('lint', function () {
	// Note: To have the process exit with an error code (1) on
	//  lint error, return the stream and pipe to failOnError last.
	return gulp.src(['./app/js/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
});

/**
 * Moves files into place for travis or local testing.
 */
gulp.task('initialize', function () {
	// Copies files
	return gulp.src([
		'./.jshintrc',
		'gulpfile.js'
		])
		.pipe(gulp.dest('./'));
});

/**
 * Copies necessary files for the 6to5 AMD loader to the app.
 */
gulp.task('loader-polyfill', function () {
	return gulp.src(['./node_modules/fxos-build/loader_polyfill/*.js'])
		.pipe(concat('initapp.js'))
		.pipe(gulp.dest('./app/dist'));
});

/**
 * Converts javascript to ES5. This allows us to use harmony classes and modules.
 */
gulp.task('to5', function () {
	var files = ['./app/js/**/*.js'];

	// Now add any files from the --component-modules argument.
	var args = yargs.argv;
	if (args.componentModules) {
		var external = args.componentModules.split(',');
		for (var i = 0; i < external.length; i++) {
			files.push('./app/components/' + external[i]);
		}
	}

	try {
		return gulp.src(files)
			.pipe(to5({
					modules: 'amd'
				}).on('error', function(e) {
					console.log('error running 6to5', e);
				})
			)
			.pipe(gulp.dest('./app/dist'));
	}  catch(e) {
		console.log('Got error in 6to5', e);
	}
});

/**
 * Packages the application into a zip.
 */
gulp.task('zip', function () {
	var appRoot = './app/';
	return gulp.src([
			appRoot + '**',			// all app files
			'!' + appRoot + 'js/**'	// not js/ folder as we build that into dist/
		])
		.pipe(zip('app.zip'))
		.pipe(gulp.dest('.'));
});

/**
 * Runs travis tests
 */
gulp.task('travis', ['lint', 'loader-polyfill', 'to5'], function () {});

/**
 * The default task when `gulp` is run.
 * Adds a listener which will re-build on a file save.
 */
gulp.task('default', ['lint', 'loader-polyfill', 'to5', 'zip'], function () {
	var appRoot = './app/';
	gulp.watch([
		appRoot + 'js/**/*.js'
	], ['loader-polyfill', 'to5', 'zip', 'lint']);

	// TODO: Live-reload or push to a device.

	console.log('Watching for changes.');
});

/**
 * Cleans all created files by this gulpfile, and node_modules.
 */
gulp.task('clean', function () {
	var clean = require(buildModules + 'gulp-clean');
	return gulp.src([
		'.editorconfig',
		'.jshintrc',
		'app/dist/',
		'node_modules/',
		'gulpfile.js'
		], {read: false})
		.pipe(clean());
});
