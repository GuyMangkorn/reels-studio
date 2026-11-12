import type {ReactNode} from 'react';
import {useCurrentFrame} from 'remotion';
import {ell, inkLine, washAt} from '../kit/draw';
import {paintFall} from '../kit/fall';
import {hipAnchor, withRoll} from '../kit/figure-at';
import {mixColor, tintPainter, type Painter, type Pt} from '../kit/painter';
import {ease, clamp01, type V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintBox} from '../kit/world';
import {paintDrop14} from '../kit/water-drop';
import {balanceAngle, paintBalance} from './balance';
import {lookCam, mix3, moveCam} from './cams';
import {clockOf, FALL_D2, FALL_REPLAY, FALL_SM_PER_F, lenOf, lerp, SH04, SH14, SH16, sh16Fall, sh17Fall, SH17, sm, SHOT_TABLE, type ShotId} from './clock';
import {paintDimple, paintFilm, paintUnderface, dimpleDepth, passengerY} from './dropcontact';
import {CROWN_W, paintCrownRipple, paintShrinkPop, paintSplashCrown, shrinkAbout, shrinkScale} from './effects';
import {paintFeatherBall} from './feather';
import {Ot01, Ot02, Ot03} from './labels';
import {hash} from '../kit/hash';
import {unproject} from './ripple';
import {GROUND_Y, MC, paintLakeDetail, BUN_SM, paintBun, paintMacro, paintMacroBackdrop, paintStreamMotes, paintSlowRain, paintWaterPlane, PUDDLE, wobble} from './macro';
import {anchorUnderFace, BODY_SPAN, drawMosquito, MOSQ_BL_M, MOSQ_BL_SM, mosqReachAbove, mosqReachBelow, paintMosquito, type MosqState} from './mosquito';
import {Painted, type Grade} from './look';
import {paintRuler, RULER, tickY} from './ruler';
import {paintCurtain, paintSoi, paintStream, SOI} from './soi';
import {paintTote, paintWoman, withShrink, WOMAN, WOMAN_H} from './woman';

// EDU-EP18-SHORT shot plates (W5.2 Boss, ROWS-R2.0): one `ShotFrame` per shot, a pure function of the shot-local frame L (= the composition frame inside the plate's
// Freeze). Boss's blockout with the final assets: cameras, clocks and contact numbers from the scene sheet, painted by the library modules (soi, macro, mosquito,
// dropcontact, effects, ruler, balance, feather, woman). Editor refines staging, casts V01-V03 and the captions; nothing here is a voice, caption or the channel mark.
// Coordinates: `H` metres, `M` set metres (sm), `Dl` drop-local sm (world = centre + Dl), `Mh` hypothetical (SH15), `I` insert, `D` fixed plane (px).
const PX = (u: number): YCam => ({x: 0, y: 0, z: 1, yaw: 0, f: u, hy: 0}); // a camera that maps world (X, Y, 0) to px (540 + u X, -u Y): the card placed by picture point
const W_M: V3 = [-0.75, -0.8, 0]; // WOMAN hanging in `M` (feet; head top y 0.82): SH03-SH07
const D0_X = 1.75, D0_Z = -0.2, MOSQ_M: V3 = [1.6, 0.1, -0.2];
const D1_X = -0.15;
const RIDER_Y = -0.95;

// ---- D0 in SH04: its bottom face meets the mosquito's back at +17 (f153) and falls 0.30 sm/f
const BACK04 = MOSQ_M[1] + mosqReachAbove('hover') * MOSQ_BL_SM;
export const D0_C17 = BACK04 - BUN_SM.bottom; // centre height at contact
export const d0Y = (n: number) => D0_C17 + FALL_SM_PER_F * (SH04.contact - n);
/** Mosquito anchor (M) in SH04 at frame n: hover, carried under the face from +17, released at +36, flying back up to (1.4, 0.2, -0.2) by +53. */
export const mosq04 = (n: number): {at: V3; state: MosqState; pitch: number} => {
  if (n < SH04.contact) return {at: MOSQ_M, state: 'hover', pitch: 0};
  const carried = (m: number): V3 => [MOSQ_M[0], anchorUnderFace(d0Y(m) + BUN_SM.bottom, MOSQ_BL_SM, 'pressed'), MOSQ_M[2]];
  if (n <= 36) return {at: carried(n), state: 'pressed', pitch: 0};
  const y0 = carried(36)[1], u = sm(36, SH04.back[1], n);
  return {at: [lerp(MOSQ_M[0], 1.4, u), lerp(y0, 0.2, u), MOSQ_M[2]], state: 'clear', pitch: 22 * (1 - u)};
};

const hairCam = (): YCam => lookCam([0, 0, 1], [0, 0, 0], 1000);
void hairCam;

// ---------------------------------------------------------------- common painters
const skyUp = (p: Painter, grade = 0) => {
  washAt(p, 56000, mixColor('#46515e', '#3b4654', grade), 255, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]], 0, 0);
  washAt(p, 56001, mixColor('#7b8790', '#5d6a78', grade), 160, [[0, 0], [1080, 0], [1080, 900], [0, 700]], 0.3, 0.2);
};
const womanM = (p: Painter, c: YCam, t: number, o: Partial<Parameters<typeof paintWoman>[2]> = {}) => paintWoman(p, c, {at: W_M, view: 'front', t, shadow: false, ...o});
const rider = (c: YCam, ctr: V3, dl: V3): Pt | null => camPoint(c, [ctr[0] + dl[0], ctr[1] + dl[1], ctr[2] + dl[2]], 0.3);

/** Lays WOMAN as `pressed-spread` (head toward screen left, face to the lens from beneath) with her hip at `hip` (px), `u` px per metre. */
const paintPressedWoman = (p: Painter, hip: Pt, u: number, t: number, face: Parameters<typeof paintWoman>[2]['face'], o: {legs?: boolean; roll?: number} = {}) => {
  const base = hipAnchor(WOMAN, [0, 0], u, {view: 'front'}), g: Pt = [hip[0] - base[0], hip[1] - base[1]];
  const kick = o.legs === false ? undefined : {r: {hip: -28, knee: 0}, l: {hip: -28, knee: 0}};
  void kick;
  return paintWoman(p, PX(u), {at: [(g[0] - 540) / u, -g[1] / u, 0], view: 'front', named: {name: 'pressed-spread', L: 0}, face, t, roll: o.roll ?? -90, shadow: false, fit: false});
};

// ---------------------------------------------------------------- the shots
type ShotDef = {id: ShotId; grade: Grade; paint: (p: Painter, L: number) => void; push?: (L: number) => {s: number; at: Pt}; ot03?: (L: number) => Pt | null};
const SH: Record<string, ShotDef> = {};
const def = (d: ShotDef) => { SH[d.id] = d; };
const ambT = (id: ShotId, L: number) => clockOf(id, L).amb / 30;

