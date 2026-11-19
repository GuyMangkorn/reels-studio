import {ell, hardFill, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {paintBox, qx, qy, qz, wFill, wInk, wWash, type Box} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintJar, paintShirt} from './r4-cast';

// EDU-EP26-SHORT BRIEF-R4 VD26-18: the new workshop, a sun-baked Roman fullery (`new: fullonica-r4`), designed from SCRIPT-R2 first.
// Space W (metres): origin at the floor in the middle of the room; +x screen right from the intake camera, +y up, +z toward the intake
// camera (the doorway side is -x). Room x -3.0..+3.0, z -3.2..+2.4, ceiling 3.4. Back wall z -3.2 holds three masonry tread stalls
// (STALLS) with chest-high partitions the treader braces on; a light well opens in the roof over them. Left wall: the street doorway
// (z -0.3..+1.1). Right wall: the jar corner and a shelf. Rinse cistern along the left wall at the back (F002, "อีกอ่าง").
// Folding bench in the middle; two drying poles overhead with dyed cloth. Light: `FullLight`.

export type FullLight = {
  /** 'morning' warm sun shaft from the well (B01-B02), 'setback' grey-green cast in the stalls (B03), 'door' backlit doorway with a dim well,
   *  'evening' (B04, Boss W5.2): the door balance warmed gold, a long low beam through the street door across the floor, long shadows
   *  toward +x, dust motes in the beam and a dimmed well. */
  mood: 'morning' | 'setback' | 'door' | 'evening';
  /** Seconds, for the drifting dust motes of `evening` (0 = still). */
  t?: number;
  /** Draft thumbnail: flat washes, no small props or grout. */
  draft?: boolean;
};

export const STALLS: {x0: number; x1: number}[] = [{x0: -1.75, x1: -0.80}, {x0: -0.65, x1: 0.30}, {x0: 0.45, x1: 1.40}];
export const STALL_Z0 = -3.2, STALL_Z1 = -2.30, STALL_RIM = 0.62, STALL_WALL = 1.08, LIQUID = 0.36;
/** The customer's shirt hangs on the back pole here (B04-SH01: x, y of the pole, z). */
export const SHIRT_POLE: V3 = [-0.9, 2.6, -1.25];
export const BENCH: Box = {x0: -0.80, x1: 0.80, z0: -0.70, z1: -0.12, y0: 0, y1: 0.86};
const ROOM = {x0: -3.0, x1: 3.0, z0: -3.2, z1: 2.4, h: 3.4};
const WELL = {x0: -1.4, x1: 1.2, z0: -3.0, z1: -1.7};
const DOOR = {z0: -0.3, z1: 1.1, h: 2.45};

export const PAL = {
  plaster: '#d9a65c', plasterLit: '#f2cf86', plasterShade: '#b98447', dado: '#a4472f', dadoShade: '#7f3426', brick: '#b5684a',
  floor: '#b7805e', floorShade: '#8e5f48', grout: '#946049', beam: '#5b3a28', sky: '#bcd8e4',
  stall: '#b39571', stallWet: '#7b664a', liquid: '#7c8a58', froth: '#dcdcc8', rinse: '#74afba',
  wood: '#8b5a37', woodLit: '#b47e50', cool: '#6d6478',
};

export const tone = (L: FullLight, c: string) => L.mood === 'setback' ? mixColor(c, '#7d8f7c', 0.28) : L.mood === 'door' ? mixColor(c, PAL.cool, 0.22)
  : L.mood === 'evening' ? mixColor(mixColor(c, '#6a4a5a', 0.2), '#d8913e', 0.16) : c;
/** The street door's light per mood: the outside wall, the lit strip and the floor spill colour and strength. */
const doorLight = (L: FullLight) => L.mood === 'evening' ? {out: '#ffc978', lit: '#ffd690', spill: '#ffc062', op: 215, sky: '#e7a77a'}
  : L.mood === 'door' ? {out: '#fbe6b8', lit: '#ffe9c0', spill: '#ffe3a6', op: 190, sky: PAL.sky} : {out: '#f4d9a4', lit: '#f0cf96', spill: '#ffe3a6', op: 120, sky: PAL.sky};

