// Builds snippets.json from every snippets/*/meta.json
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'snippets');
const list = fs.readdirSync(dir)
  .filter(d => fs.existsSync(path.join(dir, d, 'meta.json')))
  .map(d => {
    const meta = JSON.parse(fs.readFileSync(path.join(dir, d, 'meta.json'), 'utf8'));
    const css = path.join(dir, d, 'snippet.css'), js = path.join(dir, d, 'snippet.js');
    meta.files = ['snippet.css', 'snippet.js'].filter(f => fs.existsSync(path.join(dir, d, f)));
    return meta;
  });
fs.writeFileSync(path.join(__dirname, '..', 'snippets.json'), JSON.stringify(list, null, 2));
console.log(`Indexed ${list.length} snippet(s)`);
