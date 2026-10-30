import {loadFont} from '@remotion/fonts';
import {useCallback, useId, type ReactNode} from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {applyCamera, CameraLayer, type Camera} from '../camera';
import {hash} from '../hash';
import {PaintedLabel} from '../Label';
import {makePainter, mixColor, ramp, range, ring, type Painter, type Pt} from '../painter';
import {Grade, Grain} from '../screen';
import {bands, span} from '../sea';

loadFont({family: 'Noto Sans Thai', url: staticFile('fonts/NotoSansThai.ttf'), weight: '100 900'});

// Film look-check stills for BLOOP-EP01-SHORT (brief BLOOP-BRIEF-R1, VD16; user request 2026-10-30).
// Throwaway spike: L-A deep water (SET-DEEP + PROP-HYD + FX-RING), L-B dream creature designs (CR-DREAM),
// L-C solid SVG creature (CR-REAL). Not the production BLOOP plate module (Boss DEP01); Boss ports what the user picks.

const W = 1080, H = 1920;

// ---------------------------------------------------------------- palette (VD02)
const DEEP = ['#1d3550', '#193049', '#152a40', '#132538', '#0f1e2e', '#0b1622', '#0a131d'];
const AMBER = '#f2b25c';
const ICE = '#cfe9f2';
const DREAM_INK = '#6f6a86';

// ---------------------------------------------------------------- PROP-HYD: one outline source (VD04)
/** Hydrophone outline in world px: body 70 x 260 centred on (cx, cy). Shared by the painted prop and its SVG copy. */
export const hydParts = (cx: number, cy: number, k = 1) => {
  const w = 35 * k, h = 130 * k, r = 26 * k;
  const body: Pt[] = [
    ...range(6, (u) => [cx - w + r - r * Math.cos(u * Math.PI / 2), cy - h + r - r * Math.sin(u * Math.PI / 2)] as Pt),
    ...range(6, (u) => [cx + w - r + r * Math.sin(u * Math.PI / 2), cy - h + r - r * Math.cos(u * Math.PI / 2)] as Pt),
    ...range(6, (u) => [cx + w - r + r * Math.cos(u * Math.PI / 2), cy + h - r + r * Math.sin(u * Math.PI / 2)] as Pt),
    ...range(6, (u) => [cx - w + r - r * Math.sin(u * Math.PI / 2), cy + h - r + r * Math.cos(u * Math.PI / 2)] as Pt),
  ];
  const cageW = 50 * k;
  const bars = [-1, -0.35, 0.35, 1].map((f) => [[cx + f * cageW, cy - h - 18 * k], [cx + f * cageW, cy + h + 18 * k]] as [Pt, Pt]);
  const hoops = [cy - h - 18 * k, cy, cy + h + 18 * k];
  const cap: Pt[] = [[cx - 14 * k, cy - h], [cx - 10 * k, cy - h - 34 * k], [cx + 10 * k, cy - h - 34 * k], [cx + 14 * k, cy - h]];
  return {body, bars, hoops, cageW, cap, top: [cx, cy - h - 34 * k] as Pt, w, h};
};

const paintHydrophone = (p: Painter, cx: number, cy: number, k = 1) => {
  const {brush} = p;
  const hp = hydParts(cx, cy, k);
  // cable up to an off-frame float, gently curved
  p.inkStill(60, '2B', '#050a10', 2.2);
  brush.spline(range(6, (u) => [hp.top[0] + 18 * Math.sin(u * 2.2), hp.top[1] - u * (hp.top[1] + 260)] as Pt), 0.6);
  // body: mid-value metal so it reads against value 10-25 % water; cel shade on the left, cool rim right
  p.wash('#4d6379', 245, hp.body, 0.04, 0.2);
  p.wash('#2a394b', 230, hp.body.filter(([x]) => x <= cx - 6).concat([[cx - 6, cy + hp.h], [cx - 6, cy - hp.h]]), 0.04, 0.2);
  p.wash('#7e9bb0', 170, [[cx + hp.w - 16 * k, cy - hp.h + 30 * k], [cx + hp.w - 4 * k, cy - hp.h + 30 * k], [cx + hp.w - 4 * k, cy + hp.h - 30 * k], [cx + hp.w - 16 * k, cy + hp.h - 30 * k]], 0.03, 0.2);
  p.wash('#566d82', 240, hp.cap, 0.03, 0.2);
  // two bands on the body (sensor rings)
  [-0.45, 0.5].forEach((f) => p.wash('#1c2734', 220, [[cx - hp.w, cy + f * hp.h - 7 * k], [cx + hp.w, cy + f * hp.h - 7 * k], [cx + hp.w, cy + f * hp.h + 7 * k], [cx - hp.w, cy + f * hp.h + 7 * k]] as Pt[], 0.02, 0.1));
  // ink outline (key prop: one thin ink line, boils)
  p.ink(61, 'pen', '#03060a', 1.6);
  brush.spline([...hp.body, hp.body[0]], 0.2);
  brush.polygon(hp.cap);
  p.ink(62, 'HB', '#b5d0e0', 1.6);
  brush.spline(range(8, (u) => [cx + hp.w - 4, cy - hp.h + 30 + u * (2 * hp.h - 60)] as Pt), 0.2);
  // guard cage
  p.ink(63, 'pen', '#7e95a8', 1.2);
  hp.bars.forEach(([a, b]) => brush.line(a[0], a[1], b[0], b[1]));
  hp.hoops.forEach((y) => brush.spline(range(10, (u) => [cx - hp.cageW + u * 2 * hp.cageW, y + 7 * k * Math.sin(u * Math.PI)] as Pt), 0.5));
};

// ---------------------------------------------------------------- SET-DEEP (VD03)
const paintDeep = (p: Painter, o: {haze?: number} = {}) => {
  bands(p, W, '#132538', DEEP, -260, H + 260, {opacity: 200, bleed: 0.04, texture: 0.35});
  // faint far haze: a few soft horizontal strata, no surface light
  const haze = o.haze ?? 1;
  [[380, 560, '#24405c'], [600, 760, '#1f3956']].forEach(([y0, y1, c], i) =>
    p.wash(c as string, 70 * haze, span(W, (y0 as number) + 20 * Math.sin(i), y1 as number), 0.08, 0.3));
};

/** Screen-space marine snow: sparse specks on hash lanes (no boil), dimmed through the caption zone. */
const paintSnow = (p: Painter, t: number, count = 70, color = '#8fa7b8') => {
  p.inkStill(70, 'pen', color, 0.9);
  for (let i = 0; i < count; i++) {
    const x = (hash(i + 900) * W + t * (3 + hash(i + 901) * 6)) % W;
    const y = (hash(i + 902) * H + t * (5 + hash(i + 903) * 8)) % H;
    if (y > 840 && y < 1260 && i % 3) continue;
    const l = 2 + hash(i + 904) * 3;
    p.brush.line(x, y, x + l * 0.6, y + l);
  }
};

// ---------------------------------------------------------------- SET-DREAM (VD08): pale, paper-showing water
const DREAM_PAPER = '#e7e2d6';
const INK_D = '#4a4562';
/**
 * Dream water: the deep blue loosens into a pale, paper-showing halo of watercolour around the creature (centre `cy`),
 * while the frame edges and everything below y 860 stay mid-dark so CAP-ZONE holds value <= 45 %.
 */
const paintDreamWater = (p: Painter, cy = 480) => {
  const steps = 30, y0 = -100, y1 = 900;
  for (let i = 0; i < steps; i++) {
    const u = (i + 1) / steps;
    p.flat(mixColor('#8197a8', '#34465a', u), span(W, y0 + (i * (y1 - y0)) / steps - (i ? 0 : 300), y0 + ((i + 1) * (y1 - y0)) / steps + 2));
  }
  p.flat('#34465a', span(W, y1, H + 300));
  ['#3e5165', '#3a4c60', '#36485b', '#334457', '#304054'].forEach((c, i) => p.wash(c, 90, span(W, 820 + i * 220, 1100 + i * 220), 0.1, 0.55));
  // nested ellipses narrower than the frame, so the halo's lower edge curves and steps softly (no flat line at y 840)
  ([[680, 330, '#7f93a3', 120], [620, 300, '#9aaebb', 140], [560, 270, '#b7c7cf', 150], [490, 235, '#cbd7dc', 165], [410, 195, '#e1e6e2', 170]] as [number, number, string, number][])
    .forEach(([rx, ry, c, o], i) => p.wash(c, o, ring(540 + i * 6, cy - i * 14, rx, ry, 48), 0.24, 0.65));
};

/** Points along a spine with a thickness profile: returns the upper and lower edges. */
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
/** Catmull-Rom curve through `pts`, n + 1 samples. */
const bez = (pts: Pt[], n = 40): Pt[] => range(n, (u) => {
  const m = pts.length - 1, f = u * m, i = Math.min(m - 1, Math.floor(f)), s = f - i;
  const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(m, i + 2)];
  const c = (a: number, b: number, cc: number, d: number) => 0.5 * (2 * b + (-a + cc) * s + (2 * a - 5 * b + 4 * cc - d) * s * s + (-a + 3 * b - 3 * cc + d) * s * s * s);
  return [c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])] as Pt;
});
const closed = (pts: Pt[], n = 60) => bez([...pts, pts[0]], n);
/** Sketchy ink: the same path drawn `passes` times with small hash jitter that changes per boil step. */
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
const teethAlong = (p: Painter, id: number, line: Pt[], dir: 1 | -1, len: number, every = 2) => {
  p.ink(id, 'HB', INK_D, 1.6);
  line.forEach(([x, y], i) => {
    if (i % every || i === 0 || i === line.length - 1) return;
    const l = len * (0.5 + hash(i + id));
    p.brush.spline([[x - 7, y], [x - 2, y + dir * l * 0.7], [x + 3, y + dir * l]], 0.5);
    p.brush.line(x + 3, y + dir * l, x + 8, y);
  });
};
const eyeInk = (p: Painter, id: number, x: number, y: number, r: number) => {
  sketch(p, id, closed([[x - r, y], [x, y - r * 0.8], [x + r, y], [x, y + r * 0.8]], 20), {w: 2.2, jit: 3});
  p.wash('#3a3550', 230, ring(x + r * 0.15, y, r * 0.38, r * 0.5, 12), 0.05, 0.2);
  sketch(p, id + 1, bez([[x - r * 1.4, y - r * 0.6], [x, y - r * 1.4], [x + r * 1.3, y - r * 0.9]], 10), {w: 2.4, jit: 4});
};

