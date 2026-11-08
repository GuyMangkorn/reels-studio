import {camMove, camOf} from '../kit/cam-moves';
import {makePainter, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import type {YCam} from '../kit/ycam';
import {paintEarth} from '../kit/earth';
import {blinking} from '../kit/head';
import type {ArmM, EvaOpts} from '../kit/eva';
import {paintTruss} from './orbit';
import {AST_AT} from './scenes';
import {AST_DEF, paintSuited, type SuitedAnchors} from './suit';
import {mix} from './clock';

// EDU-EP08-SHORT shot staging helpers shared by the shot files: the orbit backdrop, AST on her foot point, arm blends and a picture-space arm solver.
// Ambient clock = G / 30 s, continuous across cuts (zero-g bob, hair, glitter twinkle).

export const tetherFrom = (at: V3): V3 => [at[0] + 0.12, at[1] + 0.57, at[2] + 0.05];
/** Earth and truss (with AST's tether) for the orbit shots. */
export const orbitBack = (p: Painter, c: YCam, G: number, o: {at?: V3; earth?: Parameters<typeof paintEarth>[2]} = {}) => {
  const {limb} = paintEarth(p, c, o.earth);
  paintTruss(p, c, {t: G / 30, tether: {from: tetherFrom(o.at ?? AST_AT)}});
  return limb;
};
/** AST (woman-bob + eva-suit) on her foot point; any `EvaOpts` field overrides. */
export const ast = (p: Painter, c: YCam, G: number, o: Partial<EvaOpts> = {}): SuitedAnchors | null =>
  paintSuited(p, c, AST_DEF, {at: AST_AT, view: 'front', helmet: 'off', t: G / 30, rim: -1, seed: 7201, ...o});
/** A camera from a sheet `cam:` move at shot-local frame L of n. */
export const camAt = (m: ReturnType<typeof camMove>, L: number, n: number): YCam => camOf(m, L / n);
/** Arm blend (k 0..1). */
export const armMix = (a: ArmM, b: ArmM, k: number): ArmM => ({
  to: [mix(a.to[0], b.to[0], k), mix(a.to[1], b.to[1], k)], via: [mix(a.via[0], b.via[0], k), mix(a.via[1], b.via[1], k)], near: mix(a.near ?? 0, b.near ?? 0, k),
});
/** An arm (metres from `shoulder`, picture px / `u`) whose hand lands on picture point `target`; the elbow sags a little below the straight line. */
export const reachTo = (shoulder: Pt, u: number, target: Pt, sag = 0.07, near = 0): ArmM => {
  const to: Pt = [(target[0] - shoulder[0]) / u, (shoulder[1] - target[1]) / u];
  return {to, via: [to[0] * 0.5, to[1] * 0.5 - sag], near};
};
/** A painter that draws nothing: runs a figure to read its anchors before the real pass. `p.layer(0, 1)` is not invisible (it inks opaque in the fade colour), so the brush is a no-op proxy. */
const NOOP: unknown = new Proxy(function () {}, {get: (_t, k) => (k === 'then' ? undefined : NOOP), apply: () => NOOP});
export const dry = (p: Painter): Painter => makePainter(new Proxy({}, {get: () => NOOP}) as never, {t: p.t, frame: p.frame});
/** Ambient time `t` stepped past the rig's auto blink (`head.ts` `blinking`, shut 0.13 s; the head uses the figure seed + 1) so the eyes are open on this
 * frame: cut frames and held-open beats (SHEETS-R2.3 SD18). Moves `t` by at most 5 frames, only on the frames the blink would close. */
export const openEyesT = (t: number, figSeed: number): number => { let s = t; for (let i = 0; i < 5 && blinking(s, figSeed + 1); i++) s += 1 / 30; return s; };
export const hash01 =(n: number): number => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
