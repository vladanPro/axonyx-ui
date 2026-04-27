import { cpSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();

const srcCss = resolve(root, 'src/css');
const srcJs = resolve(root, 'src/js');

const distCss = resolve(root, 'dist/css');
const distJs = resolve(root, 'dist/js');

mkdirSync(distCss, { recursive: true });
mkdirSync(distJs, { recursive: true });

cpSync(srcCss, distCss, { recursive: true });
cpSync(srcJs, distJs, { recursive: true });

console.log('Axonyx UI build complete');
