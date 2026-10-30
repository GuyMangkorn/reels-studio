import {hash} from '../kit/hash';
import {makePainter, mixColor, range, ring, type Painter, type Pt} from '../kit/painter';
import {DREAM_INK, INK_D} from './sets';

// BLOOP creatures (DEP02): CR-DREAM (CRD-2 four-eyed armoured fish, L-B2, boiling ink) and CR-REAL (CRD-2 made solid,
// L-CP3, painted with frozen ink). Ported from the look spike (`paintDream2`, `crGeom`, `paintCrReal`); the spike is not
// imported. Both take a placement: local spike coordinates map to plate world px by the transform the caller gives.

// ---------------------------------------------------------------- shared path helpers (ported)
/** Catmull-Rom curve through `pts`, n + 1 samples. */
export const bez = (pts: Pt[], n = 40): Pt[] => range(n, (u) => {
  const m = pts.length - 1, f = u * m, i = Math.min(m - 1, Math.floor(f)), s = f - i;
  const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(m, i + 2)];
  const c = (a: number, b: number, cc: number, d: number) => 0.5 * (2 * b + (-a + cc) * s + (2 * a - 5 * b + 4 * cc - d) * s * s + (-a + 3 * b - 3 * cc + d) * s * s * s);
  return [c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])] as Pt;
});
const closed = (pts: Pt[], n = 60) => bez([...pts, pts[0]], n);

/** Points along a spine with a thickness profile: the upper and lower edges. */
const tube = (spine: Pt[], thick: (u: number) => number) => {
  const n = spine.length - 1;
  const top: Pt[] = [], bot: Pt[] = [];
  spine.forEach(([x, y], i) => {
    const [ax, ay] = spine[Math.max(0, i - 1)], [bx, by] = spine[Math.min(n, i + 1)];
    const dx = bx - ax, dy = by - ay, l = Math.hypot(dx, dy) || 1;
    const nx = -dy / l, ny = dx / l, r = thick(i / n) / 2;
    top.push([x - nx * r, y - ny * r]);
    bot.push([x + nx * r, y + ny * r]);
  });
  return {top, bot};
};

/** Sketchy ink: the path drawn `passes` times with hash jitter that changes per boil step (the creature boils, VD08). */
const sketch = (p: Painter, id: number, pts: Pt[], o: {passes?: number; jit?: number; w?: number; brush?: string; color?: string; curv?: number} = {}) => {
  p.ink(id, o.brush ?? 'HB', o.color ?? INK_D, o.w ?? 2.2);
  const passes = o.passes ?? 2, jit = o.jit ?? 7, step = Math.floor(p.frame / 2);
  for (let k = 0; k < passes; k++) {
    const j = pts.map(([x, y], i) => [x + (hash(id * 31 + i * 7 + k * 101 + step * 13) - 0.5) * jit, y + (hash(id * 17 + i * 11 + k * 59 + step * 29) - 0.5) * jit] as Pt);
    p.brush.spline(j, o.curv ?? 0.5);
  }
};
const hatchIn = (p: Painter, id: number, pts: Pt[], dist: number, angle: number, color = DREAM_INK) => {
  p.ink(id, 'HB', color, 1.2);
  p.brush.hatchStyle('HB', color, 1.2);
  p.brush.hatch(dist, angle, {rand: 0.25, continuous: false, gradient: 0.3});
  p.brush.noStroke();
  p.brush.polygon(pts);
  p.brush.noHatch();
};
/** Unfinished watercolour: the fill is split into blotches that leave paper gaps near the edges. */
const blotch = (p: Painter, color: string, opacity: number, poly: Pt[], parts = 3) => {
  const cx = poly.reduce((a, q) => a + q[0], 0) / poly.length, cy = poly.reduce((a, q) => a + q[1], 0) / poly.length;
  for (let k = 0; k < parts; k++) {
    const sh = 0.78 + 0.16 * hash(k + 3);
    const ox = (hash(k + 11) - 0.5) * 60, oy = (hash(k + 19) - 0.5) * 40;
    p.wash(color, opacity, poly.map(([x, y]) => [cx + (x - cx) * sh + ox, cy + (y - cy) * sh + oy] as Pt), 0.22, 0.75);
  }
};
const eyeInk = (p: Painter, id: number, x: number, y: number, r: number) => {
  sketch(p, id, closed([[x - r, y], [x, y - r * 0.8], [x + r, y], [x, y + r * 0.8]], 20), {w: 2.2, jit: 3});
  p.wash('#3a3550', 230, ring(x + r * 0.15, y, r * 0.38, r * 0.5, 12), 0.05, 0.2);
  sketch(p, id + 1, bez([[x - r * 1.4, y - r * 0.6], [x, y - r * 1.4], [x + r * 1.3, y - r * 0.9]], 10), {w: 2.4, jit: 4});
};

// ---------------------------------------------------------------- CR-DREAM: CRD-2 four-eyed armoured fish (VD08)
/** Spike-local anchors of CRD-2: the first eye (`cr.eye`) and the underbite mouth centre (`cr.mouth`). */
export const CRD2_LOCAL = {eye: [160, 470] as Pt, mouth: [245, 630] as Pt};

// ---------------------------------------------------------------- CR-DREAM rich (BLOOP-BRIEF-R8 H11, Film's values)
const DREAM_GLOW = '#efe9ff', DREAM_SPECK = '#e3dcff', PLATE_LIGHT = '#cfc8e0';
const lerpPt = (a: Pt, b: Pt, u: number): Pt => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];

