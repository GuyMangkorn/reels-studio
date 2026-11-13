// EDU-EP17 N8 `SET-STADIUM16` (Boss, group 4): the generic open-air stadium in world metres (space `T`: origin field centre, +x toward the stage end, +z toward the instrument side), day and night states,
// for SH17 and SH18 (day, overcast game afternoon) and SH19 and SH20 (night concert; SH21's instrument street is `instrument.ts`). Hardened from the approved look frames LF05A (pick B) and LF05B
// (`look-b-stadium.ts`, 2026-11-12) with the ROWS-R2.2 cameras: every lens in SH18-SH20 stands 1.8 m over the stand surface (acceptance A17). No logo, no name, no team colour theme, no performer.
// Paint budget: crowds are screen-budgeted (a far stand quad gets at most a quarter coverage of blotches over a crowd-coloured base; head cards only inside about 30 m), so a still stays under 1.5 s.
// Kit intake (W8.4): `new: SET-STADIUM16` (proposal in build-notes.md).
import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {paintFigureAt} from '../kit/figure-at';
import {hash} from '../kit/hash';
import type {Painter, Pt} from '../kit/painter';
import {mixColor} from '../kit/painter';
import type {V3} from '../kit/space';
import {camDepth, camPoint, camPoly, camSpace, camUnit, type YCam} from '../kit/ycam';
import {clip} from '../kit/world';
import {paintHead, SKINS, type HeadOpts, type Head} from './crowd-heads';
import {bottomShade} from './shade';
import {castOf, lerpV, lookCam, pushU} from './street';

export const SD = {
  day: {sky: '#9aa3ab', skyLo: '#b9bfc3', conc: '#a8a9a6', concSh: '#7f817f', roof: '#5e6266', roofTop: '#7d8186', roofUnder: '#4a4f55', turf: '#4f7a45', stripe: '#5b8a50', line: '#eef0ea', crowd: ['#2d3440', '#4a5a6a', '#6b7480', '#3a3f4a', '#55606c'], bright: ['#e0b84a', '#c94f3d', '#f2efe6', '#3a8a6a', '#d77fa1'], wall: '#8d908e'},
  night: {sky: '#101828', conc: '#353a4c', concSh: '#262a3a', roof: '#151a26', turf: '#24382a', crowd: ['#4a4f63', '#5b5a6e', '#3e4256', '#6a5a62'], bright: ['#7a6a78', '#8a7060'], rim: '#c98a5a', stage: '#fff1d6', beamA: '#ffb4e0', beamB: '#7fe0e6', phone: '#e8f4ff', lamp: '#f2c46a', wall: '#1a2030'},
};

/** Field 110 x 49 m (half 55 x 24.5), turf 124 x 62 m. Lower bowl d 6-40 m at 30 deg to y 18; concourse 40-45; upper deck 45-88 at 34 deg to y 45; roof ring d 64-88 at y 49 to 47; outer wall d 88. */
export const FIELD = {hx: 55, hz: 24.5};
export const ROOF = {d0: 64, d1: 88, y0: 49, y1: 47};
export const LENS_OVER_SEAT = 1.8;

/** Bowl profile: height of the stand surface at distance `d` (m) outside the field edge. */
export const standY = (d: number) => (d < 6 ? 0 : d <= 40 ? Math.min(18, (d - 6) * Math.tan(Math.PI / 6)) : d < 45 ? 18 : Math.min(45, 16 + (d - 45) * Math.tan((34 * Math.PI) / 180)));
/** Point on the rounded-rectangle offset `d` m outside the field at perimeter parameter `s` 0..1 (superellipse n = 6: squarish corners, field-aligned). */
export const bowlPt = (d: number, s: number): [number, number] => {
  const a = s * Math.PI * 2, cx = Math.cos(a), sz = Math.sin(a), ex = 2 / 6, rx = FIELD.hx + d, rz = FIELD.hz + d;
  return [rx * Math.sign(cx) * Math.abs(cx) ** ex, rz * Math.sign(sz) * Math.abs(sz) ** ex];
};
/** Distance `d` (m) outside the field of the bowl offset curve through the ground point (x, z) (inverse of `bowlPt`), by bisection. */
export const bowlD = (x: number, z: number): number => {
  const g = (d: number) => (Math.abs(x) / (FIELD.hx + d)) ** 6 + (Math.abs(z) / (FIELD.hz + d)) ** 6 - 1;
  let lo = -FIELD.hz + 0.01, hi = 400;
  for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (g(m) > 0) lo = m; else hi = m; }
  return (lo + hi) / 2;
};
/** Stand surface height under the ground point (x, z), by the true bowl curve. */
export const seatSurfaceY = (x: number, z: number) => standY(bowlD(x, z));

const clamp01 = (u: number) => Math.min(1, Math.max(0, u));
const smooth = (u: number) => { const x = clamp01(u); return x * x * (3 - 2 * x); };

