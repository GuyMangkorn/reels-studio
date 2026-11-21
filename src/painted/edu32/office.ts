import {hardFill, inkLine} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {hull, qy, qz, wFill, wInk, wWash} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {ANIMALS} from '../kit/animals';
import {CAT_SCALE, POSTER, paintCatCard, paintRealCat} from './cast';
import {LAMP, paintLampBase, paintLampPool, paintNearDressing, paintRoom} from './desk';
import {lead, type LookDef} from './looks';

// EDU-EP32-SHORT Space D real dressing (EDU-EP32-BRIEF-R2 VD32-23, set plan "Real dressing for B05-B06"; Boss W3 gate LF04, 2026-11-21).
// The same desk, lamp and units as the paper set (desk.ts: model metres at 10:1, origin = desk top at the lamp hot spot) painted as a real office
// at night: navy wall with the window and venetian blinds, walnut desk with its front and knee hole, brass lamp with its shade, the felt blotter,
// the memo MM as a real sheet (its text and the stamp are camera-mapped DOM, office-text.tsx), the real CAT x16 asleep across its left edge.
// LF04 = B06-SH02 key state; LF04-REF = B01-SH03 key state (paper hero cat x4 on page BP), the mirror the gate overlays (VD32-24).

const DEG = Math.PI / 180;
const NAVY = '#1e2838', NAVY_DEEP = '#151c2a', WALNUT = POSTER.walnut;

/** Memo MM (VD32-12, set plan): 2.10 x 2.97 at the origin, yaw +8 deg, lying on the blotter. Page-local x right, z down the page (toward the lens). */
export const MEMO = {w: 2.1, h: 2.97, yaw: 8 * DEG, y: 0.03} as const;
export const memoPt = (x: number, z: number, y: number = MEMO.y): V3 => {
  const cs = Math.cos(MEMO.yaw), sn = Math.sin(MEMO.yaw);
  return [x * cs - z * sn, y, z * cs + x * sn];
};
/** Stamp imprint on the memo (VD32-12 R2): centre page-local (+0.45, +0.2), rot -8 deg, 1.0 x 0.44 model m (10 x 4.4 cm, a large office stamp). */
export const MEMO_STAMP = {x: 0.45, z: 0.2, w: 1.0, h: 0.44, rot: -8} as const;
/** B06-SH02 cat (storyboard): body centre (-2.0, 0, -0.1), curled asleep facing screen-left = the cat-polish loaf with the lids shut. */
export const CAT_DESK: V3 = [-2.0, MEMO.y, -0.1];
export const CAT_SLEEP = {view: 'left', state: 'lie', loaf: 1, lid: 1} as const;

/** Picture outline (px) of the sleeping cat's body for DOM text occlusion: the memo text is DOM over the BrushCanvas, so the overlay cuts this hole
 *  where the cat lies on the page. Contour in cat heights (`len` = model height x px per m) about the ground point, measured from the LF04-CAT mask
 *  (2026-11-21: dense bbox x -0.63..+0.68 len, belly on the ground line, rump curving up from +0.55). Valid for CAT_SLEEP in profile. */
const CAT_SLEEP_HOLE: [number, number][] = [[-0.66, -1.1], [0.71, -1.1], [0.71, -0.16], [0.67, -0.07], [0.6, -0.02], [0.52, 0.012], [-0.46, 0.012], [-0.47, -0.3], [-0.66, -0.36]];
export const catHole = (c: YCam): Pt[] | null => {
  const g = camPoint(c, CAT_DESK);
  if (!g) return null;
  const len = ANIMALS['cat-gray-tabby'].height * CAT_SCALE.deskReal * camUnit(c, CAT_DESK);
  return CAT_SLEEP_HOLE.map(([u, v]): Pt => [g[0] + u * len, g[1] + v * len]);
};

