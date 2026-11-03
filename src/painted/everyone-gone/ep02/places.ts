import {drawFigure, type CastDef, type FigPose} from '../../kit/cast';
import {chairSpec} from '../../kit/props';
import {clipHalf, ell, hardFill, inkLine, washAt} from '../../kit/draw';
import {EXPRESSIONS} from '../../kit/expressions';
import {hash} from '../../kit/hash';
import {mixColor, type Painter, type Pt} from '../../kit/painter';
import {PEOPLE} from '../../kit/people';
import {poseArms, poseFor} from '../../kit/poses';
import type {V3} from '../../kit/space';
import {dress, tintHoodie} from '../../kit/wardrobe';
import {frontRect, groundQuad, proj, unitAt, type Cam} from '../space';
import type {SheetState} from './sheet';
import {box, figureBox, measureFigure, paintOrder, union, type Box, type Item} from './collide';

/** `คุณ` (VD03): `woman-bob + hoodie, P01, neutral`, kit back view (`view: 'back'`), coral `tintHoodie` (#d0503f body, #a8432f hood). */
export const YOU2: CastDef = tintHoodie(dress(PEOPLE['woman-bob'], 'hoodie'));
export const paintYou = (p: Painter, g: Pt, unit: number, o: {hoodUp?: boolean; t?: number; seed?: number} = {}) =>
  drawFigure(p, YOU2, g, unit, {view: 'back', hoodUp: o.hoodUp ?? true, face: EXPRESSIONS.neutral, ...poseArms('P01', YOU2, g, unit)} as FigPose, o.t ?? 0, o.seed ?? YOU2.seed);

// EG-EP02-SHORT places (brief EG2-BRIEF-FILM-R1 VD02/VD05/VD07/VD08/VD09/VD10). Look-defining first versions by Film
// (W3.1 look frames, 2026-11-03); Boss hardens them into the shot sets. World metres per place: origin on the ground under
// the camera, +x right, +y up, the camera looks toward -z (EP01 `space.ts` projector: planes of constant z stay
// axis-aligned rectangles). Every set is `paint(p, state)`: `state` changes only light, crowd, shutters and lamps; every
// prop (sheet, garland, incense, benches) is drawn from the same numbers in every state, so it lands on the same pixels
// (PAIR201, VD05).

export type State = 'empty' | 'crowd' | 'mother';
/** 0 = blue hour (empty), 1 = warm morning (crowd and mother). */
const warmOf = (s: State) => (s === 'empty' ? 0 : 1);
const mix = (dawn: string, morn: string, w: number) => mixColor(dawn, morn, w);

type Rect = [number, number, number, number];
const SAFE: Rect = [-300, -300, 1380, 2220];
const clip = (pts: Pt[], [x0, y0, x1, y1]: Rect = SAFE): Pt[] => {
  let r = clipHalf(pts, [1, 0], x0);
  if (r.length) r = clipHalf(r, [-1, 0], -x1);
  if (r.length) r = clipHalf(r, [0, 1], y0);
  if (r.length) r = clipHalf(r, [0, -1], -y1);
  return r;
};
const fillC = (p: Painter, seed: number, color: string, pts: Pt[]) => {
  const c = clip(pts);
  if (c.length >= 3) hardFill(p, seed, color, c);
};
const washC = (p: Painter, seed: number, color: string, op: number, pts: Pt[], bleed = 0.2, tex = 0.45) => {
  const c = clip(pts);
  if (c.length >= 3) washAt(p, seed, color, op, c, bleed, tex);
};
/** Side plane x = X between depths z0..z1 and heights y0..y1, projected. */
const sideQuad = (c: Cam, X: number, z0: number, z1: number, y0: number, y1: number): Pt[] => [proj(c, [X, y0, z0]), proj(c, [X, y0, z1]), proj(c, [X, y1, z1]), proj(c, [X, y1, z0])];
/** Horizontal plane y = h over x0..x1, z0..z1 (z1 nearer), projected. */
const flatQuad = (c: Cam, x0: number, x1: number, z0: number, z1: number, h: number): Pt[] => [proj(c, [x0, h, z0]), proj(c, [x1, h, z0]), proj(c, [x1, h, z1]), proj(c, [x0, h, z1])];
/**
 * Vertical gradient sky: many thin bands with ragged (hashed) edges, so no step reads as a line (viewer check fix 5: banding),
 * then textured washes of both end colours over overlapping halves to dither what is left.
 */
const sky = (p: Painter, seed: number, top: string, low: string, y0: number, y1: number, n = 56) => {
  for (let i = 0; i < n; i++) {
    const a = y0 + ((y1 - y0) * i) / n, b = y0 + ((y1 - y0) * (i + 1.6)) / n;
    const edge = (y: number, k: number): Pt[] => Array.from({length: 9}, (_, j): Pt => [-20 + j * 140, y + (hash(seed + i * 17 + j * 5 + k) - 0.5) * 10]);
    hardFill(p, seed + i, mixColor(top, low, (i / (n - 1)) ** 1.4), [...edge(a, 0), ...edge(b, 1).reverse()]);
  }
  const mid = (y0 + y1) / 2;
  washAt(p, seed + 90, top, 36, [[-20, y0], [1100, y0], [1100, mid + 120], [-20, mid + 60]], 0.3, 0.75);
  washAt(p, seed + 91, low, 40, [[-20, mid - 80], [1100, mid - 140], [1100, y1], [-20, y1]], 0.3, 0.75);
};
/** A soft round glow (stacked washes), for lamps and lit signs. */
const glow = (p: Painter, seed: number, x: number, y: number, r: number, color: string, op: number) => {
  for (let i = 0; i < 3; i++) washAt(p, seed + i, color, op * (1 - i * 0.25), ell(x, y, r * (1 + i * 0.7), r * (1 + i * 0.7), 20), 0.35, 0.2);
};

/** The white sheet (0.30 x 0.42 m, printed side to the pole, blank back out, CL05): frontal at depth z, centre x, bottom y. */
const SHEET_W = 0.3, SHEET_H = 0.42;
export const paintSheetBack = (p: Painter, c: Cam, seed: number, x: number, y: number, z: number, w = 0) => {
  const r = frontRect(c, z, x - SHEET_W / 2, x + SHEET_W / 2, y, y + SHEET_H);
  // Ambient clock (CL05): the lower outer corner lifts in the breeze, 0.4 Hz, never fully flat (S02-B01-SH03 "one corner lifting").
  const lift = unitAt(c, z) * 0.03 * (0.6 + 0.4 * Math.sin(p.t * Math.PI * 2 * 0.4 + 1));
  r[2] = [r[2][0] + lift * 0.5, r[2][1] - lift];
  hardFill(p, seed, mix('#e9ecee', '#fbf8f0', w), r);
  // A faint show-through of the print (unreadable, CL06 "you cannot read it") and two tape strips.
  const u = unitAt(c, z), [cx, cy] = proj(c, [x, y + SHEET_H * 0.62, z]);
  washAt(p, seed + 1, '#9aa3ab', 50, ell(cx, cy, 0.09 * u, 0.06 * u, 12), 0.1, 0.2);
  for (const s of [-1, 1]) hardFill(p, seed + 2 + s, '#d9d2b0', frontRect(c, z + 0.002, x + s * 0.12 - 0.035, x + s * 0.12 + 0.035, y + SHEET_H - 0.03, y + SHEET_H + 0.02));
  inkLine(p, seed + 5, r, {color: mix('#7d8790', '#9a9286', w), weight: 0.6, curve: 0, still: true});
};

// ---------------------------------------------------------------------------------------------------------------------
// Yaowarat (S01-B02-SH01 and S04-B01-SH04; S01-B01-SH01 old-town street; S02 inserts at the shrine and the pole)

/** Eye level 1.6 m on the road centre, wide lens, horizon at y 900 so the tall signs fill the top and the wet road the bottom. */
export const YW_CAM: Cam = {x: 1.6, y: 1.6, z: 0, f: 700, hy: 900};
export const YW_YOU: V3 = [0.4, 0, -5.0];
export const YW_SHRINE: V3 = [6.2, 0, -6.5];
export const YW_POLE: V3 = [-5.2, 0, -12];
const YW_FACADE = 7, YW_KERB = 5, YW_FAR = 170;
/** Signs in brick/maroon, ochre, cream and a muted green (viewer check fix 2): lit by value, not chroma, so the coral hoodie is
 *  the one saturated mass in the street (VD02, brief acceptance 2). */
const SIGN_COLORS = ['#8a4a40', '#b39a62', '#e6e0d2', '#7a4038', '#5b7468', '#a89366', '#6e3a34', '#e6e0d2'];
const GLYPH_INK = ['#eadfc4', '#5a3a2c', '#7a4a40', '#eadfc4', '#eadfc4', '#5a3a2c', '#eadfc4', '#7a4a40'];

type Bay = {z0: number; z1: number; side: -1 | 1; top: number; tone: number; sign?: {h0: number; h1: number; out: number; color: number}};
const ywBays = (): Bay[] => {
  const bays: Bay[] = [];
  for (const side of [-1, 1] as const) {
    let z = -1, i = 0;
    while (z > -YW_FAR) {
      const len = 4 + 1.5 * hash(i * 7 + side * 31);
      const r = hash(i * 13 + side * 17);
      bays.push({z0: z - len, z1: z, side, top: 13 + 8 * hash(i * 3 + side * 5), tone: i, sign: r > 0.25 ? {h0: 3.4 + 1.5 * hash(i + 91 * side), h1: 9 + 6 * hash(i * 5 + 3 * side), out: 1.6 + 1.2 * hash(i * 11 + side), color: Math.floor(hash(i * 19 + side * 23) * SIGN_COLORS.length)} : undefined});
      z -= len;
      i++;
    }
  }
  return bays.sort((a, b) => a.z1 - b.z1); // far first
};
const YW_BAYS = ywBays();

/** Street solids people must not walk through (VD13): the shrine, the sheet pole and the lamp poles; signs hang from 3.4 m. */
export const ywSolids = (): {id: string; box: Box}[] => [
  {id: 'shrine', box: box(YW_SHRINE[0] - 0.42, YW_SHRINE[0] + 0.42, 0, 1.82, YW_SHRINE[2] - 0.12, YW_SHRINE[2] + 0.12)},
  {id: 'pole', box: box(YW_POLE[0] - 0.13, YW_POLE[0] + 0.13, 0, 9, YW_POLE[2] - 0.13, YW_POLE[2] + 0.3)},
  ...[-7, -31, -55, -79].flatMap((z) => [-1, 1].map((s) => {
    const zz = z - (s > 0 ? 12 : 0), x = s * (YW_KERB - 0.3);
    return {id: `lamp${s}@${zz}`, box: box(x - 0.09, x + 0.09, 0, 8, zz - 0.09, zz + 0.09)};
  })),
  ...YW_BAYS.filter((b) => b.sign).map((b, i) => {
    const x0 = b.side < 0 ? -YW_FACADE + 0.2 : YW_FACADE - 0.2 - b.sign!.out;
    return {id: `sign${i}`, box: box(x0, x0 + b.sign!.out, b.sign!.h0, b.sign!.h1, b.z1 - 0.35, b.z1 - 0.25)};
  }),
];

/** Glyph-like strokes in a vertical sign (no readable text): blocks of three to four short strokes per cell. */
const glyphs = (p: Painter, c: Cam, seed: number, x0: number, x1: number, y0: number, y1: number, z: number, color: string) => {
  const w = x1 - x0, cell = w * 0.62, n = Math.floor((y1 - y0 - 0.3) / (cell * 1.15));
  const cx = (x0 + x1) / 2;
  for (let j = 0; j < n; j++) {
    const yc = y1 - 0.25 - cell * 0.5 - j * cell * 1.15;
    for (let k = 0; k < 4; k++) {
      const h = hash(seed * 3 + j * 7 + k), v = hash(seed * 5 + j * 11 + k * 3);
      const horiz = h > 0.45;
      const ax = cx + (v - 0.5) * cell * 0.7, ay = yc + (hash(seed + j + k * 13) - 0.5) * cell * 0.7;
      const a: V3 = horiz ? [ax - cell * 0.32, ay, z] : [ax, ay + cell * 0.32, z], b: V3 = horiz ? [ax + cell * 0.32, ay, z] : [ax, ay - cell * 0.32, z];
      inkLine(p, seed * 40 + j * 5 + k, [proj(c, a), proj(c, b)], {color, weight: Math.max(1.4, unitAt(c, z) * 0.05), closed: false, curve: 0, still: true});
    }
  }
};

