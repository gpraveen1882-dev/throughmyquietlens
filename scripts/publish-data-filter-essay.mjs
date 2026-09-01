import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const url = '/essays/when-the-data-is-right-but-the-comparison-is-wrong/';
const title = 'When the Data Is Right, but the Comparison Is Wrong';
const description = 'A reflection on data, comparisons and why human judgment matters even more when information becomes abundant.';

const edit = (relativePath, transform) => {
  const file = path.join(dist, relativePath);
  if (!fs.existsSync(file)) return;
  const current = fs.readFileSync(file, 'utf8');
  if (current.includes(url)) return;
  fs.writeFileSync(file, transform(current));
};

edit('index.html', html => html.replace(
  '<div class="home-recent-list">',
  `<div class="home-recent-list"><article class="home-recent-item"><h3><a href="${url}">${title}</a></h3><p class="pub-date home-recent-date">1 September 2026</p><p>${description}</p><a class="read-link" href="${url}">Read →</a></article>`
));

edit('essays/index.html', html => html.replace(
  '<div class="container list">',
  `<div class="container list"><article class="list-item"><div class="meta"><span>Through My Quiet Lens</span><span class="pub-date">1 September 2026</span><span>2 min read</span></div><div><h2><a href="${url}">${title}</a></h2><p>${description}</p><div class="tags"><span class="tag">#Data</span><span class="tag">#Judgment</span><span class="tag">#AI</span></div></div><a href="${url}" aria-label="Read ${title}">Read →</a></article>`
));

edit('library/index.html', html => {
  let out = html.replace(
    '<div class="library-all" id="library-all">',
    `<div class="library-all" id="library-all"><article data-search="when the data is right but the comparison is wrong data comparisons judgment ai"><div class="meta"><span>Through My Quiet Lens</span><span>2 min read</span><span class="pub-date">1 September 2026</span></div><h3><a href="${url}">${title}</a></h3><p>${description}</p><div class="tags"><span class="tag">#Data</span><span class="tag">#Judgment</span><span class="tag">#AI</span></div></article>`
  );
  out = out.replace(/(\d+) published pieces across the main written collections\./, (_, n) => `${Number(n) + 1} published pieces across the main written collections.`);
  return out;
});

edit('sitemap.xml', html => html.replace(
  '</urlset>',
  `<url><loc>https://throughmyquietlens.com${url}</loc></url></urlset>`
));
