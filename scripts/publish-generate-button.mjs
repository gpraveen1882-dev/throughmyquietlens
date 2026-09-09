import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'content', 'essays.json');
const essays = JSON.parse(fs.readFileSync(file, 'utf8'));

const slug = 'the-generate-button-tells-us-nothing';
if (!essays.some((e) => e.slug === slug)) {
  essays.unshift({
    slug,
    title: 'The Generate Button Tells Us Nothing',
    description: 'AI makes creation effortless, but hides the resources behind it. What if AI gave us feedback on energy use the way cars, electricity bills and Screen Time already do?',
    date: '2026-09-09',
    readingTime: '5 min read',
    tags: ['AI', 'Sustainability', 'Energy', 'Behaviour'],
    featured: false,
    source: 'Original',
    collection: 'SAGE for AI',
    bodyHtml: `<p>My wife and I used to have a recurring argument at home.</p>
<p>I would leave the light on in an empty room. Sometimes the fan would keep running after I had walked out. I was also more careless with water than I should have been.</p>
<p>She would notice these things immediately.</p>
<p>I often didn't.</p>
<p>Over time, I became much more conscious of them.</p>
<p>You see a tap running and you know water is being used.</p>
<p>You see a light or fan on in an empty room and you know electricity is being used when nobody needs it.</p>
<p>Recently, I was playing around with AI image generation.</p>
<p>Upload a picture. Ask for a change. Generate.</p>
<p>Not quite right.</p>
<p>Change something. Generate again.</p>
<p>Try another version.</p>
<p>Generate again.</p>
<p>I didn't think much about it.</p>
<p>Then I came across a number that made me look at what I was doing differently.</p>
<p>A 2024 study measuring the energy used by different AI tasks found that image generation averaged about <strong>2.9 watt-hours per image across the models it tested</strong>.</p>
<p>To put that into something I could understand, that's roughly the electricity a 10-watt LED bulb uses in about <strong>17 minutes</strong>.</p>
<p>The exact number varies considerably depending on the model, hardware and resolution. So 2.9 Wh should not be read as the footprint of every AI image.</p>
<p>But the comparison made me stop.</p>
<p>If I walk past an empty room and see a light on, I notice it.</p>
<p>Yet I can generate five versions of an image, discard four of them, and never once think about electricity.</p>
<p>What finally appears on my screen may be one image. But from my own experience, getting there can take several generations.</p>
<p>And every generation requires computation.</p>
<p>Electricity isn't the only consideration either. All that computing produces heat. Data centres need cooling, and depending on where and how they operate, that can also have a water footprint.</p>
<p>I don't think generating an image for fun is wrong. Nor am I arguing that AI is necessarily worse than other ways of creating something. A designer working on a computer uses electricity too.</p>
<p>Something else interests me more.</p>
<p><strong>I can't see any of it.</strong></p>
<p>When I press <strong>Generate</strong>, the physical resources behind that action disappear from my view.</p>
<p>And perhaps asking people simply to “be more aware” is not much of an answer.</p>
<p>We have solved this differently elsewhere.</p>
<p>My car tells me its fuel efficiency.</p>
<p>It doesn't ask me to stop driving. It gives me information about how efficiently I am using fuel.</p>
<p>My electricity bill tells me how much electricity my household consumed, how that changed over time and how my usage compares with similar households.</p>
<p>And my phone does something similar.</p>
<p>Every week, Screen Time tells me how much time I spent on my phone and whether that went up or down.</p>
<p>It doesn't stop me from opening another app.</p>
<p>It gives me feedback.</p>
<p>So why couldn't AI do something similar?</p>
<p>Imagine a simple weekly report:</p>
<p><strong>Your AI Resource Report</strong></p>
<p>Estimated energy used this week<br>Change from last week<br>Number of images generated<br>Energy used by image generation<br>Your average over time</p>
<p>Or perhaps something even simpler — an AI equivalent of the mileage indicator in a car.</p>
<p>Not a warning.</p>
<p>Not a guilt score.</p>
<p>Just information.</p>
<p>And this isn't entirely hypothetical.</p>
<p>Google has already published a methodology for estimating the energy, carbon and water footprint of AI inference at scale.</p>
<p>Would an energy number beside every prompt be perfectly accurate?</p>
<p>Probably not.</p>
<p>Models differ. Hardware differs. Data centres differ. Electricity sources and cooling systems differ. Water use varies even more.</p>
<p>But perhaps it doesn't need to pretend to be perfectly precise.</p>
<p>An estimate can still provide useful feedback.</p>
<p>There may be another reason this matters.</p>
<p>AI is becoming faster, cheaper and easier to use.</p>
<p>That is a good thing.</p>
<p>But if something becomes twice as efficient and we start using three times as much of it because it has become effortless, efficiency alone doesn't necessarily reduce total consumption.</p>
<p>That brings me back to the light in my house.</p>
<p>My wife wasn't asking me to sit in the dark.</p>
<p>She was asking me to switch off the light when I didn't need it.</p>
<p>Eventually, I learned to notice.</p>
<p>Perhaps AI doesn't need more lectures telling people to use it responsibly.</p>
<p>Perhaps it needs something much simpler.</p>
<p><strong>A meter.</strong></p>
<p>My car tells me my fuel efficiency.</p>
<p>My electricity bill tells me how much I used.</p>
<p>My phone tells me how my screen time changed.</p>
<p>None of them tells me what I should do.</p>
<p>They give me feedback.</p>
<p>Why shouldn't AI do the same?</p>
<p>The goal is not to make AI harder to use.</p>
<p><strong>It is to make what happens behind the Generate button a little easier to see.</strong></p>
<hr>
<h2>Sources &amp; Further Reading</h2>
<p><strong><a href="https://facctconference.org/static/papers24/facct24-6.pdf" rel="noopener noreferrer">Luccioni, Jernite &amp; Strubell — <em>Power Hungry Processing: Watts Driving the Cost of AI Deployment?</em> (ACM FAccT, 2024)</a></strong><br>Energy measurements across machine-learning inference tasks, including the image-generation benchmark discussed above.</p>
<p><strong><a href="https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference/" rel="noopener noreferrer">Google — <em>Measuring the Environmental Impact of Delivering AI at Google Scale</em> (2025)</a></strong><br>Google's methodology for estimating the energy, carbon and water associated with AI inference.</p>
<p><strong><a href="https://eta-publications.lbl.gov/publications/water-use-data-center-workloads" rel="noopener noreferrer">Lawrence Berkeley National Laboratory — <em>The Water Use of Data Center Workloads</em> (2025)</a></strong><br>Research examining how data-centre workload water use varies with cooling technology, climate, electricity source, server efficiency and other factors.</p>`
  });
  fs.writeFileSync(file, JSON.stringify(essays, null, 2) + '\n');
}
