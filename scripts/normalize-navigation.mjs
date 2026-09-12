import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const links = [
  ['Writing', '/writing/', 'writing'],
  ['Ideas in Practice', '/projects/', 'projects'],
  ['Conversations', '/conversations/', 'conversations'],
  ['About', '/about/', 'about'],
  ['Subscribe', '/subscribe/', 'subscribe']
];

function activeSection(route) {
  if (route.startsWith('projects/')) return 'projects';
  if (route.startsWith('conversations/')) return 'conversations';
  if (route.startsWith('about/')) return 'about';
  if (route.startsWith('subscribe/')) return 'subscribe';
  return 'writing';
}

function header(active) {
  const nav = links.map(([label, url, key]) =>
    `<a href="${url}"${key === active ? ' aria-current="page"' : ''}>${label}</a>`
  ).join('');
  return `<header><div class="container nav"><a class="brand" href="/"><img src="/images/logo-quiet-lens.png" alt="Through My Quiet Lens" class="brand-logo"></a><button class="menu-button" aria-label="Open menu" aria-expanded="false">Menu</button><nav class="nav-links" aria-label="Primary">${nav}</nav></div></header>`;
}

function footer() {
  return `<footer><div class="container"><div class="footer-grid"><div><div class="footer-brand"><img src="/images/logo-quiet-lens.png" alt="Through My Quiet Lens" class="footer-logo"></div></div><div class="footer-links"><a href="/writing/">Writing</a><a href="/projects/">Ideas in Practice</a><a href="/conversations/">Conversations</a><a href="/about/">About</a><a href="/subscribe/">Subscribe</a><a href="https://www.linkedin.com/in/gpraveen1882/" target="_blank" rel="noopener noreferrer">LinkedIn</a></div></div><div class="copyright">© <span class="year"></span> Praveen Gangaraju. Built for reading, not scrolling.</div></div></footer>`;
}

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(target) : entry.name.endsWith('.html') ? [target] : [];
  });
}

let updated = 0;
for (const file of htmlFiles(dist)) {
  let html = fs.readFileSync(file, 'utf8');
  const navMatch = html.match(/<nav class="nav-links"[^>]*>[\s\S]*?<\/nav>/);
  if (!navMatch || !navMatch[0].includes('href="/library/"')) continue;

  const route = path.relative(dist, path.dirname(file)).replaceAll(path.sep, '/');
  html = html.replace(/<header>[\s\S]*?<\/header>/, header(activeSection(route)));
  html = html.replace(/<footer>[\s\S]*?<\/footer>/, footer());
  fs.writeFileSync(file, html);
  updated += 1;
}

console.log(`Normalised navigation on ${updated} legacy page${updated === 1 ? '' : 's'}.`);
