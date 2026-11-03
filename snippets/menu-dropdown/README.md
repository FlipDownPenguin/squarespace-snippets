# Menu Dropdown

A button that opens a small list of links, for use anywhere on a page (not the site header). Opens on click or tap by default, and can also open on mouse hover. Built as a disclosure button with `aria-expanded` and `aria-controls`.

Keyboard support:
- **Enter / Space** on the button opens and closes the menu.
- **↓ / ↑** open the menu and move between links. **Home / End** jump to the first or last link.
- **Esc** closes the menu and returns focus to the button.
- Tabbing out of the menu or clicking outside it closes the menu.

## Install
1. Paste `snippet.css` into **Website → Pages → Custom CSS**, or into **Settings → Advanced → Code Injection → Header** inside `<style>…</style>`.
2. Paste `snippet.js` into **Code Injection → Footer** inside `<script>…</script>`. Code Injection needs a Core plan or higher.
3. Add a **Code Block** where you want the dropdown and paste `snippet.html`. Edit the button label and links.

Options, set on the `.sp-dropdown` element:
- `data-sp-dropdown="hover"` also opens the menu on mouse hover. Touch and keyboard still use click.
- `data-sp-align="right"` aligns the menu to the button's right edge. Use this near the right side of the screen.

## Customize
Override these on `:root` for every dropdown, or on a single `.sp-dropdown` to style just that one.

| Variable | Default | Meaning |
|---|---|---|
| `--sp-dropdown-font` | `inherit` | Font family |
| `--sp-dropdown-font-size` | `1rem` | Base font size |
| `--sp-dropdown-toggle-bg` | `transparent` | Button background |
| `--sp-dropdown-toggle-color` | `currentColor` | Button text color |
| `--sp-dropdown-toggle-padding` | `0.6em 1em` | Button padding |
| `--sp-dropdown-toggle-radius` | `6px` | Button corner radius |
| `--sp-dropdown-toggle-border` | `1px solid currentColor` | Button border |
| `--sp-dropdown-bg` | `#fff` | Menu background |
| `--sp-dropdown-color` | `#161616` | Menu text color |
| `--sp-dropdown-hover-bg` | `#f2f2f2` | Link hover and focus background |
| `--sp-dropdown-accent` | `#161616` | Focus outline color |
| `--sp-dropdown-radius` | `8px` | Menu corner radius |
| `--sp-dropdown-shadow` | `0 10px 30px rgba(0,0,0,.12)` | Menu shadow |
| `--sp-dropdown-width` | `14rem` | Minimum menu width |
| `--sp-dropdown-offset` | `0.4rem` | Gap between button and menu |
| `--sp-dropdown-item-padding` | `0.6em 1em` | Link padding |
| `--sp-dropdown-z` | `1000` | Menu stacking order |
| `--sp-dropdown-speed` | `0.18s` | Open and close animation time (turned off for reduced motion) |

## Squarespace selectors used
None. The snippet only styles its own `sp-` classes. It listens for Squarespace's `mercury:load` event so dropdowns keep working after Ajax page loads.

## Limitations
- This snippet is for dropdowns placed in page content. It does not change the Squarespace header navigation or its folder menus.
- If a parent element has `overflow: hidden`, the open menu is clipped at its edge. If the menu shows behind other blocks, raise `--sp-dropdown-z`.
- The menu doesn't flip on its own when it would run off the screen. Use `data-sp-align="right"` near the right edge.
- Without JavaScript (for example in the Squarespace editor preview, where Code Block scripts may not run), the links show as a plain list under the button.
- One level only. Nested submenus are not supported.
