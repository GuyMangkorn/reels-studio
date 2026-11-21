import {ANIMALS, drawAnimal, type AnimalAnchors, type AnimalDef, type AnimalPose} from '../kit/animals';
import type {CastDef, FigAnchors} from '../kit/cast';
import {capsule, ell, hardFill, inkLine, washAt} from '../kit/draw';
import {paintFigureAt} from '../kit/figure-at';
import {mixColor, tintPainter, type Painter, type Pt} from '../kit/painter';
import {paperCard, type PaperCardOut} from '../kit/paper-card';
import {PEOPLE} from '../kit/people';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';

// EDU-EP32-SHORT cast (EDU-EP32-BRIEF-R1 VD32-04, VD32-05, VD32-08; Boss W3 gate still, 2026-11-21). Every figure and animal is a painted paper
// cut-out card (kit `paperCard`). Casting lines:
//   CAT `cat-gray-tabby {fluffy: true} + new: antenna-thread + new: ear-mic` (Q5 grey long-haired tabby; diorama x1.6 in the pop-ups, hero x4 on pages)
//   FOREIGN AGENT `man-crop + new: trench-1960s` (tan belted trench)
//   HANDLER `man-buzz + new: trench-1960s (grey) + new: fur-hat`
// Kit heads unchanged (generic faces, no badge, no name). The fur hat, the trench belt and the cat dressing are `new:` looks painted from the
// anchors after the kit drawing; they go to kit intake (KIT-P01) only after the episode is delivered.

export const POSTER = {red: '#c8342b', cream: '#efe4cc', navy: '#1f2a3a', kraft: '#b8946a', walnut: '#5a3a26', cyan: '#2f6f9e', green: '#7f9a5a', lamp: '#ffd890'} as const;
export const TRENCH = {tan: '#b8925c', grey: '#7c7f82', belt: (c: string) => mixColor(c, '#1e1a14', 0.32)} as const;

const man = (id: keyof typeof PEOPLE) => PEOPLE[id];
const trench = (base: CastDef, coat: string, pants: string): CastDef => ({...base, outfit: {...base.outfit, shirt: coat, sleeve: coat, longSleeves: true, coat, jacket: undefined, apron: undefined, pants, shoes: '#2a2420', boots: false}});
export const FOREIGN_AGENT: CastDef = trench(man('man-crop'), TRENCH.tan, '#3a3a40');
export const HANDLER: CastDef = trench(man('man-buzz'), TRENCH.grey, '#33302e');

/** Diorama (x1.6) and hero (x4) scales of the cat (VD32-04, a recorded stylisation exception to the scale baseline). */
export const CAT_SCALE = {diorama: 1.6, hero: 4, deskReal: 16} as const;
// Cat polish (user, 2026-11-21: "smooth, fewer angular edges, polish the cat much more, it is the main character"): kit `soft` cat drawing; same height.
export const catDef = (scale: number): AnimalDef => ({...ANIMALS['cat-gray-tabby'], fluffy: true, soft: true, height: ANIMALS['cat-gray-tabby'].height * scale});
const COPPER = '#d9813a', COPPER_LIT = '#ffd9a0';
/** The antenna thread as one continuous fine copper line (fix list: a line, not dashes), with a lit edge along its first half. */
const thread = (p: Painter, seed: number, path: Pt[], w = 1.6) => {
  inkLine(p, seed, path, {color: COPPER, weight: w, closed: false, still: true, curve: 0.35});
  inkLine(p, seed + 1, path.slice(0, Math.ceil(path.length * 0.55)), {color: COPPER_LIT, weight: w * 0.45, closed: false, still: true, curve: 0.35});
};
/** `new: ear-mic` (R2, user LF04 2026-11-21: the old dark disc with a glint read as an open eye on the sleeping cat): a small steel capsule from `a`
 *  (top) to `b` (bottom) sitting in the ear hollow, width `w` px. Mid steel body, a darker underside, one thin lit line along its length (no round
 *  catchlight, no dark centre) and a copper collar at `b` where the antenna thread leaves it, so it reads as a device, never as a pupil. */
