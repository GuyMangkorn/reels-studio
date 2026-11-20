import {capsule, ell, hardFill, washAt} from './draw';
import {hash} from './hash';
import {ring, type Painter, type Pt} from './painter';
import type {V3} from './space';
import {camPoint, camUnit, type YCam} from './ycam';

/** Brush opacity (0-255) of a fractional alpha: `washAt` takes the p5.brush scale. */
const op = (alpha: number) => alpha * 255;

// Kit gunfire effects (EDU-EP30 ticket T04, Boss 2026-11-19; brief VD30-11 steps 1, 2, 5, 6): a round schedule on the shot clock, muzzle flash with
// halation, smoke haze, muzzle blast on the ground, grass lean and canvas shake. Drawn on the plate canvas through the shot's `YCam`, seeded, plain
// fills only (no brush fills, DF-20261031-paint-seed-defer), and a pure function of the frame: nothing is carried between frames, so frame L
// computed alone equals frame L after 0...L. Nothing here knows a shot; plates pass the rounds, the muzzle and the numbers (`GUNFIRE_PRESETS`).
// Frames are shot-local (30 fps). Debris (casings, spurts, spouts, splash) is T05, below.

/** Peak halation alpha (the kit glow rule `GLOW_PEAK`, glow.tsx); inlined so a pure-ts test need not load the tsx module. */
export const GUNFIRE_GLOW_PEAK = 0.3;
const FPS = 30;
const DEG = Math.PI / 180;

/** Shot-local frames of every round: `first`, `first + every`, ... (`count` rounds). */
export const roundFrames = (first: number, count: number, every: number): number[] => Array.from({length: count}, (_, i) => first + i * every);

export type RoundPhase = {n: number; k: number};
/** The latest round at or before frame L: `n` its index (-1 before round 1, then k is -1), `k` frames since it (0 flash, 1 decay, >= 2 off). */
export const roundPhase = (L: number, rounds: number[]): RoundPhase => {
  let n = -1;
  for (let i = 0; i < rounds.length; i++) if (rounds[i] <= L) n = i;
  return n < 0 ? {n: -1, k: -1} : {n, k: L - rounds[n]};
};

/** Newsreel `pop` for the frame: 0.08 on the flash frame, 0.03 on the decay frame, else 0. */
export const popFor = (L: number, rounds: number[]): number => {
  const {n, k} = roundPhase(L, rounds);
  return n < 0 ? 0 : k === 0 ? 0.08 : k === 1 ? 0.03 : 0;
};

const addK = (a: V3, b: V3, k: number): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const unit3 = (v: V3): V3 => { const n = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / n, v[1] / n, v[2] / n]; };
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export type FlashShape = 'star' | 'cone' | 'bloom';
const SHAPES: FlashShape[] = ['star', 'cone', 'bloom'];
/** The seeded shape of round `n` (one pick per round). */
export const flashShapeOf = (seed: number, n: number): FlashShape => SHAPES[Math.floor(hash(seed + n * 7.31 + 3.7) * 3)];
/** Seeded core diameter (m) of round `n`, 0.25 to 0.35. */
export const flashDiameter = (seed: number, n: number): number => 0.25 + 0.1 * hash(seed + n * 5.17 + 11.3);

/** World outline of one flash shape at `muzzle` along `dir`; `scale` 1 on the flash frame, 0.5 on the decay frame. Star and cone lie in the vertical plane through the barrel (foreshortened when the lens looks along it); the round bloom faces the lens (`yaw` = camera yaw). */
export const flashOutline = (shape: FlashShape, muzzle: V3, dir: V3, diameter: number, scale: number, yaw = 0): V3[] => {
  const d = unit3(dir), up: V3 = [0, 1, 0];
  const side: V3 = [Math.cos(yaw), 0, Math.sin(yaw)];   // camera right: the round bloom always faces the lens
  const R = (diameter / 2) * scale;
  if (shape === 'star') {
    const pts: V3[] = [];
    for (let i = 0; i < 8; i++) {   // points along dir, up, -dir, -up with inner vertices (0.25 R) between
      const a = (i * Math.PI) / 4, r = i % 2 === 0 ? R : R * 0.25;
      pts.push(addK(addK(muzzle, d, r * Math.cos(a)), up, r * Math.sin(a)));
    }
    return pts;
  }
  if (shape === 'cone') {
    const L = 0.45 * scale, w = L * Math.tan(22 * DEG);
    return [muzzle, addK(addK(muzzle, d, L), up, w), addK(addK(muzzle, d, L), up, -w)];
  }
  return Array.from({length: 14}, (_, i) => { const a = (i / 14) * 2 * Math.PI; return addK(addK(muzzle, side, R * Math.cos(a)), up, R * Math.sin(a)); });
};

