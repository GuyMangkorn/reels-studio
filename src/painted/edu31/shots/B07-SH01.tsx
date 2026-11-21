import type {Pt} from '../../kit/painter';
import {camPoint, type YCam} from '../../kit/ycam';
import {JOKE_LABEL, CCTV_STILL} from '../looks';
import {CAM_CENTRE, probeTable, revealPool} from '../reveal31';
import {paintRevealTable, printCorners} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {camMove, lin} from '../stage31';

// B07-SH01 · F [1520, 1576) · reveal: the broken camera, then the two photos (SCENE-R1 b07, LF07). Top view of Space R (no cast, no hand). The
// camera pulls up and trucks right L0-40 (ease-in-out), holds L40-55 = LF07's camera: the blank Polaroid and the lemon half alone at L0, the
// lying broken camera enters from the top, the CCTV print (CCTV-STILL-01, camera-mapped) from the right. VD31-19 joke label "เหตุการณ์สมมุติ: กล้องดันพังพอดี"
// (RC6-06: 36 px; two centred lines since the 2026-11-21 fix round, plate centre x 730), pop-in L22 (scale 0.8 -> 1 over 4 f), held to L55, with a hand-drawn arrow from the plate's left
// edge whose tip tracks the projected camera centre (-0.07, 0.07, -0.13) every frame. RC3-01: the lemon touches nothing (1.15 cm from the
// Polaroid's bottom edge); no mark on either print. The label is on this shot only (B07-SH02/SH03 carry none).
const N = 56, SHOT = 'B07-SH01';
const CAM = camMove({eye: [-0.07, 0.2, 0], yaw: 0, pitch: -90, f: 900, hy: 440, near: 0.05}, {eye: [0.06, 0.6, 0], yaw: 0, pitch: -90, f: 1000, hy: 620, near: 0.05}, 0, 40);
/** Plate: centre x 730, top 215, 36 px text on two lines (`wrap`, fix round 2026-11-21: the longer label); measured extent x 587-872, y 215-321
 *  (stills G1560/G1575), so the arrow leaves its left edge at (582, 268). `tipMinY`: the tip stays below the reconstruction label line (top 170). */
const PLATE = {cx: 730, top: 215, size: 36, left: 582, my: 268, tipMinY: 224};

const arrowTo = (c: YCam): [number, number][] => {
  const tip = camPoint(c, CAM_CENTRE) ?? [300, 380];
  const s: Pt = [PLATE.left, PLATE.my];
  // a loose hand-drawn bow below the straight line
  const ty = Math.max(tip[1] - 6, PLATE.tipMinY); // keep the arrow off the reconstruction label line (top 170) while the camera enters
  return [s, [(s[0] + tip[0]) / 2 + 10, Math.max(s[1], ty) + 18], [tip[0] + 14, ty]];
};

export const def: Shot31 = {
  id: SHOT, N, paper: '#1a100a', vignette: 0.7,
  cam: CAM,
  pool: (_L, c) => revealPool(c),
  quads: () => [{src: CCTV_STILL, corners: printCorners(), border: 0.05, pos: '50% 30%'}],
  tag: (L) => L < 22 ? null : ({tag: {text: JOKE_LABEL, cx: PLATE.cx, y: PLATE.top, size: PLATE.size, wrap: true, arrow: arrowTo(CAM(L))}, pop: lin(L, 22, 26)}),
  paint: (p, L, c, pr) => {
    paintRevealTable(p, c);
    if (pr) {
      probeTable(c, pr);
      const tip = camPoint(c, CAM_CENTRE); if (tip) pr.lead('CAMC', {top: tip[1], bottom: tip[1], x: tip[0]});
    }
  },
};
export const shot = makeShot(def);