/** Night wall (navy) with the lamp's warm spill, the window with venetian blinds (x -12..-4, y 3..12) and its sill. */
const paintOfficeWall = (p: Painter, c: YCam) => {
  wFill(p, c, 36001, NAVY, qz(-4.6, -40, 40, -8, 40));
  // window: frame, night glass, blinds slats (lit faintly from the lamp side, x > -6 warmer), the cord
  wFill(p, c, 36010, '#2a3346', qz(-4.59, -12.3, -3.7, 2.7, 12.3));
  wFill(p, c, 36011, '#14223c', qz(-4.585, -12, -4, 3, 12));
  wWash(p, c, 36012, '#2c4670', 60, qz(-4.584, -12, -4, 3, 6.5), 0.3, 0.4);
  for (let i = 0; i < 19; i++) {
    const y = 3.25 + i * 0.47, warm = 0.12 + 0.1 * (i < 8 ? 1 : 0);
    const col = mixColor('#46546c', '#8a6a4e', warm);
    wFill(p, c, 36020 + i, col, qz(-4.58, -11.95, -4.05, y, y + 0.26));
    wInk(p, c, 36060 + i, [[-11.95, y + 0.26, -4.578], [-4.05, y + 0.26, -4.578]], {color: mixColor(col, '#e8d4b4', 0.25), weight: 0.6, closed: false});
  }
  wInk(p, c, 36090, [[-4.5, 12, -4.57], [-4.5, 4.2, -4.57]], {color: '#8a8c90', weight: 0.6, closed: false});
  wFill(p, c, 36091, '#323c52', qz(-4.5, -12.5, -3.5, 2.55, 2.8));
  // the lamp's warm spill on the wall behind the shade (navy kept at the rim, never black)
  for (const [k, r, col, op] of [[0, 5.2, '#3a3c48', 70], [1, 3.6, '#4e4440', 70], [2, 2.4, '#66523e', 60], [3, 1.4, '#7a6044', 50]] as const)
    wWash(p, c, 36100 + k, col, op, Array.from({length: 28}, (_, i): V3 => [-1.6 + r * 1.4 * Math.cos((i / 28) * 6.283), 2.4 + r * 0.9 * Math.sin((i / 28) * 6.283), -4.57]), 0.15, 0.2);
};

