import type {PaintContext} from '../BrushCanvas';
import {mixColor, type Pt} from '../painter';
import {ell, INK} from './ctx';
import {boxFloorCast, castTone, clipConvex, KEY_SEC_DAY, roomFloorQuad, SEC_BACK, type Caster} from './light';
import type {Section} from './space';

// ZCPAINT section set kit (S-P03): the cream unit cut open along the section (`SEC-2D`, `MK-ZC-ST-01..03`). Rooms are
// painted from the cut plane inward, then the opaque caps last. Look rules from the user (30 Oct 2026): flatter fills
// (no texture on large areas, so no cloudy blotches), and light only at the ceiling lamp (no wall pools). Light levels
// are value lerps per zone on full-alpha fills (`ZC-LIGHT-STATE`), never an alpha cross-fade.

/** RM-06 (pass 9): caps a step warmer than the old #1c1f24, so they read as building, not black bars. */
export const CAP = '#22201f';
export const CREAM = {
  wall: '#d9ccb0', wallShade: '#b9aa8c', partition: '#cfc6b2', door: '#c4b392', cab: '#cdb48c', cabTop: '#e2cfa8', cabShade: '#9c8664',
  tile: '#7d6c58', base: '#6d5f4c', ceiling: '#c9bb9d', white: '#e6e3da', whiteTop: '#f2efe6', whiteSide: '#cfcac0',
  neighbour: '#2b2724', lampCore: '#fbf4dc', dark: '#14110e',
};
/** Light level 0 (blackout) .. 1 (powered) per zone. */
export type Lights = {entry: number; bath: number; kitchen: number; living: number; neighbours: number};
/** Daylight-ish default for the set looks (B04 and B06 use it; B03 overrides per key). */
export const LIT_DAY: Lights = {entry: 0.8, bath: 0.8, kitchen: 0.8, living: 0.8, neighbours: 0.5};
export const dim = (color: string, light: number) => mixColor(CREAM.dark, color, 0.1 + 0.9 * light);

/**
 * Flat decal kit for backgrounds, sets and POV backdrops (user, 30 Oct 2026: "as clean as the characters"): each fill is a
 * single `brush.wash` (flat underlayer, no bleed, no texture), measured luma SD 0.000 on a 1000 x 400 area (`flatness.py`,
 * `out/painted/zcpaint/flattest/`) where the textured nine-pass fill gave SD 0.016 (mottled). Ink outlines boil as before.
 * Characters keep their own textured passes (hands.ts, figure code); paper grain is the Grain layer only.
 */
export type Flat = {
  fill: (color: string, pts: Pt[], passes?: number) => void;
  line: (pts: Pt[], w?: number, color?: string, closed?: boolean) => void;
};
export const flatKit = (ctx: PaintContext, base: number): Flat => {
  const {brush} = ctx;
  let seed = base, line = base + 900;
  return {
    fill: (color, pts, passes) => {
      void passes;
      brush.seed(++seed);
      brush.noiseSeed(seed);
      brush.noStroke();
      brush.noFill();
      brush.wash(color, 255);
      brush.polygon(pts);
      brush.noWash();
    },
    line: (pts, w = 1, color = INK, closed = true) => {
      ctx.boil(++line);
      brush.set('rotring', color, w);
      brush.spline(closed ? [...pts, pts[0]] : pts, 0.1);
    },
  };
};

/**
 * Cast shadows of the room's boxes on its floor (`LT-03`, `RK-26` floor-only fallback: partitions and the back wall are not receivers in
 * the plates built so far, measured per plate). Paint this pass after the room floor and before the boxes, so no shadow lies over a box.
 */
export const castFloor = (f: Flat, S: Section, casters: readonly Caster[], floor: string, room: readonly [number, number], key = KEY_SEC_DAY, back = SEC_BACK) => {
  const quad = roomFloorQuad(S, room, back), tone = castTone(floor);
  for (const c of casters) {
    const poly = clipConvex(boxFloorCast(S, c, key), quad);
    if (poly.length > 2) f.fill(tone, poly);
  }
};

/** A box as a section camera sees it: the +Y side, the top and the near end (d0). `outline` inks the near end. */
export const box = (f: Flat, S: Section, [y0, y1]: [number, number], [d0, d1]: [number, number], [z0, z1]: [number, number], c: {front: string; top: string; side: string}, outline = true) => {
  const {P} = S;
  f.fill(c.side, [P(y1, z1, d0), P(y1, z1, d1), P(y1, z0, d1), P(y1, z0, d0)]);
  f.fill(c.top, [P(y0, z1, d0), P(y1, z1, d0), P(y1, z1, d1), P(y0, z1, d1)]);
  const front = [P(y0, z1, d0), P(y1, z1, d0), P(y1, z0, d0), P(y0, z0, d0)];
  f.fill(c.front, front);
  // Thin ink on the edges (user 30 Oct 2026: "เส้นหมึกบางๆ" like the characters).
  if (outline) f.line(front, 1);
  f.line([P(y1, z1, d0), P(y1, z1, d1), P(y1, z0, d1), P(y1, z0, d0)], 0.6, INK, false);
};

