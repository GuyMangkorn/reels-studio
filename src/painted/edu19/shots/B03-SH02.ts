import {INK, inkLine, solid, ell} from '../../kit/draw';
import {mixColor, type Pt} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {camPoint, camUnit} from '../../kit/ycam';
import {GIRL} from '../cast';
import {F} from '../field';
import {MAT} from '../mats';
import {ease, frac, lerp} from '../motion19';
import {makeShot} from '../shot';
import {sheetCam, sheetMove, type FieldShotDef} from '../stage';

// B03-SH02 · G 1100-1163 (63 f) · the mat stack (L07b, V05; EDU-EP19-SHEETS-R3, camera R2 hy 600). Push on the stack ST (the same object, colours
// and place as B01-SH01, `matStackItem`), cones right. On "สลับลำดับรอย" (l 20) GIRL's two hands enter from the frame's right edge at y ~800, grab
// the top teal mat at l 26 and drag it off frame right l 40-63 (`new: two-hand-drag`: screen-space forearms + mitten hands painted after the
// set in GIRL's skin, gripping the mat's right edge near and far corners; the top mat moves by `stackTop`).
const N = 63;
const M = sheetMove([1.6, 0.4, -6.3], [-10, -4], [1.3, 1.1], 0.8, {f: 950, hy: 600});
const TOP_Y = MAT.pallet + 14 * MAT.thick;
/** Top mat offset (m): a small lift at the grab, then dragged +x off frame, easing in. */
const topOff = (L: number): V3 => [1.9 * ease(frac(L, 40, 63)) ** 1.3, 0.04 * ease(frac(L, 26, 32)), 0];
const SKIN = GIRL.head.skin, EDGE = mixColor(SKIN, INK, 0.55);

export const B03_SH02: FieldShotDef = {
  id: 'B03-SH02', N,
  cam: (L) => sheetCam(M, L, N),
  state: (L) => ({sun: 'B03', t: L / 30, stack: true, stackTop: topOff(L),
    after: (p, c) => {
      if (L < 20) return;
      const d = topOff(L), reach = ease(frac(L, 20, 26));
      [[0.17, 9600], [-0.17, 9620]].forEach(([dz, seed], k) => {
        const grip: V3 = [F.ST[0] + MAT.side / 2 + d[0] - 0.02, TOP_Y + d[1] + 0.01, F.ST[2] + dz + d[2]];
        const q = camPoint(c, grip), u = camUnit(c, grip);
        if (!q) return;
        // From off the right edge (y ~800, the far arm a little higher) to the grip; the hand slides in along the forearm.
        const off: Pt = [1180, 800 + (k ? -40 : 30)], hand: Pt = [lerp(off[0], q[0], reach), lerp(off[1], q[1], reach)];
        // The forearm keeps one direction (to the right edge, slightly down), so it never swings round as the grip leaves the frame.
        const ang = Math.atan2(k ? 0.05 : 0.18, 1), w = 0.036 * u, nx = -Math.sin(ang) * w, ny = Math.cos(ang) * w;
        const tail: Pt = [hand[0] + Math.cos(ang) * 900, hand[1] + Math.sin(ang) * 900];
        const arm: Pt[] = [[hand[0] + nx, hand[1] + ny], [tail[0] + nx * 1.3, tail[1] + ny * 1.3], [tail[0] - nx * 1.3, tail[1] - ny * 1.3], [hand[0] - nx, hand[1] - ny]];
        const tone = k ? mixColor(SKIN, '#8a5a48', 0.18) : SKIN;
        solid(p, seed, tone, arm, 4, 0.03, 0.06);
        solid(p, seed + 5, mixColor(tone, '#8a5a48', 0.3), [[hand[0] + nx * 0.2, hand[1] + ny * 0.2], [tail[0] + nx * 0.3, tail[1] + ny * 0.3], arm[1], arm[0]], 3, 0.03, 0.06);
        inkLine(p, seed + 1, [arm[0], arm[1]], {closed: false, weight: 0.8, color: EDGE, curve: 0});
        inkLine(p, seed + 2, [arm[3], arm[2]], {closed: false, weight: 0.8, color: EDGE, curve: 0});
        const mitt = ell(hand[0] - 0.015 * u, hand[1], 0.07 * u, 0.052 * u, 18, ang);
        solid(p, seed + 3, tone, mitt, 4, 0.03, 0.06);
        inkLine(p, seed + 4, mitt, {weight: 0.8, color: EDGE, curve: 0.3});
      });
    }}),
};
export const shot = makeShot(B03_SH02);
