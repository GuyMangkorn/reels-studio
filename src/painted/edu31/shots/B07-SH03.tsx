import type {V3} from '../../kit/space';
import {camPoint, mixYCam} from '../../kit/ycam';
import {paintLemonTip, probeTable, revealPool} from '../reveal31';
import {paintRevealTable, REVEAL} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {camOf, ein, eout, lin, mix3} from '../stage31';

// B07-SH03 · F [1676, 1795) · ending: the lemon tips over (SCENE-R1 b07). Top view on the blank Polaroid alone with the lemon half; a small push
// (ease-out) that stops at L57 (speech end), then locked. On the "…" the lemon rocks once (L22-28, +-8 deg about x, back to rest); on "จริงเลย"
// it tips about +x onto its cut face (L42-50, accelerating), ends cut side down at (-0.08, 0.015, +0.10), rind up, bounces 2 mm (L50-53), settled
// L54, then fully still to L118 (the 2.0 s hold: frames 59-118 identical but for the grain). RC3-01 / RC6-05: footprint z +0.07..+0.13, 1.6 cm
// clear of the Polaroid's bottom edge; the Polaroid keeps the B03-SH03 wash. No face, camera, print, label or text in frame.
const N = 119, SHOT = 'B07-SH03';
const A = camOf({eye: [-0.075, 0.21, 0.01], yaw: 0, pitch: -90, f: 900, hy: 460, near: 0.05}), B = camOf({eye: [-0.075, 0.19, 0.01], yaw: 0, pitch: -90, f: 900, hy: 460, near: 0.05});
const CAM = (L: number) => mixYCam(A, B, eout(lin(L, 0, 57)));
const START = REVEAL.lemon.c, END: V3 = [-0.08, 0.015, 0.1], R = REVEAL.lemon.r;
const DEG = Math.PI / 180;
/** Lemon state at frame L: rock (rad), tip (rad), cut-face centre. */
export const lemonAt = (L: number) => {
  const rock = L >= 22 && L <= 28 ? 8 * DEG * Math.sin(2 * Math.PI * (L - 22) / 6) : 0;
  const k = ein(lin(L, 42, 50)), tip = Math.PI * k;
  const at = mix3(START, END, k);
  const bounce = L > 50 && L < 53 ? 0.002 * Math.sin(Math.PI * (L - 50) / 3) : 0;
  return {rock, tip, at: [at[0], at[1] + bounce, at[2]] as V3};
};

export const def: Shot31 = {
  id: SHOT, N, paper: '#1a100a', vignette: 0.7,
  cam: CAM,
  pool: (_L, c) => revealPool(c),
  paint: (p, L, c, pr) => {
    paintRevealTable(p, c, {camera: false, lemon: false});
    const s = lemonAt(L);
    paintLemonTip(p, c, 38600, s.at, R, s.rock, s.tip);
    if (pr) {
      probeTable(c, pr, s.at);
      const q = camPoint(c, s.at); if (q) pr.lead('LEMONC', {top: q[1], bottom: q[1], x: q[0]});
      // footprint gap to the Polaroid's bottom edge (mm, in `top`)
      const P = REVEAL.polaroid; pr.lead('GAPMM-RC3', {top: 1000 * ((s.at[2] - R) - (P.c[2] + P.h / 2)), bottom: 0});
    }
  },
};
export const shot = makeShot(def);
