import type {FigAnchors} from '../kit/cast';
import {paintFigureAt, type FigureAtOpts} from '../kit/figure-at';
import type {Painter, Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, type YCam} from '../kit/ycam';
import {paintSorted, type Item} from '../kit/world';
import type {Pool31} from './overlay31';
import {paintCandle} from './props31';
import {kitchenTable, paintKitchenShell, paintPendant, WHEELER} from './set31';
import {clipPolyPainter, fig} from './stage31';

// EDU-EP31-SHORT Space H plate constants (Boss W5.2 batch 1, 2026-11-21): the kitchen values every B02/B03 plate shares (brief set plan H,
// SCENE-R1), so the same night reads the same in every shot. Positions in metres (y 0 = floor, table top y 0.68).

export const KITCHEN_PAPER = '#3a2e24';
/** Wheeler's seat S1 (ground point of the seated figure). */
export const S1: V3 = [0, 0, -0.7];
export const TABLE_Y = 0.68;
/** The stub candle of B02-SH03 on (brief: candle at (+0.25, 0.68, +0.10); flame tip 0.74 per the B02-SH03 sheet). */
export const CANDLE_AT: V3 = [0.25, TABLE_Y, 0.1];
export const candleOn = (t: number, lit = 1) => (p: Painter, c: YCam) => paintCandle(p, c, 37600, CANDLE_AT, t, lit);
/** The lemon half from the whisper shot (B02-SH01) on the oilcloth. */
export const LEMON_HALF_AT: V3 = [-0.47, 0.69, 0.16];
/** Tungsten pendant pool (LF03 `pool`): projected from a point under the lamp, radius scaled with the lens. */
export const kitchenPool = (c: YCam, at: V3 = [0, 0.95, -0.25], r = 560, op = 0.3): Pool31 | null => {
  const q = camPoint(c, at);
  return q ? {x: q[0], y: q[1], r: r * c.f / 1000, color: '255,205,130', op} : null;
};

export type SeatedOpts = {
  /** Wheeler's placement (at S1 unless set), seated P31 on the chair. */
  wheeler: Omit<FigureAtOpts, 'at' | 't'> & {at?: V3};
  t: number;
  /** kitchenTable options for this shot. */
  table?: Parameters<typeof kitchenTable>[0];
  /** Extra depth-sorted items (the FRIEND, props standing on the floor). */
  items?: Item[];
  /** Convex picture regions where Wheeler is repainted over the table (a forearm reaching onto the table top). */
  overTable?: Pt[][];
  /** Drawn after the table, before the repaint (props on the table that the reaching mitten grips). */
  onTable?: (p: Painter) => void;
  /** Drawn after the table and the repaint (props on the table in front of him). */
  after?: (p: Painter, a: FigAnchors | null) => void;
};
/** The kitchen at night with Wheeler seated at the table: shell, depth-sorted chair + Wheeler + table (+ items), the pendant, then the forearm
 *  repaint over the table (clipped second pass of the same figure, same seeds) and `after`. Returns Wheeler's anchors. */
export const paintSeated = (p: Painter, c: YCam, o: SeatedOpts): FigAnchors | null => {
  const out: {a?: FigAnchors | null} = {};
  const w = {seed: 3101, view: 'front' as const, pose: 'P31' as const, ...o.wheeler, at: o.wheeler.at ?? S1, t: o.t};
  paintKitchenShell(p, c);
  paintSorted(p, c, [fig(WHEELER, w, true, out), ...kitchenTable(o.table), ...(o.items ?? [])]);
  paintPendant(p, c);
  o.onTable?.(p);
  for (const poly of o.overTable ?? []) paintFigureAt(clipPolyPainter(p, poly), c, WHEELER, {...w, shadow: false});
  o.after?.(p, out.a ?? null);
  return out.a ?? null;
};