// ---- cameras (storyboard ROWS-R2.2, shots 17-20; frames are shot-local) ----
export type StadiumShot = 'SH17' | 'SH18' | 'SH19' | 'SH20';
/** SH17: `ycam pos (0, 601, 0.5) -> (-70, 120, 170), look-at (0, 0, 0) -> (0, 15, 0), f 1000`; hold +0-+5, crane +5-+46 (ease). The match cut puts the bowl at (540, 640): hy 640 at the hold, easing to 960 with the crane. */
export const sh17Cam = (f: number): YCam => {
  const u = smooth((f - 5) / 41), c = lookCam(lerpV([0, 601, 0.5], [-70, 120, 170], u), lerpV([0, 0, 0], [0, 15, 0], u));
  return {...c, hy: 640 + 320 * u};
};
/** SH18 (R2.2, LF05A pick B): `pos (-10, 33, 92) -> (4, 33, 92), look-at (0, 0, 0) -> (4, 0, 0)`; truck +0-+52 with a 6 f ease. */
export const sh18Cam = (f: number): YCam => { const e = pushU(f, 52); return lookCam(lerpV([-10, 33, 92], [4, 33, 92], e), lerpV([0, 0, 0], [4, 0, 0], e)); };
/** SH19 (R2.2): `pos (-30, 35.7, 96) -> (-28, 33.6, 93), look-at (58, 8, 0)`; push +0-+45 (smoothstep). The lens is 1.8 m over the seat surface at both ends (33.88 and 31.85 m). */
export const sh19Cam = (f: number): YCam => lookCam(lerpV([-30, 35.7, 96], [-28, 33.6, 93], smooth(f / 45)), [58, 8, 0]);
/** SH20 (R2.2): `pos (15, 14.2, 52) -> (15, 11.9, 48), look-at (30, 2, 10)`; push +0-+58 with a 6 f ease. 1.8 m over the lower bowl (12.41 and 10.10 m). */
export const sh20Cam = (f: number): YCam => lookCam(lerpV([15, 14.2, 52], [15, 11.9, 48], pushU(f, 58)), [30, 2, 10]);

export const STADIUM_SHOTS: Record<StadiumShot, {id: string; len: number; state: 'day' | 'night'; cam: (f: number) => YCam}> = {
  SH17: {id: 'S01-B04-SH02', len: 47, state: 'day', cam: sh17Cam},
  SH18: {id: 'S01-B04-SH03', len: 53, state: 'day', cam: sh18Cam},
  SH19: {id: 'S01-B04-SH04', len: 46, state: 'night', cam: sh19Cam},
  SH20: {id: 'S01-B04-SH05', len: 59, state: 'night', cam: sh20Cam},
};

/** SH20 bounce (R2.2: peaks +6, +19, +32, +45, period 13 f): lift in metres at shot-local frame `f` (0 at the troughs). */
export const bounceLift = (f: number, amp = 0.14): number => (f < 0 ? 0 : amp * Math.max(0, 0.5 + 0.5 * Math.cos(((f - 6) / 13) * Math.PI * 2)) ** 1.6);

const W = (p: Painter, c: YCam, seed: number, color: string, pts: V3[], op = 255) => {
  const q = clip(camPoly(c, pts));
  if (q.length < 3) return;
  if (op >= 255) hardFill(p, seed, color, q); else washAt(p, seed, color, op, q, 0, 0);
};
/** Temporal stability (fix pass D): a crowd member's identity is a hash of its grid id only, never of its array index, its draw order or the camera. A member that the screen budget
 * drops does not blink out: `fadeIn` ramps its weight 0..1 over a band of the (continuous) keep share, and the weight is painted as alpha, so adjacent frames differ by a fraction of one member. */
const FADE_BAND = 0.12;
/** Weight of a member of seeded `rank` (0..1) when the budget keeps the share `keep`: a ramp centred on `keep` (so the mean kept share stays `keep`, as the old hard cut gave), narrowed for small shares and near 1. */
const fadeIn = (keep: number, rank: number) => {
  if (keep >= 0.999) return 1;
  const band = Math.min(FADE_BAND, Math.max(0.02, keep * 0.5), 1 - keep + 0.02);
  return Math.min(1, Math.max(0, (keep - rank) / band + 0.5));
};
const ramp = (v: number, lo: number, hi: number) => Math.min(1, Math.max(0, (v - lo) / (hi - lo)));
/** The painter at `a` x its alpha (a member fading in or out). */
const faded = (p: Painter, a: number): Painter => (a >= 0.999 ? p : {...p, alpha: p.alpha * a});
/** A crowd member: the kit head plus its stable grid id and its current weight (0..1). */
export type CrowdHead = Head & {id: number; w?: number};
const area = (q: Pt[]) => { let a = 0; for (let i = 0; i < q.length; i++) { const [x0, y0] = q[i], [x1, y1] = q[(i + 1) % q.length]; a += x0 * y1 - x1 * y0; } return Math.abs(a) / 2; };

