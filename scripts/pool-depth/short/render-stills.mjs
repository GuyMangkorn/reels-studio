// Usage: node scripts/pool-depth/short/render-stills.mjs <outDir> name=frame [name=frame ...]
// Renders composition-global stills of POOLDEPTH-SHORT with the same bundle/render path as scripts/render.mjs.
// Used for the scene samples and QA frames; outputs go under ignored out/.
import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition, renderStill} from '@remotion/renderer';
import path from 'node:path';
import {mkdir} from 'node:fs/promises';

const [outDir, ...frames] = process.argv.slice(2);
if (!outDir || !frames.length) throw new Error('Usage: render-stills.mjs <outDir> name=frame ...');
await mkdir(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable: process.env.BROWSER_EXECUTABLE ?? null});
try {
  const composition = await selectComposition({serveUrl, id: 'POOLDEPTH-SHORT', browserInstance: browser});
  for (const spec of frames) {
    const [name, frame] = spec.split('=');
    await renderStill({serveUrl, composition, browserInstance: browser, frame: Number(frame), output: `${outDir}/${name}.png`, imageFormat: 'png'});
    console.log(`ok ${name} G${frame}`);
  }
} finally {await browser.close({silent: true});}
