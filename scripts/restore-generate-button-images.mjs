import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'dist', 'essays', 'the-generate-button-tells-us-nothing', 'index.html');
if (!fs.existsSync(file)) process.exit(0);

let html = fs.readFileSync(file, 'utf8');

const img = (src, alt) => `<p><img src="${src}" alt="${alt}" loading="lazy" style="display:block;max-width:100%;height:auto;margin:1.5rem auto;border-radius:12px" /></p>`;

html = html.replace(
  /<p>\s*<img[^>]*src="\/images\/generate-button-sp\.jpg"[^>]*>\s*<\/p>/i,
  img('/images/essays/generate-button/sp-bill.webp', 'Electricity, gas and water usage bill showing consumption trends and comparisons')
);

html = html.replace(
  /<p>\s*<img[^>]*src="\/images\/generate-button-screen-time\.jpg"[^>]*>\s*<\/p>/i,
  `${img('/images/essays/generate-button/screen-time-overview.webp', 'iPhone Screen Time weekly view showing daily average and change from last week')}${img('/images/essays/generate-button/screen-time-summary.webp', 'iPhone Screen Time report showing category breakdown and total screen time')}`
);

fs.writeFileSync(file, html);
