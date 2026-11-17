import {ell, hardFill, inkLine} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {paintBox, paintSorted, qx, qy, qz, wFill, wInk, wp, hull, type Item} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {HALL, TABLE} from './palette';
import {paintLidBowl, paintSaucer, paintSpoon} from './tableware';

// SET-HALL22 (EDU-EP22-BRIEF-R1 set plan, space H, metres, est): one Qing palace hall interior, a reconstruction, not a named hall. Origin on the
// floor under the centre of the child's table CT; +x screen-right from the open-hall side, +y up, +z toward the open doors (the camera side).
// Grey square floor bricks (0.64 m grid), red lacquer columns, white paper lattice windows in late-morning light (key from the right wall),
// a carved wooden screen behind the child's seat, the dowager's-side doorway on the right wall, blank scrolls on the left wall.
// Two tables: the long table LT far to screen-left (28 lidded bowls under silver covers) and the child's table CT in front of his armchair.
// Built new for EP22 (no plate fits); the EP09 dining method (`edu09/dining.ts`) is the model: back pass, then depth-sorted items.

export type HallLight = {
  /** 0..1 warmth of the window light and the floor pools (B05 runs warmer). */
  warm?: number;
  /** Window-light strength 0..1.5 (beam glazes, lit sides). */
  key?: number;
  /** Overall value lift 0..1 toward the window glow (a lighter, lower-contrast hall). */
  lift?: number;
};
const L0 = {warm: 0.4, key: 1, lift: 0} as const;
const lit = (L: HallLight) => ({...L0, ...L});

const SHELL = {x0: -5.2, x1: 5.2, z0: -4.2, z1: 4.2, h: 5.5};
/** W5.1 (scene sheet: SH19 end camera at z +5.26, beyond the z +4.2 shell): the near wall is never drawn, and the floor, the side walls and the
 *  ceiling run on to z +6.5 so a camera outside the shell still sees a continuous hall (the room reads longer toward the doors). */
const NZ = 6.5;
const BRICK = 0.64;
/** Long table LT and child's table CT (set plan). */
export const LT = {x0: -4.05, x1: -3.15, z0: -3.0, z1: 2.4, y: 0.82};
export const CT = {x0: -0.6, x1: 0.6, z0: -0.45, z1: 0.45, y: 0.66};
/** The 28 long-table bowls LT-A01..A14 (x -3.35) and LT-B01..B14 (x -3.85), z +2.04 -> -2.64 at 0.36 m pitch (storyboard prop IDs). */
export const LT_BOWLS: {id: string; at: V3}[] = (['A', 'B'] as const).flatMap((row) =>
  Array.from({length: 14}, (_, i) => ({id: `LT-${row}${String(i + 1).padStart(2, '0')}`, at: [row === 'A' ? -3.35 : -3.85, LT.y, 2.04 - i * 0.36] as V3})));
/** Child seat (armchair) and his hips (set plan). */
export const SEAT = {chair: [0, 0, -0.75] as V3, seatY: 0.5, cushionY: 0.62, hips: [0, 0.62, -0.72] as V3};

const tone = (c: string, L: HallLight) => { const l = lit(L); return l.lift ? mixColor(c, HALL.winGlow, 0.18 * l.lift) : c; };

