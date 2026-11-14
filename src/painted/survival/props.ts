import {hardFill, inkLine, washAt} from '../kit/draw';
import {paintFogCone, paintHalo} from '../kit/fog';
import type {Painter, Pt} from '../kit/painter';
import type {Item} from '../kit/world';
import {cardAt, cell, cp, cps, lit, type Card, type Light, type V3, type YCam} from './core';
import {paintFire} from './fire';

// Props of the series that are not in the kit rig `Prop` list (N16-10, N17-06, N18-08). Two kinds:
//   hand anchors  basket, held phone, held cup, phone torch beam (batch 1): screen-space shapes on `FigAnchors.rHand` / `lHand` (px) at `u` px per metre.
//   PROPS (batch 2, below): 31 organic and kitchen props as small cards in their own metres, drawn by id for a hand (`paintHeldProp`, the grip point on the hand anchor)
//   or for the ground (`paintGroundProp` / `groundPropItem`, the base point on a world ground point). Ids: PROP_IDS. The kit rig's own `phone` prop stays the lock-screen phone.
// Not built, on purpose: the 1-litre bottle on a floor is `bottle` here; the `cylinder` of `under.ts` still stands for a jar.

/** Empty woven basket (กระบุง) hanging from a hand. */
export const basket = (p: Painter, h: Pt, u: number, back = false) => {
  const k: Card = {g: [h[0], h[1] + 0.2 * u], u, s: 1};
  hardFill(p, 17000, '#b8925a', cps(k, [[-0.11, 0.2], [0.11, 0.2], [0.085, 0.0], [-0.085, 0.0]]));
  for (let i = 0; i < 4; i++) inkLine(p, 17001 + i, cps(k, [[-0.1 + i * 0.002, 0.04 + i * 0.045], [0.1 - i * 0.002, 0.04 + i * 0.045]]), {closed: false, weight: 0.4, color: '#7a5a2a', still: true});
  inkLine(p, 17010, cps(k, [[-0.09, 0.2], [0, 0.29], [0.09, 0.2]]), {closed: false, weight: 0.8, color: '#7a5a2a', still: true, curve: 0.5});
  void back;
};

/** Phone in the right hand with its lit screen glowing (EP18 sh4 phone at the ear, sh6): `glow` 0..1 the screen light. */
export const paintPhoneHeld = (p: Painter, hand: Pt, u: number, glow = 0.6, seed = 24000) => {
  const h = hand, ph: Pt[] = [[h[0] - 0.02 * u, h[1] - 0.07 * u], [h[0] + 0.02 * u, h[1] - 0.07 * u], [h[0] + 0.022 * u, h[1] + 0.02 * u], [h[0] - 0.018 * u, h[1] + 0.02 * u]];
  hardFill(p, seed, '#26282c', ph);
  washAt(p, seed + 1, '#bcd8ff', 60 * glow, cell({g: h, u, s: 1}, 0, 0.02, 0.06, 0.05, 12), 0.4, 0.3);
};

/** Cup tipped toward a mouth, held at `hand` (EP18 sh19, the first sips). */
export const paintCupHeld = (p: Painter, hand: Pt, u: number, seed = 24310) => {
  const h = hand, q: Pt[] = [[h[0] - 0.05 * u, h[1] - 0.07 * u], [h[0] + 0.02 * u, h[1] - 0.1 * u], [h[0] + 0.045 * u, h[1]], [h[0] - 0.025 * u, h[1] + 0.03 * u]];
  hardFill(p, seed, '#e8e0d0', q);
  inkLine(p, seed + 1, q, {weight: 0.6, color: '#6a5a4a', still: true});
};

/**
 * Phone torch (N18-05): a cool-white cone from the phone's back lens to `target` (picture px, e.g. the cabinet glass or the floor) with a small halo at the lens.
 * Pass the hand anchor every frame and the beam follows the hand; `level` 0..1 switches it (the click). Use after the set and before the people so it lights the set only.
 */
export const paintTorchBeam = (p: Painter, lens: Pt, target: Pt, o: {level?: number; spread?: number; color?: string; seed?: number} = {}) => {
  const level = o.level ?? 1, dx = target[0] - lens[0], dy = target[1] - lens[1];
  if (level <= 0) return;
  paintFogCone(p, {x: lens[0], y: lens[1], angle: Math.atan2(dy, dx), length: Math.hypot(dx, dy), spread: o.spread ?? 0.16, color: o.color ?? '#e8f2ff', level});
  paintHalo(p, {x: lens[0], y: lens[1], r: 38, color: '#e8f2ff', level, squash: 1, seed: o.seed ?? 24400});
};

// ====================================================================================================================== batch 2 props (14 Nov 2026)
const ID = {wood: '#8a6a44', woodDark: '#5e4630', iron: '#8a8e92', ironDark: '#5a5e62', burlap: '#b79a6a', ink: '#3a2e24'} as const;
export type PropOpts = {
  /** Fill-id base (give two of the same prop in one plate different seeds). */ seed?: number;
  /** Rotation about the grip / base in radians (positive = clockwise on screen). */ ang?: number;
  /** Mirror: 1 as drawn (facing screen right), -1 mirrored. */ s?: 1 | -1;
  /** Light mixing (a `lit` colour map), default none. */ L?: Light;
  /** 0..1 fill level (bottle, bucket, bowl), default per prop. */ level?: number;
  /** 0..1 swing or flap phase (fish tail, hand fan), default 0. */ swing?: number;
  /** +1 / -1 direction the prop leans toward (cup offered). */ dir?: 1 | -1;
};
type Ctx = {pt: (x: number, y: number) => Pt; pts: (a: [number, number][]) => Pt[]; fill: (col: string, a: [number, number][]) => void; ell: (col: string, cx: number, cy: number, rx: number, ry: number, a?: number) => void;
  line: (a: [number, number][], o?: {w?: number; col?: string; closed?: boolean}) => void; outline: (a: [number, number][], w?: number) => void; wash: (col: string, op: number, a: [number, number][]) => void; c: (col: string) => string; o: PropOpts; u: number};
