# Header Folder Menu

Upgrades the desktop dropdowns of the **header folders you choose**. Other folders stay as Squarespace draws them.

- **Look:** rounded, shadowed menu with padded links and a hover background. By default it uses your header's own background and link colors.
- **Motion:** fades and slides in instead of popping. This is turned off for visitors who prefer reduced motion.
- **Hover:** waits a moment before closing, so the menu doesn't vanish when the mouse slips off. Clicking the folder title also opens and closes it.
- **Keyboard:** **↓ / ↑** open the menu and move between links, **Home / End** jump to the first or last link, **Esc** closes and returns focus to the title. Tabbing out or clicking elsewhere closes it.

Squarespace's own keyboard handling (Enter, Space, Esc and `aria-expanded`) is kept. The snippet follows it rather than replacing it.

## Install
1. Paste `snippet.css` into **Website → Pages → Custom CSS**.
2. Paste `install.html` (the gallery's **Copy JS** button) into **Settings → Advanced → Code Injection → Footer** (needs a Core plan or higher). It's the complete script block, with the setting already on the tag:
   ```html
   <script data-sp-folders="Services, Shop">
     …
   </script>
   ```
3. Change the `data-sp-folders` value to your own folder names.
4. Save and view the site in a new tab. Folder menus often don't update inside the editor preview.

`data-sp-folders` takes folder titles or URL slugs, comma separated, not case sensitive. For example, `"Services, /shop"`. Use `"*"` for every folder. Without this attribute the snippet does nothing.

## Customize
Override these on `:root` in Custom CSS. For example: `:root { --sp-folder-radius: 0; --sp-folder-bg: #111; --sp-folder-color: #fff; }`.

| Variable | Default | Meaning |
|---|---|---|
| `--sp-folder-bg` | your header's background | Menu background |
| `--sp-folder-color` | your header's link color | Link color |
| `--sp-folder-hover-bg` | `rgba(127,127,127,.12)` | Link hover and focus background |
| `--sp-folder-accent` | `currentColor` | Focus outline color |
| `--sp-folder-radius` | `8px` | Menu corner radius |
| `--sp-folder-shadow` | `0 10px 30px rgba(0,0,0,.12)` | Menu shadow |
| `--sp-folder-padding` | `0.4rem` | Space inside the menu edge |
| `--sp-folder-item-padding` | `0.55em 0.9em` | Link padding |
| `--sp-folder-item-radius` | `4px` | Link hover-highlight radius |
| `--sp-folder-min-width` | `200px` | Minimum menu width |
| `--sp-folder-offset` | `0.5rem` | Gap between the folder title and the menu |
| `--sp-folder-z` | `1000` | Menu stacking order |
| `--sp-folder-speed` | `0.18s` | Fade and slide time |
| `--sp-folder-close-delay` | `250ms` | Wait before closing after the mouse leaves |

## Squarespace selectors used
Checked against a live Squarespace 7.1 site in November 2026. Re-check these if the snippet stops working:

- `.header`, `.header-nav`, `.header-nav-item--folder`
- `button.header-nav-folder-title` with `aria-expanded`, `aria-controls` and `data-href`
- `.header-nav-folder-title-text`, `.header-nav-folder-content`, `.header-nav-folder-item`
- `[data-header-style]` and the theme variables `--siteBackgroundColor`, `--solidHeaderBackgroundColor`, `--gradientHeaderBackgroundColor`

## Limitations
- **Desktop header only.** The mobile menu (`.header-menu`) works differently and is left alone.
- Needs the current folder markup, where the folder title is a `<button>`. Older sites where it's a link (`a.header-nav-folder-title`) are skipped and keep the default menu.
- Custom CSS using `!important` on `.header-nav-folder-content` (for example a background color) will still win over these variables.
- Folder title matching uses the visible title text. If you rename a folder, update `data-sp-folders`.
- The menu doesn't flip on its own to fit near the edge of the screen. Squarespace's own left and right alignment is kept.