// ---- the bowl as sorted quads ----
type Item = {kind: 'seat' | 'roof' | 'wall'; pts: V3[]; depth: number; ring: number; seg: number};
const RINGS = [6, 10, 15, 20, 26, 33, 40, 45, 52, 60, 68, 76, 88];
const SEGS = 72;
/** Stand quads (perimeter segments x depth rings), the roof ring and the outer wall, far to near for this camera. */
export const bowlItems = (c: YCam): Item[] => {
  const out: Item[] = [];
  const mid = (pts: V3[]) => pts.reduce((a, q) => [a[0] + q[0] / pts.length, a[1] + q[1] / pts.length, a[2] + q[2] / pts.length] as V3, [0, 0, 0] as V3);
  for (let j = 0; j < SEGS; j++) {
    const s0 = j / SEGS, s1 = (j + 1) / SEGS;
    for (let i = 0; i < RINGS.length - 1; i++) {
      const d0 = RINGS[i], d1 = RINGS[i + 1];
      const P = (d: number, s: number): V3 => { const [x, z] = bowlPt(d, s); return [x, standY(d), z]; };
      const pts = [P(d0, s0), P(d0, s1), P(d1, s1), P(d1, s0)];
      out.push({kind: 'seat', pts, depth: camDepth(c, mid(pts)), ring: i, seg: j});
    }
    const R = (d: number, s: number, y: number): V3 => { const [x, z] = bowlPt(d, s); return [x, y, z]; };
    const roof = [R(ROOF.d0, s0, ROOF.y0), R(ROOF.d0, s1, ROOF.y0), R(ROOF.d1, s1, ROOF.y1), R(ROOF.d1, s0, ROOF.y1)];
    out.push({kind: 'roof', pts: roof, depth: camDepth(c, mid(roof)), ring: -1, seg: j});
    const wall = [R(ROOF.d1, s0, 0), R(ROOF.d1, s1, 0), R(ROOF.d1, s1, ROOF.y1), R(ROOF.d1, s0, ROOF.y1)];
    out.push({kind: 'wall', pts: wall, depth: camDepth(c, mid(wall)), ring: -2, seg: j});
  }
  return out.sort((a, b) => b.depth - a.depth);
};

type FleckOpts = {phones?: number; rim?: (x: number) => number; rimCol?: string; maxR?: number; cover?: number};
/** Crowd flecks over one stand quad. One person per 0.45 m^2 of seat as a 2-tone fleck, but never more than `cover` (0.22) of the quad's screen area at a minimum blotch radius of 3.2 px
 * (far stands read as speckle over a crowd-coloured base); nothing where the person would be a head card (r > maxR px, drawn by `seatCards`). */
const flecks = (p: Painter, c: YCam, q: Item, n0: number, pal: string[], bright: string[], brightShare: number, o: FleckOpts = {}) => {
  const [a, b, , d] = q.pts, aw = Math.hypot(b[0] - a[0], b[2] - a[2]) * Math.hypot(d[0] - a[0], d[1] - a[1], d[2] - a[2]);
  const scr = area(clip(camPoly(c, q.pts)));
  if (scr < 2) return;
  const m: V3 = [(a[0] + b[0] + d[0]) / 3, (a[1] + b[1] + d[1]) / 3 + 1.1, (a[2] + b[2] + d[2]) / 3], r0 = camUnit(c, m) * 0.24, maxR = o.maxR ?? 9;
  // the quad fades out as its people grow into head cards (r0 -> maxR) and in as it shrinks past a speck (scr 2 -> 4 px^2); neither flips between adjacent frames
  const wq = Math.min(1 - ramp(r0, maxR * 0.85, maxR), ramp(scr, 2, 4));
  if (wq <= 0.02) return;
  const rb = Math.max(r0, 3.2), nMax = Math.min(Math.round(aw / 0.45), 150);
  const keep = Math.min(1, ((o.cover ?? 0.22) * scr) / (6 * rb * rb) / Math.max(1, nMax)); // share of the quad's people the screen budget keeps (continuous in the camera)
  for (let i = 0; i < nMax; i++) {
    const w = fadeIn(keep, hash(n0 + i * 4.13 + 0.7)) * wq; // person i is kept when its seeded rank is under `keep`
    if (w <= 0.03) continue;
    const u = hash(n0 + i * 1.37), v = hash(n0 + i * 2.71 + 0.3);
    const wp: V3 = [a[0] + (b[0] - a[0]) * u + (d[0] - a[0]) * v, a[1] + (b[1] - a[1]) * u + (d[1] - a[1]) * v + 1.1, a[2] + (b[2] - a[2]) * u + (d[2] - a[2]) * v];
    const s = camPoint(c, wp);
    if (!s || s[0] < -10 || s[0] > 1090 || s[1] < -10 || s[1] > 1930) continue;
    const k = hash(n0 + i * 5.3), rim = o.rim ? o.rim(wp[0]) : 0, pw = faded(p, w);
    let col = k < brightShare ? bright[Math.floor(hash(n0 + i) * bright.length)] : pal[Math.floor(hash(n0 + i * 0.7) * pal.length)];
    if (rim > 0 && o.rimCol) col = mixColor(col, o.rimCol, rim * hash(n0 + i * 3.3));
    const r = rb;
    hardFill(pw, n0 + i, col, r < 4 ? ell(s[0], s[1], r * 1.1, r * 1.3, 5) : [[s[0] - r * 1.15, s[1] - r * 0.4], [s[0] + r * 1.15, s[1] - r * 0.4], [s[0] + r * 1.25, s[1] + r * 2.2], [s[0] - r * 1.25, s[1] + r * 2.2]]);
    if (o.phones && hash(n0 + i * 9.1) < o.phones) hardFill(pw, n0 + i + 0.7, SD.night.phone, ell(s[0] + r * 0.4, s[1] - r * 1.8, Math.max(1, r * 0.3), Math.max(1.2, r * 0.45), 5));
  }
};

