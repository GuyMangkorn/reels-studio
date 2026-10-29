import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BrushCanvas, hash, type Brush, type PaintContext} from '../BrushCanvas';

// Film style test for SHIPWRECK-SHORT: three painted shots switched by time, 3 s each, in a 1080x1920 frame.
// S1 calm crossing (golden hour), S2 storm (reconstruction), S3 the site today (~30 m, divers, jars half-buried).
// The ship is a generic Early Bronze Age eastern-Mediterranean cargo boat; its rig is a placeholder pending Film's brief.
// Glow and light (sun halo, lightning flash, sun shafts) are screen-blended Remotion layers above the canvas.

type Pt = [number, number];
const SHOT_LEN = 3;
const shotAt = (t: number) => (t < SHOT_LEN ? 1 : t < 2 * SHOT_LEN ? 2 : 3);

// Camera per shot: push `s` around focus (fx, fy) plus drift (dx, dy). Shared by the canvas and the overlays.
const camera = (shot: number, tl: number) => {
  const e = interpolate(tl, [0, SHOT_LEN], [0, 1], {easing: Easing.inOut(Easing.sin), extrapolateRight: 'clamp'});
  if (shot === 1) return {s: 1 + 0.05 * e, fx: 600, fy: 640, dx: -14 * e, dy: 0};
  if (shot === 2) return {s: 1.02 + 0.04 * e, fx: 540, fy: 700, dx: 10 * Math.sin(tl * 1.7), dy: 8 * Math.sin(tl * 2.3)};
  return {s: 1 + 0.06 * e, fx: 540, fy: 680, dx: 0, dy: -18 * e};
};
const toScreen = (shot: number, tl: number, [x, y]: Pt): Pt => {
  const c = camera(shot, tl);
  return [(x - c.fx) * c.s + c.fx + c.dx, (y - c.fy) * c.s + c.fy + c.dy];
};

// Scene-space positions shared by the paint and the overlays.
const SUN: Pt = [170, 655];
const BOLT_X = 850;
const flashAt = (tl: number) => {
  // One cold-light moment at shot-local 1.40-1.80 s: a strike, a dip, a re-strike.
  if (tl < 1.4 || tl > 1.8) return 0;
  const a = Math.exp(-(tl - 1.4) * 14);
  const b = tl > 1.48 ? 0.7 * Math.exp(-(tl - 1.48) * 10) : 0;
  return Math.min(1, a + b);
};

const rot = (cx: number, cy: number, s: number, a: number) => ([x, y]: Pt): Pt => [
  cx + s * (x * Math.cos(a) - y * Math.sin(a)),
  cy + s * (x * Math.sin(a) + y * Math.cos(a)),
];
const range = (n: number, f: (u: number, i: number) => Pt): Pt[] => Array.from({length: n + 1}, (_, i) => f(i / n, i));

type Painter = {
  brush: Brush;
  t: number;
  wash: (color: string, opacity: number, pts: Pt[], bleed?: number, texture?: number) => void;
  /** Flat underlayer (brush.wash): no bleed or texture, so watercolour gaps above it show colour, not paper. */
  flat: (color: string, pts: Pt[]) => void;
  ink: (id: number, name: string, color: string, weight: number) => void;
};

// EBA storage jar profile: half-width along the axis from mouth (u 0) to flat base (u 1), as fractions of length.
const JAR: [number, number][] = [
  [0, 0.12], [0.04, 0.12], [0.06, 0.085], [0.12, 0.09], [0.22, 0.24], [0.34, 0.3], [0.5, 0.31], [0.66, 0.28], [0.82, 0.21], [0.94, 0.15], [1, 0.14],
];
const jarHalf = (u: number) => {
  for (let i = 1; i < JAR.length; i++) {
    if (u <= JAR[i][0]) {
      const [u0, w0] = JAR[i - 1], [u1, w1] = JAR[i];
      return w0 + ((u - u0) / (u1 - u0)) * (w1 - w0);
    }
  }
  return JAR[JAR.length - 1][1];
};
/**
 * Round-bellied storage jar, two side handles, flat base. (cx, cy) is the jar centre; angle points mouth -> base.
 * `bury` is the screen y of the sand line: everything below it is not drawn, so the jar sits half-buried.
 */
