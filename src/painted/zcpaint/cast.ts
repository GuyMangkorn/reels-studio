import type {PaintContext} from '../BrushCanvas';
import {hash} from '../kit/hash';
import type {Pt} from '../kit/painter';
import type {Cast} from '../spike/CastSheet';
import type {Face} from '../spike/FaceSheet';
import {ellipse} from '../spike/ProportionSheet';
import type {Paint} from '../spike/SideSheet';

// ZCPAINT cast (S-P01/S-P02): the two recurring figures on the WORLD FOG 4-head base (`SCALE-ZCP-R1`: 1.70 m, head
// 0.425 m, 190 px per head = 447 px/m at scale 1). Casts are data for the shared figure functions (CastSheet
// `paintBodyFront`, SideSheet `paintBodySide`, ./figure.ts back and seated views). Day-3 and infected details are
// overlays that follow the head anchor, so every view uses the same marks.

/** `zc-you`: Thai man about 28; faded dark-teal tee, grey shorts, barefoot (`VD-ZC-CH`). */
export const YOU: Cast = {
  name: 'คุณ', role: 'zc-you', face: 0,
  head: {skin: '#e2b084', hair: '#262422', cut: 'short'},
  outfit: {shoulder: 0.4, shirt: '#2f5a5c', sleeve: '#2f5a5c', longSleeves: false, pants: '#6c7072', shoes: '#e2b084'},
};
/** Day 3 (B09 on): same clothes creased and lightly stained (a shade darker); stubble, bags and messy hair are overlays. */
export const YOU_DAY3: Cast = {
  ...YOU, role: 'zc-you (day 3)',
  outfit: {...YOU.outfit, shirt: '#2a5254', sleeve: '#2a5254', pants: '#666a6c'},
};
/**
 * `zc-infected`: adult woman, 1.60-1.65 m (draw at 0.95 x), dark bob, grey-green skin. Pass 8 (user 7b look check, 30 Oct 2026):
 * dirty khaki `#7a7460` shirt and grey-green `#4f514b` trousers (were the white sleep shirt, which read as a mannequin).
 */
export const INFECTED: Cast = {
  name: 'ผู้ติดเชื้อ', role: 'zc-infected', face: 0,
  head: {skin: '#bdb9a6', hair: '#151314', cut: 'bob'},
  outfit: {shoulder: 0.37, shirt: '#7a7460', sleeve: '#7a7460', longSleeves: false, pants: '#4f514b', shoes: '#b3b09a', coat: '#7a7460'},
};
/** Height of the infected relative to `zc-you` (1.62 / 1.70). */
export const INFECTED_SCALE = 0.95;
/** Stoop of the infected (user, 30 Oct 2026): forward lean about the hips in profile (rad), and the 0..1 drop used from the front and back. */
export const INFECTED_LEAN = 0.3, INFECTED_STOOP = 1;

/** Face-control mapping of the brief (`VD-ZC-CH`): startle, fear, focused, listening, frozen, tired, rage. */
export const ZC_FACES: Record<string, Face> = {
  neutral: {name: 'neutral', brow: 'flat', eyes: 'dot', look: [0, 0], mouth: 'flat'},
  startle: {name: 'startle', brow: 'up', eyes: 'wide', look: [0, 0], mouth: 'o'},
  fear: {name: 'fear', brow: 'worry', eyes: 'wide', look: [-0.8, 0], mouth: 'gasp'},
  focused: {name: 'focused', brow: 'quirk', eyes: 'dot', look: [0, 0], mouth: 'tilt'},
  listening: {name: 'listening', brow: 'flat', eyes: 'dot', look: [-1, 0], mouth: 'flat'},
  frozen: {name: 'frozen', brow: 'worry', eyes: 'wide', look: [-0.8, 0], mouth: 'gasp'},
  tired: {name: 'tired', brow: 'flat', eyes: 'half', look: [0, 0.4], mouth: 'flat'},
  rage: {name: 'rage', brow: 'angry', eyes: 'wide', look: [0, 0], mouth: 'flat'},
};

const BLOOD = '#5a1414', HAIR_INF = '#151314';

