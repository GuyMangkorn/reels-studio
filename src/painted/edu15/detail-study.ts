import {capsule, ell, hardFill, inkLine} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {flatCircle, paintBox, qy, qz, wFill, wInk, wWash} from '../kit/world';
import {paintWomanPhone} from './cast';
import {C, W0_FEET} from './palette';
import {paintMoth, paintSlippers, paintSofaSide, paintTable, ROOM} from './room';
import {camLF01, restPose, roomBack, T, T0F, tok} from './scenes';

// Set-detail study on LF01 (user, 12 Nov 2026: "more set and prop detail, draw a comparison"). Not part of the approved EDU-EP15 look or its
// shots: LF01 is repainted here with four extra detail groups on top of the same set, each in its own paint slot so depth order holds.
// (1) more props, (2) detail on each prop, (3) more depth layers (soi beyond the window, foreground pothos), (4) surface wear as flat shapes.
// Render: `printf 'EDU15D-LF01D 0 out/edu15/detail-study/LF01D.png\n' | node scripts/stills.mjs src/painted/edu15/detail-study-index.tsx`.
// Film pass (12 Nov 2026, subject hierarchy: the woman's face/hands and the tokay stay the read): set detail sits near the value of the surface it
// lies on and below the subject's saturation; the peeled patch, coin jar and mug are cut, the conduit/switch, shelf, pillow, towel, dip, cable,
// tissue band and pothos are toned down. Each change is marked `Film:` below.

const near = (c: YCam) => c.near ?? 0.3;
const ZW = ROOM.zBack + 0.004;

/** Back-wall wear (cracks, a peeled patch, rust drips under the window, scuffs) and the old townhouse wiring: conduit, switch, socket. */
const paintWallWear = (p: Painter, c: YCam) => {
  const {x0, y0} = ROOM.window;
  const crack = mixColor(C.wallShade, '#3d3127', 0.35);
  wInk(p, c, 19000, [[x0 - 0.04, y0 - 0.04, ZW], [x0 - 0.12, y0 - 0.14, ZW], [x0 - 0.1, y0 - 0.22, ZW], [x0 - 0.2, y0 - 0.33, ZW]], {closed: false, weight: 0.5, color: crack});
  wInk(p, c, 19001, [[-0.55, 2.7, ZW], [-0.5, 2.55, ZW], [-0.56, 2.42, ZW], [-0.49, 2.3, ZW]], {closed: false, weight: 0.5, color: crack});
  // Film: peeled patch cut, a light blob on the ceiling seam right under the tokay that tells nothing.
  // rust drips from the grille corners
  for (let i = 0; i < 5; i++) {
    const x = x0 + 0.06 + i * 0.18 + 0.04 * hash(19010 + i), l = 0.12 + 0.18 * hash(19020 + i);
    wWash(p, c, 19030 + i, mixColor(C.wallShade, '#7a4a28', 0.3), 60, [[x - 0.012, y0 - 0.045, ZW], [x + 0.012, y0 - 0.045, ZW], [x + 0.002, y0 - 0.045 - l * 0.5, ZW], [x - 0.002, y0 - 0.045 - l * 0.5, ZW]], 0.3, 0.2);
  }
  // scuffs above the skirting
  for (let i = 0; i < 6; i++) {
    const x = 0.85 + i * 0.22 + 0.05 * hash(19040 + i), y = 0.1 + 0.08 * hash(19050 + i);
    wFill(p, c, 19060 + i, mixColor(C.wallShade, '#4a3c30', 0.3), [[x, y, ZW], [x + 0.07, y + 0.01, ZW], [x + 0.06, y + 0.025, ZW], [x - 0.005, y + 0.015, ZW]]);
  }
  // surface conduit along the top of the wall, down to the switch by the window, and a socket low down
  const pipe = mixColor(C.wall, '#d8d2c4', 0.2); // Film: near the wall value, so the line along the ceiling seam no longer points at the tokay
  wFill(p, c, 19070, pipe, qz(ZW + 0.002, -2.3, 0.82, 2.48, 2.51));
  wFill(p, c, 19071, pipe, qz(ZW + 0.002, 0.79, 0.82, 1.3, 2.51));
  wInk(p, c, 19072, [[-2.3, 2.475, ZW + 0.003], [0.82, 2.475, ZW + 0.003]], {closed: false, weight: 0.35, color: mixColor(pipe, C.wallShade, 0.4)});
  for (const y of [1.7, 2.1]) wFill(p, c, 19073 + Math.round(y * 10), mixColor(pipe, '#3d3127', 0.25), qz(ZW + 0.004, 0.785, 0.825, y, y + 0.015));
  paintBox(p, c, 19100, {x0: 0.75, x1: 0.86, y0: 1.18, y1: 1.32, z0: ROOM.zBack, z1: ZW + 0.012}, mixColor(C.wall, '#ece6d8', 0.4), {}, {ink: true});
  for (const dx of [-0.022, 0.022]) wFill(p, c, 19120 + Math.round(dx * 1000), mixColor(C.wall, '#bdb6a6', 0.5), qz(ZW + 0.014, 0.805 + dx - 0.012, 0.805 + dx + 0.012, 1.22, 1.28));
  paintBox(p, c, 19130, {x0: 1.25, x1: 1.35, y0: 0.2, y1: 0.28, z0: ROOM.zBack, z1: ZW + 0.01}, mixColor(C.wall, '#ece6d8', 0.4), {}, {ink: true});
};

