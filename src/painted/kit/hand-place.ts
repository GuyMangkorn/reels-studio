// Placing five-finger macro hands in a world-metre set (KIT-POV-HANDS, KIT-MID-HANDS, 18 Nov 2026): orient a hand from "fingers point
// here, back of the hand faces there", put a landmark of the hand on a world point, solve the elbow, paint an upper arm, and the
// hand landmarks props attach to. No Remotion import. Rules: .claude/skills/hand-drawing/SKILL.md.
import {solid} from './draw';
import {gestureHand, type GestureId, type HandSide} from './hand-gestures';
import {inkLine, macroSkeleton, type HandMacro, type MacroTone} from './hands';
import {mixColor, type Painter, type Pt} from './painter';
import {add3, scale3, sub3, type V3} from './space';
import {camPoint, camSpace, type YCam} from './ycam';

export const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const norm3 = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
export const mid3 = (a: V3, b: V3, u = 0.5): V3 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
export const dist3 = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/**
 * HandMacro yaw/pitch/roll (degrees) that point the fingers along `forward` (wrist -> knuckles, world) with the back of the hand
 * toward `back` (world; only its part square to `forward` counts). Side-independent: the same angles serve both hands.
 */
export const orientHand = (forward: V3, back: V3): {yaw: number; pitch: number; roll: number} => {
  const f = norm3(forward), p = Math.asin(Math.max(-1, Math.min(1, f[1]))), y = Math.atan2(f[0], -f[2]);
  const sp = Math.sin(p), cp = Math.cos(p), sy = Math.sin(y), cy = Math.cos(y);
  const up0: V3 = [-sp * sy, cp, sp * cy], sd: V3 = [-cy, 0, -sy];
  const r = Math.atan2(dot3(back, sd), dot3(back, up0));
  const D = 180 / Math.PI;
  return {yaw: y * D, pitch: p * D, roll: r * D};
};

/** World tone of a cast member's hand from the face skin (`CastDef.head.skin`) and the sleeve colour. */
export const toneFromSkin = (skin: string, sleeve = '#2f3542'): MacroTone => ({
  skin, shade: mixColor(skin, '#6a3a20', 0.18), deep: mixColor(skin, '#5a2e18', 0.3), nail: mixColor(skin, '#ffffff', 0.45),
  crease: mixColor(skin, '#4a2a18', 0.4), sleeve, sleeveShade: mixColor(sleeve, '#000000', 0.2),
});

export type Sk = ReturnType<typeof macroSkeleton>;
/** Hand landmarks (world) props and contacts attach to. */
export const LANDMARKS = {
  thumbTip: (sk: Sk) => sk.fingers.thumb.joints[3],
  indexTip: (sk: Sk) => sk.fingers.index.joints[3],
  middleTip: (sk: Sk) => sk.fingers.middle.joints[3],
  /** Index fingertip pad (the palmar side of the tip): what presses a button or a key. */
  indexPad: (sk: Sk) => sub3(sk.fingers.index.joints[3], scale3(sk.fingers.index.dorsal[2], sk.fingers.index.radii[3])),
  /** Between the thumb and index tips: a pinched coin, card or key. */
  pinch: (sk: Sk) => mid3(sk.fingers.thumb.joints[3], sk.fingers.index.joints[3]),
  /** Centre of the palm surface (palm side). */
  palm: (sk: Sk) => sk.at(-0.6, -1.2, 3.8),
  /** Axis centre of a cylinder of radius `r` (metres) held in a power grip (`grip`, `fist`): under the palm, across it. */
  grip: (sk: Sk, r: number) => sk.at(-0.5, -1.1 - (r * 100), 4.8),
  /** Centre of an object of radius `r` resting in an open, palm-up hand (`cupped`, `relaxed`). */
  rest: (sk: Sk, r: number) => sk.at(-0.6, -1.2 - (r * 100), 4.6),
} as const;

/** Move a hand (keeping its pose and orientation) so `landmark` lands on `to` (world). */
export const placeBy = (h: HandMacro, landmark: (sk: Sk) => V3, to: V3): HandMacro => {
  const now = landmark(macroSkeleton(h));
  return {...h, wrist: add3(h.wrist, sub3(to, now))};
};

