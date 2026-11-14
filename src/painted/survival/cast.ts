import {hardFill} from '../kit/draw';
import {shoulderPoint, type CastDef, type FigAnchors} from '../kit/cast';
import {paintFigureAt, type FigureAtOpts} from '../kit/figure-at';
import {camPoint} from '../kit/ycam';
import {aimFromPx, survPoseFig, type SurvPoseId} from './poses';
import {mixColor, type Painter} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import {camUnit, type YCam} from '../kit/ycam';
import type {V3} from '../kit/space';

// EDU-EP16..18 cast (brief VD-S05; casting lines in each storyboard). Story first: an Isan family at home, so the kit had no outfit to reuse.
// ยาย (Y) = `woman-elder + new: isan-home`: pale cotton blouse with elbow-length loose sleeves, an indigo mudmee pha sin to mid-calf with a
//   maroon-gold woven hem band (tin sin), a red-and-white checked pha khao ma tied at the waist, bare feet in dark slippers.
// เก่ง (K) = `boy-school + new: kid-home`: faded teal tee, navy shorts, blue flip-flops.
// Villager = `man-elder + new: isan-home` (men): indigo mor hom shirt, dark trousers rolled at the shin, pha khao ma at the waist.
// Hardened (Boss, 14 Nov 2026): the pha khao ma checks are the opt-in `Gear.belt.checks` field of the kit rig (front and back view, follows the belt).
// The pha sin bands stay a screen overlay on the standing skirt (`sinBands`, standing poses only): the rig skirt polygon has no band hook yet.

export const SIN = {indigo: '#33395e', mudmee: '#6f78a8', hem: '#7a2a32', gold: '#d0a443'} as const;
export const KHAOMA = {red: '#b5473a', white: '#efe6d6'} as const;

const elder = PEOPLE['woman-elder'];
export const YAI: CastDef = {
  ...elder,
  outfit: {shoulder: 0.35, shirt: '#ece2cc', sleeve: '#ece2cc', longSleeves: false, skirt: SIN.indigo, skirtHem: 0.12, pants: elder.head.skin, shoes: '#3a2e26',
    gear: {belt: {color: KHAOMA.red, h: 0.07, checks: KHAOMA.white}}},
};
const boy = PEOPLE['boy-school'];
export const KENG: CastDef = {...boy, outfit: {shoulder: 0.32, shirt: '#6fa39b', sleeve: '#6fa39b', longSleeves: false, pants: '#2f3b52', shoes: '#2f6fb8', shorts: {sock: boy.head.skin}}};
const man = PEOPLE['man-elder'];
export const VILLAGER: CastDef = {...man, outfit: {shoulder: 0.38, shirt: '#2e3a5c', sleeve: '#2e3a5c', longSleeves: true, pants: '#2a2a30', shoes: '#4a3a2a',
  gear: {belt: {color: KHAOMA.red, h: 0.06, checks: KHAOMA.white}, collar: {kind: 'v', color: '#2e3a5c', depth: 0.12}}}};

/** Pha sin bands over the rig skirt: the woven hem band (tin sin) and three mudmee stripes; half-width from the shoulders by view. */
const sinBands = (p: Painter, a: FigAnchors, u: number, view: string, hem: number, seed: number, tint?: (c: string) => string) => {
  const T = tint ?? ((c: string) => c);
  const cx = a.feet[0], gy = a.feet[1], sh = Math.abs(a.rShoulder[0] - a.lShoulder[0]) / 2;
  const side = view === 'left' || view === 'right';
  const half = (side ? 0.62 : 0.9) * Math.max(sh, 0.12 * u);
  const band = (y0: number, y1: number, col: string, id: number, wk = 1) =>
    hardFill(p, id, T(col), [[cx - half * wk, gy - y0 * u], [cx + half * wk, gy - y0 * u], [cx + half * wk * 0.98, gy - y1 * u], [cx - half * wk * 0.98, gy - y1 * u]]);
  band(hem + 0.004, hem + 0.085, SIN.hem, seed, 1.0);
  band(hem + 0.03, hem + 0.045, SIN.gold, seed + 1, 0.99);
  for (let i = 0; i < 3; i++) band(hem + 0.14 + i * 0.1, hem + 0.155 + i * 0.1, SIN.mudmee, seed + 2 + i, 0.96 - i * 0.03);
};

/** The shoulder a `point-up` arm leaves from (front view: the character's left when the target is on the screen right). */
const sdirSide = (dir: 1 | -1, view: 'front' | 'left' | 'right'): 'r' | 'l' => (view === 'front' ? (dir > 0 ? 'l' : 'r') : 'r');
export type Who = 'Y' | 'K' | 'V';
export const CAST: Record<Who, CastDef> = {Y: YAI, K: KENG, V: VILLAGER};

