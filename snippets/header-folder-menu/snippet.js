/* Header Folder Menu — opt-in upgrades for Squarespace 7.1 header folder dropdowns.
   Paste inside: <script data-sp-folders="Services, Shop"> … </script>
   Use folder titles or URL slugs, comma separated, or "*" for every folder.
   Safe to run twice; re-runs on DOMContentLoaded and Squarespace's mercury:load. */
(function () {
  'use strict';

  var ITEM = '.header-nav .header-nav-item--folder';
  var hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

  function norm(text) {
    return String(text || '').replace(/\s+/g, ' ').trim().toLowerCase().replace(/^\//, '');
  }

  function wanted() {
    var script = document.querySelector('script[data-sp-folders]');
    if (!script) return [];
    var value = script.getAttribute('data-sp-folders').trim();
    return value === '*' ? '*' : value.split(',').map(norm).filter(Boolean);
  }

  function matches(title, list) {
    if (list === '*') return true;
    var text = norm(title.textContent);
    var slug = norm(title.getAttribute('data-href'));
    return list.indexOf(text) > -1 || list.indexOf(slug) > -1;
  }

  function parts(item) {
    return { title: item.querySelector('.header-nav-folder-title'), content: item.querySelector('.header-nav-folder-content') };
  }

  function links(item) {
    return Array.prototype.slice.call(item.querySelectorAll('.header-nav-folder-content a[href]'));
  }

  function setOpen(item, open, focusTitle) {
    if (open) closeAll(item);
    if (open) item.setAttribute('data-sp-open', '');
    else item.removeAttribute('data-sp-open');
    var title = parts(item).title;
    if (title.getAttribute('aria-expanded') !== String(open)) title.setAttribute('aria-expanded', String(open));
    if (focusTitle) title.focus();
  }

  function closeAll(except) {
    document.querySelectorAll(ITEM + '[data-sp-open]').forEach(function (item) {
      if (item !== except) setOpen(item, false, false);
    });
  }

  function closeDelay() {
    var v = getComputedStyle(document.documentElement).getPropertyValue('--sp-folder-close-delay').trim();
    var n = parseFloat(v);
    if (isNaN(n)) return 250;
    return /ms$/.test(v) ? n : (/s$/.test(v) ? n * 1000 : n);
  }

  function setup(item) {
    if (item.hasAttribute('data-sp-folder-menu')) return;
    var p = parts(item);
    // Only the current 7.1 markup (folder title is a <button>) is supported.
    if (!p.title || !p.content || p.title.tagName !== 'BUTTON') return;

    item.setAttribute('data-sp-folder-menu', '');
    if (!p.title.hasAttribute('aria-controls') && p.content.id) p.title.setAttribute('aria-controls', p.content.id);
    if (p.title.getAttribute('aria-expanded') === 'true') item.setAttribute('data-sp-open', '');

    // Squarespace toggles aria-expanded itself for Enter/Space/Escape; mirror it.
    new MutationObserver(function () {
      var expanded = p.title.getAttribute('aria-expanded') === 'true';
      if (expanded !== item.hasAttribute('data-sp-open')) setOpen(item, expanded, false);
    }).observe(p.title, { attributes: true, attributeFilter: ['aria-expanded'] });

    var openedByHover = false;
    var timer;

    // Mouse/touch clicks only (detail > 0). Keyboard clicks are left to Squarespace.
    p.title.addEventListener('click', function (e) {
      if (e.detail === 0) return;
      if (openedByHover && item.hasAttribute('data-sp-open')) { openedByHover = false; return; }
      openedByHover = false;
      setOpen(item, !item.hasAttribute('data-sp-open'), false);
    });

    item.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'mouse' || !hoverQuery.matches) return;
      clearTimeout(timer);
      if (!item.hasAttribute('data-sp-open')) { setOpen(item, true, false); openedByHover = true; }
    });
    item.addEventListener('pointerleave', function (e) {
      if (e.pointerType !== 'mouse') return;
      clearTimeout(timer);
      timer = setTimeout(function () { openedByHover = false; setOpen(item, false, false); }, closeDelay());
    });

    item.addEventListener('keydown', function (e) {
      var list = links(item);
      var i = list.indexOf(document.activeElement);
      var open = item.hasAttribute('data-sp-open');
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(item, false, true);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (!list.length) return;
        e.preventDefault();
        if (!open) setOpen(item, true, false);
        var next = e.key === 'ArrowDown' ? i + 1 : (i < 0 ? list.length - 1 : i - 1);
        list[(next + list.length) % list.length].focus();
      } else if ((e.key === 'Home' || e.key === 'End') && i > -1) {
        e.preventDefault();
        list[e.key === 'Home' ? 0 : list.length - 1].focus();
      }
    });

    // Close when keyboard focus moves somewhere outside this folder.
    item.addEventListener('focusout', function (e) {
      if (e.relatedTarget && !item.contains(e.relatedTarget)) setOpen(item, false, false);
    });
  }

  function init() {
    var list = wanted();
    if (list !== '*' && !list.length) return;
    document.querySelectorAll(ITEM).forEach(function (item) {
      var title = item.querySelector('.header-nav-folder-title');
      if (title && matches(title, list)) setup(item);
    });
  }

  // Global listeners are registered only once, even if this script runs twice.
  if (!window.__spFolderMenuBound) {
    window.__spFolderMenuBound = true;
    document.addEventListener('click', function (e) {
      document.querySelectorAll(ITEM + '[data-sp-open]').forEach(function (item) {
        if (!item.contains(e.target)) setOpen(item, false, false);
      });
    });
    document.addEventListener('DOMContentLoaded', init);
    window.addEventListener('mercury:load', init);
  }

  init();
})();