/** The soi behind the glass: power lines, an AC unit and a second, dimmer neighbour window; the grille left of the curtain is repainted over it. */
const paintWindowDepth = (p: Painter, c: YCam) => {
  const {x0, x1, y0, y1} = ROOM.window, z = ROOM.zBack + 0.012;
  wFill(p, c, 19150, '#2a3346', qz(z + 0.0035, x0, x1, y0 + 0.4, y0 + 0.46)); // soi wall's top edge
  wFill(p, c, 19151, '#3a4458', qz(z + 0.0036, x0 + 0.05, x0 + 0.3, y0 + 0.12, y0 + 0.3)); // AC unit
  for (let k = 0; k < 4; k++) wInk(p, c, 19152 + k, [[x0 + 0.07, y0 + 0.15 + k * 0.035, z + 0.0037], [x0 + 0.28, y0 + 0.15 + k * 0.035, z + 0.0037]], {closed: false, weight: 0.4, color: '#566078'});
  wFill(p, c, 19160, mixColor(C.neighbour, '#202838', 0.55), qz(z + 0.0036, x0 + 0.78, x0 + 0.92, y0 + 0.52, y0 + 0.7));
  for (let k = 0; k < 3; k++) {
    const ya = y0 + 0.78 + k * 0.05, sag = 0.06 + 0.02 * k;
    wInk(p, c, 19170 + k, Array.from({length: 9}, (_, i): V3 => { const u = i / 8; return [x0 + u * (x1 - x0), ya - sag * 4 * u * (1 - u), z + 0.0038]; }), {closed: false, weight: 0.6, color: '#151a24'});
  }
  // grille repainted over the new soi (left of the curtain only, so the curtain stays in front)
  const cx0 = x0 + (x1 - x0) * 0.55;
  wFill(p, c, 19180, '#a7adb3', qz(z + 0.005, (x0 + x1) / 2 - 0.012, (x0 + x1) / 2 + 0.012, y0, y1));
  for (let i = 1; i < 6; i++) { const x = x0 + (i / 6) * (x1 - x0); if (x < cx0) wFill(p, c, 19181 + i, C.grille, qz(z + 0.03, x - 0.007, x + 0.007, y0, y1)); }
  for (let i = 1; i < 5; i++) { const yy = y0 + (i / 5) * (y1 - y0); wFill(p, c, 19190 + i, C.grille, qz(z + 0.031, x0, cx0, yy - 0.007, yy + 0.007)); }
};

