const fs = require('fs');
const path = require('path');
// const requireUncached = require('./src/requireUncached');
const gulp = require('gulp');

// Load all gulp plugins automatically
// and attach them to the `plugins` object
const plugins = require('gulp-load-plugins')();

// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
const runSequence = require('run-sequence');

const pkg = require('./package.json');
const dirs = pkg['h5bp-configs'].directories;

// const sass = require('gulp-sass');
// const babel = require('gulp-babel');
const nunjucks = require('gulp-nunjucks');
// const concat = require('gulp-concat');

// ---------------------------------------------------------------------
// | Helper tasks                                                      |
// ---------------------------------------------------------------------

gulp.task('archive:zip', function (done) {

    var archiveName = path.resolve(dirs.archive, pkg.name + '_v' + pkg.version + '.zip');
    var archiver = require('archiver')('zip');
    var files = require('glob').sync('**/*.*', {
        'cwd': dirs.dist,
        'dot': true // include hidden files
    });
    var output = fs.createWriteStream(archiveName);

    archiver.on('error', function (error) {
        done();
        throw error;
    });

    output.on('close', done);

    files.forEach(function (file) {

        var filePath = path.resolve(dirs.dist, file);

        // `archiver.bulk` does not maintain the file
        // permissions, so we need to add files individually
        archiver.append(fs.createReadStream(filePath), {
            'name': file,
            'mode': fs.statSync(filePath).mode
        });

    });

    archiver.pipe(output);
    archiver.finalize();

});

gulp.task('clean', function (done) {
    require('del')([
        dirs.dist
    ]).then(function () {
        done();
    });
});

gulp.task('html', () =>
    gulp.src('src/index.njk.html')
        .pipe(nunjucks.compile(requireUncached('./src/data')))
        .pipe(plugins.rename('index.html'))
        .pipe(gulp.dest(dirs.dist))
);

gulp.task('html:watch', function () {
    gulp.watch(['./src/index.njk.html', './src/data.js'], () => {
        gulp.start('html');
    });
});

gulp.task('copy', [
    'copy:misc',
    // 'copy:normalize'
]);


// gulp.task('copy:main.css', function () {
//
//     var banner = '/*! HTML5 Boilerplate v' + pkg.version +
//                     ' | ' + pkg.license.type + ' License' +
//                     ' | ' + pkg.homepage + ' */\n\n';
//
//     return gulp.src(dirs.src + '/css/main.css')
//                .pipe(plugins.header(banner))
//                .pipe(plugins.autoprefixer({
//                    browsers: ['last 2 versions', 'ie >= 8', '> 1%'],
//                    cascade: false
//                }))
//                .pipe(gulp.dest(dirs.dist + '/css'));
// });

gulp.task('copy:misc', function () {
    return gulp.src([

        // Copy all files
        dirs.src + '/**/*',

        // Exclude the following files
        // (other tasks will handle the copying of these files)
        // '!' + dirs.src + '/css/main.css',
        '!' + dirs.src + '/index.njk.html',
        '!' + dirs.src + '/data.js',
        '!' + dirs.src + '/.editorconfig',
        '!' + dirs.src + '/.gitattributes'
    ], {

        // Include hidden files by default
        dot: true

    }).pipe(gulp.dest(dirs.dist));
});

// TODO consolidate into main css file
// gulp.task('copy:normalize', function () {
//     return gulp.src('node_modules/normalize.css/normalize.css')
//                .pipe(gulp.dest(dirs.dist + '/css'));
// });

// gulp.task('js', function () {
//     return gulp.src([
//         'gulpfile.js',
//         dirs.src + '/js/*.js',
//         dirs.test + '/*.js'
//     ])
//         .pipe(babel())
//         .pipe(gulp.dest(dirs.dist + '/js'));
// });

gulp.task('sass', function () {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(dirs.dist + '/css'));
});


gulp.task('watch', ['sass:watch', 'html:watch', 'js:watch']);

// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------


// gulp.task('build', function (done) {
//     runSequence(
//         ['clean'],
//         'html', 'copy',  'js',
//     done);
// });
gulp.task('build', function (done) {
    runSequence(
        ['clean'],
        'html', 'copy',
    done);
});

gulp.task('default', ['build']);
