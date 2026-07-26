import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
const contentDir = path.join(root, 'content');
const publicDir = path.join(root, 'public');
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(contentDir, name), 'utf8'));
const site = readJson('site.json');
const essays = readJson('essays.json');
const principles = readJson('principles.json');
const conversations = readJson('conversations.json');
const dc = readJson('dcdecoded.json');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.cpSync(publicDir, out, { recursive: true });

const esc = (s='') => String(s).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const prettyDate = (d) => d ? new Intl.DateTimeFormat('en-GB', { day:'numeric', month:'long', year:'numeric' }).format(new Date(`${d}T12:00:00Z`)) : '';
const dateHtml = (e) => e.date ? `<span>${prettyDate(e.date)}</span>` : (e.source ? `<span>Originally published on ${esc(e.source)}</span>` : '');
const articleBody = (e) => e.bodyHtml || (e.body || []).map(p=>`<p>${esc(p)}</p>`).join('');
const sourceNote = (e) => e.source ? `<div class="source-note">Originally published on ${esc(e.source)}. Republished here as part of the Through My Quiet Lens archive.</div>` : '';
const tagHtml = (tags=[]) => `<div class="tags">${tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>`;

function nav(active='') {
  const items = [
    ['Essays','/essays/','essays'],['Working Principles','/principles/','principles'],['5% Conversations','/conversations/','conversations'],['DC Decoded','/dc-decoded/','dc'],['About','/about/','about']
  ];
  return `<header><div class="container nav"><a class="brand" href="/">Through My Quiet Lens</a><button class="menu-button" aria-label="Open menu" aria-expanded="false">Menu</button><nav class="nav-links" aria-label="Primary">${items.map(([label,url,key])=>`<a href="${url}"${active===key?' aria-current="page"':''}>${label}</a>`).join('')}</nav></div></header>`;
}

function footer() {
  return `<footer><div class="container"><div class="footer-grid"><div><div class="footer-brand">Through My Quiet Lens</div><p>Thoughtful observations by ${esc(site.author)}.</p></div><div class="footer-links"><a href="/essays/">Essays</a><a href="/principles/">Principles</a><a href="/conversations/">Podcast</a><a href="/about/">About</a><a href="${esc(site.linkedin)}">LinkedIn</a><a href="/rss.xml">RSS</a></div></div><div class="copyright">© <span class="year"></span> ${esc(site.author)}. Built for reading, not scrolling.</div></div></footer>`;
}

function layout({title=site.title, description=site.description, body, active='', canonical='/'}) {
  const fullTitle = title === site.title ? title : `${title} — ${site.title}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(fullTitle)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${site.url}${canonical}"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website"><meta property="og:url" content="${site.url}${canonical}"><meta name="twitter:card" content="summary"><link rel="icon" href="/favicon.svg"><link rel="alternate" type="application/rss+xml" title="${esc(site.title)}" href="/rss.xml"><link rel="stylesheet" href="/styles.css"></head><body><a class="skip-link" href="#main">Skip to content</a><div class="site-shell">${nav(active)}<main id="main">${body}</main>${footer()}</div><script src="/site.js" defer></script></body></html>`;
}

