import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const siteRoot = resolve(process.env.AXONYX_SITE_UI || join(root, '..', 'axonyx-site-ui'));
const reactRoot = resolve(process.env.AXONYX_REACT || join(root, '..', 'axonyx-react'));
const registry = readFileSync(join(root, 'Axonyx.registry.toml'), 'utf8');
const names = readdirSync(join(root, 'src', 'foundry'))
  .filter((name) => name.endsWith('.asx'))
  .map((name) => name.slice(0, -4))
  .sort((left, right) => left.localeCompare(right));

function registryEntries(kind) {
  return registry
    .split(/\r?\n(?=\[\[(?:components|blocks)\]\])/)
    .filter((part) => part.startsWith(`[[${kind}]]`))
    .map((part) => ({
      name: part.match(/^name = "([^"]+)"/m)?.[1],
      preview: part.match(/^preview = "([^"]+)"/m)?.[1],
    }));
}

function filesUnder(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });
}

const components = new Map(registryEntries('components').map((entry) => [entry.name, entry]));
const blocks = registryEntries('blocks');
const catalogAvailable = existsSync(join(siteRoot, 'app', 'components'));
const catalogImports = new Map();

if (catalogAvailable) {
  const appRoot = join(siteRoot, 'app');
  for (const file of filesUnder(join(appRoot, 'components'))) {
    if (!/^page\.(?:ax|asx)$/.test(file.split(sep).at(-1))) continue;
    const route = `/${relative(appRoot, dirname(file)).split(sep).join('/')}`;
    const source = readFileSync(file, 'utf8');
    const imports = source.matchAll(/^\s*import\s+.*?from\s+["']@axonyx\/ui\/foundry\/([\w-]+)(?:\.asx)?["']/gm);
    for (const match of imports) {
      const routes = catalogImports.get(match[1]) || new Set();
      routes.add(route);
      catalogImports.set(match[1], routes);
    }
  }
}

const reactAvailable = existsSync(join(reactRoot, 'src', 'index.ts'));
const reactExports = new Map();

if (reactAvailable) {
  for (const entry of ['index', 'client']) {
    const barrel = readFileSync(join(reactRoot, 'src', `${entry}.ts`), 'utf8');
    for (const match of barrel.matchAll(/^export \* from "\.\/components\/([\w-]+)";/gm)) {
      const path = join(reactRoot, 'src', 'components', `${match[1]}.tsx`);
      if (!existsSync(path)) continue;
      const source = readFileSync(path, 'utf8');
      for (const declaration of source.matchAll(/\bexport\s+(?:const|function|class)\s+(\w+)/g)) {
        reactExports.set(declaration[1], entry === 'client' ? 'client' : 'server');
      }
    }
  }
}

const fastChecks = catalogAvailable
  ? (readFileSync(join(siteRoot, 'aegis.toml'), 'utf8').match(/^\[\[fast\]\]/gm) || []).length
  : null;
const browserChecks = catalogAvailable
  ? (readFileSync(join(siteRoot, 'aegis.toml'), 'utf8').match(/^\[\[browser\]\]/gm) || []).length
  : null;
const catalogCount = names.filter((name) => catalogImports.has(name)).length;
const uncatalogued = names.filter((name) => !catalogImports.has(name));
const registryPreviewCount = [...components.values()].filter((entry) => catalogImports.get(entry.name)?.has(entry.preview)).length;
const reactCount = names.filter((name) => reactExports.has(name)).length;
const label = (available, value) => available ? value : 'not scanned';

const lines = [
  '# Foundry native component coverage',
  '',
  'Generate this inventory with `node scripts/audit-component-coverage.mjs --write` from `axonyx-ui`.',
  'Set `AXONYX_SITE_UI` and `AXONYX_REACT` when the sibling repositories live elsewhere.',
  '',
  'This is a **source inventory**, not a completion certificate. A catalog import proves only that',
  'a page references a component; a React export proves only that a named adapter is exported.',
  'Neither proves correct behavior, accessibility, responsive layout, or native/React parity.',
  '`?` means no component-specific browser QA evidence has been recorded in this inventory.',
  '',
  `- Native Foundry source files: ${names.length}`,
  `- Registry component entries: ${components.size}; other files may be subcomponents or unregistered primitives`,
  `- Catalog source imports: ${label(catalogAvailable, `${catalogCount} native components`)}`,
  `- No direct catalog source import: ${label(catalogAvailable, `${uncatalogued.length} (${uncatalogued.join(', ')})`)}`,
  `- Registry previews with a direct component import: ${label(catalogAvailable, `${registryPreviewCount}/${components.size}`)}`,
  `- Named React exports: ${label(reactAvailable, `${reactCount} native component names`)}`,
  `- Blocks: ${filesUnder(join(root, 'src', 'blocks')).filter((file) => file.endsWith('.asx')).length} source files, ${blocks.length} registry entries`,
  `- Catalog Aegis checks: ${label(catalogAvailable, `${fastChecks} fast HTTP, ${browserChecks} browser`)}`,
  '',
  '| Native component | Registry | Catalog source import | React export | Interaction QA | Keyboard QA | Mobile QA |',
  '| --- | --- | --- | --- | --- | --- | --- |',
];

for (const name of names) {
  const registration = components.get(name);
  const routes = [...(catalogImports.get(name) || [])].sort();
  const primaryRoute = registration?.preview && routes.includes(registration.preview)
    ? registration.preview : routes[0];
  const catalog = !catalogAvailable ? 'not scanned'
    : registration && !routes.includes(registration.preview) ? 'registry preview lacks direct import'
    : primaryRoute ? `\`${primaryRoute}\`${routes.length > 1 ? ` (+${routes.length - 1})` : ''}` : '-';
  const adapter = !reactAvailable ? 'not scanned' : reactExports.get(name) || '-';
  lines.push(`| ${name} | ${registration ? 'yes' : '-'} | ${catalog} | ${adapter} | ? | ? | ? |`);
}

lines.push('', '## Next audit pass', '',
  'Prioritize forms and overlays used in the CMS path. For each public control, record actual',
  'mouse/touch, keyboard, focus, open/close, disabled/error, and mobile results before changing',
  'its QA columns from `?`. Add browser checks to the catalog; fast HTTP checks only prove',
  'that routes respond and expected text is present.', '');

const report = lines.join('\n');
if (process.argv.includes('--write')) {
  writeFileSync(join(root, 'docs', 'component-coverage.md'), report);
  console.log('Wrote docs/component-coverage.md');
} else {
  console.log(report);
}
