var gulp = require('gulp');
var connect = require('gulp-connect');
var modRewrite = require('connect-modrewrite');

gulp.task('connect', function() {
  connect.server({
    port: 9101,
    middleware: function (connect, options) {
      return [
        modRewrite(['^[^\\.]*(\\?.*)?$ /index.html [L]']),
      ];
    }
  });
});

gulp.task('server', ['connect']);

gulp.task('default', ['connect']);
