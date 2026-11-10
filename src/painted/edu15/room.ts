import {capsule, ell, hardFill, inkLine, INK, washAt} from '../kit/draw';
import {paintHalo} from '../kit/fog';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {flatCircle, hull, paintBox, qx, qy, qz, wFill, wInk, wp, wWash} from '../kit/world';
import {C, CEIL, LAMP, LAMP_R} from './palette';

// SET-LR15 (brief EDU-EP15-BRIEF-R1.1 "Set plan - SET-LR15"), look-frame version (Film, W3; Boss builds the shot set from it at W5.2 as the
// brief's N4). A night living room in an older Bangkok townhouse with the ceiling as the hero surface: rough stippled plaster, a grey dust
// bloom ring round the round frosted lamp (K01), a cobweb in the back-left corner, a faint water stain; EP06 SET-LIVINGROOM palette
// (copy of methods, ENV-P01). Metres, space R (palette.ts). One warm lamp (3000 K) is the key; the window is cool night blue.
// W3 change (recorded in task.md): the window moves from the right wall to the back wall (x 0.95-1.85) so the night reads in the LF01 frame
// (UT01; the right wall is outside the sofa-side lens); the calendar moves left of the photo.

export const ROOM = {x0: -2.3, x1: 2.3, zBack: -1.3, zTv: 2.6, H: CEIL,
  sofa: {x0: -1.2, x1: 0.8, zb: -1.2, zf: -0.4, seat: 0.3, arm: 0.48, back: 0.72},
  table: {x0: -0.75, x1: 0.25, z0: 0.1, z1: 0.6, top: 0.4},
  window: {x0: 0.95, x1: 1.85, y0: 0.95, y1: 2.05},
  clock: [0.6, 2.05, -1.29] as V3, photo: [-0.9, 1.65, -1.29] as V3, calendar: [-1.55, 1.5, -1.29] as V3,
  fan: [1.6, 0, -0.9] as V3, plant: [1.8, 0, 0.6] as V3, slippers: [-0.1, 0, -0.3] as V3, ceilingFan: [-1.3, 2.4, 1.2] as V3,
} as const;

const near = (c: YCam) => c.near ?? 0.3;
const blobW = (cx: number, cz: number, r: number, id: number, y = CEIL - 0.0005, n = 12): V3[] =>
  Array.from({length: n}, (_, i): V3 => { const a = (i / n) * Math.PI * 2, k = 0.7 + 0.5 * hash(id * 13 + i); return [cx + r * k * Math.cos(a), y, cz + r * k * Math.sin(a)]; });

export type CeilingOpts = {
  /** Stipple bumps are painted round this plaster point (metres), out to `stippleR`; each bump a lit and a shadow fleck (the raking lamp). */
  focus?: V3; stippleR?: number; stippleStep?: number;
  /** Dust bloom density 0..1 (default 1). */
  dust?: number;
};

