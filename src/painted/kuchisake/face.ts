import {ell, glaze, inkLine, solid} from '../kit/draw';
import {hash} from '../kit/hash';
import type {Painter, Pt} from '../kit/painter';

// The woman's face code (look-defining, brief VD06/VD07; Film's `KSO` episode code, hardened by Boss). Head units as
// kit/head.ts: K px per unit, v down from the head decal centre. Painted after the head decal, so it sits over the
// face. `m` 0..1 is the mask state: 0 = worn over nose to chin (the mouth is hidden), 1 = dropped on its ear loops out of
// frame. Once the mouth is clear (m >= 0.15) the open slit grin shows: a wide split from ear to ear, asymmetric, dark
// inside, with uneven teeth, gums and a tongue (user direction 1 Nov 2026: a split watermelon; round 3: more horrifying).
// Implication only: no blood, no flesh beyond the lip edge, no red (the gums are a dusky mauve).

const MASK = '#ecebe6';
const MASK_FOLD = '#b6b3ac';
const LOOP = '#26282d';
const LIP = '#1a1214';
const INTERIOR = '#0b0506';
const GUM = '#4b3336';
const TONGUE = '#4a3a40';
const TONGUE_RIDGE = '#17111a';
const TEETH = '#dcd3b8';
const TEETH_LO = '#cfc6ab';
const TEETH_BAD = '#8c8270';
const SMILE_SHADOW = '#2a1f2b';

/** Worn outline: top edge across the nose, sides to the cheeks, bottom past the chin. */
const WORN: Pt[] = [
  [-0.92, 0.36], [-0.6, 0.26], [-0.2, 0.22], [0, 0.23], [0.2, 0.22], [0.6, 0.26], [0.92, 0.36],
  [0.96, 0.6], [0.9, 0.9], [0.72, 1.12], [0.4, 1.24], [0, 1.27], [-0.4, 1.24], [-0.72, 1.12], [-0.9, 0.9], [-0.96, 0.6],
];
/**
 * Lowered: the whole mask dropped 5.4 head units (about 1 m) on its ear loops, out of the close-up frame (brief VD07 "mask
 * lowers"). A mask bunched under the chin would sit in the caption band as a bright shape; dropping it keeps the band quiet.
 * The shape is the same vertex list, so the drop moves continuously with `m`.
 */
const DROP = 5.4;
const LOWERED: Pt[] = WORN.map(([u, v]): Pt => [u, v + DROP]);
const EAR_L: Pt = [-1.13, -0.02], EAR_R: Pt = [1.13, -0.02];

/** The mask outline at state `m`: each vertex lerps from worn to lowered. */
export const maskOutline = (m: number): Pt[] => WORN.map(([u, v], i): Pt => [u + (LOWERED[i][0] - u) * m, v + (LOWERED[i][1] - v) * m]);

/**
 * Open slit grin (ear to ear), round 3. The base edges are symmetric; `warp` makes the smile asymmetric: the left corner
 * rises and runs further into the cheek. Edges are sorted by u (left to right), so `edgeAt` reads a height at any u. The
 * corners sit on the face outline near v 0.3, where the cheek shadow and the hair take over.
 */
