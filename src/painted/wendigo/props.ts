import {blob, ell, hardFill, inkLine, rectPts, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {clamp01, mixColor, type Painter, type Pt} from '../kit/painter';
import {KEY} from './look';

// WDG-EP01-SHORT timed-shot paint (D02 night wide, D03 tin, D04 sleeper, D08 boot print, D09 lips). Each function is a
// pure function of its arguments (the plate clock `t` in seconds and the staged state); no state between frames.
// Coordinates are composition px (1080x1920, top-left). Estimates from the scene sheets unless marked.

const W = 1080;
const H = 1920;
const full = rectPts(-120, -120, W + 120, H + 120);

/** Night wide tent (S01-B02-SH01, D02 night variant): dark snow, closed forest edge, tent half-buried, door gap. The lantern leak is an overlay (`NightTentLeak`). */
export const NIGHT_TENT = {apex: [540, 520] as Pt, baseL: [250, 860] as Pt, baseR: [830, 860] as Pt, door: 0.34};
export const paintNightTent = (p: Painter) => {
  const {apex: A, baseL: L, baseR: R} = NIGHT_TENT;
  washAt(p, 1, KEY.nightDeep, 255, full, 0.05, 0.2);
  // closed forest edge far at y ~600: dark conifer triangles, mostly hidden by the tent
  for (let i = 0; i < 17; i++) {
    const x = -30 + i * 72 + hash(900 + i) * 30, top = 500 + hash(910 + i) * 70, w = 36 + hash(920 + i) * 18;
    washAt(p, 920 + i, '#152538', 210, [[x - w, 660], [x, top], [x + w, 660]], 0.15, 0.5);
  }
  // snow ground: a lighter band from the forest line down, darkened by the overlay shade below y ~1000
  washAt(p, 3, '#2b4459', 230, rectPts(-120, 640, W + 120, H + 120), 0.2, 0.4);
  washAt(p, 4, '#3a546b', 120, blob(4, 540, 760, 620, 180, 0), 0.6, 0.6);
  // tent body: a dome of canvas with a shaded right side and a snow cap on the top
  const dome: Pt[] = [L, [L[0] + 50, 700], [420, 590], A, [660, 590], [R[0] - 50, 700], R];
  hardFill(p, 10, '#27405c', dome);
  hardFill(p, 11, '#1b2f47', [A, [660, 590], [R[0] - 50, 700], R, [600, 860], [560, 620]]);
  washAt(p, 12, '#7f97ab', 150, [[300, 640], [420, 572], A, [660, 572], [770, 640], [700, 610], [540, 548], [380, 610]], 0.4, 0.6);
  // door: a dark slit between two flaps at the front, low centre (door gap)
  const d = NIGHT_TENT.door;
  hardFill(p, 13, '#060e18', [[540 - 40 * d * 2, 860], [540 - 6, 720 + 20 * d], [540 + 6, 720 + 20 * d], [540 + 40 * d * 2, 860]]);
  // stitches and pinholes: drawn as ink so the seams read without the leak
  p.ink(20, 'rotring', '#050b13', 2.4);
  p.brush.line(A[0], A[1], L[0], L[1]);
  p.brush.line(A[0], A[1], R[0], R[1]);
};

/** Tin (D03): S01-B02-SH02 hero tin and S03-B02-SH01 night-after. Centre x 540, base y 760, width 620 (scene sheets). */
export const TIN = {cx: 540, base: 760, top: 290, rx: 310, ry: 56};
/** The lower half of the tin's base ellipse, from the right edge round the front to the left edge. */
const tinBottomArc = (): Pt[] => Array.from({length: 25}, (_, i): Pt => {
  const a = (i / 24) * Math.PI;
  return [TIN.cx + TIN.rx * Math.cos(a), TIN.base + TIN.ry * Math.sin(a)];
});
/** The tin body silhouette: top rim corners, right side, the base arc, left side. */
const tinBody = (): Pt[] => {
  const {cx, top, rx} = TIN;
  return [[cx - rx, top], [cx + rx, top], ...tinBottomArc(), [cx - rx, top]];
};
/**
 * Paint the tin. `lit` 0..1 = lantern raking light (hero lit 0.3 peak in the lantern overlay; night-after 0.12); the paint
 * itself stays the same in both states, the light is in the overlay. `frost` 0..1 = frost on the rim.
 */
export const paintTin = (p: Painter, frost = 0.4) => {
  const {cx, base, top, rx, ry} = TIN;
  const jag = (seed: number, pts: Pt[], amp: number): Pt[] => pts.map(([x, y], i): Pt => [x + (hash(seed + i) - 0.5) * amp, y + (hash(seed + 40 + i) - 0.5) * amp]);
  washAt(p, 1, '#4d6378', 255, full, 0.1, 0.4);
  washAt(p, 2, '#3a4f63', 140, blob(2, cx, base + 10, 480, 110, 0), 0.6, 0.6);
  // crushed snow at the base: a pale trampled ring round the tin with a dark pressed groove inside it, and the shadow pool
  washAt(p, 3, '#1c2a37', 170, ell(cx + 10, base + 6, rx + 40, ry * 0.9, 22), 0.4, 0.6);
  washAt(p, 4, '#8fa3b3', 200, ell(cx, base + 8, rx + 46, ry + 22, 30), 0.3, 0.5);
  washAt(p, 5, '#2c3d4d', 210, ell(cx + 4, base + 8, rx + 16, ry + 6, 30), 0.2, 0.5);
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2 + hash(500 + i) * 0.2, k = 1.03 + 0.1 * hash(520 + i);
    washAt(p, 540 + i, i % 3 ? '#c5d3de' : '#9db0bf', 190, ell(cx + (rx + 30) * k * Math.cos(a), base + 8 + (ry + 12) * k * Math.sin(a), 10 + hash(560 + i) * 12, 4 + hash(580 + i) * 4, 8), 0.3, 0.4);
  }
  hardFill(p, 10, '#6b7a86', tinBody());
  washAt(p, 11, '#b7c4cc', 130, [[cx - 200, top + 20], [cx - 80, top + 20], [cx - 70, base - 10], [cx - 190, base - 10]], 0.3, 0.5); // lantern-side sheen
  washAt(p, 12, '#2e3a46', 190, [[cx + 150, top + 10], [cx + rx, top], [cx + rx, base], [cx + 150, base - 6]], 0.3, 0.5);
  // dents (four): darker core, a pale raking edge on the lantern (left) side, a dark rim on the other side
  const dents: [number, number, number, number][] = [[cx - 236, 410, 34, 58], [cx - 30, 646, 62, 24], [cx + 226, 590, 30, 46], [cx + 96, 470, 54, 32]];
  dents.forEach(([x, y, w, h], i) => {
    washAt(p, 13 + i * 3, '#3f474f', 215, ell(x, y, w, h, 14), 0.3, 0.6);
    washAt(p, 14 + i * 3, '#a9b8c2', 130, ell(x - w * 0.82, y - h * 0.12, w * 0.3, h * 0.82, 10, 0.1), 0.2, 0.4);
    washAt(p, 15 + i * 3, '#1d232a', 140, ell(x + w * 0.78, y + h * 0.1, w * 0.26, h * 0.8, 10), 0.2, 0.4);
  });
  // rust: streaks running down from the seam (cx + 170) and from the rim, widening a little then fading, never round spots
  const streak = (seed: number, x: number, y0: number, len: number, w: number, op: number) =>
    washAt(p, seed, '#8c4f2a', op, [[x - w * 0.5, y0], [x + w * 0.5, y0], [x + w * 0.9 + (hash(seed) - 0.5) * 6, y0 + len * 0.6], [x + w * 0.3, y0 + len], [x - w * 0.4, y0 + len * 0.85], [x - w * 0.8, y0 + len * 0.5]], 0.3, 0.7);
  streak(60, cx + 170, top + 24, 340, 12, 175);
  streak(61, cx + 176, top + 150, 190, 7, 130);
  streak(62, cx - 205, top + 28, 210, 10, 150);
  streak(63, cx - 60, top + 30, 110, 8, 130);
  streak(64, cx + 58, top + 34, 150, 9, 140);
  streak(65, cx + 252, top + 30, 120, 8, 120);
  streak(66, cx + 120, 640, 90, 12, 110);
  // label remnant: a torn paper patch (jagged edge, curled corner), faded band, two unreadable ink marks (no brand, no Thai)
  const paper: Pt[] = jag(300, [[cx - 196, 474], [cx - 120, 468], [cx - 40, 478], [cx + 8, 470], [cx + 14, 520], [cx - 8, 560], [cx - 46, 580], [cx - 100, 566], [cx - 150, 590], [cx - 190, 560], [cx - 178, 520]], 14);
  washAt(p, 70, '#9a937d', 200, paper, 0.1, 0.5);
  washAt(p, 71, '#5d7490', 150, [[cx - 186, 500], [cx - 20, 494], [cx - 14, 516], [cx - 184, 524]], 0.2, 0.5);
  washAt(p, 72, '#6f6450', 160, [[cx - 196, 474], [cx - 120, 468], [cx - 130, 486], [cx - 190, 490]], 0.2, 0.5); // dirt line under the torn top edge
  washAt(p, 73, '#c9c2aa', 150, jag(310, [[cx + 14, 520], [cx - 8, 560], [cx - 30, 548], [cx - 6, 514]], 6), 0.1, 0.4); // curled torn corner, lit
  // lid: rolled rim ring, a dark inner face, one jagged lip torn up at the upper left with a bright cut edge
  hardFill(p, 21, '#8d9aa5', ell(cx, top, rx, ry, 30));
  hardFill(p, 22, '#1d262e', ell(cx, top, rx - 12, ry - 9, 30));
  const lip: Pt[] = [[cx - 262, top - 4], [cx - 238, top - 40], [cx - 222, top - 30], [cx - 204, top - 74], [cx - 186, top - 52], [cx - 168, top - 82], [cx - 150, top - 50], [cx - 128, top - 56], [cx - 120, top - 20], [cx - 150, top + 2], [cx - 200, top + 10], [cx - 244, top + 8]];
  hardFill(p, 23, '#a7b3bc', lip);
  hardFill(p, 24, '#6d7a86', [[cx - 150, top - 50], [cx - 128, top - 56], [cx - 120, top - 20], [cx - 150, top + 2], [cx - 166, top - 14]]); // underside of the bent lip, in shade
  // inner rolled edge ring and a faint scrape ring on the dark lid face
  inkLine(p, 33, ell(cx, top, rx + 4, ry + 3, 30), {closed: true, color: '#1f2830', weight: 1.4});
  [cx - 230, cx - 120, cx + 120, cx + 232].forEach((x, i) => {
    inkLine(p, 34 + i, [[x, top + 34], [x + 2, (top + base) / 2], [x, base - 14]], {closed: false, color: '#3c4650', weight: 1.2});
  });
  // lid inner dark: frost in the shadow along the far edge
  for (let i = 0; i < 18; i++) {
    if (hash(900 + i) > 0.35 + 0.6 * frost) continue;
    const a = Math.PI * (1.05 + 0.9 * (i / 18)), x = cx + (rx - 30) * Math.cos(a), y = top + (ry - 18) * Math.sin(a);
    washAt(p, 910 + i, '#cfe0ea', 110 + 90 * frost, ell(x, y, 8 + hash(930 + i) * 10, 2.2, 8), 0.2, 0.3);
  }
  // frost along the rim: pale dabs, more with `frost`
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2 + hash(40 + i) * 0.2;
    if (hash(60 + i) > 0.35 + 0.6 * frost) continue;
    const x = cx + (rx - 6) * Math.cos(a), y = top + (ry - 4) * Math.sin(a);
    washAt(p, 70 + i + 100, '#eaf4fa', 130 + 100 * frost, ell(x, y, 5 + hash(80 + i) * 7, 2.6, 8), 0.2, 0.3);
  }
  // ink: rim, torn label ink, scratches, scrape ring, bright cut edge and glints
  inkLine(p, 41, paper, {closed: true, color: '#4a4232', weight: 1.1});
  p.ink(42, 'rotring', '#2b2f3a', 2.2); // unreadable ink marks on the label: two partial strokes, no letters
  p.brush.line(cx - 160, 538, cx - 132, 546); p.brush.line(cx - 132, 546, cx - 120, 534); p.brush.line(cx - 96, 540, cx - 66, 552); p.brush.line(cx - 66, 552, cx - 70, 534);
  p.ink(43, 'rotring', '#dfe9f0', 1.2);
  p.brush.line(cx - 40, 340, cx + 20, 352);
  p.brush.line(cx + 60, 600, cx + 130, 594);
  inkLine(p, 44, Array.from({length: 14}, (_, i): Pt => { const a = Math.PI * (0.1 + 0.8 * (i / 13)); return [cx + (rx - 70) * Math.cos(a), top + (ry - 22) * Math.sin(a)]; }), {closed: false, color: '#3b4753', weight: 1.3}); // scrape ring (near half)
  inkLine(p, 45, [lip[0], lip[1], lip[2], lip[3], lip[4], lip[5], lip[6], lip[7]], {closed: false, color: '#f4fbff', weight: 2.2}); // bright cut edge of the torn lip
  p.ink(46, 'rotring', '#f4fbff', 1.2);
  for (let i = 0; i < 9; i++) { // rim glints: tiny crosses
    const a = (0.1 + 0.8 * hash(950 + i)) * Math.PI * 2, x = cx + (rx - 4) * Math.cos(a), y = top + (ry - 2) * Math.sin(a), g = 5 + 5 * hash(960 + i) * (0.5 + frost);
    p.brush.line(x - g, y, x + g, y); p.brush.line(x, y - g * 0.8, x, y + g * 0.8);
  }
  p.ink(30, 'rotring', '#0a1118', 2.2);
  inkLine(p, 31, tinBottomArc(), {closed: false, color: '#0a1118', weight: 2.2});
  inkLine(p, 32, ell(cx, top, rx, ry, 30), {closed: true, color: '#0a1118', weight: 1.8});
};

