import { cpSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();

const srcCss = resolve(root, 'src/css');
const srcJs = resolve(root, 'src/js');
const srcFoundry = resolve(root, 'src/foundry');

const distCss = resolve(root, 'dist/css');
const distJs = resolve(root, 'dist/js');
const distFoundry = resolve(root, 'dist/foundry');

mkdirSync(distCss, { recursive: true });
mkdirSync(distJs, { recursive: true });
mkdirSync(distFoundry, { recursive: true });

cpSync(srcCss, distCss, { recursive: true });
cpSync(srcJs, distJs, { recursive: true });
cpSync(srcFoundry, distFoundry, { recursive: true });

console.log('Axonyx UI build complete');
