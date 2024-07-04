import { join } from 'node:path';
import { rollup } from '@mlut/plugins';

const __dirname = new URL('.', import.meta.url).pathname;

const mlut = rollup({
	input: join(__dirname, 'style.scss'),
	output: join(__dirname, 'dist/style.css'),
	minify: true,
	autoprefixer: true,
});

export default {
	input: join(__dirname, 'index.js'),
	plugins: [
		mlut,
	],
	output: {
		file: join(__dirname, 'dist/main.js'),
		format: 'es',
	},
};
