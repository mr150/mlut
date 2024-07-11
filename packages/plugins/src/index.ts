import fs from 'node:fs';
import { jitEngine, logger } from '@mlut/core';
import { createUnplugin } from 'unplugin';
import fse from 'fs-extra';

import { transformCss, TransformCssOptions } from './transformCss.js';

export interface Options extends TransformCssOptions {
	readonly input?: string,
	readonly output?: string,
}

export const unplugin = createUnplugin<Options>((opts, meta) => {
	const finalOpts: Options = {};
	let lastCompiledCss = '';
	const isWebpack = meta.framework === 'webpack';
	let isVite = false;
	let isViteWatch = false;
	const inputPath = opts.input;

	const writeCss = async () => {
		const css = await jitEngine.generateCss();

		if (lastCompiledCss !== css) {
			lastCompiledCss = css;

			await fse.outputFile(
				finalOpts.output as string,
				await transformCss(css, finalOpts),
			).catch((e) => logger.error('Failed to write the output file.', e));
		}
	};

	const debouncedWriteCss = debounce(writeCss, 500);

	const initPlugin = async () => {
		let inputContent = '';

		if (inputPath) {
			inputContent = await fs.promises.readFile(inputPath)
				.then((r) => r.toString())
				.catch((e) => (logger.warn('Failed to read the input file.', e), ''));
		}

		const cfgMatchResult = inputContent.match(/\$jit:\s*\(([^)]+)/);

		if (cfgMatchResult != null) {
			try {
				const config = JSON.parse(
					//eslint-disable-next-line
					`{${cfgMatchResult[1].replaceAll("'", '"')}}`
				) as Options;

				Object.assign(finalOpts, opts, config);
			} catch (e) {
				logger.error('Failed to load the JIT config from the input file.', e);
			}
		} else {
			Object.assign(finalOpts, opts);
		}

		if (!finalOpts.output) {
			throw new Error('Output path not specified!');
		}

		await jitEngine.init([inputPath, inputContent]);
	}

	return {
		name: 'unplugin-mlut',

		config(_cfg: unknown, { command }: { command: string }) {
			isVite = true;

			if (command === 'serve') {
				isViteWatch = true;
			}
		},

		// hack because `buildStart` is not async in webpack yet
		// https://github.com/unjs/unplugin/issues/293
		webpack(compiler) {
			compiler.hooks.beforeCompile.tapPromise('unplugin-mlut', initPlugin);
		},

		async buildStart() {
			if (meta.framework !== 'webpack') {
				await initPlugin();
			}

			if (inputPath) {
				this.addWatchFile(inputPath);
			}
		},

		transformInclude(id) {
			// hack because `html-webpack-plugin` can't load html when using `unplugin`
			// https://github.com/intlify/bundle-tools/issues/322
			if (isWebpack && id.endsWith('.html')) {
				return false;
			}

			return !(
				id.endsWith('.css') ||
				id.endsWith('.scss') ||
				id.includes('/node_modules/')
			);
		},

		transform(code, id) {
			jitEngine.putContent(id, code);
			return null;
		},

		// Vite only hook
		async transformIndexHtml(html: string) {
			jitEngine.putContent('index.html', html);

			if (isViteWatch) {
				debouncedWriteCss();
			} else if (isVite) {
				await writeCss();
			}

			return html;
		},

		async watchChange(id, change) {
			if (finalOpts.input === id) {
				await fs.promises.readFile(id)
					.then((data) => jitEngine.updateSassConfig(data.toString()));

				if (isVite) {
					await writeCss();
				}
			} else if (change.event === 'delete') {
				jitEngine.deleteContent(id);
			}
		},

		async buildEnd() {
			if (!isVite) {
				await writeCss();
			}
		},
	};
});

function debounce<T>(fn: (...args: T[]) => unknown, timeout: number) {
	let timer: number | undefined;

	return (...args: T[]) => {
		clearTimeout(timer);
		timer = setTimeout(fn, timeout, args);
	}
}

export const rollup = unplugin.rollup;
export const vite = unplugin.vite;
export const webpack = unplugin.webpack;
