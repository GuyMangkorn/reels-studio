import {mittenThumbSide} from '../../kit/hand-gestures';
import type {Pt} from '../../kit/painter';
import {camUnit} from '../../kit/ycam';
import {candleOn, KITCHEN_PAPER, kitchenPool, paintSeated, S1} from '../kitchen31';
import {lemonHalfSide, sparkBurst} from '../props31';
import {WHEELER} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {camMove, dryAnchors, ez, mix, mix2, poseShoulder, reachArm} from '../stage31';

// B03-SH02 · F [671, 740) · the test: lemon on the face, a sputtering flash from off frame (SCENE-R1 b03). Close at S1, eyes shut, `happy`:
// `new: lemon-rub` (L3-28) both mittens circle a lemon half each on the upper cheeks above the beard; L30 the LEFT mitten drops its half out of
// frame below; L30-40 `new: selfie-hold-offframe`: the RIGHT arm (screen left) rises out of frame left holding the unseen camera, chin up at L36.
// The broken flash sputters from screen left (three weak flickers, never a full flash on his face) with a small orange spark at the left edge
// (L44-47). The camera and its direction are never in frame.
const N = 69, SHOT = 'B03-SH02';
// hy 640 -> 810: the kit's seated head top stands at 1.37 m against the sheet's 1.25 m baseline, so the head is moved down to the sheet's rows
// (head top about y 590, chin about y 1000) instead of under the chrome.
const CAM = camMove({eye: [0.05, 1.2, 0.35], yaw: 0, pitch: 0, f: 950, hy: 810}, {eye: [0.05, 1.2, 0.35], yaw: 0, pitch: 0, f: 1007, hy: 810}, 0, N - 1);
/** Flicker pattern (sheet): on L42-43, L47-48, L52-53 at about 40 % strength. */
const flashAt = (L: number) => ([[42, 43], [47, 48], [52, 53]] as const).some(([a, b]) => L >= a && L <= b) ? (L === 47 || L === 48 ? 0.34 : 0.4) : 0;

export const def: Shot31 = {
  id: SHOT, N, paper: KITCHEN_PAPER, vignette: 0.5,
  cam: CAM,
  pool: (_L, c) => kitchenPool(c),
  flash: flashAt,
  paint: (p, L, c, pr) => {
    const t = L / 30, u = camUnit(c, S1);
    const chinUp = ez(L, 30, 36);
    const base = {at: S1, view: 'front' as const, pose: 'P31' as const, seed: 3101, t, face: 'happy' as const, faceState: {eyes: 'shut' as const}, fig: {nod: [0, -0.06 * chinUp] as Pt}};
    const a0 = dryAnchors(WHEELER, c, base)!;
    const hr = (a0.chin - a0.headTop) / 2, hc = a0.head;
    const shR = poseShoulder(WHEELER, c, S1, 'P31', 'front', 'r'), shL = poseShoulder(WHEELER, c, S1, 'P31', 'front', 'l');
    // rub circles on the upper cheeks (two loops, L3-28), opposite phase
    const rub = ez(L, 0, 4) * (1 - ez(L, 27, 30)), ph = (L - 3) / 12.5 * 2 * Math.PI;
    const cheekR: Pt = [hc[0] - 0.58 * hr + Math.cos(ph) * 0.1 * hr * rub, hc[1] + 0.22 * hr + Math.sin(ph) * 0.08 * hr * rub];
    const cheekL: Pt = [hc[0] + 0.58 * hr - Math.cos(ph) * 0.1 * hr * rub, hc[1] + 0.22 * hr + Math.sin(ph) * 0.08 * hr * rub];
    const restR: Pt = [shR[0] + 0.02 * u, shR[1] + 0.45 * u], restL: Pt = [shL[0] - 0.02 * u, shL[1] + 0.5 * u];
    // RIGHT: cheek -> out of frame upper left (L30-40); LEFT: cheek -> drops below frame (L30-36)
    const offTop: Pt = [shR[0] - 0.42 * u, shR[1] - 0.32 * u];
    const rTo = L < 3 ? mix2(restR, cheekR, ez(L, -3, 3)) : L < 30 ? cheekR : mix2(cheekR, offTop, ez(L, 30, 40));
    const lTo = L < 30 ? (L < 3 ? mix2(restL, cheekL, ez(L, -3, 3)) : cheekL) : mix2(cheekL, restL, ez(L, 30, 34));
    const rA = reachArm(shR, rTo, u, L < 30 ? -1 : -1, {fist: mittenThumbSide('right', 'back'), fore: L < 30 ? 0.75 : 0});
    const lA = reachArm(shL, lTo, u, 1, {fist: mittenThumbSide('left', 'back'), fore: L < 33 ? 0.75 : 0});
    const a = paintSeated(p, c, {
      t, wheeler: {...base, fig: {...base.fig, rArm: rA.arm, lArm: lA.arm}},
      table: {camera: false, candle: candleOn(t)},
      after: (q, an) => {
        if (!an) return;
        // lemon halves pressed cut side to the cheeks; at L30 the left half drops below frame (the right mitten leaves frame with the camera)
        if (L < 30) {
          lemonHalfSide(q, 37210, an.rHand[0] + 0.03 * u, an.rHand[1] - 0.06 * u, 0.045 * u, -0.25, 0.4 * rub);
          lemonHalfSide(q, 37220, an.lHand[0] - 0.03 * u, an.lHand[1] - 0.06 * u, 0.045 * u, Math.PI + 0.25, 0.4 * rub);
        } else if (L < 36) {
          const k = ez(L, 30, 36);
          lemonHalfSide(q, 37220, mix(an.lHand[0] - 0.03 * u, an.lHand[0], k), an.lHand[1] - 0.06 * u + k * 0.5 * u, 0.045 * u, Math.PI + 0.25 + k);
        }
        // spark flicking in at the left frame edge (L44-47), outside the face and the caption band
        if (L >= 44 && L <= 47) sparkBurst(q, 37230 + L, 45 + (L - 44) * 20, 650 + Math.sin(L) * 30, 40, 1 - (L - 44) / 5);
      },
    });
    if (pr && a) {
      pr.lead('HEAD', {top: a.headTop, bottom: a.chin, x: a.head[0]});
      pr.lead('WHEELER', {top: a.top, bottom: a.bottom, x: a.head[0]});
      pr.lead('ARM-R', {top: rA.ratio, bottom: 0});
      pr.lead('ARM-L', {top: lA.ratio, bottom: 0});
    }
  },
};
export const shot = makeShot(def);