/** `halo` = halation radius R (px). `clip` is tested on the picture point of the muzzle: a flash whose muzzle fails it is not drawn (the water mirror's water-area test). */
export type FlashOpts = {halo: number; seed: number; clip?: (x: number, y: number) => boolean};

/** Picture polygon of the flash core for frame L (null when off or behind the lens); the proof measures its bbox. */
export const flashPolygon = (c: YCam, muzzle: V3, dir: V3, L: number, rounds: number[], seed: number): Pt[] | null => {
  const {n, k} = roundPhase(L, rounds);
  if (n < 0 || k > 1) return null;
  const pts = flashOutline(flashShapeOf(seed, n), muzzle, dir, flashDiameter(seed, n), k === 0 ? 1 : 0.5, c.yaw).map((v) => camPoint(c, v));
  return pts.every(Boolean) ? (pts as Pt[]) : null;
};

/** Muzzle flash and halation for frame L (VD30-11 step 1). k 0: white core + halation R; k 1: half-size `#ffd27a` + halation R/2 at half alpha. */
export const paintMuzzleFlash = (p: Painter, c: YCam, muzzle: V3, dir: V3, L: number, rounds: number[], o: FlashOpts) => {
  const {n, k} = roundPhase(L, rounds);
  if (n < 0 || k > 1) return;
  const q = camPoint(c, muzzle);
  if (!q || (o.clip && !o.clip(q[0], q[1]))) return;
  const on = k === 0, R = on ? o.halo : o.halo / 2, a = on ? 0.05 : 0.025;
  // halation first (under the core): six concentric plain circles, alpha summing to GLOW_PEAK on the flash frame
  [1, 0.83, 0.67, 0.5, 0.33, 0.17].forEach((f, i) => washAt(p, o.seed + n * 31 + i, '#fff2cc', op(a), ring(q[0], q[1], R * f, R * f, 24), 0, 0));
  const poly = flashPolygon(c, muzzle, dir, L, rounds, o.seed);
  if (poly) hardFill(p, o.seed + n * 31 + 9, on ? '#ffffff' : '#ffd27a', poly);
};

export type SmokeOpts = {drift: V3; seed: number; fadeAfter: number};
export type Puff = {at: V3; r: number; alpha: number; seed: number};
/** Smoke puffs alive at frame L (one per round born at the muzzle; radius 0.12 to 0.45 m and alpha 0.35 to 0.15 over 30 f; fade after the last round; alphas before the haze cap, `hazeCap`). `fade: false` skips the fade (the proof's reference). */
export const smokePuffs = (muzzle: V3, L: number, rounds: number[], o: SmokeOpts, fade = true): Puff[] => {
  const last = rounds[rounds.length - 1], f = fade && L > last ? Math.max(0, 1 - (L - last) / o.fadeAfter) : 1;
  const out: Puff[] = [];
  rounds.forEach((r, i) => {
    if (r > L) return;
    const age = L - r, u = clamp01(age / 30);
    out.push({at: addK(muzzle, o.drift, age / FPS), r: lerp(0.12, 0.45, u), alpha: lerp(0.35, 0.15, u) * f, seed: o.seed + i * 53});
  });
  return out;
};

/** Haze cap (T04 r3): every live puff's alpha x min(1, cap / sum of live alphas), so overlapping puffs cover at most 1 - e^-cap. */
export const SMOKE_CAP = 0.6, BLAST_CAP = 0.5;
export const hazeCap = (puffs: Puff[], cap: number): Puff[] => {
  const sum = puffs.reduce((a, q) => a + q.alpha, 0), k = sum > cap ? cap / sum : 1;
  return puffs.map((q) => ({...q, alpha: q.alpha * k}));
};

