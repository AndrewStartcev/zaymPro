
const {src, dest, watch, parallel, series } = require('gulp');

const scss         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat       = require('gulp-concat');
const browserSync  = require('browser-sync').create();
const uglify       = require('gulp-uglify-es').default;
const imagemin     = require('gulp-imagemin');
const webpHTML     = require('gulp-webp-html');
const webpImg      = require('gulp-webp');
const fileinclude = require('gulp-file-include');
const htmlhint = require("gulp-htmlhint");
const htmlbeautify = require('gulp-html-beautify');


// В слежении: Запуск локального сервера
function browsersync() {
	browserSync.init({
		server: {
			baseDir: "../dist/"
		}
	});
}

// В слежении: scss + autprefix > css
function styles() {
	return src('../app/scss/style.scss')
			.pipe(scss({outputStyle: 'expanded'}))
			.pipe(concat('style.css'))
			.pipe(autoprefixer({
				overrideBrowserslist: ['last 10 version'],
				grid: true
			}))
			.pipe(dest('../dist/assets/css'))
			.pipe(browserSync.stream())
}

function stylesVendor() {
	return src('../app/css/vendor/**/*.css')
			.pipe(concat('vendor.min.css'))
			.pipe(dest('../dist/assets/css'))
			.pipe(browserSync.stream())
}

function htmlRun() {
	const options = {
    "indent_size": 2,
		"inline": "body",
  };
	return src('../app/*.html')
			.pipe(fileinclude({
				prefix: '@@',
				basepath: '@file'
			}))
			.pipe(webpHTML())
			.pipe(htmlhint())
			.pipe(htmlbeautify(options))
			.pipe(dest('../dist'));
}

// В слежении: js > js.min
function scripts() {
	return src([
		'../app/assets/js/main.js'
	])
	.pipe(concat('main.min.js'))
	//.pipe(uglify())
	.pipe(dest('../dist/assets/js/'))
	.pipe(browserSync.stream())
}
function scriptsVendor() {
	return src([
		'../app/assets/js/vendor/**/*'
	])
	.pipe(concat('vendor.min.js'))
	.pipe(uglify())
	.pipe(dest('../dist/assets/js/'))
	.pipe(browserSync.stream())
}

// В слежении: Оптимизация картинок
function images() {
	return src('../app/assets/img/**/*')
		.pipe(imagemin([
			imagemin.gifsicle({interlaced: true}),
			imagemin.mozjpeg({quality: 75, progressive: true}),
			imagemin.optipng({optimizationLevel: 5}),
			imagemin.svgo({
					plugins: [
							{removeViewBox: true},
							{cleanupIDs: false}
					]
			})
		]))
		.pipe(dest('../dist/assets/img'))
		// .pipe(webpImg())
		// .pipe(dest('../dist/assets/img'))
}

// В Билде: Удаляем старую папку dist
function cleanDist() {
	return del('../dist')
}

// В Билде: Перемещаем файлы в папку dist
function build() {
	return src([
		'../app/assets/fonts/**/*',
		'../app/assets/php/**/*',
	], { base: 'app'})
	.pipe(dest('../dist'))

}
// В слежении: Следим за изменением файлов в этих папках
function watching() {
	watch(['../app/assets/**/*'], build)
	watch(['../app/scss/**/*.scss'], styles)
	watch(['../app/assets/css/vendor/**/*.css'], stylesVendor)
	watch(['../app/assets/img/**/*'], images)
	watch(['../app/**/*.html'], htmlRun)
	watch(['../app/assets/js/*.js'], scripts)
	watch(['../app/assets/js/vendor/**/*.js'], scriptsVendor)
	watch(['../app/**/*.html']).on('change', browserSync.reload)
}

exports.browsersync   = browsersync;
exports.styles        = styles;
exports.stylesVendor  = stylesVendor;
exports.htmlRun       = htmlRun;
exports.scripts       = scripts;
exports.scriptsVendor = scriptsVendor
exports.images        = images;
exports.watching      = watching;
exports.cleanDist     = cleanDist;

//exports.build       = series(cleanDist, imgToWebp, webpCode, images, build browsersync); // gulp build - запускаем бидл сборку

exports.default = parallel(styles, stylesVendor, scripts, scriptsVendor, images, build, htmlRun, watching, browsersync);// gulp Запускаем работу галпа.
