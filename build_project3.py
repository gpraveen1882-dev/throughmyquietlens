from pathlib import Path
from html import escape
import re, shutil, zipfile

root=Path('/mnt/data/proj3work/dist')
base='https://throughmyquietlens.com'

nav_old='<a href="/through-my-quiet-lens/">Quiet Lens</a><a href="/essays/">Essays</a><a href="/principles/">Working Principles</a><a href="/conversations/">Conversations</a>'
nav_new='<a href="/through-my-quiet-lens/">Quiet Lens</a><a href="/essays/">Essays</a><a href="/principles/">Working Principles</a><a href="/ucla-anderson/">UCLA Anderson</a><a href="/conversations/">Conversations</a>'
footer_old='<a href="/through-my-quiet-lens/">Quiet Lens</a><a href="/essays/">Essays</a><a href="/principles/">Principles</a><a href="/conversations/">Conversations</a>'
footer_new='<a href="/through-my-quiet-lens/">Quiet Lens</a><a href="/essays/">Essays</a><a href="/principles/">Principles</a><a href="/ucla-anderson/">UCLA Anderson</a><a href="/conversations/">Conversations</a>'
for p in root.rglob('*.html'):
    s=p.read_text(encoding='utf-8')
    s=s.replace(nav_old,nav_new).replace(footer_old,footer_new)
    p.write_text(s,encoding='utf-8')