/**
 * The rich CR-DREAM (H11): four armour plates (tone wash, cross-contour hatching, lit top edge, pits), a core shadow,
 * crown spines 30 % longer with membrane washes, a gape with dark interior, upper teeth and longer underbite blades,
 * eyes cross-fading shut -> open (violet iris, slit pupil, highlight, lilac glow), gill slits with filaments, fins with
 * rays, 14 twinkling specks and body undulation. The head outline is the legacy outline. Washes come before the strokes
 * that share their block; `group` keeps every later wash's seed fixed when a block's wash count changes (glow, specks).
 */
const paintDreamRich = (p: Painter, place: {s: number; tx: number; ty: number}, o: Required<Omit<DreamOpts, 'rich'>>) => {
  const {brush} = p;
  brush.push();
  brush.translate(place.tx, place.ty);
  brush.scale(place.s);
  // body: undulation (the tail end moves ±22 local px, the head is fixed); `phase` sets the swim
  const spine = bez([[420, 560], [700, 560], [920, 600], [1130, 560], [1400, 470]], 40).map(([x, y], i, a) => {
    const u = i / (a.length - 1);
    return [x, y + 22 * u * u * Math.sin(o.phase - 2.6 * u)] as Pt;
  });
  const {top, bot} = tube(spine, (u) => 470 - u * 320);
  blotch(p, '#b9b2ca', 140, [...top, ...bot.slice().reverse()]);
  const head: Pt[] = [[560, 290], [330, 250], [130, 320], [-20, 470], [-40, 640], [60, 790], [280, 860], [520, 830], [640, 700]];
  blotch(p, '#a59ebd', 175, closed(head, 50), 3);
  // armour plates: a tone wash, cross-contour hatching and a pale lit top edge each; then 26 pits and scars
  const plates: {pts: Pt[]; ang: number}[] = [
    {pts: [[130, 320], [330, 250], [360, 420], [300, 560], [140, 620], [60, 470]], ang: 0.9},     // cheek / eye plate
    {pts: [[330, 250], [560, 290], [600, 480], [360, 420]], ang: -0.4},                         // crown plate
    {pts: [[560, 290], [640, 700], [580, 700], [600, 480]], ang: 1.3},                          // operculum
    {pts: [[-20, 470], [60, 470], [140, 620], [-30, 600]], ang: 0.2},                          // snout
  ];
  p.group(100);
  plates.forEach(({pts, ang}, k) => {
    const c = closed(pts, 30);
    p.wash(k % 2 ? '#8a82a8' : '#7d7599', 170, scaleAbout(c, c[0][0], c[0][1], 0.95, 0.95), 0.12, 0.6);
    hatchIn(p, 600 + k, scaleAbout(c, pts[0][0], pts[0][1], 0.88, 0.88), 6, ang, INK_D);
    sketch(p, 610 + k, bez(pts.slice(0, 3), 12).map(([x, y]) => [x, y + 6] as Pt), {w: 1.6, color: PLATE_LIGHT, passes: 1, jit: 3});
  });
  p.ink(620, 'HB', INK_D, 1.4);
  for (let i = 0; i < 26; i++) {
    const pl = plates[i % 3].pts, a = pl[Math.floor(hash(i + 900) * pl.length)], b = pl[Math.floor(hash(i + 901) * pl.length)];
    const [x, y] = lerpPt(a, b, 0.3 + 0.4 * hash(i + 902));
    brush.spline([[x - 6, y], [x, y - 4], [x + 6, y + 1]], 0.4);
  }
  hatchIn(p, 300, closed([[-30, 620], [200, 700], [520, 720], [560, 830], [280, 860], [60, 790]], 30), 8, -0.6);
  hatchIn(p, 301, [...bot.slice(0, 32), ...top.slice(0, 32).reverse().map(([x, y]) => [x, y + 220] as Pt)], 10, 0.5);
  sketch(p, 302, closed(head, 50), {w: 3.4});
  sketch(p, 303, top.slice(3), {w: 2.3});
  sketch(p, 304, bot.slice(3), {w: 2.3});
  plates.forEach(({pts}, k) => sketch(p, 310 + k, bez(pts, 16), {w: 2.4, jit: 5}));
  // crown spines (30 % longer than the legacy 50 + 40·hash): membrane washes first, then the spine strokes
  const crown = bez([[130, 320], [330, 250], [560, 290], [720, 340]], 10);
  const spineLen = (i: number) => 70 + 40 * hash(i + 70);
  p.group(200);
  crown.slice(0, -1).forEach(([x, y], i) => {
    const [x2, y2] = crown[i + 1];
    p.wash('#a39bbd', 140, [[x + 4, y - spineLen(i) * 0.85], [x2 + 4, y2 - spineLen(i + 1) * 0.85], [x2, y2], [x, y]], 0.15, 0.6);
  });
  p.ink(318, 'HB', INK_D, 2.2);
  crown.forEach(([x, y], i) => brush.spline([[x - 14, y + 4], [x + 4, y - spineLen(i)], [x + 18, y + 4]], 0.3));
  p.wash('#6b6488', 120, closed([[-30, 640], [200, 720], [520, 730], [600, 800], [280, 850], [60, 780]], 30), 0.2, 0.5);
  // gape: the lip line splits into an open mouth inside the head outline (upper lip up to 46, lower down to 58 local px)
  const g = o.gape;
  const lipU = bez([[-30, 600], [120, 640 - 46 * g], [320, 650 - 40 * g], [520, 610]], 20);
  const lipL = bez([[-30, 600], [120, 640 + 58 * g], [320, 650 + 50 * g], [520, 610]], 20);
  p.group(300);
  if (g > 0.02) {
    p.wash('#2e2a40', 230, [...lipU, ...lipL.slice().reverse()], 0.08, 0.4);
    hatchIn(p, 625, [...lipU, ...lipL.slice().reverse()], 5, 0.9, '#1d1a2a');
  }
  sketch(p, 320, lipU, {w: 2.8, brush: '2B'});
  if (g > 0.02) sketch(p, 326, lipL, {w: 2.6, brush: '2B'});
  p.ink(321, 'HB', INK_D, 1.8);
  lipL.slice(1, 15).forEach(([x, y], i) => {
    if (i % 2) return;
    const l = (40 + 40 * hash(i + 400)) * (1 + 0.5 * g);
    p.wash('#ece6f6', 220, [[x - 12, y + 4], [x + 2, y - l], [x + 12, y + 4]], 0.02, 0.2);
    brush.polygon([[x - 12, y + 4], [x + 2, y - l], [x + 12, y + 4]]);
  });
  if (g > 0.02) {
    p.ink(327, 'HB', INK_D, 1.4);
    lipU.slice(2, 16).forEach(([x, y], i) => { if (i % 3 === 0) brush.polygon([[x - 7, y - 2], [x + 1, y + 26 + 14 * hash(i + 430)], [x + 7, y - 2]]); });
  }
  // eyes: shut (a lid line and brow) cross-fades into open (iris, slit pupil, highlight, lilac glow in two rings)
  p.group(400);
  ([[160, 470, 34], [250, 380, 24]] as [number, number, number][]).forEach(([x, y, r], k) => {
    if (o.eyes < 1) {
      const shut = p.layer(1 - o.eyes, 4400 + k * 100);
      sketch(shut, 330 + k * 4, bez([[x - r, y], [x, y + r * 0.35], [x + r, y]], 10), {w: 2.4, jit: 3});
      sketch(shut, 331 + k * 4, bez([[x - r * 1.4, y - r * 0.6], [x, y - r * 1.4], [x + r * 1.3, y - r * 0.9]], 10), {w: 2.4, jit: 4});
    }
    if (o.eyes > 0) {
      const open = p.layer(o.eyes, 4450 + k * 100);
      if (o.glow > 0) {
        open.wash(DREAM_GLOW, Math.round(120 * o.glow), ring(x, y, r * 2.2, r * 1.9, 20), 0.35, 0.3);
        open.wash(DREAM_GLOW, Math.round(170 * o.glow), ring(x, y, r * 1.4, r * 1.2, 18), 0.3, 0.3);
      }
      open.flat('#f4f0ff', ring(x, y, r, r * 0.8, 18));
      open.wash('#a79fc4', 200, ring(x + r * 0.1, y, r * 0.7, r * 0.6, 16), 0.1, 0.3);
      open.flat('#1d1a2a', ring(x + r * 0.15, y, r * 0.16, r * 0.62, 12));
      open.flat('#ffffff', ring(x - r * 0.35, y - r * 0.3, r * 0.17, r * 0.15, 10));
      sketch(open, 330 + k * 4, closed([[x - r, y], [x, y - r * 0.8], [x + r, y], [x, y + r * 0.8]], 20), {w: 2.4, jit: 3});
      sketch(open, 331 + k * 4, bez([[x - r * 1.4, y - r * 0.6], [x, y - r * 1.4], [x + r * 1.3, y - r * 0.9]], 10), {w: 2.6, jit: 4});
    }
  });
  // gills: dark slits with feathery filaments
  p.group(500);
  [0, 1, 2, 3].forEach((k) => {
    const sl = bez([[660 + k * 28, 420], [645 + k * 28, 560], [660 + k * 28, 700]], 10);
    sketch(p, 340 + k, sl, {w: 1.8, jit: 4});
    p.wash('#6e6790', 140, [...sl, ...sl.slice().reverse().map(([x, y]) => [x + 12, y] as Pt)], 0.1, 0.4);
    p.ink(350 + k, 'HB', INK_D, 1.1);
    sl.forEach(([x, y], i) => { if (i % 2 === 0) brush.line(x + 2, y, x + 16 + 4 * Math.sin(o.phase + i), y + 6); });
  });
  // fins: a membrane wash and rays
  p.group(600);
  const pect = bez([[600, 790], [700, 960], [860, 990], [800, 800]], 16);
  const dors = bez([[780, 380], [860, 230], [1000, 270], [1010, 400]], 14);
  [pect, dors].forEach((f, k) => {
    p.wash('#b3abc8', 130, f, 0.15, 0.6);
    p.ink(360 + k, 'HB', INK_D, 1.2);
    const root = k ? ([890, 400] as Pt) : ([640, 800] as Pt);
    f.slice(2, -2).forEach(([x, y], i) => { if (i % 2 === 0) brush.line(root[0], root[1], x, y); });
    sketch(p, 345 + k, f, {w: 2.2});
  });
  sketch(p, 347, bez([[720, 560], [900, 590], [1100, 560], [1300, 490]], 16), {w: 1.2, passes: 1});
  // 14 bioluminescent specks along the lateral line and the jaw: pale lilac points with a faint halo, twinkling
  p.group(700);
  if (o.specks > 0) {
    const sp = p.layer(o.specks, 4700);
    // bez(pts, n) gives n + 1 samples: 9 along the lateral line and 5 on the jaw = 14 specks (H11 6)
    const line = [...bez([[720, 560], [900, 590], [1100, 560], [1300, 490]], 8), ...bez([[40, 700], [200, 760], [420, 770]], 4)];
    line.forEach(([x, y], i) => {
      const tw = 0.6 + 0.4 * Math.sin(o.phase * 1.7 + i * 1.3);
      sp.wash(DREAM_SPECK, Math.round(90 * tw), ring(x, y + 8, 14, 12, 10), 0.3, 0.3);
      sp.flat('#fbf9ff', ring(x, y + 8, 4, 4, 8));
    });
  }
  brush.pop();
};

