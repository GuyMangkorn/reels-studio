import {paintAnchor, paintChain, paintPlume} from '../../kit/anchors';
import {ell, hardFill, washAt} from '../../kit/draw';
import {hash} from '../../kit/hash';
import {mixColor, type Pt} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {wp} from '../../kit/world';
import {camDepth, camPoint, camUnit, type YCam} from '../../kit/ycam';
import {mix, sine} from '../clock';
import {C, sheetCam} from '../palette';
import {fsBedY, FS_N, paintFlashSeabed} from '../redsea';
import {makeShot} from '../stage';

// S01-B05-SH04 (G 1252-1364, 112 f; R1.2) probably its own anchor (L15b; sheet EDU-EP17-SHEETS-R1.1, SD10, SD21, SD22; W7 broadside hull + furrow banks; FS compressed, no depth claimed). The ship's
// stockless anchor (2.5 m) drags along -n with its shackle at A(L) = n·s + (0, 1.2, 0), s = -3.0 - 0.0167·L; a furrow from s = +6 to the anchor already
// cuts C1-C3 (crossings s = -2.5 / 0 / +2.5), the cables lie in it, dark. Chain straight from the shackle up along -n to the surface (y 44.2) at
// A - 55.6·n + (0, 43, 0); the hull is a dark silhouette there (it rides with the chain top so the chain stays continuous). Camera at constant yaw -25
// backs down the chain: sheet(chain top - (0, 3, 0), -25, 20, 40, f 1000, hy 600) -> sheet(A(51), -25, 10, 1.6, 1000, 700) over L0-61, then holds.
// Build: the end key uses A(51) (Film's run numbers: crossings y 885 / 960 / 1138) and the camera holds from L61 while the anchor drags on; trucking
// with the anchor to L110 (at = A(L)) would bring the C3 crossing down to y ~1300, into the caption band (Film to confirm).
const N = 112; // shot length (R1.2: cut at L112; the drag formula continues, camera held from L61)
const n: V3 = [FS_N[0], 0, FS_N[1]];
const along = (s: number, h = 0): V3 => [n[0] * s, fsBedY(n[0] * s, n[2] * s) + h, n[2] * s];
const sOf = (L: number) => -3.0 - 0.0167 * L;
const A = (L: number): V3 => along(sOf(L), 1.2);
const top = (L: number): V3 => { const a = A(L); return [a[0] - 55.6 * n[0], a[1] + 43, a[2] - 55.6 * n[2]]; };
const SURF = 44.2;
const camAt = (L: number): YCam => {
  const u = sine(L, 0, 61), t0 = top(0), a = A(51); void N;
  const at: V3 = [mix(t0[0], a[0], u), mix(t0[1] - 3, a[1], u), mix(t0[2], a[2], u)];
  return sheetCam(at, -25, mix(20, 10, u), mix(40, 1.6, u), {f: 1000, hy: mix(600, 700, u), near: 0.2});
};
// W7 (fix list items 4, 5; sheet R1.1 SD22): the hull is a broadside silhouette seen from below, the furrow has broken sand banks.
/** Sand tone of the FS bed at camera depth d (paintFlashSeabed strips, FAR 140). */
const sandAt = (d: number) => mixColor(C.fsSand, C.fsWater1, Math.min(1, (d / 70) ** 0.8));
const STEP = 0.12, TRENCH = 0.3, BANK = 0.62, RAG = 0.045;
/** Side offset (m) of a furrow point at path s, side ±1, distance `off` from the centre line. */
const side = (sv: number, sd: number, off: number): V3 => { const b = along(sv, 0.01); return [b[0] + sd * n[2] * off, fsBedY(b[0] + sd * n[2] * off, b[2] - sd * n[0] * off) + 0.01, b[2] - sd * n[0] * off]; };
/**
 * The furrow from s = +6 down to `end` (the anchor): a trench 0.10-0.15 darker than the sand and two broken bank ridges (within +0.06 of the sand; calibrated on the graded still at y 1500) with
 * ragged outer edges (RAG m, so about 8 px near and 3 px far) and sand clumps. Samples sit on a fixed s grid (no boil as the end advances); `only`
 * repaints just the bank pieces near given s (over the cables at the crossings, so the cables read pressed into the trench).
 */
