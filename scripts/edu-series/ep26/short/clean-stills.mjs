// EDU-EP26-SHORT W5 measurement stills (Editor, 2026-11-19): composition frames with the caption text and the channel mark switched off (props
// captionStyle.preset 'none', chrome.channelLabel false), the story label and the plate caption shade kept, so scripts/caption-zone.py reads the
// shaded background of the caption band without glyph ink. Usage (Node 22): node scripts/edu-series/ep26/short/clean-stills.mjs OUTDIR FRAME,FRAME...
import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition} from '@remotion/renderer';
import {renderStills} from '../../../stills.mjs';
import path from 'node:path';
import {mkdir} from 'node:fs/promises';
const [dir, list] = process.argv.slice(2);
const frames = list.split(',').map(Number);
const inputProps = {captionStyle: {preset: 'none'}, overlayProps: {captions: false}, chrome: {channelLabel: false, progressBar: false}};
const chromiumOptions = {gl: 'angle'}, shared = {chromiumOptions, timeoutInMilliseconds: 180000};
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {chromiumOptions});
try {
  await mkdir(dir, {recursive: true});
  const composition = await selectComposition({serveUrl, id: 'EDU-EP26-SHORT', inputProps, puppeteerInstance: browser, ...shared});
  await renderStills({serveUrl, composition, inputProps, puppeteerInstance: browser, ...shared, frames, outputFor: (f) => `${dir}/${f}.png`, onStill: (f) => console.log('clean', f)});
} finally { await browser.close({silent: true}); }
