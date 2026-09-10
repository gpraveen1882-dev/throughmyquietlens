import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'projects', 'ai-downstream-demand');
const destination = path.join(root, 'dist', 'projects', 'ai-downstream-demand');

if (!fs.existsSync(source)) {
  throw new Error(`Missing source folder: ${source}`);
}

fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.rmSync(destination, { recursive: true, force: true });
fs.cpSync(source, destination, { recursive: true });

const page = path.join(destination, 'index.html');
if (fs.existsSync(page)) {
  let html = fs.readFileSync(page, 'utf8');

  const oldHeader = `<header><div class="container nav"><a class="brand" href="/">Through My Quiet Lens</a><button class="menu-button" aria-label="Open menu" aria-expanded="false">Menu</button><nav class="nav-links" aria-label="Primary"><a href="/library/">Library</a><a href="/through-my-quiet-lens/">Quiet Lens</a><a href="/essays/">Essays</a><a href="/principles/">Working Principles</a><a href="/ucla-anderson/">UCLA Anderson</a><a href="/conversations/">Conversations</a><a href="/dc-decoded/">DC Decoded</a><a href="/projects/" aria-current="page">Projects</a><a href="/about/">About</a><a href="/contact/">Contact</a><a href="/subscribe/">Subscribe</a></nav></div></header>`;

  const newHeader = `<header><div class="container nav"><a class="brand" href="/"><img src="/images/logo-quiet-lens.png" alt="Through My Quiet Lens" class="brand-logo"></a><button class="menu-button" aria-label="Open menu" aria-expanded="false">Menu</button><nav class="nav-links" aria-label="Primary"><a href="/writing/">Writing</a><a href="/projects/" aria-current="page">Ideas in Practice</a><a href="/conversations/">Conversations</a><a href="/about/">About</a><a href="/subscribe/">Subscribe</a></nav></div></header>`;

  const oldFooter = `<footer><div class="container"><div class="footer-grid"><div><div class="footer-brand">Through My Quiet Lens</div><p>Thoughtful observations by Praveen Gangaraju.</p></div><div class="footer-links"><a href="/library/">Library</a><a href="/through-my-quiet-lens/">Quiet Lens</a><a href="/essays/">Essays</a><a href="/principles/">Principles</a><a href="/ucla-anderson/">UCLA Anderson</a><a href="/conversations/">Conversations</a><a href="/dc-decoded/">DC Decoded</a><a href="/projects/">Projects</a><a href="/about/">About</a><a href="/contact/">Contact</a><a href="/subscribe/">Subscribe</a></div></div><div class="copyright">© <span class="year"></span> Praveen Gangaraju. Built for reading, not scrolling.</div></div></footer>`;

  const newFooter = `<footer><div class="container"><div class="footer-grid"><div><div class="footer-brand"><img src="/images/logo-quiet-lens.png" alt="Through My Quiet Lens" class="footer-logo"></div></div><div class="footer-links"><a href="/writing/">Writing</a><a href="/projects/">Ideas in Practice</a><a href="/conversations/">Conversations</a><a href="/about/">About</a><a href="/subscribe/">Subscribe</a><a href="https://www.linkedin.com/in/gpraveen1882/" target="_blank" rel="noopener noreferrer">LinkedIn</a></div></div><div class="copyright">© <span class="year"></span> Praveen Gangaraju. Built for reading, not scrolling.</div></div></footer>`;

  html = html.replace(oldHeader, newHeader).replace(oldFooter, newFooter);
  fs.writeFileSync(page, html);
}

console.log('Published AI Downstream Demand Monitor');
