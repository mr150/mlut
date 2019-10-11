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
	"use strict"

	var nodesWithJsUtils = document.querySelectorAll("[class*='js']"),
			i = 0;

	for(i = 0; i < nodesWithJsUtils.length; i++) {
		nodesWithJsUtils[i].className = nodesWithJsUtils[i].className
			.replace(/(\ |^)nojs[_\-](?:[^\ \n]*)/g, "")
			.replace(/(\ |^)js[_\-]/g, " ")
			.trim();
	}
}());
