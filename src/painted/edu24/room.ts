import {ell, hardFill, inkLine, INK, washAt} from '../kit/draw';
import {paintCoins} from '../kit/groceries';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {flatCircle, hull, qx, qy, qz, wFill, wInk, wp, wWash} from '../kit/world';
import {PAL, setTone, type Light} from './palette';

// SET-ROOM24 (N1) and its props BOARD24 (N2 body), NOTE24 (N3), CARD24 (N4), tray (N5) and the plain four-leg chairs, in space M (EDU-EP24-BRIEF-R2
// "Set plan"): metres, origin on the floor at the room centre line under the chairs' front edge, +x screen right at yaw 0, +y up, +z toward
// the main camera. Film W3 look frames (2026-11-17), written in the production owner module (film-visual-brief-workflow#look-assets); Boss
// hardens. Straight architecture is `hardFill` (DF-20261030-painted-straight-bars); light is washes. The board's digits, labels and the card
// lines are DOM text on camera quads (`board-text.tsx`), never painted here.
//
// Deviations from the brief's estimates (recorded for the R3 note): BOARD24 grows from 1.50 x 1.00 to 1.80 x 1.32 m (windows 0.62 x 0.46,
// header tabs 0.26 m tall, "รวม" strip 1.05 x 0.24) so the wide reaches digits >= 60 px and labels >= 36 px (LF01 must-prove 4); the host,
// side table, card and tray move +0.15 m in x with it (host (1.10, 0, -1.85), table centre (0.95, -1.35)) to keep the board edge clear; the
// pot plant moves from (-2.40, -1.90) to (-2.25, -2.10) so it shows at the wide's left edge; the chairs sit at x -0.50 / +0.50 (was +-0.55) so both
// bidders stay in the 1080 frame; the room runs to z +4.80 (was +3.60) so the wide camera can stand behind the seated group (user,
// 2026-11-17), with ceiling panel rows at z +1.8 and +4.0.

export const ROOM = {x0: -3, x1: 3, z0: -2.4, z1: 4.8, h: 2.7} as const;
const BZ = -2.38; // board face
/** Board rectangles (x0, x1, y0, y1) on the back wall. */
export const BOARD = {
  body: [-1.35, 0.45, 1.05, 2.37], tabYou: [-1.25, -0.63, 2.05, 2.31], tabRival: [-0.43, 0.19, 2.05, 2.31],
  winYou: [-1.25, -0.63, 1.52, 1.98], winRival: [-0.43, 0.19, 1.52, 1.98], sum: [-1.0, 0.05, 1.16, 1.4],
} as const;
type R4 = readonly [number, number, number, number];
/** World corners TL, TR, BR, BL of a board rectangle, a hair in front of the face (the QuadText order). */
export const boardQuad = (r: R4, dz = 0.01): V3[] => [[r[0], r[3], BZ + dz], [r[1], r[3], BZ + dz], [r[1], r[2], BZ + dz], [r[0], r[2], BZ + dz]];

export const CHAIRS = {you: [-0.5, 0, 0.9] as V3, rival: [0.5, 0, 0.9] as V3};
export const HOST_AT: V3 = [1.1, 0, -1.85];
export const TABLE = {c: [0.95, 0, -1.35] as V3, r: 0.3, top: 1.0};
export const TRAY = {c: [1.09, 1.0, -1.27] as V3, w: 0.3, d: 0.2, h: 0.03};

