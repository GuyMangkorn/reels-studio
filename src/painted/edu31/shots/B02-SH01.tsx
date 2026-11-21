import {shoulderPoint} from '../../kit/cast';
import {hardFill, inkLine, openHandParts} from '../../kit/draw';
import {mittenThumbSide} from '../../kit/hand-gestures';
import type {Pt} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {candleOn, KITCHEN_PAPER, kitchenPool, LEMON_HALF_AT, paintSeated} from '../kitchen31';
import {FRIEND, paintLemonHalf} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {camMove, ez, fig, gu, mix} from '../stage31';

// B02-SH01 · F [332, 401) · the tip: whisper two-shot (SCENE-R1 b02, LF03). The LF03 staging (Film) with the sheet's motion: FRIEND seated right
// profile at the table's left end, `new: whisper-cup` (RIGHT near arm, open mitten beside the mouth, back of the hand to camera, thumb toward his
// face: mittenThumbSide('right', 'back')), mouth moving under the hand L0-60; Wheeler seated P31 front, eyes slid to the friend, L35-43 eyes widen
// (`surprised`), L40-55 leans toward the lemon half, L50 `happy`. Push (0.35, 1.7) -> (0.30, 1.5), yaw -6 -> -4. Candle: the stub of B02-SH03 on
// (unlit), replacing LF03's tall candle so the table reads the same in every kitchen shot.
const N = 69, SHOT = 'B02-SH01';
const CAM = camMove({eye: [0.35, 1.25, 1.7], yaw: -6, pitch: -4, f: 1000, hy: 660}, {eye: [0.30, 1.25, 1.5], yaw: -4, pitch: -4, f: 1000, hy: 660}, 0, N - 1);
const FA: V3 = [-0.62, 0, -0.5], LEAN = 0.2;
const WHISPER_ELBOW: [number, number] = [0.15, -0.1], WHISPER_HAND: [number, number] = [0.18, 0.1];

export const def: Shot31 = {
  id: SHOT, N, paper: KITCHEN_PAPER, vignette: 0.55,
  cam: CAM,
  pool: (_L, c) => kitchenPool(c),
  paint: (p, L, c, pr) => {
    const t = L / 30;
    const f = gu(c, FA), sh = shoulderPoint(FRIEND, f.g, f.u, {view: 'right', sit: 1, lean: LEAN}, 'r');
    const hand: Pt = [sh[0] + WHISPER_HAND[0] * f.u, sh[1] - WHISPER_HAND[1] * f.u];
    // kit `lean` is + toward screen right; the lemon half lies screen left, so "lean +0.10 toward the lemon" is taken as 0.07 more toward it
    const lean = mix(-0.06, -0.13, ez(L, 40, 55)), wide = L >= 35 && L < 50;
    const face = L >= 50 ? 'happy' : wide ? 'surprised' : 'neutral';
    const look: Pt = L < 40 ? [-0.7, 0.05] : [mix(-0.7, -0.45, ez(L, 40, 50)), mix(0.05, 0.45, ez(L, 40, 50))];
    const friend = fig(FRIEND, {at: FA, view: 'right', pose: 'P31', face: 'whisper', seed: 3102, t, faceState: {open: L < 60 ? 0.2 + 0.25 * Math.abs(Math.sin(L * 0.9)) : 0.1},
      fig: {lean: LEAN, rArm: {to: hand, via: [sh[0] + WHISPER_ELBOW[0] * f.u, sh[1] - WHISPER_ELBOW[1] * f.u], noHand: true}},
      held: (q, a, u) => {
        const h = openHandParts([a.rHand[0], a.rHand[1]], -Math.PI / 2 + 0.35, u * 1.1, mittenThumbSide('right', 'back'));
        hardFill(q, 32520, FRIEND.head.skin, h.palm);
        inkLine(q, 32521, h.palm, {closed: true, weight: 0.9, color: '#3a2216'});
        inkLine(q, 32522, h.thumbCrease, {weight: 0.7, color: '#3a2216'});
        h.creases.forEach((cr, i) => inkLine(q, 32523 + i, cr, {weight: 0.6, color: '#3a2216'}));
      }}, true);
    const a = paintSeated(p, c, {
      t, wheeler: {face, faceState: {look}, fig: {lean}},
      table: {candle: candleOn(t, 0)},
      items: [friend],
      after: (q) => paintLemonHalf(q, c, 32500, LEMON_HALF_AT, 0.055),
    });
    if (pr && a) {
      pr.lead('WHEELER', {top: a.top, bottom: a.bottom, x: a.head[0]});
      pr.lead('HEAD', {top: a.headTop, bottom: a.chin, x: a.head[0]});
      const lp = gu(c, LEMON_HALF_AT).g; pr.lead('LEMON', {top: lp[1], bottom: lp[1], x: lp[0]});
    }
  },
};
export const shot = makeShot(def);
