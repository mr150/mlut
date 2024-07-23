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
	private inputFileDir = __dirname;
	private sassModuleName = 'tools';
	private inputFileCache = '@use "../sass/tools";';
	private readonly defaultSassConfig =
		'@use "sass:map";\n @use "../sass/tools/settings" as ml;';
	private readonly utilsByFile = new Map<string, string[]>();
	private readonly utilsRegexps = {
		quotedContent: /"\n?[^"]*[^"\n]*\n?"/g,
		singleQuotedContent: /'\n?[^']*[^'\n]*\n?'/g,
		backtickQuotedContent: /`\n?[^`]*[^`\n]*\n?`/g,
		tooMoreSpaces: /\s{2,}|\n/g,
		escapedQuotes: /\\['"`]/g,
		utilName: /^-?[A-Z]{1}[a-zA-Z]*/,
		uppercaseLetter: /[A-Z]/,
	};
	private readonly configRegexps = {
		userSettings: /@use ['"][^'"]*(tools|mlut|core)['"](\s*as\s+[\w]+)?\s+with\s*\(([^;]+)\);/s,
		sassModuleName: /@use ['"][^'"]*(tools|mlut|core)['"]\s*;/s,
	};

	async init(
		[inputPath, inputContent]: [string | undefined, string | undefined] = ['', '']
	) {
		if (this.utils.size) {
			return;
		}

		let sassConfig: string | undefined = this.defaultSassConfig;

		if (inputPath && inputContent) {
			this.inputFileDir = path.dirname(path.resolve(process.cwd(), inputPath));
			this.inputFileCache = inputContent;
			sassConfig = this.extractUserSassConfig(inputContent);
		}

		await this.loadUtils(sassConfig);
	}

	putContent(id: string, content: string | undefined) {
		if (!content) {
			return;
		}

		this.utilsByFile.set(id, this.extractUtils(content));
	}

	deleteContent(id: string): boolean {
		return this.utilsByFile.delete(id);
	}

	async updateSassConfig(content: string): Promise<void> {
		this.inputFileCache = content;
		const sassConfig = this.extractUserSassConfig(content);

		if (sassConfig) {
			await this.loadUtils(sassConfig);
		}
	}

	async generateCss(): Promise<string> {
		if (this.utils.size === 0) {
			logger.warn('Config with utilities is not loaded!');
			return '';
		}

		if (this.utilsByFile.size === 0) {
			logger.warn('No content to generate CSS was found!');
			return '';
		}

		const allUniqueUtils = [...new Set([...this.utilsByFile.values()].flat())];
		const applyStr =
			`\n@include ${this.sassModuleName}.apply(${JSON.stringify(allUniqueUtils)},(),true);`;

		// `compileStringAsync` is almost always faster than `compile` in sass-embedded
		return sass.compileStringAsync(
			this.inputFileCache + applyStr,
			{ loadPaths: [ this.inputFileDir, 'node_modules' ] }
		).then(
			({ css }) => css,
			(e) => (logger.error('Sass compilation error.', e), ''),
		);
	}

	private extractUtils(content: string): string[] {
		let fixedContent = content.replace(this.utilsRegexps.escapedQuotes, '');
		const allClassNames = fixedContent
			.match(this.utilsRegexps.quotedContent)
			?.reduce(this.filterAndProcessClassStr, []) ?? [];

		fixedContent = fixedContent.replace(this.utilsRegexps.quotedContent, '');

		fixedContent
			.match(this.utilsRegexps.singleQuotedContent)
			?.reduce(this.filterAndProcessClassStr, allClassNames);

		fixedContent
			.replace(this.utilsRegexps.singleQuotedContent, '')
			.match(this.utilsRegexps.backtickQuotedContent)
			?.reduce(this.filterAndProcessClassStr, allClassNames);

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

	private filterAndProcessClassStr = (acc: string[], str: string) => {
		if (this.utilsRegexps.uppercaseLetter.test(str)) {
			acc.push(
				str.replace(this.utilsRegexps.tooMoreSpaces, ' ').slice(1, -1)
			);
		}

		return acc;
	};

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