/** A room slice between Y y0 and y1: back wall, floor, ceiling and the wall base in shadow. */
export const roomShell = (f: Flat, S: Section, y0: number, y1: number, light: number, wall: string, back = 3.2) => {
  const {P} = S;
  f.fill(dim(wall, light), [P(y0, 2.6, back), P(y1, 2.6, back), P(y1, 0, back), P(y0, 0, back)]);
  f.fill(dim(CREAM.tile, light), [P(y0, 0, 0), P(y1, 0, 0), P(y1, 0, back), P(y0, 0, back)]);
  f.fill(dim(CREAM.ceiling, light), [P(y0, 2.6, 0), P(y1, 2.6, 0), P(y1, 2.6, back), P(y0, 2.6, back)]);
  f.fill(dim(CREAM.base, light), [P(y0, 0.35, back), P(y1, 0.35, back), P(y1, 0, back), P(y0, 0, back)]);
  // Skirting and the back-wall edge as thin ink lines; the wall/floor seam inked too.
  f.line([P(y0, 0.35, back), P(y1, 0.35, back)], 0.6, INK, false);
  f.line([P(y0, 0, back), P(y1, 0, back)], 0.6, INK, false);
};

/** The dark neighbour units above and below the slabs, with the one lit window line above (no pools). */
export const neighbours = (f: Flat, S: Section, L: Lights) => {
  const {sec} = S;
  const top = sec.floorY - 2.85 * sec.U, bot = sec.floorY + 0.25 * sec.U;
  f.fill(dim(CREAM.neighbour, L.neighbours), [[-100, -100], [1200, -100], [1200, top], [-100, top]], 2);
  f.fill(dim(CREAM.neighbour, L.neighbours), [[-100, bot], [1200, bot], [1200, 2100], [-100, 2100]], 2);
  f.fill(mixColor(CREAM.neighbour, '#c9bb9d', 0.8 * L.neighbours), [[300, 60], [760, 60], [760, 76], [300, 76]], 2);
};

/** Ceiling lamp: the only light source of the entry; its glow stays on the ceiling near the fixture (stepped, flat). */
export const ceilingLamp = (f: Flat, S: Section, light: number, y = 1.0, d = 0.8) => {
  const {P} = S;
  if (light < 0.02) return;
  const core = dim(CREAM.lampCore, light), cx = P(y, 2.6, d);
  for (let k = 3; k >= 0; k--) {
    const u = (k + 1) / 4;
    f.fill(mixColor(dim(CREAM.ceiling, light), core, 0.16 + 0.1 * (3 - k)), ell(cx[0], cx[1] + 6, 36 + 120 * u * S.sec.U / 380, 10 + 34 * u * S.sec.U / 380, 20), 2);
  }
  f.fill(core, [P(y - 0.2, 2.58, d - 0.25), P(y + 0.2, 2.58, d - 0.25), P(y + 0.2, 2.58, d + 0.25), P(y - 0.2, 2.58, d + 0.25)], 2);
};

/** Partition caps are painted only above the doorway lintel (`MK-ZC-ST-02`); the corridor is a flat cap (`ZC-CUT-02`). */
export const paintCaps = (f: Flat, S: Section, partitions: readonly [number, number][], corridor = true) => {
  const {P, sec} = S;
  const top = sec.floorY - 2.85 * sec.U, bot = sec.floorY + 0.25 * sec.U;
  const x = (y: number) => P(y, 0, 0)[0];
  if (corridor) f.fill(CAP, [[-100, top], [x(0), top], [x(0), bot], [-100, bot]], 4);
  f.fill(CAP, [[x(0), top], [x(0.18), top], [x(0.18), bot], [x(0), bot]], 4); // door wall
  for (const [a, b] of partitions) {
    const lo = P(a, 2.05, 0), hi = P(a, 2.6, 0), lo2 = P(b, 2.05, 0), hi2 = P(b, 2.6, 0);
    f.fill(CAP, [hi, hi2, lo2, lo], 4); // lintel-only cap
  }
  f.fill(CAP, [[-100, top], [1200, top], [1200, P(0, 2.6, 0)[1]], [-100, P(0, 2.6, 0)[1]]], 4); // ceiling slab
  f.fill(CAP, [[-100, sec.floorY], [1200, sec.floorY], [1200, bot], [-100, bot]], 4); // floor slab
  f.line([[x(0), top], [x(0), bot]], 1, '#4a433b', false); // RM-06 thin edge line on the door-wall cap
};
