import type {CastDef, FigAnchors} from '../kit/cast';
import {shoulderPoint} from '../kit/cast';
import type {ExpressionId} from '../kit/expressions';
import {paintFigureAt} from '../kit/figure-at';
import {hardFill, inkLine} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import type {AnyPoseId} from '../kit/poses';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';

// EDU-EP30 cast (VD30-06, CAT02 generic faces; Film W3 look assets 2026-11-19, Boss hardens and files at kit intake). Casting lines:
//   MEREDITH `man-parted + new: aus-army-1932-officer` (khaki tunic, Sam Browne belt, breeches, leggings, slouch hat, plain brass disc)
//   GUNNER-1 `man-crop + new: aus-army-1932-gunner` (khaki shirt, sleeves short, trousers, puttees, slouch hat)
//   GUNNER-2 `man-buzz + new: aus-army-1932-gunner`
//   FARMER `man-elder + new: wheatbelt-farmer-1932` (wide felt hat, collarless shirt, braces, dusty trousers, boots)
// Kit heads unchanged (no likeness). The slouch hat and the felt hat are `new:` headwear painted from the head anchors after the figure
// (the kit hat kinds are cap, helmet, nurse, top, bonnet).

export const KHAKI = {tunic: '#8c7d55', shirt: '#9b8b5f', trouser: '#7f7150', puttee: '#6d6045', boot: '#3b2c20', belt: '#5c3b22', brass: '#c9a54a', hat: '#7a6b49', band: '#3a3024'} as const;

const man = (id: keyof typeof PEOPLE) => PEOPLE[id];
export const MEREDITH: CastDef = {...man('man-parted'), outfit: {...man('man-parted').outfit, shoulder: 0.42, shirt: KHAKI.tunic, sleeve: KHAKI.tunic, longSleeves: true, jacket: KHAKI.tunic, pants: KHAKI.trouser, shoes: KHAKI.boot, boots: true,
  gear: {belt: {color: KHAKI.belt, h: 0.045, buckle: KHAKI.brass}, pockets: true, badge: KHAKI.brass, collar: {kind: 'v', color: mixColor(KHAKI.tunic, '#2a2418', 0.2), depth: 0.1}}}};
export const GUNNER1: CastDef = {...man('man-crop'), outfit: {...man('man-crop').outfit, shirt: KHAKI.shirt, sleeve: KHAKI.shirt, longSleeves: false, pants: KHAKI.trouser, shoes: KHAKI.puttee, boots: true, gear: {belt: {color: KHAKI.belt, h: 0.04}, pockets: true}}};
export const GUNNER2: CastDef = {...man('man-buzz'), outfit: {...man('man-buzz').outfit, shirt: KHAKI.shirt, sleeve: KHAKI.shirt, longSleeves: false, apron: undefined, pants: KHAKI.trouser, shoes: KHAKI.puttee, boots: true, gear: {belt: {color: KHAKI.belt, h: 0.04}, pockets: true}}};
export const FARMER: CastDef = {...man('man-elder'), outfit: {...man('man-elder').outfit, shirt: '#c9bfa6', sleeve: '#c9bfa6', longSleeves: true, jacket: undefined, coat: undefined, pants: '#5d5446', shoes: '#3a2c20', boots: true, gear: {belt: {color: '#4a3a2a', h: 0.03}}}};

/** Slouch hat (front/back view): a wide brim ellipse and a pinched crown with a dark band; `upLeft` turns the brim up on the wearer's left
 *  (screen right in front view), the Australian way. `felt` = the farmer's wide-brim felt hat (rounder crown, no turn-up). */
