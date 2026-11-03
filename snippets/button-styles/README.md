# Button Styles

Restyles **every** Primary, Secondary and Tertiary button block on the site: size, corner radius and hover effect. This snippet is intentionally global. Colors and fonts are never set, so your **Site Styles keep controlling both**. Every line, mark and tint is drawn in the button's own text color.

Hover effects, chosen separately for each button type:
- fill sliding in from the bottom, top, left or right
- corner marks
- underline grow
- lift and shadow
- fade (a tint of the text color)
- scale

Each type can also have, at rest:
- corner marks
- a hairline border
- a transparent fill

The **corner marks + tint** look is a preset in the configurator. It uses a transparent fill, a 1px border and 6px corner marks, with a 10% tint fading in over 0.3s on hover.

## Install
1. Open `configurator.html` (the gallery's **Configure** button) and choose your settings. The preview shows the exact CSS you'll copy. Use the preview colors to match your site. They aren't part of the output.
2. Click **Copy CSS** and paste into **Website → Pages → Custom CSS**.

The gallery's plain **Copy CSS** button gives the default settings (the same as `snippet.css`).

**Leaving one button unstyled:** this uses the [button-icons](../button-icons/README.md) script. Add `plain` to that button's entry in `data-sp-buttons`. For example, `data-sp-buttons="Get started: plain"` leaves it unstyled, and `Get started: arrow plain` gives it an icon but no styling.

## Customize
All settings are chosen in the configurator, which writes the values straight into the CSS. There are no CSS variables to edit afterwards.

| Setting | Default | Meaning |
|---|---|---|
| Size | Site Styles | Padding (Y and X) and min height for Small, Medium and Large buttons, in px |
| Corner radius | Site Styles | Radius for all buttons, in px |
| Hover effect (per type) | Primary: fade, Secondary: fade, Tertiary: underline grow | See the list above, or none |
| Corner marks (per type) | Secondary only | L-shaped marks at the four corners |
| Hairline border (per type) | Secondary only | Border in the text color at tint strength |
| Transparent fill (per type) | off | Removes the button's fill. Only use it if the text color is readable on your page |
| Corner mark size | `6px` | Length of each arm of a corner mark |
| Line thickness | `1px` | Corner marks, underline and hairline border |
| Tint strength | `10%` | Fill, fade and hairline border, as a share of the text color |
| Speed | `300ms` | Transition time |
| Easing | `ease` | `ease`, `ease-out`, `ease-in-out`, `linear`, `smooth`, `snappy` |

## Squarespace selectors used
Checked against a live Squarespace 7.1 site in November 2026:
- `#siteWrapper`
- `.sqs-block-button-element` and its size classes `--small`, `--medium`, `--large`
- `.sqs-button-element--primary`, `--secondary`, `--tertiary`
- `body.tweak-global-animations-animation-type-flex`, the Flex site animation

Squarespace sets button padding at `#siteWrapper.site-wrapper` strength. The snippet starts every selector with `#siteWrapper` so it wins without `!important`.

## Limitations
- **The Flex site animation** (Site Styles → Animations → Flex) draws its own button hover using `::before` and swaps the text color. On Flex sites, this snippet leaves hover, fills, the hairline border and the transparent fill to Squarespace. Sizes, corner radius and corner marks still apply. Choose another animation style to use this snippet's hover effects.
- **The hairline border and the fill or fade share one strength.** Without `color-mix()`, which Squarespace's LESS compiler can't handle, the only way to get "10% of the text color" is one layer drawn at 10% opacity. Both live on that layer.
- **Lift and shadow** uses a neutral black shadow at 18% opacity. It's the only color the snippet sets. Pick another effect if you don't want it.
- Corner marks are drawn on the button's corners, so on rounded or pill buttons they're clipped by the curve. They're designed for square or slightly rounded corners.
- In Fluid Engine, buttons fill their grid cell and Squarespace forces vertical padding to 0. There, min height still works but vertical padding doesn't.
- Your own Custom CSS that sets button padding, radius or background with `!important` will still win over this snippet. Remove those rules, or the `!important`.
- Applies to button blocks and to list-section buttons, which use the same classes. Form, product, newsletter and header buttons aren't changed.
- Hover effects only run on devices that can hover. Keyboard focus shows the same effect. Reduced motion turns the animations off.
- Squarespace turns off transitions on buttons inside animated blocks with `!important`. The snippet's button transitions use `!important` to keep the hover motion.