/** Floor, walls, windows, screen, doorway, scrolls and columns: everything that stands behind the tables and the cast. */
export const paintHallBack = (p: Painter, c: YCam, L: HallLight = {}) => {
  const l = lit(L), key = mixColor(HALL.key, '#ffd08a', l.warm * 0.5);
  hardFill(p, 22000, tone(HALL.plaster, L), [[-300, -300], [1380, -300], [1380, 2220], [-300, 2220]]);
  // ceiling (dark beams; only seen from high cameras)
  wFill(p, c, 22001, mixColor(HALL.beam, HALL.shadow, 0.3), qy(SHELL.h, SHELL.x0, SHELL.x1, SHELL.z0, NZ));
  // W5.1 (SH19 crane: "ceiling beams at the top"): five cross beams under the ceiling (bottom face and the side toward the camera)
  for (let i = 0; i < 6; i++) {
    const z = -3.2 + i * 1.8, y = SHELL.h - 0.28;
    wFill(p, c, 22002 + i, tone(HALL.beam, L), qy(y, SHELL.x0, SHELL.x1, z - 0.14, z + 0.14));
    wFill(p, c, 22140 + i, tone(mixColor(HALL.beam, HALL.shadow, 0.45), L), qz(z + (c.z > z ? 0.14 : -0.14), SHELL.x0, SHELL.x1, y, SHELL.h));
  }
  // walls: back (z0), left (x0), right (x1); plaster with a darker dado and soft streaks (UT12)
  const wall = (seed: number, pts: V3[], shade: number) => wFill(p, c, seed, tone(mixColor(HALL.plaster, HALL.plasterDeep, shade), L), pts);
  wall(22010, qz(SHELL.z0, SHELL.x0, SHELL.x1, 0, SHELL.h), 0.12);
  wall(22011, qx(SHELL.x0, 0, SHELL.h, SHELL.z0, NZ), 0.32);
  wall(22012, qx(SHELL.x1, 0, SHELL.h, SHELL.z0, NZ), 0.05);
  wFill(p, c, 22013, tone(HALL.colShade, L), qz(SHELL.z0 + 0.002, SHELL.x0, SHELL.x1, 0, 0.9));
  wFill(p, c, 22014, tone(mixColor(HALL.colShade, HALL.shadow, 0.3), L), qx(SHELL.x0 + 0.002, 0, 0.9, SHELL.z0, NZ));
  wFill(p, c, 22015, tone(HALL.colShade, L), qx(SHELL.x1 - 0.002, 0, 0.9, SHELL.z0, NZ));
  // a red-lacquer beam band under the ceiling on each wall
  wFill(p, c, 22016, tone(HALL.col, L), qz(SHELL.z0 + 0.003, SHELL.x0, SHELL.x1, 4.3, 4.75));
  wFill(p, c, 22017, tone(HALL.colShade, L), qx(SHELL.x0 + 0.003, 4.3, 4.75, SHELL.z0, NZ));
  wFill(p, c, 22018, tone(HALL.gold, L), qz(SHELL.z0 + 0.004, SHELL.x0, SHELL.x1, 4.27, 4.31));
  for (let i = 0; i < 9; i++) {
    const z = SHELL.z0 + 0.6 + i * 0.9, y0 = 1.1 + (i % 3) * 0.4;
    wFill(p.layer(0.08, 22100 + i), c, 22020 + i, i % 2 ? HALL.plasterShade : '#efe2c6', qx(SHELL.x0 + 0.003, y0, y0 + 1.6 + (i % 2) * 0.6, z, z + 0.12 + (i % 3) * 0.06));
    const x = SHELL.x0 + 0.5 + i * 1.15;
    wFill(p.layer(0.07, 22120 + i), c, 22030 + i, i % 2 ? HALL.plasterShade : '#efe2c6', qz(SHELL.z0 + 0.003, x, x + 0.1 + (i % 3) * 0.05, y0, y0 + 1.8));
  }
  // floor: flat brick wash, a few bricks a shade off, then straight joints (flat underlayer: DF-20261030-painted-straight-bars)
  wFill(p, c, 22040, tone(HALL.brick, L), qy(0, SHELL.x0, SHELL.x1, SHELL.z0, NZ));
  for (let i = 0; i < 26; i++) {
    const bx = Math.floor(((i * 37) % 16)) - 8, bz = Math.floor(((i * 53) % 13)) - 7, x = bx * BRICK, z = bz * BRICK;
    wFill(p.layer(0.5, 22200 + i), c, 22050 + i, i % 3 ? mixColor(HALL.brick, HALL.joint, 0.35) : HALL.sheen, qy(0.001, x + 0.02, x + BRICK - 0.02, z + 0.02, z + BRICK - 0.02));
  }
  for (let i = -8; i <= 8; i++) wInk(p, c, 22300 + i + 8, [[i * BRICK, 0.002, SHELL.z0], [i * BRICK, 0.002, NZ]], {closed: false, weight: 0.8, color: HALL.joint});
  for (let k = -6; k <= 10; k++) wInk(p, c, 22320 + k + 6, [[SHELL.x0, 0.002, k * BRICK], [SHELL.x1, 0.002, k * BRICK]], {closed: false, weight: 0.8, color: HALL.joint});
  // back windows (paper lattice) and the light they throw on the floor
  for (const [x0, x1] of [[-4.6, -2.2], [2.2, 4.6]] as [number, number][]) paintLatticeZ(p, c, 22400 + (x0 < 0 ? 0 : 40), SHELL.z0 + 0.01, x0, x1, 0.9, 3.2, l.key);
  // right wall: the key windows (z +0.6..+3.6) and the dowager's-side doorway (z -1.6..-0.4), warm and bright
  paintLatticeX(p, c, 22500, SHELL.x1 - 0.01, 0.6, 3.6, 0.9, 3.2, l.key);
  wFill(p, c, 22540, mixColor(HALL.door, key, 0.3), qx(SHELL.x1 - 0.012, 0, 2.6, -1.6, -0.4));
  wFill(p.layer(0.6, 22541), c, 22542, HALL.doorDeep, qx(SHELL.x1 - 0.013, 0, 1.1, -1.5, -0.5));
  wFill(p, c, 22543, tone(HALL.col, L), qx(SHELL.x1 - 0.014, 2.6, 2.75, -1.75, -0.25));
  wFill(p, c, 22544, tone(HALL.col, L), qx(SHELL.x1 - 0.014, 0, 2.75, -1.75, -1.6));
  wFill(p, c, 22545, tone(HALL.col, L), qx(SHELL.x1 - 0.014, 0, 2.75, -0.4, -0.25));
  // light on the floor: back-window pools and the right-window beams (glazes <= 0.3; brief VD04)
  const pool = (seed: number, pts: V3[], op: number) => wFill(p.layer(Math.min(0.3, op * l.key), seed * 3), c, seed, key, pts);
  pool(22600, [[-4.6, 0.003, -4.2], [-2.2, 0.003, -4.2], [-1.6, 0.003, -2.6], [-4.2, 0.003, -2.6]], 0.22);
  pool(22601, [[2.2, 0.003, -4.2], [4.6, 0.003, -4.2], [4.4, 0.003, -2.6], [1.8, 0.003, -2.6]], 0.22);
  pool(22602, [[5.2, 0.003, 0.6], [5.2, 0.003, 3.6], [0.6, 0.003, 4.2], [0.9, 0.003, 1.2]], 0.26);
  pool(22603, [[5.2, 0.003, -1.6], [5.2, 0.003, -0.4], [3.4, 0.003, -0.2], [3.2, 0.003, -1.4]], 0.3);
  // carved wooden screen behind the child's seat (x -1.6..1.6, h 2.6): frame, panels, an abstract gold line pattern (no dragons)
  const Z = SHELL.z0 + 0.06;
  paintBox(p, c, 22700, {x0: -1.6, x1: 1.6, y0: 0, y1: 2.6, z0: SHELL.z0 + 0.02, z1: Z}, tone(HALL.wood, L), {}, {ink: true});
  wFill(p, c, 22710, tone(HALL.woodDark, L), qz(Z + 0.002, -1.6, 1.6, 2.45, 2.6));
  wFill(p, c, 22711, tone(HALL.woodDark, L), qz(Z + 0.002, -1.6, 1.6, 0, 0.22));
  for (let k = 0; k < 3; k++) {
    const x0 = -1.5 + k * 1.02, x1 = x0 + 0.94;
    wFill(p, c, 22720 + k, tone(mixColor(HALL.wood, HALL.woodDark, 0.4), L), qz(Z + 0.003, x0, x1, 0.32, 2.36));
    wInk(p, c, 22730 + k, qz(Z + 0.004, x0 + 0.06, x1 - 0.06, 0.38, 2.3), {color: HALL.gold, weight: 1.0});
    wInk(p, c, 22740 + k, qz(Z + 0.004, x0 + 0.16, x1 - 0.16, 0.5, 2.18), {color: HALL.gold, weight: 0.8});
    // a stepped meander in the middle of each panel (abstract, reads as carving at a glance)
    const mx = (x0 + x1) / 2, my = 1.35;
    wInk(p, c, 22750 + k, [[mx - 0.22, my - 0.3, Z + 0.004], [mx - 0.22, my + 0.3, Z + 0.004], [mx + 0.22, my + 0.3, Z + 0.004], [mx + 0.22, my - 0.18, Z + 0.004], [mx - 0.1, my - 0.18, Z + 0.004], [mx - 0.1, my + 0.18, Z + 0.004], [mx + 0.1, my + 0.18, Z + 0.004]], {closed: false, color: HALL.gold, weight: 0.9});
  }
  // left wall: two blank hanging scrolls (no text)
  for (const [z, s] of [[-1.9, 22800], [0.9, 22820]] as [number, number][]) {
    wFill(p, c, s, tone(HALL.scroll, L), qx(SHELL.x0 + 0.02, 1.2, 3.1, z - 0.32, z + 0.32));
    wFill(p.layer(0.25, s + 1), c, s + 1, HALL.plasterShade, qx(SHELL.x0 + 0.021, 1.3, 3.0, z - 0.26, z + 0.26));
    wFill(p, c, s + 2, HALL.scrollRod, qx(SHELL.x0 + 0.022, 3.1, 3.16, z - 0.36, z + 0.36));
    wFill(p, c, s + 3, HALL.scrollRod, qx(SHELL.x0 + 0.022, 1.15, 1.2, z - 0.36, z + 0.36));
  }
  paintHallWear(p, c, L);
};

