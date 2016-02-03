var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
    port: 9101,
  });
});

gulp.task('server', ['connect']);

gulp.task('default', ['connect']);
