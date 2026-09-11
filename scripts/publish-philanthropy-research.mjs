import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const source = path.join(root, 'projects', 'philanthropy-research', 'index.html');
const destination = path.join(dist, 'projects', 'philanthropy-research', 'index.html');

if (!fs.existsSync(source)) {
  throw new Error('Missing source page: projects/philanthropy-research/index.html');
}

fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.copyFileSync(source, destination);

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
  const loc = '<url><loc>https://throughmyquietlens.com/projects/philanthropy-research/</loc></url>';
  if (!xml.includes('/projects/philanthropy-research/')) {
    xml = xml.replace('</urlset>', `${loc}</urlset>`);
    fs.writeFileSync(sitemap, xml);
  }
}

console.log('Published philanthropy research project page.');
