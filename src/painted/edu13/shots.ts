import type {Painter} from '../kit/painter';
import {EXPRESSIONS, type ExpressionId} from '../kit/expressions';
import {clamp01, seg} from '../kit/motions';
import type {FaceState} from '../kit/head';
import type {AnyPoseId} from '../kit/poses';
import type {V3} from '../kit/space';
import {camPoint, type YCam} from '../kit/ycam';
import {paintMan, paintManMotion} from './cast';
import {blendPose, fleaJoints, paintFlea, POSES, type FleaOpts} from './flea';
import {LR13, paintRoom13, type RoomItem} from './room';
import {CAM_S13, CAM_S14, CAM_S3, CAM_S8, camShot, type ShotCam} from './scenes';

// EDU-EP13-SHORT timed shot content (W5.2 asset group 1, SHEETS-R2.0): S01-B01-SH03 (the grow), S01-B01-SH05 (V01), S01-B04-SH01 (icon and leg light),
// S01-B04-SH02 (the truth jump). Every function is a pure function of the shot-local frame `l` (L in the sheets), so it seeks. Screen layers (ring marker,
// icons, band, tag, inset) are in shot-layers.tsx and read the cameras and anchors exported here. Room, cast and flea are the locked look modules, unchanged.

export const SHOTS = {
  S01_B01_SH03: {start: 76, len: 33, cam: CAM_S3},
  S01_B01_SH05: {start: 278, len: 54, cam: CAM_S8},
  S01_B04_SH01: {start: 825, len: 187, cam: CAM_S13},
  S01_B04_SH02: {start: 1012, len: 126, cam: CAM_S14},
} as const;
export type ShotId = keyof typeof SHOTS;
/** The shot's camera at local frame `l`. */
export const shotCamera = (id: ShotId, l: number): YCam => camShot(SHOTS[id].cam as ShotCam, l, SHOTS[id].len);

const GIANT = 1.8;
const sunTint = {to: '#ffe2a0', u: 0.08};
const GIANT_AT = LR13.giantMark, MAN_AT = LR13.manMark;
/** World anchor of the slingshot icon (shots 13-14): above the giant's back (R m). */
export const ICON_AT: V3 = [1.7, 1.25, 0.35];

const faceOf = (id: ExpressionId, extra: Partial<FaceState> = {}): Partial<FaceState> => ({...EXPRESSIONS[id], ...extra});
/** A flea drawn only when it is at least a pixel or two long (the grow starts at 2 mm). */
const fleaItem = (len: number, opts: FleaOpts, at: V3 = GIANT_AT): RoomItem => ({at, draw: (q, cc) => { if ((cc.f / Math.max(0.3, Math.hypot(at[0] - cc.x, at[2] - cc.z))) * len > 1.2) paintFlea(q, cc, at, len, {tint: sunTint, ...opts}); }});

// ---- S01-B01-SH03 (the grow, L01 c): ring marker is a screen layer; MAN P02 thinking, eyes up-left, unaware
/** Grow factor k(n) = 900^((n - 4) / 22) for n in [+4, +26]; the giant length in m (2 mm at +4, 1.80 m at +26). */
export const growLen = (l: number) => (GIANT / 900) * 900 ** clamp01((l - 4) / 22);
export const paintSH03 = (p: Painter, l: number) => {
  const c = shotCamera('S01_B01_SH03', l), t = l / 30;
  const cast: RoomItem[] = [
    {at: MAN_AT, draw: (q, cc) => { paintMan(q, cc, {at: MAN_AT, view: 'front', pose: 'P02', face: 'neutral', faceState: {look: [-0.6, 0.5]}, t, warm: 0.06}); }},
    fleaItem(growLen(l), {view: 'right', state: 'rest', t, pitchAdd: 9 * seg(l, 28, 33)}),
  ];
  paintRoom13(p, c, {t, cast});
};

