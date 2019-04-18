# Changelog

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
- Mixin `mlu-mk-gtr` with `$direct="xy"` with `$type = "padding"` or `"margin"`.

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
