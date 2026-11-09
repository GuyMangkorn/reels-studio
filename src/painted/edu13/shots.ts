import {ell, washAt} from '../kit/draw';
import type {Painter} from '../kit/painter';
import {EXPRESSIONS, type ExpressionId} from '../kit/expressions';
import {clamp01, seg} from '../kit/motions';
import type {FaceState} from '../kit/head';
import type {AnyPoseId} from '../kit/poses';
import type {V3} from '../kit/space';
import {camPoint, type YCam} from '../kit/ycam';
import {FLEA_MM} from './scenes';
import {paintDog, paintMan, paintManMotion} from './cast';
import {blendPose, fleaJoints, paintFlea, POSES, type FleaOpts} from './flea';
import {LR13, paintRoom13, type RoomItem} from './room';
import {CAM_S1, CAM_S12, CAM_S13, CAM_S14, CAM_S15, CAM_S16, CAM_S3, CAM_S8, CAM_S9, camShot, type ShotCam} from './scenes';
import {paintStudio} from './studio';
import {paintBox} from '../edu02/world';

// EDU-EP13-SHORT timed shot content (W5.2 asset groups 1 and 2: group 2 = S01-B01-SH01, B02-SH01, B03-SH03, B05-SH01, B05-SH02; group 1, SHEETS-R2.0): S01-B01-SH03 (the grow), S01-B01-SH05 (V01), S01-B04-SH01 (icon and leg light),
// S01-B04-SH02 (the truth jump). Every function is a pure function of the shot-local frame `l` (L in the sheets), so it seeks. Screen layers (ring marker,
// icons, band, tag, inset) are in shot-layers.tsx and read the cameras and anchors exported here. Room, cast and flea are the locked look modules, unchanged.