/** Walnut desk at full scale: top (x -7.5..7.5, z -4.5..3.0, y 0) with grain, worn front edge, apron, left pedestal drawers and the knee hole. */
const paintOfficeDesk = (p: Painter, c: YCam) => {
  // under the desk: the floor and the knee hole in deep navy (lit only by the room fill), then the desk front over it
  wFill(p, c, 36200, NAVY_DEEP, qy(-7.5, -30, 30, -4.6, 12));
  wWash(p, c, 36201, '#24304a', 60, qy(-7.49, -10, 10, -4.0, 4.5), 0.3, 0.5);
  wFill(p, c, 36202, '#24180f', qz(-4.0, -3.0, 3.0, -7.5, -0.9));
  wFill(p, c, 36203, mixColor(WALNUT, '#0e0a08', 0.55), [[3.0, -0.9, 3.0], [3.0, -0.9, -4.0], [3.0, -7.5, -4.0], [3.0, -7.5, 3.0]]);
  // left pedestal front with three drawers and brass pulls; apron with the centre drawer
  wFill(p, c, 36210, mixColor(WALNUT, '#140c08', 0.38), qz(3.0, -7.5, -3.0, -7.5, -0.9));
  for (let k = 0; k < 3; k++) {
    const y1 = -1.1 - k * 2.1, y0 = y1 - 1.9;
    const d = qz(3.001, -7.3, -3.2, y0, y1);
    wFill(p, c, 36211 + k, mixColor(WALNUT, '#140c08', 0.28), d);
    wInk(p, c, 36215 + k, d, {color: '#1a100a', weight: 0.7});
    wFill(p, c, 36219 + k, '#a8823a', qz(3.002, -5.6, -4.9, (y0 + y1) / 2 - 0.12, (y0 + y1) / 2 + 0.12));
  }
  wFill(p, c, 36230, mixColor(WALNUT, '#140c08', 0.3), qz(3.0, -7.5, 7.5, -0.9, -0.12));
  wInk(p, c, 36231, [[-3.0, -0.6, 3.001], [3.0, -0.6, 3.001]], {color: '#1a100a', weight: 0.6, closed: false});
  wFill(p, c, 36232, '#a8823a', qz(3.002, -0.5, 0.5, -0.42, -0.3));
  // top: walnut, grain running along x, a warm worn front edge (the rounded lip catches the lamp)
  wFill(p, c, 36240, WALNUT, qy(0, -7.5, 7.5, -4.5, 3.0));
  wFill(p, c, 36241, mixColor(WALNUT, '#120a06', 0.45), qz(-4.5, -7.5, 7.5, 0, 0.06));
  for (let i = 0; i < 34; i++) {
    const z = -4.3 + i * 0.215 + 0.1 * hash(36300 + i), x0 = -7.4 + 3 * hash(36340 + i), x1 = x0 + 2.5 + 6 * hash(36380 + i);
    wInk(p, c, 36420 + i, [[x0, 0.001, z], [(x0 + x1) / 2, 0.001, z + 0.06 * (hash(36460 + i) - 0.5)], [x1, 0.001, z + 0.04 * (hash(36500 + i) - 0.5)]],
      {color: mixColor(WALNUT, i % 3 ? '#1e120a' : '#8a6040', 0.35), weight: 0.6, closed: false});
  }
  wFill(p, c, 36540, mixColor(WALNUT, '#c89a68', 0.22), qz(3.0, -7.5, 7.5, -0.12, 0));
  wInk(p, c, 36541, [[-7.5, 0.0, 3.0], [7.5, 0.0, 3.0]], {color: '#c9a070', weight: 0.8, closed: false});
  // felt blotter with leather corners (the paper set's numbers)
  wFill(p, c, 36550, '#3a5040', qy(0.01, -3.5, 3.5, -2.4, 2.2));
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    const x = 3.5 * sx, z = sz < 0 ? -2.4 : 2.2;
    wFill(p, c, 36560 + sx + 2 * sz + 3, '#3a2418', [[x, 0.012, z], [x - 0.7 * sx, 0.012, z], [x, 0.012, z - 0.7 * sz]]);
  }
};

/** Brass dome shade at LAMP aimed at the origin: the outside, the warm inside glow and a diffuser disc (no bare bulb; UT02 keeps the cat first). */
const paintLampShade = (p: Painter, c: YCam) => {
  const a: V3 = [-LAMP[0], -LAMP[1], -LAMP[2]], al = Math.hypot(...a), ax: V3 = [a[0] / al, a[1] / al, a[2] / al];
  const e1n = Math.hypot(ax[2], ax[0]), e1: V3 = [ax[2] / e1n, 0, -ax[0] / e1n];
  const e2: V3 = [ax[1] * e1[2] - ax[2] * e1[1], ax[2] * e1[0] - ax[0] * e1[2], ax[0] * e1[1] - ax[1] * e1[0]];
  const ring = (off: number, r: number, n = 28) => Array.from({length: n}, (_, i): V3 => {
    const t = (i / n) * 6.283;
    return [LAMP[0] + ax[0] * off + r * (Math.cos(t) * e1[0] + Math.sin(t) * e2[0]), LAMP[1] + ax[1] * off + r * (Math.cos(t) * e1[1] + Math.sin(t) * e2[1]), LAMP[2] + ax[2] * off + r * (Math.cos(t) * e1[2] + Math.sin(t) * e2[2])];
  });
  const pic = (vs: V3[]) => vs.map((v) => camPoint(c, v)).filter(Boolean) as Pt[];
  const rim = pic(ring(0.35, 0.85)), mid = pic(ring(-0.1, 0.66)), back = pic(ring(-0.42, 0.3));
  if (rim.length < 20) return;
  hardFill(p, 36600, '#5a4420', hull([...rim, ...mid, ...back]));
  hardFill(p, 36601, '#7a5c28', hull([...mid, ...back]).map(([x, y]): Pt => [x - 4, y - 3]));
  hardFill(p, 36602, '#e8b868', rim);
  hardFill(p, 36603, '#ffd890', pic(ring(0.3, 0.62)));
  hardFill(p, 36604, '#fff0c8', pic(ring(0.25, 0.36)));
  inkLine(p, 36605, rim, {color: '#c8a050', weight: 1.1, still: true, curve: 0.2});
};

