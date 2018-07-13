var gulp = require("gulp"),
		sass = require("gulp-sass"),
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
		size = require("gulp-size"),
		autoprefixer = require("gulp-autoprefixer");

try {
	var pug = require("gulp-pug");
} catch (error) {
	console.log("pug is not installed");
}

var dirs = {
	src: "src/",
	demo: "demo/",
	libs: "src/libs/",
	build: "dist/"
};

var path = {
	src: {
		blocks: dirs.src + "core-blocks/",
		utils: dirs.src + "core-utils/",
		css: dirs.src + "css/",
		sass: dirs.src + "sass/",
		js: dirs.src + "js/",
		pug: dirs.demo + "pug/"
	},
	build: {
		css: dirs.build + "css/",
		js: dirs.build + "js/"
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
		pug: dirs.demo + files.pug,
		html: dirs.demo + files.html,
		js: [
			path.src.js + "mlut.js",
			path.src.blocks + files.js,
			dirs.libs + files.js
		]
	}
}, path);

var servConfig = {
		server: {
			baseDir: "demo"
		},
		notify: false,
		open: false
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
			flexbox: "no-2009"
		}))
		.pipe(tabify(2, false))
		.pipe(gulp.dest(path.src.css))
		.pipe(cleancss({
			level: 2,
			compatibility: "ie8"
		}))
		.pipe(rename(files.distCss))
		.pipe(gulp.dest(path.build.css))
		.pipe(sourcemaps.write(""))
		.pipe(gulp.dest(path.src.css))
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
		.pipe(gulp.dest(path.src.js))
		.pipe(uglify())
		.pipe(rename(files.distJs))
		.pipe(gulp.dest(path.build.js))
		.pipe(sourcemaps.write(""))
		.pipe(gulp.dest(path.src.js))
		.pipe(browserSync.stream());
});

// Pug used only for mlut examples so it's not in the dependencies
gulp.task("pug", function(){
	if(pug){
		return gulp.src(path.demo.pug + "*.pug")
			.pipe(plumber())
			.pipe(pug({"pretty": "\t"}))
			.pipe(gulp.dest(dirs.src))
			.pipe(gulp.dest(dirs.demo));
	} else console.log("pug is not installed");
});

gulp.task("server", function(){
	browserSync(servConfig);
});

gulp.task("file-size", function(){
	return gulp.src([
		path.build.css + files.styles,
		path.build.js + files.js,
		dirs.demo + files.html
	])
		.pipe(size({
			gzip: true,
			showFiles: true
		}));
});

/*
gulp.task("watch", ["server", "style", "scripts"], function(){
	gulp.watch(path.watch.styles, ["style", "file-size"]);
	gulp.watch(path.watch.html, browserSync.reload);
	gulp.watch(path.watch.js, ["scripts", "file-size"]);
});
*/

gulp.task("default", ["server", "style", "pug", "scripts"], function(){
	gulp.watch(path.watch.styles, ["style", "file-size"]);
	gulp.watch(path.watch.pug, ["pug", "file-size"]);
	gulp.watch(path.watch.html, browserSync.reload);
	gulp.watch(path.watch.js, ["scripts", "file-size"]);
});

gulp.task("clear", function(){
	return del.sync(dirs.build);
});

gulp.task("build", ["clear", "style", "pug", "scripts", "file-size"], function(){
});