/** Fascia board colours (muted, VD02) and their glyph ink. */
const FASCIA = ['#6e3a34', '#b39a62', '#5b7468', '#e6e0d2', '#8a4a40', '#4f5a63'];
const FASCIA_INK = ['#e6d9b8', '#4a3226', '#e6dfcc', '#6e3a34', '#eadfc4', '#d9cfb0'];
/** Ground-floor door type per bay: roller shutter (most), folding steel grille over glass doors, old wooden panel doors. */
type ShopKind = 'roller' | 'grille' | 'wood';
/** Bays (index in the far-to-near `YW_BAYS`) given wooden doors by choice, so one reads large on each side near the lens. */
const WOOD_BAYS = new Set([63, 66]);
const shopKind = (i: number, side: number): ShopKind => {
  if (WOOD_BAYS.has(i)) return 'wood';
  const r = hash(i * 29 + side * 7);
  return r < 0.6 ? 'roller' : r < 0.8 ? 'grille' : 'wood';
};

/** Glyph-like ticks (no readable text) along a horizontal strip on a facade plane: cells along z, three strokes each. */
const sideGlyphs = (p: Painter, c: Cam, seed: number, X: number, za: number, zb: number, y0: number, y1: number, color: string, vertical = false) => {
  const h = y1 - y0, cell = vertical ? h : h * 0.8, n = Math.max(1, Math.floor((zb - za) / (cell * 1.25)));
  const wpx = Math.max(1, unitAt(c, (za + zb) / 2) * 0.03);
  for (let j = 0; j < n; j++) {
    const zc = za + (zb - za) * ((j + 0.5) / n), yc = (y0 + y1) / 2;
    for (let k = 0; k < 3; k++) {
      const hz = hash(seed * 7 + j * 11 + k) > 0.5, o = (hash(seed * 3 + j * 5 + k * 13) - 0.5) * cell * 0.5, q = (hash(seed + j * 17 + k * 3) - 0.5) * h * 0.4;
      const a: V3 = hz ? [X, yc + q, zc - cell * 0.3] : [X, yc + h * 0.3, zc + o], b: V3 = hz ? [X, yc + q, zc + cell * 0.3] : [X, yc - h * 0.3, zc + o];
      inkLine(p, seed * 50 + j * 4 + k, [proj(c, a), proj(c, b)], {color, weight: wpx, closed: false, curve: 0, still: true});
    }
  }
};

/**
 * One Yaowarat shophouse ground floor (LF01 v3, user note LQ1 "draw the door detail"): pilaster with a house-number plate and a
 * meter box, a fascia sign board with glyph ticks, and, at dawn, the closed door of its kind: a roller shutter (guide rails,
 * slats, bottom bar, lift handles, padlock, some with a painted shop name), a folding steel grille over dark glass doors (bars,
 * lattice, chain and padlock) or old wooden folding doors (leaves, recessed panels, hinges, ring handles, drop bar, red
 * couplet strips). In the morning (crowd) the same pilaster, plates and fascia stay (VD05); the shutter is rolled into its box.
 * Detail is drawn only where it reads (`d` = distance of the bay's near edge).
 */
const shopfront = (p: Painter, c: Cam, b: Bay, i: number, state: State, w: number) => {
  const s = b.side, X = s * YW_FACADE, d = -b.z1, base = 40000 + i * 160;
  const za = b.z0 + 0.3, zb = b.z1 - 0.3, L = zb - za, kind = shopKind(i, s);
  const SQ = (off: number, z0: number, z1: number, y0: number, y1: number) => sideQuad(c, X - s * off, z0, z1, y0, y1);
  const lineZ = (off: number, y: number, z0: number, z1: number): Pt[] => [proj(c, [X - s * off, y, z0]), proj(c, [X - s * off, y, z1])];
  const lineY = (off: number, z: number, y0: number, y1: number): Pt[] => [proj(c, [X - s * off, y0, z]), proj(c, [X - s * off, y1, z])];
  const u = unitAt(c, (za + zb) / 2), fine = Math.max(0.6, u * 0.012);
  const ink = (seed: number, pts: Pt[], color: string, weight = fine) => inkLine(p, seed, pts, {color, weight, closed: false, curve: 0, still: true});
  const open = state !== 'empty', topY = 2.92;

  if (!open) {
    if (kind === 'roller') {
      const tone = mixColor('#9ea6ad', '#a9a59a', hash(i * 3 + s));
      fillC(p, base, tone, SQ(0.02, za, zb, 0, topY));
      // Grime along the foot of the shutter.
      washC(p, base + 1, '#6f777e', 60, SQ(0.021, za, zb, 0, 0.5), 0.2, 0.6);
      const step = d < 22 ? 0.1 : d < 40 ? 0.2 : 0;
      if (step) for (let y = step; y < topY - 0.01; y += step) ink(base + 2 + Math.round(y * 10), lineZ(0.022, y, za + 0.08, zb - 0.08), '#7b858d');
      // Shop name painted on the shutter (some bays): a pale panel with glyph ticks.
      if (d < 40 && hash(i * 41 + s) > 0.5) {
        fillC(p, base + 40, mixColor(tone, '#e6e0d2', 0.45), SQ(0.023, za + L * 0.2, zb - L * 0.2, 1.5, 2.3));
        sideGlyphs(p, c, base + 41, X - s * 0.024, za + L * 0.22, zb - L * 0.22, 1.55, 2.25, '#6e3a34');
      }
      // Guide rails, bottom bar, two lift handles and the floor padlock.
      for (const [z0, z1] of [[za, za + 0.08], [zb - 0.08, zb]]) fillC(p, base + 50 + z0, '#6c757d', SQ(0.04, z0, z1, 0, topY));
      fillC(p, base + 52, '#6c757d', SQ(0.03, za, zb, 0, 0.12));
      if (d < 40) for (const f of [1 / 3, 2 / 3]) fillC(p, base + 53 + f * 3, '#3f464c', SQ(0.05, za + L * f - 0.09, za + L * f + 0.09, 0.15, 0.22));
      if (d < 25) {
        const [lx, ly] = proj(c, [X - s * 0.06, 0.06, za + L / 2]);
        inkLine(p, base + 56, ell(lx, ly - u * 0.07, u * 0.025, u * 0.03, 10), {color: '#5a5f64', weight: fine, curve: 0.3, still: true});
        hardFill(p, base + 57, '#a8894a', ell(lx, ly - u * 0.03, u * 0.035, u * 0.035, 10));
      }
    } else if (kind === 'grille') {
      // Dark glass doors behind (frames, a sky reflection), then the folding grille in front.
      fillC(p, base, '#47505a', SQ(0, za, zb, 0, topY));
      washC(p, base + 1, '#8fa2b8', 50, SQ(0.005, za + L * 0.1, zb - L * 0.3, 1.2, 2.6), 0.2, 0.5);
      for (let k = 1; k < 4; k++) ink(base + 2 + k, lineY(0.006, za + (L * k) / 4, 0, topY), '#2c3238', fine * 1.4);
      const bar = Math.max(0.12, L / 40), nb = Math.floor(L / bar);
      for (let k = 0; k <= nb; k++) ink(base + 10 + k, lineY(0.06, za + k * bar, 0.05, topY - 0.05), '#88919a');
      if (d < 35) for (const y0 of [0.4, 1.2, 2.0]) {
        const zig: Pt[] = [];
        for (let k = 0; k <= nb; k++) zig.push(proj(c, [X - s * 0.065, y0 + (k % 2) * 0.4, za + k * bar]));
        inkLine(p, base + 60 + y0 * 10, zig, {color: '#7d868e', weight: fine, closed: false, curve: 0, still: true});
      }
      fillC(p, base + 70, '#6c757d', SQ(0.07, za, zb, topY - 0.08, topY));
      fillC(p, base + 71, '#6c757d', SQ(0.07, za, zb, 0, 0.06));
      if (d < 30) {
        const [lx, ly] = proj(c, [X - s * 0.08, 1.1, za + L / 2]);
        inkLine(p, base + 72, [[lx - u * 0.1, ly - u * 0.06], [lx, ly + u * 0.02], [lx + u * 0.1, ly - u * 0.05]], {color: '#4b5157', weight: fine * 1.6, closed: false, curve: 0.5, still: true});
        hardFill(p, base + 73, '#a8894a', ell(lx, ly + u * 0.06, u * 0.035, u * 0.04, 10));
      }
    } else {
      // Old wooden folding doors: leaves with two recessed panels each, hinges on the seams, ring handles and a drop bar.
      const wood = mix('#6f5d50', '#7a6250', w), dark = '#3e3029';
      fillC(p, base, wood, SQ(0.01, za, zb, 0, topY));
      const n = Math.max(4, Math.round(L / 0.55)), lw = L / n;
      for (let k = 0; k < n; k++) {
        const z0 = za + k * lw;
        if (d < 40) for (const [y0, y1] of [[0.25, 1.25], [1.45, 2.65]]) {
          fillC(p, base + 10 + k * 3 + y0, mixColor(wood, '#2a211c', 0.18), SQ(0.012, z0 + lw * 0.18, z0 + lw * 0.82, y0, y1));
          ink(base + 30 + k * 3 + y0, lineZ(0.013, y1, z0 + lw * 0.18, z0 + lw * 0.82), mixColor(wood, '#e6d9c4', 0.35));
        }
        if (k > 0) {
          ink(base + 60 + k, lineY(0.012, z0, 0, topY), dark, fine * 1.3);
          if (d < 30 && k % 2) for (const y of [0.45, 1.45, 2.45]) fillC(p, base + 70 + k * 3 + y, '#2b2420', SQ(0.014, z0 - 0.03, z0 + 0.03, y, y + 0.1));
        }
      }
      const mid = za + L / 2;
      fillC(p, base + 90, '#2f2622', SQ(0.03, mid - lw, mid + lw, 1.02, 1.1));
      if (d < 35) for (const sg of [-1, 1]) {
        const [hx, hy] = proj(c, [X - s * 0.03, 1.3, mid + sg * 0.12]);
        inkLine(p, base + 92 + sg, ell(hx, hy, u * 0.035, u * 0.045, 12), {color: '#a8894a', weight: fine * 1.5, curve: 0.3, still: true});
      }
      // Red couplet strips on the wall either side (glyph ticks, no readable text).
      for (const [z0, z1] of [[za - 0.26, za - 0.04], [zb + 0.04, zb + 0.26]] as const) {
        const off = z0 > zb ? 0.16 : 0.02;
        fillC(p, base + 100 + z0, '#8a3c34', SQ(off, z0, z1, 0.5, 2.7));
        if (d < 30) sideGlyphs(p, c, base + 101 + Math.round(z0), X - s * (off + 0.005), z0, z1, 0.6, 2.6, '#c9b07a', true);
      }
    }
  } else {
    fillC(p, base, '#e6c48e', SQ(0, za, zb, 0, topY));
    washC(p, base + 1, '#b5763f', 120, SQ(0.005, za + 0.3, zb - 0.3, 0.2, 1.6), 0.15, 0.6);
  }
  // Shutter box (the roller rolled into it in the morning) and the fascia sign board above.
  if (kind !== 'wood' || open) fillC(p, base + 110, mix('#6f7880', '#8f877b', w), SQ(0.12, za, zb, topY, 3.1));
  const fc = Math.floor(hash(i * 53 + s * 11) * FASCIA.length);
  fillC(p, base + 111, mix(mixColor(FASCIA[fc], '#ffffff', 0.08), mixColor(FASCIA[fc], '#6b5e50', 0.12), w), SQ(0.08, za - 0.1, zb + 0.1, 3.15, 3.8));
  if (d < 45) {
    ink(base + 112, [...lineZ(0.085, 3.15, za - 0.1, zb + 0.1), ...lineZ(0.085, 3.8, zb + 0.1, za - 0.1)], '#3a2f2a');
    sideGlyphs(p, c, base + 113, X - s * 0.09, za + 0.1, zb - 0.1, 3.25, 3.7, FASCIA_INK[fc]);
  }
  // Pilaster at the bay's near end (protrudes 0.15 m; its end face looks at the lens), with the number plate and a meter box.
  const pil = mix('#86919c', '#d0bfa5', w);
  fillC(p, base + 120, pil, SQ(0.15, zb, b.z1, 0, 3.15));
  fillC(p, base + 121, mixColor(pil, '#ffffff', 0.12), frontRect(c, b.z1, Math.min(X, X - s * 0.15), Math.max(X, X - s * 0.15), 0, 3.15));
  if (d < 40) {
    fillC(p, base + 122, '#4f6a86', SQ(0.155, zb + 0.06, zb + 0.24, 2.1, 2.26));
    ink(base + 123, lineZ(0.156, 2.18, zb + 0.1, zb + 0.2), '#e6e0d2');
    if (hash(i * 61 + s) > 0.45) {
      fillC(p, base + 124, '#8d9296', SQ(0.17, zb + 0.04, zb + 0.26, 1.25, 1.62));
      fillC(p, base + 125, '#3f464c', SQ(0.175, zb + 0.09, zb + 0.21, 1.42, 1.54));
    }
  }
  // Threshold step in front of the opening.
  fillC(p, base + 130, mix('#6d747b', '#a29886', w), groundQuad(c, X - s * 0.4, X, za, zb, 0.02));
};