/** Finished-grade surface wear (W3.1 look frames, UT12/UT12a): grime under the beam band and along the wall bases, a few plaster cracks, a worn
 *  sheen path across the floor from the doors to the seat, chipped and cracked bricks, wood grain on the screen panels. Every mark sits at the
 *  value of its surface (glazes <= 0.25, ink a step off the surface colour), so the set stays under the cast. Deterministic integer patterns. */
const paintHallWear = (p: Painter, c: YCam, L: HallLight) => {
  const grime = (seed: number, pts: V3[], op: number, col: string = HALL.plasterDeep) => wFill(p.layer(op, seed * 3), c, seed, tone(col, L), pts);
  // soot and dust under the beam band, damp grime above the dado
  grime(22900, qz(SHELL.z0 + 0.0035, SHELL.x0, SHELL.x1, 3.85, 4.27), 0.22);
  grime(22901, qx(SHELL.x0 + 0.0035, 3.85, 4.3, SHELL.z0, SHELL.z1), 0.22);
  grime(22902, qz(SHELL.z0 + 0.0035, SHELL.x0, SHELL.x1, 0.9, 1.15), 0.18);
  grime(22903, qx(SHELL.x0 + 0.0035, 0.9, 1.15, SHELL.z0, SHELL.z1), 0.18);
  grime(22904, qx(SHELL.x1 - 0.0035, 0.9, 1.1, 0.4, SHELL.z1), 0.12);
  // plaster cracks: short zigzags on the back and left walls (ink one step darker than the plaster)
  const crackCol = tone(mixColor(HALL.plasterShade, HALL.plasterDeep, 0.6), L);
  for (let i = 0; i < 6; i++) {
    const x = SHELL.x0 + 0.9 + ((i * 1.73) % 9.2), y = 1.4 + ((i * 0.77) % 2.2), d = i % 2 ? 1 : -1;
    wInk(p, c, 22910 + i, [[x, y, SHELL.z0 + 0.004], [x + 0.08 * d, y - 0.14, SHELL.z0 + 0.004], [x + 0.03 * d, y - 0.3, SHELL.z0 + 0.004], [x + 0.11 * d, y - 0.46, SHELL.z0 + 0.004]], {closed: false, weight: 0.55, color: crackCol});
    const z = SHELL.z0 + 0.8 + ((i * 1.31) % 7.0);
    wInk(p, c, 22920 + i, [[SHELL.x0 + 0.004, y, z], [SHELL.x0 + 0.004, y - 0.16, z + 0.07 * d], [SHELL.x0 + 0.004, y - 0.34, z + 0.02 * d]], {closed: false, weight: 0.55, color: crackCol});
  }
  // floor: dark dust along the wall bases, a worn sheen path from the open doors (+z) to the seat, chipped and cracked bricks
  const dust = tone(mixColor(HALL.joint, HALL.shadow, 0.5), L);
  wFill(p.layer(0.3, 22930 * 3), c, 22930, dust, qy(0.0025, SHELL.x0, SHELL.x1, SHELL.z0, SHELL.z0 + 0.28));
  wFill(p.layer(0.3, 22931 * 3), c, 22931, dust, qy(0.0025, SHELL.x0, SHELL.x0 + 0.28, SHELL.z0, SHELL.z1));
  wFill(p.layer(0.25, 22932 * 3), c, 22932, dust, qy(0.0025, SHELL.x1 - 0.28, SHELL.x1, SHELL.z0, SHELL.z1));
  wFill(p.layer(0.14, 22933 * 3), c, 22933, tone(HALL.sheen, L), [[-1.1, 0.0026, SHELL.z1], [1.1, 0.0026, SHELL.z1], [0.75, 0.0026, 0.5], [-0.75, 0.0026, 0.5]]);
  const crack = tone(mixColor(HALL.joint, HALL.shadow, 0.35), L);
  for (let i = 0; i < 18; i++) {
    const bx = ((i * 7) % 15) - 7, bz = ((i * 11) % 12) - 6, x = bx * BRICK + 0.12 + ((i * 0.13) % 0.3), z = bz * BRICK + 0.1 + ((i * 0.17) % 0.35);
    if (Math.abs(x) < 0.7 && z > -1.2 && z < 0.6) continue; // under the seat and the child's table
    if (i % 3 === 0) wFill(p.layer(0.55, 22940 + i), c, 22960 + i, crack, [[x, 0.003, z], [x + 0.09, 0.003, z - 0.02], [x + 0.06, 0.003, z + 0.05]]);
    else wInk(p, c, 22980 + i, [[x, 0.003, z], [x + 0.1, 0.003, z + 0.05 * (i % 2 ? 1 : -1)], [x + 0.18, 0.003, z + 0.02], [x + 0.28, 0.003, z + 0.07]], {closed: false, weight: 0.6, color: crack});
  }
  // wood grain on the screen panels (long vertical strokes, one step off the panel colour)
  const Z = SHELL.z0 + 0.0635, grain = tone(mixColor(HALL.wood, HALL.woodDark, 0.75), L);
  for (let k = 0; k < 3; k++) for (let j = 0; j < 4; j++) {
    const x = -1.5 + k * 1.02 + 0.1 + j * 0.24 + ((k + j) % 2) * 0.05;
    wInk(p, c, 23000 + k * 8 + j, [[x, 0.42, Z], [x + 0.015, 1.0, Z], [x - 0.01, 1.6, Z], [x + 0.01, 2.26, Z]], {closed: false, weight: 0.5, color: grain});
  }
};