/** Sleeper (D04 fallback, S01-B02-SH03): hair mass and one shoulder, the blanket a flat wash that breathes (ambient clock). Face turned away. */
export const paintSleeper = (p: Painter, t: number) => {
  washAt(p, 1, '#14222f', 255, full, 0.05, 0.2);
  washAt(p, 2, '#1d2e3e', 150, blob(2, 560, 720, 520, 420, 0), 0.8, 0.8);
  // breathing: the blanket rises up to 6 px on a 90-frame (3 s) period of the ambient clock
  const breath = 3 * (1 - Math.cos((2 * Math.PI * t) / 3));
  washAt(p, 3, '#56656f', 230, blob(3, 730, 700 - breath, 250, 60 + breath * 0.2, 0), 0.4, 0.6);
  hardFill(p, 4, '#2b2f36', blob(4, 470, 668, 120, 62, 0));
  washAt(p, 7, '#3d4450', 150, blob(7, 500, 640, 70, 34, 0), 0.4, 0.6);
  hardFill(p, 5, '#1a1617', blob(5, 330, 560, 120, 124, 0));
  washAt(p, 6, '#2c2a33', 180, blob(6, 360, 520, 70, 60, 0), 0.4, 0.6);
  p.ink(10, 'rotring', '#07101a', 1.8);
  inkLine(p, 11, [[600, 700], [700, 680 - breath], [820, 690 - breath]], {closed: false, color: '#07101a', weight: 1.6});
};

