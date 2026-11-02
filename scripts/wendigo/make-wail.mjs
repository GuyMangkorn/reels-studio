// Ghost wail for WDG-EP01-SHORT SN02 (Editor, round 3): raises the pitch of Stable Audio "bowed metal / creaking wood" candidates with a
// slow rising pitch glide (an instrumental wail, not a voice), adds glassy upper harmonics (soft clip, high-passed) and breathy wind noise,
// then measures every variant (scripts/wendigo/measure-scream.mjs). Usage: node scripts/wendigo/make-wail.mjs <raw.wav> <f0> <f1> <out.wav>
// or no arguments: grid over all wdg-ghost-wail-*_v*.wav candidates, ranked by centroid.
/* global console process */
import {Buffer} from 'node:buffer';
import {readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import os from 'node:os';
import {SR, decode, writeWav} from './audio-lib.mjs';
import {analyse} from './measure-scream.mjs';

const ff = (buf, ch, af) => { const r = spawnSync('ffmpeg', ['-v', 'error', '-f', 'f32le', '-ar', String(SR), '-ac', String(ch), '-i', '-', '-af', af, '-f', 'f32le', '-ar', String(SR), '-ac', String(ch), '-'], {input: Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength), maxBuffer: 1 << 30}); if (r.status !== 0) throw new Error(String(r.stderr)); return new Float32Array(r.stdout.buffer, r.stdout.byteOffset, Math.floor(r.stdout.length / 4)).slice(); };

/** Mono in -> mono out. Pitch factor glides geometrically f0 -> f1 over the (shortened) output; `airDb` = wind noise level under the wail. */
export const wail = (x, f0, f1, {airDb = -16, seed = 7} = {}) => {
  // output time t consumes input at rate f(t) = f0 (f1/f0)^(t/T); T solves integral = x.length
  const total = x.length, out = []; let pos = 0, i = 0; const T = total / SR / ((f1 - f0) / Math.log(f1 / f0)); // approx duration in seconds
  while (pos < total - 2) { const t = i / SR, f = f0 * (f1 / f0) ** Math.min(1, t / T); const a = Math.floor(pos), fr = pos - a; out.push(x[a] * (1 - fr) + x[a + 1] * fr); pos += f; i++; }
  let y = Float32Array.from(out);
  y = ff(y, 1, 'highpass=f=700,highpass=f=700');                       // no low body at all
  const harm = ff(y, 1, 'volume=14dB,asoftclip=type=tanh,highpass=f=2200,volume=-14dB'); // glassy upper partials
  const w = Math.round(0.05 * SR); const env = new Float32Array(y.length); let acc = 0;
  for (let k = 0; k < y.length; k++) { acc += y[k] ** 2; if (k >= w) acc -= y[k - w] ** 2; env[k] = Math.sqrt(Math.max(acc, 0) / w); }
  let s = seed; const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2147483648 - 1; };
  const nz = ff(Float32Array.from({length: y.length}, rnd), 1, 'highpass=f=3000,lowpass=f=9000');
  const m = new Float32Array(y.length); const g = 10 ** (airDb / 20);
  for (let k = 0; k < y.length; k++) m[k] = y[k] + harm[k] * 0.9 + nz[k] * env[k] * g * 6;
  const fin = ff(m, 1, 'lowpass=f=12000,alimiter=limit=0.9:level=disabled');
  const fade = Math.round(0.03 * SR); for (let k = 0; k < fade; k++) { fin[k] *= k / fade; fin[fin.length - 1 - k] *= k / fade; }
  return fin;
};

if (process.argv[1]?.endsWith('make-wail.mjs') && process.argv[2] !== 'compose') {
  if (process.argv.length >= 6) {
    const [, , inp, f0, f1, outp] = process.argv; const y = wail(decode(inp), +f0, +f1);
    const st = new Float32Array(y.length * 2); for (let k = 0; k < y.length; k++) { st[2 * k] = y[k]; st[2 * k + 1] = y[k]; } writeWav(outp, st, 2);
    console.log(outp, JSON.stringify(analyse(y)));
  } else {
    const raw = `${os.homedir()}/ReelsStore/library/sound/_raw`, rows = [];
    for (const f of readdirSync(raw).filter((n) => /^wdg-ghost-wail-.*_v\d\.wav$/.test(n))) for (const [f0, f1] of [[1.3, 1.7], [1.6, 2.1], [1.9, 2.5]]) {
      const y = wail(decode(`${raw}/${f}`), f0, f1); rows.push({f, f0, f1, ...analyse(y)});
    }
    rows.sort((a, b) => b.centroidHz - a.centroidHz);
    for (const r of rows.slice(0, 14)) console.log(r.f, r.f0, r.f1, 'sec', r.activeSec, 'cent', r.centroidHz, '<500', r.below500, '2-5k', r.band2to5k, '>5k', r.above5k, 'flat', r.flatness, 'p10/50/90', r.partialHz.p10, r.partialHz.p50, r.partialHz.p90, 'glide', r.glideHz);
  }
}

/** Final wail (library `creature_wendigo-wail-ghost_01`): the lower wail (a_v3, 1.4 -> 1.8) then the higher wail (a_v1, 1.7 -> 2.2) 1.3 s later, so the pitch keeps rising, slightly panned, ~4.8 s with a slow rise and a long decay. */
export const composeWail = () => {
  const raw = `${os.homedir()}/ReelsStore/library/sound/_raw`;
  const w1 = wail(decode(`${raw}/wdg-ghost-wail-a_v3.wav`), 1.4, 1.8), w2 = wail(decode(`${raw}/wdg-ghost-wail-a_v1.wav`), 1.7, 2.2);
  const off = Math.round(1.3 * SR), n = Math.max(w1.length, off + w2.length), L = new Float32Array(n), R = new Float32Array(n);
  const hann = (k, len, a) => Math.min(1, k / (a * SR), (len - k) / (0.9 * SR));
  for (let k = 0; k < w1.length; k++) { const e = hann(k, w1.length, 0.4); L[k] += w1[k] * e * 0.75; R[k] += w1[k] * e * 0.55; }
  for (let k = 0; k < w2.length; k++) { const e = hann(k, w2.length, 1.0); L[off + k] += w2[k] * e * 0.55; R[off + k] += w2[k] * e * 0.75; }
  const st = new Float32Array(n * 2); let pk = 0; for (let k = 0; k < n; k++) { st[2 * k] = L[k]; st[2 * k + 1] = R[k]; pk = Math.max(pk, Math.abs(L[k]), Math.abs(R[k])); }
  for (let k = 0; k < st.length; k++) st[k] *= 0.89 / pk;
  return {st, mono: Float32Array.from({length: n}, (_, k) => (L[k] + R[k]) / 2 / pk * 0.89)};
};
if (process.argv[2] === 'compose') {
  const {st, mono} = composeWail(); const out = process.argv[3] ?? 'out/wendigo/audio/wail-ghost.wav';
  writeWav(out, st, 2); console.log(out, (st.length / 2 / SR).toFixed(2), 's', JSON.stringify(analyse(mono)));
}
