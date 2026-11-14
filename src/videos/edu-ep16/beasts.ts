import type {Item} from '../../painted/kit/world';
import {wFill, wInk} from '../../painted/kit/world';
import type {YCam} from '../../painted/kit/ycam';
import type {Painter} from '../../painted/kit/painter';
import {paintBeast, type BeastPlace, type Build, type L3} from '../../painted/survival/beast';
import {beastSlabs} from '../../painted/survival/beast-sort';
import {buildLongNeck, type LongNeckPose} from '../../painted/survival/beast-longneck';
import {buildAnkylosaur, ANKYLO_POSES, type AnkPose} from '../../painted/survival/beast-ankylo';
import type {V3} from '../../painted/survival/core';

// EDU-EP16 creature staging helpers (Editor, R1.5b draft): placement maths for the Boss kit creatures (heading from a target point, a walk phase from distance, ring splashes).
// Nothing here draws a creature itself: `beastSlabs` / `paintBeast` of src/painted/survival do, so the shot code only passes marks and clocks.
export const headingTo = (from: [number, number], to: [number, number]) => Math.atan2(to[1] - from[1], to[0] - from[0]);
export const mixN = (a: number, b: number, k: number) => a + (b - a) * k;
export const smoothN = (a: number, b: number, t: number) => { const u = Math.min(1, Math.max(0, (t - a) / (b - a))); return u * u * (3 - 2 * u); };
export const clamp01 = (u: number) => Math.min(1, Math.max(0, u));

/** A long-neck at `at` facing `toward` (VIL metres) with a pose; `haze` fades it into the distance; the depth slabs sort neck and body against ferns and conifers. */
export const longNeckItems = (c: YCam, at: [number, number], toward: [number, number], pose: LongNeckPose, o: {haze?: number; seed?: number; amb?: string; ambK?: number; ground?: number} = {}): Item[] =>
  beastSlabs(c, buildLongNeck(pose), {at, heading: headingTo(at, toward), haze: o.haze ?? 0, hazeCol: '#dfe8d4', seed: o.seed ?? 71000, ...(o.amb ? {amb: o.amb, ambK: o.ambK ?? 0.5} : {}), ...(o.ground !== undefined ? {ground: o.ground} : {})}, 4);

export type AnkState = {at: [number, number]; heading: number; pose: AnkPose; ground?: number; waterline?: number; haze?: number; seed?: number};
export const ankItems = (c: YCam, s: AnkState): {items: Item[]; B: Build; place: BeastPlace} => {
  const B = buildAnkylosaur(s.pose), place: BeastPlace = {at: s.at, heading: s.heading, haze: s.haze ?? 0, hazeCol: '#dfe8d4', seed: s.seed ?? 72000, ...(s.ground !== undefined ? {ground: s.ground} : {}), ...(s.waterline !== undefined ? {waterline: s.waterline} : {})};
  return {items: beastSlabs(c, B, place, 3), B, place};
};
export {ANKYLO_POSES};

/** World position of a creature-local point under a placement (the same maths as `paintBeast`'s toWorld, without painting). */
export const toWorldOf = (c: YCam, B: Build, place: BeastPlace, q: L3): V3 => paintBeast(null, c, B, place).toWorld(q);

/** Mud-water ring splash on the ground (or water) plane: two rings and `n` droplets thrown up and out; `age` 0..1 over the splash (0.3 s = 9 f). */
export const splashItem = (at: V3, age: number, o: {col?: string; r?: number; seed?: number; n?: number} = {}): Item => ({at: [at[0], at[1], at[2] + 0.4], bias: 2, draw: (p: Painter, c: YCam) => {
  if (age <= 0 || age >= 1) return;
  const col = o.col ?? '#6e5a3c', r = (o.r ?? 0.55) * Math.sqrt(age), a1 = 1 - age, seed = o.seed ?? 7300, n = o.n ?? 8;
  for (const [k, w] of [[1, 1.4], [0.62, 0.9]] as const) {
    const pts: V3[] = Array.from({length: 14}, (_, i) => [at[0] + Math.cos((i / 14) * 6.283) * r * k, at[1] + 0.02, at[2] + Math.sin((i / 14) * 6.283) * r * k * 0.8]);
    wInk(p, c, seed + Math.round(k * 10), pts, {color: col, weight: w * (0.4 + a1), closed: true});
  }
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 6.283 + 0.4 * Math.sin(seed + i), d = r * (0.6 + 0.5 * ((i * 37) % 10) / 10), h = 0.45 * Math.sin(Math.PI * age) * (0.7 + 0.3 * ((i * 53) % 10) / 10), s = 0.025 * (1 - 0.5 * age);
    const q: V3 = [at[0] + Math.cos(a) * d, at[1] + 0.03 + h, at[2] + Math.sin(a) * d * 0.8];
    wFill(p, c, seed + 40 + i, col, [[q[0] - s, q[1], q[2]], [q[0], q[1] + s, q[2]], [q[0] + s, q[1], q[2]], [q[0], q[1] - s * 0.8, q[2]]]);
  }
}});