/** CR-DREAM options (BLOOP-BRIEF-R8). `rich` false (default) is the legacy drawing; the other options apply only when `rich`. */
export type DreamOpts = {
  rich?: boolean;
  /** 0 = eyes shut (lid lines), 1 = open; values between cross-fade. Default 1. */
  eyes?: number;
  /** 0..1 jaw gape: the lip line splits, the interior, upper teeth and underbite blades follow. Default 0. */
  gape?: number;
  /** 0..1 lilac glow around the open eyes. Default 0. */
  glow?: number;
  /** Undulation phase in radians (body wave and speck twinkle). Default 0. */
  phase?: number;
  /** 0..1 strength of the 14 specks; 0 = off. Default 0. */
  specks?: number;
};

/**
 * CR-DREAM (CRD-2, L-B2): a huge plated head with two stacked eyes per side, an underbite of bony blades and a short
 * tapering body. Drawn in spike-local coordinates under `place` = {s, tx, ty} (world = s * local + t). Loose boiling ink.
 * `o.rich` selects the H11 drawing (`paintDreamRich`); the default is the legacy drawing, unchanged.
 */
export const paintDreamCreature = (p: Painter, place: {s: number; tx: number; ty: number}, o: DreamOpts = {}) => {
  if (o.rich) {
    paintDreamRich(p, place, {eyes: o.eyes ?? 1, gape: o.gape ?? 0, glow: o.glow ?? 0, phase: o.phase ?? 0, specks: o.specks ?? 0});
    return;
  }
  const {brush} = p;
  brush.push();
  brush.translate(place.tx, place.ty);
  brush.scale(place.s);
  const spine = bez([[420, 560], [700, 560], [920, 600], [1130, 560], [1400, 470]], 40);
  const {top, bot} = tube(spine, (u) => 470 - u * 320);
  blotch(p, '#b9b2ca', 140, [...top, ...bot.slice().reverse()]);
  const head: Pt[] = [[560, 290], [330, 250], [130, 320], [-20, 470], [-40, 640], [60, 790], [280, 860], [520, 830], [640, 700]];
  blotch(p, '#a59ebd', 175, closed(head, 50), 3);
  hatchIn(p, 300, closed([[-30, 620], [200, 700], [520, 720], [560, 830], [280, 860], [60, 790]], 30), 8, -0.6);
  hatchIn(p, 301, [...bot.slice(0, 32), ...top.slice(0, 32).reverse().map(([x, y]) => [x, y + 220] as Pt)], 10, 0.5);
  sketch(p, 302, closed(head, 50), {w: 2.8});
  sketch(p, 303, top.slice(3), {w: 2.3});
  sketch(p, 304, bot.slice(3), {w: 2.3});
  [[[120, 340], [200, 470], [180, 600]], [[330, 260], [360, 420], [300, 560], [140, 620]], [[540, 300], [600, 480], [580, 700], [520, 820]], [[-20, 560], [140, 600], [330, 590], [480, 520], [600, 520]]]
    .forEach((pts, k) => sketch(p, 310 + k, bez(pts as Pt[], 16), {w: 1.8, jit: 5}));
  p.ink(318, 'HB', INK_D, 1.8);
  bez([[130, 320], [330, 250], [560, 290], [720, 340]], 10).forEach(([x, y], i) => brush.spline([[x - 14, y + 4], [x + 4, y - 50 - 40 * hash(i + 70)], [x + 18, y + 4]], 0.3));
  const lip = bez([[-30, 600], [120, 640], [320, 650], [520, 610]], 20);
  sketch(p, 320, lip, {w: 2.8, brush: '2B'});
  p.ink(321, 'HB', INK_D, 1.8);
  lip.slice(1, 15).forEach(([x, y], i) => {
    if (i % 2) return;
    const l = 40 + 40 * hash(i + 400);
    brush.polygon([[x - 12, y + 4], [x + 2, y - l], [x + 12, y + 4]]);
  });
  eyeInk(p, 330, 160, 470, 34);
  eyeInk(p, 334, 250, 380, 24);
  [0, 1, 2, 3].forEach((k) => sketch(p, 340 + k, bez([[660 + k * 28, 420], [645 + k * 28, 560], [660 + k * 28, 700]], 10), {w: 1.5, jit: 4}));
  sketch(p, 345, bez([[600, 790], [700, 960], [860, 990], [800, 800]], 16), {w: 2});
  sketch(p, 346, bez([[780, 380], [860, 230], [1000, 270], [1010, 400]], 14), {w: 2});
  sketch(p, 347, bez([[720, 560], [900, 590], [1100, 560], [1300, 490]], 16), {w: 1.2, passes: 1});
  brush.pop();
};

