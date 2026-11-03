// Compiles CSS with the old LESS versions Squarespace may use for Custom CSS.
// Reports a problem if any version errors, or if its output differs from the input
// (e.g. LESS doing arithmetic inside calc(), or dropping part of a value).
// Squarespace doesn't publish its LESS version, so this checks a range.
const VERSIONS = ['less-1.3', 'less-1.4', 'less-1.7', 'less-2.7'];

function load(name) {
  try { return require(name); }
  catch (e) { throw new Error(`Missing dev dependency "${name.split('/')[0]}". Run "npm install" first.`); }
}

function compile(name, version, src) {
  const less = load(name);
  return new Promise(resolve => {
    const fail = e => resolve({ error: e.line && !/line \d/i.test(e.message) ? `${e.message} (line ${e.line})` : e.message });
    if (parseInt(version, 10) >= 2) {
      // less 2.x: promise API
      return less.render(src).then(out => resolve({ css: out.css }), fail);
    }
    // less 1.x: Parser + toCSS
    try {
      new less.Parser().parse(src, (err, tree) => {
        if (err) return fail(err);
        try { resolve({ css: tree.toCSS() }); } catch (e) { fail(e); }
      });
    } catch (e) { fail(e); }
  });
}

// Declarations, normalized so formatting-only differences (spacing, #fff vs #ffffff, case) don't count.
function declarations(css) {
  return (css.replace(/\/\*[\s\S]*?\*\//g, '').match(/[\w-]+\s*:[^;{}]+(?=;|\s*})/g) || [])
    .map(d => d.replace(/\s+/g, ' ').replace(/\s*:\s*/, ': ').replace(/\s*,\s*/g, ', ')
      .replace(/#([0-9a-f])([0-9a-f])([0-9a-f])\b/gi, '#$1$1$2$2$3$3').toLowerCase().trim());
}

// Returns a list of problem strings (empty if every version compiles the CSS unchanged).
async function checkLess(src) {
  const problems = [];
  const before = new Set(declarations(src));
  for (const name of VERSIONS) {
    const version = load(name + '/package.json').version;
    const out = await compile(name, version, src);
    if (out.error) { problems.push(`LESS ${version} fails to compile snippet.css: ${out.error}`); continue; }
    const changed = declarations(out.css).filter(d => !before.has(d));
    if (changed.length) problems.push(`LESS ${version} changes snippet.css values: ${changed.join(' | ')}`);
  }
  return problems;
}

module.exports = { checkLess, VERSIONS };
