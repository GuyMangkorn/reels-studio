import type {CastDef, FigAnchors} from '../kit/cast';
import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';

// EDU-EP26-SHORT BRIEF-R4 cast and story props (Film W3 look-defining assets, 2026-11-18; docs/film-visual-brief-workflow.md#look-assets).
// Designed from SCRIPT-R2 first (brief VD26-19 / VD26-20), then matched to kit heads. Boss hardens them after the user approves the looks;
// kit intake files them at W8.4. Casting lines (brief):
// - MARCUS   `man-spiky + new: marcus-tunic` 1.62 m, about 17: sky-blue knee tunic, rope belt, sandals (barefoot from B03), messy black hair.
// - SENIOR   `man-buzz + new: fuller-apron` 1.70 m, about 45: balding with a grey beard, sand tunic with wet stains, leather apron, bare feet.
// - VESPASIAN `man-elder + new: toga-praetexta-read` 1.66 m: no moustache, grey fringe, broad creased face, white toga with a purple band, laurel.
// - TITUS    `man-crop + new: tunic-clavi` 1.74 m, early 30s: short dark hair, white tunic with two narrow purple stripes.
// - PASSERBY `woman-long + new: stola-dusk` 1.60 m: dusty rose stola, ochre shawl, bread basket on the hip (street ending only).
// - GRAPER   `woman-curly + new: grape-treader` 1.62 m (VD26-12 wine inset only, R5): red knee tunic, hair tied back, barefoot, all smiles.

export const R4 = {
  ink: '#3a2a22',
  skinMarcus: '#d2a07a', skinSenior: '#b98360', skinVesp: '#d9a882', skinTitus: '#d6a47c', skinPasser: '#c99272',
  tunicMarcus: '#4f86c0', tunicMarcusShade: '#3c6b9c',
  rope: '#c9a76a', sandal: '#7a5134',
  tunicSenior: '#b9a17a', apron: '#7b5337',
  toga: '#efe9db', togaBand: '#6e2f63', laurel: '#5f7a3a', laurelLit: '#93a95a',
  tunicTitus: '#ece5d6', clavi: '#6e2f63',
  stola: '#b9666e', shawl: '#d39a4e', basket: '#b88a4f',
  jar: '#b25f3a', jarLit: '#e2a070', jarShade: '#6f3428', lid: '#9a5434',
  coin: '#c98f3c', coinLit: '#f4d38a', coinShade: '#7d5420',
  smell: '#cfc67e', smellEdge: '#a9a25a',
  skinCustomer: '#a8704e', stolaCustomer: '#b02a2a', stolaCustomerShade: '#7e1b22', underCustomer: '#efe2c6', shirt: '#f3eee0', shirtShade: '#c9c3b6',
  skinGraper: '#c98e68', tunicGraper: '#c2483a', grape: '#5b2b5e', grapeLit: '#8c4f8a', grapeDark: '#3a1a3e', vat: '#8b5a37', vatLit: '#b47e50',
};

export const MARCUS: CastDef = {
  ...PEOPLE['man-spiky'], height: 1.62, headScale: 0.97, seed: 2601,
  head: {...PEOPLE['man-spiky'].head, skin: R4.skinMarcus, hair: '#1c1613', sideDetail: true,
    look: {lash: false, eye: 'almond', iris: '#2e2019', nose: 'ell', mouth: 'line', brow: 'thick', browDrop: 0.05}},
  outfit: {shoulder: 0.37, shirt: R4.tunicMarcus, sleeve: R4.tunicMarcus, longSleeves: false, skirt: R4.tunicMarcus, skirtHem: 0.46,
    pants: R4.skinMarcus, shoes: R4.sandal, gear: {belt: {color: R4.rope, h: 0.03}}},
};
/** Marcus barefoot (B03 on): the shoes take the skin colour. */
export const MARCUS_BARE: CastDef = {...MARCUS, outfit: {...MARCUS.outfit, shoes: mixColor(R4.skinMarcus, '#8a5a40', 0.12)}};

