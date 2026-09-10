import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const page = path.join(root, 'dist', 'projects', 'ai-downstream-demand', 'index.html');
if (!fs.existsSync(page)) throw new Error(`Missing monitor page: ${page}`);

let html = fs.readFileSync(page, 'utf8');

if (!html.includes('id="driver-industry"')) {
  html = html.replace(
    '<div class="industry-controls" role="group" aria-label="Choose adoption view"><button class="industry-toggle" id="industry-current" type="button" aria-pressed="true">Current use</button><button class="industry-toggle" id="industry-expected" type="button" aria-pressed="false">Expected use</button></div>',
    '<div class="industry-controls" role="group" aria-label="Choose adoption breakdown"><button class="industry-toggle" id="driver-industry" type="button" aria-pressed="true">Industry</button><button class="industry-toggle" id="driver-size" type="button" aria-pressed="false">Firm size</button><span aria-hidden="true" style="width:8px"></span><button class="industry-toggle" id="industry-current" type="button" aria-pressed="true">Current use</button><button class="industry-toggle" id="industry-expected" type="button" aria-pressed="false">Expected use</button></div>'
  );
}

if (!html.includes('.industry-toggle:disabled')) {
  html = html.replace('.industry-toggle[aria-pressed="true"]{', '.industry-toggle:disabled{opacity:.45;cursor:not-allowed}.industry-toggle[aria-pressed="true"]{');
}

const enhancement = `<script>(function(){const industryBtn=document.getElementById('driver-industry'),sizeBtn=document.getElementById('driver-size'),currentBtn=document.getElementById('industry-current'),expectedBtn=document.getElementById('industry-expected'),chart=document.getElementById('industry-chart'),reference=document.getElementById('industry-reference'),method=document.getElementById('industry-method');if(!industryBtn||!sizeBtn||!currentBtn||!expectedBtn||!chart)return;let mode='industry',sizeData=null;function pressed(el,on){el.setAttribute('aria-pressed',on?'true':'false')}function renderSize(){if(!sizeData)return;const rows=[...sizeData.sizes].sort((a,b)=>b.currentPercent-a.currentPercent);const max=45;chart.innerHTML=rows.map(x=>'<div class="industry-row"><div class="industry-name">'+x.name+'</div><div class="industry-track" role="img" aria-label="'+x.name+' '+x.currentPercent+' percent"><div class="industry-bar" style="width:'+Math.min(100,x.currentPercent/max*100)+'%"></div></div><div class="industry-value">'+x.currentPercent.toFixed(1)+'%</div></div>').join('');reference.textContent='Current AI use · '+sizeData.referencePeriod+'. Census reported 32% for firms with 100–249 employees and 37% for firms with 250+ employees.';method.textContent=sizeData.note;}fetch('./firm-size-adoption.json').then(r=>r.json()).then(d=>{sizeData=d;}).catch(()=>{});industryBtn.addEventListener('click',()=>{mode='industry';pressed(industryBtn,true);pressed(sizeBtn,false);expectedBtn.disabled=false;currentBtn.click();});sizeBtn.addEventListener('click',()=>{mode='size';pressed(industryBtn,false);pressed(sizeBtn,true);expectedBtn.disabled=true;pressed(currentBtn,true);pressed(expectedBtn,false);if(sizeData)renderSize();else fetch('./firm-size-adoption.json').then(r=>r.json()).then(d=>{sizeData=d;renderSize();}).catch(()=>{reference.textContent='Firm-size data unavailable.';});});currentBtn.addEventListener('click',()=>{if(mode==='size')setTimeout(renderSize,0);});expectedBtn.addEventListener('click',()=>{if(mode==='size'){mode='industry';pressed(industryBtn,true);pressed(sizeBtn,false);expectedBtn.disabled=false;}});})();</script>`;

if (!html.includes("fetch('./firm-size-adoption.json')")) {
  html = html.replace('</body></html>', enhancement + '</body></html>');
}

fs.writeFileSync(page, html);
console.log('Finished AI Downstream Demand interactive adoption view');
