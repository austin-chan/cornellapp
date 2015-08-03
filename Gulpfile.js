var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    watch = require('gulp-watch'),
    sourcemaps = require('gulp-sourcemaps');
    uglify = require('gulp-uglify');
    rename = require('gulp-rename');
    concat = require('gulp-concat');

gulp.task('react', function() {

    return gulp.src(['app/main.js'])
        .pipe(browserify({
            debug: true,
            transform: [ 'reactify' ]
        }))
        .pipe(gulp.dest('./public/assets/js'));

});

gulp.task('compile', function() {

    return gulp.src([
            'public/assets/js/main.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('concat.js'))
        .pipe(gulp.dest('./public/js-built'))
        .pipe(rename('app.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./public/assets/js-built'))

});

gulp.task('watch', function() {

    gulp.watch('public/assets/js/*', ['compile']);
    gulp.watch('app/components/*', ['react']);

});

gulp.task('default', ['react', 'compile', 'watch']);