export const SENIOR: CastDef = {
  ...PEOPLE['man-buzz'], height: 1.70, seed: 2602,
  head: {...PEOPLE['man-buzz'].head, skin: R4.skinSenior, hair: '#6b625a', cut: 'balding', facial: 'beard', lines: true, brows: '#5a524c'},
  outfit: {shoulder: 0.46, shirt: R4.tunicSenior, sleeve: R4.tunicSenior, longSleeves: false, skirt: R4.tunicSenior, skirtHem: 0.44,
    apron: R4.apron, pants: R4.skinSenior, shoes: mixColor(R4.skinSenior, '#6a4430', 0.15)},
};

const ELDER_HEAD = {...PEOPLE['man-elder'].head};
delete (ELDER_HEAD as {facial?: unknown}).facial;
export const VESPASIAN: CastDef = {
  ...PEOPLE['man-elder'], height: 1.66, seed: 2603,
  head: {...ELDER_HEAD, skin: R4.skinVesp, hair: '#b8b2a8', cut: 'balding', lines: true},
  outfit: {shoulder: 0.44, shirt: R4.toga, sleeve: R4.toga, longSleeves: true, skirt: R4.toga, skirtHem: 0.07, pants: R4.skinVesp,
    shoes: '#6b4a32', gear: {drape: R4.togaBand}},
};
export const TITUS: CastDef = {
  ...PEOPLE['man-crop'], height: 1.74, seed: 2604,
  head: {...PEOPLE['man-crop'].head, skin: R4.skinTitus, hair: '#231a15', sideDetail: true},
  outfit: {shoulder: 0.41, shirt: R4.tunicTitus, sleeve: R4.tunicTitus, longSleeves: false, skirt: R4.tunicTitus, skirtHem: 0.40,
    pants: R4.skinTitus, shoes: '#6b4a32', gear: {belt: {color: '#b8ab92', h: 0.025}}},
};
export const PASSERBY: CastDef = {
  ...PEOPLE['woman-long'], height: 1.60, seed: 2605,
  head: {...PEOPLE['woman-long'].head, skin: R4.skinPasser, hair: '#2a1d16'},
  outfit: {shoulder: 0.35, shirt: R4.stola, sleeve: R4.shawl, longSleeves: true, skirt: R4.stola, skirtHem: 0.06, pants: R4.skinPasser,
    shoes: '#5a3e2c', gear: {drape: R4.shawl}},
};

/** CUSTOMER `woman-curly + new: stola-madder` 1.62 m (B04 only; VD26-19, designed by Film, painted by Boss W5.2): madder-red stola to the
 *  ankle over a cream under-sleeve, curls pinned up (the kit curly cut, dark), deep brown skin; the one saturated red in B04. */
export const CUSTOMER: CastDef = {
  ...PEOPLE['woman-curly'], height: 1.62, seed: 2607,
  head: {...PEOPLE['woman-curly'].head, skin: R4.skinCustomer, hair: '#20140f'},
  outfit: {shoulder: 0.36, shirt: R4.stolaCustomer, sleeve: R4.underCustomer, longSleeves: false, skirt: R4.stolaCustomer, skirtHem: 0.05, pants: R4.skinCustomer,
    shoes: '#5a3a28', gear: {drape: R4.stolaCustomerShade}},
};

export const GRAPER: CastDef = {
  ...PEOPLE['woman-curly'], height: 1.62, seed: 2606,
  head: {...PEOPLE['woman-curly'].head, skin: R4.skinGraper, hair: '#2b1a12'},
  outfit: {shoulder: 0.36, shirt: R4.tunicGraper, sleeve: R4.tunicGraper, longSleeves: false, skirt: R4.tunicGraper, skirtHem: 0.42, pants: R4.skinGraper,
    shoes: R4.skinGraper, gear: {belt: {color: '#e0c27a', h: 0.025}}},
};

// ------------------------------------------------------------------------------------------------------------------ props

const headK = (a: FigAnchors) => (a.chin - a.headTop) / 2.39;

