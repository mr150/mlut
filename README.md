# My little UI toolkit
Responsive, simple and lightweight toolkit with progressive enhancement for website UI development. MLUT united in itself the [BEM](https://ru.bem.info/) and [Atomic CSS](https://acss.io/) methodologys.

## Structure ##
- BEM blocks
- CSS utilities
- Developer tools

For now MLUT contains only Sass tools and CSS.

### Concept ###
The library part of toolkit consists of 3 layers:

- Core - all that can be used at each website
- Theme - something that is only used in specific theme. Theme can be used on different sites
- Design - parts of UI for a specific website

Each layer consists of BEM blocks and utilities. For more information read [documentation](#documentation)

### Technologies ###
- [LibSass](https://github.com/sass/libsass)
#### Assembly ####
- [Gulp](https://github.com/gulpjs/gulp)
- [Clean-css](https://github.com/jakubpawlowicz/clean-css)
- [Autoprefixer](https://github.com/postcss/autoprefixer)
- [group-css-media-queries](https://github.com/Se7enSky/group-css-media-queries)
- [Rigger](https://github.com/buildjs/rigger)
- [UglifyJS](https://github.com/mishoo/UglifyJS2)

### Supported browsers ###
- Desktop
	- Firefox
	- Chrome
	- Safari
	- Opera
	- Edge
	- IE9+
	- partial IE8
- Mobile
	- Android 4+
	- IOS

## Getting Started
There are 2 ways to start using MLUT:

- assembled dist
- developer toolkit

### Installation ###
#### Git ####
```
git clone https://MrZidan150@bitbucket.org/MrZidan150/mlut-lib.git
cd mlut-lib
```

#### NPM ####
```
npm install bitbucket:mrzidan150/mlut-lib
```

#### CDN ####
Comming soon.

### Usage ###
#### Dist ####
You can get assembled MLUT code and include it to your project. There are some ways to get a dist:

- if used `git clone` files are located in the `dist/` folder
- if used `npm` files are in `node_modules/mlut/dist/`

Then link file to your page:
``` html
<link href="css/mlut.min.css" rel="stylesheet">
```
And just add MLUT classes to markup:
``` html
<div class="row D-f">
	<div class="row__col W3gc_md">
		<h3>Simple text</h3>
```

#### Toolkit ####
To use all MLUT features you need an assembly. There are 3 ways:

- If you don't want to develop MLUT, it's recommended to use [MLUT project template](https://bitbucket.org/MrZidan150/mlut-project/)
- [Clone](#git) this repo and use configured assembly from it
- Setup assembly yourself use [technologies list](#technologies)

##### Styles #####
Once the assembly is configured, import sass tools and settings to your `style.scss`
``` scss
@import "includes/settings";
@import "includes/functions";
@import "includes/mixins";
```
Then you can import blocks, utilities and use sass tools:
```scss
@import "../core-blocks/wrapper/wrapper";
@import "../core-utils/display";

@include mlu-bpm($mlu-bp-md) {
	.input--common {
		padding: mlu-px2em(16px) 16;
	}
}
```

## Documentation ##
Coming soon.

## License ##
MIT