// SH01 ankle height (F-B01): the lens 0.085 m from the mosquito, which hangs against the rain-lit lane (47 px); her run (D-01: 1.5 m/s, 0.05 m/f) comes in from the right
const camSH01 = (L: number) => moveCam(L, 0, 29, [0.85, 0.16, 0.36], [0.87, 0.165, 0.38], [2.0, 0.4, 1.3], [2.0, 0.4, 1.3], 1000, 1000, 0.02);
export const MOSQ_H: V3 = [0.923, 0.195, 0.398];
const HEEL0: V3 = [1.8, 0, 2.6], HEEL29: V3 = [1.52, 0, 1.15];
/** Her feet point (m): SH01 runs HEEL0 -> HEEL29 at 0.05 m/f; SH02 decelerates from that speed to rest (ease-out, D-01/F-B02). */
const runAt = (id: ShotId, L: number): V3 => {
  if (id === 'S01-B01-SH01') return mix3(HEEL0, HEEL29, Math.min(1, L / 29));
  const e = 1 - (1 - clamp01(L / 8)) ** 1.45; // initial speed 0.05 m/f, rest at +8
  return mix3([1.47, 0, 1.12], [1.25, 0, 0.95], e);
};
const HEEL_MARKS: [number, V3][] = [[4, [1.8, 0, 2.4]], [14, [1.62, 0, 1.9]], [24, [1.62, 0, 1.4]]];
def({id: 'S01-B01-SH01', grade: 'neutral', paint: (p, L) => {
  const c = camSH01(L), t = ambT('S01-B01-SH01', L);
  paintSoi(p, c, {t, puddle: false});
  HEEL_MARKS.forEach(([n, at], i) => paintSplashCrown(p, c, [at[0], 0.012, at[2]], L - n, {width: 0.16, seed: 52800 + i * 200}));
  paintWoman(p, c, {at: runAt('S01-B01-SH01', L), view: 'left', named: {name: 'bag-over-head', L}, face: 'worried', t});
  paintCurtain(p, c, {t, span: [0.2, 2.4], density: 0.6});
  paintMosquito(p, c, MOSQ_H, MOSQ_BL_M, {view: 'left', state: 'hover', t, blur: true, rimColor: '#9aa8b8'});
  // F2-B01: the downpour for the hook frame: 64 streaks (>= 50 in frame after the caption-band thinning, 5 px), 10 splash crowns on the lane at y >= 1350 renewed every 4-8 f
  paintFall(p, 'rain', {width: 1080, height: 1920, t, seed: 7, style: {count: 64, weight: 5, len: [180, 260]}, captionBand: [1176, 1344]});
  for (let j = 0; j < 10; j++) {
    const per = 4 + Math.floor(5 * hash(52900 + j)), cyc = Math.floor((L + j) / per), age = (L + j) % per, seed = 52910 + j * 17 + cyc * 3;
    const at = unproject(camSH01(Math.max(0, cyc * per - j)), 40 + hash(seed) * 1000, 1370 + hash(seed + 1) * 110, 0.012);
    if (at) paintSplashCrown(p, c, at, age + 1, {width: 34 / camUnit(c, at), seed: 53000 + j * 200}); // ~34 px wide drop crowns
  }
}});

// SH02 she runs for the awning and shrinks about P_S; cut on the puff's peak
const camSH02 = (L: number) => moveCam(L, 0, 19, [-0.4, 1.05, 3.4], [-0.3, 1.02, 3.2], [1.1, 0.62, 0.8], [1.05, 0.55, 0.7]);
export const P_S: V3 = [1.02, 0.22, 0.5];
def({id: 'S01-B01-SH02', grade: 'neutral', paint: (p, L) => {
  const c = camSH02(L), t = ambT('S01-B01-SH02', L), ps = camPoint(c, P_S) ?? [474, 1070] as Pt;
  paintSoi(p, c, {t});
  const at = runAt('S01-B01-SH02', L);
  withShrink(p, ps, shrinkScale(L), () => { paintWoman(p, c, {at, view: 'left', named: {name: 'bag-over-head', L: L + 30}, face: 'worried', t, shadow: shrinkScale(L) >= 1}); });
  paintCurtain(p, c, {t, span: [-2.5, 3.5], density: 0.5});
  paintMosquito(p, c, lerpV([1.19, 0.2, 0.71], [1.05, 0.22, 0.52], L / 38), MOSQ_BL_M, {view: 'left', state: 'hover', t, blur: true, rimColor: '#9aa8b8'});
  paintFall(p, 'rain', {width: 1080, height: 1920, t, captionBand: [1176, 1344]});
  paintShrinkPop(p, ps, L, 150);
}});
const lerpV = (a: V3, b: V3, u: number): V3 => mix3(a, b, clamp01(u));

// SH03 macro: she hangs in slow rain; the camera tilts up to the drop above
const camSH03 = (L: number) => {
  const u = sm(16, 70, L);
  return lookCam(mix3([-0.35, -0.1, 3.3], [-0.4, -0.95, 3.6], u), mix3([-0.55, 0.25, 0], [-0.3, 1.55, 0], u), 1000);
};
const d1Sh03 = (L: number) => lerp(5.6, 3.3, L / 85);
def({id: 'S01-B01-SH03', grade: 'neutral', paint: (p, L) => {
  const c = camSH03(L), t = ambT('S01-B01-SH03', L);
  paintMacro(p, c, {t, haze: 290}); // F2-B03: the far-ground step sits below y 1500 at +0 and is a soft edge
  // F-B03: she hangs from the sky, not on a ground line: feet apart, one knee up, toes down, off any horizon
  womanM(p, c, t, {face: 'scared', fig: {headCock: -6 * sm(16, 34, L), legKick: {r: {hip: 10, knee: 26}, l: {hip: -6, knee: 8}}}, named: undefined});
  paintMosquito(p, c, [0.45, 0.05, 0], MOSQ_BL_SM, {view: 'left', state: 'hover', t, blur: false, rimColor: '#e9b46a'});
  paintBun(p, c, [D1_X, d1Sh03(L), 0], {t, phase: 1});
  const centre = camPoint(c, [W_M[0], W_M[1] + 0.81, 0]);
  if (centre && L < 12) paintShrinkPop(p, centre, 20, 150, 52000, 1 - L / 11);
}});

// SH04 a drop swallows the mosquito and carries it down; it flies back up. The scene is a pure function of n so SH16 can play it backwards.
export const camSH04 = (n: number) => moveCam(n, 0, 85, [1.3, -0.1, 4.7], [1.05, -0.15, 4.6], [0.75, 0.75, -0.1], [0.8, 0.5, -0.1]);
export const paintSH04 = (p: Painter, n: number, c: YCam, t: number) => {
  paintMacro(p, c, {t});
  womanM(p, c, t, {face: 'scared', fig: {headCock: 8}});
  const ctr: V3 = [D0_X, d0Y(n), D0_Z], m = mosq04(n);
  paintBun(p, c, ctr, {t, seed: 40500});
  const mm = () => paintMosquito(p, c, m.at, MOSQ_BL_SM, {view: 'right', state: m.state, t, blur: false, pitchAdd: m.pitch, rimColor: '#e9b46a'});
  mm();
  if (n >= SH04.contact && n <= 36) paintFilm(p, c, ctr, {t});
};
def({id: 'S01-B01-SH04', grade: 'neutral', paint: (p, L) => paintSH04(p, L, camSH04(L), ambT('S01-B01-SH04', L))});

