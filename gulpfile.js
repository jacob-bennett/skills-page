const gulp = require('gulp');
const argv = require('yargs').argv
const clearDirectory = require('del');
const requireUncached = require('./requireUncached');
const nunjucks = require('gulp-nunjucks');
const rename = require('gulp-rename');

let dist = argv.dist;
if (dist === undefined) {
  dist = 'dist/'
}

async function clean(done) {
  await clearDirectory(`${dist}*`)
  done()
}

function html() {
  return gulp.src('skills.njk.html')
    .pipe(nunjucks.compile(requireUncached('./data')))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(dist))
}

function copyCss() {
  return gulp.src('skills.css')
    .pipe(gulp.dest(dist));
}

// TODO
// gulp.task('copy:normalize', function () {
//     return gulp.src('node_modules/normalize.css/normalize.css')
//                .pipe(gulp.dest(dirs.dist + '/css'));
// });

exports.build = gulp.series(clean, gulp.parallel(html, copyCss));