function paintShell(p: Painter, c: YCam, L: FullLight) {
  const t = (x: string) => tone(L, x);
  // floor (opus signinum: crushed terracotta with marble chips) and a worn wet patch in front of the stalls
  wFill(p, c, 30000, t(PAL.floor), qy(0, ROOM.x0, ROOM.x1, ROOM.z0, ROOM.z1));
  wWash(p, c, 30001, t(PAL.floorShade), 120, qy(0.002, -2.0, 1.8, -2.35, -1.2), 0.3, 0.5);
  wWash(p, c, 30002, '#6f6a64', 90, qy(0.003, -1.6, 1.3, -2.3, -1.7), 0.35, 0.5);
  if (!L.draft) {
    for (let i = 0; i < 46; i++) {
      const x = ROOM.x0 + 0.2 + hash(30010 + i) * 5.6, z = -3.0 + hash(30060 + i) * 5.2;
      if (Math.hypot(x - c.x, z - c.z) < 1.4) continue; // a 5 cm chip at arm's length paints as a stray shard (LF05 R5)
      wFill(p, c, 30110 + i, i % 3 ? '#cfa387' : '#e8d5c0', [[x, 0.004, z], [x + 0.05, 0.004, z + 0.01], [x + 0.03, 0.004, z + 0.04]]);
    }
  }
  // back wall: ochre plaster over a Pompeian red dado; peeled patch shows brick; damp tide line along the stalls
  wFill(p, c, 30200, t(PAL.plaster), qz(ROOM.z0, ROOM.x0, ROOM.x1, 0, ROOM.h));
  wFill(p, c, 30201, t(PAL.dado), qz(ROOM.z0 + 0.001, ROOM.x0, ROOM.x1, 0, 1.25));
  wFill(p, c, 30202, t(PAL.dadoShade), qz(ROOM.z0 + 0.002, ROOM.x0, ROOM.x1, 1.22, 1.3));
  wWash(p, c, 30203, t(PAL.plasterShade), 110, qz(ROOM.z0 + 0.002, ROOM.x0, ROOM.x1, 2.7, ROOM.h), 0.3, 0.5);
  wWash(p, c, 30204, t(PAL.brick), 170, [[1.75, 1.6, ROOM.z0 + 0.003], [2.35, 1.5, ROOM.z0 + 0.003], [2.5, 2.05, ROOM.z0 + 0.003], [2.1, 2.35, ROOM.z0 + 0.003], [1.7, 2.1, ROOM.z0 + 0.003]], 0.12, 0.5);
  if (!L.draft) for (let r = 0; r < 4; r++) wInk(p, c, 30205 + r, [[1.8 + 0.05 * r, 1.65 + 0.16 * r, ROOM.z0 + 0.004], [2.35, 1.62 + 0.17 * r, ROOM.z0 + 0.004]], {closed: false, color: '#8a4a36', weight: 1.1});
  wWash(p, c, 30210, '#5b4a3e', 90, qz(ROOM.z0 + 0.003, -1.9, 1.55, 1.25, 1.55), 0.4, 0.55);
  // left wall with the street doorway
  const lw = t(mixColor(PAL.plaster, PAL.plasterShade, 0.45));
  wFill(p, c, 30220, lw, qx(ROOM.x0, 0, ROOM.h, ROOM.z0, DOOR.z0));
  wFill(p, c, 30221, lw, qx(ROOM.x0, 0, ROOM.h, DOOR.z1, ROOM.z1));
  wFill(p, c, 30222, lw, qx(ROOM.x0, DOOR.h, ROOM.h, DOOR.z0, DOOR.z1));
  wFill(p, c, 30223, t(PAL.dado), qx(ROOM.x0 + 0.001, 0, 1.25, ROOM.z0, DOOR.z0));
  wFill(p, c, 30224, t(PAL.dado), qx(ROOM.x0 + 0.001, 0, 1.25, DOOR.z1, ROOM.z1));
  // the doorway: the bright street outside (a sunlit wall across the street, a strip of sky)
  const D = doorLight(L);
  wFill(p, c, 30230, D.out, qx(ROOM.x0 - 0.3, 0, DOOR.h, DOOR.z0 - 0.2, DOOR.z1 + 0.2));
  wFill(p, c, 30231, '#c99a66', qx(ROOM.x0 - 3.0, 0, 3.2, DOOR.z0 - 3, DOOR.z1 + 3));
  wFill(p, c, 30232, D.lit, qx(ROOM.x0 - 2.99, 0.5, 2.2, DOOR.z0 - 0.6, DOOR.z1 + 0.8));
  wFill(p, c, 30233, D.sky, qx(ROOM.x0 - 2.98, 2.5, 4.0, DOOR.z0 - 3, DOOR.z1 + 3));
  wFill(p, c, 30234, '#8c6a52', qy(0.001, ROOM.x0 - 3.0, ROOM.x0, DOOR.z0 - 2, DOOR.z1 + 2));
  wFill(p, c, 30235, t('#7a4a34'), [[ROOM.x0, 0, DOOR.z0], [ROOM.x0 + 0.18, 0, DOOR.z0], [ROOM.x0 + 0.18, DOOR.h, DOOR.z0], [ROOM.x0, DOOR.h, DOOR.z0]]);
  wFill(p, c, 30236, t('#6a4030'), qy(DOOR.h, ROOM.x0, ROOM.x0 + 0.18, DOOR.z0, DOOR.z1));
  // sun spill through the door onto the floor
  if (L.mood === 'evening') paintEveningBeam(p, c, L, D.spill, D.op);
  else wWash(p, c, 30237, D.spill, D.op, [[ROOM.x0, 0.004, DOOR.z0], [ROOM.x0, 0.004, DOOR.z1], [ROOM.x0 + 1.9, 0.004, DOOR.z1 + 0.7], [ROOM.x0 + 2.2, 0.004, DOOR.z0 + 0.2]], 0.3, 0.4);
  // right wall
  wFill(p, c, 30240, t(PAL.plasterShade), qx(ROOM.x1, 0, ROOM.h, ROOM.z0, ROOM.z1));
  wFill(p, c, 30241, t(PAL.dadoShade), qx(ROOM.x1 - 0.001, 0, 1.25, ROOM.z0, ROOM.z1));
  // ceiling: dark beams and the light well
  wFill(p, c, 30250, t('#6e4a34'), qy(ROOM.h, ROOM.x0, ROOM.x1, ROOM.z0, ROOM.z1));
  wFill(p, c, 30251, L.mood === 'door' ? '#9fb6c2' : L.mood === 'evening' ? '#b98a78' : PAL.sky, qy(ROOM.h + 0.01, WELL.x0, WELL.x1, WELL.z0, WELL.z1));
  for (let i = 0; i < 7; i++) {
    const z = ROOM.z0 + 0.25 + i * 0.8;
    if (z > WELL.z0 && z < WELL.z1) continue;
    paintBox(p, c, 30260 + i * 10, {x0: ROOM.x0, x1: ROOM.x1, y0: ROOM.h - 0.18, y1: ROOM.h, z0: z, z1: z + 0.16}, t(PAL.beam), {bottom: -0.25, front: 0.1});
  }
}

