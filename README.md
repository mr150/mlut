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

## Getting Started ##
There are 2 ways to start using MLUT:

- assembled dist
- developer toolkit

### Installation ###

#### Git ####
```
git clone https://github.com/mr150/mlut.git
```

#### NPM ####
```
npm i mlut -D
```

### CDN ###
```html
<link href="https://unpkg.com/mlut@latest/dist/css/mlut.min.css" rel="stylesheet">
```
```html
<script src="https://unpkg.com/mlut@latest/dist/js/mlut.min.js"></script>
```

### Download ###
Download assembled files: [CSS](https://unpkg.com/mlut@latest/dist/css/mlut.min.css), [JS](https://unpkg.com/mlut@latest/dist/js/mlut.min.js)

### Usage ###

#### Distributive ####

You can get assembled MLUT code and include it to your project. There are some ways to get a distributive.

- just plug in with CDN
- if used `git clone`, files are located in the `dist/` folder
- if used `npm`, files are in `node_modules/mlut/dist/`

Add the files to your page like here:
```html
<link href="css/mlut.min.css" rel="stylesheet">
<script src="js/mlut.min.js"></script>
```
And just add MLUT classes to markup:
```html
<div class="row D-f">
	<div class="row__col W3c_md">
		<h3>Simple text</h3>
```

#### Toolkit ####
To use all MLUT features you need an assembly. There are 3 ways:

- Use [MLUT project template](https://github.com/mr150/mlut-project)
- Use [npm](#npm), import tools from `node_modules/mlut/src/` and setup assembly based on [technologies list](https://mr150.github.io/mlut/)
- [Clone](#git) this repo and use configured assembly from it

Further instructions see [here](https://mr150.github.io/mlut/section-start.html#kssref-start-usage)

## Documentation ##
Available [here](https://mr150.github.io/mlut/) or can be run locally. Documentation is included in this repo and is generated using [KSS-node](https://github.com/kss-node/kss-node) from the comments in the sources.

## License ##
MIT