/** Per-circle alpha of a puff's five stacked circles (T04 r4): 1 - (1 - alpha)^(1/5), so the stack reads `alpha` at the centre. */
export const circleAlpha = (alpha: number) => 1 - Math.pow(1 - alpha, 1 / 5);

/** Smoke haze (VD30-11 step 2): each puff is 5 overlapping circles seeded +-0.3 radius, colour `#6b5f50`. */
export const paintSmoke = (p: Painter, c: YCam, muzzle: V3, L: number, rounds: number[], o: SmokeOpts) => {
  for (const f of hazeCap(smokePuffs(muzzle, L, rounds, o), SMOKE_CAP)) {
    if (f.alpha <= 0) continue;
    const q = camPoint(c, f.at);
    if (!q) continue;
    const R = f.r * camUnit(c, f.at);
    const ac = circleAlpha(f.alpha);
    for (let j = 0; j < 5; j++) {
      const ox = (hash(f.seed + j * 3 + 1) * 2 - 1) * 0.3 * R, oy = (hash(f.seed + j * 3 + 2) * 2 - 1) * 0.3 * R;
      washAt(p, f.seed + j, '#6b5f50', op(ac), ring(q[0] + ox, q[1] + oy, R, R, 16), 0, 0);
    }
  }
};

export type BlastOpts = {ground: 'wheat' | 'mud'; seed: number};
/** Ground blast puffs at frame L: one added per round on the ground (y 0) 2.0 m ahead of the muzzle along `dir`; radius 0.3 to 1.2 m over 40 f. No fade (T04 states none). */
export const blastPuffs = (muzzle: V3, dir: V3, L: number, rounds: number[], o: BlastOpts): Puff[] => {
  const d = unit3([dir[0], 0, dir[2]]), centre: V3 = [muzzle[0] + d[0] * 2, 0, muzzle[2] + d[2] * 2];
  const alpha = o.ground === 'mud' ? 0.15 : 0.2, out: Puff[] = [];
  rounds.forEach((r, i) => {
    if (r > L) return;
    const rad = lerp(0.3, 1.2, clamp01((L - r) / 40)), s = o.seed + i * 47;
    out.push({at: [centre[0] + (hash(s + 1) * 2 - 1) * 0.3 * rad, 0, centre[2] + (hash(s + 2) * 2 - 1) * 0.3 * rad], r: rad, alpha, seed: s});
  });
  return out;
};

/** Muzzle blast cloud on the ground ahead of the gun (VD30-11 step 6): `#a08a66` alpha 0.20 on wheat, `#7d6a52` 0.15 on mud, summed alpha capped at 0.5, a ground-flat ellipse (height 0.6 of width). */
export const paintBlast = (p: Painter, c: YCam, muzzle: V3, dir: V3, L: number, rounds: number[], o: BlastOpts) => {
  for (const f of hazeCap(blastPuffs(muzzle, dir, L, rounds, o), BLAST_CAP)) {
    const q = camPoint(c, f.at);
    if (!q) continue;
    const R = f.r * camUnit(c, f.at);
    washAt(p, f.seed, o.ground === 'mud' ? '#7d6a52' : '#a08a66', op(f.alpha), ell(q[0], q[1], R, R * 0.6, 18), 0, 0);
  }
};

/** Lean (rad) away from the muzzle for stalks 1 to 3 m ahead: 0.44 on k 0, 0.17 on k >= 1 while the burst runs, 0 before round 1, linear back to 0 over 15 f after the last round. */
export const blastLean = (L: number, rounds: number[], distM: number): number => {
  if (distM < 1 || distM > 3) return 0;
  const {n, k} = roundPhase(L, rounds);
  if (n < 0) return 0;
  const last = rounds[rounds.length - 1];
  if (L <= last) return k === 0 ? 0.44 : 0.17;
  return 0.17 * Math.max(0, 1 - (L - last) / 15);
};