const meanColor = (cols: string[]) => cols.reduce((a, col, i) => mixColor(a, col, 1 / (i + 1)), cols[0]);

/** The bowl, far to near: stand concrete with a crowd-coloured base, flecks, the roof ring (underside from inside, top from above) and the outer wall. */
const paintBowl = (p: Painter, c: YCam, night: boolean, fo: FleckOpts = {}) => {
  const P = night ? SD.night : SD.day, crowdMean = meanColor([...P.crowd, ...P.crowd]), above = c.y > ROOF.y0 + 0.5;
  bowlItems(c).forEach((q) => {
    const k = q.seg * 16 + (q.ring >= 0 ? q.ring : q.ring === -1 ? 13 : 14); // stable id (stand quad), not the per-frame depth-sort position: the sort order changes as the camera moves and used to reseed every quad's paint and flecks
    if (q.kind === 'wall') { W(p, c, 3000 + k, q.seg % 3 === 0 ? mixColor(P.wall, '#000000', 0.14) : P.wall, q.pts); return; }
    if (q.kind === 'roof') { W(p, c, 3000 + k, night ? SD.night.roof : above ? SD.day.roofTop : SD.day.roofUnder, q.pts); return; }
    const conc = q.ring === 6 ? P.concSh : mixColor(P.conc, P.concSh, (q.ring % 2) * 0.3);
    W(p, c, 1000 + k, q.ring === 6 ? conc : mixColor(conc, crowdMean, night ? 0.5 : 0.62), q.pts);
    if (q.ring !== 6) flecks(p, c, q, 20000 + k * 300, P.crowd, P.bright, night ? 0.2 : 0.15, fo);
  });
};

// ---- the ground around the bowl (seen from the SH17 crane) ----
const paintGround = (p: Painter, c: YCam) => {
  const D = SD.day, far = 4000;
  W(p, c, 5, mixColor(D.wall, D.turf, 0.12), [[-far, 0, -far], [far, 0, -far], [far, 0, far], [-far, 0, far]]);
  for (const x of [-70, 20, 95]) W(p, c, 6 + x, '#6e7276', [[x - 5, 0.01, 100], [x + 5, 0.01, 100], [x + 5, 0.01, far], [x - 5, 0.01, far]]); // approach roads
  for (const z of [-60, 15]) W(p, c, 8 + z, '#6e7276', [[150, 0.01, z - 5], [far, 0.01, z - 5], [far, 0.01, z + 5], [150, 0.01, z + 5]]);
  for (let j = 0; j < SEGS; j++) { // plaza ring d 88-104 around the outer wall
    const q = (d: number, s: number): V3 => { const [x, z] = bowlPt(d, s); return [x, 0.02, z]; };
    W(p, c, 2000 + j, '#a4a6a2', [q(ROOF.d1, j / SEGS), q(ROOF.d1, (j + 1) / SEGS), q(104, (j + 1) / SEGS), q(104, j / SEGS)]);
  }
};