const paintFurrowBanks = (p: Parameters<typeof hardFill>[0], c: YCam, end: number, only?: number[]) => {
  const ss: number[] = [];
  for (let k = 0; 6 - k * STEP > end; k++) ss.push(6 - k * STEP);
  ss.push(end);
  const near = (hi: number, lo: number) => !only || only.some((o) => o < hi + 0.2 && o > lo - 0.2);
  const tone = (sv: number) => sandAt(Math.abs(camDepth(c, along(sv))));
  for (let i = 0; i + 1 < ss.length; i += 4) {
    const seg = ss.slice(i, i + 5), mid = seg[Math.floor(seg.length / 2)], sand = tone(mid);
    if (!only) {
      const tr = wp(c, [...seg.map((sv) => side(sv, -1, TRENCH)), ...seg.slice().reverse().map((sv) => side(sv, 1, TRENCH))]);
      if (tr.length >= 3) hardFill(p, 9600 + (i % 40), mixColor(sand, '#1a1a18', 0.43), tr);
      const inner = wp(c, [...seg.map((sv) => side(sv, -1, TRENCH * 0.35)), ...seg.slice().reverse().map((sv) => side(sv, 1, TRENCH * 0.35))]);
      if (inner.length >= 3) hardFill(p, 9560 + (i % 40), mixColor(sand, '#1a1a18', 0.47), inner);
    }
  }
  // broken bank ridges, one piece per 3-6 samples with a gap where the hash says so
  [-1, 1].forEach((sd) => {
    let k = 0;
    while (k + 1 < ss.length) {
      const id = Math.round((6 - ss[k]) / STEP) * 2 + (sd > 0 ? 1 : 0), len = 3 + Math.floor(hash(9900 + id) * 4), gap = hash(9950 + id) < 0.3 ? 1 : 0;
      const seg = ss.slice(k, k + len + 1);
      if (seg.length >= 2 && near(seg[0], seg[seg.length - 1])) {
        const sand = tone(seg[Math.floor(seg.length / 2)]);
        // finer samples along the piece: the outer edge tapers in at both ends (no square cuts) and wobbles by RAG (fixed per world s)
        const sub: number[] = [], m = (seg.length - 1) * 3;
        for (let j = 0; j <= m; j++) sub.push(seg[0] + ((seg[seg.length - 1] - seg[0]) * j) / m);
        const outer = sub.map((sv, j) => { const tt = j / m, tap = Math.sqrt(Math.sin(Math.PI * tt)), g = Math.round((6 - sv) / (STEP / 3)) * 2 + (sd > 0 ? 1 : 0);
          return side(sv, sd, TRENCH + (BANK - TRENCH) * tap + RAG * (hash(9700 + g) * 2 - 1) * tap); });
        const innerE = sub.map((sv) => side(sv, sd, TRENCH));
        const q = wp(c, [...innerE, ...outer.slice().reverse()]);
        if (q.length >= 3) hardFill(p, 9800 + (id % 90), mixColor(sand, '#1a1a18', 0.08), q);
        // crest line a touch lighter, then two or three clumps off the outer edge
        const crest = wp(c, [...sub.map((sv) => side(sv, sd, TRENCH * 1.02)), ...sub.slice().reverse().map((sv, j) => side(sv, sd, TRENCH * (1.02 + 0.25 * Math.sqrt(Math.sin((Math.PI * (m - j)) / m)))))]);
        for (let j = 0; j < 3; j++) {
          if (hash(9500 + id * 3 + j) < 0.35) continue;
          const sv = seg[0] + (seg[seg.length - 1] - seg[0]) * hash(9520 + id * 3 + j), v = side(sv, sd, BANK + 0.05 + 0.12 * hash(9540 + id * 3 + j)), pt = camPoint(c, v);
          if (!pt) continue;
          const r = (0.03 + 0.04 * hash(9580 + id * 3 + j)) * camUnit(c, v);
          hardFill(p, 9440 + ((id * 3 + j) % 60), mixColor(sand, '#1a1a18', 0.14), ell(pt[0], pt[1] + r * 0.2, r, r * 0.5, 8));
          hardFill(p, 9380 + ((id * 3 + j) % 60), mixColor(sand, '#1a1a18', 0.02), ell(pt[0], pt[1], r * 0.85, r * 0.4, 8));
        }
      }
      k += len + gap;
    }
  });
};
/** Broadside hull from below in picture px (compressed staging, no depth claimed): waterline on top, flat keel, raked pointed bow on the left
 *  (so the hull stays clear of the top-left mark corner at the end),
 *  square stern on the right with a rudder nub; the chain enters at the keel 20 % from the bow end (`P`), length `len` px, height 0.18 of it. */
