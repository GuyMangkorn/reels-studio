// Hand gestures (KIT-HAND-GESTURES, 18 Nov 2026): close-up five-finger hands for verbs (point, pinch, grip, thumbs-up ...) on the
// 3D hand macro of hands.ts. The hand is a posed skeleton with `side` (+1 right, -1 left), so the thumb always sits on the anatomically
// right edge from any camera: pick the gesture, the side and the orientation; never mirror a hand to make the other one.
// Also the thumb checks: `handFacing` (what a camera sees of a macro hand) and `mittenThumbSide` (the `open`/`fist` value of the rig's
// mitten hands). Rules and the check procedure: the hand-drawing skill (.claude/skills/hand-drawing/SKILL.md).
// No Remotion import: tests and scripts use it; the reference sheet is hand-gestures-sheet.tsx.
import {macroSkeleton, MACRO_TONES, type FingerPose, type HandMacro, type LongFingerId, type MacroTone, type ThumbPose} from './hands';
import type {V3} from './space';
import {camPoint, camSpace, orbitYCam, type YCam} from './ycam';

export type HandSide = 'right' | 'left';
export const sideOf = (s: HandSide): 1 | -1 => (s === 'right' ? 1 : -1);

export type HandGesture = {
  /** The verb or count it reads as, English then Thai. */
  verb: string;
  fingers: Record<LongFingerId, FingerPose>;
  thumb: ThumbPose;
  /** Orientation the reference sheet shows it in (degrees, `HandMacro` pitch/roll): default fingers up (pitch 90, roll 0). */
  show?: {pitch: number; roll: number};
  /** Where the thumb tip rests, for a contact gesture (checked by tests/hand-gestures.test.ts). */
  contact?: string;
  note: string;
};

const F = (mcp: number, pip: number, dip: number, abd = 0): FingerPose => ({mcp, pip, dip, abd});
const T = (cmc: number, cmcAbd: number, mcp: number, ip: number): ThumbPose => ({cmc, cmcAbd, mcp, ip});
// mcp + pip + dip stays near 200 deg: more drives the fingertip into the palm (the macro palm is a plate at the knuckle line).
const CURL = {index: F(85, 95, 25), middle: F(88, 95, 25), ring: F(90, 97, 25), little: F(92, 98, 25)} as const;
const STRAIGHT = F(0, 0, 0);

export type GestureId =
  | 'relaxed' | 'open-spread' | 'stop' | 'point' | 'fist' | 'thumbs-up' | 'pinch' | 'ok'
  | 'peace' | 'three' | 'four' | 'grip' | 'hold-pen' | 'cupped' | 'claw' | 'hold-phone';