const warp = ([u, v]: Pt): Pt => [u < 0 ? u * 1.08 : u, v + 0.05 * u];
const OPEN_TOP_BASE: Pt[] = [[-1.04, 0.3], [-0.8, 0.4], [-0.45, 0.46], [-0.15, 0.48], [0, 0.49], [0.15, 0.48], [0.45, 0.46], [0.8, 0.4], [1.04, 0.3]];
const OPEN_BOTTOM_BASE: Pt[] = [[-1.04, 0.3], [-0.86, 0.52], [-0.55, 0.72], [-0.25, 0.84], [0, 0.9], [0.25, 0.84], [0.55, 0.72], [0.86, 0.52], [1.04, 0.3]];
const OPEN_TOP: Pt[] = OPEN_TOP_BASE.map(warp);
const OPEN_BOTTOM: Pt[] = OPEN_BOTTOM_BASE.map(warp);
const CORNER_L: Pt = OPEN_TOP[0], CORNER_R: Pt = OPEN_TOP[OPEN_TOP.length - 1];
/** Upper teeth (u in warped units): uneven, a fang or two, a gap or two, one broken. Lower teeth: fewer, shorter. */
const UPPER_U = [-0.9, -0.74, -0.58, -0.42, -0.26, -0.1, 0.06, 0.22, 0.38, 0.54, 0.7, 0.86];
const LOWER_U = [-0.6, -0.42, -0.24, -0.06, 0.12, 0.3, 0.48];
/** Rips out of each corner into the cheek and hair: three on the left, two on the right. */
const RIPS: Pt[][] = [
  [CORNER_L, [-1.24, 0.16], [-1.36, 0.1]],
  [CORNER_L, [-1.3, 0.3], [-1.38, 0.34]],
  [CORNER_L, [-1.2, 0.4], [-1.26, 0.48]],
  [CORNER_R, [1.14, 0.24], [1.22, 0.18]],
  [CORNER_R, [1.16, 0.44], [1.2, 0.5]],
];

/** Height of a sorted lip edge at u (linear between its keys; the end value outside the range). */
const edgeAt = (edge: Pt[], u: number): number => {
  for (let i = 1; i < edge.length; i++) {
    const [u0, v0] = edge[i - 1], [u1, v1] = edge[i];
    if (u <= u1) return v0 + ((v1 - v0) * (u - u0)) / (u1 - u0);
  }
  return edge[edge.length - 1][1];
};

/** One tooth hanging from a lip edge (sign +1: down from the upper lip; -1: up from the lower lip): a quad with a tip `depth` in. */
const tooth = (edge: Pt[], sign: 1 | -1, u: number, w: number, depth: number, jit: number): Pt[] => {
  const tip = edgeAt(edge, u) + sign * depth;
  return [[u - w / 2, edgeAt(edge, u - w / 2)], [u + w / 2, edgeAt(edge, u + w / 2)], [u + w * 0.22 + jit, tip], [u - w * 0.22 + jit, tip]];
};

/** A band hanging from a lip edge: the edge (u ascending) and the same edge moved `sign * depth` into the mouth, reversed. */
const strip = (edge: Pt[], sign: 1 | -1, depth: number): Pt[] => [...edge, ...edge.slice().reverse().map(([u, v]): Pt => [u, v + sign * depth])];

/**
 * Paint the mask, ear loops and (when the mouth is clear) the open grin over a decal head centred at (cx, cy), K px per unit.
 * The grin's interior covers the decal's flat mouth line, so no skin patch is needed.
 */
