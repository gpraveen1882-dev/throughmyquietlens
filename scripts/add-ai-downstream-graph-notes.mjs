import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const page = path.join(root, 'dist', 'projects', 'ai-downstream-demand', 'index.html');
if (!fs.existsSync(page)) throw new Error(`Missing monitor page: ${page}`);

let html = fs.readFileSync(page, 'utf8');

if (!html.includes('.graph-reading{')) {
  html = html.replace('</style>', `.graph-reading{border-top:1px solid var(--rule);margin-top:14px;padding-top:12px}.graph-reading p{font-family:Georgia,serif;font-size:.95rem;line-height:1.5;margin:4px 0}.graph-reading strong{font-family:Arial,sans-serif;font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-right:5px}` + '</style>');
}

if (!html.includes('data-note="deployment-reading"')) {
  const deploymentNote = `<div class="graph-reading" data-note="deployment-reading"><p><strong>What this tells us</strong>Larger employers show much greater AI exposure than the raw firm count suggests, but this Census supplement is a structural snapshot rather than a trend.</p><p><strong>What it does not tell us</strong>We cannot yet tell from this series whether deployment depth is accelerating, flattening or peaking over time.</p></div>`;
  html = html.replace('<div class="method">Nationally representative Census supplement. The core AI-use question changed in late 2025, so older observations are not spliced into the current series.</div>', deploymentNote + '<div class="method">Nationally representative Census supplement. The core AI-use question changed in late 2025, so older observations are not spliced into the current series.</div>');
}

if (!html.includes('data-note="cost-reading"')) {
  const costNote = `<div class="graph-reading" data-note="cost-reading"><p><strong>What this tells us</strong>Effective AI unit costs have fallen sharply. Lower spend can therefore coexist with substantially higher underlying usage.</p><p><strong>What it does not tell us</strong>Falling unit cost does not by itself prove durable retention, enterprise ROI or direct data-centre MW demand.</p></div>`;
  html = html.replace('<div class="trend-note">Published Ramp checkpoints. This is effective price paid across observed model mix, not a provider list price. Sparse checkpoints are shown rather than interpolating missing months.</div>', '<div class="trend-note">Published Ramp checkpoints. This is effective price paid across observed model mix, not a provider list price. Sparse checkpoints are shown rather than interpolating missing months.</div>' + costNote);
}

fs.writeFileSync(page, html);
console.log('Added interpretation notes below downstream graphs');
