import {hardFill, inkLine} from '../kit/draw';
import type {Painter, Pt} from '../kit/painter';
import {EG_PAL} from './set';
import type {Cam} from './space';

// EG-EP01-SHORT elevated line + generic 3-car train (sc01 S01-B02-SH02, VD12; brief asset `drawViaductTrain`, Boss first
// version 3 Nov 2026). Feasibility finding: from the soi the near row (about 10 m) blocks any true 11 m deck behind it at
// every distance, and a deck in front of the row would be a 3 m wide streak. So the viaduct is a distant **sky card**: a girder
// band, pillars (which end behind the roofline) and the train, in plate px, hung on the camera tilt at a fixed elevation
// (`VIADUCT_ELEV`) so it enters from the top edge as the tilt rises and the row's roofline covers its lower part. The scene
// sheet's "deck about 11 m" is therefore not claimed as a measurement in this shot. Generic: no livery, no logo, no text,
// windows carry seat colour and glare only, never a silhouette (VD12).

/** Elevation (rad) of the deck top as seen from station A: the card sits there on screen when the camera pitch is `pitch`. */
export const VIADUCT_ELEV = (77 * Math.PI) / 180;
/** Car length incl. coupling gap, train length (px at f 950) and car height. Faces seen from below at ~60 deg are foreshortened: a 3.5 m car is ~0.45 of its side-on height (BTS angle fix, 3 Nov 2026). */
export const CAR_W = 700, TRAIN_W = CAR_W * 3 - 14, CAR_H = 240;
/** Detail scale of a car (the first version was 76 px tall; viewer check 3 Nov 2026: the train did not read, so it is 2x and the card sits higher). */
const KC = CAR_H / 76, DK = 1.3;

/** Screen y of the deck top for a camera with the given pitch (rad) and lens (px). */
export const deckTopY = (c: Cam) => c.hy - c.f * Math.tan(VIADUCT_ELEV - (c.pitch ?? 0));

/**
 * Paint the viaduct and train. `trainX` = left end of the train in plate px (it moves with time; the tail is trainX + TRAIN_W).
 * Pass `trainX` null for the empty viaduct. `panX` = horizontal slide of the whole card (the slow pan).
 * Perspective: the camera is pitched, so every vertical edge (car ends, window posts, pillars) leans to the zenith vanishing point
 * (the same convergence the storefront shows); the track runs parallel to the image plane so its edges stay level. Seen from below
 * the near fascia hides the car's roof and wheels; the deck soffit shows under it.
 */