/** `evening`: the low sun through the street door, a long gold beam across the floor toward the stalls and the bench (+x), the beam's
 *  volume in the air, and the long cool shadows the bench and the stall partitions throw away from the door. */
function paintEveningBeam(p: Painter, c: YCam, L: FullLight, col: string, op: number) {
  const y = 0.004;
  wWash(p, c, 30237, col, op, [[ROOM.x0, y, DOOR.z0], [ROOM.x0, y, DOOR.z1], [ROOM.x0 + 4.6, y, DOOR.z1 + 0.55], [ROOM.x0 + 5.0, y, DOOR.z0 - 0.35]], 0.25, 0.35);
  wWash(p, c, 30238, '#fff0c0', 120, [[ROOM.x0, y + 0.001, DOOR.z0 + 0.25], [ROOM.x0, y + 0.001, DOOR.z1 - 0.25], [ROOM.x0 + 3.2, y + 0.001, DOOR.z1 + 0.1], [ROOM.x0 + 3.4, y + 0.001, DOOR.z0]], 0.3, 0.4);
  // the beam's volume: door top to the far end of the floor patch, faint
  wWash(p, c, 30239, '#ffd890', 55, [[ROOM.x0, DOOR.h, DOOR.z0], [ROOM.x0, DOOR.h, DOOR.z1], [ROOM.x0 + 4.6, y, DOOR.z1 + 0.55], [ROOM.x0 + 5.0, y, DOOR.z0 - 0.35]], 0.3, 0.3);
  // long shadows thrown away from the door by the bench legs and the stool
  for (const [i, [x, z]] of [[BENCH.x0 + 0.1, BENCH.z1 - 0.06], [BENCH.x0 + 0.1, BENCH.z0 + 0.06], [-2.42, -0.75]].entries())
    wWash(p, c, 30245 + i, '#4a3a4a', 90, [[x, y + 0.002, z - 0.05], [x, y + 0.002, z + 0.05], [x + 1.9, y + 0.002, z + 0.2], [x + 1.9, y + 0.002, z + 0.08]], 0.2, 0.4);
  if (L.draft) return;
  // dust motes drifting in the beam (seeded positions, a slow drift with t; direct-seekable)
  const t = L.t ?? 0;
  for (let i = 0; i < 26; i++) {
    const s = hash(30270 + i), h = 0.25 + 1.9 * hash(30300 + i), x = ROOM.x0 + 0.3 + 3.8 * s, zz = DOOR.z0 + 1.2 * hash(30330 + i) + 0.35 * s;
    const yy = Math.min(DOOR.h * (1 - s * 0.95), h) + 0.04 * Math.sin(t * 0.9 + i), xx = x + 0.05 * Math.sin(t * 0.6 + i * 1.7);
    const q = camPoint(c, [xx, yy, zz]);
    if (!q) continue;
    const r = Math.max(1.2, 0.006 * camUnit(c, [xx, yy, zz]));
    washAt(p, 30360 + i, '#fff2c8', 170, ell(q[0], q[1], r, r, 8), 0.2, 0.3);
  }
}

