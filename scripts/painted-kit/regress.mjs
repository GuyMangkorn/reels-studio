// Kit regression stills: fixed frames from the four painted episodes, one bundle.
// Usage: node scripts/painted-kit/regress.mjs --out=DIR   -> DIR/<COMP>_F<frame>.png
import {bundle} from '@remotion/bundler';
import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';

const out = process.argv.find((a) => a.startsWith('--out='))?.slice(6);
if (!out) throw new Error('--out=DIR is required');
const ids = ['WFOG-EP01-SHORT', 'ZCPAINT-SHORT-EN', 'BLOOP-EP01-SHORT', 'SHIPWRECK-SHORT'];
const fractions = [0.12, 0.3, 0.45, 0.6, 0.78, 0.92];
// Extra frames (character-heavy WFOG plates, every ~300 f) on top of the fractions; ids keep the name <ID>_F<frame>.png.
const extra = {'WFOG-EP01-SHORT': Array.from({length: 12}, (_, i) => 150 + i * 300)};
await mkdir(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: process.env.PUBLIC_DIR || undefined});
const chromiumOptions = {gl: 'angle'};
const browser = await openBrowser('chrome', {chromiumOptions});
const shoot = async (composition, id, frame) => renderStill({serveUrl, composition, browserInstance: browser, chromiumOptions, frame, output: `${out}/${id}_F${String(frame).padStart(4, '0')}.png`, imageFormat: 'png'});
try {
  for (const id of ids) {
    const composition = await selectComposition({serveUrl, id, browserInstance: browser, chromiumOptions});
    for (const fr of fractions) {
      await shoot(composition, id, Math.floor(composition.durationInFrames * fr));
    }
    for (const frame of (extra[id] ?? [])) {
      await shoot(composition, id, frame);
    }
    console.log(id, composition.durationInFrames);
  }
} finally {
  await browser.close({silent: true});
}