// SH05 low angle: her drop right above, arms up
const MQ05_LEN = 740, MQ05_PITCH = -40;
/** Card anchor that puts the thorax (waist-frame (0.2, 0.04) bl) of a side-view mosquito at `target`, given its total pitch (deg, nose up positive). */
const mosqThoraxAt = (target: Pt, len: number, pitchDeg: number, view: 'left' | 'right'): Pt => {
  const L = len / BODY_SPAN, a = (pitchDeg * Math.PI) / 180, x = 0.2 + 0.0925, y = 0.04, dir = view === 'left' ? -1 : 1;
  return [target[0] - dir * (x * Math.cos(a) - y * Math.sin(a)) * L, target[1] + (x * Math.sin(a) + y * Math.cos(a)) * L];
};
const camSH05 = (L: number) => moveCam(L, 0, 25, [-0.55, -1.8, 1.45], [-0.55, -1.72, 1.32], [-0.75, 0.9, 0], [-0.75, 0.9, 0]);
def({id: 'S01-B01-SH05', grade: 'neutral', paint: (p, L) => {
  const c = camSH05(L), t = ambT('S01-B01-SH05', L);
  paintMacro(p, c, {t});
  // F-B05: card fitted to the projected feet -> head span (501 px under the 61 deg pitch), P45 hands up with the palms at (540, 915)
  womanM(p, c, t, {face: 'terrified', palms: {r: [506, 915], l: [574, 915]}});
  paintBun(p, c, [D1_X, lerp(3.30, 3.18, L / 25), 0], {t, phase: 2, up: {maxBottom: 870 + 10 * (L / 25)}}); // F2-B05: the bottom face from below, lowest pixel <= 870 at +0 and 880 at +25
  // F3-B05: head toward the left, turned away from her: nose pitched steeply down so the proboscis points down and the body rises to the right; the card is placed by its thorax
  // (1069, 1076) +-30 (the waist-frame point (0.2, 0.04) bl), the head stays at x >= 900 and nothing crosses her silhouette (x 440-635)
  const MQ = {len: MQ05_LEN, pitchAdd: MQ05_PITCH}, th = mosqThoraxAt([1069, 1076], MQ.len, -15 + MQ.pitchAdd, 'left');
  drawMosquito(p, th, MQ.len, {view: 'left', state: 'hover', t, pitchAdd: MQ.pitchAdd, rimColor: '#e9b46a'});
}});

// SH06 balance diagram on the fixed plane
def({id: 'S01-B01-SH06', grade: 'neutral', push: (L) => ({s: 1 + 0.08 * clamp01(L / 75), at: [540, 820]}), paint: (p, L) => {
  const t = ambT('S01-B01-SH06', L), c = lookCam([0, 0, 5.4], [0, 0, 0], 1000);
  paintMacroBackdrop(p, c, {glow: 0.8});
  paintSlowRain(p, lookCam([0, 0, 6], [0, 0, 0], 1000), t, {alpha: 0.8});
  paintDrop14(p, [540, -150], 190, {kind: 'bun', ...wobble(t)}, {seed: 40900, light: -1}); // F-B06: only a soft band y 0-260 shows
  const bal = paintBalance(p, L);
  const drop = (L0: number) => -520 * (1 - ease(clamp01(L / L0)));
  const u = 260 / 1.62; // both figures 260 px: her height and the mosquito's body length
  if (L >= 1) paintWoman(p, PX(u), {at: [(bal.left[0] - 540) / u, -(bal.left[1] + drop(4)) / u, 0], view: 'front', named: undefined, face: L >= 55 ? 'relieved' : 'surprised', t, shadow: false, fit: false});
  if (L >= 1) { // standing, facing her, all six tips on the right pan (the legs reach 0.72 bl below the waist)
    const len = 260, m = drawMosquito(p, [872, bal.right[1] + drop(8) - mosqReachBelow('stand') * len], len, {view: 'left', state: 'stand', t, blur: false, rimColor: '#e9b46a'});
    void m;
  }
}});

// SH07 slow motion (F-B07): D1 enters at 6.595 falling 0.30 sm/f (the D1 track), meets her raised palms (y 1.22) at +15 and the mosquito's back at +18; after contact the
// camera falls with D1 (cut-on-action into SH08) and she and the mosquito are carried under the face, both in frame at +34
export const D1_HANDS = W_M[1] + 2.02;
export const d1Sh07 = (L: number) => 6.595 - FALL_SM_PER_F * L;
const fallAfter = (L: number) => FALL_SM_PER_F * Math.max(0, L - 15);
const camSH07 = (L: number) => {
  const b = moveCam(L, 0, 34, [0.2, 0.6, 3.1], [0.15, 0.62, 2.8], [-0.2, 0.9, 0], [-0.2, 0.9, 0]), d = fallAfter(L);
  return lookCam([b.x, 0.62 - d + (L < 15 ? b.y - 0.62 : 0), b.z], [-0.2 + (b.x - 0.2) * 0, 0.9 - d, 0], 1000);
};
def({id: 'S01-B02-SH01', grade: 'neutral', paint: (p, L) => {
  const c = camSH07(L), t = ambT('S01-B02-SH01', L), y = d1Sh07(L), ctr: V3 = [D1_X, y, 0], d = fallAfter(L);
  paintMacro(p, c, {t});
  const pm = (x: number): Pt => camPoint(c, [x, D1_HANDS - d, 0]) ?? [540, 900];
  const my = L < 18 ? 0.3 : y + BUN_SM.bottom - 0.235 * 0.9;
  const mq = () => paintMosquito(p, c, [0.55, Math.min(0.3, my), 0], MOSQ_BL_SM, {view: 'left', state: L < 18 ? 'hover' : 'pressed', t, rimColor: '#e9b46a'});
  const wm = () => womanM(p, c, t, {face: L < 15 ? 'terrified' : 'scared', named: undefined, at: [W_M[0], W_M[1] - d, 0], palms: {r: pm(-0.82), l: pm(-0.68)}} as never);
  if (L >= 16) { mq(); wm(); } else { wm(); mq(); } // D-07L: from +16 she is drawn over every mosquito leg inside her silhouette (the SH11 cheat), so no leg crosses her face or hands
  paintBun(p, c, ctr, {t, phase: 2});
  if (L >= 15) paintFilm(p, c, ctr, {t});
}});