// ---- the field ----
const paintField = (p: Painter, c: YCam, night: boolean) => {
  const P = night ? SD.night : SD.day;
  W(p, c, 10, P.turf, [[-62, 0, -31], [62, 0, -31], [62, 0, 31], [-62, 0, 31]]);
  if (night) return;
  const D = SD.day;
  for (let i = 0; i < 24; i++) if (i % 2) W(p, c, 11 + i, D.stripe, [[-55 + i * 4.6, 0.01, -24.5], [-55 + (i + 1) * 4.6, 0.01, -24.5], [-55 + (i + 1) * 4.6, 0.01, 24.5], [-55 + i * 4.6, 0.01, 24.5]]);
  const sl = ([[-55, -24.5], [55, -24.5], [55, 24.5], [-55, 24.5]] as [number, number][]).map(([x, z]) => camPoint(c, [x, 0.02, z])).filter(Boolean) as Pt[];
  if (sl.length > 2) inkLine(p, 40, sl, {color: D.line, weight: 0.8, still: true});
  for (let i = 0; i < 11; i++) for (const [x, col] of [[-3, '#f4f4f0'], [3, '#3a3e44']] as [number, string][]) {
    const s = camPoint(c, [x, 1, -15 + i * 3]); if (s) hardFill(p, 50 + i * 2 + (x > 0 ? 1 : 0), col, ell(s[0], s[1], Math.max(1.4, camUnit(c, [x, 1, 0]) * 0.28), Math.max(2.6, camUnit(c, [x, 1, 0]) * 0.55), 6));
  }
};

// ---- seat head cards (near the lens), the floor crowd (night) ----
/** Heads far to near by camera depth, each at its own weight (alpha), seeded by its stable grid id: the temporally stable replacement for `paintHeads` (which seeds by array index). */
const paintCrowd = (p: Painter, c: YCam, heads: CrowdHead[], o: HeadOpts = {}) => {
  heads.map((n) => ({n, d: camSpace(c, [n.x, n.h, n.z]).d})).sort((x, y) => y.d - x.d).forEach(({n}) => { if ((n.w ?? 1) > 0.03) paintHead(faded(p, n.w ?? 1), c, n, n.id, o); });
};
/** Paint-budget thinning: heads nearer than `near` m (camera depth) stay; farther ones keep a seeded share `keepFar` (the rows read as continuous dots at that size). The share eases from 1 to `keepFar` over
 * `near` .. 1.5 x `near` and a head's weight follows (fade, no flip); the seeded rank is a hash of the head's grid id. */
export const thin = (c: YCam, heads: CrowdHead[], near: number, keepFar: number): CrowdHead[] => heads.map((n) => {
  const d = camSpace(c, [n.x, n.h, n.z]).d, keep = keepFar + (1 - keepFar) * (1 - ramp(d, near, near * 1.5));
  return {...n, w: fadeIn(keep, hash(n.id * 2.9 + 0.4))};
}).filter((n) => n.w > 0.03);
/** Seat rows as head cards from behind: rows 0.8 m apart, seats 0.55 m on a world-anchored grid (x = ix * 0.55, so the rows do not slide with the camera), on the true stand surface of the +z side (they face the field). */
export const seatHeads = (x0: number, x1: number, z0: number, z1: number, night: boolean, seed = 0): CrowdHead[] => {
  const out: CrowdHead[] = [];
  for (let r = 0, z = z0; z <= z1 + 1e-9; r++, z = z0 + r * 0.8) for (let ix = Math.ceil(x0 / 0.55 - 1e-9); ix * 0.55 <= x1 + 1e-9; ix++) {
    const x = ix * 0.55, k = x * 13.1 + z * 7.7 + seed, h = seatSurfaceY(x, z) + 1.15 + hash(k) * 0.25;
    const shirt = night ? mixColor('#23273a', SD.night.rim, 0.25 * hash(k + 1)) : SD.day.crowd[Math.floor(hash(k + 1) * 3)];
    const hair = night ? '#14161e' : ['#1d1a18', '#3b2f25', '#5a4636', '#9a9a9a'][Math.floor(hash(k + 2) * 4)];
    out.push({id: (ix + 400) * 32 + r, x: x + (hash(k + 3) - 0.5) * 0.12, z, h, skin: night ? '#5a4a48' : SKINS[Math.floor(hash(k + 4) * 3)], hair, shirt, turn: 1, phase: hash(k + 5), body: 3.6});
  }
  return out;
};
/** Seat heads on the +z lower stand (d 6.5 up to `dMax`) between world x `x0` and `x1` (one fixed range per shot, wider than the camera sweep): head cards (the stand's near rows), with the bounce lift and arms for SH20. */
const lowerStandHeads = (x0: number, x1: number, dMax: number, night: boolean): CrowdHead[] => {
  const out: CrowdHead[] = [];
  for (let r = 0, d = 6.6; d <= dMax; r++, d = 6.6 + r * 0.8) {
    const z = FIELD.hz + d, y = standY(d);
    for (let ix = Math.ceil(x0 / 0.55 - 1e-9); ix * 0.55 <= x1 + 1e-9; ix++) {
      const x = ix * 0.55;
      if (Math.abs(x) > FIELD.hx) continue;
      const k = x * 17.3 + d * 5.1, jx = (hash(k) - 0.5) * 0.14;
      const shirt = night ? mixColor('#3a3f52', SD.night.rim, Math.max(0, (x + 20) / 80) * 0.55 * hash(k + 1)) : SD.day.crowd[Math.floor(hash(k + 1) * 5)];
      out.push({id: 200000 + (ix + 400) * 32 + r, x: x + jx, z, h: y + 1.1 + hash(k + 2) * 0.22, skin: night ? '#6a5650' : SKINS[Math.floor(hash(k + 3) * 6)], hair: night ? '#16181f' : '#2b2420', shirt, turn: (hash(k + 4) - 0.5) * 1.4, phase: hash(k + 5), body: 3.6});
    }
  }
  return out;
};
/** World x range a shot's camera sweeps (shot-local frames 0 .. len - 1), widened by `lo` / `hi` m: the fixed crowd range for the whole shot. */
const camXRange = (shot: StadiumShot, lo: number, hi: number): [number, number] => {
  const xs = Array.from({length: STADIUM_SHOTS[shot].len}, (_, f) => STADIUM_SHOTS[shot].cam(f).x);
  return [Math.min(...xs) - lo, Math.max(...xs) + hi];
};

