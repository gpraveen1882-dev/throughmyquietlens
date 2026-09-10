import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const page = path.join(root, 'dist', 'projects', 'ai-downstream-demand', 'index.html');
if (!fs.existsSync(page)) throw new Error(`Missing monitor page: ${page}`);

let html = fs.readFileSync(page, 'utf8');

const repairCss = `<style data-ai-chart-repair="true">
.ai-snapshot-chart{margin-top:16px}.ai-snapshot-group{margin:0 0 16px}.ai-snapshot-title{font:700 .78rem Arial,sans-serif;margin:0 0 8px}.ai-snapshot-row{display:grid;grid-template-columns:150px minmax(0,1fr) 48px;gap:10px;align-items:center;margin:8px 0}.ai-snapshot-row span{font-size:.72rem;color:var(--muted)}.ai-snapshot-track{height:16px;background:#edf0f2;position:relative}.ai-snapshot-fill{height:100%;background:var(--accent)}.ai-snapshot-fill.alt{opacity:.58}.ai-snapshot-row strong{text-align:right;font-family:Georgia,serif;font-size:1rem}.ai-snapshot-scale{display:flex;justify-content:space-between;margin:4px 0 0 160px;font-size:.66rem;color:var(--muted)}
.ai-line-chart{margin-top:16px}.ai-line-chart svg{display:block;width:100%;height:auto}.ai-chart-note{font-size:.72rem;line-height:1.5;color:var(--muted);margin-top:8px}.ai-chart-kicker{font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-top:16px}
@media(max-width:650px){.ai-snapshot-row{grid-template-columns:108px minmax(0,1fr) 44px}.ai-snapshot-scale{margin-left:118px}}
</style>`;

if (!html.includes('data-ai-chart-repair="true"')) html = html.replace('</head>', repairCss + '</head>');

const repairScript = `<script data-ai-chart-repair-script="true">(function(){
function sectionAfter(labelStart){const labels=[...document.querySelectorAll('.section-label')];const label=labels.find(x=>x.textContent.trim().startsWith(labelStart));return label?label.nextElementSibling:null;}
function makeSnapshot(){const sec=sectionAfter('2 · Deployment');if(!sec)return;const article=sec.querySelector('article');if(!article||article.querySelector('.ai-snapshot-chart'))return;const oldRows=[...article.querySelectorAll('.vendor-row,.comparison-chart,.trend-stats,.trend-kicker')];oldRows.forEach(x=>x.remove());const chart=document.createElement('div');chart.className='ai-snapshot-chart';chart.innerHTML='<div class="ai-chart-kicker">Latest structural snapshot</div><div class="ai-snapshot-group"><div class="ai-snapshot-title">Firms using AI in a business function</div><div class="ai-snapshot-row"><span>Firms</span><div class="ai-snapshot-track"><div class="ai-snapshot-fill" style="width:36%"></div></div><strong>18%</strong></div><div class="ai-snapshot-row"><span>Employment-weighted</span><div class="ai-snapshot-track"><div class="ai-snapshot-fill alt" style="width:64%"></div></div><strong>32%</strong></div></div><div class="ai-snapshot-group"><div class="ai-snapshot-title">Workers using AI for work tasks</div><div class="ai-snapshot-row"><span>Firms</span><div class="ai-snapshot-track"><div class="ai-snapshot-fill" style="width:46%"></div></div><strong>23%</strong></div><div class="ai-snapshot-row"><span>Employment-weighted</span><div class="ai-snapshot-track"><div class="ai-snapshot-fill alt" style="width:82%"></div></div><strong>41%</strong></div></div><div class="ai-snapshot-scale"><span>0%</span><span>50%</span></div>';const head=article.querySelector('.panel-head');if(head)head.insertAdjacentElement('afterend',chart);else article.prepend(chart);}
function lineSvg(points){const W=660,H=220,L=54,R=22,T=24,B=42,min=.6,max=1.25,pw=W-L-R,ph=H-T-B;const xy=points.map((p,i)=>({x:L+i*pw/(points.length-1),y:T+(max-p.value)/(max-min)*ph,...p}));let s='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Ramp effective AI token cost over time">';[.6,.8,1.0,1.2].forEach(v=>{const y=T+(max-v)/(max-min)*ph;s+='<line x1="'+L+'" y1="'+y+'" x2="'+(W-R)+'" y2="'+y+'" class="gridline"/><text x="'+(L-9)+'" y="'+(y+4)+'" text-anchor="end" class="axis">$'+v.toFixed(2)+'</text>';});s+='<polyline points="'+xy.map(p=>p.x+','+p.y).join(' ')+'" class="series"/>';xy.forEach(p=>{s+='<circle cx="'+p.x+'" cy="'+p.y+'" r="5" class="point"/><text x="'+p.x+'" y="'+(p.y-12)+'" text-anchor="middle" class="value-label">$'+p.value.toFixed(2)+'</text><text x="'+p.x+'" y="'+(H-15)+'" text-anchor="middle" class="axis">'+p.label+'</text>';});return s+'</svg>';}
function makePaymentTrend(){const sec=sectionAfter('3 · Payment & intensity');if(!sec)return;const article=sec.querySelector('article');if(!article)return;let host=article.querySelector('#token-cost-trend');if(!host){const vendors=article.querySelector('#payment-vendors');const kicker=document.createElement('div');kicker.className='ai-chart-kicker';kicker.textContent='Effective token cost over time';host=document.createElement('div');host.id='token-cost-trend';host.className='ai-line-chart';const note=document.createElement('div');note.className='ai-chart-note';note.textContent='Published Ramp checkpoints. Effective price paid across observed model mix; missing months are not interpolated.';if(vendors){vendors.insertAdjacentElement('afterend',note);note.insertAdjacentElement('beforebegin',host);host.insertAdjacentElement('beforebegin',kicker);}else{article.append(kicker,host,note);}}host.classList.add('ai-line-chart');host.innerHTML=lineSvg([{label:'Mar 2026',value:1.15},{label:'Apr 2026',value:.72},{label:'Sep 2026',value:.68}]);}
makeSnapshot();makePaymentTrend();
})();</script>`;

if (!html.includes('data-ai-chart-repair-script="true"')) html = html.replace('</body>', repairScript + '</body>');

fs.writeFileSync(page, html);
console.log('Repaired downstream chart rendering');
