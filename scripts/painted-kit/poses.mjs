// Render the pose library sheets (src/painted/kit/poses-sheet.tsx): KIT-POSES (all poses) and the pages KIT-POSES-A/B/C, one bundle, one Chrome.
// Usage: node scripts/painted-kit/poses.mjs --out=DIR [--only=KIT-POSES,KIT-POSES-C]  -> DIR/<COMPOSITION>.png
//        node scripts/painted-kit/poses.mjs --out=DIR --close=P13,P14 [--unit=500] [--cols=1] [--name=close-a]  -> DIR/<name>.png (the chosen poses, larger)
import {bundle} from '@remotion/bundler';
import {getCompositions, openBrowser, selectComposition} from '@remotion/renderer';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import {renderStills} from '../stills.mjs';

const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const out = arg('out');
if (!out) throw new Error('--out=DIR is required');
const only = arg('only')?.split(',');
const close = arg('close')?.split(',');
await mkdir(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/painted/kit/poses-sheet.tsx')});
const chromiumOptions = {gl: 'angle'};
const browser = await openBrowser('chrome', {chromiumOptions});
try {
  if (close) {
    const inputProps = {ids: close, unit: Number(arg('unit') ?? 500), cols: Number(arg('cols') ?? 1)};
    const composition = await selectComposition({serveUrl, id: 'KIT-POSES-CLOSE', inputProps, puppeteerInstance: browser, chromiumOptions});
    const file = `${out}/${arg('name') ?? 'KIT-POSES-CLOSE'}.png`;
    await renderStills({serveUrl, composition, inputProps, puppeteerInstance: browser, chromiumOptions, timeoutInMilliseconds: 180000, frames: [0], outputFor: () => file, onStill: () => console.log(file)});
  } else {
  const compositions = (await getCompositions(serveUrl, {puppeteerInstance: browser, chromiumOptions})).filter((c) => !only || only.includes(c.id));
  for (const composition of compositions) {
    await renderStills({serveUrl, composition, puppeteerInstance: browser, chromiumOptions, timeoutInMilliseconds: 180000, frames: [0], outputFor: () => `${out}/${composition.id}.png`, onStill: () => console.log(`${out}/${composition.id}.png`)});
  }
  }
} finally {
  await browser.close({silent: true});
}