// ---- CARD24: a tent card on the side table, face yawed 15 deg toward the chairs (normal n), leaning back 15 deg
const CARD = {base: [0.75, 1.0, -1.2] as V3, w: 0.21, h: 0.15, flap: 0.07, yaw: 15};
const cardAxes = () => {
  const a = (CARD.yaw * Math.PI) / 180;
  return {t: [Math.cos(a), 0, Math.sin(a)] as V3, n: [-Math.sin(a), 0, Math.cos(a)] as V3};
};
/** A point on the card face: s across (-0.5..0.5 of the width), v up the face (0..1 of the height), `off` m along the normal. */
export const cardPoint = (s: number, v: number, off = 0): V3 => {
  const {t, n} = cardAxes(), lean = Math.tan((15 * Math.PI) / 180) * CARD.h * v;
  return [CARD.base[0] + t[0] * s * CARD.w + n[0] * (off - lean), CARD.base[1] + CARD.h * v * Math.cos((15 * Math.PI) / 180), CARD.base[2] + t[2] * s * CARD.w + n[2] * (off - lean)];
};
/** Card text quads (TL, TR, BR, BL): line 1 on the upper face, line 2 on the part the flap covers until L05. */
export const CARD_LINES = {
  line1: [cardPoint(-0.46, 0.92, 0.002), cardPoint(0.46, 0.92, 0.002), cardPoint(0.46, 0.55, 0.002), cardPoint(-0.46, 0.55, 0.002)],
  line2: [cardPoint(-0.46, 0.44, 0.002), cardPoint(0.46, 0.44, 0.002), cardPoint(0.46, 0.06, 0.002), cardPoint(-0.46, 0.06, 0.002)],
};

const shade = (c: string, u: number) => mixColor(c, '#000000', u);
const box = (p: Painter, c: YCam, seed: number, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, col: string, light: Light) => {
  // visible faces of an axis box, far to near: top/bottom, sides, front
  const T = (k: string, u: number) => setTone(shade(col, u), light);
  if (c.y > y1) wFill(p, c, seed, T('top', -0.0), qy(y1, x0, x1, z0, z1));
  if (c.x < x0) wFill(p, c, seed + 1, T('l', 0.18), qx(x0, y0, y1, z0, z1));
  if (c.x > x1) wFill(p, c, seed + 2, T('r', 0.18), qx(x1, y0, y1, z0, z1));
  if (c.z > z1) wFill(p, c, seed + 3, T('f', 0.08), qz(z1, x0, x1, y0, y1));
  if (c.z < z0) wFill(p, c, seed + 4, T('b', 0.08), qz(z0, x0, x1, y0, y1));
};