export type ShakeSpec = {x: number; y: number; roll: number; tremor: number; stop?: number; seed: number};
export type Shake = {dx: number; dy: number; rot: number};
/** Plate-canvas shake at frame L: per round a seeded-sign impulse (x 1.0 on k 0, 0.5 on k 1, 0.2 on k 2), a seeded tremor +-tremor px each frame from the first to the last round, exactly 0 from `stop`. */
export const shakeAt = (L: number, rounds: number[], s: ShakeSpec): Shake => {
  if (s.stop !== undefined && L >= s.stop) return {dx: 0, dy: 0, rot: 0};
  let dx = 0, dy = 0, rot = 0;
  rounds.forEach((r, n) => {
    const k = L - r;
    if (k < 0 || k > 2) return;
    const f = k === 0 ? 1 : k === 1 ? 0.5 : 0.2, sg = (a: number) => (hash(s.seed + n * 9.13 + a) < 0.5 ? -1 : 1);
    dx += sg(1) * s.x * f; dy += sg(2) * s.y * f; rot += sg(3) * s.roll * f;
  });
  if (L >= rounds[0] && L <= rounds[rounds.length - 1]) {
    dx += (hash(s.seed + L * 2.71 + 500) * 2 - 1) * s.tremor;
    dy += (hash(s.seed + L * 3.37 + 900) * 2 - 1) * s.tremor;
  }
  return {dx: dx || 0, dy: dy || 0, rot: rot || 0};
};

// ---- Debris (EDU-EP30 ticket T05, Boss 2026-11-19; brief VD30-11 steps 4 and 7): ejected casings, strike spurts, water spouts and splashes. Closed form per frame. ----

const G = 9.81;
export type CasingSpec = {
  port: V3; side: 1 | -1; seed: number;
  /** Horizontal barrel direction; the receiver's right is (-dir.z, 0, dir.x). */
  dir: V3;
  ground: (x: number, z: number) => number;
  water?: {y: number; inside: (x: number, z: number) => boolean};
  /** Landing box: seed search per casing until the rest point is inside (B03-SH01). */
  box?: {x: [number, number]; z: [number, number]};
};
export type CasingState = 'air' | 'rest' | 'sunk';
export type CasingPose = {pos: V3; angle: number; state: CasingState; glint: boolean};
type CasingPath = {t1: number; p1: V3; v1: V3; t2: number; p2: V3; sunk: boolean; turns: number; heading: number; vy0: number; port: V3; v0: V3};
const at3 = (p: V3, v: V3, t: number): V3 => [p[0] + v[0] * t, p[1] + v[1] * t - 0.5 * G * t * t, p[2] + v[2] * t];

/** First time the ballistic arc (p, v) is at or below `surf(x, z)` (steps of 1/240 s, then bisection). */
const meet = (p: V3, v: V3, surf: (x: number, z: number) => number): number => {
  const h = (t: number) => { const q = at3(p, v, t); return q[1] - surf(q[0], q[2]); };
  const dt = 1 / 240;
  let a = 0;
  for (let k = 1; k < 4800; k++) {
    const b = k * dt;
    if (h(b) <= 0) {
      let lo = a, hi = b;
      for (let j = 0; j < 24; j++) { const m = (lo + hi) / 2; if (h(m) <= 0) hi = m; else lo = m; }
      return hi;
    }
    a = b;
  }
  return 20;
};

const casingTry = (spec: CasingSpec, sa: number): CasingPath => {
  const d = unit3([spec.dir[0], 0, spec.dir[2]]), right: V3 = [-d[2], 0, d[0]];
  const side = spec.side * (1.5 + 1.1 * hash(sa + 1)), up = 2.6 + 0.5 * hash(sa + 2), back = 0.3;
  const v0: V3 = [right[0] * side - d[0] * back, up, right[2] * side - d[2] * back];
  const port = spec.port, w = spec.water;
  const dry = (x: number, z: number) => spec.ground(x, z);
  const surf = (x: number, z: number) => (w && w.inside(x, z) ? Math.max(w.y, spec.ground(x, z)) : spec.ground(x, z));
  const t1 = meet(port, v0, surf), p1 = at3(port, v0, t1);
  const sunk = !!w && w.inside(p1[0], p1[2]);
  const vc: V3 = [v0[0], v0[1] - G * t1, v0[2]];
  const v1: V3 = [vc[0] * 0.5, -vc[1] * 0.3, vc[2] * 0.5];
  const p1s: V3 = [p1[0], surf(p1[0], p1[2]), p1[2]];
  const dt2 = sunk ? 0 : meet(p1s, v1, dry);
  const p2r = at3(p1s, v1, dt2), p2: V3 = sunk ? p1s : [p2r[0], dry(p2r[0], p2r[2]), p2r[2]];
  return {t1, p1: p1s, v1, t2: t1 + dt2, p2, sunk, turns: 2 + hash(sa + 3), heading: hash(sa + 4) * Math.PI, vy0: up, port, v0};
};

