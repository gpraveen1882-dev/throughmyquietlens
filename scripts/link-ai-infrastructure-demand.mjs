import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'projects', 'ai-infrastructure-demand');
const destination = path.join(root, 'dist', 'projects', 'ai-infrastructure-demand');

if (!fs.existsSync(source)) throw new Error(`Missing source folder: ${source}`);
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.rmSync(destination, { recursive: true, force: true });
fs.cpSync(source, destination, { recursive: true });

const projectsPage = path.join(root, 'dist', 'projects', 'index.html');
if (fs.existsSync(projectsPage)) {
  let html = fs.readFileSync(projectsPage, 'utf8');
  html = html.replace(/<article class="project-card"><p class="eyebrow">Visual explainer<\/p><h2>Inside the AI Data-Centre Buildout<\/h2>[\s\S]*?<\/article>/, '');
  html = html.replace(/<article class="project-card"><p class="eyebrow">Evidence monitor<\/p><h2>AI Downstream Demand Monitor<\/h2>[\s\S]*?<\/article>/, '');
  const card = `<article class="project-card"><p class="eyebrow">Paired inquiry</p><h2>AI Infrastructure &amp; Demand</h2><p>What is being built for AI, what demand is developing underneath it, and whether the gap between infrastructure and economically meaningful use may be narrowing.</p><a class="read-link" href="/projects/ai-infrastructure-demand/">Explore the inquiry →</a></article>`;
  if (!html.includes('/projects/ai-infrastructure-demand/')) {
    html = html.replace('</div></section></main>', `${card}</div></section></main>`);
  }
  fs.writeFileSync(projectsPage, html);
}

const strip = `<div style="border-bottom:1px solid #dfe3e6;background:#f6f7f5"><div style="max-width:980px;margin:0 auto;padding:11px 24px;font:700 .68rem Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#68727d">Part of <a href="/projects/ai-infrastructure-demand/" style="color:inherit;text-underline-offset:3px">AI Infrastructure &amp; Demand</a></div></div>`;

const explainer = path.join(root, 'dist', 'projects', 'ai-data-centre-buildout', 'index.html');
if (fs.existsSync(explainer)) {
  let html = fs.readFileSync(explainer, 'utf8');
  if (!html.includes('Part of <a href="/projects/ai-infrastructure-demand/"')) {
    html = html.replace('<main id="main" class="buildout">', strip + '<main id="main" class="buildout">');
  }
  html = html.replace('<p class="plain">The explainer describes the infrastructure side. The monitor follows the demand side.</p>', '<p class="plain">The explainer describes the infrastructure side. The monitor follows the demand side. Together they form the <a href="/projects/ai-infrastructure-demand/">AI Infrastructure &amp; Demand</a> inquiry.</p>');
  fs.writeFileSync(explainer, html);
}

const monitor = path.join(root, 'dist', 'projects', 'ai-downstream-demand', 'index.html');
if (fs.existsSync(monitor)) {
  let html = fs.readFileSync(monitor, 'utf8');
  if (!html.includes('Part of <a href="/projects/ai-infrastructure-demand/"')) {
    html = html.replace('<main id="main">', strip + '<main id="main">');
  }
  html = html.replace(/AI infrastructure investment is accelerating rapidly\. This monitor asks whether economically productive downstream demand — adoption, deployment, payment, usage depth and realized value — is scaling fast enough underneath it\./, 'AI infrastructure is being built rapidly. This monitor tracks whether downstream demand — adoption, deployment, payment, usage depth and realized value — is growing fast enough to narrow the gap with that buildout.');
  html = html.replace(/AI infrastructure investment is accelerating rapidly\. This monitor tracks whether downstream demand — adoption, deployment, payment, usage depth and realized value — is scaling fast enough to keep pace with it\./, 'AI infrastructure is being built rapidly. This monitor tracks whether downstream demand — adoption, deployment, payment, usage depth and realized value — is growing fast enough to narrow the gap with that buildout.');
  const contextLink = `<div style="margin:14px 0 0;font-size:.78rem;color:#68727d">Need the infrastructure context first? <a href="/projects/ai-data-centre-buildout/" style="color:inherit;text-underline-offset:3px">See what is actually being built →</a></div>`;
  if (!html.includes('Need the infrastructure context first?')) {
    html = html.replace('<div class="monitor-meta">', contextLink + '<div class="monitor-meta">');
  }
  fs.writeFileSync(monitor, html);
}

console.log('Linked AI infrastructure and demand inquiry');