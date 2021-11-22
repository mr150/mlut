# Changelog

## 3.2.0 (2020-09-15)

### Fixed
- `background: none` in `btn` block.
- Moved import of `btn` and `inp` blocks before `row` block.
- Internal links in documentation.

### Added
- `.editorconfig`
#### New utilities
- Position: `T100p`, `R100p`, `B100p`, `L100p`
- Position: `Pos-s`, `mX0`, `mY0`
- Visual formatting: `V`
- Flex: `Fxd-cr`
- Text: `Td-o`, responsive `Ta`, `Ta-c`, `Ta-r`

### Changed
- Iteration of elements in `init.js`.
- Info about toolkit usage in documentation.

### Removed
- Android <4.4.4 from `browserslist`.
- `Td-o` utility from `core-extend` module.

## 3.1.0 (2019-10-11)

### Fixed
- [Bug](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/15637241/) of calculating the grid columns width with `calc()` in Edge 16-18
- Regexes in `init.js` for `js` and `nojs` states

### Added
- Gulp task for uploading to ftp
- Utilities values: `D-g` responsive and `Fxw-w` on xs

## 3.0.0 (2019-09-20)

### Breaking changes
- Changed concept and file structure of project.
- Updated `gulpfile.js` for working with Gulp 4.
- Changed `$mlu-main-directions` from list to map.
- Removed utilities values in `gs` unit from default distributive.
- Removed `P` and `M` utils values that can be implemented with the `-Gg` utility.
- Removed `$MLU-FLAG-COL-MARGIN` and utils values in `gc` unit.
- Added `$MLU-FLAG-FLEX-PE` and hid behind it styles for flexbox progressive enhancement.
- Removed `$MLU-FLAG-EXTENDED` and styles from under it are moved to the `core-extend` module.
- Renamed settings `$mlu-font-family` and `$mlu-font-family-mono` to `$mlu-Ff-ss0` and `$mlu-Ff-m0`.
- Moved part of the mixins to the `styling-helpers` module.
- Renamed `grid.scss` to `layout.scss`.
- Replaced `W-fx0` to `Maw-fx0`.
- Removed `page` block.
- Renamed `input` block to `inp`.

### Added
- Mixins to create utils: `mlu-mk-util`, `mlu-mk-util-directions` and wrappers over them.
- Utilities states concept and mixin `mlu-mk-state` to create them.
- Modules layer concept and some modules: `styling-helpers` and `core-extend`.
- Added core script `init.js` that implements `nojs` and `js` states for utilities.
- New grid system on custom properties with the ability to change the columns number and gutters sizes.
- Concept custom utilities.
- CSS custom property `--mlu-grid-cols` for columns count in grid system.
- Variable columns units based on custom properties, that can behave like `gc` and like `gs`.
- `mlu-check-class` function.
- Several functions-getters from maps with utilities values.
- Ability to compile multiple SCSS files.
#### New utilities
- Custom: `-Gcc`, `-Gcd`, `-Gcr`, `-Gg` responsive
- Flex: `Ac`, `Ai`, `Fx-i`, `Fxd`, `sp_D-f`, `As` values 
- Box sizing: `Mih100vh`, `Mih100p`, `W100p`, `W-i`, `M-i`
- `W` and `Ml` values for new grid system
- Text: `Tt-l`, `Tt-c`, `Whs-p`
- `Ff-ss0`
- `Trs-all`
- `Rsz-n`

### Fixed
- Bottom gutter in `row__col` to rem.
- Calc fallback in `mlu-mk-gtr` with `$direct = 'xy'`.

### Changed
- Rethought the concept of themes and added `demo-theme` as an example.
- Regrouped utilities according to rational order.
- `grid-debug` block for work with new grid system.
- Most utilities are created using new mixins.

## 2.0.1 (2019-04-18)

### Fixed
- Deleted tests.scss file, which by mistake got into the npm package.

### Changed
- Npm package tags.

## 2.0.0 (2019-04-17)

### Breaking changes
- Removed utilities values in `gc`(grid-columns) unit from default distributive. They can be turn on using the `$MLU-FLAG-COL-MARGIN` flag.
- Changed gutters in `row__col` from `margin` to `padding`.
- Hidden behind the flag `Mx1gg` and responsive `Ml1gg` needed for `row__col` with `margin` gutter.
- Changed default unit to `gs` in `mlu-W` mixin.
- Renamed `W-card` to `W-fx0`.
- Renamed `P8` to `P2su`.
#### Renamed mixins and functions
- `mlu-restore-outline` to `mlu-restore-Ol`.
- `mlu-generate-gutter` to `mlu-mk-gtr`.
- `mlu-breakpoint` to `mlu-bp`. Changed accordingly `mlu-breakpoint-next`, `mlu-breakpoint-prev` etc.
- `mlu-clearfix` to `mlu-Cl`.
- `mlu-grid-gutter` to `mlu-grid-gtr`.
- `mlu-mods-from-sprite` to `mlu-sprite-mods`.
- `mlu-icon` to `mlu-sprite-icon`.

### Fixed
- `Pl` and `Pr` utils.
- Gutter in `mlu-row-col` mixin.
- Mixin `mlu-mk-gtr` with `$direct='xy'` with `$type = 'padding'` or `'margin'`.

### Changed
- Columns count on `xs` from 2 to 4.
- Updated info about utilities naming in documentation.
- All gutters in blocks and utils are now implemented using CSS custom properties with fallback.

### Removed
- `Bd0` utility.
- `mBgp-c`.
- Too old browsers from `.browserslist`.
- Calc fallback from all blocks and utils.

### Added
- CSS custom property `--mlu-gg` for `gg`(grid-gutter) unit.
- This changelog.
- Mixins `mlu-bp-all` and `mlu-ie11-Ai-c`.
- Utilities for creating borders.
- Utilities for the background image management.
- Several values of `Px`, `Mx` and `Mb` to implement the gutters of different sizes.
- Variable `$mlu-grid-cols-xs` for setting of columns count on `xs`.
#### New utilities
- `Pos-a` responsive
- `Mb2gg` responsive
- `P1su..P4su`
- `Px0` only responsive
- `Px1gg` responsive
- `Pt2gg`, `Pb2gg`
- `Lh1`
- `mV-vh` responsive

## 1.1.0 (2019-03-13)

### Fixed
- `W-a` on breakpoints
- calc fallback in `mlu-generate-gutter`

### Changed
- font styles of `input` block

### Removed
- `color: transparent` from `mFz0`
- irrelevant rules from `.stylelintrc`

### Added
- space units of measure(su)
- some [utilities values](/mr150/mlut/commit/abe5dfc74876b8948f3908f8b61397254abeac1b)
- some margins in su
- responsive `Mb0`
#### New utilities
- `Whs-nw`
- `Ovy-a`, `Ovx-a` with examples
- `Op0`
- `Ol0`
- `Ord` with `$mlu-Ord-range`
