import type {PaintContext} from '../BrushCanvas';
import {ramp} from '../kit/painter';
import {flatKit, type Flat} from './sets';
import type {Pt} from '../kit/painter';

// ZCPAINT B04-SH02 tank diagram (painted schematic plate, lighter paper `#e6dcc6`, no figures, generic tower only).
// Built step by step on the mechanism lines; the labels are Remotion text (S-08, not built here). Steps per language
// (pf = plate frame): TH 0 / 23 / 51 / 95 / drain 155-230 / refill strike 230 (SS-R1.6 retime); EN 0 / 19 / 64 / 87 / drain 132-196 / 196.

export const DIAGRAM_PAPER = '#e6dcc6';
type Keys = {pump: number; tank: number; power: number; drain: [number, number]; strike: number};
export const DIAGRAM_KEYS: Record<'TH' | 'EN', Keys> = {
  TH: {pump: 23, tank: 51, power: 95, drain: [155, 230], strike: 230},
  EN: {pump: 19, tank: 64, power: 87, drain: [132, 196], strike: 196},
};
const TANK = {x0: 432, x1: 568, y0: 330, y1: 405};
const LEVEL_TOP = (level: number) => TANK.y1 - level * (TANK.y1 - TANK.y0);

/** The first `u` (0-1) of a polyline, by arc length (the stroke reveal). */
const reveal = (pts: Pt[], u: number): Pt[] => {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = seg.reduce((a, b) => a + b, 0), want = total * u;
  const out: Pt[] = [pts[0]];
  let acc = 0;
  for (let i = 0; i < seg.length; i++) {
    if (acc + seg[i] <= want) {
      out.push(pts[i + 1]);
      acc += seg[i];
    } else {
      const r = seg[i] > 0 ? (want - acc) / seg[i] : 0;
      out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r]);
      break;
    }
  }
  return out;
};

/** Straight dashes from `a` to `b` (`on` px drawn, `off` px gap): the sheet's dashed refill path, drawn as short flat strokes. */
const dashRun = (a: Pt, b: Pt, on = 14, off = 12): Pt[][] => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const at = (s: number): Pt => [a[0] + ((b[0] - a[0]) * s) / len, a[1] + ((b[1] - a[1]) * s) / len];
  const out: Pt[][] = [];
  for (let s = 0; s < len; s += on + off) out.push([at(s), at(Math.min(len, s + on))]);
  return out;
};

/** The painted crossed-bolt icon of the power-out label (`ไฟดับ` / `Power out`, sheet box x 140-370, y 720-790; the label text is Editor's). */
const powerIcon = (f: Flat) => {
  f.fill('#e5484d', [[178, 722], [160, 756], [171, 756], [162, 790], [190, 752], [178, 752], [186, 722]]);
  f.line([[146, 724], [200, 790]], 3, '#e5484d', false);
};

export const paintDiagram = (ctx: PaintContext, pf: number, lang: 'TH' | 'EN') => {
  const K = DIAGRAM_KEYS[lang];
  const f = flatKit(ctx, 9000);
  const line = (pts: Pt[], w = 2, color = '#2b211c', u = 1) => {
    if (u > 0) f.line(reveal(pts, u), w, color, false);
  };
  const step1 = ramp(pf, 0, 12);
  // Step 1: tower outline and the supply pipes on the left (12 f stroke reveal).
  line([[380, 830], [380, 410], [620, 410], [620, 830], [380, 830]], 2.2, '#2b211c', step1);
  line([[400, 330], [400, 830]], 1.6, '#2b211c', step1);
  line([[400, 560], [380, 560]], 1.6, '#2b211c', step1);
  line([[430, 405], [430, 330], [570, 330], [570, 405]], 2, '#2b211c', step1);
  // Step 2: pump box and the up-arrow to the tank.
  const pump = ramp(pf, K.pump, K.pump + 10);
  const pumpOn = pf >= K.power ? '#9aa0a2' : '#2b211c';
  line([[640, 760], [760, 760], [760, 830], [640, 830], [640, 760]], 2, pumpOn, pump);
  line([[700, 760], [700, 405]], 2, pf >= K.power ? '#9aa0a2' : '#2b211c', pump);
  line([[690, 420], [700, 405], [710, 420]], 2, pf >= K.power ? '#9aa0a2' : '#2b211c', pump);
  // Step 3: tank fills to 80 % and drains linearly to 25 % over the drain keys.
  const fill = ramp(pf, K.tank, K.tank + 12);
  let level = 0.8 * fill;
  if (pf > K.drain[0]) level = 0.8 - (0.55 * Math.min(1, (pf - K.drain[0]) / (K.drain[1] - K.drain[0])));
  if (level > 0.001 && fill > 0) {
    const top = LEVEL_TOP(level);
    f.fill('#7aa4b4', [[TANK.x0 + 2, top], [TANK.x1 - 2, top], [TANK.x1 - 2, TANK.y1 - 2], [TANK.x0 + 2, TANK.y1 - 2]], 2);
  }
  // Step 4: power out: the pump greys and the arrow stops (drawn above in pumpOn); the crossed-bolt icon appears with the label.
  if (pf >= K.power) powerIcon(f);
  // Step 6: the dashed refill path appears and is struck out (no refill).
  if (pf >= K.strike) {
    const s = ramp(pf, K.strike, K.strike + 12);
    for (const seg of [...dashRun([300, 760], [300, 430]), ...dashRun([300, 430], [420, 430])]) line(seg, 1.6, '#6d6a62', s);
    line([[330, 470], [260, 500]], 3, '#9a3f2e', s);
  }
};
