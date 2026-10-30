import {mixColor} from '../kit/painter';
import {INK} from './ctx';
import {box, dim, type Flat, type Lights} from './sets';
import type {Section} from './space';

// ZCPAINT set detail pass (Boss pass 5, detail (a) lived-in items and (b) material lines; user 30 Oct 2026: "details
// ดีกว่านี้หน่อย", clean look "สะอาดแบบตัวละคร"). Rules: flat fills and hairline ink only (`flatKit`), no textured passes,
// no blotches. Story-neutral: no item sits on a clue prop (the tap and its stream, the fridge, the stove and food, the
// buckets, cans and phone, the trash bag, which stays inside the cabinet outline). Items are placed in section metres
// (Y along the section, z up, d depth; see space.ts), so the truck and the sheets' projections move them correctly.

/** Hairline colour: the surface colour mixed toward the ink (grain, grout, seams, folds). */
const line = (c: string, k = 0.3) => mixColor(c, INK, k);

/** Floor grout on a tile floor: hairlines every 0.6 m across one room (depth lines and Y lines). */
export const floorGrout = (f: Flat, S: Section, y0: number, y1: number, back: number, floor: string) => {
  const {P} = S, c = line(floor, 0.45);
  for (let d = 0.6; d < back - 0.05; d += 0.6) f.line([P(y0, 0, d), P(y1, 0, d)], 0.5, c, false);
  for (let y = Math.ceil(y0 / 0.6) * 0.6; y < y1; y += 0.6) f.line([P(y, 0, 0), P(y, 0, back)], 0.5, c, false);
};

/** Ceiling plaster joints every 1.2 m across the unit (ceiling z 2.6). */
export const ceilingSeams = (f: Flat, S: Section, y0: number, y1: number, back: number, ceil: string) => {
  const {P} = S, c = line(ceil, 0.35);
  for (let y = Math.ceil(y0 / 1.2) * 1.2; y < y1; y += 1.2) f.line([P(y, 2.6, 0), P(y, 2.6, back)], 0.5, c, false);
};

/** Entry, before the cabinet: light switch above the cabinet, door frame and hinge, wood grain on the door leaf, and a
 *  wall-hung shoe shelf above the cabinet's far end (Y 0.18-0.46, clear of the trash bag at Y 0.20-0.48 and of the caption block). */
export const entryWall = (f: Flat, S: Section, L: Lights) => {
  const {P} = S, light = L.entry;
  // Door frame: head and both jambs (wall-plane bands outside the leaf d 0.3-1.2), inked.
  const jamb = dim('#e6dbc2', light);
  f.fill(jamb, [P(0.18, 2.15, 0.18), P(0.18, 2.15, 1.32), P(0.18, 2.10, 1.32), P(0.18, 2.10, 0.18)]);
  f.fill(jamb, [P(0.18, 2.10, 0.18), P(0.18, 2.10, 0.30), P(0.18, 0, 0.30), P(0.18, 0, 0.18)]);
  f.fill(jamb, [P(0.18, 2.10, 1.20), P(0.18, 2.10, 1.32), P(0.18, 0, 1.32), P(0.18, 0, 1.20)]);
  f.line([P(0.18, 2.15, 0.18), P(0.18, 2.15, 1.32), P(0.18, 0, 1.32)], 0.8, INK, false);
  // Door leaf: wood grain (four hairlines across the visible upper leaf above the cabinet) and a hinge knuckle.
  const door = dim('#c4b392', light);
  for (const z of [1.35, 1.55, 1.75, 1.95]) f.line([P(0.18, z, 0.36), P(0.18, z + 0.02, 0.7), P(0.18, z, 1.14)], 0.45, line(door, 0.3), false);
  f.fill('#5b5650', [P(0.18, 1.92, 0.30), P(0.18, 1.92, 0.36), P(0.18, 1.78, 0.36), P(0.18, 1.78, 0.30)]);
  // Light switch plate and rocker, on the wall above the cabinet (z 1.28-1.40, d 1.95-2.03).
  const plate = dim('#efe9dc', light);
  f.fill(plate, [P(0.18, 1.40, 1.95), P(0.18, 1.40, 2.03), P(0.18, 1.28, 2.03), P(0.18, 1.28, 1.95)]);
  f.line([P(0.18, 1.40, 1.95), P(0.18, 1.40, 2.03), P(0.18, 1.28, 2.03), P(0.18, 1.28, 1.95)], 0.5);
  f.fill(dim('#cfc7b8', light), [P(0.18, 1.36, 1.97), P(0.18, 1.36, 2.01), P(0.18, 1.32, 2.01), P(0.18, 1.32, 1.97)]);
  // Shoe shelf by the door, wall-hung above the cabinet (z 1.42-1.48, clear of the caption block: a floor rack would sit
  // in y 1060-1248 at every truck position), with two pairs on it.
  box(f, S, [0.18, 0.46], [1.25, 1.85], [1.42, 1.48], {front: dim('#b29a72', light), top: dim('#c9b38c', light), side: dim('#8f7756', light)});
  box(f, S, [0.22, 0.36], [1.35, 1.55], [1.48, 1.54], {front: dim('#3d4a52', light), top: dim('#56646c', light), side: dim('#2c363c', light)});
  box(f, S, [0.24, 0.40], [1.60, 1.80], [1.48, 1.52], {front: dim('#e4e1d8', light), top: dim('#f0eee7', light), side: dim('#d2cfc5', light)});
};