/** The ceiling plaster with the lamp pool, trowel waves, dust ring (K01), stain, cobweb and (near `focus`) stipple bumps. */
export const paintCeiling = (p: Painter, c: YCam, o: CeilingOpts = {}) => {
  const y = CEIL;
  wFill(p, c, 15000, C.plasterEdge, qy(y, ROOM.x0, ROOM.x1, ROOM.zBack, ROOM.zTv));
  // lamp pool: plaster lightening toward the lamp (stacked flat rings)
  const rings = [2.4, 1.9, 1.5, 1.2, 0.95, 0.75, 0.58, 0.44];
  rings.forEach((r, i) => { const q = flatCircle(c, [LAMP[0], y - 0.0002 * (i + 1), LAMP[2]], r, 40); if (q.length > 2) hardFill(p, 15010 + i, mixColor(C.plasterEdge, C.plaster, (i + 1) / rings.length), q); });
  // trowel waves (large soft patches)
  for (let i = 0; i < 26; i++) {
    const cx = ROOM.x0 + hash(15100 + i) * (ROOM.x1 - ROOM.x0), cz = ROOM.zBack + hash(15130 + i) * (ROOM.zTv - ROOM.zBack);
    wWash(p, c, 15160 + i, i % 3 ? C.stipple : '#f6efe0', 30, blobW(cx, cz, 0.12 + 0.18 * hash(15190 + i), 15160 + i, y - 0.0021), 0.3, 0.4);
  }
  // water stain and cobweb
  wWash(p, c, 15220, C.stain, 45, blobW(1.4, 1.6, 0.22, 15220, y - 0.0022, 16), 0.4, 0.4);
  wWash(p, c, 15221, C.stain, 35, blobW(1.45, 1.55, 0.14, 15221, y - 0.0023, 14), 0.4, 0.4);
  const web: V3 = [ROOM.x0, y, ROOM.zBack];
  for (let i = 0; i < 7; i++) {
    const a = (i / 6) * Math.PI * 0.5, L = 0.32 + 0.1 * hash(15230 + i);
    wInk(p, c, 15230 + i, [web, [web[0] + L * Math.cos(a) * 0.9, y - 0.01 - 0.15 * Math.sin(a) * 0.3, web[2] + L * Math.sin(a)]], {closed: false, weight: 0.5, color: C.web});
  }
  for (let k = 1; k <= 4; k++) wInk(p, c, 15240 + k, Array.from({length: 7}, (_, i): V3 => { const a = (i / 6) * Math.PI * 0.5, r = k * 0.07; return [web[0] + r * Math.cos(a), y - 0.012 - 0.01 * k, web[2] + r * Math.sin(a)]; }), {closed: false, weight: 0.45, color: C.web});
  // K01 dust bloom: a grey ring round the lamp, densest 0.35-0.55 m, lint fibres and grit specks
  const dk = o.dust ?? 1;
  for (let i = 0; i < Math.round(170 * dk); i++) {
    const a = hash(15300 + i) * Math.PI * 2, u = hash(15700 + i), r = 0.25 + 0.55 * (u < 0.7 ? 0.18 + 0.36 * hash(15900 + i) : hash(16100 + i));
    const s = 0.018 + 0.05 * hash(16300 + i);
    wWash(p, c, 16500 + i, mixColor(C.dust, '#8a8378', hash(16700 + i) * 0.5), 34 + 30 * hash(16900 + i), blobW(LAMP[0] + r * Math.cos(a), LAMP[2] + r * Math.sin(a), s, 16500 + i, y - 0.003, 9), 0.3, 0.4);
  }
  for (let i = 0; i < Math.round(46 * dk); i++) { // lint fibres
    const a = hash(17100 + i) * Math.PI * 2, r = 0.3 + 0.4 * hash(17200 + i), x = LAMP[0] + r * Math.cos(a), z = LAMP[2] + r * Math.sin(a), b = hash(17300 + i) * 6.28, L = 0.015 + 0.03 * hash(17400 + i);
    wInk(p, c, 17500 + i, [[x, y - 0.004, z], [x + L * 0.5 * Math.cos(b), y - 0.004, z + L * 0.5 * Math.sin(b) + 0.004], [x + L * Math.cos(b + 0.4), y - 0.004, z + L * Math.sin(b + 0.4)]], {closed: false, weight: 0.45, color: '#7f786e'});
  }
  // stipple bumps near the focus (2-6 mm), lit side toward the lamp, shadow side away
  if (o.focus) {
    const R = o.stippleR ?? 0.25, st = o.stippleStep ?? 0.009, [fx, , fz] = o.focus;
    for (let ix = -Math.ceil(R / st); ix <= Math.ceil(R / st); ix++) for (let iz = -Math.ceil(R / st); iz <= Math.ceil(R / st); iz++) {
      const id = 18000 + (ix + 200) * 401 + (iz + 200);
      const x = fx + ix * st + (hash(id) - 0.5) * st * 0.9, z = fz + iz * st + (hash(id + 7) - 0.5) * st * 0.9;
      if (Math.hypot(x - fx, z - fz) > R) continue;
      if (hash(id + 11) < 0.35) continue;
      const fall = 1 - Math.hypot(x - fx, z - fz) / R, r = 0.0006 + 0.0013 * hash(id + 3), w: V3 = [x, y - 0.0008, z], q = camPoint(c, w, near(c));
      if (!q) continue;
      const u = camUnit(c, w, near(c)), px = r * u;
      if (px < 0.9) continue;
      const lx = LAMP[0] - x, lz = LAMP[2] - z, ll = Math.hypot(lx, lz) || 1;
      const ql = camPoint(c, [x + (lx / ll) * r * 0.5, y - 0.001, z + (lz / ll) * r * 0.5], near(c)), qs = camPoint(c, [x - (lx / ll) * r * 0.7, y - 0.001, z - (lz / ll) * r * 0.7], near(c));
      const sq = Math.max(0.25, Math.min(1, Math.abs((c.y - y) / Math.hypot(c.x - x, c.y - y, c.z - z)) * 1.6));
      if (qs) hardFill(p, id * 3 + 1, mixColor(C.plaster, '#8f8371', 0.12 + 0.2 * fall), ell(qs[0], qs[1], px * 1.05, px * 1.05 * sq, 8));
      if (ql) hardFill(p, id * 3 + 2, mixColor(C.plaster, '#fffaf0', 0.15 + 0.25 * fall), ell(ql[0], ql[1], px * 0.8, px * 0.8 * sq, 8));
    }
  }
};

