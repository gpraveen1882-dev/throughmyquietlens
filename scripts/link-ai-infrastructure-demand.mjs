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

  html = html.replace(/<article class="project-card"><p class="eyebrow">Visual explainer<\/p><h2>Inside the AI Data-Centre Buildout<\/h2>[\s\S]*?<\/article>/g, '');
  html = html.replace(/<article class="project-card"><p class="eyebrow">Evidence monitor<\/p><h2>AI Downstream Demand Monitor<\/h2>[\s\S]*?<\/article>/g, '');
  html = html.replace(/<article class="project-card"><p class="eyebrow">Paired inquiry(?: · Data centres &amp; AI)?<\/p><h2>AI Infrastructure &amp; Demand<\/h2>[\s\S]*?<\/article>/g, '');

  const bridge = `<div style="max-width:760px;margin:0 auto 26px;font-family:Georgia,serif;font-size:1.04rem;line-height:1.6;color:#414846">A recurring question across these projects is how AI moves from <strong>build</strong> to <strong>use</strong> to <strong>value</strong> — and what that growth means for the resources required to sustain it.</div>`;
  if (!html.includes('A recurring question across these projects')) {
    html = html.replace('<div class="container project-grid">', `<div class="container">${bridge}</div><div class="container project-grid">`);
  }

  const card = `<article class="project-card"><p class="eyebrow">Connected inquiry · Data centres, AI &amp; resources</p><h2>AI Infrastructure &amp; Demand</h2><p>Follow one system from end to end: what is being built, whether adoption and usage are growing underneath it, whether that use is creating value, and what continued growth means for resource demand.</p><a class="read-link" href="/projects/ai-infrastructure-demand/">Explore the inquiry →</a></article>`;
  html = html.replace('<div class="container project-grid">', `<div class="container project-grid">${card}`);
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

console.log('Linked AI build, use, value and resource-impact work');