articles=[
{
'slug':'anderson-gave-me-a-village','title':'Anderson Gave Me a Village','subtitle':'I came expecting to learn business. What stayed with me was the confidence that came from finding a community where I felt accepted, challenged and encouraged to grow.','read':'2 min read','date':'July 2026','tags':['Belonging','Community','UCLA Anderson'],
'body':[
('p','When I joined Anderson, I came expecting to learn business.'),('p','Strategy. Finance. Leadership.'),('p','I learned all of those things.'),('p',"But when I think about my time at Anderson today, those aren't the first things that come to mind."),
('p','I remember Beach Day. There were around 140 of us meeting for the first time. I probably spoke to twenty people. On the drive home, I remember wondering whether I would ever find my place there. I was naturally quiet, new to the U.S., and stepping into a completely unfamiliar environment.'),
('p','Looking back now, I smile at that thought.'),
('p','Somewhere over the next two years, Anderson quietly became one of the most welcoming communities I have ever experienced.'),
('p','It was not because of one event or one class.'),('p','It happened through hundreds of small moments.'),
('p','Study groups that became friendships. Conversations that continued long after class ended. People checking in on one another. Celebrating birthdays. Travelling together. Working through disagreements with respect.'),
('p','None of those moments seemed extraordinary on their own.'),('p','Together, they changed everything.'),
('p','I often tell people that Anderson gave me a village.'),('p',"For me, that is the school's greatest strength."),
('p','It is not simply that Anderson brings together people from different countries, industries and backgrounds. Many schools do that exceptionally well.'),
('p','What impressed me was what happened after people arrived.'),
('p','Our differences became conversations instead of barriers. People asked questions without worrying about looking foolish. We challenged ideas without questioning each other\'s intentions. We learned to disagree respectfully.'),
('p','There was a level of trust and psychological safety that allowed people to become better classmates, better teammates and, I believe, better leaders.'),
('p',"The greatest gift Anderson gave me wasn't just an MBA."),
('p','It was the confidence that comes from finding a community where I felt accepted, challenged and encouraged to grow.')]
},
{
'slug':'the-biggest-lessons-werent-always-in-the-classroom','title':"The Biggest Lessons Weren't Always in the Classroom",'subtitle':'Moving from Singapore to California reminded me that the same business problem can be approached through a completely different path.','read':'2 min read','date':'June 2026','tags':['Curiosity','Global Experience','Learning'],
'body':[
('p','Three years ago, I left Singapore thinking I had a good understanding of how business worked.'),
('p',"If I'm honest, I also arrived in California believing that the experience I'd gained over more than a decade in Singapore would translate naturally. Coming from a very competitive market, I expected to bring a different perspective—and I did."),
('p','But what surprised me was how much I had to learn.'),
('p','On paper, I came to California to pursue my MBA at UCLA Anderson and gain experience working in the U.S. market.'),
('p',"What I didn't expect was how much I would learn simply by seeing familiar business challenges approached differently."),
('p','I also learned that the way projects move forward can be very different. Regulations, specifications and the permitting process play a much bigger role than I had experienced before.'),
('p','The end goal is the same, but the journey to get there can be very different.'),
('p','Personally, living and working in a different culture was one of the most enriching parts of the journey. It pushed me outside my comfort zone, challenged some of my assumptions and gave me experiences I could not have had if I had stayed where I was comfortable.'),
('p','Of course, UCLA gave me great frameworks and classroom learning. But the biggest learning did not always happen in the classroom. It came from seeing how differently people approach the same problem.'),
('p','California also became much more than where I studied. I was lucky enough to visit some incredible places, and I know I will be back one day. There is still so much I want to explore.'),
('p','But more than the places, I will miss the people.'),
('p','The friendships, the conversations and the community made those years special.'),
('p','They reminded me to stay curious. There is always something to learn.')]
},
{
'slug':'the-most-unexpected-part-of-my-mba','title':'The Most Unexpected Part of My MBA','subtitle':'A spreadsheet, a framework and a dashboard helped me see that the same skills used to grow a company can help an organisation serve more people.','read':'2 min read','date':'June 2026','tags':['Social Impact','Purpose','UCLA Anderson'],
'body':[
('p',"Can a spreadsheet, a framework or a dashboard change someone's life?"),('p','A few months earlier, I probably would not have asked that question.'),
('p','Like most people in business, I have spent much of my career focused on customers, operations, revenue, projects and teams. Success was usually measured through business outcomes.'),
('p','One of the things that surprised me most about the UCLA Anderson Executive MBA was being exposed to experiences I would never have sought out on my own. One of those came through the Social Impact Consulting Corps, an initiative of the UCLA Anderson Center for Impact.'),
('p','Our team was paired with Mentors International, a nonprofit that helps families build sustainable livelihoods through entrepreneurship and mentoring.'),
('p','In many ways, the work felt familiar. We researched organisations, evaluated partnership opportunities, developed a prioritisation framework and built a dashboard to support future growth decisions.'),
('p','Then it struck me.'),('p','If our work helped Mentors International make better decisions, perhaps they could reach more families.'),('p','That simple thought changed how I looked at the project.'),
('p','Somewhere during those weeks, I also found myself thinking about my own journey.'),
('p','Growing up in India, I volunteered at a school for the blind from a young age. Later, while living in India and Singapore, I continued volunteering with community organisations whenever I could.'),
('p','I never thought much about it. It was simply something that felt worthwhile.'),
('p',"The same skills that help a company grow can also help an organisation serve more people. That was a perspective I hadn't fully appreciated before."),
('p','Another highlight was learning that our proposal had been selected for support by the Ziman Center and Net Impact. It was encouraging to see UCLA invest in projects connecting students with organisations working on real-world challenges.'),
('p','This project reminded me of something I already knew but had not felt in a long time.'),
('p','Growing up, I found that feeling through volunteering. What surprised me was realising that there are roles where professional skills can be brought to meaningful work—and create that same sense of satisfaction.'),
('p',"I'm not sure where this will lead."),('p',"But I'm glad UCLA introduced me to that possibility.")]
},
{
'slug':'the-degree-was-the-destination','title':'The Degree Was the Destination. The Friendships Were the Surprise.','subtitle':'You go to school expecting to learn from professors. Some of the biggest lessons come from the people sitting next to you.','read':'1 min read','date':'June 2026','tags':['Friendship','EMBA','The Outliers'],
'body':[
('p','I know now why school is fun.'),('p',"It doesn't matter whether you're four or forty."),
('p','You go there expecting to learn from professors. Instead, some of the biggest lessons come from the people sitting next to you.'),
('p','Two years ago, UCLA Anderson put a handful of strangers into a study group.'),
('p','Somehow, those strangers became friends. Then teammates. Then mentors. Then the people you call when life gets complicated.'),
('p','Looking through two years of photos, I was reminded that while I may forget some formulas, frameworks and case studies, I will never forget the people who shared the journey.'),
('p','To my brothers in “The Outliers”: thank you for every debate, every laugh, every late-night assignment and every reminder that success is more meaningful when it is shared.'),
('p','The degree was the destination.'),('p','The friendships were the surprise.'),
('p','The Outliers Club remains open. Admission is highly selective. Screening criteria remain confidential.')]
},
{
'slug':'six-hundred-photos-one-community','title':'Six Hundred Photos, One Community','subtitle':'Somewhere along the way, a room full of accomplished strangers slowly became a community.','read':'1 min read','date':'June 2026','tags':['Graduation','Class of 2026','Gratitude'],
'body':[
('p','Looking through more than 600 photos from our UCLA Anderson journey, I found myself reflecting on the last two years and the memories behind each picture.'),
('p','Somewhere along the way, a room full of accomplished strangers slowly became a community.'),
('p','As we celebrated graduation, I was grateful for the people, experiences and memories that made the journey far more meaningful than I ever expected.'),
('p','Thank you to everyone who was part of mine.'),
('p','Congratulations, UCLA Anderson EMBA Class of 2026.')]
}
]