export const paintHat = (p: Painter, a: FigAnchors, u: number, seed: number, o: {kind: 'slouch' | 'felt'; view: 'front' | 'back' | 'left' | 'right'; color?: string; upLeft?: boolean}) => {
  const col = o.color ?? (o.kind === 'felt' ? '#6a5a42' : KHAKI.hat), [hx] = a.head, top = a.headTop, r = (o.kind === 'felt' ? 0.25 : 0.23) * u, yB = top + (o.view === 'back' ? 0.13 : 0.1) * u;
  const brim: Pt[] = Array.from({length: 22}, (_, i) => { const t = (i / 22) * Math.PI * 2; return [hx + r * Math.cos(t), yB + 0.028 * u * Math.sin(t)] as Pt; });
  if (o.upLeft && o.view !== 'left' && o.view !== 'right') {   // turned-up side: the brim's screen-right half (front) / left half (back) lifted against the crown
    const s = o.view === 'front' ? 1 : -1;
    brim.forEach((q, i) => { const dx = (q[0] - hx) * s; if (dx > 0.3 * r) brim[i] = [hx + s * (0.3 * r + (dx - 0.3 * r) * 0.35), q[1] - (dx - 0.3 * r) * 1.1]; });
  }
  hardFill(p, seed, mixColor(col, '#1e1a12', 0.18), brim);
  const cw = 0.135 * u, ch = (o.kind === 'felt' ? 0.15 : 0.14) * u;
  const crown: Pt[] = [[hx - cw, yB], [hx - cw * 0.95, yB - ch * 0.7], [hx - cw * 0.55, yB - ch], [hx, yB - ch * (o.kind === 'felt' ? 1 : 0.86)], [hx + cw * 0.55, yB - ch], [hx + cw * 0.95, yB - ch * 0.7], [hx + cw, yB]];
  hardFill(p, seed + 1, col, crown);
  hardFill(p, seed + 2, KHAKI.band, [[hx - cw, yB], [hx - cw * 0.98, yB - 0.03 * u], [hx + cw * 0.98, yB - 0.03 * u], [hx + cw, yB]]);
  inkLine(p, seed + 3, crown, {closed: false, weight: 0.6, color: mixColor(col, '#141008', 0.6), still: true});
};

export type CrewOpts = {view?: 'front' | 'back' | 'left' | 'right'; pose?: AnyPoseId; face?: ExpressionId; t: number; tint?: {to: string; u: number}; fig?: Record<string, unknown>; seed: number};

/** Paint one standing / kneeling crew member with a hat. Returns anchors. */
export const paintCrew = (p: Painter, c: YCam, def: CastDef, at: V3, o: CrewOpts & {hat?: 'slouch' | 'felt'; upLeft?: boolean}) => {
  const view = o.view ?? 'front';
  return paintFigureAt(p, c, def, {at, view, pose: o.pose, face: o.face ?? 'neutral', t: o.t, tint: o.tint, fig: o.fig as never, seed: o.seed,
    shadow: {color: '#3b2f22', op: 70},
    held: o.hat ? (q, a, u) => paintHat(q, a, u, o.seed + 900, {kind: o.hat!, view, upLeft: o.upLeft}) : undefined});
};

/** GUNNER-1 `new: seated-gunner` (W3 proposal): sitting on the ground behind the gun (floorSit), both forearms forward to the grip and
 *  the stock; front view uses foreshortened arms toward the lens (depth arms), back view the same arms mirrored. */
export const paintSeatedGunner = (p: Painter, c: YCam, def: CastDef, at: V3, o: CrewOpts & {grip?: V3}) => {
  const view = o.view ?? 'front', g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return null;
  const body = {floorSit: 1} as const, sr = shoulderPoint(def, g, u, {view, ...body}, 'r'), sl = shoulderPoint(def, g, u, {view, ...body}, 'l');
  const arms = view === 'back'
    ? {rArm: {via: [sr[0] + 0.1 * u, sr[1] + 0.22 * u] as Pt, to: [sr[0] + 0.08 * u, sr[1] + 0.1 * u] as Pt}, lArm: {via: [sl[0] - 0.1 * u, sl[1] + 0.22 * u] as Pt, to: [sl[0] - 0.05 * u, sl[1] + 0.12 * u] as Pt}}
    : {rArm: {via: [sr[0] - 0.06 * u, sr[1] + 0.2 * u] as Pt, to: [sr[0] + 0.06 * u, sr[1] + 0.2 * u] as Pt, toCam: 0.6}, lArm: {via: [sl[0] + 0.06 * u, sl[1] + 0.2 * u] as Pt, to: [sl[0] - 0.02 * u, sl[1] + 0.24 * u] as Pt, toCam: 0.6}};
  return paintFigureAt(p, c, def, {at, view, face: o.face ?? 'neutral', t: o.t, tint: o.tint, seed: o.seed, shadow: {color: '#3b2f22', op: 70},
    fig: {...body, ...arms, ...(o.fig ?? {})} as never, held: (q, a, uu) => paintHat(q, a, uu, o.seed + 900, {kind: 'slouch', view})});
};
