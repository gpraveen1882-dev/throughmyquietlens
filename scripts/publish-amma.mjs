import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'essays', 'for-amma-on-her-birthday');
const target = path.join(root, 'dist', 'essays', 'for-amma-on-her-birthday');

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.cpSync(source, target, { recursive: true });

const homePath = path.join(root, 'dist', 'index.html');
let home = fs.readFileSync(homePath, 'utf8');

const card = '<article class="home-recent-item"><h3><a href="/essays/for-amma-on-her-birthday/">For Amma, on Her Birthday</a></h3><p class="pub-date home-recent-date">August 30, 2026</p><p>A birthday note about a mother whose love was rarely said, but always shown.</p><a class="read-link" href="/essays/for-amma-on-her-birthday/">Read →</a></article>';

if (!home.includes('/essays/for-amma-on-her-birthday/')) {
  home = home.replace('<div class="home-recent-list">', `<div class="home-recent-list">${card}`);

  const recentMatch = home.match(/<div class="home-recent-list">([\s\S]*?)<\/div><\/div><\/section>/);
  if (recentMatch) {
    const cards = recentMatch[1].match(/<article class="home-recent-item">[\s\S]*?<\/article>/g) || [];
    const trimmed = cards.slice(0, 5).join('');
    home = home.replace(recentMatch[0], `<div class="home-recent-list">${trimmed}</div></div></section>`);
  }
}

fs.writeFileSync(homePath, home);