export const paintYaowarat = (p: Painter, state: State, o: {you?: boolean; cam?: Cam; haze?: number} = {}) => {
  const c = o.cam ?? YW_CAM, w = warmOf(state);
  // Sky: milky blue hour (empty) / warm pale morning (crowd).
  sky(p, 21000, mix('#8fa2b8', '#b9cbd8', w), mix('#e4dcd2', '#f7e4c6', w), -20, 960);
  // Far haze block at the end of the street.
  washC(p, 21100, mix('#a9b3bf', '#e2d3bc', w), 200, frontRect(c, -YW_FAR, -YW_FACADE, YW_FACADE, 0, 26));
  // Road, pavements, kerbs.
  fillC(p, 21200, mix('#5f6b79', '#8f8a82', w), groundQuad(c, -YW_KERB, YW_KERB, -YW_FAR, -0.4));
  for (const s of [-1, 1]) {
    fillC(p, 21210 + s, mix('#7d848c', '#b4aa9a', w), groundQuad(c, s < 0 ? -YW_FACADE : YW_KERB, s < 0 ? -YW_KERB : YW_FACADE, -YW_FAR, -0.4));
    fillC(p, 21215 + s, mix('#a4abb0', '#d1c7b5', w), groundQuad(c, s * YW_KERB - 0.12, s * YW_KERB + 0.12, -YW_FAR, -0.4, 0.12));
  }
  // Road darkens toward the lens (wet asphalt), so the near ground has weight instead of an empty grey field.
  for (let k = 0; k < 8; k++) fillC(p, 21220 + k, mixColor(mix('#5f6b79', '#8f8a82', w), mix('#3b4552', '#6f675c', w), (k + 1) / 8), groundQuad(c, -YW_KERB, YW_KERB, -9 + k, -0.4));
  // Lane dashes (centre) and edge lines.
  for (let z = -2; z > -90; z -= 6) fillC(p, 21300 + z, mix('#c3c9cc', '#e2ddd2', w), groundQuad(c, -0.07, 0.07, z - 3, z));
  for (const s of [-1, 1]) fillC(p, 21400 + s, mix('#a5adb2', '#d6d0c4', w), groundQuad(c, s * 4.55 - 0.06, s * 4.55 + 0.06, -YW_FAR, -0.4));
  // Wet sheen on the road (dawn wash-down): a lighter streak band down the middle.
  if (w < 1) for (let k = 0; k < 4; k++) fillC(p, 21450 + k, mixColor('#5f6b79', '#a9b8c6', 0.25 + 0.1 * k), groundQuad(c, -1.6 + 0.9 * k, -1.3 + 0.9 * k, -70, -6 - 2 * k));

  // Facades, shutters, windows and signs, far to near.
  for (const [i, b] of YW_BAYS.entries()) {
    const X = b.side * YW_FACADE, d = -b.z1;
    const tone = mix(['#7d8996', '#8e98a2', '#6f7c8a', '#98a0a6'][b.tone % 4], ['#c7b59b', '#d6c7ae', '#b9a68c', '#ddd0bb'][b.tone % 4], w);
    fillC(p, 22000 + i * 40, tone, sideQuad(c, X, b.z0, b.z1, 0, b.top));
    if (d < 70) {
      // Ground floor: closed doors with their hardware at dawn; open shopfront (warm interior, goods) in the morning (LF01 v3).
      shopfront(p, c, b, i, state, w);
      // Upper floor windows (two floors).
      for (const y0 of [4.2, 7.4]) if (y0 + 1.6 < b.top) fillC(p, 22000 + i * 40 + 20 + y0, mix('#4f5c69', '#7d7468', w), sideQuad(c, X, b.z0 + 0.8, b.z1 - 0.8, y0, y0 + 1.6));
    }
    // Vertical sign hanging out over the street (frontal plane at the bay's near edge).
    if (b.sign && d > 2.5) {
      const z = b.z1 - 0.3, x0 = b.side < 0 ? -YW_FACADE + 0.2 : YW_FACADE - 0.2 - b.sign.out, x1 = x0 + b.sign.out;
      const col = SIGN_COLORS[b.sign.color];
      const r = frontRect(c, z, x0, x1, b.sign.h0, b.sign.h1);
      // Lit at dawn: a soft halo; in the morning the lamps are off.
      if (w < 1 && d < 60) {
        const [gx, gy] = proj(c, [(x0 + x1) / 2, (b.sign.h0 + b.sign.h1) / 2, z]);
        glow(p, 23000 + i * 5, gx, gy, unitAt(c, z) * b.sign.out * 0.9, mix(col, '#fff2d0', 0.4), 26 * (1 - w));
      }
      fillC(p, 24000 + i * 9, mix(mixColor(col, '#ffffff', 0.12), mixColor(col, '#6b5e50', 0.12), w), r);
      fillC(p, 24000 + i * 9 + 1, mix('#2b2a2c', '#5a4d42', w), frontRect(c, z + 0.01, x0 - 0.05, x0 + 0.05, b.sign.h0, b.sign.h1));
      if (d < 45) glyphs(p, c, 900 + i, x0 + 0.15, x1 - 0.15, b.sign.h0, b.sign.h1, z + 0.02, GLYPH_INK[b.sign.color]);
    }
  }

  // No sign reflections: the soft smears under the signs read as stains or ghost shapes standing on the road (viewer check
  // fix 2, OPN201); the wet sheen band down the middle carries the wet road.

  // Street lamps on both kerbs: concrete pole, arm over the road, lit head at dawn.
  for (const [j, z] of [-7, -31, -55, -79].entries()) for (const s of [-1, 1] as const) {
    const zz = z - (s > 0 ? 12 : 0), x = s * (YW_KERB - 0.3), u = unitAt(c, zz);
    fillC(p, 26000 + j * 10 + s, mix('#4d5660', '#6f675e', w), frontRect(c, zz, x - 0.09, x + 0.09, 0, 8));
    inkLine(p, 26050 + j * 10 + s, [proj(c, [x, 8, zz]), proj(c, [x - s * 1.6, 8.4, zz])], {color: mix('#3a424a', '#5e564d', w), weight: Math.max(1.2, u * 0.08), closed: false, curve: 0.3, still: true});
    const [hx, hy] = proj(c, [x - s * 1.6, 8.25, zz]);
    if (w < 1) glow(p, 26100 + j * 10 + s, hx, hy + u * 0.1, u * 0.35, '#ffd690', 70 * (1 - w));
    hardFill(p, 26200 + j * 10 + s, w < 1 ? '#fff0c8' : '#b9b2a6', ell(hx, hy + u * 0.08, u * 0.28, u * 0.1, 12));
  }

  // Close cameras (B3): a soft haze over the street so the pole or the shrine ledge painted after it sits forward (no blur filter).
  if (o.haze) washAt(p, 26900, mix('#c4ccd6', '#f1e4cc', w), 150 * o.haze, [[-20, -20], [1100, -20], [1100, 1940], [-20, 1940]], 0.05, 0.2);
  // The pole with the sheet (left kerb, CL05), and the small street shrine with garland and incense (right, VD08).
  const [px] = proj(c, YW_POLE), pu = unitAt(c, YW_POLE[2]);
  fillC(p, 27000, mix('#868c90', '#a39888', w), frontRect(c, YW_POLE[2], YW_POLE[0] - 0.13, YW_POLE[0] + 0.13, 0, 9));
  inkLine(p, 27001, [proj(c, [YW_POLE[0] + 0.13, 0, YW_POLE[2]]), proj(c, [YW_POLE[0] + 0.13, 9, YW_POLE[2]])], {color: '#4b5157', weight: 0.8, closed: false, curve: 0, still: true});
  paintSheetBack(p, c, 27010, YW_POLE[0], 1.35, YW_POLE[2] + 0.14, w);
  void px; void pu;
  paintShrine(p, c, YW_SHRINE, w);

  if (o.you !== false) {
    const g = proj(c, YW_YOU), u = unitAt(c, YW_YOU[2]);
    paintYou(p, g, u, {t: p.t});
  }
};

/** Chinese-style street shrine: pedestal, small red house with a tiled roof, ledge with the jasmine garland and the incense pot. */
export const paintShrine = (p: Painter, c: Cam, at: V3, w: number) => {
  const [x, , z] = at;
  const red = mix('#a8352e', '#b8402f', w), gold = mix('#b99a4e', '#d4b05a', w);
  fillC(p, 28000, mix('#7c858c', '#b3a690', w), frontRect(c, z, x - 0.35, x + 0.35, 0, 1.05));
  fillC(p, 28001, mix('#959ca2', '#cdbfa8', w), frontRect(c, z + 0.01, x - 0.42, x + 0.42, 1.0, 1.1));
  fillC(p, 28002, red, frontRect(c, z - 0.05, x - 0.28, x + 0.28, 1.1, 1.65));
  fillC(p, 28003, mix('#3a1f1c', '#4a2a22', w), frontRect(c, z - 0.04, x - 0.15, x + 0.15, 1.18, 1.5));
  const roof = [proj(c, [x - 0.4, 1.65, z]), proj(c, [x + 0.4, 1.65, z]), proj(c, [x + 0.3, 1.82, z]), proj(c, [x - 0.3, 1.82, z])];
  fillC(p, 28004, mix('#6e2a24', '#8a3a2a', w), roof);
  inkLine(p, 28005, roof, {color: '#2b1a17', weight: 0.8, curve: 0, still: true});
  // Inner warm glow (a small oil lamp) at dawn.
  const [lx, ly] = proj(c, [x, 1.3, z - 0.04]), u = unitAt(c, z);
  glow(p, 28010, lx, ly, u * 0.08, '#ffc773', 70 * (1 - w) + 20);
  paintIncense(p, c, [x + 0.12, 1.1, z + 0.08], w, u);
  paintGarland(p, c, [x - 0.14, 1.1, z + 0.1], u);
  void gold;
};

/** Incense pot (brass) with three sticks, red tips and a thin smoke wisp (ambient clock `p.t`, DF-20261030 hold rule). */
export const paintIncense = (p: Painter, c: Cam, at: V3, w: number, u: number) => {
  const [x, y, z] = at, [px, py] = proj(c, [x, y, z]);
  hardFill(p, 28100, mix('#a8894a', '#c9a55a', w), ell(px, py - u * 0.035, u * 0.07, u * 0.04, 14));
  for (let k = 0; k < 3; k++) {
    const sx = px + (k - 1) * u * 0.025, top = py - u * (0.24 + 0.02 * k);
    inkLine(p, 28110 + k, [[sx, py - u * 0.05], [sx + (k - 1) * u * 0.01, top]], {color: '#7a4a2a', weight: Math.max(0.8, u * 0.006), closed: false, curve: 0, still: true});
    hardFill(p, 28120 + k, '#ff6a3a', ell(sx + (k - 1) * u * 0.01, top, Math.max(1.5, u * 0.008), Math.max(1.5, u * 0.008), 8));
  }
  // Smoke: three wisps rising and swaying slowly.
  for (let k = 0; k < 3; k++) {
    const pts: Pt[] = [];
    for (let s = 0; s <= 8; s++) {
      const v = s / 8, sway = Math.sin(p.t * 2.4 + v * 5 + k * 2) * u * 0.05 * v;
      pts.push([px + (k - 1) * u * 0.02 + sway + v * u * 0.04, py - u * (0.26 + 0.6 * v)]);
    }
    inkLine(p, 28130 + k, pts, {color: mix('#c6ccd2', '#e9e2d6', w), weight: Math.max(1, u * 0.012), closed: false, curve: 0.6});
  }
};

/** Jasmine garland (phuang malai) draped on a ledge: white buds in a loop with a red-green tassel. */
export const paintGarland = (p: Painter, c: Cam, at: V3, u: number) => {
  const [px0, py] = proj(c, at), r = u * 0.022, px = px0 + Math.sin(p.t * Math.PI * 2 * 0.4); // ambient clock: 1 px at 0.4 Hz (B7)
  for (let k = 0; k < 14; k++) {
    const a = (k / 14) * Math.PI;
    const bx = px + Math.cos(a) * u * 0.08, by = py - u * 0.01 + Math.sin(a) * u * 0.05;
    hardFill(p, 28200 + k, k % 4 === 0 ? '#e9f0e2' : '#fbfbf6', ell(bx, by, r, r * 0.9, 8));
  }
  hardFill(p, 28220, '#c23a3a', ell(px, py + u * 0.075, r * 1.1, r * 1.3, 8));
  hardFill(p, 28221, '#5c8a4a', ell(px, py + u * 0.11, r * 0.8, r * 1.2, 8));
};

// ---------------------------------------------------------------------------------------------------------------------
// Pier (S01-B02-SH03, S02-B01-SH04 empty; S04-B01-SH06 crowd; S05-B01-SH01 mother). One camera for all three states.

