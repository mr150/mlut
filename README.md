# My Little UI Toolkit #
Toolkit for quick development of lightweight, easily changeable and mobile-first website UI with progressive enhancement.

[![Build Status](https://travis-ci.com/mr150/mlut.svg?branch=master)](https://travis-ci.com/mr150/mlut)
[![](https://img.shields.io/npm/v/mlut.svg)](https://www.npmjs.com/package/mlut)

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

#### Download ####
Download assembled CSS from [here](https://unpkg.com/mlut@latest/dist/css/mlut.min.css).

#### CDN ####
```html
<link href="https://unpkg.com/mlut@latest/dist/css/mlut.min.css" rel="stylesheet">
```

### Usage ###
### Distributive ###
You can get assembled MLUT code and include it to your project. There are some ways to get a distributive.

- if used `git clone`, files are located in the `dist/` folder
- if used `npm`, files are in `node_modules/mlut/dist/`

Add the file to your page like here:
```html
<link href="css/mlut.min.css" rel="stylesheet">
```
And just add MLUT classes to markup:
```html
<div class="row D-f">
	<div class="row__col W3gc_md">
		<h3>Simple text</h3>
```

#### Toolkit ####
To use all MLUT features you need an assembly. There are 3 ways:

- If you don't want to develop MLUT, it's recommended to use [MLUT project template](https://github.com/mr150/mlut-project)
- [Clone](#git) this repo and use configured assembly from it
- Setup assembly yourself use [technologies list](https://mr150.github.io/mlut/)

##### Assembly #####
If you cloned git repo:
```
npm i
```
Run dev server with live reload, code linting and documentation building:
```
npm run dev
```
or
```
gulp
```
Build without dev server:
```
npm run build
```

##### Styles #####
Once the assembly is configured, import sass tools and settings to your `style.scss`
```scss
@import "includes/settings";
@import "includes/functions";
@import "includes/mixins";
```
Then you can import blocks and utilities how it is done in the `src/sass/mlut.scss` to get the standard build. Or you can import only what you need:
```scss
@import "../core-blocks/wrapper/wrapper";
@import "../core-utils/display";

@include mlu-bpm($mlu-bp-md) {
	.input--common {
		padding: mlu-px2em(16px) 16px;
	}
}
```

## Documentation ##
Documentation is included in this repo and is generated using [KSS-node](https://github.com/kss-node/kss-node) from the comments in the sources. You can see it [here](https://mr150.github.io/mlut/) or run locally.

## License ##
MIT
