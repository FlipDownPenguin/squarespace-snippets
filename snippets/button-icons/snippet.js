/* Button Icons — gives Squarespace button blocks their own icon.
   Install with install.html: the ready-to-paste script block with data-sp-buttons on it.
   Example: data-sp-buttons="Get started: arrow, /brochure.pdf: download"
   Each entry is "button text or link URL: icon", comma separated. Not case sensitive.
   Icons: arrow, plus, download, external, or none. "*: arrow" applies to every other button.
   Add "plain" to leave that button out of button-styles: "Get started: plain" or "Get started: arrow plain".
   Safe to run twice; re-runs on DOMContentLoaded and Squarespace's mercury:load. */
(function () {
  'use strict';

  var BUTTONS = '.sqs-block-button-element';
  var ICONS = ['arrow', 'plus', 'download', 'external', 'none'];
  var STYLES = ['plain']; // per-button override for global snippets (button-styles), set as data-sp-style

  function norm(text) {
    return String(text || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function cleanUrl(url) {
    return norm(url).replace(/\/+$/, '');
  }

  function rules() {
    var script = document.querySelector('script[data-sp-buttons]');
    if (!script) return [];
    return script.getAttribute('data-sp-buttons').split(',').map(function (entry) {
      var i = entry.lastIndexOf(':'); // last colon, so URLs like https://… still work
      if (i < 0) return null;
      var match = norm(entry.slice(0, i));
      if (!match) return null;
      var icon = null, style = null, ok = true;
      norm(entry.slice(i + 1)).split(' ').forEach(function (word) {
        if (ICONS.indexOf(word) > -1) icon = word;
        else if (STYLES.indexOf(word) > -1) style = word;
        else {
          ok = false;
          if (window.console) console.warn('[sp-button-icons] Unknown setting "' + word + '" for "' + match + '". Use: ' + ICONS.concat(STYLES).join(', '));
        }
      });
      if (!ok || (!icon && !style)) return null;
      return { match: match, icon: icon, style: style, url: /^(\/|https?:|mailto:|tel:|#)/.test(match) };
    }).filter(Boolean);
  }

  function ruleFor(button, list) {
    var text = norm(button.textContent);
    var href = cleanUrl(button.getAttribute('href'));
    var path = cleanUrl(button.pathname);
    var fallback = null;
    for (var i = 0; i < list.length; i++) {
      var r = list[i];
      if (r.match === '*') { fallback = fallback || r; continue; }
      if (r.url ? (cleanUrl(r.match) === href || cleanUrl(r.match) === path) : r.match === text) return r;
    }
    return fallback;
  }

  function init() {
    var list = rules();
    if (!list.length) return;
    document.querySelectorAll(BUTTONS).forEach(function (button) {
      var r = ruleFor(button, list);
      if (!r) return;
      if (r.icon === 'none') button.removeAttribute('data-sp-icon');
      else if (r.icon) button.setAttribute('data-sp-icon', r.icon);
      if (r.style) button.setAttribute('data-sp-style', r.style);
    });
  }

  // Listeners are registered only once, even if this script runs twice.
  if (!window.__spButtonIconsBound) {
    window.__spButtonIconsBound = true;
    document.addEventListener('DOMContentLoaded', init);
    window.addEventListener('mercury:load', init);
  }

  init();
})();
