var gulp = require('gulp'),
    browserify = require('browserify'),
    watch = require('gulp-watch'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    source = require('vinyl-source-stream'),
    sass = require('gulp-sass'),
    nodemon = require('gulp-nodemon');

gulp.task('react', function() {

    return browserify({
        entries: ['app/main.js']
    })
    .bundle()
    .on('error', function(err){
        console.log(err.message);
    })
    .pipe(source('app/main.js'))
    .pipe(rename('main.js'))
    .pipe(gulp.dest('./public/assets/js'));

});

gulp.task('uglify', function() {

    return gulp.src([
        'public/assets/js/main.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('concat.js'))
    .pipe(gulp.dest('./public/assets/js-built'))
    .pipe(rename('app.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/assets/js-built'));

});

gulp.task('sass', function () {
    return gulp.src('app/styles/*')
    .pipe(sass({ outputStyle: 'compressed', sourceComments: 'none' }))
    .pipe(gulp.dest('public/assets/css'));
});

gulp.task('server', function () {
    nodemon({
        script: 'server.js',
        ignore: ['public/**', 'app/styles/**']
    });
})

gulp.task('watch', function() {

    gulp.watch('public/assets/js/*', ['uglify']);
    gulp.watch(['app/components/*', 'app/main.js'], ['react']);
    gulp.watch(['app/styles/**'], ['sass']);

});

gulp.task('default', ['server', 'watch']);
// gulp.task('default', ['watch']);