const ctxOf = (p: Painter, k0: Card, o: PropOpts, base: number): Ctx => {
  const k: Card = {...k0, s: k0.s * (o.s ?? 1)}, ang = o.ang ?? 0, ca = Math.cos(ang), sa = Math.sin(ang), c = (col: string) => (o.L ? lit(o.L, col) : col);
  let n = 0;
  const pt = (x: number, y: number): Pt => cp(k, x * ca - y * sa, x * sa + y * ca);
  const pts = (a: [number, number][]) => a.map(([x, y]) => pt(x, y));
  return {pt, pts, o, u: k.u, c,
    fill: (col, a) => hardFill(p, base + n++, c(col), pts(a)),
    ell: (col, cx, cy, rx, ry, ea = 0) => hardFill(p, base + n++, c(col), Array.from({length: 14}, (_, i): Pt => { const t = (i / 14) * 6.2832, x = rx * Math.cos(t), y = ry * Math.sin(t); return pt(cx + x * Math.cos(ea) - y * Math.sin(ea), cy + x * Math.sin(ea) + y * Math.cos(ea)); })),
    line: (a, lo = {}) => inkLine(p, base + n++, pts(a), {closed: lo.closed ?? false, weight: lo.w ?? 0.6, color: c(lo.col ?? ID.ink), still: true}),
    outline: (a, w = 0.6) => inkLine(p, base + n++, pts(a), {closed: true, weight: w, color: c(ID.ink), still: true}),
    wash: (col, op, a) => washAt(p, base + n++, c(col), op, pts(a), 0.15, 0.2)};
};
const oval = (cx: number, cy: number, rx: number, ry: number, n = 14): [number, number][] => Array.from({length: n}, (_, i) => [cx + rx * Math.cos((i / n) * 6.2832), cy + ry * Math.sin((i / n) * 6.2832)] as [number, number]);
const stroke = (x0: number, y0: number, x1: number, y1: number, w: number): [number, number][] => {
  const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy) || 1, nx = (-dy / l) * (w / 2), ny = (dx / l) * (w / 2);
  return [[x0 + nx, y0 + ny], [x1 + nx, y1 + ny], [x1 - nx, y1 - ny], [x0 - nx, y0 - ny]];
};

export type PropSpec = {
  /** Where the hand holds it (card metres from the origin); for a ground prop the origin is the base point. */ grip: Pt;
  /** Height in metres at scale 1 (for sizing checks). */ h: number;
  /** Real-world use, for the sheet. */ note: string;
  draw: (x: Ctx) => void;
  /** Named anchor points in card metres (same frame as `grip`), e.g. where a jaw takes the prop. */ anchors?: Record<string, Pt>;
};