/**
 * Boot in print (D08, S01-B03-SH02): the boot profile (toe to the right), sole at `soleY`, centre x 540. The print is the
 * same shape at rest (sole 600) grown by ~20 px, so a rim shows all round when it rests.
 */
const BOOT_PROFILE: [number, number][] = [
  [262, 0], [826, 0], [838, 36], [826, 70], [760, 92], [690, 120], [620, 190], [560, 262], [500, 340], [470, 420],
  [420, 440], [300, 440], [262, 380], [246, 240], [248, 120],
];
export const BOOT = {restSole: 600, cx: 540, length: 564};
export const bootPts = (soleY: number, grow = 0): Pt[] => {
  const s = 1 + grow / 300;
  return BOOT_PROFILE.map(([x, dy]): Pt => {
    const px = BOOT.cx + (x - 540) * s, py = soleY - dy * s;
    return [px, py];
  });
};
/** Paint the print (at rest) and the boot at `soleY`; `puff` 0..1 is the snow burst at the contact. */
export const paintBootPrint = (p: Painter, soleY: number, puff: number) => {
  washAt(p, 1, '#c3d0da', 255, full, 0.1, 0.4);
  washAt(p, 2, '#b4c3ce', 160, blob(2, 540, 700, 520, 260, 0), 0.6, 0.6);
  // print rim: a lighter snow lip around the footprint, then the dark hollow
  washAt(p, 3, '#e6eef4', 210, bootPts(BOOT.restSole, 22), 0.2, 0.3);
  washAt(p, 4, '#58707f', 230, bootPts(BOOT.restSole, 4), 0.2, 0.4);
  // the boot
  hardFill(p, 10, '#1d1b1a', bootPts(soleY));
  washAt(p, 11, '#0c0b0b', 200, bootPts(soleY).slice(0, 2).concat([[826, soleY - 8], [262, soleY - 8]]), 0.1, 0.3);
  washAt(p, 12, '#4b4540', 90, [[300, soleY - 330], [400, soleY - 350], [380, soleY - 220], [300, soleY - 200]], 0.2, 0.5);
  p.ink(20, 'rotring', '#050505', 2.2);
  inkLine(p, 21, bootPts(soleY), {closed: true, color: '#050505', weight: 2.2});
  // snow burst on landing
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + hash(300 + i) * 0.4;
    const r = 180 + 60 * puff;
    washAt(p, 310 + i, '#f2f8fb', 200 * puff, blob(310 + i, 540 + r * Math.cos(a) * 0.9, soleY + 10 - Math.abs(Math.sin(a)) * 40 * puff, 26 + 18 * puff, 14 + 10 * puff, 0), 0.5, 0.6);
  }
};

