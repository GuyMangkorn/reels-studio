// N7 `new: bb ghost` (B01-SH08): a 6 mm orange BB ball drawn in flat ink, translucent (85 %), the comparison object beside the hero drop (the sting glyph is the DOM
// `StingGlyph` in diagram.tsx). Paints at anchor `g` (px) with `u` px per mm.
import {ell, inkLine, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {GIRL} from './palette';

export const BB = {orange: '#f08a3c', deep: '#c9611f', rim: '#ffd29a', ink: '#7a3410', mm: 6} as const;
export const paintBB = (p: Painter, g: Pt, u: number, seed = 29000) => {
  const r = (BB.mm / 2) * u, [x, y] = g;
  washAt(p, seed, BB.orange, 217, ell(x, y, r, r, 28), 0, 0);
  washAt(p, seed + 1, BB.deep, 190, ell(x + r * 0.12, y + r * 0.2, r * 0.8, r * 0.7, 24), 0, 0);
  washAt(p, seed + 2, mixColor(BB.orange, BB.rim, 0.5), 200, ell(x - r * 0.18, y - r * 0.22, r * 0.55, r * 0.5, 20), 0, 0);
  washAt(p, seed + 3, '#ffffff', 210, ell(x - r * 0.38, y - r * 0.46, r * 0.2, r * 0.12, 10, -0.5), 0, 0);
  inkLine(p, seed + 4, ell(x, y, r, r, 28), {weight: Math.max(1, r / 36), color: BB.ink, curve: 0.1, still: true});
};
/** Girl skin tone from the cast card (forearm band, hand macro tone). */
export const GIRL_SKIN = GIRL.head.skin;