/** N16-17 `new: cycad seed cone` geometry (card metres, origin at the stalk's foot, upright): one rigid ovoid cluster 0.22 m tall by 0.16 m wide of nine glossy orange seeds (three rows of three, the middle row offset) on a 6 cm brown stalk that ends INSIDE the cluster. */
export const SEED_CONE = {
  stalk: {x: 0, y0: 0, y1: 0.075, w: 0.03},
  cluster: {cx: 0, cy: 0.17, rx: 0.08, ry: 0.11},
  seeds: [[-0.04, 0.095, 0.034], [0.04, 0.095, 0.034], [0, 0.085, 0.03], [-0.052, 0.17, 0.036], [0.052, 0.17, 0.036], [0, 0.17, 0.038], [-0.036, 0.245, 0.032], [0.036, 0.245, 0.032], [0, 0.255, 0.03]] as [number, number, number][],
  grip: [0, 0.03] as [number, number], mouth: [0, 0.17] as [number, number],
};
export const PROPS = {
  hoe: {grip: [0.17, 0.62], h: 1.2, note: 'EP16 sh11: garden hoe, wooden handle, iron blade (blade down at the origin)', draw: (x) => {
    x.fill(ID.wood, stroke(0.1, 0.12, 0.24, 1.2, 0.034)); x.fill(ID.iron, [[0, 0], [0.22, 0.02], [0.21, 0.13], [0.09, 0.17], [-0.01, 0.09]]); x.fill(ID.ironDark, [[0.05, 0.1], [0.14, 0.2], [0.12, 0.22], [0.03, 0.12]]);
    x.outline([[0, 0], [0.22, 0.02], [0.21, 0.13], [0.09, 0.17], [-0.01, 0.09]]); x.line([[0.1, 0.12], [0.24, 1.2]], {w: 0.5, col: ID.woodDark}); }},
  sack: {grip: [0, 0.5], h: 0.58, note: 'EP16: burlap sack held by the tied neck or sitting on a shelf', draw: (x) => {
    const body: [number, number][] = [[-0.18, 0], [0.18, 0], [0.21, 0.28], [0.15, 0.5], [0.07, 0.58], [-0.07, 0.58], [-0.15, 0.5], [-0.21, 0.28]];
    x.fill(ID.burlap, body); x.wash('#d8c08e', 110, [[-0.16, 0.05], [-0.04, 0.05], [-0.06, 0.45], [-0.14, 0.4]]); x.wash('#7a5a30', 80, [[0.08, 0.02], [0.2, 0.28], [0.14, 0.48], [0.1, 0.1]]);
    for (let i = 0; i < 5; i++) x.line([[-0.18, 0.06 + i * 0.1], [0.19, 0.06 + i * 0.1]], {w: 0.35, col: '#8a6c3a'});
    x.fill('#6a4a2a', [[-0.09, 0.48], [0.09, 0.48], [0.085, 0.52], [-0.085, 0.52]]); x.outline(body, 0.8); }},
  knife: {grip: [0.05, 0], h: 0.04, note: 'EP16/EP18: kitchen knife, wood handle, steel blade pointing +x', draw: (x) => {
    x.fill(ID.wood, [[-0.04, -0.016], [0.1, -0.014], [0.1, 0.016], [-0.04, 0.02]]); x.fill('#c8ccd0', [[0.1, 0.018], [0.29, 0.0], [0.1, -0.026]]);
    x.outline([[0.1, 0.018], [0.29, 0.0], [0.1, -0.026]], 0.5); x.outline([[-0.04, -0.016], [0.1, -0.014], [0.1, 0.016], [-0.04, 0.02]], 0.5); x.wash('#f4f6f8', 150, [[0.11, 0.008], [0.24, 0.002], [0.11, -0.004]]); }},
  'seed-sack': {grip: [0, 0.3], h: 0.34, note: 'EP16 sh14: seed sack, pale cloth tied at the neck, hand-painted rice plant mark (no text)', draw: (x) => {
    const body: [number, number][] = [[-0.12, 0], [0.12, 0], [0.14, 0.17], [0.09, 0.28], [-0.09, 0.28], [-0.14, 0.17]];
    x.fill('#d8cfae', body); x.wash('#b8ac84', 90, [[0.04, 0.02], [0.13, 0.17], [0.08, 0.26], [0.05, 0.1]]); x.fill('#7a5a3a', [[-0.075, 0.27], [0.075, 0.27], [0.07, 0.31], [-0.07, 0.31]]);
    for (const dx of [-0.045, 0, 0.045]) { x.line([[dx, 0.04], [dx * 1.3, 0.2]], {w: 1.0, col: '#4f7a3a'}); x.ell('#e0b84a', dx * 1.3, 0.2, 0.012, 0.025); }
    x.outline(body, 0.7); }},
  'coconut-scoop': {grip: [0.12, 0.02], h: 0.1, note: 'EP16: half a coconut shell on a bamboo stick, for scooping rice', draw: (x) => {
    x.fill('#a8845a', stroke(0.07, 0.03, 0.3, 0.07, 0.014)); x.fill('#5a3a24', oval(0, 0, 0.075, 0.05)); x.fill('#7a5232', oval(0, 0.012, 0.062, 0.03)); x.ell('#3a2616', 0, 0.02, 0.05, 0.016); x.outline(oval(0, 0, 0.075, 0.05), 0.6); x.line([[-0.05, 0.036], [0.05, 0.036]], {w: 0.35, col: '#2a1a10'}); }},
  'rice-bowl': {grip: [0, 0.03], h: 0.1, note: 'EP16 sh17: clay bowl of sticky rice (a mound with a rim)', draw: (x) => {
    const bowl: [number, number][] = [[-0.075, 0.06], [0.075, 0.06], [0.055, 0.0], [-0.055, 0.0]];
    x.fill('#f2ecd8', [[-0.065, 0.058], [-0.04, 0.095], [0.04, 0.095], [0.065, 0.058]]); x.fill('#a8683c', bowl); x.wash('#d8946a', 120, [[-0.07, 0.055], [-0.02, 0.055], [-0.03, 0.015]]); x.outline(bowl, 0.6);
    x.line([[-0.075, 0.06], [0.075, 0.06]], {w: 0.7, col: '#5a3820'}); for (let i = 0; i < 5; i++) x.ell('#fffaec', -0.04 + i * 0.02, 0.085 - Math.abs(i - 2) * 0.006, 0.007, 0.004); }},
  'hand-net': {grip: [0, 0.2], h: 1.15, note: 'EP16 sh16: hoop net on a stick, bag of cord mesh (held up with the fish in it)', draw: (x) => {
    x.fill('#8a6a44', stroke(0, 0, 0.0, 0.8, 0.026));
    x.fill('#d8d0b4', [[-0.2, 0.86], [0.2, 0.86], [0.17, 0.62], [0.0, 0.54], [-0.17, 0.62]]);
    for (let i = -3; i <= 3; i++) x.line([[i * 0.055, 0.86], [i * 0.03, 0.57]], {w: 0.3, col: '#8a8470'});
    for (let j = 0; j < 3; j++) x.line([[-0.19 + j * 0.03, 0.8 - j * 0.07], [0.19 - j * 0.03, 0.8 - j * 0.07]], {w: 0.3, col: '#8a8470'});
    x.outline(oval(0, 0.88, 0.21, 0.045), 1.0); x.line([[-0.2, 0.86], [-0.17, 0.62], [0, 0.54], [0.17, 0.62], [0.2, 0.86]], {w: 0.6, col: '#8a8470'}); }},
  fish: {grip: [0, 0], h: 0.1, note: 'EP16 sh16-17: river fish, silver flank, 0.22 m; `swing` flaps the tail', draw: (x) => {
    const sw = (x.o.swing ?? 0) * 0.04, body = oval(0, 0, 0.11, 0.04, 16);
    x.fill('#aebcc0', [[0.1, 0], [0.19, 0.055 + sw], [0.17, 0.0 + sw * 0.5], [0.19, -0.05 + sw]]); x.fill('#8a9ea4', body); x.wash('#e8f0f0', 160, oval(-0.01, -0.012, 0.085, 0.016)); x.wash('#5a7078', 120, oval(0, 0.025, 0.09, 0.015));
    x.fill('#7a909a', [[-0.02, 0.035], [0.03, 0.035], [0.0, 0.07]]); x.ell('#ffffff', -0.075, 0.008, 0.009, 0.009); x.ell('#1a1a1a', -0.076, 0.008, 0.005, 0.005); x.outline(body, 0.6); }},
  'fish-sticks': {grip: [0, 0.12], h: 0.6, note: 'EP16 sh17: three grilled fish skewered on a bamboo stick', draw: (x) => {
    x.fill('#b89a64', stroke(0, 0, 0.04, 0.6, 0.012));
    for (let i = 0; i < 3; i++) { const y = 0.2 + i * 0.13, xx = 0.012 * (i + 1), body = oval(xx, y, 0.03, 0.07, 12); x.fill(i % 2 ? '#a07040' : '#b88a50', body); x.fill('#8a5a30', [[xx, y - 0.06], [xx - 0.025, y - 0.1], [xx + 0.025, y - 0.1]]); x.ell('#2a1a10', xx - 0.012, y + 0.04, 0.005, 0.005); x.outline(body, 0.5); x.line([[xx - 0.022, y - 0.02], [xx + 0.02, y - 0.015]], {w: 0.35, col: '#4a2a14'}); }
    x.fill('#b89a64', stroke(0.002, 0.52, 0.04, 0.6, 0.012)); }},
  'koi-bowl': {grip: [0, 0.03], h: 0.07, note: 'EP16 sh17: bowl of raw ก้อย (minced fish, herbs, lime), seen a little from above', draw: (x) => {
    x.fill('#d8c8a0', [[-0.11, 0.06], [0.11, 0.06], [0.08, 0.0], [-0.08, 0.0]]); x.ell('#f4ecd8', 0, 0.06, 0.11, 0.03); x.ell('#c46a5a', 0, 0.065, 0.088, 0.024);
    for (let i = 0; i < 8; i++) x.ell(i % 2 ? '#4f7a3a' : '#7a9a48', -0.06 + i * 0.017, 0.068 + ((i * 3) % 3 - 1) * 0.007, 0.008, 0.004);
    x.ell('#d8e048', 0.06, 0.082, 0.016, 0.01); x.outline([[-0.11, 0.06], [0.11, 0.06], [0.08, 0.0], [-0.08, 0.0]], 0.6); x.line([[-0.1, 0.045], [0.1, 0.045]], {w: 0.4, col: '#7a6a44'}); }},
  calendar: {grip: [0, 0.4], h: 0.46, note: 'EP16 sh12: hanging page calendar, red top band, a grid with red dots, no text (hang point = grip)', draw: (x) => {
    const sheet: [number, number][] = [[-0.15, 0], [0.15, 0], [0.15, 0.4], [-0.15, 0.4]];
    x.fill('#f2ead6', sheet); x.fill('#b5473a', [[-0.15, 0.31], [0.15, 0.31], [0.15, 0.4], [-0.15, 0.4]]);
    x.ell('#f2ead6', 0, 0.355, 0.03, 0.02);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) x.ell(((r * 6 + c) % 5 === 2 || (r * 6 + c) === 11) ? '#c43a2e' : '#a89e88', -0.11 + c * 0.044, 0.25 - r * 0.055, 0.009, 0.009);
    x.outline(sheet, 0.7); x.wash('#b8a888', 70, [[0.1, 0.01], [0.15, 0.01], [0.15, 0.3], [0.1, 0.3]]); }},
  'eggs-apron': {grip: [0, 0.1], h: 0.22, note: 'EP16 sh18-19: hen eggs gathered in the front of the apron (pha khao ma check): a gathered cloth bundle with four eggs peeking out', draw: (x) => {
    const cloth: [number, number][] = [[-0.15, 0.2], [-0.13, 0.08], [-0.08, 0.0], [0.08, 0.0], [0.13, 0.08], [0.15, 0.2], [0.06, 0.15], [0.0, 0.17], [-0.06, 0.15]];
    for (const [dx, dy, a] of [[-0.06, 0.2, 0.3], [0.0, 0.215, -0.2], [0.06, 0.205, 0.4], [0.01, 0.18, 0.2]] as [number, number, number][]) { x.ell('#f0e6d0', dx, dy, 0.03, 0.04, a); x.ell('#fff8ec', dx - 0.01, dy + 0.012, 0.009, 0.013, a); }
    x.fill('#efe6d6', cloth);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) if ((r + c) % 2 === 0) x.fill('#b5473a', [[-0.14 + c * 0.047, 0.015 + r * 0.045], [-0.093 + c * 0.047, 0.015 + r * 0.045], [-0.093 + c * 0.047, 0.06 + r * 0.045], [-0.14 + c * 0.047, 0.06 + r * 0.045]].filter(([px, py]) => Math.abs(px) < 0.15 - Math.max(0, 0.04 - py) * 0.8 || py > 0.04) as [number, number][]);
    x.wash('#6a3a2a', 70, [[0.05, 0.02], [0.13, 0.1], [0.13, 0.17], [0.07, 0.1]]); x.line([...cloth, cloth[0]], {w: 0.7}); }},
  'necklace-nail': {grip: [0, 0], h: 0.25, note: 'EP17 sh3: thin gold chain hanging on a nail in a post (origin at the nail), a glint', draw: (x) => {
    const chain: [number, number][] = Array.from({length: 13}, (_, i) => { const t = i / 12; return [-0.09 + 0.18 * t, -0.01 - 0.2 * Math.sin(Math.PI * t) ** 0.9] as [number, number]; });
    x.ell('#4a4a50', 0, 0, 0.012, 0.012); x.line([[-0.09, -0.01], [0, 0.0]], {w: 0.4, col: '#d0a443'}); x.line(chain.map(([a, b]) => [a * 0.9 + 0.0, b]) as [number, number][], {w: 1.0, col: '#d0a443'});
    x.line([[0.09, -0.01], [0, 0]], {w: 0.4, col: '#d0a443'}); x.ell('#d0a443', 0, -0.2, 0.014, 0.022); x.ell('#fff0b0', 0.004, -0.205, 0.005, 0.008);
    x.line([[-0.03, -0.17], [0.03, -0.23]], {w: 0.4, col: '#fff4c0'}); x.line([[0.03, -0.17], [-0.03, -0.23]], {w: 0.4, col: '#fff4c0'}); }},
  axe: {grip: [0, 0.2], h: 0.75, note: 'EP17 sh6: felling axe, hickory handle, iron head (blade toward +x, at the top)', draw: (x) => {
    x.fill('#a07a4a', stroke(0, 0, 0.0, 0.7, 0.034)); x.fill('#b89a64', [[0.0, 0.0], [0.012, 0.0], [0.012, 0.6], [0, 0.6]]);
    const head: [number, number][] = [[-0.03, 0.6], [0.04, 0.6], [0.15, 0.66], [0.14, 0.78], [0.05, 0.75], [-0.03, 0.74]];
    x.fill(ID.ironDark, head); x.fill('#c2c6ca', [[0.1, 0.63], [0.15, 0.66], [0.14, 0.78], [0.115, 0.75]]); x.outline(head, 0.7); }},
  'chop-block': {grip: [0, 0.4], h: 0.42, note: 'EP17 sh6: chopping block (a stump 0.42 m wide with growth rings on top)', draw: (x) => {
    x.fill('#8a6a44', [[-0.21, 0], [0.21, 0], [0.19, 0.4], [-0.19, 0.4]]); x.wash('#5a4228', 130, [[0.08, 0], [0.21, 0], [0.19, 0.4], [0.06, 0.4]]); x.ell('#c8a468', 0, 0.4, 0.19, 0.055); x.ell('#b08a50', 0, 0.4, 0.12, 0.034); x.ell('#98743e', 0, 0.4, 0.05, 0.015);
    x.line([[-0.19, 0.4], [-0.21, 0], [0.21, 0], [0.19, 0.4]], {w: 0.8}); x.line([[-0.1, 0.3], [-0.12, 0.05]], {w: 0.4, col: '#5a4228'}); x.line([[0.0, 0.36], [0.01, 0.08]], {w: 0.4, col: '#5a4228'}); }},
  'log-wet': {grip: [0.0, 0.1], h: 0.16, note: 'EP17 sh6: a freshly split green log half: pale wet-dark inside, a bead of sap, bark outside', draw: (x) => {
    x.fill('#6a4a30', [[-0.34, 0], [0.34, 0], [0.34, 0.14], [-0.34, 0.14]]); x.fill('#d8c08a', [[-0.32, 0.14], [0.32, 0.14], [0.29, 0.1], [-0.29, 0.1]]);
    x.wash('#7a5a30', 130, [[-0.3, 0.138], [0.3, 0.138], [0.3, 0.125], [-0.3, 0.125]]); x.ell('#e8c060', 0.12, 0.13, 0.012, 0.016); x.ell('#fff0b0', 0.115, 0.136, 0.004, 0.005);
    for (let i = 0; i < 4; i++) x.line([[-0.28 + i * 0.16, 0.135], [-0.26 + i * 0.16, 0.1]], {w: 0.4, col: '#a08048'});
    x.outline([[-0.34, 0], [0.34, 0], [0.34, 0.14], [-0.34, 0.14]], 0.8); }},
  'log-dry': {grip: [0.0, 0.07], h: 0.16, note: 'EP17 sh7: a grey, cracked, dry log (hollow knock), end on the left', draw: (x) => {
    x.fill('#8a8478', [[-0.4, 0], [0.4, 0], [0.4, 0.15], [-0.4, 0.15]]); x.wash('#b8b2a2', 130, [[-0.4, 0.1], [0.4, 0.1], [0.4, 0.15], [-0.4, 0.15]]); x.wash('#5a564c', 120, [[-0.4, 0], [0.4, 0], [0.4, 0.04], [-0.4, 0.04]]);
    x.ell('#a89c84', -0.4, 0.075, 0.03, 0.075); x.ell('#c0b49a', -0.4, 0.075, 0.016, 0.04);
    for (let i = 0; i < 6; i++) x.line([[-0.34 + i * 0.13, 0.14 - (i % 2) * 0.03], [-0.3 + i * 0.13, 0.01 + (i % 3) * 0.02]], {w: 0.5, col: '#4a463c'});
    x.outline([[-0.4, 0], [0.4, 0], [0.4, 0.15], [-0.4, 0.15]], 0.8); }},
  bucket: {grip: [0, 0.3], h: 0.36, note: 'EP17 sh12/13/15: tin bucket with a wire bail; `level` fills it with water', draw: (x) => {
    const body: [number, number][] = [[-0.14, 0.3], [0.14, 0.3], [0.11, 0], [-0.11, 0]];
    x.fill('#a8aeb4', body); x.wash('#e0e6ea', 130, [[-0.13, 0.28], [-0.07, 0.28], [-0.05, 0.02], [-0.1, 0.02]]); x.wash('#5a6066', 110, [[0.06, 0.02], [0.11, 0.02], [0.14, 0.28], [0.08, 0.28]]);
    const lv = x.o.level ?? 0; if (lv > 0) x.ell('#6a9ab4', 0, 0.3 - 0.01 - (1 - lv) * 0.24, 0.125, 0.025);
    x.ell('#4a5056', 0, 0.3, 0.14, 0.03); if (lv <= 0) x.ell('#2a2e32', 0, 0.3, 0.12, 0.022);
    x.line([[-0.14, 0.3], [-0.1, 0.0], [0.1, 0.0], [0.14, 0.3]], {w: 0.8}); x.line([[-0.14, 0.31], [0, 0.46], [0.14, 0.31]], {w: 0.8, col: '#5a6066'});
    x.line([[-0.13, 0.2], [0.13, 0.2]], {w: 0.4, col: '#6a7076'}); x.line([[-0.12, 0.1], [0.12, 0.1]], {w: 0.4, col: '#6a7076'}); }},
  'pot-big': {grip: [0, 0.6], h: 0.62, note: 'EP17 sh12 / EP18: the big temple-fair pot (หม้อใหญ่), steel, two ear handles, lid on; on stones over a fire it is `paintPotOnFire`', draw: (x) => {
    const body: [number, number][] = [[-0.34, 0.54], [0.34, 0.54], [0.37, 0.28], [0.3, 0.06], [-0.3, 0.06], [-0.37, 0.28]];
    x.fill('#b8bcc0', body); x.wash('#eef0f2', 120, [[-0.32, 0.5], [-0.2, 0.5], [-0.24, 0.1], [-0.3, 0.12]]); x.wash('#4a4e54', 130, [[0.2, 0.08], [0.3, 0.08], [0.36, 0.3], [0.3, 0.52]]);
    x.wash('#2a2622', 160, [[-0.3, 0.06], [0.3, 0.06], [0.28, 0.16], [-0.28, 0.16]]);
    x.fill('#9a9ea2', [[-0.3, 0.54], [0.3, 0.54], [0.22, 0.6], [-0.22, 0.6]]); x.fill('#7a7e82', [[-0.025, 0.6], [0.025, 0.6], [0.02, 0.64], [-0.02, 0.64]]);
    x.ell('#7a7e82', -0.4, 0.34, 0.04, 0.025); x.ell('#7a7e82', 0.4, 0.34, 0.04, 0.025); x.line([[-0.34, 0.54], [-0.37, 0.28], [-0.3, 0.06], [0.3, 0.06], [0.37, 0.28], [0.34, 0.54]], {w: 0.9}); x.line([[-0.34, 0.54], [0.34, 0.54]], {w: 0.7}); }},
  tarp: {grip: [0, 0.4], h: 0.5, note: 'EP17 sh13: blue tarp thrown over a woodpile (a draped mound with folds, rope ties and a flap), ~1.4 m wide', draw: (x) => {
    const m: [number, number][] = [[-0.7, 0], [-0.62, 0.22], [-0.4, 0.4], [-0.1, 0.5], [0.22, 0.46], [0.5, 0.32], [0.68, 0.1], [0.72, 0], [0.5, -0.03], [0.1, -0.02], [-0.3, -0.03]];
    x.fill('#3a6ea8', m); x.wash('#7aa8d8', 130, [[-0.55, 0.2], [-0.35, 0.38], [-0.1, 0.46], [-0.2, 0.3], [-0.45, 0.14]]); x.wash('#1e3e6a', 130, [[0.2, 0.44], [0.5, 0.3], [0.68, 0.08], [0.5, 0.05], [0.28, 0.2]]);
    for (const [a, b] of [[-0.5, 0.02], [-0.25, 0.04], [0.1, 0.02], [0.36, 0.03]] as [number, number][]) x.line([[a, 0.4 - Math.abs(a) * 0.25], [a + 0.04, b]], {w: 0.5, col: '#1e3e6a'});
    x.fill('#2e5a90', [[0.5, 0.06], [0.74, 0.02], [0.8, -0.04], [0.55, -0.05]]); x.ell('#d8d0b4', -0.3, 0.3, 0.02, 0.02); x.ell('#d8d0b4', 0.35, 0.26, 0.02, 0.02); x.outline(m, 0.8); }},
  'banana-leaf': {grip: [0, 0.02], h: 0.2, note: 'EP17 sh13: a big banana leaf (1.2 m), midrib, side veins, split edge, laid over a pile', draw: (x) => {
    const leaf: [number, number][] = [[-0.6, 0.02], [-0.3, 0.1], [0.1, 0.12], [0.5, 0.08], [0.62, 0.03], [0.4, -0.01], [0, -0.02], [-0.35, -0.01]];
    x.fill('#4f8a3a', leaf); x.wash('#8ac05a', 130, [[-0.5, 0.03], [0, 0.1], [0.45, 0.07], [0.1, 0.04]]); x.wash('#2a5a24', 120, [[-0.3, 0.0], [0.4, 0.0], [0.5, 0.03], [-0.3, 0.03]]);
    x.line([[-0.6, 0.02], [0, 0.04], [0.62, 0.03]], {w: 0.9, col: '#2a5a24'}); for (let i = 0; i < 9; i++) { const a = -0.5 + i * 0.12; x.line([[a, 0.035], [a + 0.05, 0.11 - Math.abs(a) * 0.04]], {w: 0.3, col: '#2f6a2a'}); x.line([[a, 0.035], [a + 0.05, -0.012]], {w: 0.3, col: '#2f6a2a'}); }
    x.outline(leaf, 0.7); }},
  matches: {grip: [0, 0.01], h: 0.05, note: 'EP17 sh8: a matchbox (red label) and one match, at hand', draw: (x) => {
    x.fill('#d8b878', [[-0.035, 0], [0.035, 0], [0.035, 0.03], [-0.035, 0.03]]); x.fill('#b8342a', [[-0.03, 0.003], [0.03, 0.003], [0.03, 0.027], [-0.03, 0.027]]); x.ell('#f4d8a0', 0, 0.015, 0.012, 0.008);
    x.fill('#c8a868', stroke(0.03, 0.03, 0.09, 0.07, 0.005)); x.ell('#c43a2e', 0.09, 0.07, 0.008, 0.008); x.outline([[-0.035, 0], [0.035, 0], [0.035, 0.03], [-0.035, 0.03]], 0.5); }},
  'green-leaves': {grip: [0, 0.05], h: 0.3, note: 'EP17 sh18: a fistful of green leaves (wet, sappy), fanned', draw: (x) => {
    for (let i = 0; i < 6; i++) { const a = -0.9 + i * 0.36, c = Math.cos(a), s = Math.sin(a), lf: [number, number][] = [[0, 0.04], [0.045 * c - 0.1 * s, 0.045 * s + 0.1 * c], [-0.0 - 0.28 * s, 0.28 * c], [-0.045 * c - 0.1 * s, -0.045 * s + 0.1 * c]];
      x.fill(i % 2 ? '#5a9a3a' : '#4a8a30', lf); x.line([[0, 0.04], [-0.28 * s, 0.28 * c]], {w: 0.4, col: '#2f5a24'}); x.outline(lf, 0.5); }
    x.fill('#6a8a3a', stroke(0, 0, 0, 0.06, 0.03)); }},
  bottle: {grip: [0, 0.13], h: 0.3, note: 'EP18 sh11/18: 1-litre clear plastic bottle, cap, label band; `level` 0..1 water (default 0.85)', draw: (x) => {
    const body: [number, number][] = [[-0.04, 0.0], [0.04, 0.0], [0.045, 0.2], [0.03, 0.25], [0.014, 0.275], [-0.014, 0.275], [-0.03, 0.25], [-0.045, 0.2]];
    x.fill('#d9ecef', body); const lv = x.o.level ?? 0.85; x.fill('#9cc8da', [[-0.04, 0.0], [0.04, 0.0], [0.045, 0.2 * lv], [-0.045, 0.2 * lv]]);
    x.wash('#ffffff', 170, [[-0.036, 0.02], [-0.02, 0.02], [-0.022, 0.22], [-0.038, 0.19]]); x.fill('#3a8ac0', [[-0.044, 0.09], [0.044, 0.09], [0.045, 0.14], [-0.045, 0.14]]); x.fill('#2e6a9a', [[-0.014, 0.275], [0.014, 0.275], [0.014, 0.305], [-0.014, 0.305]]);
    x.outline(body, 0.7); x.line([[-0.04, 0.2 * lv], [0.04, 0.2 * lv]], {w: 0.4, col: '#4a8aa8'}); }},
  teaspoon: {grip: [-0.05, 0], h: 0.02, note: 'EP18 sh18: standard teaspoon, bowl pointing +x', draw: (x) => {
    x.fill('#c8ccd0', stroke(-0.075, 0, 0.02, 0.002, 0.008)); x.fill('#d8dce0', oval(0.045, 0, 0.032, 0.02)); x.wash('#ffffff', 170, oval(0.04, 0.006, 0.018, 0.007)); x.outline(oval(0.045, 0, 0.032, 0.02), 0.5); }},
  'pot-small': {grip: [0, 0.14], h: 0.2, note: 'EP18 sh18: the cooled boiled-water pot, aluminium, lid on, one side handle', draw: (x) => {
    const body: [number, number][] = [[-0.12, 0.16], [0.12, 0.16], [0.12, 0.0], [-0.12, 0.0]];
    x.fill('#b8bcc0', body); x.wash('#eef0f2', 130, [[-0.11, 0.15], [-0.06, 0.15], [-0.06, 0.01], [-0.11, 0.01]]); x.wash('#4a4e54', 120, [[0.08, 0.01], [0.12, 0.01], [0.12, 0.15], [0.08, 0.15]]);
    x.fill('#a0a4a8', [[-0.13, 0.16], [0.13, 0.16], [0.1, 0.19], [-0.1, 0.19]]); x.ell('#6a6e72', 0, 0.2, 0.018, 0.012); x.fill('#3a3430', [[0.12, 0.12], [0.22, 0.13], [0.22, 0.09], [0.12, 0.08]]);
    x.line([[-0.12, 0.16], [-0.12, 0], [0.12, 0], [0.12, 0.16]], {w: 0.8}); x.line([[-0.13, 0.16], [0.13, 0.16]], {w: 0.7}); }},
  cup: {grip: [0, 0.04], h: 0.1, note: 'EP18 sh19-20: enamel cup (white, blue rim), tilted toward `dir` when offered', draw: (x) => {
    const d = x.o.dir ?? 1, tip = 0.35 * d, rot = (px: number, py: number): [number, number] => [px * Math.cos(tip) - py * Math.sin(tip), px * Math.sin(tip) + py * Math.cos(tip)];
    const body = ([[-0.045, 0.085], [0.045, 0.085], [0.036, 0.0], [-0.036, 0.0]] as [number, number][]).map(([a, b]) => rot(a, b - 0.04));
    x.fill('#f2f2ee', body); x.fill('#3a6ea8', ([[-0.045, 0.085], [0.045, 0.085], [0.044, 0.075], [-0.044, 0.075]] as [number, number][]).map(([a, b]) => rot(a, b - 0.04)));
    x.wash('#6a9ab4', 150, ([[-0.04, 0.08], [0.04, 0.08], [0.04, 0.07], [-0.04, 0.07]] as [number, number][]).map(([a, b]) => rot(a, b - 0.04)));
    x.line([...body, body[0]], {w: 0.6}); x.line(([[0.044, 0.07], [0.075, 0.055], [0.07, 0.025], [0.04, 0.02]] as [number, number][]).map(([a, b]) => rot(a, b - 0.04)), {w: 0.9, col: '#8a8e92'}); }},
  cloth: {grip: [0, 0.03], h: 0.07, note: 'EP18 sh11: a damp cloth folded over the hand, a darker wet patch and drips', draw: (x) => {
    const c: [number, number][] = [[-0.12, 0.0], [0.12, 0.0], [0.13, 0.05], [0.05, 0.08], [-0.06, 0.075], [-0.13, 0.04]];
    x.fill('#e6dfcc', c); x.wash('#9a9484', 150, [[-0.1, 0.0], [0.1, 0.0], [0.11, 0.035], [-0.1, 0.03]]); x.line([[-0.1, 0.05], [0.1, 0.045]], {w: 0.4, col: '#a89e86'}); x.line([[-0.09, 0.02], [0.1, 0.018]], {w: 0.4, col: '#a89e86'});
    x.ell('#9cc8da', 0.07, -0.02, 0.005, 0.009); x.ell('#9cc8da', -0.04, -0.03, 0.004, 0.008); x.outline(c, 0.6); }},
  'basin-bowl': {grip: [0, 0.05], h: 0.1, note: 'EP18 sh11: enamel bowl of water (white, blue rim), 0.26 m wide, seen from slightly above', draw: (x) => {
    const bowl: [number, number][] = [[-0.13, 0.09], [0.13, 0.09], [0.09, 0.0], [-0.09, 0.0]];
    x.fill('#f2f2ee', bowl); x.wash('#c8ccc8', 110, [[0.06, 0.01], [0.09, 0.0], [0.13, 0.09], [0.1, 0.09]]); x.ell('#3a6ea8', 0, 0.09, 0.13, 0.03); x.ell('#8ec0d8', 0, 0.09, 0.115, 0.024); x.ell('#c8e4f0', -0.03, 0.095, 0.05, 0.008);
    x.line([[-0.13, 0.09], [-0.09, 0.0], [0.09, 0.0], [0.13, 0.09]], {w: 0.7}); }},
  'hand-fan': {grip: [0, 0], h: 0.4, note: 'EP18 sh20: round woven hand fan with a rattan handle, 0.26 m; `swing` -1..1 tilts it (the fanning)', draw: (x) => {
    const sw = (x.o.swing ?? 0) * 0.35, ca = Math.cos(sw), sa = Math.sin(sw), r = (a: number, b: number): [number, number] => [a * ca - b * sa, a * sa + b * ca];
    x.fill('#a8845a', ([[-0.012, 0], [0.012, 0], [0.01, 0.17], [-0.01, 0.17]] as [number, number][]).map(([a, b]) => r(a, b)));
    x.fill('#d8b868', oval(0, 0.3, 0.13, 0.13, 20).map(([a, b]) => r(a, b))); x.wash('#f0dc98', 130, oval(-0.03, 0.33, 0.07, 0.06).map(([a, b]) => r(a, b)));
    for (let i = 0; i < 5; i++) x.line([[0, 0.17], [Math.cos(0.5 + i * 0.5) * 0.13, 0.3 + Math.sin(0.5 + i * 0.5) * 0.13]].map(([a, b]) => r(a, b)) as [number, number][], {w: 0.3, col: '#a8884a'});
    x.line(oval(0, 0.3, 0.13, 0.13, 20).map(([a, b]) => r(a, b)), {w: 0.8, col: '#8a6a34', closed: true}); }},
  'pill-box': {grip: [0, 0.01], h: 0.04, note: 'EP18 sh9-10: a small medicine box (white with a green band and a cross) and a half-empty blister strip beside it, no text', draw: (x) => {
    x.fill('#f4f4ee', [[-0.05, 0], [0.04, 0], [0.04, 0.07], [-0.05, 0.07]]); x.fill('#3a9a5a', [[-0.05, 0.02], [0.04, 0.02], [0.04, 0.04], [-0.05, 0.04]]); x.fill('#3a9a5a', [[-0.012, 0.045], [-0.002, 0.045], [-0.002, 0.065], [-0.012, 0.065]]); x.fill('#3a9a5a', [[-0.02, 0.052], [0.006, 0.052], [0.006, 0.058], [-0.02, 0.058]]);
    x.outline([[-0.05, 0], [0.04, 0], [0.04, 0.07], [-0.05, 0.07]], 0.6);
    x.fill('#c8ccd0', [[0.06, 0], [0.15, 0], [0.15, 0.045], [0.06, 0.045]]); for (let i = 0; i < 4; i++) { x.ell(i < 2 ? '#e8ecee' : '#9aa0a4', 0.078 + i * 0.022, 0.022, 0.008, 0.01); }
    x.outline([[0.06, 0], [0.15, 0], [0.15, 0.045], [0.06, 0.045]], 0.5); }},
  'seed-cone': {grip: SEED_CONE.grip, h: 0.28, anchors: {mouth: SEED_CONE.mouth, stalk: [0, 0.075]}, note: 'EP16 sh6/9/10: cycad seed cone, nine glossy orange seeds in a rigid ovoid cluster 0.22 x 0.16 m on a short brown stalk; grip at the stalk, mouth anchor at the cluster centre', draw: (x) => {
    const C = SEED_CONE.cluster, st = SEED_CONE.stalk;
    x.fill('#6a4a2c', stroke(st.x, st.y0, st.x, st.y1 + 0.02, st.w));   // stalk (its top is inside the cluster)
    x.ell('#7a4a22', C.cx, C.cy, C.rx, C.ry);   // woody core in shade
    SEED_CONE.seeds.forEach(([sx, sy, r], i) => {
      x.ell(i % 2 ? '#d86a1e' : '#e07a2a', sx, sy, r * 1.05, r * 1.18);
      x.wash('#8a3a10', 90, oval(sx + r * 0.35, sy - r * 0.35, r * 0.6, r * 0.7, 10));   // shade side
      x.ell('#ffe6b0', sx - r * 0.35, sy + r * 0.42, r * 0.22, r * 0.13, -0.5);   // gloss highlight
    });
    x.line(oval(C.cx, C.cy, C.rx + 0.006, C.ry + 0.006, 20).concat([oval(C.cx, C.cy, C.rx + 0.006, C.ry + 0.006, 20)[0]]), {w: 0.6, col: '#5a3014', closed: true}); }},
} satisfies Record<string, PropSpec>;
export type PropId = keyof typeof PROPS;
export const PROP_IDS = Object.keys(PROPS) as PropId[];

