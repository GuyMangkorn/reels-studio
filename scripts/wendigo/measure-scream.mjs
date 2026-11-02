// Spectral measurements for scream candidates (Editor, WDG-EP01-SHORT round 3). No numpy on this machine: plain FFT.
// Usage: node scripts/wendigo/measure-scream.mjs <file> [<file>...]   (analysis only; the reference is never copied into the video)
// Per file: active-frame centroid, energy shares (<500 Hz, 2-5 kHz, >5 kHz), flatness, dominant-partial track (400-8000 Hz) percentiles
// and glide (median of last third minus median of first third of the active frames, Hz).
/* global console process */
import {SR, decode} from './audio-lib.mjs';

const N = 2048, HOP = 1024;
const fft = (re, im) => {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) { let b = n >> 1; for (; j & b; b >>= 1) j ^= b; j ^= b; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) { let cr = 1, ci = 0; for (let k = 0; k < len / 2; k++) {
      const a = i + k, b = a + len / 2, tr = re[b] * cr - im[b] * ci, ti = re[b] * ci + im[b] * cr;
      re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti; const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t; } }
  }
};
const win = Float32Array.from({length: N}, (_, i) => 0.5 - 0.5 * Math.cos(2 * Math.PI * i / N));
const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
export const analyse = (x) => {
  const frames = [];
  for (let p = 0; p + N <= x.length; p += HOP) {
    const re = new Float64Array(N), im = new Float64Array(N); let e = 0;
    for (let i = 0; i < N; i++) { re[i] = x[p + i] * win[i]; e += re[i] ** 2; }
    fft(re, im);
    const mag = new Float64Array(N / 2); for (let k = 0; k < N / 2; k++) mag[k] = re[k] ** 2 + im[k] ** 2;
    frames.push({e, mag, t: p / SR});
  }
  const emax = Math.max(...frames.map((f) => f.e));
  const act = frames.filter((f) => f.e > emax * 0.01); // within 20 dB of the loudest frame
  const bin = SR / N; let cs = 0, ce = 0, lo = 0, mid = 0, hi = 0, tot = 0, flat = 0; const track = [];
  for (const f of act) {
    let s = 0, w = 0, lg = 0, nb = 0, best = 0, bk = 0;
    for (let k = 1; k < N / 2; k++) { const fr = k * bin, m = f.mag[k]; s += fr * m; w += m; tot += m; if (fr < 500) lo += m; else if (fr >= 2000 && fr < 5000) mid += m; else if (fr >= 5000) hi += m; if (fr >= 300 && fr < 8000) { lg += Math.log(m + 1e-12); nb++; if (m > best) { best = m; bk = k; } } }
    cs += s / w; ce++;
    let am = 0; for (let k = 1; k < N / 2; k++) { const fr = k * bin; if (fr >= 300 && fr < 8000) am += f.mag[k]; }
    flat += Math.exp(lg / nb) / (am / nb);
    track.push(bk * bin);
  }
  const third = Math.floor(track.length / 3);
  return {activeSec: +(act.length * HOP / SR).toFixed(2), centroidHz: Math.round(cs / ce), below500: +(lo / tot).toFixed(3), band2to5k: +(mid / tot).toFixed(3), above5k: +(hi / tot).toFixed(3), flatness: +(flat / ce).toFixed(3),
    partialHz: {p10: Math.round(pct(track, 0.1)), p50: Math.round(pct(track, 0.5)), p90: Math.round(pct(track, 0.9))}, glideHz: Math.round(pct(track.slice(-third), 0.5) - pct(track.slice(0, third), 0.5))};
};
if (process.argv[1]?.endsWith('measure-scream.mjs')) for (const f of process.argv.slice(2)) console.log(f.split('/').pop(), JSON.stringify(analyse(decode(f))));
