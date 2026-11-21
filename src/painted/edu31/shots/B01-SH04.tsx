import {ell, hardFill, inkLine} from '../../kit/draw';
import {frameOf, paintFrustum} from '../../kit/hand-props';
import {elbowIK, LANDMARKS, specHand, toneFromSkin} from '../../kit/hand-place';
import type {V3} from '../../kit/space';
import {camPoint, camUnit} from '../../kit/ycam';
import {qy, sphereAt, wFill} from '../../kit/world';
import {droplets, paintKrok, paintLimeBasket, paintLimeHalf} from '../props31';
import {paintStall} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {camMove, ez, lin, mix3} from '../stage31';

// B01-SH04 · F [233, 332) · today: lime over som tam, top insert (SCENE-R1 b01). Full-colour midday from above the counter. Graphic match: at L0 the
// VENDOR's hand already holds a green `new: lime-half` at the screen point where B01-SH03's lemon half was (about (320, 725)); it moves over the
// `new: krok-somtam` (L4-30), squeezes on "บีบ" (L63-73) and the juice drops into the krok on "ส้มตำ" (L70-80). The hand is the action, so it is
// the five-finger 3D hand (hand-drawing 4, close-up), not the sheet mitten: the vendor RIGHT hand (she faces the lens across the counter: screen left),
// `claw` fingertips on the far half of the lime dome (the near half stays visible for the match), back of the hand to the lens; cream sleeve.
const N = 99, SHOT = 'B01-SH04';
const CAM = camMove({eye: [0, 1.55, 0.06], yaw: 0, pitch: -56, f: 1000, hy: 700, near: 0.05}, {eye: [0, 1.55, 0.06], yaw: 0, pitch: -56, f: 1060, hy: 700, near: 0.05}, 0, N - 1);
const KROK: V3 = [0, 0.85, -0.3], LIME_R = 0.034;
const limeAt = (L: number): V3 => mix3([-0.13, 1.06, -0.28], [0.04, 1.1, -0.26], ez(L, 4, 30));
const squeezeAt = (L: number) => ez(L, 63, 70) * (1 - 0.3 * ez(L, 74, 80));
const SHOULDER: V3 = [-0.2, 1.4, -0.78], POLE: V3 = [-0.6, 0.6, -0.6];
const TONE = toneFromSkin('#c98a5c', '#efe6d2');
const handAt = (L: number) => {
  const l = limeAt(L), s = squeezeAt(L);
  return specHand({gesture: 'claw', side: 'right', forward: [0.1, -0.75, 0.65], back: [0, 0.65, 0.75], put: {landmark: LANDMARKS.palm, at: [l[0] - 0.005, l[1] + 0.045 - 0.012 * s, l[2] - 0.065]}, size: 1.1, tone: TONE, base: 3700});
};

export const def: Shot31 = {
  id: SHOT, N, paper: '#efe8d8', vignette: 0.12,
  cam: CAM,
  hands: (L) => {
    const h = handAt(L);
    return [{arms: [{hand: h, elbow: elbowIK(SHOULDER, h.wrist, POLE), shoulder: SHOULDER, sleeve: '#efe6d2', cuff: 0.97}]}];
  },
  paint: (p, L, c, pr) => {
    const t = L / 30;
    paintStall(p, c);
    // steel counter top and its painted front
    wFill(p, c, 37800, '#c7ccd0', qy(0.85, -1.02, 1.02, -0.62, 0.3));
    wFill(p, c, 37801, '#d5d9dc', qy(0.8505, -1.0, 1.0, -0.6, -0.56)); // brushed back rim catching the noon light
    paintLimeBasket(p, c, 37810, [-0.5, 0.85, -0.35]);
    // the wooden pestle resting beside the krok and two spare tomatoes (dressing, kept above the caption band)
    paintFrustum(p, c, 37820, frameOf([0.2, 0.87, -0.12], [1, 0.05, -0.45], [0, 1, 0]), 0, 0.26, 0.022, 0.03, '#a8794a', '#c89a66', 16);
    for (const [i, x, z] of [[0, -0.28, -0.12], [1, -0.21, -0.08]] as const) { const s0 = sphereAt(c, [x, 0.875, z], 0.025); if (s0) { hardFill(p, 37830 + i, '#d9412e', ell(s0.x, s0.y, s0.r, s0.r * 0.92, 14)); hardFill(p, 37832 + i, '#f07a5a', ell(s0.x - s0.r * 0.3, s0.y - s0.r * 0.3, s0.r * 0.3, s0.r * 0.22, 8)); inkLine(p, 37834 + i, ell(s0.x, s0.y, s0.r, s0.r * 0.92, 14), {closed: true, weight: 0.6, color: '#7a1c10'}); } }
    paintKrok(p, c, 37900, KROK, t);
    // the lime half, cut side down toward the krok (normal -y), squashing a little on the squeeze
    const l = limeAt(L), s = squeezeAt(L);
    paintLimeHalf(p, c, 38100, frameOf(l, [0, 0, -1], [0, -1, 0]), LIME_R, s);
    // juice drops from under the lime into the krok (L70-80)
    const a = camPoint(c, [l[0], l[1] - 0.01, l[2]]), b = camPoint(c, [KROK[0] + 0.02, KROK[1] + 0.17, KROK[2]]);
    if (a && b) droplets(p, 38150, a, b, lin(L, 68, 82), 0.004 * camUnit(c, l), 7);
    if (pr) {
      const q = camPoint(c, l), r0 = camPoint(c, [KROK[0] - 0.11, KROK[1] + 0.18, KROK[2]]), r1 = camPoint(c, [KROK[0] + 0.11, KROK[1] + 0.18, KROK[2]]);
      const rt = camPoint(c, [KROK[0], KROK[1] + 0.18, KROK[2] - 0.11]), rb = camPoint(c, [KROK[0], KROK[1] + 0.18, KROK[2] + 0.11]);
      if (q) pr.lead('LIME', {top: q[1], bottom: q[1], x: q[0]});
      if (r0 && r1 && rt && rb) pr.lead('KROK', {top: rt[1], bottom: rb[1], left: r0[0], right: r1[0], x: (r0[0] + r1[0]) / 2});
    }
  },
};
export const shot = makeShot(def);
