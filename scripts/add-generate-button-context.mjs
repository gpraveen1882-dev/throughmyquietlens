import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'content', 'essays.json');
const essays = JSON.parse(fs.readFileSync(file, 'utf8'));
const essay = essays.find((e) => e.slug === 'the-generate-button-tells-us-nothing');

if (!essay) {
  throw new Error('Generate Button essay not found');
}

const contextBlock = `<p>AI is not the largest consumer of electricity in the world. Far from it. But the demand behind AI and data centres is growing quickly, and the infrastructure underneath it is remarkably physical — power plants and grids, servers and cooling systems, land and water.</p><p>Much of that will become more efficient, and more of the electricity can come from cleaner sources. But demand is growing at the same time. What interests me is that almost none of this is visible at the point where that demand begins: with us.</p>`;

const anchor = `<p>I don't think generating an image for fun is wrong. Nor am I arguing that AI is necessarily worse than other ways of creating something. A designer working on a computer uses electricity too.</p>`;

if (!essay.bodyHtml.includes('AI is not the largest consumer of electricity in the world. Far from it.')) {
  if (essay.bodyHtml.includes(anchor)) {
    essay.bodyHtml = essay.bodyHtml.replace(anchor, anchor + contextBlock);
  } else {
    throw new Error('Expected insertion point not found in Generate Button essay');
  }
}

const sourceBlock = `<p><strong><a href="https://www.iea.org/reports/energy-and-ai" rel="noopener noreferrer">International Energy Agency — <em>Energy and AI</em></a></strong><br>Analysis of global data-centre electricity demand, AI-driven growth, energy supply and the infrastructure implications of expanding compute.</p>`;

if (!essay.bodyHtml.includes('International Energy Agency — <em>Energy and AI</em>')) {
  essay.bodyHtml = essay.bodyHtml.replace('</p>`', '</p>`');
  const lastSource = `<p><strong><a href="https://eta-publications.lbl.gov/publications/water-use-data-center-workloads" rel="noopener noreferrer">Lawrence Berkeley National Laboratory — <em>The Water Use of Data Center Workloads</em> (2025)</a></strong><br>Research examining how data-centre workload water use varies with cooling technology, climate, electricity source, server efficiency and other factors.</p>`;
  if (essay.bodyHtml.includes(lastSource)) {
    essay.bodyHtml = essay.bodyHtml.replace(lastSource, lastSource + '\n' + sourceBlock);
  } else {
    essay.bodyHtml += '\n' + sourceBlock;
  }
}

fs.writeFileSync(file, JSON.stringify(essays, null, 2) + '\n');