/** The round frosted lamp (0.40 m), its warm halo on the plaster (ENV-GLOW) painted first. `halo` scales the halo level. */
export const paintLamp = (p: Painter, c: YCam, o: {halo?: number; t?: number} = {}) => {
  const q = camPoint(c, LAMP, near(c));
  if (q && (o.halo ?? 1) > 0) paintHalo(p, {x: q[0], y: q[1], r: 0.95 * camUnit(c, LAMP, near(c)), color: C.halo, level: o.halo ?? 1, squash: 0.62, t: o.t ?? 0, seed: 15400});
  const rim = Array.from({length: 28}, (_, i): V3 => [LAMP[0] + LAMP_R * Math.cos((i / 28) * 6.283), CEIL - 0.002, LAMP[2] + LAMP_R * Math.sin((i / 28) * 6.283)]);
  const low = Array.from({length: 28}, (_, i): V3 => [LAMP[0] + LAMP_R * 0.62 * Math.cos((i / 28) * 6.283), CEIL - 0.07, LAMP[2] + LAMP_R * 0.62 * Math.sin((i / 28) * 6.283)]);
  const mid = Array.from({length: 28}, (_, i): V3 => [LAMP[0] + LAMP_R * 0.9 * Math.cos((i / 28) * 6.283), CEIL - 0.045, LAMP[2] + LAMP_R * 0.9 * Math.sin((i / 28) * 6.283)]);
  const pts = [...rim, ...mid, ...low].map((w) => camPoint(c, w, near(c))).filter((x): x is Pt => !!x);
  if (pts.length > 3) { hardFill(p, 15420, '#f3d9a8', hull(pts)); }
  const core = [...mid, ...low].map((w) => camPoint(c, w, near(c))).filter((x): x is Pt => !!x);
  if (core.length > 3) hardFill(p, 15421, C.lampCore, hull(core));
  const hot = low.map((w) => camPoint(c, w, near(c))).filter((x): x is Pt => !!x);
  if (hot.length > 3) hardFill(p, 15422, '#fffbf0', hull(hot));
  const rq = rim.map((w) => camPoint(c, w, near(c))).filter((x): x is Pt => !!x);
  if (rq.length > 3) inkLine(p, 15423, rq, {weight: 0.6, color: '#c9a878', still: true});
};

/** Walls (back, sides, TV) and the tiled floor, toned for night: lit near the lamp, darker low and in the corners. */
export const paintShell = (p: Painter, c: YCam) => {
  const {x0, x1, zBack, zTv, H} = ROOM;
  wFill(p, c, 14000, mixColor(C.tile, '#4a3c30', 0.45), qy(0, x0, x1, zBack, zTv));
  const fp = flatCircle(c, [0, 0.0005, -0.1], 1.5, 36); if (fp.length > 2) washAt(p, 14001, mixColor(C.tile, '#fff0d0', 0.2), 70, fp, 0.4, 0.3);
  const fp2 = flatCircle(c, [-0.1, 0.0008, -0.3], 0.9, 30); if (fp2.length > 2) washAt(p, 14002, mixColor(C.tile, '#fff0d0', 0.3), 60, fp2, 0.4, 0.3);
  for (let i = 0; i <= 8; i++) { const x = x0 + i * 0.6 - 0.05; wInk(p, c, 14010 + i, [[x, 0.001, zBack], [x, 0.001, zTv]], {closed: false, weight: 0.55, color: mixColor(C.grout, '#3d3127', 0.45)}); }
  for (let i = 0; i <= 7; i++) { const z = zBack + i * 0.6; wInk(p, c, 14030 + i, [[x0, 0.001, z], [x1, 0.001, z]], {closed: false, weight: 0.55, color: mixColor(C.grout, '#3d3127', 0.45)}); }
  // walls: base, then lit upper band and dark low band
  const walls: [number, V3[]][] = [[14100, qz(zBack, x0, x1, 0, H)], [14110, qx(x0, 0, H, zBack, zTv)], [14120, qx(x1, 0, H, zBack, zTv)], [14130, qz(zTv, x0, x1, 0, H)]];
  for (const [id, pts] of walls) {
    wFill(p, c, id, mixColor(C.wall, C.wallShade, 0.42), pts);
    const top = pts.map((v): V3 => [v[0], v[1] > 1 ? H : 1.2, v[2]]);
    wWash(p, c, id + 1, mixColor(C.wall, '#fff0d0', 0.15), 120, top, 0.3, 0.3);
    const low = pts.map((v): V3 => [v[0], v[1] > 1 ? 0.55 : 0, v[2]]);
    wWash(p, c, id + 2, C.wallShade, 90, low, 0.3, 0.3);
    for (let i = 0; i < 10; i++) { // roller streaks and soft stains
      const u = hash(id * 7 + i), v = 0.3 + 2.0 * hash(id * 11 + i), w = 0.15 + 0.3 * hash(id * 13 + i);
      const a = pts[0], b = pts[1];
      const at = (k: number, yy: number): V3 => [a[0] + (b[0] - a[0]) * k, yy, a[2] + (b[2] - a[2]) * k];
      wWash(p, c, id + 20 + i, mixColor(C.wallShade, '#b89d78', hash(id + i)), 28, [at(u, v), at(u + w * 0.15, v + 0.04), at(u + w * 0.13, v - 0.3), at(u, v - 0.27)], 0.4, 0.5);
    }
    // skirting
    const sk = pts.map((v): V3 => [v[0], v[1] > 1 ? 0.08 : 0, v[2]]);
    wFill(p, c, id + 3, mixColor('#efe4cc', C.wallShade, 0.45), sk);
  }
};

