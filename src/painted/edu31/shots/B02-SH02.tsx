import {candleOn, KITCHEN_PAPER, kitchenPool, paintSeated} from '../kitchen31';
import {paintBubble} from '../props31';
import {makeShot, type Shot31} from '../shot';
import {camMove, eout, ez, lin, mix} from '../stage31';

// B02-SH02 · F [401, 503) · his belief, in a thought bubble (SCENE-R1 b02). Medium close on Wheeler seated at S1, `happy`, eyes up-right, small
// breathing; mittens rest on the table (entry = exit). The VD31-16 bubble (same canvas, clipped): centre (780, 390), r 220, grows L2-18 (ease-out),
// three trailing circles pop L2, L5, L8. Inside: the CCTV box camera tracks a dotted empty outline of him walking by (L18-68), keeps following
// nothing (L68-72), tilts 15 deg puzzled (L72-80) and turns away 40 deg (L80-92); holds to the cut. hy 700 -> 835: the kit seated head stands
// about 0.12 m taller than the sheet figure, so the sheet head top (631) and table line are kept by lowering the picture.
const N = 102, SHOT = 'B02-SH02';
const CAM = camMove({eye: [0.1, 1.15, 0.6], yaw: 0, pitch: 0, f: 900, hy: 835}, {eye: [0.1, 1.15, 0.6], yaw: 0, pitch: 0, f: 954, hy: 835}, 0, N - 1);
// trail: the sheet points (600, 640) .. (530, 730) fall inside the kit head (x 316-626, y 631-941), so they run off his upper-right temple instead
const TRAIL: [number, number, number][] = [[668, 628, 18], [652, 680, 12], [640, 722, 8]];

export const def: Shot31 = {
  id: SHOT, N, paper: KITCHEN_PAPER, vignette: 0.5,
  cam: CAM,
  pool: (_L, c) => kitchenPool(c),
  paint: (p, L, c, pr) => {
    const t = L / 30;
    const breathe = 0.012 * Math.sin((L / 30) * 2 * Math.PI / 3.2);
    const a = paintSeated(p, c, {
      t, wheeler: {face: 'happy', faceState: {look: [0.6, -0.4]}, fig: {lean: breathe}},
      table: {camera: true, candle: candleOn(t, 0)},
    });
    const walk = L < 18 ? -1 : lin(L, 18, 68);
    // pan tracks the walker (-35 -> +35 deg), drifts on past him (L68-72), then turns away 40 deg (L80-92)
    const pan = mix(-35, 35, walk < 0 ? 0 : walk) + 8 * ez(L, 68, 72) - 40 * ez(L, 80, 92);
    paintBubble(p, 37500, {cx: 780, cy: 390, r: 220, grow: eout(lin(L, 2, 18)), trail: [lin(L, 2, 4), lin(L, 5, 7), lin(L, 8, 10)], trailPts: TRAIL, walk, camPan: pan, camTilt: 15 * ez(L, 72, 80)});
    if (pr && a) { pr.lead('WHEELER', {top: a.top, bottom: a.bottom, x: a.head[0]}); pr.lead('HEAD', {top: a.headTop, bottom: a.chin, x: a.head[0]}); }
  },
};
export const shot = makeShot(def);