/** The path of casing i, after the landing-box seed search. */
const casingPath = (i: number, spec: CasingSpec): CasingPath => {
  const s = spec.seed + i * 17.3;
  if (!spec.box) return casingTry(spec, s);
  let last = casingTry(spec, s);
  for (let a = 0; a < 400; a++) {
    const c = casingTry(spec, s + a * 101.7), [x, , z] = c.p2;
    last = c;
    if (x >= spec.box.x[0] && x <= spec.box.x[1] && z >= spec.box.z[0] && z <= spec.box.z[1]) return c;
  }
  return last;
};

const SECOND_FLIGHT_TURNS = 0.5;
/** Casing i at frame L (its first frame is `rounds[i] + 1`), or null before it leaves the port. `angle` tilts the casing axis out of the horizontal (rad): 2-3 turns in the first flight, a resting casing lies at a multiple of pi. */
export const casingAt = (i: number, L: number, rounds: number[], spec: CasingSpec): CasingPose | null => {
  const f0 = rounds[i] + 1;
  if (L < f0) return null;
  const c = casingPath(i, spec), t = (L - f0) / FPS;
  const glint = L === f0 + Math.round((c.vy0 / G) * FPS);
  const a1 = 2 * Math.PI * c.turns;
  if (t < c.t1) return {pos: at3(c.port, c.v0, t), angle: a1 * (t / c.t1), state: 'air', glint};
  if (c.sunk) return {pos: c.p1, angle: a1, state: 'sunk', glint: false};
  if (t < c.t2) return {pos: at3(c.p1, c.v1, t - c.t1), angle: a1 + Math.PI * SECOND_FLIGHT_TURNS * ((t - c.t1) / (c.t2 - c.t1)), state: 'air', glint: false};
  return {pos: [c.p2[0], c.p2[1] + 0.006, c.p2[2]], angle: Math.round((a1 + Math.PI * SECOND_FLIGHT_TURNS) / Math.PI) * Math.PI, state: 'rest', glint: false};
};

/** Rest positions of every casing (a sunk one at its plop point): B04-SH06 and B04-SH05 lay the dam casings static from these (same spec and seed as B04-SH03). */
export const restingCasings = (rounds: number[], spec: CasingSpec): {pos: V3; heading: number; sunk: boolean}[] =>
  rounds.map((_, i) => { const c = casingPath(i, spec); return {pos: [c.p2[0], c.p2[1] + 0.006, c.p2[2]] as V3, heading: c.heading, sunk: c.sunk}; });

