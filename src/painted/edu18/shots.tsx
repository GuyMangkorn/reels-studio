import type {ReactNode} from 'react';
import {useCurrentFrame} from 'remotion';
import {ell, washAt} from '../kit/draw';
import {paintFall} from '../kit/fall';
import {hipAnchor} from '../kit/figure-at';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {ease, clamp01, type V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintDrop14} from '../kit/water-drop';
import {balanceAngle, paintBalance} from './balance';
import {lookCam, mix3, moveCam} from './cams';
import {clockOf, FALL_D2, FALL_REPLAY, FALL_SM_PER_F, lenOf, lerp, SH04, SH14, SH16, sh16Fall, sh17Fall, sm, SHOT_TABLE, type ShotId} from './clock';
import {paintDimple, paintFilm, paintUnderface, dimpleDepth, passengerY} from './dropcontact';
import {paintShrinkPop, paintSplashCrown, shrinkAbout, shrinkScale} from './effects';
import {paintFeatherBall} from './feather';
import {Ot01, Ot02, Ot03} from './labels';
import {BUN_SM, paintBun, paintMacro, paintMacroBackdrop, paintSlowRain, paintWaterPlane, PUDDLE, wobble} from './macro';
import {anchorUnderFace, drawMosquito, MOSQ_BL_M, MOSQ_BL_SM, mosqReachAbove, paintMosquito, type MosqState} from './mosquito';
import {Painted, type Grade} from './look';
import {paintRuler, tickY} from './ruler';
import {paintCurtain, paintSoi, SOI} from './soi';
import {paintTote, paintWoman, withShrink, WOMAN} from './woman';

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
const paintPressedWoman = (p: Painter, hip: Pt, u: number, t: number, face: Parameters<typeof paintWoman>[2]['face'], o: {legs?: boolean} = {}) => {
  const base = hipAnchor(WOMAN, [0, 0], u, {view: 'front'}), g: Pt = [hip[0] - base[0], hip[1] - base[1]];
  const kick = o.legs === false ? undefined : {r: {hip: -28, knee: 0}, l: {hip: -28, knee: 0}};
  void kick;
  return paintWoman(p, PX(u), {at: [(g[0] - 540) / u, -g[1] / u, 0], view: 'front', named: {name: 'pressed-spread', L: 0}, face, t, roll: -90, shadow: false});
};

// ---------------------------------------------------------------- the shots
type ShotDef = {id: ShotId; grade: Grade; paint: (p: Painter, L: number) => void; push?: (L: number) => {s: number; at: Pt}; ot03?: (L: number) => Pt | null};
const SH: Record<string, ShotDef> = {};
const def = (d: ShotDef) => { SH[d.id] = d; };
const ambT = (id: ShotId, L: number) => clockOf(id, L).amb / 30;

