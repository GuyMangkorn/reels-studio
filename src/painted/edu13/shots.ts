import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {tintPainter} from '../kit/painter';
import type {Painter, Pt} from '../kit/painter';
import {EXPRESSIONS, type ExpressionId} from '../kit/expressions';
import {clamp01, seg} from '../kit/motions';
import type {FaceState} from '../kit/head';
import type {AnyPoseId} from '../kit/poses';
import type {V3} from '../kit/space';
import type {FigAnchors} from '../kit/cast';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {arcPoint, camS2, CAM_S10, CAM_S11, CAM_S4, CAM_S5, CAM_S6, CAM_S7, CAM_TR_SKY, FLEA_MM, SKY_APEX, SKY_SUN_R} from './scenes';
import {paintSoi, SOI} from './soi';
import {duskSky, horizonRow, paintSkyline, TRAILER_GRADE, towerRim, trailerPainter} from './trailer';
import {paintDog, paintMan, paintManMotion} from './cast';
import {blendPose, fleaJoints, paintFlea, POSES, type FleaOpts} from './flea';
import {LR13, paintRoom13, type RoomItem} from './room';
import {CAM_S1, CAM_S12, CAM_S13, CAM_S14, CAM_S15, CAM_S16, CAM_S3, CAM_S8, CAM_S9, camShot, type ShotCam} from './scenes';
import {paintStudio} from './studio';
import {paintBox, qy, qz, wFill, wInk, wWash} from '../edu02/world';

// EDU-EP13-SHORT timed shot content (W5.2 asset groups 1 and 2: group 2 = S01-B01-SH01, B02-SH01, B03-SH03, B05-SH01, B05-SH02; group 1, SHEETS-R2.0): S01-B01-SH03 (the grow), S01-B01-SH05 (V01), S01-B04-SH01 (icon and leg light),
// S01-B04-SH02 (the truth jump). Every function is a pure function of the shot-local frame `l` (L in the sheets), so it seeks. Screen layers (ring marker,
// icons, band, tag, inset) are in shot-layers.tsx and read the cameras and anchors exported here. Room, cast and flea are the locked look modules, unchanged.

export const SHOTS = {
  S01_B01_SH02: {start: 44, len: 52, cam: (l: number) => camS2(l, eye02(l))},
  S01_B01_SH04: {start: 129, len: 23, cam: CAM_S4},
  S01_B01_SH04B: {start: 152, len: 30, cam: CAM_S5},
  S01_B01_SH04C: {start: 182, len: 46, cam: CAM_S6},
  S01_B01_SH04D: {start: 228, len: 89, cam: CAM_S7},
  S01_B02_SH03: {start: 478, len: 213, cam: CAM_S10},
  S01_B03_SH01: {start: 691, len: 94, cam: CAM_S11},
  S01_B01_SH01: {start: 0, len: 44, cam: CAM_S1},
  S01_B02_SH01: {start: 380, len: 98, cam: CAM_S9},
  S01_B03_SH03: {start: 785, len: 132, cam: CAM_S12},
  S01_B05_SH01: {start: 1279, len: 124, cam: CAM_S15},
  S01_B05_SH02: {start: 1403, len: 139, cam: CAM_S16},
  S01_B01_SH03: {start: 96, len: 33, cam: CAM_S3},
  S01_B01_SH05: {start: 317, len: 63, cam: CAM_S8},
  S01_B04_SH01: {start: 917, len: 218, cam: CAM_S13},
  S01_B04_SH02: {start: 1135, len: 144, cam: CAM_S14},
} as const;
export type ShotId = keyof typeof SHOTS;
/** The shot's camera at local frame `l`. */
export const shotCamera = (id: ShotId, l: number): YCam => { const d = SHOTS[id]; return typeof d.cam === 'function' ? d.cam(l) : camShot(d.cam as ShotCam, l, d.len); };

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
  const blink = l >= 54 && l < 58 ? (l === 54 || l === 57 ? 'half' : 'shut') as 'half' | 'shut' : undefined; // R2.1 SD07: slow blink +54..+57
  const twitch = l >= 48 && l <= 52 ? Math.sin(Math.PI * (l - 48) / 4) : 0; // R2.1 SD07: giant antenna twitch +48..+52
  const face = faceOf(drop > 0.5 ? 'neutral' : 'shock', {look: drop > 0 ? [0.55 * drop, -0.7 * drop] : [0.9, 0], ...(talk > 0 && drop < 0.5 ? {mouth: 'talk', open: talk} : {}), ...(blink ? {eyes: blink} : {})});
  const front = l >= 10 && l < 22;
  const cast: RoomItem[] = [
    {at: MAN_AT, draw: (q, cc) => {
      if (l < 6) paintManMotion(q, cc, {at: MAN_AT, motion: 'turn-head-right', mt: 0.6 * (l / 6), face: 'neutral', t, warm: 0.06});
      else paintManMotion(q, cc, {at: MAN_AT, motion: 'gasp-recoil', mt: ((l - 6) / 30) * 2, faceState: face, patch: {head: 'right', ...(drop > 0 ? {nod: [0, -0.1 - 0.12 * drop] as [number, number]} : {})}, t, warm: 0.06});
    }},
    fleaItem(GIANT, {view: front ? 'front' : 'right', state: 'rest', ...(twitch > 0 && !front ? {antenna: twitch} : {}), t}),
  ];
  paintRoom13(p, c, {t, cast});
};

