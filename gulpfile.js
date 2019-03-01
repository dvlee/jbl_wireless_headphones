let gulp = require("gulp");
let pug = require("gulp-pug");
let sass = require("gulp-sass");
let browserSync = require("browser-sync");
let babel = require("gulp-babel");
let plumber = require("gulp-plumber");
let sourcemaps = require("gulp-sourcemaps");
let imagemin = require("gulp-imagemin");
let autoprefixer = require("gulp-autoprefixer");
let uglify = require("gulp-uglify");
let concat = require("gulp-concat");

gulp.task('copy', () => {
    return gulp.src(['src/resources/**/*.*'])
        .pipe(gulp.dest('dist'))
});

gulp.task('pug', () => {
    return gulp.src('src/index.pug')
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest('dist'))
});

gulp.task('scss', () => {
    return gulp.src(['src/scss/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('js', () => {
    return gulp.src(['src/js/fullpage.min.js','src/js/swiper.min.js','src/js/main.js'])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('images', () => {
    return gulp.src(['src/images/**/*.*'])
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
