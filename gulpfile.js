/**
 * Created by ahenriquez on 04-03-16.
 */
'use strict';

var gulp = require('gulp');
//const mainBowerFiles = require('gulp-main-bower-files');

gulp.paths = {
  src: './web',
  server: './server',
  dist: './client',
  tmp: '.tmp',
  inspinia: './inspinia'
};

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del', 'main-bower-files', 'event-stream', 'stream-series']
});

gulp.task('clean', function (done) {
  $.del([gulp.paths.dist, gulp.paths.tmp], done);
});

gulp.task('vendor:style', function() {
  var lessStream = gulp.src('./bower.json')
    .pipe($.mainBowerFiles())
    .pipe($.filter('**/*.less'))
    .pipe($.less());

  var cssStream = gulp.src('./bower.json')
    .pipe($.mainBowerFiles())
    .pipe($.filter('**/*.css'));

  return $.merge(cssStream, lessStream)
    .pipe($.concat('styles.css'))
    .pipe($.replace('fonts/', 'vendor/fonts/'))
    .pipe(gulp.dest(gulp.paths.dist + '/vendor'));

});

gulp.task('vendor:script', function() {

  var filterJS        = $.filter(['**/*.js'], { base: 'bower_components' });
  return gulp.src('./bower.json')
    .pipe($.mainBowerFiles())
    .pipe(filterJS)
    .pipe($.order([
      'jquery/dist/jquery.js',
      'moment/moment.js',
      'angular/angular.js'
    ]))
    .pipe($.concat('script.js'))
    .pipe(gulp.dest(gulp.paths.dist + '/vendor'));
});

gulp.task('vendor:fonts', function() {
  return gulp.src('./bower_components/**/*')
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(gulp.paths.dist + '/vendor/fonts'));
});

gulp.task('vendor:loopback', function() {
  return gulp.src(gulp.paths.server + '/server.js', { base: gulp.paths.server })
    .pipe($.loopbackSdkAngular())
    .pipe($.rename('/scripts/lb-services.js'))
    .pipe($.debug({title: 'resources:'}))
    .pipe(gulp.dest(gulp.paths.dist));
});

gulp.task('default', ['vendor:fonts', 'vendor:loopback', 'vendor:script', 'vendor:style'], function() {
});