/** World point of a CRD-2 local point under `place`. */
export const dreamPoint = (place: {s: number; tx: number; ty: number}, [x, y]: Pt): Pt => [place.tx + place.s * x, place.ty + place.s * y];

// ---------------------------------------------------------------- CR-REAL: CRD-2 made solid, painted (L-CP3, VD11)
/** Same local geometry as the approved spike (front 3/4, mouth open, near side screen right), world px for (mx, my, k). */
const crGeom = (mx: number, my: number, k: number, jaw = 1, spineScale = 1) => {
  const T = ([x, y]: Pt): Pt => [mx + (x < 0 ? x * 0.7 : x) * k + 40 * k, my + y * k];
  const mS = ([x, y]: Pt): Pt => [x * 0.8, 40 + (y - 40) * 0.78];
  const tm = (pts: Pt[]) => pts.map(mS).map(T);
  const head = closed(([[-300, -760], [60, -790], [420, -720], [600, -520], [640, -260], [660, 20], [640, 260], [470, 470], [120, 600], [-260, 560], [-520, 360], [-640, 80], [-630, -220], [-560, -520]] as Pt[]).map(T), 90);
  const mouth = closed(tm([[-540, -30], [-380, -190], [-120, -250], [160, -250], [420, -180], [580, -30], [540, 220], [300, 420], [0, 470], [-300, 410], [-500, 220]]), 70);
  const gum = closed(tm([[-470, -40], [-330, -150], [-100, -195], [150, -195], [380, -140], [510, -40], [470, 170], [280, 340], [0, 385], [-280, 330], [-440, 170]]), 60);
  const throat = closed(tm([[-200, 20], [0, -40], [220, 20], [240, 170], [0, 250], [-210, 170]]), 30);
  const along = (pts: Pt[], n: number) => bez(pts, n).map(mS);
  const toward = ([x, y]: Pt, len: number, curl: number): Pt => {
    const dx = 0 - x, dy = 60 - y, l = Math.hypot(dx, dy) || 1;
    return [x + (dx / l) * len + curl, y + (dy / l) * len];
  };
  const fang = (base: Pt, tip: Pt, w: number): Pt[] => {
    const [bx, by] = T(base), [tx, ty] = T(tip), ww = w * k;
    const nx = -(ty - by), ny = tx - bx, l = Math.hypot(nx, ny) || 1, ox = (nx / l) * ww, oy = (ny / l) * ww;
    const mx2 = (bx + tx) / 2 + ox * 0.35, my2 = (by + ty) / 2 + oy * 0.35;
    return [[bx - ox, by - oy], [mx2 - ox * 0.45, my2 - oy * 0.45], [tx, ty], [mx2 + ox * 0.55, my2 + oy * 0.55], [bx + ox, by + oy]];
  };
  const upLine = along([[-500, -60], [-370, -175], [-120, -225], [160, -225], [410, -165], [550, -60]], 18);
  const loLine = along([[540, -10], [500, 200], [290, 380], [0, 430], [-290, 370], [-470, 200], [-510, -10]], 16);
  const teeth: Pt[][] = [
    ...loLine.slice(1, -1).map((b, i) => {
      const blade = i % 4 === 1, len = blade ? 230 + 60 * hash(i + 21) : 45 + 35 * hash(i + 25);
      return fang(b, blade ? [b[0] * 0.92 + (b[0] < 0 ? -20 : 20), b[1] - len] : toward(b, len, 0), blade ? 24 : 11);
    }),
    ...upLine.slice(1, -1).map((b, i) => {
      const long = i % 5 === 2, len = long ? 170 + 40 * hash(i + 5) : 50 + 40 * hash(i + 9);
      return fang(b, toward(b, len, b[0] < 0 ? 12 : -12), long ? 20 : 11);
    }),
  ];
  const inner = along([[-380, -40], [-200, -130], [0, -150], [200, -130], [380, -40]], 12).slice(1, -1).map((b, i) => fang(b, toward(b, 50 + 30 * hash(i + 60), 0), 8));
  // far-low eye 10 local px higher than the first CP3 layout: its socket cleared label slot 1 (FR01: within +/-20 px of the anchor)
  const eyes = ([[[470, -350], 46], [[350, -520], 31], [[-470, -360], 40], [[-370, -510], 27]] as [Pt, number][]).map(([c, r]) => ({c: T(c), r: r * k, sx: c[0] < 0 ? 0.7 : 1}));
  const ridges = ([[[-150, -770], [-170, -560], [-120, -330]], [[150, -780], [170, -560], [140, -320]], [[620, -120], [480, -200], [330, -330], [200, -420]], [[-620, -120], [-480, -200], [-330, -330], [-200, -420]], [[650, 120], [560, 60], [520, -20]], [[-640, 120], [-560, 60], [-520, -20]]] as Pt[][]).map((r) => bez(r.map(T), 16));
  const spines = bez([[-520, -560], [-300, -760], [60, -800], [420, -720], [600, -520]], 10).map((b, i) => {
    const [bx, by] = T(b), [tx, ty] = T([b[0] * 1.05, b[1] - 90 - 70 * hash(i + 3)]);
    // BLOOP-BRIEF-R7 H09: crown spines are halved while the shadow is above 0.3 (spineScale 0.5)
    return [[bx - 22 * k, by + 40 * k], [bx + (tx - bx) * spineScale, by + (ty - by) * spineScale], [bx + 22 * k, by + 40 * k]] as Pt[];
  });
  const lipLight = bez(tm([[-420, -200], [-120, -265], [200, -265], [460, -190]]), 20);
  const jawLight = bez(([[-640, 160], [-450, 480], [0, 620], [460, 490], [660, 160]] as Pt[]).map(T), 30);
  // FR02 jawOpen: the lower lip, gum, lower teeth, throat and lower jaw light scale vertically about the upper lip line
  // (local y -225); the upper teeth, eyes and plates are fixed. jaw 0.25 leaves a dark slit under the upper fangs.
  const lipY = my + (40 + (-225 - 40) * 0.78) * k;
  const J = (q: Pt): Pt => (q[1] > lipY ? [q[0], lipY + (q[1] - lipY) * jaw] : q);
  const nLower = loLine.slice(1, -1).length;
  return {
    T, head, upLine,
    mouth: mouth.map(J), gum: gum.map(J), throat: throat.map(J), jawLight: jawLight.map(J),
    teeth: teeth.map((t, i) => (i < nLower ? t.map(J) : t)),
    inner, eyes, ridges, spines, lipLight,
  };
};