// SH01 ankle height, a mosquito hanging steady in the downpour; her feet run in from the right
const camSH01 = (L: number) => moveCam(L, 0, 29, [1.13, 0.16, 0.66], [1.15, 0.165, 0.69], [1.85, 0.34, 1.45], [1.7, 0.3, 1.3], 1000, 1000, 0.02);
const runAt = (id: ShotId, L: number): V3 => {
  if (id === 'S01-B01-SH01') return [lerp(1.62, 1.45, L / 30), 0, lerp(1.22, 1.15, L / 30)];
  return [lerp(1.45, 1.25, sm(0, 8, L)), 0, lerp(1.15, 0.95, sm(0, 8, L))];
};
def({id: 'S01-B01-SH01', grade: 'neutral', paint: (p, L) => {
  const c = camSH01(L), t = ambT('S01-B01-SH01', L);
  paintSoi(p, c, {t, puddle: false});
  paintWoman(p, c, {at: runAt('S01-B01-SH01', L), view: 'left', named: {name: 'bag-over-head', L}, face: 'worried', t});
  paintCurtain(p, c, {t, span: [0.2, 2.4], density: 0.6});
  paintMosquito(p, c, [1.19, 0.2, 0.71], MOSQ_BL_M, {view: 'left', state: 'hover', t, blur: true, rimColor: '#9aa8b8'});
  paintFall(p, 'rain', {width: 1080, height: 1920, t, seed: 7, style: {count: 22, weight: 4, len: [180, 260]}, captionBand: [1176, 1344]});
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
  paintMacro(p, c, {t});
  womanM(p, c, t, {face: 'scared', fig: {headCock: -6 * sm(16, 34, L)}, named: undefined});
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
const camSH05 = (L: number) => moveCam(L, 0, 25, [-0.55, -1.8, 1.45], [-0.55, -1.72, 1.32], [-0.75, 0.9, 0], [-0.75, 0.9, 0]);
def({id: 'S01-B01-SH05', grade: 'neutral', paint: (p, L) => {
  const c = camSH05(L), t = ambT('S01-B01-SH05', L);
  paintMacro(p, c, {t});
  womanM(p, c, t, {face: 'terrified', fig: {lArm: undefined}, named: undefined, pose: undefined} as never);
  paintBun(p, c, [-0.75, 3.2 - 0.003 * L, 0], {t, phase: 2});
  paintMosquito(p, c, [0.6, 0.9, 0.3], MOSQ_BL_SM, {view: 'left', state: 'hover', t, rimColor: '#e9b46a'});
}});

// SH06 balance diagram on the fixed plane
def({id: 'S01-B01-SH06', grade: 'neutral', push: (L) => ({s: 1 + 0.08 * clamp01(L / 75), at: [540, 820]}), paint: (p, L) => {
  const t = ambT('S01-B01-SH06', L), c = lookCam([0, 0, 5.4], [0, 0, 0], 1000);
  paintMacroBackdrop(p, c, {glow: 0.8});
  paintSlowRain(p, lookCam([0, 0, 6], [0, 0, 0], 1000), t, {alpha: 0.8});
  paintDrop14(p, [540, 60], 190, {kind: 'bun', ...wobble(t)}, {seed: 40900, light: -1});
  const bal = paintBalance(p, L);
  const drop = (L0: number) => -520 * (1 - ease(clamp01(L / L0)));
  const u = 185;
  if (L >= 1) paintWoman(p, PX(u), {at: [(bal.left[0] - 540) / u, -(bal.left[1] + drop(4)) / u, 0], view: 'front', named: undefined, face: L >= 55 ? 'relieved' : 'surprised', t, shadow: false});
  if (L >= 1) drawMosquito(p, [bal.right[0], bal.right[1] + drop(8) - 0.62 * 300 * 0.95], 300, {view: 'right', state: 'hover', t, blur: false, rimColor: '#e9b46a'});
}});

// SH07 slow motion: D1 meets her raised palms at +15 and the mosquito's back at +18
export const D1_HANDS = W_M[1] + 2.02;
export const d1Sh07 = (L: number) => D1_HANDS + 0.0 - BUN_SM.bottom + FALL_SM_PER_F * (15 - L);
const camSH07 = (L: number) => moveCam(L, 0, 34, [0.2, 0.6, 3.1], [0.15, 0.62, 2.8], [-0.2, 0.9, 0], [-0.2, 0.9, 0]);
def({id: 'S01-B02-SH01', grade: 'neutral', paint: (p, L) => {
  const c = camSH07(L), t = ambT('S01-B02-SH01', L), y = d1Sh07(L), ctr: V3 = [D1_X, y, 0];
  paintMacro(p, c, {t});
  const lean = ease(clamp01((L - 15) / 19));
  womanM(p, c, t, {face: L < 15 ? 'terrified' : 'scared', named: undefined, fig: {lean: 0.0}} as never);
  void lean;
  const my = L < 18 ? 0.3 : y + BUN_SM.bottom - 0.235 * 0.9;
  paintMosquito(p, c, [0.25, Math.min(0.3, my), 0], MOSQ_BL_SM, {view: 'left', state: L < 18 ? 'hover' : 'pressed', t, rimColor: '#e9b46a'});
  paintBun(p, c, ctr, {t, phase: 2});
  if (L >= 15) paintFilm(p, c, ctr, {t});
}});

// ---- Dl shots: D1's centre world path ctr(L) falls 0.30 sm/f; the camera falls with it
const D1_Y0: Record<string, number> = {'S01-B02-SH02': -3.9, 'S01-B02-SH03': -12, 'S01-B02-SH05': -20, 'S01-B03-SH01': 6.8, 'S01-B03-SH02': -27, 'S01-B04-SH01': -12.1};
const d1ctr = (id: ShotId, L: number): V3 => [D1_X, D1_Y0[id] - FALL_SM_PER_F * Math.min(L, id === 'S01-B04-SH01' ? SH14.freezeAt : L), 0];
const dlCam = (ctr: V3, pos: V3, at: V3, f = 1000): YCam => lookCam([ctr[0] + pos[0], ctr[1] + pos[1], ctr[2] + pos[2]], [ctr[0] + at[0], ctr[1] + at[1], ctr[2] + at[2]], f);
const HER: V3 = [0, RIDER_Y - 0.04, -0.42], BUGPOS: V3 = [0, RIDER_Y, 0.4];

const paintUnder = (p: Painter, c: YCam, ctr: V3, t: number, L: number, o: {face: Parameters<typeof paintWoman>[2]['face']; cold?: number; hair?: boolean; legsAlive?: boolean; mosqPhase?: number; skipMosq?: boolean; bg?: () => void}) => {
  skyUp(p, o.cold ?? 0);
  o.bg?.();
  paintUnderface(p, c, ctr, {t, cold: o.cold});
  const dl = (v: V3): V3 => [ctr[0] + v[0], ctr[1] + v[1], ctr[2] + v[2]];
  const face = ctr[1] + BUN_SM.bottom, dep = dimpleDepth(L + 10, 0);
  paintDimple(p, c, ctr, dl([0, 0, -0.42]), 0.85, 0.28, dep, 43100);
  paintDimple(p, c, ctr, dl([0, 0, 0.4]), 0.75, 0.2, dep, 43150);
  const hp = camPoint(c, dl([-0.07, passengerY(0) - 0.04 + 0.0, -0.42])), u = camUnit(c, dl(HER)) ;
  void face;
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
  paintMacro(p, c, {t});
  paintBun(p, c, ctr, {t, phase: 2});
  const g = camPoint(c, [ctr[0], ctr[1] + BUN_SM.bottom, ctr[2]]), u = camUnit(c, ctr);
  if (g) { drawMosquito(p, [g[0] + 0.45 * u, g[1] + 0.25 * u], u * MOSQ_BL_SM, {view: 'below', state: 'pressed', t, squash: 0.3}); washAt(p, 56100, '#8a5a3b', 235, ell(g[0] - 0.4 * u, g[1] + 0.12 * u, 0.65 * u, 0.09 * u, 18), 0, 0); }
  paintFilm(p, c, ctr, {t});
}});

// SH10 feather insert
def({id: 'S01-B02-SH04', grade: 'neutral', paint: (p, L) => {
  const t = ambT('S01-B02-SH04', L), c = moveCam(L, 0, 45, [0, 0.05, 0.45], [0.18, 0.05, 0.45], [0, 0, 0], [0.18, 0, 0]);
  washAt(p, 56200, '#5b4a3c', 255, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]], 0, 0);
  [[250, 520, 260], [760, 820, 220], [540, 300, 180]].forEach(([x, y, r], i) => washAt(p, 56210 + i, '#f2b866', 80, ell(x, y, r, r, 22), 0.3, 0.1));
  paintFeatherBall(p, c, L, t);
}});

