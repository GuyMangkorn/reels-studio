import type {V3} from '../../kit/space';
import {camPoint, camUnit} from '../../kit/ycam';
import {GLOW_COLOR, GLOW_STEPS, glowStep} from '../glow';
import {O2_LEVELS, ORDER_O2, slotX} from '../mats';
import {ease, frac, lerp} from '../motion19';
import {makeShot} from '../shot';
import {sheetCam, sheetMove, sine01, type FieldShotDef} from '../stage';
import {ROUND1_FIVE} from '../trail';

// B03-SH06 · G 1307-1397 (90 f) · the order of smells is scrambled (L08a, L08b; EDU-EP19-SHEETS-R3, camera R2 high slide). The O2 mats pass under the
// lens lit at their jumbled sizes (all 13, slot glow r0 0.4 m). On "ลำดับกลิ่นก็มั่ว" (l 46) the GHOST ROW fades in (6 f) to 35 % and holds 18 f:
// five dashed drawn rings 0.4 m above the mats, round 1's rising sizes S1 -> S5 left to right (a drawing, no haze); l 64-79 they slide down to the
// mats, each ring easing to the size of the mat glow under it, and vanish (the arrow breaks). SVG overlay over the glow layer.
const N = 90;
const M = sheetMove([[-2.4, 0.05, 0], [1.4, 0.05, 0]], [-6, -2], 1.6, 1.2, {f: 950, hy: 1000, pitch: [-34, -34]});
/** Ghost x positions: spread round the camera target mid-ghost (l 58), fixed in the world so they ride the slide. */
const X46 = lerp(-2.4, 1.4, sine01(58 / N));
const GHOST = ROUND1_FIVE.map(({level}, k) => ({x: X46 + (k - 2) * 0.42, level}));
const R0 = 0.4;
const nearestSlot = (x: number) => Math.max(0, Math.min(12, Math.round((x - slotX(0)) / (slotX(1) - slotX(0)))));

export const B03_SH06: FieldShotDef = {
  id: 'B03-SH06', N,
  cam: (L) => sheetCam(M, L, N),
  state: (L) => ({sun: 'B03', t: L / 30, stack: false, mats: {order: ORDER_O2, prints: 0.6}}),
  glow: () => ORDER_O2.map((_, i) => ({at: [slotX(i), 0.03, 0] as V3, level: O2_LEVELS[i], r: R0, seed: i})),
  overlay: (L) => {
    if (L < 46 || L >= 80) return null;
    const c = sheetCam(M, L, N), down = ease(frac(L, 64, 79)), op = 0.35 * frac(L, 46, 52) * (1 - frac(L, 72, 79));
    return (
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: op}}>
        {GHOST.map(({x, level}, k) => {
          const s = nearestSlot(x), at: V3 = [lerp(x, slotX(s), down), lerp(0.4, 0.03, down), 0], q = camPoint(c, at), u = camUnit(c, at);
          if (!q) return null;
          const r = R0 * lerp(GLOW_STEPS[glowStep(level)], GLOW_STEPS[glowStep(O2_LEVELS[s])], down) * u;
          return <ellipse key={k} cx={q[0]} cy={q[1]} rx={r} ry={r * 0.56} fill={GLOW_COLOR} fillOpacity={0.25} stroke={GLOW_COLOR} strokeWidth={5} strokeDasharray="14 10" strokeLinecap="round" />;
        })}
        {down < 0.05 && (() => {
          // The rising arrow the ghosts draw: a dashed line through their tops, left -> right.
          const pts = GHOST.map(({x, level}) => { const q = camPoint(c, [x, 0.4, 0]), u = camUnit(c, [x, 0.4, 0]); return q ? [q[0], q[1] - R0 * GLOW_STEPS[glowStep(level)] * u * 0.56 - 14] : null; }).filter(Boolean) as number[][];
          return <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={GLOW_COLOR} strokeWidth={4} strokeDasharray="10 12" strokeLinecap="round" />;
        })()}
      </svg>
    );
  },
};
export const shot = makeShot(B03_SH06);