/** Ceiling, walls, carpet, the fluorescent panels, the clock, the plant, the corkboard on the +z wall and the window light. */
export const paintRoomShell = (p: Painter, c: YCam, light: Light) => {
  const T = (col: string) => setTone(col, light);
  const {x0, x1, z0, z1, h} = ROOM;
  wFill(p, c, 24001, T(PAL.ceiling), qy(h, x0, x1, z0, z1));
  // ceiling grid (0.6 m acoustic tiles): the office read
  for (let x = -2.4; x <= 2.41; x += 0.6) wInk(p, c, 24010 + Math.round(x * 10), [[x, h - 0.001, z0], [x, h - 0.001, z1]], {closed: false, weight: 0.5, color: T(PAL.ceilingGrid)});
  for (let z = -1.8; z <= 4.21; z += 0.6) wInk(p, c, 24040 + Math.round(z * 10), [[x0, h - 0.001, z], [x1, h - 0.001, z]], {closed: false, weight: 0.5, color: T(PAL.ceilingGrid)});
  const panelOn = light === 'warm' ? '#eef2ee' : '#f4fbfb';
  for (const z of [-0.6, 1.8, 4.0]) for (const x of [-0.8, 0.8]) {
    wFill(p, c, 24080 + Math.round((x + z) * 10), T('#b9b6ae'), qy(h - 0.002, x - 0.62, x + 0.62, z - 0.17, z + 0.17));
    wFill(p, c, 24090 + Math.round((x + z) * 10), panelOn, qy(h - 0.004, x - 0.58, x + 0.58, z - 0.13, z + 0.13));
  }
  // back wall (board wall), side walls, +z wall; skirting
  wFill(p, c, 24101, T(PAL.wall), qz(z0, x0, x1, 0, h));
  wFill(p, c, 24102, T(shade(PAL.wall, 0.06)), qx(x0, 0, h, z0, z1));
  wFill(p, c, 24103, T(shade(PAL.wall, 0.1)), qx(x1, 0, h, z0, z1));
  wFill(p, c, 24104, T(shade(PAL.wall, 0.03)), [[x1, 0, z1], [x0, 0, z1], [x0, h, z1], [x1, h, z1]]);
  wFill(p, c, 24105, T(PAL.skirting), qz(z0 + 0.005, x0, x1, 0, 0.1));
  wFill(p, c, 24106, T(PAL.skirting), [[x1, 0, z1 - 0.005], [x0, 0, z1 - 0.005], [x0, 0.1, z1 - 0.005], [x1, 0.1, z1 - 0.005]]);
  wFill(p, c, 24107, T(PAL.skirting), qx(x0 + 0.005, 0, 0.1, z0, z1));
  wFill(p, c, 24108, T(PAL.skirting), qx(x1 - 0.005, 0, 0.1, z0, z1));
  // ceiling-wall shade line
  wWash(p, c, 24109, T(PAL.wallShade), 60, qz(z0 + 0.004, x0, x1, h - 0.18, h), 0.1, 0.2);
  // window on the left wall (frame, sky, mullions)
  const W = {z0: -1.6, z1: 0.8, y0: 0.9, y1: 2.1};
  wFill(p, c, 24110, T('#d9d4c8'), qx(x0 + 0.004, W.y0 - 0.06, W.y1 + 0.06, W.z0 - 0.06, W.z1 + 0.06));
  wFill(p, c, 24111, light === 'warm' ? '#f6e3bd' : T(PAL.sky), qx(x0 + 0.006, W.y0, W.y1, W.z0, W.z1));
  for (const z of [-0.8, 0.0]) wFill(p, c, 24112 + Math.round(z * 10), T('#d9d4c8'), qx(x0 + 0.008, W.y0, W.y1, z - 0.025, z + 0.025));
  // door on the right wall
  wFill(p, c, 24120, T('#a88a68'), qx(x1 - 0.004, 0, 2.05, 0.6, 1.5));
  // carpet
  wFill(p, c, 24130, T(PAL.carpet), qy(0, x0, x1, z0, z1));
  wWash(p, c, 24131, T(PAL.carpetShade), 70, qy(0.001, x0, x1, z0, z0 + 1.0), 0.2, 0.2);
  // wall clock on the back wall (est (1.9, 2.15))
  const ck = camPoint(c, [1.9, 2.12, z0 + 0.02]);
  if (ck) {
    const r = 0.16 * camUnit(c, [1.9, 2.12, z0]);
    hardFill(p, 24140, T(PAL.clockRim), ell(ck[0], ck[1], r, r, 24));
    hardFill(p, 24141, T('#f6f2ea'), ell(ck[0], ck[1], r * 0.84, r * 0.84, 24));
    inkLine(p, 24142, [[ck[0], ck[1]], [ck[0] + r * 0.05, ck[1] - r * 0.6]], {closed: false, weight: 1.2});
    inkLine(p, 24143, [[ck[0], ck[1]], [ck[0] + r * 0.5, ck[1] + r * 0.1]], {closed: false, weight: 1.2});
  }
  // corkboard and a print on the +z wall (seen in the reverse)
  const ZW = z1 - 0.01;
  wFill(p, c, 24150, T('#6e5a44'), [[0.95, 1.15, ZW], [-0.25, 1.15, ZW], [-0.25, 1.9, ZW], [0.95, 1.9, ZW]]);
  wFill(p, c, 24151, T('#c49a68'), [[0.91, 1.19, ZW - 0.002], [-0.21, 1.19, ZW - 0.002], [-0.21, 1.86, ZW - 0.002], [0.91, 1.86, ZW - 0.002]]);
  [[0.75, 1.62, '#f3efe4'], [0.42, 1.7, '#f2e3a8'], [0.12, 1.5, '#f3efe4'], [0.55, 1.35, '#d9e6ef']].forEach(([x, y, col], i) =>
    wFill(p, c, 24152 + i, T(col as string), [[(x as number) + 0.1, (y as number) - 0.09, ZW - 0.004], [(x as number) - 0.1, (y as number) - 0.09, ZW - 0.004], [(x as number) - 0.1, (y as number) + 0.09, ZW - 0.004], [(x as number) + 0.1, (y as number) + 0.09, ZW - 0.004]]));
  wFill(p, c, 24160, T('#3d4248'), [[-0.75, 1.2, ZW], [-1.55, 1.2, ZW], [-1.55, 1.85, ZW], [-0.75, 1.85, ZW]]);
  wFill(p, c, 24161, T('#8fa6a0'), [[-0.8, 1.25, ZW - 0.002], [-1.5, 1.25, ZW - 0.002], [-1.5, 1.8, ZW - 0.002], [-0.8, 1.8, ZW - 0.002]]);
  wFill(p, c, 24162, T('#d8c48e'), [[-0.8, 1.25, ZW - 0.003], [-1.5, 1.25, ZW - 0.003], [-1.5, 1.42, ZW - 0.003], [-1.15, 1.5, ZW - 0.003], [-0.8, 1.38, ZW - 0.003]]);
};