/** The memo sheet: soft contact shadow, off-white paper with a slight lift at the lower right corner and fibres (text and stamp are DOM). */
const paintMemoSheet = (p: Painter, c: YCam) => {
  const W = MEMO.w / 2, H = MEMO.h / 2;
  wWash(p, c, 36700, '#120c08', 90, [memoPt(-W + 0.05, -H + 0.06, 0.02), memoPt(W + 0.08, -H + 0.06, 0.02), memoPt(W + 0.08, H + 0.08, 0.02), memoPt(-W + 0.05, H + 0.08, 0.02)], 0.05, 0.1);
  wFill(p, c, 36701, '#e9e3d3', [memoPt(-W, -H), memoPt(W, -H), memoPt(W, H - 0.25), memoPt(W - 0.22, H, MEMO.y + 0.02), memoPt(-W, H)]);
  wFill(p, c, 36702, '#d6cfbd', [memoPt(W, H - 0.25), memoPt(W - 0.22, H, MEMO.y + 0.02), memoPt(W - 0.05, H - 0.05, MEMO.y + 0.03)]);
  for (let i = 0; i < 40; i++) {
    const x = -W + 2 * W * hash(36710 + i), z = -H + 2 * H * hash(36760 + i), an = 6.283 * hash(36810 + i), l = 0.02 + 0.04 * hash(36860 + i);
    wInk(p, c, 36900 + i, [memoPt(x, z, MEMO.y + 0.001), memoPt(x + l * Math.cos(an), z + l * Math.sin(an), MEMO.y + 0.001)], {color: '#b8ae98', weight: 0.4, closed: false});
  }
};

/** Space D real at the B06-SH02 key state: room, desk, lamp, memo in the pool, pencil, the sleeping cat. `catOnly` = mask pass (QA bounding box). */
export const paintOfficeB06 = (p: Painter, c: YCam, id: string, t: number, catOnly = false) => {
  if (!catOnly) {
    paintOfficeWall(p, c);
    paintOfficeDesk(p, c);
    paintLampBase(p, c);
    paintMemoSheet(p, c);
    paintLampPool(p, c, 0.035);
    paintNearDressing(p, c, [-0.9, 2.45], [1.0, 2.62]);
    paintLampShade(p, c);
  }
  const cat = paintRealCat(p, c, {at: CAT_DESK, t, pose: CAT_SLEEP, scale: CAT_SCALE.deskReal, ground: '#1a100a', fleck: catOnly ? 0 : 0.9});
  if (cat) lead(id, 'CAT real x16 (curled asleep)', cat);
};

/** B01-SH03 key state (mirror reference, VD32-24): the paper desk, a plain blueprint sheet BP at the origin and the hero paper cat x4 lying in profile
 *  at (+0.3, 0, -0.2), eyes open. Reference only (LF01/B01 plates are not built); the cat card and the camera are the parts the gate compares. */
