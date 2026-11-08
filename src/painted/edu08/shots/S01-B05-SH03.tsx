import {camMove} from '../../kit/cam-moves';
import type {FaceState} from '../../kit/head';
import type {Pt} from '../../kit/painter';
import {ease, mix} from '../clock';
import {paintAirlock} from '../rooms';
import {AST_DEF, CREW_DEF, ZG_NEUTRAL, paintSuited} from '../suit';
import {camAt, dry, openEyesT, reachTo} from '../stage';
import {makeShot} from '../shot';

// S01-B05-SH03 (G 1511-1610, SHEETS-R2.4: time shift only, +14; R2.3 1497-1596, R2 1498-1592 L12b) the urge to hold (silent beat L0-14 + L13a "คุณจะอยากกลั้นหายใจไว้… แต่ในที่ที่ไม่มีอากาศ").
// SD16: L2-10 her chest lifts 0.02 m with the lips pressed shut (CL01 echo, before the line names it), held; CREW's near glove tightens on hers L6-14 (pulled
// 0.025 m in and 0.015 m up, her arm follows); he leans in 0 -> 12 deg over L15-63; on "แต่" (L63, G1574; R2.3 G1560) her shoulders drop to -0.012 m and the lips part (L63-71).
// No breath-in image: no puffed cheeks, no lung drawing; the lift is small and held, not a gasp (the line is the viewer's urge, not a reflex).
// cam (SD06): (0.12, 0.25, 0.28), yaw 200->192, r 1.36->1.30, eye 0.35, pitch -4, f 800, hy 820.
const N = 99, cam = (L: number) => camAt(camMove([0.12, 0.25, 0.28], [200, 192], [1.36, 1.3], 0.35, {pitch: [-4, -4], f: 800, hy: 820}), L, N);
export type TwoShotOpts = {
  /** CREW lean 0..1 of 12 deg. */ k: number;
  face: 'neutral' | 'happy'; faceState?: Partial<FaceState>; quarter?: 'left';
  /** AST shoulders/chest rise, metres (`fig.rise`). */ rise?: number;
  /** CREW's near glove pulled toward him 0..1 (the squeeze, 0.025 m in, 0.015 m up). */ squeeze?: number;
  /** AST ambient time override (blink control); default G / 30. */ tAst?: number;
  seed?: number;
};
export const twoShot = (p: Parameters<typeof paintAirlock>[0], c: ReturnType<typeof cam>, G: number, o: TwoShotOpts) => {
  const sq = o.squeeze ?? 0, crewTo: Pt = [mix(0.11, 0.085, sq), mix(-0.265, -0.25, sq)];
  const crew = paintSuited(p, c, CREW_DEF, {at: [0.4, -0.79, 0.35], view: 'right', helmet: 'visor', stripes: true, t: G / 30, fig: {lean: 0.12 * o.k}, r: {to: crewTo, via: [-0.12, -0.22]}, seed: 7501 + (o.seed ?? 0)});
  const at: [number, number, number] = [-0.15, -0.62, 0.2];
  const a = {at, view: 'front' as const, quarter: o.quarter, helmet: 'off' as const, face: o.face, faceState: o.faceState, t: o.tAst ?? G / 30, rim: 0 as const, seed: 7201,
    ...(o.rise !== undefined ? {fig: {rise: o.rise}} : {})};
  const probe = paintSuited(dry(p), c, AST_DEF, a);
  const r = crew && probe ? reachTo(probe.rShoulder, probe.u, crew.rHand, 0.07, 0.05) : {to: [-0.22, -0.22] as Pt, via: [0.03, -0.25] as Pt};
  return paintSuited(p, c, AST_DEF, {...a, r, l: ZG_NEUTRAL('l')});
};
/** AST face over L (SD16): lips parted (`talk` 0.12: a slit, not the round `o` that reads as "oh!") L0-3 -> pressed (`frown` closed line, corners level-down, never
 * the `line` smile) L4-62 -> parted again on "แต่" from L63 (`talk` >= 0.08: a closed `talk` would draw the smile line). */
const faceAt = (L: number): Partial<FaceState> => {
  const look: Pt = [-0.6, 0.05];
  if (L < 4) return {brow: 'worry', eyes: 'dot', look, mouth: 'talk', open: 0.12};
  if (L < 63) return {brow: 'worry', eyes: 'dot', look, mouth: 'frown'};
  return {brow: 'worry', eyes: 'dot', look, mouth: 'talk', open: 0.08 + 0.04 * ease(L, 63, 71)};
};
export const shot = makeShot('S01-B05-SH03', {
  paper: '#8a97a8',
  paint: (p, L, G) => {
    const c = cam(L);
    paintAirlock(p, c, {lamp: 0, needle: 0});
    const rise = 0.02 * ease(L, 2, 10) - 0.032 * ease(L, 63, 71);
    const tAst = L < 15 || L >= N - 2 ? openEyesT(G / 30, 7201) : G / 30;
    twoShot(p, c, G, {k: ease(L, 15, 63), face: 'neutral', faceState: faceAt(L), rise, squeeze: ease(L, 6, 14), tAst});
  },
});