// ---- Dl shots: D1's centre world path ctr(L) falls 0.30 sm/f; the camera falls with it
const D1_Y0: Record<string, number> = {'S01-B02-SH02': -3.9, 'S01-B02-SH03': -12, 'S01-B02-SH05': -20, 'S01-B03-SH01': 6.8, 'S01-B03-SH02': -27, 'S01-B04-SH01': -12.1};
const d1ctr = (id: ShotId, L: number): V3 => [D1_X, D1_Y0[id] - FALL_SM_PER_F * Math.min(L, id === 'S01-B04-SH01' ? SH14.freezeAt : L), 0];
const dlCam = (ctr: V3, pos: V3, at: V3, f = 1000): YCam => lookCam([ctr[0] + pos[0], ctr[1] + pos[1], ctr[2] + pos[2]], [ctr[0] + at[0], ctr[1] + at[1], ctr[2] + at[2]], f);
const HER: V3 = [0, RIDER_Y - 0.04, -0.42], BUGPOS: V3 = [0, RIDER_Y, 0.4];

const paintUnder = (p: Painter, c: YCam, ctr: V3, t: number, L: number, o: {face: Parameters<typeof paintWoman>[2]['face']; cold?: number; hair?: boolean; legsAlive?: boolean; mosqPhase?: number; skipMosq?: boolean; bg?: () => void; skipBg?: boolean; ridersOnly?: boolean; place?: {wHead: Pt; wFeet: Pt; mHead: Pt; mTail: Pt}}) => {
  if (!o.skipBg && !o.ridersOnly) skyUp(p, o.cold ?? 0);
  if (!o.ridersOnly) o.bg?.();
  if (!o.ridersOnly) paintUnderface(p, c, ctr, {t, cold: o.cold});
  const dl = (v: V3): V3 => [ctr[0] + v[0], ctr[1] + v[1], ctr[2] + v[2]];
  const face = ctr[1] + BUN_SM.bottom, dep = dimpleDepth(L + 10, 0);
  if (!o.ridersOnly) paintDimple(p, c, ctr, dl([0, 0, -0.42]), 0.85, 0.28, dep, 43100);
  if (!o.ridersOnly) paintDimple(p, c, ctr, dl([0, 0, 0.4]), 0.75, 0.2, dep, 43150);
  const hp = camPoint(c, dl([-0.07, passengerY(0) - 0.04 + 0.0, -0.42])), u = camUnit(c, dl(HER)) ;
  void face;
  if (o.place) { // F-B11: both laid by their projected head -> feet / head -> tail anchors (rolled in the picture plane), the mosquito first so her hair and face draw over its legs
    const {wHead, wFeet, mHead, mTail} = o.place, mc: Pt = [(mHead[0] + mTail[0]) / 2, (mHead[1] + mTail[1]) / 2], mLen = Math.hypot(mTail[0] - mHead[0], mTail[1] - mHead[1]), mAng = (Math.atan2(mTail[1] - mHead[1], mTail[0] - mHead[0]) * 180) / Math.PI;
    withRoll(p, mc, mAng, () => drawMosquito(p, mc, mLen, {view: 'below', state: 'pressed', mirror: true, t, squash: 0.85, rimColor: '#e9b46a'}));
    const span = Math.hypot(wFeet[0] - wHead[0], wFeet[1] - wHead[1]), ang = (Math.atan2(wFeet[1] - wHead[1], wFeet[0] - wHead[0]) * 180) / Math.PI;
    paintPressedWoman(p, [wHead[0] + 0.44 * (wFeet[0] - wHead[0]), wHead[1] + 0.44 * (wFeet[1] - wHead[1])], span / WOMAN_H, t, o.face, {roll: -90 + ang});
    return;
  }
  if (hp) paintPressedWoman(p, hp, u, t, o.face);
  if (!o.skipMosq) {
    const g = camPoint(c, dl(BUGPOS)), ub = camUnit(c, dl(BUGPOS));
    if (g) drawMosquito(p, g, ub * MOSQ_BL_SM, {view: 'below', state: 'pressed', mirror: true, t, squash: 0.85, rimColor: '#e9b46a', pitchAdd: 0});
  }
};
export const camSH08 = (L: number) => (ctr: V3) => dlCam(ctr, mix3([0.1, -3.0, 1.6], [0.05, -2.75, 1.45], sm(0, 60, L)), [0, -0.95, 0]);
def({id: 'S01-B02-SH02', grade: 'neutral', paint: (p, L) => {
  const ctr = d1ctr('S01-B02-SH02', L), c = camSH08(L)(ctr), t = ambT('S01-B02-SH02', L);
  paintUnder(p, c, ctr, t, L, {face: 'scared'});
  paintSlowRain(p, c, t, {alpha: 0.7, skip: (d) => d.at[1] > ctr[1] - 1});
}});

// SH09 wide: D1 falls, passengers small on its underside, the world streams up
def({id: 'S01-B02-SH03', grade: 'neutral', paint: (p, L) => {
  const ctr = d1ctr('S01-B02-SH03', L), t = ambT('S01-B02-SH03', L), c = dlCam(ctr, mix3([2, 0.3, 6.6], [1.6, 0, 6], sm(0, 82, L)), [0, -0.6, 0]);
  paintMacro(p, c, {t, stream: {L}}); // F4-B09: the far layer scrolls up at 8 px/f, no static horizon edge
  paintStreamMotes(p, L); // N near motes (38-75 px/f) and G speed guide (24 px/f), behind the drop and riders
  paintBun(p, c, ctr, {t, phase: 2});
  const g = camPoint(c, [ctr[0], ctr[1] + BUN_SM.bottom, ctr[2]]), u = camUnit(c, ctr);
  if (g) { drawMosquito(p, [g[0] + 0.45 * u, g[1] + 0.25 * u], u * MOSQ_BL_SM, {view: 'below', state: 'pressed', t, squash: 0.3}); washAt(p, 56100, '#8a5a3b', 235, ell(g[0] - 0.4 * u, g[1] + 0.12 * u, 0.65 * u, 0.09 * u, 18), 0, 0); }
  paintFilm(p, c, ctr, {t});
}});

// SH10 feather insert
def({id: 'S01-B02-SH04', grade: 'neutral', paint: (p, L) => {
  const t = ambT('S01-B02-SH04', L), c = moveCam(L, 0, 45, [0, 0.05, 0.3], [0.18, 0.05, 0.3], [0, 0, 0], [0.18, 0, 0], 1000, 1000, 0.02); // F-B10: 0.30 m, ball 6.5 cm = 217 px, feather 6 cm = 200 px
  washAt(p, 56200, '#5b4a3c', 255, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]], 0, 0);
  [[250, 520, 260], [760, 820, 220], [540, 300, 180]].forEach(([x, y, r], i) => washAt(p, 56210 + i, '#f2b866', 80, ell(x, y, r, r, 22), 0.3, 0.1));
  // out-of-focus drip-curtain streaks behind the insert (soft pale columns that fall on the ambient clock)
  for (let i = 0; i < 9; i++) {
    const x = 70 + i * 120 + 30 * Math.sin(i * 2.1), ph = (t * (0.9 + 0.12 * i) + i * 0.37) % 1, y0 = -200 + ph * 2300, len = 260 + 70 * (i % 3);
    washAt(p, 56250 + i, '#d6e4ec', 34, [[x - 7, y0], [x + 7, y0], [x + 4, y0 + len], [x - 4, y0 + len]], 0.3, 0.1);
  }
  paintFeatherBall(p, c, L, t);
}});