/** Wall shelf right of her head: books, a pot of mint, a small framed photo. Film: it sits a head-width from her face, so every prop is pulled
 *  45% toward the wall colour and the coin jar (a second red-and-gold accent) is cut; three props, not four. */
const shelfTone = (col: string) => mixColor(col, C.wall, 0.45);
const paintShelf = (p: Painter, c: YCam) => {
  const sx0 = -0.2, sx1 = 0.5, sy = 1.42, z0 = ROOM.zBack, z1 = ROOM.zBack + 0.18;
  paintBox(p, c, 19200, {x0: sx0, x1: sx1, y0: sy - 0.025, y1: sy, z0, z1}, shelfTone('#7a5638'), {front: 0.1}, {ink: true});
  for (const x of [sx0 + 0.06, sx1 - 0.06]) wFill(p, c, 19205 + Math.round(x * 100), '#3a3530', [[x - 0.008, sy - 0.025, z0 + 0.004], [x + 0.008, sy - 0.025, z0 + 0.004], [x + 0.008, sy - 0.11, z0 + 0.004]]);
  wWash(p, c, 19210, '#3a2a1c', 70, qz(z0 + 0.003, sx0, sx1, sy - 0.1, sy - 0.025), 0.3, 0.2); // shadow on the wall under the shelf
  // books, upright, then one leaning
  const books: [number, number, string][] = [[0.02, 0.2, shelfTone('#8a3b32')], [0.025, 0.18, shelfTone('#3e5a6b')], [0.018, 0.22, shelfTone('#c9a65a')], [0.03, 0.17, shelfTone('#5d6b45')]];
  let x = sx0 + 0.02;
  books.forEach(([w, h, col], i) => { paintBox(p, c, 19220 + i * 6, {x0: x, x1: x + w, y0: sy, y1: sy + h, z0: z0 + 0.02, z1: z0 + 0.15}, col, {front: -0.05}, {ink: true}); wFill(p, c, 19245 + i, mixColor(col, '#f4ead2', 0.25), qz(z0 + 0.151, x + 0.003, x + w - 0.003, sy + h * 0.7, sy + h * 0.76)); x += w + 0.003; });
  wFill(p, c, 19250, shelfTone('#6b4a5a'), [[x + 0.005, sy, z0 + 0.14], [x + 0.03, sy, z0 + 0.14], [x + 0.09, sy + 0.17, z0 + 0.14], [x + 0.065, sy + 0.18, z0 + 0.14]]);
  // pot of mint
  paintBox(p, c, 19260, {x0: 0.15, x1: 0.25, y0: sy, y1: sy + 0.09, z0: z0 + 0.04, z1: z0 + 0.14}, shelfTone('#b8613e'), {front: -0.05}, {ink: true});
  const mq = camPoint(c, [0.2, sy + 0.14, z0 + 0.1], near(c)), mu = camUnit(c, [0.2, sy + 0.14, z0 + 0.1], near(c));
  if (mq) for (let k = 0; k < 9; k++) { const a = (k / 9) * 6.283, r = 0.045 + 0.02 * hash(19270 + k); hardFill(p, 19275 + k, shelfTone(k % 2 ? '#5f8a4a' : '#4a7339'), ell(mq[0] + Math.cos(a) * r * mu, mq[1] + Math.sin(a) * r * 0.7 * mu, 0.028 * mu, 0.018 * mu, 10, a)); }
  // small framed photo leaning on the wall
  paintBox(p, c, 19300, {x0: 0.39, x1: 0.48, y0: sy, y1: sy + 0.12, z0: z0 + 0.02, z1: z0 + 0.035}, shelfTone('#d9c9a6'), {}, {ink: true});
  wFill(p, c, 19306, shelfTone('#8aa3a8'), qz(z0 + 0.036, 0.405, 0.465, sy + 0.015, sy + 0.105));
};