/** Profile solid (radius, height pairs, metres) around a vertical axis at `at`, as one picture polygon (hull of its rings). */
const revolve = (c: YCam, at: V3, prof: [number, number][], n = 18): Pt[] => hull(prof.flatMap(([r, h]) => {
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) { const q = camPoint(c, [at[0] + r * Math.cos((i / n) * 6.283), at[1] + h, at[2] + r * Math.sin((i / n) * 6.283)]); if (q) out.push(q); }
  return out;
}));
const ringPx = (c: YCam, at: V3, r: number, h: number, n = 18): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) { const q = camPoint(c, [at[0] + r * Math.cos((i / n) * 6.283), at[1] + h, at[2] + r * Math.sin((i / n) * 6.283)]); if (q) out.push(q); }
  return out;
};

/** Hall dressing (W3.1 look frames, UT12 named props, kept low against the cast): a bronze tripod censer on a dark stand left of the screen and a
 *  blue-and-white floor vase on a stand right of it, each with a contact shadow. Plain shapes, no dragons or text (TL7: generic Qing hall). */
const dressingItems = (L: HallLight): Item[] => {
  const bronze = tone('#6e5a36', L), bronzeDark = tone('#4a3c24', L), patina = tone('#6f7a5c', L);
  const censerAt: V3 = [-2.05, 0, -3.65], vaseAt: V3 = [2.05, 0, -3.65];
  const shadowAt = (p: Painter, cc: YCam, seed: number, at: V3, r: number) => {
    const q = ringPx(cc, [at[0] + 0.03, 0.003, at[2] + 0.05], r, 0, 20);
    if (q.length >= 3) hardFill(p.layer(0.35, seed * 3), seed, '#2a201a', q);
  };
  return [
    {at: censerAt, draw: (p, c) => {
      shadowAt(p, c, 23600, censerAt, 0.34);
      paintBox(p, c, 23601, {x0: censerAt[0] - 0.3, x1: censerAt[0] + 0.3, y0: 0, y1: 0.42, z0: censerAt[2] - 0.3, z1: censerAt[2] + 0.3}, tone(HALL.woodDark, L), {}, {ink: true});
      const top: V3 = [censerAt[0], 0.42, censerAt[2]];
      for (const a of [0.5, 2.6, 4.7]) {
        const lx = top[0] + 0.13 * Math.cos(a), lz = top[2] + 0.13 * Math.sin(a);
        paintBox(p, c, 23610 + Math.round(a * 10), {x0: lx - 0.02, x1: lx + 0.02, y0: 0.42, y1: 0.56, z0: lz - 0.02, z1: lz + 0.02}, bronzeDark, {}, {ink: false});
      }
      const body = revolve(c, top, [[0.16, 0.12], [0.2, 0.2], [0.21, 0.3], [0.19, 0.34]]);
      if (body.length >= 3) { hardFill(p, 23620, bronze, body); inkLine(p, 23621, body, {weight: 0.7, color: bronzeDark, still: true}); }
      const rim = ringPx(c, top, 0.19, 0.34);
      if (rim.length >= 3) hardFill(p, 23622, bronzeDark, rim);
      const band = revolve(c, top, [[0.205, 0.22], [0.21, 0.25]]);
      if (band.length >= 3) hardFill(p.layer(0.6, 23623 * 3), 23623, patina, band);
      for (const s of [-1, 1]) paintBox(p, c, 23630 + s + 1, {x0: top[0] + s * 0.19 - 0.012, x1: top[0] + s * 0.19 + 0.012, y0: 0.72, y1: 0.86, z0: top[2] - 0.05, z1: top[2] + 0.05}, bronzeDark, {}, {ink: false});
    }},
    {at: vaseAt, draw: (p, c) => {
      shadowAt(p, c, 23700, vaseAt, 0.3);
      paintBox(p, c, 23701, {x0: vaseAt[0] - 0.24, x1: vaseAt[0] + 0.24, y0: 0, y1: 0.3, z0: vaseAt[2] - 0.24, z1: vaseAt[2] + 0.24}, tone(HALL.woodDark, L), {}, {ink: true});
      const base: V3 = [vaseAt[0], 0.3, vaseAt[2]];
      const prof: [number, number][] = [[0.12, 0], [0.2, 0.18], [0.22, 0.34], [0.16, 0.6], [0.07, 0.74], [0.08, 0.86], [0.11, 0.9]];
      const rv = (h: number) => { for (let i = 1; i < prof.length; i++) if (h <= prof[i][1]) { const [r0, h0] = prof[i - 1], [r1, h1] = prof[i]; return r0 + ((r1 - r0) * (h - h0)) / (h1 - h0); } return prof[prof.length - 1][0]; };
      const body = revolve(c, base, prof, 20);
      if (body.length >= 3) { hardFill(p, 23710, tone(TABLE.porcelain, L), body); inkLine(p, 23711, body, {weight: 0.7, color: tone(TABLE.porcelainShade, L), still: true}); }
      // blue bands (shoulder, neck, foot) then the shade side away from the key (+x)
      for (const [h0, h1, s] of [[0.24, 0.42, 23720], [0.7, 0.76, 23722], [0.03, 0.08, 23724]] as [number, number, number][]) {
        const b = revolve(c, base, [[rv(h0) + 0.003, h0], [rv((h0 + h1) / 2) + 0.003, (h0 + h1) / 2], [rv(h1) + 0.003, h1]], 20);
        if (b.length >= 3) hardFill(p.layer(0.8, s * 3), s, tone(TABLE.blue, L), b);
      }
      const shade = revolve(c, [base[0] - 0.06, base[1], base[2]], [[0.09, 0.03], [0.15, 0.2], [0.16, 0.34], [0.1, 0.58]], 20);
      if (shade.length >= 3) hardFill(p.layer(0.25, 23712 * 3), 23712, '#3a3a48', shade);
    }},
  ];
};

