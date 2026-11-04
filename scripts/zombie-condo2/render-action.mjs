// Spike SPK-ZC2-02: renders the ZC2-ACT-* tests (src/painted/zcondo2/action-index.ts) to out/<ID>/<ID>.mp4 at full size, --gl=angle.
// render.mjs is hard-wired to src/index.ts and timeline compositions (scene cache), so this one-off bundles the spike entry itself.
// usage: node scripts/zombie-condo2/render-action.mjs ZC2-ACT-A [--stills=0,60,64]
import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition, renderMedia} from '@remotion/renderer';
import {renderStills} from '../stills.mjs';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';

const id = process.argv[2];
const stillsArg = process.argv.find((a) => a.startsWith('--stills='));
const chromiumOptions = {gl: 'angle'};
const shared = {chromiumOptions, timeoutInMilliseconds: 180000};
const serveUrl = await bundle({entryPoint: path.resolve('src/painted/zcondo2/action-index.ts')});
const browser = await openBrowser('chrome', {chromiumOptions});
try {
  const composition = await selectComposition({serveUrl, id, puppeteerInstance: browser, ...shared});
  await mkdir(`out/${id}/stills`, {recursive: true});
  if (stillsArg) {
    const frames = stillsArg.split('=')[1].split(',').map(Number);
    await renderStills({serveUrl, composition, inputProps: {}, puppeteerInstance: browser, ...shared, frames, outputFor: (f) => `out/${id}/stills/${f}.png`});
  } else {
    const t0 = Date.now();
    await renderMedia({composition, serveUrl, puppeteerInstance: browser, ...shared, codec: 'h264', pixelFormat: 'yuv420p', crf: 18, concurrency: 4, outputLocation: `out/${id}/${id}.mp4`});
    console.log(`Exported out/${id}/${id}.mp4 ${composition.width}x${composition.height} ${composition.fps}fps ${composition.durationInFrames}f in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  }
} finally {
  await browser.close({silent: true});
}