const scaleAbout = (poly: Pt[], cx: number, cy: number, sx: number, sy: number): Pt[] => poly.map(([x, y]) => [cx + (x - cx) * sx, cy + (y - cy) * sy] as Pt);
const centroid = (poly: Pt[]): Pt => [poly.reduce((a, q) => a + q[0], 0) / poly.length, poly.reduce((a, q) => a + q[1], 0) / poly.length];

/** Placement (mx, my, k) that puts the creature's mouth centroid on world (mouthX, mouthY). Translation is exact (T is linear in mx, my). */
export const crRealPlace = (mouthX: number, mouthY: number, k = 0.86) => {
  const c0 = centroid(crGeom(0, 0, k).mouth);
  return {mx: mouthX - c0[0], my: mouthY - c0[1], k};
};

/** Anchors of a placed CR-REAL (world px): mouth centroid, the near-side eye pair and the far-side eye pair. */
export const crRealAnchors = (place: {mx: number; my: number; k: number}) => {
  const g = crGeom(place.mx, place.my, place.k);
  const eyeC = (i: number) => g.eyes[i].c;
  return {
    mouth: centroid(g.mouth),
    // eye outlines as drawn: iris ring half-widths and half-height (socket), world px, for the FR01 in-frame and slot checks
    eyeRings: g.eyes.map((e) => ({c: e.c, rx: (e.r + 12 * place.k) * e.sx, ry: e.r + 8 * place.k})),
    // the iris rings (the bright eye, as drawn by the eye fill): the frame and slot checks of BLOOP-SHEETS-R5 use these
    irisRings: g.eyes.map((e) => ({c: e.c, rx: e.r * e.sx, ry: e.r * 0.82})),
    eyeNear: [eyeC(0), eyeC(1)].map((c) => [c[0], c[1]] as Pt),
    eyeFar: [eyeC(2), eyeC(3)].map((c) => [c[0], c[1]] as Pt),
    head: [Math.min(...g.head.map((q) => q[0])), Math.min(...g.head.map((q) => q[1])), Math.max(...g.head.map((q) => q[0])), Math.max(...g.head.map((q) => q[1]))] as const,
  };
};