const drawJar = (p: Painter, id: number, cx: number, cy: number, len: number, angle: number, o: {
  body: string; shade: string; ink: string; detail?: boolean; broken?: boolean; bury?: number;
}) => {
  const f = rot(cx, cy, len, angle);
  const cut = o.bury ?? Infinity;
  const clamp = ([x, y]: Pt): Pt => [x, Math.min(y, cut)];
  const at = (u: number, side: number): Pt => f([u - 0.5, side * jarHalf(u)]);
  const u0 = o.broken ? 0.3 : 0;
  const outline: Pt[] = [...range(14, (u) => at(u0 + u * (1 - u0), -1)), ...range(14, (u) => at(1 - u * (1 - u0), 1))];
  if (o.broken) outline.push(f([u0 - 0.5 + 0.07, 0.14]), f([u0 - 0.5 - 0.02, 0.03]), f([u0 - 0.5 + 0.06, -0.16]));
  p.wash(o.body, 240, outline.map(clamp), 0.05, 0.45);
  // Shade on whichever side faces down in screen space (light comes from above).
  const down = Math.cos(angle) >= 0 ? 1 : -1;
  if (o.detail !== false) {
    p.wash(o.shade, 180, [...range(8, (u) => at(u0 + 0.06 + u * (0.88 - u0), down * 0.1)), ...range(8, (u) => at(0.94 - u * (0.88 - u0), down * 0.97))].map(clamp), 0.1, 0.4);
  }
  p.ink(id, 'pen', o.ink, o.detail === false ? 1 : 1.3);
  p.brush.noFill();
  p.brush.polygon(outline.map(clamp));
  if (o.detail === false) return;
  // Side handles: loops at the shoulder on both sides, skipped where buried.
  for (const side of [-1, 1]) {
    const h: Pt[] = [f([-0.2, side * 0.25]), f([-0.15, side * 0.38]), f([-0.03, side * 0.39]), f([0.02, side * 0.3])];
    if (h.every(([, y]) => y < cut)) p.brush.spline(h, 0.6);
  }
  // Incised wavy band on the shoulder (the dating clue) and a rim line.
  if (!o.broken) {
    p.ink(id + 500, 'HB', o.ink, 1);
    const band = range(10, (u) => f([-0.24 + 0.012 * Math.sin(u * 18), (u * 2 - 1) * 0.25]));
    p.brush.spline(band.map(clamp), 0.5);
    p.brush.line(...clamp(at(0.04, -1)), ...clamp(at(0.04, 1)));
  }
};

