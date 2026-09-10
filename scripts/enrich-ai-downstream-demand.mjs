import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const page = path.join(root, 'dist', 'projects', 'ai-downstream-demand', 'index.html');
if (!fs.existsSync(page)) throw new Error(`Missing monitor page: ${page}`);

let html = fs.readFileSync(page, 'utf8');
if (html.includes('3 · Deployment') || html.includes('4 · Economic value')) {
  console.log('AI downstream enrichment already present');
  process.exit(0);
}

html = html.replace('.evidence-grid{', '.snapshot-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:14px}.snapshot{border:1px solid var(--rule);padding:14px}.snapshot strong{display:block;font-family:Georgia,serif;font-size:2rem;margin:4px 0}.evidence-layers{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:14px}.evidence-layer{border:1px solid var(--rule);padding:16px}.evidence-layer .metric{font-family:Georgia,serif;font-size:2.2rem;margin:8px 0}.evidence-layer p{font-family:Georgia,serif;line-height:1.45}.evidence-layer .method{margin-top:10px}.evidence-grid{');
html = html.replace('@media(max-width:850px){', '@media(max-width:850px){.snapshot-grid,.evidence-layers{grid-template-columns:1fr 1fr}');

const insertion = `<div class="section-label">3 · Deployment</div><section class="monitor-panel"><div class="panel-head"><h2>How deeply is AI being deployed inside businesses?</h2><div class="source-note">U.S. Census Bureau · 2026 AI supplement<br>Periodic structural snapshot</div></div><div class="snapshot-grid"><div class="snapshot"><div class="signal-label">Firm use</div><strong id="dep-firm">—</strong><div class="metric-copy">Businesses using AI in a business function</div></div><div class="snapshot"><div class="signal-label">Employment weighted</div><strong id="dep-employment">—</strong><div class="metric-copy">Shows greater exposure at larger employers</div></div><div class="snapshot"><div class="signal-label">Worker-task use</div><strong id="dep-task">—</strong><div class="metric-copy">Firms where workers use AI in work tasks</div></div><div class="snapshot"><div class="signal-label">Limited breadth</div><strong id="dep-shallow">—</strong><div class="metric-copy">Adopters using AI in three or fewer functions</div></div></div><div class="question-block"><h3>Current reading</h3><p id="dep-reading">Loading evidence…</p></div><div class="method" id="dep-scope"></div></section><div class="section-label">4 · Economic value</div><section class="monitor-panel"><div class="panel-head"><h2>Is AI producing enough economic value to support the demand story?</h2><div class="source-note">Primary studies + provider disclosures<br>No composite ROI score</div></div><div class="evidence-layers" id="economic-layers"></div><div class="question-block"><h3>Current reading</h3><p id="economic-reading">Loading evidence…</p></div></section>`;

html = html.replace('<section class="evidence-grid">', insertion + '<section class="evidence-grid">');
html = html.replace('loadPayment().catch(()=>{document.getElementById(\'intensity-change\').textContent=\'Data unavailable\';});', `loadPayment().catch(()=>{document.getElementById('intensity-change').textContent='Data unavailable';});async function loadDeployment(){const r=await fetch('./deployment.json');const d=await r.json();document.getElementById('dep-firm').textContent=d.firmUsePercent+'%';document.getElementById('dep-employment').textContent=d.employmentWeightedUsePercent+'%';document.getElementById('dep-task').textContent=d.workerTaskUsePercent+'%';document.getElementById('dep-shallow').textContent=d.threeOrFewerFunctionsPercent+'%';document.getElementById('dep-reading').textContent=d.reading;document.getElementById('dep-scope').textContent=d.scope;}async function loadEconomic(){const r=await fetch('./economic-value.json');const d=await r.json();document.getElementById('economic-layers').innerHTML=d.layers.map(x=>'<div class="evidence-layer"><div class="signal-label">'+x.name+'</div><div class="signal-state '+(x.status.includes('Positive')||x.status.includes('Strong')?'up':'unknown')+'">'+x.status+'</div><div class="metric">'+x.metric+'</div><p>'+x.detail+'</p><div class="method">'+x.source+'</div></div>').join('');document.getElementById('economic-reading').textContent=d.reading;}loadDeployment().catch(()=>{document.getElementById('dep-reading').textContent='Data unavailable';});loadEconomic().catch(()=>{document.getElementById('economic-reading').textContent='Data unavailable';});`);

fs.writeFileSync(page, html);
console.log('Enriched AI Downstream Demand Monitor');