export const paintViaductTrain = (p: Painter, c: Cam, trainX: number | null, panX = 0) => {
  const S = 7_800_000;
  const y = deckTopY(c);
  if (y < -400 || y > 2200) return;
  const X0 = -300 + panX, X1 = 1400 + panX;
  const vx = 540 + panX, vy = c.hy - c.f / Math.tan(Math.max(c.pitch ?? 0, 0.2));
  /** Point at plate x and screen y, with vertical lines through the baseline `y` leaning to the zenith VP. */
  const L = (x: number, yy: number): Pt => [vx + (x - vx) * ((yy - vy) / (y - vy)), yy];
  const poly = (xa: number, ya: number, xb: number, yb: number): Pt[] => [L(xa, ya), L(xb, ya), L(xb, yb), L(xa, yb)];
  // Pillars first (they run down behind the row's roofline), then soffit, fascia, parapet.
  for (let x = -200; x < 1500; x += 640) {
    const px = x + panX * 0.92;
    hardFill(p, S + 1 + x, '#838c90', [L(px - 34, y + 40), L(px + 34, y + 40), L(px + 44, y + 1400), L(px - 44, y + 1400)]);
    hardFill(p, S + 2 + x, '#b3babc', [L(px - 34, y + 40), L(px - 8, y + 40), L(px - 12, y + 1400), L(px - 44, y + 1400)]);
    inkLine(p, S + 3 + x, [L(px - 44, y + 1400), L(px - 34, y + 40), L(px + 34, y + 40), L(px + 44, y + 1400)], {color: EG_PAL.postInk, weight: 1.4, closed: false, curve: 0, still: true});
    // Pier cap: a dark crossbeam under the soffit, wider than the post, so the deck reads as carried on posts and not as a roof.
    hardFill(p, S + 4 + x, '#6c767a', [L(px - 78, y + 100 * DK), L(px + 78, y + 100 * DK), L(px + 78, y + 150 * DK), L(px - 78, y + 150 * DK)]);
    inkLine(p, S + 5 + x, [L(px - 78, y + 100 * DK), L(px + 78, y + 100 * DK), L(px + 78, y + 150 * DK), L(px - 78, y + 150 * DK)], {color: EG_PAL.postInk, weight: 1.4, curve: 0, still: true});
  }
  hardFill(p, S + 9, '#6f797d', [[X0, y + 40 * DK], [X1, y + 40 * DK], [X1, y + 120 * DK], [X0, y + 120 * DK]]);
  hardFill(p, S + 10, '#a4abad', [[X0, y + 40 * DK], [X1, y + 40 * DK], [X1, y + 78 * DK], [X0, y + 78 * DK]]);
  hardFill(p, S + 11, '#bcc2c4', [[X0, y], [X1, y], [X1, y + 40 * DK], [X0, y + 40 * DK]]);
  hardFill(p, S + 12, '#d3d7d7', [[X0, y - 9], [X1, y - 9], [X1, y], [X0, y]]);
  inkLine(p, S + 13, [[X0, y - 9], [X1, y - 9]], {color: EG_PAL.postInk, weight: 1.2, closed: false, curve: 0, still: true});
  inkLine(p, S + 14, [[X0, y + 40 * DK], [X1, y + 40 * DK]], {color: EG_PAL.postInk, weight: 1.2, closed: false, curve: 0, still: true});
  inkLine(p, S + 15, [[X0, y + 120 * DK], [X1, y + 120 * DK]], {color: EG_PAL.postInk, weight: 1.6, closed: false, curve: 0, still: true});
  if (trainX === null) return;
  const base = y - 9, top = base - CAR_H;
  const kk = KC;
  for (let k = 0; k < 3; k++) {
    const x0 = trainX + k * CAR_W, x1 = x0 + CAR_W - 14;
    if (x1 < -20 || x0 > 1100) continue;
    const w = x1 - x0;
    const vyT = vy - 1400; // car side only leans a third as much as the true zenith convergence (full lean read as a roof seen from above)
    const Lb = (x: number, yy: number): Pt => [vx + (x - vx) * ((yy - vyT) / (base - vyT)), yy];
    const q = (a: number, b: number, c2: number, d: number): Pt[] => [Lb(x0 + a, top + b), Lb(x0 + c2, top + b), Lb(x0 + c2, top + d), Lb(x0 + a, top + d)];
    hardFill(p, S + 20 + k * 40, '#c7d0d2', [Lb(x0 + 4 * kk, top), Lb(x1 - 4 * kk, top), Lb(x1, top + 8 * kk), Lb(x1, base), Lb(x0, base), Lb(x0, top + 8 * kk)]);
    hardFill(p, S + 21 + k * 40, '#6e9aa3', q(0, CAR_H - 17 * kk, w, CAR_H - 10 * kk));
    // Window strip (fix pass 1, 3 Nov 2026): pale sky-reflecting glass in wide panes, two darker door panels per car, a seat-back
    // shade under the glass, no glare diagonals and no cream blocks (they read as piano keys). No silhouettes.
    const n = 6, pw = (w - 44 * kk) / n;
    for (let i = 0; i < n; i++) {
      const wx = 22 * kk + i * pw, ww = pw - 3.5 * kk;
      const door = i === 1 || i === 4;
      hardFill(p, S + 22 + k * 40 + i, door ? '#7d8d94' : '#a9bec6', q(wx, 12 * kk, wx + ww, 52 * kk));
      if (!door) hardFill(p, S + 23 + k * 40 + i * 2, '#8197a0', q(wx, 40 * kk, wx + ww, 52 * kk));
      else inkLine(p, S + 24 + k * 40 + i * 3, [Lb(x0 + wx + ww / 2, top + 12 * kk), Lb(x0 + wx + ww / 2, top + 52 * kk)], {color: EG_PAL.postInk, weight: 1.2, closed: false, curve: 0, still: true});
    }
    inkLine(p, S + 30 + k * 40, [Lb(x0, top + 8 * kk), Lb(x0 + 4 * kk, top), Lb(x1 - 4 * kk, top), Lb(x1, top + 8 * kk), Lb(x1, base), Lb(x0, base)], {color: EG_PAL.postInk, weight: 1.2, curve: 0});
  }
  // Shade under the train on the fascia (hard band, no passenger anywhere).
  hardFill(p, S + 90, '#a9b0b2', [[Math.max(X0, trainX), y], [Math.min(X1, trainX + TRAIN_W), y], [Math.min(X1, trainX + TRAIN_W), y + 14], [Math.max(X0, trainX), y + 14]]);
};