/** Entry, after the cabinet: wood grain on the cabinet front (hairlines, no blotch). */
export const cabinetGrain = (f: Flat, S: Section, L: Lights) => {
  const {P} = S, c = line(dim('#cdb48c', L.entry), 0.3);
  // Upper front only (z 0.75-1.1, y below 1000 px): the caption block (y 1060-1248) stays clear of the grain.
  for (const z of [0.75, 0.95, 1.1]) f.line([P(0.22, z, 0.35), P(0.30, z + 0.01, 0.35), P(0.42, z - 0.01, 0.35), P(0.54, z, 0.35)], 0.45, c, false);
};

/** Bathroom, on the back wall: a shelf above the basin with two bottles, and a wall socket clear of the toilet. */
export const bathWall = (f: Flat, S: Section, L: Lights) => {
  const {P} = S, B = 3.19, light = L.bath;
  f.fill(dim('#b99c72', light), [P(1.72, 1.28, 3.2), P(2.02, 1.28, 3.2), P(2.02, 1.22, 3.2), P(1.72, 1.22, 3.2)]);
  f.fill(dim('#d7bf96', light), [P(1.72, 1.28, 2.9), P(2.02, 1.28, 2.9), P(2.02, 1.28, 3.2), P(1.72, 1.28, 3.2)]);
  f.fill(dim('#9fc2c9', light), [P(1.78, 1.42, B), P(1.84, 1.42, B), P(1.84, 1.28, B), P(1.78, 1.28, B)]);
  f.fill(dim('#3d4a52', light), [P(1.79, 1.45, B), P(1.83, 1.45, B), P(1.83, 1.42, B), P(1.79, 1.42, B)]);
  f.fill(dim('#e8e0c8', light), [P(1.90, 1.36, B), P(1.95, 1.36, B), P(1.95, 1.28, B), P(1.90, 1.28, B)]);
  f.fill(dim('#efe9dc', light), [P(2.72, 0.68, B), P(2.80, 0.68, B), P(2.80, 0.60, B), P(2.72, 0.60, B)]);
  f.line([P(2.72, 0.68, B), P(2.80, 0.68, B), P(2.80, 0.60, B), P(2.72, 0.60, B)], 0.5);
};

/** Kitchen, on the back wall and the counter: socket above the counter, a jar shelf above the fridge, a kettle and a
 *  dish rack (the fridge and the stove case stay as they are: they are clue props). */
