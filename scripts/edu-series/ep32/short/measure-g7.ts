// EDU-EP32 G7 measures (Boss W5.2, 2026-11-21): B06-SH03 stamp box and letter cap height (projected), the cat's drawn belly edge and the DOM
// cut-out (`catHole`) against the stamp's outer border at L0/L18/L30/L37, and, when stills exist, the stamp letter cap height measured from the
// red ink rows of the frame (ffmpeg rgb24). B06-SH02 cat extent at L0/L31/L67.
//   node --import tsx scripts/edu-series/ep32/short/measure-g7.ts [out/EDU32-G7/stills]
import {existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import type {Brush} from '../../../../src/painted/BrushCanvas';
import {makePainter} from '../../../../src/painted/kit/painter';
import {camPoint, type YCam} from '../../../../src/painted/kit/ycam';
import {MEMO, MEMO_STAMP, CAT_SLEEP, catHole, memoPt} from '../../../../src/painted/edu32/office';
import {B06SH02_N, b06Clock, b06sh02Cam, paintB06SH02, paintSleepingCat} from '../../../../src/painted/edu32/b06-sh02';
import {paintB01SH03} from '../../../../src/painted/edu32/b01-sh03';
import {MEASURE} from '../../../../src/painted/edu32/looks';
import {B06SH03_N, b06sh03Cam, bottomAt, bottomOf, recordFills} from '../../../../src/painted/edu32/b06-sh03';

const noop = () => makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0});
const DEG = Math.PI / 180;
/** Stamp-local point (u right, v down, model m, before the -8 deg rotation) -> page-local -> world. */
const stampPt = (u: number, v: number) => {
  const r = MEMO_STAMP.rot * DEG, x = u * Math.cos(r) - v * Math.sin(r), z = u * Math.sin(r) + v * Math.cos(r);
  return memoPt(MEMO_STAMP.x + x, MEMO_STAMP.z + z, MEMO.y + 0.002);
};
const P = (c: YCam, u: number, v: number) => camPoint(c, stampPt(u, v))!;
const sw = MEMO_STAMP.w, sh = MEMO_STAMP.h, b = sh * 0.05, outer = (s: number) => s / 2 + b / 2;
/** Arial Black cap height ~0.716 em; line baselines at -0.04 sh and +0.30 sh, font 0.3 sh (office-text.tsx PageStamp). */
const CAP = 0.716 * 0.3 * sh;

