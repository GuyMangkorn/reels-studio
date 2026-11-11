import type {CrowOpts, CrowState} from './crow';
import {BODY_OFF_M, flapState, landState, scoldState, takeoffState} from './crow';
import type {V3} from '../kit/space';
import {wireAt, WS} from './palette';

// EDU-EP16 mob helper (N1 flock helper, brief "Mob perch plan", storyboard H1/H2): each bird is a perch plus timed legs (take-off, flight, landing or a
// short hop) as a pure function of the shot-local frame `n` (deterministic on seek). The same function feeds the painter (`birdAt`) and the
// minimum crow-to-head distance printout (`mobMin`), so the number printed is the number drawn. Space P, metres.

export type Leg = {n0: number; n1: number; to: V3; /** Arc height in m (flight 1.2, a wire hop 0.25). */ arc?: number; hop?: boolean; /** Arriving from the air (a `path` bird): no take-off pose. */ land?: boolean};
export type Bird = {id: string; variant: CrowOpts['variant']; view?: CrowOpts['view']; head?: CrowOpts['head']; start: V3; legs?: Leg[]; seed: number; phase?: number; scold?: number; still?: boolean; /** Circling flyer: constant drift in m/frame, wings beating (no perch). */ cruise?: V3; /** R4 (shot 13): a flyer on a timed track `at(n)` (body centre) until frame `until`, then `legs` from there (landing). */ path?: {at: (n: number) => V3; until: number}};
export type BirdNow = {id: string; /** Feet point when perched; body centre in the air. */ at: V3; mode: 'perch' | 'fly'; state: CrowState; opts: Pick<CrowOpts, 'variant' | 'view' | 'head' | 'seed' | 'anchor'>};

const ease = (u: number) => u * u * (3 - 2 * u);
const lerp3 = (a: V3, b: V3, u: number): V3 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];

export const birdAt = (b: Bird, n: number): BirdNow => {
  const view = b.view ?? 'right', head = b.head ?? (view === 'left' ? 'profile-left' : 'profile-right');
  if (b.cruise) {
    const at: V3 = [b.start[0] + b.cruise[0] * n, b.start[1] + b.cruise[1] * n + 0.25 * Math.sin(n * 0.11 + b.seed), b.start[2] + b.cruise[2] * n];
    return {id: b.id, at, mode: 'fly', state: flapState(n, {phase: b.phase, glide: 0.2 + 0.2 * Math.sin(n * 0.07 + b.seed), beak: 0.4}), opts: {variant: b.variant, view, head, seed: b.seed, anchor: 'body'}};
  }
  if (b.path && n < b.path.until) return {id: b.id, at: b.path.at(n), mode: 'fly', state: flapState(n, {phase: b.phase, glide: 0.2 + 0.2 * Math.sin(n * 0.07 + b.seed), beak: 0.4}), opts: {variant: b.variant, view, head, seed: b.seed, anchor: 'body'}};
  let from = b.path ? b.path.at(b.path.until) : b.start;
  for (const g of b.legs ?? []) {
    if (n < g.n0) break;
    if (n >= g.n1) { from = g.to; continue; }
    const u = ease((n - g.n0) / (g.n1 - g.n0)), p = lerp3(from, g.to, u);
    const arc = (g.arc ?? 1.2) * Math.sin(Math.PI * u);
    const at: V3 = [p[0], p[1] + BODY_OFF_M + arc, p[2]];
    const len = g.n1 - g.n0, te = Math.min(6, Math.floor(len / 2));
    const state: CrowState = g.land ? (n >= g.n1 - te ? landState(n - (g.n1 - te), {len: te}) : flapState(n - g.n0, {phase: b.phase})) : g.hop ? {...flapState(n - g.n0, {phase: b.phase, glide: 0.35, hz: 3}), wings: 0.8, lean: 12, tuck: false}
      : n - g.n0 < te ? takeoffState(n - g.n0, {len: te, phase: b.phase})
      : n >= g.n1 - te ? landState(n - (g.n1 - te), {len: te})
      : flapState(n - g.n0, {phase: b.phase});
    return {id: b.id, at, mode: 'fly', state, opts: {variant: b.variant, view, head, seed: b.seed, anchor: 'body'}};
  }
  const state = b.still ? {headTilt: 0.5, lean: 8} : scoldState(n, {phase: b.phase ?? b.seed * 0.137, k: b.scold ?? 1});
  return {id: b.id, at: from, mode: 'perch', state, opts: {variant: b.variant, view, head, seed: b.seed, anchor: 'feet'}};
};

