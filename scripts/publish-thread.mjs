import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const aboutPath = path.join(dist, 'about', 'index.html');
const threadDir = path.join(dist, 'thread');
const threadPath = path.join(threadDir, 'index.html');

if (!fs.existsSync(aboutPath)) {
  throw new Error('dist/about/index.html not found. Run the main build first.');
}

let about = fs.readFileSync(aboutPath, 'utf8');

const doorway = `<div class="about-listening-note"><p><strong>Looking for the thread</strong><br>This site was not really planned. I kept writing, starting things and following questions that did not always seem connected.</p><a href="/thread/">See how it came together →</a></div>`;

if (!about.includes('href="/thread/"')) {
  const marker = '<div class="about-listening-note"><p>Sometimes writing is not what someone needs.';
  if (!about.includes(marker)) throw new Error('Could not find insertion point on About page.');
  about = about.replace(marker, doorway + marker);
  fs.writeFileSync(aboutPath, about);
}

const thread = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Looking for the Thread — Through My Quiet Lens</title><meta name="description" content="A quiet trail of how Through My Quiet Lens came together."><link rel="canonical" href="https://throughmyquietlens.com/thread/"><meta name="robots" content="noindex,follow"><meta property="og:title" content="Looking for the Thread — Through My Quiet Lens"><meta property="og:description" content="A quiet trail of how Through My Quiet Lens came together."><meta property="og:type" content="website"><meta property="og:url" content="https://throughmyquietlens.com/thread/"><meta property="og:image" content="https://throughmyquietlens.com/images/through-my-quiet-lens-social.jpg"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/styles.css"><script async src="https://www.googletagmanager.com/gtag/js?id=G-RLN08CE4VE"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-RLN08CE4VE');</script><style>
.thread-wrap{max-width:820px;margin:0 auto;padding:5rem 1.5rem 7rem}.thread-wrap h1{font-size:clamp(2.8rem,7vw,5.5rem);line-height:.98;max-width:680px;margin:.4rem 0 1.5rem}.thread-intro{font-size:1.25rem;line-height:1.7;max-width:650px}.thread-step{position:relative;margin:5rem 0;padding-left:2.2rem;border-left:1px solid rgba(0,0,0,.18)}.thread-step:before{content:"";position:absolute;left:-5px;top:.6rem;width:9px;height:9px;border-radius:50%;background:currentColor}.thread-step p{font-size:1.06rem;line-height:1.8;max-width:650px}.thread-note{margin:2rem 0 2rem 1.5rem;padding:1.25rem 1.4rem;background:rgba(0,0,0,.035);transform:rotate(-.35deg);font-size:.98rem}.thread-note strong{display:block;margin-bottom:.4rem}.thread-words{display:flex;flex-wrap:wrap;gap:.65rem;margin:1.8rem 0}.thread-words span{border:1px solid rgba(0,0,0,.2);padding:.55rem .8rem;border-radius:999px;font-size:.93rem}.thread-titles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.8rem;margin:2rem 0}.thread-titles div{padding:1rem;border-top:1px solid rgba(0,0,0,.18);font-family:Georgia,serif;font-size:1.08rem}.thread-question{font-family:Georgia,serif;font-size:1.55rem;line-height:1.5;margin:2rem 0}.thread-ending{font-family:Georgia,serif;font-size:1.8rem;line-height:1.45;margin-top:5rem}.thread-back{margin-top:4rem}@media(max-width:640px){.thread-wrap{padding-top:3.2rem}.thread-step{margin:3.5rem 0;padding-left:1.4rem}.thread-titles{grid-template-columns:1fr}.thread-note{margin-left:.3rem}}
</style></head><body><a class="skip-link" href="#main">Skip to content</a><div class="site-shell"><header><div class="container nav"><a class="brand" href="/"><img src="/images/logo-quiet-lens.png" alt="Through My Quiet Lens" class="brand-logo"></a><button class="menu-button" aria-label="Open menu" aria-expanded="false">Menu</button><nav class="nav-links" aria-label="Primary"><a href="/writing/">Writing</a><a href="/projects/">Ideas in Practice</a><a href="/conversations/">Conversations</a><a href="/about/">About</a><a href="/subscribe/">Subscribe</a></nav></div></header><main id="main"><article class="thread-wrap"><p class="eyebrow">An unfinished trail</p><h1>Looking for the Thread</h1><p class="thread-intro">For a while, I thought I was supposed to find the one thing that tied everything together.</p>

<section class="thread-step"><p>At UCLA Anderson, a class on personal branding made me think about this more seriously. In one conversation, I asked Sasha Strauss whether all my writing needed to point in the same direction.</p><p>His answer made sense: breadth can keep you in people's minds; focus can make you known for something.</p><p class="thread-question">Then I need to figure out my thing.</p></section>

<section class="thread-step"><p>I tried.</p><div class="thread-words"><span>Explorer</span><span>Caregiver</span><span>Curiosity</span><span>Relationships</span></div><div class="thread-note"><strong>An early attempt at putting words around it.</strong>Some felt right. Some felt like answers I was giving because the exercise needed an answer.</div></section>

<section class="thread-step"><p>And then I kept doing almost exactly what I had been doing before: writing about whatever stayed with me long enough.</p><div class="thread-titles"><div>Data centres</div><div>Dogs</div><div>AI</div><div>Family</div><div>Climate</div><div>People</div><div>Work</div><div>Boredom</div></div><div class="thread-note"><strong>This did not look particularly focused.</strong>Sometimes I was trying to understand something. Sometimes something bothered me. Sometimes it was simply a story I did not want to forget.</div></section>

<section class="thread-step"><p>I kept starting things too. Conversations. A podcast. Small experiments. Ideas that became projects, and ideas that did not.</p><p>Some found an audience. Many did not.</p><p>For a while, I wondered whether that meant I still had not found the thread.</p></section>

<section class="thread-step"><p>Looking back, I am less sure the subject was ever the thread.</p><p>Maybe the repetition is somewhere else: noticing something, returning to it, asking another question, talking to someone, changing my mind, and occasionally writing it down.</p><p>Even that may be too neat an explanation.</p></section>

<section class="thread-step"><p>Through My Quiet Lens came later.</p><p>I needed somewhere to keep some of these things together. So I made one.</p><p>A piece about AI can sit next to something about a dog. A conversation can sit next to a half-formed project. Something serious can sit beside something quite ordinary.</p></section>

<p class="thread-ending">They still do not fit perfectly.<br><br>I am not as worried about that anymore.</p><p class="thread-back"><a class="text-button" href="/about/">← Back to About</a></p></article></main><footer><div class="container"><div class="footer-grid"><div><div class="footer-brand"><img src="/images/logo-quiet-lens.png" alt="Through My Quiet Lens" class="footer-logo"></div></div><div class="footer-links"><a href="/writing/">Writing</a><a href="/projects/">Ideas in Practice</a><a href="/conversations/">Conversations</a><a href="/about/">About</a><a href="/subscribe/">Subscribe</a><a href="https://www.linkedin.com/in/gpraveen1882/" target="_blank" rel="noopener noreferrer">LinkedIn</a></div></div><div class="copyright">© <span class="year"></span> Praveen Gangaraju. Built for reading, not scrolling.</div></div></footer></div><script src="/site.js" defer></script></body></html>`;

fs.mkdirSync(threadDir, { recursive: true });
fs.writeFileSync(threadPath, thread);
console.log('Published hidden thread page and About doorway.');
