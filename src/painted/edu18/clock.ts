// EDU-EP18-SHORT clocks (W5.2 Boss): the shot table of EDU-EP18-ROWS-R2.0 (scripts/edu-series/ep18/storyboard.md "Shot map"), 30 fps, 1468 f (48.93 s).
// A shot is a pure function of the shot-local frame `L` (= global f - start): every clock below takes `L` and nothing else, so Studio, random
// seek and the scene render draw the same frame. Two clock families per shot (DF-20261030-painted-story-hold-ambient-clock): the EVENT clock
// (run, shrink, fall, contact, ticks, tip, splash, slap) and the AMBIENT clock (rain, drip curtain, ripples, wobble, wingbeat, breathing).
// The two shot-clock exceptions of this deliverable live here: SH14 FREEZE (both clocks hold) and SH16 REWIND (reverse play of SH04).
import {clamp01, ease} from '../kit/space';

export const FPS = 30;
export const TOTAL_FRAMES = 1468;
export const SHOT_TABLE = [
  ['S01-B01-SH01', 0, 30], ['S01-B01-SH02', 30, 20], ['S01-B01-SH03', 50, 86], ['S01-B01-SH04', 136, 86], ['S01-B01-SH05', 222, 26], ['S01-B01-SH06', 248, 76],
  ['S01-B02-SH01', 324, 35], ['S01-B02-SH02', 359, 61], ['S01-B02-SH03', 420, 83], ['S01-B02-SH04', 503, 46], ['S01-B02-SH05', 549, 58],
  ['S01-B03-SH01', 607, 107], ['S01-B03-SH02', 714, 44], ['S01-B04-SH01', 758, 108], ['S01-B04-SH02', 866, 114],
  ['S01-B05-SH01', 980, 115], ['S01-B05-SH02', 1095, 88], ['S01-B05-SH03', 1183, 22], ['S01-B05-SH04', 1205, 52], ['S01-B05-SH05', 1257, 81], ['S01-B05-SH06', 1338, 130],
] as const;
export type ShotId = (typeof SHOT_TABLE)[number][0];
export const shotAt = (f: number): {id: ShotId; L: number; len: number; start: number; no: number} | undefined => {
  const i = SHOT_TABLE.findIndex(([, a, n]) => f >= a && f < a + n);
  return i < 0 ? undefined : {id: SHOT_TABLE[i][0], L: f - SHOT_TABLE[i][1], len: SHOT_TABLE[i][2], start: SHOT_TABLE[i][1], no: i + 1};
};
export const lenOf = (id: ShotId) => SHOT_TABLE.find(([k]) => k === id)![2];

export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
/** Smoothstep of `L` between frames a and b. */
export const sm = (a: number, b: number, L: number) => ease(clamp01((L - a) / (b - a)));
/** Linear 0..1 between frames a and b. */
export const lin = (a: number, b: number, L: number) => clamp01((L - a) / (b - a));

/** A shot clock pair: `ev` drives events, `amb` drives ambient motion (frames; `amb / 30` = seconds), both in shot-local frames of `src`. */
export type ShotClock = {src: ShotId; ev: number; amb: number; frozen: boolean; dir: 1 | -1};
const plain = (src: ShotId, L: number): ShotClock => ({src, ev: L, amb: L, frozen: false, dir: 1});

// ---- Fall speeds (sm per frame; 1 sm per 405 real m: the slow-motion macro world, brief "Time scale")
export const FALL_SM_PER_F = 0.3; // D0, D1: 9 sm/s
export const FALL_D2 = 0.3028; // D2 (SH15)
export const FALL_REPLAY = 0.16; // D0 in the remembered replay (SH16/SH17), 4.8 sm/s

// ---- SH04: D0 meets the mosquito at +17 and carries it down; +40..+53 it flies back up
export const SH04 = {contact: 17, gone: 31, back: [40, 53] as const};

