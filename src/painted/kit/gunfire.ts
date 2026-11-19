import {ell, hardFill, washAt} from './draw';
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
// Frames are shot-local (30 fps). Debris (casings, spurts, spouts, splash) is T05, not here.

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

/** The per-shot numbers of the ticket (T04 decided values); plates spread these into the calls. */
export const GUNFIRE_PRESETS = {
  B03_SH01: {rounds: roundFrames(2, 23, 3), halo: 180, smoke: {drift: [-0.25, 0.06, 0] as V3, fadeAfter: 45}, shake: {x: 5, y: 7, roll: 0.3, tremor: 2}},
  B04_SH03: {rounds: roundFrames(10, 11, 3), halo: 260, smoke: {drift: [0.25 * 0.37, 0.06, 0.25 * -0.93] as V3, fadeAfter: 45}, shake: {x: 7, y: 9, roll: 0.4, tremor: 2, stop: 42}},
  B05_SH02: {rounds: [72, 79], halo: 160},
} as const;
