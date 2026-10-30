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
const paintCrReal = (p: Painter, mx: number, my: number, k: number, detail: 2 | 3, o: {aperture?: number} = {}) => {
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
    brush.hatch(9, 0.62, {rand: 0.35, continuous: false, gradient: 0.4});
    brush.noStroke();
    brush.polygon(scaleAbout(g.head, hx, top, 0.9, 0.52));
    brush.hatch(13, -0.43, {rand: 0.35, continuous: false, gradient: 0.4});
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
  const cam: Camera = {s: r.s, fx: 534, fy: 650, dx: 0, dy: r.dy};
  const paint = useCallback(({brush}: PaintContext) => {
    if (r.alpha <= 0) return;
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
