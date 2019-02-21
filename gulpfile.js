let gulp = require("gulp");
let pug = require("gulp-pug");
let sass = require("gulp-sass");
let browserSync = require("browser-sync");
let babel = require("gulp-babel");
let plumber = require("gulp-plumber");
let sourcemaps = require("gulp-sourcemaps");
let imagemin = require("gulp-imagemin");

gulp.task('copy', () => {
    return gulp.src(['src/resources/fonts/*.*'])
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('pug', () => {
    return gulp.src('src/index.pug')
        .pipe(plumber())
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest('dist'))
});

gulp.task('scss', () => {
    return gulp.src(['src/scss/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('js', () => {
    return gulp.src('src/js/main.js')
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('images', () => {
    return gulp.src(['src/images/*.*'])
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
});


gulp.task('watch', () => {
    gulp.watch(['src/index.pug', 'src/pug/**/*.pug'], gulp.series('pug'));
    gulp.watch('src/scss/*.scss', gulp.series('scss'));
    gulp.watch('src/js/*.js', gulp.series('js'));
    gulp.watch('src/images/*.*', gulp.series('images'));
});


gulp.task("build", gulp.series(["pug", "scss", "js", "images", "copy"]));

gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
        files: ['dist/**/*.*']
    })
});


gulp.task('default', gulp.parallel('build', 'server', 'watch'));