/** Window sun (B01 `warm`): three pane patches on the carpet from the left-wall window, sun about 30 deg down, drifting +z. */
export const sunPatches = (): V3[][] => {
  const k = 1 / Math.tan((30 * Math.PI) / 180), drift = 0.35, y0 = 0.9, y1 = 2.1;
  const panes: [number, number][] = [[-1.58, -0.83], [-0.77, -0.03], [0.03, 0.78]];
  return panes.map(([a, b]) => [
    [-3 + y0 * k, 0.002, a + drift * y0 * k], [-3 + y0 * k, 0.002, b + drift * y0 * k],
    [Math.min(0.9, -3 + y1 * k), 0.002, b + drift * y1 * k], [Math.min(0.9, -3 + y1 * k), 0.002, a + drift * y1 * k],
  ] as V3[]);
};
export const paintSun = (p: Painter, c: YCam) => {
  // the lit carpet is its own warm colour (a sun glaze over the teal reads olive)
  sunPatches().forEach((q, i) => { wFill(p, c, 24170 + i, mixColor(PAL.carpet, PAL.sun, 0.55), q); wWash(p, c, 24180 + i, PAL.sun, 60, q, 0.15, 0.2); });
  // soft bounce on the left of the back wall
  wWash(p, c, 24175, PAL.sun, 45, qz(ROOM.z0 + 0.006, -3, -1.3, 0.2, 2.2), 0.4, 0.3);
};

/** Pot plant (est (-2.25, -2.10), 1.1 m; at the frame's left edge, behind extra E1). */
export const paintPlant = (p: Painter, c: YCam, light: Light) => {
  const T = (col: string) => setTone(col, light);
  const at: V3 = [-2.25, 0, -2.1];
  box(p, c, 24200, at[0] - 0.16, at[0] + 0.16, 0, 0.36, at[2] - 0.16, at[2] + 0.16, PAL.plantPot, light);
  const base = camPoint(c, [at[0], 0.36, at[2]]);
  if (!base) return;
  const u = camUnit(c, [at[0], 0.6, at[2]]);
  for (let i = 0; i < 9; i++) {
    const a = -Math.PI / 2 + (i - 4) * 0.28, L = (0.55 + 0.2 * Math.sin(i * 2.1)) * u;
    const tip: Pt = [base[0] + Math.cos(a) * L * 0.75, base[1] + Math.sin(a) * L];
    const mid: Pt = [(base[0] + tip[0]) / 2, (base[1] + tip[1]) / 2];
    const nx = -(tip[1] - base[1]) / L, ny = (tip[0] - base[0]) / L;
    const leaf: Pt[] = [base, [mid[0] + nx * 0.07 * u, mid[1] + ny * 0.07 * u], tip, [mid[0] - nx * 0.07 * u, mid[1] - ny * 0.07 * u]];
    hardFill(p, 24210 + i, T(i % 2 ? PAL.leaf : PAL.leafDark), leaf);
    inkLine(p, 24230 + i, leaf, {weight: 0.6, color: T(shade(PAL.leafDark, 0.3))});
  }
};

