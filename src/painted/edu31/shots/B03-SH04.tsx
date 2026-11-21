import {drawChair} from '../../kit/props';
import {paintFigureAt} from '../../kit/figure-at';
import {mittenThumbSide} from '../../kit/hand-gestures';
import type {V3} from '../../kit/space';
import {camPoint, camUnit} from '../../kit/ycam';
import {paintSorted} from '../../kit/world';
import {candleOn, KITCHEN_PAPER} from '../kitchen31';
import {JOKE_LABEL} from '../looks';
import {floorFlash, paintInstantCam, printPx, puff, sparkBurst, standFrame} from '../props31';
import {kitchenTable, paintKitchenShell, paintLemonHalf, paintPendant, WHEELER} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {camMove, ez, hump, lin, mix, mix3, reachArm, shoulderAt} from '../stage31';

// B03-SH04 · F [803, 857) · labelled gag wide: our joke, the broken camera (SCENE-R1 b03; VD31-12/-19, RC6-03). Side wide from +x: Wheeler stands
// (left profile, faces +z) holding `new: instant-camera-1995-broken` at arm's length in his RIGHT (far) mitten, lens turned back to his face; the
// dangling flash pops on the floor (L2-4), spark and grey puff at the hinge (L3-13), the print slides out (L12-24); his LEFT (near) mitten takes
// the print (L24-30) and punches up (P08 one arm, L29-35) while the right arm lowers the camera to his side (L30-40). The joke label
// "เหตุการณ์สมมุติ: กล้องดันพังพอดี" is on from f0 to f53 (pop-in f0-4). Values changed from the sheet (reach, hand-drawing 8.4; collision): camera
// centre z -0.38 -> -0.50 and the raised fist y 2.15 -> 1.93 (both at full arm reach of the 1.78 m rig), lemon half x +0.25 -> +0.08 (the
// sheet point sat in the candle saucer).
const N = 54, SHOT = 'B03-SH04';
const W: V3 = [0.3, 0, -1.0];
const CAM = camMove({eye: [2.6, 1.3, -0.6], yaw: -90, pitch: 4, f: 1000, hy: 700}, {eye: [2.6, 1.3, -0.6], yaw: -90, pitch: 4, f: 1050, hy: 700}, 0, N - 1);
const LEMON: V3 = [0.08, 0.69, 0.05];
/** Held-camera oversize (props31 `scale`): at real size the 13 cm camera read as a speck beside the four-head rig's head. */
const CS = 1.3;
/** Held camera bottom-centre: extended (lens toward his face, -z) -> lowered at his side (L30-40). */
/** Face point the lens aims at (head centre of the 1.78 m rig standing at W). */
const FACE: V3 = [0.3, 1.6, -1.0];
/** Held camera bottom-centre: extended (on the far side of his arm line, so a lens aimed straight at his face shows its cracked front in
 *  three-quarter to the shot) -> lowered at his side (L30-40). */
const camAt = (L: number): V3 => mix3([0.02, 1.42, -0.475], [0.25, 0.84, -0.84], ez(L, 30, 40));
/** Lens aimed at FACE (yaw/tilt from the camera's lens point) until L30, then turned down toward the floor as he lowers it. */
const aim = (L: number): {yaw: number; tilt: number} => {
  const a = camAt(L), dx = FACE[0] - a[0], dz = FACE[2] - a[2], dy = FACE[1] - (a[1] + 0.065);
  const yaw = Math.atan2(dx, dz) * 180 / Math.PI, tilt = Math.atan2(dy, Math.hypot(dx, dz)) * 180 / Math.PI, e = ez(L, 30, 40);
  return {yaw: mix(yaw, 120, e), tilt: mix(tilt, 0, e)};
};