/** Soft translucent veil (stubble, smear); seeded by `seed`, holds still. */
const veil = (ctx: PaintContext, seed: number, color: string, opacity: number, pts: Pt[], bleed = 0.3) => {
  ctx.still(seed);
  ctx.brush.noStroke();
  ctx.brush.fill(color, opacity);
  ctx.brush.fillBleed(bleed);
  ctx.brush.fillTexture(0.4, 0.4);
  ctx.brush.polygon(pts);
  ctx.brush.noFill();
};

/** Head-unit mapper for a head centred on (cx, cy) with `K` px per unit. */
const unit = (cx: number, cy: number, K: number) => (u: number, v: number): Pt => [cx + u * K, cy + v * K];

/**
 * Rage overlay on the front decal head (`VD-ZC-CH`, B01-SH02 end state): bloodshot rim, a hair lock over one eye
 * (screen right), a snarling dark mouth with ragged teeth, blood at the corners and a drip to the chin, soft smears.
 * Copied from the Film spike (`rageFace`) with the same geometry; draw the head (`paintHead`, face `rage`) first.
 */
export const paintRageFront = (ctx: PaintContext, p: Paint, cx: number, cy: number, K: number) => {
  const H = unit(cx, cy, K);
  p.ink([H(-0.62, 0.05), H(-0.4, -0.12), H(-0.18, 0.05)], 1.4, 0.4, '#7a1f1f');
  p.part(HAIR_INF, [H(0.12, -0.5), H(0.55, -0.48), H(0.78, -0.1), H(0.74, 0.38), H(0.6, 0.62), H(0.5, 0.3), H(0.2, -0.05)], true, 8);
  p.part('#2a0f0f', [H(-0.32, 0.55), H(-0.12, 0.5), H(0.12, 0.51), H(0.3, 0.56), H(0.24, 0.76), H(0, 0.8), H(-0.24, 0.75)], true, 8);
  for (let i = 0; i < 5; i++) {
    const u = -0.22 + i * 0.11;
    p.part('#e8e2cf', [H(u - 0.04, 0.52 + Math.abs(u) * 0.08), H(u + 0.04, 0.52 + Math.abs(u) * 0.08), H(u, 0.6 + 0.02 * (i % 2))], false, 8);
    if (i % 2 === 0) p.part('#e8e2cf', [H(u - 0.03, 0.77 - Math.abs(u) * 0.08), H(u + 0.03, 0.77 - Math.abs(u) * 0.08), H(u, 0.7)], false, 8);
  }
  p.part(BLOOD, [H(-0.34, 0.6), H(-0.28, 0.62), H(-0.3, 0.86), H(-0.35, 0.84)], false, 6);
  p.part(BLOOD, [H(0.04, 0.8), H(0.12, 0.8), H(0.1, 1.08), H(0.05, 1.12)], false, 6);
  veil(ctx, p.id + 9001, BLOOD, 140, [H(-0.6, 0.3), H(-0.42, 0.26), H(-0.36, 0.48), H(-0.58, 0.5)]);
  veil(ctx, p.id + 9002, BLOOD, 120, [H(-0.2, 1.0), H(0.25, 0.98), H(0.2, 1.2), H(-0.15, 1.2)]);
};

/**
 * Bob hair of the infected in profile (facing +x), in head units about the head centre (y down; the decal head spans u ±1 and
 * v −1.05 to 1.22). Pass 8 (user 7b look check): one shaped mass over the crown and the back, a fringe over the brow and
 * ragged ends at the nape and jaw, not a box. The same outline is the B01 silhouette's hair (body6 `silHair`).
 */
export const BOB_SIDE: [number, number][] = [
  [0.62, -0.42], [0.66, -0.8], [0.45, -1.04], [0.05, -1.2], [-0.45, -1.16], [-0.85, -0.9], [-1.12, -0.45], [-1.22, 0.05], [-1.18, 0.5], [-1.0, 0.78],
  [-0.84, 0.6], [-0.6, 0.86], [-0.38, 0.66], [-0.14, 0.9], [0.1, 0.7], [0.3, 0.84], [0.46, 0.56], [0.42, 0.2], [0.34, -0.14], [0.4, -0.3],
];

/**
 * Profile overlay for the infected (facing +x): the bob mass (`BOB_SIDE`), a bloody mouth corner and an eye-shine through the
 * hair; `lit` shows the mouth and the shine (the B01 silhouette uses `lit` false and paints its own hair from `BOB_SIDE`).
 */