/**
 * Painted CR-REAL (L-CP3): layered washes over a flat underlayer, mottle, two irregular crosshatch passes on the crown
 * (spacings 9 and 13, angles 0.62 and -0.43 rad, rand 0.35, no tiling), inner tooth row, cold pores; every creature mark is
 * still ink (no boil, VD11). `aperture` 0..1 opens the throat's black out to the lip line during the rush.
 */
export const paintCrReal = (p: Painter, place: {mx: number; my: number; k: number}, o: {aperture?: number; jawOpen?: number; hatchScale?: number; hatchAlpha?: number; mottleAlpha?: number; spineScale?: number; inside?: (q: Painter) => void} = {}) => {
  const {mx, my, k} = place;
  const g = crGeom(mx, my, k, o.jawOpen ?? 1, o.spineScale ?? 1);
  // BLOOP-BRIEF-R5 H02: the crosshatch spacing scales with the creature's size and fades out at small size (no net)
  const hs = Math.max(0.2, o.hatchScale ?? 1), ha = Math.max(0, Math.min(1, o.hatchAlpha ?? 1));
  const hatchColour = mixColor('#071017', '#16283a', 1 - ha);
  const {brush} = p;
  p.group(600);
  g.spines.forEach((sp) => p.flat('#0a141b', sp));
  p.flat('#16283a', g.head);
  const top = my - 790 * k, bot = my + 600 * k, hx = mx + 60 * k;
  p.wash('#0a131b', 220, scaleAbout(g.head, hx, top, 0.95, 0.5), 0.25, 0.4);
  p.wash('#1f3a46', 160, scaleAbout(g.head, hx, my, 0.78, 0.62), 0.25, 0.45);
  p.wash('#3c6672', 150, scaleAbout(g.head, hx, bot, 0.92, 0.32), 0.25, 0.5);
  p.wash('#06090e', 200, scaleAbout(g.head, hx, bot, 0.8, 0.14), 0.25, 0.3);
  p.wash('#060b10', 140, g.head.map(([x, y]) => [x, y] as Pt), 0.35, 0.3);
  p.wash('#1a3140', 160, g.head.map(([x, y]) => [mx + 60 + (x - mx - 60) * 0.72, my - 120 + (y - my + 120) * 0.72] as Pt), 0.25, 0.5);
  // skin mottle: the faint dark blobs left of the head at small k (H09) are gone below k 0.5 (mottleAlpha)
  const mottleA = o.mottleAlpha ?? 1;
  const mp = mottleA < 1 ? p.layer(mottleA, 9400) : p;
  if (mottleA > 0) for (let i = 0; i < 26; i++) {
    const x = mx - 420 + 900 * hash(i + 700), y = my - 600 * k + 520 * k * hash(i + 701);
    mp.wash(hash(i + 702) > 0.5 ? '#0d1a22' : '#2a4652', 110, ring(x, y, 30 + 50 * hash(i + 703), 20 + 30 * hash(i + 704), 12), 0.3, 0.6);
  }
  // crown crosshatch: two passes at irregular spacing and angle so the texture never repeats as a tile
  if (ha > 0) {
    brush.hatchStyle('HB', hatchColour, 1.2);
    brush.hatch(9 * hs, 0.62, {rand: 0.35, continuous: false, gradient: 0.4});
    brush.noStroke();
    brush.polygon(scaleAbout(g.head, hx, top, 0.9, 0.52));
    brush.hatch(13 * hs, -0.43, {rand: 0.35, continuous: false, gradient: 0.4});
    brush.polygon(scaleAbout(g.head, hx, top, 0.9, 0.52));
    brush.noHatch();
  }
  p.inkStill(610, '2B', '#02060a', 3.2);
  g.ridges.forEach((r) => brush.spline(r, 0.5));
  p.inkStill(611, 'HB', '#7fb0ba', 1.6);
  g.ridges.forEach((r) => brush.spline(r.map(([x, y]) => [x, y + 8] as Pt), 0.5));
  g.eyes.forEach(({c: [x, y], r, sx}) => p.wash('#04080c', 200, ring(x, y - r * 0.9, r * 2 * sx, r * 0.9, 16), 0.2, 0.4));
  p.inkStill(612, 'marker', '#5f99a8', 3);
  brush.spline(g.jawLight, 0.5);
  p.flat('#2c1820', g.mouth);
  p.wash('#3c1d27', 230, g.gum, 0.1, 0.4);
  p.wash('#160a10', 240, g.gum.map(([x, y]) => [mx + 40 * k + (x - mx - 40 * k) * 0.85, my + 60 * k + (y - my - 60 * k) * 0.85] as Pt), 0.2, 0.4);
  p.flat('#030204', g.throat);
  p.wash('#000000', 230, g.throat.map(([x, y]) => [mx + 40 * k + (x - mx - 40 * k) * 1.25, my + 80 * k + (y - my - 80 * k) * 1.2] as Pt), 0.3, 0.3);
  const ap = o.aperture ?? 0;
  if (ap > 0) p.flat('#000000', scaleAbout(g.mouth, mx + 40 * k, my + 90 * k, 0.45 + 0.55 * ap, 0.4 + 0.58 * ap));
  // inside the mouth (BLOOP-BRIEF-R5 H01): the swallowed ice and the hydrophone are drawn after the throat black, before the teeth
  o.inside?.(makePainter(brush, {t: p.t, frame: p.frame, fade: '#0b1622'}));
  [...g.inner, ...g.teeth].forEach((t) => {
    p.flat('#b9bcb0', t);
    p.wash('#5b625c', 180, [t[0], t[1], t[3], t[4]], 0.05, 0.3);
  });
  p.inkStill(613, 'pen', '#101310', 1.3);
  [...g.inner, ...g.teeth].forEach((t) => brush.spline(t, 0.3));
  p.inkStill(614, 'HB', '#e6e8de', 1.2);
  g.teeth.forEach((t) => brush.line(t[1][0], t[1][1], t[2][0], t[2][1]));
  p.inkStill(615, 'HB', '#c5e3ea', 2);
  brush.spline(g.lipLight, 0.5);
  g.eyes.forEach(({c: [x, y], r, sx}, i) => {
    p.flat('#020508', ring(x, y, (r + 12 * k) * sx, r + 8 * k, 20));
    p.flat('#2f5f60', ring(x, y, r * sx, r * 0.82, 20));
    p.wash('#7fb3ad', 230, ring(x - r * 0.1 * sx, y - r * 0.1, r * 0.75 * sx, r * 0.62, 18), 0.15, 0.3);
    p.wash('#d9f2ea', 200, ring(x - r * 0.3 * sx, y - r * 0.3, r * 0.35 * sx, r * 0.3, 14), 0.2, 0.3);
    p.flat('#010203', ring(x + r * 0.1 * sx, y, Math.max(3, r * 0.16 * sx), r * 0.74, 14));
    p.flat('#ffffff', ring(x - r * 0.35 * sx, y - r * 0.35, Math.max(3, r * 0.15), Math.max(3, r * 0.15), 10));
    p.inkStill(620 + i, 'pen', '#010305', 1.6);
    brush.spline(ring(x, y, r * sx, r * 0.82, 20), 0.3);
  });
  for (let i = 0; i < 16; i++) {
    const u = i / 15, lx = -560 + u * 1180;
    if (Math.abs(lx) <= 330) continue;
    const [x, y] = g.T([lx, -120 + 120 * Math.sin(u * 9) - 180 * hash(i + 200)]);
    p.flat('#cfe9f2', ring(x, y, 4, 4, 8));
  }
  p.inkStill(630, '2B', '#010407', 2.2);
  brush.spline(g.head, 0.5);
};