const BRASS = '#c9a54a', BASE = '#7a5c22', GLINT = '#fff6d8';
/** One casing quad 56 x 12 mm, brass with a 10 mm `#7a5c22` base, minimum drawn length 3 px. `heading` turns the axis about the vertical (rad). */
export const paintCasing = (p: Painter, c: YCam, pos: V3, angle: number, heading: number, seed: number, glint = false) => {
  const ax: V3 = [Math.cos(angle) * Math.cos(heading), Math.sin(angle), Math.cos(angle) * Math.sin(heading)];
  const a = camPoint(c, addK(pos, ax, -0.028)), b = camPoint(c, addK(pos, ax, 0.028));
  if (!a || !b) return;
  let A: Pt = a, B: Pt = b;
  if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 3) {   // minimum drawn length 3 px, kept around the centre
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2;
    A = [cx - 1.5 * Math.cos(ang), cy - 1.5 * Math.sin(ang)]; B = [cx + 1.5 * Math.cos(ang), cy + 1.5 * Math.sin(ang)];
  }
  const M: Pt = [A[0] + (B[0] - A[0]) * (10 / 56), A[1] + (B[1] - A[1]) * (10 / 56)];
  const w = Math.max(1, 0.012 * camUnit(c, pos)), ang = Math.atan2(B[1] - A[1], B[0] - A[0]), nx = -Math.sin(ang) * w / 2, ny = Math.cos(ang) * w / 2;
  const quad = (P: Pt, Q: Pt): Pt[] => [[P[0] + nx, P[1] + ny], [Q[0] + nx, Q[1] + ny], [Q[0] - nx, Q[1] - ny], [P[0] - nx, P[1] - ny]];
  hardFill(p, seed, glint ? GLINT : BRASS, quad(A, B));
  if (!glint) hardFill(p, seed + 1, BASE, quad(A, M));
};

/** Expanding ring on the water plane: radius 0 to `rMax` m over `frames` f from `start`, `#e8e4d8`, alpha `alpha0` to 0, drawn as a thin plain band (about 1.5 px). */
export const paintRing = (p: Painter, c: YCam, at: V3, start: number, L: number, rMax: number, frames: number, seed: number, alpha0 = 0.8) => {
  const k = L - start;
  if (k < 0 || k > frames) return;
  const q = camPoint(c, at);
  if (!q) return;
  const u = k / frames, R = rMax * u * camUnit(c, at), e = 0.75;
  if (R < 0.5) return;
  const ry = (e2: number) => Math.max(0.05, (R + e2) * 0.35);
  const outer = ell(q[0], q[1], R + e, ry(e), 20), inner = ell(q[0], q[1], Math.max(0.1, R - e), ry(-e), 20).reverse();
  washAt(p, seed, '#e8e4d8', op(alpha0 * (1 - u)), [...outer, outer[0], ...inner, inner[0]], 0, 0);
};

/** Every casing with `rounds[i] + 1 <= L`: in the air, at rest (stays to the end of the shot) or sunk (a plop ring, then nothing). */
export const paintCasings = (p: Painter, c: YCam, L: number, rounds: number[], spec: CasingSpec) => {
  rounds.forEach((_, i) => {
    const s = casingAt(i, L, rounds, spec);
    if (!s) return;
    const path = casingPath(i, spec);
    if (s.state === 'sunk') {
      const fc = rounds[i] + 1 + Math.ceil(path.t1 * FPS);
      paintRing(p, c, path.p1, fc, L, 0.15, 8, spec.seed + i * 29 + 5);
      return;
    }
    paintCasing(p, c, s.pos, s.angle, path.heading, spec.seed + i * 13 + 2, s.glint);
  });
};

export type CasingKey = {L: number; pos: V3; angle: number};
/** Keyed casing path (the B04-SH04 jam casing): linear between keys, held before the first and after the last. */
export const casingKeyed = (keys: CasingKey[], L: number): {pos: V3; angle: number} => {
  if (L <= keys[0].L) return {pos: keys[0].pos, angle: keys[0].angle};
  for (let i = 1; i < keys.length; i++) {
    if (L <= keys[i].L) {
      const a = keys[i - 1], b = keys[i], u = (L - a.L) / (b.L - a.L);
      return {pos: [lerp(a.pos[0], b.pos[0], u), lerp(a.pos[1], b.pos[1], u), lerp(a.pos[2], b.pos[2], u)], angle: lerp(a.angle, b.angle, u)};
    }
  }
  const e = keys[keys.length - 1];
  return {pos: e.pos, angle: e.angle};
};

export type SpurtKind = 'dust' | 'mud' | 'spout';
export type SpurtSpec = {points: (V3 | null)[]; kind: SpurtKind; h: [number, number]; seed: number};
/** Seeded rise height (m) of round i's spurt. */
export const spurtHeight = (s: SpurtSpec, i: number): number => lerp(s.h[0], s.h[1], hash(s.seed + i * 6.3 + 1));
/** Fraction of the rise height at age k (frames since the round): 0-2 rise to h, 3-7 fall to 0 at 8. */
export const spurtProfile = (k: number): number => (k < 0 || k >= 8 ? 0 : k <= 2 ? (k + 1) / 3 : 1 - (k - 2) / 6);