/** One cast member through the yaw camera, with the Isan cloth details; returns the anchors. */
export type CastOpts = FigureAtOpts & {
  /** A series pose (`poses.ts`: mime-stir, rub-hand, arms-wide, belly-lie, cup-offer, sip-lean) instead of `pose`; `sph` loop cycles, `sk` amount 0..1, `sdir` the screen side of the other person. */
  spose?: SurvPoseId; sph?: number; sk?: number; sdir?: 1 | -1;
  /** `point-up`: a world point to aim the finger at (the arm is aimed from the figure's shoulder to it in this view); or `saim` degrees above level with `sdir`. */
  aimAt?: V3; saim?: number;
};
export const paintCast = (p: Painter, c: YCam, who: Who, o0: CastOpts): FigAnchors | null => {
  const def = CAST[who];
  let o: FigureAtOpts = o0;
  if (o0.spose) {
    const g = camPoint(c, o0.at);
    if (!g) return null;
    const view3 = o0.view === 'front' || o0.view === 'left' || o0.view === 'right' ? o0.view : 'front', un = camUnit(c, o0.at) * (o0.scale ?? 1);
    let sdir = o0.sdir, saim = o0.saim;
    if (o0.spose === 'point-up' && o0.aimAt) {
      const tp = camPoint(c, o0.aimAt), sp = shoulderPoint(def, g, un, {view: view3}, sdirSide(o0.sdir ?? 1, view3));
      if (tp) { const a = aimFromPx(sp, tp); sdir = a.dir; saim = a.aim; }
    }
    const sf = survPoseFig(o0.spose, def, g, un, {view: view3, ph: o0.sph, k: o0.sk, dir: sdir, aim: saim});
    o = {...o0, pose: 'P01', view: sf.view, fig: {...sf, ...o0.fig}};
  }
  const a = paintFigureAt(p, c, def, o);
  if (!a) return null;
  const u = camUnit(c, o.at) * (o.scale ?? 1);
  const view = o.view ?? 'front';
  const T = o.tint ? (col: string) => mixColor(col, o.tint!.to, o.tint!.u) : undefined;
  const standing = o0.spose ? ['mime-stir', 'rub-hand', 'arms-wide'].includes(o0.spose) : !o.pose || ['P01', 'P05', 'P20', 'P16', 'P18'].includes(o.pose);
  if (who === 'Y' && standing && view !== 'back') sinBands(p, a, u, view, YAI.outfit.skirtHem ?? 0.12, 15000, T);
  if (who === 'Y' && standing && view === 'back') sinBands(p, a, u, view, YAI.outfit.skirtHem ?? 0.12, 15050, T);
  return a;
};

/** Outfit ids of the series (kit intake files them in `WARDROBE` at delivery, KIT-P01). */
export const ISAN_OUTFIT_IDS = ['isan-home-woman', 'kid-home', 'isan-home-man'] as const;
export type IsanOutfitId = (typeof ISAN_OUTFIT_IDS)[number];
export const ISAN_OUTFITS: Record<IsanOutfitId, CastDef['outfit']> = {'isan-home-woman': YAI.outfit, 'kid-home': KENG.outfit, 'isan-home-man': VILLAGER.outfit};
export const ISAN_OUTFIT_INFO: Record<IsanOutfitId, {who: Who; description: string}> = {
  'isan-home-woman': {who: 'Y', description: 'Isan home dress (woman): pale cotton blouse, indigo mudmee pha sin with a maroon-gold hem band (standing poses), red-and-white checked pha khao ma on the belt, dark slippers.'},
  'kid-home': {who: 'K', description: 'Child at home: faded teal tee, navy shorts, blue flip-flops.'},
  'isan-home-man': {who: 'V', description: 'Isan home dress (man): indigo mor hom shirt with a V collar, dark trousers, checked pha khao ma on the belt.'},
};
/** Any kit person dressed in a series outfit (head, height and shoulder width kept; the pha sin hem is scaled to the person's height). */
export const dressIsan = (person: CastDef, id: IsanOutfitId): CastDef => {
  const o = ISAN_OUTFITS[id], k = person.height / PEOPLE['woman-elder'].height;
  return {...person, outfit: {...o, shoulder: person.outfit.shoulder, ...(o.skirtHem !== undefined ? {skirtHem: o.skirtHem * k} : {}), ...(id === 'isan-home-woman' ? {pants: person.head.skin} : {})}};
};
