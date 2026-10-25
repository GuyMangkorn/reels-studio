import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition, renderStill, renderMedia} from '@remotion/renderer';
import path from 'node:path';
import {mkdir, copyFile, access} from 'node:fs/promises';

await access('public/narration.mp3').catch(() => {throw new Error('Missing narration: run npm run narration first (requires edge-tts==7.3.1).');});

// Bundle once and reuse the browser for both aspect ratios. No Studio server required.
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), outDir: path.resolve('out/bundle')});
const browser = await openBrowser('chrome');
try {
  for (const [id, output] of [['Short', 'out/demo_short.mp4'], ['Long', 'out/demo_long.mp4']]) {
    if (process.argv.includes('--short') && id !== 'Short') continue;
    if (process.argv.includes('--long') && id !== 'Long') continue;
    const composition = await selectComposition({port:3101, serveUrl, id, browserInstance: browser});
    if (process.argv.includes('--stills')) {
      await mkdir(`out/qa/${id}`, {recursive:true});
      for (const frame of [90, 210, 330, 450, 570]) {
        await renderStill({port:3101, serveUrl, composition, browserInstance:browser, frame, output:`out/qa/${id}/${frame}.png`, imageFormat:'png'});
        console.log(`Checked ${id} frame ${frame}`);
      }
    } else {
      for (const ending of ['A_fade', 'B_loop']) {
        const inputProps = {ending};
        const variantComposition = await selectComposition({port:3101, serveUrl, id, browserInstance: browser, inputProps});
        const variantOutput = output.replace('.mp4', `_${ending}.mp4`);
        let last = -1;
        await renderMedia({port:3101, serveUrl, composition: variantComposition, browserInstance:browser, codec:'h264', pixelFormat:'yuv420p', crf:18, concurrency:4, inputProps, outputLocation:variantOutput,
          onProgress: ({progress}) => {const percent = Math.floor(progress * 10) * 10; if (percent !== last) {console.log(`${id} ${ending}: ${percent}%`); last = percent;}}
        });
        console.log(`Exported ${variantOutput}: ${composition.width}x${composition.height}, ${composition.fps}fps, ${composition.durationInFrames} frames`);
        if (ending === 'B_loop') await copyFile(variantOutput, output);
      }
    }
  }
} finally {await browser.close({silent:true});}
