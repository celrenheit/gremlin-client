var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var size = require('gulp-size');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');
var karma = require('karma').server;


function printError(error) {
  console.error('\nError:', error.plugin);
  console.error(error.message);
}

function printEvent(event) {
  console.log('File', event.type +':', event.path);
}

gulp.task('build', function() {
  gulp.src('index.js')
      .pipe(browserify({
        debug: true,
        standalone: 'gremlin'
      }))
      .pipe(rename('gremlin.js'))
      .pipe(gulp.dest('./'))
      .pipe(size({ showFiles: true }))
      // Minified version
      .pipe(uglify())
      .pipe(rename('gremlin.min.js'))
      .pipe(gulp.dest('./'))
      .pipe(size({ showFiles: true }));
});

gulp.task('test-node', function() {
  require('chai').should();

  return gulp.src('test/**/*')
      .pipe(mocha({
        reporter: 'spec',
      }))
      .on('error', printError);
});

gulp.task('test-browsers', function(done) {
  var karmaCommonConf = {
    browsers: ['Chrome', 'Firefox', 'Safari'],
    frameworks: ['mocha', 'chai', 'browserify'],
    preprocessors: {
      'test/*': ['browserify']
    },
    files: [
      'test/**/*.js'
    ],
    browserify: {
      watch: true // Watches dependencies only (Karma watches the tests)
    }
  };

  karma.start(karmaCommonConf, done);
});

gulp.task('watch', function() {
  gulp.watch(['src/**/*', 'test/**/*', 'index.js'], ['test-node'])
    .on('change', printEvent);
});

gulp.task('default', ['build']);

gulp.task('dev', ['test-browsers', 'test-node', 'watch']);
