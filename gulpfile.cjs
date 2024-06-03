const gulp = require('gulp'),
			sass = require('gulp-sass')(require('sass-embedded')),
			browserSync = require('browser-sync'),
			csso = require('gulp-csso'),
			rename = require('gulp-rename'),
			plumber = require('gulp-plumber'),
			stylelint = require('gulp-stylelint'),
			groupMedia = require('gulp-group-css-media-queries'),
			sourcemaps = require('gulp-sourcemaps'),
			fileSize = require('gulp-size'),
			shell = require('gulp-shell'),
			ftp = require('vinyl-ftp'),
			autoprefixer = require('gulp-autoprefixer');

const dirs = {
	pkgCore: 'packages/core/',
	pkgMlut: 'packages/mlut/',
	test: 'test/',
	docs: 'docs/',
	ftp: ''
};

let path = {
	src: {
		core: dirs.pkgCore + 'src/sass/',
		mlut: dirs.pkgMlut + 'src/',
	},
	build: dirs.pkgMlut + 'dist/',
	docs: {
		assets: dirs.docs + 'styleguide/kss-assets/',
		img: dirs.docs + 'img/',
	},
	test: {
		css: dirs.test + 'css/',
		sass: dirs.test + 'sass/',
		img: dirs.test + 'img/'
	}
};

const files = {
	styles: '**/*.{scss,css}',
	js: '**/*.js',
	html: '**/*.html',
	all: '**/*'
};

path = Object.assign({
	watch: {
		styles: [
			path.src.core + files.styles,
			path.src.mlut + files.styles,
			path.test.sass + files.styles,
		],
		html: dirs.test + files.html,
		docs: [
			dirs.docs + 'examples/' + files.html,
			dirs.docs + 'examples/**/*.hbs',
			dirs.docs + '*.md',
			path.test.css + 'test.css',
		],
	}
}, path);

const servConfig = {
		server: {
			baseDir: 'test'
		},
		notify: false,
		open: false
};

const sizeConfig = {
	gzip: true,
	brotli: true,
	pretty: false,
	showFiles: true
};

// for test deployment on ftp
const ftpConfig = {
	host: '',
	user: '',
	password: '',
	parallel: 10
};

gulp.task('css-lint', () => {
	return gulp.src([
		path.src.core + files.styles,
		path.src.mlut + files.styles,
		`!${path.src.core}tools/mixins/base/_mk-ar.scss`,
		`!${path.src.core}generate.css`,
	])
		.pipe(stylelint({
			reporters:[
				{formatter: 'string', console: true}
			]
		}));
});

gulp.task('sass-test', shell.task(
	`npx mocha ${path.test.sass}index.js`,
	{ignoreErrors: process.env.NODE_ENV !== 'production'}
));

gulp.task('sass', gulp.series('css-lint', () => {
	return gulp.src([
		path.src.mlut + 'mlut-demo-theme.scss',
	])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({
			indentType: 'tab',
			includePaths: [
				'node_modules',
				path.src.mlut,
			],
			outputStyle: 'expanded',
			indentWidth: 1
		}))
	// for debug
		//.pipe(groupMedia())
		.pipe(autoprefixer({
			cascade: false,
			flexbox: false
		}))
		.pipe(gulp.dest(path.test.css))
		.pipe(csso({
			forceMediaMerge: true
		}))
		.pipe(rename((path) => {
			if(path.basename === 'index') path.basename = 'mlut';
			path.basename += '.min';
		}))
		.pipe(fileSize(sizeConfig))
		.pipe(gulp.dest(path.build))
		.pipe(sourcemaps.write(''))
		.pipe(gulp.dest(path.test.css))
		.pipe(browserSync.stream());
}));

gulp.task('server', () => {
	browserSync(servConfig);
});

gulp.task('html', () => {
	return gulp.src(dirs.test + files.html, {allowEmpty: true})
		.pipe(fileSize(sizeConfig))
		.pipe(browserSync.stream());
});

gulp.task('sass-compile-doc', () => {
	return gulp.src([
		dirs.docs + 'generate.scss',
		dirs.docs + 'mlut.scss',
	], {allowEmpty: true})
		.pipe(plumber())
		.pipe(sass({
			includePaths: [
				'node_modules',
			],
			indentType: 'tab',
			outputStyle: 'expanded',
			indentWidth: 1
		}))
		.pipe(gulp.dest((file) => (
			file.basename === "mlut.css" ?
				path.test.css : dirs.docs + 'content/'
		)))
		.pipe(csso({
			forceMediaMerge: true
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(path.docs.assets));
});

gulp.task('kss', shell.task([
	'node_modules/.bin/kss --config ' + dirs.docs + 'kss-config.json',
	'cp ' + path.test.css + 'test.css ' + path.docs.assets,
]));

gulp.task('default', gulp.parallel('server', 'kss', 'sass', () => {
	gulp.watch(path.watch.styles, gulp.series('kss', 'sass'));
	gulp.watch(path.watch.html, gulp.series('html'));
	gulp.watch(path.watch.docs, gulp.series('kss'));
}));

gulp.task('watch-test', gulp.parallel('sass-test', 'kss', () => {
	gulp.watch(path.watch.styles, gulp.series('kss', 'sass-test'));
}));

gulp.task('sass-watch-doc', gulp.series('sass-compile-doc', 'kss', () => {
	gulp.watch(dirs.docs + 'generate.scss', gulp.series('sass-compile-doc', 'kss'));
}));

gulp.task('ftp', () => {
	const conn = ftp.create(ftpConfig);
	return gulp.src(dirs.test + files.all, {buffer: false})
		.pipe(conn.newer(dirs.ftp))
		.pipe(conn.dest(dirs.ftp));
});

gulp.task('img', () => {
	return gulp.src(path.docs.img + files.all, {buffer: false})
		.pipe(gulp.dest(path.docs.assets));
});

gulp.task('sass-mk-doc', gulp.series('sass-compile-doc', 'kss', 'img'));

gulp.task('build', gulp.series('sass', 'sass-mk-doc'));