// CRD-1 "frill serpent": a long eel-like neck and body, frilled crest, needle-toothed jaw; head left, coils off right.
const paintDream1 = (p: Painter) => {
  const spine = bez([[470, 470], [700, 560], [930, 540], [1120, 430], [1380, 380]], 40);
  const {top, bot} = tube(spine, (u) => 290 - u * 90);
  blotch(p, '#b9b2ca', 140, [...top, ...bot.slice().reverse()]);
  // lower coil below the caption zone: the same body passing again, deeper and darker
  const coil = bez([[-260, 1500], [200, 1380], [600, 1470], [900, 1600], [1350, 1540]], 40);
  const c2 = tube(coil, () => 230);
  blotch(p, '#6d6884', 150, [...c2.top, ...c2.bot.slice().reverse()], 2);
  sketch(p, 200, c2.top, {color: '#8f8aa8', w: 1.8});
  sketch(p, 201, c2.bot, {color: '#8f8aa8', w: 1.8});
  // head (facing left), lower jaw dropped
  const skull: Pt[] = [[560, 330], [420, 290], [270, 320], [140, 400], [40, 480], [70, 510], [220, 520], [400, 540], [520, 600]];
  const jaw: Pt[] = [[400, 548], [240, 600], [80, 640], [100, 670], [260, 690], [460, 690], [560, 640]];
  blotch(p, '#aca5c1', 170, closed(skull, 40), 2);
  blotch(p, '#a49cb9', 160, closed(jaw, 30), 2);
  hatchIn(p, 202, [...bot.slice(0, 30), ...top.slice(0, 30).reverse().map(([x, y]) => [x, y + 170] as Pt)], 10, 0.6);
  hatchIn(p, 203, [[100, 650], [460, 640], [470, 690], [100, 670]], 7, -0.5);
  sketch(p, 204, bez(skull, 30), {w: 2.6});
  sketch(p, 205, bez(jaw, 24), {w: 2.6});
  sketch(p, 206, top, {w: 2.4});
  sketch(p, 207, bot, {w: 2.4});
  teethAlong(p, 208, bez([[60, 500], [220, 520], [400, 542]], 22), 1, 34);
  teethAlong(p, 209, bez([[90, 642], [240, 604], [400, 552]], 22), -1, 30);
  eyeInk(p, 210, 270, 400, 30);
  // frilled crest: swept-back spines from the brow along the back, webbed
  const crest = [...bez([[300, 318], [430, 292], [560, 330]], 8), ...top.slice(2, 36)];
  p.ink(212, 'HB', INK_D, 1.8);
  for (let i = 0; i < crest.length - 3; i += 3) {
    const [x, y] = crest[i], [x2, y2] = crest[i + 3];
    const l = 110 + 60 * Math.sin(i * 0.5);
    p.brush.spline([[x, y], [x + 30, y - l * 0.6], [x + 60, y - l]], 0.6);
    p.brush.spline([[x + 60, y - l], [(x + x2) / 2 + 50, (y + y2) / 2 - l * 0.55], [x2 + 60, y2 - l]], 0.6);
  }
  // gill frills behind the jaw
  [0, 1, 2].forEach((k) => sketch(p, 214 + k, bez([[570 + k * 30, 400], [545 + k * 30, 500], [575 + k * 30, 620]], 10), {w: 1.6, jit: 4}));
  for (let i = 4; i < 36; i += 4) sketch(p, 220 + i, [top[i], [(top[i][0] + bot[i][0]) / 2 + 14, (top[i][1] + bot[i][1]) / 2], bot[i]], {w: 1.1, passes: 1, jit: 4});
};

// CRD-2 "four-eyed armoured fish": a huge plated head (two eyes per side), underbite jaw of bony blades, short tapering body.
const paintDream2 = (p: Painter) => {
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
  // armour plates: a cheek plate, a crown plate, an opercular plate, each with a ridge
  [[[120, 340], [200, 470], [180, 600]], [[330, 260], [360, 420], [300, 560], [140, 620]], [[540, 300], [600, 480], [580, 700], [520, 820]], [[-20, 560], [140, 600], [330, 590], [480, 520], [600, 520]]]
    .forEach((pts, k) => sketch(p, 310 + k, bez(pts as Pt[], 16), {w: 1.8, jit: 5}));
  // crown spines
  p.ink(318, 'HB', INK_D, 1.8);
  bez([[130, 320], [330, 250], [560, 290], [720, 340]], 10).forEach(([x, y], i) => p.brush.spline([[x - 14, y + 4], [x + 4, y - 50 - 40 * hash(i + 70)], [x + 18, y + 4]], 0.3));
  // underbite jaw: bony blades jutting up past the upper lip
  const lip = bez([[-30, 600], [120, 640], [320, 650], [520, 610]], 20);
  sketch(p, 320, lip, {w: 2.8, brush: '2B'});
  p.ink(321, 'HB', INK_D, 1.8);
  lip.slice(1, 15).forEach(([x, y], i) => {
    if (i % 2) return;
    const l = 40 + 40 * hash(i + 400);
    p.brush.polygon([[x - 12, y + 4], [x + 2, y - l], [x + 12, y + 4]]);
  });
  // signature: two stacked eyes per side (four in total)
  eyeInk(p, 330, 160, 470, 34);
  eyeInk(p, 334, 250, 380, 24);
  // gill slits, pectoral fin, dorsal fin, lateral line
  [0, 1, 2, 3].forEach((k) => sketch(p, 340 + k, bez([[660 + k * 28, 420], [645 + k * 28, 560], [660 + k * 28, 700]], 10), {w: 1.5, jit: 4}));
  sketch(p, 345, bez([[600, 790], [700, 960], [860, 990], [800, 800]], 16), {w: 2});
  sketch(p, 346, bez([[780, 380], [860, 230], [1000, 270], [1010, 400]], 14), {w: 2});
  sketch(p, 347, bez([[720, 560], [900, 590], [1100, 560], [1300, 490]], 16), {w: 1.2, passes: 1});
};

// CRD-3 "the bloop" mass: an amorphous lumpy body with an asymmetric cluster of eyes and a ragged maw.
const paintDream3 = (p: Painter) => {
  const cx = 600, cy = 470;
  const outline: Pt[] = range(64, (u) => {
    const a = u * 6.283;
    const r = 1 + 0.09 * Math.sin(a * 5 + 1) + 0.06 * Math.sin(a * 11 + 2) + 0.04 * Math.sin(a * 17);
    return [cx + 700 * r * Math.cos(a), cy + 420 * r * Math.sin(a)] as Pt;
  });
  blotch(p, '#b4adc6', 150, outline, 3);
  hatchIn(p, 400, [...range(30, (u) => [cx - 650 + u * 1300, cy + 120 + 260 * Math.sin(u * Math.PI)] as Pt), [cx + 650, cy + 60], [cx - 650, cy + 60]], 9, 0.4);
  sketch(p, 401, outline, {w: 2.6, jit: 10});
  // hanging lobes at the sides, outside the caption-safe centre
  [[70, 1], [140, 0], [980, 1], [1040, 0]].forEach(([x, k], i) => sketch(p, 402 + i, bez([[x, 780], [x + (k ? 40 : -30), 1000], [x - 20, 1200], [x + 30, 1420]], 18), {w: 2}));
  // lumps / pustules
  for (let i = 0; i < 16; i++) {
    const x = cx - 560 + 1120 * hash(i + 500), y = cy - 300 + 420 * hash(i + 501);
    if (Math.hypot((x - 470) / 1.4, y - 360) < 230) continue;
    sketch(p, 410 + i, closed([[x - 22, y], [x, y - 16], [x + 22, y], [x, y + 14]], 12), {w: 1.3, passes: 1, jit: 5});
  }
  // asymmetric eye cluster
  ([[420, 330, 42], [540, 260, 26], [330, 430, 22], [610, 370, 32], [480, 450, 16], [700, 290, 18]] as [number, number, number][])
    .forEach(([x, y, r], k) => eyeInk(p, 440 + k * 2, x, y, r));
  // ragged maw, open, darkness hatched inside
  const upper = bez([[200, 650], [360, 600], [520, 640], [700, 590], [900, 640]], 30);
  const lower = bez([[200, 650], [380, 760], [560, 720], [760, 790], [900, 640]], 30);
  p.wash('#4d4864', 200, [...upper, ...lower.slice().reverse()], 0.1, 0.4);
  hatchIn(p, 460, [...upper, ...lower.slice().reverse()], 6, 0.9, '#2e2a40');
  sketch(p, 461, upper, {w: 2.8, brush: '2B'});
  sketch(p, 462, lower, {w: 2.8, brush: '2B'});
  teethAlong(p, 463, upper, 1, 30, 3);
  teethAlong(p, 464, lower, -1, 26, 3);
};

// ---------------------------------------------------------------- SVG layers
const Rings = ({cx, cy, radii, glow = 0.3}: {cx: number; cy: number; radii: number[]; glow?: number}) => {
  const id = useId();
  return (
    <>
      <defs>
        <filter id={id} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={9} /></filter>
        <radialGradient id={`${id}g`}><stop offset="0" stopColor={AMBER} stopOpacity={0.3} /><stop offset="1" stopColor={AMBER} stopOpacity={0} /></radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={120} fill={`url(#${id}g)`} />
      {radii.map((r, i) => (
        <g key={r}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={AMBER} strokeWidth={10} opacity={glow * (1 - i * 0.18)} filter={`url(#${id})`} />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={AMBER} strokeWidth={3} opacity={0.95 - i * 0.2} />
        </g>
      ))}
    </>
  );
};

/** Wavefront arcs whose centre is off-frame (source unseen), crossing the hydrophone. */
const Wavefronts = ({ox, oy, radii}: {ox: number; oy: number; radii: number[]}) => {
  const id = useId();
  return (
    <>
      <defs><filter id={id} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={10} /></filter></defs>
      {radii.map((r, i) => (
        <g key={r}>
          <circle cx={ox} cy={oy} r={r} fill="none" stroke={AMBER} strokeWidth={12} opacity={0.28 - i * 0.04} filter={`url(#${id})`} />
          <circle cx={ox} cy={oy} r={r} fill="none" stroke={AMBER} strokeWidth={i === 1 ? 4 : 2.5} opacity={0.9 - Math.abs(i - 1) * 0.25} />
        </g>
      ))}
    </>
  );
};

