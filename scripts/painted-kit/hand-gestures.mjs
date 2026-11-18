// Render the hand gesture reference sheet (src/painted/kit/hand-gestures-sheet.tsx, composition KIT-HAND-GESTURES): one 1080x1920 PNG per gesture, one bundle, one Chrome.
// Usage: node scripts/painted-kit/hand-gestures.mjs --out=DIR [--only=point,fist]   -> DIR/<gesture>.png   (no --only: every gesture)
// Tile with `scripts/qa-sheet.sh OUT.png --cols 5 DIR/*.png` (270 px tiles).
import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition} from '@remotion/renderer';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import {renderStills} from '../stills.mjs';

const ALL = ['relaxed', 'open-spread', 'stop', 'point', 'fist', 'thumbs-up', 'pinch', 'ok', 'peace', 'three', 'four', 'grip', 'hold-pen', 'cupped', 'claw'];
const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const out = arg('out');
if (!out) throw new Error('--out=DIR is required');
const ids = arg('only')?.split(',') ?? ALL;
await mkdir(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/painted/kit/hand-gestures-sheet.tsx')});
const chromiumOptions = {gl: 'angle'};
const browser = await openBrowser('chrome', {chromiumOptions});
try {
  const base = await selectComposition({serveUrl, id: 'KIT-HAND-GESTURES', inputProps: {gesture: ids[0]}, puppeteerInstance: browser, chromiumOptions});
  for (const gesture of ids) {
    const inputProps = {gesture};
    const file = `${out}/${gesture}.png`;
    await renderStills({serveUrl, composition: {...base, props: inputProps}, inputProps, puppeteerInstance: browser, chromiumOptions, timeoutInMilliseconds: 180000, frames: [0], outputFor: () => file, onStill: () => console.log(file)});
  }
} finally {
  await browser.close({silent: true});
}
