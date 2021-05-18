const path = require('path'),
			sassTrue = require('sass-true');

Error.stackTraceLimit = 0;

const sassFile = path.join(__dirname, 'index.scss');
sassTrue.runSass(
	{
		file: sassFile,
		includePaths: [
			'src/sass',
			'node_modules',
		],
	},
	{ describe, it }
);
