// EDU-EP31-SHORT W5.3 measurement stills (Editor, 2026-11-21): composition frames of EDU-EP31-SHORT on one Chrome.
// Usage (Node 22): node scripts/edu-series/ep31/short/clean-stills.mjs MODE OUTDIR FRAME,FRAME...
//   MODE full   = the cut as rendered (captions, label, mark, shade)           -> <OUTDIR>/<frame>.png   (qa-sheet, Thai readability)
//   MODE shaded = captions, label and mark off, the plate caption shade kept    -> caption-zone.py reads the shaded band without glyph ink
//   MODE raw    = as shaded, and the shade off too (input prop shade:false)     -> the raw plate band
//   MODE f<n>   = the cut as rendered (captions, label, mark) with every plate's shade peak set to <n> (f0.35): the phone-size legibility sweep
//   MODE s<n>   = as shaded with every plate's shade peak set to <n> (s0.35): the strength sweep
import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition} from '@remotion/renderer';
import {renderStills} from '../../../stills.mjs';
import path from 'node:path';
import {mkdir} from 'node:fs/promises';
const [mode, dir, list] = process.argv.slice(2);
const frames = list.split(',').map(Number);
const inputProps = mode === 'full' ? {} : /^f[\d.]+$/.test(mode) ? {shade: Number(mode.slice(1))} : {captionStyle: {preset: 'none'}, overlayProps: {captions: false, label: false}, chrome: {channelLabel: false, progressBar: false}, ...(mode === 'raw' ? {shade: false} : /^s[\d.]+$/.test(mode) ? {shade: Number(mode.slice(1))} : {})};
const chromiumOptions = {gl: 'angle'}, shared = {chromiumOptions, timeoutInMilliseconds: 180000};
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {chromiumOptions});
try {
  await mkdir(dir, {recursive: true});
  const composition = await selectComposition({serveUrl, id: 'EDU-EP31-SHORT', inputProps, puppeteerInstance: browser, ...shared});
  await renderStills({serveUrl, composition, inputProps, puppeteerInstance: browser, ...shared, frames, outputFor: (f) => `${dir}/${f}.png`, onStill: (f) => console.log(mode, f)});
} finally { await browser.close({silent: true}); }