const earMic = (p: Painter, seed: number, a: Pt, b: Pt, w: number) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, s = nx < 0 ? -1 : 1;
  const off = (q: Pt, k: number): Pt => [q[0] + s * nx * k * w, q[1] + s * ny * k * w], along = (k: number): Pt => [a[0] + dx * k, a[1] + dy * k];
  hardFill(p, seed, '#454c55', capsule(a, b, w, w, 5));
  hardFill(p, seed + 1, '#a3acb5', capsule(off(a, -0.12), off(along(0.86), -0.12), w * 0.66, w * 0.66, 5));
  inkLine(p, seed + 2, [off(along(0.15), -0.22), off(along(0.7), -0.22)], {color: '#dde3e8', weight: Math.max(0.6, w * 0.16), closed: false, still: true, curve: 0});
  hardFill(p, seed + 3, COPPER, capsule(along(0.84), b, w * 1.04, w * 1.04, 4));
};

/** `new: fur-hat` (front view): a fur ushanka over the kit head, the side flaps tied up over the crown. Sized from the head anchors. */
export const paintFurHat = (p: Painter, a: FigAnchors, seed: number) => {
  const [hx] = a.head, hh = a.chin - a.headTop, top = a.headTop, w = 0.56 * hh;
  const fur = '#8a7258', furLit = '#c4ac8a', crown = '#5e4c3c';
  // crown dome
  hardFill(p, seed, crown, ell(hx, top + 0.1 * hh, w * 0.92, 0.26 * hh, 22).filter((q) => q[1] <= top + 0.2 * hh));
  // tied-up side flaps sitting on the crown
  for (const sd of [-1, 1]) hardFill(p, seed + 1 + (sd > 0 ? 1 : 0), fur, ell(hx + sd * w * 0.62, top + 0.02 * hh, w * 0.36, 0.13 * hh, 14, sd * -0.35));
  // front fur band turned up over the brow
  const band: Pt[] = Array.from({length: 26}, (_, i): Pt => {
    const u = i / 25, x = hx - w + 2 * w * u, bump = 0.025 * hh * Math.sin(u * Math.PI * 9 + seed);
    return [x, top + 0.2 * hh - 0.06 * hh * Math.sin(u * Math.PI) + bump];
  });
  const bandPts: Pt[] = [...band, ...band.slice().reverse().map(([x, y]): Pt => [x, y - 0.17 * hh - 0.02 * hh * Math.cos(x)])];
  hardFill(p, seed + 4, fur, bandPts);
  inkLine(p, seed + 5, band.map(([x, y]): Pt => [x, y - 0.15 * hh]), {color: furLit, weight: 0.9, closed: false, still: true, curve: 0.3});
  inkLine(p, seed + 6, bandPts, {color: mixColor(fur, '#120c08', 0.5), weight: 0.7, still: true, curve: 0.2});
};

/** `new: trench-1960s` belt (front, seated or standing): a band across the waist with a buckle, from the shoulder anchors. */
export const paintTrenchBelt = (p: Painter, a: FigAnchors, coat: string, seed: number, waistDrop: number) => {
  const l = a.rShoulder, r = a.lShoulder, w = Math.abs(r[0] - l[0]), y = (l[1] + r[1]) / 2 + waistDrop, x0 = Math.min(l[0], r[0]) - 0.06 * w, x1 = Math.max(l[0], r[0]) + 0.06 * w;
  const bh = 0.07 * w, belt = TRENCH.belt(coat);
  hardFill(p, seed, belt, [[x0, y - bh / 2], [x1, y - bh / 2], [x1, y + bh / 2], [x0, y + bh / 2]]);
  const bx = (x0 + x1) / 2 + 0.08 * w;
  inkLine(p, seed + 1, [[bx - 0.06 * w, y - bh * 0.75], [bx + 0.06 * w, y - bh * 0.75], [bx + 0.06 * w, y + bh * 0.75], [bx - 0.06 * w, y + bh * 0.75]], {color: '#2a2018', weight: 0.8, still: true, curve: 0});
  // lapels: two dark V lines from the shoulders toward the chest
  const cx = (l[0] + r[0]) / 2, cy = (l[1] + r[1]) / 2;
  for (const s of [l, r]) inkLine(p, seed + 3 + (s === l ? 0 : 1), [[s[0] + (cx - s[0]) * 0.45, s[1] - 0.02 * w], [cx, cy + 0.42 * w]], {color: mixColor(coat, '#1a1410', 0.55), weight: 0.8, closed: false, still: true, curve: 0});
};