// SH11 back: both riding loose
def({id: 'S01-B02-SH05', grade: 'neutral', paint: (p, L) => {
  const ctr = d1ctr('S01-B02-SH05', L), c = dlCam(ctr, mix3([1.35, -2.2, 1.9], [0.9, -2.35, 2.4], sm(0, 57, L)), [0, -0.95, 0]), t = ambT('S01-B02-SH05', L);
  paintUnder(p, c, ctr, t, L, {face: L < 20 ? 'worried' : 'neutral'});
}});

// SH12 the reveal: over the rim, tilt down to the ground and the puddle
def({id: 'S01-B03-SH01', grade: 'cold', paint: (p, L) => {
  const ctr = d1ctr('S01-B03-SH01', Math.min(L, 75)), t = ambT('S01-B03-SH01', L);
  const k = sm(20, 75, L), pos = mix3([1.9, -0.6, 1.4], [1.75, -0.2, 1.3], sm(0, 20, L)), at = mix3([0, -1, 0], [0.3, -40, 0.6], k);
  const ctrL = d1ctr('S01-B03-SH01', L), c = dlCam(ctrL, pos, at);
  void ctr;
  paintMacroBackdrop(p, c, {glow: 0.7});
  paintMacro(p, c, {t, look: 'down', lake: true, glow: 0.7});
  paintBun(p, c, ctrL, {t, phase: 1});
  const g = camPoint(c, [ctrL[0], ctrL[1] + BUN_SM.bottom, ctrL[2]]);
  void g;
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
  paintRuler(p, c, {ev: k.ev, glow: glowAt(L), z: 0.6, faceY: ctr[1] + BUN_SM.bottom});
}, ot03: (L) => {
  const {k, ctr, c} = sh14Frame(L);
  void k;
  const r = tickY(20, clockOf('S01-B04-SH01', L).ev, ctr[1] + BUN_SM.bottom);
  void r;
  return camPoint(c, [ctr[0] + 2.15 - 0.15 + 0.6, ctr[1] + BUN_SM.bottom, 0.6], 0.3);
}});
const glowAt = (L: number) => (L < SH14.glow[0] ? 0 : L < SH14.glow[1] ? 0.6 + 0.4 * ease(clamp01((L - SH14.glow[0]) / 7.5)) : 0.8);

