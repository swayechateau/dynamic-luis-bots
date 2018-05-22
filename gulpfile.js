'use-strict';
//use for production

const gulp = require('gulp')
    , sass = require('gulp-sass')
    , concat = require('gulp-concat')
    , uglify = require('gulp-uglify')

gulp.task('sass', ()=>{
  return gulp.src('src/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
})

gulp.task('scripts', ()=>{
  return gulp.src('src/scripts/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
})

gulp.task('watch',()=>{
  gulp.watch('js/scripts/*.js',['scripts'])
  gulp.watch('scss/*.scss',['sass'])
})
