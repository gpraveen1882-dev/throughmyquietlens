import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const sourceDir = path.join(root, 'projects', 'philanthropy-research');
const destinationDir = path.join(dist, 'projects', 'philanthropy-research');

if (!fs.existsSync(path.join(sourceDir, 'index.html'))) {
  throw new Error('Missing source page: projects/philanthropy-research/index.html');
}

fs.mkdirSync(destinationDir, { recursive: true });
fs.cpSync(sourceDir, destinationDir, { recursive: true });

// Add a visible path from the exploratory project page into the working demonstration.
const projectPage = path.join(destinationDir, 'index.html');
if (fs.existsSync(projectPage)) {
  let html = fs.readFileSync(projectPage, 'utf8');
  if (!html.includes('Open the demonstration workspace')) {
    const marker = '<p class="quiet-note" style="margin-top:1.2rem"><strong>What it is not:</strong>';
    const demoLink = '<p style="margin-top:1.25rem"><a class="button" href="/projects/philanthropy-research/demo/">Open the demonstration workspace →</a></p>';
    html = html.replace(marker, `${demoLink}${marker}`);
    fs.writeFileSync(projectPage, html);
  }
}

const projectsIndex = path.join(dist, 'projects', 'index.html');
if (fs.existsSync(projectsIndex)) {
  let html = fs.readFileSync(projectsIndex, 'utf8');
  if (!html.includes('/projects/philanthropy-research/')) {
    const card = '<article class="project-card"><p class="eyebrow">Exploratory project</p><h2>Research Behind Philanthropy Decisions</h2><p>A question that grew out of doing the work once: when advisers or smaller family offices need to map a cause, screen organisations and prepare for diligence, who has the bandwidth to do the research?</p><a class="read-link" href="/projects/philanthropy-research/">Explore the question →</a></article>';
    html = html.replace('</div></section></main>', `${card}</div></section></main>`);
    fs.writeFileSync(projectsIndex, html);
  }
}

const sitemap = path.join(dist, 'sitemap.xml');
if (fs.existsSync(sitemap)) {
  let xml = fs.readFileSync(sitemap, 'utf8');
  const entries = [
    '<url><loc>https://throughmyquietlens.com/projects/philanthropy-research/</loc></url>',
    '<url><loc>https://throughmyquietlens.com/projects/philanthropy-research/demo/</loc></url>'
  ];
  for (const loc of entries) {
    const url = loc.match(/<loc>(.*?)<\/loc>/)[1];
    if (!xml.includes(url)) xml = xml.replace('</urlset>', `${loc}</urlset>`);
  }
  fs.writeFileSync(sitemap, xml);
}

console.log('Published philanthropy research project and demonstration workspace.');