export const paintInfectedSide = (p: Paint, cx: number, cy: number, K: number, lit: boolean) => {
  const L = unit(cx, cy, K);
  if (lit) p.part(BLOOD, ellipse(cx + 0.8 * K, cy + 0.95 * K, 0.22 * K, 0.12 * K, 12), false, 6);
  p.part(HAIR_INF, BOB_SIDE.map(([u, v]) => L(u, v)), true, 6);
  p.ink([L(-0.9, -0.95), L(-0.3, -1.08), L(0.25, -0.98)], 0.7, 0.5, '#4a4048'); // a sheen stroke along the crown, so the mass reads as hair
  if (lit) p.part('#e9e6d6', ellipse(cx + 0.95 * K, cy - 0.05 * K, 0.06 * K, 0.04 * K, 8), false, 6);
};

/**
 * Day-3 face marks on `zc-you` (front or profile): stubble over the lower face, darker under the eyes, messy hair tufts.
 * `view` 'front' centred on the head, 'side' facing +x (head anchor from `paintBodySide`). Draw after the head.
 */
export const paintDay3Face = (ctx: PaintContext, p: Paint, view: 'front' | 'side', cx: number, cy: number, K: number) => {
  const H = unit(cx, cy, K);
  const ink = '#b98a70'; // light under-eye marks: they must not read as a dirty patch (user, 30 Oct 2026)
  const jaw: Pt[] = view === 'front'
    ? [[-0.66, 0.5], [0.66, 0.5], [0.58, 0.88], [0.38, 1.08], [0, 1.15], [-0.38, 1.08], [-0.58, 0.88]]
    : [[0.8, 0.58], [0.8, 0.85], [0.64, 1.06], [0.44, 1.12], [0.22, 1.08], [0.14, 0.85], [0.3, 0.66], [0.6, 0.58]];
  // Stubble as fine dots: seeded rejection sampling inside the jaw polygon, a few px each.
  const inside = ([x, y]: Pt) => {
    let c = false;
    for (let i = 0, j = jaw.length - 1; i < jaw.length; j = i++) {
      const [xi, yi] = jaw[i], [xj, yj] = jaw[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  let n = 0;
  for (let i = 0; i < 600 && n < 150; i++) {
    const u = -0.7 + 1.5 * hash(i * 2 + 5), v = 0.5 + 0.7 * hash(i * 2 + 6);
    if (!inside([u, v])) continue;
    n++;
    const r = 0.022 + 0.01 * hash(i + 90);
    p.part('#2a1f1a', [H(u - r, v - r), H(u + r, v - r), H(u + r, v + r), H(u - r, v + r)], false, 1);
  }
  if (view === 'front') {
    for (const s of [-1, 1]) p.ink([H(s * 0.62, 0.22), H(s * 0.4, 0.3), H(s * 0.2, 0.22)], 0.8, 0.6, ink);
    for (const [x, w] of [[-0.55, 0.3], [-0.15, 0.34], [0.3, 0.32]] as const) p.part('#262422', [H(x, -1.02), H(x + w / 2, -1.28), H(x + w, -1.02)], false, 5);
  } else {
    p.ink([H(0.9, 0.22), H(0.72, 0.3), H(0.54, 0.25)], 0.8, 0.6, ink);
    for (const [x, w] of [[-0.5, 0.3], [-0.1, 0.3], [0.3, 0.3]] as const) p.part('#262422', [H(x, -1.12), H(x + w / 2, -1.36), H(x + w, -1.12)], false, 5);
  }
  void ctx;
};

/** Day-3 shirt marks: crease strokes and a stain, over the torso of a front or back view (px, chin-based units of `h`). */
export const paintDay3Shirt = (p: Paint, cx: number, shoulderY: number, hipY: number, h: number) => {
  const crease = '#1d3b3d';
  for (const [dx, y0, y1] of [[-0.12, 0.15, 0.4], [0.1, 0.3, 0.55], [0.02, 0.6, 0.85]] as const) {
    const a = shoulderY + (hipY - shoulderY) * y0, b = shoulderY + (hipY - shoulderY) * y1;
    p.ink([[cx + dx * h - 0.08 * h, a], [cx + dx * h, (a + b) / 2], [cx + dx * h + 0.07 * h, b]], 1.0, 0.5, crease);
  }
  p.part('#38605a', ellipse(cx - 0.1 * h, shoulderY + (hipY - shoulderY) * 0.62, 0.1 * h, 0.07 * h, 12), false, 3);
};
