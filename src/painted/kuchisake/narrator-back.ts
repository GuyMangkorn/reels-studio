import {H, type CastDef} from '../kit/cast';
import {capsule, ell, glaze, inkLine, lineOf, modelPart, solid, toneOf, VD18, type InteriorLight} from '../kit/draw';
import {CHIN, HEAD_SPAN, headOutline} from '../kit/head';
import {mixColor, type Painter, type Pt} from '../kit/painter';

// KSO-EP01-SHORT narrator seen from behind (LF04 izakaya, S01-B02-SH01; user decision 1 Nov 2026, round 5). New episode art:
// the back of the head, the long hair, the nape, the shirt and jacket collar, the shoulders, the arms and the lap of the WFOG
// narrator in the dark work jacket (NARRATOR_DARK). The kit rig has no back view (DF-20261101-kso-look-stills), so this file
// paints the view itself, from the rig's own dimensions: one head unit K = H / HEAD_SPAN, shoulders `outfit.shoulder * H`,
// the torso and hip levels of `drawFigure`. `seatDrop` lowers the upper body rigidly (metres) for a seated narrator: no crouch
// and no hip rig. The figure is one flat card at the depth of its ground point `g` (plate px), `unit` px per metre there.

const K = H / HEAD_SPAN; // one head unit, m (the decal head)

/**
 * The long hair from behind (head units, v down): the crown from the rig's long-hair arc, the locks falling to the shoulder line
 * (v 1.58, the shoulders show below them), and a notch that leaves the nape open.
 */
const HAIR_BACK: Pt[] = [
  ...Array.from({length: 17}, (_, i): Pt => {
    const a = Math.PI + (i / 16) * Math.PI;
    return [1.16 * Math.cos(a), 1.18 * Math.sin(a) - 0.02];
  }),
  [1.2, 0.6], [1.22, 1.2], [1.08, 1.5], [0.8, 1.6], [0.34, 1.46], [0.24, 1.08], [-0.24, 1.08], [-0.34, 1.46], [-0.8, 1.6], [-1.08, 1.5], [-1.22, 1.2], [-1.2, 0.6],
];
/** The nape: skin between the skull's lower edge and the collar, inside the hair notch (head units). */
const NAPE: Pt[] = [[-0.25, 1.0], [0.25, 1.0], [0.3, 1.55], [-0.3, 1.55]];
/** Hair falls from the crown to the sides: strands as open ink curves (head units). */
const STRANDS: Pt[][] = [
  [[0.06, -1.12], [0.5, -0.5], [0.8, 0.1], [0.88, 0.95]],
  [[-0.06, -1.12], [-0.5, -0.5], [-0.8, 0.1], [-0.88, 0.95]],
  [[0.32, -1.0], [0.7, -0.42], [0.98, 0.25]],
  [[-0.32, -1.0], [-0.7, -0.42], [-0.98, 0.25]],
];
/** A warm sheen on the crown from the room light (head units). */
const SHEEN: Pt[] = [[-0.6, -0.8], [-0.25, -1.08], [0.3, -1.1]];

/** One opaque part, as `drawFigure`'s fill: flat base, interior modelling, outer ink in a dark shade of the local colour. Seeds run on from `base`. */
export const backFill = (p: Painter, base: number, L: InteriorLight) => {
  let part = 0, line = 0;
  return (color: string, pts: Pt[], outline = true, passes = 4) => {
    const c = toneOf(color, L);
    solid(p, base + ++part, c, pts, passes, 0, 0.2);
    modelPart(p, base + part, c, pts, L);
    if (outline) inkLine(p, base + 700 + ++line, pts, {weight: VD18.lineOuter, color: lineOf(c, L)});
  };
};

/** The back of the head: long hair over the shoulders, the nape notch, the skull and strands. `head` maps head units to plate px. */
export const paintBackHead = (p: Painter, def: CastDef, head: (pt: Pt) => Pt, L: InteriorLight, base: number, fill: ReturnType<typeof backFill>) => {
  const skinShade = mixColor(def.head.skin, VD18.shadow, 0.3);
  const hairC = toneOf(def.head.hair, L);
  fill(def.head.hair, HAIR_BACK.map(head), true, 6);
  fill(skinShade, NAPE.map(head), false, 6);
  fill(def.head.hair, headOutline(40).map(head), false, 6);
  inkLine(p, base + 770, headOutline(40).filter(([, v]) => v > 0.6).map(head), {closed: false, weight: 1.0, curve: 0.4, color: lineOf(hairC, L)});
  STRANDS.forEach((s, i) => inkLine(p, base + 780 + i, s.map(head), {closed: false, weight: 1.0, curve: 0.5, color: lineOf(hairC, L)}));
  inkLine(p, base + 790, SHEEN.map(head), {closed: false, weight: 2.0, curve: 0.5, color: mixColor(hairC, '#c79a64', 0.35)});
};