/** The sun shaft from the light well down onto the stalls (morning) or a pale skylight cast (door, setback). */
function paintShaft(p: Painter, c: YCam, L: FullLight) {
  if (L.mood === 'evening') return; // the well is dim at dusk: the light is the door beam
  const col = L.mood === 'morning' ? '#fff0b8' : L.mood === 'setback' ? '#dfe6c8' : '#e8eef0';
  const op = L.mood === 'morning' ? 95 : 45, dx = 0.55, dz = 0.35;
  wWash(p, c, 30300, col, op, [[WELL.x0, ROOM.h, WELL.z0], [WELL.x1, ROOM.h, WELL.z0], [WELL.x1 + dx, 0.05, WELL.z0 + dz], [WELL.x0 + dx, 0.05, WELL.z0 + dz]], 0.25, 0.3);
  wWash(p, c, 30301, col, Math.round(op * 0.7), [[WELL.x0, ROOM.h, WELL.z1], [WELL.x1, ROOM.h, WELL.z1], [WELL.x1 + dx, 0.05, WELL.z1 + dz], [WELL.x0 + dx, 0.05, WELL.z1 + dz]], 0.25, 0.3);
  wWash(p, c, 30302, L.mood === 'morning' ? '#ffe7a0' : col, L.mood === 'morning' ? 150 : 70, qy(0.006, WELL.x0 + dx, WELL.x1 + dx, WELL.z0 + dz + 0.6, WELL.z1 + dz), 0.3, 0.35);
}

