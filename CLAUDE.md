# Squarespace Snippets Library

A library of reusable, customizable code snippets for Squarespace 7.1 sites (CSS/JS/HTML), with a live preview gallery.

## Structure
- `snippets/<slug>/` — one folder per snippet:
  - `snippet.css`, `snippet.js` (optional), `snippet.html` (optional markup to paste in a Code Block)
  - `demo.html` — standalone preview (links the snippet files with relative paths)
  - `README.md` — what it does, install steps, customization options
  - `install.html` — **generated, don't edit**. For snippets with JS: the complete `<script>` block to paste into Code Injection, with `<script> tag` options filled in from their `example`. The gallery's "Copy JS" button copies this.
  - `meta.json` — `{ "slug", "title", "description", "tags": [], "requires": "css|css+js", "install": "code-injection|code-block|custom-css", "options": [] }`
    - `options` lists every setting a user can change, one object each:
      `{ "name", "type": "attribute|css-variable", "on": "where it goes", "values": [] (optional), "default": value or null, "required": true (optional), "example": "…" (required when "on" is "<script> tag"), "description" }`
    - `snippet.js` must not contain `</script` anywhere (even in comments), or `install.html` would break; the build checks this.
    - Internal state attributes (e.g. `data-sp-open`, `data-sp-ready`) are not options.
- `index.html` — gallery. Reads `snippets.json` and shows every demo in an iframe with a copy-code button.
- `snippets.json` — generated list of all `meta.json` files. Run `node scripts/build-index.js` after adding or editing a snippet; it also regenerates every `install.html`. It refuses to write if `options` don't match the snippet files (unknown names, CSS defaults that differ, `:root` variables left out).
- `_template/` — copy this to start a new snippet.

## Rules for every snippet
1. **Prefix everything** with `sp-` (classes, IDs, CSS variables, data attributes) so nothing collides with Squarespace.
2. **Customize via CSS variables**, declared on `:root` or the snippet's root class with sensible defaults. Never hardcode colors, fonts, sizes, or radii. Example: `--sp-accent`.
3. **Opt-in activation**: snippets apply only to elements the user marks (a class or `data-sp-*` attribute), never globally to all buttons/menus/lists. Per-element choices follow one pattern:
   - Markup the user writes (Code Blocks): a `data-sp-*` attribute on the element itself, e.g. `data-sp-icon="arrow"`.
   - Elements Squarespace generates (button blocks, header nav), which can't take attributes: the snippet's JS reads a `data-sp-*` attribute on its own `<script>` tag, e.g. `<script data-sp-buttons="Get started: arrow">`. Entries are comma separated, matched by visible text or URL, not case sensitive; `*` means "all others". The JS then sets the per-element attribute, so the CSS only ever reads `data-sp-*` on the element.
4. **Target Squarespace 7.1** (Fluid Engine). Prefer stable hooks (`.sqs-block-button-element`, `[data-section-id]`, `header`) and note any Squarespace selectors a snippet depends on in its README so they are easy to re-check.
5. **JS**: vanilla only, wrapped in an IIFE, no dependencies, safe to run twice, and re-initialize on Squarespace's `mercury:load` event and `DOMContentLoaded`. Respect `prefers-reduced-motion`.
6. **Responsive and accessible**: works at mobile width, keyboard focus visible, correct ARIA where relevant.
7. Every snippet needs a `demo.html` and a `README.md` with: install steps, a customization table (variable, default, meaning), and known limitations.
8. Keep snippets small and single-purpose.
