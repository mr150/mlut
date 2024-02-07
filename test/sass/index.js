import path from 'node:path';
import sassTrue from 'sass-true';
import * as sass from 'sass-embedded';

const dirname = new URL('.', import.meta.url).pathname;
const sassFile = path.join(dirname, 'index.scss');

Error.stackTraceLimit = 0;
sassTrue.runSass(
	{
		file: sassFile,
		includePaths: [
			'src/sass',
			'node_modules',
		],
	},
	{
		describe,
		it,
		sass,
	}
);
