import { join } from 'node:path';
import { rollup } from '@mlut/plugins';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import htmlTemplate from 'rollup-plugin-generate-html-template';

const __dirname = new URL('.', import.meta.url).pathname;

const mlut = rollup({
	// other options in the input file
	input: join(__dirname, 'src/style.scss'),
});

const plugins = [
	mlut,
	htmlTemplate({
		template: join(__dirname, 'src/index.html'),
		target: join(__dirname, 'dist/index.html'),
		attrs: ['type="module"'],
	}),
];

if (process.env.ROLLUP_WATCH) {
	plugins.push(
		serve(join(__dirname, 'dist')),
		livereload({
			// prevents race condition with CSS file writing by mlut and livereload
			delay: 100,
		}),
	);
}

export default {
	input: join(__dirname, 'src/index.js'),
	plugins,
	output: {
		dir: join(__dirname, 'dist'),
		format: 'es',
	},
};
