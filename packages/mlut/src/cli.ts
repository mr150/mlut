#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import arg from 'arg';
import { minify } from 'csso';
import fg from 'fast-glob';
import Watcher from 'watcher';
import { jitEngine, logger } from '@mlut/core';

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
type TargetEvent = 'add' | 'addDir' | 'change' | 'rename' | 'renameDir' | 'unlink' | 'unlinkDir';

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
      --no-merge-mq     Prevent merging of css media queries during minification`
	);
	process.exit(0);
}

const inputPath = args['--input'] && path.resolve(process.cwd(), args['--input']);
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
		) as typeof args;

		for (const [key, value] of Object.entries<typeof args[ArgsNames]>(config)) {
			const argKey = '--' + key as ArgsNames;

			if (!(argKey in args)) {
				(args[argKey] as typeof value) = value;
			}
		}
	} catch (e) {
		logger.error('Failed to load the JIT config from the input file.', e);
	}
}

const outputPath = args['--output'] as string;

if (!outputPath) {
	logger.error('Output path not specified!');
	process.exit(1);
}

const targetContent = args['--content'] ?? [] as string[];
const isWatch = args['--watch'];
const isMinify = args['--minify'];
const isMergeMq = !args['--no-merge-mq'];

if (targetContent.length === 0) {
	logger.error('Content path not specified!');
	process.exit(1);
}

await jitEngine.init([inputPath, inputContent]);
const targetFiles = await fg(targetContent, { absolute: true, dot: true });

if (isWatch) {
	watch();
}

void buildStyles(targetFiles, 'add');

async function buildStyles(files: string[], event: TargetEvent) {
	logger.info('Rebuilding styles...');
	const startTime = Date.now();

	await Promise.all(files.map(async (path) => {
		if (event === 'unlink') {
			return jitEngine.deleteContent(path);
		}

		return fs.promises.readFile(path)
			.then((data) => (
				path === inputPath ?
					jitEngine.updateSassConfig(data.toString()) :
					jitEngine.putContent(path, data.toString())
			))
			.catch((e) => logger.error('Failed to read a content file.', e));
	}));

	const css = await jitEngine.generateCss().then((css) => {
		if (isMinify && css) {
			return minify(css, { forceMediaMerge: isMergeMq }).css;
		}

		return css;
	});

	await fs.promises.writeFile(outputPath, css)
		.catch((e) => logger.error('Failed to write the output file.', e));

	logger.info('Completed in', formatTime(Date.now() - startTime));
}

function watch() {
	logger.info('Start watching');

	const watchedFiles = inputPath ? targetFiles.concat(inputPath) : targetFiles;
	const watcher = new Watcher(
		watchedFiles,
		{ ignoreInitial: true, },
	);

	watcher.on('all', (e: TargetEvent, targetPath: string) => {
		buildStyles([targetPath], e)
			.catch((e) => logger.error('Failed to rebuild styles.', e));
	});
}

function formatTime(milliseconds: number): string {
	return milliseconds > 1000 ?
		(milliseconds / 1000).toFixed(1) + 's' :
		milliseconds + 'ms';
}