/** BOARD24 body: aluminium frame, face, the flip-window wells, header tabs and the "รวม" strip (text is DOM, `board-text.tsx`). */
export const paintBoard = (p: Painter, c: YCam, light: Light, o: {lit?: boolean} = {}) => {
  const T = (col: string) => setTone(col, light);
  const B = BOARD;
  const rect = (seed: number, col: string, r: R4, dz: number) => wFill(p, c, seed, col, boardQuad(r, dz));
  rect(24300, T(PAL.boardFrame), [B.body[0] - 0.03, B.body[1] + 0.03, B.body[2] - 0.03, B.body[3] + 0.03], 0);
  rect(24301, T(PAL.boardFace), B.body as unknown as R4, 0.002);
  rect(24302, T(PAL.tabYou), B.tabYou as unknown as R4, 0.004);
  rect(24303, T(PAL.tabRival), B.tabRival as unknown as R4, 0.004);
  for (const [i, w] of [B.winYou, B.winRival].entries()) {
    rect(24304 + i * 3, T('#8d9194'), [w[0] - 0.02, w[1] + 0.02, w[2] - 0.02, w[3] + 0.02], 0.004);
    rect(24305 + i * 3, T(PAL.flip), w as unknown as R4, 0.006);
    // the flip card's split line
    wInk(p, c, 24306 + i * 3, [[w[0], (w[2] + w[3]) / 2, BZ + 0.008], [w[1], (w[2] + w[3]) / 2, BZ + 0.008]], {closed: false, weight: 0.8, color: '#4a4b4e'});
  }
  rect(24311, T(mixColor(PAL.boardFrame, '#000000', 0.15)), [B.sum[0] - 0.015, B.sum[1] + 0.015, B.sum[2] - 0.015, B.sum[3] + 0.015], 0.004);
  rect(24312, o.lit ? PAL.sumLit : T(PAL.sum), B.sum as unknown as R4, 0.006);
  if (o.lit) {
    // the lit glow (<= 0.6): a soft warm halo around the strip
    const q = wp(c, boardQuad([B.sum[0] - 0.12, B.sum[1] + 0.12, B.sum[2] - 0.1, B.sum[3] + 0.1], 0.003));
    if (q.length > 2) washAt(p, 24313, '#ffd75e', 0.6 * 255 * 0.55, q, 0.5, 0.2);
    rect(24314, PAL.sumLit, B.sum as unknown as R4, 0.007);
  }
  // marker tray under the board
  box(p, c, 24320, B.body[0], B.body[1], B.body[2] - 0.08, B.body[2] - 0.05, BZ, BZ + 0.06, PAL.boardFrame, light);
};

/** Side table (round, bar height), the tent card (flap up before L05, down after), the tray and its payment. */
export const paintTable = (p: Painter, c: YCam, light: Light, o: {flapDown?: boolean; paid?: boolean} = {}) => {
  const T = (col: string) => setTone(col, light);
  const {c: tc, r, top} = TABLE;
  hardFill(p, 24400, T(shade(PAL.tableLeg, 0.2)), flatCircle(c, [tc[0], 0.005, tc[2]], 0.22));
  box(p, c, 24401, tc[0] - 0.03, tc[0] + 0.03, 0, top - 0.03, tc[2] - 0.03, tc[2] + 0.03, PAL.tableLeg, light);
  const rim = hull([...flatCircle(c, [tc[0], top, tc[2]], r), ...flatCircle(c, [tc[0], top - 0.035, tc[2]], r)]);
  hardFill(p, 24402, T(shade(PAL.table, 0.28)), rim);
  const topQ = flatCircle(c, [tc[0], top, tc[2]], r, 28);
  hardFill(p, 24403, T(PAL.table), topQ);
  inkLine(p, 24404, rim, {weight: 0.8, color: T(shade(PAL.table, 0.6))});
  paintCard(p, c, light, !!o.flapDown);
  paintTray(p, c, light, !!o.paid);
};