header=lambda current='': f'''<header><div class="container nav"><a class="brand" href="/">Through My Quiet Lens</a><button class="menu-button" aria-label="Open menu" aria-expanded="false">Menu</button><nav class="nav-links" aria-label="Primary"><a href="/through-my-quiet-lens/">Quiet Lens</a><a href="/essays/">Essays</a><a href="/principles/">Working Principles</a><a href="/ucla-anderson/"{' aria-current="page"' if current=='ucla' else ''}>UCLA Anderson</a><a href="/conversations/">Conversations</a><a href="/dc-decoded/">DC Decoded</a><a href="/projects/">Projects</a><a href="/about/">About</a><a href="/contact/">Contact</a><a href="/subscribe/">Subscribe</a></nav></div></header>'''
footer='''<footer><div class="container"><div class="footer-grid"><div><div class="footer-brand">Through My Quiet Lens</div><p>Thoughtful observations by Praveen Gangaraju.</p></div><div class="footer-links"><a href="/through-my-quiet-lens/">Quiet Lens</a><a href="/essays/">Essays</a><a href="/principles/">Principles</a><a href="/ucla-anderson/">UCLA Anderson</a><a href="/conversations/">Conversations</a><a href="/dc-decoded/">DC Decoded</a><a href="/projects/">Projects</a><a href="/about/">About</a><a href="/contact/">Contact</a><a href="/subscribe/">Subscribe</a><a href="https://www.linkedin.com/in/gpraveen1882/" target="_blank" rel="noopener noreferrer">LinkedIn</a></div></div><div class="copyright">© <span class="year"></span> Praveen Gangaraju. Built for reading, not scrolling.</div></div></footer>'''

def shell(title,desc,canonical,body):
 return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{escape(title)} — Through My Quiet Lens</title><meta name="description" content="{escape(desc)}"><link rel="canonical" href="{base}{canonical}"><meta property="og:title" content="{escape(title)} — Through My Quiet Lens"><meta property="og:description" content="{escape(desc)}"><meta property="og:type" content="article"><meta property="og:url" content="{base}{canonical}"><meta name="twitter:card" content="summary"><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/styles.css"></head><body><a class="skip-link" href="#main">Skip to content</a><div class="site-shell">{header('ucla')}<main id="main">{body}</main>{footer}</div><script src="/site.js" defer></script></body></html>'''

udir=root/'ucla-anderson'; udir.mkdir(exist_ok=True)
# Collection
cards=''.join([f'''<article class="ucla-card"><p class="eyebrow">{i:02d}</p><h2><a href="/ucla-anderson/{a['slug']}/">{escape(a['title'])}</a></h2><p>{escape(a['subtitle'])}</p><div class="meta"><span>{a['read']}</span><span>{escape(a['date'])}</span></div><a class="read-link" href="/ucla-anderson/{a['slug']}/">Read reflection →</a></article>''' for i,a in enumerate(articles,1)])
body=f'''<section class="page-hero ucla-hero"><div class="container"><p class="eyebrow">A two-year journey</p><h1 class="page-title">UCLA Anderson</h1><p class="page-lead">Reflections on belonging, friendship, curiosity and the experiences that made an Executive MBA about far more than the degree.</p></div></section><section class="section"><div class="container"><div class="ucla-intro"><p class="section-kicker">Recommended reading path</p><p>These pieces are arranged as a journey—from arriving unsure of where I belonged, to discovering a village, new ways to use familiar skills, and friendships I did not expect.</p></div><div class="ucla-grid">{cards}</div><aside class="collection-callout"><p class="eyebrow">Related project</p><h2>Celebrate 2026</h2><p>A peer-led Drive Time podcast series capturing the stories behind the EMBA and FEMBA Class of 2026.</p><a class="read-link" href="/conversations/celebrate-2026/">Explore the series →</a></aside></div></section>'''
(udir/'index.html').write_text(shell('UCLA Anderson','Reflections from Praveen Gangaraju’s UCLA Anderson Executive MBA journey.','/ucla-anderson/',body),encoding='utf-8')

for i,a in enumerate(articles):
    prev=articles[i-1] if i>0 else None; nxt=articles[i+1] if i<len(articles)-1 else None
    paras=''.join(f'<p>{escape(txt)}</p>' for typ,txt in a['body'])
    tags=''.join(f'<span class="tag">{escape(t)}</span>' for t in a['tags'])
    prevlink=f'<a href="/ucla-anderson/{prev["slug"]}/">← {escape(prev["title"])}</a>' if prev else '<span></span>'
    nextlink=f'<a href="/ucla-anderson/{nxt["slug"]}/">{escape(nxt["title"])} →</a>' if nxt else '<a href="/ucla-anderson/">Back to the collection →</a>'
    content=f'''<article class="article-page ucla-article"><div class="article-header container"><p class="eyebrow">UCLA Anderson · Reflection {i+1:02d}</p><h1>{escape(a['title'])}</h1><p class="dek">{escape(a['subtitle'])}</p><div class="article-meta"><span>{a['read']}</span><span>{escape(a['date'])}</span></div><div class="tag-row">{tags}</div></div><div class="article-body container">{paras}<div class="source-note">Originally published on LinkedIn in {escape(a['date'])}. Lightly formatted for the web.</div><nav class="article-journey" aria-label="UCLA Anderson reading path">{prevlink}{nextlink}</nav></div></article>'''
    d=udir/a['slug']; d.mkdir(exist_ok=True)
    (d/'index.html').write_text(shell(a['title'],a['subtitle'],f'/ucla-anderson/{a["slug"]}/',content),encoding='utf-8')