/** Floor: a few tiles a shade off and chipped corners (laid inside the grout), the fan's cord to the socket. */
const paintFloorDetail = (p: Painter, c: YCam) => {
  const {x0, zBack} = ROOM;
  for (let i = 0; i < 8; i++) for (let k = 0; k < 7; k++) {
    const h = hash(19400 + i * 7 + k); if (h > 0.45) continue;
    const ax = x0 - 0.05 + i * 0.6, az = zBack + k * 0.6;
    wFill(p, c, 19410 + i * 7 + k, mixColor(C.tile, h < 0.2 ? '#4a3c30' : '#fff0d0', h < 0.2 ? 0.52 : 0.08), qy(0.0009, ax + 0.012, ax + 0.588, az + 0.012, az + 0.588));
    if (h < 0.12) wFill(p, c, 19480 + i * 7 + k, mixColor(C.grout, '#3d3127', 0.5), [[ax + 0.012, 0.001, az + 0.012], [ax + 0.08, 0.001, az + 0.012], [ax + 0.012, 0.001, az + 0.06]]);
  }
  wInk(p, c, 19540, [[1.3, 0.22, ROOM.zBack + 0.02], [1.32, 0.004, -1.2], [1.45, 0.004, -1.05], [1.55, 0.004, -0.92]], {closed: false, weight: 0.9, color: '#2a2622'});
};

/** Wicker laundry basket with a towel over the rim, in front of the sofa's right end (painted after the sofa). Film: the white towel was the
 *  brightest shape right of her, now a dull blue-grey near the sofa's value; the weave has fewer, softer lines. */
const paintBasket = (p: Painter, c: YCam) => {
  const b = {x0: 0.38, x1: 0.68, y0: 0, y1: 0.3, z0: -0.36, z1: -0.08};
  wWash(p, c, 19550, '#1f1810', 110, qy(0.002, b.x0 - 0.03, b.x1 + 0.04, b.z0, b.z1 + 0.05), 0.3, 0.2);
  paintBox(p, c, 19555, b, '#8f6a3c', {front: -0.02, left: 0.2}, {ink: true});
  for (let k = 1; k < 4; k++) { const y = (k / 4) * b.y1; wInk(p, c, 19570 + k, [[b.x0, y, b.z1 + 0.001], [b.x1, y, b.z1 + 0.001]], {closed: false, weight: 0.4, color: mixColor('#8f6a3c', '#4a3420', 0.6)}); }
  for (let k = 1; k < 4; k++) { const x = b.x0 + (k / 4) * (b.x1 - b.x0); wInk(p, c, 19580 + k, [[x, 0.01, b.z1 + 0.001], [x, b.y1 - 0.01, b.z1 + 0.001]], {closed: false, weight: 0.4, color: mixColor('#8f6a3c', '#5a4026', 0.6)}); }
  wFill(p, c, 19590, '#9aa6aa', [[b.x0 + 0.05, b.y1 + 0.03, b.z1 + 0.003], [b.x0 + 0.2, b.y1 + 0.02, b.z1 + 0.003], [b.x0 + 0.19, b.y1 - 0.14, b.z1 + 0.003], [b.x0 + 0.12, b.y1 - 0.18, b.z1 + 0.003], [b.x0 + 0.06, b.y1 - 0.1, b.z1 + 0.003]]);
  wInk(p, c, 19591, [[b.x0 + 0.1, b.y1 + 0.02, b.z1 + 0.004], [b.x0 + 0.11, b.y1 - 0.12, b.z1 + 0.004]], {closed: false, weight: 0.4, color: '#808c92'});
};

/** Sofa: a striped throw pillow on the right seat, seam lines on the seat fronts. Film: the coral pillow with cream stripes was the most
 *  saturated shape in the frame at her hands' height; now a dusty ochre close to the throw, smaller, with low-contrast stripes. */
