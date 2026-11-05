import {drawFigure} from '../kit/cast';
import type {CastDef} from '../kit/cast';
import {ell, glaze, hardFill, inkLine, INK, solid, washAt} from '../kit/draw';
import {EXPRESSIONS, type ExpressionId} from '../kit/expressions';
import {mixColor, tintPainter, type Painter, type Pt} from '../kit/painter';
import {poseFor} from '../kit/poses';
import {CSH2, MAN, shopper} from './cast';

// `new: memory-bubble` pair (brief EDU-BRIEF-R1.1 VD12): screen-space painted bubbles with brush edges and three trailing puffs
// toward MAN's head. Left: hot red, sharp ink, a long wait (MAN steaming). Right: pale grey, soft, a smooth checkout (MAN happy);
// it fades a little (`fade` 1 -> 0.4) but never disappears. Subjective by form: no text, no clock, no numbers. Look-defining asset
// written for W3; Boss hardens it at W5.2.

const scallop = (cx: number, cy: number, rx: number, ry: number, bumps: number, amp: number, phase: number): Pt[] =>
  Array.from({length: 72}, (_, i): Pt => {
    const a = (i / 72) * Math.PI * 2, r = 1 + amp * Math.sin(bumps * a + phase);
    return [cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r];
  });
const bubbleWobble = (cx: number, cy: number, rx: number, ry: number, k: number): Pt[] =>
  Array.from({length: 40}, (_, i): Pt => {
    const a = (i / 40) * Math.PI * 2, r = 1 + 0.035 * Math.sin(3 * a + k) + 0.02 * Math.sin(7 * a + k * 2);
    return [cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r];
  });

const mini = (p: Painter, def: CastDef, x: number, y: number, u: number, face: ExpressionId, t: number, key: number, view: 'front' | 'left' | 'right' = 'front') => {
  washAt(p, key, '#6b5b45', 60, ell(x, y, 0.28 * u, 0.06 * u, 12), 0.2, 0.3);
  const pose = poseFor('P01', def, [x, y], u, view);
  drawFigure(p, def, [x, y], u, {...pose, face: EXPRESSIONS[face]}, t);
};

const steam = (p: Painter, x: number, y: number, s: number, seed: number) => {
  for (const [dx, dy, r] of [[-1, 0, 20], [-1.5, -0.7, 15], [1, 0, 20], [1.5, -0.7, 15], [0, -1.2, 18]] as [number, number, number][]) {
    hardFill(p, seed + Math.round(dx * 7 + dy * 3 + 20), '#fff3ee', ell(x + dx * s, y + dy * s, r * 0.9, r * 0.75, 12));
    inkLine(p, seed + 40 + Math.round(dx * 7 + dy * 3 + 20), ell(x + dx * s, y + dy * s, r * 0.9, r * 0.75, 12), {weight: 0.9, color: '#8a2a20'});
  }
};