/** Generic EBA cargo boat: long low hull, high curved posts, single square sail. (cx, cy) is mid-hull at the waterline. */
const drawShip = (p: Painter, id: number, cx: number, cy: number, s: number, heel: number, o: {
  hull: string; sail: string; sailShade: string; ink: string; rim?: string; jar: string; torn?: number;
}) => {
  const {brush, t} = p;
  const f = rot(cx, cy, s, heel);
  const sheer = (x: number) => -0.16 - 0.07 * Math.pow(Math.abs(x) / 0.78, 2.4);
  // Hull with the stern post sweeping up and inward (left) and a high bow post (right).
  const hull: Pt[] = [
    [-1.1, -0.72], [-1.04, -0.78], [-0.98, -0.66], [-0.9, -0.42], [-0.8, -0.24],
    ...range(14, (u) => [-0.78 + u * 1.56, sheer(-0.78 + u * 1.56)] as Pt),
    [0.86, -0.3], [0.95, -0.5], [1.0, -0.68], [1.08, -0.74], [1.1, -0.66], [1.04, -0.4], [0.94, -0.12], [0.84, 0.03],
    ...range(10, (u) => [0.8 - u * 1.6, 0.03 + 0.07 * (1 - Math.pow((0.8 - u * 1.6) / 0.85, 2))] as Pt),
    [-0.92, 0.0], [-1.04, -0.22], [-1.12, -0.5],
  ];
  // Cargo first: jar tops above the rail, then the hull in front of them.
  let j = 0;
  for (let x = -0.6; x <= 0.61; x += 0.1) {
    if (Math.abs(x) < 0.06) continue;
    const top = sheer(x) - 0.13 - 0.02 * hash(id + j);
    const c = f([x, top + 0.09]);
    drawJar(p, id * 40 + j++, c[0], c[1], s * 0.19, heel + Math.PI / 2, {body: o.jar, shade: o.hull, ink: o.ink, detail: false});
  }
  p.wash(o.hull, 245, hull.map(f), 0.04, 0.35);
  p.wash(o.hull, 200, hull.map(f), 0.03, 0.5);
  // Steering oar on the stern quarter.
  p.wash(o.hull, 240, [[-0.8, -0.38], [-0.77, -0.36], [-1.08, 0.06], [-1.16, 0.1], [-1.13, 0.02]].map((q) => f(q as Pt)), 0.05, 0.3);
  // Mast, yard and boom.
  p.ink(id + 1, '2B', o.ink, 2.4);
  brush.line(...f([0, sheer(0)]), ...f([0, -1.32]));
  const yard: Pt[] = [[-0.66, -1.13], [0, -1.2], [0.66, -1.13]];
  const boom: Pt[] = [[-0.6, -0.42], [0, -0.4], [0.6, -0.42]];
  const torn = o.torn ?? 0;
  // Sail: belly sways a little; when torn, the lower leeward corner is gone and strips flap.
  const belly = 0.03 * Math.sin(t * 1.3);
  const sail: Pt[] = [
    [-0.64, -1.13], [0, -1.19], [0.64, -1.13],
    ...(torn > 0 ? ([[0.58, -0.98], [0.46, -0.9], [0.4, -0.76], [0.26, -0.72], [0.2, -0.6], [0.08, -0.56], [0.04, -0.45]] as Pt[]) : ([[0.62 + belly, -0.78], [0.58, -0.43]] as Pt[])),
    [0, -0.41 - belly], [-0.58, -0.43], [-0.62 + belly, -0.78],
  ];
  p.wash(o.sail, 235, sail.map(f), 0.08, 0.5);
  p.wash(o.sailShade, 150, [[-0.62, -0.95], [-0.2, -1.0], [-0.1, -0.44], [-0.58, -0.43]].map((q) => f(q as Pt)), 0.2, 0.5);
  p.ink(id + 2, '2B', o.ink, 1.6);
  brush.spline(yard.map(f), 0.5);
  if (!torn) brush.spline(boom.map(f), 0.5);
  else brush.line(...f([-0.6, -0.42]), ...f([0.1, -0.4]));
  // Rigging: stays and lifts as thin pen lines.
  p.ink(id + 3, 'HB', o.ink, 1.1);
  brush.line(...f([0, -1.32]), ...f([1.0, -0.66]));
  brush.line(...f([0, -1.32]), ...f([-0.98, -0.66]));
  brush.line(...f([0, -1.32]), ...f([-0.66, -1.13]));
  brush.line(...f([0, -1.32]), ...f([0.66, -1.13]));
  // Hull outline, wale and rail.
  p.ink(id + 4, '2B', o.ink, 1.5);
  brush.noFill();
  brush.polygon(hull.map(f));
  brush.spline(range(10, (u) => f([-0.82 + u * 1.64, sheer(-0.82 + u * 1.64) + 0.07])), 0.4);
  for (let x = -0.7; x <= 0.71; x += 0.07) brush.line(...f([x, sheer(x)]), ...f([x, sheer(x) - 0.06]));
  brush.spline(range(10, (u) => f([-0.72 + u * 1.44, sheer(-0.72 + u * 1.44) - 0.06])), 0.4);
  if (torn > 0) {
    p.ink(id + 5, 'HB', o.ink, 1.2);
    for (let k = 0; k < 4; k++) {
      const ax = 0.1 + k * 0.12, ay = -0.6 - k * 0.1;
      const sw = 0.1 * Math.sin(t * 9 + k * 1.9);
      brush.spline([f([ax, ay]), f([ax + 0.16, ay + 0.08 + sw]), f([ax + 0.34, ay + 0.04 - sw]), f([ax + 0.46, ay + 0.1 + sw])], 0.6);
    }
  }
  // Distant crew: silhouettes only, no faces. Helmsman at the oar, one figure amidships.
  for (const [hx, lean] of [[-0.74, -0.2], [0.3, 0.1]] as [number, number][]) {
    const b = sheer(hx) - 0.04;
    p.wash(o.ink, 245, [[hx - 0.03, b], [hx + 0.03, b], [hx + 0.025 + lean * 0.1, b - 0.18], [hx - 0.025 + lean * 0.1, b - 0.18]].map((q) => f(q as Pt)), 0.02, 0.2);
    p.wash(o.ink, 245, range(8, (u) => [hx + lean * 0.12 + 0.03 * Math.cos(u * 6.283), b - 0.22 + 0.034 * Math.sin(u * 6.283)] as Pt).map(f), 0.02, 0.2);
  }
  if (o.rim) {
    p.ink(id + 6, 'HB', o.rim, 1.2);
    brush.spline([f([-1.04, -0.78]), f([-0.95, -0.6]), f([-0.82, -0.3])], 0.5);
    brush.spline([f([-0.64, -1.13]), f([-0.63, -0.78]), f([-0.58, -0.45])], 0.5);
  }
};

