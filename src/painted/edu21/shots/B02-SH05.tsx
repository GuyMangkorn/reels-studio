import {camMove, camOf} from '../../kit/cam-moves';
import {inkLine, washAt} from '../../kit/draw';
import {hash} from '../../kit/hash';
import type {Painter, Pt} from '../../kit/painter';
import {wp} from '../../kit/world';
import {camPoint, type YCam} from '../../kit/ycam';
import {paintCabinFront} from '../cabin';
import {clipPolyPainter, ghPt, greenhouseFaces} from '../car';
import {armFk, HANDS, paintDriverAt, type DriverState} from '../driver';
import {paintExterior, paintRain} from '../exterior';
import {makeShot} from '../shot';

// B02-SH05 · G315-408 · "wait…" (L04). EDU-EP21-SHEETS-R1 shot block; Boss W5.2 BG2, 2026-11-16.
// Camera `cam((-0.15, 1.10, 0.38), 90->84, 1.6->1.45, 1.15, 1000, 620)` over L0-93, linear: the lens over the bonnet, outside the glass.
// DRIVER front view through the windscreen (cabin `paintCabinFront`), rain running down the glass painted after her, glass sheen 22 %.
// Looks: up at the lining L5-15 (head pitch up 15 deg, eyes up); to the door frame L30-45 (head 20 deg toward +z = screen left, eyes to
// (-0.10, 1.10, 0.80)); right elbow pulls in from the door panel L50-60 (under the dash from this lens); `neutral` to L4, `suspicious`
// L5-49, `worried` L50-93.
// Boss cheat (recorded, Film Q6): on the four-head card her chin (y 0.955) sits under the wheel top (1.11) and the cluster hood (1.075),
// and her shoulders (0.87) under the dash top (1.0), so from this lens the dash cut her off at the chin and the wheel and hood crossed her
// mouth (r1 frames: a floating head, ~150 px of figure). This lens lowers the dash front edge, the cluster hood and the wheel 0.26 m
// (`cheat.dashDy`; 0.20 left the visible figure at 427-493 px, under the 480 lead), which gives the sheet's "the wheel rim crosses her lower chest; cluster hood below her chin"; no other shot sees the
// front of the dash. Near plane 0.05 m so the bonnet runs to the frame bottom; the car's wheels and body outline are off (beside and behind
// the lens, `bonnetLens`); the cabin is clipped to the windscreen; the bonnet is wet and in shade (caption band).

const CAM = camMove([-0.15, 1.1, 0.38], [90, 84], [1.6, 1.45], 1.15, {f: 1000, hy: 620});
const N = 93;
const ease = (x: number) => { const k = Math.min(1, Math.max(0, x)); return k * k * (3 - 2 * k); };
/** Hold envelope: in over [a, a + i), held, out over [b, b + o). */
const env = (L: number, a: number, i: number, b: number, o: number) => (L < b ? ease((L - a) / i) : 1 - ease((L - b) / o));

export const driverSH05 = (L: number): DriverState => {
  const up = env(L, 5, 4, 15, 5), door = env(L, 30, 4, 45, 5), tuck = ease((L - 50) / 10);
  const out = {...HANDS.thighs, r: {via: [-0.13, -0.2] as Pt, to: HANDS.thighs.r.to}};
  const hands = {...HANDS.thighs, r: armFk(out.r, HANDS.thighs.r, tuck)};
  return {
    face: L < 5 ? 'neutral' : L < 50 ? 'suspicious' : 'worried', hands, tint: 0.14,
    headPitch: -0.26 * up, nod: [-0.07 * door, -0.03 * up],
    faceState: {look: [-0.75 * door, -0.85 * up + 0.15 * door]},
  };
};

/** Rain running down the windscreen on G (seek-safe), painted over her and the glass. */
const windscreenRain = (p: Painter, c: YCam, t: number) => {
  for (let k = 0; k < 34; k++) {
    const s = 0.08 + 0.84 * hash(52100 + k * 3), sp = 0.18 + 0.22 * hash(52101 + k * 3), len = 0.06 + 0.1 * hash(52102 + k * 3);
    const v = 0.08 + 0.86 * (1 - ((((hash(52103 + k) + t * sp) % 1) + 1) % 1));
    const pts: Pt[] = [];
    for (let m = 0; m <= 4; m++) {
      const q = camPoint(c, ghPt('windscreen', s + 0.004 * Math.sin(m * 1.9 + k), Math.min(0.95, v + (len * m) / 4)));
      if (q) pts.push(q);
    }
    if (pts.length >= 2) inkLine(p, 52200 + k, pts, {closed: false, color: '#aebccb', weight: 1.4, still: true, curve: 0.4});
  }
};

export const shot = makeShot({
  id: 'B02-SH05', N, paper: '#262e38',
  paint: (p, L, G) => {
    const c = {...camOf(CAM, L / N), near: 0.05}, t = G / 30, s = driverSH05(L);
    const glass = greenhouseFaces()[0].pts;
    paintExterior(p, c, {t, tufts: [], car: {glassOp: 56, bonnetLens: true,
      inside: (q, cc) => paintCabinFront(clipPolyPainter(q, wp(cc, glass)), cc, {t, cheat: {dashDy: -0.26}, driver: (r, c2) => paintDriverAt(r, c2, s, {t})})}});
    // the wet bonnet in shade under the storm, a cool sky catch along the windscreen base
    const bon = wp(c, [[1.02, 0.952, -0.86], [1.02, 0.952, 0.86], [2.0, 0.84, 0.86], [2.0, 0.84, -0.86]]);
    washAt(p, 52001, '#1c0909', 200, bon, 0.25, 0.3);
    washAt(p, 52002, '#7d8a9c', 40, wp(c, [[1.06, 0.924, -0.8], [1.06, 0.924, 0.8], [1.2, 0.912, 0.8], [1.2, 0.912, -0.8]]), 0.3, 0.3);
    windscreenRain(p, c, t);
    paintRain(p, t);
  },
});