export type SeatedManOpts = {at: V3; t: number; seed: number; look?: Pt; talk?: boolean; hat?: boolean; coat: string; light: V3};
export type CardLead = {top: number; bottom: number; head: Pt; card: PaperCardOut | null};

/** A seated man card (front view, kit P31 hands in the lap) standing on the plane under `at`, his hips at the kit's seat height. */
export const paintSeatedManCard = (p: Painter, c: YCam, def: CastDef, o: SeatedManOpts): CardLead | null => {
  let a: FigAnchors | null = null;
  const draw = (q0: Painter) => {
    const q = tintPainter(q0, '#30384a', 0.1, {brush: true});
    a = paintFigureAt(q, c, def, {at: o.at, view: 'front', pose: 'P31', face: 'neutral', t: o.t, seed: o.seed, shadow: false,
      faceState: {look: o.look ?? [0, 0]}, activity: o.talk ? 'talk' : undefined,
      held: (qq, an) => { paintTrenchBelt(qq, an, o.coat, o.seed + 700, 0.62 * Math.abs(an.lShoulder[0] - an.rShoulder[0])); if (o.hat) paintFurHat(qq, an, o.seed + 900); }});
  };
  const card = paperCard(p, c, {foot: o.at, light: o.light, seed: o.seed + 50}, draw);
  const A = a as FigAnchors | null;
  if (!A) return null;
  // the hat crown rises above the kit head top
  const hatTop = o.hat ? A.headTop - 0.08 * (A.chin - A.headTop) : A.top;
  return {top: Math.min(A.top, hatTop), bottom: A.bottom, head: A.head, card};
};

/** `new: ear-mic` and `new: antenna-thread` on the front-view sitting cat, from its anchors: a small steel capsule in the screen-left ear and a fine
 *  copper thread showing along the top of the shoulder fur on the same side, half hidden (VD32-05: no collar, no box, no tail wire). */
export const paintCatDressingFront = (p: Painter, an: AnimalAnchors, seed: number) => {
  if (!an.top || !an.mouth) return;
  const hsS = (an.mouth[1] - an.top[1]) / 0.28, [tx, ty] = an.top;
  earMic(p, seed, [tx - 0.1 * hsS, ty - 0.035 * hsS], [tx - 0.135 * hsS, ty + 0.04 * hsS], 0.027 * hsS);
  // thread: one continuous line from the mic out behind the screen-left cheek, down the edge of the neck ruff and over the shoulder into the fur
  const P = (x: number, y: number): Pt => [tx + x * hsS, ty + y * hsS];
  thread(p, seed + 2, [P(-0.15, 0.06), P(-0.2, 0.16), P(-0.2, 0.3), P(-0.21, 0.44), P(-0.24, 0.56), P(-0.25, 0.64)]);
};

/** `new: ear-mic` and `new: antenna-thread` on a profile cat (any state), from its anchors: the capsule in the near ear's hollow and the thread from behind
 *  that ear down the nape and along the top of the back past the shoulders, one continuous line (fix list F5: visible in profile too). */
export const paintCatDressingProfile = (p: Painter, an: AnimalAnchors, seed: number) => {
  if (!an.top || !an.mouth || !an.eye || !an.withers) return;
  const hsS = Math.abs(an.mouth[1] - an.top[1]) / 0.28, dir = Math.sign(an.eye[0] - an.top[0]) || 1, [tx, ty] = an.top, X = (k: number) => tx + dir * k * hsS;
  earMic(p, seed, [X(-0.055), ty - 0.055 * hsS], [X(-0.09), ty + 0.012 * hsS], 0.025 * hsS);
  // down the nape just inside the coat, over the withers and along the back toward the croup, ending where it sinks into the fur
  const [wx, wy] = an.withers, cr = an.croup ?? an.withers, inset = 0.05 * hsS;
  const nape: Pt = [X(-0.2), ty + 0.2 * hsS];
  const pts: Pt[] = [[X(-0.1), ty + 0.03 * hsS], [X(-0.17), ty + 0.1 * hsS], nape, [(nape[0] + wx) / 2, (nape[1] + wy) / 2 + inset], [wx, wy + inset], [wx + (cr[0] - wx) * 0.45, wy + (cr[1] - wy) * 0.45 + inset * 1.1]];
  thread(p, seed + 2, pts);
};

