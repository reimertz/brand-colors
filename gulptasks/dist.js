/* jshint node: true */
'use strict';

var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false}),
    noop = g.util.noop,
    swig = require('gulp-swig'),
    camelCase = require('camel-case').camelCase,
    companies = require('../data/brandColors.js'),
    version = require('../package.json').version,
    template = {
      version: version,
      companies: companies.getAll()
    };

function camelCaseNames(company) {
  if (typeof company === 'object') {
    return company.map(comp => ({ name: camelCase(comp.name), color: comp.color }))
  }
}

function fixCompanyNames(company) {
  let result = camelCaseNames(company)
  if (typeof result === 'object') {
    return result.map(comp => ({ name: `${comp.name.match(/^\d/) ? '_' : ''}${comp.name}`, color: comp.color }))
  }
}

gulp.task('render-js', function () {
  return gulp.src(['templates/brand-colors.js'])
    .on('error', g.notify.onError('<%= error.message%>'))
    .pipe(g.data({
      version: version,
      companies: fixCompanyNames(companies.getByGroup())
    }))
    .pipe(swig())
    .pipe(g.rename('brand-colors.latest.js'))
    .pipe(gulp.dest('dist/latest/js/'))
    .pipe(g.rename('brand-colors.' + version + '.js'))
    .pipe(gulp.dest('dist/'+ version + '/js/'));
});

gulp.task('render-scss', function () {
  return gulp.src(['templates/brand-colors.scss'])
    .on('error', g.notify.onError('<%= error.message%>'))
    .pipe(g.data(template))
    .pipe(swig())
    .pipe(g.rename('brand-colors.latest.scss'))
    .pipe(gulp.dest('dist/latest/scss/'))
    .pipe(g.rename('brand-colors.' + version + '.scss'))
    .pipe(gulp.dest('dist/'+ version + '/scss/'));
});

gulp.task('render-less', function () {
  return gulp.src(['templates/brand-colors.less'])
    .on('error', g.notify.onError('<%= error.message%>'))
    .pipe(g.data(template))
    .pipe(swig())
    .pipe(g.rename('brand-colors.latest.less'))
    .pipe(gulp.dest('dist/latest/less/'))
    .pipe(g.rename('brand-colors.' + version + '.less'))
    .pipe(gulp.dest('dist/'+ version + '/less/'));
});

gulp.task('render-sass', function () {
  return gulp.src(['templates/brand-colors.sass'])
    .on('error', g.notify.onError('<%= error.message%>'))
    .pipe(g.data(template))
    .pipe(swig())
    .pipe(g.rename('brand-colors.latest.sass'))
    .pipe(gulp.dest('dist/latest/sass/'))
    .pipe(g.rename('brand-colors.' + version + '.sass'))
    .pipe(gulp.dest('dist/'+ version + '/sass/'));
});

gulp.task('render-stylus', function () {
  return gulp.src(['templates/brand-colors.styl'])
    .on('error', g.notify.onError('<%= error.message%>'))
    .pipe(g.data(template))
    .pipe(swig())
    .pipe(g.rename('brand-colors.latest.styl'))
    .pipe(gulp.dest('dist/latest/stylus/'))
    .pipe(g.rename('brand-colors.' + version + '.styl'))
    .pipe(gulp.dest('dist/'+ version + '/stylus/'));
});


gulp.task('render-css', function () {
  return gulp.src(['templates/brand-colors.css'])
    .on('error', g.notify.onError('<%= error.message%>'))
    .pipe(g.data(template))
    .pipe(swig())
    .pipe(g.rename('brand-colors.latest.css'))
    .pipe(gulp.dest('dist/latest/css/'))
    .pipe(g.rename('brand-colors.' + version + '.css'))
    .pipe(gulp.dest('dist/'+ version + '/css/'))
    .pipe(g.minifyCss())
    .pipe(g.rename('brand-colors.' + version + '.min.css'))
    .pipe(gulp.dest('dist/'+ version + '/css/'))
    .pipe(g.rename('brand-colors.latest.min.css'))
    .pipe(gulp.dest('dist/latest/css/'));
});

gulp.task('styles-dist', gulp.series('render-css', 'render-scss', 'render-less',
  'render-sass', 'render-stylus', 'render-js', noop));