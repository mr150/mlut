var gulp = require('gulp'),
		sass = require('gulp-sass')(require('sass-embedded')),
		pug = require('gulp-pug'),
		browserSync = require('browser-sync'),
		csso = require('gulp-csso'),
		rename = require('gulp-rename'),
		del = require('del'),
		plumber = require('gulp-plumber'),
		stylelint = require('gulp-stylelint'),
		groupMedia = require('gulp-group-css-media-queries'),
		sourcemaps = require('gulp-sourcemaps'),
		fileSize = require('gulp-size'),
		shell = require('gulp-shell'),
		ftp = require('vinyl-ftp'),
		autoprefixer = require('gulp-autoprefixer');

var dirs = {
	test: 'test/',
	docs: 'docs/',
	libs: 'test/libs/',
	ftp: ''
};

var path = {
	src: 'src/sass/',
	build: 'dist/',
	docs: {
		assets: dirs.docs + 'styleguide/kss-assets/',
		img: dirs.docs + 'img/',
	},
	test: {
		css: dirs.test + 'css/',
		sass: dirs.test + 'sass/',
		pug: dirs.test + 'pug/',
		img: dirs.test + 'img/'
	}
};

var files = {
	styles: '**/*.{scss,css}',
	js: '**/*.js',
	pug: '**/*.pug',
	html: '**/*.html',
	all: '**/*'
};

path = Object.assign({
	watch: {
		styles: [
			dirs.libs + files.styles,
			path.src + files.styles,
			path.test.sass + files.styles,
		],
		pug: dirs.test + files.pug,
		html: dirs.test + files.html,
		docs: [
			dirs.docs + 'examples/' + files.html,
			dirs.docs + 'examples/**/*.hbs',
			dirs.docs + '*.md',
			path.test.css + 'test.css',
		],
	}
}, path);

var servConfig = {
		server: {
			baseDir: 'test'
		},
		notify: false,
		open: false
},
sizeConfig = {
	gzip: true,
	brotli: true,
	pretty: false,
	showFiles: true
},
ftpConfig = {
	host: '',
	user: '',
	password: '',
	parallel: 10
};

gulp.task('css-lint', function(){
	return gulp.src([
		path.src + files.styles,
		`!${path.src}tools/mixins/base/_mk-ar.scss`,
		`!${path.src}generate.css`,
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

gulp.task('style', gulp.series('css-lint', function(){
	return gulp.src(path.src + '*.scss')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({
			indentType: 'tab',
			includePaths: [
				'node_modules',
				path.src,
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
		.pipe(rename(function(path) {
			if(path.basename === 'index') path.basename = 'mlut';
			path.basename += '.min';
		}))
		.pipe(fileSize(sizeConfig))
		.pipe(gulp.dest(path.build))
		.pipe(gulp.dest(path.docs.assets))
		.pipe(sourcemaps.write(''))
		.pipe(gulp.dest(path.test.css))
		.pipe(browserSync.stream());
}));

gulp.task('pug', function(){
	return gulp.src(path.test.pug + '*.pug', {allowEmpty: true})
		.pipe(plumber())
		.pipe(pug({'pretty': '\t'}))
		.pipe(gulp.dest(dirs.test));
});

gulp.task('server', function(){
	browserSync(servConfig);
});

gulp.task('html', function(){
	return gulp.src(dirs.test + files.html, {allowEmpty: true})
		.pipe(fileSize(sizeConfig))
		.pipe(browserSync.stream());
});

gulp.task('sass-compile-doc', () => {
	return gulp.src(dirs.docs + 'generate.scss', {allowEmpty: true})
		.pipe(plumber())
		.pipe(sass({
			indentType: 'tab',
			outputStyle: 'expanded',
			indentWidth: 1
		}))
		.pipe(gulp.dest(dirs.docs + 'content/'))
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

gulp.task('default', gulp.parallel('server', 'kss', 'style', 'pug', function(){
	gulp.watch(path.watch.styles, gulp.series('kss', 'style'));
	gulp.watch(path.watch.pug, gulp.series('pug'));
	gulp.watch(path.watch.html, gulp.series('html'));
	gulp.watch(path.watch.docs, gulp.series('kss'));
}));

gulp.task('watch-test', gulp.parallel('sass-test', 'kss', function(){
	gulp.watch(path.watch.styles, gulp.series('kss', 'sass-test'));
}));

gulp.task('sass-mk-doc', gulp.series('sass-compile-doc', 'kss'));

gulp.task('sass-watch-doc', gulp.series('sass-compile-doc', 'kss', () => {
	gulp.watch(dirs.docs + 'generate.scss', gulp.series('sass-compile-doc', 'kss'));
}));

gulp.task('ftp', function(){
	var conn = ftp.create(ftpConfig);
	return gulp.src(dirs.test + files.all, {buffer: false})
		.pipe(conn.newer(dirs.ftp))
		.pipe(conn.dest(dirs.ftp));
});

gulp.task('clear', function(cb){
	del.sync(path.build);
	cb();
});

gulp.task('img', () => {
	return gulp.src(path.docs.img + files.all, {buffer: false})
		.pipe(gulp.dest(path.docs.assets));
});

gulp.task('build', gulp.series('clear', 'style', 'pug', 'kss', 'img'));