/** `after` (G1 B01, 2026-11-21; opt-in): extra acting painted on the card with the cat's warm tint, after the kit drawing and before the dressing
 *  (the B01-SH03 yawn, `b01-set.ts`); it receives the cat's anchors. `anchors` (opt-in) receives them too, for screen-space callouts. */
export type CatCardOpts = {at: V3; scale: number; t: number; light: V3; pose?: Partial<AnimalPose>; shadowClip?: (pts: Pt[]) => Pt[];
  after?: (q: Painter, an: AnimalAnchors) => void; anchors?: AnimalAnchors};
/** The CAT as a card standing on the plane under `at` (the bench seat), front view sitting by default. Returns its picture extent. */
export const paintCatCard = (p: Painter, c: YCam, o: CatCardOpts): {top: number; bottom: number; h: number; card: PaperCardOut | null} | null => {
  const g = camPoint(c, o.at);
  if (!g) return null;
  // whiskerOut (user, 2026-11-21: "the whiskers must read as separate whisker lines, not a cream bar"): the whiskers stay out of the drawing the
  // card is cut around, so its margin no longer fills between them; they are inked after the card as fine threads glued on, half on the card
  const u = camUnit(c, o.at), def = catDef(o.scale), pose: AnimalPose = {view: 'front', state: 'sit', ...o.pose, whiskerOut: true};
  const an: AnimalAnchors = o.anchors ?? {};
  // UT02: the cat sits in the lamp's hot spot, so its card takes the warm key (lighter) and stays the brightest figure
  const draw = (q0: Painter) => { const q = tintPainter(q0, '#fff3da', 0.4, {brush: true}); drawAnimal(q, def.seed, def, g, u, pose, o.t, an); o.after?.(q, an); if (pose.view === 'front') paintCatDressingFront(q0, an, 32500); else paintCatDressingProfile(q0, an, 32500); };
  const card = paperCard(p, c, {foot: o.at, light: o.light, seed: 32400, edge: 6, tab: {depth: 0.08}, shadow: {op: 110, clip: o.shadowClip}}, draw);
  const qw = tintPainter(p, '#fff3da', 0.4, {brush: true});
  for (const w of an.whiskers ?? []) inkLine(qw, w.seed, w.pts, {color: w.color, weight: w.weight, closed: false, curve: w.curve});
  if (!an.top || !an.mouth) return null;
  const hsS = (an.mouth[1] - an.top[1]) / 0.28, earTip = an.top[1] - 0.15 * hsS;
  return {top: earTip, bottom: g[1], h: g[1] - earTip, card};
};

// ================================================================================================ real section (EDU-EP32-BRIEF-R2, Space F)
// Boss W3 gate LF03R, 2026-11-21. Casting lines (VD32-08, VD32-19):
//   CAT real `cat-gray-tabby {fluffy: true} x1.6 + new: antenna-thread + new: ear-mic` (no card, the same dressing as the paper cat)
//   MANNEQUIN L `man-crop body + new: mannequin + new: trench-1960s (tan)` (the circled target), MANNEQUIN R `man-buzz body + new: mannequin +
//   new: trench-1960s (grey) + new: fur-hat`, both kit P31 seated on the bench at the paper men's seats
//   AGENT `man-parted + new: agent-1960s` (charcoal suit, narrow black tie, white shirt, grey fedora; no badge, no name)
//   SPARROW `new: sparrow` (house sparrow, 0.15 m, perched in profile)

/** `new: mannequin` matte grey-beige (VD32-19). */
export const MANNEQUIN_SKIN = '#c9bba5';
const mannequinOf = (d: CastDef): CastDef => ({...d, head: {...d.head, skin: MANNEQUIN_SKIN}});
export const MANNEQUIN_L: CastDef = mannequinOf(FOREIGN_AGENT);
export const MANNEQUIN_R: CastDef = mannequinOf(HANDLER);