/** One masonry tread stall: front wall to `STALL_RIM`, partitions to `STALL_WALL`, the liquid at `LIQUID` (`part` 'back' | 'front'). */
export function paintStall(p: Painter, c: YCam, k: number, L: FullLight, part: 'back' | 'front', liquidFrom = STALL_Z0, onLiquid?: (p: Painter, c: YCam, k: number) => void) {
  const s = STALLS[k], id = 30400 + k * 60, t = (x: string) => tone(L, x);
  if (part === 'back') {
    wFill(p, c, id, t('#4e5a55'), qy(0.05, s.x0, s.x1, STALL_Z0, STALL_Z1));
    wFill(p, c, id + 1, t(PAL.liquid), qy(LIQUID, s.x0, s.x1, liquidFrom, STALL_Z1 - 0.1));
    wWash(p, c, id + 2, t(PAL.froth), 140, qy(LIQUID + 0.002, s.x0 + 0.02, s.x1 - 0.02, STALL_Z0 + 0.02, STALL_Z0 + 0.16), 0.2, 0.5);
    wWash(p, c, id + 3, '#b9c9b9', 60, qy(LIQUID + 0.003, s.x0 + 0.2, s.x1 - 0.25, -2.95, -2.6), 0.3, 0.5);
    // a wad of cloth in the liquid (the work being trodden), half under the surface so it reads as sunk cloth, not a pale slab (R5)
    const xm = (s.x0 + s.x1) / 2;
    wFill(p, c, id + 4, t(mixColor('#d8cdb4', PAL.liquid, 0.5)), Array.from({length: 9}, (_, i): V3 => {
      const a = (i / 9) * 6.283, r = 0.85 + 0.3 * hash(id + 80 + i);
      return [xm + Math.cos(a) * 0.3 * r, LIQUID + 0.01, -2.77 + Math.sin(a) * 0.17 * r];
    }));
    wWash(p, c, id + 5, '#9a9480', 120, [[s.x0 + 0.3, LIQUID + 0.013, -2.9], [s.x1 - 0.3, LIQUID + 0.013, -2.9], [s.x1 - 0.25, LIQUID + 0.013, -2.7]], 0.2, 0.4);
    // partitions (left and right) as boxes: plaster above, wet dark below the rim
    for (const [j, x] of [[0, s.x0 - 0.12], [1, s.x1]] as const) {
      if (k > 0 && j === 0) continue; // shared with the neighbour's right partition
      const b: Box = {x0: x, x1: x + 0.12, y0: 0, y1: STALL_WALL, z0: STALL_Z0, z1: STALL_Z1};
      paintBox(p, c, id + 10 + j * 8, b, t(PAL.stall), {left: -0.12, right: -0.18, top: 0.1});
      wWash(p, c, id + 16 + j, t(PAL.stallWet), 140, qz(STALL_Z1 + 0.002, x, x + 0.12, 0.02, STALL_RIM + 0.08), 0.15, 0.5);
    }
    return;
  }
  wFill(p, c, id + 30, t(PAL.liquid), qy(LIQUID, s.x0, s.x1, liquidFrom, STALL_Z1 - 0.1));
  wWash(p, c, id + 31, '#c4d2c2', 70, qy(LIQUID + 0.003, s.x0 + 0.05, s.x1 - 0.05, liquidFrom, liquidFrom + 0.1), 0.3, 0.5);
  // inner face of the front wall above the liquid (shadowed) and a froth line where the liquid meets it
  wFill(p, c, id + 33, t('#9c8466'), qz(STALL_Z1 - 0.1, s.x0, s.x1, LIQUID, STALL_RIM));
  wWash(p, c, id + 34, t(PAL.froth), 170, qy(LIQUID + 0.004, s.x0, s.x1, STALL_Z1 - 0.16, STALL_Z1 - 0.1), 0.15, 0.4);
  if (!L.draft) for (let r = 0; r < 3; r++) {
    const z = liquidFrom + 0.1 + r * 0.12, xm = (s.x0 + s.x1) / 2;
    wInk(p, c, id + 50 + r, [[xm - 0.3 + r * 0.05, LIQUID + 0.005, z], [xm - 0.05, LIQUID + 0.005, z + 0.02], [xm + 0.25 - r * 0.04, LIQUID + 0.005, z]], {closed: false, color: '#c8d6cc', weight: 1.4});
  }
  onLiquid?.(p, c, k);
  const fw: Box = {x0: s.x0 - 0.12, x1: s.x1 + 0.12, y0: 0, y1: STALL_RIM, z0: STALL_Z1 - 0.1, z1: STALL_Z1};
  paintBox(p, c, id + 32, fw, t(PAL.stall), {front: -0.05, top: 0.12, left: -0.15, right: -0.15});
  wWash(p, c, id + 40, t(PAL.stallWet), 150, qz(STALL_Z1 + 0.002, s.x0 - 0.12, s.x1 + 0.12, 0.0, 0.22), 0.25, 0.5);
  wWash(p, c, id + 41, t('#9b876c'), 110, qz(STALL_Z1 + 0.003, s.x0 + 0.1, s.x0 + 0.35, 0.22, STALL_RIM - 0.05), 0.3, 0.5);
  if (L.draft) return;
  // splash-darkened rim and drip runs down the front face (wet masonry, not a pale slab; LF05 R5)
  wWash(p, c, id + 42, t(PAL.stallWet), 130, qy(STALL_RIM + 0.002, s.x0 - 0.1, s.x1 + 0.1, STALL_Z1 - 0.1, STALL_Z1), 0.3, 0.5);
  for (let r = 0; r < 5; r++) {
    const x = s.x0 + 0.08 + r * (s.x1 - s.x0 - 0.16) / 4 + 0.04 * (hash(id + 60 + r) - 0.5), len = 0.12 + 0.22 * hash(id + 66 + r);
    wWash(p, c, id + 70 + r, t(PAL.stallWet), 120, [[x - 0.018, STALL_RIM, STALL_Z1 + 0.003], [x + 0.018, STALL_RIM, STALL_Z1 + 0.003], [x + 0.01, STALL_RIM - len, STALL_Z1 + 0.003], [x - 0.006, STALL_RIM - len - 0.02, STALL_Z1 + 0.003]], 0.2, 0.4);
  }
}