const paintCard = (p: Painter, c: YCam, light: Light, flapDown: boolean) => {
  const T = (col: string) => setTone(col, light);
  const back = [cardPoint(-0.5, 1, 0), cardPoint(0.5, 1, 0), cardPoint(0.5, 0, -0.08), cardPoint(-0.5, 0, -0.08)];
  wFill(p, c, 24410, T(PAL.flapBack), back);
  const face = [cardPoint(-0.5, 1), cardPoint(0.5, 1), cardPoint(0.5, 0), cardPoint(-0.5, 0)];
  const q = wFill(p, c, 24411, T(PAL.card), face);
  inkLine(p, 24412, q, {weight: 0.6, color: T('#8a857a')});
  const fh = CARD.flap / CARD.h;
  const flap = flapDown
    ? (() => { const {n} = cardAxes(); const a = cardPoint(-0.5, 0, 0.003), b = cardPoint(0.5, 0, 0.003); return [a, b, [b[0] + n[0] * CARD.flap, b[1] + 0.001, b[2] + n[2] * CARD.flap], [a[0] + n[0] * CARD.flap, a[1] + 0.001, a[2] + n[2] * CARD.flap]] as V3[]; })()
    : [cardPoint(-0.5, fh, 0.004), cardPoint(0.5, fh, 0.004), cardPoint(0.5, 0, 0.004), cardPoint(-0.5, 0, 0.004)];
  const fq = wFill(p, c, 24413, T(PAL.flapBack), flap);
  inkLine(p, 24414, fq, {weight: 0.6, color: T('#8a857a')});
};

/** NOTE24: the stylised red 100 (no portrait, no real design): red body, darker border, cream oval with a wave, "100" in ink strokes. */
export const paintNote = (p: Painter, seed: number, corners: Pt[], light: Light | 'none' = 'none') => {
  const T = (col: string) => (light === 'none' ? col : setTone(col, light));
  const [a, b, cc, d] = corners;
  const L = (u: number, v: number): Pt => {
    const top: Pt = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u], bot: Pt = [d[0] + (cc[0] - d[0]) * u, d[1] + (cc[1] - d[1]) * u];
    return [top[0] + (bot[0] - top[0]) * v, top[1] + (bot[1] - top[1]) * v];
  };
  hardFill(p, seed, T(PAL.noteShade), corners);
  hardFill(p, seed + 1, T(PAL.note), [L(0.04, 0.08), L(0.96, 0.08), L(0.96, 0.92), L(0.04, 0.92)]);
  const oval = Array.from({length: 16}, (_, i) => { const t = (i / 16) * 6.283; return L(0.68 + 0.17 * Math.cos(t), 0.5 + 0.3 * Math.sin(t)); });
  hardFill(p, seed + 2, T(PAL.noteOval), oval);
  inkLine(p, seed + 3, [L(0.56, 0.55), L(0.63, 0.45), L(0.7, 0.55), L(0.77, 0.45)], {closed: false, weight: 0.5, color: T('#c88a6a')});
  // "100" (the design's big numeral): 1 as a bar, two 0 as rings
  const w = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (w > 26) {
    const wt = Math.max(0.6, w / 70);
    inkLine(p, seed + 4, [L(0.13, 0.3), L(0.13, 0.7)], {closed: false, weight: wt, color: T(PAL.noteInk)});
    for (const [k, x] of [0.25, 0.39].entries()) inkLine(p, seed + 5 + k, Array.from({length: 10}, (_, i) => { const t = (i / 10) * 6.283; return L(x + 0.045 * Math.cos(t), 0.5 + 0.2 * Math.sin(t)); }), {weight: wt, color: T(PAL.noteInk)});
  }
  inkLine(p, seed + 8, corners, {weight: 0.6, color: T(INK)});
};
/** World rectangle of a note lying flat (centre, yaw deg, size 0.16 x 0.075 m) as picture corners. */
const flatNote = (c: YCam, at: V3, yaw: number): Pt[] | null => {
  const a = (yaw * Math.PI) / 180, w = 0.08, h = 0.0375, cs = Math.cos(a), sn = Math.sin(a);
  const q = [[-w, -h], [w, -h], [w, h], [-w, h]].map(([x, z]) => camPoint(c, [at[0] + x * cs - z * sn, at[1], at[2] + x * sn + z * cs]));
  return q.every(Boolean) ? (q as Pt[]) : null;
};