for (const L of [0, 18, 30, 37]) {
  const c = b06sh03Cam(L);
  const corners = [P(c, -outer(sw), -outer(sh)), P(c, outer(sw), -outer(sh)), P(c, outer(sw), outer(sh)), P(c, -outer(sw), outer(sh))];
  const xs = corners.map((q) => q[0]), ys = corners.map((q) => q[1]), ctr = P(c, 0, 0);
  const caps = [-0.04, 0.3].map((base) => { const a = P(c, 0, base * sh), t = P(c, 0, base * sh - CAP); return Math.hypot(a[0] - t[0], a[1] - t[1]); });
  // the stamp's top border line, sampled along x; distance down from the cat's drawn belly edge and from the DOM hole edge
  const t = b06Clock(B06SH02_N + L), fills = recordFills((q) => paintSleepingCat(q, c, t, CAT_SLEEP, false)), hole = catHole(c)!;
  let mDraw = Infinity, mHole = Infinity, atDraw = 0;
  for (let k = 0; k <= 100; k++) {
    const q = P(c, -outer(sw) + (k / 100) * 2 * outer(sw), -outer(sh)), d = bottomOf(fills, q[0]), h = bottomAt(hole, q[0]);
    if (d !== null && q[1] - d < mDraw) { mDraw = q[1] - d; atDraw = q[0]; }
    if (h !== null) mHole = Math.min(mHole, q[1] - h);
  }
  // letters: the first line's cap top across the stamp text width (0.82 sw) vs the drawn edge
  let mLetters = Infinity;
  for (let k = 0; k <= 40; k++) { const q = P(c, -0.41 * sw + (k / 40) * 0.82 * sw, -0.04 * sh - CAP), d = bottomOf(fills, q[0]); if (d !== null) mLetters = Math.min(mLetters, q[1] - d); }
  console.log(`B06-SH03 L${L} (G${1651 + L}) stamp box x ${Math.round(Math.min(...xs))}-${Math.round(Math.max(...xs))} y ${Math.round(Math.min(...ys))}-${Math.round(Math.max(...ys))} w ${Math.round(Math.max(...xs) - Math.min(...xs))} | centre (${Math.round(ctr[0])}, ${Math.round(ctr[1])}) | cap ${caps.map((v) => v.toFixed(1)).join(' / ')} px (at 540: ${caps.map((v) => (v / 2).toFixed(1)).join(' / ')}) | cat edge -> stamp top border min ${mDraw.toFixed(1)} px at x ${Math.round(atDraw)}, DOM hole -> border min ${mHole.toFixed(1)} px, drawn edge -> letter caps min ${mLetters.toFixed(1)} px`);
}
for (const L of [0, 31, 67]) {
  const r = paintB06SH02(noop(), L);
  console.log(`B06-SH02 L${L} (G${1583 + L}) cat ${r ? `y ${Math.round(r.top)}-${Math.round(r.bottom)} h ${Math.round(r.h)}` : 'off'} | stamp centre (${camPoint(b06sh02Cam(L), memoPt(MEMO_STAMP.x, MEMO_STAMP.z))!.map(Math.round).join(', ')})`);
}

// mirror (acceptance G1650 vs B01-SH03 G306 = its L77): cat extents from the plates' own leads
paintB01SH03(noop(), 77, 'MIRROR-B01');
const m = MEASURE['MIRROR-B01']?.[0], r67 = paintB06SH02(noop(), 67);
if (m && r67) console.log(`mirror: B06-SH02 L67 cat h ${Math.round(r67.h)} y ${Math.round(r67.top)}-${Math.round(r67.bottom)} vs B01-SH03 L77 (${m.name}) h ${m.h} y ${m.top}-${m.bottom}: dh ${(((r67.h - m.h) / m.h) * 100).toFixed(1)} %, dtop ${Math.round(r67.top - m.top)} px, dbottom ${Math.round(r67.bottom - m.bottom)} px`);

// pixel check on the stills (composition frame C = G - 1583): red ink row runs in a narrow column window at the stamp centre
const dir = process.argv[2] ?? 'out/EDU32-G7/stills';
for (const L of [0, 18, 30, 37]) {
  const f = `${dir}/${B06SH02_N + L}.png`;
  if (!existsSync(f)) continue;
  const raw = spawnSync('ffmpeg', ['-loglevel', 'error', '-i', f, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], {maxBuffer: 1 << 26}).stdout as Buffer;
  const ctr = P(b06sh03Cam(L), 0, 0), x0 = Math.round(ctr[0] - 40), x1 = Math.round(ctr[0] + 40);
  const rows: boolean[] = [];
  for (let y = 0; y < 1920; y++) {
    let n = 0;
    for (let x = x0; x < x1; x++) { const i = (y * 1080 + x) * 3, [r, g, bb] = [raw[i], raw[i + 1], raw[i + 2]]; if (r > 150 && g < 120 && bb < 120 && r - g > 70) n++; }
    rows.push(n >= 6);
  }
  const runs: string[] = [];
  for (let y = 0; y < 1920; y++) if (rows[y] && !rows[y - 1]) { let e = y; while (rows[e + 1]) e++; runs.push(`${y}-${e} (${e - y + 1})`); y = e; }
  console.log(`B06-SH03 L${L} pixel red-ink row runs at x ${x0}-${x1}: ${runs.join(', ')}`);
}
console.log('frames', B06SH02_N, B06SH03_N);