export const def: Shot31 = {
  id: SHOT, N, paper: KITCHEN_PAPER,
  cam: CAM,
  vignette: 0.45,
  pool: (L, c) => { const q = camPoint(c, [0.1, 1.0, -0.5]); return q ? {x: q[0], y: q[1], r: 620 * c.f / 1000, color: '255,205,130', op: 0.28} : null; },
  tag: (L) => ({tag: {text: JOKE_LABEL, y: 215, size: 44, center: true}, pop: lin(L, 0, 4)}),
  paint: (p, L, c, pr) => {
    const t = L / 30;
    paintKitchenShell(p, c);
    paintSorted(p, c, [
      ...kitchenTable({camera: false, candle: candleOn(t)}),
      {at: [0, 0, -0.7], draw: (q, cc) => { const g = camPoint(cc, [0, 0, -0.7]); if (g) drawChair(q, 3101 + 900, g, camUnit(cc, [0, 0, -0.7]), WHEELER, 'left', {color: '#7a5a3a'}); }},
    ]);
    paintLemonHalf(p, c, 37010, LEMON, 0.055);
    paintPendant(p, c);
    // flash pop on the floorboards (L2-4), not on his face
    const fa = camAt(L);
    floorFlash(p, c, 37020, [fa[0] + 0.06, 0, fa[2] - 0.02], 0.32, 200 * hump(L, 1.5, 5));
    // the held broken camera (drawn before the figure: the far mitten grips it from the near side)
    const am = aim(L), f = standFrame(camAt(L), am.yaw, am.tilt);
    const sw = 0.5 * Math.exp(-Math.max(0, L - 1) / 9) * Math.sin(Math.max(0, L - 1) * 0.7) + (L >= 30 ? 0.35 * Math.exp(-(L - 30) / 7) * Math.sin((L - 30) * 0.8) : 0);
    const eject = ez(L, 12, 24) * (L < 28 ? 1 : 0);
    const ca = paintInstantCam(p, c, 37100, f, {broken: true, crack: 1, swing: sw, drop: 0.085, eject, fire: hump(L, 1.5, 5), scale: CS});
    // arms: RIGHT (far) to the camera's near-bottom grip; LEFT (near) to the print slot, then the P08 punch
    const body = {view: 'left' as const};
    const sh = shoulderAt(WHEELER, c, W, body, 'r');
    const u = camUnit(c, W);
    const grip = camPoint(c, [f.o[0] + f.z[0] * 0.03, f.o[1] - 0.025, f.o[2] + f.z[2] * 0.03])!;
    const rA = reachArm(sh, grip, u, 1, {fist: mittenThumbSide('right', 'back')});
    const slot = camPoint(c, ca.slot)!;
    const fistUp: [number, number] = [sh[0] - 0.34 * u, sh[1] - 0.37 * u];
    const chest: [number, number] = [sh[0] - 0.05 * u, sh[1] + 0.49 * u];
    const take = ez(L, 24, 28), punch = ez(L, 29, 34);
    const lTo: [number, number] = L < 29 ? [mix(chest[0], slot[0], take), mix(chest[1], slot[1], take)] : [mix(slot[0], fistUp[0], punch), mix(slot[1], fistUp[1], punch)];
    const lA = reachArm(sh, lTo, u, 1, {fist: mittenThumbSide('left', 'back')});
    const happy = L >= 31;
    const a = paintFigureAt(p, c, WHEELER, {at: W, view: 'left', face: happy ? 'happy' : 'smug', seed: 3101, t,
      faceState: {look: happy ? [0.3, -0.8] : [0.6, -0.15]},
      fig: {rArm: rA.arm, lArm: lA.arm, headCock: happy ? -4 : 0}});
    // the print: sliding out of the slot (in paintInstantCam) until L26, then in the near mitten
    if (a && L >= 28) printPx(p, 37300, a.lHand[0], a.lHand[1] - 0.05 * u, u, L < 29 ? 0.15 : -0.25, 0.92);
    // spark and grey puff at the hinge (L3-13)
    const hp = camPoint(c, ca.hinge), hu = camUnit(c, ca.hinge);
    if (hp) { sparkBurst(p, 37400, hp[0] + 0.01 * hu, hp[1] - 0.005 * hu, 0.035 * hu, hump(L, 2.5, 9)); puff(p, 37420, hp[0] + 0.02 * hu, hp[1] - 0.04 * hu, 0.035 * hu, lin(L, 3, 14)); }
    if (pr && a) {
      pr.lead('WHEELER', {top: a.top, bottom: a.bottom, x: a.head[0]});
      const corners = [[-1, -1], [1, -1], [-1, 1], [1, 1]].flatMap(([sx, sz]) => [0, 0.1 * CS].map((yy) => camPoint(c, [f.o[0] + (f.x[0] * sx * 0.065 + f.z[0] * sz * 0.035) * CS, f.o[1] + yy, f.o[2] + (f.x[2] * sx * 0.065 + f.z[2] * sz * 0.035) * CS])!));
      const bb = camPoint(c, ca.bar), xs = corners.map((q) => q[0]), ys = corners.map((q) => q[1]);
      pr.lead('CAMERA', {top: Math.min(...ys), bottom: bb ? bb[1] + 0.03 * hu : Math.max(...ys), left: Math.min(...xs), right: Math.max(...xs), x: (Math.min(...xs) + Math.max(...xs)) / 2});
      pr.lead('ARM-R', {top: rA.ratio, bottom: rA.ratio, x: 0});
      pr.lead('ARM-L', {top: lA.ratio, bottom: lA.ratio, x: 0});
      const lp = camPoint(c, LEMON); if (lp) pr.lead('LEMON', {top: lp[1], bottom: lp[1], x: lp[0]});
      pr.lead('FIST', {top: a.lHand[1], bottom: a.lHand[1], x: a.lHand[0]});
    }
  },
};
export const shot = makeShot(def);
