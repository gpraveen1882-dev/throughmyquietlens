import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'projects', 'ai-data-centre-buildout');
const destination = path.join(root, 'dist', 'projects', 'ai-data-centre-buildout');

if (!fs.existsSync(source)) throw new Error(`Missing source folder: ${source}`);
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.rmSync(destination, { recursive: true, force: true });
fs.cpSync(source, destination, { recursive: true });

const projectsPage = path.join(root, 'dist', 'projects', 'index.html');
if (fs.existsSync(projectsPage)) {
  let html = fs.readFileSync(projectsPage, 'utf8');
  const card = `<article class="project-card"><p class="eyebrow">Visual explainer</p><h2>Inside the AI Data-Centre Buildout</h2><p>What is actually being built for AI, how it differs from conventional compute, and why the gap between infrastructure capacity and real demand is so difficult to measure.</p><a class="read-link" href="/projects/ai-data-centre-buildout/">Open the explainer →</a></article>`;
  if (!html.includes('/projects/ai-data-centre-buildout/')) {
    html = html.replace('</div></section></main>', `${card}</div></section></main>`);
  }
  fs.writeFileSync(projectsPage, html);
}

console.log('Published AI data-centre buildout explainer');
