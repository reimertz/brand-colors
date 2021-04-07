/* jshint node: true */
'use strict';

var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false}),
    requireDir = require('require-dir');

requireDir('./gulptasks');

gulp.task('help', g.taskListing);
gulp.task('dev', gulp.series('live-server'));
gulp.task('dist', gulp.series('styles-dist'));

gulp.task('deploy', gulp.series('dev-build', function() {
  return gulp.src(['./.tmp/**/*'])
    .pipe(g.ghPages());
}));
