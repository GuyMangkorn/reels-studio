#!/usr/bin/env node
// Scaffolds painted shot files under the one-shot-one-file convention (docs/sequence-workflow.md#one-shot-one-file):
//   node scripts/new-shot.mjs <episode> <SHOT-ID> [<SHOT-ID> ...] [--root=<checkout>]
// Each shot gets src/painted/<episode>/shots/<SHOT-ID>.tsx, imported and listed by the episode inventory
// src/painted/shots/<episode>.tsx. A new inventory is created with its markers and registered in src/painted/registry.ts.
// The inventory only lists shot files (scripts/render-inputs.ts keeps a shot file shared when it does more), so a code
// fix to one shot repaints only the scenes showing it.
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const IMPORTS = '// new-shot: imports';
const SHOTS = '  // new-shot: shots';
const fail = (message) => {console.error(`new-shot: ${message}`); process.exit(1);};

const args = process.argv.slice(2);
const root = path.resolve(args.find((a) => a.startsWith('--root='))?.slice(7) ?? '.');
const [episode, ...ids] = args.filter((a) => !a.startsWith('--'));
if (!episode || !ids.length) fail('usage: node scripts/new-shot.mjs <episode> <SHOT-ID> [<SHOT-ID> ...]');
if (!/^[a-z0-9][a-z0-9-]*$/.test(episode)) fail(`episode folder "${episode}" must be lower-case letters, digits and hyphens`);
for (const id of ids) if (!/^[A-Za-z0-9][A-Za-z0-9-]*$/.test(id)) fail(`shot ID "${id}" must be letters, digits and hyphens; the file is named after it`);

const camel = episode.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const listName = `${camel}Shots`;
const binding = (id) => `shot_${id.replace(/-/g, '_')}`;
const inventory = path.join(root, 'src/painted/shots', `${episode}.tsx`);
const registry = path.join(root, 'src/painted/registry.ts');
const shotFile = (id) => path.join(root, 'src/painted', episode, 'shots', `${id}.tsx`);

for (const id of ids) if (existsSync(shotFile(id))) fail(`${path.relative(root, shotFile(id))} already exists`);

const created = [];
if (!existsSync(inventory)) {
  if (!existsSync(registry)) fail('src/painted/registry.ts not found; run from the checkout root or pass --root');
  writeFileSync(inventory, `import type {PaintedShot} from '../shot';
${IMPORTS}

// ${episode} inventory. One shot, one file (docs/sequence-workflow.md#one-shot-one-file): list each shot file here and
// do nothing else with it, so a fix to one shot repaints only that shot. Add shots with scripts/new-shot.mjs.
export const ${listName}: PaintedShot[] = [
${SHOTS}
];
`);
  let text = readFileSync(registry, 'utf8');
  const lastImport = [...text.matchAll(/^import \{[^}]+\} from '\.\/shots\/[^']+';$/gm)].at(-1);
  if (!lastImport || !text.includes('const all: PaintedShot[] = [')) fail('cannot find the inventory imports or `const all` in src/painted/registry.ts');
  const at = lastImport.index + lastImport[0].length;
  text = `${text.slice(0, at)}\nimport {${listName}} from './shots/${episode}';${text.slice(at)}`;
  text = text.replace('const all: PaintedShot[] = [', `const all: PaintedShot[] = [...${listName}, `);
  writeFileSync(registry, text);
  created.push(path.relative(root, inventory), `${path.relative(root, registry)} (registered)`);
}

let list = readFileSync(inventory, 'utf8');
if (!list.includes(IMPORTS) || !list.includes(SHOTS)) {
  fail(`${path.relative(root, inventory)} has no "${IMPORTS}" / "${SHOTS.trim()}" markers; add them (imports above, shots inside the exported array) or list the shot by hand`);
}
for (const id of ids) {
  const file = shotFile(id);
  mkdirSync(path.dirname(file), {recursive: true});
  writeFileSync(file, `import type {PaintedShot} from '../../shot';
import {STILL_CAMERA} from '../../kit/camera';

// ${id}: this shot's own staging, camera, poses and timing. Shared art (kit, characters, sets) is imported, never copied.
export const shot: PaintedShot = {
  id: '${id}',
  serves: ['${id}'],
  paper: '#f2ead8',
  camera: () => STILL_CAMERA,
  paint: () => {},
};
`);
  list = list.replace(IMPORTS, `import {shot as ${binding(id)}} from '../${episode}/shots/${id}';\n${IMPORTS}`);
  list = list.replace(SHOTS, `  ${binding(id)},\n${SHOTS}`);
  created.push(path.relative(root, file));
}
writeFileSync(inventory, list);
console.log(`new-shot: ${created.join(', ')}`);
