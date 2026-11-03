// Builds snippets.json from every snippets/*/meta.json, and checks each meta.json "options"
// list against the snippet's files so the two can't drift apart.
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'snippets');
const FILES = ['snippet.css', 'snippet.js', 'snippet.html'];
const TYPES = ['attribute', 'css-variable'];
const errors = [];

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

  // Every variable declared on :root must be documented.
  const root = /:root\s*\{([^}]*)\}/.exec(css);
  if (root) for (const m of root[1].matchAll(/(--sp-[\w-]+)\s*:/g)) {
    if (!names.has(m[1])) fail(`${m[1]} is declared in snippet.css but missing from options`);
  }
}

const list = fs.readdirSync(dir)
  .filter(d => fs.existsSync(path.join(dir, d, 'meta.json')))
  .map(d => {
    const meta = JSON.parse(fs.readFileSync(path.join(dir, d, 'meta.json'), 'utf8'));
    meta.files = FILES.filter(f => fs.existsSync(path.join(dir, d, f)));
    const sources = Object.fromEntries(meta.files.map(f => [f, fs.readFileSync(path.join(dir, d, f), 'utf8')]));
    checkOptions(d, meta, sources);
    return meta;
  });

if (errors.length) {
  console.error(`snippets.json not written. Fix these meta.json "options" problems:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
fs.writeFileSync(path.join(__dirname, '..', 'snippets.json'), JSON.stringify(list, null, 2));
console.log(`Indexed ${list.length} snippet(s)`);
