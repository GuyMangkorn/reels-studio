import {hash} from '../hash';
import {range, ring, type Painter, type Pt} from '../painter';
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

/**
 * CR-DREAM (CRD-2, L-B2): a huge plated head with two stacked eyes per side, an underbite of bony blades and a short
 * tapering body. Drawn in spike-local coordinates under `place` = {s, tx, ty} (world = s * local + t). Loose boiling ink.
 */
export const paintDreamCreature = (p: Painter, place: {s: number; tx: number; ty: number}) => {
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
const crGeom = (mx: number, my: number, k: number, jaw = 1) => {
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
    return [[bx - 22 * k, by + 40 * k], [tx, ty], [bx + 22 * k, by + 40 * k]] as Pt[];
  });
  const lipLight = bez(tm([[-420, -200], [-120, -265], [200, -265], [460, -190]]), 20);
  const jawLight = bez(([[-640, 160], [-450, 480], [0, 620], [460, 490], [660, 160]] as Pt[]).map(T), 30);
  // FR02 jawOpen: the lower lip, gum, lower teeth, throat and lower jaw light scale vertically about the upper lip line
  // (local y -225); the upper teeth, eyes and plates are fixed. jaw 0.25 leaves a dark slit under the upper fangs.
  const lipY = my + (40 + (-225 - 40) * 0.78) * k;
  const J = (q: Pt): Pt => (q[1] > lipY ? [q[0], lipY + (q[1] - lipY) * jaw] : q);
  const nLower = loLine.slice(1, -1).length;
  return {
    T, head,
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
export const paintCrReal = (p: Painter, place: {mx: number; my: number; k: number}, o: {aperture?: number; jawOpen?: number} = {}) => {
  const {mx, my, k} = place;
  const g = crGeom(mx, my, k, o.jawOpen ?? 1);
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
  for (let i = 0; i < 26; i++) {
    const x = mx - 420 + 900 * hash(i + 700), y = my - 600 * k + 520 * k * hash(i + 701);
    p.wash(hash(i + 702) > 0.5 ? '#0d1a22' : '#2a4652', 110, ring(x, y, 30 + 50 * hash(i + 703), 20 + 30 * hash(i + 704), 12), 0.3, 0.6);
  }
  // crown crosshatch: two passes at irregular spacing and angle so the texture never repeats as a tile
  brush.hatchStyle('HB', '#071017', 1.2);
  brush.hatch(9, 0.62, {rand: 0.35, continuous: false, gradient: 0.4});
  brush.noStroke();
  brush.polygon(scaleAbout(g.head, hx, top, 0.9, 0.52));
  brush.hatch(13, -0.43, {rand: 0.35, continuous: false, gradient: 0.4});
  brush.polygon(scaleAbout(g.head, hx, top, 0.9, 0.52));
  brush.noHatch();
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
