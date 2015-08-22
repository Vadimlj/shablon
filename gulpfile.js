var gulp         = require('gulp');
var scss         = require('gulp-sass');
var csscomb      = require('gulp-csscomb');
var csso         = require('gulp-csso');
var cmq          = require('gulp-combine-media-queries');
var autoprefixer = require('gulp-autoprefixer');
var plumber      = require('gulp-plumber');
var beml         = require('gulp-beml');
var fileinclude  = require('gulp-file-include');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var connect      = require('gulp-connect');
var watch        = require('gulp-watch');
var gutil        = require('gulp-util');

var isProduction = false;

var paths = {
    html: {
        src: 'html/*.html',
        dist: './',
        watch: 'html/**/*.html'
    },
    styles: {
        src: 'styles/*.scss',
        dist: 'styles',
        watch:'styles/**/*.scss'
    },
    scripts: {
        plugins: {
            src: 'scripts/plugins/**/*.js',
            dist: 'scripts'
        },
        main: {
            src: 'scripts/*.js',
            dist: 'scripts'
        }
    }
};

gulp.task('html', function () {

    return gulp.src(paths.html.src)
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'html/blocks'
        }))
        .pipe(beml())
        .pipe(gulp.dest('./'))
        .pipe(connect.reload());
});

gulp.task('scss', function () {
       return gulp.src(paths.styles.src)
        .pipe(plumber())
        .pipe(scss())
        .pipe(autoprefixer({
            browsers: [
                'last 2 version',
                'ie >= 9',
                'Android 2.3',
                "Android >= 4",
                "Chrome >= 20",
                "Firefox >= 24",
                "Explorer >= 8",
                "iOS >= 6",
                "Opera >= 12",
                "Safari >= 6"
            ]
        }))
        .pipe(csscomb())
        .pipe(gulp.dest(paths.styles.dist))
        .pipe(isProduction ? cmq({log: true}) : gutil.noop())
        .pipe(csso())
        .pipe(rename(function (path) {
            path.extname = ".min.css"
        }))
        .pipe(gulp.dest(paths.styles.dist))
        .pipe(connect.reload());
});

gulp.task('jqueryPlugins', function () {
    return gulp.src(paths.scripts.plugins.src)
        .pipe(plumber())
        .pipe(concat('plugins.js'))
        .pipe(gulp.dest(paths.scripts.plugins.dist))
        .pipe(concat('plugins.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.plugins.dist))
        .pipe(connect.reload());
});


gulp.task('mainJs', function () {
    return gulp.src(paths.scripts.main.src)
        .pipe(plumber())
        .pipe(connect.reload());
});

gulp.task('connect', function () {
    connect.server({
        root: "./",
        livereload: true,
        port: 9000
    });
});

gulp.task('watch', function () {

    watch(paths.html.watch, function (event) {
        gulp.start('html');
    });
    watch(paths.styles.watch, function (event) {
        gulp.start('scss');
    });
    watch(paths.scripts.plugins.src, function (event) {
        gulp.start('jqueryPlugins');
    });
    watch(paths.scripts.main.src, function (event) {
        gulp.start('mainJs');
    });
});

gulp.task('startup', function () {
    gulp.start('html');
    gulp.start('scss');
    gulp.start('jqueryPlugins');
    gulp.start('mainJs');
    gulp.start('watch');
    gulp.start('connect');
});

gulp.task('final', function() {

    isProduction = true;

    gulp.start('startup');

});

gulp.task('default', ['startup']);
gulp.task('build', ['final']);