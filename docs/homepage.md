# My Little UI Toolkit #
Toolkit for quick development of lightweight, easily changeable and mobile-first website UI with progressive enhancement.

[![Build Status](https://travis-ci.com/mr150/mlut.svg?branch=master)](https://travis-ci.com/mr150/mlut)
[![](https://img.shields.io/npm/v/mlut.svg)](https://www.npmjs.com/package/mlut)

## Structure ##
- BEM blocks
- CSS utilities
- Developer tools

For now MLUT contains Sass tools and CSS library.

### Concept ###
The library part of toolkit united in itself ideas from [Atomic CSS](https://acss.io/) and [BEM](https://bem.info/). It consists of 2 layers:

- Core - all that can be used at each website. This layer contains BEM blocks and CSS utilities.
- Theme - something that is only used in specific design theme. Theme can be used on different sites. This layer may contain utilities, scripts and styles with BEM naming.

You can add your 'design' layer - parts of UI for a specific website. It may contain any styles and scripts.

## Technologies ##
- [LibSass](https://github.com/sass/libsass)
### Assembly ###
- [Gulp](https://github.com/gulpjs/gulp)
- [Clean-css](https://github.com/jakubpawlowicz/clean-css)
- [Autoprefixer](https://github.com/postcss/autoprefixer)
- [group-css-media-queries](https://github.com/Se7enSky/group-css-media-queries)
- [Rigger](https://github.com/buildjs/rigger)
- [UglifyJS](https://github.com/mishoo/UglifyJS2)
### Documentation and examples ###
- [KSS-node](https://github.com/kss-node/kss-node)
- [Pug](https://github.com/pugjs/pug)

## Supported browsers ##
[Autoprefixer](https://github.com/postcss/autoprefixer) use [this](https://github.com/mr150/mlut/blob/master/.browserslistrc) `.browserslist` during assembly. Tested in last versions of modern browsers and some old:
- Desktop
	- Firefox - last, ESR
	- Chrome
	- Safari
	- Opera
	- Edge
	- IE9+
- Mobile
	- Android 4.4+
	- IOS
