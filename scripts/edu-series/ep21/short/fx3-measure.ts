// EDU-EP21-SHORT W5.2f FX3 measurement (Boss, 2026-11-17): B03-SH08 steam wisps vs the FR tyre outline (SHEETS-R3 D-FX2-Q3).
// For each L in the list (default L0-60 every 5) it reads the clean FX3 still and a no-steam still of the same frame (rendered once with
// STEAM_PEAK 0 as a probe, then reverted), and estimates the steam's per-pixel opacity a = (I - I0) / (#c9d0d6 - I0) (mean of RGB,
// only where the steam colour is >= 30 levels above the plate). The tyre outline is the picture hull of the outer (z 0.86) and inner
// (z 0.66) sidewall rings with car.ts's tread spread, through the road camera, as `paintWheel` draws it; "below the arch lip" is below the
// picture line through the two arch lips (body points (1.3 -/+ 0.37 cos 0.12, 0.31 - 0.37 sin 0.12, 0.851), sagged camera).
// Prints: max and p99 steam opacity inside the outline below the lip, the count of pixels > 0.15 there, the frame's brightest steam pixel
// and whether it is outside; per wisp (shot `steamWisps`): its centre in or out of the outline and its alpha.
// Accept (D-FX2-Q3): no wisp > 15 % inside the outline below the lip on L0-60; each wisp's brightest part outside the outline.
// Usage: npx tsx scripts/edu-series/ep21/short/fx3-measure.ts <steam dir> <no-steam dir> [L...]
import {spawnSync} from 'node:child_process';
import {CAR, SAG_FULL, sagCam} from '../../../../src/painted/edu21/car';
import {camAt, sagAt, steamWisps} from '../../../../src/painted/edu21/shots/B03-SH08';
import type {Pt} from '../../../../src/painted/kit/painter';
import {camPoint} from '../../../../src/painted/kit/ycam';

const W = 1080, H = 1920, G0 = 636, STEAM = [0xc9, 0xd0, 0xd6];
const read = (f: string) => {
  const r = spawnSync('ffmpeg', ['-v', 'error', '-i', f, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], {maxBuffer: W * H * 3 + 1024});
  if (r.status !== 0 || r.stdout.length !== W * H * 3) throw new Error(`read ${f}: ${r.stderr}`);
  return r.stdout;
};
const hull = (pts: Pt[]): Pt[] => {
  const s = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const p of s) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of s.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};
const inConvex = (q: Pt, h: Pt[]) => h.every((a, i) => { const b = h[(i + 1) % h.length]; return (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]) >= 0; });
const tyre = (L: number): Pt[] => {
  const c = camAt(L), sag = sagAt(L), r = CAR.wheelR, cy = r - sag, pts: Pt[] = [];
  for (const z of [0.86, 0.66]) for (let i = 0; i < 96; i++) {
    const a = (i / 96) * 2 * Math.PI, dy = r * Math.sin(a);
    let dx = r * Math.cos(a);
    if (dy < 0) dx *= 1 + 0.26 * (sag / SAG_FULL) * Math.min(1, -dy / cy);
    const q = camPoint(c, [CAR.wheelX + dx, Math.max(0, cy + dy), z]);
    if (q) pts.push(q);
  }
  return hull(pts);
};
const [steamDir, baseDir, ...ls] = process.argv.slice(2);
const Ls = ls.length ? ls.map(Number) : Array.from({length: 13}, (_, i) => i * 5);
let worst = 0, allOut = true;
for (const L of Ls) {
  const A = read(`${steamDir}/B03-SH08_l${L}.png`), B = read(`${baseDir}/B03-SH08_l${L}.png`), h = tyre(L);
  const cs = sagCam(camAt(L), sagAt(L)), la = camPoint(cs, [CAR.wheelX - 0.37 * Math.cos(0.12), 0.31 - 0.37 * Math.sin(0.12), 0.851])!,
    lb = camPoint(cs, [CAR.wheelX + 0.37 * Math.cos(0.12), 0.31 - 0.37 * Math.sin(0.12), 0.851])!;
  const lipY = (x: number) => la[1] + ((lb[1] - la[1]) * (x - la[0])) / (lb[0] - la[0]);
  const inside: number[] = [];
  let best = {a: 0, x: 0, y: 0}, far = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const k = (y * W + x) * 3;
    let num = 0, den = 0;
    for (let ch = 0; ch < 3; ch++) { num += A[k + ch] - B[k + ch]; den += STEAM[ch] - B[k + ch]; }
    if (num !== 0 && (x < 60 || x > 960 || y < 300 || y > 1500)) far = Math.max(far, Math.abs(num / 3));
    if (den < 90) continue; // steam colour < 30 levels above the plate: opacity not measurable
    const a = Math.max(0, num / den);
    const isIn = y > lipY(x) && inConvex([x + 0.5, y + 0.5], h);
    if (isIn) inside.push(a);
    if (a > best.a) best = {a, x, y};
  }
  inside.sort((p, q) => p - q);
  const mx = inside.length ? inside[inside.length - 1] : 0, p99 = inside.length ? inside[Math.floor(inside.length * 0.99)] : 0, n15 = inside.filter((a) => a > 0.15).length;
  worst = Math.max(worst, mx);
  const bestOut = !(best.y > lipY(best.x) && inConvex([best.x + 0.5, best.y + 0.5], h));
  const ws = steamWisps(camAt(L), L, G0 + L, sagAt(L)).map((w) => {
    const out = !inConvex(w.q, h);
    allOut &&= out;
    return `w${w.i} ${w.q.map((n) => n.toFixed(0)).join(',')} a${(w.a * 0.45).toFixed(2)} ${out ? 'out' : 'IN'}`;
  });
  console.log(`L${L}: inside-outline steam max ${mx.toFixed(3)} p99 ${p99.toFixed(3)} px>0.15 ${n15} (of ${inside.length}) · brightest steam ${best.a.toFixed(2)} at (${best.x}, ${best.y}) ${bestOut ? 'outside' : 'INSIDE'}`
    + ` · far-field diff max ${far.toFixed(1)} · wisps: ${ws.join(' | ') || 'none'}`);
}
console.log(`worst inside-outline opacity ${worst.toFixed(3)} (accept <= 0.15) · every wisp centre outside: ${allOut} · ${worst <= 0.15 && allOut ? 'PASS' : 'FAIL'}`);
