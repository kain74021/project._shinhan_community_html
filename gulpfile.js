const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass')); // sass 패키지 사용
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const fileInclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();

// SCSS를 CSS로 컴파일하는 함수
function compileSass() {
  return gulp.src('./src/scss/**/*.scss')  // SCSS 파일 경로
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError)) // SCSS를 CSS로 변환
    .pipe(cleanCSS()) // CSS 압축
    .pipe(rename({ suffix: '.min' })) // min 접미사 추가
    .pipe(gulp.dest('./dist/css'));  // 결과물을 dist/css에 저장
}

// HTML 파일을 포함하는 함수
function includeHtml() {
  return gulp.src('./src/html/**/*.html')  // HTML 파일 경로
    .pipe(fileInclude())  // HTML 파일을 포함
    .pipe(gulp.dest('./dist/html'));  // 결과물을 dist/html에 저장
}
function serve() {
  browserSync.init({
    server: {
      baseDir: './dist', // 정적 파일의 기본 디렉터리
    },
  });

  gulp.watch('./src/scss/**/*.scss', compileSass).on('change', browserSync.reload);
  gulp.watch('./src/html/**/*.html', includeHtml).on('change', browserSync.reload);
}

// SCSS 및 HTML 파일 변경 감지
function watchFiles() {
  gulp.watch('./src/scss/**/*.scss', compileSass);  // SCSS 변경 시 컴파일
  gulp.watch('./src/html/**/*.html', includeHtml);  // HTML 변경 시 포함
}

// 기본 작업 설정
const defaultTask = gulp.series(compileSass, includeHtml, serve);

// dev 작업 설정
exports.dev = gulp.series(defaultTask, watchFiles); // gulp dev로 실행할 수 있게 함