const waveY = (x: number, base: number, amp: number, t: number, k: number) =>
  base + amp * (Math.sin(x * 0.006 * k + t * 0.9) * 0.6 + Math.sin(x * 0.013 * k - t * 1.3 + 1.7) * 0.4);

// ---- S1: calm crossing at golden hour ----
const paintCalm = (p: Painter, W: number, H: number) => {
  const {brush, t} = p;
  p.wash('#3e3b5e', 230, [[-80, -80], [W + 80, -80], [W + 80, 560], [-80, 600]], 0.2, 0.55);
  p.wash('#b8664a', 200, [[-80, 330], [W + 80, 380], [W + 80, 740], [-80, 740]], 0.3, 0.45);
  p.wash('#f2b25c', 190, [[-80, 540], [W + 80, 590], [W + 80, 735], [-80, 735]], 0.35, 0.35);
  p.wash('#ffe2a0', 220, range(16, (u) => [SUN[0] + 56 * Math.cos(u * 6.283), SUN[1] + 56 * Math.sin(u * 6.283)] as Pt), 0.25, 0.2);
  // Thin cloud streaks lit from below.
  p.wash('#7d4a63', 160, [[-80, 430], [520, 410], [760, 440], [380, 462], [-80, 470]], 0.3, 0.6);
  p.wash('#8e5568', 140, [[560, 520], [W + 80, 495], [W + 80, 528], [700, 545]], 0.3, 0.6);
  // Sea below the horizon at y 728, darker toward the viewer.
  p.flat('#2e2a44', [[-120, 728], [W + 120, 728], [W + 120, H + 120], [-120, H + 120]]);
  const seaBands = ['#4a4060', '#3d3656', '#332e4c', '#2b2742', '#25223a', '#211e34'];
  seaBands.forEach((c, i) => p.wash(c, 200, [[-120, 724 + i * 220], [W + 120, 724 + i * 220], [W + 120, 1110 + i * 220], [-120, 1110 + i * 220]], 0.03, 0.4));
  p.wash('#b8784c', 110, [[SUN[0] - 40, 730], [SUN[0] + 40, 730], [SUN[0] + 130, 1150], [SUN[0] - 90, 1150]], 0.12, 0.6);
  // Glitter on the sun path and long swell lines elsewhere; phases from hash so they drift and never jump.
  p.ink(10, 'HB', '#f6c77a', 1.4);
  for (let i = 0; i < 46; i++) {
    const y = 735 + Math.pow(hash(i), 1.6) * 650;
    const spread = 60 + (y - 730) * 0.33;
    const x = SUN[0] + (hash(i + 31) * 2 - 1) * spread + 10 * Math.sin(t * 2 + i);
    const len = 12 + (y - 730) * 0.08;
    brush.line(x, y, x + len, y + 1);
  }
  p.ink(11, 'HB', '#6b5f86', 1.2);
  for (let i = 0; i < 26; i++) {
    const y = 760 + hash(i + 70) * 1050;
    const len = 80 + (y - 700) * 0.25;
    const x = ((hash(i + 90) * (W + 400) + t * (10 + hash(i + 5) * 14)) % (W + 400)) - 200;
    brush.line(x, y, x + len, y + 3);
  }
  const bob = 4 * Math.sin(t * 1.6);
  drawShip(p, 100, 600, 805 + bob, 360, 0.02 * Math.sin(t * 1.3), {
    hull: '#2c1f24', sail: '#9a5a3c', sailShade: '#6a3a30', ink: '#1a1216', rim: '#ffc46e', jar: '#4a3030',
  });
  // Sea in front of the hull bottom, with a broken waterline highlight.
  p.wash('#463d5e', 240, [...range(16, (u) => [140 + u * 920, waveY(140 + u * 920, 808 + bob, 5, t, 2)] as Pt), [1060, 870], [140, 870]], 0.06, 0.4);
  p.ink(12, 'HB', '#e8a868', 1.2);
  for (let k = 0; k < 5; k++) brush.line(250 + k * 150, 812 + bob, 330 + k * 150, 813 + bob);
};