/** Inside the covered pier hall looking along it: the river on the left and ahead, the hall roof top right, benches right. */
export const PIER_CAM: Cam = {x: -1.6, y: 1.6, z: 5, f: 720, hy: 860};
export const PIER_YOU: V3 = [-2.2, 0, -1.4];
/**
 * S05 (LF05 v2, viewer check fix 1): the mother is the largest still figure, 2.75 m from the lens (about 22% of frame height), and
 * the camera is the same position tilted up 80 px (`PIER_CAM_S05`, the end of the slow push) so her feet stay near the top of the
 * caption band (feet y about 1199; face about y 790-880, hands and stack about y 900-960).
 */
export const PIER_MOTHER: V3 = [-1.3, 0, 2.25];
export const PIER_CAM_S05: Cam = {...PIER_CAM, hy: 780};
const EDGE = -3, ROOF = 4.3, HALL_END = -24, WALL = 6.5;
const PILLARS_Z = [-0.4, -2.5, -7, -11.5, -16, -20.5];
/** LF02/LF03 v2: on the front river-side pillar and lower, so it is its own white mass apart from `คุณ`'s head and the boat. */
export const PIER_SHEET = {x: EDGE, y: 0.95, z: -0.4} as const;
const DECK_NEAR = 4.6;
/** Deck limits for the VD13 test: people stay on the camera side of the river rail and inside the hall. */
export const PIER_BOUNDS = {edge: EDGE, wall: WALL, end: HALL_END - 3, near: DECK_NEAR, roof: ROOF} as const;

/** Bench seat height (m): the kit adults' seated seat height (`chairSpec`, man-spiky 0.330, man-crop 0.341), so a P31 sitter's
 *  seat lands on the plank instead of sinking into it (VD13). Sitters are cast within `SEAT_TOL` of it. */
export const BENCH_SEAT = 0.33, SEAT_TOL = 0.025, BENCH_DEPTH = 0.45;
/** Depth gap (m) a standing walker keeps from a bench or a sitter it overlaps in the picture, so its feet never read as on the
 *  seat and its legs never read as through the bench (VD13). */
export const BENCH_CLEAR = 0.6;
/** Benches (x = seat front edge toward the river, z0..z1 far..near). Same in every state (VD05). */
export const PIER_BENCHES = [
  {x: 1.8, z0: -17, z1: -14},
  {x: 1.8, z0: -12.5, z1: -9.5},
  {x: 1.8, z0: -8, z1: -5},
  {x: 0.25, z0: 0.6, z1: 3.6},
] as const;
type Bench = (typeof PIER_BENCHES)[number];
export const benchBox = (b: Bench): Box => box(b.x, b.x + BENCH_DEPTH + 0.05, 0, BENCH_SEAT + 0.47, b.z0, b.z1);

const bench = (p: Painter, c: Cam, seed: number, b: Bench, w: number) => {
  const {x: bx, z0, z1} = b, S = BENCH_SEAT;
  const wood = mix('#6b6660', '#9a7a58', w), dark = mix('#4b4a4a', '#6b5440', w);
  // Back first (furthest from the lens), then legs, apron and the seat plank.
  fillC(p, seed + 3, wood, sideQuad(c, bx + BENCH_DEPTH, z0, z1, S + 0.1, S + 0.47));
  for (const zz of [z0 + 0.2, (z0 + z1) / 2, z1 - 0.2]) fillC(p, seed + zz * 3, dark, frontRect(c, zz, bx + 0.05, bx + 0.15, 0, S));
  fillC(p, seed + 1, dark, sideQuad(c, bx, z0, z1, S - 0.08, S));
  fillC(p, seed + 2, wood, flatQuad(c, bx, bx + BENCH_DEPTH, z0, z1, S));
  inkLine(p, seed + 4, [proj(c, [bx, S, z1]), proj(c, [bx, S, z0])], {color: '#3a3532', weight: 0.7, closed: false, curve: 0, still: true});
};

/**
 * Crowd card. `bench` (index into PIER_BENCHES) seats the person there in P31, profile toward the river: the ground point is
 * placed so the hip sits 0.28 m behind the seat front (VD13); `at[0]` is ignored for sitters.
 */
type Walker = {who: CastDef; at: V3; view: 'left' | 'right'; walk?: number; bench?: number; seed: number; /** Speed m/s along the facing direction; 0/absent = stands (B6). */ pace?: number};
/** Stroll amplitude of the animated crowd (calm morning, VD13). */
const STROLL = 0.6;
/** A walker `df` frames after its look-frame position: it keeps its facing (left = -x, right = +x), the walk phase follows the distance. */
export const walkerNow = (wk: Walker, df: number): Walker => {
  if (!wk.pace || wk.bench !== undefined) return wk;
  const d = (wk.pace * df) / 30, dir = wk.view === 'left' ? -1 : 1;
  return {...wk, at: [wk.at[0] + dir * d, wk.at[1], wk.at[2]], walk: (wk.walk ?? 0) + d / 0.8};
};
const dressAs = (id: keyof typeof PEOPLE, outfit?: Parameters<typeof dress>[1], over: Partial<CastDef['outfit']> = {}): CastDef => {
  const base = outfit ? dress(PEOPLE[id], outfit) : PEOPLE[id];
  return {...base, outfit: {...base.outfit, ...over}};
};
const GREEN = '#3d7f55';
/** Delivery rider: kit `rider` with a generic green jacket and pack (the kit orange sits too near the coral hoodie, VD02). */
const RIDER: CastDef = (() => {
  const r = dressAs('man-spiky', 'rider', {shirt: GREEN, sleeve: GREEN});
  const gear = r.outfit.gear ?? {};
  return {...r, outfit: {...r.outfit, gear: {...gear, pack: GREEN, hat: gear.hat && {...gear.hat, band: GREEN}}}};
})();
/**
 * Crowd per state: kit cast cards in profile at depths on the same ground; a gap is left around "คุณ" (VD11). Positions pass the
 * VD13 collision test (`tests/eg2-crowd-collision.test.ts`): no walker inside a bench, pillar, rail post, bollard or another
 * walker; sitters on a bench seat. LF v3: walkers moved off the bench lines and the near bench; seated cast swapped to
 * adults whose seat height matches the bench (woman-elder sits 0.27 m, too low).
 */
const PIER_CROWD: Record<'crowd' | 'mother', Walker[]> = {
  crowd: [
    {who: dressAs('man-buzz', 'office'), at: [-0.5, 0, -15], view: 'left', seed: 1},
    {who: dressAs('woman-pixie'), at: [1.0, 0, -13.2], view: 'left', seed: 2},
    {who: dressAs('girl-school'), at: [-1.1, 0, -11.5], view: 'left', walk: 0.3, seed: 3},
    {who: dressAs('boy-school'), at: [-0.3, 0, -11], view: 'left', walk: 0.55, seed: 4},
    {who: dressAs('woman-ponytail', 'vendor'), at: [1.0, 0, -8.6], view: 'left', seed: 5},
    {who: dressAs('man-elder'), at: [0.9, 0, -6.5], view: 'left', seed: 6},
    {who: dressAs('woman-long'), at: [-1.9, 0, -8.6], view: 'left', walk: 0.15, seed: 7},
    {who: RIDER, at: [-0.5, 0, 0.6], view: 'right', walk: 0.4, seed: 8},
    {who: dressAs('man-shaved'), at: [2.1, 0, -2.4], view: 'left', walk: 0.75, seed: 9},
    {who: dressAs('woman-elder'), at: [-2.4, 0, -9.4], view: 'left', seed: 10},
    {who: dressAs('man-parted', 'office'), at: [-1.0, 0, 2.2], view: 'left', walk: 0.2, seed: 20},
    {who: dressAs('woman-ponytail'), at: [-0.6, 0, 0.0], view: 'left', seed: 21},
    // LF03 v2 depth bands (viewer check fix 4, L15 "เต็มไปด้วยผู้คน"): a mid band at z -3..-5, seated people on the benches, a
    // far band at the hall end. Nobody inside x -2.9..-1.5 nearer than z -4 (the gap around `คุณ`, VD11).
    {who: dressAs('man-crop'), at: [0.5, 0, -3.6], view: 'right', walk: 0.1, seed: 23},
    {who: dressAs('woman-pixie', 'office'), at: [1.1, 0, -4.1], view: 'left', walk: 0.5, seed: 24},
    {who: dressAs('man-buzz'), at: [-0.5, 0, -4.4], view: 'left', walk: 0.85, seed: 25},
    {who: dressAs('woman-long', undefined, {jacket: '#7d6f86', sleeve: '#7d6f86'}), at: [0, 0, -6.0], view: 'left', bench: 2, seed: 26},
    {who: dressAs('man-spiky', undefined, {jacket: '#56645a', sleeve: '#56645a'}), at: [0, 0, -7.3], view: 'left', bench: 2, seed: 27},
    {who: dressAs('woman-ponytail', undefined, {jacket: '#6f7f9a', sleeve: '#6f7f9a'}), at: [0, 0, -10.6], view: 'left', bench: 1, seed: 28},
    {who: dressAs('man-crop', 'office'), at: [0.2, 0, -18], view: 'left', walk: 0.3, seed: 29},
    {who: dressAs('woman-long'), at: [-1.4, 0, -19.5], view: 'right', walk: 0.7, seed: 30},
    {who: dressAs('boy-school'), at: [2.8, 0, -18.0], view: 'left', seed: 31},
    {who: dressAs('man-shaved', 'office'), at: [1.1, 0, -21], view: 'right', walk: 0.2, seed: 32},
    {who: dressAs('woman-long', 'office'), at: [-0.9, 0, -2.6], view: 'left', walk: 0.4, seed: 33},
    {who: dressAs('man-elder'), at: [2.6, 0, -3.0], view: 'right', walk: 0.65, seed: 34},
    {who: dressAs('girl-school'), at: [-0.1, 0, -5.8], view: 'right', walk: 0.9, seed: 35},
    {who: dressAs('man-crop'), at: [-1.0, 0, -6.8], view: 'right', walk: 0.25, seed: 36},
    {who: dressAs('woman-ponytail', 'nurse'), at: [0.1, 0, -8.0], view: 'left', walk: 0.6, seed: 37},
    {who: dressAs('man-buzz', 'office'), at: [3.0, 0, -9.6], view: 'right', seed: 38},
    {who: dressAs('woman-pixie'), at: [-0.6, 0, -13.5], view: 'right', walk: 0.1, seed: 39},
    {who: dressAs('man-parted'), at: [0.9, 0, -16.2], view: 'left', walk: 0.45, seed: 40},
  ],
  mother: [
    {who: dressAs('man-buzz', 'office'), at: [0.1, 0, -15.5], view: 'left', seed: 11},
    {who: dressAs('woman-pixie'), at: [1.0, 0, -13.2], view: 'left', walk: 0.6, seed: 12},
    {who: dressAs('woman-long'), at: [-1.2, 0, -10.5], view: 'right', walk: 0.2, seed: 13},
    {who: dressAs('woman-ponytail', 'vendor'), at: [1.0, 0, -8.6], view: 'left', seed: 14},
    {who: dressAs('man-elder'), at: [0.9, 0, -6.2], view: 'left', seed: 15},
    {who: dressAs('man-shaved'), at: [3.2, 0, -3.0], view: 'left', walk: 0.8, seed: 17},
    {who: dressAs('girl-school'), at: [-2.4, 0, -8.5], view: 'right', walk: 0.35, seed: 18},
    {who: dressAs('boy-school'), at: [-1.7, 0, -9.0], view: 'right', walk: 0.6, seed: 19},
    // LF05 v2 (viewer check fix 1): no foreground walker; the crowd moves in the mid ground behind and beside her (VD09 both sides).
    {who: RIDER, at: [0.6, 0, -3.2], view: 'right', walk: 0.45, seed: 16},
    {who: dressAs('man-parted', 'office'), at: [-2.2, 0, -4.2], view: 'right', walk: 0.6, seed: 22},
    {who: dressAs('man-crop'), at: [1.2, 0, -4.1], view: 'left', walk: 0.2, seed: 23},
    {who: dressAs('woman-long', undefined, {jacket: '#7d6f86', sleeve: '#7d6f86'}), at: [0, 0, -6.2], view: 'left', bench: 2, seed: 26},
    {who: dressAs('man-spiky', undefined, {jacket: '#56645a', sleeve: '#56645a'}), at: [0, 0, -10.8], view: 'left', bench: 1, seed: 27},
    {who: dressAs('man-crop', 'office'), at: [0.2, 0, -18], view: 'left', walk: 0.3, seed: 29},
  ],
};
/**
 * Mother (VD09): `woman-curly`, sage blouse replaces mustard, plum skirt kept; P10 arms (sheet stack, no phone), profile toward the
 * river. LF05 v2 age cue (viewer check fix 1; no older-woman PEOPLE entry of the right age: `woman-elder` is 70 and reads as a
 * grandmother): kit head fields only, `lines: true` (the kit age lines) and greying hair `#5c5652`, plus a long-sleeved taupe
 * cardigan over the blouse (outfit). Recorded deviation from "per video change only outfit" (CP-P12): the head override is
 * episode-local and `woman-curly` is not a recurring EG character.
 */