/** Paper lattice window in a back wall (constant z): frame, glowing paper, a straight bar grid (flat fills). */
const paintLatticeZ = (p: Painter, c: YCam, s: number, z: number, x0: number, x1: number, y0: number, y1: number, key: number) => {
  wFill(p, c, s, HALL.woodDark, qz(z, x0 - 0.08, x1 + 0.08, y0 - 0.08, y1 + 0.08));
  wFill(p, c, s + 1, mixColor(HALL.winGlow, '#fff8e6', Math.min(1, 0.3 * key)), qz(z + 0.001, x0, x1, y0, y1));
  const nx = Math.round((x1 - x0) / 0.2), ny = Math.round((y1 - y0) / 0.2);
  for (let i = 1; i < nx; i++) { const x = x0 + ((x1 - x0) * i) / nx; wFill(p, c, s + 2 + i, HALL.lattice, qz(z + 0.002, x - 0.012, x + 0.012, y0, y1)); }
  for (let k = 1; k < ny; k++) { const y = y0 + ((y1 - y0) * k) / ny; wFill(p, c, s + 20 + k, HALL.lattice, qz(z + 0.002, x0, x1, y - 0.012, y + 0.012)); }
  wFill(p, c, s + 39, HALL.lattice, qz(z + 0.003, (x0 + x1) / 2 - 0.03, (x0 + x1) / 2 + 0.03, y0, y1));
};
/** Paper lattice window in the right wall (constant x). */
const paintLatticeX = (p: Painter, c: YCam, s: number, x: number, z0: number, z1: number, y0: number, y1: number, key: number) => {
  wFill(p, c, s, HALL.woodDark, qx(x, y0 - 0.08, y1 + 0.08, z0 - 0.08, z1 + 0.08));
  wFill(p, c, s + 1, mixColor(HALL.winGlow, '#fff8e6', Math.min(1, 0.5 * key)), qx(x - 0.001, y0, y1, z0, z1));
  const nz = Math.round((z1 - z0) / 0.2), ny = Math.round((y1 - y0) / 0.2);
  for (let i = 1; i < nz; i++) { const z = z0 + ((z1 - z0) * i) / nz; wFill(p, c, s + 2 + i, HALL.lattice, qx(x - 0.002, y0, y1, z - 0.012, z + 0.012)); }
  for (let k = 1; k < ny; k++) { const y = y0 + ((y1 - y0) * k) / ny; wFill(p, c, s + 22 + k, HALL.lattice, qx(x - 0.002, y - 0.012, y + 0.012, z0, z1)); }
};

/** A red lacquer column (Ø 0.36 m) as a round shaft seen from any side: shaded bands across the line of sight, a stone base. */
const columnItem = (at: V3, L: HallLight): Item => ({at, draw: (p, c) => {
  const dx = at[0] - c.x, dz = at[2] - c.z, n = Math.hypot(dx, dz) || 1, rx = -dz / n, rz = dx / n, R = 0.18;
  const band = (s: number, a0: number, a1: number, col: string, y0 = 0.3, y1 = SHELL.h) => wFill(p, c, s, tone(col, L), [
    [at[0] + rx * R * a0, y0, at[2] + rz * R * a0], [at[0] + rx * R * a1, y0, at[2] + rz * R * a1], [at[0] + rx * R * a1, y1, at[2] + rz * R * a1], [at[0] + rx * R * a0, y1, at[2] + rz * R * a0]]);
  const seed = 23000 + Math.round((at[0] + 6) * 100 + (at[2] + 6) * 7);
  band(seed, -1, 1, HALL.col);
  // the key comes from +x: the side of the shaft toward +x is lit
  const litSide = rx > 0 ? 1 : -1;
  band(seed + 1, -litSide, -litSide * 0.35, HALL.colShade);
  band(seed + 2, litSide * 0.35, litSide * 0.8, HALL.colLit);
  // worn gilt rings above the base and under the beam (finished grade, W3.1)
  band(seed + 5, -1, 1, mixColor(HALL.gold, HALL.colShade, 0.25), 0.3, 0.35);
  band(seed + 6, -1, 1, mixColor(HALL.gold, HALL.colShade, 0.25), 3.95, 4.0);
  paintBox(p, c, seed + 3, {x0: at[0] - 0.26, x1: at[0] + 0.26, y0: 0, y1: 0.3, z0: at[2] - 0.26, z1: at[2] + 0.26}, tone('#9a958a', L), {}, {ink: true});
}});

