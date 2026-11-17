import {Flash} from '../../kit/glow';
import {camMove, camOf} from '../../kit/cam-moves';
import type {V3} from '../../kit/space';
import {camPoint} from '../../kit/ycam';
import {Bolt, BOLT_W, boltEnv, boltFull, boltPaths, paintStrikeRim, type BoltOpts} from '../bolt';
import {B01_DRIVER, paintDriverAt} from '../driver';
import {paintExterior, paintRain} from '../exterior';
import {makeShot} from '../shot';

// B01-SH01 · G0-29 · the strike (L01a). EDU-EP21-SHEETS-R4 shot block (D-U1); look LF01 (approved r3). Boss W5.2 BG1, 2026-11-16; FX4 2026-11-17.
// Camera `cam((0.6, 0.55, 0.4), 40->38, 3.8->3.75, 0.45, 1150, 1000)` over L0-29 (SD04), linear, no shake. Far fork G0-2 full, G3-5 dim,
// G7-8 second flicker, gone G9. Strike (SD19, R4): a bold bolt from the frame top lands on the near rear roof edge T, `double` envelope on
// STRIKE 12 (leader G10-11, return stroke G12-13, dark gap G14, restrike G15-16, afterglow G17-19, off G20); kit Flash 0.40 G12-13, 0.15
// G14, 0.30 G15-16, linear to 0 by G21, drawn UNDER the bolt; cold rim and lit rain on the full frames (G12-13, G15-16); dash glow and its
// wash on her face G0-12. DRIVER on the B01 track (wheel, jolt from G14). Damage unreadable (SD12): no FR damage drawn.
// T = (-0.70, 1.49, +0.62): the roof's near edge is z 0.64 at y 1.49 (car.ts GH), so T sits 0.02 m inside it (sheet: <= 0.04 m).

const CAM = camMove([0.6, 0.55, 0.4], [40, 38], [3.8, 3.75], 0.45, {f: 1150, hy: 1000});
const N = 29, STRIKE = 12;
export const T: V3 = [-0.7, 1.49, 0.62];
const W = (...p: [number, number, number][]): V3[] => p;
export const BOLT: BoltOpts = {
  top: 70, seed: 41000,
  path: W(T, [-0.62, 1.95, 0.6], [-0.78, 2.45, 0.55], [-0.5, 2.95, 0.5], [-0.58, 3.45, 0.4], [-0.25, 4.0, 0.3], [-0.3, 4.6, 0.2], [0.05, 5.4, 0.1], [0.2, 6.5, 0]),
  branches: [
    W([-0.5, 2.95, 0.5], [-1.15, 2.25, 0.55], [-1.35, 1.95, 0.5]),
    W([-0.25, 4.0, 0.3], [-0.1, 3.25, 0.4], [0.2, 2.95, 0.35], [0.35, 2.7, 0.35]),
    W([-0.3, 4.6, 0.2], [-0.85, 3.85, 0.3], [-1.2, 3.55, 0.3]),
    W([0.05, 5.4, 0.1], [0.4, 4.45, 0.2], [0.8, 4.1, 0.2]),
  ],
};
export const camAt = (L: number) => camOf(CAM, L / N);
export const envAt = (L: number) => boltEnv('double', L - STRIKE);
/** Far fork level by G (sheet: full G0-2, dim G3-5, second flicker G7-8, gone G9). */
const forkLevel = (G: number) => (G <= 2 ? 1 : G <= 5 ? 0.45 : G === 7 || G === 8 ? 0.85 : 0);
/** Kit Flash level (R4): 0.40 G12-13, 0.15 G14, 0.30 G15-16, linear to 0 by G21. */
export const flashLevel = (L: number) => (L < STRIKE ? 0 : L <= 13 ? 0.4 : L === 14 ? 0.15 : L <= 16 ? 0.3 : Math.max(0, (0.3 * (21 - L)) / 5));

export const shot = makeShot({
  id: 'B01-SH01', N, paper: '#262e38',
  paint: (p, L, G) => {
    const c = camAt(L), t = G / 30, s = B01_DRIVER(G), lit = boltFull(envAt(L));
    paintExterior(p, c, {t, fork: {x: 200, span: [250, 560], level: forkLevel(G)},
      car: {dashGlow: s.dashGlow, inside: (q, cc) => paintDriverAt(q, cc, {...s, tint: G > STRIKE ? 0.1 : 0}, {t})}});
    if (lit) paintStrikeRim(p, c, camPoint(c, T), 1);
    paintRain(p, t, lit ? {count: 260, color: '#eef4ff'} : {});
  },
  overlay: (L) => {
    const f = flashLevel(L);
    return <>
      {f > 0 && <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}><Flash level={f} /></svg>}
      <Bolt b={boltPaths(camAt(L), BOLT)} env={envAt(L)} w={BOLT_W} flare={{r: 18, glow: 80}} id="ep21-sh01-bolt" />
    </>;
  },
});