// ---- shot 6 (S01-B01-SH06, global [339, 408)), MAN in MASK-A walks x(n) = -7.3 + 0.0433 n, head (x, 1.70, 0.30)
export const MAN6 = (n: number): V3 => [-7.3 + 0.0433 * n, 1.7, 0.3];
const row6 = [-18.0, -17.6, -17.2, -16.8, -16.4, -16.0];
export const MOB6: Bird[] = [
  ...row6.map((x, i): Bird => ({id: `W${i + 1}`, variant: i % 3 === 0 ? 'adult-ringed' : 'adult', start: wireAt(x), seed: 700 + i, phase: i * 0.31,
    // the two rearmost wire crows hop forward along the wire (x -15.2 at +62, -14.8 at +66)
    legs: i === 0 ? [{n0: 56, n1: 62, to: wireAt(-15.2), arc: 0.25, hop: true}] : i === 1 ? [{n0: 60, n1: 66, to: wireAt(-14.8), arc: 0.25, hop: true}] : []})),
  // two on the PL1 crossarm lift at +40 and land on T2's top at +54 / +58
  {id: 'X1', variant: 'adult', start: [-17.3, 7.7, -2.4], seed: 706, phase: 0.2, legs: [{n0: 40, n1: 54, to: [-12.2, 8.4, -4.4], arc: 1.3}]},
  {id: 'X2', variant: 'adult-ringed', start: [-18.7, 7.7, -2.4], seed: 707, phase: 0.6, legs: [{n0: 41, n1: 58, to: [-11.4, 8.6, -4.6], arc: 1.3}]},
];

// ---- shot 13 (S01-B03-SH03, global [733, 838)): WOMAN in MASK-A walks x(n) = 2.3 + 0.0433 n, head (x, 1.45, 0.30); MAN 6 m behind
export const WOMAN13 = (n: number): V3 => [2.3 + 0.0433 * n, 1.45, 0.3];
export const MAN13 = (n: number): V3 => [-3.7 + 0.0433 * n, 1.7, 0.3];
/**
 * R4 (J4, W5.3 Draft r3 viewer check): the mob rides over HER, never over the man. Every crow flies a track that follows her x (`WOMAN13`) at the far side of the lawn (z about -10, y 5-8, so the head distance stays
 * above 10 m): behind and above her while the camera looks back along the path (+0..+36), sliding forward over her as the camera comes alongside (+30..+72), then circling over her. Three land on the far lawn
 * at +66..+96 (feet on the grass at z -10.2). No bird perches or flies at the man's end (x < -3).
 */
const xHer = (n: number) => 2.3 + 0.0433 * n;
const trackOf = (offA: number, offB: number, y0: number, z0: number, w: number, ph: number) => (n: number): V3 => {
  const u = Math.max(0, Math.min(1, (n - 30) / 42)), e = u * u * (3 - 2 * u), off = offA + (offB - offA) * e;
  return [xHer(n) + off + 1.2 * Math.sin(w * n + ph), y0 + 0.6 * Math.sin(w * n * 0.7 + ph * 2) + 0.4 * Math.sin(n * 0.11 + ph), z0 + 0.5 * Math.cos(w * n + ph)];
};
const fl = (id: string, variant: Bird['variant'], seed: number, offA: number, offB: number, y0: number, z0: number, w: number, ph: number, land?: {n0: number; n1: number; dx: number}): Bird => {
  const at = trackOf(offA, offB, y0, z0, w, ph);
  return {id, variant, seed, phase: ph, start: at(0), path: {at, until: land ? land.n0 : 9999}, ...(land ? {legs: [{n0: land.n0, n1: land.n1, to: [xHer(land.n1) + land.dx, 0, -10.2] as V3, arc: 0.3, land: true}]} : {})};
};
export const MOB13: Bird[] = [
  fl('M1', 'adult-ringed', 540, -7.5, 3.0, 6.5, -10.2, 0.08, 0.1),
  fl('M2', 'adult', 541, -6.0, 1.5, 7.5, -10.8, 0.09, 1.3),
  fl('M3', 'adult-ringed', 542, -8.0, 4.0, 5.5, -10.0, 0.07, 2.4),
  fl('M4', 'adult', 543, -5.5, 2.5, 6.0, -10.5, 0.1, 3.5),
  fl('M5', 'adult-ringed', 544, -7.0, 0.5, 7.0, -10.4, 0.08, 4.6),
  fl('M6', 'adult', 545, -6.5, 3.5, 5.0, -10.3, 0.09, 5.6),
  fl('L1', 'adult', 546, -7.0, 2.0, 6.0, -10.5, 0.08, 0.7, {n0: 66, n1: 78, dx: 1.5}),
  fl('L2', 'adult-ringed', 547, -5.5, 3.0, 5.5, -10.2, 0.09, 2.0, {n0: 76, n1: 88, dx: 3.2}),
  fl('L3', 'adult', 548, -6.5, 1.0, 6.5, -10.6, 0.07, 3.1, {n0: 86, n1: 98, dx: 0.2}),
];
export type MobRow = {n: number; minM: number; who: string};
/** Per-frame minimum straight-line distance from every bird (feet point perched, body centre in the air) to the walker's head, for `frames` shot-local frames. */
export const mobMin = (birds: Bird[], head: (n: number) => V3, frames: number): MobRow[] => {
  const rows: MobRow[] = [];
  for (let n = 0; n < frames; n++) {
    const h = head(n);
    let best = Infinity, who = '';
    for (const b of birds) { const a = birdAt(b, n).at; const d = Math.hypot(a[0] - h[0], a[1] - h[1], a[2] - h[2]); if (d < best) { best = d; who = b.id; } }
    rows.push({n, minM: best, who});
  }
  return rows;
};
