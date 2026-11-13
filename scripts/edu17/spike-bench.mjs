#!/usr/bin/env node
// EDU-EP17 spike bench: scripts/paint-bench.mjs with a choosable entry (--entry=src/painted/spike/edu17-spike-index.ts) so spike compositions that are not in
// src/index.ts (SP1/SP2 of EDU-EP17) get the same per-frame stage timings. Same options, same output (timings.jsonl + PNGs).
// Painted-frame benchmark: renders chosen frames as stills through one browser (--gl=angle, concurrency 1) with the
// BrushCanvas `paintProfile` input prop, and writes per-frame stage timings plus the PNGs for before/after comparison.
//
//   node scripts/edu17/spike-bench.mjs <CompositionId> <outDir> [--frames=0,30,60 | --every=30] [--runs=1] [--no-profile] [--props='{"paintSeedEager":true}']
//
// Stages per frame (ms): sceneJs (shot geometry and colours), brushCalls (inside p5.brush), render (brush.render()),
// gpuWait (1-pixel readPixels after render: GPU completion), still (wall time of the whole still incl. screenshot and
// PNG export). --no-profile measures the plain wall time without the wrappers. Compare two runs with
// scripts/paint-bench-compare.mjs.
import {bundle} from '@remotion/bundler';
import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const [id, outDir, ...rest] = process.argv.slice(2);
if (!id || !outDir) throw new Error('usage: paint-bench.mjs <CompositionId> <outDir> [--frames=a,b | --every=n] [--runs=n] [--no-profile]');
const opt = Object.fromEntries(rest.map((a) => a.replace(/^--/, '')).map((a) => [a.split('=')[0], a.includes('=') ? a.slice(a.indexOf('=') + 1) : true]));
const runs = Number(opt.runs ?? 1);
const inputProps = {...(opt['no-profile'] ? {} : {paintProfile: true}), ...JSON.parse(opt.props ?? '{}')};

fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve(opt.entry && opt.entry !== true ? opt.entry : 'src/painted/spike/edu17-spike-index.ts')});
const browser = await openBrowser('chrome', {chromiumOptions: {gl: 'angle'}});
const composition = await selectComposition({serveUrl, id, inputProps, puppeteerInstance: browser});
const frames = opt.frames
  ? String(opt.frames).split(',').map(Number)
  : Array.from({length: Math.ceil(composition.durationInFrames / Number(opt.every ?? 30))}, (_, i) => i * Number(opt.every ?? 30));

const rows = [];
let profile = null;
const onBrowserLog = ({text}) => {
  if (text.startsWith('paint-profile ')) profile = JSON.parse(text.slice(14));
};
// Warm-up: shader compile and first canvas allocation are not part of any frame.
await renderStill({serveUrl, composition, frame: frames[0], output: path.join(outDir, 'warmup.png'), inputProps, puppeteerInstance: browser, timeoutInMilliseconds: 180000});
for (let r = 0; r < runs; r++) {
  for (const frame of frames) {
    profile = null;
    const t0 = performance.now();
    await renderStill({serveUrl, composition, frame, output: path.join(outDir, `f${String(frame).padStart(5, '0')}.png`), inputProps, puppeteerInstance: browser, onBrowserLog, timeoutInMilliseconds: 180000});
    rows.push({run: r, frame, still: +(performance.now() - t0).toFixed(1), ...(profile ?? {})});
  }
}
await browser.close({silent: true});
fs.writeFileSync(path.join(outDir, 'timings.jsonl'), rows.map((r) => JSON.stringify(r)).join('\n') + '\n');
const sum = (k) => rows.reduce((s, r) => s + (r[k] ?? 0), 0);
const line = ['still', 'paint', 'sceneJs', 'brushCalls', 'render', 'gpuWait'].map((k) => `${k} ${(sum(k) / rows.length).toFixed(1)}`).join(' | ');
console.log(`${id} ${rows.length} stills, mean ms: ${line}; total still ${(sum('still') / 1000).toFixed(1)} s`);
