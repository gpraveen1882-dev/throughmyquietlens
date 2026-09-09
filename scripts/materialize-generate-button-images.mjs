import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const essaysFile = path.join(root, 'content', 'essays.json');
const publicImages = path.join(root, 'public', 'images');
const essays = JSON.parse(fs.readFileSync(essaysFile, 'utf8'));
const essay = essays.find((e) => e.slug === 'the-generate-button-tells-us-nothing');

if (essay?.bodyHtml) {
  fs.mkdirSync(publicImages, { recursive: true });

  const materialize = (alt, filename) => {
    const escapedAlt = alt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`<img([^>]*?)src="data:image\\/jpeg;base64,([^"]+)"([^>]*?)alt="${escapedAlt}"([^>]*)>`, 'i');
    let match = essay.bodyHtml.match(re);

    // Fallback for markup where alt appears before src.
    if (!match) {
      const generic = new RegExp(`<img([^>]*?)alt="${escapedAlt}"([^>]*?)src="data:image\\/jpeg;base64,([^"]+)"([^>]*)>`, 'i');
      const m = essay.bodyHtml.match(generic);
      if (m) {
        fs.writeFileSync(path.join(publicImages, filename), Buffer.from(m[3], 'base64'));
        essay.bodyHtml = essay.bodyHtml.replace(generic, `<img$1alt="${alt}"$2src="/images/${filename}"$4>`);
        return;
      }
    }

    if (match) {
      fs.writeFileSync(path.join(publicImages, filename), Buffer.from(match[2], 'base64'));
      essay.bodyHtml = essay.bodyHtml.replace(re, `<img$1src="/images/${filename}"$3alt="${alt}"$4>`);
    }
  };

  materialize('SP electricity consumption comparison', 'generate-button-sp.jpg');
  materialize('iPhone Screen Time weekly report', 'generate-button-screen-time.jpg');

  fs.writeFileSync(essaysFile, JSON.stringify(essays, null, 2) + '\n');
}