// SH11 back: both riding loose
// F-B11 anchors (+0, Film's projection of Dl her z -0.42, mosquito z +0.40; they ride together, so the pair drifts with the camera arc to +57)
const SH11_PLACE = (L: number) => { const k = L / 57; return {wHead: [415 + 30 * k, 1085 - 10 * k] as Pt, wFeet: [899 + 25 * k, 950 - 8 * k] as Pt, mHead: [209 + 20 * k, 988 - 8 * k] as Pt, mTail: [780 + 25 * k, 759 - 5 * k] as Pt}; };
def({id: 'S01-B02-SH05', grade: 'neutral', paint: (p, L) => {
  const ctr = d1ctr('S01-B02-SH05', L), c = dlCam(ctr, mix3([1.35, -2.2, 1.9], [0.9, -2.35, 2.4], sm(0, 57, L)), [0, -0.95, 0]), t = ambT('S01-B02-SH05', L);
  paintUnder(p, c, ctr, t, L, {face: L < 20 ? 'worried' : 'neutral', place: SH11_PLACE(L)});
}});

// SH12 the reveal (F-B12): hold over the rim, then swing +20..+75 to a 50 deg look-down at the lake and hold; D1 centre y = 2.095 - (9.0 + 0.03 L) (D1 track)
const d1Sh12 = (L: number): V3 => [D1_X, 2.095 - (9.0 + 0.03 * L), 0];
export const camSH12 = (L: number): YCam => {
  const k = sm(20, 75, L);
  return dlCam(d1Sh12(L), mix3([1.9, -0.6, 1.4], [2.2, 0.3, 1.7], k), mix3([0, -1.0, 0], [1.41, -0.89, 1.09], k));
};
const paintStepAndCrate = (p: Painter, c: YCam) => { // far edge of the lake: the concrete step edge and a crate corner (M, sm)
  const z0 = PUDDLE.c[1] - PUDDLE.rz - 12;
  paintBox(p, c, 42600, {x0: -330, x1: 190, y0: GROUND_Y, y1: GROUND_Y + 7, z0: z0 - 30, z1: z0}, '#6f736f', {top: -0.08}, {ink: true});
  paintBox(p, c, 42620, {x0: -40, x1: 22, y0: GROUND_Y, y1: GROUND_Y + 26, z0: z0 - 8, z1: z0 + 50}, '#4f7f9a', {}, {ink: true});
};
def({id: 'S01-B03-SH01', grade: 'cold', paint: (p, L) => {
  const t = ambT('S01-B03-SH01', L), ctrL = d1Sh12(L), c = camSH12(L);
  paintMacroBackdrop(p, c, {glow: 0.7});
  paintMacro(p, c, {t, look: 'down', lake: true, glow: 0.7});
  paintStepAndCrate(p, c);
  paintLakeDetail(p, c, t);
  // riders under the face (head -> feet / mosquito head -> tail by projection), drawn under the drop
  const fy = ctrL[1] + BUN_SM.bottom, W = (x: number, z: number) => camPoint(c, [ctrL[0] + x, fy - 0.04, ctrL[2] + z]);
  const wh = W(-0.88, -0.42), wf = W(0.74, -0.42), mh = W(-0.8, 0.4), mt = W(0.8, 0.4);
  if (wh && wf && mh && mt) paintUnder(p, c, ctrL, t, L, {face: 'terrified', skipBg: true, place: {wHead: wh, wFeet: wf, mHead: mh, mTail: mt}} as never);
  paintBun(p, c, ctrL, {t, phase: 1});
  // F2-B12 (4) / D-12R: the riders are seen through the clear water from above. Redrawn over the bun at 70 % with a cool tint (#9fc4d4 about 30 %), so the opaque rim band
  // over a rider shows through at <= 30 %; the first, sharp pass stays where a rider lies outside the bun.
  if (wh && wf && mh && mt) {
    const q = tintPainter(p.layer(0.7, 57100), '#9fc4d4', 0.3, {brush: true});
    paintUnder(q, c, ctrL, t, L, {face: 'terrified', ridersOnly: true, place: {wHead: wh, wFeet: wf, mHead: mh, mTail: mt}} as never);
  }
}});

// SH13 close on her from below
def({id: 'S01-B03-SH02', grade: 'cold', paint: (p, L) => {
  const ctr = d1ctr('S01-B03-SH02', L), c = dlCam(ctr, mix3([-0.8, -1.95, 0.3], [-0.78, -1.88, 0.2], sm(0, 43, L)), [-0.6, -0.99, -0.42]), t = ambT('S01-B03-SH02', L);
  paintUnder(p, c, ctr, t, L, {face: 'terrified', cold: 0.6, skipMosq: true});
}});

// SH14 the ruler: ticks stream past to 20 and time stops (both clocks hold over +65..+107, only overlays move)
const camSH14 = (L: number) => (ctr: V3) => dlCam(ctr, mix3([0.6, -3.3, 3.0], [0.55, -3.1, 2.85], sm(0, 65, Math.min(L, 65))), [0.8, -1.2, 0]);
const sh14Frame = (L: number) => {
  const k = clockOf('S01-B04-SH01', L), ctr = d1ctr('S01-B04-SH01', k.ev), c = camSH14(k.ev)(ctr), glow = L < SH14.glow[0] ? 0.6 : 0;
  return {k, ctr, c, glow};
};
def({id: 'S01-B04-SH01', grade: 'cold', paint: (p, L) => {
  const {k, ctr, c} = sh14Frame(L), t = k.amb / 30;
  paintUnder(p, c, ctr, t, k.ev, {face: 'worried', cold: 0.7});
  paintRuler(p, c, {ev: k.ev, glow: glowAt(L), z: 0, faceY: ctr[1] + BUN_SM.bottom});
}, ot03: (L) => { // OT03 sits left of tick 20, on the bar's left edge, so the label stays inside x 1020 (F-B14)
  const {k, ctr, c} = sh14Frame(L);
  return camPoint(c, [RULER.x - 0.09 - 0.12, tickY(20, k.ev, ctr[1] + BUN_SM.bottom), 0], 0.3);
}});
const glowAt = (L: number) => (L < SH14.glow[0] ? 0 : L < SH14.glow[1] ? 0.6 + 0.4 * ease(clamp01((L - SH14.glow[0]) / 7.5)) : 0.8);