export const MOTHER: CastDef = {
  ...PEOPLE['woman-curly'],
  head: {...PEOPLE['woman-curly'].head, hair: '#5c5652', brows: '#3b3532', lines: true},
  outfit: {...PEOPLE['woman-curly'].outfit, shirt: '#8fa58a', sleeve: '#857a6c', jacket: '#857a6c', longSleeves: true},
};

/** Hip offset along the facing direction of a P31 sitter (m, negative = behind the ground point), from the kit chair spec. */
const sitHipU = (def: CastDef) => {
  const {u0, u1} = chairSpec(def, 'left');
  return (0.2 * u1 + 0.33 * u0) / 0.53;
};
/** Ground point of a walker (sitters: from their bench). */
export const walkerAt = (wk: Walker): V3 => {
  if (wk.bench === undefined) return wk.at;
  const b = PIER_BENCHES[wk.bench];
  return [b.x + 0.28 + sitHipU(wk.who), 0, wk.at[2]];
};
const walkerPose = (wk: Walker) => (g: Pt, u: number) =>
  ({...poseFor(wk.bench !== undefined ? 'P31' : 'P01', wk.who, g, u, wk.view), face: EXPRESSIONS.neutral, walk: wk.bench !== undefined ? undefined : wk.walk, stride: wk.pace ? STROLL : undefined}) as FigPose;
const motherPose = (g: Pt, u: number) => {
  const base = poseFor('P10', MOTHER, g, u, 'left');
  const {rHold: _r, lHold: _l, ...arms} = base as typeof base & {rHold?: unknown; lHold?: unknown};
  return {...arms, face: EXPRESSIONS.neutral} as FigPose;
};
const youPose = (g: Pt, u: number) => ({view: 'back', hoodUp: true, face: EXPRESSIONS.neutral, ...poseArms('P01', YOU2, g, u)}) as FigPose;

const paintPerson = (p: Painter, c: Cam, wk: Walker, t: number) => {
  const at = walkerAt(wk), g = proj(c, at), u = unitAt(c, at[2]);
  drawFigure(p, wk.who, g, u, walkerPose(wk)(g, u), t, 5000 + wk.seed * 37);
};

export const paintMother = (p: Painter, c: Cam, t: number) => {
  const g = proj(c, PIER_MOTHER), u = unitAt(c, PIER_MOTHER[2]);
  // Ambient clock (B8, hold rule): breathing about +-1 px on the chest (0.25 Hz), garland swing 2 px at 0.5 Hz, a sheet corner lifting.
  const breath = (1 / u) * Math.sin(t * Math.PI * 2 * 0.25);
  const a = drawFigure(p, MOTHER, g, u, {...motherPose(g, u), rise: breath} as FigPose, t, 6100);
  // The sheet stack held up at the chest (VD09 fallback, LF05 v2): five sheets, printed faces inward, fanned so their edges read
  // as paper; 0.16 x 0.30 m, a little in front of the hands.
  const hx = (a.rHand[0] + a.lHand[0]) / 2 + 0.03 * u, hy = (a.rHand[1] + a.lHand[1]) / 2 - 0.06 * u;
  const sw = 0.08 * u, sh = 0.15 * u;
  for (let k = 4; k >= 0; k--) {
    const ox = -k * 0.012 * u, oy = -k * 0.01 * u, tilt = (k - 2) * 0.02;
    const q: Pt[] = [[-sw, -sh], [sw, -sh], [sw, sh], [-sw, sh]].map(([x, y]): Pt => [hx + ox + x + y * tilt, hy + oy + y - x * tilt * 0.5]);
    if (k === 0) q[1] = [q[1][0] + 1.2, q[1][1] - 1.5 - 1.5 * Math.sin(t * Math.PI * 2 * 0.35)]; // top sheet: its upper outer corner lifts in the breeze
    hardFill(p, 6200 + k, k % 2 ? '#efebe1' : '#fbf9f3', q);
    inkLine(p, 6206 + k, q, {color: '#7a746a', weight: 0.9, curve: 0, still: true});
  }
  // A faint show-through of the print on the outer sheet (unreadable, sheets face inward).
  washAt(p, 6212, '#a7a39a', 40, ell(hx - 0.01 * u, hy - 0.04 * u, 0.04 * u, 0.05 * u, 12), 0.1, 0.3);
  // Jasmine garland on the wrist nearest the lens, 1.3x (VD09 fallback): a ring of white buds, a small rose and leaf tassel below.
  const wx = Math.max(a.rHand[0], a.lHand[0]) + 0.06 * u + 2 * Math.sin(t * Math.PI * 2 * 0.5), wy = hy + 0.08 * u, r = u * 0.026;
  for (let k = 0; k < 12; k++) {
    const ang = (k / 12) * Math.PI * 2;
    hardFill(p, 6220 + k, k % 3 ? '#fcfcf6' : '#eef3e4', ell(wx + Math.cos(ang) * u * 0.046, wy + Math.sin(ang) * u * 0.064, r, r * 0.9, 8));
    inkLine(p, 6240 + k, ell(wx + Math.cos(ang) * u * 0.046, wy + Math.sin(ang) * u * 0.064, r, r * 0.9, 8), {color: '#9a9a88', weight: 0.5, curve: 0.3, still: true});
  }
  hardFill(p, 6260, '#b0453c', ell(wx, wy + u * 0.1, r * 1.0, r * 1.3, 8));
  hardFill(p, 6261, '#5c8a4a', ell(wx, wy + u * 0.14, r * 0.8, r * 1.2, 8));
};

/**
 * River boat (LF v3, user note "เรือทะลุท่า"): an open-sided cross-river ferry moored ALONGSIDE the river edge, morning states
 * only. Its pier-side hull stands 1.6 m out from the deck edge (x -4.6, deck edge x -3), so a band of water shows between the pier
 * and the hull; stern toward the lens at z -6, bow at z -17 (picture x about 160..440, left of `คุณ`'s head at x 440..500).
 * Canopy roof on thin posts (seen from below, the eye is under it), benches inside, tyre fenders, a stern rope to the deck
 * bollard. Painted before the deck, rails and pillars (all nearer the lens, on its side of the plane x = -3).
 */
export const BOAT = box(-7.4, -4.6, -0.8, 2.4, -17, -6);
export const BOLLARD: V3 = [-2.72, 0, -6.0];
const paintBoat = (p: Painter, c: Cam) => {
  const P = (x: number, y: number, z: number) => proj(c, [x, y, z]);
  const {x0: XF, x1: XN, z0: ZB, z1: ZS} = BOAT, WL = -0.8, GUN = 0.45, CAN = 2.2, xb = (XF + XN) / 2, zt = ZB + 2.2;
  const navy = '#34465c', cream = '#e9e2d4', inner = '#7b7a74', u = unitAt(c, (ZS + ZB) / 2), fine = Math.max(0.8, u * 0.02);
  // Hull outline in plan (pier side, bow taper to the stem, far side) at a height y.
  const near = (y: number, z: number) => P(XN, y, z);
  // Far gunwale's inner face and the floor, seen through the open sides.
  fillC(p, 32300, inner, [P(XF, 0.1, ZS), P(XF, 0.1, zt), P(XF, GUN, zt), P(XF, GUN, ZS)]);
  fillC(p, 32301, '#9b958a', flatQuad(c, XF, XN, zt, ZS, 0.1));
  // Bench backs inside, across the boat.
  for (let k = 0; k < 6; k++) {
    const z = ZS - 1.2 - k * 1.5;
    fillC(p, 32302 + k, '#5a5650', frontRect(c, z, XF + 0.2, XN - 0.2, 0.45, 0.85));
  }
  // Far posts, canopy underside and its far edge.
  for (let k = 0; k < 7; k++) inkLine(p, 32310 + k, [P(XF + 0.1, GUN, ZS - 0.3 - k * 1.55), P(XF + 0.1, CAN, ZS - 0.3 - k * 1.55)], {color: '#3d4650', weight: fine, closed: false, curve: 0, still: true});
  fillC(p, 32320, '#56626e', [P(XF - 0.1, CAN, ZS + 0.2), P(XN + 0.1, CAN, ZS + 0.2), P(XN + 0.1, CAN, ZB + 1.2), P(xb, CAN, ZB + 0.4), P(XF - 0.1, CAN, ZB + 1.2)]);
  for (let k = 0; k < 6; k++) {
    const z = ZS - 1 - k * 1.8;
    inkLine(p, 32325 + k, [P(XF - 0.1, CAN, z), P(XN + 0.1, CAN, z)], {color: '#46515c', weight: fine * 0.8, closed: false, curve: 0, still: true});
  }
  // Pier-side hull: navy below, cream sheer band above, rising a little to the bow; the taper to the stem.
  const side = (y0: number, y1: number): Pt[] => [near(y1, ZS), near(y1 + 0.1, zt), P(xb, y1 + 0.35, ZB), P(xb, y0 + 0.2, ZB + 0.6), near(y0, zt), near(y0, ZS)];
  fillC(p, 32330, cream, side(WL, GUN));
  fillC(p, 32331, navy, side(WL, 0.1));
  inkLine(p, 32332, [near(GUN, ZS), near(GUN + 0.1, zt), P(xb, GUN + 0.35, ZB)], {color: '#3a3836', weight: fine, closed: false, curve: 0.3, still: true});
  // Near posts and the canopy fascia.
  for (let k = 0; k < 7; k++) {
    const z = ZS - 0.3 - k * 1.55;
    fillC(p, 32340 + k, '#e2ddd2', [P(XN - 0.04, GUN, z), P(XN + 0.04, GUN, z), P(XN + 0.04, CAN, z), P(XN - 0.04, CAN, z)]);
  }
  fillC(p, 32350, navy, [near(CAN, ZS + 0.2), near(CAN, ZB + 1.2), P(xb, CAN, ZB + 0.4), P(xb, CAN + 0.2, ZB + 0.4), near(CAN + 0.2, ZB + 1.2), near(CAN + 0.2, ZS + 0.2)]);
  // Stern (nearest face): rounded transom, a stern deck seen from above, the canopy's end edge.
  const tr: Pt[] = [P(XF, GUN, ZS), P(XN, GUN, ZS), P(XN, -0.2, ZS), P(XN - 0.5, WL, ZS), P(XF + 0.5, WL, ZS), P(XF, -0.2, ZS)];
  fillC(p, 32360, cream, tr);
  fillC(p, 32361, navy, [P(XN, 0.1, ZS), P(XN, -0.2, ZS), P(XN - 0.5, WL, ZS), P(XF + 0.5, WL, ZS), P(XF, -0.2, ZS), P(XF, 0.1, ZS)]);
  inkLine(p, 32362, tr, {color: '#3a3836', weight: fine, curve: 0, still: true});
  fillC(p, 32363, '#56626e', frontRect(c, ZS + 0.2, XF - 0.1, XN + 0.1, CAN, CAN + 0.2));
  // Tyre fenders on the pier side.
  for (const [k, z] of [ZS - 1.4, ZS - 4.6, ZS - 7.8].entries()) {
    const [fx, fy] = P(XN + 0.03, 0.0, z), uz = unitAt(c, z);
    hardFill(p, 32370 + k, '#2a2c2e', ell(fx, fy, uz * 0.1, uz * 0.22, 12));
  }
  // Water against the hull: a dark waterline and ripples in the band between the hull and the deck edge.
  inkLine(p, 32380, [near(WL, ZS), near(WL, zt), P(xb, WL, ZB + 0.6)], {color: '#3d4a52', weight: fine * 1.6, closed: false, curve: 0, still: true});
  for (let k = 0; k < 5; k++) {
    const z = ZS + 1 - k * 2.4;
    inkLine(p, 32385 + k, [P(XN + 0.3, WL, z), P(XN + 0.75, WL, z - 0.8), P(XN + 1.2, WL, z - 1.6)], {color: '#d6dcd8', weight: Math.max(0.8, unitAt(c, z) * 0.012), closed: false, curve: 0.4});
  }
};
/** Bollard on the deck edge with the stern rope to the boat (morning; the bollard stands in every state, VD05). */
const paintBollard = (p: Painter, c: Cam, w: number) => {
  const [x, , z] = BOLLARD, u = unitAt(c, z), [bx, by] = proj(c, BOLLARD);
  fillC(p, 32390, mix('#4a4e52', '#5a5048', w), frontRect(c, z, x - 0.09, x + 0.09, 0, 0.32));
  hardFill(p, 32391, mix('#5a5f64', '#6b6056', w), ell(bx, by - u * 0.32, u * 0.13, u * 0.04, 12));
  if (w > 0) {
    const rope: Pt[] = [proj(c, [x - 0.05, 0.25, z]), proj(c, [-3.8, -0.1, z - 0.4]), proj(c, [BOAT.x1, 0.42, BOAT.z1 - 0.6])];
    inkLine(p, 32392, rope, {color: '#cbbd96', weight: Math.max(1.2, u * 0.025), closed: false, curve: 0.6, still: true});
  }
};

