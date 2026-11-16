import {camOf} from '../../kit/cam-moves';
import type {V3} from '../../kit/space';
import {GLOW_STEPS, glowStep} from '../glow';
import {O2_LEVELS, ORDER_O2, slotX} from '../mats';
import {ease, frac} from '../motion19';
import {makeShot} from '../shot';
import {sheetMove, sine01, type FieldShotDef} from '../stage';

// B04-SH02 · G 1490-1704 (214 f) · the flip and the hold (L10, W-HOLD; EDU-EP19-SHEETS-R3, camera R1 crane). Crane over l 0-150 (easeInOutSine), then
// a 2 % drift-in through the hold (l 150-214). DOG sitting on slot 6 facing +z as in B03-SH07: from this camera a RIGHT PROFILE; the puzzled tilt
// is held (profile: ears lifted and the head raised a touch, `tilt`; the kit's crown `roll` is front-only), a second small tilt at l 150 (G 1640).
// The jumbled O2 row runs from the dog toward the tree, glowing at its sizes. GIRL at GP, P43 peek_around, grinning, from l 72 to the end. The
// A_fade over the last 24 f is the Editor's.
const N = 214;
const M = sheetMove([[0, 0.55, -0.2], [2.4, 0.5, -0.1]], [70, 76], [1.1, 4.0], [0.6, 1.25], {f: 950, hy: 730, pitch: [0, -6]});
const PEEK: V3 = [6.45, 0, -0.05];

// Glow sweep on E1 `stinger_glow-motif-unscrambled_01` (user, 2026-11-16: the mats light in a back-and-forth sweep with the melody). Note onsets
// measured from the placed file (20 ms RMS, 10 ms hop, file start = l 150 / G 1640): jumbled phrase 0.00 0.11 0.23 0.35 0.47 s, rising phrase
// 0.63 0.72 0.81 0.90 0.99 s, chord onset 1.02 s (RMS peak 1.09 s). From the end camera only the lit mats 8-12 (between the dog and the tree)
// are in frame; slots 0-5 are behind the camera or cut by the bottom edge. One mat per note: phrase 1 dog -> tree (8..12), phrase 2 tree -> dog
// (12..8), then every lit mat swells once on the chord and settles to its static O2 size. Size only (VD04 R2 ladder), the one glow opacity.
const E1_AT = 150;
const onset = (s: number) => E1_AT + s * 30;
const SWEEP: [number, number][] = [
  ...[0, 0.11, 0.23, 0.35, 0.47].map((s, i): [number, number] => [onset(s), 8 + i]),
  ...[0.63, 0.72, 0.81, 0.9, 0.99].map((s, i): [number, number] => [onset(s), 12 - i]),
];
const CHORD = onset(1.02);
/** Pulse envelope: rise over `up` f starting 1 f before the onset (never before l 150), ease-out decay over `down` f; 0 outside. */
const pulse = (L: number, at: number, up: number, down: number) => {
  const s = Math.max(E1_AT, at - 1), t = L - s;
  if (t < 0 || t > up + down) return 0;
  return t < up ? ease(t / up) : (1 - (t - up) / down) ** 2;
};
// Swell per slot, in size-ladder units added to the slot's static step (GLOW_STEPS: S1 0.4 .. S5 1), so a small S1 mat reads as well as an S4
// one. The near mats 8-9 sit under the dog's muzzle: the upright core of their halo (an unsquashed circle) greys the black snout above about
// +0.2 (v2-v3 stills, G 1644 and 1671). The far mats 10-12 are small on screen and take more. The chord swell is smaller and the same split.
const NOTE_SWELL: Record<number, number> = {8: 0.18, 9: 0.2, 10: 0.5, 11: 0.55, 12: 0.6};
const CHORD_SWELL: Record<number, number> = {8: 0.1, 9: 0.15};
/** Radius factor k for lit slot i at shot frame L: exactly 1 (static) outside the pulses. */
const sweepK = (L: number, i: number) => {
  let p = 0;
  for (const [at, slot] of SWEEP) if (slot === i) p = Math.max(p, (NOTE_SWELL[i] ?? 0) * pulse(L, at, 2, 9));
  p = Math.max(p, (CHORD_SWELL[i] ?? 0.4) * pulse(L, CHORD, 3, 14));
  return 1 + p / GLOW_STEPS[glowStep(O2_LEVELS[i])];
};

export const B04_SH02: FieldShotDef = {
  id: 'B04-SH02', N,
  cam: (L) => { const c = camOf(M, sine01(Math.min(L, 150) / 150)); return {...c, f: c.f * (1 + 0.02 * frac(L, 150, 214))}; },
  state: (L) => {
    const tilt2 = ease(frac(L, 150, 156)) * (1 - ease(frac(L, 170, 178)));
    return {sun: 'B03', t: L / 30, stack: false, mats: {order: ORDER_O2, prints: 0.6},
      dog: {at: [slotX(6), 0, 0], pose: {view: 'right', state: 'sit', tilt: -6 - 5 * tilt2, earLift: 0.8, wag: 0}},
      ...(L >= 72 ? {girl: {at: PEEK, view: 'front' as const, pose: 'P43' as const, face: 'smug' as const, faceState: {mouth: 'grin' as const}, bias: 0.2, fig: {head: 'front' as const}}} : {})};
  },
  // Slots 6 (under the dog) and 7 (behind it from this camera) are left unlit: the SVG glow layer has no occlusion, so their halos and curls
  // would paint over the black coat (v1 stills, l 0-213).
  glow: (L) => ORDER_O2.flatMap((_, i) => (i === 6 || i === 7 ? [] : [{at: [slotX(i), 0.03, 0] as V3, level: O2_LEVELS[i], r: 0.4, seed: i, k: sweepK(L, i)}])),
};
export const shot = makeShot(B04_SH02);
