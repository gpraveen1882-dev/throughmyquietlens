import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'dist', 'essays', 'the-generate-button-tells-us-nothing', 'index.html');

if (!fs.existsSync(file)) process.exit(0);

let html = fs.readFileSync(file, 'utf8');

const frame = (inner, caption) => `<figure style="max-width:720px;margin:1.7rem auto 2rem;padding:0;border:1px solid rgba(40,40,40,.12);border-radius:16px;overflow:hidden;background:#fff;box-shadow:0 8px 24px rgba(0,0,0,.05)">${inner}<figcaption style="padding:.7rem 1rem .85rem;font-size:.82rem;line-height:1.45;color:#6b675f;background:#faf8f4;border-top:1px solid rgba(40,40,40,.08)">${caption}</figcaption></figure>`;

const utility = frame(`
<div role="img" aria-label="Illustrative utility statement showing electricity-use trend and comparison with similar households" style="padding:1.25rem 1.3rem 1.35rem;background:#f7f7f5;color:#242424;font-family:Arial,sans-serif">
  <div style="display:flex;justify-content:space-between;gap:1rem;align-items:flex-start;margin-bottom:1.2rem">
    <div><div style="font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:#777">Electricity usage</div><div style="font-size:1.35rem;font-weight:700;margin-top:.22rem">Your household</div></div>
    <div style="font-size:.82rem;color:#666;text-align:right">Monthly statement<br>Usage summary</div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:.55rem;align-items:end;height:150px;padding:0 .2rem 1.8rem;border-bottom:1px solid #d7d5cf;position:relative">
    <div style="height:44%;background:#b7b4ad;border-radius:5px 5px 0 0"></div><div style="height:58%;background:#9f9b93;border-radius:5px 5px 0 0"></div><div style="height:52%;background:#aaa69e;border-radius:5px 5px 0 0"></div><div style="height:72%;background:#8f8b83;border-radius:5px 5px 0 0"></div><div style="height:64%;background:#99958d;border-radius:5px 5px 0 0"></div><div style="height:48%;background:#6f6b64;border-radius:5px 5px 0 0"></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:.8rem;margin-top:1rem">
    <div style="padding:.8rem;border-radius:10px;background:#fff"><div style="font-size:.74rem;color:#777">Compared with last month</div><div style="font-size:1.1rem;font-weight:700;margin-top:.15rem">Usage changed</div></div>
    <div style="padding:.8rem;border-radius:10px;background:#fff"><div style="font-size:.74rem;color:#777">Compared with similar homes</div><div style="font-size:1.1rem;font-weight:700;margin-top:.15rem">Benchmark visible</div></div>
  </div>
</div>`, 'Illustrative utility-statement view: consumption, trend and a comparison benchmark.');

const screenTime = frame(`
<div role="img" aria-label="Illustrative weekly Screen Time report showing daily average and change from the previous week" style="padding:1.25rem 1.3rem 1.4rem;background:#111;color:#f4f4f4;font-family:Arial,sans-serif">
  <div style="font-size:.78rem;color:#aaa;margin-bottom:.18rem">Screen Time</div>
  <div style="font-size:1.35rem;font-weight:700">Weekly report</div>
  <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;margin-top:1.15rem">
    <div><div style="font-size:.76rem;color:#aaa">Daily Average</div><div style="font-size:2rem;font-weight:700;letter-spacing:-.03em">4h 18m</div></div>
    <div style="font-size:.82rem;color:#bbb;text-align:right">Change from<br>last week</div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:.5rem;align-items:end;height:115px;margin-top:1rem;padding-bottom:.75rem;border-bottom:1px solid #333">
    <div style="height:52%;background:#777;border-radius:4px 4px 0 0"></div><div style="height:68%;background:#8a8a8a;border-radius:4px 4px 0 0"></div><div style="height:48%;background:#707070;border-radius:4px 4px 0 0"></div><div style="height:78%;background:#969696;border-radius:4px 4px 0 0"></div><div style="height:58%;background:#808080;border-radius:4px 4px 0 0"></div><div style="height:88%;background:#aaa;border-radius:4px 4px 0 0"></div><div style="height:62%;background:#858585;border-radius:4px 4px 0 0"></div>
  </div>
  <div style="font-size:.78rem;color:#aaa;margin-top:.85rem">A pattern becomes visible without stopping you from using the phone.</div>
</div>`, 'Illustrative weekly activity report: total use and change over time.');

const resource = frame(`
<div role="img" aria-label="Illustrative AI Resource Report showing weekly estimated energy, image generations and trend" style="padding:1.3rem;background:#f4f0e8;color:#26231f;font-family:Arial,sans-serif">
  <div style="font-size:.72rem;letter-spacing:.09em;text-transform:uppercase;color:#777066">A possible interface</div>
  <div style="font-size:1.45rem;font-weight:700;margin:.2rem 0 1rem">Your AI Resource Report</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem">
    <div style="padding:.9rem;background:#fff;border-radius:11px"><div style="font-size:.74rem;color:#777">Estimated energy this week</div><div style="font-size:1.25rem;font-weight:700;margin-top:.18rem">Range shown</div></div>
    <div style="padding:.9rem;background:#fff;border-radius:11px"><div style="font-size:.74rem;color:#777">Change from last week</div><div style="font-size:1.25rem;font-weight:700;margin-top:.18rem">Trend shown</div></div>
    <div style="padding:.9rem;background:#fff;border-radius:11px"><div style="font-size:.74rem;color:#777">Images generated</div><div style="font-size:1.25rem;font-weight:700;margin-top:.18rem">Activity count</div></div>
    <div style="padding:.9rem;background:#fff;border-radius:11px"><div style="font-size:.74rem;color:#777">Your longer-term average</div><div style="font-size:1.25rem;font-weight:700;margin-top:.18rem">Baseline shown</div></div>
  </div>
  <div style="margin-top:.85rem;font-size:.77rem;line-height:1.45;color:#6d665c">Not a warning. Not a guilt score. A feedback layer with uncertainty made explicit.</div>
</div>`, 'Illustrative concept only — not a claim that today’s platforms can provide a perfectly precise per-user footprint.');

html = html.replace(/<p>\s*<img[^>]*src="\/images\/generate-button-sp\.jpg"[^>]*>\s*<\/p>/i, utility);
html = html.replace(/<p>\s*<img[^>]*src="\/images\/generate-button-screen-time\.jpg"[^>]*>\s*<\/p>/i, screenTime);

const reportBlock = /<p>Imagine a simple weekly report:<\/p>\s*<p><strong>Your AI Resource Report<\/strong><\/p>\s*<p>Estimated energy used this week<br>Change from last week<br>Number of images generated<br>Energy used by image generation<br>Your average over time<\/p>/i;
html = html.replace(reportBlock, `<p>Imagine a simple weekly report:</p>${resource}`);

fs.writeFileSync(file, html);
