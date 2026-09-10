import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const page = path.join(root, 'dist', 'projects', 'ai-downstream-demand', 'index.html');
if (!fs.existsSync(page)) throw new Error(`Missing monitor page: ${page}`);

let html = fs.readFileSync(page, 'utf8');

if (!html.includes('Working on a related question?')) {
  const note = `<div style="margin-top:22px;padding-top:16px;border-top:1px solid var(--rule);font-family:Georgia,serif;font-size:.98rem;line-height:1.5;color:#343a40"><strong style="font-family:Arial,sans-serif;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)">Working on a related question?</strong><br>I’m happy to help pressure-test assumptions or turn public data into a concise decision brief.</div>`;

  if (html.includes('<div class="share-row"')) {
    html = html.replace('<div class="share-row"', note + '<div class="share-row"');
  } else {
    html = html.replace('<p class="back-link"><a href="/projects/">← Back to Ideas in Practice</a></p>', note + '<p class="back-link"><a href="/projects/">← Back to Ideas in Practice</a></p>');
  }
}

fs.writeFileSync(page, html);
console.log('Added concise advisory note to AI Downstream Demand Monitor');