// ---- S01-B04-SH01 (icon + leg light, L15/L16)
/** N21 leg-light state at local frame l (R2.1): travel +121..+139, even glow to +169, out by +181. */
export const legLightAt = (l: number): {u: number; a: number} | undefined => {
  if (l < 121) return undefined;
  const a = l < 139 ? 1 : l < 169 ? 0.45 : 0.45 * (1 - seg(l, 169, 181));
  return a > 0.01 ? {u: clamp01((l - 121) / 18), a} : undefined;
};
export const paintSH13 = (p: Painter, l: number) => {
  const c = shotCamera('S01_B04_SH01', l), t = l / 30;
  // R2.1: leg light +121..+139; MAN's eyes to the camera +168..+181; settle +208..+218; head tilt +8..+16, levels +90..+98
  const glance = l >= 30 && l < 121 ? [0.8, 0.1] : l >= 121 && l < 168 ? [0.5, -0.55] : l >= 168 && l < 174 ? [0, 0] : l >= 174 && l < 181 ? [0.5, -0.55] : l >= 181 ? [0.3, -0.3] : [0, 0];
  const settle = seg(l, 208, 218);
  const tilt = 9 * (seg(l, 8, 16) - seg(l, 90, 98));
  const cast: RoomItem[] = [
    {at: MAN_AT, draw: (q, cc) => { paintMan(q, cc, {at: MAN_AT, view: 'front', pose: 'P01', face: 'neutral', faceState: {look: [glance[0], glance[1]]}, fig: {crouch: 0.06 * settle}, t, warm: 0.06}); }},
    fleaItem(GIANT, {view: 'right', state: 'rest', ...(settle > 0 ? {to: 'fold' as const, blend: 0.3 * settle} : {}), pitchAdd: tilt, legLight: legLightAt(l), t}),
  ];
  paintRoom13(p, c, {t, cast});
};