/** `new: mannequin` head (front view): a blank egg over the kit head (no hair, no face), lit from `litSide` (-1 screen-left), with the neck joint line. */
export const paintMannequinHead = (p: Painter, a: FigAnchors, seed: number, litSide: -1 | 1 = -1) => {
  const hh = a.chin - a.headTop, ry = 0.53 * hh, rx = 0.47 * hh, cx = a.head[0], cy = a.headTop + 0.5 * hh;
  const egg = (sx: number, sy: number, ox = 0, oy = 0): Pt[] => Array.from({length: 32}, (_, i): Pt => {
    const t = (i / 32) * Math.PI * 2, s = Math.sin(t);
    return [cx + ox + sx * rx * Math.cos(t) * (1 - 0.13 * Math.max(0, s)), cy + oy + sy * ry * s];
  });
  // neck: a plain cylinder of the same matte, then the joint line where it meets the head socket
  const nw = 0.17 * hh, ny = a.chin + 0.02 * hh;
  hardFill(p, seed, mixColor(MANNEQUIN_SKIN, '#3a3430', 0.18), [[cx - nw, a.chin - 0.1 * hh], [cx + nw, a.chin - 0.1 * hh], [cx + nw * 1.05, ny + 0.12 * hh], [cx - nw * 1.05, ny + 0.12 * hh]]);
  inkLine(p, seed + 1, [[cx - nw * 1.05, ny + 0.04 * hh], [cx, ny + 0.065 * hh], [cx + nw * 1.05, ny + 0.04 * hh]], {color: '#6e6355', weight: 0.8, closed: false, still: true, curve: 0.4});
  hardFill(p, seed + 2, MANNEQUIN_SKIN, egg(1, 1));
  // shade on the side away from the light, a soft lit crescent on the light side, one dull highlight
  hardFill(p, seed + 3, mixColor(MANNEQUIN_SKIN, '#4a4038', 0.22), egg(0.62, 0.9, -litSide * 0.36 * rx, 0.06 * ry));
  hardFill(p, seed + 4, mixColor(MANNEQUIN_SKIN, '#5a5048', 0.1), egg(0.8, 0.96, -litSide * 0.12 * rx, 0.03 * ry));
  hardFill(p, seed + 5, mixColor(MANNEQUIN_SKIN, '#fff4e0', 0.28), ell(cx + litSide * 0.38 * rx, cy - 0.38 * ry, 0.16 * rx, 0.12 * ry, 14, litSide * 0.5));
  inkLine(p, seed + 6, egg(1, 1), {color: mixColor(MANNEQUIN_SKIN, '#2a221c', 0.55), weight: 0.8, still: true, curve: 0.3});
};

export type RealSeatOpts = {at: V3; t: number; seed: number; hat?: boolean; coat: string; shade?: number};
/** A seated MANNEQUIN (front view, kit P31 hands in the lap) in its trench, real look (no card), with its contact shade under the shoes. */
export const paintSeatedMannequin = (p: Painter, c: YCam, def: CastDef, o: RealSeatOpts): CardLead | null => {
  const q = o.shade ? tintPainter(p, '#3f5a52', o.shade, {brush: true}) : p;
  const A = paintFigureAt(q, c, def, {at: o.at, view: 'front', pose: 'P31', face: 'neutral', t: o.t, seed: o.seed, shadow: {color: '#1f2c24', op: 110},
    activity: false, held: (qq, an) => {
      paintTrenchBelt(qq, an, o.coat, o.seed + 700, 0.62 * Math.abs(an.lShoulder[0] - an.rShoulder[0]));
      paintMannequinHead(qq, an, o.seed + 800);
      if (o.hat) paintFurHat(qq, an, o.seed + 900);
    }});
  if (!A) return null;
  const hh = A.chin - A.headTop, top = o.hat ? A.headTop - 0.08 * hh : A.headTop + 0.5 * hh - 0.53 * hh;
  return {top, bottom: A.bottom, head: A.head, card: null};
};

/** The real CAT (VD32-04 x1.6, VD32-05 dressing). Front sit by default; profile states pass `pose`. `fleck` 0..1 lays a warm leaf-gap light over the
 *  upper body (UT02 in canopy shade). Returns its picture extent (ear tip to ground point; for profile the body box). */
