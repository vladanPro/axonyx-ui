import { cpSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();

const srcCss = resolve(root, 'src/css');
const srcJs = resolve(root, 'src/js');
const srcFoundry = resolve(root, 'src/foundry');
const srcBlocks = resolve(root, 'src/blocks');

const distCss = resolve(root, 'dist/css');
const distJs = resolve(root, 'dist/js');
const distFoundry = resolve(root, 'dist/foundry');
const distBlocks = resolve(root, 'dist/blocks');

mkdirSync(distCss, { recursive: true });
mkdirSync(distJs, { recursive: true });
mkdirSync(distFoundry, { recursive: true });
mkdirSync(distBlocks, { recursive: true });

cpSync(srcCss, distCss, { recursive: true });
cpSync(srcJs, distJs, { recursive: true });
cpSync(srcFoundry, distFoundry, { recursive: true });
cpSync(srcBlocks, distBlocks, { recursive: true });
cpSync(resolve(root, 'Axonyx.registry.toml'), resolve(root, 'dist/Axonyx.registry.toml'));

console.log('Axonyx UI build complete');
