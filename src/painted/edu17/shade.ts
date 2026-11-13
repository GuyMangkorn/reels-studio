// EDU-EP17: painted aerial / lens shade shared by the map shots and the SH04 crowd (Boss, group 2; moved out of look-a-map.ts so a crowd shot does not import the map bake).
import {hardFill} from '../kit/draw';
import type {Painter} from '../kit/painter';

/** Stepped dark bands toward the bottom of the frame (keeps the caption band mid-dark). `amount` is the total darkening at the bottom (`n` bands of `step` px, 8 of 25 by default). */
export const bottomShade = (p: Painter, y0: number, amount: number, seed = 99000, color = '#0c1820', n = 8, step = 25) => {
  const a = 1 - Math.pow(1 - amount, 1 / n), W = 1080, H = 1920;
  for (let i = 0; i < n; i++) { const y = y0 + step * i; hardFill(p.layer(a, seed + i), seed + i, color, [[-30, y], [W + 30, y], [W + 30, H + 30], [-30, H + 30]]); }
};