function paintRinse(p: Painter, c: YCam, L: FullLight) {
  const t = (x: string) => tone(L, x), b: Box = {x0: -2.95, x1: -2.15, y0: 0, y1: 0.8, z0: -3.0, z1: -1.55};
  paintBox(p, c, 30600, b, t('#c7ab86'), {front: -0.08, right: -0.15, top: 0.1});
  wFill(p, c, 30610, t(PAL.rinse), qy(0.72, b.x0 + 0.08, b.x1 - 0.08, b.z0 + 0.08, b.z1 - 0.08));
  wWash(p, c, 30611, '#d8f0f0', 120, qy(0.721, b.x0 + 0.2, b.x1 - 0.2, b.z0 + 0.3, b.z0 + 0.7), 0.3, 0.4);
  // bronze spout from the wall with a clear stream
  wFill(p, c, 30612, '#7b6a3a', [[-2.99, 1.25, -2.3], [-2.7, 1.2, -2.3], [-2.7, 1.14, -2.3], [-2.99, 1.17, -2.3]]);
  wWash(p, c, 30613, '#e8f6f4', 170, [[-2.72, 1.16, -2.3], [-2.68, 1.16, -2.3], [-2.66, 0.73, -2.3], [-2.74, 0.73, -2.3]], 0.1, 0.2);
}

function paintBench(p: Painter, c: YCam, L: FullLight) {
  const t = (x: string) => tone(L, x);
  paintBox(p, c, 30700, {...BENCH, y0: 0.78}, t(PAL.wood), {front: -0.15, left: -0.1, right: -0.2, top: 0.12});
  for (const [i, x] of [BENCH.x0 + 0.06, BENCH.x1 - 0.14].entries()) {
    paintBox(p, c, 30710 + i * 8, {x0: x, x1: x + 0.08, y0: 0, y1: 0.78, z0: BENCH.z1 - 0.1, z1: BENCH.z1 - 0.02}, t('#6e4529'), {front: -0.1});
    paintBox(p, c, 30730 + i * 8, {x0: x, x1: x + 0.08, y0: 0, y1: 0.78, z0: BENCH.z0 + 0.02, z1: BENCH.z0 + 0.1}, t('#5e3a22'), {front: -0.1});
  }
  if (!L.draft) {
    for (let i = 0; i < 5; i++) wInk(p, c, 30750 + i, [[BENCH.x0 + 0.05, 0.861, BENCH.z0 + 0.1 + i * 0.1], [BENCH.x1 - 0.05, 0.861, BENCH.z0 + 0.12 + i * 0.1]], {closed: false, color: '#6e4529', weight: 1});
  }
}

/** Folded cloth stack (UT12 prop: the customers' wash waiting) on the bench's left end. */
function paintStack(p: Painter, c: YCam, at: V3) {
  const cols = ['#d9cdb4', '#b07a5a', '#cfa868', '#e2d8c4'];
  cols.forEach((col, i) => {
    const y = at[1] + i * 0.05;
    paintBox(p, c, 30800 + i * 8, {x0: at[0] - 0.17, x1: at[0] + 0.17, y0: y, y1: y + 0.045, z0: at[2] - 0.13, z1: at[2] + 0.13}, col, {front: -0.12, top: 0.1, right: -0.15});
  });
}

export function paintBasket(p: Painter, c: YCam, at: V3, seed: number) {
  const g = camPoint(c, at), top = camPoint(c, [at[0], at[1] + 0.26, at[2]]);
  if (!g || !top) return;
  const r = 0.22 * camUnit(c, at);
  washAt(p, seed, '#3e2c26', 110, ell(g[0] + r * 0.15, g[1] + 2, r * 1.2, r * 0.25, 16), 0.2, 0.3);
  hardFill(p, seed + 1, '#b58a4e', [[top[0] - r, top[1]], [top[0] + r, top[1]], [g[0] + r * 0.82, g[1]], [g[0] - r * 0.82, g[1]]]);
  for (let i = 1; i < 4; i++) wInk(p, c, seed + 2 + i, [[at[0] - 0.2, at[1] + i * 0.065, at[2] + 0.2], [at[0] + 0.2, at[1] + i * 0.065, at[2] + 0.2]], {closed: false, color: '#7d5a30', weight: 1});
  hardFill(p, seed + 8, '#7d5a30', ell(top[0], top[1], r, r * 0.2, 16));
  hardFill(p, seed + 9, '#efe6d2', ell(top[0] + r * 0.1, top[1] - r * 0.04, r * 0.75, r * 0.14, 14));
}

