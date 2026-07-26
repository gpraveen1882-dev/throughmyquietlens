import fs from 'node:fs';
import path from 'node:path';
const root = new URL('../', import.meta.url).pathname;
const required = ['dist/index.html','dist/essays/index.html','dist/about/index.html','dist/styles.css','dist/sitemap.xml','wrangler.jsonc'];
let failed = false;
for (const f of required) {
  const p = path.join(root, f);
  if (!fs.existsSync(p) || fs.statSync(p).size === 0) { console.error(`Missing or empty: ${f}`); failed = true; }
}
const htmlFiles = [];
function walk(dir){ for(const n of fs.readdirSync(dir)){const p=path.join(dir,n); if(fs.statSync(p).isDirectory()) walk(p); else if(p.endsWith('.html')) htmlFiles.push(p);} }
walk(path.join(root,'dist'));
for(const f of htmlFiles){const s=fs.readFileSync(f,'utf8'); if(!s.includes('<title>')||!s.includes('</html>')){console.error(`Invalid HTML shell: ${f}`); failed=true;}}
if(failed) process.exit(1);
console.log(`Checks passed: ${htmlFiles.length} HTML pages plus core assets.`);
