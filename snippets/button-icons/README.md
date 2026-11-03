# Button Icons

Adds an icon (arrow, plus, download, external link) after the text of Squarespace buttons. The icon takes the button's text color automatically.

## Install
1. Paste `snippet.css` into **Website → Pages → Custom CSS** (or Code Injection inside `<style>` tags).
2. Wrap the buttons you want in a **Code Block** or section-level wrapper, OR in the Custom CSS add your own selector. The simplest route: add `sp-btn-icons sp-icon-arrow` as classes via a wrapper element around the button block.

## Customize
| Variable | Default | Meaning |
|---|---|---|
| `--sp-icon-size` | `1em` | Icon size |
| `--sp-icon-gap` | `0.5em` | Space between text and icon |
| `--sp-icon-nudge` | `0.25em` | Hover slide distance |

Icon classes: `sp-icon-arrow`, `sp-icon-plus`, `sp-icon-download`, `sp-icon-external`.

## Squarespace selectors used
`.sqs-block-button-element`, `.sqs-button-element--primary`, `.sqs-button-element--secondary` — re-check if Squarespace changes button markup.

## Limitations
Squarespace doesn't let you add classes directly to a button block, so a wrapper (or a section-ID selector in Custom CSS) is needed. TODO: add a small JS helper to tag buttons by their link text.