/** One pier frame, as the paint order uses it and the collision test checks it (VD13). */
export type PierLayout = {
  cam: Cam;
  /** Every solid on the deck (benches with their sitters, pillars, rail posts, bollard) and the boat. */
  solids: {id: string; box: Box}[];
  /** Standing and seated people, with the measured picture extent of their drawn figure. */
  people: {id: string; box: Box; bench?: number; at: V3; seatV?: number; hipX?: number}[];
  /** Everything painted after the background planes, in paint order (back to front). */
  order: {id: string; box: Box}[];
};
const PILLAR_HALF = 0.18, POST_HALF = 0.04;
const pillarIds = () => PILLARS_Z.flatMap((z) => [EDGE, WALL - 0.3].map((x) => ({x, z, id: `pillar${x}@${z}`})));
const postZs = () => {
  const zs: number[] = [];
  for (let z = HALL_END - 3; z < DECK_NEAR; z += 2) zs.push(z);
  return zs;
};
const pigeons = () => Array.from({length: 6}, (_, k) => ({k, at: [-2.4 + 1.6 * hash(k * 5.1), 0, -6.5 - 6 * hash(k * 2.7)] as V3}));

/** Build the paint items of one pier state; `paint` is undefined for the collision test (geometry only). */
export type PierOpts = {
  you?: boolean;
  /** Shot-local frame (ambient clock, pigeons) and the frame at which the crowd stands where the look frame has it (`ref`). */
  f?: number;
  ref?: number;
  cam?: Cam;
};
/** The pace (m/s) of a walking pier crowd member: calm, per person (B6). Sitters and standers do not move. */
/** Walkers that would meet a bench, post or another walker head-on during the S05 push stand still (VD13, found by the per-frame test). */
const STANDS = new Set([12, 13, 16, 17, 18, 22, 23]);
const paceOf = (wk: Walker) => (wk.walk !== undefined && wk.bench === undefined && !STANDS.has(wk.seed) ? 0.28 + 0.22 * hash(wk.seed * 1.7) : 0);
/** Pigeons (empty state, S01-B02-SH03 ambient clock): #0 steps right f 60-110, #1 flies out of frame f 128-150. Returns undefined once gone. */
const pigeonAt = (k: number, at: V3, f: number): {at: V3; y: number; wing: number} | undefined => {
  const ramp = (a: number, b: number) => Math.max(0, Math.min(1, (f - a) / (b - a)));
  if (k === 0) return {at: [at[0] + 0.35 * ramp(60, 110), 0, at[2]], y: 0.02 * Math.abs(Math.sin(f * 0.5)) * (f > 60 && f < 110 ? 1 : 0), wing: 0};
  if (k === 1) {
    const u = ramp(128, 150);
    if (u >= 1) return undefined;
    return {at: [at[0] + 2.5 * u * u, 0, at[2] - 3 * u], y: 3.2 * u * u, wing: u > 0 ? Math.sin(f * 1.6) : 0};
  }
  return {at, y: 0, wing: 0};
};
export const pierItems = (state: State, o: PierOpts = {}, paint?: {p: Painter; w: number}) => {
  const c = o.cam ?? (state === 'mother' ? PIER_CAM_S05 : PIER_CAM);
  const f = o.f ?? 0, df = f - (o.ref ?? 0);
  const p = paint?.p, w = paint?.w ?? 0, t = p?.t ?? f / 30;
  type It = Item & {kind: 'solid' | 'person'; bench?: number; at?: V3; seatV?: number; hipX?: number};
  const items: It[] = [];
  const noop = () => {};
  for (const {x, z, id} of pillarIds()) items.push({id, kind: 'solid', box: box(x - PILLAR_HALF, x + PILLAR_HALF, 0, ROOF, z - PILLAR_HALF, z + PILLAR_HALF), draw: p ? () => {
    fillC(p, 32000 + Math.round(z * 4) + x, mix('#9aa1a7', '#d2c4ac', w), frontRect(c, z, x - PILLAR_HALF, x + PILLAR_HALF, 0, ROOF));
    inkLine(p, 32050 + Math.round(z * 4) + x, [proj(c, [x + PILLAR_HALF, 0, z]), proj(c, [x + PILLAR_HALF, ROOF, z])], {color: mix('#5d656c', '#8a7a64', w), weight: 0.8, closed: false, curve: 0, still: true});
    if (z === PIER_SHEET.z && x === EDGE) paintSheetBack(p, c, 32100, PIER_SHEET.x, PIER_SHEET.y, z + 0.19, w);
  } : noop});
  const rail = mix('#c8cdd0', '#e6dccb', w);
  for (const z of postZs()) items.push({id: `post@${z}`, kind: 'solid', box: box(EDGE - POST_HALF, EDGE + POST_HALF, 0, 1.05, z - POST_HALF, z + POST_HALF), draw: p ? () => fillC(p, 31900 + z, rail, frontRect(c, z, EDGE - POST_HALF, EDGE + POST_HALF, 0, 1.05)) : noop});
  items.push({id: 'bollard', kind: 'solid', box: box(BOLLARD[0] - 0.1, BOLLARD[0] + 0.1, 0, 0.36, BOLLARD[2] - 0.1, BOLLARD[2] + 0.1), draw: p ? () => paintBollard(p, c, w) : noop});
  if (state === 'empty') for (const pg of pigeons()) {
    const now = pigeonAt(pg.k, pg.at, f);
    if (!now) continue;
    const k = pg.k, at = now.at;
    items.push({id: `pigeon${k}`, kind: 'solid', box: box(at[0] - 0.25, at[0] + 0.25, now.y, now.y + 0.25, at[2] - 0.08, at[2] + 0.08), draw: p ? () => {
    const [bx, by0] = proj(c, at), u = unitAt(c, at[2]), by = by0 - now.y * u;
    const dir = k % 2 ? 1 : -1;
    hardFill(p, 32200 + k, '#6e7782', ell(bx, by - u * 0.1, u * 0.13, u * 0.07, 12, dir * 0.15));
    hardFill(p, 32210 + k, '#5b6470', [[bx - dir * u * 0.1, by - u * 0.12], [bx - dir * u * 0.24, by - u * 0.1], [bx - dir * u * 0.1, by - u * 0.07]]);
    hardFill(p, 32220 + k, '#4f5864', ell(bx + dir * u * 0.12, by - u * 0.19, u * 0.045, u * 0.042, 10));
    hardFill(p, 32230 + k, '#7f8f8a', ell(bx + dir * u * 0.09, by - u * 0.14, u * 0.03, u * 0.025, 8));
    inkLine(p, 32240 + k, [[bx, by - u * 0.04], [bx, by]], {color: '#b0675a', weight: 1, closed: false, curve: 0, still: true});
    if (now.wing) hardFill(p, 32250 + k, '#5b6470', [[bx - dir * u * 0.02, by - u * 0.14], [bx - dir * u * 0.12, by - u * (0.3 + 0.12 * now.wing)], [bx + dir * u * 0.04, by - u * 0.17]]);
  } : noop});
  }
  // People: a measured box per figure; sitters join their bench (painted right after it, the back behind them).
  const crowd = state === 'empty' ? [] : PIER_CROWD[state].map((wk) => walkerNow({...wk, pace: paceOf(wk)}, df));
  const sitters: It[][] = PIER_BENCHES.map(() => []);
  crowd.forEach((wk, i) => {
    const at = walkerAt(wk), m = measureFigure(wk.who, walkerPose(wk), 0, 5000 + wk.seed * 37);
    const it: It = {id: `walker${i}:${wk.seed}`, kind: 'person', at, box: figureBox(m, at), draw: p ? () => paintPerson(p, c, wk, t) : noop};
    if (wk.bench !== undefined) {
      it.bench = wk.bench;
      it.seatV = chairSpec(wk.who, 'left').seatV;
      it.hipX = at[0] - sitHipU(wk.who);
      sitters[wk.bench].push(it);
    } else items.push(it);
  });
  PIER_BENCHES.forEach((b, k) => {
    const s = sitters[k].sort((a, b2) => (a.at?.[2] ?? 0) - (b2.at?.[2] ?? 0));
    const bb = s.reduce((acc, it) => union(acc, it.box), benchBox(b));
    items.push({id: `bench${k}`, kind: 'solid', box: bb, draw: p ? () => { bench(p, c, 31800 + k * 20, b, w); s.forEach((it) => it.draw()); } : noop});
  });
  if (state === 'mother') items.push({id: 'mother', kind: 'person', at: PIER_MOTHER, box: figureBox(measureFigure(MOTHER, motherPose, 0, 6100), PIER_MOTHER, 0.2, 0.08), draw: p ? () => paintMother(p, c, t) : noop});
  if (state !== 'mother' && o.you !== false) items.push({id: 'you', kind: 'person', at: PIER_YOU, box: figureBox(measureFigure(YOU2, youPose), PIER_YOU), draw: p ? () => paintYou(p, proj(c, PIER_YOU), unitAt(c, PIER_YOU[2]), {t}) : noop});
  const order = paintOrder(c, items);
  const layout: PierLayout = {
    cam: c,
    solids: [...items.filter((it) => it.kind === 'solid').map(({id, box: b}) => ({id, box: b})), ...(warmOf(state) > 0 ? [{id: 'boat', box: BOAT}] : [])],
    people: [...items.filter((it) => it.kind === 'person'), ...sitters.flat()].map(({id, box: b, bench: bi, at, seatV, hipX}) => ({id, box: b, bench: bi, at: at!, seatV, hipX})),
    order: order.map(({id, box: b}) => ({id, box: b})),
  };
  return {layout, order};
};
export const pierLayout = (state: State, o: PierOpts = {}) => pierItems(state, o).layout;

