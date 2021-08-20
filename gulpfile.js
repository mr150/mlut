var gulp = require('gulp'),
		sass = require('gulp-sass')(require('sass')),
		pug = require('gulp-pug'),
		browserSync = require('browser-sync'),
		rigger = require('gulp-rigger'),
		cleancss = require('gulp-clean-css'),
		uglify = require('gulp-uglify'),
		rename = require('gulp-rename'),
		del = require('del'),
		plumber = require('gulp-plumber'),
		stylelint = require('gulp-stylelint'),
		groupMedia = require('gulp-group-css-media-queries'),
		tabify = require('gulp-tabify'),
		sourcemaps = require('gulp-sourcemaps'),
		pkg = require('./package.json'),
		fileSize = require('gulp-size'),
		shell = require('gulp-shell'),
		ftp = require('vinyl-ftp'),
		autoprefixer = require('gulp-autoprefixer');

var dirs = {
	src: 'src/',
	test: 'test/',
	docs: 'docs/',
	libs: 'test/libs/',
	build: 'dist/',
	ftp: ''
};

var path = {
	src: {
		sass: dirs.src + 'sass/',
		js: dirs.src + 'js/'
	},
	build: {
		css: dirs.build + 'css/',
		js: dirs.build + 'js/'
	},
	test: {
		css: dirs.test + 'css/',
		sass: dirs.test + 'sass/',
		js: dirs.test + 'js/',
		pug: dirs.test + 'pug/'
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
			path.src.sass + files.styles,
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
		js: [
			path.src.js + files.js,
			dirs.libs + files.js
		]
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
		path.src.sass + files.styles,
		`!${path.src.sass}tools/mixins/base/_mk-ar.scss`,
	])
		.pipe(stylelint({
			reporters:[
				{formatter: 'string', console: true}
			]
		}));
});

gulp.task('sass-test', shell.task(
	`node_modules/.bin/mocha ${path.test.sass}index.js`,
	{ignoreErrors: process.env.NODE_ENV !== 'production'}
));

gulp.task('style', gulp.series('css-lint', function(){
	return gulp.src(path.src.sass + '*.scss')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({
			indentType: 'tab',
			includePaths: [
				'node_modules',
				'src/sass',
			],
			outputStyle: 'expanded',
			indentWidth: 1
		}))
		.pipe(groupMedia())
		.pipe(autoprefixer({
			cascade: false,
			flexbox: false
		}))
		.pipe(tabify(2, false))
		.pipe(gulp.dest(path.test.css))
		.pipe(cleancss({
			level: 2,
			compatibility: 'ie8'
		}))
		.pipe(rename(function(path) {
			if(path.basename === 'index') path.basename = 'mlut';
			path.basename += '.min';
		}))
		.pipe(fileSize(sizeConfig))
		.pipe(gulp.dest(path.build.css))
		.pipe(gulp.dest(dirs.docs + 'styleguide/kss-assets/'))
		.pipe(sourcemaps.write(''))
		.pipe(gulp.dest(path.test.css))
		.pipe(browserSync.stream());
}));

gulp.task('scripts', function(){
	return gulp.src(path.src.js + 'mlut.js', {allowEmpty: true})
		.pipe(plumber())
		.pipe(rigger())
		.pipe(sourcemaps.init())
		.pipe(gulp.dest(path.test.js))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(fileSize(sizeConfig))
		.pipe(gulp.dest(path.build.js))
		.pipe(gulp.dest(dirs.docs + 'styleguide/kss-assets/'))
		.pipe(sourcemaps.write(''))
		.pipe(gulp.dest(path.test.js))
		.pipe(browserSync.stream());
});

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

gulp.task('kss', shell.task([
	'node_modules/.bin/kss --config ' + dirs.docs + 'kss-config.json',
	'cp ' + path.test.css + 'test.css ' + dirs.docs + 'styleguide/kss-assets'
]));

gulp.task('default', gulp.parallel('server', 'style', 'pug', 'scripts', function(){
	gulp.watch(path.watch.styles, gulp.parallel(
		gulp.series('style', 'sass-test'),
		'kss'
	));

	gulp.watch(path.watch.pug, gulp.series('pug'));
	gulp.watch(path.watch.html, gulp.series('html'));
	gulp.watch(path.watch.js, gulp.series('scripts', 'kss'));
	gulp.watch(path.watch.docs, gulp.series('kss'));
}));

gulp.task('ftp', function(){
	var conn = ftp.create(ftpConfig);
	return gulp.src(dirs.test + files.all, {buffer: false})
		.pipe(conn.newer(dirs.ftp))
		.pipe(conn.dest(dirs.ftp));
});

gulp.task('clear', function(cb){
	del.sync(dirs.build);
	cb();
});

gulp.task('build', gulp.series('clear', 'style', 'sass-test', 'pug', 'scripts', 'kss'));
