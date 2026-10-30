import type {PaintContext} from '../BrushCanvas';
import {ell} from './ctx';
import {box, castFloor, CREAM, ceilingLamp, dim, flatKit, neighbours, roomShell, type Flat, type Lights} from './sets';
import {castTone, keyFaces, type Caster} from './light';
import {roomAccents, wainscot} from './accents';
import {bathWall, cabinetGrain, ceilingSeams, entryWall, floorGrout, kitchenItems, livingCurtains, livingFloorWall} from './detail';
import type {Section} from './space';
import type {Pt} from '../painter';

// ZCPAINT unit strip (S-P03): the whole cream unit along the section, painted once per frame by every section plate
// (the truck moves Yc over it, `S-P04` a). Entry (door wall, door, flush cabinet), bathroom (basin, toilet, louvre window
// and the running tap in B04), kitchenette (fridge, counter, shelf, stove case, window), living room (sofa, side table,
// balcony glazing at Y 9.20). Partitions P1 (Y 1.5) and P2 (Y 3.3) have doorways d 0-0.9 under the lintel (`MK-ZC-ST-02`).
// Ceiling lamps are the only light sources (user, 30 Oct 2026): no wall pools.

const BACK = 3.2;
const INK_LIGHT = '#9fc3d6';

/** A partition at Y y (face toward -Y): wall face d 0.9-3.2, the lintel band over the doorway, the jamb at d 0.9. */
const partition = (f: Flat, S: Section, y: number, light: number) => {
  const {P} = S;
  f.fill(dim(CREAM.wallShade, light), [P(y, 2.6, 0.9), P(y, 2.6, BACK), P(y, 0, BACK), P(y, 0, 0.9)]);
  f.fill(dim(CREAM.wallShade, light), [P(y, 2.6, 0), P(y, 2.6, 0.9), P(y, 2.05, 0.9), P(y, 2.05, 0)]);
  f.fill(dim(CREAM.wall, light), [P(y, 2.05, 0.9), P(y + 0.1, 2.05, 0.9), P(y + 0.1, 0, 0.9), P(y, 0, 0.9)]);
};

/** Entry: door wall interior, the plain door (closed, bolted, no peephole), the thumb-turn, the flush cabinet. */
const entry = (f: Flat, S: Section, L: Lights) => {
  const {P} = S;
  f.fill(dim(CREAM.wallShade, L.entry), [P(0.18, 2.6, 0), P(0.18, 2.6, BACK), P(0.18, 0, BACK), P(0.18, 0, 0)]);
  f.fill(dim(CREAM.door, L.entry), [P(0.18, 2.1, 0.3), P(0.18, 2.1, 1.2), P(0.18, 0, 1.2), P(0.18, 0, 0.3)]);
  f.line([P(0.18, 2.1, 0.3), P(0.18, 2.1, 1.2), P(0.18, 0, 1.2), P(0.18, 0, 0.3)], 1.1);
  entryWall(f, S, L);
  const tt = P(0.18, 1.05, 1.1);
  f.fill(dim('#6f665a', L.entry), ell(tt[0], tt[1], 6, 8, 10));
  box(f, S, [0.18, 0.58], [0.35, 1.15], [0, 1.2], keyFaces(CREAM.cab, (c) => dim(c, L.entry), 1, CREAM.cabTop));
  cabinetGrain(f, S, L);
  ceilingLamp(f, S, L.entry, 1.0, 0.8);
};

/** Bathroom fixtures (basin on the counter, toilet with cistern against the back wall). */
const bathroom = (f: Flat, S: Section, L: Lights) => {
  const fx = keyFaces(CREAM.white, (c) => dim(c, L.bath), 1, CREAM.whiteTop);
  bathWall(f, S, L);
  box(f, S, [1.7, 2.05], [2.75, 3.2], [0, 0.85], fx);
  box(f, S, [2.15, 2.45], [3.0, 3.2], [0.4, 0.8], fx);
  box(f, S, [2.15, 2.45], [2.45, 3.0], [0, 0.4], fx);
  ceilingLamp(f, S, L.bath, 2.4, 1.3);
};