/** The creature's mouth polygon in world px at placement `place`, with the jaw at `jaw` (the lip-line test, H03). */
export const crRealMouthWorld = (mouthX: number, mouthY: number, geomK: number, jaw = 1): Pt[] => {
  const place = crRealPlace(mouthX, mouthY, geomK);
  return crGeom(place.mx, place.my, place.k, jaw).mouth;
};

/**
 * The P1-P2 silhouette (BLOOP-BRIEF-R5 H01/H07): a flat dark head and crown spines (`#08111a`), no interior detail, and four
 * cold eye glints at the CP3 eye positions. Drawn at the silhouette's own alpha under the detailed creature.
 */
export const paintCrSilhouette = (p: Painter, place: {mx: number; my: number; k: number}, spineScale = 1) => {
  const g = crGeom(place.mx, place.my, place.k, 1, spineScale);
  g.spines.forEach((sp) => p.flat('#08111a', sp));
  p.flat('#08111a', g.head);
  g.eyes.forEach((e) => {
    const r = Math.max(3, e.r * 0.28);
    p.wash('#cfe9f2', 230, ring(e.c[0], e.c[1], r, r, 10), 0.05, 0.1);
  });
};

/** The creature's upper lip line in world px at `place` (H10: the hydrophone's lip-line frame, the upper lip passes hyd.center). */
export const crRealUpperLipWorld = (mouthX: number, mouthY: number, geomK: number): Pt[] => {
  const place = crRealPlace(mouthX, mouthY, geomK);
  const g = crGeom(place.mx, place.my, place.k, 1);
  return g.upLine.map((q) => g.T(q));
};
/** The gum polygon in world px (H10: the swallowed ice is capped at 0.8 of its width and height). */
export const crRealGum = (mouthX: number, mouthY: number, geomK: number, jaw = 1): Pt[] => {
  const place = crRealPlace(mouthX, mouthY, geomK);
  return crGeom(place.mx, place.my, place.k, jaw).gum;
};
/** The throat centroid in world px (H10: the swallowed ice and hydrophone are centred on the throat). */
export const crRealThroatCentre = (mouthX: number, mouthY: number, geomK: number, jaw = 1): Pt => {
  const place = crRealPlace(mouthX, mouthY, geomK);
  return centroid(crGeom(place.mx, place.my, place.k, jaw).throat);
};