// ---- S2: storm (dramatised reconstruction) ----
const paintStorm = (p: Painter, W: number, H: number, tl: number) => {
  const {brush, t} = p;
  const fl = flashAt(tl);
  p.wash('#262e38', 240, [[-80, -80], [W + 80, -80], [W + 80, 760], [-80, 760]], 0.2, 0.6);
  p.wash('#4a5664', 170, [[-80, 360], [W + 80, 300], [W + 80, 700], [-80, 720]], 0.35, 0.6);
  p.wash('#171c24', 210, [[-80, 120], [300, 60], [640, 160], [W + 80, 90], [W + 80, 300], [620, 360], [260, 300], [-80, 360]], 0.4, 0.6);
  // Lightning behind the ship, only during the flash (its glow is the Remotion layer).
  if (fl > 0.05) {
    p.ink(20, 'marker', '#eef4ff', 1.6);
    const bolt: Pt[] = range(7, (u, i) => [BOLT_X + (i === 0 ? 0 : (hash(i + 3) * 2 - 1) * 60), u * 640] as Pt);
    for (let i = 0; i < bolt.length - 1; i++) brush.line(...bolt[i], ...bolt[i + 1]);
    brush.line(...bolt[3], bolt[3][0] + 90, bolt[3][1] + 120);
  }
  // Far swell.
  p.wash('#1e2c36', 240, [...range(20, (u) => [-80 + u * (W + 160), waveY(-80 + u * (W + 160), 700, 50, t * 2, 1)] as Pt), [W + 80, H + 80], [-80, H + 80]], 0.2, 0.5);
  const bob = 18 * Math.sin(t * 1.8);
  const heel = -0.22 + 0.07 * Math.sin(t * 1.8 + 0.6);
  drawShip(p, 200, 540, 760 + bob, 330, heel, {
    hull: '#1c1714', sail: '#8d877a', sailShade: '#4e4a44', ink: '#0f0c0b', jar: '#2e2622', torn: 1,
  });
  // Front swell crest hiding the hull bottom, then the near water.
  const crest = (x: number) => waveY(x, 800, 38, t * 2.4, 1.6) + 30 * Math.exp(-Math.pow((x - 260) / 180, 2)) * -1;
  p.wash('#1b2b34', 245, [...range(24, (u) => [-80 + u * (W + 160), crest(-80 + u * (W + 160))] as Pt), [W + 80, H + 80], [-80, H + 80]], 0.15, 0.5);
  p.wash('#101a20', 220, [[-80, 1200], [W + 80, 1150], [W + 80, H + 80], [-80, H + 80]], 0.3, 0.5);
  // Foam on the crests and long streaks on the face of the swell.
  p.ink(21, 'charcoal', '#bcc8c8', 1.3);
  for (let k = 0; k < 9; k++) {
    const x0 = -60 + k * 130 + 40 * hash(k + 70);
    brush.spline(range(4, (u) => [x0 + u * (60 + 50 * hash(k + 71)), crest(x0 + u * 100) + 4] as Pt), 0.5);
  }
  p.ink(22, 'HB', '#9fb0b4', 1.3);
  for (let i = 0; i < 34; i++) {
    const y = 840 + hash(i + 11) * 1000;
    const x = ((hash(i + 13) * (W + 400) - t * (60 + hash(i) * 50)) % (W + 400) + W + 400) % (W + 400) - 200;
    const len = 60 + hash(i + 17) * 160;
    brush.line(x, y, x + len, y - len * 0.12);
  }
  // Spray thrown off the crest around the bow.
  p.ink(23, 'spray', '#dfe6e6', 1.8);
  for (let k = 0; k < 6; k++) {
    const sx = 700 + k * 30, sy = crest(700 + k * 30);
    brush.line(sx, sy, sx + 40 + k * 8, sy - 70 - 20 * Math.sin(t * 3 + k));
  }
};

