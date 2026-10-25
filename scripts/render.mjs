import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition, renderStill, renderMedia} from '@remotion/renderer';
import {mkdir, readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import path from 'node:path';

const timeline = JSON.parse(await readFile('scripts/haunted-house-p1.json', 'utf8'));
const inputProps = {timeline, narration: null, ending: 'B_loop'};
const chromiumOptions = {gl: 'swangle'};
const chromeMode = 'chrome-for-testing';
const browserExecutable = [
  process.env.CHROME_EXECUTABLE_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((candidate) => candidate && existsSync(candidate));
const stillsOnly = process.argv.includes('--stills');
const shortOnly = process.argv.includes('--short');
const longOnly = process.argv.includes('--long');
const compositions = [
  ['Short', 'out/haunted-short.mp4'],
  ['Long', 'out/haunted-long.mp4'],
].filter(([id]) => !(shortOnly && id !== 'Short') && !(longOnly && id !== 'Long'));

// Bundle once and reuse Chromium for both aspect ratios.
const serveUrl = await bundle({
  entryPoint: path.resolve('src/index.ts'),
  outDir: path.resolve('out/bundle'),
  enableCaching: false,
});
const browser = await openBrowser('chrome', {chromiumOptions, browserExecutable, chromeMode});

try {
  for (const [id, output] of compositions) {
    const composition = await selectComposition({
      port: 3101,
      serveUrl,
      id,
      browserInstance: browser,
      inputProps,
      chromiumOptions,
      browserExecutable,
      chromeMode,
    });

    if (stillsOnly) {
      const directory = `out/qa/${id}`;
      await mkdir(directory, {recursive: true});
      const everyTwoSeconds = Array.from(
        {length: Math.ceil(composition.durationInFrames / (composition.fps * 2))},
        (_, index) => index * composition.fps * 2,
      );
      for (const frame of everyTwoSeconds) {
        await renderStill({
          port: 3101,
          serveUrl,
          composition,
          browserInstance: browser,
          inputProps,
          chromiumOptions,
          browserExecutable,
          chromeMode,
          frame,
          output: `${directory}/${String(frame).padStart(4, '0')}.png`,
          imageFormat: 'png',
        });
        console.log(`Rendered ${id} frame ${frame} (${(frame / composition.fps).toFixed(0)}s)`);
      }
      continue;
    }

    let last = -1;
    await renderMedia({
      port: 3101,
      serveUrl,
      composition,
      browserInstance: browser,
      chromiumOptions,
      codec: 'h264',
      pixelFormat: 'yuv420p',
      crf: 18,
      concurrency: 4,
      inputProps,
      browserExecutable,
      chromeMode,
      outputLocation: output,
      onProgress: ({progress}) => {
        const percent = Math.floor(progress * 10) * 10;
        if (percent !== last) {
          console.log(`${id}: ${percent}%`);
          last = percent;
        }
      },
    });
    console.log(
      `Rendered ${output}: ${composition.width}x${composition.height}, ${composition.fps}fps, ${composition.durationInFrames} frames`,
    );
  }
} finally {
  await browser.close({silent: true});
}