/**
 * CRD-2 in profile (the L-B2 drawing, head left), one soft silhouette (BLOOP-BRIEF-R7 H09; ported from Film's spike
 * `profileSilhouette`, not imported). Built in drawing units (snout x -40 … fin x 1560, head centre (300, 560)), scaled
 * so the full length is `len` px, centred on the head at (hx, hy). `bend` = tail undulation phase (radians): the spine's
 * lateral offset is 0.07 · len · sin(bend - 3.2 u) over the body (u 0 at the gills, 1 at the tail); the head is fixed.
 * `sx` foreshortens the profile horizontally about the head centre (the P2 turn).
 */
export const profileParts = (hx: number, hy: number, len: number, bend: number, sx = 1) => {
  const sc = len / 1600;
  const spineRaw: Pt[] = [[420, 560], [700, 565], [920, 590], [1130, 575], [1380, 540]];
  const spine = bez(spineRaw, 40).map(([x, y], i, a) => {
    const u = i / (a.length - 1);
    return [x, y + 0.07 * 1600 * u * Math.sin(bend - 3.2 * u)] as Pt;
  });
  const {top, bot} = tube(spine, (u) => 470 - u * 360);
  const end = spine[spine.length - 1], endTop = top[top.length - 1], endBot = bot[bot.length - 1];
  const fin: Pt[] = [endTop, [end[0] + 120, end[1] - 170], [end[0] + 180, end[1] - 150], [end[0] + 90, end[1]], [end[0] + 180, end[1] + 150], [end[0] + 120, end[1] + 170], endBot];
  const head: Pt[] = [[560, 290], [330, 250], [130, 320], [-20, 470], [-40, 640], [60, 790], [280, 860], [520, 830], [640, 700]];
  const dorsal: Pt[] = [[700, 380], [780, 250], [900, 270], [950, 400]];
  const pect: Pt[] = [[600, 760], [700, 930], [840, 950], [780, 790]];
  const T = ([x, y]: Pt): Pt => [hx + (x - 300) * sc * sx, hy + (y - 560) * sc];
  const glint = (x: number, y: number, r: number): {c: Pt; r: number} => ({c: T([x, y]), r: Math.min(5, Math.max(3, r * sc * 0.6))});
  return {
    body: [...top, ...fin.slice(1, -1), ...bot.slice().reverse()].map(T),
    head: closed(head, 40).map(T),
    fins: [closed(dorsal, 16).map(T), closed(pect, 16).map(T)],
    headCore: scaleAbout(closed(head, 40).map(T), T([300, 560])[0], T([300, 560])[1], 0.8, 0.8),
    eyes: [glint(160, 470, 30), glint(250, 380, 22)],
  };
};
/** Paint the profile silhouette: washes only (no ink), a slightly darker head core, the two near-side cold glints. */
export const paintFarProfile = (p: Painter, hx: number, hy: number, len: number, bend: number, o: {tone?: string; sx?: number} = {}) => {
  const tone = o.tone ?? '#132332';
  const s = profileParts(hx, hy, len, bend, o.sx ?? 1);
  s.fins.forEach((f) => p.wash(tone, 230, f, 0.1, 0.2));
  p.wash(tone, 245, s.body, 0.1, 0.2);
  p.wash(tone, 250, s.head, 0.1, 0.2);
  p.wash('#09141f', 150, s.headCore, 0.2, 0.2);
  s.eyes.forEach(({c: [x, y], r}) => p.flat('#a9d8d2', ring(x, y, r, r * 0.85, 10)));
};
/**
 * The P2 turn body (H09; spike `paintTurnBody`): the foreshortened body and tail trailing up-right behind the front head,
 * in the silhouette tone. `headW` is the creature's head width in px at the current scale.
 */
export const paintTurnBody = (p: Painter, mouth: Pt, headW: number, o: {tone?: string; alpha?: number} = {}) => {
  const tone = o.tone ?? '#132332';
  const q = (o.alpha ?? 1) < 1 ? p.layer(o.alpha ?? 1, 9500) : p;
  const [mx, my] = mouth;
  const base: Pt = [mx + 0.1 * headW, my - 0.25 * headW];
  const ang = -0.55, L = 1.25 * headW;
  const dir: Pt = [Math.cos(ang), Math.sin(ang)], nrm: Pt = [-dir[1], dir[0]];
  const w = (u: number) => headW * (0.42 - 0.34 * u);
  const sp = range(16, (u) => [base[0] + dir[0] * L * u + nrm[0] * 0.08 * headW * Math.sin(u * 3), base[1] + dir[1] * L * u + nrm[1] * 0.08 * headW * Math.sin(u * 3)] as Pt);
  const side = (sg: number) => sp.map(([x, y], i) => [x + nrm[0] * sg * w(i / 16), y + nrm[1] * sg * w(i / 16)] as Pt);
  const tip = sp[16];
  const fin: Pt[] = [[tip[0] + dir[0] * 0.25 * headW + nrm[0] * 0.22 * headW, tip[1] + dir[1] * 0.25 * headW + nrm[1] * 0.22 * headW], [tip[0] + dir[0] * 0.12 * headW, tip[1] + dir[1] * 0.12 * headW], [tip[0] + dir[0] * 0.25 * headW - nrm[0] * 0.22 * headW, tip[1] + dir[1] * 0.25 * headW - nrm[1] * 0.22 * headW]];
  q.wash(tone, 245, [...side(1), ...fin, ...side(-1).reverse()], 0.12, 0.2);
};
/** The creature's head width in px at placement scale `geomK` (CP3 head 1108 · geomK). */
export const crRealHeadWidth = (geomK: number) => 1108 * geomK;