// ---- S3: the site today, ~30 m, divers over the jars ----
// Jars back to front (sorted by cy): cx, cy, length, angle (mouth -> base), broken, depth layer (0 far haze, 1 mid, 2 near).
const SITE_JARS: [number, number, number, number, boolean, number][] = [
  [470, 505, 100, Math.PI - 0.2, false, 0],
  [250, 515, 110, 0.1, false, 0],
  [770, 520, 115, 0.4, false, 0],
  [180, 610, 165, 1.25, false, 1],
  [700, 600, 175, 0.15, false, 1],
  [430, 615, 180, Math.PI + 0.2, false, 1],
  [920, 650, 150, Math.PI - 0.5, false, 1],
  [560, 700, 250, 1.15, false, 2],
  [270, 740, 270, -0.2, false, 2],
  [800, 760, 260, Math.PI + 0.1, true, 2],
  [500, 820, 220, 0.12, true, 2],
];
const JAR_LOOK = [
  {body: '#7d7f6c', shade: '#55605a', ink: '#3c4a48', sand: '#8a957c'},
  {body: '#9a6644', shade: '#5a3f34', ink: '#2a1e1a', sand: '#979a7e'},
  {body: '#a45f3a', shade: '#55342a', ink: '#22160f', sand: '#a19f82'},
];
/** Diver silhouette, no face. Head points along local +x; `mirror` flips it to face left. Returns the reaching hand. */
const drawDiver = (p: Painter, id: number, x: number, y: number, s: number, a: number, kick: number, color: string, mirror: boolean): Pt => {
  const r = rot(x, y, s, a);
  const f = ([u, v]: Pt): Pt => r([mirror ? -u : u, v]);
  const part = (pts: Pt[]) => {
    p.wash(color, 245, pts.map(f), 0.02, 0.3);
    p.wash(color, 200, pts.map(f), 0.02, 0.5);
  };
  part([[-0.42, -0.34], [0.32, -0.3], [0.36, -0.16], [-0.42, -0.16]]); // tank
  part([[-0.6, -0.15], [0.38, -0.17], [0.62, -0.1], [0.62, 0.1], [0.38, 0.15], [-0.6, 0.12]]); // torso
  part(range(10, (u) => [0.8 + 0.14 * Math.cos(u * 6.283), 0.13 * Math.sin(u * 6.283)] as Pt)); // head
  part([[-0.6, -0.12], [-1.2, -0.12 + kick], [-1.65, -0.24 + 2 * kick], [-1.7, -0.08 + 2 * kick], [-1.2, -0.02 + kick], [-0.6, 0.0]]); // leg + fin
  part([[-0.6, 0.02], [-1.2, 0.08 - kick], [-1.62, 0.18 - 2 * kick], [-1.6, 0.3 - 2 * kick], [-1.2, 0.18 - kick], [-0.6, 0.12]]);
  part([[0.42, 0.06], [0.5, 0.14], [0.98, 0.5], [0.92, 0.56]]); // reaching arm
  part([[0.4, -0.04], [0.48, 0.04], [1.05, 0.1], [1.04, 0.02]]); // arm with lamp
  return f([0.96, 0.55]);
};
const paintSite = (p: Painter, W: number, H: number) => {
  const {brush, t} = p;
  // Water column: lighter blue-green toward the surface, deep teal toward the bed. Bands keep bleed low.
  p.flat('#3f8a90', [[-120, -120], [W + 120, -120], [W + 120, 520], [-120, 520]]);
  p.flat('#7f8f74', [[-120, 500], [W + 120, 500], [W + 120, H + 120], [-120, H + 120]]);
  const water = ['#7cbcb4', '#5aa3a2', '#3f8a90', '#2f747e', '#2a6670'];
  water.forEach((c, i) => p.wash(c, 235, [[-120, -100 + i * 130], [W + 120, -100 + i * 130], [W + 120, 120 + i * 130], [-120, 120 + i * 130]], 0.04, 0.5));
  // Seabed: sand fading into haze at y ~ 480, rock outcrops to the sides and in the foreground.
  const sand = ['#7f907a', '#97a084', '#aba88a', '#a5a184', '#8e9478', '#76846c', '#62735f', '#4f6152', '#405248'];
  sand.forEach((c, i) => p.wash(c, 200, [[-120, 470 + i * 170 + (i ? 0 : 10)], [W + 120, 460 + i * 170], [W + 120, 820 + i * 170], [-120, 830 + i * 170]], 0.03, 0.4));
  p.wash('#3f5a58', 235, [[-80, 470], [80, 455], [170, 520], [120, 600], [-80, 650]], 0.06, 0.6);
  p.wash('#405c5a', 235, [[W + 80, 450], [960, 470], [930, 560], [990, 610], [W + 80, 640]], 0.06, 0.6);
  p.wash('#435a4e', 225, [[-80, 980], [220, 930], [420, 990], [480, 1080], [-80, 1120]], 0.06, 0.6);
  p.wash('#3c5248', 225, [[W + 80, 960], [820, 940], [700, 1010], [760, 1100], [W + 80, 1120]], 0.06, 0.6);
  // Jars, each half-buried: a sand drift over its lower side, in the local sand colour.
  SITE_JARS.forEach(([cx, cy, len, a, broken, layer], i) => {
    const look = JAR_LOOK[layer];
    const bury = cy + len * (0.1 + 0.08 * hash(i + 120));
    // Shadow pit, the jar clipped at the sand line, then a low sand lip over the cut.
    p.wash('#5f6a58', 150, [[cx - len * 0.5, bury - 4], [cx + len * 0.5, bury - 4], [cx + len * 0.42, bury + 22], [cx - len * 0.42, bury + 22]], 0.1, 0.5);
    drawJar(p, 300 + i * 10, cx, cy, len, a, {...look, broken, detail: layer > 0, bury});
    p.wash(look.sand, 225, [[cx - len * 0.62, bury + 8], ...range(8, (u) => [cx - len * 0.56 + u * len * 1.12, bury - 6 * Math.sin(u * 3.14) - 3 * hash(i * 9 + u * 8)] as Pt), [cx + len * 0.62, bury + 10], [cx + len * 0.4, bury + 26], [cx - len * 0.4, bury + 26]], 0.06, 0.5);
  });
  // Caustic net on the sand: wavy pale lines that drift with time.
  p.ink(30, 'HB', '#e4edcf', 1.1);
  for (let i = 0; i < 18; i++) {
    const y0 = 520 + hash(i + 40) * 420;
    const x0 = hash(i + 41) * W;
    brush.spline(range(4, (u) => [x0 - 90 + u * 180, y0 + 14 * Math.sin(u * 5 + t * 1.4 + i)] as Pt), 0.7);
  }
  // Small fish: dark slivers drifting in a loose school, behind the divers.
  const fish = range(8, (_, i) => [600 + hash(i + 60) * 300 - t * 18 + 10 * Math.sin(t * 2 + i), 300 + hash(i + 61) * 120] as Pt);
  for (const [fx, fy] of fish) p.wash('#1d4a52', 235, [[fx, fy], [fx + 16, fy - 6], [fx + 30, fy], [fx + 16, fy + 6]], 0.02, 0.2);
  p.ink(43, '2B', '#1d4a52', 1.4);
  for (const [fx, fy] of fish) brush.line(fx + 30, fy, fx + 38, fy - 6);
  // Divers: the far one in the haze, the near one head-down over the cluster reaching a tape to the broken jar.
  const kick = 0.05 * Math.sin(t * 3);
  drawDiver(p, 41, 230, 360, 95, 0.25, -kick, '#3d6c72', false);
  const hand = drawDiver(p, 40, 760, 400, 175, -0.55, kick, '#0f2b33', true);
  p.ink(42, 'HB', '#e6cf5c', 1.5);
  brush.spline([hand, [hand[0] + 30, hand[1] + 150], [810, 745]], 0.4);
  // Seagrass blades on the foreground rocks, swaying.
  p.ink(44, 'HB', '#6f8a5a', 1.4);
  for (let i = 0; i < 26; i++) {
    const bx = i < 13 ? 20 + hash(i + 140) * 420 : 640 + hash(i + 140) * 420;
    const by = 990 + hash(i + 141) * 80;
    const h = 60 + hash(i + 142) * 90;
    const sw = 14 * Math.sin(t * 1.6 + i);
    brush.spline([[bx, by], [bx + sw * 0.5, by - h * 0.5], [bx + sw, by - h]], 0.6);
  }
};

