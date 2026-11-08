import {ell, hardFill, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {ease, ramp} from './clock';
import {paintEarth, spaceCam} from './space';
import {paintStars} from './stars';

// SET-GW (brief EDU-EP07-BRIEF-R1 N5; scene sheets EDU-EP07-SHEETS-R1.1 S01-B03-SH02 / SH03): a stylised gravitational-wave diagram in gu.
// The merger (SH02) is two neutron stars spiralling in a plane under a tilted camera; the race (SH03) is a violet ripple front and a gold flash front
// travelling left to right toward a tiny Earth. Pure functions of the shot-local frame L. No numbers on screen.

const GW = {bg: '#05081a', star: '#dfeaff', starEdge: '#8fa6e6', violet: '#a98bff', violetHi: '#d6c6ff', gold: '#ffe29a', goldHi: '#fff4cf'};
const FULL: [number, number, number, number] = [0, 0, 1080, 1920];

// ---- SH02: the merger (173 f; merge at L144, flash peak L150)
export const MERGE_AT = 144, FLASH_PEAK = 150, MERGE_LEN = 173;
export const camMerge = (L: number): YCam => { const e = ease(L, 0, MERGE_LEN - 1); return spaceCam([0, 0, 0], 6 * e, 20, 2.0 - 0.2 * e, 900, 900); };
/** Star separation (gu): 0.50 -> 0 over L0-144, accelerating (sep ~ (1 - L/144)^0.25). */
export const separation = (L: number): number => (L >= MERGE_AT ? 0 : 0.5 * Math.pow(1 - L / MERGE_AT, 0.25));
const spin = (L: number): number => 2 * Math.PI * 7 * (1 - Math.pow(Math.max(0, 1 - L / MERGE_AT), 0.6));

/** A ripple ring in the orbit plane about the origin, radius R gu, as one closed projected polyline. */
const ringPoly = (c: YCam, R: number): Pt[] => {
  const pts: Pt[] = [];
  for (let i = 0; i <= 48; i++) { const a = (i / 48) * Math.PI * 2, q = camPoint(c, [R * Math.cos(a), 0, R * Math.sin(a)]); if (q) pts.push(q); }
  return pts;
};
const strokeRing = (p: Painter, id: number, pts: Pt[], col: string, w: number) => {
  if (pts.length < 6) return;
  p.ink(id, 'rotring', col, w); p.brush.spline([...pts], 0.1);
};

/** Tapered light spikes from `o` (W5.3 G4): `n` rays between radii r0 and r1 (alternating long/short), hard-filled in `col` mixed toward the sky by `lvl`. */
const spikes = (p: Painter, id: number, o: Pt, r0: number, r1: number, n: number, col: string, lvl: number, rot: number, hw = 0.07) => {
  for (let i = 0; i < n; i++) {
    const a = rot + (i / n) * Math.PI * 2, rr = r1 * (i % 2 === 0 ? 1 : 0.55), c = Math.cos(a), sn = Math.sin(a), k = r0 * hw * 2.4;
    hardFill(p, id + i, lvl >= 1 ? col : mixColor(GW.bg, col, lvl), [[o[0] + c * r0 - sn * k, o[1] + sn * r0 + c * k], [o[0] + c * rr, o[1] + sn * rr], [o[0] + c * r0 + sn * k, o[1] + sn * r0 - c * k]]);
  }
};

export const paintMerge = (p: Painter, L: number) => {
  const c = camMerge(L);
  hardFill(p, 6200, GW.bg, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
  paintStars(p, c, mixColor(GW.bg, '#141a3a', 0.5), {seed: 33, count: 230, t: L / 30, rect: FULL, big: 0.1, varied: true});
  // faint ripples during the inspiral: one every 12 f, growing 0.02 gu/f and fading
  for (let k = 0; k * 12 < Math.min(L, MERGE_AT); k++) {
    const age = L - k * 12, R = 0.12 + age * 0.014, a = Math.max(0, 1 - age / 70) * 0.55;
    if (a > 0.04) strokeRing(p, 6210 + k, ringPoly(c, R), mixColor(GW.bg, GW.violet, a), 1.6);
  }
  // the merger ring (the violet ripple that leaves at contact; no flash)
  if (L >= MERGE_AT) {
    const age = L - MERGE_AT, R = 0.1 + age * 0.034, a = Math.max(0.35, 1 - age / 90);
    strokeRing(p, 6300, ringPoly(c, R), mixColor(GW.bg, GW.violet, a), 3.4);
    strokeRing(p, 6301, ringPoly(c, R * 0.93), mixColor(GW.bg, GW.violetHi, a * 0.8), 1.6);
    strokeRing(p, 6302, ringPoly(c, R * 0.84), mixColor(GW.bg, GW.violet, a * 0.5), 1.4);
  }
  // the two neutron stars (hidden once merged)
  if (L < MERGE_AT) {
    const sep = separation(L), th = spin(L), u = camUnit(c, [0, 0, 0]);
    for (const s of [-1, 1]) {
      const w: V3 = [s * 0.5 * sep * Math.cos(th), 0, s * 0.5 * sep * Math.sin(th)], q = camPoint(c, w);
      if (!q) continue;
      const r = 0.05 * u * Math.max(0.9, camUnit(c, w) / u);
      washAt(p, 6400 + s, mixColor(GW.bg, GW.violet, 0.5), 110, ell(q[0], q[1], r * 2.6, r * 2.1, 22), 0.3, 0.2);
      washAt(p, 6406 + s, mixColor(GW.bg, GW.violetHi, 0.5), 130, ell(q[0], q[1], r * 1.6, r * 1.35, 20), 0.3, 0.2);
      spikes(p, 6440 + (s > 0 ? 4 : 0), q, r * 0.95, r * (2.5 + 0.4 * ramp(L, 0, MERGE_AT)), 4, GW.violetHi, 0.55, Math.PI / 4, 0.045);
      hardFill(p, 6402 + s, GW.star, ell(q[0], q[1], r, r, 20));
      hardFill(p, 6410 + s, '#ffffff', ell(q[0] - r * 0.2, q[1] - r * 0.22, r * 0.5, r * 0.5, 14));
      p.ink(6404 + s, 'rotring', GW.starEdge, 0.8); const e = ell(q[0], q[1], r, r, 20); p.brush.spline([...e, e[0]], 0.1);
    }
  } else { // the merged remnant (W5.3 round 3 G1: no flash, burst, spikes or shock ring at contact): one plain star, same style as the two it came from
    const o = camPoint(c, [0, 0, 0]);
    if (o) {
      const r = 0.062 * camUnit(c, [0, 0, 0]);
      hardFill(p, 6420, GW.star, ell(o[0], o[1], r, r, 20));
      hardFill(p, 6422, '#ffffff', ell(o[0] - r * 0.2, o[1] - r * 0.22, r * 0.5, r * 0.5, 14));
      p.ink(6424, 'rotring', GW.starEdge, 0.8); const e = ell(o[0], o[1], r, r, 20); p.brush.spline([...e, e[0]], 0.1);
    }
  }
};

// ---- SH03: the race (152 f; ripple reaches Earth at L77, flash at L83)
export const RACE_LEN = 152, ARRIVE = 77, ARRIVE_FLASH = 83, EARTH_X = 6.0;
export const camRace = (L: number): YCam => ({x: 0.5 + 5.1 * Math.sin((Math.PI / 2) * Math.min(1, L / ARRIVE)), y: 0.3, z: 2.2, yaw: 0, f: 900, hy: 960}); // truck, ease-out, arriving on L77
/** Front radius from the source (gu): ripple 6.0 at L77, the flash the same law six frames later. */
export const rippleX = (L: number): number => (EARTH_X * L) / ARRIVE;
export const flashX = (L: number): number => (EARTH_X * (L - (ARRIVE_FLASH - ARRIVE))) / ARRIVE;

const frontArc = (c: YCam, R: number): Pt[] => {
  const pts: Pt[] = [];
  for (let i = 0; i <= 24; i++) { const th = -0.36 + (i / 24) * 0.72, q = camPoint(c, [R * Math.cos(th), R * Math.sin(th), 0]); if (q) pts.push(q); }
  return pts;
};
export const paintRace = (p: Painter, L: number) => {
  const c = camRace(L);
  hardFill(p, 6500, GW.bg, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]]);
  paintStars(p, c, mixColor(GW.bg, '#141a3a', 0.5), {seed: 35, count: 240, t: 0, rect: FULL, big: 0.07});
  const fade = 1 - ramp(L, 92, 120);
  // Earth, tiny, lit from the left (the source side)
  const eq = camPoint(c, [EARTH_X, 0, 0]);
  if (eq) paintEarth(p, eq[0], eq[1], 0.04 * camUnit(c, [EARTH_X, 0, 0]), [eq[0] - 400, eq[1]], {seed: 7});
  // the violet ripple (two strokes) and the gold flash (a thick stroke and a core) behind it
  const rx = rippleX(L), fx = flashX(L);
  if (fade > 0.02) {
    if (rx > 0.5) { const a = frontArc(c, rx); strokeRing(p, 6510, a, mixColor(GW.bg, GW.violet, fade), 3.6); strokeRing(p, 6511, frontArc(c, rx - 0.07), mixColor(GW.bg, GW.violetHi, 0.7 * fade), 1.6); strokeRing(p, 6512, frontArc(c, rx - 0.17), mixColor(GW.bg, GW.violet, 0.4 * fade), 1.4); }
    if (fx > 0.5) { strokeRing(p, 6520, frontArc(c, fx), mixColor(GW.bg, GW.gold, fade), 7); strokeRing(p, 6521, frontArc(c, fx), mixColor(GW.bg, GW.goldHi, fade), 2.6); strokeRing(p, 6522, frontArc(c, fx - 0.1), mixColor(GW.bg, GW.gold, 0.45 * fade), 3); }
  }
  // arrival marks: a small violet puff at L77, a gold puff at L83
  if (eq) {
    const u = camUnit(c, [EARTH_X, 0, 0]);
    const puff = (id: number, col: string, a0: number) => { const age = L - a0; if (age < 0 || age > 18) return; const k = 1 - age / 18, r = (0.06 + age * 0.012) * u; washAt(p, id, mixColor(GW.bg, col, 0.55 * k), 140, ell(eq[0], eq[1], r, r, 20), 0.3, 0.2); };
    puff(6530, GW.violet, ARRIVE); puff(6531, GW.gold, ARRIVE_FLASH);
  }
};
export const raceFlash = (L: number): number => (L < ARRIVE_FLASH ? 0 : 0.5 * (1 - ramp(L, ARRIVE_FLASH, ARRIVE_FLASH + 10)));