export const paintRealCat = (p: Painter, c: YCam, o: {at: V3; t: number; pose?: Partial<AnimalPose>; fleck?: number; shade?: number; scale?: number; ground?: string}) => {
  const g = camPoint(c, o.at);
  if (!g) return null;
  // `scale` (default x1.6 Space F) = x16 in Space D model units (B06-SH02, VD32-04); `ground` = the contact-shadow colour (default lawn)
  const u = camUnit(c, o.at), def = catDef(o.scale ?? CAT_SCALE.diorama), pose: AnimalPose = {view: 'front', state: 'sit', ...o.pose};
  const an: AnimalAnchors = {};
  // UT02 in canopy shade: a leaf-gap fleck warms and lifts the cat's own paint (no separate glaze, which reads as a halo)
  const q = o.fleck ? tintPainter(p, '#fff0d0', 0.22 * o.fleck, {brush: true}) : o.shade ? tintPainter(p, '#3f5a52', o.shade, {brush: true}) : p;
  const len = def.height * u;
  washAt(p, 32600, o.ground ?? '#1f2c24', 120, ell(g[0], g[1], (pose.view === 'front' ? 0.34 : 1.05) * len, 0.09 * len, 18), 0.15, 0.2);
  drawAnimal(q, def.seed, def, g, u, pose, o.t, an);
  if (pose.view === 'front') paintCatDressingFront(p, an, 32500);
  else paintCatDressingProfile(p, an, 32500);
  if (!an.top || !an.mouth) return {g, top: g[1] - len, bottom: g[1], h: len, an};
  const hsS = (an.mouth[1] - an.top[1]) / 0.28, earTip = an.top[1] - 0.15 * hsS;
  return {g, top: earTip, bottom: g[1], h: g[1] - earTip, an};
};

/** `new: sparrow` (male house sparrow, 0.15 m beak to tail), perched in profile on point `at` facing `dir` (-1 screen-left). Painted from the lens
 *  scale: grey crown, chestnut nape, white cheek, black bib, streaked brown back, pale belly, cocked tail. Returns top and bottom px. */
/** Sparrow motion (G4 B03-SH03, 21 Nov 2026; opt-in, absent = the perched drawing): `fly` hides the legs and opens both wings at `flap` 0..1
 *  (0 = wings swept down, 1 = raised); `tail` 0..1 cocks the tail up for the tail-bob. */
export type SparrowMotion = {fly?: boolean; flap?: number; tail?: number};
export const paintSparrow = (p: Painter, c: YCam, at: V3, seed: number, dir: -1 | 1 = -1, shade = 0, m: SparrowMotion = {}) => {
  const g = camPoint(c, at);
  if (!g) return null;
  const u = camUnit(c, at), L = 0.15 * u, P = (x: number, y: number): Pt => [g[0] + dir * x * L, g[1] - y * L];
  const tint = (col: string) => mixColor(col, '#3f5a52', shade);
  // one wing from the shoulder (sparrow-local x back, y up): raised `a` radians above the back line, a rounded brown blade with dark primaries
  const wing = (s: number, k: number, dark: boolean) => {
    const a = (-0.7 + 1.9 * (m.flap ?? 0)) * k, sh: [number, number] = [0.02, 0.42], ca = Math.cos(a), sa = Math.sin(a);
    const W = (x: number, y: number) => P(sh[0] + x * ca - y * sa, sh[1] + x * sa + y * ca);
    hardFill(p, s, tint(dark ? '#5e4430' : '#8a6440'), [W(0, 0.05), W(0.22, 0.09), W(0.46, 0.05), W(0.52, -0.02), W(0.4, -0.07), W(0.12, -0.06), W(0, -0.04)]);
    inkLine(p, s + 1, [W(0.24, 0.02), W(0.5, -0.01)], {color: tint('#2e2218'), weight: 0.7, closed: false, still: true, curve: 0.2});
  };
  if (m.fly) wing(seed + 20, 1.12, true); // far wing, behind the body
  if (!m.fly) {
    inkLine(p, seed, [P(-0.02, 0), P(0.02, 0.12)], {color: '#6a4a36', weight: 0.8, closed: false, still: true, curve: 0});
    inkLine(p, seed + 1, [P(0.1, 0), P(0.08, 0.12)], {color: '#6a4a36', weight: 0.8, closed: false, still: true, curve: 0});
  }
  const tk = 0.16 * (m.tail ?? 0);
  hardFill(p, seed + 2, tint('#5a4632'), [P(0.22, 0.24), P(0.62 - tk * 0.4, 0.42 + tk), P(0.64 - tk * 0.3, 0.36 + tk), P(0.26, 0.17)]); // tail, cocked up
  hardFill(p, seed + 3, tint('#d9d2c2'), ell(...P(0.03, 0.3), 0.3 * L, 0.19 * L, 18, dir * 0.25)); // belly
  hardFill(p, seed + 4, tint('#8a6440'), [P(-0.12, 0.42), P(0.12, 0.47), P(0.34, 0.33), P(0.18, 0.24), P(-0.06, 0.3)]); // back and wing
  for (let k = 0; k < 3; k++) inkLine(p, seed + 5 + k, [P(-0.02 + k * 0.08, 0.42 - k * 0.03), P(0.08 + k * 0.08, 0.33 - k * 0.02)], {color: tint('#2e2218'), weight: 0.7, closed: false, still: true, curve: 0.2});
  hardFill(p, seed + 9, tint('#a87a4c'), [P(0.0, 0.38), P(0.2, 0.36), P(0.16, 0.3), P(0.02, 0.32)]); // wing bar
  const hc = P(-0.2, 0.47);
  hardFill(p, seed + 10, tint('#8a5a3a'), ell(hc[0], hc[1], 0.12 * L, 0.11 * L, 16)); // chestnut nape
  hardFill(p, seed + 11, tint('#7d7f80'), ell(hc[0] - dir * 0.015 * L, hc[1] - 0.04 * L, 0.1 * L, 0.06 * L, 14)); // grey crown
  hardFill(p, seed + 12, tint('#ebe6da'), ell(hc[0] - dir * 0.03 * L, hc[1] + 0.025 * L, 0.07 * L, 0.045 * L, 12)); // white cheek
  hardFill(p, seed + 13, '#1c1a18', [P(-0.24, 0.42), P(-0.12, 0.4), P(-0.14, 0.3), P(-0.22, 0.33)]); // black bib
  hardFill(p, seed + 14, '#2a2622', [P(-0.3, 0.49), P(-0.4, 0.465), P(-0.3, 0.44)]); // beak
  hardFill(p, seed + 15, '#0e0d0c', ell(hc[0] + dir * 0.055 * L, hc[1] - 0.005 * L, 0.018 * L, 0.018 * L, 8)); // eye
  inkLine(p, seed + 16, [P(-0.12, 0.47), P(0.22, 0.44), P(0.33, 0.33), P(0.28, 0.2), P(0.02, 0.15), P(-0.2, 0.25)], {color: '#2a2018', weight: 0.6, closed: false, still: true, curve: 0.4});
  if (m.fly) wing(seed + 22, 1, false); // near wing, over the body
  return {top: g[1] - 0.6 * L, bottom: g[1]};
};

