#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { PurgeCSS } from 'purgecss';
import * as sass from 'sass-embedded';
import arg from 'arg';
import { minify } from 'csso';
import fg from 'fast-glob';
import Watcher from 'watcher';

import { logger } from './logger.js';

const args = arg({
	'--help': Boolean,
	'--input': String,
	'--content': [String],
	'--output': String,
	'--watch': Boolean,
	'--minify': Boolean,
	'--no-merge-mq': Boolean,

	'-i': '--input',
	'-o': '--output',
	'-w': '--watch',
	'-h': '--help',
	'-m': '--minify',
});

type ArgsNames = keyof typeof args;

if (args['--help'] !== undefined) {
	console.log(
		`Usage:
  mlut [-i input.scss] [-o output.css] [--watch] [options...]

Options:
  -h, --help            Print this help message
  -i, --input           Input sass file
  -o, --output          Output css file
  -w, --watch           Watch for changes and rebuild as needed
  -m, --minify          Generate minified css file
      --content         Paths to content with markup
      --no-merge-mq     Prevent merging of CSS media queries during minification`
	);
	process.exit(0);
}

const cwd = process.cwd();
const config = await import(path.join(cwd, 'mlut.config.mjs'))
	.then((r: { default: object }) => r.default)
	.catch(() => ({})) as typeof args;

// TODO: add runtime type checking of values from the config
for (const [key, value] of Object.entries<typeof args[ArgsNames]>(config)) {
	const argKey = '--' + key as ArgsNames;
	(args[argKey] as typeof value) = value;
}

const inputPath = args['--input'] as string;

if (!inputPath) {
	logger.error('Input path not specified!');
	process.exit(1);
}

const outputPath = args['--output'] as string;

if (!outputPath) {
	logger.error('Output path not specified!');
	process.exit(1);
}

const purgedContent = args['--content'] ?? [] as string[];
const isWatch = args['--watch'];
const isMinify = args['--minify'];
const isMergeMq = !args['--no-merge-mq'];

if (purgedContent.length === 0) {
	logger.error('Content path not specified!');
	process.exit(1);
}

if (isWatch) {
	void watch();
}

void buildStyles();

async function buildStyles() {
	logger.info('Rebuilding styles...');
	const startTime = Date.now();

	// `compileAsync` is almost always faster than `compile`
	const { css: compiledCss } = (await sass.compileAsync(
		inputPath,
		{ loadPaths: ['node_modules'] }
	));

	const purgedCss = await new PurgeCSS().purge({
		content: purgedContent,
		css: [{ raw: compiledCss }]
	}).then(([{ css }]) => {
		if (isMinify) {
			return minify(css, { forceMediaMerge: isMergeMq }).css;
		}

		return css;
	});

	fs.promises.writeFile(outputPath, purgedCss)
		.then(() => logger.info('Completed in', formatTime(Date.now() - startTime)))
		.catch((e) => logger.error('Error when write output file.', e));
}

async function watch() {
	logger.info('Start watching');

	const watchedFiles = (await fg(purgedContent, { dot: true })).concat(inputPath);
	const watcher = new Watcher(
		watchedFiles,
		{ debounce: 1000, ignoreInitial: true, },
	);

	watcher.on('all', () => {
		buildStyles()
			.catch((e) => logger.error('Error when rebuilding styles.', e));
	});
}

function formatTime(milliseconds: number): string {
	return milliseconds > 1000 ?
		(milliseconds / 1000).toFixed(1) + 's' :
		milliseconds + 'ms';
}
