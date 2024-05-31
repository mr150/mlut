# My Little UI Toolkit #

<img alt="Logo" src="kss-assets/logo-full.png" style="display:block; margin:16px 0; max-width:350px"/>

[![Build Status](https://travis-ci.com/mr150/mlut.svg?branch=master)](https://travis-ci.com/mr150/mlut)
[![](https://img.shields.io/npm/v/mlut.svg)](https://www.npmjs.com/package/mlut)

Atomic CSS toolkit with Sass and ergonomics for creating styles of any complexity <br> Get almost all power of CSS in one utility!

<img class="D Mb4gg" alt="GIF animation with usage example" src="kss-assets/jit-demo.gif"/>

## Features

<section class="Mb4gg">

### Strong naming convention
❌ **Tailwindcss**:
- `.justify-*`: content, items or self?
- `.flex` => `display: flex`, but `.flex-auto` => `flex: 1 1 auto;`
- `.bg-none` - reset all background? Nope, only `background-image`

❌ **Tachyons**:
- `.br-0` => `border-right-width: 0`, but `.br1` => `border-radius:.125rem`
- `.normal`: line-height, font-weight or letter-spacing?
- `.b`: bottom, border or `display: block`? Nope, it is `font-weight:bold`!

✅ **mlut**:
- `.Jc-c` => `justify-content: center`, `.Js-c` => `justify-self: center`
- `.Bdr` => `border-right: 1px solid`, `.Bdrd1` => `border-radius: 1px`

[One algorithm](https://mr150.github.io/mlut/section-concepts.html#kssref-concepts-naming) for all. If you know CSS, you almost know mlut.
</section>

<section class="Mb4gg">

### Almost arbitrary by design
- [values](https://mr150.github.io/mlut/section-concepts.html#kssref-concepts-values): `.Ml-1/7` => `margin-left: -14.3%`
- [states](https://mr150.github.io/mlut/section-concepts.html#kssref-concepts-states): `Bgc-red200_h,f` => `.Bgc-red200_h\,f:hover, .Bgc-red200_h\,f:focus {...}`
- [at-rules](https://mr150.github.io/mlut/section-concepts.html#kssref-concepts-at_rules): `@:p-c,w>=80r_D-f` => `@media (pointer: coarse), (min-width: 90rem) {...}`

</section>

<section class="Mb4gg">

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

**❌ Tailwindcss:**

- `[@media(any-hover:hover){&:hover}]:opacity-100`
- `text-[color:var(--my-var,#333)]`
- `supports-[margin:1svw]:ml-[1svw]`

**✅ mlut:**
- `@:ah_O1_h` => `@media (any-hover) { .\@\:ah_O1_h:hover { opacity: 1 } }`
- `C-$myVar?#333` => `color: var(--ml-myVar, #333)`
- `@s_Ml1svw` => `@supports (margin-left: 1svw) { .\@s_Ml1svw { margin-left: 1svw } }`

</section>

<section class="Mb4gg">

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

</section>

<section class="Mb4gg">

### And also...
- 💅️ Written in [Sass](https://www.sass-lang.com/) and includes all its benefits
- ⚡ JIT (on-demand) and AOT mods are available
- 🔧 **Fully customizable**: change tokens, utilities names and any settings
- ✨ **Easy to integrate** in existing project. No name collisions with your CSS in the most projects. Increasing specificity in [one line](https://mr150.github.io/mlut/section-settings.html#kssref-settings-utils-other-up_specificity) or for [one](https://mr150.github.io/mlut/section-concepts.html#kssref-concepts-states-special-tu) utility.

</section>

<section class="Mb4gg">

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
</section>

<section class="Mb3gg kss-description">

## Packages ##

<div class="Mt6u">

| Package | Description |
| ---  | --- |
| [@mlut/core](https://github.com/mr150/mlut/blob/master/packages/core) | The mlut core that contains Sass tools, CSS library and JIT engine |
| [mlut](https://github.com/mr150/mlut/blob/master/packages/mlut) | The main package for working with CLI |

</div>
</section>

<section class="Mb4gg">

## What next? ##
- plugins for popular bundlers and frameworks
- first class CSS functions in utilities values
- and much more!

</section>

<section class="Mb4gg">

## Acknowledgement ##
- [CSS](https://www.w3.org/Style/CSS/)
- [Emmet](https://github.com/emmetio)
- [ACSS](https://acss.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tachyons](https://tachyons.io/)

</section>

## License ##
MIT