/** AGENT real (VD32-08): `man-parted + new: agent-1960s`, the paper card's face and colours on a normal kit figure. */
export const AGENT: CastDef = (() => {
  const b = man('man-parted');
  return {...b, outfit: {...b.outfit, shirt: '#ecebe4', sleeve: '#3a3d42', longSleeves: true, jacket: '#3a3d42', pants: '#33363b', shoes: '#1e1c1c', gear: {tie: {color: '#141416'}}}};
})();
/** `new: agent-1960s` fedora (front view): grey felt crown with a pinch, a black band and the brim, sized from the head anchors. */
export const paintFedora = (p: Painter, a: FigAnchors, seed: number) => {
  const [hx] = a.head, hh = a.chin - a.headTop, top = a.headTop, w = 0.55 * hh, felt = '#6d6f72', band = '#1c1c1e';
  const brimY = top + 0.24 * hh;
  hardFill(p, seed, mixColor(felt, '#1a1a1c', 0.25), ell(hx, brimY, w * 1.32, 0.11 * hh, 24)); // brim
  hardFill(p, seed + 1, felt, [[hx - w * 0.82, brimY], [hx - w * 0.74, top - 0.12 * hh], [hx - w * 0.2, top - 0.2 * hh], [hx, top - 0.12 * hh], [hx + w * 0.2, top - 0.2 * hh], [hx + w * 0.74, top - 0.12 * hh], [hx + w * 0.82, brimY]]);
  hardFill(p, seed + 2, band, [[hx - w * 0.82, brimY], [hx + w * 0.82, brimY], [hx + w * 0.8, brimY - 0.09 * hh], [hx - w * 0.8, brimY - 0.09 * hh]]);
  inkLine(p, seed + 3, [[hx, top - 0.12 * hh], [hx, top + 0.05 * hh]], {color: mixColor(felt, '#101012', 0.5), weight: 0.7, closed: false, still: true, curve: 0});
};