/** Two drying poles with dyed and white cloth hanging; `zs` the pole depths. */
function paintPoles(p: Painter, c: YCam, L: FullLight, only: number, shirt = false) {
  const t = (x: string) => tone(L, x);
  const cloths: [number, number, number, string][] = [
    [-2.4, -1.75, -1.25, '#e3a43c'], [-1.6, -0.9, -1.25, '#f0ebe0'], [-0.7, 0.1, -1.25, '#b84a3c'], [0.35, 1.05, -1.25, '#f0ebe0'], [1.3, 2.0, -1.25, '#5a77a0'],
    [-2.2, -1.4, 1.4, '#f0ebe0'], [-1.1, -0.45, 1.4, '#d78b3a'], [1.0, 1.8, 1.4, '#9a3f4a'], [2.0, 2.7, 1.4, '#f0ebe0'],
  ];
  for (const z of [-1.25, 1.4].filter((z) => z === only)) {
    paintBox(p, c, 30900 + (z > 0 ? 20 : 0), {x0: ROOM.x0, x1: ROOM.x1, y0: 2.6, y1: 2.66, z0: z - 0.03, z1: z + 0.03}, t(PAL.woodLit), {bottom: -0.2});
  }
  cloths.forEach(([x0, x1, z, col], i) => {
    if (z !== only) return;
    if (shirt && z === SHIRT_POLE[2] && x1 > SHIRT_POLE[0] - 0.35 && x0 < SHIRT_POLE[0] + 0.35) return; // the customer's shirt hangs here
    const drop = (z > 0 ? 0.45 : 0.75) + 0.25 * hash(30950 + i), id = 30960 + i * 6;
    wFill(p, c, id, t(col), [[x0, 2.6, z], [x1, 2.6, z], [x1 - 0.02, 2.6 - drop, z + 0.02], [(x0 + x1) / 2, 2.6 - drop - 0.06, z + 0.03], [x0 + 0.02, 2.6 - drop + 0.03, z + 0.02]]);
    wWash(p, c, id + 1, mixColor(t(col), '#000000', 0.25), 120, [[x0 + (x1 - x0) * 0.55, 2.6, z + 0.005], [x1, 2.6, z + 0.005], [x1 - 0.02, 2.6 - drop, z + 0.025], [x0 + (x1 - x0) * 0.62, 2.6 - drop, z + 0.025]], 0.15, 0.4);
    wWash(p, c, id + 2, mixColor(t(col), '#ffffff', 0.35), 110, [[x0 + 0.02, 2.58, z + 0.006], [x0 + (x1 - x0) * 0.3, 2.58, z + 0.006], [x0 + (x1 - x0) * 0.25, 2.6 - drop * 0.8, z + 0.02], [x0 + 0.03, 2.6 - drop * 0.85, z + 0.02]], 0.15, 0.4);
  });
}

/** The jar corner (right wall): three tall lidded jars on the floor, a shelf of small pots, a wooden paddle and a bucket. */
function paintJarCorner(p: Painter, c: YCam, L: FullLight) {
  const t = (x: string) => tone(L, x);
  paintBox(p, c, 31000, {x0: 2.6, x1: 3.0, y0: 1.55, y1: 1.6, z0: -2.9, z1: -1.2}, t(PAL.wood), {front: -0.1, left: 0.05});
  if (!L.draft) for (let i = 0; i < 4; i++) paintJar(p, c, [2.8, 1.6, -2.7 + i * 0.42], 31010 + i * 20, {h: 0.2, w: 0.16, lid: i % 2 ? 'on' : 'off', lit: 0.5});
  [[2.55, -2.75], [2.2, -2.55], [2.62, -2.2]].forEach(([x, z], i) => paintJar(p, c, [x, 0, z], 31100 + i * 20, {h: 0.62, w: 0.44, lid: 'on', lit: 0.6}));
  if (L.draft) return;
  // wooden paddle leaning on the wall and a bucket
  wFill(p, c, 31200, t('#8a5a37'), [[2.9, 0, -1.55], [2.95, 0, -1.5], [2.98, 1.7, -1.75], [2.93, 1.7, -1.8]]);
  wFill(p, c, 31201, t('#9a6a40'), [[2.86, 0, -1.6], [2.99, 0, -1.45], [2.99, 0.35, -1.5], [2.88, 0.35, -1.62]]);
  paintBox(p, c, 31210, {x0: 2.1, x1: 2.4, y0: 0, y1: 0.3, z0: -1.55, z1: -1.25}, t('#7a5434'), {front: -0.1, top: 0.15});
  wFill(p, c, 31220, t(PAL.liquid), qy(0.27, 2.13, 2.37, -1.52, -1.28));
}

