# My Little UI Toolkit #
Full-featured and hackable toolkit for writing standards-based Atomic CSS. Get almost all power of CSS in one utility.

[![Build Status](https://travis-ci.com/mr150/mlut.svg?branch=master)](https://travis-ci.com/mr150/mlut)
[![](https://img.shields.io/npm/v/mlut.svg)](https://www.npmjs.com/package/mlut)

## Mission ##
- Maximum realize the potential of the Atomic CSS methodology
- Destroy the myth that Atomic CSS for those who don't know or don't like CSS

## Features ##
- Strong naming convention: [one algorithm](https://mr150.github.io/mlut/section-concepts.html#kssref-concepts-naming) for all. If you know CSS, you almost know Mlut
- Constructable and almost arbitrary [values](https://mr150.github.io/mlut/section-concepts.html#kssref-concepts-values), [states](https://mr150.github.io/mlut/section-concepts.html#kssref-concepts-states) and [at-rules](https://mr150.github.io/mlut/section-concepts.html#kssref-concepts-at_rules) by design
- Fully customizable: change tokens, utils names and any settings
- Configuration with great DX. All in one config: add utils, states, change settings and more with few lines of code
- Easiest utilities generation: [range](https://mr150.github.io/mlut/section-how_to.html#kssref-how_to-mk_utils-range) and [components](https://mr150.github.io/mlut/section-concepts.html#kssref-concepts-util-components) syntaxes, utils [groups](https://mr150.github.io/mlut/section-how_to.html#kssref-how_to-mk_utils-groups), [top-level](https://mr150.github.io/mlut/section-how_to.html#kssref-how_to-mk_utils-apply) `apply` and not only
- Well compatible with CSS conceptually. Designed for organic growing together with CSS.
- Easy to use in existing project
- Written in [Sass](https://www.sass-lang.com/) and includes all its benefits

## Structure ##
- Sass tools
- opt-in CSS library
- addons

### Library ###
The library part of toolkit named `Core` and consists of:

- base styles - variables and generic CSS like reset, normalize etc.
- helpers - similar to utilities: the same universal, but more complex and can consist of several CSS rules
- utilities - such that can be used in any project, regardless of design: no colors, typography, etc. Theme utils you can find in addons

The library is **modular** and you can include only what you need

### Tools ###
Sass tools include:

- settings based on which the everything works
- mixins and functions with which you can generate utilities and write styles

### Addons ###
Addons may contains any tools, utilities and styles. In the `core/utils/init.scss` module implemented a method to work with sets of utilities from addons. Addons now at the **preview** stage and in the future, may be moved to separate packages

## Getting Started ##
There are 2 ways to start using Mlut:

- assembled distributive
- toolkit

### Installation ###

#### NPM ####
```
npm i mlut -D
```

### CDN ###
```html
<link href="https://unpkg.com/mlut@latest/dist/css/mlut.min.css" rel="stylesheet">
```

### Usage ###

#### Distributive ####

You can get assembled Mlut code and include it to your project. There are some ways to get a distributive.

- just plug in with CDN
- if used `npm`, files are in `node_modules/mlut/dist/`

Add the files to your page like here:
```html
<link href="css/mlut.min.css" rel="stylesheet">
```
And just add classes to markup:
```html
<div class="D-g Gtc-t3">
  <div class="Bd P2su">
    <h3>Simple text</h3>
```

#### Toolkit ####
To use all Mlut features you need an assembly. You will need to install a package via NPM and:

- [Dart Sass](https://github.com/sass/sass)
- CSS minifier or PostCSS plugin that can group media queries. For example: [CSSO](https://github.com/css/csso) or [this](https://github.com/SassNinja/postcss-combine-media-query) plugin
- [PurgeCSS](https://github.com/FullHuman/purgecss) is recommended for removing unused CSS

Once the assembly is configured, just import Mlut to your stylesheet, and configure it as you need:
```scss
@use '../../node_modules/mlut' as ml with (
  $su-cf: 5,
  $breakpoints: (
    'xxl': 1400px
  ),
  $colors: (
    'red0': #f20,
  ),
  $utils: (
    '^_D': ('', 'n', 'f'),
  ),
);
```
Also now you can use Sass tools for writing CSS manually:
```scss
.my-card {
  display: block;

  @include ml.apply(
    'P2su Fns1r'
  );

  @include ml.bp('md') {
    font-size: calc(ml.px2rem(20px) + 1vw);
  }
}
```
Probably you want to set the Sass [load path](https://sass-lang.com/documentation/js-api/interfaces/LegacyFileOptions#includePaths) for easier import:
```scss
@use 'mlut' as ml with (
```

## Documentation ##
Available [here](https://mr150.github.io/mlut/) or can be run locally. Documentation is included in this repo and is generated using [KSS-node](https://github.com/kss-node/kss-node) from the comments in the sources.

## What's next? ##
- complete the documentation and add more examples
- more utilities
- JIT mode
- first class CSS functions in utils values
- and much more!

## Acknowledgement ##
- [CSS](https://www.w3.org/Style/CSS/)
- [Emmet](https://github.com/emmetio)
- [ACSS](https://acss.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tachyons](https://tachyons.io/)

## License ##
MIT