/**
 * Lips close-up (D09, S01-B03-SH04): cracked dry lips with a cupid's bow, nose to chin, mouth opening `open` 0..1 with
 * the whisper. `mistAges` are seconds since each breath puff (the caller passes them; a puff shows for 2.2 s).
 */
export const LIPS = {cx: 540, cy: 520, w: 580};
export const paintLips = (p: Painter, open: number, mistAges: number[]) => {
  const {cx, w} = LIPS;
  const x0 = cx - w / 2, x1 = cx + w / 2;
  const S = (x: number) => (x - cx) / (w / 2); // -1 .. 1 across the mouth
  const E = (x: number) => 1 - S(x) ** 2;
  // cupid's bow: two soft peaks at |S| ~ 0.4 on a thin upper lip; corners turn slightly down
  const bow = (x: number) => 8 * Math.exp(-(((Math.abs(S(x)) - 0.4) / 0.14) ** 2));
  const corner = (x: number) => 6 * S(x) ** 6;
  const xs = Array.from({length: 33}, (_, i) => x0 + (w * i) / 32);
  const upperTop = xs.map((x): Pt => [x, 494 + 10 * S(x) ** 2 - bow(x) + corner(x)]);
  const mouth = xs.map((x): Pt => [x, 530 + 4 * E(x) + corner(x)]);
  const lowerTop = xs.map((x): Pt => [x, 530 + 4 * E(x) + corner(x) + open * 30 * E(x)]);
  const lowerBottom = xs.map((x): Pt => [x, 532 + 46 * E(x) ** 0.5 + corner(x) + open * 4 * E(x)]);
  washAt(p, 1, '#0d1622', 255, full, 0.05, 0.2);
  // skin round the mouth: pale and gaunt, lit from below; the chin in shadow
  washAt(p, 2, '#a88474', 220, blob(2, cx, 600, 330, 300, 0), 0.5, 0.6);
  washAt(p, 3, '#d6b29c', 130, blob(3, cx, 700, 260, 150, 0), 0.5, 0.6);
  washAt(p, 4, '#5a4038', 160, blob(4, cx, 800, 300, 80, 0), 0.5, 0.6);
  hardFill(p, 5, '#9c7866', [[500, 170], [585, 170], [602, 262], [540, 292], [478, 262]]);
  // mouth interior (shows when open), upper lip (darker, thin), lower lip (fuller, lit from below)
  hardFill(p, 10, '#1e0c0d', [...mouth, ...lowerTop.slice().reverse()]);
  hardFill(p, 11, '#7e4a48', [...upperTop, ...mouth.slice().reverse()]);
  hardFill(p, 12, '#b97a72', [...lowerTop, ...lowerBottom.slice().reverse()]);
  washAt(p, 13, '#d9a097', 150, [[cx - 150, 548], [cx + 150, 548], [cx + 120, 562], [cx - 120, 562]], 0.3, 0.5);
  washAt(p, 14, '#4a2624', 120, [[x0 + 20, 512], [x1 - 20, 512], [x1 - 20, 522], [x0 + 20, 522]], 0.2, 0.5);
  // the mouth crease and dry cracks across the lower lip
  p.ink(20, 'rotring', '#2a1210', 2.2);
  p.brush.spline(mouth, 0.1);
  p.ink(21, 'rotring', '#2a1210', 1.3);
  for (let i = 0; i < 8; i++) {
    const u = 0.18 + hash(30 + i) * 0.64, y = 556 + hash(40 + i) * 18;
    p.brush.line(x0 + w * u, y, x0 + w * u + 9 + hash(50 + i) * 12, y + 1 + hash(60 + i) * 3);
  }
  // breath mist: soft white puffs rising from the mouth corner line, one seed each, faint
  mistAges.forEach((age, i) => {
    if (age < 0 || age > 2.2) return;
    const u = clamp01(age / 2.2);
    const y = 470 - 200 * u + 10 * hash(70 + i);
    const x = cx + 40 * Math.sin(u * 3 + i) + (hash(80 + i) - 0.5) * 40;
    washAt(p, 90 + i, '#e8f0f5', 150 * (1 - u) * (u < 0.1 ? u / 0.1 : 1), blob(90 + i, x, y, 70 + 80 * u, 44 + 50 * u, 0), 0.6, 0.7);
  });
};