// ---- S01-B01-SH05 ("เฮ้ย", V01): MAN turns, gasps, then his eyes drop to the folded near hind leg
export const paintSH05 = (p: Painter, l: number) => {
  const c = shotCamera('S01_B01_SH05', l), t = l / 30;
  const talk = l >= 4 && l <= 46 ? 0.25 + 0.5 * Math.abs(Math.sin(l * 1.7)) : 0;
  const drop = seg(l, 36, 44);
  const face = faceOf(drop > 0.5 ? 'neutral' : 'shock', {look: drop > 0 ? [0.55 * drop, -0.7 * drop] : [0.9, 0], ...(talk > 0 && drop < 0.5 ? {mouth: 'talk', open: talk} : {})});
  const front = l >= 10 && l < 22;
  const cast: RoomItem[] = [
    {at: MAN_AT, draw: (q, cc) => {
      if (l < 6) paintManMotion(q, cc, {at: MAN_AT, motion: 'turn-head-right', mt: 0.6 * (l / 6), face: 'neutral', t, warm: 0.06});
      else paintManMotion(q, cc, {at: MAN_AT, motion: 'gasp-recoil', mt: ((l - 6) / 30) * 2, faceState: face, patch: {head: 'right', ...(drop > 0 ? {nod: [0, -0.1 - 0.12 * drop] as [number, number]} : {})}, t, warm: 0.06});
    }},
    fleaItem(GIANT, {view: front ? 'front' : 'right', state: 'rest', t}),
  ];
  paintRoom13(p, c, {t, cast});
};

// ---- S01-B04-SH01 (icon + leg light, L15/L16)
/** N21 leg-light state at local frame l: travel +112..+130, even glow to +160, out by +172. */
export const legLightAt = (l: number): {u: number; a: number} | undefined => {
  if (l < 112) return undefined;
  const a = l < 130 ? 1 : l < 160 ? 0.45 : 0.45 * (1 - seg(l, 160, 172));
  return a > 0.01 ? {u: clamp01((l - 112) / 18), a} : undefined;
};
export const paintSH13 = (p: Painter, l: number) => {
  const c = shotCamera('S01_B04_SH01', l), t = l / 30;
  const glance = l >= 30 && l < 112 ? [0.8, 0.1] : l >= 112 && l < 159 ? [0.5, -0.55] : l >= 159 && l < 165 ? [0, 0] : l >= 165 && l < 172 ? [0.5, -0.55] : l >= 172 ? [0.3, -0.3] : [0, 0];
  const settle = seg(l, 177, 187);
  const tilt = 9 * (seg(l, 9, 17) - seg(l, 86, 94));
  const cast: RoomItem[] = [
    {at: MAN_AT, draw: (q, cc) => { paintMan(q, cc, {at: MAN_AT, view: 'front', pose: 'P01', face: 'neutral', faceState: {look: [glance[0], glance[1]]}, fig: {crouch: 0.06 * settle}, t, warm: 0.06}); }},
    fleaItem(GIANT, {view: 'right', state: 'rest', ...(settle > 0 ? {to: 'fold' as const, blend: 0.3 * settle} : {}), pitchAdd: tilt, legLight: legLightAt(l), t}),
  ];
  paintRoom13(p, c, {t, cast});
};

