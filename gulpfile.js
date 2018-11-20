var gulp = require("gulp"),
		sass = require("gulp-sass"),
		pug = require("gulp-pug"),
		browserSync = require("browser-sync"),
		rigger = require("gulp-rigger"),
		cleancss = require("gulp-clean-css"),
		uglify = require("gulp-uglify"),
		rename = require("gulp-rename"),
		del = require("del"),
		plumber = require("gulp-plumber"),
		stylelint = require("gulp-stylelint"),
		groupMedia = require("gulp-group-css-media-queries"),
		tabify = require("gulp-tabify"),
		sourcemaps = require("gulp-sourcemaps"),
		pkg = require("./package.json"),
		fileSize = require("gulp-size"),
		shell = require("gulp-shell"),
		autoprefixer = require("gulp-autoprefixer");

var dirs = {
	src: "src/",
	test: "test/",
	docs: "docs/",
	libs: "test/libs/",
	build: "dist/"
};

var path = {
	src: {
		blocks: dirs.src + "core-blocks/",
		utils: dirs.src + "core-utils/",
		sass: dirs.src + "sass/",
		js: dirs.src + "js/"
	},
	build: {
		css: dirs.build + "css/",
		js: dirs.build + "js/"
	},
	test: {
		css: dirs.test + "css/",
		js: dirs.test + "js/",
		pug: dirs.test + "pug/"
	}
};

var files = {
	styles: "**/*.{scss,css}",
	js: "**/*.js",
	pug: "**/*.pug",
	html: "**/*.html",
	distCss: "mlut.min.css",
	distJs: "mlut.min.js",
	all: "**/*"
};

path = Object.assign({
	watch: {
		styles: [
			path.src.blocks + files.styles,
			path.src.utils + files.styles,
			dirs.libs + files.styles,
			path.src.sass + files.styles
		],
		pug: dirs.test + files.pug,
		html: dirs.test + files.html,
		js: [
			path.src.js + "mlut.js",
			path.src.js + "includes/" + files.js,
			path.src.blocks + files.js,
			dirs.libs + files.js
		]
	}
}, path);

var servConfig = {
		server: {
			baseDir: "test"
		},
		notify: false,
		open: false
},
		sizeConfig = {
			gzip: true,
			pretty: false,
			showFiles: true
		};

gulp.task("style", ["css-lint"], function(){
	return gulp.src(path.src.sass + "mlut.scss")
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({
			indentType: "tab",
			outputStyle: "expanded",
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
			compatibility: "ie8"
		}))
		.pipe(rename(files.distCss))
		.pipe(fileSize(sizeConfig))
		.pipe(gulp.dest(path.build.css))
		.pipe(sourcemaps.write(""))
		.pipe(gulp.dest(path.test.css))
		.pipe(browserSync.stream());
});

gulp.task("css-lint", function(){
	return gulp.src([
		path.src.blocks + files.styles,
		path.src.utils + files.styles,
		path.src.sass + files.styles
	])
		.pipe(stylelint({
			reporters:[
				{formatter: "string", console: true}
			]
		}));
});

gulp.task("scripts", function(){
	return gulp.src(path.src.js + "mlut.js")
		.pipe(plumber())
		.pipe(rigger())
		.pipe(sourcemaps.init())
		.pipe(rename("scripts.js"))
		.pipe(gulp.dest(path.test.js))
		.pipe(uglify())
		.pipe(rename(files.distJs))
		.pipe(fileSize(sizeConfig))
		.pipe(gulp.dest(path.build.js))
		.pipe(sourcemaps.write(""))
		.pipe(gulp.dest(path.test.js))
		.pipe(browserSync.stream());
});

// Pug used only for mlut examples
gulp.task("pug", function(){
	return gulp.src(path.test.pug + "*.pug")
		.pipe(plumber())
		.pipe(pug({"pretty": "\t"}))
		.pipe(gulp.dest(dirs.test));
});

gulp.task("server", function(){
	browserSync(servConfig);
});

gulp.task("html", function(){
	return gulp.src(dirs.test + files.html)
		.pipe(fileSize(sizeConfig))
		.pipe(browserSync.stream());
});

gulp.task("kss", shell.task([
	"node_modules/.bin/kss --config " + dirs.docs + "kss-config.json"
]));

gulp.task("default", ["server", "style", "pug", "scripts"], function(){
	gulp.watch(path.watch.styles, ["style", "kss"]);
	gulp.watch(path.watch.pug, ["pug"]);
	gulp.watch(path.watch.html, ["html"]);
	gulp.watch(path.watch.js, ["scripts"]);
});

gulp.task("clear", function(){
	return del.sync(dirs.build);
});

gulp.task("build", ["clear", "style", "pug", "scripts"], function(){
});

