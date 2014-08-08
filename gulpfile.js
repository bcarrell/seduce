var gulp     = require('gulp'),
    nodeunit = require('gulp-nodeunit'),
    plumber  = require('gulp-plumber'),
    gutil    = require('gulp-util');

var paths = {
  src: './lib/**/*.js',
  test: './test/**/*.js',
  sql: './test/sql/**/*.sql'
};

gulp.task('test', function() {
  gulp.src(paths.test)
  .pipe(plumber({
    errorHandler: function() {
      gutil.beep();
    }
  }))
  .pipe(nodeunit());
});

gulp.task('watch', function() {
  gulp.watch(paths.src, ['test']);
  gulp.watch(paths.test, ['test']);
  gulp.watch(paths.sql, ['test']);
});

gulp.task('default', ['test', 'watch']);
