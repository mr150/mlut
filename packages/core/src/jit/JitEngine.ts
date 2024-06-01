import path from 'node:path';

import { logger } from '../utils/index.js';

const sass = await import('sass-embedded')
	.catch(() => import('sass'))
	.catch(() => {
		throw new Error(
			'The Sass package is not installed. You can do this with `npm i -D sass-embedded`'
		);
	});

const __dirname = new URL('.', import.meta.url).pathname;

export class JitEngine {
	private utils = new Set<string>();
	private inputFilePath = '';
	private inputFileDir = __dirname;
	private sassModuleName = 'tools';
	private inputFileCache = '@use "../sass/tools";';
	private generationDebounce: NodeJS.Timeout | undefined;
	private readonly defaultSassConfig =
		'@use "sass:map";\n @use "../sass/tools/settings" as ml;';
	private readonly utilsByFile = new Map<string, string[]>();
	private readonly utilsRegexps = {
		quotedContent: /"\n?[^"]*?[A-Z][^"\n]*\n?"/g,
		singleQuotedContent: /'\n?[^']*?[A-Z][^'\n]*\n?'/g,
		tooMoreSpaces: /\s{2,}|\n/g,
		utilName: /^-?[A-Z]{1}[a-zA-Z]*/,
	};
	private readonly configRegexps = {
		userSettings: /@use ['"][^'"]*(tools|mlut|core)['"](\s*as\s+[\w]+)?\s+with\s*\(([^;]+)\);/s,
		sassModuleName: /@use ['"][^'"]*(tools|mlut|core)['"]\s*;/s,
	};

	async init(
		[inputPath, inputContent]: [string | undefined, string | undefined] = ['', '']
	) {
		let sassConfig: string | undefined = this.defaultSassConfig;

		if (inputPath && inputContent) {
			this.inputFilePath = path.join(process.cwd(), inputPath);
			this.inputFileDir = path.dirname(this.inputFilePath);
			this.inputFileCache = inputContent;
			sassConfig = this.extractUserSassConfig(inputContent);
		}

		await this.loadUtils(sassConfig);
	}

	async putAndGenerateCss(id: string, content: string): Promise<string | undefined> {
		if (this.utils.size === 0) {
			logger.warn('Config with utilities is not loaded!');
			return '';
		}

		if (id === this.inputFilePath) {
			this.inputFileCache = content;
			const sassConfig = this.extractUserSassConfig(content);

			if (sassConfig) {
				await this.loadUtils(sassConfig);
			}
		} else if (content) {
			this.utilsByFile.set(id, this.extractUtils(content));
		} else {
			this.utilsByFile.delete(id);
		}

		return new Promise((resolve) => {
			//eslint-disable-next-line
			let timeout: NodeJS.Timeout | undefined;
			clearTimeout(this.generationDebounce);

			this.generationDebounce = setTimeout(async () => {
				clearTimeout(timeout);
				const allUniqueUtils = [...new Set([...this.utilsByFile.values()].flat())];
				const applyStr =
					`\n@include ${this.sassModuleName}.apply(${JSON.stringify(allUniqueUtils)},(),true);`;

				// `compileStringAsync` is almost always faster than `compile` in sass-embedded
				const css = await sass.compileStringAsync(
					this.inputFileCache + applyStr,
					{ loadPaths: [ this.inputFileDir, 'node_modules' ] }
				).then(
					({ css }) => css,
					(e) => (logger.error('Sass compilation error.', e), undefined),
				);

				resolve(css);
			}, 100);

			timeout = setTimeout(() => resolve(undefined), 300);
		});
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

	private extractUserSassConfig(content: string): string | undefined {
		let matchResult = content.match(this.configRegexps.userSettings);

		if (matchResult != null) {
			const userSettings = matchResult.at(-1) as string;
			this.sassModuleName = matchResult[2] ?
				matchResult[2].replace(/\s*as\s*/, '') :
				matchResult[1];

			return this.defaultSassConfig.slice(0, -1) + ` with (${userSettings});`;
		}

		matchResult = content.match(this.configRegexps.sassModuleName);

		if (matchResult != null) {
			this.sassModuleName = matchResult[1];
		}
	}

	private async loadUtils(userConfig = this.defaultSassConfig) {
		const { css } = (await sass.compileStringAsync(
			userConfig + '\n a{ all: map.keys(map.get(ml.$utils-db, "utils", "registry")); }',
			{
				style: 'compressed',
				loadPaths: [ __dirname, 'node_modules' ],
			}
		));

		const strEnd = css.lastIndexOf('"') - css.length + 1;
		this.utils = new Set(
			JSON.parse('[' + css.split('all:')[1].slice(0, strEnd) + ']') as string[]
		);
	}
}

export const jitEngine = new JitEngine();
