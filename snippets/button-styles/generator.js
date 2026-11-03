/* Button Styles — CSS generator, shared by configurator.html (browser) and the build (Node).
   generate(config) returns plain CSS with the chosen values written in.
   Rules this output must keep (see CLAUDE.md):
   - never set colors or typography: everything is drawn in currentColor (the Site Styles text color);
     the only fixed color is the neutral drop shadow of the "lift" effect
   - no calc(), no var(), no color-mix(); must compile unchanged with LESS 2.7.3 (Squarespace Custom CSS)
   - hover effects use ::before (::after belongs to button-icons) */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.spButtonStyles = factory();
})(this, function () {
  'use strict';

  var TYPES = ['primary', 'secondary', 'tertiary'];
  var SIZES = ['small', 'medium', 'large'];

  var HOVERS = {
    'none': 'None',
    'fill-bottom': 'Fill from bottom',
    'fill-top': 'Fill from top',
    'fill-left': 'Fill from left',
    'fill-right': 'Fill from right',
    'marks': 'Corner marks',
    'underline': 'Underline grow',
    'lift': 'Lift and shadow',
    'fade': 'Fade (tint)',
    'scale': 'Scale'
  };

  var EASINGS = {
    'ease': 'ease',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
    'linear': 'linear',
    'smooth': 'cubic-bezier(0.19, 1, 0.22, 1)',
    'snappy': 'cubic-bezier(0.2, 0.8, 0.2, 1)'
  };

  var LIFT_PX = 2;
  var LIFT_SHADOW = '0 6px 16px rgba(0, 0, 0, 0.18)';
  var SCALE = 1.04;

  var defaults = {
    sizes: {
      enabled: false, // false = keep Site Styles padding
      small: { py: 10, px: 20, minHeight: 36 },
      medium: { py: 14, px: 28, minHeight: 44 },
      large: { py: 18, px: 36, minHeight: 52 }
    },
    radius: { enabled: false, value: 0 }, // false = keep Site Styles shape
    marks: { size: 6, thickness: 1 },
    tint: 10, // % of the text color, for the fill/fade layer and the hairline border
    speed: 300, // ms
    easing: 'ease',
    types: {
      primary: { transparent: false, border: false, marks: false, hover: 'fade' },
      secondary: { transparent: false, border: true, marks: true, hover: 'fade' },
      tertiary: { transparent: false, border: false, marks: false, hover: 'underline' }
    }
  };

  // The reference effect: corner marks + tint, on all three button types.
  var presets = {
    'corner-marks-tint': {
      label: 'Corner marks + tint',
      config: {
        marks: { size: 6, thickness: 1 }, tint: 10, speed: 300, easing: 'ease',
        types: {
          primary: { transparent: true, border: true, marks: true, hover: 'fade' },
          secondary: { transparent: true, border: true, marks: true, hover: 'fade' },
          tertiary: { transparent: true, border: true, marks: true, hover: 'fade' }
        }
      }
    },
    'slide-fill': {
      label: 'Slide fill',
      config: {
        tint: 15, speed: 400, easing: 'smooth',
        types: {
          primary: { transparent: false, border: false, marks: false, hover: 'fill-bottom' },
          secondary: { transparent: false, border: true, marks: false, hover: 'fill-left' },
          tertiary: { transparent: false, border: false, marks: false, hover: 'underline' }
        }
      }
    },
    'minimal': {
      label: 'Minimal',
      config: {
        tint: 8, speed: 200, easing: 'ease-out',
        types: {
          primary: { transparent: false, border: false, marks: false, hover: 'lift' },
          secondary: { transparent: false, border: false, marks: false, hover: 'fade' },
          tertiary: { transparent: false, border: false, marks: false, hover: 'underline' }
        }
      }
    }
  };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function merge(base, over) {
    var out = clone(base);
    (function walk(t, s) {
      Object.keys(s || {}).forEach(function (k) {
        if (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k]) && t[k] && typeof t[k] === 'object') walk(t[k], s[k]);
        else t[k] = s[k];
      });
    })(out, over);
    return out;
  }

  // Number formatting: no trailing zeros, no leading "0." loss, clamp to sane ranges.
  function num(v, min, max, fallback) {
    var n = parseFloat(v);
    if (isNaN(n)) n = fallback;
    if (min != null) n = Math.max(min, n);
    if (max != null) n = Math.min(max, n);
    return Math.round(n * 1000) / 1000;
  }
  function px(n) { return n === 0 ? '0' : n + 'px'; }
  function sec(ms) { return (Math.round(ms) / 1000) + 's'; }

  function normalize(cfg) {
    var c = merge(defaults, cfg || {});
    SIZES.forEach(function (s) {
      c.sizes[s].py = num(c.sizes[s].py, 0, 80, defaults.sizes[s].py);
      c.sizes[s].px = num(c.sizes[s].px, 0, 120, defaults.sizes[s].px);
      c.sizes[s].minHeight = num(c.sizes[s].minHeight, 0, 200, defaults.sizes[s].minHeight);
    });
    c.radius.value = num(c.radius.value, 0, 300, 0);
    c.marks.size = num(c.marks.size, 1, 40, 6);
    c.marks.thickness = num(c.marks.thickness, 1, 6, 1);
    c.tint = num(c.tint, 1, 100, 10);
    c.speed = num(c.speed, 0, 2000, 300);
    if (!EASINGS[c.easing]) c.easing = 'ease';
    TYPES.forEach(function (t) {
      var o = c.types[t];
      o.transparent = !!o.transparent; o.border = !!o.border; o.marks = !!o.marks;
      if (!HOVERS[o.hover]) o.hover = 'none';
    });
    return c;
  }

  var NOT_FLEX = 'body:not(.tweak-global-animations-animation-type-flex) ';
  var NOT_PLAIN = ':not([data-sp-style="plain"])';

  function sel(type) {
    return '#siteWrapper .sqs-block-button-element.sqs-button-element--' + type + NOT_PLAIN;
  }

  function rule(selectors, decls) {
    var body = decls.filter(Boolean);
    if (!body.length) return '';
    return [].concat(selectors).join(',\n') + ' {\n' + body.map(function (d) { return '  ' + d + ';'; }).join('\n') + '\n}\n';
  }

  // Corner marks: 8 thin gradients (a horizontal and a vertical bar at each corner).
  function markLayers(size, thick) {
    var h = px(size) + ' ' + px(thick), v = px(thick) + ' ' + px(size);
    var corners = ['left top', 'right top', 'left bottom', 'right bottom'];
    var layers = [];
    corners.forEach(function (pos) {
      layers.push({ pos: pos, size: h });
      layers.push({ pos: pos, size: v });
    });
    return layers;
  }

  function typeCss(type, c) {
    var o = c.types[type];
    var S = sel(type), F = NOT_FLEX + S;
    var dur = sec(c.speed), ease = EASINGS[c.easing];
    var hover = o.hover;
    var out = [];
    var opacity = num(c.tint / 100, 0.01, 1, 0.1);

    // Background-image layers on the button itself (full text color): corner marks and underline.
    var rest = [], hov = [];
    var marksHover = hover === 'marks';
    if (o.marks || marksHover) {
      markLayers(c.marks.size, c.marks.thickness).forEach(function (l, i) {
        var big = markLayers(c.marks.size * 2, c.marks.thickness)[i];
        var zero = i % 2 === 0 ? '0 ' + px(c.marks.thickness) : px(c.marks.thickness) + ' 0';
        rest.push({ pos: l.pos, size: o.marks ? l.size : zero });
        hov.push({ pos: l.pos, size: marksHover ? (o.marks ? big.size : l.size) : (o.marks ? l.size : zero) });
      });
    }
    if (hover === 'underline') {
      rest.push({ pos: 'center bottom', size: '0 ' + px(c.marks.thickness) });
      hov.push({ pos: 'center bottom', size: '100% ' + px(c.marks.thickness) });
    }
    var layered = rest.length > 0;
    function images(list) { return list.map(function () { return 'linear-gradient(currentColor, currentColor)'; }).join(', '); }
    function sizes(list) { return list.map(function (l) { return l.size; }).join(', '); }
    function positions(list) { return list.map(function (l) { return l.pos; }).join(', '); }

    // The ::before layer (tint strength): hairline border and/or fill/fade.
    var fillHover = /^fill-/.test(hover), fadeHover = hover === 'fade';
    var usesBefore = o.border || fillHover || fadeHover;

    // 1) Resting styles that apply even with the Flex animation: corner marks.
    if (o.marks) {
      out.push(rule(S, [
        'background-image: ' + images(rest),
        'background-repeat: no-repeat',
        'background-origin: border-box',
        'background-position: ' + positions(rest),
        'background-size: ' + sizes(rest)
      ]));
    }

    // 2) Everything else is skipped when Squarespace's Flex animation is on (it owns ::before and hover colors).
    var buttonTransitions = [];
    if (layered && (marksHover || hover === 'underline')) buttonTransitions.push('background-size ' + dur + ' ' + ease);
    if (hover === 'lift') buttonTransitions.push('transform ' + dur + ' ' + ease, 'box-shadow ' + dur + ' ' + ease);
    if (hover === 'scale') buttonTransitions.push('transform ' + dur + ' ' + ease);

    out.push(rule(F, [
      usesBefore ? 'position: relative' : '',
      usesBefore ? 'isolation: isolate' : '',
      o.transparent ? 'background-color: transparent' : '',
      // Squarespace sets "transition: none !important" on buttons in animated blocks; keep the hover motion.
      buttonTransitions.length ? 'transition: ' + buttonTransitions.join(', ') + ' !important' : ''
    ]));

    if (!o.marks && layered) {
      // Marks/underline that only appear on hover: invisible resting layers.
      out.push(rule(F, [
        'background-image: ' + images(rest),
        'background-repeat: no-repeat',
        'background-origin: border-box',
        'background-position: ' + positions(rest),
        'background-size: ' + sizes(rest)
      ]));
    }

    if (usesBefore) {
      var fill = {
        'fill-bottom': ['100% 0', 'left bottom'],
        'fill-top': ['100% 0', 'left top'],
        'fill-left': ['0 100%', 'left top'],
        'fill-right': ['0 100%', 'right top']
      }[hover];
      out.push(rule(F + '::before', [
        'content: ""',
        'position: absolute',
        'top: 0',
        'right: 0',
        'bottom: 0',
        'left: 0',
        'z-index: -1',
        'border: 0',
        'border-radius: inherit',
        'clip-path: none',
        'transform: none',
        'pointer-events: none',
        'opacity: ' + opacity,
        o.border ? 'box-shadow: inset 0 0 0 ' + px(c.marks.thickness) + ' currentColor' : 'box-shadow: none',
        'background-color: transparent',
        fill ? 'background-image: linear-gradient(currentColor, currentColor)' : 'background-image: none',
        fill ? 'background-repeat: no-repeat' : '',
        fill ? 'background-size: ' + fill[0] : '',
        fill ? 'background-position: ' + fill[1] : '',
        fill ? 'transition: background-size ' + dur + ' ' + ease : (fadeHover ? 'transition: background-color ' + dur + ' ' + ease : 'transition: none')
      ]));
    }

    // Hover (mouse devices only) and keyboard focus.
    var hoverDecls = { button: [], before: [] };
    if (fillHover) hoverDecls.before.push('background-size: 100% 100%');
    if (fadeHover) hoverDecls.before.push('background-color: currentColor');
    if (layered && (marksHover || hover === 'underline')) hoverDecls.button.push('background-size: ' + sizes(hov));
    if (hover === 'lift') hoverDecls.button.push('transform: translateY(-' + LIFT_PX + 'px)', 'box-shadow: ' + LIFT_SHADOW);
    if (hover === 'scale') hoverDecls.button.push('transform: scale(' + SCALE + ')');

    var hoverCss = rule(F + ':hover', hoverDecls.button) + rule(F + ':hover::before', hoverDecls.before);
    if (hoverCss) out.push('@media (hover: hover) {\n' + hoverCss.replace(/^(?=.)/gm, '  ') + '}\n');
    out.push(rule(F + ':focus-visible', hoverDecls.button));
    out.push(rule(F + ':focus-visible::before', hoverDecls.before));

    return { css: out.join(''), motion: buttonTransitions.length > 0, before: usesBefore };
  }

  function describe(c) {
    var lines = ['Button Styles (sp-button-styles), made with the button-styles configurator. Paste into Custom CSS.'];
    lines.push('Sizes: ' + (c.sizes.enabled ? SIZES.map(function (s) { var z = c.sizes[s]; return s + ' ' + z.py + '/' + z.px + 'px, min ' + z.minHeight + 'px'; }).join('; ') : 'Site Styles'));
    lines.push('Corner radius: ' + (c.radius.enabled ? px(c.radius.value) : 'Site Styles'));
    lines.push('Marks: ' + c.marks.size + 'px x ' + c.marks.thickness + 'px. Tint: ' + c.tint + '%. Speed: ' + c.speed + 'ms ' + c.easing + '.');
    TYPES.forEach(function (t) {
      var o = c.types[t], bits = [];
      if (o.transparent) bits.push('transparent fill');
      if (o.border) bits.push('hairline border');
      if (o.marks) bits.push('corner marks');
      lines.push(t[0].toUpperCase() + t.slice(1) + ': ' + (bits.length ? bits.join(', ') + '; ' : '') + 'hover ' + HOVERS[o.hover] + '.');
    });
    lines.push('Skips buttons marked "plain" by the button-icons script.');
    return '/* ' + lines.join('\n   ') + ' */\n';
  }

  function generate(cfg) {
    var c = normalize(cfg);
    var parts = [describe(c)];

    if (c.sizes.enabled) {
      parts.push(rule('#siteWrapper .sqs-block-button-element' + NOT_PLAIN, [
        'display: inline-flex',
        'align-items: center',
        'justify-content: center',
        'box-sizing: border-box'
      ]));
      SIZES.forEach(function (s) {
        var z = c.sizes[s];
        parts.push(rule('#siteWrapper .sqs-block-button-element.sqs-block-button-element--' + s + NOT_PLAIN, [
          'padding: ' + px(z.py) + ' ' + px(z.px),
          'min-height: ' + px(z.minHeight)
        ]));
      });
    }
    if (c.radius.enabled) {
      parts.push(rule('#siteWrapper .sqs-block-button-element.sqs-block-button-element' + NOT_PLAIN, ['border-radius: ' + px(c.radius.value)]));
    }

    var motion = [];
    TYPES.forEach(function (t) {
      var r = typeCss(t, c);
      parts.push(r.css);
      if (r.motion) motion.push(NOT_FLEX + sel(t));
      if (r.before) motion.push(NOT_FLEX + sel(t) + '::before');
    });

    if (motion.length) {
      parts.push('@media (prefers-reduced-motion: reduce) {\n' + rule(motion, ['transition: none !important']).replace(/^(?=.)/gm, '  ') + '}\n');
    }
    return parts.filter(Boolean).join('\n');
  }

  // Configurations the build compiles with old LESS: every preset, plus every hover effect
  // with sizes, radius and each resting option switched on or off across the three types.
  function samples() {
    var list = [['defaults', clone(defaults)]];
    Object.keys(presets).forEach(function (k) { list.push(['preset ' + k, merge(defaults, presets[k].config)]); });
    Object.keys(HOVERS).forEach(function (h, i) {
      var t = { transparent: i % 2 === 0, border: i % 3 !== 0, marks: i % 2 === 1, hover: h };
      list.push(['hover ' + h, merge(defaults, {
        sizes: { enabled: true }, radius: { enabled: true, value: 4 }, easing: Object.keys(EASINGS)[i % 6],
        types: { primary: t, secondary: merge(t, { marks: !t.marks }), tertiary: merge(t, { border: !t.border, transparent: !t.transparent }) }
      })]);
    });
    return list;
  }

  return { generate: generate, normalize: normalize, samples: samples, defaults: clone(defaults), presets: presets, HOVERS: HOVERS, EASINGS: EASINGS, TYPES: TYPES, SIZES: SIZES, merge: merge };
});