// SH15 hypothetical `Mh`: a mosquito alone low over a puddle; D2 hits it at +50 and carries it down; cut before contact with the water
const D2_HIT = 50, MH_WATER = -21.95;
const d2s = (n: number) => FALL_D2 * Math.max(0, n - D2_HIT);
// F-B15: pitch 31 deg from +0; from +50 the camera falls with D2 and tilts to 40 deg, so the water is under the mosquito (+113: 278 px clear band)
const camSH15 = (n: number) => {
  const s = d2s(n);
  return n < D2_HIT ? lookCam([1.6, 0.4, 4.4], [0, -2.4, 0], 1000) : lookCam([1.6, 0.4 - s, 4.4], [0, -2.4 - s - 1.2 * sm(0, 63, n - D2_HIT), 0], 1000);
};
def({id: 'S01-B04-SH02', grade: 'coldest', paint: (p, L) => {
  const c = camSH15(L), t = ambT('S01-B04-SH02', L), s = d2s(L);
  skyUp(p, 1);
  paintWaterPlane(p, c, MH_WATER, t, {cold: 1});
  paintSlowRain(p, c, t, {alpha: 0.6, skip: (d) => d.at[1] < MH_WATER + 2});
  const ctr: V3 = [0, L < D2_HIT ? FALL_D2 * (D2_HIT - L) : -s, 0]; // D2 falls onto the mosquito's back at +50 (R04), from above
  const hit = L >= D2_HIT, ay = hit ? anchorUnderFace(ctr[1] + BUN_SM.bottom, MOSQ_BL_SM, 'pressed') : RIDER_Y;
  // F2-B15 / D-15R: D2 and the mosquito mirrored about the water plane (y' = 2 * MH_WATER - y) at 30 %, cool tint, cut by 5 horizontal ripple bands: the gap between the
  // mosquito and its reflection is the cue that it does not touch the water (A08, R04). Rolled 180 deg about its own projected centre = a vertical flip.
  const my = (y: number) => 2 * MH_WATER - y, rctr: V3 = [ctr[0], my(ctr[1]), ctr[2]], rg = camPoint(c, rctr, 0.3);
  if (rg) {
    const rp = tintPainter(p.layer(0.3, 57300), '#cfe0e8', 0.5, {brush: true});
    withRoll(rp, rg, 180, () => paintBun(rp, c, rctr, {t, seed: 40700, glow: false}));
    const ma: V3 = [0, my(ay), 0], mg = camPoint(c, ma, 0.3);
    if (mg) withRoll(rp, mg, 180, () => paintMosquito(rp, c, ma, MOSQ_BL_SM, {view: 'left', state: hit ? 'pressed' : 'hover', t, rimColor: '#a8bcd0'}));
    const u = camUnit(c, rctr, 0.3), hw = BUN_SM.w * u * 0.8, top = camPoint(c, [rctr[0], rctr[1] + BUN_SM.top, rctr[2]], 0.3), bot = camPoint(c, [rctr[0], rctr[1] + BUN_SM.bottom, rctr[2]], 0.3);
    if (top && bot) for (let i = 0; i < 5; i++) { // ripple bands in the water colour across the reflection
      const y0 = Math.min(top[1], bot[1]) + ((i + 0.5) / 5) * Math.abs(bot[1] - top[1]), h = 2 + 2 * hash(57320 + i);
      washAt(p, 57330 + i, mixColor(MC.puddle, '#8fb0c0', 0.25), 255, [[rg[0] - hw, y0], [rg[0] + hw, y0], [rg[0] + hw, y0 + h], [rg[0] - hw, y0 + h]], 0.2, 0.05);
    }
  }
  paintBun(p, c, ctr, {t, seed: 40700});
  paintMosquito(p, c, [0, ay, 0], MOSQ_BL_SM, {view: 'right', state: hit ? 'pressed' : 'hover', t, rimColor: '#a8bcd0'});
  if (hit) paintFilm(p, c, ctr, {t});
}});

// SH16 rewind: frozen on SH04 +31, reverse play to +17, then the replay of D0 and the camera follows down onto its underside (D0 falls 0.16 sm/f)
export const d0ReplayY = (n: number) => D0_C17 - sh16Fall(n);
const camSH16 = (L: number): YCam => {
  const c31 = camSH04(31);
  if (L < SH16.contact) return c31;
  const rel = (n: number): V3 => { const a = 6 * (Math.PI / 180) * sm(70, 114, n); return [0.45 * Math.cos(a) + 2.35 * Math.sin(a), -1.55, 2.35 * Math.cos(a) - 0.45 * Math.sin(a)]; };
  const tgt = (n: number) => { const ctr: V3 = [D0_X, d0ReplayY(Math.max(n, 70)) , D0_Z], r = rel(n); return {pos: [ctr[0] + r[0], ctr[1] + r[1], ctr[2] + r[2]] as V3, at: [ctr[0], ctr[1] + RIDER_Y, ctr[2]] as V3}; };
  const T = tgt(L), u = sm(SH16.contact, 70, L), f = lerp(1000, 1300, u);
  const p31: V3 = [c31.x, c31.y, c31.z], a31: V3 = [0.765, 0.674, -0.1];
  return lookCam(L >= 70 ? T.pos : mix3(p31, T.pos, u), L >= 70 ? T.at : mix3(a31, T.at, u), f);
};
def({id: 'S01-B05-SH01', grade: 'warm', paint: (p, L) => {
  const k = clockOf('S01-B05-SH01', L), c = camSH16(L);
  if (k.src === 'S01-B01-SH04') { paintSH04(p, k.ev, c, k.amb / 30); return; }
  const t = ambT('S01-B05-SH01', L), ctr: V3 = [D0_X, d0ReplayY(L), D0_Z];
  paintMacro(p, c, {t});
  if (L < 70) womanM(p, c, t, {face: 'scared', fig: {headCock: 8}});
  paintBun(p, c, ctr, {t, seed: 40500});
  paintMosquito(p, c, [ctr[0], anchorUnderFace(ctr[1] + BUN_SM.bottom, MOSQ_BL_SM, 'pressed'), ctr[2]], MOSQ_BL_SM, {view: 'left', state: 'pressed', t, rimColor: '#e9b46a'});
  paintFilm(p, c, ctr, {t});
}});

