import type {PaintContext} from '../BrushCanvas';
import {ramp, type Pt} from '../painter';
import {drawFig, H6, type Fig} from './body6';
import {bustFig, keyTravel} from './bust';
import {YOU} from './cast';
import {castTone, cel} from './light';
import {CREAM, dim, flatKit, type Flat} from './sets';
import {placeHead, toHU} from './closeups';

// ZCPAINT B06-SH02 (Boss pass 10; sheet `sc01-b06-b08.md`, SS-R1.3): the over-the-shoulder close into the fridge, one quick open. The
// back bust (`bust.ts`) at the left edge (head about 250 px, K about 110), the left hand on the door's free edge, the right hand on the
// leftovers box with the yogurt cup. The interior is dark: no lamp, only the daylight spill on the food tops (`KEY-INS-DAY`). Shared plate.

/** Staging (sheet): head centre (165, 345) at a 250 px head; the fridge x 330-900, y 300-800 (interior x 380-860), the door swings right. */
const HEAD = {x: 165, y: 345, px: 250};
const K = HEAD.px / H6;
const DIR = 1 as const;
/** Door handle (the free edge, plate px) and the box with the cup inside (plate px). */
const HANDLE: Pt = [352, 600];
const BOX: Pt = [520, 640];

/** Left hand: on the handle for pf 0-6 (the pull) and 32-41 (the shut); hangs otherwise. Right hand: the box from pf 6-24, then holds it. */
const leftReach = (pf: number) => pf <= 41;
const rightReach = (pf: number) => pf >= 6;

const fridge = (f: Flat) => {
  // Kitchen wall (cream, dim), the floor below.
  f.fill(dim('#d9ccb0', 1.0), [[-100, -100], [1200, -100], [1200, 1100], [-100, 1100]]);
  f.fill(dim(CREAM.tile, 0.8), [[-100, 1100], [1200, 1100], [1200, 2000], [-100, 2000]]);
  // Fridge body (white, the side in cel) and the dark interior with shelves.
  f.fill('#e6e3da', [[330, 300], [900, 300], [900, 1100], [330, 1100]]);
  f.fill(cel('#e6e3da'), [[820, 300], [900, 300], [900, 1100], [820, 1100]]);
  f.fill('#2e3640', [[380, 300], [860, 300], [860, 800], [380, 800]]);
  for (const y of [420, 540, 660]) f.line([[380, y], [860, y]], 0.8, '#4d5866', false);
  // Daylight spill on the food tops (the interior is never lit by a lamp): yogurt cups and the leftovers rest on the shelves.
  f.fill('#c9d3dc', [[420, 430], [470, 430], [470, 452], [420, 452]]);
  f.fill('#b9c6cf', [[700, 430], [760, 430], [760, 452], [700, 452]]);
  f.fill('#c9d3dc', [[520, 560], [600, 560], [600, 580], [520, 580]]);
  // The open door, hinged on the right, swung toward the viewer (x 900-1080).
  f.fill('#eeebe2', [[900, 320], [1080, 360], [1080, 1080], [900, 1100]]);
  f.fill(cel('#eeebe2'), [[1000, 360], [1080, 360], [1080, 1080], [1000, 1080]]);
  f.line([[900, 320], [1080, 360], [1080, 1080], [900, 1100]], 1.0);
  // Handle on the free edge (the left): a dark bar.
  f.fill('#6b7079', [[340, 560], [352, 560], [352, 640], [340, 640]]);
};

/** The back bust's placement (its head offsets do not move with the arms); the hand targets are solved in its frame. */
const REF = placeHead(bustFig(YOU, {view: 'back'}), HEAD.x, HEAD.y, K, DIR);
/** The figure: the back bust, arms reaching to the handle and the box by key (the left is the screen-left arm, his left). */
const figure = (pf: number): Fig => {
  const L = leftReach(pf) ? {kind: 'reach' as const, to: toHU(REF, HANDLE), hand: 'mitten' as const} : {kind: 'hang' as const, hand: 'mitten' as const};
  const R = rightReach(pf) ? {kind: 'reach' as const, to: toHU(REF, BOX), hand: 'mitten' as const} : {kind: 'hang' as const, hand: 'mitten' as const};
  return bustFig(YOU, {view: 'back', arms: {L, R}});
};

/** B06-SH02 (shared plate, TH 63 f, EN cuts at f 45): the fridge open, the hands at the door and the box. */
export const paintB06Sh02 = (ctx: PaintContext, pf: number) => {
  const f = flatKit(ctx, 38000);
  fridge(f);
  const fig = figure(pf);
  drawFig(ctx, 38400, fig, REF, {light: keyTravel(1, [-0.9, 0.3])});
  // The box with the cup in the right hand (after pf 6 it rests in the hand; before, on the shelf).
  const g = ramp(pf, 6, 24);
  const bx = BOX[0], by = BOX[1] - 20 * g;
  f.fill('#d8c39a', [[bx - 44, by - 30], [bx + 44, by - 30], [bx + 44, by + 30], [bx - 44, by + 30]]);
  f.fill(cel('#d8c39a'), [[bx + 18, by - 30], [bx + 44, by - 30], [bx + 44, by + 30], [bx + 18, by + 30]]);
  f.fill('#f4f1ea', [[bx - 18, by - 46], [bx + 18, by - 46], [bx + 18, by - 30], [bx - 18, by - 30]]);
  f.fill(castTone('#2e3640'), [[bx - 40, by + 30], [bx + 44, by + 30], [bx + 30, by + 38], [bx - 50, by + 38]]);
};