const paintTray = (p: Painter, c: YCam, light: Light, paid: boolean) => {
  const {c: t, w, d, h} = TRAY;
  box(p, c, 24430, t[0] - w / 2, t[0] + w / 2, t[1], t[1] + h, t[2] - d / 2, t[2] + d / 2, PAL.wood, light);
  wFill(p, c, 24436, setTone(shade(PAL.wood, 0.25), light), qy(t[1] + 0.012, t[0] - w / 2 + 0.015, t[0] + w / 2 - 0.015, t[2] - d / 2 + 0.015, t[2] + d / 2 - 0.015));
  if (!paid) return;
  // 215 paid in: two red notes (110 and 105) fanned, coins beside them
  const n1 = flatNote(c, [t[0] - 0.035, t[1] + 0.016, t[2] + 0.01], -8), n2 = flatNote(c, [t[0] - 0.02, t[1] + 0.02, t[2] - 0.02], 14);
  if (n1) paintNote(p, 24440, n1);
  if (n2) paintNote(p, 24450, n2);
  paintCoins(p, c, [t[0] + 0.09, t[1] + 0.014, t[2] + 0.04], 3, 0.05, 24460);
  paintCoins(p, c, [t[0] + 0.1, t[1] + 0.014, t[2] - 0.05], 2, 0.05, 24480);
};

/** Plain four-leg chair under a seated bidder, facing -z (user, 2026-11-17: "เก้าอี้เป็น 4 ขาธรรมดา"; replaces the office chair of v1-v2):
 *  `part` 'under' (four legs and the seat) or 'back' (two back posts and two rails at +z, behind the sitter). Seat 0.42 x 0.40 m at the kit
 *  seated height `seatV` (`chairSpec`), wood as the kit `drawChair`. From behind (yaw 0) 'back' is painted after the figure, from the front before. */
export const paintPlainChair = (p: Painter, c: YCam, at: V3, seatV: number, part: 'under' | 'back', light: Light, seed: number, color?: string) => {
  const [x, , z] = at, wood = color ?? PAL.chairWood, hw = 0.21, d0 = z - 0.2, d1 = z + 0.2, lw = 0.035;
  const leg = (k: number, lx: number, lz: number, y1: number) => box(p, c, seed + k * 6, lx - lw / 2, lx + lw / 2, 0, y1, lz - lw / 2, lz + lw / 2, wood, light);
  if (part === 'under') {
    // far legs first (the camera's far side), then the seat, then the near legs
    const legs: [number, number][] = [[x - hw + 0.02, d0 + 0.02], [x + hw - 0.02, d0 + 0.02], [x - hw + 0.02, d1 - 0.02], [x + hw - 0.02, d1 - 0.02]];
    const far = (lz: number) => Math.abs(lz - c.z);
    legs.sort((a, b) => far(b[1]) - far(a[1]));
    legs.slice(0, 2).forEach(([lx, lz], k) => leg(k, lx, lz, seatV - 0.03));
    box(p, c, seed + 30, x - hw, x + hw, seatV - 0.035, seatV, d0, d1, wood, light);
    legs.slice(2).forEach(([lx, lz], k) => leg(k + 2, lx, lz, seatV - 0.03));
    return;
  }
  const zb = d1 - 0.02;
  for (const [k, sx] of [-1, 1].entries()) box(p, c, seed + 40 + k * 6, x + sx * (hw - 0.02) - lw / 2, x + sx * (hw - 0.02) + lw / 2, seatV, seatV + 0.4, zb - lw / 2, zb + lw / 2, wood, light);
  box(p, c, seed + 60, x - hw + 0.005, x + hw - 0.005, seatV + 0.3, seatV + 0.4, zb - 0.012, zb + 0.012, wood, light);
  box(p, c, seed + 66, x - hw + 0.02, x + hw - 0.02, seatV + 0.14, seatV + 0.18, zb - 0.01, zb + 0.01, wood, light);
};