/** Hot bubble: centre (cx, cy). */
export const paintHotBubble = (p: Painter, cx: number, cy: number, rx: number, ry: number, t: number) => {
  const shape = scallop(cx, cy, rx, ry, 9, 0.045, 0.6);
  washAt(p, 7100, '#e8503c', 150, shape, 0.1, 0.35);
  solid(p, 7101, '#f7a98e', scallop(cx, cy + ry * 0.12, rx * 0.86, ry * 0.8, 7, 0.03, 1.1), 2, 0.05, 0.2);
  // floor, a counter block at the right, a queue of small shoppers, and MAN steaming in front
  const fy = cy + ry * 0.62;
  solid(p, 7110, '#b8432f', [[cx - rx * 0.85, fy], [cx + rx * 0.85, fy], [cx + rx * 0.85, fy + ry * 0.4], [cx - rx * 0.85, fy + ry * 0.4]], 2, 0.05, 0.2);
  solid(p, 7111, '#3a3f47', [[cx + rx * 0.5, fy - ry * 0.34], [cx + rx * 0.9, fy - ry * 0.34], [cx + rx * 0.9, fy], [cx + rx * 0.5, fy]], 2);
  [['woman-curly', -0.62], ['man-elder', -0.28], ['man-spiky', 0.08]].forEach(([id, dx], i) => mini(p, shopper(id as 'woman-curly'), cx + (dx as number) * rx, fy - 8 - i * 4, 0.52 * ry * 1.1, 'angry', t, 7120 + i, 'right'));
  mini(p, MAN, cx + rx * 0.14, fy + ry * 0.2, 0.62 * ry * 1.25, 'furious', t, 7140);
  steam(p, cx + rx * 0.14, cy - ry * 0.28, 22, 7150);
  // heat: red glaze over the whole memory, then heavy sharp ink on the cloud edge
  glaze(p, 7160, '#d9301f', 70, shape, {border: 0});
  inkLine(p, 7161, shape, {weight: 3.4, color: '#7a1a12'});
  inkLine(p, 7162, scallop(cx, cy, rx * 0.97, ry * 0.97, 9, 0.045, 0.6), {weight: 1.3, color: '#7a1a12'});
  // trailing puffs toward MAN's head (down and to the right)
  [[cx + rx * 0.48, cy + ry * 1.04, 28], [cx + rx * 0.66, cy + ry * 1.22, 19], [cx + rx * 0.78, cy + ry * 1.36, 11]].forEach(([x, y, r], i) => {
    hardFill(p, 7170 + i * 2, mixColor('#e8503c', '#fff3ee', 0.35), ell(x, y, r, r, 14));
    inkLine(p, 7171 + i * 2, ell(x, y, r, r, 14), {weight: 2.4 - i * 0.4, color: '#7a1a12'});
  });
};

/** Pale bubble: soft edges, grey-blue, faint. `fade` 1 -> 0.4 over the beat (never 0). */
export const paintPaleBubble = (p: Painter, cx: number, cy: number, rx: number, ry: number, t: number, fade = 0.8) => {
  const q = tintPainter(p, '#e6eaef', 0.45);
  const shape = bubbleWobble(cx, cy, rx, ry, 1.3);
  washAt(p, 7200, '#dfe5ec', 120 * fade + 40, shape, 0.5, 0.6);
  washAt(p, 7201, '#f2f4f7', 120 * fade, bubbleWobble(cx, cy + ry * 0.05, rx * 0.85, ry * 0.82, 2.1), 0.6, 0.6);
  const fy = cy + ry * 0.6;
  solid(q, 7210, '#cfd6de', [[cx - rx * 0.85, fy], [cx + rx * 0.85, fy], [cx + rx * 0.85, fy + ry * 0.4], [cx - rx * 0.85, fy + ry * 0.4]], 2, 0.05, 0.3);
  solid(q, 7211, '#b9c4cc', [[cx - rx * 0.92, fy - ry * 0.34], [cx - rx * 0.5, fy - ry * 0.34], [cx - rx * 0.5, fy], [cx - rx * 0.92, fy]], 2, 0.05, 0.3);
  mini(q, CSH2, cx - rx * 0.62, fy - 6, 0.5 * ry * 1.1, 'happy', t, 7220, 'right');
  mini(q, MAN, cx + rx * 0.1, fy + ry * 0.18, 0.6 * ry * 1.25, 'happy', t, 7230);
  glaze(p, 7240, '#f4f6f9', 50 + 40 * (1 - fade), shape, {border: 0});
  inkLine(p, 7241, shape, {weight: 1.3, color: mixColor('#9aa6b2', '#ffffff', 1 - fade)});
  [[cx - rx * 0.46, cy + ry * 1.04, 24], [cx - rx * 0.62, cy + ry * 1.2, 16], [cx - rx * 0.74, cy + ry * 1.33, 9]].forEach(([x, y, r], i) => {
    hardFill(p, 7250 + i * 2, '#eef1f5', ell(x, y, r, r, 14));
    inkLine(p, 7251 + i * 2, ell(x, y, r, r, 14), {weight: 1.1, color: '#9aa6b2'});
  });
  void INK;
};
