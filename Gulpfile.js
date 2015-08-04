var gulp = require('gulp'),
    browserify = require('browserify'),
    watch = require('gulp-watch'),
    sourcemaps = require('gulp-sourcemaps');
    uglify = require('gulp-uglify');
    rename = require('gulp-rename');
    concat = require('gulp-concat');
    sassify = require('sassify');
    reactify = require('reactify');
    source = require('vinyl-source-stream');

gulp.task('react', function() {

    return browserify({
            entries: ['app/main.js']
        })
        .bundle()
        .pipe(source('app/main.js'))
        .pipe(rename('main.js'))
        .pipe(gulp.dest('./public/assets/js'));

});

gulp.task('compile', function() {

    return gulp.src([
            'public/assets/js/main.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('concat.js'))
        .pipe(gulp.dest('./public/assets/js-built'))
        .pipe(rename('app.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./public/assets/js-built'))

});

gulp.task('watch', function() {

    gulp.watch('public/assets/js/*', ['compile']);
    gulp.watch(['app/components/*', 'app/styles/*', 'app/main.js'], ['react']);

});

gulp.task('default', ['watch']);