/** The child's armchair (`new: qing-armchair`): carved dark wood, a tall back with a curved crest rail, arms, two yellow cushions; footstool. */
const armchairItems = (L: HallLight): Item[] => {
  const [cx, , cz] = SEAT.chair, w = 0.44, d0 = cz - 0.32, d1 = cz + 0.3, wood = tone(HALL.wood, L), dark = tone(HALL.woodDark, L);
  return [
    {at: [cx, 0, cz - 0.1], bias: 0.15, draw: (p, c) => {
      wFill(p.layer(0.35, 23500), c, 23501, '#2a1a12', [[cx - w - 0.08, 0.002, d0 - 0.05], [cx + w, 0.002, d0 - 0.05], [cx + w, 0.002, d1 + 0.12], [cx - w - 0.1, 0.002, d1 + 0.12]]);
      // back legs, back panel (with a gold medallion), crest rail
      for (const s of [-1, 1]) paintBox(p, c, 23510 + (s + 1), {x0: cx + s * w - 0.035, x1: cx + s * w + 0.035, y0: 0, y1: 1.3, z0: d0, z1: d0 + 0.06}, dark, {}, {ink: true});
      paintBox(p, c, 23520, {x0: cx - w + 0.03, x1: cx + w - 0.03, y0: SEAT.seatY, y1: 1.24, z0: d0 + 0.01, z1: d0 + 0.05}, wood, {}, {ink: true});
      const m = camPoint(c, [cx, 0.98, d0 + 0.052]), mu = camUnit(c, [cx, 0.98, d0]);
      // carved back panel: a sunk panel with a gold line border (abstract, no dragon)
      if (m) void mu;
      wFill(p, c, 23521, dark, qz(d0 + 0.052, cx - 0.26, cx + 0.26, 0.72, 1.16));
      wInk(p, c, 23522, qz(d0 + 0.053, cx - 0.22, cx + 0.22, 0.76, 1.12), {color: tone(HALL.gold, L), weight: 0.9});
      paintBox(p, c, 23523, {x0: cx - w - 0.06, x1: cx + w + 0.06, y0: 1.24, y1: 1.34, z0: d0 - 0.01, z1: d0 + 0.07}, dark, {}, {ink: true});
      paintBox(p, c, 23524, {x0: cx - w - 0.1, x1: cx - w - 0.02, y0: 1.28, y1: 1.4, z0: d0 - 0.01, z1: d0 + 0.07}, dark, {}, {ink: true});
      paintBox(p, c, 23525, {x0: cx + w + 0.02, x1: cx + w + 0.1, y0: 1.28, y1: 1.4, z0: d0 - 0.01, z1: d0 + 0.07}, dark, {}, {ink: true});
      // seat box, front legs, two cushions
      paintBox(p, c, 23530, {x0: cx - w, x1: cx + w, y0: 0.42, y1: SEAT.seatY, z0: d0, z1: d1}, wood, {}, {ink: true});
      paintBox(p, c, 23531, {x0: cx - w + 0.02, x1: cx + w - 0.02, y0: 0.06, y1: 0.42, z0: d1 - 0.05, z1: d1}, dark, {front: 0.15}, {ink: true});
      paintBox(p, c, 23532, {x0: cx - w + 0.04, x1: cx + w - 0.04, y0: SEAT.seatY, y1: 0.56, z0: d0 + 0.06, z1: d1 - 0.02}, tone(TABLE.runner, L), {}, {ink: true});
      paintBox(p, c, 23533, {x0: cx - w + 0.06, x1: cx + w - 0.06, y0: 0.56, y1: SEAT.cushionY, z0: d0 + 0.08, z1: d1 - 0.04}, tone(mixColor(TABLE.runner, '#fff0c0', 0.2), L), {}, {ink: true});
    }},
    // arms are nearer than the child's hips on the camera side (drawn after the child when the camera is to the side)
    {at: [cx, 0, cz + 0.05], bias: -0.25, draw: (p, c) => {
      for (const s of [-1, 1]) {
        if (Math.sign(c.x - cx) !== s && Math.abs(c.x - cx) > 0.3) continue;
        paintBox(p, c, 23540 + (s + 1), {x0: cx + s * w - 0.03, x1: cx + s * w + 0.03, y0: SEAT.seatY, y1: 0.7, z0: d0 + 0.04, z1: d1 - 0.02}, wood, {}, {ink: true});
        paintBox(p, c, 23544 + (s + 1), {x0: cx + s * w - 0.04, x1: cx + s * w + 0.04, y0: 0.7, y1: 0.74, z0: d0, z1: d1 + 0.02}, dark, {}, {ink: true});
        // finished grade (W3.1): a sunk panel with a gold line on the arm's outer face, the side the camera sees
        if (Math.sign(c.x - cx) === s) {
          const fx = cx + s * (w + 0.031);
          wFill(p, c, 23550 + (s + 1), mixColor(wood, dark, 0.55), qx(fx, 0.53, 0.675, d0 + 0.1, d1 - 0.08));
          wInk(p, c, 23552 + (s + 1), qx(fx + s * 0.001, 0.545, 0.66, d0 + 0.12, d1 - 0.1), {color: mixColor(tone(HALL.gold, L), dark, 0.3), weight: 0.8});
        }
      }
    }},
    {at: [cx, 0, -0.4], bias: 0.05, draw: (p, c) => paintBox(p, c, 23560, {x0: cx - 0.3, x1: cx + 0.3, y0: 0, y1: 0.22, z0: -0.55, z1: -0.25}, dark, {}, {ink: true})},
  ];
};

