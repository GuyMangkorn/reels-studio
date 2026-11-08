// Render the hand macro check stills (src/painted/kit/hands-macro-sheet.tsx, composition KIT-HAND-MACRO): one 1080x1920 PNG per spec id, one bundle, one Chrome.
// Usage: node scripts/painted-kit/hand-macro.mjs --out=DIR [--only=POV-flat,TRY-tp]   -> DIR/<spec>.png   (no --only: every spec; ids: see SPEC_IDS in the sheet)
// Tile the result with `scripts/qa-sheet.sh OUT.png --cols 4 DIR/*.png` (270 px tiles).
import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition} from '@remotion/renderer';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import {renderStills} from '../stills.mjs';

const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const out = arg('out');
if (!out) throw new Error('--out=DIR is required');
const only = arg('only')?.split(',');
await mkdir(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/painted/kit/hands-macro-sheet.tsx')});
const chromiumOptions = {gl: 'angle'};
const browser = await openBrowser('chrome', {chromiumOptions});
try {
  const base = await selectComposition({serveUrl, id: 'KIT-HAND-MACRO', inputProps: {spec: 'POV-flat'}, puppeteerInstance: browser, chromiumOptions});
  const poses = ['flat', 'tp', 'lift-thumb', 'lift-index', 'lift-little', 'ring-strain', 'ring-hair', 'ring-diagram'];
  const all = ['PLAN-flat', 'PLAN-tp', ...['POV', 'TRY'].flatMap((c) => poses.map((p) => `${c}-${p}`)), 'DIAG-W-flat-alpha', 'DIAG-B-flat-alpha', 'TRY-tp-alpha-taut', 'SP3-B01SH04', 'SP3-B02SH02'];
  const ids = only ?? all;
  for (const spec of ids) {
    const inputProps = {spec};
    const composition = {...base, props: inputProps};
    const file = `${out}/${spec}.png`;
    await renderStills({serveUrl, composition, inputProps, puppeteerInstance: browser, chromiumOptions, timeoutInMilliseconds: 180000, frames: [11], outputFor: () => file, onStill: () => console.log(file)});
  }
} finally {
  await browser.close({silent: true});
}