/** Strike spurts (VD30-11 step 7): round i uses `points[i]` (null skips); life 8 f from the round frame. */
export const paintSpurts = (p: Painter, c: YCam, L: number, rounds: number[], s: SpurtSpec) => {
  rounds.forEach((r, i) => {
    const pt = s.points[i], k = L - r;
    if (!pt || k < 0 || k >= 8) return;
    const q = camPoint(c, pt);
    if (!q) return;
    const h = spurtHeight(s, i), prof = spurtProfile(k), u = camUnit(c, pt), sd = s.seed + i * 91;
    const up = (y: number, dx = 0, dz = 0) => camPoint(c, [pt[0] + dx, pt[1] + y, pt[2] + dz]);
    if (s.kind === 'spout') {
      const top = up(h * prof), w = Math.max(1, 0.06 * u);
      if (top) {
        washAt(p, sd, '#e8e4d8', op(0.85), [[q[0] - w / 2, q[1]], [q[0] + w / 2, q[1]], [top[0] + w / 2, top[1]], [top[0] - w / 2, top[1]]], 0, 0);
        for (let j = 0; j < 4; j++) {   // crown of 4 droplets
          const ang = (j / 4) * Math.PI * 2 + hash(sd + j) * 0.6, sp = (0.05 + 0.09 * Math.min(1, k / 7)) * u;
          washAt(p, sd + 10 + j, '#e8e4d8', op(0.85), ell(top[0] + Math.cos(ang) * sp, top[1] + (j % 2 === 0 ? 0.04 : -0.02) * u + Math.sin(ang) * sp * 0.4, Math.max(0.8, 0.02 * u), Math.max(0.8, 0.02 * u), 8), 0, 0);
        }
      }
      paintRing(p, c, pt, r, L, 0.15, 8, sd + 30);
      return;
    }
    const dust = s.kind === 'dust', col = dust ? '#8a6a48' : '#5a4632', kk = k / 7;
    washAt(p, sd, dust ? '#a08a66' : '#5a4632', op(dust ? 0.4 : 0.3), ell(q[0], q[1] - 0.12 * h * prof * u, 0.25 * h * (0.6 + 0.4 * kk) * u, 0.18 * h * u, 16), 0, 0);
    for (let j = 0; j < 6; j++) {   // streaks leaning out from the point: tips rise, then fall and spread
      const ang = hash(sd + j * 3 + 1) * Math.PI * 2, lean = (0.1 + 0.25 * kk) * h, hj = h * prof * (0.6 + 0.4 * hash(sd + j * 3 + 2));
      const tip = up(hj, Math.cos(ang) * lean, Math.sin(ang) * lean);
      if (tip) hardFill(p, sd + 20 + j, col, capsule([q[0], q[1]], tip, Math.max(1, 0.03 * u), Math.max(0.8, 0.015 * u)));
    }
    if (dust) for (let j = 0; j < 4; j++) {   // chaff flecks
      const ang = hash(sd + j * 5 + 40) * Math.PI * 2, lean = (0.15 + 0.4 * kk) * h, hj = h * prof * (0.8 + 0.4 * hash(sd + j * 5 + 41));
      const f = up(hj, Math.cos(ang) * lean, Math.sin(ang) * lean);
      if (f) hardFill(p, sd + 60 + j, '#d8c48a', ell(f[0], f[1], Math.max(0.8, 0.02 * u), Math.max(0.5, 0.01 * u), 6));
    }
  });
};

