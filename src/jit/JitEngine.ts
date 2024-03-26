import path from 'node:path';
import fs from 'node:fs';
import * as sass from 'sass-embedded';

import { logger } from '../utils/index.js';

const __dirname = new URL('.', import.meta.url).pathname;

export class JitEngine {
	private utils = new Set<string>();
	private inputFilePath = '';
	private inputFileDir = __dirname;
	private inputFileCache = '@use "../sass/tools";';
	private readonly utilsByFile = new Map<string, string[]>();
	private readonly utilsRegexps = {
		quotedContent: /"\n?[^"]*?[A-Z][^"\n]*\n?"/g,
		singleQuotedContent: /'\n?[^']*?[A-Z][^'\n]*\n?'/g,
		tooMoreSpaces: /\s{2,}|\n/g,
		utilName: /^-?[A-Z]{1}[a-zA-Z]*/,
	};

	async init(inputFile = '') {
		let utilsConfig = '@use "sass:map";\n @use "../sass/tools/settings" as ml;';

		if (inputFile) {
			this.inputFilePath = path.join(process.cwd(), inputFile);
			this.inputFileDir = path.dirname(this.inputFilePath);
			this.inputFileCache = await fs.promises.readFile(inputFile).then((r) => {
				const content = r.toString();
				const userSettings = content.match(
					/@use ['"][^'"]*(tools|mlut)['"].*with\s*\(([^;]+)\);/s
				)?.at(-1);

				if (userSettings != null) {
					utilsConfig = utilsConfig.slice(0, -1) + ` with (${userSettings});`;
				}

				return content;
			});
		}

		const { css } = (await sass.compileStringAsync(
			utilsConfig + '\n a{ all: map.keys(map.get(ml.$utils-db, "utils", "registry")); }',
			{
				style: 'compressed',
				loadPaths: [ __dirname ],
			}
		));

		const strEnd = css.lastIndexOf('"') - css.length + 1;
		this.utils = new Set(
			JSON.parse('[' + css.split('all:')[1].slice(0, strEnd) + ']') as string[]
		);
	}

	async generateFrom(files: string[]): Promise<string> {
		if (this.utils.size === 0) {
			logger.warn('Config with utilities is not loaded!');
			return '';
		}

		await Promise.all(files.map(async (path) => (
			fs.promises.readFile(path)
				.then((data) => {
					if (path === this.inputFilePath) {
						this.inputFileCache = data.toString();
						return;
					}

					this.utilsByFile.set(path, this.extractUtils(data.toString()));
				})
				.catch((e) => {
					logger.error('Error while reading a content file.', e);
					this.utilsByFile.delete(path);
				})
		)));

		const allUniqueUtils = [...new Set([...this.utilsByFile.values()].flat())];
		const applyStr =
			`\n@include tools.apply(${JSON.stringify(allUniqueUtils)}, (), true);`;

		// `compileStringAsync` is almost always faster than `compile` in sass-embedded
		const css = await sass.compileStringAsync(
			this.inputFileCache + applyStr,
			{ loadPaths: [ this.inputFileDir ] }
		).then(
			({ css }) => css,
			(e) => (logger.error('Sass compilation error.', e), ''),
		);

		return css;
	}

	private extractUtils(content: string): string[] {
		const allClassNames: string[] = [];

		const quotedClassNames = content
			.match(this.utilsRegexps.quotedContent)
			//eslint-disable-next-line
			?.map(this.normalizeClassNameStr, this);

		const singleQuotedClassNames = content
			.replace(this.utilsRegexps.quotedContent, '')
			.match(this.utilsRegexps.singleQuotedContent)
			//eslint-disable-next-line
			?.map(this.normalizeClassNameStr, this);

		for (const item of [quotedClassNames, singleQuotedClassNames]) {
			if (item instanceof Array) {
				allClassNames.push(...item);
			}
		}

		return [...allClassNames.join(' ').split(' ').reduce((acc, cssClass) => {
			const utility = cssClass.split('_').find((str) => (
				this.utilsRegexps.utilName.test(str)
			));

			if (utility) {
				const utilName = utility.match(this.utilsRegexps.utilName)?.[0] as string;

				if (this.utils.has(utilName) || utilName[0] === '-') {
					acc.add(cssClass);
				}
			}

			return acc;
		}, new Set<string>())];
	}

	private normalizeClassNameStr(str: string) {
		return str.replace(this.utilsRegexps.tooMoreSpaces, ' ').slice(1, -1);
	}
}

export const jitEngine = new JitEngine();