export const SHOTS = {
  S01_B01_SH01: {start: 0, len: 27, cam: CAM_S1},
  S01_B02_SH01: {start: 332, len: 93, cam: CAM_S9},
  S01_B03_SH03: {start: 697, len: 128, cam: CAM_S12},
  S01_B05_SH01: {start: 1138, len: 116, cam: CAM_S15},
  S01_B05_SH02: {start: 1254, len: 136, cam: CAM_S16},
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

// ======================= W5.2 asset group 2 =======================
const ease = (u: number) => u * u * (3 - 2 * u);

// ---- S01-B01-SH01 (the room, L01 a): LF01 picture, MAN seated eyes on the dog, phone face-down on his thigh, eyes drift to the window +18..+26
export const paintSH01 = (p: Painter, l: number) => {
  const c = shotCamera('S01_B01_SH01', l), t = l / 30, drift = ease(seg(l, 18, 26));
  const look: [number, number] = [0.6 + 0.2 * drift, 0.2 + 0.55 * drift];
  const cast: RoomItem[] = [
    {at: LR13.dogAt, layer: 'sofa', draw: (q, cc) => paintDog(q, cc, LR13.dogAt, {view: 'left', state: 'lie', lid: 1}, t)},
    {at: LR13.manSeatFeet, layer: 'sofa', draw: (q, cc) => { paintMan(q, cc, {at: LR13.manSeatFeet, view: 'front', pose: 'P31', face: 'neutral', faceState: {look}, t, warm: 0.08}); }},
    {at: LR13.manSeatFeet, layer: 'sofa', draw: (q, cc) => paintBox(q, cc, 9900, {x0: 3.4, x1: 3.5, y0: 0.52, y1: 0.535, z0: 0.62, z1: 0.8}, '#2c3036', {}, {ink: true})},
  ];
  paintRoom13(p, c, {t, cast});
};

// ---- S01-B02-SH01 (strength up, weight up, L03): coral glow on the hind-leg muscle 0 -> 1 from +3 to +92; dial, arrow and "แรง ↑" are screen layers
export const muscleGlowAt = (l: number) => ease(seg(l, 3, 92));
export const paintSH09 = (p: Painter, l: number) => {
  const c = shotCamera('S01_B02_SH01', l), t = l / 30;
  const cast: RoomItem[] = [
    {at: MAN_AT, draw: (q, cc) => { paintMan(q, cc, {at: MAN_AT, view: 'front', pose: 'P01', face: 'neutral', faceState: {look: [0.8, 0.1]}, t, warm: 0.06}); }},
    fleaItem(GIANT, {view: 'right', state: 'rest', muscleGlow: muscleGlowAt(l), t}),
  ];
  paintRoom13(p, c, {t, cast});
};
/** World anchor of the weight dial (above the back) and of the "heavier" arrow (under the belly), R m. */
export const DIAL_AT: V3 = [1.85, 1.28, 0.35];
export const ARROW_AT: V3 = [1.95, 0.3, 0.35];

// ---- S01-B03-SH03 (the spring pad, L09): see-through thorax; squeeze +9..+37, catch +39, hold, release +65 (flea gone +66), pad glow fades in the air to +83
export const SPRING = {squeeze: 9, squeezed: 37, catch: 39, release: 65, gone: 66, glowEnd: 83, icon: 99} as const;
/** Screen point (px) of the pad centre in the see-through rest drawing, from the camera and the rest-pose joints. */
export const padPoint = (c: YCam): [number, number] => {
  const r = fleaJoints(POSES.rest, 0.5).w([-0.04, -0.07]), q = camPoint(c, [0, 0, 0]) ?? [540, 900];
  const u = (camPoint(c, [1, 0, 0]) ?? [q[0] + 1, q[1]])[0] - q[0];
  return [q[0] + r[0] * FLEA_MM * u, q[1] - r[1] * FLEA_MM * u];
};
export const paintSH12 = (p: Painter, l: number) => {
  const c = shotCamera('S01_B03_SH03', l), t = l / 30, S = SPRING;
  paintStudio(p, c, {fibre: true});
  if (l < S.gone) {
    const sq = l < S.squeeze ? 0 : l < S.squeezed ? ease((l - S.squeeze) / (S.squeezed - S.squeeze)) : l < S.release ? 1 : 0;
    paintFlea(p, c, [0, 0, 0], FLEA_MM, {view: 'right', state: 'rest', see: {squeeze: sq, locked: l >= S.catch && l < S.release, u: seg(l, 0, 6)}, t});
  }
  if (l >= S.gone) { // smear streak up from the flea's spot (4 f), then the pad's amber glow fading in the air to +83
    const q = camPoint(c, [0, 0, 0]) ?? [540, 900], u = (camPoint(c, [1, 0, 0]) ?? [q[0] + 1, 0])[0] - q[0], pad = padPoint(c), k = l - S.gone;
    if (k < 4) for (let i = 0; i < 3; i++) washAt(p, 9700 + i, '#6a4a30', 70 * (1 - k / 4), [[q[0] - 14 + i * 3, q[1] - 0.3 * u], [q[0] + 14 - i * 3, q[1] - 0.3 * u], [q[0] + 3, q[1] - (0.8 + k * 0.35 + i * 0.25) * u], [q[0] - 3, q[1] - (0.8 + k * 0.35 + i * 0.25) * u]], 0.3, 0.3);
    const a = 1 - clamp01((l - S.gone) / (S.glowEnd - S.gone)), rise = (l - S.gone) * 1.6;
    if (a > 0.02) {
      washAt(p, 9710, '#ffc65a', 200 * a, ell(pad[0], pad[1] - rise, 130, 70, 24), 0.4, 0.3);
      washAt(p, 9711, '#fff3c8', 230 * a, ell(pad[0], pad[1] - rise, 60, 32, 20), 0.4, 0.3);
    }
  }
};

// ---- S01-B05-SH01 (the real measure, L13): the giant shrinks away about its feet +0..+12; marks at 0.15 / 0.42 m; MAN glances down +54, hands on hips +69
export const MAN15: V3 = [0.95, 0, 0.3];
export const GIANT15: V3 = [1.3, 0, 0.25];
export const shrinkLen = (l: number) => GIANT * (1 - clamp01(l / 12)) ** 1.8;
export const marksAt = (l: number) => [...(l >= 27 ? [{y: 0.15, color: '#ec8f78'}] : []), ...(l >= 51 ? [{y: 0.42, color: '#6fa3d0'}] : [])];
export const paintSH15 = (p: Painter, l: number) => {
  const c = shotCamera('S01_B05_SH01', l), t = l / 30;
  const down = ease(seg(l, 54, 62)) * (1 - ease(seg(l, 66, 70))), smug = seg(l, 69, 75);
  const cast: RoomItem[] = [
    {at: MAN15, draw: (q, cc) => { paintMan(q, cc, {at: MAN15, view: 'front', mix: {a: 'P01', b: 'P09', u: ease(smug)}, face: smug > 0.3 ? 'smug' : 'neutral', faceState: smug > 0.3 ? {look: [0, 0]} : {look: [0.55 * down, -0.75 * down]}, t, warm: 0.06}); }},
    fleaItem(shrinkLen(l), {view: 'right', state: 'rest', t}, GIANT15),
  ];
  paintRoom13(p, c, {t, cast, marks: marksAt(l)});
};

// ---- S01-B05-SH02 (home, the dog sighs, L14 + hold): MAN sits down +0..+54, the dog lifts its head +62, sighs +68..+104, lies back +118
export const SOFA16 = {sitEnd: 54, dogLift: 62, sigh: 68, sighEnd: 104, down: 118} as const;
export const dogLift = (l: number) => ease(seg(l, 62, 72)) * (1 - ease(seg(l, 110, 122)));
export const paintSH16 = (p: Painter, l: number) => {
  const c = shotCamera('S01_B05_SH02', l), t = l / 30, S = SOFA16, d = dogLift(l), sit = ease(seg(l, 0, S.sitEnd));
  const relieved = l < 40;
  const cast: RoomItem[] = [
    {at: LR13.dogAt, layer: 'sofa', draw: (q, cc) => paintDog(q, cc, LR13.dogAt, {view: 'left', state: 'lie', lid: d > 0.15 ? 0.2 : 1, ...(d > 0 ? {lean: d, leanTo: [0.1, 0.34], tilt: 8 * Math.sin(Math.PI * seg(l, S.sigh, S.sighEnd))} : {}), mouth: l >= S.sigh + 2 && l < S.sighEnd - 10 ? 'open' : 'closed'}, t)},
    {at: LR13.manSeatFeet, layer: 'sofa', draw: (q, cc) => { paintMan(q, cc, {at: LR13.manSeatFeet, view: 'front', mix: {a: 'P01', b: 'P31', u: sit}, face: relieved ? 'relieved' : 'neutral', faceState: {look: [0.3, 0.1]}, t, warm: 0.08}); }},
  ];
  paintRoom13(p, c, {t, cast});
};