const paint = ({brush, t, width: W, height: H, still, boil}: PaintContext) => {
  const shot = shotAt(t);
  const tl = t - (shot - 1) * SHOT_LEN;
  let washId = 0;
  const p: Painter = {
    brush,
    t,
    wash: (color, opacity, pts, bleed = 0.25, texture = 0.5) => {
      still(++washId);
      brush.noStroke();
      brush.fill(color, opacity);
      brush.fillBleed(bleed);
      brush.fillTexture(texture, 0.4);
      brush.polygon(pts);
      brush.noFill();
    },
    flat: (color, pts) => {
      brush.noStroke();
      brush.noFill();
      brush.wash(color, 255);
      brush.polygon(pts);
      brush.noWash();
    },
    ink: (id, name, color, weight) => {
      boil(id);
      brush.set(name, color, weight);
    },
  };
  const c = camera(shot, tl);
  brush.push();
  brush.translate(c.fx + c.dx, c.fy + c.dy);
  brush.scale(c.s);
  brush.translate(-c.fx, -c.fy);
  if (shot === 1) paintCalm(p, W, H);
  else if (shot === 2) paintStorm(p, W, H, tl);
  else paintSite(p, W, H);
  brush.pop();

  // Screen-space weather and particles (not pushed in).
  if (shot === 2) {
    p.ink(50, 'pen', '#c8d4dc', 1);
    for (let i = 0; i < 170; i++) {
      const speed = 1900 + hash(i + 300) * 700;
      const x0 = hash(i + 200) * (W + 500) - 100;
      const y = ((hash(i + 400) * (H + 200) + t * speed) % (H + 200)) - 100;
      const x = x0 - (y / H) * 420;
      brush.line(x, y, x - 24, y + 80);
    }
  }
  if (shot === 3) {
    p.ink(51, 'pen', '#d8ece4', 1);
    for (let i = 0; i < 90; i++) {
      const x = (hash(i + 500) * W + t * (6 + hash(i + 501) * 10)) % W;
      const y = (hash(i + 502) * H - t * (8 + hash(i + 503) * 12) + H) % H;
      brush.line(x, y, x + 3, y + 3);
    }
  }
};