// SH15 hypothetical `Mh`: a mosquito alone low over a puddle; D2 hits it at +50 and carries it down; cut before contact with the water
const D2_HIT = 50, MH_WATER = -21.95;
const d2s = (n: number) => FALL_D2 * Math.max(0, n - D2_HIT);
const camSH15 = (n: number) => {
  const s = d2s(n);
  return n < D2_HIT ? lookCam([1.6, 2.2, 3.2], [0, -4, 0], 1000) : lookCam([1.6, 2.2 - s, 3.2], [0, -4 - s - 6 * sm(0, 63, n - D2_HIT), 0], 1000);
};
def({id: 'S01-B04-SH02', grade: 'coldest', paint: (p, L) => {
  const c = camSH15(L), t = ambT('S01-B04-SH02', L), s = d2s(L);
  skyUp(p, 1);
  paintWaterPlane(p, c, MH_WATER, t, {cold: 1});
  paintSlowRain(p, c, t, {alpha: 0.6, skip: (d) => d.at[1] < MH_WATER + 2});
  const ctr: V3 = [0, L < D2_HIT ? 3.0 + FALL_D2 * (L - D2_HIT) : -s, 0];
  const hit = L >= D2_HIT, ay = hit ? anchorUnderFace(ctr[1] + BUN_SM.bottom, MOSQ_BL_SM, 'pressed') : RIDER_Y;
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
const camSH17 = (L: number): YCam => {
  const k = sm(12, 52, L), ctrY = D0_C17 - sh17Fall(Math.min(L, 52));
  const rel = mix3([0.45, -1.55, 2.35], [1.3, -1.2, 2.4], k), at = mix3([0, -0.95, 0], [1, -1.1, 0], k);
  return lookCam([D0_X + rel[0], ctrY + rel[1], D0_Z + rel[2]], [D0_X + at[0], ctrY + at[1], D0_Z + at[2]], 1300);
};
const LAND: V3 = [D0_X, PUDDLE.y, D0_Z];
def({id: 'S01-B05-SH02', grade: 'warm', paint: (p, L) => {
  const c = camSH17(L), t = ambT('S01-B05-SH02', L), ctr: V3 = [D0_X, D0_C17 - sh17Fall(L), D0_Z];
  paintMacro(p, c, {t, lake: true, glow: 1.15});
  paintBun(p, c, ctr, {t, seed: 40500});
  const face = ctr[1] + BUN_SM.bottom;
  let at: V3 = [ctr[0], anchorUnderFace(face, MOSQ_BL_SM, 'pressed'), ctr[2]], state: MosqState = L < 12 ? 'pressed' : 'tip', pitch = 0;
  if (L >= 12) pitch = 35 * sm(12, 34, L);
  const slide = 1.9 * sm(34, 52, L);
  at = [ctr[0] + slide, L <= 52 ? at[1] : D0_C17 - sh17Fall(52) + BUN_SM.bottom - 0.235, ctr[2]];
  if (L > 52) { const u = sm(54, 84, L); state = 'clear'; pitch = 6; at = [at[0] + 3.5 * u, at[1] + 2.4 * u, at[2]]; }
  paintMosquito(p, c, at, MOSQ_BL_SM, {view: L < 12 ? 'left' : 'right', state, pitchAdd: pitch, t, rimColor: '#e9b46a'});
  if (L <= 52) paintFilm(p, c, ctr, {t});
  paintSplashCrown(p, c, LAND, L - 87 + 2, {width: 2.51});
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
  paintWoman(p, c, {at: SOI.W, view: 'front', face: 'tired', t, fig: {rise: 0.012 * Math.sin(t * Math.PI * 2 * 1.8 * 0.9)}, held: (q, a, u) => toteShoulder(q, a, u)});
  paintCurtain(p, c, {t, span: [-1.2, 2.2], density: 0.7});
  paintFall(p, 'rain', {width: 1080, height: 1920, t, captionBand: [1176, 1344]});
}});
const W_END: V3 = [0.66, 0.17, 0.06];
const mosqHeld = (p: Painter, c: YCam, t: number, at: V3, o: {view?: 'left' | 'right'} = {}) => paintMosquito(p, c, at, MOSQ_BL_M, {view: o.view ?? 'left', state: 'hover', t, blur: true, rimColor: '#e9b46a'});
def({id: 'S01-B05-SH04', grade: 'warm', paint: (p, L) => {
  const c = moveCam(L, 0, 51, [0.71, 0.19, 0.13], [0.74, 0.19, 0.12], [0.55, 0.14, -0.14], [0.57, 0.14, -0.14], 1000, 1000, 0.02), t = ambT('S01-B05-SH04', L);
  paintSoi(p, c, {t});
  paintWoman(p, c, {at: SOI.W, view: 'front', face: 'tired', t, shadow: false});
  paintCurtain(p, c, {t, span: [0.3, 1.1], density: 0.35});
  mosqHeld(p, c, t, W_END);
}});
def({id: 'S01-B05-SH05', grade: 'warm', paint: (p, L) => {
  const u = sm(5, 50, L), c = lookCam(mix3([0.74, 0.19, 0.12], [0.74, 0.26, 0.2], u), mix3([0.57, 0.14, -0.14], [0.66, 0.02, 0.1], u), 1000, 0.02), t = ambT('S01-B05-SH05', L);
  paintSoi(p, c, {t});
  paintWoman(p, c, {at: SOI.W, view: 'front', face: 'tired', t, shadow: false});
  paintCurtain(p, c, {t, span: [0.3, 1.1], density: 0.35});
  mosqHeld(p, c, t, W_END);
}});
def({id: 'S01-B05-SH06', grade: 'warm', paint: (p, L) => {
  const c = moveCam(L, 0, 129, [1.05, 0.95, 2.3], [1.0, 0.93, 2.18], [0.62, 0.5, -0.1], [0.62, 0.5, -0.1]), t = ambT('S01-B05-SH06', L);
  paintSoi(p, c, {t});
  paintWoman(p, c, {at: SOI.W, view: 'front', named: {name: 'slap-ankle', L: L}, face: L < 22 ? 'angry' : 'suspicious', t, shadow: true});
  paintCurtain(p, c, {t, span: [-1.2, 2.2], density: 0.7});
  const m: V3 = L < 12 ? W_END : L < 22 ? lerpV(W_END, [0.72, 0.23, 0.1], sm(12, 22, L)) : L < 40 ? [0.72, 0.23, 0.1] : lerpV([0.72, 0.23, 0.1], [0.68, 0.18, 0.08], sm(40, 72, L));
  mosqHeld(p, c, t, m);
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
