// Hand macro check specs (EDU-EP09 SP1-SP3): the HAND-CLOSE cameras of the brief, the BOY pose table and the SP3 rig-wrist setups.
// No Remotion import, so tests and measure scripts can use it (the stills are in hands-macro-sheet.tsx).
import {camMove, camOf} from './cam-moves';
import {macroHand, MACRO_TONES, TP_LIFTS, type HandMacro, type HandPoseId, type MacroTone} from './hands';
import type {V3} from './space';
import type {YCam} from './ycam';

const deg = (a: number) => (a * 180) / Math.PI;
const look = (at: V3, yaw: number, r: number, eye: number, f: number, hy: number): YCam =>
  camOf(camMove(at, [yaw, yaw], r, eye, {pitch: [-deg(Math.atan2(eye - at[1], r)), -deg(Math.atan2(eye - at[1], r))], f, hy}), 0);
/** HAND-CLOSE cameras of the EP09 brief (start of each move). */
export const HAND_CAMS: Record<string, YCam> = {
  POV: look([0, 1.5, 1.0], 0, 30, 24, 2300, 640),
  TRY: look([0, 1.5, -1.5], 168, 26, 8, 2000, 760),
  /** From the front below the palm plane (the TP arch is now flatter, so TRY at eye 8 sees the back of the hand): the palm is the first fill. */
  'FRONT-LOW': look([0, 1.5, -1.5], 168, 26, 3, 2000, 760),
  'DIAG-W': look([0.3, 1.5, 12], 0, 40, 58, 2050, 700),
  /** Neutral check: straight top-down (pitch -90), no foreshortening of the fingers. */
  PLAN: look([0.3, 0, 0.5], 0, 0, 40, 3000, 960),
  'DIAG-B': look([-1.2, 1.8, 3], 0, 16, 24, 2000, 640),
};

export const BOY_WRIST: [number, number] = [0.3, 6.5];
export const boy = (pose: HandPoseId, o: Partial<HandMacro> & {lift?: Partial<Record<'thumb' | 'index' | 'little' | 'ring', number>>} = {}): HandMacro =>
  macroHand(pose, {side: -1, base: 1000, tone: MACRO_TONES.boy, plane: 0, at: BOY_WRIST, elbow: [0.6, 3.0, 30], ...o});
const TREMBLE = {finger: 'ring', amp: 0.08, hz: 10} as const;
/** Pose specs (HAND-CLOSE, BOY left hand): id -> hand. */
export const HAND_SPECS: Record<string, () => HandMacro> = {
  flat: () => boy('flat'),
  tp: () => boy('test-fold-middle'),
  'lift-thumb': () => boy('test-fold-middle', {lift: {thumb: TP_LIFTS.thumb}}),
  'lift-index': () => boy('test-fold-middle', {lift: {index: TP_LIFTS.index}}),
  'lift-little': () => boy('test-fold-middle', {lift: {little: TP_LIFTS.little}}),
  'ring-strain': () => boy('ring-strain', {tremble: TREMBLE}),
  'ring-hair': () => boy('test-fold-middle', {lift: {ring: TP_LIFTS['ring-hair']}}),
  'ring-diagram': () => boy('test-fold-middle', {lift: {ring: TP_LIFTS['ring-diagram']}}),
};
export const SP1_CAMS = ['POV', 'TRY'] as const;


// SP3: rig wrist -> macro. Dining metres: HAND-CLOSE (x, y, z) cm -> (-0.14 - x/100, 0.72 + y/100, -0.26 - z/100), a 180 deg turn about y (yaw 180), unit 0.01.
export const dining = (cmx: number, cmy: number, cmz: number): V3 => [-0.14 - cmx / 100, 0.72 + cmy / 100, -0.26 - cmz / 100];
const diningHand = (o: {side: 1 | -1; size: number; at: [number, number]; yaw: number; pose: HandPoseId; tone: MacroTone; base: number; tremble?: HandMacro['tremble']}): HandMacro =>
  ({...macroHand(o.pose, {side: o.side, size: o.size, unit: 0.01, base: o.base, tone: o.tone, plane: 0.72, at: o.at, yaw: o.yaw, tremble: o.tremble}), shadowDir: [-0.14, -0.9, -0.11]});
export const SP3 = {
  B01SH04: {
    cam: camOf(camMove([-0.05, 0.86, -0.42], [-12, -12], 1.3, 1.62, {pitch: [-30, -30], f: 1150, hy: 760}), 0),
    person: 'boy-school' as const, seat: [-0.26, 0, -0.62] as V3, arm: 'lArm' as const,
    hand: () => diningHand({side: -1, size: 1, at: [-0.14 - 0.003, -0.26 - 0.065], yaw: 180, pose: 'test-fold-middle', tone: MACRO_TONES.boy, base: 1000}),
  },
  B02SH02: {
    cam: camOf(camMove([0.12, 0.95, -0.45], [-6, -6], 0.95, 1.02, {pitch: [-6, -6], f: 1150, hy: 620}), 0),
    person: 'man-elder' as const, seat: [0.3, 0, -0.7] as V3, arm: 'rArm' as const,
    hand: () => diningHand({side: 1, size: 1.25, at: [0.16, -0.3 - 0.065 * 1.25], yaw: 180, pose: 'ring-strain', tone: MACRO_TONES.elder, base: 1000, tremble: {finger: 'ring', amp: 0.08 * 0.01, hz: 10}}),
  },
};
