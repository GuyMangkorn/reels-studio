import type {V3} from '../kit/space';
import type {YCam} from '../kit/ycam';

// EDU-EP16-SHORT palette, marks and camera helper (brief EDU-EP16-BRIEF-R1.1 "Colour and value key", "Set plan - SET-PATH16"; W3 look frames, Film).
// Space P: metres, origin on the path centreline, +x along the path (screen right in the side-on views), +y up, +z toward the near lawn; ground y 0.

export const C = {
  // morning sky and sun (east = -x)
  skyTop: '#9fc3d9', skyHor: '#e9ecdf', sun: '#fff1cf',
  // foliage by season
  leaf: '#7fa84e', leafShade: '#3f6436', leafLit: '#b5cf72', leafSummer: '#4d7a3a',
  autumn1: '#d9772f', autumn2: '#b8452a', autumn3: '#e8b04a', bare: '#5b5048', winterSky: '#c3c8cc',
  // ground
  path: '#c9c4b8', joint: '#9e988c', lawn: '#7aa04e', lawnShade: '#557a3a', lawnFar: '#8fb05c',
  // hall and street furniture
  brick: '#a4553f', brickShade: '#6e3a2e', frame: '#efeae0', glass: '#5d6f7c', slate: '#4b525a', pole: '#6b5a48', wire: '#2a2a2e',
  lamp: '#2f3236', bench: '#8a6a4a', fir: '#2f4a3a', firShade: '#22382c', trunk: '#5e4a3a', trunkShade: '#3f3228',
  // crows
  crow: '#23262f', crowShade: '#15171d', sheen: '#4a5874', rim: '#f0d7a8', bill: '#1a1b20', billHi: '#5b5f6a', eye: '#3a2a1e',
  young: '#2e2c2e', fluff: '#3f3a3a', gape: '#d9545a', youngEye: '#8fa3b8', mouth: '#7a3a44',
  ring: '#f08a24', ringHi: '#ffc27a',
  // masks
  latex: '#e3cf9a', latexHi: '#f6ead0', latexShade: '#b89a62', unibrow: '#3b2a20', nose: '#c8453a', teeth: '#f4efe0', lips: '#a8574a',
  goblin: '#9aa77c', goblinHi: '#c4cfa0', goblinShade: '#6b7a55', pig: '#eaa9a2', pigHi: '#f8d2cc', pigShade: '#c07c78',
  paper: '#f4f1ea', paperShade: '#d8d2c4', smile: '#2b211c', cheek: '#f0a0a0', elastic: '#d8c8a8',
  // props
  cup: '#f2efe8', sleeve: '#9a6a44', lid: '#2b2b2b', tote: '#d8cbb0', toteStripe: '#4f6f6a', scarf: '#8a8d91', scarfShade: '#6c6f73', mustard: '#c8962e',
  // dusk
  duskHor: '#f2a65a', duskMid: '#b06a8a', duskTop: '#4d4a7a', lampGlow: '#ffd59a', duskRim: '#ffcf8a',
  ink: '#2b211c',
} as const;

/** Wire W from PL1 (-18) to PL2 (+12): y 6.2 at the poles, sagging to 5.8 at x -3; z -2.4. */
export const WIRE_Z = -2.4;
export const wireY = (x: number) => 5.8 + 0.4 * ((x + 3) / 15) ** 2;
export const WS = {WS1: -10, WS2: -8.5, WS3: -7, WS4: -5.5, WSH: -4, WS5: -2.5, WS6: -1, WS7: 0.5, WS8: 2} as const;
export const wireAt = (x: number): V3 => [x, wireY(x), WIRE_Z];
export const NEST: V3 = [2.0, 5.6, -3.6];
export const NB: [V3, V3] = [[2.2, 5.5, -3.8], [-0.2, 5.9, -2.9]];
export const WALK_Z = 0.3;

/** `bud`: early spring after the winter (bare limbs, a haze of light-green buds; shot 17). */
export type Season = 'spring' | 'bud' | 'summer' | 'autumn' | 'winter' | 'later' | 'dusk';

const DEG = Math.PI / 180;
/** A yaw camera from a position and a look-at point (the sheet's `pos -> look-at` lines): yaw so the view axis passes the target, pitch up positive. */
export const lookCam = (pos: V3, at: V3, f: number, o: {hy?: number; cx?: number; near?: number} = {}): YCam => {
  const dx = at[0] - pos[0], dy = at[1] - pos[1], dz = at[2] - pos[2];
  return {x: pos[0], y: pos[1], z: pos[2], yaw: Math.atan2(dx, -dz), pitch: Math.atan2(dy, Math.hypot(dx, dz)), f, hy: o.hy ?? 960, cx: o.cx ?? 0, near: o.near};
};
export {DEG};