const paintSofaDetail = (p: Painter, c: YCam) => {
  const s = ROOM.sofa;
  for (let k = 0; k < 2; k++) { const a = s.x0 + 0.22 + k * 0.8; wInk(p, c, 19600 + k, [[a + 0.02, s.seat + 0.02, s.zf + 0.021], [a + 0.76, s.seat + 0.02, s.zf + 0.021]], {closed: false, weight: 0.5, color: mixColor(C.sofa, '#1d2a2a', 0.45)}); }
  const pz1 = s.zb + 0.34;
  const q = camPoint(c, [0.36, s.seat + 0.2, pz1], near(c)), u = camUnit(c, [0.36, s.seat + 0.2, pz1], near(c));
  if (!q) return;
  const pil = ell(q[0], q[1], 0.15 * u, 0.105 * u, 24, -0.12), pc = mixColor(C.throw, C.sofa, 0.45);
  hardFill(p, 19610, pc, pil);
  for (let k = -1; k <= 1; k++) hardFill(p, 19621 + k, mixColor(pc, '#efdcc0', 0.3), capsule([q[0] - 0.13 * u, q[1] + k * 0.05 * u + 0.016 * u], [q[0] + 0.13 * u, q[1] + k * 0.05 * u - 0.016 * u], 0.01 * u, 0.01 * u, 2));
  hardFill(p, 19625, mixColor(pc, C.sofaShade, 0.5), ell(q[0] + 0.02 * u, q[1] + 0.08 * u, 0.12 * u, 0.022 * u, 14, -0.12));
  inkLine(p, 19626, pil, {weight: 0.45, color: mixColor(pc, C.sofaShade, 0.6), still: true});
};

/** Table: salt-chilli dip by the guava, keys, a charger cable, two magazines; buttons, rims and a stripe on the old props. Film: the mug is cut
 *  (it stood in front of her hands and phone, the key gesture, with an orange band in the caption band); the dip red, cable and tissue band are
 *  pulled toward the table and box values. */
