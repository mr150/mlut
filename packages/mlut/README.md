# My Little UI Toolkit #

<img alt="Logo" src="https://github.com/mr150/mlut/raw/master/docs/img/logo-full.png" width="350"/>

[![Build Status](https://travis-ci.com/mr150/mlut.svg?branch=master)](https://travis-ci.com/mr150/mlut)
[![](https://img.shields.io/npm/v/mlut.svg)](https://www.npmjs.com/package/mlut)

Atomic CSS toolkit with Sass and ergonomics for creating styles of any complexity. <br> Get almost all power of CSS in one utility!

## Table of Contents

- [Features](#features)
	- 🔠 [Strong naming convention](#strong-naming-convention)
	- 🎨 [Almost arbitrary by design](#almost-arbitrary-by-design)
	- ✋ [Great ergonomics](#great-ergonomics)
	- 🧩 [Handy extension](#handy-extension)
	- 👀 [And also...](#and-also)
- [Structure](#structure)
	- [Library](#library)
	- [Tools](#tools)
	- [Addons](#addons)
- [Packages](#packages)
- [Getting Started](#getting-started)
	- [Installation](#installation)
	- [Usage](#usage)
- [Documentation](#documentation)
- [What next](#what-next)
- [Acknowledgement](#acknowledgement)
- [License](#license)

<img alt="GIF animation with usage example" src="https://github.com/mr150/mlut/raw/master/docs/img/jit-demo.gif"/>

## Features

### Strong naming convention
❌ **Tailwindcss**:
- `justify-*`: content, items or self?
- `flex` => `display: flex`, but `flex-auto` => `flex: 1 1 auto;`
- `bg-none` - reset all background? Nope, only `background-image`

❌ **Tachyons**:
- `br-0` => `border-right-width: 0`, but `br1` => `border-radius:.125rem`
- `normal`: line-height, font-weight or letter-spacing?
- `b`: bottom, border or `display: block`? Nope, it is `font-weight:bold`!

✅ **mlut**:
- `Jc-c` => `justify-content: center`, `Js-c` => `justify-self: center`
- `Bdr` => `border-right: 1px solid`, `Bdrd1` => `border-radius: 1px`

[One algorithm](https://mr150.github.io/mlut/section-concepts.html#kssref-concepts-naming) for all. If you know CSS, you almost know mlut.

### Almost arbitrary by design
- [values](https://mr150.github.io/mlut/section-concepts.html#kssref-concepts-values): `.Ml-1/7` => `margin-left: -14.3%`
- [states](https://mr150.github.io/mlut/section-concepts.html#kssref-concepts-states): `Bgc-red200_h,f` => `.Bgc-red200_h\,f:hover, .Bgc-red200_h\,f:focus {...}`
- [at-rules](https://mr150.github.io/mlut/section-concepts.html#kssref-concepts-at_rules): `@:p-c,w>=80r_D-f` => `@media (pointer: coarse), (min-width: 90rem) {...}`

### Great ergonomics
Shorter class names:
```html
<!-- Example from https://www.shopify.com/ -->

<!-- Tailwindcss -->
<div class="hidden md:block md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8 pb-6 relative md:max-h-[130vh] reduced-motion:translate-y-0 will-change-transform duration-1000 ease-in-out transition-all reduced-motion:opacity-100">...</div>

<!-- mlut -->
<div class="D-n md_D md_Gc-s1 md_Gcs7 lg_Gc-s5 lg_Gcs8 Pb6u Ps md_Mxh130vh Tf @:pfrm_-Try0 Wlc-tf Tsd1s Tstf-eio Ts-all @:pfrm_O1">...</div>
```
Convenient syntax for complex values, states and at-rules. It is like Vim for CSS.
#### ❌ Tailwindcss:
- `[@media(any-hover:hover){&:hover}]:opacity-100`
- `text-[color:var(--my-var,#333)]`
- `supports-[margin:1svw]:ml-[1svw]`

#### ✅ mlut:
- `@:ah_O1_h` => `@media (any-hover) { .\@\:ah_O1_h:hover { opacity: 1 } }`
- `C-$myVar?#333` => `color: var(--ml-myVar, #333)`
- `@s_Ml1svw` => `@supports (margin-left: 1svw) { .\@s_Ml1svw { margin-left: 1svw } }`

### Handy extension
Add utilities, states and custom at-rules with few lines of code
```scss
@use 'mlut' as ml with (
  // add utilities
  $utils-data: (
    'utils': (
      'registry': (
        'Mil': margin-inline,
        'Ir': (
          'properties': image-rendering,
          'keywords': (
            'p': pixelated,
          ),
        ),
      ),
    ),
  ),

  // add states
  $utils-config: (
    'states': (
      'custom': (
        'are': '[aria-expanded=“true”]',
      ),
    ),
  ),
);

@include ml.apply('Mil-15_-are Ir-p');

// CSS

.Mil-15_-are[aria-expanded=“true”] {
  margin-inline: -15px;
}

.Ir-p {
  image-rendering: pixelated;
}
```

### And also...
- 💅️ Written in [Sass](https://www.sass-lang.com/) and includes all its benefits
- ⚡ **JIT** (on-demand) and **AOT** mods are available
- 🔧 **Fully customizable**: change tokens, utilities names and any settings
- ✨ **Easy to integrate** in existing project. No name collisions with your CSS in the most projects. Increasing specificity in [one line](https://mr150.github.io/mlut/section-settings.html#kssref-settings-utils-other-up_specificity) or for [one](https://mr150.github.io/mlut/section-concepts.html#kssref-concepts-states-special-tu) utility.

## Structure ##
- Sass tools
- opt-in CSS library
- Sass addons
- JIT engine

### Library ###
The library part of toolkit consists of:

- base styles - variables and generic CSS like reset, normalize etc.
- helpers - similar to utilities: the same universal, but more complex and can consist of several CSS rules

The library is **modular** and you can include only what you need

### Tools ###
Sass tools include:

- settings based on which the everything works 
- mixins and functions with which you can generate utilities and write styles

### Addons ###
Addons may contains any tools, settings and styles. Addons now at the **preview** stage and in the future be moved to separate packages

## Packages ##

| Package | Description |
| ---  | --- |
| [@mlut/core](https://github.com/mr150/mlut/blob/master/packages/core) | The mlut core that contains Sass tools, CSS library and JIT engine |
| [mlut](https://github.com/mr150/mlut/blob/master/packages/mlut) | The main package for working with CLI |

## Getting Started ##
There are 2 ways to start using mlut:

- assembled distributive
- toolkit

### Installation ###

#### NPM ####
```
npm i mlut -D
```

#### CDN ####

CSS only with demo theme:
```html
<link href="https://unpkg.com/mlut@latest/dist/mlut-demo-theme.min.css" rel="stylesheet">
```

### Usage ###

#### Distributive ####

You can get assembled mlut code and include it to your project. There are some ways to get a distributive.

- just plug in with CDN
- if used `npm`, files are in `node_modules/mlut/dist/`

Add the files to your page like here:
```html
<link href="css/mlut-demo-theme.min.css" rel="stylesheet">
```
And just use classes in the markup:
```html
<div class="D-g Gtc-t3">
  <div class="Bd P2u">
    <h3>Simple text</h3>
```

#### Toolkit ####
You can use the toolkit in 2 modes

- **JIT**: generate utilities on demand. The JIT engine scans your markup and generates only the utilities you use. This is current and recommended mode of working with mlut. Here you can use our CLI or a plugin for bundlers
- **AOT**: generate utilities using Sass tools only. You specify in the Sass configuration what utilities you want and the generator creates them (usually more than you need). This is legacу mode, but it is still working and supported. We have no plans to deprecate it for now

CLI for the JIT mode:
```
Usage:
  mlut [-i input.scss] [-o output.css] [--watch] [options...]

Options:
  -h, --help            Print this help message
  -i, --input           Input sass file
  -o, --output          Output css file
  -w, --watch           Watch for changes and rebuild as needed
  -m, --minify          Generate minified css file
      --content         Paths to content with markup
      --no-merge-mq     Prevent merging of css media queries during minification
```

In the input sass file, you can customize mlut and write your own styles. Input file is optional, but if you use it, you must import mlut
```scss
@use 'mlut' with (
  $breakpoints: (
    'xxl': 1600px,
  ),
  $colors: (
    'red0': #f20,
  ),
);

.complex-block {
  // CSS
}
```
You can add the JIT options here too. Options must be a **valid JSON**, but single quotes is allowed. Paths will be resolved relative to the JIT engine working directory
```scss
@use 'mlut' with (
  $jit: (
    'output': 'src/assets/css/style.css',
    'content': [
      'src/**/*.ejs', 'src/assets/js/*.js'
    ]
  ),
);
```
To start the build process:
```
npx mlut -i src/assets/sass/style.scss -w
```
Add the compiled CSS to your page and use mlut utils!
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="/assets/css/style.css" rel="stylesheet">
  </head>
  <body class="M0">
    <h1 class="C-red Fnw800 P2u">
      Lorem Ipsum
    </h1>
  </body>
</html>
```

## Documentation ##
Available [here](https://mr150.github.io/mlut/) or can be run locally. Documentation is included in this repo and is generated using [KSS-node](https://github.com/kss-node/kss-node) from the comments in the sources

## What next? ##
- plugins for popular bundlers and frameworks
- first class CSS functions in utilities values
- and much more!

## Acknowledgement ##
- [CSS](https://www.w3.org/Style/CSS/)
- [Emmet](https://github.com/emmetio)
- [ACSS](https://acss.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tachyons](https://tachyons.io/)

## License ##
MIT