/** Back-wall decor: clock at 21:10, family photo, textless calendar, the window (moved here, W3) with grille, half-drawn curtain and the night soi. */
export const paintBackWall = (p: Painter, c: YCam) => {
  const z = ROOM.zBack + 0.012;
  // window
  const {x0, x1, y0, y1} = ROOM.window;
  paintBox(p, c, 14300, {x0: x0 - 0.04, x1: x1 + 0.04, y0: y0 - 0.04, y1: y1 + 0.04, z0: ROOM.zBack, z1: z}, '#b9bcbc', {}, {ink: true});
  wFill(p, c, 14301, C.glass, qz(z + 0.001, x0, x1, y0, y1));
  wFill(p, c, 14302, '#202838', qz(z + 0.002, x0, x1, y0, y0 + 0.4)); // the soi wall opposite, lower
  wFill(p, c, 14303, C.neighbour, qz(z + 0.003, x0 + 0.48, x0 + 0.7, y0 + 0.5, y0 + 0.78)); // neighbour's warm window
  wFill(p, c, 14304, mixColor(C.neighbour, '#ffffff', 0.3), qz(z + 0.004, x0 + 0.53, x0 + 0.65, y0 + 0.56, y0 + 0.72));
  wWash(p, c, 14305, C.neighbour, 50, qz(z + 0.003, x0 + 0.38, x0 + 0.8, y0 + 0.42, y0 + 0.88), 0.5, 0.3);
  wFill(p, c, 14306, '#a7adb3', qz(z + 0.005, (x0 + x1) / 2 - 0.012, (x0 + x1) / 2 + 0.012, y0, y1)); // sliding frame
  for (let i = 1; i < 6; i++) { const x = x0 + (i / 6) * (x1 - x0); wFill(p, c, 14310 + i, C.grille, qz(z + 0.03, x - 0.007, x + 0.007, y0, y1)); }
  for (let i = 1; i < 5; i++) { const yy = y0 + (i / 5) * (y1 - y0); wFill(p, c, 14320 + i, C.grille, qz(z + 0.031, x0, x1, yy - 0.007, yy + 0.007)); }
  // curtain half drawn (over the right half), folds
  const cx0 = x0 + (x1 - x0) * 0.55;
  wFill(p, c, 14330, '#9c8a6e', qz(z + 0.06, cx0, x1 + 0.12, y0 - 0.15, y1 + 0.12));
  for (let i = 0; i < 6; i++) { const x = cx0 + 0.04 + i * 0.09; wFill(p, c, 14331 + i, '#7f6f57', qz(z + 0.061, x, x + 0.025, y0 - 0.15, y1 + 0.12)); }
  wInk(p, c, 14340, [[x0 - 0.1, y1 + 0.13, z + 0.06], [x1 + 0.16, y1 + 0.13, z + 0.06]], {closed: false, weight: 1.4, color: '#4a3e30'});
  // clock (21:10): face, rim, hands
  const ck = ROOM.clock, cu = camUnit(c, ck, near(c)), cq = camPoint(c, ck, near(c));
  if (cq) {
    hardFill(p, 14350, '#3a2e26', ell(cq[0], cq[1], 0.155 * cu, 0.155 * cu, 22));
    hardFill(p, 14351, '#f2ead8', ell(cq[0], cq[1], 0.135 * cu, 0.135 * cu, 22));
    for (let k = 0; k < 12; k++) { const a = (k / 12) * 6.283; inkLine(p, 14352 + k, [[cq[0] + Math.sin(a) * 0.11 * cu, cq[1] - Math.cos(a) * 0.11 * cu], [cq[0] + Math.sin(a) * 0.125 * cu, cq[1] - Math.cos(a) * 0.125 * cu]], {closed: false, weight: 0.8, color: '#3a2e26', still: true}); }
    const hA = ((9 + 10 / 60) / 12) * 6.283, mA = (10 / 60) * 6.283;
    inkLine(p, 14366, [cq, [cq[0] + Math.sin(hA) * 0.07 * cu, cq[1] - Math.cos(hA) * 0.07 * cu]], {closed: false, weight: 1.6, color: '#2a221c', still: true});
    inkLine(p, 14367, [cq, [cq[0] + Math.sin(mA) * 0.105 * cu, cq[1] - Math.cos(mA) * 0.105 * cu]], {closed: false, weight: 1.1, color: '#2a221c', still: true});
  }
  // family photo (frame, mat, three soft figures) and calendar (textless: a picture block, a grid of pale squares)
  const [px, py] = ROOM.photo;
  paintBox(p, c, 14370, {x0: px - 0.18, x1: px + 0.18, y0: py - 0.14, y1: py + 0.14, z0: ROOM.zBack, z1: z + 0.01}, '#5a3f2a', {}, {ink: true});
  wFill(p, c, 14371, '#e9dfc9', qz(z + 0.012, px - 0.15, px + 0.15, py - 0.11, py + 0.11));
  wFill(p, c, 14372, '#9fb3b8', qz(z + 0.013, px - 0.13, px + 0.13, py - 0.09, py + 0.09));
  [[-0.07, '#6d4b3a'], [0.0, '#8a5a3b'], [0.07, '#5a4a3a']].forEach(([dx, col], i) => {
    const q = camPoint(c, [px + (dx as number), py - 0.0, z + 0.014], near(c)), u = camUnit(c, ROOM.photo, near(c));
    if (q) { hardFill(p, 14373 + i, col as string, ell(q[0], q[1] - 0.03 * u, 0.025 * u, 0.025 * u, 10)); hardFill(p, 14376 + i, col as string, ell(q[0], q[1] + 0.035 * u, 0.04 * u, 0.045 * u, 10)); }
  });
  const [kx, ky] = ROOM.calendar;
  wFill(p, c, 14380, '#f3ecdc', qz(z + 0.004, kx - 0.16, kx + 0.16, ky - 0.24, ky + 0.2));
  wFill(p, c, 14381, '#c98b5a', qz(z + 0.005, kx - 0.14, kx + 0.14, ky + 0.02, ky + 0.18));
  wFill(p, c, 14382, '#7f9a6a', qz(z + 0.006, kx - 0.14, kx + 0.14, ky + 0.02, ky + 0.08));
  for (let r = 0; r < 4; r++) for (let k = 0; k < 6; k++) wFill(p, c, 14390 + r * 6 + k, '#ddd2bc', qz(z + 0.006, kx - 0.13 + k * 0.045, kx - 0.1 + k * 0.045, ky - 0.2 + r * 0.05, ky - 0.17 + r * 0.05));
  wInk(p, c, 14420, [[kx, ky + 0.2, z + 0.01], [kx, ky + 0.24, z + 0.01]], {closed: false, weight: 0.8, color: INK});
};

