import fs from 'node:fs';
import { jitEngine, logger } from '@mlut/core';
import { createUnplugin } from 'unplugin';

import { transformCss } from './transformCss.js';

export interface Options {
	input?: string,
	output?: string,
	minify?: boolean,
	autoprefixer?: boolean,
}

export const unplugin = createUnplugin<Options>((opts) => {
	const finalOpts: Options = {};
	let lastCompiledCss = '';

	return {
		name: 'unplugin-mlut',

		async buildStart() {
			const inputPath = opts.input;
			let inputContent = '';

			if (inputPath) {
				inputContent = await fs.promises.readFile(inputPath)
					.then((r) => {
						this.addWatchFile(inputPath);
						return r.toString();
					})
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
		},

		transform(code, id) {
			if (id.includes('.css') || id.includes('.scss')) {
				return null;
			}

			jitEngine.putContent(id, code);
			return null;
		},

		async watchChange(id, change) {
			if (finalOpts.input === id) {
				await fs.promises.readFile(id)
					.then((data) => jitEngine.updateSassConfig(data.toString()));
			} else if (change.event === 'delete') {
				jitEngine.deleteContent(id);
			}
		},

		async buildEnd() {
			const css = await jitEngine.generateCss();

			if (lastCompiledCss !== css) {
				lastCompiledCss = css;

				await fs.promises.writeFile(
					finalOpts.output as string,
					await transformCss(css, finalOpts),
				)
					.catch((e) => logger.error('Failed to write the output file.', e));
			}
		},
	};
});

export const rollup = unplugin.rollup;
export const vite = unplugin.vite;
export const webpack = unplugin.webpack;
