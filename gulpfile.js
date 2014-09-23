/* jshint node: true */
'use strict';

var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false}),
    noop = g.util.noop,
    requireDir = require('require-dir');

requireDir('./gulptasks');

gulp.task('help', g.taskListing);
gulp.task('dist', ['styles-dist']);