/** The floor crowd on the field, packed on a 0.7 x 1.15 m grid, warming toward the stage. Screen-budgeted: far nodes are thinned and drawn larger. Heads (near) and specks (far) cross-fade over an rpx band and a
 * member's keep weight fades over a share band; the head cap fades with depth. Every decision is a hash of the grid id and a continuous function of the camera, so nobody flips between adjacent frames. */
const paintFloor = (p: Painter, c: YCam, o: {f: number; arms?: boolean; bounce?: boolean; maxHeads?: number}) => {
  // the crowd's clothes mass under the heads (bare turf never shows between them), warming toward the stage
  for (let i = 0; i < 8; i++) { const x0 = -50 + i * 12, w = Math.max(0, (x0 + 6 + 20) / 66); W(p, c, 39900 + i, mixColor('#2f3345', '#b88058', w * w * 0.8), [[x0, 1.3, -22.5], [Math.min(46, x0 + 12), 1.3, -22.5], [Math.min(46, x0 + 12), 1.3, 23.4], [x0, 1.3, 23.4]]); }
  const heads: CrowdHead[] = [], specks: {s: Pt; r: number; col: string; phone: boolean; k: number; w: number}[] = [], lift = o.bounce ? bounceLift(o.f) : 0;
  for (let i = 0; i < 140; i++) for (let j = 0; j < 40; j++) {
    const x = -50 + i * 0.7 + (hash(i * 7 + j) - 0.5), z = -22 + j * 1.15 + (hash(i * 1.3 + j * 3) - 0.5) * 0.5;
    if (x > 46) continue;
    const u = camUnit(c, [x, 1.5, z]), warm = Math.max(0, (x + 20) / 66), kk = hash(i * j + 0.2);
    const keep = Math.min(1, Math.max(0.05, (0.7 * u * 1.15 * u * 0.35) / 180)), w = fadeIn(keep, hash(i * 3.7 + j * 11.9));
    if (w <= 0.03) continue;
    const col = mixColor('#3a3f52', '#e0a070', warm * warm * 0.85 * (0.5 + 0.5 * kk));
    const rpx = u * 0.105, id = i * 40 + j, hw = ramp(rpx, 2.8, 3.6), sw = 1 - hw;
    if (hw > 0.03) heads.push({id: 100000 + id, x, z, h: 1.55 + hash(i + j * 0.7) * 0.2 + lift * (0.7 + 0.6 * hash(i * 2.1 + j)), skin: '#6a5650', hair: '#16181f', shirt: col, turn: (hash(i * 0.9 + j) - 0.5) * 1.6, phase: hash(i * 5 + j), body: 3.2, w: w * hw});
    if (sw <= 0.03) continue;
    const s = camPoint(c, [x, 1.5 + lift * 0.8, z]); if (!s) continue;
    specks.push({s, r: Math.min(6, Math.max(0.9, u * 0.25) / Math.sqrt(keep)), col, phone: hash(i * 31 + j * 7) < 0.1, k: id, w: w * sw});
  }
  specks.sort((a, b) => a.s[1] - b.s[1]).forEach(({s, r, col, phone, k, w}) => {
    const pw = faded(p, w);
    hardFill(pw, 40000 + k, col, ell(s[0], s[1], r * 1.2, r * 1.5, 6));
    if (phone) hardFill(pw, 41000 + k, SD.night.phone, ell(s[0] + r * 0.3, s[1] - r * 1.6, Math.max(0.9, r * 0.35), Math.max(1.2, r * 0.5), 5));
  });
  // the head cap: the `maxHeads` nearest stay; the rest fade over the next 15% of the cap distance (was a hard cut of the nearest-N list)
  const cap = o.maxHeads ?? 260, ds = heads.map((n) => camSpace(c, [n.x, n.h, n.z]).d).sort((a, b) => a - b), dcap = ds[Math.min(cap, ds.length) - 1] ?? Infinity;
  const nearest = heads.map((n) => ({...n, w: (n.w ?? 1) * (1 - ramp(camSpace(c, [n.x, n.h, n.z]).d, dcap, dcap * 1.15 + 0.01))})).filter((n) => n.w > 0.03);
  paintCrowd(p, c, nearest, {shoulders: 0.2, body: 3.2});
  if (o.arms) paintArms(p, c, nearest);
};
/** Both arms up for two in three of the near heads (SH20 staging): two thin quads from the shoulders; a phone in some hands. Seeds and picks come from the member's grid id. */
const paintArms = (p: Painter, c: YCam, heads: CrowdHead[]) => {
  heads.forEach((n) => {
    const i = n.id;
    if (hash(i * 3.1 + 4) > 0.66) return;
    const top = camPoint(c, [n.x, n.h, n.z]); if (!top) return;
    const u = camUnit(c, [n.x, n.h, n.z]), r = 0.105 * u, pa = faded(p, (n.w ?? 1) * ramp(r, 2.4, 3.2)); // arms fade in over r 2.4 -> 3.2 px instead of switching on at 3
    if (r < 2.4) return;
    const w = Math.max(1.2, 0.032 * u), up = (0.42 + 0.1 * hash(i)) * u;
    for (const sd of [-1, 1]) {
      const x0 = top[0] + sd * 0.19 * u, y0 = top[1] + r * 2.4, x1 = x0 + sd * 0.07 * u, y1 = y0 - up;
      hardFill(pa, 6000 + i * 3 + (sd > 0 ? 1 : 0), n.shirt, [[x0 - w, y0], [x0 + w, y0], [x1 + w, y1], [x1 - w, y1]]); // sleeve
      if (r >= 6) hardFill(pa, 6100 + i * 3 + (sd > 0 ? 1 : 0), n.skin, ell(x1, y1 - w * 0.4, w * 0.95, w * 1.3, 6)); // hand
    }
    if (hash(i * 7.7) < 0.3) hardFill(pa, 6002 + i * 3, SD.night.phone, ell(top[0] + 0.26 * u, top[1] + r * 2.4 - (0.5) * u, Math.max(1.1, 0.025 * u), Math.max(1.6, 0.045 * u), 5));
  });
};

