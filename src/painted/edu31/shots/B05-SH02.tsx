import type {Painter, Pt} from '../../kit/painter';
import {mittenThumbSide} from '../../kit/hand-gestures';
import type {V3} from '../../kit/space';
import {camPoint, camUnit, mixYCam, type YCam} from '../../kit/ycam';
import {CCTV_STILL} from '../looks';
import {crtOnQuad} from '../screen31';
import {ANCHOR, paintStudio, paintTvCorner, studioDesk, TV_SCREEN} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {camOf, clipPolyPainter, dryAnchors, eout, ez, fig, lin, mix2, poseShoulder, reachArm} from '../stage31';

// B05-SH02 · F [1240, 1305) · inside the TV: the anchor (SCENE-R1 b05, LF05B). The push from B05-SH01 ends (eye z 0.27 -> 0.20, f 900 -> 1000 by
// L20, ease-out, then hold) with the screen nearly filling the frame, bezel edges at both sides. The 4:3 studio picture (Space N) is painted into
// the screen quad through its own camera (LF05B's C05B, scaled and centred on the projected screen; 3 % zoom over the shot inside the picture) and
// clipped to it; the CRT glass (scanlines, falloff) lies over it. L0-1 a CRT roll as the picture switches from the full still to the studio.
// ANCHOR `man-parted + office`, seated P31, `talk` on his speech frames (L3-61), front; points at the OTS box (CCTV-STILL-01, upper right of the
// picture) L13-19 (F1253-1259, "ชายคนนี้" F1255), holds to L40, back to the desk L40-46. The box is upper right, so he points with his LEFT arm
// (screen right; LF05B; the sheet's "right arm" would cross his body). No lower third, logo, station name or text in the picture.
const N = 65, SHOT = 'B05-SH02';
const A = camOf({eye: [0, 0.9, 0.27], yaw: 0, pitch: 0, f: 900, hy: 560, near: 0.05}), B = camOf({eye: [0, 0.89, 0.2], yaw: 0, pitch: 0, f: 1000, hy: 560, near: 0.05});
const CAM = (L: number) => mixYCam(A, B, eout(lin(L, 0, 20)));
const AN: V3 = [0, 0, -0.6];
/** OTS box in picture fractions of the 4:3 window (LF05B: x 640..970, y 250..500 of the window x 22..1058, y 170..948). */
const BOX = {u0: 0.5965, u1: 0.915, v0: 0.1028, v1: 0.4242};
const zoomAt = (L: number) => 1 + 0.03 * lin(L, 0, N - 1);
/** A point on the screen plane at window fractions (u, v), the inner zoom applied about the picture centre. */
const onScreen = (u: number, v: number, z: number): V3 => {
  const uu = 0.5 + (u - 0.5) * z, vv = 0.501 + (v - 0.501) * z, [tl, tr, , bl] = TV_SCREEN;
  return [tl[0] + uu * (tr[0] - tl[0]) + vv * (bl[0] - tl[0]), tl[1] + uu * (tr[1] - tl[1]) + vv * (bl[1] - tl[1]), tl[2]];
};
/** The studio camera mapped into the projected screen rectangle of the outer camera `c`. */
export const innerCam = (c: YCam, L: number): YCam | null => {
  const tl = camPoint(c, TV_SCREEN[0]), tr = camPoint(c, TV_SCREEN[1]), bl = camPoint(c, TV_SCREEN[3]);
  if (!tl || !tr || !bl) return null;
  const W = tr[0] - tl[0], H = bl[1] - tl[1], z = zoomAt(L);
  return {...camOf({eye: [0, 1.12, 1.75], yaw: 0, pitch: -4, f: 1150 * z * W / 1036, hy: tl[1] + 390 * H / 778}), cx: tl[0] + 518 * W / 1036 - 540};
};
/** Pointing amount 0..1 (L13-19 up, hold, L40-46 back). */
const pointAt = (L: number) => ez(L, 13, 19) * (1 - ez(L, 40, 46));

export const def: Shot31 = {
  id: SHOT, N, paper: '#101218', vignette: 0.2,
  cam: CAM,
  fx: (L, c) => {
    const z = zoomAt(L);
    const box: [V3, V3, V3, V3] = [onScreen(BOX.u0, BOX.v0, z), onScreen(BOX.u1, BOX.v0, z), onScreen(BOX.u1, BOX.v1, z), onScreen(BOX.u0, BOX.v1, z)];
    return <>
      {L >= 1 && crtOnQuad(c, box, {mode: 'image', src: CCTV_STILL, pos: '50% 30%'}, 0, 'box')}
      {crtOnQuad(c, TV_SCREEN, L < 1 ? {mode: 'image', src: CCTV_STILL, pos: '50% 30%', roll: 0.45} : {mode: 'glass', roll: L < 2 ? 0.8 : 0}, 40, 'tube')}
    </>;
  },
  paint: (p, L, c, pr) => {
    paintTvCorner(p, c);
    const ic = innerCam(c, L), q = TV_SCREEN.map((v) => camPoint(c, v)) as Pt[];
    if (!ic || q.some((v) => !v)) return;
    const s: Painter = clipPolyPainter(p, q);
    const t = L / 30, talking = L >= 3 && L <= 61;
    paintStudio(s, ic);
    // the left arm: from the P31 rest hand to a straight point at the box (finger), one two-bone chain per frame
    const u = camUnit(ic, AN), k = pointAt(L);
    const base = {at: AN, view: 'front' as const, pose: 'P31' as const, face: (talking ? 'talk' : 'neutral') as 'talk' | 'neutral', seed: 3105, t};
    const rest = dryAnchors(ANCHOR, ic, base)!.lHand;
    const sh = poseShoulder(ANCHOR, ic, AN, 'P31', 'front', 'l');
    const bc = camPoint(c, onScreen((BOX.u0 + BOX.u1) / 2, (BOX.v0 + BOX.v1) / 2, zoomAt(L)))!;
    // the box sits just right of and above his head, so the point is an arm out to his left (screen right) under the box, forearm rising,
    // the finger toward it: hand 0.44 m out and 0.16 m up from the shoulder (inside reach), not a raised hand behind the head
    const aim: Pt = [sh[0] + 0.44 * u, sh[1] - 0.16 * u];
    const lA = reachArm(sh, mix2(rest, aim, k), u, -1, k > 0.5 ? {finger: true} : {fist: mittenThumbSide('left', 'back')});
    paintFigureSorted(s, ic, base, k > 0 ? lA.arm : undefined);
    studioDesk(s, ic);
    if (pr) {
      pr.lead('SCREEN', {top: q[0][1], bottom: q[2][1], left: q[0][0], right: q[1][0], x: (q[0][0] + q[1][0]) / 2});
      const a = dryAnchors(ANCHOR, ic, base)!; pr.lead('ANCHOR-HEAD', {top: a.headTop, bottom: a.chin, x: a.head[0]});
      pr.lead('ARM-L', {top: lA.ratio, bottom: 0}); pr.lead('POINT', {top: lA.hand[1], bottom: lA.hand[1], x: lA.hand[0]}); pr.lead('BOXC', {top: bc[1], bottom: bc[1], x: bc[0]});
    }
  },
};
const paintFigureSorted = (s: Painter, ic: YCam, base: Parameters<typeof fig>[1], lArm?: ReturnType<typeof reachArm>['arm']) => {
  fig(ANCHOR, {...base, ...(lArm ? {fig: {lArm}} : {})}).draw(s, ic);
};
export const shot = makeShot(def);
