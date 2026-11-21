import type {FigAnchors} from '../../kit/cast';
import {ell, hardFill, inkLine, washAt} from '../../kit/draw';
import {mittenThumbSide} from '../../kit/hand-gestures';
import type {Painter, Pt} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {camPoint} from '../../kit/ycam';
import {paintSorted} from '../../kit/world';
import {paintStall, stallItems, YOU} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {camMove, fig, gu, keysAt, mix3, ez, poseShoulder, reachArm} from '../stage31';

// B04-SH01 · F [900, 959) · today: YOU tries three selfie angles (SCENE-R1 b04, LF04). Full-colour midday at the som tam stall. YOU `woman-bob +
// hoodie`, `new: selfie-angles`, front, standing at (+0.6, 0, +0.9); the phone in her LEFT mitten (screen right), back of the phone to the lens,
// eyes on the phone, her palm on it (mitten shows the palm: thumb by `mittenThumbSide('left', 'palm')`), right arm relaxed. Angle 1 L0-16: phone high at
// (+0.85, 1.75, +1.15), head cocked 10 deg to screen left, `happy`. Angle 2 L18-32: cocked to screen right, chin down, `smug` (the pout read).
// Angle 3 L34-50: phone lower at (+0.75, 1.55, +1.20), chin up, `happy`, held; shutter at L52 (a small flash pop on the phone, 2 f). One
// two-bone arm chain per frame to the projected phone. Stall behind her left (krok, lime basket, awning). Push f 1000 -> 1080 (ease-in-out).
const N = 59, SHOT = 'B04-SH01';
const CAM = camMove({eye: [0.6, 1.45, 2.0], yaw: 0, pitch: 0, f: 1000, hy: 620}, {eye: [0.6, 1.45, 2.0], yaw: 0, pitch: 0, f: 1080, hy: 620}, 0, N - 1);
// The sheet's phone points (y 1.75 / 1.55) sit above the kit woman's head top (her shoulder about 1.2 m): at 1.75 the arm is 1.45 x its reach.
// Phone kept in front and to her left at selfie height relative to her head, inside reach: angle 1/2 (+0.88, 1.50, +1.22), angle 3 (+0.80, 1.36, +1.28).
const Y: V3 = [0.6, 0, 0.9], PH1: V3 = [0.88, 1.5, 1.22], PH3: V3 = [0.8, 1.36, 1.28];
const phoneAt = (L: number): V3 => mix3(PH1, PH3, ez(L, 32, 34));
const cockAt = (L: number) => keysAt(L, [[0, -10], [16, -10], [18, 10], [32, 10], [34, 0]]);
const chinAt = (L: number) => keysAt(L, [[0, 0], [16, 0], [18, 0.07], [32, 0.07], [34, -0.06]]);
const faceAt = (L: number) => (L >= 17 && L < 33 ? 'smug' : 'happy') as 'smug' | 'happy';

/** The phone seen from behind (dark body, lens, a soft edge light), centre (x, y), `u` px per metre, roll `ang`; `flash` 0..1 pops the LED. */
const phoneBack = (p: Painter, x: number, y: number, u: number, ang: number, flash: number) => {
  const w = 0.036 * u, h = 0.075 * u, co = Math.cos(ang), si = Math.sin(ang);
  const R = (dx: number, dy: number): Pt => [x + dx * co - dy * si, y + dx * si + dy * co];
  const body = [R(-w, -h), R(w, -h), R(w, h), R(-w, h)];
  hardFill(p, 38960, '#2b2d33', body);
  hardFill(p, 38961, '#3d4048', [R(-w * 0.8, -h * 0.9), R(-w * 0.55, -h * 0.9), R(-w * 0.55, h * 0.9), R(-w * 0.8, h * 0.9)]);
  const l = R(-w * 0.45, -h * 0.72); hardFill(p, 38962, '#4a4d55', ell(l[0], l[1], w * 0.24, w * 0.24, 10)); hardFill(p, 38963, '#101114', ell(l[0], l[1], w * 0.13, w * 0.13, 8));
  inkLine(p, 38964, body, {closed: true, weight: 0.7});
  if (flash > 0) { const f = R(w * 0.1, -h * 0.72); washAt(p, 38965, '#fffbe8', 220 * flash, ell(f[0], f[1], w * 1.6 * flash, w * 1.6 * flash, 16), 0.2, 0.05); hardFill(p, 38966, '#ffffff', ell(f[0], f[1], w * 0.3, w * 0.3, 10)); }
};

export const def: Shot31 = {
  id: SHOT, N, paper: '#efe8d8', vignette: 0.1,
  cam: CAM,
  paint: (p, L, c, pr) => {
    const t = L / 30;
    paintStall(p, c);
    const {u} = gu(c, Y), sh = poseShoulder(YOU, c, Y, 'P01', 'front', 'l');
    const ph = camPoint(c, phoneAt(L))!, grip: Pt = [ph[0], ph[1] + 0.045 * u];
    const lA = reachArm(sh, grip, u, -1, {fist: mittenThumbSide('left', 'palm')});
    const out: {a?: FigAnchors | null} = {};
    paintSorted(p, c, [
      ...stallItems(),
      fig(YOU, {at: Y, view: 'front', face: faceAt(L), faceState: {look: [0.5, L >= 34 ? -0.1 : -0.35]}, seed: 3104, t: t + 2 /* rig clock +2 s: no blink in the shot */, fig: {headCock: cockAt(L), nod: [0, chinAt(L)], lArm: lA.arm}}, false, out),
    ]);
    // the phone stays upright, a slight roll with each angle (it tilts with her head)
    phoneBack(p, lA.hand[0], lA.hand[1] - 0.05 * u, u, cockAt(L) * Math.PI / 180 * 0.6, L >= 52 && L <= 53 ? 1 : 0);
    if (pr && out.a) {
      pr.lead('YOU', {top: out.a.top, bottom: out.a.bottom, x: out.a.head[0]}); pr.lead('HEAD', {top: out.a.headTop, bottom: out.a.chin, x: out.a.head[0]});
      pr.lead('ARM-L', {top: lA.ratio, bottom: 0}); pr.lead('PHONE', {top: lA.hand[1] - 0.05 * u, bottom: lA.hand[1] - 0.05 * u, x: lA.hand[0]});
      const k = camPoint(c, [0, 1.03, -0.3]); if (k) pr.lead('KROK', {top: k[1], bottom: k[1], x: k[0]});
    }
  },
};
export const shot = makeShot(def);