/** Sofa (teal, mustard throw on the left arm, two cushions), standing fan (off), pothos, slippers. */
export const paintSofaSide = (p: Painter, c: YCam) => {
  const s = ROOM.sofa;
  // standing fan (behind the sofa's right end)
  const [fx, , fz] = ROOM.fan;
  paintBox(p, c, 14500, {x0: fx - 0.13, x1: fx + 0.13, y0: 0, y1: 0.03, z0: fz - 0.13, z1: fz + 0.13}, '#d9d6cf', {}, {});
  paintBox(p, c, 14501, {x0: fx - 0.015, x1: fx + 0.015, y0: 0.03, y1: 1.05, z0: fz - 0.015, z1: fz + 0.015}, '#d9d6cf', {}, {});
  const fq = camPoint(c, [fx, 1.2, fz + 0.04], near(c)), fu = camUnit(c, [fx, 1.2, fz], near(c));
  if (fq) {
    hardFill(p, 14502, '#cfcac0', ell(fq[0], fq[1], 0.2 * fu, 0.2 * fu, 22));
    hardFill(p, 14503, '#8d8a84', ell(fq[0], fq[1], 0.18 * fu, 0.18 * fu, 22));
    for (let k = 0; k < 3; k++) { const a = k * 2.094 + 0.4; hardFill(p, 14504 + k, '#bcd2d6', ell(fq[0] + Math.cos(a) * 0.09 * fu, fq[1] + Math.sin(a) * 0.09 * fu, 0.085 * fu, 0.04 * fu, 12, a)); }
    for (let k = 0; k < 12; k++) { const a = (k / 12) * 6.283; inkLine(p, 14510 + k, [fq, [fq[0] + Math.cos(a) * 0.2 * fu, fq[1] + Math.sin(a) * 0.2 * fu]], {closed: false, weight: 0.45, color: '#e8e4dc', still: true}); }
    hardFill(p, 14525, '#6f6c66', ell(fq[0], fq[1], 0.035 * fu, 0.035 * fu, 10));
  }
  // sofa: back, seat, arms
  const sofa = C.sofa;
  paintBox(p, c, 14600, {x0: s.x0, x1: s.x1, y0: 0.06, y1: s.back, z0: s.zb, z1: s.zb + 0.2}, sofa, {front: 0.05, top: -0.1}, {ink: true});
  paintBox(p, c, 14610, {x0: s.x0 + 0.2, x1: s.x1 - 0.2, y0: 0.06, y1: s.seat, z0: s.zb + 0.2, z1: s.zf}, mixColor(sofa, C.sofaShade, 0.25), {front: 0.25, top: -0.08}, {ink: true});
  // seat cushions (two), slightly puffed
  for (let k = 0; k < 2; k++) {
    const a = s.x0 + 0.2 + k * 0.8, b = a + 0.8;
    paintBox(p, c, 14620 + k * 5, {x0: a + 0.01, x1: b - 0.01, y0: s.seat - 0.02, y1: s.seat + 0.06, z0: s.zb + 0.2, z1: s.zf + 0.02}, sofa, {front: 0.18, top: -0.12}, {ink: true});
  }
  paintBox(p, c, 14640, {x0: s.x0 + 0.25, x1: s.x0 + 0.65, y0: s.seat + 0.06, y1: 0.66, z0: s.zb + 0.2, z1: s.zb + 0.32}, '#c7b48e', {front: 0.08}, {ink: true}); // back cushion
  for (const [x0, id] of [[s.x0, 14650], [s.x1 - 0.2, 14660]] as const) paintBox(p, c, id, {x0, x1: x0 + 0.2, y0: 0.06, y1: s.arm, z0: s.zb, z1: s.zf}, sofa, {front: 0.15, top: -0.1, left: 0.25, right: 0.25}, {ink: true});
  // mustard throw over the left arm
  wFill(p, c, 14670, C.throw, [[s.x0 - 0.01, s.arm + 0.012, s.zb + 0.15], [s.x0 + 0.21, s.arm + 0.012, s.zb + 0.15], [s.x0 + 0.21, s.arm + 0.012, s.zf - 0.1], [s.x0 - 0.01, s.arm + 0.012, s.zf - 0.1]]);
  wFill(p, c, 14671, mixColor(C.throw, '#5a3a14', 0.25), [[s.x0 + 0.205, s.arm + 0.01, s.zb + 0.2], [s.x0 + 0.205, s.arm + 0.01, s.zf - 0.12], [s.x0 + 0.205, 0.2, s.zf - 0.2], [s.x0 + 0.205, 0.22, s.zb + 0.25]]);
  wFill(p, c, 14672, mixColor(C.throw, '#7a5418', 0.15), [[s.x0 - 0.01, s.arm + 0.01, s.zf - 0.1], [s.x0 + 0.21, s.arm + 0.01, s.zf - 0.1], [s.x0 + 0.2, 0.15, s.zf + 0.005], [s.x0, 0.12, s.zf + 0.005]]);
  // legs
  for (const x of [s.x0 + 0.05, s.x1 - 0.05]) paintBox(p, c, 14680 + Math.round(x * 10), {x0: x - 0.02, x1: x + 0.02, y0: 0, y1: 0.06, z0: s.zf - 0.06, z1: s.zf - 0.02}, '#2a1d14', {}, {});
  // shadow under the sofa
  wWash(p, c, 14690, '#1f1810', 90, qy(0.002, s.x0 - 0.05, s.x1 + 0.05, s.zb, s.zf + 0.08), 0.4, 0.3);
};

