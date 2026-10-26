import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition, renderStill, renderMedia} from '@remotion/renderer';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';

// Run from the repository root: node scripts/cat-boxes/render-qa.mjs [--video].
// Frame coverage follows C06-S02 board R4; revise it when the sequence timing changes.
const root = path.resolve('out/qa/cat-boxes/projection-final');
await mkdir(root, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), outDir: path.join(root, 'bundle')});
const samples = Array.from({length: 45}, (_, i) => 14850 + i * 30);
const critical = [...new Set([14849, 14850, 14851, 15149, 15150, 15151, 15152, 15153, 15154, 15539, 15540, 15541, 15542, 15543, 15544, 15719, 15720, 15721, 15898, 15899, 15900, 15901, 15902, 15903, 15904, 16109, 16110, 16111, 16169, 16170, 16171, 16190, 16191, 16192, 16198, 16199])];
const frames = [...new Set([0, 8100, 12150, ...samples, ...critical])].sort((a, b) => a - b);
const inputProps = {ending: 'A_fade'};
const sha = async (p) => createHash('sha256').update(await readFile(p)).digest('hex');
const manifest = {timeline: 'scripts/cat-boxes/blockout.json', boardRevision: 4, briefRevision: 'VB-C06-S02-R3', previewFrames: [14820, 16199], inputProps, samples, critical, frames, randomSeek: {}, loop: {}};
for (const id of ['Short', 'Long']) {
  let browser = await openBrowser('chrome');
  const dir = path.join(root, id);
  await mkdir(dir, {recursive: true});
  try {
    const composition = await selectComposition({serveUrl, id, browserInstance: browser, inputProps});
    for (const frame of frames) {
      await renderStill({serveUrl, composition, browserInstance: browser, inputProps, frame, output: path.join(dir, `${frame}.png`), imageFormat: 'png'});
    }
    console.log(`${id}: rendered ${frames.length} full-resolution checks`);
    if (process.argv.includes('--video')) {
      await renderMedia({serveUrl, composition, browserInstance: browser, inputProps, frameRange: [14820, 16199], scale: 0.5, concurrency: 1, codec: 'h264', crf: 22, pixelFormat: 'yuv420p', outputLocation: path.join(root, `${id}-c06-preview.mp4`)});
      console.log(`${id}: rendered 46-second sequence preview`);
    }
  } finally {
    await browser.close({silent: true});
  }
  browser = await openBrowser('chrome');
  try {
    const composition = await selectComposition({serveUrl, id, browserInstance: browser, inputProps});
    const results = [];
    for (const frame of [16050, 15000, 15750]) {
      const output = path.join(dir, `random-${frame}.png`);
      await renderStill({serveUrl, composition, browserInstance: browser, inputProps, frame, output, imageFormat: 'png'});
      results.push({frame, matches: await sha(output) === await sha(path.join(dir, `${frame}.png`))});
    }
    manifest.randomSeek[id] = results;
    console.log(`${id} random/remount parity: ${JSON.stringify(results)}`);
    const loopProps = {ending: 'B_loop'};
    const loopComposition = await selectComposition({serveUrl, id, browserInstance: browser, inputProps: loopProps});
    const loopFiles = [];
    for (const frame of [0, 16198, 16199]) {
      const output = path.join(dir, `loop-${frame}.png`);
      await renderStill({serveUrl, composition: loopComposition, browserInstance: browser, inputProps: loopProps, frame, output, imageFormat: 'png'});
      loopFiles.push(output);
    }
    manifest.loop[id] = {lastMatchesFirst: await sha(loopFiles[0]) === await sha(loopFiles[2]), penultimateMatchesFirst: await sha(loopFiles[0]) === await sha(loopFiles[1])};
  } finally {
    await browser.close({silent: true});
  }
}
await writeFile(path.join(root, 'manifest.json'), JSON.stringify(manifest, null, 2));
