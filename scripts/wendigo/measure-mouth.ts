// Mouth drive vs voice envelope (Editor, WDG-EP01-SHORT round 3). Run: node --import tsx scripts/wendigo/measure-mouth.ts
/* global console process */
// For each talk span of the plates: open/close cycles per second of the drive (local maxima of `open` separated by a dip >= 0.15), against the
// syllables per second of the voice (peaks of the 3-frame smoothed narration amplitude, prominence >= 22 % of the span max) and the script syllable count.
/* global console */
import amp from '../../public/narration/WDG-EP01-SHORT.amplitude.json';
import {talkEnv, talkVoiceEnv} from '../../src/painted/wendigo/cast';

type Span = {name: string; g: number; spans: [number, number][]; seed: number; syl: number[]};
// G of the shot start + the plates' spans; syl = Thai syllables per span from the script (verbatim lines of script R3).
const SPANS: Span[] = [
  {name: 'S01-B01-SH02 (M1)', g: 60, spans: [[4, 31], [41, 116]], seed: 11, syl: [2, 4]},   // เสียงนั้น (2) / ถามผมทุกคืน (4)
  {name: 'S01-B03-SH03 (M5)', g: 795, spans: [[26, 82], [124, 160]], seed: 29, syl: [5, 3]}, // แล้วผมก็ได้ยิน (5) / เสียงนั้นอีก (3)
];
const smooth = (a: number[], g: number) => (a[g - 1] + 2 * a[g] + a[g + 1]) / 4 // 3-frame voice envelope;
const peaks = (v: number[], prom: number) => { let n = 0; for (let i = 1; i < v.length - 1; i++) if (v[i] > v[i - 1] && v[i] >= v[i + 1] && v[i] > prom) { // a peak counts when the dip since the previous peak (or start) was deep enough
  n++; } return n; };
const cycles = (v: number[], dip = 0.15) => { let n = 0, up = false, lo = v[0], hi = v[0]; for (const x of v) { if (!up) { lo = Math.min(lo, x); if (x - lo >= dip) { up = true; hi = x; n++; } } else { hi = Math.max(hi, x); if (hi - x >= dip) { up = false; lo = x; } } } return n; };
const sylPeaks = (e: number[]) => { const mx = Math.max(...e); let n = 0, up = false, lo = e[0], hi = e[0]; for (const x of e) { if (!up) { lo = Math.min(lo, x); if (x - lo >= 0.22 * mx) { up = true; hi = x; n++; } } else { hi = Math.max(hi, x); if (hi - x >= 0.22 * mx) { up = false; lo = x; } } } return n; };
void peaks;
const mode = process.argv[2] ?? 'both';
for (const s of SPANS) s.spans.forEach(([a, b], i) => {
  const env: number[] = []; for (let L = a; L < b; L++) env.push(smooth(amp as number[], s.g + L));
  const secs = (b - a) / 30;
  const old = Array.from({length: b - a}, (_, k) => talkEnv(a + k, s.spans, s.seed));
  const neu = Array.from({length: b - a}, (_, k) => talkVoiceEnv(a + k, s.g, s.spans, amp as number[], s.seed));
  const row = (v: number[]) => `${cycles(v)} cycles = ${(cycles(v) / secs).toFixed(1)}/s, max ${Math.max(...v).toFixed(2)}, mean ${(v.reduce((x, y) => x + y, 0) / v.length).toFixed(2)}, sign flips ${v.filter((x, k) => k && (x > 0.05) !== (v[k - 1] > 0.05)).length}`;
  console.log(`${s.name} span ${i} L[${a},${b}) = ${secs.toFixed(2)} s | voice syllable peaks ${sylPeaks(env)} (${(sylPeaks(env) / secs).toFixed(1)}/s), script ${s.syl[i]} (${(s.syl[i] / secs).toFixed(1)}/s)`);
  if (mode !== 'new') console.log('   before (talkEnv):', row(old));
  if (mode !== 'old') console.log('   after (talkVoiceEnv):', row(neu));
});
