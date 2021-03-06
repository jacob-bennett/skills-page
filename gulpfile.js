const gulp = require('gulp');
const argv = require('yargs').argv
const clearDirectory = require('del');
const requireUncached = require('./src/requireUncached');
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
  return gulp.src('src/skills.njk.html')
    .pipe(nunjucks.compile(requireUncached('./src/data')))
    .pipe(rename('skills.html'))
    .pipe(gulp.dest(dist))
}

function css() {
  return gulp.src('src/skills.css')
    .pipe(gulp.dest(dist));
}

function normalizeCss() {
  return gulp.src('node_modules/normalize.css/normalize.css')
    .pipe(gulp.dest(dist));
}

exports.build = gulp.series(clean, gulp.parallel(html, css, normalizeCss));
exports.buildWithoutClean = gulp.parallel(html, css, normalizeCss);