const paintHullBroadside = (p: Parameters<typeof hardFill>[0], P: Pt, len: number) => {
  const H = 0.18 * len, x0 = P[0] - 0.2 * len, y0 = P[1] - 0.97 * H;
  const at = (u: number, v: number): Pt => [x0 + u * len, y0 + v * H];
  const body = [at(0, 0), at(1, 0), at(1, 0.9), at(0.99, 0.97), at(0.965, 1), at(0.26, 1), at(0.2, 0.97), at(0.14, 0.84), at(0.08, 0.55), at(0.035, 0.22)];
  const rudder = [at(0.988, 0.95), at(0.93, 0.95), at(0.936, 1.2), at(0.976, 1.17)];
  const col = mixColor('#1c2226', C.fsWater1, 0.2);
  washAt(p, 9642, '#e8eef0', 60, body.map(([x, y]) => [x, y - 3] as Pt), 0.3, 0);
  hardFill(p, 9643, col, body);
  hardFill(p, 9644, col, rudder);
  return {top: y0, bottom: y0 + 1.2 * H, left: x0, right: x0 + len, H};
};
/** Last hull box (stills measure only). */
export const HULL_BOX: {box?: ReturnType<typeof paintHullBroadside>} = {};
export const shot = makeShot('S01-B05-SH04', {
  paper: '#4a5e6a', recon: true,
  paint: (p, L) => {
    const c = camAt(L), s = sOf(L), a = A(L);
    paintFlashSeabed(p, c, {dark: 3, far: 140, near: 5, onSand: () => paintFurrowBanks(p, c, s + 1.6)});
    paintFurrowBanks(p, c, s + 1.6, [2.5, 0, -2.5]);
    // the sea surface seen from below (a lighter ceiling) and the broadside hull riding on the chain top
    const tp = top(L), sq = wp(c, [[c.x - 400, SURF, c.z + 5], [c.x + 400, SURF, c.z + 5], [c.x + 400, SURF, c.z - 400], [c.x - 400, SURF, c.z - 400]]);
    if (sq.length >= 3) washAt(p, 9640, mixColor(C.fsWater0, '#c8d4d8', 0.35), 120, sq, 0, 0);
    const P = camPoint(c, [tp[0], SURF - 2.6, tp[2]]);
    if (P) HULL_BOX.box = paintHullBroadside(p, P, mix(760, 360, sine(L, 0, 61)));
    // anchor: crown on the bed 2.19 m back along +n, shank up to the shackle, flukes biting; chain straight to the hull
    const crown = along(s + 2.19, 0.05), shank: V3 = [a[0] - crown[0], a[1] - crown[1], a[2] - crown[2]];
    const r = paintAnchor(p, c, 9650, crown, shank, [n[2], 0, -n[0]], 2.5, {ship: true, steel: mixColor(C.steel, C.fsWater1, 0.15), hi: '#9aa0a4', rust: C.rust});
    paintChain(p, c, 9670, r.ring, [tp[0], SURF - 2.6, tp[2]], {sag: 0, link: 0.35, color: mixColor(C.chain, C.fsWater1, 0.2), hi: mixColor('#8a8f92', C.fsWater1, 0.3)});
    // sand kicked off the flukes as it ploughs
    paintPlume(p, c, 9690, along(s + 2.3, 0), (L / 14) % 1, {size: 0.9, col: mixColor(C.fsSand, C.fsWater1, 0.2)});
    paintPlume(p, c, 9710, along(s + 2.6, 0), ((L + 7) / 14) % 1, {size: 0.8, col: mixColor(C.fsSand, C.fsWater1, 0.2)});
  },
});