/**
 * Lantern prop (D06, hand-held and floor-standing): a compact hurricane lantern `h` px tall (0.18 m at the shot's px per metre).
 * `(x, y)` is the top of the bail, i.e. the grip point of the hand; with `floor` the lantern stands on the ground and `(x, y)` is the
 * base centre (no bail raised, handle folded). The glass is the only bright thing; `lit` 0..1 scales the glass (the warm halo is an
 * overlay: `LanternLight` in src/painted/shots/wendigo.tsx, composite peak <= 0.3).
 */
export const LANTERN_M = 0.18;
export const paintLantern = (p: Painter, x: number, y: number, h: number, lit = 1, floor = false) => {
  const top = floor ? y - h : y;
  const bw = 0.26 * h; // half width of the body
  const capY = top + 0.2 * h, glassT = capY + 0.07 * h, glassB = top + 0.8 * h, baseB = top + 0.9 * h;
  if (!floor) {
    p.ink(520, 'rotring', '#10100f', Math.max(1, 0.012 * h));
    p.brush.spline([[x - 0.15 * h, capY], [x - 0.13 * h, top + 0.05 * h], [x, top], [x + 0.13 * h, top + 0.05 * h], [x + 0.15 * h, capY]], 0.4);
  }
  // cap: a dark cone with a vent knob, base: a dark pan
  hardFill(p, 500, '#1c1a19', [[x - 0.36 * h, glassT], [x + 0.36 * h, glassT], [x + 0.2 * h, capY], [x - 0.2 * h, capY]]);
  hardFill(p, 501, '#28231f', ell(x, capY, 0.06 * h, 0.03 * h, 10));
  hardFill(p, 502, '#1c1a19', [[x - 0.34 * h, glassB], [x + 0.34 * h, glassB], [x + 0.38 * h, baseB], [x - 0.38 * h, baseB]]);
  // glass cage: warm core with a bright centre, four dark ribs, a rust-brown frame on the shaded side
  hardFill(p, 503, mixHex('#6a4222', '#e8a850', lit), [[x - bw, glassT], [x + bw, glassT], [x + bw, glassB], [x - bw, glassB]]);
  hardFill(p, 504, mixHex('#a2753f', '#ffe3a8', lit), [[x - 0.14 * h, glassT + 0.05 * h], [x + 0.14 * h, glassT + 0.05 * h], [x + 0.14 * h, glassB - 0.08 * h], [x - 0.14 * h, glassB - 0.08 * h]]);
  hardFill(p, 505, mixHex('#fff3d0', '#ffffff', lit), ell(x, (glassT + glassB) / 2 + 0.04 * h, 0.05 * h, 0.12 * h, 12));
  hardFill(p, 506, '#3a2a1c', [[x + bw - 0.07 * h, glassT], [x + bw, glassT], [x + bw, glassB], [x + bw - 0.07 * h, glassB]]);
  p.ink(510, 'rotring', '#0d0c0b', Math.max(1, 0.014 * h));
  for (const u of [-bw, -bw / 3, bw / 3, bw]) p.brush.line(x + u, glassT, x + u, glassB);
  p.brush.line(x - bw, glassT, x + bw, glassT);
  p.brush.line(x - bw, glassB, x + bw, glassB);
  inkLine(p, 511, [[x - 0.36 * h, glassT], [x + 0.36 * h, glassT], [x + 0.2 * h, capY], [x - 0.2 * h, capY]], {closed: true, color: '#0d0c0b', weight: 1.1});
  inkLine(p, 512, [[x - 0.34 * h, glassB], [x + 0.34 * h, glassB], [x + 0.38 * h, baseB], [x - 0.38 * h, baseB]], {closed: true, color: '#0d0c0b', weight: 1.1});
};
const mixHex = (a: string, b: string, u: number) => mixColor(a, b, clamp01(u));