/** Two-bone elbow (world) for a shoulder and a wrist: bones `l1`, `l2` (m); the elbow bends toward `pole`. An out-of-reach wrist gets a straight arm toward it. */
export const elbowIK = (S: V3, W: V3, pole: V3, l1 = 0.29, l2 = 0.26): V3 => {
  const d0 = dist3(S, W), dir = norm3(sub3(W, S)), d = Math.min(d0, (l1 + l2) * 0.999);
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const pp = norm3(sub3(pole, scale3(dir, dot3(pole, dir))));
  return add3(add3(S, scale3(dir, a)), scale3(pp, h));
};

export type HandSpec = {
  gesture: GestureId; side: HandSide;
  /** Fingers point along `forward`; the back of the hand faces `back` (world directions). */
  forward: V3; back: V3;
  /** Either the wrist (world) or a landmark put on a world point. */
  wrist?: V3; put?: {landmark: (sk: Sk) => V3; at: V3};
  size?: number; tone?: MacroTone; base: number;
};
/** A world hand from a spec (unit 0.01: metres world, centimetre hand). */
export const specHand = (s: HandSpec): HandMacro => {
  const o = orientHand(s.forward, s.back);
  const h: HandMacro = {...gestureHand(s.gesture, {side: s.side, wrist: s.wrist ?? [0, 0, 0], base: s.base, size: s.size ?? 1.05, unit: 0.01, tone: s.tone}), ...o};
  return s.put ? placeBy(h, s.put.landmark, s.put.at) : h;
};

/** A tube between two world points, radius `ra` -> `rb` (m), filled flat in `color` with an ink outline; cut at depth `near` (for arms that reach the lens). */
export const paintTube = (p: Painter, cam: YCam, id: number, a: V3, b: V3, ra: number, rb: number, color: string, near = 0.06) => {
  const da = camSpace(cam, a).d, db = camSpace(cam, b).d;
  if (da < near && db < near) return;
  let A = a, B = b, rA = ra, rB = rb;
  if (da < near) { const u = (near - da) / (db - da); A = mid3(a, b, u); rA = ra + (rb - ra) * u; }
  if (db < near) { const u = (near - db) / (da - db); B = mid3(b, a, u); rB = rb + (ra - rb) * u; }
  const pa = camPoint(cam, A, near * 0.99), pb = camPoint(cam, B, near * 0.99);
  if (!pa || !pb) return;
  const wa = (cam.f * rA) / camSpace(cam, A).d, wb = (cam.f * rB) / camSpace(cam, B).d;
  const dx = pb[0] - pa[0], dy = pb[1] - pa[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, ang = Math.atan2(dy, dx);
  const cap = (c: Pt, w: number, a0: number): Pt[] => Array.from({length: 9}, (_, i) => { const t = a0 + (i / 8) * Math.PI; return [c[0] + Math.cos(t) * w, c[1] + Math.sin(t) * w]; });
  const pts: Pt[] = [...cap(pb, wb, ang - Math.PI / 2), ...cap(pa, wa, ang + Math.PI / 2)];
  void nx; void ny;
  solid(p, id, color, pts, 2, 0.08, 0.08);
  inkLine(p, id, pts, Math.max(1.2, Math.min(3, 0.05 * Math.min(wa, wb))), 0.2, true, mixColor(color, '#1a1410', 0.55));
};

/**
 * Finger direction (and the squared back) that puts the thumb side of a `side` hand along `thumb` with the back of the hand toward `back` (world; both square to
 * the result). For grips on a rod (cup, lever, rim): `thumb` is the rod axis the thumb points along. The handedness lives here, so the
 * thumb lands on the correct edge without mirroring.
 */
export const forwardFor = (side: HandSide, thumb: V3, back: V3): {forward: V3; back: V3} => {
  const A = norm3(thumb), B = norm3(sub3(back, scale3(A, dot3(back, A))));
  return {forward: side === 'right' ? cross3(A, B) : cross3(B, A), back: B};
};
