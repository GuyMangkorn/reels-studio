// Render the hand kit sheets (src/painted/kit/hand-kits-sheet.tsx): KIT-POV-HANDS (first-person, pov-hands.ts) or KIT-MID-HANDS (1.3 m thigh-up figure,
// mid-hands.ts). One 1080x1920 PNG per action, one bundle, one Chrome.
// Usage: node scripts/painted-kit/hand-kits.mjs --kit=pov|mid --out=DIR [--only=wave,stop] [--engine=three|svg|painted (pov; mid: three|painted; default three: Three.js toon hands and props, user 18 Nov 2026)] [--look=pianist (pov: the macro's fuller hand look)]   -> DIR/<action>.png (no --only: every action)
// Tile with `scripts/qa-sheet.sh OUT.png --cols 5 DIR/*.png` (270 px tiles).
import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition} from '@remotion/renderer';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import {renderStills} from '../stills.mjs';

const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const kit = arg('kit'), out = arg('out');
if (!['pov', 'mid'].includes(kit) || !out) throw new Error('--kit=pov|mid and --out=DIR are required');
const id = kit === 'pov' ? 'KIT-POV-HANDS' : 'KIT-MID-HANDS';
await mkdir(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/painted/kit/hand-kits-sheet.tsx')});
const chromiumOptions = {gl: 'angle'};
const browser = await openBrowser('chrome', {chromiumOptions});
try {
  const ids = arg('only')?.split(',') ?? (await listIds());
  const base = await selectComposition({serveUrl, id, inputProps: {action: ids[0]}, puppeteerInstance: browser, chromiumOptions});
  for (const action of ids) {
    const inputProps = {action, ...(arg('engine') ? {engine: arg('engine')} : {}), ...(arg('look') ? {look: arg('look')} : {}), ...(arg('debug') ? {debug: true} : {})};
    const file = `${out}/${action}.png`;
    await renderStills({serveUrl, composition: {...base, props: inputProps}, inputProps, puppeteerInstance: browser, chromiumOptions, timeoutInMilliseconds: 180000, frames: [0], outputFor: () => file, onStill: () => console.log(file)});
  }
} finally {
  await browser.close({silent: true});
}
async function listIds() {
  // Action ids are the keys of POV_ACTIONS / MID_ACTIONS: read them from the source so this script needs no TS loader.
  const {readFile} = await import('node:fs/promises');
  const src = await readFile(`src/painted/kit/${kit}-hands.ts`, 'utf8');
  const body = src.slice(src.indexOf(`export const ${kit.toUpperCase()}_ACTIONS = {`), src.indexOf('} satisfies Record<string,'));
  return [...body.matchAll(/^  '?([a-z-]+)'?: \{/gm)].map((m) => m[1]);
}
