const gulp = require('gulp');
const uglify = require('gulp-uglify');

gulp.task('minify-js', () => {
    return gulp.src('src/*.js') // Source files
        .pipe(uglify())         // Minify
        .pipe(gulp.dest('dist')); // Destination
});