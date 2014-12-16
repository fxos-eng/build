var concat = require('gulp-concat');
var gulp = require('gulp');
var to5 = require('gulp-6to5');
var jshint = require('gulp-jshint');
var zip = require('gulp-zip');

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

gulp.task('loader-polyfill', function () {
	return gulp.src(['./loader_polyfill/*.js'])
		.pipe(concat('initapp.js'))
		.pipe(gulp.dest('./../../app/dist'));
});

gulp.task('to5', function () {
	var files = ['./../../app/js/**/*.js'];

	// Now add any files from the --component-modules argument.
	var args = require('yargs').argv;
	if (args.componentModules) {
		var external = args.componentModules.split(',');
		for (var i = 0; i < external.length; i++) {
			files.push('./../../app/components/' + external[i]);
		}
	}

	return gulp.src(files)
		.pipe(to5({
			modules: 'amd'
		}))
		.pipe(gulp.dest('./../../app/dist'));
});

gulp.task('zip', function () {
	var appRoot = './../../app/';
	return gulp.src([
			appRoot + '**',			// all app files
			'!' + appRoot + 'js/**'	// not js/ folder as we build that into dist/
		])
		.pipe(zip('app.zip'))
		.pipe(gulp.dest('./../..'));
});

/**
 * Runs travis tests
 */

gulp.task('travis', ['lint', 'loader-polyfill', 'to5'], function () {});

gulp.task('default', ['lint', 'loader-polyfill', 'to5', 'zip'], function () {
	var appRoot = './../../app/';
	gulp.watch([
		appRoot + 'js/**/*.js'
	], ['loader-polyfill', 'to5', 'zip']);

	// TODO: Live-reload or push to a device.

	console.log('Watching for changes.');
});