const paintTableDetail = (p: Painter, c: YCam) => {
  const t = ROOM.table, y = t.top;
  // magazines under the back-left corner
  paintBox(p, c, 19700, {x0: t.x0 + 0.03, x1: t.x0 + 0.27, y0: y, y1: y + 0.008, z0: t.z0 + 0.02, z1: t.z0 + 0.14}, '#d9cfbf', {}, {});
  paintBox(p, c, 19706, {x0: t.x0 + 0.06, x1: t.x0 + 0.29, y0: y + 0.008, y1: y + 0.014, z0: t.z0 + 0.03, z1: t.z0 + 0.15}, '#4f7f8f', {}, {});
  wFill(p, c, 19712, '#e8b04a', qy(y + 0.0145, t.x0 + 0.08, t.x0 + 0.16, t.z0 + 0.05, t.z0 + 0.1));
  // plate rim ring, then the salt-chilli dip bowl at the front left
  const pl: V3 = [t.x0 + 0.3, y + 0.005, t.z0 + 0.25];
  const rim = flatCircle(c, pl, 0.085, 24); if (rim.length > 2) inkLine(p, 19720, rim, {weight: 0.4, color: '#c8c0b0', still: true});
  const bw: V3 = [t.x0 + 0.53, y + 0.025, t.z1 - 0.06];
  const bo = flatCircle(c, bw, 0.045, 20), bi = flatCircle(c, [bw[0], bw[1] + 0.001, bw[2]], 0.035, 20), bb = flatCircle(c, [bw[0], y, bw[2]], 0.03, 16);
  if (bb.length > 2) hardFill(p, 19725, '#d8d2c6', bb);
  if (bo.length > 2) { hardFill(p, 19726, '#f6f2ea', bo); inkLine(p, 19727, bo, {weight: 0.45, color: '#9a9080', still: true}); }
  if (bi.length > 2) hardFill(p, 19728, mixColor('#a8452e', C.wood, 0.35), bi);
  for (let k = 0; k < 3; k++) { const q = camPoint(c, [bw[0] - 0.02 + 0.04 * hash(19730 + k), bw[1] + 0.002, bw[2] - 0.02 + 0.04 * hash(19736 + k)], near(c)); if (q) hardFill(p, 19742 + k, k % 2 ? '#f0e2c8' : '#5a1e14', ell(q[0], q[1], 2.2, 1.6, 6)); }
  // mug back at the front-right corner (in front of the tissue box, so paint order holds), away from her hands, plain and dull (user, 12 Nov 2026, after the Film pass)
  const m: V3 = [t.x1 - 0.05, y + 0.015, t.z1 - 0.06], mu = camUnit(c, m, near(c)), mq = camPoint(c, m, near(c)), mt = camPoint(c, [m[0], y + 0.075, m[2]], near(c));
  if (mq && mt) {
    const mc = mixColor('#c0603e', C.wood, 0.55);
    hardFill(p, 19750, mixColor(mc, '#3a2418', 0.25), ell(mt[0] + 0.037 * mu, (mq[1] + mt[1]) / 2, 0.016 * mu, 0.022 * mu, 12));
    hardFill(p, 19751, C.wood, ell(mt[0] + 0.037 * mu, (mq[1] + mt[1]) / 2, 0.009 * mu, 0.014 * mu, 12));
    hardFill(p, 19752, mc, capsule(mq, mt, 0.06 * mu, 0.06 * mu, 4));
    hardFill(p, 19754, '#4a3022', ell(mt[0], mt[1], 0.027 * mu, 0.008 * mu, 14));
  }
  // keys on a ring
  const kq = camPoint(c, [t.x0 + 0.66, y + 0.003, t.z1 - 0.05], near(c)), ku = camUnit(c, [t.x0 + 0.66, y, t.z1 - 0.05], near(c));
  if (kq) {
    inkLine(p, 19760, ell(kq[0], kq[1], 0.02 * ku, 0.008 * ku, 14), {weight: 0.8, color: '#9a9488', still: true});
    hardFill(p, 19761, '#c8b878', capsule([kq[0] + 0.015 * ku, kq[1] + 0.002 * ku], [kq[0] + 0.055 * ku, kq[1] + 0.01 * ku], 0.012 * ku, 0.007 * ku, 3));
    hardFill(p, 19762, '#b0b4b8', capsule([kq[0] - 0.01 * ku, kq[1] + 0.006 * ku], [kq[0] - 0.045 * ku, kq[1] + 0.015 * ku], 0.011 * ku, 0.006 * ku, 3));
  }
  // phone charger cable lying loose on the top
  wInk(p, c, 19770, Array.from({length: 10}, (_, i): V3 => [t.x0 + 0.42 + 0.03 * Math.sin(i * 0.9), y + 0.002, t.z0 + 0.06 + i * 0.03]), {closed: false, weight: 0.8, color: mixColor('#ece8e0', C.wood, 0.45)});
  // glass rim and lit side
  const g: V3 = [t.x0 + 0.62, y, t.z0 + 0.18], gt = camPoint(c, [g[0], y + 0.11, g[2]], near(c)), gu = camUnit(c, g, near(c));
  if (gt) inkLine(p, 19780, ell(gt[0], gt[1], 0.037 * gu, 0.012 * gu, 14), {weight: 0.5, color: '#8fa3a8', still: true});
  // remote buttons
  for (let k = 0; k < 6; k++) { const q = camPoint(c, [t.x0 + 0.74, y + 0.021, t.z0 + 0.31 + k * 0.023], near(c)); if (q) hardFill(p, 19790 + k, k === 0 ? '#c03a2e' : '#6a6e76', ell(q[0], q[1], 2.4, 1.4, 6)); }
  // tissue box: a printed band and the slot
  const tb = {x0: t.x1 - 0.2, x1: t.x1 - 0.07, z0: t.z1 - 0.2, z1: t.z1 - 0.07};
  wFill(p, c, 19800, '#f2efe4', qz(tb.z1 + 0.001, tb.x0, tb.x1, y + 0.035, y + 0.055));
  for (let k = 0; k < 3; k++) wFill(p, c, 19801 + k, mixColor('#e39a8a', '#9fb8c8', 0.45), qz(tb.z1 + 0.002, tb.x0 + 0.02 + k * 0.04, tb.x0 + 0.035 + k * 0.04, y + 0.04, y + 0.05));
  // table front edge catches the lamp
  wInk(p, c, 19810, [[t.x0, y - 0.002, t.z1 + 0.001], [t.x1, y - 0.002, t.z1 + 0.001]], {closed: false, weight: 0.7, color: mixColor(C.wood, '#fff0d0', 0.35)});
  // rug fringe along the near edge
  for (let k = 0; k < 40; k++) { const x = t.x0 - 0.24 + k * ((t.x1 - t.x0 + 0.48) / 39); wInk(p, c, 19820 + k, [[x, 0.004, t.z1 + 0.25], [x + 0.005, 0.004, t.z1 + 0.29]], {closed: false, weight: 0.5, color: '#d9bf94'}); }
};

