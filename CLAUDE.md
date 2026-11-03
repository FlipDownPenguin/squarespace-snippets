# Squarespace Snippets Library

A library of reusable, customizable code snippets for Squarespace 7.1 sites (CSS/JS/HTML), with a live preview gallery.

## Structure
- `snippets/<slug>/` — one folder per snippet:
  - `snippet.css`, `snippet.js` (optional), `snippet.html` (optional markup to paste in a Code Block)
  - `demo.html` — standalone preview (links the snippet files with relative paths)
  - `README.md` — what it does, install steps, customization options
  - `meta.json` — `{ "slug", "title", "description", "tags": [], "requires": "css|css+js", "install": "code-injection|code-block|custom-css" }`
- `index.html` — gallery. Reads `snippets.json` and shows every demo in an iframe with a copy-code button.
- `snippets.json` — generated list of all `meta.json` files. Run `node scripts/build-index.js` after adding or editing a snippet.
- `_template/` — copy this to start a new snippet.

## Rules for every snippet
1. **Prefix everything** with `sp-` (classes, IDs, CSS variables, data attributes) so nothing collides with Squarespace.
2. **Customize via CSS variables**, declared on `:root` or the snippet's root class with sensible defaults. Never hardcode colors, fonts, sizes, or radii. Example: `--sp-accent`.
3. **Opt-in activation**: snippets apply only to elements the user marks (a class or `data-sp-*` attribute), never globally to all buttons/menus/lists.
4. **Target Squarespace 7.1** (Fluid Engine). Prefer stable hooks (`.sqs-block-button-element`, `[data-section-id]`, `header`) and note any Squarespace selectors a snippet depends on in its README so they are easy to re-check.
5. **JS**: vanilla only, wrapped in an IIFE, no dependencies, safe to run twice, and re-initialize on Squarespace's `mercury:load` event and `DOMContentLoaded`. Respect `prefers-reduced-motion`.
6. **Responsive and accessible**: works at mobile width, keyboard focus visible, correct ARIA where relevant.
7. Every snippet needs a `demo.html` and a `README.md` with: install steps, a customization table (variable, default, meaning), and known limitations.
8. Keep snippets small and single-purpose.