// SH17 it tips, slides off the side and flies; D0 rushes on and splashes in the puddle on the last frame
// F4-B17 (D4-17): +0..+52 as R2.0; the camera holds its `M` position from +52 and tilts +54..+66 to pitch -85.8 deg, held to +87; the touch is at +72 (f1167)
const camSH17pos = (L: number): {pos: V3; at: V3} => {
  const k = sm(12, 52, L), ctrY = D0_C17 - sh17Fall(Math.min(L, 52));
  const rel = mix3([0.45, -1.55, 2.35], [1.3, -1.2, 2.4], k), at = mix3([0, -0.95, 0], [1, -1.1, 0], k);
  return {pos: [D0_X + rel[0], ctrY + rel[1], D0_Z + rel[2]], at: [D0_X + at[0], ctrY + at[1], D0_Z + at[2]]};
};
export const camSH17 = (L: number): YCam => {
  const m = camSH17pos(Math.min(L, 52));
  if (L <= 52) return lookCam(m.pos, m.at, 1300);
  const down: V3 = [m.pos[0] - 0.202, m.pos[1] - 5.743, m.pos[2] - 0.372];
  return lookCam(m.pos, mix3(m.at, down, sm(54, 66, L)), 1300);
};
const SH17_LAND = SH17.ramp[1];
const LAND: V3 = [D0_X, PUDDLE.y, D0_Z];
def({id: 'S01-B05-SH02', grade: 'warm', paint: (p, L) => {
  const c = camSH17(L), t = ambT('S01-B05-SH02', L), ctr: V3 = [D0_X, D0_C17 - sh17Fall(L), D0_Z];
  paintMacro(p, c, {t, lake: true, glow: 1.15});
  if ((c.pitch ?? 0) < -0.6) paintLakeDetail(p, c, t); // once the camera looks down at the puddle it must read as water
  if (L <= SH17_LAND) paintBun(p, c, ctr, {t, seed: 40500}); // from the touch the drop is the crown
  const face = ctr[1] + BUN_SM.bottom;
  let at: V3 = [ctr[0], anchorUnderFace(face, MOSQ_BL_SM, 'pressed'), ctr[2]], state: MosqState = L < 12 ? 'pressed' : 'tip', pitch = 0;
  if (L >= 12) pitch = 35 * sm(12, 34, L);
  const slide = 1.9 * sm(34, 52, L);
  at = [ctr[0] + slide, L <= 52 ? at[1] : D0_C17 - sh17Fall(52) + BUN_SM.bottom - 0.235, ctr[2]];
  if (L > 52) { const u = sm(54, 70, L); state = 'clear'; pitch = 6; at = [at[0] + 3.5 * u, at[1] + 2.4 * u, at[2]]; }
  paintMosquito(p, c, at, MOSQ_BL_SM, {view: L <= 54 ? 'left' : 'right', state, pitchAdd: pitch, t, rimColor: '#e9b46a'});
  if (L <= 52) paintFilm(p, c, ctr, {t});
  // F4-B17: the crown opens from the touch at +72 (f = L - 72, full open +86), outer ring ~118 px at (540, 1000); one ripple ring from its edge over +76..+87
  paintSplashCrown(p, c, LAND, L >= SH17_LAND ? L - SH17_LAND : -1, {width: CROWN_W, lineW: 2.5, flat: true});
  paintCrownRipple(p, c, LAND, L);
}});

