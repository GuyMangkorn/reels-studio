// HANAKO-SHORT sound-only check (Editor E-R5). Renders the composition's audio tree for a frame range as WAV, with no
// p5.brush painting (`soundOnly`, as scripts/segments.mjs does) and no loudness normalization, so the measured mix is the
// raw runtime mix. Not a review render: picture is not produced. Output stays under out/ (ignored).
// Usage: node scripts/hanako/short/render-sound-range.mjs <CompositionId> <fromFrame> <toFrame> <out.wav>
import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition, renderMedia} from '@remotion/renderer';
import path from 'node:path';
import {mkdir} from 'node:fs/promises';

const [id, from, to, output] = process.argv.slice(2);
if (!id || !from || !to || !output) throw new Error('usage: render-sound-range.mjs <CompositionId> <fromFrame> <toFrame> <out.wav>');
const frameRange = [Number(from), Number(to)];
if (!frameRange.every(Number.isInteger) || frameRange[0] < 0 || frameRange[1] < frameRange[0]) throw new Error(`bad frame range ${from}-${to}`);

const browserExecutable = process.env.BROWSER_EXECUTABLE ?? null;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable, chromiumOptions: {}});
try {
  // Same default ending as scripts/render.mjs (the registry's A_fade for HANAKO-SHORT).
  const inputProps = {ending: 'A_fade', soundOnly: true};
  const composition = await selectComposition({serveUrl, id, puppeteerInstance: browser, inputProps});
  await mkdir(path.dirname(output), {recursive: true});
  await renderMedia({serveUrl, composition, puppeteerInstance: browser, inputProps, codec: 'wav', frameRange, outputLocation: output, browserExecutable, chromiumOptions: {}});
  console.log(`Sound ${output}: ${composition.id}, frames ${frameRange[0]}-${frameRange[1]} at ${composition.fps} fps, un-normalized`);
} finally {
  await browser.close({silent: false});
}
