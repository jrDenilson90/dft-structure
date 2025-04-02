const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const del = require('del');

const paths = {
    pug: {
        src: 'src/views/**/*.pug',
        dest: 'dist/'
    },
    sass: {
        src: 'src/**/main.scss', // Compila a partir do main.scss
        watch: 'src/**/*.scss', // Observa todos os arquivos .scss
        dest: 'dist'
    },
    js: {
        src: 'src/views/**/*.js',
        dest: 'dist/js/'
    },
    externalJs: {
        src: 'src/scriptExternal/**/*.js',
        dest: 'dist/external/'
    }
};

// Tarefa para limpar a pasta dist
gulp.task('clean', () => {
    return del(['dist/**', '!dist']);
});

// Compilar Pug para HTML
gulp.task('pug', () => 
    gulp.src(paths.pug.src)
        .pipe(pug())
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest(paths.pug.dest))
        .pipe(browserSync.stream())
);

// Compilar e minificar Sass para CSS
gulp.task('sass', () => 
    gulp.src(paths.sass.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.sass.dest))
        .pipe(browserSync.stream())
);

// Minificar e concatenar JavaScript
gulp.task('js', () => 
    gulp.src(paths.js.src)
        .pipe(sourcemaps.init())
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browserSync.stream())
);

// Minificar e concatenar JavaScript externo
gulp.task('externalJs', () => 
    gulp.src(paths.externalJs.src)
        .pipe(sourcemaps.init())
        .pipe(concat('external.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.externalJs.dest))
        .pipe(browserSync.stream())
);

// Servidor e observador de arquivos
gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });

    gulp.watch(paths.pug.src, gulp.series('pug'));
    gulp.watch(paths.sass.watch, gulp.series('sass')); // Observa todos os arquivos .scss
    gulp.watch(paths.js.src, gulp.series('js'));
    gulp.watch(paths.externalJs.src, gulp.series('externalJs'));
});

// Tarefa de build para compilar todos os arquivos após limpar
gulp.task('build', gulp.series('clean', 'pug', 'sass', 'js', 'externalJs'));

// Definir a tarefa 'watch' para observar mudanças e iniciar o servidor
gulp.task('watch', gulp.series('serve'));