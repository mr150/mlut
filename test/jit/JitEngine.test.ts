import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assert } from 'chai';
import { JitEngine } from '../../packages/core/src/jit/JitEngine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('JitEngine', () => {
	const htmlContent0 = '<div class="P1r">000</div>';
	const htmlContent1 = '<div class=" D-f Olm2;fc;tp;d">111</div>';

	const htmlPath0 = '/tmp/mlut-test0.html';
	const htmlPath1 = '/tmp/mlut-test1.html';
	const sassInputPath = '/tmp/mlut-input.scss';

	const sassInputContent = `
@use 'sass:list';
@use "${path.join(__dirname, '../../packages/core/tools')}" as testou with (
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

	/* eslint-disable */
	const extractUtilsContent = `
<div class="
D-n
md_D
md_Gc-s1 Pb6u Ps Lol5    md_Mxh130vh Ps
-Ctx -Ctx0 -Ctx-one

@:pfrm_-Try0 ^one_Bgc-$bgColor?#c06_h Ct-'id:';attr(id)_b
">
Lorem \`Ipsum\`
</div>

<style type="text/css" data-vite-dev-id="C:/Users/mister/Documents/web/ptoject/src/App.vue?vue&amp;type=style">

const myStr = "simpl'e text" + ' testou' + "" + "hi@150.lv";
const wrapperCss = "M1u	 -Myvar=block \\"Ps\\" d-g";

<MyComponent className={cn('D-f \\'Gap5u', wrapperCss)}/>
` + "\n<button className={`D-ib ${flag ? 'Bgc#f00' : ''}`}>Clear</div>";
	/* eslint-enable */

	it('extract utils from the content', async () => {
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
				'-Myvar=block',
				'D-f',
				'Gap5u',
				'Bgc#f00',
				'D-ib',
			],
		);
	});

	it('generate CSS from the file', async () => {
		const jit = new JitEngine();
		await jit.init([sassInputPath, sassInputContent]);
		await jit.init(['BROKEN/PATH', 'NONE']);

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

		jit.putContent(htmlPath0, htmlContent0);
		jit.putContent(htmlPath1, htmlContent1);

		assert.equal(
			await jit.generateCss(),
			cssOutput,
		);
	});
});