/** Laurel wreath around the head (front or profile): two rows of small leaves along the brow band. */
export const paintLaurel = (p: Painter, a: FigAnchors, view: 'front' | 'left' | 'right' | 'back', seed: number) => {
  const K = headK(a), [hx, hy] = a.head, dir = view === 'left' ? -1 : view === 'right' ? 1 : 0;
  const cy = hy - 0.62 * K, rx = (dir ? 0.98 : 1.1) * K, ry = 0.3 * K, cx = hx - dir * 0.12 * K;
  for (let i = 0; i < 14; i++) {
    const u = i / 13, ang = Math.PI * (1.05 + 0.9 * u);
    const x = cx + rx * Math.cos(ang), y = cy + ry * Math.sin(ang) * -1 + 0.05 * K;
    const tilt = (u - 0.5) * 1.6;
    hardFill(p, seed + i, i % 3 ? R4.laurel : R4.laurelLit, ell(x, y, 0.2 * K, 0.08 * K, 8, tilt));
  }
  inkLine(p, seed + 20, Array.from({length: 9}, (_, i): Pt => {
    const ang = Math.PI * (1.05 + 0.9 * (i / 8));
    return [cx + rx * Math.cos(ang), cy - ry * Math.sin(ang) + 0.05 * K];
  }), {closed: false, color: '#3f5226', weight: 1.1, still: true});
};

/** Two narrow purple stripes (clavi) over the shoulders of a tunic, front view, or one stripe in profile. */
export const paintClavi = (p: Painter, a: FigAnchors, view: 'front' | 'left' | 'right', u: number, seed: number) => {
  const w = 0.022 * u, top = (a.rShoulder[1] + a.lShoulder[1]) / 2 + 0.02 * u, bottom = top + 0.62 * u;
  const xs = view === 'front' ? [a.rShoulder[0] + 0.07 * u, a.lShoulder[0] - 0.07 * u] : [(a.rShoulder[0] + a.lShoulder[0]) / 2 + (view === 'right' ? 0.04 : -0.04) * u];
  xs.forEach((x, i) => hardFill(p, seed + i, R4.clavi, [[x - w, top], [x + w, top], [x + w * 1.1, bottom], [x - w * 1.1, bottom]]));
};

/** A round bronze coin at a picture point, `r` px; `edge` 0..1 squashes it toward edge-on. */
export const paintCoin = (p: Painter, [x, y]: Pt, r: number, seed: number, edge = 0.35) => {
  const ry = r * (1 - 0.7 * edge);
  hardFill(p, seed, R4.coinShade, ell(x + r * 0.08, y + ry * 0.12, r, ry, 20));
  hardFill(p, seed + 1, R4.coin, ell(x, y, r, ry, 20));
  hardFill(p, seed + 2, R4.coinLit, ell(x - r * 0.25, y - ry * 0.28, r * 0.5, ry * 0.34, 14, -0.3));
  inkLine(p, seed + 3, ell(x, y, r * 0.72, ry * 0.72, 16), {color: R4.coinShade, weight: 0.9, still: true});
  inkLine(p, seed + 4, ell(x, y, r, ry, 20), {color: '#5a3a18', weight: 1.1, still: true});
};

