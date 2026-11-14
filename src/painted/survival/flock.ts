import {hash} from '../kit/hash';
import type {Item} from '../kit/world';
import type {YCam} from '../kit/ycam';
import type {V3} from '../kit/space';
import {paintBeast, type Build, type L3} from './beast';
import {buildPterosaur, PTERO_POSES} from './beast-pterosaur';

// N16-22 R3 / 16A small pterosaur flock (Boss, 14 Nov 2026): the kit `PTERO` (span 3 m) scaled to `FLOCK_SPAN` = 0.9 m, ten instances with their own flap phase, bursting off the far conifer crowns around
// (-1, 22, -17) and scattering up and to screen-right, out of frame by 16A +34 (frame 1384). `scaleBuild` scales a whole Build uniformly about its origin (every key, flat, joint, foot and anchor; radii too).
export const FLOCK_SPAN = 0.9, FLOCK_N = 10;
export const scaleBuild = (B: Build, k: number): Build => {
  const s = (p: L3): L3 => [p[0] * k, p[1] * k, p[2] * k];
  return {
    ...B,
    parts: B.parts.map((q) => ({...q, keys: q.keys.map((e) => ({...e, p: s(e.p), a: e.a * k, b: e.b * k}))})),
    flats: B.flats.map((f) => ({...f, pts: f.pts.map(s), veins: f.veins?.map((v) => v.map(s))})),
    joints: Object.fromEntries(Object.entries(B.joints).map(([n, p]) => [n, s(p)])),
    feet: B.feet.map(s), shadow: {s: B.shadow.s * k, l: B.shadow.l * k, rs: B.shadow.rs * k, rl: B.shadow.rl * k},
    anchors: Object.fromEntries(Object.entries(B.anchors).map(([n, p]) => [n, s(p)])),
  };
};
export type FlockBird = {at: V3; heading: number; pitch: number; bank: number; phase: number; alive: boolean};
/** Bird `i` at burst progress `u` (0..1 over 16A +18..+34): leaves its perch in the crowns after a per-bird delay, climbs and fans to the right. */
export const flockBird = (i: number, u: number, seed = 31000): FlockBird => {
  const d = 0.25 * hash(seed + i), a = Math.max(0, u - d) / (1 - d), sp = 22 + 14 * hash(seed + 20 + i), ang = 0.55 + 0.5 * hash(seed + 40 + i), fan = (hash(seed + 60 + i) - 0.5) * 0.5;
  const t = a * 0.55;
  const p0: V3 = [-1 + 5 * (hash(seed + 80 + i) - 0.5), 21 + 2 * hash(seed + 100 + i), -17 - 2 * hash(seed + 120 + i)];
  return {at: [p0[0] + Math.cos(fan) * sp * t, p0[1] + Math.sin(ang) * sp * t * 0.6, p0[2] + Math.sin(fan) * sp * t * 0.5], heading: fan, pitch: Math.min(0.7, ang * 0.6) * Math.min(1, a * 3), bank: 0.25 * (hash(seed + 140 + i) - 0.5) * 2, phase: hash(seed + 160 + i), alive: a > 0};
};
let _flap: Build[] | null = null;
/** The scaled flap frames (one cycle in 12 steps), built once. */
const flapFrames = (): Build[] => (_flap ??= Array.from({length: 12}, (_, k) => scaleBuild(buildPterosaur(PTERO_POSES.flap(k / 12)), FLOCK_SPAN / 3)));
/** The ten birds at progress `u` and frame `f` (flap 4 Hz at 30 fps: 7.5 f per beat) as sorted items. Birds that have not left their perch are perched (STAND, folded) in the crowns. */
export const flockItems = (u: number, f: number, o: {seed?: number; n?: number; haze?: number} = {}): Item[] => Array.from({length: o.n ?? FLOCK_N}, (_, i): Item => {
  const b = flockBird(i, u, o.seed), frames = flapFrames(), B = b.alive ? frames[Math.floor((((f / 7.5 + b.phase) % 1) + 1) % 1 * 12) % 12] : scaleBuild(buildPterosaur(PTERO_POSES.stand()), FLOCK_SPAN / 3);
  return {at: b.at, draw: (p, c: YCam) => { paintBeast(p, c, B, {at: [b.at[0], b.at[2]], heading: b.heading, ground: b.at[1], pitch: b.pitch, bank: b.bank, seed: 72000 + i * 300, haze: o.haze ?? 0.35, hazeCol: '#dfe8d4', shadowOp: 0}); }};
});
