#!/usr/bin/env node

import fs from 'node:fs';
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
	'-c': '--content',
	'-w': '--watch',
});

if (args['--help'] !== undefined) {
	logger.info('help');
	process.exit(0);
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
