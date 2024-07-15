import { createRequire } from 'node:module';
import type CleanCSS from 'clean-css';
import type { Targets } from 'lightningcss';

export interface TransformCssOptions {
	readonly minify?: boolean,
	readonly autoprefixer?: boolean,
	readonly noMergeMq?: boolean,
}

type TransformCss = (css: string, options: TransformCssOptions) => Promise<string>;

const require = createRequire(import.meta.url);
let isMinifierCanAddPrefixes = false;

const transformByAvailableTool = await import('csso')
	.then<TransformCss>(({ minify }) => (
		(css, { noMergeMq }) =>
			Promise.resolve(minify(css, { forceMediaMerge: !noMergeMq }).css)
	))
	.catch<TransformCss>(async () => {
		const { transform, browserslistToTargets } = (await import('lightningcss'));
		const browserslist = (await import('browserslist')).default;
		let targets: undefined | Targets;
		isMinifierCanAddPrefixes = true;

		return (css, { autoprefixer, minify }) => {
			if (autoprefixer && targets == undefined) {
				targets = browserslistToTargets(browserslist());
			}

			const { code } = transform({
				filename: 'style.css',
				targets,
				code: Buffer.from(css),
				minify,
			});

			return Promise.resolve(code.toString());
		};
	})
	.catch<TransformCss>(() => {
		const CleanCss = require('clean-css') as CleanCSS.Constructor;
		const minifier = new CleanCss({
			level: 2,
			returnPromise: true,
		});

		return (css) => minifier.minify(css).then((r) => r.styles);
	})
	.catch<TransformCss>(async () => {
		const esbuild = await import('esbuild');

		return async (css) => {
			return esbuild.transform(css, {
				loader: 'css',
				minify: true,
			}).then((r) => r.code);
		};
	})
	.catch(() => {
		throw new Error('No CSS minifier was found. You can install one of these: csso, lightningcss, clean-css, cssnano or esbuild');
	});

const applyAutoprefixer = await import('autoprefixer')
	.then(async (autoprefixer) => {
		const postcss = (await import('postcss')).default;
		const processor = postcss([autoprefixer.default]);
		const options = { from: undefined };

		return (css: string) => processor.process(css, options).then((r) => (r.css));
	})
	.catch(() => undefined);

// TODO: rewrite using class
export async function transformCss(
	css: string,
	options: TransformCssOptions,
): Promise<string> {
	let result = css;

	if (options.minify || isMinifierCanAddPrefixes) {
		result = await transformByAvailableTool(css, options);
	}

	if (options.autoprefixer && !isMinifierCanAddPrefixes) {
		if (applyAutoprefixer === undefined) {
			throw new Error('The Autoprefixer package are not installed. You can do this with `npm i -D postcss autoprefixer`');
		}

		result = await applyAutoprefixer(result);
	}

	return result;
}
