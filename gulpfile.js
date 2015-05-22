var gulp        = require('gulp'),
    pixrem      = require('gulp-pixrem'),
    plumber     = require('gulp-plumber'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload(),
    sass        = require('gulp-sass'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    svgmin      = require('gulp-svgmin'),
    svgstore    = require('gulp-svgstore'),
    imagemin    = require('gulp-imagemin'),
    sourcemaps  = require('gulp-sourcemaps'),
    autoprefix  = require('gulp-autoprefixer'),
    size        = require('gulp-size'),
    concat      = require('gulp-concat'),
    ghPages     = require('gulp-gh-pages'),
    cp          = require('child_process'),
    name        = 'vws';

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

var paths = {
  scss: 'assets/src/scss/**/*.scss',
  js: 'assets/src/js/*.js',
  svg: 'assets/src/icons/*.svg',
  img: 'assets/src/img/*',
  markup: ['./*.html', './*.md', '_includes/*.html', '_layouts/*.html', '_posts/*'],
  dist: 'assets/dist/'
};

// Jekyll Building

gulp.task('jekyll-build', function (done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browserSync.reload();
});

// Asset Building

gulp.task('styles', function() {
  return gulp.src(paths.scss)
  .pipe(size())
  .pipe(sass({
    outputStyle: 'compressed',
    onError: browserSync.notify
  }))
  .pipe(autoprefix(['last 2 version']))
  .pipe(pixrem())
  .pipe(gulp.dest('_site/' + paths.dist + 'css/'))
  .pipe(browserSync.reload({stream:true}))
  .pipe(gulp.dest(paths.dist + 'css/'));
});

gulp.task('scripts', function() {
  return gulp.src(paths.js)
  .pipe(size())
  .pipe(plumber())
  .pipe(concat(name+'.js'))
  .pipe(uglify())
  .pipe(gulp.dest('_site/' + paths.dist + 'js/'))
  .pipe(browserSync.reload({stream:true}))
  .pipe(gulp.dest(paths.dist + 'js/'));
});


gulp.task('icons', function () {
  return gulp.src(paths.svg)
  .pipe(svgmin())
  .pipe(svgstore({ fileName: 'icons.svg', prefix: 'icon-', inlineSvg: true}))
  .pipe(gulp.dest('_includes/'));
});


gulp.task('images', function () {
  return gulp.src(paths.img)
  .pipe(size())
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}]
  }))
  .pipe(gulp.dest('_site/' + paths.dist + 'img/'))
  .pipe(gulp.dest(paths.dist + 'img/'));
});

// Connect & Deploy
gulp.task('connect', ['styles', 'jekyll-build'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

gulp.task('deploy', function() {
  return gulp.src('_site/**/*')
    .pipe(ghPages());
});


gulp.task('watch', function () {
  gulp.watch(paths.scss, ['styles', 'jekyll-rebuild']);
  gulp.watch(paths.js, ['scripts', 'jekyll-rebuild']);
  gulp.watch(paths.svg, ['icons', 'jekyll-rebuild']);
  gulp.watch(paths.img, ['images', 'jekyll-rebuild']);
  gulp.watch(paths.markup, ['jekyll-rebuild']);
});

// Task Registry

gulp.task('build', ['styles', 'scripts', 'icons', 'images', 'jekyll-rebuild']);
gulp.task('destroy', ['build', 'deploy']);
gulp.task('default', ['build', 'connect', 'watch']);