export const paintB01Ref = (p: Painter, c: YCam, id: string, t: number, catOnly = false) => {
  if (!catOnly) {
    paintRoom(p, c);
    paintLampBase(p, c);
    wFill(p, c, 36950, '#2f6f9e', qy(0.013, -1.05, 1.05, -1.485, 1.485));
    for (let i = 1; i < 14; i++) wInk(p, c, 36960 + i, [[-1.05, 0.014, -1.485 + i * 0.212], [1.05, 0.014, -1.485 + i * 0.212]], {color: '#9cc4e4', weight: 0.4, closed: false});
    for (let i = 1; i < 10; i++) wInk(p, c, 36980 + i, [[-1.05 + i * 0.21, 0.014, -1.485], [-1.05 + i * 0.21, 0.014, 1.485]], {color: '#9cc4e4', weight: 0.4, closed: false});
    paintLampPool(p, c);
  }
  const cat = paintCatCard(p, c, {at: [0.3, 0.014, -0.2], scale: CAT_SCALE.hero, t, light: LAMP, pose: {view: 'left', state: 'lie', loaf: 1}});
  if (cat) lead(id, 'CAT paper hero x4 (lie)', cat);
};

/** B06-SH02 key camera = B01-SH03's end key relative to its cat x4 (storyboard: eye (-2.0, 2.0, +5.7), yaw +3, pitch -2, f 900, hy 460). */
export const CAM_B06_KEY: YCam = {x: -2.0, y: 2.0, z: 5.7, yaw: 3 * DEG, pitch: -2 * DEG, f: 900, hy: 460};
/** B01-SH03 end key (storyboard R2, hy 460): eye (+0.3, 0.5, +1.25), yaw +3, pitch -2, f 900. */
export const CAM_B01_KEY: YCam = {x: 0.3, y: 0.5, z: 1.25, yaw: 3 * DEG, pitch: -2 * DEG, f: 900, hy: 460};

const MASK = '#20c020';
export const OFFICE_LOOKS: Record<string, () => LookDef> = {
  LF04: () => ({shot: 'B06-SH02', cam: CAM_B06_KEY, t: 2.0, paper: NAVY, caption: 'ตัวที่เรียกแล้วไม่เคยมาน่ะแหละ', paint: (p) => paintOfficeB06(p, CAM_B06_KEY, 'LF04', 2.0)}),
  'LF04-REF': () => ({shot: 'B01-SH03', cam: CAM_B01_KEY, t: 2.0, paper: '#2c2630', caption: 'ตัวที่เรียกแล้วไม่เคยมาน่ะแหละ', paint: (p) => paintB01Ref(p, CAM_B01_KEY, 'LF04-REF', 2.0)}),
  // QA masks (render with CAPTION=0): the cat alone on a flat key colour, for the pixel bounding-box overlay check
  'LF04-CAT': () => ({shot: 'QA', cam: CAM_B06_KEY, t: 2.0, paper: MASK, paint: (p) => paintOfficeB06(p, CAM_B06_KEY, 'LF04-CAT', 2.0, true)}),
  'LF04-MASK-EMPTY': () => ({shot: 'QA', cam: CAM_B06_KEY, t: 2.0, paper: MASK, paint: () => undefined}),
  'LF04-REF-CAT': () => ({shot: 'QA', cam: CAM_B01_KEY, t: 2.0, paper: MASK, paint: (p) => paintB01Ref(p, CAM_B01_KEY, 'LF04-REF-CAT', 2.0, true)}),
};

/** G7 (Boss W5.2, 2026-11-21; additive): the LF04 set without the cat, for shot files that paint their own cat on top (B06-SH02 ear flick,
 *  B06-SH03 insert). `pool` replaces the default lamp pool (G7 paints a smoother, warmer pool there: LF04 rings and greenish cast). */
export const paintOfficeSet = (p: Painter, c: YCam, pool: (p: Painter, c: YCam) => void = (q, cc) => paintLampPool(q, cc, 0.035)) => {
  paintOfficeWall(p, c);
  paintOfficeDesk(p, c);
  paintLampBase(p, c);
  paintMemoSheet(p, c);
  pool(p, c);
  paintNearDressing(p, c, [-0.9, 2.45], [1.0, 2.62]);
  paintLampShade(p, c);
};

/** G6 (Boss W5.2, 2026-11-21; additive): the set's parts for B05-SH01's wide room view, which adds dressing between them (b05-set.ts). */
export {paintOfficeWall, paintOfficeDesk, paintMemoSheet, paintLampShade};