/** The urine jar `new: lidded-fuller-jar`: squat round belly, two small lug handles, a dark drip stain, wooden-and-clay lid. */
export const paintJar = (p: Painter, c: YCam, at: V3, seed: number, o: {h?: number; w?: number; lid?: 'on' | 'lifted' | 'off'; lit?: number} = {}) => {
  const h = o.h ?? 0.34, w = o.w ?? 0.30, lit = o.lit ?? 1;
  const g = camPoint(c, at), top = camPoint(c, [at[0], at[1] + h, at[2]]);
  if (!g || !top) return null;
  const u = camUnit(c, at), r = (w / 2) * u, H = g[1] - top[1];
  const [x, y] = g, tx = top[0], ty = top[1];
  washAt(p, seed, '#3c2a2a', 120, ell(x + r * 0.2, y + 2, r * 1.35, r * 0.28, 18), 0.18, 0.3);
  const body: Pt[] = [[tx - r * 0.42, ty + H * 0.04], [tx - r * 0.5, ty + H * 0.16], [x - r * 0.92, y - H * 0.6], [x - r, y - H * 0.38],
    [x - r * 0.86, y - H * 0.13], [x - r * 0.55, y - H * 0.01], [x, y + H * 0.02], [x + r * 0.55, y - H * 0.01], [x + r * 0.86, y - H * 0.13],
    [x + r, y - H * 0.38], [x + r * 0.92, y - H * 0.6], [tx + r * 0.5, ty + H * 0.16], [tx + r * 0.42, ty + H * 0.04]];
  hardFill(p, seed + 1, R4.jar, body);
  washAt(p, seed + 2, R4.jarLit, Math.round(150 * lit), [[tx - r * 0.38, ty + H * 0.12], [x - r * 0.82, y - H * 0.58], [x - r * 0.86, y - H * 0.26],
    [x - r * 0.45, y - H * 0.06], [x - r * 0.2, y - H * 0.3], [x - r * 0.25, y - H * 0.62]], 0.2, 0.35);
  washAt(p, seed + 3, R4.jarShade, 150, [[tx + r * 0.36, ty + H * 0.14], [x + r * 0.86, y - H * 0.6], [x + r * 0.94, y - H * 0.3],
    [x + r * 0.6, y - H * 0.04], [x + r * 0.22, y - H * 0.06], [x + r * 0.3, y - H * 0.5]], 0.12, 0.35);
  // drip stain from the rim (darker, slightly olive): the only hint of what is inside
  washAt(p, seed + 4, '#6a4a2a', 120, [[tx + r * 0.05, ty + H * 0.12], [tx + r * 0.22, ty + H * 0.12], [x + r * 0.2, y - H * 0.42],
    [x + r * 0.08, y - H * 0.3], [x - r * 0.02, y - H * 0.45]], 0.15, 0.4);
  for (const s of [-1, 1]) hardFill(p, seed + 5 + (s > 0 ? 1 : 0), R4.jarShade, ell(x + s * r * 0.86, y - H * 0.72, r * 0.16, r * 0.09, 10));
  hardFill(p, seed + 7, mixColor(R4.jar, '#ffffff', 0.12), ell(tx, ty + H * 0.06, r * 0.5, r * 0.13, 18));
  hardFill(p, seed + 8, '#3a2220', ell(tx, ty + H * 0.06, r * 0.38, r * 0.085, 18));
  inkLine(p, seed + 9, body, {color: '#5e2e22', weight: 1.4, still: true});
  inkLine(p, seed + 10, [[x - r * 0.9, y - H * 0.5], [x - r * 0.3, y - H * 0.44], [x + r * 0.3, y - H * 0.44], [x + r * 0.9, y - H * 0.5]],
    {closed: false, color: '#7a3a2a', weight: 1, still: true});
  if (o.lid !== 'off') {
    const lift = o.lid === 'lifted' ? H * 0.42 : 0, ly = ty + H * 0.04 - lift, lx = tx + (o.lid === 'lifted' ? r * 0.25 : 0);
    hardFill(p, seed + 11, R4.lid, ell(lx, ly, r * 0.56, r * 0.15, 18, o.lid === 'lifted' ? -0.2 : 0));
    hardFill(p, seed + 12, mixColor(R4.lid, '#ffe0b0', 0.3), ell(lx - r * 0.1, ly - r * 0.04, r * 0.3, r * 0.06, 12));
    hardFill(p, seed + 13, '#5a2e22', ell(lx, ly - r * 0.12, r * 0.1, r * 0.08, 10));
    inkLine(p, seed + 14, ell(lx, ly, r * 0.56, r * 0.15, 18, o.lid === 'lifted' ? -0.2 : 0), {color: '#5e2e22', weight: 1.1, still: true});
  }
  return {mouth: [tx, ty + H * 0.05] as Pt, r, H};
};