/** A prop in a hand: its grip point lands on `hand` (a `FigAnchors.rHand` / `lHand`), `u` px per metre (the figure's `u`). Draw after the figure (a `held` callback). */
export const paintHeldProp = (p: Painter, id: PropId, hand: Pt, u: number, o: PropOpts = {}) => {
  const sp: PropSpec = PROPS[id];
  const ca = Math.cos(o.ang ?? 0), sa = Math.sin(o.ang ?? 0);
  // the card origin sits so that the rotated grip point is on the hand
  const gxr = (sp.grip[0] * ca - sp.grip[1] * sa) * (o.s ?? 1), gyr = sp.grip[0] * sa + sp.grip[1] * ca;
  sp.draw(ctxOf(p, {g: [hand[0] - gxr * u, hand[1] + gyr * u], u, s: 1}, o, (o.seed ?? 50000) + 1000 * PROP_IDS.indexOf(id)));
};
/** A prop standing (or lying) on the ground at world point `at`, sized by the lens; nothing when behind the lens. */
export const paintGroundProp = (p: Painter, id: PropId, c: YCam, at: V3, o: PropOpts = {}) => {
  const k = cardAt(c, at);
  if (k) PROPS[id].draw(ctxOf(p, k, o, (o.seed ?? 50000) + 1000 * PROP_IDS.indexOf(id)));
};
/** The same as a depth-sorted set item (kit `paintSorted` / the `extra` list of a set painter). */
export const groundPropItem = (id: PropId, at: V3, o: PropOpts = {}): Item => ({at, draw: (p, c) => paintGroundProp(p, id, c, at, o)});
/** Cup tipped toward a person on the screen side `dir` (EP18 sh19): shorthand for `paintHeldProp('cup', ..., {dir})`. */
export const paintCupOffered = (p: Painter, hand: Pt, u: number, dir: 1 | -1 = 1, seed?: number) => paintHeldProp(p, 'cup', hand, u, {dir, seed});