export const paintMaskFace = (p: Painter, seed: number, cx: number, cy: number, K: number, m: number) => {
  const Q = (pts: Pt[]) => pts.map(([u, v]): Pt => [cx + u * K, cy + v * K]);
  const outline = maskOutline(m);
  let line = 0;
  // Ear loops: from each ear to its mask corner (outline[0] and outline[6]); drawn first so the mask covers their ends.
  inkLine(p, seed + ++line, Q([EAR_L, [-1.1, 0.2], outline[0]]), {color: LOOP, weight: 1.6, curve: 0.4, closed: false});
  inkLine(p, seed + ++line, Q([EAR_R, [1.1, 0.2], outline[6]]), {color: LOOP, weight: 1.6, curve: 0.4, closed: false});
  if (m >= 0.15) {
    // The mouth is clear once the mask has left it. Shadow where the corners run into the hair first.
    glaze(p, seed + 11, SMILE_SHADOW, 110, Q([[-1.08, 0.2], [-0.84, 0.3], [-0.84, 0.5], [-1.12, 0.52]]), {texture: 0.3, border: 0.3, bleed: 0.05});
    glaze(p, seed + 12, SMILE_SHADOW, 110, Q([[1.08, 0.2], [0.84, 0.3], [0.84, 0.5], [1.12, 0.52]]), {texture: 0.3, border: 0.3, bleed: 0.05});
    // The interior: near black, deepest under the upper gum.
    solid(p, seed + 13, INTERIOR, Q([...OPEN_TOP, ...OPEN_BOTTOM.slice().reverse()]), 4, 0.02, 0.1);
    glaze(p, seed + 14, '#000000', 150, Q(strip(OPEN_TOP, 1, 0.24)), {texture: 0.4, border: 0.4, bleed: 0.08});
    // The tongue, low in the mouth, with a ridge.
    solid(p, seed + 15, TONGUE, Q(ell(0.02, 0.8, 0.34, 0.1, 16)), 3, 0.02, 0.05);
    inkLine(p, seed + ++line, Q([[-0.26, 0.76], [0, 0.71], [0.26, 0.76]]), {color: TONGUE_RIDGE, weight: 1.2, curve: 0.3, closed: false});
    // Gums (dusky mauve, low saturation: no red).
    solid(p, seed + 16, GUM, Q(strip(OPEN_TOP, 1, 0.06)), 3, 0.02, 0.05);
    solid(p, seed + 17, GUM, Q(strip(OPEN_BOTTOM, -1, 0.05)), 3, 0.02, 0.05);
    // Teeth, one quad each: uneven lengths, fangs, gaps where the gum shows, one broken tooth.
    UPPER_U.forEach((u, i) => {
      const gap = hash(seed + 400 + i) > 0.84;
      if (gap) return;
      const fang = i === 2 || i === 9 ? 0.07 : 0;
      const depth = 0.07 + 0.09 * hash(seed + 500 + i) + fang;
      const color = hash(seed + 420 + i) < 0.1 ? TEETH_BAD : TEETH;
      solid(p, seed + 600 + i, color, Q(tooth(OPEN_TOP, 1, u, 0.13, depth, (hash(seed + 700 + i) - 0.5) * 0.03)), 2, 0.02, 0.05);
    });
    LOWER_U.forEach((u, i) => {
      if (hash(seed + 800 + i) > 0.8) return;
      const depth = 0.06 + 0.07 * hash(seed + 900 + i);
      solid(p, seed + 920 + i, TEETH_LO, Q(tooth(OPEN_BOTTOM, -1, u, 0.12, depth, (hash(seed + 940 + i) - 0.5) * 0.03)), 2, 0.02, 0.05);
    });
    // Lip edges, torn: the lines, then short jags that break the edge outward.
    inkLine(p, seed + ++line, Q(OPEN_TOP), {color: LIP, weight: 2.4, curve: 0.3, closed: false});
    inkLine(p, seed + ++line, Q(OPEN_BOTTOM), {color: LIP, weight: 2.4, curve: 0.3, closed: false});
    for (let i = 1; i < OPEN_TOP.length - 1; i += 2) {
      const [u, v] = OPEN_TOP[i];
      inkLine(p, seed + ++line, Q([[u, v], [u + (hash(seed + 950 + i) - 0.5) * 0.04, v - 0.05 - 0.05 * hash(seed + 960 + i)]]), {color: LIP, weight: 1.3, curve: 0, closed: false});
    }
    for (let i = 1; i < OPEN_BOTTOM.length - 1; i += 2) {
      const [u, v] = OPEN_BOTTOM[i];
      inkLine(p, seed + ++line, Q([[u, v], [u + (hash(seed + 970 + i) - 0.5) * 0.04, v + 0.05 + 0.05 * hash(seed + 980 + i)]]), {color: LIP, weight: 1.3, curve: 0, closed: false});
    }
    // The rips: the corners tear further into the cheeks and hair.
    for (const r of RIPS) inkLine(p, seed + ++line, Q(r), {color: LIP, weight: 2.0, curve: 0.3, closed: false});
  }
  solid(p, seed + 20, MASK, Q(outline), 4, 0.02, 0.1);
  // Pleats across the worn mask; they travel with the mask as it drops.
  const drop = m * DROP;
  const folds: Pt[][] = [[[-0.7, 0.52], [0, 0.58], [0.7, 0.52]], [[-0.66, 0.74], [0, 0.8], [0.66, 0.74]]];
  for (const f of folds) inkLine(p, seed + 30 + ++line, Q(f.map(([u, v]): Pt => [u, v + drop])), {color: MASK_FOLD, weight: 1.2, curve: 0.3, closed: false});
};
