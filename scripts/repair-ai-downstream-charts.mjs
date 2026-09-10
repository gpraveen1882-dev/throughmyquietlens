import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const page = path.join(root, 'dist', 'projects', 'ai-downstream-demand', 'index.html');
if (!fs.existsSync(page)) throw new Error(`Missing monitor page: ${page}`);

let html = fs.readFileSync(page, 'utf8');

const css = `<style data-ai-static-charts="true">
.comparison-chart{margin-top:18px}.comparison-group{border-top:1px solid var(--rule);padding:14px 0}.comparison-group:first-child{border-top:0}.comparison-title{font-size:.78rem;font-weight:700;margin-bottom:10px}.comparison-row{display:grid;grid-template-columns:150px minmax(0,1fr) 48px;gap:10px;align-items:center;margin:8px 0}.comparison-row span{font-size:.72rem;color:var(--muted)}.comparison-track{height:16px;background:#edf0f2;position:relative;overflow:hidden}.comparison-bar{height:100%;background:var(--accent)}.comparison-bar-secondary{opacity:.58}.comparison-row strong{text-align:right;font-family:Georgia,serif;font-size:1rem}.comparison-scale{display:flex;justify-content:space-between;align-items:center;font-size:.66rem;color:var(--muted);margin:6px 0 0 160px}.comparison-scale span{margin:0 auto}
.ai-static-line{margin-top:16px}.ai-static-line svg{display:block;width:100%;height:auto}.ai-static-line .g{stroke:#e7eaee;stroke-width:1}.ai-static-line .l{fill:none;stroke:var(--accent);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.ai-static-line .p{fill:var(--accent)}.ai-static-line .a{font:11px Arial,sans-serif;fill:#737b86}.ai-static-line .v{font:bold 11px Arial,sans-serif;fill:#26312f}.ai-static-caption{font-size:.72rem;line-height:1.5;color:var(--muted);margin-top:8px}.ai-growth{border-top:1px solid var(--rule);margin-top:18px;padding-top:16px}.ai-growth-title{font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:12px}.ai-growth-row{display:grid;grid-template-columns:95px minmax(0,1fr) 70px;gap:10px;align-items:center;margin:9px 0}.ai-growth-row span{font-size:.72rem;color:var(--muted)}.ai-growth-track{height:18px;background:#edf0f2;overflow:hidden}.ai-growth-fill{height:100%;background:var(--accent)}.ai-growth-fill.secondary{opacity:.55}.ai-growth-row strong{text-align:right;font-family:Georgia,serif;font-size:1rem}
@media(max-width:650px){.comparison-row{grid-template-columns:108px minmax(0,1fr) 44px}.comparison-scale{margin-left:118px}.ai-growth-row{grid-template-columns:82px minmax(0,1fr) 64px}}
</style>`;

if (!html.includes('data-ai-static-charts="true"')) html = html.replace('</head>', css + '</head>');

const costSvg = `<div class="ai-static-line" id="token-cost-trend" aria-label="Ramp effective AI token cost over time"><svg viewBox="0 0 720 240" role="img" aria-label="Ramp effective AI token cost checkpoints from March to September 2026 on a December 2025 to September 2026 timeline"><line x1="62" y1="188" x2="698" y2="188" class="g"/><line x1="62" y1="139" x2="698" y2="139" class="g"/><line x1="62" y1="90" x2="698" y2="90" class="g"/><line x1="62" y1="41" x2="698" y2="41" class="g"/><text x="52" y="192" text-anchor="end" class="a">$0.60</text><text x="52" y="143" text-anchor="end" class="a">$0.80</text><text x="52" y="94" text-anchor="end" class="a">$1.00</text><text x="52" y="45" text-anchor="end" class="a">$1.20</text><line x1="62" y1="198" x2="698" y2="198" stroke="#bcc3cb" stroke-width="1"/><text x="62" y="226" text-anchor="middle" class="a">Dec 2025</text><text x="274" y="226" text-anchor="middle" class="a">Mar 2026</text><text x="345" y="226" text-anchor="middle" class="a">Apr 2026</text><text x="698" y="226" text-anchor="middle" class="a">Sep 2026</text><polyline points="274,53 345,159 698,169" class="l"/><circle cx="274" cy="53" r="5" class="p"/><circle cx="345" cy="159" r="5" class="p"/><circle cx="698" cy="169" r="5" class="p"/><text x="274" y="38" text-anchor="middle" class="v">$1.15</text><text x="345" y="145" text-anchor="middle" class="v">$0.72</text><text x="698" y="155" text-anchor="middle" class="v">$0.68</text></svg></div>`;

const growthBlock = `<div class="ai-growth"><div class="ai-growth-title">Usage is growing faster than spend</div><div class="ai-growth-row"><span>Token usage</span><div class="ai-growth-track"><div class="ai-growth-fill" style="width:100%"></div></div><strong>+1,001%</strong></div><div class="ai-growth-row"><span>Dollar spend</span><div class="ai-growth-track"><div class="ai-growth-fill secondary" style="width:49.7%"></div></div><strong>+497%</strong></div><div class="ai-static-caption">Ramp-observed businesses, Jan 2025 → Apr 2026. Different period from the cost chart; shown as supporting context, not as a continuous monthly series.</div></div>`;

const replacement = `<div class="trend-kicker">Effective token cost paid by businesses</div>${costSvg}<div class="ai-static-caption">Dec 2025 → Sep 2026 viewing window. Published Ramp checkpoints only; months without verified observations are left blank rather than interpolated. The measure is a weighted effective cost across observed model tiers and usage patterns, not a simple provider list-price average.</div>${growthBlock}`;

html = html.replace(/<div class="trend-kicker">Effective token cost over time<\/div>[\s\S]*?(?=<div class="method" id="payment-scope">)/, replacement);
html = html.replace(/<div[^>]*id="token-cost-trend"[^>]*>[\s\S]*?<\/div><div class="ai-static-caption">Published Ramp checkpoints\.[\s\S]*?<\/div>/, `${costSvg}<div class="ai-static-caption">Dec 2025 → Sep 2026 viewing window. Published Ramp checkpoints only; months without verified observations are left blank rather than interpolated. The measure is a weighted effective cost across observed model tiers and usage patterns, not a simple provider list-price average.</div>${growthBlock}`);

html = html.replace(/<script[^>]*data-time-trend-visual="true"[^>]*>[\s\S]*?<\/script>/g, '');
html = html.replace(/<script[^>]*data-ai-chart-repair-script="true"[^>]*>[\s\S]*?<\/script>/g, '');

fs.writeFileSync(page, html);
console.log('Rendered aligned payment trend and usage-vs-spend context');