function write(route, html) {
  const file = route.endsWith('.xml') || route.endsWith('.txt') ? path.join(out, route) : path.join(out, route, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

const featured = essays.find(x=>x.featured) || essays[0];
const recent = essays.filter(x=>x.slug!==featured.slug).slice(0,3);
const home = `<section class="hero"><div class="container"><p class="eyebrow">An independent publication</p><h1>Through My Quiet Lens</h1><p class="welcome">Thank you for choosing to pause and explore.</p><p class="intro">Some ideas reveal themselves quickly. Others take time, quiet observation, and a willingness to look again. This is a place for the second kind.</p><p class="sub">A collection of essays, conversations and reflections on work, leadership, technology and everyday life.</p><a class="button" href="/essays/${featured.slug}/">Start reading <span aria-hidden="true">→</span></a></div></section>
<section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Featured essay</p><h2>Begin here</h2></div><p>A considered starting point for understanding the ideas that shape this publication.</p></div><article class="featured"><div><div class="meta">${dateHtml(featured)}<span>${featured.readingTime}</span></div><h3><a href="/essays/${featured.slug}/">${esc(featured.title)}</a></h3></div><div><p>${esc(featured.description)}</p>${tagHtml(featured.tags)}<p><a class="read-link" href="/essays/${featured.slug}/">Read the essay →</a></p></div></article></div></section>
<section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Recent writing</p><h2>Ideas in progress</h2></div><a href="/essays/">View all essays →</a></div><div class="cards">${recent.map(e=>`<article class="card"><div class="meta">${dateHtml(e)}<span>${e.readingTime}</span></div><h3><a href="/essays/${e.slug}/">${esc(e.title)}</a></h3><p>${esc(e.description)}</p><a class="read-link" href="/essays/${e.slug}/">Continue reading →</a></article>`).join('')}</div></div></section>
<section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Explore</p><h2>Four ways into the work</h2></div><p>Follow the kind of thinking that interests you rather than the date it was published.</p></div><div class="collections"><a class="collection" href="/essays/"><h3>Essays</h3><p>Longer reflections on work, leadership, relationships, technology and everyday life.</p></a><a class="collection" href="/principles/"><h3>Working Principles</h3><p>Ideas distilled from experience and expressed simply enough to carry forward.</p></a><a class="collection" href="/conversations/"><h3>5% Conversations</h3><p>Conversations that move beyond the familiar introduction and into what shaped someone.</p></a><a class="collection" href="/dc-decoded/"><h3>DC Decoded</h3><p>A specialist lens on data centres, digital infrastructure, power and the systems behind technology.</p></a></div></div></section>
<section class="section"><div class="container about-grid"><aside><p class="eyebrow">About the author</p><p>Commercial leader, reflective writer, podcast host and lifelong student.</p></aside><div><h2>Hi, I’m Praveen.</h2><p>I write because writing helps me understand. Over the years I have worked across India, Singapore and the United States in commercial leadership and mission-critical infrastructure. The ideas that stay with me, however, often come from quieter moments—conversations, negotiations, classrooms, family and everyday experiences.</p><p><a href="/about/">More about this publication and the person behind it →</a></p></div></div></section>`;
write('', layout({body:home, canonical:'/'}));

const essaysList = `<section class="page-hero"><div class="container"><p class="eyebrow">Writing</p><h1 class="page-title">Essays</h1><p class="page-lead">Stories and reflections that explore an idea rather than rush towards a conclusion.</p></div></section><section class="section"><div class="container list">${essays.map(e=>`<article class="list-item"><div class="meta">${dateHtml(e)}<span>${e.readingTime}</span></div><div><h2><a href="/essays/${e.slug}/">${esc(e.title)}</a></h2><p>${esc(e.description)}</p>${tagHtml(e.tags)}</div><a href="/essays/${e.slug}/" aria-label="Read ${esc(e.title)}">Read →</a></article>`).join('')}</div></section>`;
write('essays', layout({title:'Essays', description:'Essays by Praveen Gangaraju.', body:essaysList, active:'essays', canonical:'/essays/'}));

for (const e of essays) {
  const related = essays.filter(x=>x.slug!==e.slug).slice(0,2);
  const body = `<article><header class="article-head"><div class="reading"><p class="eyebrow">Essay</p><h1>${esc(e.title)}</h1><p class="deck">${esc(e.description)}</p><div class="meta">${dateHtml(e)}<span>${e.readingTime}</span></div>${tagHtml(e.tags)}</div></header><div class="article reading">${articleBody(e)}${sourceNote(e)}<div class="article-end"><strong>Continue exploring</strong>${related.map(r=>`<p><a href="/essays/${r.slug}/">${esc(r.title)} →</a></p>`).join('')}</div></div></article>`;
  write(`essays/${e.slug}`, layout({title:e.title, description:e.description, body, active:'essays', canonical:`/essays/${e.slug}/`}));
}

const pbody = `<section class="page-hero"><div class="container"><p class="eyebrow">A growing collection</p><h1 class="page-title">Working Principles</h1><p class="page-lead">Ideas shaped by experience. Not rules for everyone—simply principles I try to return to.</p></div></section><section class="section"><div class="container principle-grid">${principles.map(p=>`<article class="principle"><div class="num">PRINCIPLE ${String(p.number).padStart(2,'0')}</div><h2>${esc(p.title)}</h2><p>${esc(p.text)}</p></article>`).join('')}</div></section>`;
write('principles', layout({title:'Working Principles', description:'Working principles by Praveen Gangaraju.', body:pbody, active:'principles', canonical:'/principles/'}));

const c = conversations[0];
const cbody = `<section class="page-hero"><div class="container"><p class="eyebrow">Podcast</p><h1 class="page-title">5% Conversations</h1><p class="page-lead">${esc(c.description)}</p></div></section><section class="section"><div class="reading"><h2>The idea</h2><p>Most introductions tell us what someone does. The more interesting part is often the small percentage of their story that explains why they became that person.</p><p>${esc(c.status)}</p><p><a class="button" href="${esc(site.spotify)}">Listen on Spotify →</a></p></div></section>`;
write('conversations', layout({title:'5% Conversations', description:c.description, body:cbody, active:'conversations', canonical:'/conversations/'}));

const dcList = `<section class="page-hero"><div class="container"><p class="eyebrow">Infrastructure notes</p><h1 class="page-title">DC Decoded</h1><p class="page-lead">Clear-eyed observations on the systems, constraints and commercial choices behind digital infrastructure.</p></div></section><section class="section"><div class="container list">${dc.map(e=>`<article class="list-item"><div class="meta">${dateHtml(e)}<span>${e.readingTime}</span></div><div><h2><a href="/dc-decoded/${e.slug}/">${esc(e.title)}</a></h2><p>${esc(e.description)}</p></div><a href="/dc-decoded/${e.slug}/">Read →</a></article>`).join('')}</div></section>`;
write('dc-decoded', layout({title:'DC Decoded', description:'Data-centre and digital infrastructure writing by Praveen Gangaraju.', body:dcList, active:'dc', canonical:'/dc-decoded/'}));
for (const e of dc) {
  const body = `<article><header class="article-head"><div class="reading"><p class="eyebrow">DC Decoded</p><h1>${esc(e.title)}</h1><p class="deck">${esc(e.description)}</p><div class="meta">${dateHtml(e)}<span>${e.readingTime}</span></div></div></header><div class="article reading">${articleBody(e)}${sourceNote(e)}<div class="article-end"><a href="/dc-decoded/">Back to DC Decoded →</a></div></div></article>`;
  write(`dc-decoded/${e.slug}`, layout({title:e.title, description:e.description, body, active:'dc', canonical:`/dc-decoded/${e.slug}/`}));
}

const about = `<section class="page-hero"><div class="container"><p class="eyebrow">About</p><h1 class="page-title">The person behind the lens</h1><p class="page-lead">A little context for the experiences, people and places that shape the writing.</p></div></section><section class="section"><div class="container about-grid"><aside><p>Praveen Gangaraju<br>Singapore</p><p><a href="${esc(site.linkedin)}">LinkedIn →</a><br><a href="mailto:${esc(site.email)}">Email →</a></p></aside><div><section><h2>Why I write</h2><p>I do not write because I have all the answers. I write because the act of writing helps me understand an experience more clearly. Through My Quiet Lens is where those observations become essays, conversations and working principles.</p></section><section><h2>My journey</h2><p>I grew up in Chennai in a family of teachers and built my career across India, Singapore and the United States. Most of my professional life has been spent in commercial leadership, market development and mission-critical infrastructure. UCLA Anderson later gave me a new classroom—and a community that sharpened how I think about leadership, belonging and learning.</p></section><section><h2>Family</h2><p>My wife and daughter shape how I see success, responsibility and growth. They appear here only when a shared experience genuinely belongs in the story. This publication is personal, but it is not a public diary.</p></section><section><h2>Percy & Pluto</h2><p>I spent more than forty years without a dog. Then Percy and Pluto arrived and quietly changed how I think about patience, presence, routine, trust and home. They sometimes appear in the writing—not because this is a website about dogs, but because some of life’s most effective teachers have four legs.</p></section><section><h2>Professional background</h2><p>I have worked in commercial roles for more than fifteen years, building markets, customer relationships and infrastructure businesses across APAC and the United States. The detailed professional version lives on LinkedIn. This space is for the ideas behind the experience.</p></section></div></div></section>`;
write('about', layout({title:'About', description:'About Praveen Gangaraju and Through My Quiet Lens.', body:about, active:'about', canonical:'/about/'}));

const rssItems = essays.map(e=>`<item><title>${esc(e.title)}</title><link>${site.url}/essays/${e.slug}/</link><guid>${site.url}/essays/${e.slug}/</guid>${e.date ? `<pubDate>${new Date(`${e.date}T12:00:00Z`).toUTCString()}</pubDate>` : ''}<description>${esc(e.description)}</description></item>`).join('');
write('rss.xml', `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(site.title)}</title><link>${site.url}</link><description>${esc(site.description)}</description>${rssItems}</channel></rss>`);
const urls = ['', 'essays/', ...essays.map(e=>`essays/${e.slug}/`), 'principles/', 'conversations/', 'dc-decoded/', ...dc.map(e=>`dc-decoded/${e.slug}/`), 'about/'];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u=>`<url><loc>${site.url}/${u}</loc></url>`).join('')}</urlset>`);
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
write('404', layout({title:'Page not found', description:'This page could not be found.', body:`<section class="page-hero"><div class="reading"><p class="eyebrow">404</p><h1 class="page-title">This path ends here.</h1><p class="page-lead">The idea may have moved, or the link may be incomplete.</p><p><a class="button" href="/">Return home →</a></p></div></section>`, canonical:'/404/'}));

console.log(`Built ${urls.length + 4} files in ${out}`);
