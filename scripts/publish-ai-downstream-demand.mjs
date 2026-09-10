import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'projects', 'ai-downstream-demand');
const destination = path.join(root, 'dist', 'projects', 'ai-downstream-demand');

if (!fs.existsSync(source)) throw new Error(`Missing source folder: ${source}`);

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

  const deploymentBlock = `<div class="section-label">2 · Deployment</div><section class="monitor-grid"><article class="monitor-panel"><div class="panel-head"><h2>How deeply is AI deployed inside businesses?</h2><div class="source-note">U.S. Census Bureau · 2026 AI supplement<br>Reference period: Nov 2025–Jan 2026</div></div><div class="vendor-row"><div class="vendor-name">Firms using AI in a business function</div><div class="vendor-value">18%</div><div class="vendor-change">32% employment-weighted</div></div><div class="vendor-row"><div class="vendor-name">Firms with workers using AI for work tasks</div><div class="vendor-value">23%</div><div class="vendor-change">41% employment-weighted</div></div><div class="method">Nationally representative Census supplement. Larger firms account for much more employment, so employment-weighted adoption is materially higher than firm-count adoption.</div></article><aside class="monitor-panel"><div class="signal-label">Depth inside adopters</div><div class="metric-number">57%</div><div class="metric-copy">of AI-using firms deployed AI in three or fewer business functions.</div><div class="question-block"><h3>What this tells us</h3><p>AI has meaningful reach across U.S. employment, but deployment remains concentrated in a limited number of functions for most adopters.</p></div><div class="question-block"><h3>Additional context</h3><p>66% of users reported using AI only to augment tasks rather than automate them.</p></div></aside></section>`;

  html = html.replace(oldHeader, newHeader).replace(oldFooter, newFooter);
  html = html.replace('<div class="signal-state up">Strengthening ↑</div>', '<div class="signal-state up">Broadening ↑</div>');
  html = html.replace('<div class="signal-state unknown">Periodic evidence</div><div class="signal-source">Census research supplement</div>', '<div class="signal-state mixed">Broad, still shallow ↔</div><div class="signal-source">Census 2026 AI supplement</div>');
  html = html.replace('<div class="signal-state up">Rising, slower ↑</div>', '<div class="signal-state up">Rising, but slowing ↑</div>');
  html = html.replace('<div class="signal-state unknown">Unclear ?</div>', '<div class="signal-state unknown">Not yet clear ?</div>');
  html = html.replace('</section><section class="current-reading">', '</section><p style="margin:12px 0 0;font-family:Georgia,serif;font-size:1rem;line-height:1.5;color:#343a40"><strong>Current signal:</strong> adoption and paid use are growing, but depth of deployment and realized economic value remain uncertain.</p><section class="current-reading">');
  html = html.replace('<div class="section-label">2 · Payment & intensity</div>', deploymentBlock + '<div class="section-label">3 · Payment & intensity</div>');
  fs.writeFileSync(page, html);
}

console.log('Published AI Downstream Demand Monitor');