/**
 * Mitten gripping a lantern's bail (W5.2 fix 4): the kit mitten ellipse (0.045 x 0.052 m, `drawArm` in kit/cast.ts) painted again over the lantern's cap, so
 * the hand reads as holding the handle instead of a disc beside it. Four fingers curl over the bail on the near side, the thumb wraps from the far side.
 * `(x, y)` is the kit hand centre, `unit` px per metre, `skin` the hand colour, `warm` 0..1 lantern underlight on the skin. Pure and seeded.
 */
export const paintMitten = (p: Painter, x: number, y: number, unit: number, skin: string, warm = 0) => {
  const rx = 0.045 * unit, ry = 0.052 * unit;
  void skin; // a dark winter mitten (the kit mitten shape), lit warm on the lantern side
  const c = mixColor('#4a392f', '#8a5a34', 0.5 * warm), shade = mixColor(c, '#150e0a', 0.45), edge = '#120b08';
  hardFill(p, 530, c, ell(x, y, rx, ry, 16));
  hardFill(p, 531, shade, ell(x + 0.25 * rx, y + 0.45 * ry, 0.7 * rx, 0.45 * ry, 12)); // palm side in shade
  hardFill(p, 532, c, ell(x - 0.78 * rx, y + 0.08 * ry, 0.34 * rx, 0.5 * ry, 12, -0.3)); // thumb
  inkLine(p, 533, ell(x, y, rx, ry, 16), {closed: true, color: edge, weight: Math.max(1.2, 0.0028 * unit)});
  p.ink(534, 'rotring', edge, Math.max(1, 0.0018 * unit));
  for (let i = 1; i <= 3; i++) p.brush.line(x - 0.45 * rx + i * 0.3 * rx, y - 0.1 * ry, x - 0.42 * rx + i * 0.3 * rx, y + 0.4 * ry); // finger divisions
  p.brush.line(x - 0.62 * rx, y - 0.1 * ry, x - 0.9 * rx, y + 0.3 * ry); // thumb crease
};
