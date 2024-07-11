import { join } from 'node:path';
import { webpack } from '@mlut/plugins';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __dirname = new URL('.', import.meta.url).pathname;

const mlut = webpack({
	input: join(__dirname, 'src/style.scss'),
	output: join(__dirname, 'dist/style.css'),
	minify: true,
	autoprefixer: true,
	noMergeMq: true,
});

const htmlPlugin = new HtmlWebpackPlugin({
	filename: 'index.html',
	template: 'src/index.html',
	inject: 'body',
	scriptLoading: 'module',
});

export default {
	context: __dirname,
	entry: join(__dirname, 'src/index.js'),
	mode: 'development',
	experiments: {
		outputModule: true,
	},
	output: {
		filename: 'main.js',
		libraryTarget: 'module',
		path: join(__dirname, 'dist'),
	},
	plugins: [
		mlut,
		htmlPlugin,
	],
	devServer: {
		static: {
			directory: join(__dirname, 'dist'),
		},
		compress: true,
		port: 9000,
	},
};
