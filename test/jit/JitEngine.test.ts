import fs from 'node:fs';
import path from 'node:path';
import { assert } from 'chai';
import { JitEngine } from '../../src/jit/JitEngine.js';

const __dirname = new URL('.', import.meta.url).pathname;

describe('JitEngine', () => {
	const htmlContent0 = '<div class="P1r">000</div>';
	const htmlContent1 = '<div class=" D-f Olm2;fc;tp;d">111</div>';

	const htmlPath0 = '/tmp/mlut-test0.html';
	const htmlPath1 = '/tmp/mlut-test1.html';
	const sassInputPath = '/tmp/mlut-input.scss';

	const sassInputContent = `
@use 'sass:list';
@use "${path.join(__dirname, '../../tools')}" as testou with (
	$utils-data: (
		'utils': (
			'registry': (
				'Olm': (
					'properties': outline-magick,
					'conversion': 'outline',
					'keywords': ('sizing', 'line-style', 'line-width'),
				),
			),
		),
	),
);
@use 'sass:meta';

@include testou.apply('C-ih');
`;

	const extractUtilsContent = `
<div class="
D-n
md_D
md_Gc-s1 Pb6u Ps Lol5    md_Mxh130vh Ps

@:pfrm_-Try0 ^one_Bgc-$bgColor?#c06_h Ct-'id:';attr(id)_b
">
Lorem Ipsum
</div>

const wrapperCss = "M1u	 -Myvar12 Ps d-g";

<MyComponent className={cn('D-f Gap5u', wrapperCss)}/>
`;

	before(async () => {
		await Promise.all([
			fs.promises.writeFile(sassInputPath, sassInputContent),
			fs.promises.writeFile(htmlPath0, htmlContent0),
			fs.promises.writeFile(htmlPath1, htmlContent1),
		]);
	});

	it('extract utils from content', async () => {
		const jit = new JitEngine();
		await jit.init();

		assert.deepEqual(
			//@ts-expect-error
			jit.extractUtils(extractUtilsContent),
			[
				'D-n',
				'md_D',
				'md_Gc-s1',
				'Pb6u',
				'Ps',
				'md_Mxh130vh',
				'@:pfrm_-Try0',
				'^one_Bgc-$bgColor?#c06_h',
				//eslint-disable-next-line
				"Ct-'id:';attr(id)_b",
				'M1u',
				'-Myvar12',
				'D-f',
				'Gap5u'
			],
		);
	});

	it('generate CSS from the file', async () => {
		const jit = new JitEngine();
		await jit.init(sassInputPath);

		/* eslint-disable */
		const cssOutput = `.C-ih {
  color: inherit;
}

.P1r {
  padding: 1rem;
}

.D-f {
  display: flex;
}

.Olm2\\;fc\\;tp\\;d {
  outline-magick: 2px fit-content transparent dotted;
}`;
		/* eslint-enable */

		assert.equal(
			await jit.generateFrom([htmlPath0, htmlPath1]),
			cssOutput,
		);
	});
});
