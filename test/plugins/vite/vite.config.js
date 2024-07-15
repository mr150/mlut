import { join } from 'node:path';
import { vite } from '@mlut/plugins';
import { defineConfig } from 'vite';

const __dirname = new URL('.', import.meta.url).pathname;

const mlut = vite({
	input: join(__dirname, 'src/style.scss'),
	output: join(__dirname, 'dist/assets/style.css'),
	minify: true,
	autoprefixer: true,
});

export default defineConfig(() => {
	return {
		root: __dirname,
		plugins: [mlut],
	}
});
