# My Little UI Toolkit #
Atomic CSS based, modular and lightweight toolkit with progressive enhancement.

[![Build Status](https://travis-ci.com/mr150/mlut.svg?branch=master)](https://travis-ci.com/mr150/mlut)
[![](https://img.shields.io/npm/v/mlut.svg)](https://www.npmjs.com/package/mlut)

## Features ##
- Strong naming conventions: [Emmet](https://github.com/emmetio) abbreviations and BEM naming
- Lightweight: CSS core ~3.9KB, themes from 0.8KB
- Modular and easily extensible
- Designed with progressive enhancement
- Well customizable
- Advanced grid system with CSS custom properties
- Responsive and mobile first
- Reusable across projects
- Written in Sass and vanilla JS

## Structure ##
- CSS library
- JS library (optional)
- Sass tools

### Library ###
The library part of toolkit united in itself ideas from [Atomic CSS](https://acss.io/) and [BEM](https://bem.info/). It consists of 2 layers:

- Core - all that can be used at any project. This layer contains BEM blocks, CSS utilities and simple optional scripts.
- Modules - themes, utilities sets and scripts, that can be reused in different projects.

In most projects, you will probably need to add another "design" layer that will be specific to your interface. It may contain any styles and scripts.

### Tools ###
Sass tools include:

- settings based on which the CSS library is generated.
- mixins and functions. Most of them are needed to generate the library, but can also be used for UI creating.

Most modules use existing MLUT Sass tools, but some may contain new ones or entirely consist of them.

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
Autoprefixer use [this](https://github.com/mr150/mlut/blob/master/.browserslistrc) `browserslist` during assembly. Tested in last versions of modern browsers and some old:
- Desktop
	- Firefox - last, ESR
	- Chrome
	- Safari
	- Edge
	- IE9+ with progressive enhancement
- Mobile
	- Android 4.4.4
	- IOS