/** SVG copy of PROP-HYD from the same outline (the B10 depth seam: drawn above the SVG creature). */
const HydSvg = ({cx, cy}: {cx: number; cy: number}) => {
  const hp = hydParts(cx, cy);
  const gid = `hyd${Math.round(cx)}${Math.round(cy)}`;
  const d = `M${hp.body.map(([x, y]) => `${x},${y}`).join(' L')} Z`;
  return (
    <g>
      <path d={`M${hp.top[0]},${hp.top[1]} C${hp.top[0] + 10},${hp.top[1] - 200} ${hp.top[0] + 18},${hp.top[1] - 400} ${hp.top[0] + 12},-400`} stroke="#04080d" strokeWidth={3} fill="none" />
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1a2533" /><stop offset="0.45" stopColor="#3b5065" /><stop offset="0.8" stopColor="#56708a" /><stop offset="1" stopColor="#9bbbd0" />
        </linearGradient>
      </defs>
      {/* back half of the cage, behind the body */}
      {hp.bars.slice(1, 3).map(([a, b], i) => <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#2b3a49" strokeWidth={3} />)}
      <path d={d} fill={`url(#${gid})`} stroke="#04080d" strokeWidth={3} />
      {[-0.45, 0.5].map((f) => <rect key={f} x={cx - hp.w} y={cy + f * hp.h - 7} width={2 * hp.w} height={14} fill="#121b26" opacity={0.85} />)}
      <path d={`M${cx + 30},${cy - 100} L${cx + 30},${cy + 100}`} stroke="#c2dbe8" strokeWidth={2.5} opacity={0.8} />
      <path d={`M${hp.cap.map(([x, y]) => `${x},${y}`).join(' L')} Z`} fill="#2f4152" stroke="#04080d" strokeWidth={2.5} />
      {/* front cage: outer bars and the front arcs of the hoops, with a lit edge */}
      {[hp.bars[0], hp.bars[3]].map(([a, b], i) => <g key={i}><line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#0a1118" strokeWidth={5} /><line x1={a[0] + 1.5} y1={a[1]} x2={b[0] + 1.5} y2={b[1]} stroke="#7f97ab" strokeWidth={1.5} /></g>)}
      {hp.hoops.map((y) => <g key={y}><path d={`M${cx - hp.cageW},${y} Q${cx},${y + 16} ${cx + hp.cageW},${y}`} stroke="#0a1118" strokeWidth={5} fill="none" /><path d={`M${cx - hp.cageW},${y - 1.5} Q${cx},${y + 14} ${cx + hp.cageW},${y - 1.5}`} stroke="#7f97ab" strokeWidth={1.5} fill="none" /></g>)}
    </g>
  );
};

// ---------------------------------------------------------------- CR-REAL (CRD-2 made solid), front 3/4, mouth open
type Detail = 1 | 2 | 3;
/** Catmull-Rom path string through points (closed or open). */
const crPath = (pts: Pt[], close = false) => {
  const q = close ? [...pts, pts[0]] : pts;
  return `M${bez(q, q.length * 8).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L')}${close ? ' Z' : ''}`;
};
/**
 * CRD-2 head in front 3/4 (turned toward the viewer's left, so the near side is screen right), mouth fully open.
 * Local units: origin at the mouth centre, head about 1250 wide before `k`. The 3/4 turn is a warp: the far half is
 * compressed. Signature carried from L-B2: four eyes (two stacked per side), bony underbite blades, crown spines, plates.
 */
const CrReal = ({mx, my, k, detail}: {mx: number; my: number; k: number; detail: Detail}) => {
  const id = useId().replace(/:/g, '');
  const T = ([x, y]: Pt): Pt => [mx + (x < 0 ? x * 0.7 : x) * k + 40 * k, my + y * k];
  const tp = (pts: Pt[]) => pts.map(T);
  // the mouth is scaled about its centre so more of the plated head shows around it
  const mS = ([x, y]: Pt): Pt => [x * 0.8, 40 + (y - 40) * 0.78];
  const tm = (pts: Pt[]) => tp(pts.map(mS));
  const head = tp([[-300, -760], [60, -790], [420, -720], [600, -520], [640, -260], [660, 20], [640, 260], [470, 470], [120, 600], [-260, 560], [-520, 360], [-640, 80], [-630, -220], [-560, -520]]);
  const upperLip = tm([[-540, -30], [-380, -190], [-120, -250], [160, -250], [420, -180], [580, -30]]);
  const lowerLip = tm([[580, -30], [540, 220], [300, 420], [0, 470], [-300, 410], [-500, 220], [-540, -30]]);
  const mouth = crPath([...upperLip, ...lowerLip.slice(1, -1)], true);
  const gum = crPath(tm([[-470, -40], [-330, -150], [-100, -195], [150, -195], [380, -140], [510, -40], [470, 170], [280, 340], [0, 385], [-280, 330], [-440, 170]]), true);
  const throat = crPath(tm([[-200, 20], [0, -40], [220, 20], [240, 170], [0, 250], [-210, 170]]), true);
  // teeth: a few long fangs among short ones; lower blades jut up past the upper lip (underbite, from L-B2)
  const along = (pts: Pt[], n: number) => bez(pts, n).map(mS);
  const upLine = along([[-500, -60], [-370, -175], [-120, -225], [160, -225], [410, -165], [550, -60]], detail === 1 ? 10 : 18);
  const loLine = along([[540, -10], [500, 200], [290, 380], [0, 430], [-290, 370], [-470, 200], [-510, -10]], detail === 1 ? 8 : 16);
  const fang = (base: Pt, tip: Pt, w: number, key: string) => {
    const [bx, by] = T(base), [tx, ty] = T(tip), ww = w * k;
    const nx = -(ty - by), ny = tx - bx, l = Math.hypot(nx, ny) || 1;
    const ox = (nx / l) * ww, oy = (ny / l) * ww;
    const cx = (bx + tx) / 2 + ox * 0.6, cy = (by + ty) / 2 + oy * 0.6;
    return <path key={key} d={`M${bx - ox},${by - oy} Q${cx},${cy} ${tx},${ty} Q${cx + ox * 0.4},${cy + oy * 0.4} ${bx + ox},${by + oy} Z`} fill={`url(#${id}tooth)`} stroke="#141612" strokeWidth={detail === 1 ? 0.8 : 1.4} />;
  };
  const toward = ([x, y]: Pt, len: number, curl: number): Pt => {
    const dx = 0 - x, dy = 60 - y, l = Math.hypot(dx, dy) || 1;
    return [x + (dx / l) * len + curl, y + (dy / l) * len];
  };
  const upTeeth = upLine.slice(1, -1).map((b, i) => {
    const long = detail > 1 ? i % 5 === 2 : i % 4 === 1;
    const len = long ? 170 + 40 * hash(i + 5) : 50 + 40 * hash(i + 9);
    return fang(b, toward(b, len, (b[0] < 0 ? 12 : -12)), long ? 20 : 11, `u${i}`);
  });
  const loTeeth = loLine.slice(1, -1).map((b, i) => {
    const blade = detail > 1 ? i % 4 === 1 : i % 3 === 1;
    const len = blade ? 230 + 60 * hash(i + 21) : 45 + 35 * hash(i + 25);
    const tip: Pt = blade ? [b[0] * 0.92 + (b[0] < 0 ? -20 : 20), b[1] - len] : toward(b, len, 0);
    return fang(b, tip, blade ? 24 : 11, `l${i}`);
  });
  const inner = detail === 3 ? along([[-380, -40], [-200, -130], [0, -150], [200, -130], [380, -40]], 12).slice(1, -1).map((b, i) => fang(b, toward(b, 50 + 30 * hash(i + 60), 0), 8, `i${i}`)) : null;
  // eyes: two stacked per side, recessed under a brow plate; near pair (screen right) larger
  const eyes: [Pt, number][] = [[[470, -350], 46], [[350, -520], 31], [[-470, -350], 40], [[-370, -510], 27]];
  const ridges: Pt[][] = [
    [[-150, -770], [-170, -560], [-120, -330]], [[150, -780], [170, -560], [140, -320]],
    [[620, -120], [480, -200], [330, -330], [200, -420]], [[-620, -120], [-480, -200], [-330, -330], [-200, -420]],
    [[650, 120], [560, 60], [520, -20]], [[-640, 120], [-560, 60], [-520, -20]],
  ];
  const brows: Pt[][] = eyes.map(([[x, y], r]) => [[x - r * 2, y - r * 0.6], [x, y - r * 1.7], [x + r * 2, y - r * 0.8]]);
  const spines = bez([[-520, -560], [-300, -760], [60, -800], [420, -720], [600, -520]], 10);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}skin`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#060c11" />
          <stop offset="0.35" stopColor="#132631" />
          <stop offset="0.7" stopColor="#1d3540" />
          <stop offset="1" stopColor="#3b6470" />
        </linearGradient>
        <radialGradient id={`${id}form`} cx="0.62" cy="0.42" r="0.62">
          <stop offset="0.35" stopColor="#5d8a96" stopOpacity={0.18} />
          <stop offset="0.7" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.75} />
        </radialGradient>
        <linearGradient id={`${id}sink`} x1="0" y1={my + 160 * k} x2="0" y2={my + 600 * k} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#03070b" stopOpacity={0} />
          <stop offset="1" stopColor="#03070b" stopOpacity={0.85} />
        </linearGradient>
        <radialGradient id={`${id}maw`} cx="0.52" cy="0.48" r="0.55">
          <stop offset="0" stopColor="#000" />
          <stop offset="0.6" stopColor="#050206" />
          <stop offset="0.85" stopColor="#24101a" />
          <stop offset="1" stopColor="#3c1d27" />
        </radialGradient>
        <linearGradient id={`${id}tooth`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d4d6cc" />
          <stop offset="0.6" stopColor="#a7aba0" />
          <stop offset="1" stopColor="#4c524d" />
        </linearGradient>
        <radialGradient id={`${id}eye`} cx="0.42" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#d9f2ea" />
          <stop offset="0.45" stopColor="#7fb3ad" />
          <stop offset="1" stopColor="#0d2024" />
        </radialGradient>
        <filter id={`${id}tex`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency={detail === 3 ? 0.04 : 0.028} numOctaves={3} seed={7} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={detail === 3 ? 12 : 8} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id={`${id}mottle`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency={detail === 3 ? 0.018 : 0.01} numOctaves={4} seed={11} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.02  0 0 0 0 0.05  0 0 0 0 0.07  0 0 0 -2.4 1.4" />
        </filter>
        <pattern id={`${id}scale`} width={30 * k} height={22 * k} patternUnits="userSpaceOnUse">
          <path d={`M0,${22 * k} Q${15 * k},${3 * k} ${30 * k},${22 * k}`} fill="none" stroke="#02060a" strokeWidth={1.5} opacity={0.55} />
          <path d={`M0,${19 * k} Q${15 * k},${1 * k} ${30 * k},${19 * k}`} fill="none" stroke="#7fb0ba" strokeWidth={1.2} opacity={0.5} />
        </pattern>
        <clipPath id={`${id}clip`}><path d={crPath(head, true)} /></clipPath>
        <filter id={`${id}soft`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={detail === 1 ? 2 : 6} /></filter>
      </defs>
      {detail > 1 && spines.map(([x, y], i) => {
        const [bx, by] = T([x, y]), [tx, ty] = T([x * 1.05, y - 90 - 70 * hash(i + 3)]);
        return <path key={i} d={`M${bx - 22 * k},${by + 40 * k} L${tx},${ty} L${bx + 22 * k},${by + 40 * k} Z`} fill="#0a141b" stroke="#02050a" strokeWidth={2} />;
      })}
      <g filter={detail > 1 ? `url(#${id}tex)` : undefined}>
        <path d={crPath(head, true)} fill={`url(#${id}skin)`} />
        <g clipPath={`url(#${id}clip)`}>
          {detail > 1 && <rect x={0} y={0} width={W} height={H} filter={`url(#${id}mottle)`} opacity={detail === 3 ? 0.9 : 0.65} />}
          {detail === 3 && <rect x={0} y={0} width={W} height={H} fill={`url(#${id}scale)`} opacity={0.85} />}
          {detail > 1 && ridges.map((r, i) => (
            <g key={i}>
              <path d={crPath(tp(r))} fill="none" stroke="#010407" strokeWidth={7 * k} opacity={0.9} filter={`url(#${id}soft)`} />
              <path d={crPath(tp(r.map(([x, y]) => [x, y + 10] as Pt)))} fill="none" stroke="#7fb0ba" strokeWidth={3} opacity={detail === 3 ? 0.6 : 0.45} />
            </g>
          ))}
          {brows.map((b, i) => <path key={i} d={crPath(tp(b))} fill="none" stroke="#010407" strokeWidth={(detail === 1 ? 10 : 16) * k} opacity={0.85} filter={`url(#${id}soft)`} />)}
          <path d={crPath(head, true)} fill={`url(#${id}form)`} />
          {/* cold under-light along the jaw (the dimming ice glow), then the lower head sinks into the dark */}
          <path d={crPath(tp([[-640, 160], [-450, 480], [0, 620], [460, 490], [660, 160]]))} fill="none" stroke="#8cc3d6" strokeWidth={detail === 1 ? 14 : 22} opacity={detail === 1 ? 0.25 : 0.3} filter={`url(#${id}soft)`} />
          <rect x={0} y={0} width={W} height={H} fill={`url(#${id}sink)`} />
        </g>
      </g>
      {/* mouth: lip rim, gum, throat to black */}
      <path d={mouth} fill="#2c1820" stroke="#010305" strokeWidth={detail === 1 ? 4 : 8} />
      <path d={gum} fill={`url(#${id}maw)`} />
      {detail > 1 && <path d={throat} fill="#000" filter={`url(#${id}soft)`} />}
      {inner}
      {loTeeth}
      {upTeeth}
      {detail > 1 && <path d={crPath(tp([[-420, -200], [-120, -265], [200, -265], [460, -190]]))} fill="none" stroke="#c5e3ea" strokeWidth={2.5} opacity={detail === 3 ? 0.5 : 0.32} />}
      {/* eyes */}
      {eyes.map(([c, r], i) => {
        const [x, y] = T(c), sx = c[0] < 0 ? 0.7 : 1, rr = r * k;
        return (
          <g key={i}>
            <ellipse cx={x} cy={y} rx={(rr + 12 * k) * sx} ry={rr + 8 * k} fill="#020508" />
            <ellipse cx={x} cy={y} rx={rr * sx} ry={rr * 0.82} fill={detail === 1 ? '#7fa7a2' : `url(#${id}eye)`} />
            <ellipse cx={x + rr * 0.1 * sx} cy={y} rx={Math.max(1.5, rr * 0.16 * sx)} ry={rr * 0.74} fill="#010203" />
            {detail > 1 && <circle cx={x - rr * 0.35 * sx} cy={y - rr * 0.35} r={Math.max(2, rr * 0.15)} fill="#fff" opacity={0.9} />}
          </g>
        );
      })}
      {detail === 3 && range(16, (u, i) => [-560 + u * 1180, -120 + 120 * Math.sin(u * 9) - 180 * hash(i + 200)] as Pt).filter(([x]) => Math.abs(x) > 330).map((c, i) => {
        const [x, y] = T(c);
        return <circle key={i} cx={x} cy={y} r={4} fill={ICE} opacity={0.5} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- CR-REAL painted (L-CP2 / L-CP3): the same CRD-2 head in p5.brush
/** Same local geometry as `CrReal` (front 3/4, mouth open, near side screen right), returned in world px. */
const crGeom = (mx: number, my: number, k: number, detail: 2 | 3) => {
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
  const inner = detail === 3 ? along([[-380, -40], [-200, -130], [0, -150], [200, -130], [380, -40]], 12).slice(1, -1).map((b, i) => fang(b, toward(b, 50 + 30 * hash(i + 60), 0), 8)) : [];
  const eyes = ([[[470, -350], 46], [[350, -520], 31], [[-470, -350], 40], [[-370, -510], 27]] as [Pt, number][]).map(([c, r]) => ({c: T(c), r: r * k, sx: c[0] < 0 ? 0.7 : 1}));
  const ridges = ([[[-150, -770], [-170, -560], [-120, -330]], [[150, -780], [170, -560], [140, -320]], [[620, -120], [480, -200], [330, -330], [200, -420]], [[-620, -120], [-480, -200], [-330, -330], [-200, -420]], [[650, 120], [560, 60], [520, -20]], [[-640, 120], [-560, 60], [-520, -20]]] as Pt[][]).map((r) => bez(r.map(T), 16));
  const spines = bez([[-520, -560], [-300, -760], [60, -800], [420, -720], [600, -520]], 10).map((b, i) => {
    const [bx, by] = T(b), [tx, ty] = T([b[0] * 1.05, b[1] - 90 - 70 * hash(i + 3)]);
    return [[bx - 22 * k, by + 40 * k], [tx, ty], [bx + 22 * k, by + 40 * k]] as Pt[];
  });
  const lipLight = bez(tm([[-420, -200], [-120, -265], [200, -265], [460, -190]]), 20);
  const jawLight = bez(([[-640, 160], [-450, 480], [0, 620], [460, 490], [660, 160]] as Pt[]).map(T), 30);
  return {T, head, mouth, gum, throat, teeth, inner, eyes, ridges, spines, lipLight, jawLight};
};

/** `poly` scaled about (cx, cy): curved sub-regions of a shape (no straight slice edges on a rounded head). */
const scaleAbout = (poly: Pt[], cx: number, cy: number, sx: number, sy: number): Pt[] => poly.map(([x, y]) => [cx + (x - cx) * sx, cy + (y - cy) * sy] as Pt);

/**
 * Painted CR-REAL: layered washes over a flat underlayer (no large textured fills), still ink for plates and teeth
 * (no boil: a realistic creature must not shimmer through the rush), one boiling contour only.
 */
const paintCrReal = (p: Painter, mx: number, my: number, k: number, detail: 2 | 3, o: {aperture?: number; inside?: () => void; shadow?: number} = {}) => {
  const g = crGeom(mx, my, k, detail);
  const {brush} = p;
  p.group(600);
  // crown spines behind the head
  g.spines.forEach((sp) => p.flat('#0a141b', sp));
  // skin: flat base, darker crown, cooler mid, under-lit jaw, then the lower head sinks into the dark
  p.flat('#16283a', g.head);
  const top = my - 790 * k, bot = my + 600 * k, hx = mx + 60 * k;
  p.wash('#0a131b', 220, scaleAbout(g.head, hx, top, 0.95, 0.5), 0.25, 0.4);
  p.wash('#1f3a46', 160, scaleAbout(g.head, hx, my, 0.78, 0.62), 0.25, 0.45);
  p.wash('#3c6672', 150, scaleAbout(g.head, hx, bot, 0.92, 0.32), 0.25, 0.5);
  p.wash('#06090e', 200, scaleAbout(g.head, hx, bot, 0.8, 0.14), 0.25, 0.3);
  // edge darkening: a darker wash ring just inside the silhouette
  p.wash('#060b10', 140, g.head.map(([x, y]) => [x, y] as Pt), 0.35, 0.3);
  p.wash('#1a3140', 160, g.head.map(([x, y]) => [mx + 60 + (x - mx - 60) * 0.72, my - 120 + (y - my + 120) * 0.72] as Pt), 0.25, 0.5);
  // skin texture: mottle blotches (both levels), crosshatched scales (detail 3)
  for (let i = 0; i < (detail === 3 ? 26 : 14); i++) {
    const x = mx - 420 + 900 * hash(i + 700), y = my - 600 * k + 520 * k * hash(i + 701);
    p.wash(hash(i + 702) > 0.5 ? '#0d1a22' : '#2a4652', 110, ring(x, y, 30 + 50 * hash(i + 703), 20 + 30 * hash(i + 704), 12), 0.3, 0.6);
  }
  if (detail === 3) {
    brush.hatchStyle('HB', '#071017', 1.2);
    const hd = Math.max(3, (9 * k) / 0.86); // hatch spacing scales with the creature (no mesh read at small k)
    brush.hatch(hd, 0.62, {rand: 0.35, continuous: false, gradient: 0.4});
    brush.noStroke();
    brush.polygon(scaleAbout(g.head, hx, top, 0.9, 0.52));
    brush.hatch(hd * 1.45, -0.43, {rand: 0.35, continuous: false, gradient: 0.4});
    brush.polygon(scaleAbout(g.head, hx, top, 0.9, 0.52));
    brush.noHatch();
  }
  // plate ridges: dark seam, then a cool lit lip below it
  p.inkStill(610, '2B', '#02060a', 3.2);
  g.ridges.forEach((r) => brush.spline(r, 0.5));
  p.inkStill(611, 'HB', '#7fb0ba', 1.6);
  g.ridges.forEach((r) => brush.spline(r.map(([x, y]) => [x, y + 8] as Pt), 0.5));
  // brow shadows over the eyes
  g.eyes.forEach(({c: [x, y], r, sx}) => p.wash('#04080c', 200, ring(x, y - r * 0.9, r * 2 * sx, r * 0.9, 16), 0.2, 0.4));
  // under-light rim along the jaw
  p.inkStill(612, 'marker', '#5f99a8', 3);
  brush.spline(g.jawLight, 0.5);
  // mouth: lip rim, gum, throat
  p.flat('#2c1820', g.mouth);
  p.wash('#3c1d27', 230, g.gum, 0.1, 0.4);
  p.wash('#160a10', 240, g.gum.map(([x, y]) => [mx + 40 * k + (x - mx - 40 * k) * 0.85, my + 60 * k + (y - my - 60 * k) * 0.85] as Pt), 0.2, 0.4);
  p.flat('#030204', g.throat);
  p.wash('#000000', 230, g.throat.map(([x, y]) => [mx + 40 * k + (x - mx - 40 * k) * 1.25, my + 80 * k + (y - my - 80 * k) * 1.2] as Pt), 0.3, 0.3);
  // B10 rush: the throat's black opens out to the lip line as the camera pushes in (aperture 0..1)
  const ap = o.aperture ?? 0;
  if (ap > 0) p.flat('#000000', scaleAbout(g.mouth, mx + 40 * k, my + 90 * k, 0.45 + 0.55 * ap, 0.4 + 0.58 * ap));
  // B10 hero (R5): whatever is being swallowed is painted inside the mouth, behind the teeth
  o.inside?.();
  // teeth: pale wash, darker root wash, still pen outline
  [...g.inner, ...g.teeth].forEach((t) => {
    p.flat('#b9bcb0', t);
    p.wash('#5b625c', 180, [t[0], t[1], t[3], t[4]], 0.05, 0.3);
  });
  p.inkStill(613, 'pen', '#101310', 1.3);
  [...g.inner, ...g.teeth].forEach((t) => brush.spline(t, 0.3));
  p.inkStill(614, 'HB', '#e6e8de', 1.2);
  g.teeth.forEach((t) => brush.line(t[1][0], t[1][1], t[2][0], t[2][1]));
  // lip highlight
  p.inkStill(615, 'HB', '#c5e3ea', detail === 3 ? 2 : 1.4);
  brush.spline(g.lipLight, 0.5);
  // eyes: socket, iris, slit pupil, highlight
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
  if (detail === 3) {
    // cold pores
    for (let i = 0; i < 16; i++) {
      const u = i / 15, lx = -560 + u * 1180;
      if (Math.abs(lx) <= 330) continue;
      const [x, y] = g.T([lx, -120 + 120 * Math.sin(u * 9) - 180 * hash(i + 200)]);
      p.flat(ICE, ring(x, y, 4, 4, 8));
    }
  }
  // contour in still ink too: the B10 creature does not boil (BLOOP-BRIEF-R2 VD11)
  p.inkStill(630, '2B', '#010407', 2.2);
  brush.spline(g.head, 0.5);
  const sh = o.shadow ?? 0;
  if (sh >= 0.99) {
    p.flat('#08111a', g.head);
    g.spines.forEach((sp) => p.flat('#08111a', sp));
  } else if (sh > 0) {
    p.wash('#070e15', Math.round(255 * sh), g.head, 0.06, 0.2);
    p.wash('#070e15', Math.round(235 * sh), g.mouth, 0.06, 0.2);
  }
  if (sh > 0) {
    // the four eyes stay as cold glints: the silhouette's signature from far away
    g.eyes.forEach(({c: [x, y], r, sx}) => p.flat('#a9d8d2', ring(x, y, Math.max(2.5, r * 0.45 * sx), Math.max(2.5, r * 0.4), 10)));
  }
};

// ---------------------------------------------------------------- look stills
type Look = {
  id: string;
  title: string;
  paper: string;
  camera: Camera;
  label?: string;
  paint: (p: Painter) => void;
  screen?: (p: Painter) => void;
  svg?: ReactNode;
  /** Above the in-camera SVG and grain, below the label (screen-space). */
  grade?: boolean;
};

const Tag = ({id, title}: {id: string; title: string}) => (
  <div style={{position: 'absolute', left: 24, top: 18, right: 24, fontFamily: 'Noto Sans Thai, sans-serif', fontSize: 26, lineHeight: 1.25, color: '#fff', WebkitTextStroke: '4px #111', paintOrder: 'stroke fill'}}>
    <b>{id}</b> · BLOOP-EP01-SHORT · look check (spike)
    <br />
    <span style={{fontSize: 22}}>{title}</span>
  </div>
);

export const LookStill = ({look, tag = true}: {look: Look; tag?: boolean}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const paint = useCallback(({brush}: PaintContext) => {
    const p = makePainter(brush, {t, frame, fade: look.paper});
    brush.push();
    applyCamera(brush, look.camera);
    look.paint(p);
    brush.pop();
    look.screen?.(p);
  }, [look, t, frame]);
  return (
    <AbsoluteFill style={{backgroundColor: look.paper}}>
      <BrushCanvas paint={paint} paper={look.paper} />
      {look.svg}
      {look.grade !== false && <Grade />}
      <Grain />
      {look.label && <PaintedLabel text={look.label} />}
      {tag && <Tag id={look.id} title={look.title} />}
    </AbsoluteFill>
  );
};

const HYD = {x: 540, y: 600};
const LABEL_REAL = 'เสียงจริง เร่ง 16 เท่า';
const LABEL_IMAG = 'จินตนาการ';

const camA1: Camera = {s: 1.03, fx: HYD.x, fy: HYD.y, dx: 0, dy: 0};
const camA2: Camera = {s: 1.3, fx: HYD.x, fy: HYD.y, dx: 60, dy: -20};
const camB: Camera = {s: 1, fx: 540, fy: 600, dx: 0, dy: 0};
const camC: Camera = {s: 1, fx: 540, fy: 640, dx: 0, dy: 0};

export const LOOKS: Record<string, Look> = {
  'L-A1': {
    id: 'L-A1', title: 'SET-DEEP: indigo bands, rings centred on PROP-HYD (contracting)', paper: '#0b1622', camera: camA1, label: LABEL_REAL,
    paint: (p) => { paintDeep(p); paintHydrophone(p, HYD.x, HYD.y); },
    screen: (p) => paintSnow(p, p.t),
    svg: <CameraLayer camera={camA1} width={W} height={H}><Rings cx={HYD.x} cy={HYD.y} radii={[150, 270, 410, 570]} /></CameraLayer>,
  },
  'L-A2': {
    id: 'L-A2', title: 'SET-DEEP closer (s 1.3), darker; wavefronts arrive from off-frame left', paper: '#0b1622', camera: camA2, label: LABEL_REAL,
    paint: (p) => { paintDeep(p, {haze: 0.5}); paintHydrophone(p, HYD.x, HYD.y); },
    screen: (p) => paintSnow(p, p.t, 110, '#7f97a9'),
    svg: <CameraLayer camera={camA2} width={W} height={H}><Wavefronts ox={-700} oy={420} radii={[1100, 1250, 1400]} /></CameraLayer>,
  },
  'L-B1': {
    id: 'L-B1', title: 'CRD-1 frill serpent: sinuous body, ribbed dorsal frill', paper: DREAM_PAPER, camera: camB, label: LABEL_IMAG,
    paint: (p) => { paintDreamWater(p); paintDream1(p); }, grade: false,
  },
  'L-B2': {
    id: 'L-B2', title: 'CRD-2 four-eyed armoured fish: plated head, toothy jaw, gills', paper: DREAM_PAPER, camera: camB, label: LABEL_IMAG,
    paint: (p) => {
      paintDreamWater(p, 520);
      // scale 0.82 about (560, 560), then down 50: crown spines clear the top, snout clears the left edge
      p.brush.push(); p.brush.translate(560, 610); p.brush.scale(0.82); p.brush.translate(-560, -560);
      paintDream2(p);
      p.brush.pop();
    }, grade: false,
  },
  'L-B3': {
    id: 'L-B3', title: 'CRD-3 "bloop" mass: lobed blob, eye cluster, wide maw', paper: DREAM_PAPER, camera: camB, label: LABEL_IMAG,
    paint: (p) => { paintDreamWater(p); paintDream3(p); }, grade: false,
  },
};

const realLook = (detail: Detail, id: string, title: string): Look => ({
  id, title, paper: '#0b1622', camera: camC, label: LABEL_IMAG,
  paint: (p) => { paintDeep(p, {haze: 0.6}); paintHydrophone(p, 160, 690); },
  screen: (p) => paintSnow(p, p.t, 60),
  svg: (
    <CameraLayer camera={camC} width={W} height={H} blend="normal">
      <CrReal mx={500} my={560} k={0.86} detail={detail} />
      <HydSvg cx={160} cy={690} />
    </CameraLayer>
  ),
});
LOOKS['L-C1'] = realLook(1, 'L-C1', 'CR-REAL (CRD-2 solid) low detail: flat gradients, simple eyes and teeth');
LOOKS['L-C2'] = realLook(2, 'L-C2', 'CR-REAL medium: turbulence skin, plate seams, specular eyes, gills');
LOOKS['L-C3'] = realLook(3, 'L-C3', 'CR-REAL high: + scales, inner teeth row, brow ridges, cold pores');

const paintedRealLook = (detail: 2 | 3, id: string, title: string): Look => ({
  id, title, paper: '#0b1622', camera: camC, label: LABEL_IMAG,
  // painted depth needs no seam: the hydrophone is simply painted after the creature
  paint: (p) => { paintDeep(p, {haze: 0.6}); paintCrReal(p, 500, 560, 0.86, detail); paintHydrophone(p, 160, 690); },
  screen: (p) => paintSnow(p, p.t, 60),
});
LOOKS['L-CP2'] = paintedRealLook(2, 'L-CP2', 'CR-REAL painted (p5.brush) medium: washes, still-ink plates, teeth and eyes');
LOOKS['L-CP3'] = paintedRealLook(3, 'L-CP3', 'CR-REAL painted high: + crosshatched scale texture, inner teeth row, cold pores');

// Rush check (feasibility note only, not a look option): the same frames under the B10 push at s = 4 about the mouth.
const camRush: Camera = {s: 4, fx: 534, fy: 640, dx: 0, dy: 0};
LOOKS['L-CP3-S4'] = {...paintedRealLook(3, 'L-CP3-S4', 'rush check: painted high at camera s 4 about the mouth'), camera: camRush};
LOOKS['L-C3-S4'] = {
  ...realLook(3, 'L-C3-S4', 'rush check: SVG high at camera s 4 about the mouth'), camera: camRush,
  svg: (
    <CameraLayer camera={camRush} width={W} height={H} blend="normal">
      <CrReal mx={500} my={560} k={0.86} detail={3} />
      <HydSvg cx={160} cy={690} />
    </CameraLayer>
  ),
};

// B10 rush proof (BLOOP-BRIEF-R2 VD11): K05 rush 42 f, s 1 -> 3 ease-in about the mouth, throat black opens to the lips;
// K06 24 f: a screen-space black fade over the frozen s 3 frame to RGB 0 (a painter-alpha drain lightens washes). 66 frames; L249 = f0.
const RUSH_F = 42, DRAIN_F = 24, S_MAX = 3;
const rushAt = (f: number) => {
  const u = Math.min(1, f / RUSH_F);
  return {s: 1 + (S_MAX - 1) * u * u, dy: 270 * u * u, ap: ramp(u, 0.2, 1), alpha: 1 - ramp(f, RUSH_F, RUSH_F + DRAIN_F - 1)};
};
export const CP3Rush = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const r = rushAt(frame);
  const paint = useCallback(({brush}: PaintContext) => {
    if (r.alpha <= 0) return;
    const cam: Camera = {s: r.s, fx: 534, fy: 650, dx: 0, dy: r.dy};
    const p = makePainter(brush, {t: frame / fps, frame});
    brush.push();
    applyCamera(brush, cam);
    paintDeep(p, {haze: 0.6});
    paintCrReal(p, 500, 560, 0.86, 3, {aperture: r.ap});
    paintHydrophone(p, 160, 690);
    brush.pop();
    paintSnow(p, frame / fps, 60);
  }, [frame, fps, r.alpha, r.ap, r.s, r.dy]);
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <BrushCanvas paint={paint} paper="#000000" />
      {r.alpha > 0 && <><Grade /><Grain /></>}
      <AbsoluteFill style={{backgroundColor: '#000', opacity: 1 - r.alpha}} />
      {r.alpha > 0 && <PaintedLabel text={LABEL_IMAG} />}
      <Tag id={`L-CP3 rush f${frame}`} title={`s ${r.s.toFixed(2)} · aperture ${r.ap.toFixed(2)} · plate alpha ${r.alpha.toFixed(2)}`} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- ICE keel reference (BLOOP-BRIEF-R4 FR04/FR09), Film only
/**
 * FR04 keel silhouette (R4): the union of a wide top shelf, a body ellipse and 5 hanging lobes of unequal size, read
 * radially from the centroid (120 rays), low-pass filtered (window 7) so the joins between lobes become soft waists, not
 * cusps; then the top is cut at the waterline row with a gentle irregular dome. `w` = bounding width, depth ~ w / 1.6.
 */
export const keelOutline = (cx: number, cy: number, w: number, seed = 1): Pt[] => {
  const D = w / 1.6, j = (i: number, amp: number) => (hash(seed * 17 + i) - 0.5) * 2 * amp;
  // [centre x, centre y, rx, ry] in units of w (x) and D (y); y down from the waterline row
  const lobes: [number, number, number, number][] = [
    [0, 0.08, 0.5, 0.14],                                  // top shelf: widest part, at the waterline
    [0.02, 0.28, 0.43, 0.3],                               // body
    [-0.13 + j(1, 0.03), 0.62 + j(2, 0.04), 0.2, 0.36],    // main keel bulge, off-centre (deepest point)
    [0.2 + j(3, 0.03), 0.5 + j(4, 0.04), 0.15, 0.22],     // secondary bulge
    [0.37 + j(5, 0.02), 0.27, 0.11, 0.16],                 // right shoulder knob
    [-0.37 + j(6, 0.02), 0.3, 0.12, 0.19],                 // left shoulder knob
    [0.06 + j(7, 0.03), 0.7, 0.09, 0.14],                  // small low knob next to the keel
  ];
  const ox = 0.02 * w, oy = 0.33 * D; // ray origin (inside the body)
  const inside = (x: number, y: number) => lobes.some(([lx, ly, rx, ry]) => ((x - lx * w) / (rx * w)) ** 2 + ((y - ly * D) / (ry * D)) ** 2 <= 1);
  const n = 120;
  const rr = Array.from({length: n}, (_, i) => {
    const t = (i / n) * 6.283, c = Math.cos(t), sn = Math.sin(t);
    let r = 0;
    for (let d = 2; d < w; d += 2) if (inside(ox + c * d, oy + sn * d)) r = d;
    return r;
  });
  const sm = rr.map((_, i) => {
    let acc = 0;
    for (let k = -3; k <= 3; k++) acc += rr[(i + k + n) % n];
    return acc / 7;
  });
  return sm.map((r, i) => {
    const t = (i / n) * 6.283;
    const x = ox + Math.cos(t) * r;
    let y = oy + Math.sin(t) * r;
    const top = -0.02 * D - 0.035 * D * Math.cos((x / w) * 2.6) + j(20 + Math.round(x / 40), 0.006 * D);
    if (y < top) y = top;
    return [cx + x, cy + y] as Pt;
  });
};

/** Clip a closed polygon to y <= yc ('above') or y >= yc ('below') (Sutherland-Hodgman against one row). */
const clipY = (poly: Pt[], yc: number, keep: 'above' | 'below'): Pt[] => {
  const ins = ([, y]: Pt) => (keep === 'above' ? y <= yc : y >= yc);
  const out: Pt[] = [];
  poly.forEach((cur, i) => {
    const prev = poly[(i + poly.length - 1) % poly.length];
    const cross = (): Pt => {
      const u = (yc - prev[1]) / (cur[1] - prev[1]);
      return [prev[0] + (cur[0] - prev[0]) * u, yc];
    };
    if (ins(cur)) {
      if (!ins(prev)) out.push(cross());
      out.push(cur);
    } else if (ins(prev)) out.push(cross());
  });
  return out;
};

/** Painted keel: value bands follow depth inside the outline (clipped rows, soft bleed), no box, no outline ink. */
const paintKeel = (p: Painter, pts: Pt[], glowFar = false) => {
  const sm = closed(pts, 120);
  const ys = sm.map((q) => q[1]), xs = sm.map((q) => q[0]);
  const y0 = Math.min(...ys), y1 = Math.max(...ys), x0 = Math.min(...xs), x1 = Math.max(...xs), h = y1 - y0;
  if (glowFar) {
    // FR09: shape-following haze, the outline grown ~16 px with a high bleed; never a disc or an ellipse primitive
    p.wash('#5e8798', 60, scaleAbout(sm, (x0 + x1) / 2, (y0 + y1) / 2, 1 + 32 / (x1 - x0), 1 + 32 / h), 0.5, 0.4);
  }
  p.flat('#2f5a6b', sm);                                               // underside value everywhere first
  p.wash('#5e91a3', 230, clipY(sm, y0 + 0.72 * h, 'above'), 0.18, 0.5); // body band
  p.wash('#6f9fb0', 170, clipY(sm, y0 + 0.45 * h, 'above'), 0.2, 0.5);
  p.wash('#b8dbe6', 220, clipY(sm, y0 + 0.17 * h, 'above'), 0.15, 0.45); // top face
  p.wash('#24495a', 170, clipY(sm, y0 + 0.86 * h, 'below'), 0.2, 0.5);  // underside deepening
};

const SET_COLD = ['#16343d', '#132e37', '#112931', '#0f252c', '#0d2027', '#0b1c22', '#0a181d'];

export const IceRef = ({scale}: {scale: 'sh11' | 'sh12' | 'sh13'}) => {
  const frame = useCurrentFrame();
  const paint = useCallback(({brush}: PaintContext) => {
    const p = makePainter(brush, {t: 0, frame});
    if (scale === 'sh11') {
      bands(p, W, '#112931', SET_COLD, -260, H + 260, {opacity: 200, bleed: 0.04, texture: 0.35});
      paintKeel(p, keelOutline(700, 470, 680, 3));
    } else if (scale === 'sh12') {
      // section: surface line y 300; ~1/9 of the berg above it
      bands(p, W, '#132538', DEEP, 300, H + 260, {opacity: 200, bleed: 0.04, texture: 0.35});
      p.flat('#0b1622', span(W, -300, 300));
      const k = keelOutline(205, 309, 250, 3);
      paintKeel(p, k);
      // the ~1/9 above water: a low, irregular tabular cap, 60 % of the keel width, brightest value
      const cap: Pt[] = [[132, 301], [136, 284], [160, 279], [196, 281], [228, 277], [262, 283], [276, 301]];
      p.flat('#b8dbe6', closed(cap, 30));
      p.wash('#e3f3f7', 200, closed(cap.map(([x, y]) => [x, y - 2] as Pt).slice(1, -1).concat([[262, 292], [140, 292]]), 20), 0.1, 0.4);
      p.inkStill(700, 'HB', '#9fb7c4', 1.6);
      brush.line(-20, 300, W + 20, 300);
    } else {
      paintDeep(p, {haze: 0.6});
      paintKeel(p, keelOutline(920, 470, 260, 3), true);
      paintHydrophone(p, 380, 560);
    }
  }, [frame, scale]);
  const title = {sh11: 'FR04 keel at SH11 scale (680 px wide), SET-COLD', sh12: 'FR04 keel at SH12 scale (250 px), surface line y 300, ~1/9 above', sh13: 'FR09 far ice (260 px) with shape-following haze, no disc'}[scale];
  return (
    <AbsoluteFill style={{backgroundColor: '#0b1622'}}>
      <BrushCanvas paint={paint} paper="#0b1622" />
      <Grain />
      <Tag id={`ICE-REF ${scale.toUpperCase()}`} title={title} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- B10 hero ending look stills (BLOOP-BRIEF-R5), Film only
// SH13 screen layout (s 1): hydrophone centre (380, 560), far ice centre (760, 470). The creature approaches from beyond
// the ice: its own scale k grows (world motion, not camera), mouth centre = (mx + 40k, my + 80k).
type HeroBeat = 'far' | 'approach' | 'ice' | 'hyd' | 'cover';
const HERO: Record<HeroBeat, {k: number; mouth: Pt; shadow: number; behindIce: boolean; title: string}> = {
  far: {k: 0.17, mouth: [800, 380], shadow: 1, behindIce: true, title: 'H1 far silhouette beyond the ice (k 0.17): four cold eye glints, no detail'},
  approach: {k: 0.3, mouth: [780, 430], shadow: 0.6, behindIce: true, title: 'H2 approach (k 0.30): detail resolving out of the dark, mouth opening'},
  ice: {k: 0.52, mouth: [760, 480], shadow: 0.25, behindIce: false, title: 'H3 swallows the far ice (k 0.52): ice inside the mouth, darkening'},
  hyd: {k: 1.0, mouth: [400, 610], shadow: 0, behindIce: false, title: 'H4 swallows the hydrophone (k 1.0 = CP3 L249 size): post inside the mouth'},
  cover: {k: 1.0, mouth: [400, 610], shadow: 0, behindIce: false, title: 'H5 mouth covers the screen: camera s 3, aperture 1 (then black hold)'},
};
export const HeroStill = ({beat}: {beat: HeroBeat}) => {
  const frame = useCurrentFrame();
  const h = HERO[beat];
  const paint = useCallback(({brush}: PaintContext) => {
    const p = makePainter(brush, {t: 0, frame});
    const cam: Camera = beat === 'cover' ? {s: 3, fx: h.mouth[0], fy: h.mouth[1], dx: 140, dy: 300} : STILL_CAMERA_B10;
    brush.push();
    applyCamera(brush, cam);
    paintDeep(p, {haze: 0.6});
    const mx = h.mouth[0] - 40 * h.k, my = h.mouth[1] - 80 * h.k;
    const ice = () => paintKeel(p, keelOutline(760, 450, 260, 3), true);
    const iceInside = () => {
      // the berg, shrunk toward the throat and darkened: it is going in
      const pts = keelOutline(760, 470, 170, 3).map(([x, y]) => [x, y] as Pt);
      paintKeel(p, pts);
      p.wash('#02070b', 150, closed(pts, 60), 0.2, 0.3);
    };
    const hydInside = () => {
      paintHydrophone(p, 380, 600, 0.9);
      p.wash('#02070b', 120, [[320, 420], [440, 420], [440, 780], [320, 780]], 0.3, 0.3);
    };
    if (h.behindIce) {
      paintCrReal(p, mx, my, h.k, 3, {shadow: h.shadow, aperture: 0});
      ice();
      paintHydrophone(p, 380, 560);
    } else if (beat === 'ice') {
      paintCrReal(p, mx, my, h.k, 3, {shadow: h.shadow, inside: iceInside});
      paintHydrophone(p, 380, 560);
    } else {
      paintCrReal(p, mx, my, h.k, 3, {inside: beat === 'cover' ? undefined : hydInside, aperture: beat === 'cover' ? 1 : 0.3});
    }
    brush.pop();
    paintSnow(p, 0, 60);
  }, [frame, beat, h]);
  return (
    <AbsoluteFill style={{backgroundColor: '#0b1622'}}>
      <BrushCanvas paint={paint} paper="#0b1622" />
      <Grade />
      <Grain />
      <PaintedLabel text={LABEL_IMAG} />
      <Tag id={`B10-HERO ${beat}`} title={h.title} />
    </AbsoluteFill>
  );
};
const STILL_CAMERA_B10: Camera = {s: 1, fx: 540, fy: 960, dx: 0, dy: 0};

// ---------------------------------------------------------------- B10 far silhouette fix (BLOOP-BRIEF-R7 H09), Film only
/**
 * CRD-2 in profile (the L-B2 drawing: head left), as one soft dark silhouette for P1. Built in L-B2 drawing units
 * (snout x −40 … tail fin x 1560, head centre (300, 560)), scaled so the full length is `len` px, centred on the head at
 * (hx, hy). `bend` = tail undulation phase (radians): spine y offset 0.07·len·sin(bend − 3.2·u) over the body (u 0..1 from
 * the gills to the tail), head fixed.
 */
const profileSilhouette = (hx: number, hy: number, len: number, bend: number) => {
  const sc = len / 1600;
  const spineRaw: Pt[] = [[420, 560], [700, 565], [920, 590], [1130, 575], [1380, 540]];
  const spine = bez(spineRaw, 40).map(([x, y], i, a) => {
    const u = i / (a.length - 1);
    return [x, y + (0.07 * 1600) * u * Math.sin(bend - 3.2 * u)] as Pt;
  });
  const {top, bot} = tube(spine, (u) => 470 - u * 360);
  const end = spine[spine.length - 1], endTop = top[top.length - 1], endBot = bot[bot.length - 1];
  const fin: Pt[] = [endTop, [end[0] + 120, end[1] - 170], [end[0] + 180, end[1] - 150], [end[0] + 90, end[1]], [end[0] + 180, end[1] + 150], [end[0] + 120, end[1] + 170], endBot];
  const head: Pt[] = [[560, 290], [330, 250], [130, 320], [-20, 470], [-40, 640], [60, 790], [280, 860], [520, 830], [640, 700]];
  const dorsal: Pt[] = [[700, 380], [780, 250], [900, 270], [950, 400]];
  const pect: Pt[] = [[600, 760], [700, 930], [840, 950], [780, 790]];
  const T = ([x, y]: Pt): Pt => [hx + (x - 300) * sc, hy + (y - 560) * sc];
  return {
    body: [...top, ...fin.slice(1, -1), ...bot.slice().reverse()].map(T),
    head: closed(head, 40).map(T),
    fins: [closed(dorsal, 16).map(T), closed(pect, 16).map(T)],
    eyes: ([[160, 470, 30], [250, 380, 22]] as [number, number, number][]).map(([x, y, r]) => ({c: T([x, y]), r: Math.max(2.5, r * sc * 0.6)})),
  };
};

/** Soft far silhouette: water-tinted dark (a few levels under the water, not black), bleeding edges, two cold glints. */
const paintFarProfile = (p: Painter, hx: number, hy: number, len: number, bend: number, tone = '#0d1b2a', sx = 1) => {
  const s0 = profileSilhouette(hx, hy, len, bend);
  const fx = (pts: Pt[]) => pts.map(([x, y]) => [hx + (x - hx) * sx, y] as Pt);
  const s = {body: fx(s0.body), head: fx(s0.head), fins: s0.fins.map(fx), eyes: s0.eyes.map(({c, r}) => ({c: [hx + (c[0] - hx) * sx, c[1]] as Pt, r}))};
  s.fins.forEach((f) => p.wash(tone, 230, f, 0.12, 0.2));
  p.wash(tone, 245, s.body, 0.1, 0.2);
  p.wash(tone, 250, s.head, 0.1, 0.2);
  p.wash('#09141f', 150, scaleAbout(s.head, s.head[0][0], s.head[0][1], 0.8, 0.8), 0.2, 0.2);
  s.eyes.forEach(({c: [x, y], r}) => p.flat('#a9d8d2', ring(x, y, r, r * 0.85, 10)));
};

/** P2 turn: the front-3/4 head (CP3, shadowed) with the foreshortened body and tail trailing up-right behind it. */
const paintTurnBody = (p: Painter, mouth: Pt, k: number, tone = '#0d1b2a') => {
  const headW = 1100 * k, [mx, my] = mouth;
  const base: Pt = [mx + 0.1 * headW, my - 0.25 * headW];
  const ang = -0.55, L = 1.25 * headW;
  const dir: Pt = [Math.cos(ang), Math.sin(ang)], nrm: Pt = [-dir[1], dir[0]];
  const w = (u: number) => headW * (0.42 - 0.34 * u);
  const sp = range(16, (u) => [base[0] + dir[0] * L * u + nrm[0] * 0.08 * headW * Math.sin(u * 3), base[1] + dir[1] * L * u + nrm[1] * 0.08 * headW * Math.sin(u * 3)] as Pt);
  const side = (sg: number) => sp.map(([x, y], i) => [x + nrm[0] * sg * w(i / 16), y + nrm[1] * sg * w(i / 16)] as Pt);
  const tip = sp[16];
  const fin: Pt[] = [[tip[0] + dir[0] * 0.25 * headW + nrm[0] * 0.22 * headW, tip[1] + dir[1] * 0.25 * headW + nrm[1] * 0.22 * headW], [tip[0] + dir[0] * 0.12 * headW, tip[1] + dir[1] * 0.12 * headW], [tip[0] + dir[0] * 0.25 * headW - nrm[0] * 0.22 * headW, tip[1] + dir[1] * 0.25 * headW - nrm[1] * 0.22 * headW]];
  p.wash(tone, 245, [...side(1), ...fin, ...side(-1).reverse()], 0.12, 0.2);
};

type FarBeat = 'p1a' | 'p1b' | 'p2a' | 'p2b';
const FAR: Record<FarBeat, string> = {
  p1a: 'P1 start: profile silhouette, 230 px long, head left, swimming left beyond the ice',
  p1b: 'P1 end: profile 380 px, tail bent, two glints; still beyond and above the ice',
  p2a: 'P2 turn (f14-24): profile foreshortens (x 0.45) as the 3/4 head fades in at shadow 0.6, jaw opening; body trails up-right',
  p2b: 'P2 late: k 0.40, shadow 0.4, body behind the head, jaw opening',
};
export const FarStill = ({beat}: {beat: FarBeat}) => {
  const frame = useCurrentFrame();
  const paint = useCallback(({brush}: PaintContext) => {
    const p = makePainter(brush, {t: 0, frame});
    paintDeep(p, {haze: 0.6});
    if (beat === 'p1a') paintFarProfile(p, 960, 320, 230, 0.4);
    if (beat === 'p1b') paintFarProfile(p, 820, 350, 380, 1.9);
    if (beat === 'p2a') {
      const k = 0.3, m: Pt = [790, 410];
      paintFarProfile(p, 800, 360, 460, 1.2, '#0d1b2a', 0.45);
      paintTurnBody(p, m, k);
      paintCrReal(p, m[0] - 40 * k, m[1] - 80 * k, k, 3, {shadow: 0.6, aperture: 0.4});
    }
    if (beat === 'p2b') {
      const k = 0.4, m: Pt = [775, 440];
      paintTurnBody(p, m, k, '#101f2e');
      paintCrReal(p, m[0] - 40 * k, m[1] - 80 * k, k, 3, {shadow: 0.4, aperture: 0});
    }
    paintKeel(p, keelOutline(760, 450, 260, 3), true);
    paintHydrophone(p, 380, 560);
    paintSnow(p, 0, 60);
  }, [frame, beat]);
  return (
    <AbsoluteFill style={{backgroundColor: '#0b1622'}}>
      <BrushCanvas paint={paint} paper="#0b1622" />
      <Grade />
      <Grain />
      <PaintedLabel text={LABEL_IMAG} />
      <Tag id={`B10-FAR ${beat}`} title={FAR[beat]} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- B04 hero dream creature (BLOOP-BRIEF-R8 H11), Film only
// Richer CR-DREAM (CRD-2, L-B2) in the same local coordinates as `paintDreamCreature` (src/painted/bloop/creatures.ts).
// Palette rule: the dream stays grey-violet; glows and specks are pale lilac-white, never cyan (ice colour is withheld
// until B05, VD02).
const DREAM_GLOW = '#efe9ff', DREAM_SPECK = '#e3dcff', PLATE_LIGHT = '#cfc8e0';
export type DreamRich = {eyes: number; gape: number; glow: number; phase: number; specks: boolean; rich: boolean};
const lerpPt = (a: Pt, b: Pt, u: number): Pt => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
export const paintDreamRich = (p: Painter, place: {s: number; tx: number; ty: number}, o: DreamRich) => {
  const {brush} = p;
  brush.push();
  brush.translate(place.tx, place.ty);
  brush.scale(place.s);
  // body: spine undulation (tail end ±22 local, head fixed), period set by `phase`
  const spine = bez([[420, 560], [700, 560], [920, 600], [1130, 560], [1400, 470]], 40).map(([x, y], i, a) => {
    const u = i / (a.length - 1);
    return [x, y + 22 * u * u * Math.sin(o.phase - 2.6 * u)] as Pt;
  });
  const {top, bot} = tube(spine, (u) => 470 - u * 320);
  blotch(p, '#b9b2ca', 140, [...top, ...bot.slice().reverse()]);
  const head: Pt[] = [[560, 290], [330, 250], [130, 320], [-20, 470], [-40, 640], [60, 790], [280, 860], [520, 830], [640, 700]];
  blotch(p, '#a59ebd', 175, closed(head, 50), 3);
  // armour plates: each a tone wash, a lit top edge, cross-contour hatching (rich only)
  const plates: {pts: Pt[]; ang: number}[] = [
    {pts: [[130, 320], [330, 250], [360, 420], [300, 560], [140, 620], [60, 470]], ang: 0.9},     // cheek / eye plate
    {pts: [[330, 250], [560, 290], [600, 480], [360, 420]], ang: -0.4},                         // crown plate
    {pts: [[560, 290], [640, 700], [580, 700], [600, 480]], ang: 1.3},                          // operculum
    {pts: [[-20, 470], [60, 470], [140, 620], [-30, 600]], ang: 0.2},                          // snout
  ];
  if (o.rich) {
    plates.forEach(({pts, ang}, k) => {
      const c = closed(pts, 30);
      p.wash(k % 2 ? '#8a82a8' : '#7d7599', 170, scaleAbout(c, c[0][0], c[0][1], 0.95, 0.95), 0.12, 0.6);
      hatchIn(p, 600 + k, scaleAbout(c, pts[0][0], pts[0][1], 0.88, 0.88), 6, ang, INK_D);
      sketch(p, 610 + k, bez(pts.slice(0, 3), 12).map(([x, y]) => [x, y + 6] as Pt), {w: 1.6, color: PLATE_LIGHT, passes: 1, jit: 3});
    });
    // pits and scars on the plates (layered ink dots), fixed by hash
    p.ink(620, 'HB', INK_D, 1.4);
    for (let i = 0; i < 26; i++) {
      const pl = plates[i % 3].pts, a = pl[Math.floor(hash(i + 900) * pl.length)], b = pl[Math.floor(hash(i + 901) * pl.length)];
      const [x, y] = lerpPt(a, b, 0.3 + 0.4 * hash(i + 902));
      brush.spline([[x - 6, y], [x, y - 4], [x + 6, y + 1]], 0.4);
    }
  }
  hatchIn(p, 300, closed([[-30, 620], [200, 700], [520, 720], [560, 830], [280, 860], [60, 790]], 30), 8, -0.6);
  hatchIn(p, 301, [...bot.slice(0, 32), ...top.slice(0, 32).reverse().map(([x, y]) => [x, y + 220] as Pt)], 10, 0.5);
  sketch(p, 302, closed(head, 50), {w: o.rich ? 3.4 : 2.8});
  sketch(p, 303, top.slice(3), {w: 2.3});
  sketch(p, 304, bot.slice(3), {w: 2.3});
  plates.forEach(({pts}, k) => sketch(p, 310 + k, bez(pts as Pt[], 16), {w: o.rich ? 2.4 : 1.8, jit: 5}));
  // crown spines: rich = longer, with membrane washes between them (washes first: a wash resets the stroke state)
  const crown = bez([[130, 320], [330, 250], [560, 290], [720, 340]], 10);
  const spineLen = (i: number) => (o.rich ? 70 : 50) + 40 * hash(i + 70);
  if (o.rich) crown.slice(0, -1).forEach(([x, y], i) => {
    const [x2, y2] = crown[i + 1];
    p.wash('#a39bbd', 140, [[x + 4, y - spineLen(i) * 0.85], [x2 + 4, y2 - spineLen(i + 1) * 0.85], [x2, y2], [x, y]], 0.15, 0.6);
  });
  p.ink(318, 'HB', INK_D, o.rich ? 2.2 : 1.8);
  crown.forEach(([x, y], i) => brush.spline([[x - 14, y + 4], [x + 4, y - spineLen(i)], [x + 18, y + 4]], 0.3));
  // core shadow on the lower head (rich): form, not just outline
  if (o.rich) p.wash('#6b6488', 120, closed([[-30, 640], [200, 720], [520, 730], [600, 800], [280, 850], [60, 780]], 30), 0.2, 0.5);
  // mouth: lip line splits into a gape (head silhouette unchanged), dark interior, underbite blades on the lower lip
  const g = o.gape;
  const lipU = bez([[-30, 600], [120, 640 - 46 * g], [320, 650 - 40 * g], [520, 610]], 20);
  const lipL = bez([[-30, 600], [120, 640 + 58 * g], [320, 650 + 50 * g], [520, 610]], 20);
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
    if (o.rich) p.wash('#ece6f6', 220, [[x - 12, y + 4], [x + 2, y - l], [x + 12, y + 4]], 0.02, 0.2);
    brush.polygon([[x - 12, y + 4], [x + 2, y - l], [x + 12, y + 4]]);
  });
  if (o.rich && g > 0.02) {
    p.ink(327, 'HB', INK_D, 1.4);
    lipU.slice(2, 16).forEach(([x, y], i) => { if (i % 3 === 0) brush.polygon([[x - 7, y - 2], [x + 1, y + 26 + 14 * hash(i + 430)], [x + 7, y - 2]]); });
  }
  // eyes: closed = a lid line; open = iris, slit, highlight and a pale lilac glow (never cyan)
  ([[160, 470, 34], [250, 380, 24]] as [number, number, number][]).forEach(([x, y, r], k) => {
    if (o.eyes < 0.5) {
      sketch(p, 330 + k * 4, bez([[x - r, y], [x, y + r * 0.35], [x + r, y]], 10), {w: 2.4, jit: 3});
      sketch(p, 331 + k * 4, bez([[x - r * 1.4, y - r * 0.6], [x, y - r * 1.4], [x + r * 1.3, y - r * 0.9]], 10), {w: 2.4, jit: 4});
      return;
    }
    if (o.glow > 0) {
      p.wash(DREAM_GLOW, Math.round(120 * o.glow), ring(x, y, r * 2.2, r * 1.9, 20), 0.35, 0.3);
      p.wash(DREAM_GLOW, Math.round(170 * o.glow), ring(x, y, r * 1.4, r * 1.2, 18), 0.3, 0.3);
    }
    p.flat('#f4f0ff', ring(x, y, r, r * 0.8, 18));
    p.wash('#a79fc4', 200, ring(x + r * 0.1, y, r * 0.7, r * 0.6, 16), 0.1, 0.3);
    p.flat('#1d1a2a', ring(x + r * 0.15, y, r * 0.16, r * 0.62, 12));
    p.flat('#ffffff', ring(x - r * 0.35, y - r * 0.3, r * 0.17, r * 0.15, 10));
    sketch(p, 330 + k * 4, closed([[x - r, y], [x, y - r * 0.8], [x + r, y], [x, y + r * 0.8]], 20), {w: 2.4, jit: 3});
    sketch(p, 331 + k * 4, bez([[x - r * 1.4, y - r * 0.6], [x, y - r * 1.4], [x + r * 1.3, y - r * 0.9]], 10), {w: 2.6, jit: 4});
  });
  // gills: slits plus feathery filaments (rich)
  [0, 1, 2, 3].forEach((k) => {
    const sl = bez([[660 + k * 28, 420], [645 + k * 28, 560], [660 + k * 28, 700]], 10);
    sketch(p, 340 + k, sl, {w: 1.8, jit: 4});
    if (o.rich) {
      p.wash('#6e6790', 140, [...sl, ...sl.slice().reverse().map(([x, y]) => [x + 12, y] as Pt)], 0.1, 0.4);
      p.ink(350 + k, 'HB', INK_D, 1.1);
      sl.forEach(([x, y], i) => { if (i % 2 === 0) brush.line(x + 2, y, x + 16 + 4 * Math.sin(o.phase + i), y + 6); });
    }
  });
  // fins: membrane wash and rays (rich)
  const pect = bez([[600, 790], [700, 960], [860, 990], [800, 800]], 16);
  const dors = bez([[780, 380], [860, 230], [1000, 270], [1010, 400]], 14);
  [pect, dors].forEach((f, k) => {
    if (o.rich) {
      p.wash('#b3abc8', 130, f, 0.15, 0.6);
      p.ink(360 + k, 'HB', INK_D, 1.2);
      const root = k ? ([890, 400] as Pt) : ([640, 800] as Pt);
      f.slice(2, -2).forEach(([x, y], i) => { if (i % 2 === 0) brush.line(root[0], root[1], x, y); });
    }
    sketch(p, 345 + k, f, {w: 2.2});
  });
  sketch(p, 347, bez([[720, 560], [900, 590], [1100, 560], [1300, 490]], 16), {w: 1.2, passes: 1});
  // bioluminescent specks along the lateral line and the jaw: pale lilac points with a faint halo
  if (o.specks) {
    const line = [...bez([[720, 560], [900, 590], [1100, 560], [1300, 490]], 9), ...bez([[40, 700], [200, 760], [420, 770]], 5)];
    line.forEach(([x, y], i) => {
      const tw = 0.6 + 0.4 * Math.sin(o.phase * 1.7 + i * 1.3);
      p.wash(DREAM_SPECK, Math.round(90 * tw), ring(x, y + 8, 14, 12, 10), 0.3, 0.3);
      p.flat('#fbf9ff', ring(x, y + 8, 4, 4, 8));
    });
  }
  brush.pop();
};

type B04Beat = 'rest' | 'reveal';
export const B04Still = ({beat}: {beat: B04Beat}) => {
  const frame = useCurrentFrame();
  const paint = useCallback(({brush}: PaintContext) => {
    const cam: Camera = {s: 1.02, fx: 380, fy: 440, dx: 0, dy: 0};
    const p = makePainter(brush, {t: 0, frame});
    brush.push();
    applyCamera(brush, cam);
    paintDreamWater(p, 520);
    const o: DreamRich = beat === 'rest'
      ? {eyes: 0, gape: 0, glow: 0, phase: 0.6, specks: true, rich: true}
      : {eyes: 1, gape: 1, glow: 1, phase: 1.8, specks: true, rich: true};
    paintDreamRich(p, {s: 0.79, tx: 53.6, ty: 148.7}, o);
    brush.pop();
  }, [frame, beat]);
  return (
    <AbsoluteFill style={{backgroundColor: DREAM_PAPER}}>
      <BrushCanvas paint={paint} paper={DREAM_PAPER} />
      <Grain />
      <PaintedLabel text={LABEL_IMAG} />
      <Tag id={`B04-HERO ${beat}`} title={beat === 'rest' ? 'R8 rich CR-DREAM, formed, eyes shut (before the reveal word)' : 'R8 reveal: four eyes open with a pale glow, jaw gapes, specks pulse'} />
    </AbsoluteFill>
  );
};