/** A lacquer table: top slab with a gold edge line, an apron and four legs (`runner` adds the yellow silk runner down the long axis). */
const paintTable = (p: Painter, c: YCam, s: number, t: {x0: number; x1: number; z0: number; z1: number; y: number}, L: HallLight, runner = false, deepApron = false) => {
  const lac = tone(TABLE.lacquer, L), dark = tone(TABLE.lacquerShade, L);
  wFill(p.layer(0.35, s * 3), c, s + 90, '#2a1410', [[t.x0 - 0.12, 0.002, t.z0 - 0.04], [t.x1 - 0.05, 0.002, t.z0 - 0.04], [t.x1 - 0.05, 0.002, t.z1 + 0.04], [t.x0 - 0.12, 0.002, t.z1 + 0.04]]);
  for (const [lx, lz] of [[t.x0 + 0.05, t.z0 + 0.05], [t.x1 - 0.05, t.z0 + 0.05], [t.x0 + 0.05, t.z1 - 0.05], [t.x1 - 0.05, t.z1 - 0.05]] as [number, number][])
    paintBox(p, c, s + Math.round((lx + 5) * 10 + (lz + 5)), {x0: lx - 0.035, x1: lx + 0.035, y0: 0, y1: t.y - 0.05, z0: lz - 0.035, z1: lz + 0.035}, dark, {}, {ink: true});
  // W5.1 (Film LF01 note: LT read as a thin shelf): the long table carries a deep lacquer apron flush with the top (0.24 m), a gold bead on it
  if (deepApron) paintBox(p, c, s + 40, {x0: t.x0 + 0.005, x1: t.x1 - 0.005, y0: t.y - 0.26, y1: t.y - 0.04, z0: t.z0 + 0.005, z1: t.z1 - 0.005}, lac, {top: 0.1}, {ink: true});
  else paintBox(p, c, s + 40, {x0: t.x0 + 0.03, x1: t.x1 - 0.03, y0: t.y - 0.14, y1: t.y - 0.04, z0: t.z0 + 0.03, z1: t.z1 - 0.03}, dark, {}, {ink: true});
  paintBox(p, c, s + 50, {x0: t.x0, x1: t.x1, y0: t.y - 0.045, y1: t.y, z0: t.z0, z1: t.z1}, lac, {top: 0.12}, {ink: true});
  // lacquer top: the window reflection as two soft lit bands across the grain (key from +x), then a gold border strip (flat fills, straight)
  const T = t.y + 0.001, bw = 0.014, m = 0.035, xm = (t.x0 + t.x1) / 2, zs = t.z1 - t.z0;
  wFill(p.layer(0.35, s * 3 + 1), c, s + 61, tone(TABLE.lacquerLit, L), [[xm + 0.05, T, t.z0 + 0.05], [t.x1 - 0.06, T, t.z0 + 0.05], [t.x1 - 0.06, T, t.z0 + 0.05 + zs * 0.35], [xm + 0.25, T, t.z0 + 0.05 + zs * 0.55]]);
  wFill(p.layer(0.2, s * 3 + 2), c, s + 62, '#d07a5a', [[xm + 0.32, T, t.z0 + 0.08], [t.x1 - 0.1, T, t.z0 + 0.08], [t.x1 - 0.1, T, t.z0 + 0.08 + zs * 0.12], [xm + 0.42, T, t.z0 + 0.08 + zs * 0.2]]);
  const gold = tone(HALL.gold, L);
  wFill(p, c, s + 63, gold, qy(T + 0.0005, t.x0 + m, t.x1 - m, t.z0 + m, t.z0 + m + bw));
  wFill(p, c, s + 64, gold, qy(T + 0.0005, t.x0 + m, t.x1 - m, t.z1 - m - bw, t.z1 - m));
  wFill(p, c, s + 65, gold, qy(T + 0.0005, t.x0 + m, t.x0 + m + bw, t.z0 + m, t.z1 - m));
  wFill(p, c, s + 66, gold, qy(T + 0.0005, t.x1 - m - bw, t.x1 - m, t.z0 + m, t.z1 - m));
  // gold bead along the bottom of the apron on the sides the camera sees
  const ab = t.y - (deepApron ? 0.2 : 0.14), ap = deepApron ? {x0: t.x0 + 0.005, x1: t.x1 - 0.005, z0: t.z0 + 0.005, z1: t.z1 - 0.005} : {x0: t.x0 + 0.03, x1: t.x1 - 0.03, z0: t.z0 + 0.03, z1: t.z1 - 0.03};
  if (c.z > ap.z1) wFill(p, c, s + 67, gold, qz(ap.z1 + 0.002, ap.x0, ap.x1, ab, ab + 0.015));
  if (c.x > ap.x1) wFill(p, c, s + 68, gold, qx(ap.x1 + 0.002, ab, ab + 0.015, ap.z0, ap.z1));
  if (c.x < ap.x0) wFill(p, c, s + 69, gold, qx(ap.x0 - 0.002, ab, ab + 0.015, ap.z0, ap.z1));
  if (runner) {
    const rx0 = (t.x0 + t.x1) / 2 - 0.36, rx1 = (t.x0 + t.x1) / 2 + 0.36;
    wFill(p, c, s + 70, tone(TABLE.runner, L), qy(t.y + 0.002, rx0, rx1, t.z0 - 0.002, t.z1 + 0.002));
    wFill(p, c, s + 71, tone(TABLE.runnerShade, L), qz(t.z1 + 0.003, rx0, rx1, t.y - 0.3, t.y + 0.002));
    wFill(p, c, s + 72, tone(TABLE.runnerShade, L), qz(t.z0 - 0.003, rx0, rx1, t.y - 0.3, t.y + 0.002));
    wInk(p, c, s + 73, qy(t.y + 0.003, rx0 + 0.03, rx1 - 0.03, t.z0, t.z1), {color: TABLE.runnerShade, weight: 0.7});
  }
};

