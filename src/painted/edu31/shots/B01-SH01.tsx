import {shoulderPoint, type FigAnchors} from '../../kit/cast';
import {washAt} from '../../kit/draw';
import {mittenThumbSide} from '../../kit/hand-gestures';
import type {Painter} from '../../kit/painter';
import {paintShoulderBag, paintToyPistol} from '../../kit/props';
import type {V3} from '../../kit/space';
import {camPoint} from '../../kit/ycam';
import {paintSorted, wp} from '../../kit/world';
import {BANK_TEXT, bankFurniture, FRIEND, glow, lemonPx, paintBankShell, WHEELER} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {camMove, fig, gu, mix3} from '../stage31';

// B01-SH01 · F [0, 72) · heist slow-motion walk into the lobby (SCENE-R1 b01, LF01). Frame 0 already shows the bare face with the beard, the whole
// lemon (RIGHT mitten, CP-P02 elbow back), `new: toy-pistol-cartoon` hanging in the LEFT mitten (CP-P05, barrel down 0.2 rad outward, never raised:
// VD31-10, RC5-01), `new: canvas-money-bag` on the left-shoulder strap with one note corner (RC5-02). Both men walk toward the lens at 0.6 speed
// (0.54 m/s) while the camera dollies back 0.3 m (yaw 180 -> 176). The LF01 art (look frame, Film) is reused as written; only the walk, the
// positions and the camera move are the plate's.
const N = 72, SHOT = 'B01-SH01';
const CAM = camMove({eye: [-0.2, 0.6, 3.0], yaw: 180, pitch: 7, f: 1080, hy: 650}, {eye: [-0.2, 0.6, 2.7], yaw: 176, pitch: 7, f: 1080, hy: 650}, 0, N - 1);
/** LF01 gun arm: elbow and hand from the left shoulder (m outward / down), barrel angle. */
const GUN_ELBOW: [number, number] = [0.035, 0.255], GUN_HAND: [number, number] = [0.075, 0.495], GUN_ANG = Math.PI / 2 - 0.2;
/** Walk phase: distance over the step (1.1 m per cycle at 1.7 m, scaled by height), stride 0.45 for the slow-motion read. */
const STEP = (h: number) => 1.1 * h / 1.7;
const wAt = (L: number): V3 => mix3([-0.4, 0, 6.3], [-0.4, 0, 5.0], L / (N - 1));
const fAt = (L: number): V3 => mix3([0.5, 0, 7.1], [0.5, 0, 5.8], L / (N - 1));

export const def: Shot31 = {
  id: SHOT, N, paper: '#e9dfc8', vignette: 0.42,
  cam: CAM, texts: BANK_TEXT,
  paint: (p: Painter, L, c, pr) => {
    const t = L / 30;
    paintBankShell(p, c);
    const s0 = camPoint(c, [-2.2, 0.002, 12]), s1 = camPoint(c, [2.2, 0.002, 12]), s2 = camPoint(c, [2.8, 0.002, 4.2]), s3 = camPoint(c, [-2.8, 0.002, 4.2]);
    if (s0 && s1 && s2 && s3) washAt(p, 31800, '#f7cf86', 90, [s0, s1, s2, s3], 0.4, 0.2);
    const W = wAt(L), F = fAt(L);
    for (const [k, at, len] of [[0, W, 3.4], [1, F, 3.6]] as const) {
      const sh = wp(c, [[at[0] - 0.2, 0.003, at[2]], [at[0] + 0.2, 0.003, at[2]], [at[0] + 0.34, 0.003, at[2] - len], [at[0] - 0.34, 0.003, at[2] - len]]);
      if (sh.length > 2) washAt(p, 31815 + k, '#33403c', 175, sh, 0.35, 0.15);
    }
    const d = camPoint(c, [0, 1.3, 12]); if (d) { glow(p, 31950, d[0], d[1], 430, 330, '#ffd98f', 80, 8); glow(p, 31960, d[0], d[1] + 40, 200, 150, '#fff6dc', 90, 5); }
    const w = gu(c, W), sh = shoulderPoint(WHEELER, w.g, w.u, {view: 'front'}, 'l');
    const walkW = (6.3 - W[2]) / STEP(1.78), walkF = (7.1 - F[2]) / STEP(1.72);
    let fistRedraw: ((q: Painter) => void) | undefined;
    const out: {a?: FigAnchors | null} = {};
    paintSorted(p, c, [
      ...bankFurniture(),
      fig(FRIEND, {at: F, view: 'front', face: 'neutral', faceState: {look: [0.15, 0.5]}, tint: {to: '#3d3346', u: 0.38}, seed: 3102, t, fig: {walk: walkF, stride: 0.45}}),
      fig(WHEELER, {at: W, view: 'front', face: 'smug', seed: 3101, t,
        fig: {walk: walkW, stride: 0.45,
          rArm: {to: [w.g[0] - 0.12 * w.u, w.g[1] - 1.1 * w.u], via: [w.g[0] - 0.17 * w.u, w.g[1] - 0.9 * w.u], behind: 'upper'},
          lArm: {to: [sh[0] + GUN_HAND[0] * w.u, sh[1] + GUN_HAND[1] * w.u], via: [sh[0] + GUN_ELBOW[0] * w.u, sh[1] + GUN_ELBOW[1] * w.u], flatFist: true, fist: mittenThumbSide('left', 'back'), onFlatFist: (r) => { fistRedraw = r; }}},
        held: (q, a, u) => {
          paintShoulderBag(q, 31930, [a.lShoulder[0] - 0.05 * u, a.lShoulder[1] + 0.01 * u], [w.g[0] + 0.07 * u, w.g[1] - 0.93 * u], 0.3 * u, 0.24 * u, {corner: true});
          const dx = a.lHand[0] - a.lUpper[0], dy = a.lHand[1] - a.lUpper[1], dl = Math.hypot(dx, dy) || 1;
          paintToyPistol(q, 31940, [a.lHand[0] - (dx / dl) * 0.05 * u, a.lHand[1] - (dy / dl) * 0.05 * u], u, GUN_ANG, {scale: 1.25, flip: true});
          fistRedraw?.(q);
          lemonPx(q, 31900, a.rHand[0] + 0.01 * u, a.rHand[1] - 0.045 * u, 0.04 * u, {glint: 1.4});
        }}, false, out),
    ]);
    if (pr && out.a) { pr.lead('WHEELER', {top: out.a.top, bottom: out.a.bottom, x: out.a.head[0]}); pr.lead('HEAD', {top: out.a.headTop, bottom: out.a.chin, x: out.a.head[0]}); }
  },
};
export const shot = makeShot(def);