// Thumb values marked "solved" come from scripts/painted-kit/solve-thumbs.ts (thumb tip placed on its contact point); the rest are hand-set.
export const HAND_GESTURES: Record<GestureId, HandGesture> = {
  'hold-phone': {
    verb: 'hold a phone in one hand (ถือมือถือมือเดียว)',
    fingers: {index: F(0, 90, 40), middle: F(0, 90, 40), ring: F(0, 90, 40), little: F(10, 80, 30)},
    thumb: T(0, 80, 15, 0),
    note: 'one-hand phone grip (grip-area study, Choi et al.): fingers flat on the back, bent at the middle joint round the far edge; the thumb rests along the near edge (the macro thumb cannot reach across the screen); little finger shelves the bottom edge. Solved for the 7.2 cm phone at hand size 1.45 (pov-hands PHONE_HAND)',
  },
  relaxed: {
    verb: 'rest, hang (มือปล่อยสบาย)',
    fingers: {index: F(12, 18, 8), middle: F(18, 24, 10), ring: F(24, 30, 12), little: F(30, 36, 14)},
    thumb: T(10, 28, 10, 10),
    note: 'natural rest: fingers curl a little more from index to little (the cascade), thumb loose beside the index',
  },
  'open-spread': {
    verb: 'wave, high-five, "five" (โบกมือ, ห้า)',
    fingers: {index: F(0, 0, 0, 8), middle: STRAIGHT, ring: F(0, 0, 0, 6), little: F(0, 0, 0, 10)},
    thumb: T(0, 62, 0, 0),
    note: 'all five straight and spread, thumb well out from the palm',
  },
  stop: {
    verb: 'stop, push, salute, swear (หยุด, ผลัก, ยกมือ)',
    fingers: {index: F(0, 0, 0, -4), middle: STRAIGHT, ring: F(0, 0, 0, -4), little: F(0, 0, 0, -8)},
    thumb: T(0, 14, 0, 0),
    note: 'flat hand, fingers closed together, thumb alongside the index',
  },
  point: {
    verb: 'point, press a button, "one" (ชี้, กดปุ่ม, หนึ่ง)',
    fingers: {...CURL, index: STRAIGHT},
    thumb: T(2, -23, 48, 43), // solved
    contact: 'middle finger, middle phalanx',
    note: 'index straight, the other three curled, thumb tip laid across the curled middle finger',
  },
  fist: {
    verb: 'fist, knock, punch, hold tight (กำมือ, เคาะ, ต่อย)',
    fingers: CURL,
    thumb: T(0, -11, 50, 47), // solved
    contact: 'index and middle fingers, middle phalanges',
    note: 'all four curled, thumb across the middle phalanges of index and middle, never tucked inside the fingers',
  },
  'thumbs-up': {
    verb: 'thumbs up, like, OK (ยกนิ้วโป้ง, เยี่ยม)',
    fingers: CURL,
    thumb: T(0, 80, 0, 0),
    show: {pitch: 0, roll: -90},
    note: 'fist with the thumb straight; shown with the fingers forward and the thumb straight up (roll -90 on a right hand, +90 on a left one: `gestureHand` mirrors roll by side)',
  },
  pinch: {
    verb: 'pinch, pick up something small (หยิบ, จีบ)',
    fingers: {index: F(52, 58, 24), middle: F(36, 44, 20), ring: F(40, 48, 22), little: F(44, 50, 24)},
    thumb: T(19, 2, 40, 53), // solved
    contact: 'index fingertip pad',
    note: 'thumb pad meets the index pad; the other fingers follow loosely',
  },
  ok: {
    verb: 'OK sign, "perfect" (โอเค)',
    fingers: {index: F(52, 62, 30), middle: F(4, 4, 2, -2), ring: F(6, 4, 2, 4), little: F(8, 4, 2, 8)},
    thumb: T(10, 2, 50, 60), // solved
    contact: 'index fingertip pad',
    note: 'thumb and index tips touch in a round ring, the other three straight and fanned',
  },
  peace: {
    verb: 'peace, victory, "two" (ชูสองนิ้ว, สอง)',
    fingers: {index: F(0, 0, 0, 9), middle: F(0, 0, 0, -9), ring: CURL.ring, little: CURL.little},
    thumb: T(1, -44, 39, 40), // solved
    contact: 'ring finger, middle phalanx',
    note: 'index and middle straight in a V, ring and little curled under the thumb',
  },
  three: {
    verb: '"three" (สาม)',
    fingers: {index: F(0, 0, 0, 6), middle: STRAIGHT, ring: F(0, 0, 0, 6), little: CURL.little},
    thumb: T(10, -55, 20, 12), // solved
    contact: 'little finger, middle phalanx',
    note: 'index, middle and ring up, little curled under the thumb',
  },
  four: {
    verb: '"four" (สี่)',
    fingers: {index: F(0, 0, 0, 5), middle: STRAIGHT, ring: F(0, 0, 0, 5), little: F(0, 0, 0, 8)},
    thumb: T(-20, -43, 44, 69), // solved
    contact: 'palm, under the ring knuckle',
    note: 'four fingers up, thumb folded across the palm',
  },
  grip: {
    verb: 'hold a cup, a handle, a bottle (จับ, ถือแก้ว)',
    fingers: {index: F(48, 62, 30), middle: F(52, 66, 32), ring: F(56, 70, 34), little: F(60, 72, 36)},
    thumb: T(34, 46, 16, 12),
    note: 'fingers wrapped round a 4-5 cm cylinder, thumb on the far side of it; put the prop inside the curl',
  },
  'hold-pen': {
    verb: 'write, hold a pen or chopstick (เขียน, ถือปากกา)',
    fingers: {index: F(58, 44, 16), middle: F(60, 56, 24), ring: F(70, 80, 30), little: F(76, 84, 30)},
    thumb: T(50, 16, 9, -3), // solved
    contact: 'index distal phalanx, side',
    note: 'tripod: thumb pad on the side of the index tip, the pen rests on the middle finger; ring and little tuck under',
  },
  cupped: {
    verb: 'scoop, offer, catch water (กอบ, รับ, ยื่น)',
    fingers: {index: F(18, 24, 10, -4), middle: F(18, 24, 10), ring: F(20, 24, 10, -4), little: F(22, 24, 10, -8)},
    thumb: T(16, 18, 10, 6),
    show: {pitch: 0, roll: 180},
    note: 'fingers closed and cupped, palm up (shown palm up: roll 180)',
  },
  claw: {
    verb: 'grab, scare, scratch (ตะครุบ, ขู่)',
    fingers: {index: F(22, 58, 46, 8), middle: F(22, 60, 48), ring: F(24, 60, 48, 6), little: F(26, 60, 48, 10)},
    thumb: T(18, 54, 18, 36),
    note: 'every finger bent at the middle joints and spread, thumb out and bent',
  },
};
export const GESTURE_IDS = Object.keys(HAND_GESTURES) as GestureId[];

/**
 * A `HandMacro` for a gesture. `wrist` is the wrist centre (world units), `pitch`/`roll`/`yaw` the orientation in degrees
 * (default: the gesture's `show`, fingers up). Orientation (see hands.ts): roll turns about the finger axis, then pitch tips the fingers
 * up (pitch 90 = fingers up, back of the hand toward +z), then yaw turns about world y.
 */
