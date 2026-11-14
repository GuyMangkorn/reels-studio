import {camMove, camOf} from '../../painted/kit/cam-moves';
import {shoulderPoint, type Arm} from '../../painted/kit/cast';
import {hardFill, inkLine} from '../../painted/kit/draw';
import {mixColor, type Painter, type Pt} from '../../painted/kit/painter';
import {poseArms} from '../../painted/kit/poses';
import type {Item} from '../../painted/kit/world';
import {camPoint, camUnit, type YCam} from '../../painted/kit/ycam';
import {SURV_FACES} from '../../painted/survival/poses';
import {cardAt, cell, type V3} from '../../painted/survival/core';
import {paintCast, YAI} from '../../painted/survival/cast';
import {paintCupHeld, paintHeldProp, paintPhoneHeld, paintTorchBeam} from '../../painted/survival/props';
import {cylinder, lampK, paintUnder} from '../../painted/survival/under';

// EDU-EP18 under-house staging (Editor, 14 Nov 2026): SET-UNDER with the marks of the approved look frames (LF18-UNDER, LF18-CHIP), shared by shots 4, 11-17 and 19-22.
// Marks (metres, VIL axes): platform mat top y 0.46; K lies on his side (P37) at K0, head toward -x; Y kneels at his head side (P34) at Y0; the clay water jug stands at JUG.
export const Y0: V3 = [-5.15, 0.46, -4.75];
export const K0: V3 = [-3.95, 0.46, -4.45];
export const JUG: V3 = [-4.2, 0.46, -4.85];
export const KHEAD: V3 = [K0[0] - 0.5, 0.55, K0[2]];
const NIGHT_TINT = (v: V3) => ({to: '#2a2a40', u: 0.42 - 0.3 * lampK(v)});
export const tint = NIGHT_TINT;

export const kneelArm = (c: YCam, at: V3, id: 'P20' | 'P18' | 'P34' | 'P19'): {rArm?: Arm; lArm?: Arm} => {
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return {};
  const st = poseArms(id, YAI, g, u), a = shoulderPoint(YAI, g, u, {view: 'front'}, 'r'), b = shoulderPoint(YAI, g, u, {view: 'front', kneel: 1}, 'r');
  const d: Pt = [b[0] - a[0], b[1] - a[1]], sh = (q?: Pt) => (q ? [q[0] + d[0], q[1] + d[1]] as Pt : undefined);
  const m = (x?: Arm) => (x ? {...x, to: sh(x.to)!, via: sh(x.via)} : undefined);
  return {rArm: m(st.rArm), lArm: m(st.lArm)};
};

/** The clay water jug with its water line (wet clay darker, a pale line at the surface): `level` 0..1 of the body height. */
export const jugItem = (level: number, at: V3 = JUG, seed = 24020): Item => ({at, draw: (q, cc) => {
  const wt = (col: string) => mixColor(col, '#2a2a40', 0.3 - 0.2 * lampK(at));
  cylinder(q, cc, seed, at, 0.1, 0.16, wt('#7a4a30'), {ink: '#3a2418', top: '#5a3420'});
  if (level > 0) {
    const top = cylinder(q, cc, seed + 6, at, 0.097, 0.15 * level, wt('#33404f'));
    if (top) inkLine(q, seed + 9, top, {weight: 0.7, color: '#9fc0d4', still: true});
  }
  cylinder(q, cc, seed + 3, [at[0], at[1] + 0.16, at[2]], 0.06, 0.05, wt('#6a3e28'), {top: '#2a3a48'});
}});
export const slippersItem: Item = {at: [-4.85, 0, -3.6], draw: (q, cc) => { for (const [i, dx] of [[0, -0.07], [1, 0.07]] as const) { const k = cardAt(cc, [-4.85 + dx, 0.01, -3.6]); if (k) hardFill(q, 24030 + i, '#2e2622', cell(k, 0, 0.01, 0.06, 0.025, 12, 0.2)); } }};

type KOpts = {pose?: 'P37' | 'P33'; spose?: 'belly-lie' | 'sip-lean'; view?: 'front' | 'left' | 'right'; face?: 'sad' | 'tired' | 'relieved' | 'happy' | 'sleepy' | 'whisper'; guilty?: boolean; at?: V3; t: number; sdir?: 1 | -1; mouth?: (a: Pt) => void};
export const kItem = (o: KOpts): Item => {
  const at = o.at ?? K0;
  return {at, draw: (q, cc) => {
    const a = paintCast(q, cc, 'K', {at, view: o.view ?? 'front', ...(o.spose ? {spose: o.spose, sdir: o.sdir} : {pose: o.pose ?? 'P37'}), face: o.face ?? 'sad', ...(o.guilty ? {faceState: SURV_FACES['guilty-smile']} : {}), t: o.t, tint: NIGHT_TINT(at), shadow: {op: 40}});
    if (a && o.mouth) { const u = camUnit(cc, at); o.mouth([a.head[0] + 0.09 * u, a.head[1] + 0.06 * u]); }
  }};
};
type YOpts = {at?: V3; view?: 'front' | 'left' | 'right'; face?: 'worried' | 'angry' | 'happy' | 'neutral' | 'sad'; arm?: 'P20' | 'P18' | 'P34' | 'P19'; armTo?: Pt; t: number;
  held?: (q: Painter, a: {rHand: Pt; lHand: Pt}, u: number) => void; spose?: 'cup-offer'; sdir?: 1 | -1; lArmTo?: Pt};
export const yItem = (o: YOpts): Item => {
  const at = o.at ?? Y0;
  return {at, bias: -0.05, draw: (q, cc) => {
    const arms = o.arm ? kneelArm(cc, at, o.arm) : {};
    const rArm = o.armTo ? {to: o.armTo, ...(arms.rArm?.via ? {via: arms.rArm.via} : {})} : arms.rArm;
    paintCast(q, cc, 'Y', {at, view: o.view ?? 'front', ...(o.spose ? {spose: o.spose, sdir: o.sdir} : {pose: 'P34'}), face: o.face ?? 'worried', t: o.t, tint: NIGHT_TINT(at),
      fig: {...(rArm ? {rArm} : {}), ...(o.lArmTo ? {lArm: {to: o.lArmTo}} : {})}, held: o.held ? (qq, a, u) => o.held!(qq, a, u) : undefined});
  }};
};
/** Phone torch beam from a world lens point to a world target (drawn after the set: it lights the picture, level 0..1). */
export const beamWorld = (p: Painter, c: YCam, lens: V3, target: V3, level: number, spread = 0.14) => {
  const a = camPoint(c, lens), b = camPoint(c, target);
  if (a && b && level > 0) paintTorchBeam(p, a, b, {level, spread});
};
export {camMove, camOf, paintHeldProp, paintPhoneHeld, paintCupHeld, paintUnder};