// ---- the stage (night) ----
const paintStage = (p: Painter, c: YCam) => {
  const N = SD.night;
  W(p, c, 60, '#3a3440', [[48, 0, -20], [70, 0, -20], [70, 2.5, -20], [48, 2.5, -20]]);
  W(p, c, 61, N.stage, [[48, 2.5, -20], [70, 2.5, -20], [70, 2.5, 20], [48, 2.5, 20]]);
  W(p, c, 62, mixColor(N.stage, '#ffb070', 0.3), [[62, 2.5, -18], [62, 2.5, 18], [62, 18, 18], [62, 18, -18]]);
  W(p, c, 63, '#2a2630', [[48, 2.5, 20], [70, 2.5, 20], [70, 0, 20], [48, 0, 20]]);
  for (const z of [-20, 20]) W(p, c, 64 + z, '#5a5866', [[50, 2.5, z - 0.4], [50, 2.5, z + 0.4], [50, 22, z + 0.4], [50, 22, z - 0.4]]);
  W(p, c, 66, '#5a5866', [[50, 21.5, -20.4], [50, 21.5, 20.4], [50, 22.5, 20.4], [50, 22.5, -20.4]]);
  for (let i = 0; i < 8; i++) {
    const z0 = -18 + i * 5.1, col = i % 2 ? N.beamA : N.beamB, sw = (hash(i) - 0.5) * 50;
    const a = camPoint(c, [50, 21.8, z0]), b1 = camPoint(c, [-10 + sw, 60, z0 - 12]), b2 = camPoint(c, [-4 + sw, 60, z0 + 6]);
    if (a && b1 && b2) washAt(p, 70 + i, col, 64, [a, b1, b2], 0, 0);
  }
  const sg = camPoint(c, [58, 10, 0]);
  if (sg) {
    for (let i = 0; i < 4; i++) washAt(p, 90 + i, N.stage, 34, [[sg[0] - 90 - 70 * i, sg[1] + 120], [sg[0] + 90 + 70 * i, sg[1] + 120], [sg[0] + 60 + 40 * i, sg[1] - 380 - 120 * i], [sg[0] - 60 - 40 * i, sg[1] - 380 - 120 * i]], 0, 0);
  }
};

