import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
const bookingUrl = 'https://calendar.app.google/WTPa7neXrtfVNXsA7';

function updateFile(relativePath, transform) {
  const file = path.join(out, relativePath);
  if (!fs.existsSync(file)) return;
  const original = fs.readFileSync(file, 'utf8');
  const updated = transform(original);
  if (updated !== original) fs.writeFileSync(file, updated);
}

updateFile('contact/index.html', (html) => {
  if (html.includes(bookingUrl)) return html;
  const marker = '<h2>LinkedIn</h2>';
  const booking = `<div class="contact-booking"><h2>15-minute conversation</h2><p>If something on the site stayed with you, raised a question, or you would simply like to connect, feel free to pick a 15-minute slot.</p><p><a class="button" href="${bookingUrl}" target="_blank" rel="noopener noreferrer">Book 15 minutes →</a></p></div>`;
  return html.replace(marker, `${booking}${marker}`);
});

updateFile('about/index.html', (html) => {
  if (html.includes(bookingUrl)) return html;
  const marker = '<a href="mailto:mail@throughmyquietlens.com">Email →</a>';
  const booking = `<a href="${bookingUrl}" target="_blank" rel="noopener noreferrer">Book 15 minutes →</a>`;
  return html.replace(marker, `${marker}${booking}`);
});

console.log('Added booking links to Contact and About');