export type CoverState = 'on' | 'off' | 'held';
export type LongTableState = {covers: 'on' | 'off'; detailPx?: number;
  /** W5.1 per-bowl cover state by bowl index (LT_BOWLS order: A01..A14, B01..B14); absent = `covers`. 'held' = the caller draws it in a hand. */
  coverOf?: (i: number) => CoverState;
  /** The taster's saucer SAU on the runner (always on the table) and whether his spoon rests on it (from B03-SH09 l 44). */
  spoonOnSaucer?: boolean;
  /** Drawn before the table (far-side figures: every hall camera stands on LT's +x side, so a lifter at x < LT.x0 is behind it). */
  before?: (p: Painter, c: YCam) => void;
  /** Drawn after the table top and runner, before the bowls. */
  mid?: (p: Painter, c: YCam) => void;
  /** Drawn after the bowls (hands and covers in hands reaching over the table from the far side). */
  after?: (p: Painter, c: YCam) => void};
/** The rim centre of a cover on its bowl and its rest point on the runner (+z side, `hall.ts` covers-off rule), for bowl index `i`. */
export const coverOn = (i: number): V3 => [LT_BOWLS[i].at[0], LT.y + 0.003 + 0.058, LT_BOWLS[i].at[2]];
// W5.1: the near-end bowl LT-A01 (z 2.04) rests its cover between the rows (x -3.6, z 2.25): its +z rest point would sit on SAU (-3.30, 2.24).
export const coverRest = (i: number): V3 => i === 0 ? [-3.6, LT.y + 0.003, 2.25] : [LT_BOWLS[i].at[0], LT.y + 0.003, LT_BOWLS[i].at[2] + 0.17];
/** SAU (scene sheet prop anchor) and the spoon resting on it. */
export const SAU: V3 = [-3.3, LT.y + 0.01, 2.24];
/** LT with its runner, SAU and the 28 bowls (sorted far to near inside the item). */
const longTableItem = (L: HallLight, st: LongTableState): Item => ({at: [(LT.x0 + LT.x1) / 2, 0, (LT.z0 + LT.z1) / 2], bias: 0.3, draw: (p, c) => {
  st.before?.(p, c);
  paintTable(p, c, 24000, LT, L, true, true);
  st.mid?.(p, c);
  type Thing = {d: number; draw: () => void};
  const things: Thing[] = LT_BOWLS.map((b, i) => ({d: Math.hypot(b.at[0] - c.x, b.at[2] - c.z), draw: () => {
    // covers off: each set down on the runner beside its own bowl (+z side), so 28 covers stay beside 28 bowls (brief contact / identity)
    paintLidBowl(p, c, 24100 + i * 60, [b.at[0], LT.y + 0.003, b.at[2]], {cover: st.coverOf?.(i) ?? st.covers, detailPx: st.detailPx, coverAt: coverRest(i)});
  }}));
  things.push({d: Math.hypot(SAU[0] - c.x, SAU[2] - c.z), draw: () => {
    paintSaucer(p, c, 25900, SAU);
    if (st.spoonOnSaucer) paintSpoon(p, c, 25950, [SAU[0] + 0.008, SAU[1] + 0.004, SAU[2] - 0.024], 1.9);
  }});
  things.sort((a, b) => b.d - a.d).forEach((t) => t.draw());
  st.after?.(p, c);
}});

export type HallState = {
  light?: HallLight;
  longTable?: LongTableState;
  /** Extra depth-sorted items: the cast, the child's tableware. */
  items?: Item[];
  /** Painted on the child's table top right after the table (trays, dishes, rice bowl): part of the CT item, so it sorts with it. */
  onChildTable?: (p: Painter, c: YCam) => void;
  /** Painted after the sorted set (foreground). */
  after?: (p: Painter, c: YCam) => void;
};

/** The whole hall for one frame: back pass, then columns, armchair, both tables and the scene's items, far to near. */
export const paintHall = (p: Painter, c: YCam, st: HallState = {}) => {
  const L = st.light ?? {};
  paintHallBack(p, c, L);
  // R2 (SCENES-R2 fix 1): the x -5 columns stand against the far wall behind LT, the lifters and everything else from every EP22 camera (all at
  // x > -4.05, so the plane x -4.74 at the column bases separates them from the rest of the set): painted first, far to near among themselves,
  // instead of by distance (LT's item key with bias 0.3 sorted behind the column (-5, 0, 0) base, which then painted over LT: SH09 "grey box").
  paintSorted(p, c, [-3.6, 0, 3.6].map((z) => columnItem([-5.0, 0, z], L)));
  const items: Item[] = [];
  for (const z of [-3.6, 0, 3.6]) items.push(columnItem([5.0, 0, z], L));
  items.push(...armchairItems(L), ...dressingItems(L));
  items.push({at: [0, 0, 0], bias: -0.05, draw: (p2, c2) => { paintTable(p2, c2, 25000, CT, L); st.onChildTable?.(p2, c2); }});
  items.push(longTableItem(L, st.longTable ?? {covers: 'on'}));
  if (st.items) items.push(...st.items);
  paintSorted(p, c, items);
  st.after?.(p, c);
};

/** Visible picture polygon of a world quad (for QA zone checks). */
export const quadPx = (c: YCam, pts: V3[]): Pt[] => wp(c, pts);
