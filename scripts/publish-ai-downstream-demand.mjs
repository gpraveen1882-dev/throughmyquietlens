import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'projects', 'ai-downstream-demand');
const destination = path.join(root, 'dist', 'projects', 'ai-downstream-demand');

if (!fs.existsSync(source)) {
  throw new Error(`Missing source folder: ${source}`);
}

fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.rmSync(destination, { recursive: true, force: true });
fs.cpSync(source, destination, { recursive: true });

console.log('Published AI Downstream Demand Monitor');