/** Slippers on the floor in front of the sofa. */
export const paintSlippers = (p: Painter, c: YCam) => {
  const [x, , z] = ROOM.slippers;
  for (const dx of [-0.07, 0.07]) {
    const pts = wp(c, Array.from({length: 14}, (_, i): V3 => { const a = (i / 14) * 6.283; return [x + dx + 0.045 * Math.cos(a), 0.015, z + 0.12 * Math.sin(a)]; }));
    if (pts.length > 2) { hardFill(p, 14700 + Math.round(dx * 100), '#3f5d7a', pts); inkLine(p, 14710 + Math.round(dx * 100), pts, {weight: 0.5, color: '#1d2a38', still: true}); }
  }
};

/** Coffee table: top, legs, striped mat; plate of sliced guava, glass of water, TV remote, tissue box. */
export const paintTable = (p: Painter, c: YCam) => {
  const t = ROOM.table;
  wFill(p, c, 14800, mixColor(C.rug, '#2a1d14', 0.35), qy(0.003, t.x0 - 0.25, t.x1 + 0.25, t.z0 - 0.25, t.z1 + 0.25));
  for (let i = 0; i < 6; i++) { const z = t.z0 - 0.2 + i * 0.16; wFill(p, c, 14801 + i, mixColor('#d9bf94', '#2a1d14', 0.45), qy(0.004, t.x0 - 0.25, t.x1 + 0.25, z, z + 0.03)); }
  for (const [x, z] of [[t.x0 + 0.04, t.z0 + 0.04], [t.x1 - 0.04, t.z0 + 0.04], [t.x0 + 0.04, t.z1 - 0.04], [t.x1 - 0.04, t.z1 - 0.04]]) paintBox(p, c, 14810 + Math.round((x + z) * 100), {x0: x - 0.025, x1: x + 0.025, y0: 0, y1: t.top - 0.04, z0: z - 0.025, z1: z + 0.025}, C.wood, {}, {ink: true});
  paintBox(p, c, 14820, {x0: t.x0, x1: t.x1, y0: t.top - 0.04, y1: t.top, z0: t.z0, z1: t.z1}, C.wood, {top: -0.12, front: 0.2}, {ink: true});
  // wood grain on the top
  for (let i = 0; i < 7; i++) { const z = t.z0 + 0.05 + i * 0.065; wInk(p, c, 14830 + i, [[t.x0 + 0.03, t.top + 0.001, z], [t.x0 + 0.4, t.top + 0.001, z + 0.008], [t.x1 - 0.03, t.top + 0.001, z - 0.004]], {closed: false, weight: 0.45, color: mixColor(C.wood, '#2a1d14', 0.45)}); }
  // plate + guava
  const pl: V3 = [t.x0 + 0.3, t.top + 0.004, t.z0 + 0.25];
  const plq = flatCircle(c, pl, 0.11, 24); if (plq.length > 2) { hardFill(p, 14850, '#f4f0e6', plq); inkLine(p, 14851, plq, {weight: 0.5, color: '#9a9080', still: true}); }
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * 6.283 + 0.3, q = wp(c, [[pl[0] + 0.015 * Math.cos(a), pl[1] + 0.01, pl[2] + 0.015 * Math.sin(a)], [pl[0] + 0.085 * Math.cos(a - 0.25), pl[1] + 0.01, pl[2] + 0.085 * Math.sin(a - 0.25)], [pl[0] + 0.085 * Math.cos(a + 0.25), pl[1] + 0.01, pl[2] + 0.085 * Math.sin(a + 0.25)]]);
    if (q.length > 2) { hardFill(p, 14852 + k, '#e9f1d2', q); }
    const r = wp(c, [[pl[0] + 0.03 * Math.cos(a), pl[1] + 0.011, pl[2] + 0.03 * Math.sin(a)], [pl[0] + 0.06 * Math.cos(a - 0.12), pl[1] + 0.011, pl[2] + 0.06 * Math.sin(a - 0.12)], [pl[0] + 0.06 * Math.cos(a + 0.12), pl[1] + 0.011, pl[2] + 0.06 * Math.sin(a + 0.12)]]);
    if (r.length > 2) hardFill(p, 14858 + k, '#f0a8a0', r);
  }
  // glass of water (cylinder), remote, tissue box
  const g: V3 = [t.x0 + 0.62, t.top, t.z0 + 0.18], gu = camUnit(c, g, near(c)), gq = camPoint(c, g, near(c)), gt = camPoint(c, [g[0], g[1] + 0.11, g[2]], near(c));
  if (gq && gt) {
    hardFill(p, 14870, '#b9c9cc', capsule(gq, gt, 0.07 * gu, 0.075 * gu, 4));
    hardFill(p, 14871, '#d9e6e8', ell(gt[0], gt[1], 0.037 * gu, 0.012 * gu, 14));
    inkLine(p, 14872, [[gq[0] - 0.033 * gu, gq[1]], [gt[0] - 0.037 * gu, gt[1]]], {closed: false, weight: 0.5, color: '#eef6f6', still: true});
  }
  paintBox(p, c, 14880, {x0: t.x0 + 0.72, x1: t.x0 + 0.76, y0: t.top, y1: t.top + 0.02, z0: t.z0 + 0.28, z1: t.z0 + 0.45}, '#24262a', {}, {});
  paintBox(p, c, 14890, {x0: t.x1 - 0.2, x1: t.x1 - 0.07, y0: t.top, y1: t.top + 0.1, z0: t.z1 - 0.2, z1: t.z1 - 0.07}, '#7aa3b8', {top: -0.15}, {ink: true});
  const tq = camPoint(c, [t.x1 - 0.135, t.top + 0.12, t.z1 - 0.135], near(c)), tu = camUnit(c, [t.x1 - 0.135, t.top + 0.1, t.z1 - 0.135], near(c));
  if (tq) hardFill(p, 14895, '#f8f6f0', ell(tq[0], tq[1], 0.035 * tu, 0.03 * tu, 10));
};

