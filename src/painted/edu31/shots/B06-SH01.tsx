import type {FigAnchors} from '../../kit/cast';
import {mittenThumbSide} from '../../kit/hand-gestures';
import type {V3} from '../../kit/space';
import {camPoint} from '../../kit/ycam';
import {paintSorted} from '../../kit/world';
import {CCTV_STILL} from '../looks';
import {glow, paintPoliceShell, policeTable, POLICE, WHEELER} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {camMove, dryAnchors, eout, ez, fig, gu, lin, mix3, reachArm} from '../stage31';
import {armHoles, PRINT_H, printQuad} from '../police31';

// B06-SH01 · F [1374, 1416) · over the officer's shoulder: the print (SCENE-R1 b06, LF06). POLICE `man-crop + us-police-1995` (clean-shaven, no
// holster), back view at (+0.26, 0, +0.60) (LF06 +0.28, +0.72 moved 0.12 m in so the slide stays inside his reach, bones 0.26 m; the sheet's x 0 would put his head mid-frame), a near
// dark shape (navy tint), head nodding on his line (L3-39). WHEELER seated P31 at (0, 0, -0.75) (as B05-SH04), `neutral`, eyes follow the print
// down L10-22. `new: photo-print-8x10` (CCTV-STILL-01 camera-mapped, DF-20261031-painted-raster-card), read for the viewer, rotated 4 deg: slides
// L3-22 (ease-out) from (+0.10, 0.68, +0.25) to (0, 0.68, -0.02) under the POLICE RIGHT mitten (back view: screen right) on its near edge;
// the mitten detaches at L22 and withdraws L22-30 to the table by his side. The print is DOM over the canvas, so the mitten and forearm are cut out
// of it (`holes`) and show through. One two-bone arm chain per frame (shoulder from the back-view body).
const N = 42, SHOT = 'B06-SH01';
const CAM = camMove({eye: [-0.4, 1.3, 1.5], yaw: 8, pitch: -9, f: 1050, hy: 520}, {eye: [-0.4, 1.3, 1.5], yaw: 8, pitch: -9, f: 1103, hy: 520}, 0, N - 1);
const PC: V3 = [0.26, 0, 0.6], WH: V3 = [0, 0, -0.75];
const P0: V3 = [0.1, 0.684, 0.25], P1: V3 = [0, 0.684, -0.02], REST: V3 = [0.36, 0.7, 0.42];
export const printAt = (L: number): V3 => mix3(P0, P1, eout(lin(L, 3, 22)));
/** The mitten's world point: on the print's near edge until L22, then back to the table by his side (L22-30). */
const handAt = (L: number): V3 => { const pc = printAt(L), edge: V3 = [pc[0] + 0.07, 0.7, pc[2] + PRINT_H / 2 - 0.015]; return mix3(edge, REST, ez(L, 22, 30)); };
const armOf = (L: number, c: Parameters<typeof camPoint>[0]) => {
  const sh = dryAnchors(POLICE, c, {at: PC, view: 'back', pose: 'P31', seed: 3106})!.rShoulder, {u} = gu(c, PC); // the painted back-view shoulder
  const h = camPoint(c, handAt(L))!;
  return {sh, u, ...reachArm(sh, h, u, 1, {fist: mittenThumbSide('right', 'back')})};
};

export const def: Shot31 = {
  id: SHOT, N, paper: '#9fae9a', vignette: 0.3,
  cam: CAM,
  quads: (L, c) => { const A = armOf(L, c); return [{src: CCTV_STILL, corners: printQuad(printAt(L), 4), border: 0.06, pos: '50% 30%', holes: armHoles(A.sh, A.arm.via!, A.hand, A.u)}]; },
  paint: (p, L, c, pr) => {
    const t = L / 30 + 2; // rig clock +2 s: no automatic blink in the shot
    paintPoliceShell(p, c);
    const A = armOf(L, c);
    const out: {a?: FigAnchors | null} = {};
    paintSorted(p, c, [
      fig(WHEELER, {at: WH, view: 'front', pose: 'P31', face: 'neutral', faceState: {look: [0.15, 0.7 * ez(L, 10, 22)]}, seed: 3101, t}, true, out),
      {at: [0, 0, 0.0], draw: policeTable},
      fig(POLICE, {at: PC, view: 'back', pose: 'P31', seed: 3106, t, tint: {to: '#141a26', u: 0.4}, fig: {rArm: A.arm, nod: [0, L >= 3 && L <= 39 ? 0.03 * Math.sin((L - 3) / 36 * Math.PI * 3) : 0]}}),
    ]);
    const l = camPoint(c, [0, 2.5, 0]); if (l) glow(p, 36300, l[0], l[1], 420, 160, '#f4fbe8', 60);
    if (pr) {
      if (out.a) { pr.lead('WHEELER', {top: out.a.top, bottom: out.a.bottom, x: out.a.head[0]}); pr.lead('HEAD', {top: out.a.headTop, bottom: out.a.chin, x: out.a.head[0]}); }
      const q = camPoint(c, printAt(L)); if (q) pr.lead('PRINTC', {top: q[1], bottom: q[1], x: q[0]});
      pr.lead('ARM-R', {top: A.ratio, bottom: 0});
      const ph = camPoint(c, [PC[0], 1.25, PC[2]]); if (ph) pr.lead('POLICE-HEAD~', {top: ph[1], bottom: ph[1], x: ph[0]});
    }
  },
};
export const shot = makeShot(def);
