/*
Init

Implements `js` and `nojs` [states](section-concepts.html#kssref-concepts-utility-states) for utilities.

When loading `init.js`, it will remove `js` state from the utilities names and they will work as usual.
Utilities with `nojs` state also will be removed from the markup when loading this script.

Weight: 0

Markup: ../../../docs/examples/core-scripts/init.html

Styleguide: core-scripts.init
*/

;(function(){
	'use strict'

	var elmsWithUtils = document.querySelectorAll('[class*="js"]');

	Array.prototype.forEach.call(elmsWithUtils, function(item) {
		item.className = item.className
			.replace(/(\ |^)nojs[_\-](?:[^\ \n]*)/g, '')
			.replace(/(\ |^)js[_\-]/g, ' ')
			.trim();
	});
}());