/** Moth (K03): a small brown body with pale wings, flutter `phase` 0..1 (wings up / down). */
export const paintMoth = (p: Painter, c: YCam, at: V3, phase: number, seed = 15500) => {
  const q = camPoint(c, at, near(c)), u = camUnit(c, at, near(c));
  if (!q) return;
  const span = 0.032 * u, open = 0.35 + 0.65 * Math.abs(Math.sin(phase * Math.PI));
  for (const s of [1, -1]) {
    const w: Pt[] = [[q[0], q[1]], [q[0] + s * span * 0.5, q[1] - span * 0.32 * open], [q[0] + s * span * 0.55, q[1] + span * 0.05], [q[0] + s * span * 0.18, q[1] + span * 0.22]];
    hardFill(p, seed + (s > 0 ? 1 : 2), C.mothWing, w);
    inkLine(p, seed + (s > 0 ? 3 : 4), w, {weight: 0.45, color: C.moth, still: true});
  }
  hardFill(p, seed + 5, C.moth, ell(q[0], q[1] + span * 0.05, span * 0.07, span * 0.24, 10));
};

/** The ceiling fan (looking-up wides): downrod, motor, three wood blades at rotation `a` (rad). */
export const paintCeilingFan = (p: Painter, c: YCam, a: number) => {
  const [x, y, z] = ROOM.ceilingFan;
  wInk(p, c, 15600, [[x, CEIL, z], [x, y + 0.04, z]], {closed: false, weight: 2.2, color: '#4a4038'});
  for (let k = 0; k < 3; k++) {
    const b = a + (k * 2 * Math.PI) / 3, dx = Math.cos(b), dz = Math.sin(b), nx = -dz, nz = dx;
    wFill(p, c, 15610 + k, '#6b4a30', [[x + dx * 0.08 + nx * 0.03, y, z + dz * 0.08 + nz * 0.03], [x + dx * 0.6 + nx * 0.06, y + 0.01, z + dz * 0.6 + nz * 0.06], [x + dx * 0.6 - nx * 0.06, y + 0.01, z + dz * 0.6 - nz * 0.06], [x + dx * 0.08 - nx * 0.03, y, z + dz * 0.08 - nz * 0.03]]);
  }
  const m = flatCircle(c, [x, y, z], 0.09, 16); if (m.length > 2) hardFill(p, 15620, '#d8d2c4', m);
};
