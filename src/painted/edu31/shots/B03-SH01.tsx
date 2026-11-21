import {mittenThumbSide} from '../../kit/hand-gestures';
import type {Painter, Pt} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {camPoint, camUnit} from '../../kit/ycam';
import {candleOn, KITCHEN_PAPER, kitchenPool, paintSeated, S1} from '../kitchen31';
import {lemonHalfSide, paintInstantCam, standFrame} from '../props31';
import {WHEELER} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {camMove, ez, mix, mix2, mix3, poseShoulder, reachArm, segQuad} from '../stage31';

// B03-SH01 · F [602, 671) · skeptic with a lemon; the slam breaks the camera (SCENE-R1 b03, R6 gag plant, no label). Seated front at S1, P02-like:
// one mitten under the chin, the other holds a lemon half up at eye level; on "ทดสอบ" the chin mitten fetches `new: instant-camera-1995` from the
// table's right corner, lifts it and slams it down (L48 = F650): star crack on the lens, the flash bar flops off and swings on its wires (2 damped
// swings, L48-60). His eyes stay on the lemon. Arms by character side (hand-drawing 1): the sheet's lemon point (x -0.18, screen left) and the
// camera corner (x +0.35, screen right) would cross both arms if the RIGHT mitten fetched the camera; the plate gives the lemon to his RIGHT mitten
// (screen left) and the chin + fetch to his LEFT mitten (screen right), every point unchanged. Slam point (+0.30, 0.68, +0.05) -> (+0.30, 0.68, -0.06):
// the sheet point overlapped the candle saucer at (+0.25, +0.10).
const N = 69, SHOT = 'B03-SH01';
const CAM = camMove({eye: [0.0, 1.15, 1.1], yaw: 4, pitch: -3, f: 1000, hy: 680}, {eye: [0.0, 1.15, 1.1], yaw: 0, pitch: -3, f: 1080, hy: 680}, 0, N - 1);
const START: V3 = [0.35, 0.68, -0.15], LIFT: V3 = [0.30, 0.80, -0.06], SLAM: V3 = [0.30, 0.68, -0.06];
/** Camera bottom-centre on the shot clock: still on the corner, lifted L36-44, slammed L44-48 (accelerating), on the table after. */
const camAt = (L: number): V3 => L < 36 ? START : L < 44 ? mix3(START, LIFT, ez(L, 36, 44)) : L < 48 ? mix3(LIFT, SLAM, ((L - 44) / 4) ** 2) : SLAM;
const swingAt = (L: number) => L < 48 ? 0 : 0.85 * Math.exp(-(L - 48) / 6) * Math.sin((L - 48) * 0.95 + 0.6);

export const def: Shot31 = {
  id: SHOT, N, paper: KITCHEN_PAPER, vignette: 0.5,
  cam: CAM,
  pool: (_L, c) => kitchenPool(c),
  paint: (p, L, c, pr) => {
    const t = L / 30, u = camUnit(c, S1);
    const shL = poseShoulder(WHEELER, c, S1, 'P31', 'front', 'l'), shR = poseShoulder(WHEELER, c, S1, 'P31', 'front', 'r');
    const broken = L >= 48, f = standFrame(camAt(L), 0);
    // LEFT mitten: under the chin (P02 mirrored) -> the camera's top (grip) from L30-36 -> rides the camera
    const chin: Pt = [shL[0] - 0.14 * u, shL[1] - 0.08 * u];
    const gripW = (at: V3): V3 => [at[0] + 0.02, at[1] + 0.105, at[2] - 0.005];
    const grip = camPoint(c, gripW(camAt(L)))!;
    const lTo = L < 30 ? chin : L < 36 ? mix2(chin, grip, ez(L, 30, 36)) : grip;
    const lA = reachArm(shL, lTo, u, L < 33 ? 1 : -1, {fist: mittenThumbSide('left', 'back')});
    // RIGHT mitten: the lemon half held up (screen left): elbow down on the table edge, forearm upright, the fist at shoulder height just
    // outside the shoulder, the lemon above it (the sheet's eye-level point is out of a seated forearm's height; nearest value kept)
    const rA = reachArm(shR, [shR[0] - 0.06 * u, shR[1] + 0.02 * u], u, 1, {fist: mittenThumbSide('right', 'back')});
    const face = L < 40 ? 'suspicious' : 'neutral';
    // eyes on the lemon (screen left, up a little)
    const look: Pt = [-0.75, -0.25];
    const elbow = lA.arm.via!;
    const a = paintSeated(p, c, {
      t, wheeler: {face, faceState: {look}, fig: {rArm: rA.arm, lArm: lA.arm, headCock: mix(-6, -2, ez(L, 28, 40))}},
      table: {camera: false, candle: candleOn(t, 0)},
      onTable: (q: Painter) => paintInstantCam(q, c, 37100, f, {broken, crack: broken ? Math.min(1, (L - 47) / 1) : 0, swing: swingAt(L)}),
      overTable: L >= 30 ? [segQuad(elbow, lA.hand, 0.075 * u, 0.06 * u)] : [],
      after: (q, an) => { if (an) lemonHalfSide(q, 37200, an.rHand[0] + 0.005 * u, an.rHand[1] - 0.07 * u, 0.05 * u, Math.PI * 0.62); },
    });
    if (pr && a) {
      pr.lead('WHEELER', {top: a.top, bottom: a.bottom, x: a.head[0]});
      pr.lead('ARM-R', {top: rA.ratio, bottom: 0});
      pr.lead('ARM-L', {top: lA.ratio, bottom: 0});
      const lc = camPoint(c, [f.o[0] - 0.021, f.o[1] + 0.058, f.o[2] + 0.039]), l0 = camPoint(c, [f.o[0] - 0.065, f.o[1], f.o[2] + 0.035]), l1 = camPoint(c, [f.o[0] + 0.065, f.o[1] + 0.1, f.o[2] + 0.035]);
      if (lc && l0 && l1) pr.lead('CAMERA', {top: l1[1], bottom: l0[1], left: l0[0], right: l1[0], x: lc[0]});
      pr.lead('LENS', {top: (lc?.[1] ?? 0) - 0.024 * camUnit(c, f.o), bottom: (lc?.[1] ?? 0) + 0.024 * camUnit(c, f.o), x: lc?.[0]});
      pr.lead('HEAD', {top: a.headTop, bottom: a.chin, x: a.head[0]});
    }
  },
};
export const shot = makeShot(def);
