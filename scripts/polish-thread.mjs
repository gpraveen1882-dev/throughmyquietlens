import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const threadPath = path.join(root, 'dist', 'thread', 'index.html');

if (!fs.existsSync(threadPath)) throw new Error('dist/thread/index.html not found. Run publish-thread first.');

let html = fs.readFileSync(threadPath, 'utf8');

// My First Attempt: slightly smaller quote and four cleaner lines.
html = html.replace(
  /<text x="65" y="370" font-family="Georgia,serif" font-size="34" font-style="italic" fill="#29231e"><tspan x="65" dy="0">I am the explorer[\s\S]*?<\/text>/,
  `<text x="65" y="350" font-family="Georgia,serif" font-size="30" font-style="italic" fill="#29231e"><tspan x="65" dy="0">I am the explorer who embraces new challenges with curiosity and resilience,</tspan><tspan x="65" dy="38">who is known for caring deeply, building trust, and lifting others along the way,</tspan><tspan x="65" dy="38">and helps people find new possibilities while feeling supported</tspan><tspan x="65" dy="38">on their journey.</tspan></text>`
);

// Where It Led: keep the composition, but make the right side fit comfortably.
html = html.replace(
  /<text x="700" y="315" font-family="Georgia,serif" font-size="42" fill="#28231e">Through My Quiet Lens<\/text><text x="700" y="385"[\s\S]*?<\/text><line x1="700" y1="488" x2="1150" y2="488" stroke="#b68447" stroke-width="2"\/><text x="700" y="545"[\s\S]*?<\/text><text x="700" y="595"[\s\S]*?<\/text>/,
  `<text x="675" y="315" font-family="Georgia,serif" font-size="38" fill="#28231e">Through My Quiet Lens</text><text x="675" y="382" font-family="Arial,sans-serif" font-size="21" fill="#756d65"><tspan x="675" dy="0">A home for short and long-form pieces —</tspan><tspan x="675" dy="31">business, leadership, relationships, education,</tspan><tspan x="675" dy="31">culture, technology and ordinary moments from life.</tspan></text><line x1="675" y1="485" x2="1140" y2="485" stroke="#b68447" stroke-width="2"/><text x="675" y="535" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="#65756e">I started by trying to define my personal brand.</text><text x="675" y="582" font-family="Georgia,serif" font-size="26" font-style="italic" fill="#28231e"><tspan x="675" dy="0">Eventually, I built a place where parts of it</tspan><tspan x="675" dy="34">could simply be seen.</tspan></text>`
);

fs.writeFileSync(threadPath, html);
console.log('Polished thread artifact text fitting.');