export const paintPier = (p: Painter, state: State, o: PierOpts = {}) => {
  const c = o.cam ?? (state === 'mother' ? PIER_CAM_S05 : PIER_CAM), w = warmOf(state), dy = c.hy - PIER_CAM.hy;
  sky(p, 31000, mix('#91a4ba', '#b9cbd8', w), mix('#ecdfd0', '#f7e4c6', w), -20, 900 + dy);
  // Soft cloud banks in the open sky above the deck.
  for (let k = 0; k < 5; k++) {
    const cy = 140 + k * 95 + dy, cx = 120 + 260 * hash(k * 4.7) + k * 90;
    washAt(p, 31050 + k, mix('#b6c2d0', '#fbe6c4', w), 90, ell(cx, cy, 260 + 80 * hash(k), 34 + 10 * hash(k + 3), 20), 0.3, 0.4);
  }
  // Far bank across the river (left and ahead): a low, hazy skyline with one generic chedi; no landmark.
  const bankY = 896 + dy;
  const bank: Pt[] = [[-20, bankY + 6]];
  for (let k = 0; k <= 30; k++) {
    const x = -20 + k * 37, hgt = 12 + 26 * hash(k * 7.3) * (k % 5 === 2 ? 1.6 : 1);
    bank.push([x, bankY - hgt], [x + 30, bankY - hgt]);
  }
  bank.push([1100, bankY + 6]);
  washAt(p, 31100, mix('#8592a1', '#c7b49a', w), 220, bank, 0.1, 0.4);
  hardFill(p, 31101, mix('#7c8a9a', '#bda98d', w), [[40, bankY - 30], [56, bankY - 70], [62, bankY - 96], [68, bankY - 70], [84, bankY - 30]]); // v3: left of the moored ferry (it read as a sail through the open canopy)
  // River: water plane below the deck (y -0.8) on the left and beyond the hall end.
  const water = mix('#6a7f92', '#9aa59c', w);
  fillC(p, 31200, water, [[-20, 900 + dy], [1100, 900 + dy], [1100, 1010 + dy], [-20, 1920]]);
  for (let k = 0; k < 26; k++) {
    const zz = -6 - k * k * 0.5, xx = -4 - 30 * hash(k * 3.1);
    const a = proj(c, [xx - 2, -0.8, zz]), b = proj(c, [xx + 2, -0.8, zz]);
    if (a[1] > 900 + dy) inkLine(p, 31300 + k, [a, [(a[0] + b[0]) / 2, a[1] - 1], b], {color: mix('#a9bccb', '#f3e2c0', w), weight: 0.9, closed: false, curve: 0.4});
  }
  // The moored ferry (morning only: people board; none at dawn).
  if (w > 0) {
    p.brush.push();
    p.brush.translate(0, 3 * Math.sin(p.t * Math.PI * 2 * 0.3)); // ambient clock: the moored ferry bobs 3 px at 0.3 Hz
    paintBoat(p, c);
    p.brush.pop();
  }
  // Pier deck (planks along z), the hall end edge, the railing on the river side.
  fillC(p, 31400, mix('#7d7b78', '#b09a7c', w), groundQuad(c, EDGE, WALL, HALL_END - 3, DECK_NEAR));
  for (let k = 0; k < 14; k++) {
    const x = EDGE + 0.7 * k;
    inkLine(p, 31410 + k, [proj(c, [x, 0, DECK_NEAR]), proj(c, [x, 0, HALL_END - 3])], {color: mix('#5d5c5b', '#8a7458', w), weight: 0.6, closed: false, curve: 0, still: true});
  }
  fillC(p, 31440, mix('#5a5c5f', '#7e6a54', w), sideQuad(c, EDGE, HALL_END - 3, DECK_NEAR, -0.3, 0));
  // Yellow safety line along the river edge, and a wet sheen on the dawn deck.
  fillC(p, 31445, mix('#b5a560', '#e0bd4c', w), groundQuad(c, EDGE + 0.25, EDGE + 0.4, HALL_END - 3, DECK_NEAR));
  if (w < 1) washC(p, 31446, '#a7b4c0', 70 * (1 - w), groundQuad(c, EDGE + 0.6, 0.4, -6, DECK_NEAR), 0.25, 0.5);
  // Back wall of the hall (right) with a ticket window (no text, no clock).
  fillC(p, 31500, mix('#8d959c', '#cdbb9d', w), sideQuad(c, WALL, HALL_END, -0.4, 0, ROOF));
  fillC(p, 31501, mix('#55606b', '#a07d55', w), sideQuad(c, WALL, -12, -9.5, 0.9, 2.1));
  if (w > 0) washC(p, 31502, '#f2cf8a', 120, sideQuad(c, WALL, -11.8, -9.7, 1.0, 2.0), 0.1, 0.4);
  // Roof underside (ceiling) with cross beams, and the eave over the river edge.
  fillC(p, 31600, mix('#5b6470', '#8d7a66', w), flatQuad(c, EDGE - 0.6, WALL, HALL_END, -0.4, ROOF));
  for (const [k, z] of [-1.5, -4.5, -7.5, -10.5, -13.5, -16.5, -19.5, -22.5].entries()) fillC(p, 31610 + k, mix('#434b55', '#6e5c4c', w), [proj(c, [EDGE - 0.6, ROOF, z]), proj(c, [WALL, ROOF, z]), proj(c, [WALL, ROOF - 0.25, z]), proj(c, [EDGE - 0.6, ROOF - 0.25, z])]);
  fillC(p, 31650, mix('#4e5660', '#7a6654', w), sideQuad(c, EDGE - 0.6, HALL_END, -0.4, ROOF - 0.45, ROOF));
  fillC(p, 31660, mix('#4a525c', '#76624f', w), frontRect(c, -0.4, EDGE - 0.6, WALL + 2, ROOF - 0.5, ROOF + 0.15));
  inkLine(p, 31661, [proj(c, [EDGE - 0.6, ROOF - 0.5, -0.4]), proj(c, [WALL + 2, ROOF - 0.5, -0.4])], {color: '#2f3439', weight: 1.0, closed: false, curve: 0, still: true});
  // Hanging tube lamps (lit at dawn, off in the morning).
  for (const [k, z] of [-4.5, -10.5, -16.5].entries()) {
    const a = proj(c, [1.2, ROOF - 0.5, z]), b = proj(c, [2.8, ROOF - 0.5, z]), u = unitAt(c, z);
    if (w < 1) glow(p, 31700 + k * 5, (a[0] + b[0]) / 2, a[1], u * 0.6, '#f6dcaa', 34 * (1 - w));
    hardFill(p, 31720 + k, w < 1 ? '#fde9c2' : '#c9bfae', [[a[0], a[1] - u * 0.04], [b[0], b[1] - u * 0.04], [b[0], b[1] + u * 0.04], [a[0], a[1] + u * 0.04]]);
  }
  // Rails (lines) along the river edge and across the hall end: every person and deck solid is on the camera's side of them.
  const railInk = mix('#5a6066', '#6d5f50', w);
  for (const y of [1.05, 0.55]) inkLine(p, 31950 + y * 10, [proj(c, [EDGE, y, HALL_END - 3]), proj(c, [EDGE, y, DECK_NEAR])], {color: railInk, weight: 1.6, closed: false, curve: 0, still: true});
  for (const y of [1.05, 0.55]) inkLine(p, 31960 + y * 10, [proj(c, [EDGE, y, HALL_END - 3]), proj(c, [WALL, y, HALL_END - 3])], {color: railInk, weight: 1.0, closed: false, curve: 0, still: true});
  // Deck solids and people, back to front by the VD13 occlusion sort (benches, pillars, posts, bollard, pigeons, cast).
  pierItems(state, o, {p, w}).order.forEach((it) => it.draw());
};

// ---------------------------------------------------------------------------------------------------------------------
// Soi lamp post close-up with the layered sheets and the poster face-out (S04-B01-SH02 framing; S03-B01-SH02 is the same
// set with the top sheet hanging blank side out).

export const SOI_CAM: Cam = {x: 0, y: 1.6, z: 0, f: 900, hy: 1080};
/** Poster rectangle on screen (px): the post is frontal, so the poster is painted in picture space. */
export const POSTER = {x: 330, y: 300, w: 420, h: 588} as const;
/** The picture box on the poster (px). */
export const PHOTO = {x: POSTER.x + 60, y: POSTER.y + 168, w: POSTER.w - 120, h: 250} as const;
/** Poster photo figure scale (px per metre) and crown offset: LF04 v2 frames `คุณ` from the crown to the upper-mid back. */
const PHOTO_UNIT = 270, PHOTO_CROWN = 12;

/** The soi street behind the post: houses, spirit house, scooter, cables, haze (everything in picture space at `SOI_CAM`). */
export const paintSoiBackdrop = (p: Painter, state: State) => {
  const c = SOI_CAM, w = warmOf(state);
  sky(p, 41000, mix('#8ea0b6', '#e3cba3', w), mix('#dcd6cf', '#f6e9d4', w), -20, 1100);
  // Soi: two rows of low houses (x +-3.2), concrete road, gates; distant lit shop at the far end.
  fillC(p, 41100, mix('#6b7682', '#a39a8c', w), groundQuad(c, -3.2, 3.2, -60, -0.5));
  for (const s of [-1, 1] as const) for (let k = 0; k < 9; k++) {
    const z1 = -2 - k * 6, z0 = z1 - 6, top = 6.5 + 2.5 * hash(k * 3 + s);
    fillC(p, 41200 + k * 10 + s, mix(['#7b8794', '#8a939c', '#727f8c'][k % 3], ['#c4b29a', '#d3c3aa', '#b9a68e'][k % 3], w), sideQuad(c, s * 3.2, z0, z1, 0, top));
    fillC(p, 41203 + k * 10 + s, mix('#505b66', '#857865', w), sideQuad(c, s * 3.2, z0 + 1, z1 - 1, 3.2, 4.6));
    fillC(p, 41205 + k * 10 + s, mix('#929aa1', '#c7b9a2', w), sideQuad(c, s * 3.2, z0 + 0.5, z1 - 0.5, 0, 1.8));
  }
  const [fx, fy] = proj(c, [0.8, 1.5, -58]);
  if (w < 1) glow(p, 41300, fx, fy, 14, '#ffd38a', 60);
  // Spirit house (san phra phum) at a gate, right, and a parked step-through scooter, left (LF04 v2, viewer check fix 3: the soi
  // must read Thai at a glance). Local metres on a frontal plane at the object's depth: u right, v up.
  const sh: V3 = [1.3, 0, -3.6], su = unitAt(c, sh[2]), [sx0, sy0] = proj(c, sh);
  const S = (u: number, v: number): Pt => [sx0 + u * su, sy0 - v * su];
  const stone = mix('#a9adb0', '#d8cdb8', w), gold = mix('#a08850', '#c4a45c', w), roof = mix('#7d3f34', '#94503c', w);
  fillC(p, 41400, stone, [S(-0.07, 0), S(0.07, 0), S(0.06, 1.2), S(-0.06, 1.2)]);
  fillC(p, 41401, stone, [S(-0.36, 1.2), S(0.36, 1.2), S(0.36, 1.27), S(-0.36, 1.27)]);
  fillC(p, 41402, gold, [S(-0.2, 1.27), S(0.2, 1.27), S(0.2, 1.6), S(-0.2, 1.6)]);
  fillC(p, 41403, mix('#4a3c2c', '#5c4834', w), [S(-0.07, 1.27), S(0.07, 1.27), S(0.07, 1.5), S(-0.07, 1.5)]);
  for (const s2 of [-1, 1]) fillC(p, 41404 + s2, gold, [S(s2 * 0.2, 1.27), S(s2 * 0.25, 1.27), S(s2 * 0.25, 1.55), S(s2 * 0.2, 1.55)]);
  // Two tiered steep roofs with upturned finials (chofa) at the gable ends and a spire.
  fillC(p, 41406, roof, [S(-0.3, 1.58), S(0.3, 1.58), S(0, 1.98)]);
  fillC(p, 41407, roof, [S(-0.2, 1.8), S(0.2, 1.8), S(0, 2.12)]);
  fillC(p, 41408, gold, [S(-0.015, 2.1), S(0.015, 2.1), S(0, 2.3)]);
  const ink2 = mix('#3a3430', '#4a3e34', w), wt = Math.max(1.2, su * 0.012);
  for (const s2 of [-1, 1]) {
    inkLine(p, 41410 + s2, [S(s2 * 0.3, 1.58), S(s2 * 0.36, 1.62), S(s2 * 0.35, 1.7)], {color: gold, weight: wt * 1.6, closed: false, curve: 0.5, still: true});
    inkLine(p, 41412 + s2, [S(s2 * 0.2, 1.8), S(s2 * 0.25, 1.84), S(s2 * 0.24, 1.9)], {color: gold, weight: wt * 1.4, closed: false, curve: 0.5, still: true});
  }
  inkLine(p, 41415, [S(-0.36, 1.27), S(0.36, 1.27)], {color: ink2, weight: wt, closed: false, curve: 0, still: true});
  // Offerings on the ledge: a marigold-and-jasmine garland on the house, two tiny figures, a glass of red drink with a straw.
  for (let k = 0; k < 7; k++) hardFill(p, 41420 + k, k % 2 ? '#f2efe2' : mix('#c98a3a', '#d89a42', w), ell(S(-0.18 + k * 0.06, 1.56 - Math.sin((k / 6) * Math.PI) * 0.06)[0], S(0, 1.56 - Math.sin((k / 6) * Math.PI) * 0.06)[1], su * 0.025, su * 0.025, 8));
  for (const fx2 of [-0.3, -0.24]) fillC(p, 41430 + fx2 * 10, mix('#6a5a48', '#8a7558', w), [S(fx2 - 0.02, 1.27), S(fx2 + 0.02, 1.27), S(fx2 + 0.015, 1.36), S(fx2 - 0.015, 1.36)]);
  fillC(p, 41433, mix('#8a4a40', '#9c5446', w), [S(0.24, 1.27), S(0.3, 1.27), S(0.31, 1.38), S(0.23, 1.38)]);
  inkLine(p, 41434, [S(0.27, 1.36), S(0.29, 1.45)], {color: '#e8e2d2', weight: wt, closed: false, curve: 0, still: true});
  // Incense sticks in a sand pot at the pillar foot of the ledge.
  for (let k = 0; k < 3; k++) inkLine(p, 41436 + k, [S(0.12 + k * 0.03, 1.27), S(0.11 + k * 0.035, 1.42)], {color: '#7a3a2a', weight: wt * 0.8, closed: false, curve: 0, still: true});

  // Step-through scooter in profile, nose to screen left (Honda Wave/Click type): small wheels, low floorboard, front leg shield,
  // long dark seat over a rounded rear body, handlebar head with the headlight; its tail runs behind the old sheets.
  const mb: V3 = [-2.0, 0, -5.5], mu = unitAt(c, mb[2]), [mx, my] = proj(c, mb);
  const M = (u: number, v: number): Pt => [mx - u * mu, my - v * mu];
  const tyre = '#24272a', body = mix('#56616b', '#6a707a', w), panel = mix('#434d56', '#565d68', w), dark = '#25282b';
  for (const wx2 of [-0.66, 0.6]) {
    hardFill(p, 41500 + wx2 * 10, tyre, ell(M(wx2, 0)[0], M(0, 0.25)[1], mu * 0.25, mu * 0.25, 20));
    hardFill(p, 41505 + wx2 * 10, '#9aa0a5', ell(M(wx2, 0)[0], M(0, 0.25)[1], mu * 0.1, mu * 0.1, 12));
  }
  hardFill(p, 41510, panel, [M(-1.0, 0.45), M(-0.92, 0.3), M(-0.35, 0.3), M(-0.2, 0.42), M(-0.18, 0.72), M(-0.95, 0.76)]);
  hardFill(p, 41511, body, [M(-1.02, 0.6), M(-0.6, 0.42), M(-0.22, 0.46), M(-0.2, 0.72), M(-0.98, 0.78)]);
  hardFill(p, 41512, panel, [M(-0.22, 0.26), M(0.26, 0.26), M(0.3, 0.36), M(-0.2, 0.38)]);
  hardFill(p, 41513, body, [M(0.2, 0.28), M(0.42, 0.3), M(0.66, 0.62), M(0.58, 1.0), M(0.44, 1.02), M(0.34, 0.6), M(0.22, 0.4)]);
  hardFill(p, 41514, body, [M(0.38, 0.44), M(0.6, 0.56), M(0.86, 0.44), M(0.84, 0.4), M(0.6, 0.5), M(0.4, 0.4)]);
  hardFill(p, 41515, dark, [M(-0.98, 0.76), M(-0.2, 0.72), M(-0.16, 0.84), M(-0.4, 0.88), M(-0.94, 0.86)]);
  inkLine(p, 41516, [M(0.6, 0.25), M(0.5, 0.98)], {color: '#2a2e32', weight: Math.max(1.5, mu * 0.035), closed: false, curve: 0, still: true});
  hardFill(p, 41517, body, [M(0.36, 0.98), M(0.66, 1.0), M(0.68, 1.1), M(0.4, 1.1)]);
  inkLine(p, 41518, [M(0.34, 1.1), M(0.62, 1.12)], {color: '#2a2e32', weight: Math.max(1.5, mu * 0.03), closed: false, curve: 0, still: true});
  hardFill(p, 41519, mix('#d5dade', '#ece4d0', w), ell(M(0.68, 0)[0], M(0, 1.04)[1], mu * 0.045, mu * 0.04, 10));
  inkLine(p, 41520, [M(0.48, 1.1), M(0.44, 1.26), M(0.4, 1.3)], {color: '#2a2e32', weight: Math.max(1, mu * 0.015), closed: false, curve: 0.3, still: true});
  inkLine(p, 41521, [M(-1.0, 0.45), M(-0.92, 0.3), M(-0.35, 0.3), M(-0.2, 0.42), M(-0.2, 0.72), M(-0.98, 0.78), M(-1.02, 0.6)], {color: '#3a4046', weight: 0.9, curve: 0, still: true});
  hardFill(p, 41522, mix('#6e4a44', '#7a5048', w), [M(-1.04, 0.62), M(-1.0, 0.62), M(-1.0, 0.7), M(-1.05, 0.7)]);
  // Overhead cables: sagging bundles across the soi (screen space, tangle at the post).
  for (let k = 0; k < 9; k++) {
    const y0 = 120 + k * 34 + 30 * hash(k), y1 = 60 + k * 28 + 40 * hash(k + 9);
    inkLine(p, 41600 + k, [[-20, y0], [380, y0 + 70 + 10 * k], [540, y1 + 110], [1100, y1]], {color: mix('#2c3238', '#3e3a36', w), weight: 1.3 + (k % 3) * 0.5, closed: false, curve: 0.5, still: true});
  }
  // A second bundle sagging lower across the soi to the far houses, and drop lines to the walls (LF04 v2: Bangkok cable tangle).
  for (let k = 0; k < 7; k++) {
    const y0 = 360 + k * 22 + 20 * hash(k + 31), y1 = 300 + k * 30 + 30 * hash(k + 41);
    inkLine(p, 41620 + k, [[1100, y1], [800, y1 + 90 + 12 * k], [600, y0 + 40], [-20, y0 + 120]], {color: mix('#2c3238', '#3e3a36', w), weight: 1.1 + (k % 2) * 0.6, closed: false, curve: 0.5, still: true});
  }
  for (const [x0, x1, y1] of [[860, 960, 760], [200, 120, 820], [940, 1060, 640]] as const) inkLine(p, 41640 + x0, [[x0, 420], [x1, y1]], {color: mix('#2c3238', '#3e3a36', w), weight: 1.2, closed: false, curve: 0.2, still: true});
  // Atmosphere: a soft haze over the background so the post and poster sit forward (shallow depth, no blur filter).
  washAt(p, 41700, mix('#b5c0cc', '#f1e3cc', w), 70, [[-20, -20], [1100, -20], [1100, 1940], [-20, 1940]], 0.05, 0.3);
};

