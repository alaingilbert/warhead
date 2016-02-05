var gulp = require('gulp');
var connect = require('gulp-connect');
var modRewrite = require('connect-modrewrite');

var rename = require("gulp-rename");
var runSequence = require('run-sequence');
var usemin = require('gulp-usemin');
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var del = require('del');

gulp.task('connect', function() {
  connect.server({
    port: 9101,
    middleware: function (connect, options) {
      return [
        modRewrite(['^[^\\.]*(\\?.*)?$ /dev.html [L]']),
      ];
    }
  });
});


gulp.task('usemin', function() {
  return gulp.src('dev.html')
    .pipe(usemin())
    .pipe(gulp.dest('./build'))
});

gulp.task('partials', function () {
  return gulp.src('./partials/**/*.html')
    .pipe(gulp.dest('./build/partials'));
});

gulp.task('icons', function() { 
  return gulp.src('./bower_components/font-awesome/fonts/**.*') 
    .pipe(gulp.dest('./fonts')); 
});

gulp.task('templatecache', function () {
  return gulp.src('./partials/**/*.html')
    .pipe(templateCache({module:'templatescache', standalone:true}))
    .pipe(gulp.dest('./build'));
});

gulp.task('scripts', function() {
  return gulp.src('./build/*.js')
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('./build'));
});

gulp.task('clean2', function() {
  return gulp.src('./build/dev.html')
    .pipe(rename('./index.html'))
    .pipe(gulp.dest('./'));
});

gulp.task('clean1', function() {
  return gulp.src('./build/build/*')
    .pipe(gulp.dest('./build'));
});

gulp.task('clean', function() {
  return del(['./build/public/templates.js', './build/build']);
});


gulp.task('server', ['connect']);

gulp.task('default', ['connect']);

gulp.task('build:prod', function() {
    runSequence('usemin', 'partials', 'icons', 'templatecache', 'scripts', 'clean2', 'clean1', 'clean');
});
