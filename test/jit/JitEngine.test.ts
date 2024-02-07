import { assert } from 'chai';
import { jitEngine } from '../../src/jit/JitEngine.js';

describe('JitEngine', () => {
	const content = `
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

	before(() => jitEngine.init());

	it('extract utils from content', () => {
		assert.deepEqual(
			//@ts-expect-error
			jitEngine.extractUtils(content),
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
});
