/*
Init

Implements `js` and `nojs` [states](section-concepts.html#kssref-concepts-utility-states).

Weight: 0

Markup: ../../../docs/examples/core-scripts/init.html

Styleguide: core-scripts.init
*/

;(function(){
	"use strict"

	var nodesWithJsUtils = document.querySelectorAll("[class*='js_']"),
			i = 0;

	for(i = 0; i < nodesWithJsUtils.length; i++) {
		nodesWithJsUtils[i].className = nodesWithJsUtils[i].className
			.replace(/(?:\ )?nojs_(?:[^\ \n]*)/g, "")
			.replace(/js_/g, "");
	}
}());