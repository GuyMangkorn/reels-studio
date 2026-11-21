import {ell, washAt} from '../../kit/draw';
import {mittenThumbSide} from '../../kit/hand-gestures';
import {frameOf} from '../../kit/hand-props';
import type {Pt} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {camPoint, camUnit} from '../../kit/ycam';
import {candleOn, KITCHEN_PAPER, kitchenPool, paintSeated} from '../kitchen31';
import {INK_PAPER, paintInkPaper} from '../props31';
import {WHEELER} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {camMove, ez, mix, mix2, mix3, poseShoulder, reachArm, segQuad} from '../stage31';

// B02-SH03 · F [503, 602) · ink on paper, then paper beside face (SCENE-R1 b02). Insert (L0-44): his two mittens hold `new: ink-paper` (A5) flat
// 0.09 m above the stub candle's flame tip (never touching); the brown scorch-tone smiley fades in L18-44 ("บนกระดาษ"). On "แต่" (L44) the camera
// pulls back and tilts up (L44-75) as he sits up and lifts the paper beside his face, upright to the lens, held by his LEFT mitten (screen right);
// the RIGHT mitten goes to the table at L60. Deadpan `smug` hold from L75: the same grin on the paper, nothing on his lemon-shiny face.
// Leaning in: his seat moves 0.22 m toward the table for the insert and back with the sit-up (L44-70), so both mittens reach the paper edges
// (the S1 seat is out of reach of a paper over the candle).
const N = 99, SHOT = 'B02-SH03';
const CAM = camMove({eye: [0.3, 0.95, 0.35], yaw: 0, pitch: -30, f: 1000, hy: 760, near: 0.05}, {eye: [0.15, 1.15, 0.7], yaw: 0, pitch: -4, f: 1000, hy: 640, near: 0.05}, 44, 75);
const P0: V3 = [0.25, 0.83, 0.1], P1: V3 = [0.22, 1.17, -0.6]; // P1 y 1.08 -> 1.17: beside the kit head (seated head centre about 1.2 m)
const seatAt = (L: number): V3 => [0, 0, mix(-0.48, -0.7, ez(L, 44, 70))];

export const def: Shot31 = {
  id: SHOT, N, paper: KITCHEN_PAPER, vignette: 0.5,
  cam: CAM,
  pool: (_L, c) => kitchenPool(c),
  paint: (p, L, c, pr) => {
    const t = L / 30, S = seatAt(L), u = camUnit(c, S);
    const lift = ez(L, 44, 70);
    const pc = mix3(P0, P1, lift), a = lift;
    const pf = frameOf(pc, [0, a, -(1 - a)], [0, 1 - a, a]);
    const edge = (sx: number): Pt => camPoint(c, [pc[0] + sx * INK_PAPER.w / 2, pc[1], pc[2]])!;
    const shR = poseShoulder(WHEELER, c, S, 'P31', 'front', 'r'), shL = poseShoulder(WHEELER, c, S, 'P31', 'front', 'l');
    const tableR = camPoint(c, [-0.15, 0.7, -0.25])!;
    // RIGHT mitten: paper's left edge (screen left) -> lets go at L56 -> on the table by L60; LEFT mitten: the right edge throughout
    const rTo = L < 56 ? edge(-1) : mix2(edge(-1), tableR, ez(L, 56, 62));
    const lTo = edge(1);
    const rA = reachArm(shR, rTo, u, 1, {fist: mittenThumbSide('right', 'back'), fore: 0.4});
    const lA = reachArm(shL, lTo, u, -1, {fist: mittenThumbSide('left', 'back'), fore: 0.4});
    const shine = ez(L, 60, 75);
    const an = paintSeated(p, c, {
      t, wheeler: {at: S, face: L >= 75 ? 'smug' : 'neutral', faceState: {look: L < 44 ? [0.2, 0.8] : [0, 0]}, fig: {rArm: rA.arm, lArm: lA.arm}},
      table: {camera: true, candle: candleOn(t)},
      onTable: (q) => paintInkPaper(q, c, 37700, pf, ez(L, 18, 44)),
      overTable: [segQuad(rA.arm.via!, rA.hand, 0.07 * u, 0.06 * u), segQuad(lA.arm.via!, lA.hand, 0.07 * u, 0.06 * u)],
      after: (q, a0) => {
        if (!a0 || shine <= 0) return;
        // lemon-shiny face: two wet highlights on the cheeks (no mark)
        const hr = (a0.chin - a0.headTop) / 2;
        for (const s of [-1, 1]) washAt(q, 37750 + (s > 0 ? 1 : 0), '#fff4d8', 70 * shine, ell(a0.head[0] + s * 0.52 * hr, a0.head[1] + 0.08 * hr, 0.05 * hr, 0.025 * hr, 10, -0.5 * s), 0.2, 0.1);
      },
    });
    if (pr) {
      const pp = camPoint(c, pc), fl = camPoint(c, [0.25, 0.738, 0.1]);
      if (pp) pr.lead('PAPER', {top: pp[1], bottom: pp[1], x: pp[0]});
      if (fl) pr.lead('FLAME', {top: fl[1], bottom: fl[1], x: fl[0]});
      if (an) { pr.lead('WHEELER', {top: an.top, bottom: an.bottom, x: an.head[0]}); pr.lead('HEAD', {top: an.headTop, bottom: an.chin, x: an.head[0]}); }
      pr.lead('ARM-R', {top: rA.ratio, bottom: 0}); pr.lead('ARM-L', {top: lA.ratio, bottom: 0});
      pr.lead('GAP', {top: (pc[1] - 0.738) * 100, bottom: 0, x: 0});
    }
  },
};
export const shot = makeShot(def);
