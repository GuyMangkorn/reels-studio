// EDU-EP16 SHEET-R1.5b look-frame geometry (Film, 14 Nov 2026): the redesigned 16C/16D cameras, T. rex marks and Keng marks
// in RIV metres (storyboard.md "R1.5b"). Shared by frames.tsx (stills) and probe.mts (screen numbers). Film scratch for look frames,
// not a production module: Editor copies the numbers into the timeline; Boss owns the kit fixes named in the sheet.
import {camMove, camOf} from '../../../../src/painted/kit/cam-moves';
import type {YCam} from '../../../../src/painted/kit/ycam';
import {buildTRex, trexSunSlice, trexWalkPhase, TREX_POSES, TREX_STALK, type TRexPose} from '../../../../src/painted/survival/beast-trex';
import type {BeastPlace, Build} from '../../../../src/painted/survival/beast';
import {riverLightAt, shadeAt} from '../../../../src/painted/survival/river-r3';

export type V3 = [number, number, number];
/** One look frame: shot-local frame `t` of a shot with `len` frames starting at global `g0`. */
export type Look = {id: string; label: string; shot: '16C' | '16D'; t: number};

const sm = (a: number, b: number, t: number) => { const u = Math.min(1, Math.max(0, (t - a) / (b - a))); return u * u * (3 - 2 * u); };
const lin = (a: number, b: number, t: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const mixP = (a: [number, number], b: [number, number], k: number): [number, number] => [mix(a[0], b[0], k), mix(a[1], b[1], k)];

// ---- shot clocks (R1.5b: 16B 26 -> 22 f, 16D 40 -> 44 f; 16A, 16C and the SH16 start unchanged)
export const G0 = {'16A': 1350, '16B': 1390, '16C': 1412, '16D': 1460, '16': 1504} as const;
export const LEN = {'16C': 48, '16D': 44} as const;

// ---- cameras (RIV). 16C: long-lens over-the-shoulder from the near bank, orbit on Keng; 16D: low three-quarter on Keng, the far bank open to the left of B1.
export const CAM16C = camMove([0.6, 0, -0.5], [9.5, 9.0], [8.6, 8.0], 1.45, {f: 2600, hy: 1010, pitch: [0, 0], cx: -280});
export const CAM16D = camMove([0.7, 0, -0.75], [-12, -9], [2.7, 2.5], 0.95, {f: 1300, hy: 730, pitch: [2, 2], cx: 140});

// ---- T. rex marks (R1.5b): it pushes out through FC in 16C, then steps fully onto the open far bank in 16D
export const TX = {
  c0: [-2.7, -13.75] as [number, number],   // 16C +0: inside the fern row (hidden)
  c1: [-1.6, -13.35] as [number, number],   // 16C +26: head and chest out, legs in FC
  d1: [-0.5, -12.25] as [number, number],   // 16D +16: full body on the open bank, in front of FC
  d2: [0.05, -12.6] as [number, number],    // 16D +44: walking on, turning into the forest (downstream-away)
  head16C: 0.33,                            // body heading 16C (rad, + toward the near bank)
  head16D: 0.85,                            // body heading after the step out (3/4 toward the near bank downstream)
  off: -0.45,                               // walk-on heading into the forest (R1.5b; was upstream pi + 0.12)
} as const;
/** Gaze target G1 (R1.5b): the water's edge downstream on the far side; never Keng or the lens. */
/** paintRiver x0 for 16C/16D (R1.5b): moves the near-bank clump off the 16C line of sight and leaves one far tree fern (x 1.4) across the chest, none over the head. */
export const RIVER_X0 = -74;
export const G1: V3 = [9.0, 0, -8.0];

// ---- walk phases from distance (B-R15B-06): the planted foot slides back one stride while the phase advances `duty`, so the body must cover trexWalkDist(phase) m. Both stops land where both feet are down (phase in [0.5, 0.62) or [1, 1.12)).
const dist = (a: [number, number], b: [number, number]) => Math.hypot(b[0] - a[0], b[1] - a[1]);
export const PH = {c0: 0.6 - trexWalkPhase(dist(TX.c0, TX.c1)), c1: 0.6, d1: 0.6 + trexWalkPhase(dist(TX.c1, TX.d1)), d2: 0.6 + trexWalkPhase(dist(TX.c1, TX.d1)) + trexWalkPhase(dist(TX.d1, TX.d2))};
/** the feet hold at `ph` (stride kept, no swing) while the head poses play */
const hold = (ph: number): TRexPose => ({walk: ph, stride: TREX_STALK.stride});
/** body heading as a function of walk phase over 16D (the feet read it so a turning walk keeps them planted) */
const hd16D = (ph: number): number => (ph <= PH.d1 ? mix(TX.head16C, TX.head16D, lin(PH.c1, PH.d1, ph)) : mix(TX.head16D, TX.off, sm(0, 12 / 14, lin(PH.d1, PH.d2, ph))));

export type RexState = {B: Build; place: BeastPlace; pose: TRexPose; vap: number; nostril?: V3};
export type ShotState = {c: YCam; f: number; K?: {at: V3; pose: string; facing: [number, number]; face: string; top: number; level?: number; mouth?: string}; rex?: RexState; part: number; shake: number; partCentre: number};

const rexAt = (at: [number, number], heading: number, pose: TRexPose, L: {amb: string; k: number}, haze: number): RexState => {
  const B = buildTRex(pose);
  return {B, pose, vap: -1, place: {at, heading, amb: '#3f4a44', ambK: Math.max(L.k, 0.42), haze, hazeCol: '#dfe8d4', seed: 71000, sun: [0.55, 0.75, 0.6], glow: trexSunSlice(B)}};
};

/** World state of a shot at shot-local frame `t`. */
export const stateAt = (shot: '16C' | '16D', t: number): ShotState => {
  const f = G0[shot] + t, L = riverLightAt(shadeAt(f));
  if (shot === '16C') {
    const c = camOf(CAM16C, t / LEN['16C']);
    // +6..+26: one step out (walk phase 0 -> 0.5 over 1.2 m), then the sniff stance; head pushes out through the ferns +10..+24
    const k = sm(6, 26, t), at = mixP(TX.c0, TX.c1, k), walking = t < 26;
    const sn = TREX_POSES.sniff(Math.max(0, (t - 0) / LEN['16C']));
    const pose: TRexPose = walking ? {...TREX_POSES.stalk(mix(PH.c0, PH.c1, k)), drop: 2.0, neck: 0, yaw: 0.25 * k} : {...sn, ...hold(PH.c1), yaw: 0.25 + (sn.yaw ?? 0)};
    const rex = rexAt(at, TX.head16C, pose, L, 0.3 * (1 - sm(6, 22, t)));
    const ks = t < 22 ? 0 : sm(28, 36, t);
    return {c, f, part: sm(10, 18, t), shake: t >= 4 && t < 20 ? 0.9 : 0.2, partCentre: -0.4, rex,
      K: {at: [0.6, -0.3, -0.5], pose: ks > 0.5 ? 'P35' : 'P07', facing: [0, -1], face: 'scared', top: mix(1.3, 0.62, ks), level: 0}};
  }
  const c = camOf(CAM16D, t / LEN['16D']);
  // +0..+16 full-body step out of FC onto the bank (front foot plants +14); +16..+22 head low at G1; +22..+28 lift; +26..+34 turn; +30.. walk off
  let at: [number, number], heading: number, pose: TRexPose;
  if (t < 16) { const k = sm(0, 16, t); at = mixP(TX.c1, TX.d1, k); heading = mix(TX.head16C, TX.head16D, k); pose = {...TREX_POSES.stalk(mix(PH.c1, PH.d1, k)), drop: 2.0, neck: 0, yaw: -0.1, hd: hd16D}; }
  else if (t < 30) { at = TX.d1; heading = TX.head16D; const u = lin(24, 30, t); pose = t < 24 ? {...TREX_POSES.sniff(0.25 + 0.5 * lin(16, 24, t)), ...hold(PH.d1), yaw: -0.15} : {...TREX_POSES.turn(u, -0.15, -0.6), ...hold(PH.d1)}; }
  else { const k = lin(30, 44, t); at = mixP(TX.d1, TX.d2, k); heading = mix(TX.head16D, TX.off, sm(30, 42, t)); pose = {...TREX_POSES.stalk(mix(PH.d1, PH.d2, k)), neck: 0.3, drop: 0.8, yaw: -0.3 * (1 - k), hd: hd16D}; }
  const rex = rexAt(at, heading, pose, L, 0.12);
  return {c, f, part: 1, shake: t < 16 ? 0.9 : 0.15, partCentre: -0.4, rex,
    K: {at: [0.7, -0.12, -0.75], pose: 'P35', facing: [0.25, 1], face: 'scared', top: 0.62, level: 0, mouth: t < 32 ? 'clench' : 'pant'}};
};

export const LOOKS: Look[] = [
  {id: 'LF16R15-SH16C-REVEAL', label: 'R1.5b 16C +12: first reveal, head and chest push out of the ferns', shot: '16C', t: 12},
  {id: 'LF16R15-SH16C', label: 'R1.5b 16C +28: first sniff, Keng drops (biggest T. rex)', shot: '16C', t: 28},
  {id: 'LF16R15-SH16C-VAP', label: 'R1.5b 16C +34: vapour mid-puff (Boss check)', shot: '16C', t: 34},
  {id: 'LF16R15-SH16C-K', label: 'R1.5b 16C +40: second sniff, Keng hidden', shot: '16C', t: 40},
  {id: 'LF16R15-SH16D', label: 'R1.5b 16D +14: full-body step onto the bank, Keng behind B1', shot: '16D', t: 14},
  {id: 'LF16R15-SH16D-TURN', label: 'R1.5b 16D +28: head lifts and turns away into the forest', shot: '16D', t: 28},
  {id: 'LF16R15-SH16D-OFF', label: 'R1.5b 16D +40: walks on into the forest, tail sweeps', shot: '16D', t: 40},
];
export const stateOf = (l: Look) => stateAt(l.shot, l.t);