export type StrikeOpts = {
  count: number; seed: number; minDist: number;
  /** x seeded in a range, or given per point */
  x: [number, number] | ((i: number) => number);
  /** z walks linearly over a range, or given per point (second argument is a seeded 0..1) */
  z: [number, number] | ((i: number, r: number) => number);
  ground: (x: number, z: number) => number;
  water?: {y: number; inside: (x: number, z: number) => boolean};
  avoid?: V3[];
};
/** Seeded strike points, re-seeded until at least `minDist` metres (plan) from every `avoid` point; a point in the water sits on the water plane and is marked in `wet`. */
export const strikePoints = (o: StrikeOpts): {points: V3[]; wet: boolean[]} => {
  const points: V3[] = [], wet: boolean[] = [];
  for (let i = 0; i < o.count; i++) {
    let pt: V3 = [0, 0, 0], w = false;
    for (let a = 0; a < 200; a++) {
      const s = o.seed + i * 13.7 + a * 3.1;
      const x = typeof o.x === 'function' ? o.x(i) : lerp(o.x[0], o.x[1], hash(s + 1));
      const z = typeof o.z === 'function' ? o.z(i, hash(s + 2)) : lerp(o.z[0], o.z[1], i / Math.max(1, o.count - 1));
      w = !!o.water && o.water.inside(x, z);
      pt = [x, w ? Math.max(o.water!.y, o.ground(x, z)) : o.ground(x, z), z];
      if (!(o.avoid ?? []).some((b) => Math.hypot(b[0] - x, b[2] - z) < o.minDist)) break;
    }
    points.push(pt); wet.push(w);
  }
  return {points, wet};
};

/** Water splash (B04-SH03 queue hop): crown 0.40 m wide, 0.35 m high at local f 2 (gone by f 6), droplets falling to f 10, two rings to 0.5 m over 12 f. */
export const paintSplash = (p: Painter, c: YCam, L: number, at: V3, start: number, seed: number) => {
  const k = L - start;
  if (k < 0) return;
  const q = camPoint(c, at);
  if (!q) return;
  const u = camUnit(c, at);
  paintRing(p, c, at, start, L, 0.5, 12, seed + 1);
  paintRing(p, c, at, start + 3, L, 0.5, 12, seed + 2);
  if (k <= 6) {
    const hh = 0.35 * (k <= 2 ? k / 2 : Math.max(0, 1 - (k - 2) / 4)), wd = 0.2 * (0.6 + 0.4 * Math.min(1, k / 2)) * u;
    const pts: Pt[] = [[q[0] - wd, q[1]]];
    for (let j = 0; j <= 8; j++) pts.push([q[0] - wd + (2 * wd * j) / 8, q[1] - hh * u * (j === 4 ? 1 : j === 0 || j === 8 ? 0.25 : j % 2 === 0 ? 0.75 : 0.35)]);
    pts.push([q[0] + wd, q[1]]);
    washAt(p, seed, '#e8e4d8', op(0.85), pts, 0, 0);
  }
  if (k >= 1 && k <= 10) {
    for (let j = 0; j < 6; j++) {   // droplets thrown from the crown, falling to f 10
      const vx = (hash(seed + j * 3 + 7) * 2 - 1) * 0.35, vy = 1.2 + 0.8 * hash(seed + j * 3 + 8), t = (k - 1) / FPS;
      const d = camPoint(c, [at[0] + vx * t, at[1] + 0.2 + Math.max(0, vy * t - 0.5 * G * t * t), at[2]]);
      if (d) washAt(p, seed + 20 + j, '#e8e4d8', op(0.85), ell(d[0], d[1], Math.max(0.8, 0.015 * u), Math.max(0.8, 0.015 * u), 8), 0, 0);
    }
  }
};

/** The per-shot numbers of the ticket (T04 decided values); plates spread these into the calls. */
export const GUNFIRE_PRESETS = {
  B03_SH01: {rounds: roundFrames(2, 23, 3), halo: 180, smoke: {drift: [-0.25, 0.06, 0] as V3, fadeAfter: 45}, shake: {x: 5, y: 7, roll: 0.3, tremor: 2}},
  B04_SH03: {rounds: roundFrames(10, 11, 3), halo: 260, smoke: {drift: [0.25 * 0.37, 0.06, 0.25 * -0.93] as V3, fadeAfter: 45}, shake: {x: 7, y: 9, roll: 0.4, tremor: 2, stop: 42}},
  B05_SH02: {rounds: [72, 79], halo: 160},
} as const;
