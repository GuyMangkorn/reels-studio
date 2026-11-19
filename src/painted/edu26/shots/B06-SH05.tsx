import type {Arm} from '../../kit/cast';
import {hardFill} from '../../kit/draw';
import type {Pt} from '../../kit/painter';
import {poseArms} from '../../kit/poses';
import type {V3} from '../../kit/space';
import {camUnit} from '../../kit/ycam';
import {act, arm, LF07_COIN, paintHeroCoin, SC} from '../r4-looks';
import {paintCoin, paintRibbons, PASSERBY} from '../r4-cast';
import {makeShot, STREET_PAPER, type Shot26} from '../shot';
import {paintStreet} from '../street';
import {MARCUS_DAMP, walkBetween} from '../acts26';
import {camKeys, ease, lerp, rec} from '../stage26';

// B06-SH05 · G [1800, 1894) · the street, final frame LF07 (approved, measured) and the 2.0 s closing hold (SHEET-R1 part B). Dusk street outside
// the fullery. Marcus (barefoot, damp hem) walks in from (-0.42, 0, -1.05) to (-0.42, 0, -0.45) by L22 facing (0.15, 1), raises the fist with the
// coin L22-L32 (painted mitten, the LF07 R5 bent "victory" arm on the drawn shoulder), glint from L32; the CL04 ribbons rise off his shoulders
// from L10, full by L26, three then a pair from L60. The passer-by (+0.55, 0, -2.10) turns at L14 (from walking past toward +x to facing him,
// (-1, 0.45)), leans away L20-L28 and the nose pinch lands at L30 and holds, with a small head waft; no ribbon touches her. Camera: SC.A at L0,
// drift to eye z 2.20 by L34, eased push to the LF07 end (SC.LF07) arriving at L93, held on the last frame.
const N = 94;
const M0: V3 = [-0.42, 0, -1.05], M1: V3 = [-0.42, 0, -0.45], PA: V3 = [0.55, 0, -2.1];
const mixArm = (a: Arm | undefined, b: Arm, k: number): Arm => {
  if (!a || k >= 1) return b;
  const m = (p: Pt, q: Pt): Pt => [lerp(p[0], q[0], k), lerp(p[1], q[1], k)];
  return {...b, to: m(a.to, b.to), via: m(a.via ?? a.to, b.via ?? b.to)};
};
export const def: Shot26 = {
  id: 'B06-SH05', N, paper: STREET_PAPER,
  cam: (L) => camKeys([[0, SC.A], [34, {...SC.A, z: 2.2}], [93, SC.LF07]], L),
  paint: (p, L, c, pr) => {
    const t = L / 30, mw = walkBetween(L, 0, 22, M0, M1), raise = ease(L, 22, 32), turn = ease(L, 12, 20), lean = ease(L, 20, 28), pinch = ease(L, 24, 30);
    const rib = ease(L, 10, 26), waft = L > 30 ? Math.sin((L - 30) / 14) * 0.5 : 0;
    paintStreet(p, c, {mood: 'dusk'}, (q, cc) => {
      const pf: [number, number] = [lerp(1, -1, turn), lerp(-0.2, 0.45, turn)];
      rec(pr, 'passer', act(q, cc, {def: PASSERBY, at: PA, facing: pf, pose: 'P12', face: turn > 0.5 ? 'disgusted' : 'neutral', seed: 2652, t,
        fig: {lean: 0.16 * lean, headCock: 4 * waft},
        arms: (g, u, view) => {
          const base = poseArms('P01', PASSERBY, g, u, view === 'back' ? 'front' : view);
          const hy = g[1] - (PASSERBY.height - 0.2) * u, nose: Pt = [g[0] - 0.06 * u, hy + 0.11 * u];
          return {rArm: base.rArm, lArm: mixArm(base.lArm, arm(nose, [g[0] - 0.16 * u, hy + 0.32 * u], {fist: -1}), pinch)};
        },
        held: (qq, a, u) => hardFill(qq, 34900, '#b88a4f', [[a.rHand[0] - 0.14 * u, a.rHand[1] - 0.04 * u], [a.rHand[0] + 0.14 * u, a.rHand[1] - 0.04 * u], [a.rHand[0] + 0.11 * u, a.rHand[1] + 0.14 * u], [a.rHand[0] - 0.11 * u, a.rHand[1] + 0.14 * u]])}));
      let fist: Pt | null = null;
      const m = act(q, cc, {def: MARCUS_DAMP, at: mw.at, facing: [0.15, 1], pose: 'P01', face: 'happy', seed: 2651, t,
        fig: mw.walk !== undefined ? {walk: mw.walk, stride: mw.stride} : {},
        arms: (g, u, view, an) => {
          if (!an || raise <= 0) return {};
          const S = an.rShoulder, uu = camUnit(cc, [mw.at[0], 1.2, mw.at[2]]);
          const up = arm([S[0] - 0.13 * uu, S[1] - 0.25 * uu], [S[0] - 0.25 * uu, S[1]], {fist: 1});
          const base = poseArms('P01', MARCUS_DAMP, g, u, view === 'back' ? 'front' : view).rArm;
          const a = mixArm(base, up, raise);
          fist = a.to;
          return {rArm: a};
        }});
      rec(pr, 'marcus', m);
      const f = fist as Pt | null, uu = camUnit(cc, [mw.at[0], 1.4, mw.at[2]]);
      if (f) {
        const at: Pt = [f[0] + 0.005 * uu, f[1] - 0.085 * uu];
        if (L >= 32) paintHeroCoin(q, at, 0.012 * LF07_COIN * uu, 34800); else paintCoin(q, at, 0.012 * LF07_COIN * uu, 34800, 0.15);
        if (pr) Object.assign(pr, {coinX: Math.round(at[0]), coinY: Math.round(at[1]), coinPx: Math.round(0.024 * LF07_COIN * uu)});
      }
      if (m && rib > 0) {
        const u = camUnit(cc, mw.at), sh: Pt[] = [[m.lShoulder[0], m.lShoulder[1]], [m.rShoulder[0], m.rShoulder[1]]];
        // W5.2: aimed higher than LF07's (+0.45, -0.75) so the tips clear the passer-by's head on the push (no ribbon touches her)
        paintRibbons(q, 35000, [sh[0][0] + 0.05 * u, sh[0][1]], [sh[0][0] + 0.22 * u, sh[0][1] - 1.0 * u], {w: 0.08 * u * 0.7, op: 160, spread: 0.05 * u, bow: 0.25, waves: 1.6,
          count: L < 60 ? 3 : 2, t, grow: rib});
      }
    });
  },
};
export const shot = makeShot(def);
