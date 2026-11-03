// Builds snippets.json from every snippets/*/meta.json, and checks each meta.json "options"
// list against the snippet's files so the two can't drift apart.
const fs = require('fs'), path = require('path');
const { checkLess, VERSIONS } = require('./less-check');
const dir = path.join(__dirname, '..', 'snippets');
const FILES = ['snippet.css', 'snippet.js', 'snippet.html'];
const TYPES = ['attribute', 'css-variable'];
const SCRIPT_TAG = '<script> tag';
const errors = [];

const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

// install.html: the complete <script> block to paste into Code Injection, with the
// snippet's <script>-tag settings already filled in with their example values.
function installHtml(slug, meta, js) {
  if (/<\/script/i.test(js)) { errors.push(`${slug}: snippet.js contains "</script", which would end the script block early`); return null; }
  const settings = meta.options.filter(o => o.on === SCRIPT_TAG && o.example);
  const attrs = settings.map(o => ` ${o.name}="${attr(o.example)}"`).join('');
  const notes = settings.map(o => `\n     ${o.name}: ${o.description.replace(/--/g, '-')}`).join('');
  return `<!-- ${meta.title}: paste into Settings → Advanced → Code Injection → Footer.${notes ? notes + '\n     Change the example value on the script tag below to match your site.' : ''} -->\n` +
    `<script${attrs}>\n${js.trimEnd()}\n</script>\n`;
}

const squash = s => String(s).replace(/\s+/g, ' ').trim();
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function checkOptions(slug, meta, sources) {
  const fail = msg => errors.push(`${slug}: ${msg}`);
  if (!Array.isArray(meta.options)) return fail('meta.json needs an "options" array');
  const all = Object.values(sources).join('\n');
  const css = (sources['snippet.css'] || '').replace(/\/\*[\s\S]*?\*\//g, ''); // comments removed
  const names = new Set();

  meta.options.forEach((o, i) => {
    const label = o.name || `option #${i + 1}`;
    for (const key of ['name', 'type', 'on', 'description']) if (!o[key]) fail(`${label}: missing "${key}"`);
    if (!('default' in o)) fail(`${label}: missing "default" (use null if there is none)`);
    if (o.type && !TYPES.includes(o.type)) fail(`${label}: type must be one of ${TYPES.join(', ')}`);
    if (o.values && !Array.isArray(o.values)) fail(`${label}: "values" must be an array`);
    if (o.values && o.default != null && !o.values.includes(o.default)) fail(`${label}: default "${o.default}" is not in values`);
    if (names.has(o.name)) fail(`${label}: listed twice`);
    names.add(o.name);
    if (o.name && !all.includes(o.name)) fail(`${label}: not found in ${Object.keys(sources).join(', ')}`);
    if (o.type === 'css-variable' && o.default != null) {
      const decl = new RegExp(escape(o.name) + '\\s*:\\s*([^;]+);').exec(css);
      if (!decl) fail(`${label}: no declaration with a default in snippet.css`);
      else if (squash(decl[1]) !== squash(o.default)) fail(`${label}: default is "${o.default}" in meta.json but "${squash(decl[1])}" in snippet.css`);
    }
  });

  // Squarespace compiles Custom CSS with old LESS, which errors on or rewrites calc().
  css.split("\n").forEach(line => {
    if (/calc\(/i.test(line)) fail(`snippet.css uses calc() (${line.trim()}). Old LESS in Squarespace Custom CSS breaks it; see CLAUDE.md rule 9`);
  });

  meta.options.filter(o => o.on === SCRIPT_TAG).forEach(o => {
    if (o.type !== 'attribute') fail(`${o.name}: options on the ${SCRIPT_TAG} must be attributes`);
    if (!o.example) fail(`${o.name}: needs an "example" value for install.html`);
  });
  if (meta.options.some(o => o.on === SCRIPT_TAG) && !sources['snippet.js']) fail(`has ${SCRIPT_TAG} options but no snippet.js`);

  // Every variable declared on :root must be documented.
  const root = /:root\s*\{([^}]*)\}/.exec(css);
  if (root) for (const m of root[1].matchAll(/(--sp-[\w-]+)\s*:/g)) {
    if (!names.has(m[1])) fail(`${m[1]} is declared in snippet.css but missing from options`);
  }
}

const installs = [];
const list = fs.readdirSync(dir)
  .filter(d => fs.existsSync(path.join(dir, d, 'meta.json')))
  .map(d => {
    const meta = JSON.parse(fs.readFileSync(path.join(dir, d, 'meta.json'), 'utf8'));
    meta.files = FILES.filter(f => fs.existsSync(path.join(dir, d, f)));
    const sources = Object.fromEntries(meta.files.map(f => [f, fs.readFileSync(path.join(dir, d, f), 'utf8')]));
    checkOptions(d, meta, sources);

    // What the gallery's copy buttons copy. JS is copied as the ready-to-paste install.html.
    let install = null;
    if (sources['snippet.js'] && Array.isArray(meta.options)) install = installHtml(d, meta, sources['snippet.js']);
    if (install) installs.push([path.join(dir, d, 'install.html'), install]);
    meta.copy = [
      sources['snippet.css'] && { file: 'snippet.css', label: 'Copy CSS' },
      install && { file: 'install.html', label: 'Copy JS' },
      sources['snippet.html'] && { file: 'snippet.html', label: 'Copy HTML' },
    ].filter(Boolean);
    return meta;
  });

(async () => {
  // Compile every snippet.css with the old LESS versions Squarespace's Custom CSS may use.
  for (const meta of list) {
    if (!meta.files.includes('snippet.css')) continue;
    const css = fs.readFileSync(path.join(dir, meta.slug, 'snippet.css'), 'utf8');
    try { (await checkLess(css)).forEach(p => errors.push(`${meta.slug}: ${p}`)); }
    catch (e) { errors.push(e.message); break; }
  }

  if (errors.length) {
    console.error(`snippets.json not written. Fix these problems:\n- ${[...new Set(errors)].join('\n- ')}`);
    process.exit(1);
  }
  installs.forEach(([file, html]) => fs.writeFileSync(file, html));
  fs.writeFileSync(path.join(__dirname, '..', 'snippets.json'), JSON.stringify(list, null, 2));
  console.log(`Indexed ${list.length} snippet(s), wrote ${installs.length} install.html file(s), CSS compiles unchanged with LESS ${VERSIONS.map(v => v.replace('less-', '')).join(', ')}`);
})();