const PAPER = ['', '#b89a86', '#8f989e', '#7fa8a4'];

const Overlays = ({shot, tl}: {shot: number; tl: number}) => {
  const screen = {mixBlendMode: 'screen' as const};
  if (shot === 1) {
    const [x, y] = toScreen(shot, tl, SUN);
    return (
      <AbsoluteFill style={screen}>
        <svg width="100%" height="100%" viewBox="0 0 1080 1920">
          <defs>
            <radialGradient id="sun" cx={x} cy={y} r={420} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ffe6b0" stopOpacity={0.9} />
              <stop offset="0.12" stopColor="#ffb860" stopOpacity={0.45} />
              <stop offset="1" stopColor="#ff8a40" stopOpacity={0} />
            </radialGradient>
          </defs>
          <rect width="1080" height="1920" fill="url(#sun)" />
        </svg>
      </AbsoluteFill>
    );
  }
  if (shot === 2) {
    const fl = flashAt(tl);
    if (fl <= 0) return null;
    const [x] = toScreen(shot, tl, [BOLT_X, 0]);
    return (
      <AbsoluteFill style={screen}>
        <svg width="100%" height="100%" viewBox="0 0 1080 1920">
          <defs>
            <radialGradient id="flash" cx={x} cy={260} r={1300} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#dce8ff" stopOpacity={0.85 * fl} />
              <stop offset="0.35" stopColor="#7f9cc8" stopOpacity={0.35 * fl} />
              <stop offset="1" stopColor="#3a4c70" stopOpacity={0.08 * fl} />
            </radialGradient>
          </defs>
          <rect width="1080" height="1920" fill="url(#flash)" />
        </svg>
      </AbsoluteFill>
    );
  }
  // S3: slanted sun shafts from the surface, each breathing on its own phase.
  const shafts = [120, 330, 560, 760, 940];
  return (
    <AbsoluteFill style={screen}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1920">
        <defs>
          <linearGradient id="shaft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d8fff0" stopOpacity={0.5} />
            <stop offset="0.6" stopColor="#9fe0d0" stopOpacity={0.12} />
            <stop offset="1" stopColor="#9fe0d0" stopOpacity={0} />
          </linearGradient>
          <radialGradient id="pool" cx={540} cy={700} r={420} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#c8f0d8" stopOpacity={0.22} />
            <stop offset="1" stopColor="#c8f0d8" stopOpacity={0} />
          </radialGradient>
        </defs>
        {shafts.map((x, i) => {
          const o = 0.55 + 0.45 * Math.sin(tl * 1.1 + i * 2.3);
          const w = 50 + hash(i + 900) * 70;
          const sx = x + 20 * Math.sin(tl * 0.5 + i);
          return <polygon key={x} points={`${sx},-20 ${sx + w},-20 ${sx + w + 260},1100 ${sx + 180},1100`} fill="url(#shaft)" opacity={o} />;
        })}
        <rect width="1080" height="1920" fill="url(#pool)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Shipwreck = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const shot = shotAt(t);
  return (
    <AbsoluteFill>
      <BrushCanvas paint={paint} paper={PAPER[shot]} />
      <Overlays shot={shot} tl={t - (shot - 1) * SHOT_LEN} />
    </AbsoluteFill>
  );
};