export const gestureHand = (id: GestureId, o: {side: HandSide; wrist: V3; base: number; size?: number; unit?: number; tone?: MacroTone; yaw?: number; pitch?: number; roll?: number} & Partial<Pick<HandMacro, 'elbow' | 'sleeve' | 'plane' | 'shadowDir' | 'strain' | 'crisp' | 'look' | 'skinAlpha'>>): HandMacro => {
  const g = HAND_GESTURES[id], show = g.show ?? {pitch: 90, roll: 0};
  const {side, yaw, pitch, roll, tone, ...rest} = o;
  return {
    ...rest, side: sideOf(side), tone: tone ?? MACRO_TONES.generic,
    yaw: yaw ?? 0, pitch: pitch ?? show.pitch, roll: (roll ?? show.roll) * sideOf(side),
    fingers: g.fingers, thumb: g.thumb,
  };
};

export type HandFacing = {
  /** Which face of the hand the camera sees: the palm, the back, or the edge (within 25 deg of side-on). */
  shows: 'palm' | 'back' | 'edge';
  /** Screen side of the thumb edge of the hand: the side of the knuckle line (index knuckle vs little knuckle) the index end is on. Fingers
   *  roughly horizontal put the thumb above or below the hand: then 'up' or 'down'. */
  thumbOnScreen: 'left' | 'right' | 'up' | 'down';
};
/** What a camera sees of a macro hand: the face toward the lens (judged along the line to the lens, so wide POV lenses are right too) and the
 *  screen side the thumb edge is on. Use it to check a shot before painting. */
export const handFacing = (cam: YCam, h: HandMacro): HandFacing => {
  const sk = macroSkeleton(h), c = sk.palmCentre, to = [cam.x - c[0], cam.y - c[1], cam.z - c[2]], l = Math.hypot(to[0], to[1], to[2]) || 1;
  const toward = (sk.normal[0] * to[0] + sk.normal[1] * to[1] + sk.normal[2] * to[2]) / l;
  const shows = Math.abs(toward) < Math.sin((25 * Math.PI) / 180) ? 'edge' : toward > 0 ? 'back' : 'palm';
  const a = camPoint(cam, sk.fingers.index.joints[0]), b = camPoint(cam, sk.fingers.little.joints[0]);
  const dx = a && b ? a[0] - b[0] : 0, dy = a && b ? a[1] - b[1] : 0;
  return {shows, thumbOnScreen: Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : dy < 0 ? 'up' : 'down'};
};

/**
 * The thumb side for the rig's mitten hands (`Arm.open` / `Arm.fist` in cast.ts, `openHandParts` / `fistParts` in draw.ts): +1 puts the thumb on
 * the clockwise side of the wrist -> fingers direction on screen. It depends only on which hand it is and which face shows, never on the angle:
 * a right hand showing its palm is +1, showing its back -1; a left hand the reverse. A fist shows its back (knuckles) unless the shot turns the palm side
 * (curled fingers) to the camera. If the figure is drawn mirrored, decide `shows` in the picture as painted.
 */
export const mittenThumbSide = (side: HandSide, shows: 'palm' | 'back'): 1 | -1 => (side === 'right') === (shows === 'palm') ? 1 : -1;

/** A camera `dist` from `target` along the world direction `dir` (target -> camera), aimed at it: the target lands at picture (540 + cx, hy). */
export const viewCam = (target: V3, dir: V3, dist: number, f: number, hy: number, cx = 0): YCam => {
  const l = Math.hypot(dir[0], dir[1], dir[2]) || 1, d: V3 = [dir[0] / l, dir[1] / l, dir[2] / l];
  const el = Math.asin(Math.max(-1, Math.min(1, d[1]))), flat = Math.hypot(d[0], d[2]);
  const az = flat < 1e-6 ? 0 : Math.atan2(d[0], d[2]);
  return {...orbitYCam(target, dist * Math.cos(el), az, target[1] + dist * Math.sin(el), f, hy), pitch: -el, cx};
};

export type GestureView = 'palm' | 'back' | 'thumb-edge' | 'back-3q' | 'palm-3q';
/** Direction (hand centre -> camera) of a named view of a posed hand: palm/back along the hand normal, thumb-edge from the thumb side, 3q between. */
export const gestureViewDir = (h: HandMacro, view: GestureView): V3 => {
  const sk = macroSkeleton(h), n = sk.normal, t = sk.toThumb, mix = (a: number, b: number): V3 => [n[0] * a + t[0] * b, n[1] * a + t[1] * b, n[2] * a + t[2] * b];
  return {palm: mix(-1, 0), back: mix(1, 0), 'thumb-edge': mix(0, 1), 'back-3q': mix(0.75, 0.66), 'palm-3q': mix(-0.75, 0.66)}[view];
};
/** Centre of the posed hand (mean of the joints, world units): aim reference cameras here. */
export const handCentre = (h: HandMacro): V3 => {
  const sk = macroSkeleton(h), pts = Object.values(sk.fingers).flatMap((c) => c.joints).concat([h.wrist]);
  const s = pts.reduce<V3>((a, p) => [a[0] + p[0], a[1] + p[1], a[2] + p[2]], [0, 0, 0]);
  return [s[0] / pts.length, s[1] / pts.length, s[2] / pts.length];
};