/**
 * The lamp post with its layered sheets and the newest sheet (B2/B4). Picture space of `SOI_CAM`; the wide set paints the same
 * calls under a scale so the pile has the same marks at any distance (PAIR201). `sheet` drives the top sheet: `turn` 0 = hanging
 * blank back out, 1 = face-out (see `sheetFlip`); without it `poster` picks the settled LF04 states.
 */
export const paintPostAssembly = (p: Painter, state: State, o: {poster?: 'front' | 'back'; sheet?: SheetState} = {}) => {
  const w = warmOf(state);

  // The concrete lamp post (frontal, tapering slightly), its lamp head out of frame top.
  const post: Pt[] = [[410, -20], [670, -20], [688, 1940], [392, 1940]];
  hardFill(p, 42000, mix('#8e959b', '#bdb3a4', w), post);
  washAt(p, 42001, mix('#6c757d', '#9c9284', w), 110, [[600, -20], [670, -20], [688, 1940], [612, 1940]], 0.1, 0.5);
  washAt(p, 42002, mix('#b9c1c8', '#e3d8c6', w), 80, [[420, -20], [470, -20], [460, 1940], [402, 1940]], 0.1, 0.5);
  inkLine(p, 42003, [[410, -20], [392, 1940]], {color: '#4c5258', weight: 1.4, closed: false, curve: 0, still: true});
  inkLine(p, 42004, [[670, -20], [688, 1940]], {color: '#4c5258', weight: 1.4, closed: false, curve: 0, still: true});
  // Warm lamp spill from the lamp head above (dawn only), on the post and the old sheets but painted before the poster: over the
  // poster its textured wash made the yellow-green blob beside the photo head (viewer check fix 3, VD03 "never glowing").
  if (w < 1) washAt(p, 42300, '#ffe2a8', 40 * (1 - w), [[300, -20], [780, -20], [820, 900], [260, 900]], 0.4, 0.3);
  // Old sheets under the poster: sun-faded cream, curled, torn; offsets and tilts (POS202, CL06), no readable front.
  const old: [number, number, number, string][] = [[318, 1010, -0.05, '#ddd2b5'], [372, 900, 0.05, '#ece3cb'], [350, 180, 0.07, '#e3d9bf'], [400, 250, -0.08, '#eee6d2']];
  const oldSheet = ([x, y0, a, col]: [number, number, number, string], k: number) => {
    const y = y0 + (o.sheet?.flutter ?? 0) * Math.sin(k * 2.1 + 1);
    const pw = 380, ph = 520, cs = Math.cos(a), sn = Math.sin(a);
    const R = (u: number, v: number): Pt => [x + u * cs - v * sn, y + u * sn + v * cs];
    const sheet = [R(0, 0), R(pw, 0), R(pw, ph * 0.85), R(pw * 0.8, ph), R(0, ph)];
    hardFill(p, 42100 + k * 5, mix(col, mixColor(col, '#ffffff', 0.25), w), sheet);
    washAt(p, 42101 + k * 5, '#b7a57c', 70, [R(pw * 0.6, ph * 0.7), R(pw, ph * 0.75), R(pw * 0.8, ph), R(pw * 0.45, ph)], 0.2, 0.6);
    hardFill(p, 42102 + k * 5, '#c9b98e', [R(pw * 0.78, ph), R(pw, ph * 0.85), R(pw * 0.9, ph * 0.86)]);
    inkLine(p, 42103 + k * 5, sheet, {color: '#8e846d', weight: 0.8, curve: 0, still: true});
    // A ghost of faded print on the oldest ones: grey smudges only.
    washAt(p, 42104 + k * 5, '#a7a08f', 45, [R(40, 30), R(pw - 40, 30), R(pw - 40, 90), R(40, 90)], 0.2, 0.7);
  };
  old.forEach(oldSheet);
  // The newest sheet (the poster), with its tape on the left vertical line (the flip hinge, VD07).
  const {x, y, w: pw, h: ph} = POSTER;
  const sheet = o.sheet, face = sheet ? sheet.face : o.poster;
  if (sheet) {
    // Hinge on the left tape line: scale the width about x, lean the loose sheet about the top tape (droop), ambient stir.
    p.brush.push();
    p.brush.translate(x, y + sheet.dy);
    p.brush.rotate(sheet.droop * 0.035);
    p.brush.scale(Math.max(0.015, sheet.width), 1 + sheet.droop * 0.02);
    p.brush.translate(-x, -y);
  }
  if (face === 'back') {
    hardFill(p, 42200, '#f8f6f0', [[x, y], [x + pw, y], [x + pw, y + ph], [x, y + ph]]);
  } else {
    hardFill(p, 42200, '#f8f6f0', [[x, y], [x + pw, y], [x + pw, y + ph], [x, y + ph]]);
    // Picture box: a printed back-view picture of "คุณ" in the coral hoodie, hood down, face turned away (no face).
    // Picture box (LF04 v2, viewer check fix 3; CL01, L14 "แต่คุณจำเสื้อตัวนั้นได้"): kit back view of `คุณ`, hood DOWN, the coral
    // hood bunched at the nape (darker #a8432f), framed crown to upper-mid back so the garment reads as the same hoodie. No face,
    // no glow (the v1 lamp spill no longer crosses the photo). The painter has no clip: the figure's lower body is painted over by
    // the poster's lower paper, then the post strip and the old sheet below the poster are repainted with their own seeds.
    const {x: bx, y: by, w: bw, h: bh} = PHOTO;
    hardFill(p, 42210, '#c3ccd2', [[bx, by], [bx + bw, by], [bx + bw, by + bh], [bx, by + bh]]);
    washAt(p, 42211, '#a9b3ba', 80, [[bx, by + bh * 0.55], [bx + bw, by + bh * 0.5], [bx + bw, by + bh], [bx, by + bh]], 0.1, 0.5);
    paintYou(p, [bx + bw / 2 + 6, by + PHOTO_CROWN + YOU2.height * PHOTO_UNIT], PHOTO_UNIT, {hoodUp: false, seed: 977});
    hardFill(p, 42212, '#f8f6f0', [[bx - 30, by + bh], [bx + bw + 30, by + bh], [bx + bw + 30, y + ph], [bx - 30, y + ph]]);
    hardFill(p, 42214, '#f8f6f0', [[bx - 30, by - 60], [bx + bw + 30, by - 60], [bx + bw + 30, by], [bx - 30, by]]);
    for (const s2 of [-1, 1]) hardFill(p, 42216 + s2, '#f8f6f0', [[s2 < 0 ? x + 2 : bx + bw, by], [s2 < 0 ? bx : x + pw - 2, by], [s2 < 0 ? bx : x + pw - 2, by + bh], [s2 < 0 ? x + 2 : bx + bw, by + bh]]);
    hardFill(p, 42218, mix('#8e959b', '#bdb3a4', w), [[440, y + ph], [640, y + ph], [640, by + PHOTO_CROWN + YOU2.height * PHOTO_UNIT + 12], [440, by + PHOTO_CROWN + YOU2.height * PHOTO_UNIT + 12]]);
    oldSheet(old[1], 1);
    inkLine(p, 42213, [[bx, by], [bx + bw, by], [bx + bw, by + bh], [bx, by + bh]], {color: '#2a2724', weight: 1.4, curve: 0, still: true});
    // Blank name field: three ruled lines, nothing written; no digits anywhere (POS203, R1.1).
    for (let k = 0; k < 3; k++) {
      const ly = by + bh + 46 + k * 38, x0 = k === 2 ? x + 110 : x + 60, x1 = k === 2 ? x + pw - 110 : x + pw - 60;
      inkLine(p, 42220 + k, [[x0, ly], [x1, ly]], {color: '#4a4540', weight: 1.0, closed: false, curve: 0, still: true});
    }
  }
  // Paper edge, slight curl shade at the bottom right, and the tape strips on the hinge line.
  washAt(p, 42230, '#b8b2a4', 60, [[x + pw * 0.75, y + ph * 0.85], [x + pw, y + ph * 0.8], [x + pw, y + ph], [x + pw * 0.7, y + ph]], 0.15, 0.5);
  inkLine(p, 42231, [[x, y], [x + pw, y], [x + pw, y + ph], [x, y + ph]], {color: '#7a746a', weight: 0.9, curve: 0, still: true});
  for (const ty of [y + 30, y + ph - 60]) washAt(p, 42240 + ty, '#e9dfae', 170, [[x - 22, ty], [x + 26, ty - 4], [x + 28, ty + 36], [x - 20, ty + 40]], 0.05, 0.3);
  if (sheet) p.brush.pop();
};

export const paintSoiPost = (p: Painter, state: State, o: {poster?: 'front' | 'back'; sheet?: SheetState} = {}) => {
  paintSoiBackdrop(p, state);
  paintPostAssembly(p, state, o);
};

/** Drawing helpers shared with the other EP02 sets (monument, soi wide): same fills, washes, sky and glow as the look-frame sets. */
export {fillC, washC, mix, sky, glow, warmOf, sideQuad, flatQuad, dressAs};