// ---- the shots ----
/** LF05A pick B: the front fans stand 3.2 m closer to the lens (one stays back); x relative to the camera, z in metres. */
const FANS: [number, number, keyof typeof import('../kit/people').PEOPLE][] = [[-1.6, 88.7, 'man-crop'], [1.3, 89.2, 'woman-ponytail'], [-0.1, 88.0, 'man-buzz'], [2.9, 85, 'man-parted'], [-3.0, 87.8, 'woman-bob'], [0.6, 90.6, 'man-shaved'], [-2.2, 90.8, 'woman-curly']];
const FAN_JACKETS = ['#2d3440', '#4a5a6a', '#3a3f4a', '#6b7480', '#c94f3d', '#2d3440', '#55606c'];
/** The caption-band ground: stepped falloff over the lower frame so seat rows and bodies under y 1176 stay dark (series band mean <= 0.25, p95 <= 0.40). */
export const BAND_SHADE = {SH17: {y0: 1000, amount: 0.78, color: '#12161a'}, SH18: {y0: 1000, amount: 0.62, color: '#12161a'}, SH19: {y0: 1000, amount: 0, color: '#0a0e18'}, SH20: {y0: 1000, amount: 0.5, color: '#0a0e18'}};

/** One frame of a stadium shot (`f` shot-local). Returns the camera. */
export const paintStadiumShot = (p: Painter, shot: StadiumShot, f: number, o: {t?: number; /** Called after each stage with its name (paint-budget probes). */ mark?: (stage: string) => void} = {}): YCam => {
  const S = STADIUM_SHOTS[shot], c = S.cam(f), night = S.state === 'night', t = o.t ?? f / 30, box: Pt[] = [[-40, -40], [1120, -40], [1120, 1960], [-40, 1960]];
  if (!night) {
    hardFill(p, 1, SD.day.sky, box);
    washAt(p, 2, SD.day.skyLo, 200, [[-40, 300], [1120, 300], [1120, 900], [-40, 900]], 0, 0);
  } else {
    hardFill(p, 1, SD.night.sky, box);
  }
  if (shot === 'SH18') W(p, c, 6, '#1d2126', [[-100, 22, -14], [-100, 22, 14], [-100, 34, 14], [-100, 34, -14]]); // the blank video board at the -x end (dark, no text)
  if (shot === 'SH17') paintGround(p, c);
  paintField(p, c, night); o.mark?.('field');
  if (night) {
    const rim = (x: number) => Math.max(0, Math.min(1, (x + 40) / 100)) * 0.7;
    paintBowl(p, c, true, {phones: 0.1, rim, rimCol: SD.night.rim, maxR: 7}); o.mark?.('bowl');
    paintFloor(p, c, {f, arms: shot === 'SH20', bounce: shot === 'SH20', maxHeads: shot === 'SH20' ? 150 : 260}); o.mark?.('floor');
    paintStage(p, c); o.mark?.('stage');
    washAt(p, 96, '#4a3f66', 36, [[-40, 300], [1120, 300], [1120, 1100], [-40, 1100]], 0, 0);
    if (shot === 'SH19') {
      // (no foreground fans at night: from this lens their heads overlap the stage and read as performers; the near seats are dark head cards)
      paintCrowd(p, c, thin(c, seatHeads(...camXRange('SH19', 2, 22), 74, 93, true), 14, 0.45), {shoulders: 0.22, body: 3.6});
      washAt(p, 91, '#6a5a7a', 50, [[-40, 600], [1120, 600], [1120, 1100], [-40, 1100]], 0, 0);
    } else {
      const heads = thin(c, lowerStandHeads(...camXRange(shot, 30, 30), 26, true), 5, 0.28), lift = bounceLift(f);
      paintCrowd(p, c, heads, {shoulders: 0.2, body: 3.6, crouch: (n) => -lift * (0.7 + 0.6 * n.phase)});
      paintArms(p, c, heads.map((n) => ({...n, h: n.h + lift * (0.7 + 0.6 * n.phase)})));
    }
  } else {
    paintBowl(p, c, false);
    if (shot === 'SH18') {
      // near seat rows (the two front rows are on the deck surface) and the fans from behind, rain jackets, arms up (kit back-view cards in front of the lens)
      paintCrowd(p, c, seatHeads(...camXRange('SH18', 9, 9), 72, 91, false), {shoulders: 0.22, body: 3.6});
      FANS.map(([dx, z, id], i) => ({at: [c.x + dx, seatSurfaceY(c.x + dx, z), z] as V3, id, i})).sort((a, b) => a.at[2] - b.at[2]).forEach(({at, id, i}) => {
        paintFigureAt(p, c, castOf(id, 'hoodie'), {at, view: 'back', pose: i % 3 === 1 ? 'P01' : 'P08', t, seed: 1500 + i * 11, tint: {to: FAN_JACKETS[i], u: 0.55}, fig: {hoodUp: i === 2 || i === 5}});
      });
    }
  }
  const bs = BAND_SHADE[shot];
  if (bs.amount > 0) bottomShade(p, bs.y0, bs.amount, 99000, bs.color, 12, 20);
  return c;
};

/** Where a world point lands in this shot's frame (for measured checks). */
export const stadiumPx = (shot: StadiumShot, f: number, v: V3): Pt | null => camPoint(STADIUM_SHOTS[shot].cam(f), v);
export const lensClearance = (c: YCam) => c.y - seatSurfaceY(c.x, c.z);
