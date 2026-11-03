# Button Icons

Adds an icon (arrow, plus, download, external link) after a button's text, chosen **per button**. The icon takes the button's text color and moves slightly on hover and keyboard focus.

## Install
1. Paste `snippet.css` into **Website → Pages → Custom CSS**.
2. Paste `install.html` (the gallery's **Copy JS** button) into **Settings → Advanced → Code Injection → Footer** (needs a Core plan or higher). It's the complete script block, with the setting already on the tag:
   ```html
   <script data-sp-buttons="Get started: arrow, Add to cart: plus, *: arrow">
     …
   </script>
   ```
3. Change the `data-sp-buttons` value to your own buttons, e.g. `"Get started: arrow, /brochure.pdf: download, https://partner.com: external"`.
4. Save and view the site in a new tab. The script doesn't run inside the editor.

How `data-sp-buttons` works:
- Each entry is `button text: icon` or `link URL: icon`, separated by commas. Matching is not case sensitive.
- Match by text using the words you typed in the button block, not the uppercase style some themes apply. If the text contains a comma, match by its link URL instead.
- URLs can be a path (`/contact`) or a full link (`https://…`), and must match the button's link exactly.
- `*: arrow` gives every other button an arrow. `Learn more: none` leaves one out.
- `plain` leaves a button out of the [button-styles](../button-styles/README.md) snippet: `Get started: plain`, or with an icon, `Get started: arrow plain`.
- Buttons that aren't listed stay unchanged.

**Buttons you write yourself** (in a Code Block) don't need the script. Add the attribute directly:
```html
<a class="your-button" href="/contact" data-sp-icon="arrow">Contact</a>
```

## Customize
Settings for each button:

| Setting | Where | Values |
|---|---|---|
| `data-sp-buttons` | the `<script>` tag | `text or URL: icon`, comma separated; add `plain` to skip button-styles |
| `data-sp-icon` | a button you write yourself | `arrow`, `plus`, `download`, `external` |

CSS variables, set on `:root` or on one button:

| Variable | Default | Meaning |
|---|---|---|
| `--sp-icon-size` | `1em` | Icon size |
| `--sp-icon-gap` | `0.5em` | Space between text and icon |
| `--sp-icon-nudge` | `0.25em` | How far the icon moves on hover (the plus icon rotates instead) |

## Squarespace selectors used
`.sqs-block-button-element`, the link inside every Squarespace button block. Checked against a live 7.1 site in November 2026. Re-check it if icons stop appearing.

## Limitations
- Squarespace doesn't let you add attributes to button blocks, so their icons need the Code Injection script, which needs a Core plan or higher. Without it, only buttons in Code Blocks can have icons.
- Renaming a button or changing its link means updating `data-sp-buttons` to match.
- The button becomes `inline-flex` so the icon lines up with the text. Check that very long button labels still wrap the way you want.
- Header and announcement-bar buttons aren't Squarespace button blocks and are not matched.
- **Changed from the earlier version:** the wrapper classes `sp-btn-icons` and `sp-icon-*` are gone. Use `data-sp-buttons` or `data-sp-icon` instead.