/**
 * Smell cue CL04 (brief VD26-11, kept): three pale olive-yellow wavy ribbons along a picture path from `from` to `to`, each a tapered
 * band with a sine wave; `op` 0..255 (default 150 = about 60 %), `w` the band width in px at the source. `color` / `edge` (R5): a darker
 * under-pass in the same path lifts the ribbons off warm sets (LF04).
 */
export type RibbonOpts = {w?: number; op?: number; spread?: number; waves?: number; bow?: number; count?: number; color?: string; edge?: number;
  /** Animated layer (Boss W5.2, 2026-11-18): seconds; the wave travels up the ribbon (phase + 2.4 t rad) and the spread breathes. 0 = the still. */
  t?: number;
  /** Rise 0..1: the drawn share of each ribbon from `from` (0 = none yet, 1 = reaches `to`). */
  grow?: number;
  /** Strength 0..1 of the CL04 ledger (scales opacity and width; 1 = the B02-SH02 plant). */
  strength?: number};
/** CL04 smell ribbons: `count` wavy olive-yellow bands from `from` to `to` (picture px). Direct-seekable: every frame is a pure function of `t`. */
export const paintRibbons = (p: Painter, seed: number, from: Pt, to: Pt, o: RibbonOpts = {}) => {
  const k0 = o.strength ?? 1, grow = Math.max(0, Math.min(1, o.grow ?? 1)), t = o.t ?? 0;
  if (grow <= 0.02 || k0 <= 0) return;
  const w = (o.w ?? 14) * (0.6 + 0.4 * k0), op = Math.round((o.op ?? 150) * k0), spread = (o.spread ?? 26) * (1 + 0.08 * (Math.sin(t * 1.3 + seed) - Math.sin(seed))), waves = o.waves ?? 2.2, bow = o.bow ?? -0.18, n = o.count ?? 3;
  const dx = to[0] - from[0], dy = to[1] - from[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  for (let k = 0; k < n; k++) {
    const off = (k - (n - 1) / 2) * spread, phase = hash(seed + k) * 6.28 - 2.4 * t, amp = 0.05 * L * (0.8 + 0.4 * hash(seed + 10 + k));
    const pts: Pt[] = [], back: Pt[] = [], spine: Pt[] = [];
    const steps = 26, len = (1 - 0.12 * Math.abs(k - (n - 1) / 2)) * grow;
    for (let i = 0; i <= steps; i++) {
      const s = (i / steps) * len, b = Math.sin(Math.PI * s) * bow * L, wave = Math.sin(s * Math.PI * 2 * waves + phase) * amp * (0.4 + 0.6 * s);
      const off2 = off * (1 - 0.75 * s), cx = from[0] + dx * s + nx * (b + wave + off2), cy = from[1] + dy * s + ny * (b + wave + off2);
      const ww = w * (1 - 0.7 * s) * (0.75 + 0.25 * Math.sin(s * 9 + phase));
      spine.push([cx, cy]); pts.push([cx + nx * ww / 2, cy + ny * ww / 2]); back.unshift([cx - nx * ww / 2, cy - ny * ww / 2]);
    }
    washAt(p, seed + 20 + k, o.color ?? R4.smell, op, [...pts, ...back], 0.1, 0.25);
    inkLine(p, seed + 30 + k, spine.slice(2, -2), {closed: false, color: R4.smellEdge, weight: (o.edge ?? 1.1) * (0.5 + 0.5 * k0), still: true});
  }
};

/** A twisted wet cloth held between two hand points (the senior wringing, F005: hands also work the cloth). */
export const paintWrungCloth = (p: Painter, a: Pt, b: Pt, w: number, seed: number, color = '#d9d2bf') => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const top: Pt[] = [], bot: Pt[] = [];
  for (let i = 0; i <= 12; i++) {
    const s = i / 12, sag = Math.sin(Math.PI * s) * 0.18 * L, x = a[0] + dx * s + nx * -sag * 0.2, y = a[1] + dy * s + sag * 0.35, ww = w * (0.7 + 0.3 * Math.cos(s * 12));
    top.push([x + nx * ww / 2, y + ny * ww / 2]); bot.unshift([x - nx * ww / 2, y - ny * ww / 2]);
  }
  hardFill(p, seed, color, [...top, ...bot]);
  for (let i = 1; i < 6; i++) {
    const s = i / 6, sag = Math.sin(Math.PI * s) * 0.18 * L, x = a[0] + dx * s, y = a[1] + dy * s + sag * 0.35;
    inkLine(p, seed + i, [[x - nx * w * 0.5 - dx / L * w * 0.4, y - ny * w * 0.5], [x + nx * w * 0.5 + dx / L * w * 0.4, y + ny * w * 0.5]], {closed: false, color: '#8f8a78', weight: 1, still: true});
  }
  // drips
  for (let i = 0; i < 3; i++) {
    const s = 0.3 + 0.2 * i, x = a[0] + dx * s, y = a[1] + dy * s + Math.sin(Math.PI * s) * 0.18 * L * 0.35 + w * 0.6;
    hardFill(p, seed + 10 + i, '#a9c3c2', ell(x, y + 10 + i * 6, 2.5, 4, 8));
  }
  inkLine(p, seed + 9, [...top, ...bot], {color: '#7e7866', weight: 1, still: true});
};

