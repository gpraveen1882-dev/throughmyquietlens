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
const prettyDate = (d) => d ? new Intl.DateTimeFormat('en-US', { day:'numeric', month:'long', year:'numeric' }).format(new Date(`${d}T12:00:00Z`)) : '';
const dateHtml = (e) => `<span>${esc(e.collection || 'Essay')}</span>${e.date ? `<span class="pub-date">${prettyDate(e.date)}</span>` : ''}`;
const groupImagesIntoCarousels = (html='') => {
  // find runs of 2+ adjacent <img> tags (allowing only whitespace between) and wrap them in a carousel
  return html.replace(/(?:<img[^>]*>\s*){2,}/g, (run) => {
    const imgs = run.match(/<img[^>]*>/g);
    const dots = imgs.map((_, i) => `<button class="img-carousel-dot${i===0?' active':''}" aria-label="Go to photo ${i+1}"></button>`).join('');
    return `<div class="img-carousel"><div class="img-carousel-track">${imgs.join('')}</div><div class="img-carousel-dots">${dots}</div></div>`;
  });
};
const cleanLinkedInHtml = (html='') => {
  let out = html;
  out = out.replace(/<h3>\s*(?:🔖\s*)?Hashtags\s*<\/h3>/gi, '');
  out = out.replace(/<p>[^<]*(?:#(?:[A-Za-z0-9_]+)[^<]*){2,}<\/p>/gi, '');
  out = out.replace(/<p>\s*(?:👉\s*)?<strong>(?:Over to you|Your turn):?<\/strong>[\s\S]*?<\/p>/gi, '');
  out = out.replace(/<h3>\s*(?:Over to you|Your turn)\.?\s*<\/h3>/gi, '');
  out = out.replace(/<p>(?:(?!<\/p>)[\s\S])*?(?:Drop it in the comments|Share it here|This is Episode \d+ of my weekly story series)(?:(?!<\/p>)[\s\S])*?<\/p>/gi, '');
  out = out.replace(/<p>\s*(?:_|⸻|·\s*·\s*·)+\s*<\/p>/gi, '<hr>');
  return out;
};
const articleBody = (e) => groupImagesIntoCarousels(cleanLinkedInHtml(e.bodyHtml || (e.body || []).map(p=>`<p>${esc(p)}</p>`).join('')));
const sourceNote = () => '';
const shareHtml = (label='Share this reflection') => `<aside class="article-share" data-share>
  <p class="share-label">${esc(label)}</p>
  <div class="share-links">
    <a class="share-link linkedin-share" href="#" rel="noopener">LinkedIn</a>
    <button class="share-link native-share" type="button">Share</button>
    <button class="share-link copy-share" type="button">Copy link</button>
  </div>
  <span class="share-feedback" aria-live="polite"></span>
</aside>`;
const tagHtml = (tags=[]) => `<div class="tags">${tags.map(t=>`<span class="tag">#${esc(t.replace(/\s+/g,''))}</span>`).join('')}</div>`;

function nav(active='') {
  const items = [
    ['Writing','/writing/','writing'],['Ideas in Practice','/projects/','projects'],['Conversations','/conversations/','conversations'],['About','/about/','about'],['Subscribe','/subscribe/','subscribe']
  ];
  return `<header><div class="container nav"><a class="brand" href="/"><img src="/images/logo-quiet-lens.png" alt="Through My Quiet Lens" class="brand-logo"></a><button class="menu-button" aria-label="Open menu" aria-expanded="false">Menu</button><nav class="nav-links" aria-label="Primary">${items.map(([label,url,key])=>`<a href="${url}"${active===key?' aria-current="page"':''}>${label}</a>`).join('')}</nav></div></header>`;
}

function footer() {
  return `<footer><div class="container"><div class="footer-grid"><div><div class="footer-brand"><img src="/images/logo-quiet-lens.png" alt="Through My Quiet Lens" class="footer-logo"></div></div><div class="footer-links"><a href="/writing/">Writing</a><a href="/projects/">Ideas in Practice</a><a href="/conversations/">Conversations</a><a href="/about/">About</a><a href="/subscribe/">Subscribe</a><a href="${esc(site.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a></div></div><div class="copyright">© <span class="year"></span> ${esc(site.author)}. Built for reading, not scrolling.</div></div></footer>`;
}

function layout({title=site.title, description=site.description, body, active='', canonical='/', image='/images/through-my-quiet-lens-social.jpg'}) {
  const fullTitle = title === site.title ? title : `${title} — ${site.title}`;
  const socialImage = /^https?:\/\//.test(image) ? image : `${site.url}${image}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(fullTitle)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${site.url}${canonical}"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website"><meta property="og:url" content="${site.url}${canonical}"><meta property="og:image" content="${esc(socialImage)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${esc(socialImage)}"><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/styles.css"><script async src="https://www.googletagmanager.com/gtag/js?id=G-RLN08CE4VE"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-RLN08CE4VE');</script></head><body><a class="skip-link" href="#main">Skip to content</a><div class="site-shell">${nav(active)}<main id="main">${body}</main>${footer()}</div><script src="/site.js" defer></script></body></html>`;
}

function write(route, html) {
  const file = route.endsWith('.xml') || route.endsWith('.txt') ? path.join(out, route) : path.join(out, route, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

const findEssay = (slug) => essays.find(e=>e.slug===slug);
const startHere = [
  findEssay('gratitude'),
  findEssay('the-contract-is-the-beginning'),
  findEssay('finding-my-voice'),
  findEssay('ai-extend-my-thinking-or-avoid-it')
].filter(Boolean);
const homeLatest = [
  ...essays.map(e => ({ ...e, _cat: 'essays' })),
  ...principles.map(e => ({ ...e, _cat: 'principles' })),
  ...dc.map(e => ({ ...e, _cat: 'dc-decoded' }))
]
  .filter(e => e.date)
  .sort((a, b) => String(b.date).localeCompare(String(a.date)))
  .slice(0, 5);

const homeLatestUrl = e => {
  if (e._cat === 'dc-decoded') return `/dc-decoded/${e.slug}/`;
  if (e._cat === 'principles') return `/principles/${e.slug}/`;
  return `/essays/${e.slug}/`;
};
const homeFeatured = findEssay('when-answers-become-easy') || findEssay('participation-is-not-belonging') || homeLatest[0];
const homeFeaturedUrl = homeFeatured ? `/essays/${homeFeatured.slug}/` : '/writing/';
const homeCollections = [
  ['Through My Quiet Lens','/through-my-quiet-lens/','Personal stories about identity, belonging, family and the moments that quietly change us.'],
  ['Working Principles','/principles/','Commercial and leadership beliefs shaped by customers, colleagues, classrooms and mistakes.'],
  ['DC Decoded','/dc-decoded/','Clear-eyed writing on digital infrastructure, energy, markets and the systems behind technology.'],
  ['Ideas in Practice','/projects/','Research, experiments and initiatives that move beyond reflection into action.']
];
const home = `<section class="home-hero home-hero-v3"><div class="container home-hero-inner"><p class="home-thankyou">Thank you for choosing to pause and explore instead of scroll.</p><h1>Thoughts and experiences worth looking at again.</h1><p class="home-deck">I write about experiences, ideas and questions that stayed with me long enough to think about more deeply—across life, work, technology and change.</p><div class="home-hero-actions"><a class="button" href="/writing/">Explore the writing →</a><a class="text-button" href="/about/">Behind the lens →</a></div></div></section>
<section class="section home-recent"><div class="container"><div class="section-head"><div><h2>Recent writing</h2></div><p><a class="text-button" href="/library/">Browse all writing →</a></p></div><div class="home-recent-list">${homeLatest.map(e=>`<article class="home-recent-item"><h3><a href="${homeLatestUrl(e)}">${esc(e.displayTitle || e.title)}</a></h3>${e.date?`<p class="pub-date home-recent-date">${prettyDate(e.date)}</p>`:''}<p>${esc(e.homeIntro || e.description)}</p><a class="read-link" href="${homeLatestUrl(e)}">Read →</a></article>`).join('')}</div></div></section>
<section class="section home-paths"><div class="container"><div class="section-head"><div><p class="eyebrow">Ways into the work</p><h2>Different subjects. The same quiet lens.</h2></div><p>Begin with personal reflection, practical judgment, specialist analysis or an idea being tested in the world.</p></div><div class="home-path-grid">${homeCollections.map((x,i)=>`<a class="home-path" href="${x[1]}"><span>${String(i+1).padStart(2,'0')}</span><h3>${esc(x[0])}</h3><p>${esc(x[2])}</p><strong>Explore →</strong></a>`).join('')}</div></div></section>
<section class="section home-note-invite"><div class="container home-note-invite-inner"><p class="eyebrow">Continue the conversation</p><h2>Did something stay with you?</h2><p>Perhaps something here reminded you of your own experience or made you look at an idea differently. I would be glad to hear from you.</p><div class="home-invite-actions"><a class="button" href="/contact/">Leave a note →</a><a class="text-button" href="/conversations/">Listen to the conversations →</a></div></div></section>`;
write('', layout({title:'Through My Quiet Lens', description:'Experience-led writing and inquiry on how we live, work and respond to change, by Praveen Gangaraju.', body:home, canonical:'/'}));

const quietLens = essays.filter(e=>e.collection==='Through My Quiet Lens').sort((a,b)=>(a.collectionOrder||999)-(b.collectionOrder||999));
const quietLensList = `<section class="page-hero quiet-hero"><div class="container"><p class="eyebrow">A curated reading journey</p><h1 class="page-title">Through My Quiet Lens</h1><p class="page-lead">Personal stories about family, identity, resilience, culture and the quiet moments that shape how we see the world.</p><div class="journey-note"><strong>Begin at the beginning</strong><span>The essays are arranged for a reader to follow the journey, not by the date they were published.</span></div></div></section><section class="section"><div class="container journey-list">${quietLens.map((e,i)=>`<article class="journey-item"><div class="quiet-journey-number">${String(i+1).padStart(2,'0')}</div><div><div class="meta"><span>${e.readingTime}</span>${e.tags?.[0]?`<span>${esc(e.tags[0])}</span>`:''}</div><h2><a href="/essays/${e.slug}/">${esc(e.displayTitle || e.title)}</a></h2>${e.subtitle?`<p class="journey-subtitle">${esc(e.subtitle)}</p>`:''}<p>${esc(e.description)}</p></div><a class="journey-arrow" href="/essays/${e.slug}/" aria-label="Read ${esc(e.title)}">→</a></article>`).join('')}</div></section>`;
write('through-my-quiet-lens', layout({title:'Through My Quiet Lens', description:'A curated reading journey through Praveen Gangaraju’s personal essays.', body:quietLensList, active:'writing', canonical:'/through-my-quiet-lens/'}));

const libraryStart = [
  ['Gratitude','/essays/gratitude/','A reflection on the people and circumstances that quietly make a life possible.'],
  ['The Contract Is the Beginning','/principles/the-contract-is-the-beginning/','Why trust is built after the signature, not before it.'],
  ['Anderson Gave Me a Village','/ucla-anderson/anderson-gave-me-a-village/','What belonging can change in a demanding learning journey.'],
  ['$3 Trillion in Data Centers by 2030','/dc-decoded/3-trillion-in-data-centers-by-2030/','A starting point for understanding the infrastructure behind the AI economy.'],
  ['Am I Using AI to Extend My Thinking—or Avoid It?','/essays/ai-extend-my-thinking-or-avoid-it/','A question about convenience, struggle and human judgement.']
];
const libraryCollections = [
  ['Through My Quiet Lens','/through-my-quiet-lens/','Personal reflections on growth, family, belonging and the moments that change how we see.'],
  ['Working Principles','/principles/','Commercial and leadership beliefs shaped by customers, colleagues, classrooms and mistakes.'],
  ['UCLA Anderson','/ucla-anderson/','Learning, community and the experiences that made an MBA more than a degree.'],
  ['DC Decoded','/dc-decoded/','Data centres, power, digital infrastructure and the commercial systems behind technology.'],
  ['Sustainable AI Initiative','/projects/green-ai/','An expanding study of whether better AI habits can reduce unnecessary output while preserving usefulness.'],
  ['PAUSE for AI','/projects/pause-for-ai/','Thoughtful, sustainable and responsible human–AI engagement.']
];
const libraryAllItems = [...essays.map(e=>({...e,url:`/essays/${e.slug}/`})),...principles.map(e=>({...e,collection:'Working Principles',url:`/principles/${e.slug}/`,description:e.text})),...dc.map(e=>({...e,collection:'DC Decoded',url:`/dc-decoded/${e.slug}/`}))];
const library = `<section class="page-hero library-hero"><div class="container"><p class="eyebrow">The complete body of work</p><h1 class="page-title">Library</h1><p class="page-lead">A curated home for essays, working principles, conversations and specialist writing. Begin with a reading path or browse by collection.</p></div></section>
<section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Start here</p><h2>Five ways into the work</h2></div><p>These pieces offer the clearest introduction to the ideas that return throughout the publication.</p></div><div class="library-start">${libraryStart.map((x,i)=>`<a href="${x[1]}" class="library-start-item"><span>${String(i+1).padStart(2,'0')}</span><div><h3>${esc(x[0])}</h3><p>${esc(x[2])}</p></div><strong>Read →</strong></a>`).join('')}</div></div></section>
<section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Collections</p><h2>Choose a lens</h2></div><p>Each collection follows a distinct question, but the same themes often cross between them.</p></div><div class="library-collections">${libraryCollections.map(x=>`<a class="library-collection" href="${x[1]}"><h3>${esc(x[0])}</h3><p>${esc(x[2])}</p><span>Explore collection →</span></a>`).join('')}</div></div></section>
<section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Everything</p><h2>Browse all writing</h2></div><p>${essays.length + principles.length + dc.length} published pieces across the main written collections.</p></div><div class="library-search"><input type="search" id="library-search" placeholder="Search by title, idea or topic..." aria-label="Search the library"><p id="library-search-empty" class="library-search-empty" hidden>No pieces match that search.</p></div><div class="library-all" id="library-all">${libraryAllItems.map(e=>`<article data-search="${esc(((e.title||'')+' '+(e.description||'')+' '+(e.tags||[]).join(' ')).toLowerCase())}"><div class="meta"><span>${esc(e.collection)}</span><span>${esc(e.readingTime||'2 min read')}</span>${e.date?`<span class="pub-date">${prettyDate(e.date)}</span>`:''}</div><h3><a href="${e.url}">${esc(e.title)}</a></h3><p>${esc(e.description||'')}</p>${tagHtml(e.tags)}</article>`).join('')}</div></div></section>`;
write('library', layout({title:'Library', description:'The complete Through My Quiet Lens library.', body:library, active:'library', canonical:'/library/'}));

const writingFeatured = [
  findEssay('participation-is-not-belonging'),
  findEssay('when-answers-become-easy'),
  findEssay('the-40-year-leader-vs-the-130-year-giant')
].filter(Boolean);
const writingCollections = [
  ['Through My Quiet Lens','/through-my-quiet-lens/','A curated personal journey through identity, family, belonging, reinvention and the moments that change how we see.'],
  ['Working Principles','/principles/','Ideas about trust, relationships, negotiation, curiosity and execution, carried forward from experience.'],
  ['DC Decoded','/dc-decoded/','Digital infrastructure, power, AI, markets and the commercial systems behind technological change.'],
  ['UCLA Anderson','/ucla-anderson/','Learning, community and the experiences that made an MBA much more than a degree.']
];
const writing = `<section class="page-hero writing-hero"><div class="container"><p class="eyebrow">The central reading room</p><h1 class="page-title">Writing</h1><p class="page-lead">Essays and observations shaped by experience, curiosity and the questions that remain after the obvious answer.</p></div></section>
<section class="section writing-featured"><div class="container"><div class="section-head"><div><p class="eyebrow">Featured thinking</p><h2>Ideas worth beginning with.</h2></div><p>Three pieces that reflect the range of the writing—from organisations and human judgment to markets and technological change.</p></div><div class="writing-featured-grid">${writingFeatured.map((e,i)=>`<article class="writing-featured-card"><span>${String(i+1).padStart(2,'0')}</span><div class="meta">${dateHtml(e)}<span>${esc(e.readingTime)}</span></div><h3><a href="/essays/${e.slug}/">${esc(e.displayTitle || e.title)}</a></h3><p>${esc(e.description)}</p><a class="read-link" href="/essays/${e.slug}/">Read →</a></article>`).join('')}</div></div></section>
<section class="section writing-collections"><div class="container"><div class="section-head"><div><p class="eyebrow">Collections</p><h2>Follow a continuing line of thought.</h2></div><p>Each collection has its own character. Together they form one evolving body of work.</p></div><div class="writing-collection-grid">${writingCollections.map(x=>`<a class="writing-collection-card" href="${x[1]}"><h3>${esc(x[0])}</h3><p>${esc(x[2])}</p><strong>Explore the collection →</strong></a>`).join('')}</div><div class="writing-all-link"><p>Looking for a particular essay or subject?</p><a class="button" href="/library/">Browse all writing →</a></div></div></section>`;
write('writing', layout({title:'Writing', description:'Essays and observations by Praveen Gangaraju on life, work, technology and change.', body:writing, active:'writing', canonical:'/writing/'}));

const allWriting = [...essays.map(e=>({...e, _url:`/essays/${e.slug}/`})), ...dc.map(e=>({...e, _url:`/dc-decoded/${e.slug}/`}))];
const findRelated = (e, limit=3) => {
  const tags = new Set((e.tags||[]).map(t=>t.toLowerCase()));
  const scored = allWriting
    .filter(x=>x.slug!==e.slug)
    .map(x=>({post:x, score:(x.tags||[]).filter(t=>tags.has(t.toLowerCase())).length}))
    .filter(x=>x.score>0)
    .sort((a,b)=>b.score-a.score);
  if (scored.length >= limit) return scored.slice(0,limit).map(x=>x.post);
  // fall back to same collection sequence if not enough tag matches
  const sequence = e.collection==='Through My Quiet Lens' ? quietLens : essays;
  const idx = sequence.findIndex(x=>x.slug===e.slug);
  const fallback = [sequence[idx-1], sequence[idx+1]].filter(Boolean).map(p=>({...p, _url: p._url || `/essays/${p.slug}/`}));
  const combined = [...scored.map(x=>x.post), ...fallback];
  const seen = new Set(); const out = [];
  for (const p of combined) { if (!seen.has(p.slug)) { seen.add(p.slug); out.push(p); } if (out.length>=limit) break; }
  return out;
};
const readNextHtml = (e) => {
  const rel = findRelated(e);
  if (!rel.length) return '';
  return `<div class="article-end"><strong>If this interested you</strong>${rel.map(r=>`<p><a href="${r._url}">${esc(r.title)} →</a></p>`).join('')}</div>`;
};

const standaloneEssays = essays.filter(e=>e.collection!=='Through My Quiet Lens');
const isShort = e => /^1 min/.test(e.readingTime||'');
const essaysList = `<section class="page-hero"><div class="container"><p class="eyebrow">Writing</p><h1 class="page-title">Essays</h1><p class="page-lead">Standalone essays and reflections on work, technology and the moments that shape how we see things.</p></div></section><section class="section"><div class="container list">${standaloneEssays.map(e=>`<article class="list-item${isShort(e)?' list-item-short':''}"><div class="meta">${dateHtml(e)}<span>${e.readingTime}</span></div><div><h2><a href="/essays/${e.slug}/">${esc(e.title)}</a></h2><p>${esc(e.description)}</p>${tagHtml(e.tags)}</div><a href="/essays/${e.slug}/" aria-label="Read ${esc(e.title)}">Read →</a></article>`).join('')}</div></section>`;
write('essays', layout({title:'Essays', description:'Essays by Praveen Gangaraju.', body:essaysList, active:'writing', canonical:'/essays/'}));

for (const e of essays) {
  const body = `<article><header class="article-head">${e.image?`<div class="article-hero"><img src="${esc(e.image)}" alt="${esc(e.title)}" loading="eager"></div>`:''}<div class="reading"><p class="eyebrow">Essay</p><h1>${esc(e.displayTitle || e.title)}</h1>${e.subtitle ? `<p class="article-subtitle">${esc(e.subtitle)}</p>` : ``}<p class="deck">${esc(e.description)}</p><div class="meta">${dateHtml(e)}<span>${e.readingTime}</span></div>${tagHtml(e.tags)}</div></header><div class="article reading">${articleBody(e)}${sourceNote(e)}${shareHtml()}<aside class="article-subscribe"><p class="eyebrow">Stay in touch</p><h2>Enjoyed this reflection?</h2><p>Receive future essays directly in your inbox.</p><a class="button" href="/subscribe/">Subscribe →</a></aside>${readNextHtml(e)}</div></article>`;
  write(`essays/${e.slug}`, layout({title:e.title, description:e.description, body, active:'writing', canonical:`/essays/${e.slug}/`, image:e.image || '/images/through-my-quiet-lens-social.jpg'}));
}

const pbody = `<section class="page-hero principles-hero"><div class="container"><p class="eyebrow">Ideas carried forward</p><h1 class="page-title">Working Principles</h1><p class="page-lead">Beliefs shaped by customers, colleagues, classrooms and mistakes. Not universal rules—simply ideas I try to return to.</p></div></section><section class="section"><div class="container principle-grid principle-library">${principles.map(p=>`<article class="principle principle-card"><div class="num">PRINCIPLE ${String(p.number).padStart(2,'0')}</div><h2><a href="/principles/${p.slug}/">${esc(p.title)}</a></h2><p>${esc(p.text)}</p><div class="meta"><span>${esc(p.readingTime || '2 min read')}</span><span>From LinkedIn</span></div><a class="read-link" href="/principles/${p.slug}/">Read the principle →</a></article>`).join('')}</div></section>`;
write('principles', layout({title:'Working Principles', description:'Working principles by Praveen Gangaraju.', body:pbody, active:'writing', canonical:'/principles/'}));

principles.forEach((p,i)=>{
  const prev=principles[i-1], next=principles[i+1];
  const navLinks = `<div class="article-journey">${prev?`<a href="/principles/${prev.slug}/"><span>Previous principle</span><strong>← ${esc(prev.title)}</strong></a>`:'<span></span>'}${next?`<a class="next" href="/principles/${next.slug}/"><span>Next principle</span><strong>${esc(next.title)} →</strong></a>`:'<span></span>'}</div>`;
  const body = `<article><section class="article-head principle-head"><div class="reading"><p class="eyebrow">Working Principle ${String(p.number).padStart(2,'0')}</p><h1>${esc(p.title)}</h1><p class="deck">${esc(p.text)}</p><div class="meta"><span>${esc(p.readingTime || '2 min read')}</span>${p.date ? `<span class="pub-date">${prettyDate(p.date)}</span>` : ''}</div>${tagHtml(p.tags)}</div></section><section class="article-section"><div class="reading article-body">${p.bodyHtml}${sourceNote(p)}${shareHtml()}${navLinks}<p class="back-link"><a href="/principles/">← All Working Principles</a></p></div></section></article>`;
  write(`principles/${p.slug}`, layout({title:p.title, description:p.text, body, active:'writing', canonical:`/principles/${p.slug}/`}));
});

const five = conversations.find(c=>c.slug==='five-percent-conversations');
const celebrate = conversations.find(c=>c.slug==='celebrate-2026');
const cbody = `<section class="page-hero"><div class="container"><p class="eyebrow">Listening as a way of learning</p><h1 class="page-title">Conversations</h1><p class="page-lead">Some ideas begin with writing. Others begin by listening. These projects grew from making time for people to share the experiences behind their visible stories.</p></div></section><section class="section"><div class="container conversation-grid"><article class="conversation-card"><p class="eyebrow">Personal podcast</p><h2>5% Conversations</h2><p>${esc(five.description)}</p><a class="read-link" href="/conversations/five-percent-conversations/">Read the story →</a></article><article class="conversation-card"><p class="eyebrow">UCLA Anderson</p><h2>Celebrate 2026</h2><p>${esc(celebrate.description)}</p><a class="read-link" href="/conversations/celebrate-2026/">Explore the project →</a></article></div></section>`;
write('conversations', layout({title:'Conversations', description:'5% Conversations and Celebrate 2026 by Praveen Gangaraju.', body:cbody, active:'conversations', canonical:'/conversations/'}));

const fiveBody = `<section class="page-hero"><div class="container"><p class="eyebrow">Personal podcast</p><h1 class="page-title">5% Conversations</h1><p class="page-lead">${esc(five.description)}</p><img class="podcast-cover" src="/images/conversations/5-percent-conversations-cover.png" alt="5% Conversations podcast cover art" loading="lazy"></div></section><section class="section"><div class="reading conversation-story"><h2>Why I started it</h2><p>Early in my UCLA Anderson journey, I heard an idea that stayed with me: anyone who wants to do well in a profession must first understand what everyone else is doing, do those fundamentals well, and then bring the extra dedication, commitment and trust that can place them in the top five per cent.</p><p>I used that idea in a different way. I began reaching out to classmates and inviting them into conversations. Each one gave me a chance to learn something I did not know, while also developing a personal connection that might never have grown from a routine introduction.</p><p>That practice became <strong>5% Conversations</strong>.</p><p>It is not about claiming to belong to the top five per cent. It is about making the additional effort: asking one more question, listening more carefully, preparing with intention and treating trust as something worth earning.</p><p>Over time, I realised that conversations could do two things at once. They could expand what I knew and deepen how well I knew the person sitting across from me.</p><blockquote><p>The extra five per cent is often not a secret. It is the decision to show up with greater curiosity, commitment and care.</p></blockquote><p><a class="button external-button" href="${esc(five.spotify)}" target="_blank" rel="noopener noreferrer">Listen on Spotify ↗</a></p><p class="back-link"><a href="/conversations/">← Back to Conversations</a></p></div></section>`;
write('conversations/five-percent-conversations', layout({title:'5% Conversations', description:five.description, body:fiveBody, active:'conversations', canonical:'/conversations/five-percent-conversations/'}));

const celebrateBody = `<section class="page-hero"><div class="container"><p class="eyebrow">UCLA Anderson Executive MBA</p><h1 class="page-title">Celebrate 2026</h1><p class="page-lead">${esc(celebrate.description)}</p></div></section><section class="section"><div class="reading conversation-story"><h2>A community storytelling project</h2><p><strong>Celebrate 2026</strong> is separate from 5% Conversations. It was created for the UCLA Anderson Executive MBA community as part of the Drive Time podcast series.</p><p>The idea was simple: help classmates move beyond names, roles and résumés, and hear the experiences that shaped the people sharing the programme with them.</p><p>Hosting these conversations became one of the most meaningful parts of my Anderson journey. Each episode created space for a classmate to reflect on leadership, career, family, change and the path that brought them to UCLA.</p><p>Below is the full guest directory, every episode, guest and host from the series.</p><div class="link-stack"><a class="button" href="${esc(celebrate.website)}">Browse the guest directory →</a><a class="text-button" href="${esc(celebrate.ucla)}" target="_blank" rel="noopener noreferrer">View the official UCLA Anderson page ↗</a></div><p class="back-link"><a href="/conversations/">← Back to Conversations</a></p></div></section>`;
write('conversations/celebrate-2026', layout({title:'Celebrate 2026', description:celebrate.description, body:celebrateBody, active:'conversations', canonical:'/conversations/celebrate-2026/'}));

const dcList = `<section class="page-hero"><div class="container"><p class="eyebrow">Infrastructure notes</p><h1 class="page-title">DC Decoded</h1><p class="page-lead">Clear-eyed observations on the systems, constraints and commercial choices behind digital infrastructure.</p></div></section><section class="section"><div class="container list">${dc.map(e=>`<article class="list-item${isShort(e)?' list-item-short':''}"><div class="meta">${dateHtml(e)}<span>${e.readingTime}</span></div><div><h2><a href="/dc-decoded/${e.slug}/">${esc(e.title)}</a></h2><p>${esc(e.description)}</p>${tagHtml(e.tags)}</div><a href="/dc-decoded/${e.slug}/">Read →</a></article>`).join('')}</div></section>`;
write('dc-decoded', layout({title:'DC Decoded', description:'Data-centre and digital infrastructure writing by Praveen Gangaraju.', body:dcList, active:'writing', canonical:'/dc-decoded/'}));
for (const e of dc) {
  const body = `<article><header class="article-head"><div class="reading"><p class="eyebrow">DC Decoded</p><h1>${esc(e.title)}</h1><p class="deck">${esc(e.description)}</p><div class="meta">${dateHtml(e)}<span>${e.readingTime}</span></div>${tagHtml(e.tags)}</div></header><div class="article reading">${articleBody(e)}${sourceNote(e)}${shareHtml()}<aside class="article-subscribe"><p class="eyebrow">Stay in touch</p><h2>Enjoyed this reflection?</h2><p>Receive future essays directly in your inbox.</p><a class="button" href="/subscribe/">Subscribe →</a></aside>${readNextHtml(e)}</div></article>`;
  write(`dc-decoded/${e.slug}`, layout({title:e.title, description:e.description, body, active:'writing', canonical:`/dc-decoded/${e.slug}/`}));
}


const projects = `<section class="page-hero"><div class="container"><p class="eyebrow">From reflection to action</p><h1 class="page-title">Ideas in Practice</h1><p class="page-lead">Research, experiments and initiatives that test what an idea might become when it moves beyond the page.</p></div></section><section class="section"><div class="container project-grid"><article class="project-card"><p class="eyebrow">Research initiative · Recruiting</p><h2>Sustainable AI Initiative</h2><p>Can a simple change in how AI responds reduce unnecessary output while preserving usefulness? An initial pilot produced an encouraging signal; the study is now expanding.</p><a class="read-link" href="/projects/green-ai/">Explore the study →</a></article><article class="project-card"><p class="eyebrow">Active initiative</p><h2>PAUSE for AI</h2><p>A practical framework for using artificial intelligence more thoughtfully, efficiently and responsibly—without losing the human judgement that gives the tool value.</p><a class="read-link" href="/projects/pause-for-ai/">Explore PAUSE for AI →</a></article><article class="project-card vent-project-card"><p class="eyebrow">Idea in progress</p><h2>Vent-it</h2><p>Sometimes, before people need advice or answers, they simply need somewhere to speak and someone willing to listen without judgment.</p><a class="read-link" href="/projects/vent-it/">Why I keep thinking about this →</a></article></div></section>`;
write('projects', layout({title:'Ideas in Practice', description:'Research, experiments and initiatives by Praveen Gangaraju.', body:projects, active:'projects', canonical:'/projects/'}));

const greenAI = `<section class="page-hero"><div class="container"><p class="eyebrow">Research initiative · Registration open</p><h1 class="page-title">Sustainable AI Initiative</h1><p class="page-lead">Can better AI habits reduce unnecessary output while preserving useful, high-quality responses?</p><p><a class="button" href="https://docs.google.com/forms/d/e/1FAIpQLSdHTW7ZOdpqZhugCim5M__pYxzYpSDftdMOcQJNviCa8e559w/viewform?usp=header" target="_blank" rel="noopener noreferrer">Join the study ↗</a></p></div></section><section class="section"><div class="reading project-story"><h2>Why this research</h2><p>Most conversations about AI sustainability focus on data centres, model architecture, cooling and electricity supply. Those questions matter. This work examines a quieter demand-side question: can ordinary users reduce unnecessary AI output through better defaults and more intentional use?</p><h2>What the pilot found</h2><p>The first pilot involved eleven volunteers using ChatGPT, Claude and Gemini. A standardised before-and-after benchmark was then tested on Claude and ChatGPT using a one-time instruction designed to remove filler and limit unnecessary response length.</p><div class="project-stat"><strong>64.7%</strong><span>average reduction in estimated output tokens in the initial Claude and ChatGPT benchmark</span></div><p>This was an early benchmark signal, not a final conclusion and not an intervention completed by all eleven volunteers. The expanded study is designed to test whether the result holds across more people, platforms, task types and levels of AI experience—and whether participants still find the responses useful.</p><h2>What participation involves</h2><p>Registration takes about two to three minutes. After registering, participants receive the benchmark instructions and the next steps by email. No private chat history or confidential conversation content is requested.</p><div class="project-stat"><strong>Study status</strong><span>Pilot complete · Registration open · Expanding toward 100 participants · Open worldwide</span></div><p><a class="button" href="https://docs.google.com/forms/d/e/1FAIpQLSdHTW7ZOdpqZhugCim5M__pYxzYpSDftdMOcQJNviCa8e559w/viewform?usp=header" target="_blank" rel="noopener noreferrer">Join the Sustainable AI Initiative ↗</a></p><h2>Frequently asked questions</h2><h3>Do I need a particular AI platform?</h3><p>No. The study is open to users of ChatGPT, Claude, Gemini, Copilot, Perplexity and other mainstream AI assistants.</p><h3>Will you collect my conversations?</h3><p>No. Participants are asked only for study measurements and brief feedback. They should not submit confidential or sensitive information.</p><h3>What happens after I register?</h3><p>You will receive the participant instructions and study materials by email.</p><h3>How long will it take?</h3><p>The registration form takes approximately two to three minutes. The full benchmark instructions will explain the remaining commitment before you begin.</p><p class="quiet-note">This is an independent follow-on initiative that grew from a UCLA Leaders in Sustainability leadership project. It is not presented as an official UCLA research study.</p><p class="back-link"><a href="/projects/">← Back to Projects</a></p></div></section>`;
write('projects/green-ai', layout({title:'Sustainable AI Initiative', description:'An expanding study of sustainable everyday AI use and response efficiency.', body:greenAI, active:'projects', canonical:'/projects/green-ai/'}));

const sage = `<section class="page-hero"><div class="container"><p class="eyebrow">Thoughtful, sustainable and responsible AI use</p><h1 class="page-title">PAUSE for AI</h1><p class="page-lead">Exploring how we can benefit from artificial intelligence while using its resources more thoughtfully and preserving the human judgement that gives it value.</p><p><a class="button" href="/projects/green-ai/">Explore the current study →</a></p></div></section><section class="section"><div class="reading project-story"><h2>Where it began</h2><p>PAUSE for AI grew from a project I developed as part of my work toward UCLA's Leaders in Sustainability Certificate while completing my Executive MBA at UCLA Anderson.</p><p>The starting question was deliberately small: could one simple change in how an AI assistant responds reduce unnecessary output without making the response less useful?</p><h2>An early signal</h2><p>The first exploratory pilot involved eleven volunteers using ChatGPT, Claude and Gemini. A separate standardised before-and-after benchmark was then run on Claude and ChatGPT using a one-time instruction designed to remove filler and limit unnecessary response length.</p><div class="project-stat"><strong>64.7%</strong><span>average reduction in estimated output tokens in the initial Claude and ChatGPT benchmark</span></div><p>This was an encouraging signal, not a conclusion. It was not an intervention completed by all eleven volunteers, and it does not establish an equivalent reduction in electricity, water use or emissions. Those relationships depend on the model, hardware, data centre and energy system behind each interaction.</p><p>The question stayed with me after the certificate project ended. I am now expanding the work through a larger validation study across more participants, platforms, tasks and levels of AI experience.</p><p><a class="button" href="/projects/green-ai/">See the study and its limitations →</a></p><h2>Why I am continuing</h2><p>Social media offers a useful warning. Its adoption moved faster than public understanding of how constant feeds and engagement-driven design might affect attention, behaviour and wellbeing. Early concerns were easy to overlook. By the time the conversation became mainstream, many of the habits and business models were already deeply established.</p><p>AI raises different questions, and the comparison should not be stretched too far. Its possible effects on cognition deserve a separate discussion. The immediate concern behind this work is also physical: the electricity and water required by systems whose use may grow much faster than public awareness of what sits behind each interaction.</p><p>I am not suggesting that individual users alone can solve AI's environmental impact. AI companies, infrastructure providers and policymakers carry much larger responsibilities. I am also not arguing for less useful AI. I use these tools and see their value.</p><p>The purpose of bringing users into the conversation is not to blame them or make them feel guilty. It is to give people enough visibility and understanding to make informed choices before patterns of use become invisible habits. Better infrastructure, platform accountability and thoughtful user behaviour should be parts of the same response.</p><h2>The wider work</h2><p>The experiment opened up three connected areas that PAUSE for AI is continuing to explore.</p><h3>Reduce what is unnecessary</h3><p>Can better defaults and more intentional use reduce avoidable AI output while preserving usefulness?</p><h3>Make resource use visible</h3><p>Could AI platforms give people a practical view of the resources associated with their usage, much like an electricity bill or a weekly screen-time report makes an otherwise invisible pattern easier to see?</p><h3>Keep the human in the thinking</h3><p>How can AI literacy help people use these tools to extend their thinking without gradually outsourcing the judgement, curiosity and struggle through which thinking develops?</p><h2>An invitation, not a finished answer</h2><p>This work is still developing. I am sharing it openly because useful ideas become stronger when knowledgeable people question their assumptions, test their methods and point out what they may be missing.</p><p>If you work in sustainability, behavioural research, AI, education or public policy, I would value your critique. I would also be glad to hear from institutions or communities interested in participating in the next stage.</p><p><a class="button" href="/contact/">Share a critique or explore collaboration →</a></p><blockquote><p>Use intelligence wisely, both the machine's and our own.</p></blockquote><p class="quiet-note">PAUSE for AI is an independent initiative that grew from a UCLA Leaders in Sustainability certificate project. It is not presented as an official UCLA research study or UCLA-endorsed programme.</p><p class="back-link"><a href="/projects/">← Back to Ideas in Practice</a></p></div></section>`;
write('projects/pause-for-ai', layout({title:'PAUSE for AI', description:'An independent initiative exploring lower-waste AI use, resource visibility and the preservation of human judgement.', body:sage, active:'projects', canonical:'/projects/pause-for-ai/'}));


const ventIt = `<section class="page-hero vent-hero"><div class="reading"><p class="eyebrow">An idea about listening</p><h1 class="page-title">Vent-it</h1><p class="page-lead">Sometimes, before we need an answer, we need somewhere to say what is on our mind.</p></div></section>
<section class="section vent-section"><div class="reading vent-story">
<p class="vent-opening">From the outside, it is easy to assume that someone is doing well. A job. A family. A home. A life that appears to be moving in the right direction.</p>
<p>But what we see from the outside rarely tells us everything that someone may be carrying.</p>
<p>Over time, one thought has stayed with me: perhaps one of the things many of us are missing is surprisingly simple — someone willing to listen without immediately judging, advising or trying to fix us.</p>

<h2>Listening before solving</h2>
<p>We are often quick to respond when someone tells us they are struggling.</p>
<p>We offer solutions. We compare experiences. We tell them what we would do.</p>
<p>Sometimes that is useful.</p>
<p>Sometimes it is not what the person needs first.</p>
<p>There are moments when simply being able to say something out loud, without worrying about how it will be interpreted, can itself be a first step.</p>

<blockquote><p>A space to speak. A space to be heard. A space where listening comes before solving.</p></blockquote>

<h2>An idea I am still thinking about</h2>
<p>Vent-it is not a finished product or service. It is an idea I have carried for some time because I believe there is a genuine need for spaces like this.</p>
<p>I have also thought about whether technology, including AI, could one day make it easier for someone to take that first step and open up.</p>
<p>But this is a deeply human and sensitive space. Good intentions alone are not enough. Technology can misunderstand, respond badly or create consequences we did not intend.</p>
<p>So I would rather move slowly and responsibly than build something simply because technology makes it possible.</p>

<div class="vent-thought"><p>For now, the idea remains simple:</p><strong>Perhaps we need more places where people can speak before they are expected to have an answer.</strong></div>

<h2>For now, my door is open</h2>
<p>If something here resonates with you and you simply need someone to listen, you are welcome to reach out.</p>
<p>I may not have an answer. I will not pretend to have one. But I can listen patiently, without rushing to judge or fix what you are going through.</p>
<p>This is a personal invitation, not a paid service. If you choose to share something with me, I will treat it with care and privacy.</p>

<p class="vent-action"><a class="button" href="/contact/">Reach out →</a></p>

<aside class="vent-care-note">
<p class="eyebrow">A small but important note</p>
<p>Vent-it is not therapy, counselling, crisis support or a substitute for professional mental-health care. If what you are facing needs professional or urgent support, please reach out to a qualified care provider or an appropriate local service.</p>
</aside>

<p class="vent-closing"><strong>We may not always know what someone is carrying.</strong><br>Being willing to listen is a small place to start.</p>

${shareHtml('Share this idea')}

<p class="back-link"><a href="/projects/">← Back to Projects</a></p>
</div></section>`;

write('projects/vent-it', layout({
  title:'Vent-it',
  description:'An idea about creating more room for people to speak, be heard and feel less judged before solutions begin.',
  body:ventIt,
  active:'projects',
  canonical:'/projects/vent-it/'
}));

const contact = `<section class="page-hero"><div class="container"><p class="eyebrow">Contact</p><h1 class="page-title">Start a conversation</h1><p class="page-lead">For thoughtful responses, collaboration ideas, speaking enquiries or simply to say hello.</p></div></section><section class="section"><div class="reading contact-card"><h2>Email</h2><p><a class="contact-link" href="mailto:${esc(site.email)}">${esc(site.email)}</a></p><p>I'd love to hear from you. Whether it's a thoughtful conversation, a question, or simply to say hello, feel free to get in touch.</p><h2>LinkedIn</h2><p><a href="${esc(site.linkedin)}" target="_blank" rel="noopener noreferrer">Connect with Praveen on LinkedIn ↗</a></p><p class="quiet-note">I may not always respond immediately, but I read every genuine note.</p></div></section>`;
write('contact', layout({title:'Contact', description:'Contact Praveen Gangaraju.', body:contact, active:'contact', canonical:'/contact/'}));

const subscribeForm = `<form class="subscribe-form" action="https://buttondown.com/api/emails/embed-subscribe/${esc(site.buttondownUsername)}" method="post" target="popupwindow" onsubmit="window.open('https://buttondown.com/${esc(site.buttondownUsername)}', 'popupwindow')"><label for="bd-email">Email address</label><div class="subscribe-row"><input id="bd-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required><button class="button" type="submit">Subscribe</button></div><p class="form-note">Unsubscribe at any time.</p></form>`;
const subscribe = `<section class="page-hero"><div class="container"><p class="eyebrow">Subscribe</p><h1 class="page-title">Thoughtful writing, without the noise</h1><p class="page-lead">I write when there is something worth sharing—not because a calendar says I should.</p></div></section><section class="section"><div class="reading subscribe-card"><h2>Join the quiet list</h2><p>Receive new essays, project updates and DC Decoded articles directly in your inbox.</p>${subscribeForm}<p class="quiet-note">No pop-ups. No weekly obligation. Only something worth sharing.</p><p><a class="text-button" href="${esc(site.linkedin)}" target="_blank" rel="noopener noreferrer">Or follow on LinkedIn ↗</a></p></div></section>`;
write('subscribe', layout({title:'Subscribe', description:'Subscribe to new writing from Through My Quiet Lens.', body:subscribe, active:'subscribe', canonical:'/subscribe/'}));

const about = `<section class="about-hero"><div class="container about-hero-grid"><figure class="about-portrait"><img src="/images/about/praveen-portrait.jpg" alt="Praveen Gangaraju with his dog Pluto" loading="eager"></figure><div class="about-hero-copy"><p class="eyebrow">Behind the lens</p><h1>A life shaped by work, learning, movement and reflection.</h1><p class="about-hero-lead">I have spent much of my life moving between cities, industries and communities. Each transition changed how I understood work, relationships, belonging and growth.</p><p>This page brings together a few of the places, people and experiences behind the writing, and the questions I am still learning to ask.</p><div class="about-actions"><a class="button" href="/writing/">Read my writing →</a><a class="text-button" href="/contact/">Start a conversation →</a></div></div></div></section>
<section class="section about-journey"><div class="container"><div class="section-head"><div><p class="eyebrow">My journey</p><h2>Different places. A continuing story.</h2></div><p>Not a résumé, but a few chapters that changed how I see the world.</p></div><div class="about-timeline">
<article class="about-timeline-item"><span class="about-timeline-number">01</span><img class="about-timeline-image" src="/images/about/journey-chennai.jpg" alt="Chennai chapter" loading="lazy"><h3>Chennai</h3><p class="about-timeline-kicker">Early foundations</p><p>Rooted in a family of teachers, and in the belief that learning should lead to contribution.</p></article>
<article class="about-timeline-item"><span class="about-timeline-number">02</span><img class="about-timeline-image" src="/images/about/journey-godrej.jpg" alt="South India chapter" loading="lazy"><h3>South India</h3><p class="about-timeline-kicker">Learning on the ground</p><p>Eight years building dealer networks and delivering projects across South India, the first real lesson in how differently people think, decide and trust, depending on where you meet them.</p></article>
<article class="about-timeline-item"><span class="about-timeline-number">03</span><img class="about-timeline-image" src="/images/about/journey-singapore.jpg" alt="Singapore chapter" loading="lazy"><h3>Singapore</h3><p class="about-timeline-kicker">Building, leading and belonging</p><p>Learning through work, building markets, teams and relationships across complex projects.</p></article>
<article class="about-timeline-item"><span class="about-timeline-number">04</span><img class="about-timeline-image" src="/images/about/journey-united-states.jpg" alt="United States and UCLA chapter" loading="lazy"><h3>United States & UCLA</h3><p class="about-timeline-kicker">Stepping back to move forward</p><p>A new country, a new classroom and a community that renewed my curiosity.</p></article>
<article class="about-timeline-item"><span class="about-timeline-number">05</span><img class="about-timeline-image" src="/images/about/journey-return.jpg" alt="Return to Singapore chapter" loading="lazy"><h3>Singapore, again</h3><p class="about-timeline-kicker">A new chapter</p><p>Returning with a wider lens, and a clearer sense of the work and impact I want to create.</p></article>
</div></div></section>
<section class="section about-moments"><div class="container"><div class="section-head"><div><p class="eyebrow">Moments that shaped me</p><h2>The life behind the writing.</h2></div><p>A couple of these are illustrated rather than photographed, to protect people who did not choose to be online. Every image here is still true to what happened.</p></div><div class="about-photo-grid">
<figure class="about-photo about-photo-large"><img src="/images/about/moment-ucla.jpg" alt="UCLA study and community" loading="lazy"><figcaption><strong>Study & community</strong><span>A classroom became a village.</span></figcaption></figure>
<figure class="about-photo"><img src="/images/about/moment-conversations.jpg" alt="Podcast and conversations" loading="lazy"><figcaption><strong>Conversations</strong><span>Listening before speaking.</span></figcaption></figure>
<figure class="about-photo"><img src="/images/about/moment-service.jpg" alt="Volunteering and community service" loading="lazy"><figcaption><strong>Service</strong><span>Contribution beyond oneself.</span></figcaption></figure>
<figure class="about-photo"><img src="/images/about/moment-family.jpg" alt="Family" loading="lazy"><figcaption><strong>Family</strong><span>My anchor through every move.</span></figcaption></figure>
<figure class="about-photo"><img src="/images/about/moment-dogs.jpg" alt="Percy and Pluto" loading="lazy"><figcaption><strong>Percy & Pluto</strong><span>Two unexpectedly good teachers.</span></figcaption></figure>
</div><div class="about-writing-closing"><img src="/images/about/moment-writing.jpg" alt="Writing and reflection" loading="lazy"><div><h3>Writing</h3><p>Slowing down enough to notice.</p></div></div></div></section>
<section class="section about-guides"><div class="container"><div class="section-head"><div><p class="eyebrow">What continues to guide me</p><h2>Five ideas I keep returning to.</h2></div></div><div class="guide-grid">
<article><span>01</span><h3>Curiosity</h3><p>I try to keep asking better questions, especially when the first answer feels too easy.</p></article>
<article><span>02</span><h3>Relationships</h3><p>I try to leave every relationship stronger than I found it.</p></article>
<article><span>03</span><h3>Growth</h3><p>I believe experience matters most when it continues to make room for learning.</p></article>
<article><span>04</span><h3>Belonging</h3><p>I notice who may still be standing outside the circle, and try to make space.</p></article>
<article><span>05</span><h3>Service</h3><p>I believe progress matters most when it helps someone beyond me.</p></article>
</div></div></section>
<section class="section about-story"><div class="container about-story-grid"><p class="eyebrow">Why this space exists</p><div><h2>I did not begin writing because I had answers.</h2><p class="about-story-lead">I began because slowing down long enough to put thoughts into words often revealed questions I had not realised I was asking.</p><p>Some essays come from boardrooms. Others come from classrooms, conversations, family or ordinary moments that quietly changed how I think. Over time, more than fifty short and long pieces began to form something larger: not a polished personal brand, but an intellectual home.</p><p>Through My Quiet Lens is where I continue that conversation.</p><div class="about-story-links"><a href="/through-my-quiet-lens/">Personal reflections →</a><a href="/principles/">Working principles →</a><a href="/dc-decoded/">DC Decoded →</a><a href="/projects/">Projects →</a></div><div class="about-listening-note"><p>Sometimes writing is not what someone needs. Sometimes they simply need someone willing to listen.</p><a href="/projects/vent-it/">Why I keep thinking about Vent-it →</a></div></div></div></section>
<section class="about-closing"><div class="reading"><blockquote>“Here are some of the places, people and experiences that shaped the person doing the writing.”</blockquote><p>Praveen Gangaraju · Singapore</p><div class="about-closing-links"><a href="${esc(site.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn →</a><a href="mailto:${esc(site.email)}">Email →</a></div></div></section>`;
write('about', layout({title:'About', description:'About Praveen Gangaraju and Through My Quiet Lens.', body:about, active:'about', canonical:'/about/'}));

const urls = ['', 'writing/', 'library/', 'essays/', ...essays.map(e=>`essays/${e.slug}/`), 'principles/', ...principles.map(p=>`principles/${p.slug}/`), 'conversations/', 'conversations/five-percent-conversations/', 'conversations/celebrate-2026/', 'dc-decoded/', ...dc.map(e=>`dc-decoded/${e.slug}/`), 'ucla-anderson/', 'ucla-anderson/anderson-gave-me-a-village/', 'ucla-anderson/the-biggest-lessons-werent-always-in-the-classroom/', 'ucla-anderson/the-most-unexpected-part-of-my-mba/', 'ucla-anderson/the-degree-was-the-destination/', 'ucla-anderson/six-hundred-photos-one-community/', 'ucla-anderson/ucla-x-lbs-lessons-friendships-stories-that-stay-with-us/', 'projects/', 'projects/green-ai/', 'projects/pause-for-ai/', 'projects/vent-it/', 'about/', 'contact/', 'subscribe/'];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u=>`<url><loc>${site.url}/${u}</loc></url>`).join('')}</urlset>`);
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
write('404', layout({title:'Page not found', description:'This page could not be found.', body:`<section class="page-hero"><div class="reading"><p class="eyebrow">404</p><h1 class="page-title">This path ends here.</h1><p class="page-lead">The idea may have moved, or the link may be incomplete.</p><p><a class="button" href="/">Return home →</a></p></div></section>`, canonical:'/404/'}));

console.log(`Built ${urls.length + 4} files in ${out}`);
