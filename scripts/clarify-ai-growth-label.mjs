import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const page = path.join(root, 'dist', 'projects', 'ai-downstream-demand', 'index.html');
if (!fs.existsSync(page)) throw new Error(`Missing monitor page: ${page}`);

let html = fs.readFileSync(page, 'utf8');

html = html.replace(
  'Usage is growing faster than spend',
  'Cumulative growth from Jan 2025 to Apr 2026'
);

html = html.replace(
  'Ramp-observed businesses, Jan 2025 → Apr 2026. Different period from the cost chart; shown as supporting context, not as a continuous monthly series.',
  '<strong>In plain English:</strong> token usage grew roughly 11×, while dollar spend grew roughly 6× over this period. Usage expanded much faster than spend, consistent with falling effective unit costs. Ramp-observed businesses; this is a cumulative-period comparison, not a monthly growth rate.'
);

fs.writeFileSync(page, html);
console.log('Clarified cumulative AI usage and spend growth labels');
