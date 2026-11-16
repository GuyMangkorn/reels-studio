import {hardFill} from '../kit/draw';
import {mixColor, type Painter} from '../kit/painter';
import {ellPts, glow, hn} from './scenery';

// Placeless macro space M (EDU-EP18-BRIEF-R1 N14, VD11; Film W3 look frame LF03B, 16 Nov 2026). Designed from the script before the kit: the
// strongest scale flip of the video (the deadliest animal is the smallest), so nothing places it: no room, no skin, only a dark field that is a
// little lighter behind the insect, a few far cool bokeh specks, and one cool rim light on the mosquito (kit mosquito.ts, MOSQ.rim).
// M: MILLIMETRES, the mosquito's own build space (kit/mosquito.ts, body centre at y MOSQ_Y0 = 8 mm); the field is picture-space (placeless).

export const MACRO = {inner: '#1a1d22', outer: '#0e1013', bokeh: '#a9c4e6', haze: '#2a3140'};

/** The dark radial field (stepped, papercut: flat ellipses from the outer to the inner tone) centred on picture point (cx, cy). */
export const paintMacroField = (p: Painter, cx: number, cy: number) => {
  hardFill(p, 58000, MACRO.outer, [[-200, -200], [1280, -200], [1280, 2120], [-200, 2120]]);
  for (let k = 0; k < 9; k++) {
    const u = k / 8, rx = 1250 - 1000 * u, ry = 1500 - 1150 * u;
    hardFill(p, 58010 + k, mixColor(MACRO.outer, MACRO.inner, Math.pow(u, 0.7)), ellPts(cx, cy, rx, ry, 48));
  }
  // far out-of-focus specks: cool, dim, soft (no place reads)
  for (let k = 0; k < 7; k++) {
    const x = 1080 * hn(58100 + k), y = 1900 * hn(58120 + k), r = 26 + 50 * hn(58140 + k);
    if (Math.abs(y - 1260) < 140 || (x < 330 && y < 160)) continue;
    glow(p, 58160 + k, mixColor(MACRO.haze, MACRO.bokeh, 0.3 * hn(58180 + k)), 40 + 40 * hn(58200 + k), ellPts(x, y, r, r, 24));
  }
};
