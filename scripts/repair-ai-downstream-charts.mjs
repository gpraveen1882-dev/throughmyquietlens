import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const page = path.join(root, 'dist', 'projects', 'ai-downstream-demand', 'index.html');
if (!fs.existsSync(page)) throw new Error(`Missing monitor page: ${page}`);

let html = fs.readFileSync(page, 'utf8');

// These visuals are rendered into the HTML during the build. No browser-side JS is required.
const css = `<style data-ai-static-charts="true">
.comparison-chart{margin-top:18px}.comparison-group{border-top:1px solid var(--rule);padding:14px 0}.comparison-group:first-child{border-top:0}.comparison-title{font-size:.78rem;font-weight:700;margin-bottom:10px}.comparison-row{display:grid;grid-template-columns:150px minmax(0,1fr) 48px;gap:10px;align-items:center;margin:8px 0}.comparison-row span{font-size:.72rem;color:var(--muted)}.comparison-track{height:16px;background:#edf0f2;position:relative;overflow:hidden}.comparison-bar{height:100%;background:var(--accent)}.comparison-bar-secondary{opacity:.58}.comparison-row strong{text-align:right;font-family:Georgia,serif;font-size:1rem}.comparison-scale{display:flex;justify-content:space-between;align-items:center;font-size:.66rem;color:var(--muted);margin:6px 0 0 160px}.comparison-scale span{margin:0 auto}
.ai-static-line{margin-top:16px}.ai-static-line svg{display:block;width:100%;height:auto}.ai-static-line .g{stroke:#e7eaee;stroke-width:1}.ai-static-line .l{fill:none;stroke:var(--accent);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.ai-static-line .p{fill:var(--accent)}.ai-static-line .a{font:11px Arial,sans-serif;fill:#737b86}.ai-static-line .v{font:bold 11px Arial,sans-serif;fill:#26312f}.ai-static-caption{font-size:.72rem;line-height:1.5;color:var(--muted);margin-top:8px}
@media(max-width:650px){.comparison-row{grid-template-columns:108px minmax(0,1fr) 44px}.comparison-scale{margin-left:118px}}
</style>`;

if (!html.includes('data-ai-static-charts="true"')) html = html.replace('</head>', css + '</head>');

const costSvg = `<div class="ai-static-line" id="token-cost-trend" aria-label="Ramp effective AI token cost over time"><svg viewBox="0 0 660 220" role="img" aria-label="Ramp effective AI token cost fell from 1 dollar 15 cents per million tokens in March 2026 to 68 cents in September 2026"><line x1="54" y1="177" x2="638" y2="177" class="g"/><line x1="54" y1="130" x2="638" y2="130" class="g"/><line x1="54" y1="82" x2="638" y2="82" class="g"/><line x1="54" y1="35" x2="638" y2="35" class="g"/><text x="45" y="181" text-anchor="end" class="a">$0.60</text><text x="45" y="134" text-anchor="end" class="a">$0.80</text><text x="45" y="86" text-anchor="end" class="a">$1.00</text><text x="45" y="39" text-anchor="end" class="a">$1.20</text><polyline points="54,47 346,149 638,158" class="l"/><circle cx="54" cy="47" r="5" class="p"/><circle cx="346" cy="149" r="5" class="p"/><circle cx="638" cy="158" r="5" class="p"/><text x="54" y="33" text-anchor="middle" class="v">$1.15</text><text x="346" y="135" text-anchor="middle" class="v">$0.72</text><text x="638" y="144" text-anchor="middle" class="v">$0.68</text><text x="54" y="207" text-anchor="middle" class="a">Mar 2026</text><text x="346" y="207" text-anchor="middle" class="a">Apr 2026</text><text x="638" y="207" text-anchor="middle" class="a">Sep 2026</text></svg></div>`;

// Replace the empty/runtime chart host created earlier in the build with static SVG.
if (html.includes('id="token-cost-trend"')) {
  html = html.replace(/<div[^>]*id="token-cost-trend"[^>]*>\s*<\/div>/, costSvg);
} else {
  html = html.replace('<div id="payment-vendors" style="margin-top:12px"></div>', '<div id="payment-vendors" style="margin-top:12px"></div><div class="trend-kicker">Effective token cost over time</div>' + costSvg + '<div class="ai-static-caption">Published Ramp checkpoints. Effective price paid across observed model mix; missing months are not interpolated.</div>');
}

// Remove browser-side chart scripts so later execution cannot overwrite the build-time visuals.
html = html.replace(/<script[^>]*data-time-trend-visual="true"[^>]*>[\s\S]*?<\/script>/g, '');
html = html.replace(/<script[^>]*data-ai-chart-repair-script="true"[^>]*>[\s\S]*?<\/script>/g, '');

fs.writeFileSync(page, html);
console.log('Rendered downstream charts statically at build time');