/** Kitchenette: fridge (Y 3.40-4.05, d 1.00-1.60, door face +Y), counter and window on the back wall, stove case on the shelf. */
const kitchen = (f: Flat, S: Section, L: Lights) => {
  const {P} = S;
  const wood = keyFaces('#b99c72', (c) => dim(c, L.kitchen), 1, '#d7bf96');
  f.fill(dim('#e9e6d6', L.kitchen), [P(5.15, 2.3, BACK), P(5.55, 2.3, BACK), P(5.55, 1.3, BACK), P(5.15, 1.3, BACK)], 2);
  f.line([P(5.35, 2.3, BACK), P(5.35, 1.3, BACK)], 0.8);
  box(f, S, [4.15, 5.60], [2.60, 3.20], [0, 0.90], wood);
  box(f, S, [4.15, 5.60], [2.90, 3.20], [1.43, 1.47], wood, false);
  box(f, S, [4.67, 5.03], [2.67, 3.03], [1.45, 1.57], keyFaces('#3d4a52', (c) => dim(c, L.kitchen), 1, '#56646c'));
  box(f, S, [3.40, 4.05], [1.00, 1.60], [0, 1.70], keyFaces('#e4e1d8', (c) => dim(c, L.kitchen), 1, '#f0eee7'));
  f.line([P(4.05, 0.85, 1.0), P(4.05, 0.85, 1.6)], 1);
  f.fill(dim('#8f8f8a', L.kitchen), [P(4.08, 0.95, 1.02), P(4.08, 0.95, 1.06), P(4.08, 1.25, 1.06), P(4.08, 1.25, 1.02)], 2);
  kitchenItems(f, S, L);
  ceilingLamp(f, S, L.kitchen, 4.8, 1.4);
};

/** Living room: the balcony glazing at Y 9.20 (cool glass, mullions), the sofa (open at the near end so the seated figure
 *  stays in front), the side table with the food. */
const living = (f: Flat, S: Section, L: Lights) => {
  const {P} = S;
  livingFloorWall(f, S, L);
  f.fill(dim('#2d3a40', L.living), [P(9.2, 0, 0), P(9.2, 2.6, 0), P(9.2, 2.6, BACK), P(9.2, 0, BACK)]);
  for (const d of [1.07, 2.13]) f.line([P(9.2, 0, d), P(9.2, 2.6, d)], 1, INK_LIGHT, false);
  f.fill(dim('#8a7456', L.living), [P(7.40, 0.85, 0.4), P(7.40, 0.85, 2.0), P(7.40, 0, 2.0), P(7.40, 0, 0.4)]);
  f.fill(dim('#9d8561', L.living), [P(7.25, 0.85, 0.4), P(7.40, 0.85, 0.4), P(7.40, 0.85, 2.0), P(7.25, 0.85, 2.0)]);
  f.fill(dim('#a58e6b', L.living), [P(8.10, 0.45, 0.4), P(8.10, 0.45, 2.0), P(8.10, 0, 2.0), P(8.10, 0, 0.4)]);
  f.fill(dim('#b9a47f', L.living), [P(7.40, 0.45, 0.4), P(8.10, 0.45, 0.4), P(8.10, 0.45, 2.0), P(7.40, 0.45, 2.0)]);
  box(f, S, [8.30, 8.70], [0.50, 0.90], [0, 0.50], keyFaces('#7d6a52', (c) => dim(c, L.living), 1, '#8f7b5e'));
  const a = P(8.50, 0.62, 0.66), n = P(8.36, 0.62, 0.84), c = P(8.62, 0.62, 0.58);
  f.fill(dim('#9a3f2e', L.living), ell(a[0], a[1], 9, 9, 10), 2); // apple
  f.fill(dim('#c9a66b', L.living), [[n[0] - 8, n[1]], [n[0] + 8, n[1] - 3], [n[0] + 6, n[1] + 12], [n[0] - 6, n[1] + 14]], 2); // nuts bag
  f.fill(dim('#8f9aa0', L.living), [[c[0] - 4, c[1]], [c[0] + 4, c[1]], [c[0] + 4, c[1] + 16], [c[0] - 4, c[1] + 16]], 2); // can
  livingCurtains(f, S, L);
  ceilingLamp(f, S, L.living, 7.6, 1.6);
};

/** The unit strip from the entry to the balcony glazing: neighbours, rooms, partitions, fixtures, ceiling lamps. */
/** The solid objects of the unit that cast on their room's floor (`LT-03`), by room: entry cabinet; bathroom basin, cistern and bowl;
 *  kitchen fridge and counter; living sofa and side table. The stove case sits on a shelf and casts no floor shadow. */