/** Steel pot (`pot-big`) on three stones over a wood fire (EP17 sh12: four temple-fair pots in a row). Pass a fire seed per pot. Order: ground fire, then the pot. */
export const paintPotOnFire = (p: Painter, c: YCam, at: V3, t: number, o: {seed?: number; scale?: number; L?: Light} = {}) => {
  const sd = o.seed ?? 51000, sc = o.scale ?? 1, k = cardAt(c, at, 1, sc);
  paintFire(p, c, at, t, {seed: sd, scale: 0.7 * sc});
  if (!k) return;
  const raise: Card = {...k, g: [k.g[0], k.g[1] - 0.18 * k.u]};
  for (const dx of [-0.26, 0, 0.26]) hardFill(p, sd + 900 + Math.round(dx * 10), '#4a423a', cps(k, [[dx - 0.07, 0], [dx + 0.07, 0], [dx + 0.05, 0.18], [dx - 0.05, 0.18]]));
  PROPS['pot-big'].draw(ctxOf(p, raise, {L: o.L}, sd + 950));
  // soot above the fire line and steam ribbons
  washAt(p, sd + 990, '#1e1a16', 120, cps(raise, [[-0.34, 0.06], [0.34, 0.06], [0.3, 0.2], [-0.3, 0.2]]), 0.2, 0.2);
  for (let i = 0; i < 3; i++) washAt(p, sd + 991 + i, '#f4f4ee', 40, cps(raise, [[-0.12 + i * 0.14, 0.64], [-0.06 + i * 0.14, 0.64], [-0.1 + i * 0.14 + 0.05 * Math.sin(t * 2 + i), 1.0 + i * 0.1], [-0.2 + i * 0.14, 0.95]]), 0.5, 0.2);
};

/** Picture point of the prop's named anchor (`grip` or one of `PropSpec.anchors`, e.g. `seed-cone` `mouth`) when drawn by `paintHeldProp(p, id, hand, u, o)`: the same placement maths, so a jaw or a second hand can follow the prop. */
export const propAnchor = (id: PropId, name: string, hand: Pt, u: number, o: PropOpts = {}): Pt => {
  const sp: PropSpec = PROPS[id], a: Pt | undefined = name === 'grip' ? sp.grip : sp.anchors?.[name];
  if (!a) throw new Error(`prop ${id} has no anchor ${name}`);
  const ca = Math.cos(o.ang ?? 0), sa = Math.sin(o.ang ?? 0), sx = o.s ?? 1;
  const rot = (q: Pt): Pt => [(q[0] * ca - q[1] * sa) * sx, q[0] * sa + q[1] * ca], g = rot(sp.grip), r = rot(a);
  return [hand[0] + (r[0] - g[0]) * u, hand[1] - (r[1] - g[1]) * u];
};