// ---- S01-B04-SH02 (the truth shot, V02, L12): matched crouch, take-off +8, apex +17, freeze to +47, landing +56
export const JUMP = {crouchEnd: 8, takeoff: 8, leave: 10, apex: 17, resume: 47, land: 56, manApex: 0.42, giantApex: 0.36} as const;
/** Clearance (m) of the jumper at local frame l for apex height `h`: rises +10..+17, frozen to +47, falls to +56. */
export const jumpHeight = (l: number, h: number) => {
  if (l < JUMP.leave || l >= JUMP.land) return 0;
  if (l < JUMP.apex) { const s = (l - JUMP.leave) / (JUMP.apex - JUMP.leave); return h * (1 - (1 - s) * (1 - s)); }
  if (l < JUMP.resume) return h;
  const s = (l - JUMP.resume) / (JUMP.land - JUMP.resume);
  return h * (1 - s * s);
};
/** Body-centre height (bl) for a blended airborne pose so that its lowest toe clears the floor by `clearance` m (the F5 `apexAir` generalised). */
const airFor = (a: keyof typeof POSES, b: keyof typeof POSES, k: number, clearance: number) => {
  const pose = {...blendPose(POSES[a], POSES[b], k), grounded: false}, j = fleaJoints(pose, 0);
  const lowest = Math.min(...[pose.hind.t, pose.mid.t, pose.fore.t].map((q) => j.w(q)[1]));
  return clearance / GIANT - lowest;
};
/** The giant's pose track in the truth shot. */
export const giantTruthOpts = (l: number): FleaOpts => {
  const h = jumpHeight(l, JUMP.giantApex);
  if (l < 8) return {view: 'right', state: 'rest', to: 'fold', blend: seg(l, 0, 8)};
  if (l < JUMP.leave) return {view: 'right', state: 'fold', to: 'extend', blend: (l - 8) / 2};
  if (l < JUMP.apex) { const k = (l - JUMP.leave) / (JUMP.apex - JUMP.leave); return {view: 'right', state: 'extend', to: 'apex', blend: k, airborne: true, air: airFor('extend', 'apex', k, h), shadow: false}; }
  if (l < JUMP.resume) return {view: 'right', state: 'apex', air: airFor('apex', 'apex', 0, h), shadow: false};
  if (l < JUMP.land) { const k = (l - JUMP.resume) / (JUMP.land - JUMP.resume); return {view: 'right', state: 'apex', to: 'land', blend: k, airborne: true, air: airFor('apex', 'land', k, h), shadow: false}; }
  return {view: 'right', state: 'land', to: 'rest', blend: seg(l, JUMP.land, JUMP.land + 12)};
};
/** MAN's standing jump (N5 stand-in): crouch from P35, take-off arms up (P08), slight tuck, knees-bent landing. */
export const manJumpOpts = (l: number): {mix: {a: AnyPoseId; b: AnyPoseId; u: number}; crouch?: number; lift: number} => {
  const lift = jumpHeight(l, JUMP.manApex);
  if (l < 8) return {mix: {a: 'P01', b: 'P35', u: seg(l, 0, 8)}, lift};
  if (l < JUMP.leave) return {mix: {a: 'P35', b: 'P08', u: seg(l, 8, 10)}, lift};
  if (l < JUMP.land) { const u = l < JUMP.apex ? 0.5 * seg(l, 10, 17) : l < JUMP.resume ? 0.5 : 0.5 + 0.3 * seg(l, 47, 56); return {mix: {a: 'P08', b: 'P01', u}, crouch: 0.25, lift}; }
  return {mix: {a: 'P01', b: 'P35', u: 0.45 * (1 - seg(l, JUMP.land, JUMP.land + 10))}, lift};
};
/** The grey icon's world anchor at local frame l: it rides the giant's back. */
export const iconAt14 = (l: number): V3 => [ICON_AT[0], ICON_AT[1] + jumpHeight(l, JUMP.giantApex), ICON_AT[2]];
export const paintSH14 = (p: Painter, l: number) => {
  const c = shotCamera('S01_B04_SH02', l), t = l / 30, m = manJumpOpts(l);
  const v02 = l >= 8 && l <= 20 ? {mouth: 'talk' as const, open: 0.3 + 0.5 * Math.abs(Math.sin(l * 1.9))} : {};
  const cast: RoomItem[] = [
    {at: MAN_AT, draw: (q, cc) => { paintMan(q, cc, {at: MAN_AT, view: 'front', mix: m.mix, face: 'neutral', faceState: {...v02, ...(l >= 100 && l < 112 ? {look: [0.7, 0] as [number, number]} : {})}, fig: m.crouch ? {crouch: m.crouch} : undefined, lift: m.lift, t, warm: 0.06}); }},
    fleaItem(GIANT, {...giantTruthOpts(l), t}),
  ];
  paintRoom13(p, c, {t, cast});
};

/** Anchors for QA: feet rows, head rows and the icon's picture point at local frame l. */
export const anchorsAt = (id: ShotId, l: number) => {
  const c = shotCamera(id, l);
  return {
    manFeet: camPoint(c, MAN_AT), manHead: camPoint(c, [MAN_AT[0], 1.7, MAN_AT[2]]), giantFeet: camPoint(c, GIANT_AT),
    icon: camPoint(c, id === 'S01_B04_SH02' ? iconAt14(l) : ICON_AT),
  };
};
