# My Little UI Toolkit #
Toolkit for quick development of lightweight, easily changeable and mobile-first website UI with progressive enhancement.

## Structure ##
- BEM blocks
- CSS utilities
- Developer tools

For now MLUT contains Sass tools and CSS library.

### Concept ###
The library part of toolkit united in itself ideas from [Atomic CSS](https://acss.io/) and [BEM](https://bem.info/). It consists of 2 layers:

- Core - all that can be used at each website. This layer contains BEM blocks and CSS utilities.
- Theme - something that is only used in specific theme. Theme can be used on different sites. This layer may contain utilities, scripts, styles and components with BEM naming.

You can added third 'design' layer - parts of UI for a specific website. It may also contain utilities and components.

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
	- partial IE8
- Mobile
	- Android 4.2+
	- IOS
