// Renders a list of stills on long-lived pages: frames are grouped into evenly spaced runs and each run is one
// renderFrames call (pages opened once per run, then seeked), instead of one renderStill (a new page and bundle load)
// per frame. 12 ZCPAINT stills: 10.2 s with renderStill on a shared browser, 3.5 s here (DF-20261031-paint-seed-defer).
// Pass the browser as `puppeteerInstance`: Remotion ignores any other key and opens a new Chrome per call.
import {renderFrames} from '@remotion/renderer';
import {writeFile} from 'node:fs/promises';

/** Splits sorted unique frames into runs with one step each: [0,30,60,61] -> [0,30,60], [61]. */
export const frameRuns = (frames) => {
  const sorted = [...new Set(frames.map(Number))].sort((a, b) => a - b), runs = [];
  for (const f of sorted) {
    const run = runs.at(-1);
    if (run && (run.length === 1 || f - run.at(-1) === run[1] - run[0])) run.push(f);
    else runs.push([f]);
  }
  return runs;
};

/**
 * Renders `frames` of `composition` to PNGs at `outputFor(frame)`. Other options (puppeteerInstance, chromiumOptions,
 * inputProps, timeoutInMilliseconds, browserExecutable, scale) pass through to renderFrames.
 */
export const renderStills = async ({frames, outputFor, concurrency = 1, inputProps = {}, onStill = () => {}, ...options}) => {
  for (const run of frameRuns(frames)) {
    const writes = [];
    await renderFrames({
      ...options,
      inputProps,
      imageFormat: 'png',
      concurrency,
      frameRange: [run[0], run.at(-1)],
      everyNthFrame: run.length > 1 ? run[1] - run[0] : 1,
      outputDir: null,
      onStart: () => {},
      onFrameUpdate: () => {},
      onFrameBuffer: (buffer, frame) => {
        writes.push(writeFile(outputFor(frame), buffer).then(() => onStill(frame)));
      },
    });
    await Promise.all(writes);
  }
};

// CLI: renders job lines from stdin with one Chrome (--gl=angle), grouped per composition.
//   printf 'ID FRAME OUTPUT.png\n...' | node scripts/stills.mjs <bundleDir | entry.ts> [--props=<json>] [--gl=<backend>]
// Prints each output path as it is written.
const isMain = process.argv[1] && import.meta.url === (await import('node:url')).pathToFileURL(process.argv[1]).href;
if (isMain) {
  const {bundle} = await import('@remotion/bundler');
  const {openBrowser, selectComposition} = await import('@remotion/renderer');
  const path = await import('node:path');
  const fs = await import('node:fs');
  const [source, ...rest] = process.argv.slice(2);
  if (!source) throw new Error('usage: printf "ID FRAME OUTPUT\\n" | node scripts/stills.mjs <bundleDir|entry.ts> [--props=<json>] [--gl=angle]');
  const opt = Object.fromEntries(rest.map((a) => a.replace(/^--/, '')).map((a) => [a.split('=')[0], a.slice(a.indexOf('=') + 1)]));
  const inputProps = JSON.parse(opt.props ?? '{}');
  const chromiumOptions = {gl: opt.gl ?? 'angle'};
  const jobs = fs.readFileSync(0, 'utf8').split('\n').map((l) => l.trim().split(/\s+/)).filter((j) => j.length === 3);
  const serveUrl = fs.statSync(source).isDirectory() ? path.resolve(source) : await bundle({entryPoint: path.resolve(source)});
  const browser = await openBrowser('chrome', {chromiumOptions});
  try {
    for (const id of [...new Set(jobs.map(([i]) => i))]) {
      const outputs = new Map(jobs.filter(([i]) => i === id).map(([, f, out]) => [Number(f), out]));
      for (const out of outputs.values()) fs.mkdirSync(path.dirname(out), {recursive: true});
      const composition = await selectComposition({serveUrl, id, inputProps, puppeteerInstance: browser, chromiumOptions});
      await renderStills({serveUrl, composition, inputProps, puppeteerInstance: browser, chromiumOptions, timeoutInMilliseconds: 180000,
        frames: [...outputs.keys()], outputFor: (f) => outputs.get(f), onStill: (f) => console.log(outputs.get(f))});
    }
  } finally {
    await browser.close({silent: true});
  }
}
