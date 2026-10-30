// Render the kit catalog still. Usage: node scripts/painted-kit/catalog.mjs --out=DIR  -> DIR/KIT-CATALOG.png (1600x2870)
import {bundle} from '@remotion/bundler';
import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';

const out = process.argv.find((a) => a.startsWith('--out='))?.slice(6);
if (!out) throw new Error('--out=DIR is required');
await mkdir(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/painted/kit/catalog.tsx')});
const chromiumOptions = {gl: 'angle'};
const browser = await openBrowser('chrome', {chromiumOptions});
try {
  const composition = await selectComposition({serveUrl, id: 'KIT-CATALOG', browserInstance: browser, chromiumOptions});
  await renderStill({serveUrl, composition, browserInstance: browser, chromiumOptions, frame: 0, output: `${out}/KIT-CATALOG.png`, imageFormat: 'png'});
  console.log(`${out}/KIT-CATALOG.png`);
} finally {
  await browser.close({silent: true});
}
