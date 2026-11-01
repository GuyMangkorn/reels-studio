// Render the people model sheets (src/painted/kit/people-sheet.tsx): the lineup, one sheet per PEOPLE id, KIT-EXPRESSIONS and KIT-WARDROBE,
// one bundle, one Chrome.
// Usage: node scripts/painted-kit/people.mjs --out=DIR [--only=<id,id>]  -> DIR/KIT-PEOPLE-LINEUP.png, DIR/KIT-PERSON-<id>.png,
//        DIR/KIT-EXPRESSIONS.png, DIR/KIT-WARDROBE.png   (--only takes PEOPLE ids or composition ids, e.g. --only=KIT-WARDROBE,KIT-EXPRESSIONS)
import {bundle} from '@remotion/bundler';
import {getCompositions, openBrowser} from '@remotion/renderer';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import {renderStills} from '../stills.mjs';

const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const out = arg('out');
if (!out) throw new Error('--out=DIR is required');
const only = arg('only')?.split(',');
await mkdir(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/painted/kit/people-sheet.tsx')});
const chromiumOptions = {gl: 'angle'};
const browser = await openBrowser('chrome', {chromiumOptions});
try {
  const compositions = (await getCompositions(serveUrl, {puppeteerInstance: browser, chromiumOptions})).filter((c) => !only || only.some((id) => c.id === id || c.id === `KIT-PERSON-${id}`));
  for (const composition of compositions) {
    await renderStills({serveUrl, composition, puppeteerInstance: browser, chromiumOptions, timeoutInMilliseconds: 180000, frames: [0], outputFor: () => `${out}/${composition.id}.png`, onStill: () => console.log(`${out}/${composition.id}.png`)});
  }
} finally {
  await browser.close({silent: true});
}