// ---- SH14 FREEZE: both clocks hold the +65 frame over +65..+107 (R06 recorded exception, R02 "the ride never beyond 20 units")
export const SH14 = {freezeAt: 65, ticksPerFrame: 1 / 5.4, firstTick: 8, lastTick: 20, glow: [65, 80] as const, ot03: [54, 107] as const};
/** SH14 clocks: event and ambient both stop dead at `freezeAt` (no ease: a time stop, not the drop slowing). */
export const sh14Clock = (L: number): ShotClock => {
  const h = Math.min(L, SH14.freezeAt);
  return {src: 'S01-B04-SH01', ev: h, amb: h, frozen: L >= SH14.freezeAt, dir: 1};
};
/** Tick `n` (1..20) is at the drop's face at +round(5.4 * (n - 8)) (tick 8 at +0 ... tick 20 at +65). */
export const sh14TickFrame = (n: number) => Math.round(5.4 * (n - SH14.firstTick));
/** Ruler offset in body lengths at the SH14 event clock: the tick index at the face (8 at +0, 20 at the freeze). */
export const sh14TickAtFace = (L: number) => SH14.firstTick + sh14Clock(L).ev * SH14.ticksPerFrame;
/** Glow of tick 20 over the frozen frame: 60 % -> 100 % -> 80 % across +65..+80 (overlay clock, the only thing that moves). */
export const sh14Glow = (L: number) => {
  const [a, b] = SH14.glow, u = lin(a, b, L);
  return L < a ? 0.6 : u < 0.5 ? lerp(0.6, 1, ease(u * 2)) : lerp(1, 0.8, ease((u - 0.5) * 2));
};

// ---- SH16 REWIND: +0..+11 frozen on SH04's +31 frame; +12..+24 reverse play of SH04 +31 -> +17; +25 the replay's contact, forward in slow motion
export const SH16 = {frozenTo: 11, rewind: [12, 24] as const, contact: 25, from: SH04.gone, to: SH04.contact};
/** SH16 clock before the replay (+0..+24): which SH04 frame to show. Event and ambient both run in reverse during the rewind (a tape rewind),
 * and both hold at +31 while frozen. From +25 the clock is SH16's own (`src` = SH16, `ev` = L). */
export const sh16Clock = (L: number): ShotClock => {
  if (L <= SH16.frozenTo) return {src: 'S01-B01-SH04', ev: SH16.from, amb: SH16.from, frozen: true, dir: 1};
  if (L < SH16.contact) {
    const u = lin(SH16.rewind[0], SH16.rewind[1], L), at = lerp(SH16.from, SH16.to, u);
    return {src: 'S01-B01-SH04', ev: at, amb: at, frozen: false, dir: -1};
  }
  return plain('S01-B05-SH01', L);
};
/** D0's replay fall coordinate (sm below the replay contact): `s(n) = 0.16 (n - 25)`, 0 before contact. */
export const sh16Fall = (L: number) => FALL_REPLAY * Math.max(0, L - SH16.contact);
/** SH17 continues the replay fall: `s(n) = 0.16 (n + 90)` sm at SH17-local n (s 14.4 at +0); from +52 the speed ramps out of slow motion (smoothstep of the
 * speed) so that the drop's bottom lands on the puddle on the LAST frame +87 (the cut lands on the splash). The distance is fixed by the world: D0's contact
 * centre is 89.1 sm (22 cm) above the ground, so s(87) is about 87.6 sm. That needs a final speed of about 3.5 sm/f (106 sm/s), twice the brief's "about 50 sm/s"
 * (storyboard ROWS-R2.0 numbers disagree: reported in the W5.2 handoff for Film). */
export const SH17 = {ramp: [52, 87] as const, landS: 87.6, v0: FALL_REPLAY};
const ramp = SH17.ramp[1] - SH17.ramp[0];
const s52 = FALL_REPLAY * (SH17.ramp[0] + 90);
/** Final speed (sm/f) at +87 that lands the drop: integral of the speed ramp = T (v0 + (v1 - v0) / 2). */
export const SH17_V1 = (2 * (SH17.landS - s52)) / ramp - SH17.v0;
export const sh17Fall = (L: number) => {
  if (L <= SH17.ramp[0]) return FALL_REPLAY * (L + 90);
  const n = L - SH17.ramp[0], u = Math.min(1, n / ramp), v0 = SH17.v0, v1 = SH17_V1;
  return s52 + ramp * (v0 * u + (v1 - v0) * (u ** 3 - u ** 4 / 2)) + (n > ramp ? v1 * (n - ramp) : 0);
};

/** Shot-local clocks of any shot (default: both clocks = L). The one entry the plates call. */
export const clockOf = (id: ShotId, L: number): ShotClock =>
  id === 'S01-B04-SH01' ? sh14Clock(L) : id === 'S01-B05-SH01' ? sh16Clock(L) : plain(id, L);
