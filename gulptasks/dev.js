var gulp = require('gulp'),
  g = require('gulp-load-plugins')({ lazy: false })

function requireUncached(module) {
  delete require.cache[require.resolve(module)]
  return require(module)
}

function getTemplateData() {
  return {
    version: requireUncached('../package.json').version,
    companies: requireUncached('../data/brandColors.js').getAll()
  }
}

gulp.task('dev-extras', function() {
  return gulp.src(['./app/CNAME', './app/favicon.ico']).pipe(gulp.dest('.tmp/'))
})

gulp.task('dev-brand-colors-css', function() {
  return gulp
    .src(['templates/brand-colors.css'])
    .on('error', g.notify.onError('<%= error.message%>'))
    .pipe(g.data(getTemplateData()))
    .pipe(g.swig())
    .pipe(g.rename('brand-colors.latest.css'))
    .pipe(gulp.dest('.tmp/dist/latest/css/'))
})

gulp.task('dev-scss', function() {
  return gulp
    .src(['./app/stylesheets/main.scss'])
    .on('error', g.notify.onError('<%= error.message%>'))
    .pipe(g.sass())
    .pipe(g.rename('styles.css'))
    .pipe(gulp.dest('.tmp/'))
})

gulp.task('dev-jade', function() {
  return gulp
    .src(['./app/index.jade'])
    .pipe(
      g.jade({
        locals: getTemplateData(),
        pretty: true
      })
    )
    .pipe(gulp.dest('.tmp/'))
})

gulp.task('dev-js', function() {
  return gulp.src(['./app/scripts/index.js']).pipe(gulp.dest('.tmp/'))
})

gulp.task('dev-build', gulp.series(
  'dev-brand-colors-css',
  'dev-scss',
  'dev-jade',
  'dev-js',
  'dev-extras'
))

gulp.task('live-server', gulp.series('dev-build', function() {
  var server = g.liveServer.static(['.tmp/'], 3000)
  server.start()
  gulp.watch('./data/brandColors.js', gulp.series('dev-brand-colors-css', 'dev-jade'))
  gulp.watch('./app/stylesheets/*.scss', gulp.series('dev-scss'))
  gulp.watch('./app/scripts/*.js', gulp.series('dev-js'))
  gulp.watch('./app/*.jade', gulp.series('dev-jade'))

  gulp.watch('./.tmp/*', function(file) {
    server.notify.apply(server, [file])
  })
}))
