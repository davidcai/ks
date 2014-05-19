var gulp = require('gulp');

// var jshint = require('gulp-jshint');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');

var paths = {
  styles: {
    src: ['css/*.css', '!**/*-min.css'], // Exclude already minified files
    dest: 'css/'
  }
};

gulp.task('minify-css', function() {
  gulp.src(paths.styles.src)
    .pipe(minifyCss())
    .pipe(rename({ suffix: '-min' }))
    .pipe(gulp.dest(paths.styles.dest));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['minify-css']);