/**
 * Paint the narrator from behind at ground point `g` (plate px), `unit` px per metre. `L` is the interior light (VD18 model)
 * of the figure; `seatDrop` (m) lowers the figure for a seat. Draw order: seat shadow, arms, lap, jacket, collar, hair, nape,
 * head, strands: each part sits in front of the ones before it.
 */
export const paintNarratorBack = (p: Painter, def: CastDef, g: Pt, unit: number, L: InteriorLight, seatDrop = 0) => {
  const o = def.outfit;
  const jacket = o.jacket ?? o.shirt;
  const chin = def.height - H - seatDrop; // chin height (m)
  const shV = chin - 0.16 * H; // shoulder line, as `drawFigure`
  const hip0 = shV - (def.height - H - 0.068) * 0.44 + 0.034; // hip line, as `drawFigure`
  const sw = o.shoulder * H, hw = 0.3 * H;
  const at = ([u, y]: Pt): Pt => [g[0] + u * unit, g[1] - y * unit]; // metres: u screen-right, y height above the floor
  const hc = at([0, chin + CHIN * K]), k = K * unit;
  const head = ([u, v]: Pt): Pt => [hc[0] + u * k, hc[1] + v * k];
  const base = def.seed * 1000 + 500;
  const fill = backFill(p, base, L);

  // Seat shadow on the floor under the seat (every human is grounded; the seat is the contact here).
  glaze(p, base + 900, '#0c0806', 110, ell(g[0], g[1] + 0.01 * unit, 0.3 * unit, 0.06 * unit, 16), {border: 0.1, bleed: 0.15});

  // Arms hang at the sides (P01 arms down, from behind); the hands rest on the lap, inside it, so the lap hides them.
  for (const side of [-1, 1] as const) {
    const S = at([side * (sw - 0.02), shV - 0.03]), E = at([side * (sw + 0.025), shV - 0.27]), T = at([side * 0.1, hip0 - 0.06]);
    fill(o.sleeve, capsule(S, E, 0.075 * unit, 0.065 * unit));
    fill(o.sleeve, capsule(E, T, 0.065 * unit, 0.055 * unit));
    fill(mixColor(def.head.skin, VD18.shadow, 0.2), ell(T[0], T[1], 0.03 * unit, 0.035 * unit, 14), true, 4);
  }

  // Lap: the thighs toward the table, dark trousers from the hip line down to the seat's front edge.
  fill(o.pants, [at([-hw - 0.01, hip0 + 0.01]), at([hw + 0.01, hip0 + 0.01]), at([hw + 0.07, hip0 - 0.11]), at([-hw - 0.07, hip0 - 0.11])]);

  // Jacket: the back, shoulders and neck line (the work jacket of VD05), then the shirt collar above the neck line.
  fill(jacket, [at([-sw + 0.017, shV - 0.03]), at([-0.07, shV - 0.01]), at([0.07, shV - 0.01]), at([sw - 0.017, shV - 0.03]), at([sw, shV - 0.06]), at([hw + 0.013, hip0 - 0.03]), at([-hw - 0.013, hip0 - 0.03]), at([-sw, shV - 0.06])]);
  fill(o.shirt, [at([-0.07, shV - 0.01]), at([0.07, shV - 0.01]), at([0.075, shV + 0.012]), at([-0.075, shV + 0.012])], true, 4);
  inkLine(p, base + 760, [at([-0.075, shV + 0.012]), at([0.075, shV + 0.012])], {closed: false, weight: 1.1, color: lineOf(toneOf(o.shirt, L), L)});
  // Back seam and yoke, one fold at the waist.
  inkLine(p, base + 761, [at([0, shV - 0.01]), at([0, hip0 - 0.02])], {closed: false, weight: 1.0, curve: 0.1, color: lineOf(toneOf(jacket, L), L)});
  for (const side of [-1, 1]) inkLine(p, base + 762 + (side > 0 ? 1 : 0), [at([side * (sw - 0.03), shV - 0.05]), at([side * 0.09, shV - 0.02])], {closed: false, weight: 0.9, curve: 0.3, color: lineOf(toneOf(jacket, L), L)});
  inkLine(p, base + 764, [at([-0.05, hip0 + 0.06]), at([-0.02, hip0 + 0.03])], {closed: false, weight: 0.9, color: lineOf(toneOf(jacket, L), L)});

  paintBackHead(p, def, head, L, base, fill);
};