/** The customer's ivory tunic-shirt (B01-SH06 fold family) hanging flat from two world points `a` (its right shoulder end) and `b`, `drop`
 *  metres long: on the drying pole (fullonica `shirtOnPole`) or held up by two hands (B04-SH01 / SH03). `lit` 0..1 is the gold the door
 *  beam lays on it (`warm`), so it reads white against the warm wall; shadow side cool grey. Boss W5.2, 2026-11-18. */
export const paintShirt = (p: Painter, c: YCam, a: V3, b: V3, drop: number, seed: number, o: {lit?: number; warm?: boolean; sway?: number} = {}) => {
  const P = (u: number, v: number): V3 => [a[0] + (b[0] - a[0]) * u + (o.sway ?? 0) * v * v, a[1] + (b[1] - a[1]) * u - v, a[2] + (b[2] - a[2]) * u];
  const shape: [number, number][] = [[0, 0], [0.4, 0], [0.5, 0.05], [0.6, 0], [1, 0], [1, 0.2], [0.84, 0.25], [0.86, drop], [0.5, drop + 0.02], [0.14, drop], [0.16, 0.25], [0, 0.2]];
  const pts = shape.map(([u, v]) => camPoint(c, P(u, v)));
  if (pts.some((q) => !q)) return;
  const lit = o.lit ?? 0.3, base = o.warm ? mixColor(R4.shirt, '#ffe2a4', 0.25 * lit) : R4.shirt;
  hardFill(p, seed, base, pts as Pt[]);
  const shade = [[0.62, 0.06], [0.84, 0.25], [0.86, drop], [0.6, drop + 0.01]].map(([u, v]) => camPoint(c, P(u, v))) as Pt[];
  washAt(p, seed + 1, R4.shirtShade, 130, shade, 0.2, 0.4);
  if (lit > 0.4) washAt(p, seed + 2, '#fff6dc', Math.round(150 * lit), [[0.16, 0.3], [0.42, 0.3], [0.4, drop], [0.15, drop]].map(([u, v]) => camPoint(c, P(u, v))) as Pt[], 0.2, 0.4);
  for (let i = 0; i < 3; i++) {
    const u = 0.3 + 0.18 * i, line = [P(u, 0.3), P(u + 0.03, drop * 0.6), P(u - 0.01, drop - 0.02)].map((v) => camPoint(c, v)) as Pt[];
    inkLine(p, seed + 4 + i, line, {closed: false, color: '#b8b1a2', weight: 1.1, still: true});
  }
  inkLine(p, seed + 9, pts as Pt[], {closed: true, color: '#8f887a', weight: 1.3, still: true});
};
