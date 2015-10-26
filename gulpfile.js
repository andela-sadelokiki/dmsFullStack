var gulp = require('gulp'),
  gutil = require('gulp-util'),
  jshint = require('gulp-jshint'),
  concat = require('gulp-concat'),
  jasmine = require('gulp-jasmine'),
  nodemon = require('gulp-nodemon'),
  minify = require('gulp-minify'),
  path = require('path'),
  coverage = require('gulp-coverage'),
  Server = require('karma').Server;

var paths = {
  public: 'public/**',
  scripts: 'public/app/**/*.js',
  staticFiles: [
    'public/assets/**/*.*'
  ],
  libs: ['public/libs/angular/angular.js',
    'public/libs/angular-animate/angular-animate.js',
    'public/libs/angular-aria/angular-aria.js',
    'public/libs/angular-material/angular-material.js',
    'public/libs/angular-material-icons/angular-material-icons.js',
    'public/libs/angular-mocks/angular-mocks.js',
    'public/libs/angular-route/angular-route.js',
    'public/libs/ngstorage/ngStorage.js'
  ],
  clientTests: [],
  serverTests: ['spec/*.js']
}

gulp.task('libs', function() {
  gulp.src(paths.libs)
    .pipe(concat('libraries.js'))
    .pipe(minify({
      ignoreFiles: ['-min.js']
    }))
    .pipe(gulp.dest('./public/minifiedlibs'));
});

gulp.task('static-files', function() {
  return gulp.src(paths.staticFiles)
    .pipe(minify({
      ignoreFiles: ['-min.js']
    }))
    .pipe(gulp.dest('public/staticfiles'));
});

gulp.task('nodemon', function() {
  nodemon({
      script: 'server.js',
      ext: 'js',
      ignore: ['public/**', 'app/**', 'node_modules/**']
    })
    .on('restart', function() {
      console.log('>> node restart');
    })
});

gulp.task('jshint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function() {
  gulp.watch('public/app/**/*.js', ['jshint', 'libs']);
});

gulp.task('test', ['test:client'], function() {
  return gulp.src(paths.serverTests)
    .pipe(jasmine({
      reporter: 'spec',
      timeout: 50000
    }))
    .pipe(exit());
});

gulp.task('test:client', function(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, function() {
    done();
  }).start();
});

gulp.task('default', ['nodemon', 'static-files', 'watch']);
