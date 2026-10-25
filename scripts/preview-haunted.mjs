import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition, renderStill} from '@remotion/renderer';
import {mkdir, readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import path from 'node:path';

// Review library assets through the production renderer; no duplicated scene artwork.
const timeline = JSON.parse(await readFile('scripts/haunted-house-p1.json', 'utf8'));
const inputProps = {timeline, narration: null, ending: 'B_loop'};
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), enableCaching: false});
const chromiumOptions = {gl: 'swangle'};
const chromeMode = 'chrome-for-testing';
const browserExecutable = [
  process.env.CHROME_EXECUTABLE_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((candidate) => candidate && existsSync(candidate));
const browser = await openBrowser('chrome', {chromiumOptions, browserExecutable, chromeMode});
try {
  for (const id of ['Short', 'Long']) {
    const composition = await selectComposition({
      port: 3106,
      serveUrl,
      id,
      browserInstance: browser,
      inputProps,
      chromiumOptions,
      browserExecutable,
      chromeMode,
    });
    await mkdir(`out/haunted-qa/${id}`, {recursive: true});
    let start = 0;
    for (const [index, scene] of timeline.entries()) {
      const frame = start + 60;
      await renderStill({
        port: 3106,
        serveUrl,
        composition,
        browserInstance: browser,
        inputProps,
        chromiumOptions,
        browserExecutable,
        chromeMode,
        frame,
        output: `out/haunted-qa/${id}/${index}.png`,
      });
      console.log(`${id}: shot ${index + 1}, frame ${frame}`);
      if (scene.background?.variant === 'bedroomPOV') {
        for (const [label, offset] of [
          ['start', 0],
          ['end', Math.round(scene.durationSec * composition.fps) - 1],
        ]) {
          await renderStill({
            port: 3106,
            serveUrl,
            composition,
            browserInstance: browser,
            inputProps,
            chromiumOptions,
            browserExecutable,
            chromeMode,
            frame: start + offset,
            output: `out/haunted-qa/${id}/pov-${index}-${label}.png`,
          });
        }
      }
      start += Math.round(scene.durationSec * composition.fps);
    }
    // Exercise nested joint debug markers without changing delivered JSON.
    const pivotProps = {
      ...inputProps,
      timeline: [
        {
          ...timeline[4],
          durationSec: 4,
          actors: timeline[4].actors.map((actor) => ({...actor, showPivots: true})),
        },
      ],
    };
    const pivotComposition = await selectComposition({
      port: 3106,
      serveUrl,
      id,
      browserInstance: browser,
      inputProps: pivotProps,
      chromiumOptions,
      browserExecutable,
      chromeMode,
    });
    await renderStill({
      port: 3106,
      serveUrl,
      composition: pivotComposition,
      browserInstance: browser,
      inputProps: pivotProps,
      chromiumOptions,
      browserExecutable,
      chromeMode,
      frame: 30,
      output: `out/haunted-qa/${id}/pivots.png`,
    });
  }
} finally {
  await browser.close({silent: true});
}
