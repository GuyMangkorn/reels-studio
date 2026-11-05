import type {CastDef, FigAnchors} from '../kit/cast';
import {H} from '../kit/cast';
import {ell, inkLine, solid, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';

// EDU-EP02-SHORT cast (brief EDU-BRIEF-R1 VD02; user Q1, 5 Nov 2026: brick-red bib apron with a front pocket). Look-defining
// asset written by Film at W3.1 (look frames); Boss hardens it, and kit intake (KIT-P01) files the apron in WARDROBE at W8.4.
// `new: kitchen-apron`: the rig's apron panel (chest to below the hip) in brick red `#b5473a` over the kit mustard blouse and
// plum skirt, plus a neck strap, a waist tie and one front pocket painted by `paintBibApron` after `drawFigure` (front view).

const curly = PEOPLE['woman-curly'];
export const APRON = '#b5473a';

/** The home cook (`woman-curly + new: kitchen-apron`): kit head, body, height and seed; only the outfit gains the apron. */
export const COOK: CastDef = {...curly, outfit: {...curly.outfit, apron: APRON}};

/**
 * Bib details over the rig's apron panel (front view, standing, no lean): neck strap from the bib corners round the neck,
 * waist tie with a small bow tail at the character's left, and the front pocket (a darker band with a stitch line). The
 * figure frame matches `drawFigure`: u metres to screen right of the ground point, v metres up.
 */
export const paintBibApron = (p: Painter, def: CastDef, g: Pt, unit: number, seed: number, a: FigAnchors) => {
  const HD = H * (def.headScale ?? 1), chin = def.height - HD, shV = chin - 0.16 * HD;
  const hip0 = shV - (chin - 0.068) * 0.44 + 0.034;
  const S = (u: number, v: number): Pt => [g[0] + u * unit, g[1] - v * unit];
  const top = shV - 0.0935, dark = mixColor(APRON, '#3a1712', 0.35), line = mixColor(APRON, '#2b211c', 0.6);
  // Neck strap: two bands from the bib corners up to the collar, meeting behind the neck (hidden by it).
  for (const s of [-1, 1]) {
    const pts: Pt[] = [S(s * 0.085, top), S(s * 0.066, top), S(s * 0.03, shV + 0.012), S(s * 0.045, shV + 0.016)];
    solid(p, seed + 10 + s, APRON, pts, 2, 0.06, 0.2);
  }
  // Bib top hem stitch.
  inkLine(p, seed + 20, [S(-0.08, top - 0.012), S(0.08, top - 0.012)], {closed: false, weight: 0.6, color: dark});
  // Waist tie: a band across the waist and a tail hanging at the character's left (screen right).
  const wv = hip0 + 0.02;
  solid(p, seed + 30, dark, [S(-0.11, wv + 0.018), S(0.11, wv + 0.018), S(0.112, wv - 0.012), S(-0.112, wv - 0.012)], 2, 0.05, 0.2);
  solid(p, seed + 31, APRON, [S(0.1, wv), S(0.125, wv - 0.004), S(0.14, wv - 0.13), S(0.118, wv - 0.135)], 2, 0.06, 0.2);
  // Front pocket on the skirt part, just below the waist tie (the goggles hide in it: a small bulge, never the strap, until L14).
  const py0 = wv - 0.03, py1 = wv - 0.11;
  const pocket: Pt[] = [S(-0.07, py0), S(0.07, py0), S(0.068, py1), S(-0.068, py1)];
  solid(p, seed + 40, mixColor(APRON, '#000000', 0.12), pocket, 2, 0.06, 0.25);
  inkLine(p, seed + 41, pocket, {weight: 0.7, color: line});
  inkLine(p, seed + 42, [S(-0.066, py0 - 0.012), S(0.066, py0 - 0.012)], {closed: false, weight: 0.5, color: dark});
  inkLine(p, seed + 43, [S(0, py0), S(0, py1)], {closed: false, weight: 0.5, color: dark});
  // The bulge of the hidden goggles in the left half of the pocket.
  washAt(p, seed + 44, '#e07a68', 70, ell(...S(-0.032, (py0 + py1) / 2), 0.026 * unit, 0.02 * unit, 12), 0.15, 0.2);
  void a;
};
