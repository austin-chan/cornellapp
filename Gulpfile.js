/**
 * Copyright (c) 2015, Cornellapp.
 * All rights reserved.
 *
 * This source code is licensed under the GNU General Public License v3.0
 * license found in the LICENSE file in the root directory of this source
 * tree.
 *
 *
 * Gulp's configuration file. This declares the tasks for gulp to execute on
 * initialization from the CLI.
 */

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
        entries: ['app/scripts/main.jsx'],
        extensions:  [".js", ".jsx"]
    })
    .bundle()
    .on('error', function(err){
        console.log(err.message);
    })
    .pipe(source('app/scripts/main.js'))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('./public/assets/js'));
});

gulp.task('uglify', function() {
    return gulp.src([
        'public/assets/js/bundle.js'
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
        ext: 'js jsx ejs',
        ignore: ['public/**', 'app/styles/**', 'node_modules/**'],
        env: { 'NODE_ENV': 'development' }
    });
});

gulp.task('watch', function() {
    // gulp.watch('public/assets/js/*', ['uglify']);
    gulp.watch(['app/!(styles)/**', 'app/main.js'], ['react']);
    gulp.watch(['app/styles/**'], ['sass']);
});

gulp.task('default', ['server', 'watch', 'react', 'sass']);
