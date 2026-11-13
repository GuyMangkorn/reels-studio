// EDU-EP17-SHORT staging of the real MAN and his neighbours in the street shots (Editor, W5.3 Draft). Casting lines of the scene sheet: `man-spiky + park-casual` (cap off, `manDef()`), neighbours
// `man-crop + office` and `woman-long + nurse` (SH05). Poses P10 (phone at the chest), P01, P35 / P08 (crouch, arms up) from the kit; face and look from the kit expressions.
// Pure functions of the shot-local frame `f` (the crowd clock is in street-live.ts).
import {paintFigureAt} from '../../painted/kit/figure-at';
import {hardFill} from '../../painted/kit/draw';
import type {Painter, Pt} from '../../painted/kit/painter';
import type {ExpressionId} from '../../painted/kit/expressions';
import {heldPhone, type Quad} from '../../painted/edu17/phone-map';
import {NEIGHBOURS, squeezedFig, squeezeK} from '../../painted/edu17/squeezed';
import {castOf, manDef, pitchScale, type DepthItem, type StreetShot} from '../../painted/edu17/street';
import type {YCam} from '../../painted/kit/ycam';
import {bodyAt} from './street-live';

const lin = (a: number, b: number, f: number) => Math.min(1, Math.max(0, (f - a) / (b - a)));

/** A dark phone back in the hand (front view, SH10): 0.07 x 0.14 m at the right hand anchor. */
const phoneBack = (p: Painter, hand: Pt, u: number) => {
  const w = 0.035 * u, h = 0.07 * u;
  hardFill(p, 7950, '#22252b', [[hand[0] - w, hand[1] - h], [hand[0] + w, hand[1] - h], [hand[0] + w, hand[1] + h], [hand[0] - w, hand[1] + h]]);
};

/** The staged figures of one street shot at shot-local frame `f`. `out.quad` receives SH02's phone screen quad (the dot is repainted after the lens falloff by the caller). */
export const stageStreet = (p: Painter, shot: StreetShot, f: number, out: {quad?: Quad} = {}) => (c: YCam): DepthItem[] => {
  const man = manDef(), t = f / 30, items: DepthItem[] = [];
  const scale = pitchScale(c, [0, 0, 0], man.height);
  if (shot === 'SH05') {
    const kM = squeezeK(f), press = NEIGHBOURS.press * kM, sq = squeezedFig(man, c, [0, 0, 0], kM);
    const off = castOf('man-crop', 'office'), nur = castOf('woman-long', 'nurse');
    items.push({z: 0, draw: () => void paintFigureAt(p, c, sq.def, {at: [0, 0, 0], view: 'front', pose: 'P10', face: 'tired', fig: sq.fig, t, seed: 77, scale})});
    items.push({z: 0.12, draw: () => void paintFigureAt(p, c, off, {at: [NEIGHBOURS.left.x + press, 0, NEIGHBOURS.left.z], view: 'front', fig: {quarter: NEIGHBOURS.left.quarter, quarterDeg: NEIGHBOURS.deg}, pose: 'P01', face: 'neutral', t, seed: 311, scale: pitchScale(c, [NEIGHBOURS.left.x, 0, NEIGHBOURS.left.z], off.height)})});
    items.push({z: 0.13, draw: () => void paintFigureAt(p, c, nur, {at: [NEIGHBOURS.right.x - press, 0, NEIGHBOURS.right.z], view: 'front', fig: {quarter: NEIGHBOURS.right.quarter, quarterDeg: NEIGHBOURS.deg}, pose: 'P01', face: 'neutral', t, seed: 313, scale: pitchScale(c, [NEIGHBOURS.right.x, 0, NEIGHBOURS.right.z], nur.height)})});
  } else if (shot === 'SH02') {
    items.push({z: 0, draw: () => void paintFigureAt(p, c, man, {at: [0, 0, 0], view: 'back', pose: 'P10', face: 'neutral', t, seed: 77, scale, held: (q, a, u) => { out.quad = heldPhone(q, a, u, t, man.outfit.sleeve).quad; }})});
  } else if (shot === 'SH10') {
    // +2-+10 looks up (neutral -> happy), +8-+20 the phone goes into the right pocket (P10 until +10, P01 from +10, phone gone at +20), +22-+40 knees soft (crowd clock: 0.05 m)
    const b = bodyAt(shot, f, -1, man.height), up = lin(2, 10, f);
    const face: ExpressionId = f < 6 ? 'neutral' : 'happy';
    items.push({z: 0, draw: () => void paintFigureAt(p, c, man, {at: [0, 0, 0], view: 'front', pose: f < 10 ? 'P10' : 'P01', face, faceState: {look: [0, -0.8 * up]}, fig: {crouch: b.crouch}, t, seed: 77, scale,
      held: f < 20 ? (q, a, u) => phoneBack(q, a.rHand, u) : undefined})});
  } else if (shot === 'SH12' || shot === 'SH15') {
    const b = bodyAt(shot, f, -1, man.height), face: ExpressionId = shot === 'SH12' ? 'laugh' : f >= 30 ? 'relieved' : 'happy';
    items.push({z: 0, draw: () => void paintFigureAt(p, c, man, {at: [0, 0, 0], view: 'front', pose: b.pose, face, fig: {crouch: b.crouch, lift: b.lift}, shadow: b.airborne ? false : undefined, t, seed: 77, scale})});
  }
  return items;
};
