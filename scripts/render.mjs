// Usage: node scripts/render.mjs <CompositionId>... [--stills] [--frames=90,210] [--endings=A_fade,B_loop]
// Each run bundles into its own temp directory, lets Remotion pick a free port and writes only under
// out/<CompositionId>/, so renders of different videos can run at the same time.
// Set BROWSER_EXECUTABLE to use an installed Chromium instead of Remotion's download.
import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition, renderStill, renderMedia} from '@remotion/renderer';
import path from 'node:path';
import {mkdir, copyFile} from 'node:fs/promises';

const option = (name, fallback) => (process.argv.find(arg => arg.startsWith(`--${name}=`))?.split('=')[1] ?? fallback).split(',');
const ids = process.argv.slice(2).filter(arg => !arg.startsWith('--'));
if (!ids.length) throw new Error('Name at least one composition ID, e.g. npm run render -- CATBOX-C01-Short');

const browserExecutable = process.env.BROWSER_EXECUTABLE ?? null;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable});
try {
  for (const id of ids) {
    const dir = `out/${id}`;
    await mkdir(dir, {recursive: true});
    if (process.argv.includes('--stills')) {
      const composition = await selectComposition({serveUrl, id, browserInstance: browser, browserExecutable});
      await mkdir(`${dir}/stills`, {recursive: true});
      for (const frame of option('frames', '90,210,330,450,570').map(Number)) {
        await renderStill({serveUrl, composition, browserInstance: browser, browserExecutable, frame, output: `${dir}/stills/${frame}.png`, imageFormat: 'png'});
        console.log(`Checked ${id} frame ${frame}`);
      }
      continue;
    }
    const endings = option('endings', 'A_fade,B_loop');
    for (const ending of endings) {
      const inputProps = {ending};
      const composition = await selectComposition({serveUrl, id, browserInstance: browser, browserExecutable, inputProps});
      const output = `${dir}/${id}_${ending}.mp4`;
      let last = -1;
      await renderMedia({serveUrl, composition, browserInstance: browser, browserExecutable, codec: 'h264', pixelFormat: 'yuv420p', crf: 18, concurrency: 4, inputProps, outputLocation: output,
        onProgress: ({progress}) => {const percent = Math.floor(progress * 10) * 10; if (percent !== last) {console.log(`${id} ${ending}: ${percent}%`); last = percent;}}
      });
      console.log(`Exported ${output}: ${composition.width}x${composition.height}, ${composition.fps}fps, ${composition.durationInFrames} frames`);
      if (ending === endings.at(-1)) await copyFile(output, `${dir}/${id}.mp4`);
    }
  }
} finally {await browser.close({silent: true});}