# CSS additions
css=root/'styles.css'; s=css.read_text(encoding='utf-8')
add='''\n/* Project 3: UCLA Anderson collection */\n.ucla-hero{background:linear-gradient(135deg,rgba(39,74,64,.96),rgba(28,54,49,.96));color:#fff}.ucla-hero .eyebrow,.ucla-hero .page-lead{color:rgba(255,255,255,.78)}.ucla-intro{max-width:760px;margin:0 0 2.5rem}.ucla-intro p:last-child{font-family:var(--font-serif);font-size:1.35rem;line-height:1.55}.ucla-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.4rem}.ucla-card{padding:2rem;border:1px solid var(--line);background:var(--paper);border-radius:18px;display:flex;flex-direction:column;min-height:330px}.ucla-card h2{font-size:2rem;line-height:1.08;margin:.45rem 0 1rem}.ucla-card h2 a{text-decoration:none}.ucla-card>p:not(.eyebrow){font-size:1.03rem;line-height:1.65;color:var(--muted)}.ucla-card .meta{margin-top:auto;padding-top:1.25rem;display:flex;gap:.75rem;font-size:.84rem;color:var(--muted)}.collection-callout{margin-top:2rem;padding:2.2rem;border-radius:18px;background:var(--ink);color:#fff}.collection-callout .eyebrow,.collection-callout p{color:rgba(255,255,255,.76)}.collection-callout .read-link{color:#fff}.ucla-article .article-header{padding-top:5.5rem}.ucla-article .article-header h1{max-width:950px}.ucla-article .dek{max-width:800px}.ucla-article .article-body{max-width:760px}.source-note{margin-top:3.5rem;padding-top:1.25rem;border-top:1px solid var(--line);font-size:.88rem;color:var(--muted);font-family:var(--font-sans)}.article-journey{margin-top:2rem;padding:1.5rem 0;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:2rem;font-family:var(--font-sans);font-size:.92rem}.article-journey a{text-decoration:none;max-width:46%}.tag-row{display:flex;flex-wrap:wrap;gap:.55rem;margin-top:1rem}.tag{display:inline-flex;padding:.38rem .7rem;border:1px solid var(--line);border-radius:999px;font-size:.8rem;color:var(--muted)}@media(max-width:780px){.ucla-grid{grid-template-columns:1fr}.ucla-card{min-height:0;padding:1.5rem}.ucla-card h2{font-size:1.65rem}.ucla-article .article-header{padding-top:3.5rem}.article-journey{flex-direction:column}.article-journey a{max-width:100%}}\n'''
if 'Project 3: UCLA Anderson collection' not in s: css.write_text(s+add,encoding='utf-8')

# sitemap update
sm=root/'sitemap.xml'; x=sm.read_text(encoding='utf-8')
urls=['/ucla-anderson/']+[f'/ucla-anderson/{a["slug"]}/' for a in articles]
insert=''.join(f'  <url><loc>{base}{u}</loc></url>\n' for u in urls)
if f'{base}/ucla-anderson/' not in x:
    x=x.replace('</urlset>',insert+'</urlset>')
    sm.write_text(x,encoding='utf-8')

# delivery note
Path('/mnt/data/proj3work/PROJECT-3-DELIVERY.md').write_text('''# Project 3 — UCLA Anderson\n\nAdded a dedicated UCLA Anderson collection and five LinkedIn-derived reflections.\n\n## Included\n- Anderson Gave Me a Village\n- The Biggest Lessons Weren’t Always in the Classroom\n- The Most Unexpected Part of My MBA\n- The Degree Was the Destination. The Friendships Were the Surprise.\n- Six Hundred Photos, One Community\n\nThe existing Celebrate 2026 page is linked as a related project rather than duplicated.\n''',encoding='utf-8')

# zip
out=Path('/mnt/data/through-my-quiet-lens-project-3-complete.zip')
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
    for p in Path('/mnt/data/proj3work').rglob('*'):
        if p.is_file() and p.name!='build_project3.py':
            z.write(p,p.relative_to('/mnt/data/proj3work'))
print(out)