const CASTERS: {room: [number, number]; boxes: Caster[]}[] = [
  {room: [0.18, 1.5], boxes: [{y: [0.18, 0.58], d: [0.35, 1.15], z: [0, 1.2]}]},
  {room: [1.6, 3.3], boxes: [{y: [1.7, 2.05], d: [2.75, 3.2], z: [0, 0.85]}, {y: [2.15, 2.45], d: [3.0, 3.2], z: [0.4, 0.8]}, {y: [2.15, 2.45], d: [2.45, 3.0], z: [0, 0.4]}]},
  {room: [3.4, 5.7], boxes: [{y: [3.4, 4.05], d: [1.0, 1.6], z: [0, 1.7]}, {y: [4.15, 5.6], d: [2.6, 3.2], z: [0, 0.9]}]},
  {room: [5.7, 9.2], boxes: [{y: [7.25, 8.1], d: [0.4, 2.0], z: [0, 0.85]}, {y: [8.3, 8.7], d: [0.5, 0.9], z: [0, 0.5]}, {y: [8.92, 9.1], d: [0.22, 0.42], z: [0, 0.22]}]},
];

/** Extra shadow casters for one plate (B09's props and its seated figure): painted in the shadow pass, before every box and the figure. */
export type UnitExtra = {casters?: Caster[]; casts?: {polys: Pt[][]; floor: string}[]};

export const paintUnit = (ctx: PaintContext, S: Section, L: Lights, base = 1000, extra: UnitExtra = {}) => {
  const f = flatKit(ctx, base);
  neighbours(f, S, L);
  roomShell(f, S, 0.18, 1.5, L.entry, CREAM.wall);
  roomShell(f, S, 1.6, 3.3, L.bath, CREAM.partition);
  wainscot(f, S, L);
  roomShell(f, S, 3.4, 5.7, L.kitchen, '#d2c6ab');
  roomShell(f, S, 5.7, 9.2, L.living, '#d8cdb4');
  // Detail pass (b): tile grout on each floor, plaster joints on each ceiling (hairlines, Boss pass 5).
  floorGrout(f, S, 0.18, 1.5, BACK, dim(CREAM.tile, L.entry));
  floorGrout(f, S, 1.6, 3.3, BACK, dim(CREAM.tile, L.bath));
  floorGrout(f, S, 3.4, 5.7, BACK, dim(CREAM.tile, L.kitchen));
  floorGrout(f, S, 5.7, 9.2, BACK, dim(CREAM.tile, L.living));
  ceilingSeams(f, S, 0.18, 9.2, BACK, dim(CREAM.ceiling, L.entry));
  const lights = [L.entry, L.bath, L.kitchen, L.living];
  const floors = [CREAM.tile, CREAM.tile, CREAM.tile, CREAM.tile];
  CASTERS.forEach((r, i) => castFloor(f, S, r.boxes, dim(floors[i], lights[i]), r.room, undefined, BACK));
  if (extra.casters) castFloor(f, S, extra.casters, dim(CREAM.tile, L.entry), [0.18, 1.5], undefined, BACK);
  for (const group of extra.casts ?? []) for (const poly of group.polys) f.fill(castTone(group.floor), poly);
  partition(f, S, 1.5, L.entry);
  partition(f, S, 3.3, L.kitchen);
  entry(f, S, L);
  bathroom(f, S, L);
  kitchen(f, S, L);
  living(f, S, L);
  roomAccents(f, S, L);
  return f;
};

/** Bathroom extras for the truck (B04-SH01): the running shower tap on the back wall and its stream to the drain. */
export const paintBathTap = (ctx: PaintContext, S: Section, L: Lights, base = 1400) => {
  const f = flatKit(ctx, base);
  const {P} = S;
  f.fill(dim('#e9e6d6', L.bath), [P(2.0, 2.4, BACK), P(2.6, 2.4, BACK), P(2.6, 1.9, BACK), P(2.0, 1.9, BACK)], 2); // louvre window
  const h = P(3.0, 1.0, BACK - 0.1);
  f.fill(dim('#9aa3a8', L.bath), [P(2.95, 1.05, BACK - 0.04), P(3.05, 1.05, BACK - 0.04), P(3.05, 0.92, BACK - 0.04), P(2.95, 0.92, BACK - 0.04)], 2);
  f.fill(dim('#7f8a90', L.bath), ell(h[0], h[1] + 2, 6, 6, 8), 2);
  for (const [y, w] of [[2.96, 0], [3.0, 1], [3.04, 2]] as const) {
    const pts: Pt[] = [];
    for (let i = 0; i <= 10; i++) pts.push(P(y + 0.01 * Math.sin(i + w), 0.95 - (0.95 * i) / 10, 3.1));
    f.line(pts, 1.2, INK_LIGHT, false);
  }
};
