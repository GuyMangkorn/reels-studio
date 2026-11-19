import {paintBox} from '../../kit/world';
import type {V3} from '../../kit/space';
import {camUnit} from '../../kit/ycam';
import {paintPalace, paintTable} from '../palace';
import {act} from '../r4-looks';
import {paintCoin, paintLaurel, VESPASIAN} from '../r4-cast';
import {CoinLayer, makeShot, PALACE_PAPER, type Shot26} from '../shot';
import {armTo} from '../acts26';
import {camKeys, ease, lerp3, rec, yc} from '../stage26';

// B06-SH01 · G [1446, 1550) · the emperor weighs a coin, coin-flip reveal (SHEET-R1 part B). L0-L14 the coin flip: the full-frame bronze coin from
// B05-SH01's push turns (rotateY 0 -> 90, edge-on at L5) and its reverse rim (90 -> 180) fades by L14, revealing the imperial room (lamp light).
// The camera then eases in on Vespasian seated behind the marble table (`smug`, laurel): he lifts a coin from the bronze bowl to his eye line by
// L20 and squints at L70 (est). Slow push eye z 2.20 -> 1.55 by L103. No text, no collectors, no ribbons. Hands: mittens (the coin is painted).
const N = 104;
const C0 = yc(0, 1.3, 2.2, 0, -6, 950), C1 = yc(0, 1.3, 1.55, 0, -6, 950);
const AT: V3 = [0, 0, -0.9];
export const def: Shot26 = {
  id: 'B06-SH01', N, paper: PALACE_PAPER,
  cam: (L) => camKeys([[0, C0], [103, C1]], L),
  paint: (p, L, c, pr) => {
    const t = L / 30, lift = ease(L, 8, 20), squint = ease(L, 66, 72);
    const coin = lerp3([0.28, 0.86, -0.25], [0.2, 1.05, -0.6], lift);
    paintPalace(p, c, {mood: 'lamp'}, (q, cc) => {
      // the chair behind him (a plain curule seat: two dark legs and a seat board, behind the figure)
      paintBox(q, cc, 36900, {x0: -0.28, x1: 0.28, y0: 0.42, y1: 0.48, z0: -1.12, z1: -0.78}, '#5a3a24', {front: -0.15, top: 0.1});
      const m = act(q, cc, {def: VESPASIAN, at: AT, facing: [0, 1], face: 'smug', faceState: {squint: 0.15 + 0.6 * squint}, seed: 2642, t, look: [0.35 * lift, -0.15 * lift],
        fig: {sit: 1}, arms: () => (L >= 6 ? {lArm: armTo(cc, [coin[0] + 0.02, coin[1] - 0.03, coin[2]], -1, {fist: true, drop: 0.25})} : {}),
        held: (qq, a) => paintLaurel(qq, a, 'front', 34600)});
      rec(pr, 'vesp', m);
      paintTable(q, cc, {mood: 'lamp'});
      const g = camUnit(cc, coin);
      if (L >= 6 && m) paintCoin(q, [m.lHand[0], m.lHand[1] - 0.04 * g], 0.012 * 2.2 * g, 36950, 0.12);
    });
  },
  fx: (L) => {
    if (L > 14) return null;
    const rot = L <= 5 ? 90 * ease(L, 0, 5) : 90 + 90 * ease(L, 5, 14);
    return <CoinLayer c={{cx: 540, cy: 960, d: 2700, rot, op: L <= 5 ? 1 : 1 - ease(L, 5, 14), back: L > 5}} />;
  },
};
export const shot = makeShot(def);