/** Foreground: a pothos in a pot on the floor at the near right, darker than the lit room, framing the shot. Film: UT12's foreground layer
 *  stays, but quieter: 18 leaves not 26, three close dark tones, no light vein strokes (they made the corner the busiest edge field in frame). */
const paintForeground = (p: Painter, c: YCam) => {
  const at: V3 = [0.3, 0, 0.86];
  paintBox(p, c, 19966, {x0: at[0] - 0.1, x1: at[0] + 0.1, y0: 0, y1: 0.2, z0: at[2] - 0.1, z1: at[2] + 0.1}, '#4a3226', {front: 0.1}, {ink: true});
  const lq = camPoint(c, [at[0], 0.36, at[2]], near(c)), lu = camUnit(c, [at[0], 0.36, at[2]], near(c));
  if (!lq) return;
  const tones = ['#2a3f27', '#33492e', '#3c5434'];
  for (let k = 0; k < 18; k++) {
    const a = -2.9 + 2.6 * hash(19870 + k), r = 0.03 + 0.17 * hash(19890 + k), droop = k > 11 ? 0.1 + 0.18 * hash(19910 + k) : 0;
    const x = lq[0] + Math.cos(a) * r * lu, yy = lq[1] + Math.sin(a) * r * 0.6 * lu + droop * lu, rot = a + 0.6 + 0.8 * (hash(19840 + k) - 0.5);
    const lw = (0.026 + 0.012 * hash(19820 + k)) * lu;
    hardFill(p, 19920 + k, tones[Math.floor(hash(19800 + k) * 3)], ell(x, yy, lw, lw * 0.62, 12, rot));
  }
};

/** LF01 with the four detail groups; same camera, cast and props as `paintLF01`. */
export const paintLF01Detail = (p: Painter) => {
  const c = camLF01;
  roomBack(p, c);
  paintWallWear(p, c);
  paintWindowDepth(p, c);
  paintShelf(p, c);
  paintFloorDetail(p, c);
  tok(p, c, T0F, restPose());
  paintMoth(p, c, [-0.32, 2.56, 0.16], 0.3);
  paintSofaSide(p, c);
  paintSofaDetail(p, c);
  paintBasket(p, c);
  paintWomanPhone(p, c, {at: W0_FEET, face: 'neutral', faceState: {look: [0, 0.6]}, t: T, glow: 1, tint: 0.05});
  paintSlippers(p, c);
  paintTable(p, c);
  paintTableDetail(p, c);
  paintForeground(p, c);
};