// SH18-SH21 full size `H`
const toteShoulder = (p: Painter, a: {lShoulder: Pt; head: Pt}, u: number) => {
  const sx = a.lShoulder[0] + 0.02 * u, sy = a.lShoulder[1];
  washAt(p, 56300, '#d9cbb0', 245, [[sx - 0.17 * u, sy + 0.04 * u], [sx + 0.05 * u, sy + 0.04 * u], [sx + 0.07 * u, sy + 0.5 * u], [sx - 0.17 * u, sy + 0.5 * u]], 0.05, 0.1);
  washAt(p, 56301, '#3f6f55', 245, [[sx - 0.17 * u, sy + 0.2 * u], [sx + 0.06 * u, sy + 0.2 * u], [sx + 0.065 * u, sy + 0.25 * u], [sx - 0.17 * u, sy + 0.25 * u]], 0.02, 0.05);
  washAt(p, 56302, '#3f6f55', 240, [[sx - 0.06 * u, sy - 0.02 * u], [sx - 0.04 * u, sy - 0.02 * u], [sx - 0.04 * u, sy + 0.08 * u], [sx - 0.06 * u, sy + 0.08 * u]], 0, 0);
};
def({id: 'S01-B05-SH03', grade: 'warm', paint: (p, L) => {
  const c = moveCam(L, 0, 21, [0.8, 1.32, 2.05], [0.78, 1.3, 1.9], [0.55, 1.02, -0.12], [0.55, 1.02, -0.12]), t = ambT('S01-B05-SH03', L);
  paintSoi(p, c, {t});
  paintWoman(p, c, {at: SOI.W, view: 'front', face: 'tired', pose: 'P09', t, fig: {rise: 0.012 * Math.sin(t * Math.PI * 2 * 1.8 * 0.9)}, // F-B18: P09 hands on hips, idle-breathe x1.8
     held: (q, a, u) => toteShoulder(q, a, u)});
  paintCurtain(p, c, {t, span: [-1.2, 2.2], density: 0.7});
  paintFall(p, 'rain', {width: 1080, height: 1920, t, captionBand: [1176, 1344]});
}});
export const MOSQ_END: V3 = [0.666, 0.206, 0.053]; // SH19-SH21 anchor: >= 0.198 m above the lane water (F-B19)
const mosqHeld = (p: Painter, c: YCam, t: number, at: V3, o: {view?: 'left' | 'right'} = {}) => paintMosquito(p, c, at, MOSQ_BL_M, {view: o.view ?? 'left', state: 'hover', t, blur: true, rimColor: '#e9b46a'});
// SH19 (F-B19): the lens 0.09 m from the mosquito, which hangs against the lit shop between her calves; one stream 2 cm to its left, the drip curtain around it
/** Drip-curtain streams seen from a few cm (F2-B19): each a column of falling elongated drops (`paintStream`), no continuous line and no round beads. */
const paintCloseStreams = (p: Painter, c: YCam, t: number, xs: number[], z: number, top = 0.6) => xs.forEach((x, i) => paintStream(p, c, t, x, z, 20 + i, {y0: 0.02, y1: top, thread: false, speed: 2.4 + 0.3 * i}));
const camSH19 = (L: number) => moveCam(L, 0, 51, [0.71, 0.19, 0.13], [0.74, 0.19, 0.12], [0.55, 0.26, -0.14], [0.57, 0.26, -0.14], 1000, 1000, 0.02);
def({id: 'S01-B05-SH04', grade: 'warm', paint: (p, L) => {
  const c = camSH19(L), t = ambT('S01-B05-SH04', L);
  paintSoi(p, c, {t});
  paintWoman(p, c, {at: SOI.W, view: 'front', face: 'tired', t, shadow: false});
  paintCloseStreams(p, c, t, [MOSQ_END[0] - 0.02, MOSQ_END[0] + 0.035, MOSQ_END[0] + 0.09, MOSQ_END[0] - 0.075], 0.02); // one stream 2 cm to its left, more around and past it
  mosqHeld(p, c, t, MOSQ_END);
}});
// SH20 (F-B20): the camera tips down over the puddle (pitch 56 deg), the mosquito 0.095 m from the lens, the water filling y ~830-1920
const camSH20 = (L: number) => { const u = sm(5, 50, L); return lookCam(mix3([0.74, 0.19, 0.12], [0.70, 0.25, 0.13], u), mix3([0.57, 0.26, -0.14], [0.6595, 0.1017, 0.0383], u), 1000, 0.02); };
def({id: 'S01-B05-SH05', grade: 'warm', paint: (p, L) => {
  const c = camSH20(L), t = ambT('S01-B05-SH05', L);
  paintSoi(p, c, {t, richPuddle: true});
  paintWoman(p, c, {at: SOI.W, view: 'front', face: 'tired', t, shadow: false});
  paintCloseStreams(p, c, t, [0.52, 0.6, 0.72, 0.79], 0.02, 0.2);
  mosqHeld(p, c, t, MOSQ_END);
}});
// SH21 (F-B21): slap-ankle, the right palm on her left ankle (0.58, 0.18, -0.12) = (526, 1081) at +18, the left hand on her left knee; the mosquito dodges and returns,
// with a soft wing glint (<= 14 px, 4 f at +23, +46, +74, +100: Q1 default A) and her gaze on it from +30
const GLINT = [23, 46, 74, 100];
export const camSH21 = (L: number) => moveCam(L, 0, 129, [1.05, 0.95, 2.3], [1.0, 0.93, 2.18], [0.62, 0.5, -0.1], [0.62, 0.5, -0.1]);
// F4-B21 (D4-21; Film's (0.84, 0.34, 0.11) / (0.80, 0.30, 0.10) moved 0.05 m right and 0.02 m up: with the +-10 px wander they left under 30 px to the sandal, see handoff): +0..+12 at the slap's target, +12..+22 it dodges up and right, +40..+72 it settles against the pale step riser clear of her shin and sandal, then hovers
// to +129 with a small wander (two sines, 0.9 and 1.4 Hz, +-10 px x, +-6 px y, on the ambient clock). Drawn 3x true size (recorded cheat, extends D-50).
const MOSQ21_DODGE: V3 = [0.89, 0.36, 0.11], MOSQ21_REST: V3 = [0.86, 0.32, 0.10], MOSQ21_SCALE = 3;
const mosqSH21 = (L: number): V3 => L < 12 ? MOSQ_END : L < 22 ? lerpV(MOSQ_END, MOSQ21_DODGE, sm(12, 22, L)) : L < 40 ? MOSQ21_DODGE : lerpV(MOSQ21_DODGE, MOSQ21_REST, sm(40, 72, L));
/** Wander offset in px (x, y) at SH21-local `L`: zero before +72, eased in over +72..+80. */
export const wander21 = (L: number): Pt => { const k = sm(72, 80, L), t = L / 30; return [10 * k * Math.sin(2 * Math.PI * 0.9 * t), 6 * k * Math.sin(2 * Math.PI * 1.4 * t + 1.3)]; };
def({id: 'S01-B05-SH06', grade: 'warm', paint: (p, L) => {
  const c = camSH21(L), t = ambT('S01-B05-SH06', L), m0 = mosqSH21(L), mp0 = camPoint(c, m0), w = wander21(L);
  const um = mp0 ? camUnit(c, m0) : 1, m: V3 = [m0[0] + w[0] / um, m0[1] - w[1] / um, m0[2]], mp = mp0 ? [mp0[0] + w[0], mp0[1] + w[1]] as Pt : null;
  const ankle = camPoint(c, [0.58, 0.18, -0.12]) ?? [526, 1081] as Pt, feet = camPoint(c, SOI.W) ?? [540, 1300] as Pt, u = camUnit(c, SOI.W);
  paintSoi(p, c, {t});
  // gaze (D4-21): from +30 to +129 her pupils aim at the mosquito (screen right-down), head cocked 8 deg toward it
  const gz = sm(30, 36, L);
  paintWoman(p, c, {at: SOI.W, view: 'front', named: {name: 'slap-ankle', L}, face: L < 22 ? 'angry' : 'suspicious', faceState: L >= 30 && mp ? {look: [1.1 * gz, 0.9 * gz]} : undefined, fig: L >= 30 ? {headCock: 8 * gz} : undefined, t, shadow: true,
    slap: {ankle, knee: [feet[0] + 0.13 * u, feet[1] - 0.43 * u]}});
  void feet;
  paintCurtain(p, c, {t, span: [-1.2, 2.2], density: 0.7});
  const mm = paintMosquito(p, c, m, MOSQ_BL_M * MOSQ21_SCALE, {view: 'left', state: 'hover', t, blur: false, rimColor: '#e9b46a'});
  if (mm) { // D4-21 findability: a dark `#1b1d22` body about 6 px long and hairline legs over the 3x drawing (a dark speck against the pale riser)
    inkLine(p, 56420, [mm.head, mm.tail], {weight: 3.4, color: '#1b1d22', closed: false, curve: 0, still: true});
    mm.toes.forEach((q, i) => inkLine(p, 56421 + i, [mm.centre, q], {weight: 0.8, color: '#1b1d22', closed: false, curve: 0, still: true}));
  }
  if (mp && GLINT.some((g) => L >= g && L < g + 4)) { // the wing-pair glint (Q1 = A, 4x): two soft white ovals 12 x 5 px, +-35 deg from the body axis, core alpha 0.9
    [-1, 1].forEach((s2, i) => { const a = (s2 * 35 * Math.PI) / 180; washAt(p, 56400 + i, '#ffffff', 230, ell(mp[0] + 6 * Math.cos(a), mp[1] - 2 + 6 * Math.sin(a), 6, 2.5, 12, a), 0.15, 0); });
  }
  paintFall(p, 'rain', {width: 1080, height: 1920, t, captionBand: [1176, 1344]});
}});

// ---------------------------------------------------------------- the plate
export const SHOT_IDS = SHOT_TABLE.map(([id]) => id) as ShotId[];
export const shotDef = (id: ShotId): ShotDef => SH[id];
const startOf = (id: ShotId) => SHOT_TABLE.find(([k]) => k === id)![1];

/** Screen overlays (OT01-OT03) of one shot at shot-local frame L, by the global frame. */
export const ShotOverlay = ({id, L}: {id: ShotId; L: number}): ReactNode => {
  const f = startOf(id) + L, d = SH[id];
  return <><Ot01 f={f} /><Ot02 f={f} /><Ot03 f={f} at={d.ot03 ? d.ot03(L) : null} /></>;
};

/** One shot, drawn from its composition frame (the plate mounts it in a Freeze at the shot-local frame). */
export const ShotFrame = ({id}: {id: ShotId}) => {
  const L = useCurrentFrame(), d = SH[id];
  return (
    <Painted paint={(p, frame) => d.paint(p, Math.min(frame, lenOf(id) - 1))} grade={d.grade} push={d.push?.(L)}>
      <ShotOverlay id={id} L={L} />
    </Painted>
  );
};
void paintTote; void balanceAngle; void shrinkAbout; void FALL_REPLAY;