// ---- S01-B04-SH02 (the truth shot, V02, L12): matched crouch, take-off +8, apex +17, freeze to +47, landing +56
export const JUMP = {crouchEnd: 8, takeoff: 8, leave: 10, apex: 17, resume: 48, land: 57, manApex: 0.42, giantApex: 0.36} as const;
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
  if (l < JUMP.land) { const u = l < JUMP.apex ? 0.5 * seg(l, 10, 17) : l < JUMP.resume ? 0.5 : 0.5 + 0.3 * seg(l, JUMP.resume, JUMP.land); return {mix: {a: 'P08', b: 'P01', u}, crouch: 0.25, lift}; }
  return {mix: {a: 'P01', b: 'P35', u: 0.45 * (1 - seg(l, JUMP.land, JUMP.land + 10))}, lift};
};
/** The grey icon's world anchor at local frame l: it rides the giant's back. */
export const iconAt14 = (l: number): V3 => [ICON_AT[0], ICON_AT[1] + jumpHeight(l, JUMP.giantApex), ICON_AT[2]];
export const paintSH14 = (p: Painter, l: number) => {
  const c = shotCamera('S01_B04_SH02', l), t = l / 30, m = manJumpOpts(l);
  const v02 = l >= 8 && l <= 20 ? {mouth: 'talk' as const, open: 0.3 + 0.5 * Math.abs(Math.sin(l * 1.9))} : {};
  const cast: RoomItem[] = [
    {at: MAN_AT, draw: (q, cc) => { paintMan(q, cc, {at: MAN_AT, view: 'front', mix: m.mix, face: 'neutral', faceState: {...v02, ...(l >= 105 && l < 117 ? {look: [0.7, 0] as [number, number]} : {})}, fig: m.crouch ? {crouch: m.crouch} : undefined, lift: m.lift, t, warm: 0.06}); }},
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

// ---- S01-B02-SH01 (strength up, weight up, L03; R2.1): coral glow on the hind-leg muscle 0 -> 1 from +3 to +97; dial, arrow and "แรงดีด ↑" are screen layers
export const muscleGlowAt = (l: number) => ease(seg(l, 3, 97));
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

// ---- S01-B03-SH03 (the spring pad, L09): see-through thorax; squeeze +9..+37, catch +39, hold, release +71 (flea gone +72), pad glow fades in the air to +89 (R2.1)
export const SPRING = {squeeze: 9, squeezed: 37, catch: 39, release: 71, gone: 72, glowEnd: 89, icon: 93} as const;
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

// ---- S01-B05-SH01 (the real measure, L13): the giant shrinks away about its feet +0..+12; marks at 0.15 / 0.42 m; MAN glances down +55, hands on hips +71
export const MAN15: V3 = [0.95, 0, 0.3];
export const GIANT15: V3 = [1.3, 0, 0.25];
export const shrinkLen = (l: number) => GIANT * (1 - clamp01(l / 12)) ** 1.8;
export const marksAt = (l: number) => [...(l >= 21 ? [{y: 0.15, color: '#ec8f78'}] : []), ...(l >= 52 ? [{y: 0.42, color: '#6fa3d0'}] : [])];
export const paintSH15 = (p: Painter, l: number) => {
  const c = shotCamera('S01_B05_SH01', l), t = l / 30;
  const down = ease(seg(l, 55, 63)) * (1 - ease(seg(l, 67, 71))), smug = seg(l, 71, 77), blink = l >= 112 && l < 115; // R2.1: glance +55..+69, smug +71, optional blink +112
  const cast: RoomItem[] = [
    {at: MAN15, draw: (q, cc) => { paintMan(q, cc, {at: MAN15, view: 'front', mix: {a: 'P01', b: 'P09', u: ease(smug)}, face: smug > 0.3 ? 'smug' : 'neutral', faceState: smug > 0.3 ? {look: [0, 0], ...(blink ? {eyes: 'shut' as const} : {})} : {look: [0.55 * down, -0.75 * down]}, t, warm: 0.06}); }},
    fleaItem(shrinkLen(l), {view: 'right', state: 'rest', t}, GIANT15),
  ];
  paintRoom13(p, c, {t, cast, marks: marksAt(l)});
};

// ---- S01-B05-SH02 (home, the dog sighs, L14 + hold): MAN sits down +0..+54, the dog lifts its head +65, sighs +71..+107, lies back +121 (R2.1)
export const SOFA16 = {sitEnd: 54, dogLift: 65, sigh: 71, sighEnd: 107, down: 121} as const;
export const dogLift = (l: number) => ease(seg(l, 65, 75)) * (1 - ease(seg(l, 113, 125)));
export const paintSH16 = (p: Painter, l: number) => {
  const c = shotCamera('S01_B05_SH02', l), t = l / 30, S = SOFA16, d = dogLift(l), sit = ease(seg(l, 0, S.sitEnd));
  const relieved = l < 40;
  const cast: RoomItem[] = [
    {at: LR13.dogAt, layer: 'sofa', draw: (q, cc) => paintDog(q, cc, LR13.dogAt, {view: 'left', state: 'lie', lid: d > 0.15 ? 0.2 : 1, ...(d > 0 ? {lean: d, leanTo: [0.1, 0.34], tilt: 8 * Math.sin(Math.PI * seg(l, S.sigh, S.sighEnd))} : {}), mouth: l >= S.sigh + 2 && l < S.sighEnd - 10 ? 'open' : 'closed'}, t)},
    {at: LR13.manSeatFeet, layer: 'sofa', draw: (q, cc) => { paintMan(q, cc, {at: LR13.manSeatFeet, view: 'front', mix: {a: 'P01', b: 'P31', u: sit}, face: relieved ? 'relieved' : 'neutral', faceState: {look: [0.3, 0.1]}, t, warm: 0.08}); }},
  ];
  paintRoom13(p, c, {t, cast});
};

// ======================= W5.2 asset group 3 =======================
// ---- S01-B01-SH02 (macro leap and counter, L01 b; R2.1): rest +0..+21 (22 f); +22 the flea is gone (smear streak, contact shadow stays); the camera cranes up after it
/** The flea's height above the sweep (mm) at local frame l: gone at +22, 20 mm at +28 (x10), 100 mm at +48 (x50), still rising at the cut. */
export const leapHeight = (l: number) => (l < 22 ? 0 : l <= 28 ? (20 / 6) * (l - 22) : 20 + 4 * (l - 28));
/** The counter step shown at local frame l (heights 20 ... 100 mm = x10 ... x50, one step per 5 f from +28); none before +28; x50 only +48..+51 (B-P2). */
export const counterAt = (l: number): string | undefined => (l < 28 ? undefined : `×${10 * (1 + Math.min(4, Math.floor((l - 28) / 5)))}`);
/** Camera eye height (mm): the crane rides the flea, which re-enters from the top edge by about +26 and then sits near row 700 while it shrinks. */
export const eye02 = (l: number) => {
  if (l < 22) return 0.45;
  const r = 4.0 + 36 * Math.min(1, (l - 22) / 33), k = 0.167 + 2.5 * (1 - ease(seg(l, 23, 37)));
  return Math.max(0.45, leapHeight(l) - r * k);
};
/** Picture point (px) of the flea's body centre and its length (px) at local frame l. */
export const flea02At = (l: number) => {
  const c = shotCamera('S01_B01_SH02', l), g = camPoint(c, [0, 0, 0]) ?? [540, 1030], u = camUnit(c, [0, 0, 0]), len = u * FLEA_MM;
  const air = leapHeight(l) / FLEA_MM;
  return {x: g[0], y: g[1] - (air + 0.3) * len, len, ground: g, u};
};
export const paintSH02 = (p: Painter, l: number) => {
  const c = shotCamera('S01_B01_SH02', l), t = l / 30;
  paintStudio(p, c, {fibre: true});
  if (l < 22) { paintFlea(p, c, [0, 0, 0], FLEA_MM, {view: 'right', state: 'rest', t}); return; }
  const g = camPoint(c, [0, 0, 0]) ?? [540, 1030], u = camUnit(c, [0, 0, 0]), len = u * FLEA_MM, k = l - 22;
  washAt(p, 9000, '#2a1a10', 70, ell(g[0] - 0.04 * len, g[1] + 0.005 * len, 0.55 * len, 0.045 * len, 20), 0.1, 0.2); // the contact shadow stays on the sweep
  if (k < 4) for (let i = 0; i < 3; i++) washAt(p, 9700 + i, '#6a4a30', 70 * (1 - k / 4), [[g[0] - 14 + i * 3, g[1] - 0.3 * u], [g[0] + 14 - i * 3, g[1] - 0.3 * u], [g[0] + 3, g[1] - (0.8 + k * 0.5 + i * 0.3) * u * 1.5], [g[0] - 3, g[1] - (0.8 + k * 0.5 + i * 0.3) * u * 1.5]], 0.3, 0.3); // smear streak
  const h = leapHeight(l), air = h / FLEA_MM, b = ease(seg(l, 26, 46));
  if (l >= 23) paintFlea(p, c, [0, 0, 0], FLEA_MM, {view: 'right', state: 'extend', to: 'apex', blend: b, airborne: true, air, shadow: false, t});
};

// ---- S01-B02-SH03 (backpack insert and refrain, L05/L06; R2.1): MAN and his 40 % ghost in the studio; glow +5, pack +57, hop +105..+117 (0.20 m), deadpan +156, blink +196..+199
export const HOP = {crouch: 100, leave: 105, apex: 111, land: 117, up: 127, pack: 57, glow: 5, deadpan: 156, blink: 196, h: 0.2} as const;
const DM: V3 = [-0.4, 0, 0], DG: V3 = [0.4, 0, 0];
export const hopLift = (l: number) => (l < HOP.leave || l >= HOP.land ? 0 : HOP.h * 4 * ((l - HOP.leave) / 12) * (1 - (l - HOP.leave) / 12));
const hopMix = (l: number): {mix: {a: AnyPoseId; b: AnyPoseId; u: number}; crouch?: number} => {
  if (l < HOP.crouch) return {mix: {a: 'P01', b: 'P01', u: 0}};
  if (l < HOP.leave) return {mix: {a: 'P01', b: 'P35', u: seg(l, HOP.crouch, HOP.leave)}};
  if (l < HOP.land) return {mix: {a: 'P35', b: 'P01', u: 0.9 * seg(l, HOP.leave, HOP.leave + 4) - 0.35 * seg(l, HOP.apex, HOP.land)}, crouch: 0.1};
  if (l < HOP.up) return {mix: {a: 'P01', b: 'P35', u: 0.45 * (1 - seg(l, HOP.land + 2, HOP.up))}};
  return {mix: {a: 'P01', b: 'P01', u: 0}};
};
/** Chart strip behind the pair (z -0.30): a pale card with ink tick lines every 0.25 m, no numerals. */
const paintStrip = (p: Painter, c: YCam) => {
  wFill(p, c, 7400, '#f5efe0', qz(-0.3, -0.95, 0.95, 0, 1.95));
  for (let i = 1; i <= 7; i++) wInk(p, c, 7410 + i, [[-0.95, i * 0.25, -0.299], [i % 2 ? -0.7 : -0.55, i * 0.25, -0.299]], {closed: false, weight: 0.8, color: '#9b8e72'});
  wInk(p, c, 7420, [[-0.95, 0, -0.299], [0.95, 0, -0.299], [0.95, 1.95, -0.299], [-0.95, 1.95, -0.299]], {weight: 1, color: '#9b8e72'});
};
/** Backpack anchored to MAN's near shoulder (px): a rounded teal pack with a strap, dropping in over 6 f from +55 with one small bounce. */
const paintPack = (p: Painter, f: FigAnchors, u: number, l: number) => {
  if (l < HOP.pack) return;
  const s = Math.min(1, (l - HOP.pack) / 6), drop = -1.15 * u * (1 - s * s) + (l - HOP.pack >= 6 ? 0.03 * u * Math.exp(-(l - HOP.pack - 6) / 3) * Math.sin((l - HOP.pack - 6) * 1.6) : 0);
  const x0 = f.rShoulder[0] - 0.36 * u, x1 = f.rShoulder[0] - 0.07 * u, y0 = f.rShoulder[1] - 0.04 * u + drop, y1 = y0 + 0.52 * u;
  const box: Pt[] = [[x0 + 0.04 * u, y0], [x1 - 0.02 * u, y0 + 0.03 * u], [x1, y1 - 0.05 * u], [x1 - 0.05 * u, y1], [x0 + 0.04 * u, y1 + 0.01 * u], [x0, y1 - 0.06 * u], [x0 - 0.01 * u, y0 + 0.08 * u]];
  hardFill(p, 9500, '#2f7f8f', box);
  hardFill(p, 9501, '#e8b84a', [[x0 + 0.015 * u, y0 + 0.25 * u], [x1 - 0.02 * u, y0 + 0.25 * u], [x1 - 0.03 * u, y1 - 0.1 * u], [x0 + 0.015 * u, y1 - 0.1 * u]]);
  inkLine(p, 9502, box, {weight: 1.1, closed: true, color: '#1d2129', curve: 0.2});
  inkLine(p, 9503, [[x0 + 0.015 * u, y0 + 0.25 * u], [x1 - 0.02 * u, y0 + 0.25 * u]], {weight: 0.8, closed: false, color: '#1d2129'});
  inkLine(p, 9504, [[x1 - 0.03 * u, y0 + 0.02 * u], [f.rShoulder[0] + 0.02 * u, f.rShoulder[1] + drop - 0.02 * u], [f.rShoulder[0] + 0.01 * u, f.rShoulder[1] + 0.3 * u + drop * 0.2], [x1 - 0.03 * u, y1 - 0.12 * u]], {weight: 1.4, closed: false, color: '#1d2129', curve: 0.3}); // strap over the shoulder
};
export const glowAt10 = (l: number) => ease(seg(l, HOP.glow, HOP.glow + 8));
export const paintSH10 = (p: Painter, l: number) => {
  const c = shotCamera('S01_B02_SH03', l), t = l / 30, m = hopMix(l), lift = hopLift(l), u = camUnit(c, DM);
  paintStudio(p, c);
  paintStrip(p, c);
  const deadpan = l >= HOP.deadpan, bl = l >= HOP.blink && l < HOP.blink + 4 ? (l === HOP.blink || l === HOP.blink + 3 ? 'half' : 'shut') as 'half' | 'shut' : undefined;
  const ghost = p.layer(0.4, 9800);
  paintMan(ghost, c, {at: DG, view: 'right', mix: m.mix, face: 'neutral', fig: m.crouch ? {crouch: m.crouch} : undefined, lift, t});
  const fig = paintMan(p, c, {at: DM, view: 'right', mix: m.mix, face: 'neutral', faceState: deadpan ? {look: [0, 0], ...(bl ? {eyes: bl} : {})} : undefined, fig: {...(m.crouch ? {crouch: m.crouch} : {}), ...(deadpan ? {head: 'front' as const} : {})}, lift, t});
  if (fig) {
    const g = glowAt10(l), H = fig.feet[1] - fig.headTop;
    if (g > 0.02) for (const [dy, ry, rx] of [[0.36, 0.17, 0.06], [0.14, 0.12, 0.05]]) washAt(p, 9400 + Math.round(dy * 10), '#ff6f4f', 150 * g, ell(fig.feet[0], fig.feet[1] - dy * H, rx * H, ry * H, 22), 0.45, 0.3);
    paintPack(p, fig, u, l);
  }
};
/** MAN's tag anchors (world, D m): leg "x2" and pack "x2" left of him. */
export const TAG10 = {leg: [-0.95, 0.5, 0] as V3, pack: [-0.95, 1.45, 0] as V3};

// ---- S01-B03-SH01 (the tiny flea, L07): the rest flea of shot 2, slow push only
export const paintSH11 = (p: Painter, l: number) => {
  const c = shotCamera('S01_B03_SH01', l);
  paintStudio(p, c, {fibre: true});
  paintFlea(p, c, [0, 0, 0], FLEA_MM, {view: 'right', state: 'rest', t: l / 30});
};

// ---- Trailer shots 4-7 (S01-B01-SH04, SH04B, SH04C, SH04D). Trailer grade = `trailerPainter`; sky, sun and rim stay ungraded (look lock R1.5)
const ST: V3 = SOI.flea;
const DEG13 = Math.PI / 180;
/** Near road beyond the soi set's pavement end (CAM-TR-SOI stands at z +16): asphalt + pavement extended toward the lens, in the trailer haze. */
const nearRoad = (g: Painter, c: YCam) => {
  wFill(g, c, 7290, '#9a9ea0', qy(0, -12, 12, 4, 20)); wFill(g, c, 7291, '#d6cfbd', qy(0.003, -3, 3, 4, 20));
  wFill(g, c, 7292, '#b9b29e', qy(0.006, -3.1, -3, 4, 20)); wFill(g, c, 7293, '#b9b29e', qy(0.006, 3, 3.1, 4, 20));
};
/** The shadow card (N18): the giant's outline stretched about x3 along the low sun (toward the lens), soft edge, six leg ticks; centre z. */
const paintShadow = (g: Painter, c: YCam, z: number) => {
  const xc = 0.7, a = 2.3, b = 6.5, y = 0.012;
  const ring = (s: number, ox: number, oz: number): V3[] => Array.from({length: 48}, (_, i) => { const th = (i / 48) * 6.2832; return [xc + ox + a * s * Math.cos(th), y, z + oz + b * s * Math.sin(th)] as V3; });
  wWash(g, c, 7950, '#0a1624', 70, ring(1.35, 0, 0), 0.6, 0.2);
  wWash(g, c, 7951, '#0a1624', 120, ring(1, 0, 0), 0.5, 0.2);
  wWash(g, c, 7952, '#0a1624', 150, ring(0.55, 0.15, -0.9), 0.35, 0.2); // the head end, toward the sun
  for (let i = 0; i < 6; i++) { const sx = i < 3 ? -1 : 1, dz = (i % 3 - 1) * 2.4; wInk(g, c, 7960 + i, [[xc + sx * a * 0.8, y, z + dz], [xc + sx * a * 1.7, y, z + dz * 1.5 + 0.8]], {closed: false, weight: 2.4, color: '#0a1624'}); }
};
const sunSoi = (c: YCam): Pt => [camPoint(c, [SOI.tower.x - 6, 0, SOI.tower.z])?.[0] ?? 500, horizonRow(c) - 190];

// ---- S01-B01-SH04 (trailer 1, the shadow): the soi at dusk, MAN tiny, the shadow sweeps down the road over him +4..+16, his head tilts up +10..+18
export const shadowZ = (l: number) => -34 + 54 * Math.pow(Math.max(0, Math.min(1, (l - 4) / 12)), 0.667);
export const paintSH04 = (p: Painter, l: number) => {
  const c = shotCamera('S01_B01_SH04', l), t = l / 30, g = trailerPainter(p), sun = sunSoi(c);
  const zS = shadowZ(l), near = l >= 4 && l <= 16 ? Math.max(0, 1 - Math.abs(zS - SOI.man[2]) / 3.2) : 0;
  const man = tintPainter(g, '#0a1830', 0.55 * near, {brush: true});
  paintSoi(g, c, {haze: TRAILER_GRADE.haze, sky: (_q, cc) => duskSky(sun, 175)(p, cc), cast: [
    (q, cc) => nearRoad(q, cc),
    (q, cc) => { if (l >= 3 && l <= 17) paintShadow(q, cc, zS); },
    (_q, cc) => { paintMan(man, cc, {at: SOI.man, view: 'back', pose: 'P30', face: 'neutral', fig: {headTilt: 0.5 * seg(l, 10, 19)}, t, warm: 0}); },
  ]});
};

// ---- S01-B01-SH04B (trailer 2, crouch and launch): LF04b at +10; launch +18 out of the top edge by +22, smear, small grit swirl
export const LAUNCH = 18;
/** Giant height (m) above its mark at local frame l after the launch: leaves the frame top within four frames. */
export const launchY = (l: number) => (l < LAUNCH ? 0 : 0.4 + 2.2 * (l - LAUNCH) ** 2);
export const paintSH05T = (p: Painter, l: number) => {
  const c = shotCamera('S01_B01_SH04B', l), t = l / 30, g = trailerPainter(p), sun = camPoint(c, [SOI.tower.x, 0, SOI.tower.z]) ?? [900, 700];
  const sil = {u: 0.82, rimPx: 4};
  const crouchK = seg(l, 0, 10);
  const y = launchY(l), d = l - LAUNCH;
  paintSoi(g, c, {haze: TRAILER_GRADE.haze, sky: (_q, cc) => duskSky([sun[0], horizonRow(cc) - 150], 120)(p, cc), cast: [
    (_q, cc) => {
      const gp = camPoint(cc, ST), u = camUnit(cc, ST);
      if (!gp) return;
      if (l >= LAUNCH && d < 10) { // grit swirl: small pale specks lifting and spreading from the feet, fading (no crack, no debris)
        for (let i = 0; i < 16; i++) { const a = hash(i * 4.1) * 6.283, sp = 0.25 + 0.5 * hash(i * 7.7), k = d / 10; washAt(p, 9100 + i, '#d8caa8', 150 * (1 - k), ell(gp[0] + Math.cos(a) * sp * u * (0.2 + k * 1.1), gp[1] - 0.1 * u + Math.sin(a) * sp * u * 0.12 * (0.2 + k) - k * 0.5 * u * hash(i * 3.3), 0.05 * u * (1 - 0.4 * k), 0.035 * u * (1 - 0.4 * k), 10), 0.4, 0.2); }
      }
      if (l >= LAUNCH && d < 4) for (let i = 0; i < 3; i++) washAt(p, 9710 + i, '#1b1420', 90 * (1 - d / 4), [[gp[0] - 0.5 * u + i * 0.5 * u, gp[1] - 0.2 * u], [gp[0] - 0.4 * u + i * 0.5 * u, gp[1] - 0.2 * u], [gp[0] - 0.1 * u + i * 0.5 * u, gp[1] - (1.5 + 3.5 * d) * u], [gp[0] - 0.2 * u + i * 0.5 * u, gp[1] - (1.5 + 3.5 * d) * u]], 0.3, 0.3); // smear streak up from the mark
      paintFlea(p, cc, ST, 1.8, l < LAUNCH
        ? {view: 'right', state: 'fold', to: 'crouch', blend: crouchK, silhouette: sil, t}
        : {view: 'right', state: 'extend', airborne: true, air: (0.25 + y) / 1.8, silhouette: sil, shadow: false, t});
    },
    (_q, cc) => { paintMan(g, cc, {at: SOI.man, view: 'back', pose: 'P30', face: 'neutral', fig: {headTilt: 0.55 * seg(l, LAUNCH, 27)}, t, warm: 0}); },
  ]});
};

// ---- S01-B01-SH04C (trailer 3, money shot and the break; R2.1): rise +0..+12, apex hold +12..+25 (13 f), tape-stop +25 (6 f, drain, sag), droop +31..+40, card off +40
export const SKY = {apex: 12, stop: 25, stopEnd: 31, droop: 31, off: 40, hold: 13} as const;
/** Arc parameter s (0 .. 0.5 at the apex; `arcPoint`) of the silhouette at local frame l. */
export const skyS = (l: number) => 0.5 * (1 - (1 - Math.min(1, l / SKY.apex)) ** 2);
/** World point of the silhouette: rises along the LF04 arc, hangs at `SKY_APEX`, then droops out of the frame bottom (leaning right, toward the lens). */
export const skyPoint = (l: number): V3 => {
  if (l <= SKY.apex) { const a = arcPoint(skyS(l)); return l >= SKY.apex ? [...SKY_APEX] as V3 : [a[0], a[1], a[2]]; }
  if (l < SKY.droop) return [...SKY_APEX] as V3;
  const u = Math.min(1, (l - SKY.droop) / 9);
  return [SKY_APEX[0] + 7 * u, SKY_APEX[1] - 175 * u * u, SKY_APEX[2] + 30 * u];
};
/** Rise points: the arc reaches the apex exactly at +12 (apex point of `arcPoint` is ARC.apex; the shot uses SKY_APEX as LF04 does), so blend the last stretch. */
const risePoint = (l: number): V3 => {
  const s = skyS(l), a = arcPoint(s), k = s / 0.5;
  return [a[0] + (SKY_APEX[0] - 10) * k, a[1] + (SKY_APEX[1] - 130) * k, a[2]];
};
export const skyPos = (l: number): V3 => (l < SKY.apex ? risePoint(l) : skyPoint(l));
/** Tape-stop clock (N19): the shot clock runs to the stop frame, eases to a stop over the next 6 f (a half-second equivalent of 3 f travel), then holds. */
export const tapeClock = (l: number) => { if (l < SKY.stop) return l; const u = Math.min(1, (l - SKY.stop) / 6); return SKY.stop + 3 * (u * (2 - u)); };
export const drainAt = (l: number) => seg(l, SKY.stop, SKY.stopEnd);
/** The dotted trail behind the silhouette (px): arc samples 0.24..0.10 behind its parameter, kept to the rise; fades with the droop. */
export const trailAt = (l: number): {pts: Pt[]; a: number} => {
  const sNow = skyS(Math.min(l, SKY.apex)), pts: Pt[] = [];
  for (let i = 0; i <= 5; i++) { const s = sNow - 0.24 + 0.14 * (i / 5); if (s < 0.02) continue; const a = arcPoint(s), k = s / 0.5; const q = camPoint(CAM_TR_SKY, [a[0] + (SKY_APEX[0] - 10) * k, a[1] + (SKY_APEX[1] - 130) * k, a[2]]); if (q) pts.push(q); }
  return {pts, a: 1 - seg(l, SKY.droop, SKY.droop + 6)};
};
export const paintSH06 = (p: Painter, l: number) => {
  const c = CAM_TR_SKY, dr = drainAt(l), g = trailerPainter(p, dr), ps = dr > 0 ? tintPainter(p, TRAILER_GRADE.drainTo, dr, {brush: true}) : p;
  const fl = dr > 0 ? tintPainter(p, '#3d3e44', dr, {brush: true}) : p, te = tapeClock(l) / 30, pos = skyPos(l), up = seg(l, 0, SKY.apex), drop = seg(l, SKY.droop, SKY.off);
  paintSoi(g, c, {haze: TRAILER_GRADE.haze, sky: (_q, cc) => { duskSky([(camPoint(cc, [SOI.tower.x, 0, SOI.tower.z + SOI.tower.w / 2])?.[0] ?? 540) - 10, horizonRow(cc) - SKY_SUN_R * 1.9], SKY_SUN_R)(ps, cc); paintSkyline(g, cc); }, cast: [
    (_q, cc) => towerRim(ps, cc),
    (_q, cc) => { paintFlea(fl, cc, pos, 1.8, l < SKY.droop
      ? {view: 'right', state: 'extend', to: 'apex', blend: up, air: 0, shadow: false, silhouette: {u: 1}, t: te}
      : {view: 'right', state: 'apex', air: 0, shadow: false, silhouette: {u: 1}, pitchAdd: -55 * drop, t: te}); },
  ]});
};

// ---- S01-B01-SH04D (plain soi, knee-high hop): drop from y 3.0 over +0..+6, small deflated landing, one 0.36 m hop +32..+50 (R2.1), MAN's head tips down and turns +58..+70
export const HOP7 = {drop: 6, fold: 26, leave: 32, land: 50, h: 0.36, look: 58} as const;
export const hop7Y = (l: number) => {
  if (l < HOP7.drop) return 3.0 * (1 - (l / HOP7.drop) ** 2);
  if (l < HOP7.leave || l >= HOP7.land) return 0;
  const s = (l - HOP7.leave) / (HOP7.land - HOP7.leave);
  return HOP7.h * 4 * s * (1 - s);
};
const hopOpts = (l: number, t: number): FleaOpts => {
  const sun = {tint: sunTint, t} as const, y = hop7Y(l);
  if (l < HOP7.drop) return {view: 'right', state: 'land', airborne: true, air: airFor('land', 'land', 0, y), shadow: false, ...sun};
  if (l < HOP7.fold) return {view: 'right', state: 'land', to: 'rest', blend: ease(seg(l, HOP7.drop, 16)), ...sun};
  if (l < HOP7.leave) return {view: 'right', state: 'rest', to: 'fold', blend: ease(seg(l, HOP7.fold, HOP7.leave)), ...sun};
  const s = (l - HOP7.leave) / (HOP7.land - HOP7.leave);
  if (s < 0.1) return {view: 'right', state: 'fold', to: 'extend', blend: s / 0.1, airborne: true, air: airFor('fold', 'extend', s / 0.1, y), shadow: false, ...sun};
  if (s < 0.5) { const k = (s - 0.1) / 0.4; return {view: 'right', state: 'extend', to: 'apex', blend: k, airborne: true, air: airFor('extend', 'apex', k, y), shadow: false, ...sun}; }
  if (s < 0.9) { const k = (s - 0.5) / 0.4; return {view: 'right', state: 'apex', to: 'land', blend: k, airborne: true, air: airFor('apex', 'land', k, y), shadow: false, ...sun}; }
  return {view: 'right', state: 'land', to: 'rest', blend: ease(seg(l, HOP7.land, HOP7.land + 12)), ...sun};
};
export const paintSH07 = (p: Painter, l: number) => {
  const c = shotCamera('S01_B01_SH04D', l), t = l / 30;
  const turn = ease(seg(l, HOP7.look, 70));
  paintSoi(p, c, {cast: [
    (q, cc) => { paintFlea(q, cc, ST, 1.8, hopOpts(l, t)); },
    (q, cc) => { paintMan(q, cc, {at: SOI.man, view: 'back', pose: 'P30', face: 'neutral', fig: {headYaw: 0.55 * turn, headTilt: -0.28 * turn}, t, warm: 0.06}); },
  ]});
};
