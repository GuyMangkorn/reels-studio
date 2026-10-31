#!/usr/bin/env node
// Compares two scripts/paint-bench.mjs runs: per-frame picture difference (changed channels, max channel difference,
// PSNR) and the mean stage timings of each run.
//
//   node scripts/paint-bench-compare.mjs <beforeDir> <afterDir> [--list]
//
// Render noise between sessions is up to 1/255 on a few channels (DF-20261030-render-run-noise), so judge a change by
// max difference and PSNR against an A/A pair of the same code, not by byte equality.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [a, b, flag] = process.argv.slice(2);
if (!a || !b) throw new Error('usage: paint-bench-compare.mjs <beforeDir> <afterDir> [--list]');
const raw = (file) => execFileSync('ffmpeg', ['-loglevel', 'error', '-i', file, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], {maxBuffer: 1 << 28});

const frames = fs.readdirSync(a).filter((f) => /^f\d+\.png$/.test(f) && fs.existsSync(path.join(b, f))).sort();
let worst = {psnr: Infinity}, changedFrames = 0, maxAll = 0;
for (const f of frames) {
  const x = raw(path.join(a, f)), y = raw(path.join(b, f));
  let changed = 0, max = 0, se = 0;
  for (let i = 0; i < x.length; i++) {
    const d = Math.abs(x[i] - y[i]);
    if (d) { changed++; se += d * d; if (d > max) max = d; }
  }
  const psnr = se ? 10 * Math.log10((255 * 255 * x.length) / se) : Infinity;
  if (changed) changedFrames++;
  maxAll = Math.max(maxAll, max);
  if (psnr < worst.psnr) worst = {frame: f, psnr, changed, max};
  if (flag === '--list' && changed) console.log(`${f} changed ${changed} max ${max} psnr ${psnr.toFixed(1)}`);
}
console.log(`${frames.length} frames; ${changedFrames} differ; max channel diff ${maxAll}; worst ${worst.frame ?? '-'} psnr ${worst.psnr === Infinity ? 'inf' : worst.psnr.toFixed(1)} (${worst.changed ?? 0} channels, max ${worst.max ?? 0})`);

const mean = (dir) => {
  const file = path.join(dir, 'timings.jsonl');
  if (!fs.existsSync(file)) return null;
  const rows = fs.readFileSync(file, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  return Object.fromEntries(['still', 'paint', 'sceneJs', 'brushCalls', 'render', 'gpuWait'].map((k) => [k, rows.reduce((s, r) => s + (r[k] ?? 0), 0) / rows.length]));
};
const [ma, mb] = [mean(a), mean(b)];
if (ma && mb) for (const k of Object.keys(ma)) if (ma[k] || mb[k]) console.log(`${k.padEnd(10)} ${ma[k].toFixed(1).padStart(8)} → ${mb[k].toFixed(1).padStart(8)} ms  (${mb[k] && ma[k] ? ((mb[k] / ma[k] - 1) * 100).toFixed(0) : '-'}%)`);