/** Sandals parked on the first partition top (B03 continuity), the senior's stool by the door. */
function paintSmallProps(p: Painter, c: YCam, L: FullLight) {
  if (L.draft) return;
  const t = (x: string) => tone(L, x);
  paintBox(p, c, 31300, {x0: -2.6, x1: -2.25, y0: 0.36, y1: 0.42, z0: -0.9, z1: -0.6}, t(PAL.wood), {front: -0.1, top: 0.1});
  for (const [i, [x, z]] of [[-2.58, -0.88], [-2.3, -0.88], [-2.58, -0.65], [-2.3, -0.65]].entries())
    paintBox(p, c, 31310 + i * 6, {x0: x, x1: x + 0.04, y0: 0, y1: 0.36, z0: z, z1: z + 0.04}, t('#5e3a22'));
  // a broom against the left wall by the rinse
  wFill(p, c, 31340, t('#8a6a3a'), [[-2.95, 0, -1.2], [-2.9, 0, -1.15], [-2.97, 1.5, -1.3], [-2.99, 1.5, -1.33]]);
  wFill(p, c, 31341, t('#c9a35a'), [[-2.97, 0, -1.3], [-2.85, 0, -1.05], [-2.9, 0.4, -1.12], [-2.98, 0.4, -1.25]]);
}

export type FullSetOpts = {
  /** Figures and props painted inside the depth order: `between` after the stalls' back parts (people standing in the stalls), then the stall front walls. */
  inStalls?: (p: Painter, c: YCam) => void;
  /** Painted after the bench (people and props in the room). */
  room?: (p: Painter, c: YCam) => void;
  /** Painted before the bench (people standing behind the bench). */
  behindBench?: (p: Painter, c: YCam) => void;
  /** Skip the poles (close shots under them). */
  noPoles?: boolean;
  stallLiquidFrom?: number[];
  /** Painted on each stall's liquid surface, after the treaders and before the front wall (ripples, foam, submerged shins; LF05 R5). */
  onLiquid?: (p: Painter, c: YCam, k: number) => void;
  /** Painted right after the back wall and stalls' back parts, before the treaders (hanging cloth over the stalls in close shots). */
  backDress?: (p: Painter, c: YCam) => void;
  /** Painted last, over everything (foreground floor props in close shots). */
  foreground?: (p: Painter, c: YCam) => void;
  /** B04-SH01 (Boss W5.2): the customer's dried ivory shirt hanging on the back pole (z -1.25) at x -0.9 (the pole cloth there is moved off). */
  shirtOnPole?: boolean;
  /** B04-SH01 draft fix B: keep the pole gap of `shirtOnPole` without painting the shirt (the shot paints it in hand; no cloth pops in). */
  shirtGap?: boolean;
};

export function paintFullonica(p: Painter, c: YCam, L: FullLight, o: FullSetOpts = {}) {
  paintShell(p, c, L);
  paintShaft(p, c, L);
  paintRinse(p, c, L);
  paintJarCorner(p, c, L);
  STALLS.forEach((_, k) => paintStall(p, c, k, L, 'back'));
  o.backDress?.(p, c);
  o.inStalls?.(p, c);
  STALLS.forEach((_, k) => paintStall(p, c, k, L, 'front', o.stallLiquidFrom?.[k], o.onLiquid));
  paintSmallProps(p, c, L);
  if (!o.noPoles) paintPoles(p, c, L, -1.25, o.shirtOnPole || o.shirtGap);
  if (!o.noPoles && o.shirtOnPole) paintShirt(p, c, [SHIRT_POLE[0] - 0.3, 2.58, SHIRT_POLE[2] + 0.04], [SHIRT_POLE[0] + 0.3, 2.58, SHIRT_POLE[2] + 0.04], 0.72, 31500, {lit: L.mood === 'evening' ? 0.8 : 0.3, warm: L.mood === 'evening'});
  o.behindBench?.(p, c);
  paintBench(p, c, L);
  if (!L.draft) {
    paintStack(p, c, [0.58, 0.86, -0.52]);
    paintBasket(p, c, [0.95, 0, -0.1], 31400);
  }
  o.room?.(p, c);
  if (!o.noPoles && c.z > 1.6) paintPoles(p, c, L, 1.4);
  o.foreground?.(p, c);
}

/** Picture point of a world anchor (throws when the anchor is behind the lens: a staging error). */
export const at2 = (c: YCam, v: V3): Pt => {
  const q = camPoint(c, v);
  if (!q) throw new Error(`EDU26 R4 anchor behind the camera: ${v.join(',')}`);
  return q;
};