export const kitchenItems = (f: Flat, S: Section, L: Lights) => {
  const {P} = S, B = 3.19, light = L.kitchen;
  f.fill(dim('#efe9dc', light), [P(4.36, 1.24, B), P(4.44, 1.24, B), P(4.44, 1.16, B), P(4.36, 1.16, B)]);
  f.line([P(4.36, 1.24, B), P(4.44, 1.24, B), P(4.44, 1.16, B), P(4.36, 1.16, B)], 0.5);
  f.fill(dim('#b99c72', light), [P(3.55, 1.98, 3.2), P(3.92, 1.98, 3.2), P(3.92, 1.94, 3.2), P(3.55, 1.94, 3.2)]);
  f.fill(dim('#9dbcb4', light), [P(3.60, 2.16, B), P(3.67, 2.16, B), P(3.67, 1.98, B), P(3.60, 1.98, B)]);
  f.fill(dim('#8a6d4b', light), [P(3.60, 2.20, B), P(3.67, 2.20, B), P(3.67, 2.16, B), P(3.60, 2.16, B)]);
  f.fill(dim('#d9b77d', light), [P(3.72, 2.11, B), P(3.80, 2.11, B), P(3.80, 1.98, B), P(3.72, 1.98, B)]);
  f.fill(dim('#e7e0cf', light), [P(3.84, 2.07, B), P(3.90, 2.07, B), P(3.90, 1.98, B), P(3.84, 1.98, B)]);
  box(f, S, [5.20, 5.36], [2.86, 2.98], [0.90, 1.16], {front: dim('#d6d2c6', light), top: dim('#e6e3da', light), side: dim('#b8b4a8', light)});
  box(f, S, [4.30, 4.52], [2.70, 3.02], [0.90, 0.96], {front: dim('#cfd3d4', light), top: dim('#e2e6e7', light), side: dim('#aab0b2', light)});
  box(f, S, [4.34, 4.36], [2.78, 2.98], [0.96, 1.14], {front: dim('#f0eee7', light), top: dim('#ffffff', light), side: dim('#d2cfc5', light)});
};

/** Living room floor, before the sofa: a rug on the tiles with one inner hairline, and the wall picture on the back wall. */
export const livingFloorWall = (f: Flat, S: Section, L: Lights) => {
  const {P} = S, light = L.living;
  const rug = dim('#b08a62', light);
  f.fill(rug, [P(5.90, 0, 0.50), P(7.10, 0, 0.50), P(7.10, 0, 2.70), P(5.90, 0, 2.70)]);
  f.line([P(5.90, 0, 0.50), P(7.10, 0, 0.50), P(7.10, 0, 2.70), P(5.90, 0, 2.70)], 0.6);
  f.line([P(6.10, 0, 0.80), P(6.90, 0, 0.80), P(6.90, 0, 2.40), P(6.10, 0, 2.40)], 0.4, line(rug, 0.3));
  f.fill(dim('#6e5a44', light), [P(6.40, 1.85, 3.19), P(6.95, 1.85, 3.19), P(6.95, 1.35, 3.19), P(6.40, 1.35, 3.19)]);
  f.fill(dim('#d9c9a3', light), [P(6.45, 1.80, 3.19), P(6.90, 1.80, 3.19), P(6.90, 1.40, 3.19), P(6.45, 1.40, 3.19)]);
  f.fill(dim('#9b7c58', light), [P(6.50, 1.42, 3.19), P(6.62, 1.62, 3.19), P(6.78, 1.42, 3.19)]);
};

/** Living room, after the glazing: two cream curtains in front of it at the room corners, with three folds each. */
export const livingCurtains = (f: Flat, S: Section, L: Lights) => {
  const {P} = S, light = L.living, c = dim('#e7dfcd', light), fold = line(c, 0.3);
  for (const [a, b] of [[0.05, 0.48], [2.72, 3.15]] as const) {
    f.fill(c, [P(9.12, 2.6, a), P(9.12, 2.6, b), P(9.12, 0, b), P(9.12, 0, a)]);
    for (const k of [0.25, 0.5, 0.75]) {
      const d = a + (b - a) * k;
      f.line([P(9.12, 2.55, d), P(9.12, 0.05, d + 0.02)], 0.45, fold, false);
    }
  }
};
