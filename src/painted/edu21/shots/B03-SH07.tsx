import {camMove, camOf} from '../../kit/cam-moves';
import type {Eyes} from '../../kit/head';
import {washAt} from '../../kit/draw';
import {wp} from '../../kit/world';
import type {YCam} from '../../kit/ycam';
import {sagCam} from '../car';
import {HANDS, paintDriverAt} from '../driver';
import {paintExterior, paintRain} from '../exterior';
import {paintNearShade, sm} from '../explain';
import {makeShot} from '../shot';

// B03-SH07 · G548-636 · relief, then the tyre (L06). EDU-EP21-SHEETS-R1 shot block (SD05, SD11, SD12); Boss W5.2 BG4, 2026-11-16.
// Camera `camMove(at (-0.15, 1.0, 0.38) -> (1.30, 0.40, 0.75), yaw 6->18, r 1.9->2.0, eye 1.15->0.60, f 1100, hy 620, ease [0.53, 0.93])`
// on u = L / 87: holds on her right profile through the closed driver glass to L46, then descends to the FR wheel L47-82 ("ดู" G598 = L50).
// DRIVER `facing +x`, view `right` held (the lens moves forward past her, so the eight views would pop to a front three-quarter at L48;
// SD08's rule), live colour, hands on the thighs (hidden below the beltline): `worried` L0-3, relieved breath L4-30
// (shoulders drop 2 cm and recover, `relieved`), eyes shut L10-18, `neutral` from L44. CAR21 sag 0 -> 0.02 m L47-82 (car.ts `sagCam`, the
// body, glass and cabin rigid together). FR damage (SD12, B03 reveal): the matte scorch #3a2a22 stays in the contact shade (unreadable) and
// comes up only as the descent arrives, readable from L70; the split is a hairline. No glow, no smoke. Lower door in shade (as B01-SH02).

export const CAM = camMove([[-0.15, 1.0, 0.38], [1.3, 0.4, 0.75]], [6, 18], [1.9, 2.0], [1.15, 0.6], {f: 1100, hy: 620, ease: [0.53, 0.93]});
const N = 88;
export const camAt = (L: number): YCam => camOf(CAM, L / (N - 1));
/** Body sag at the FR corner (m): 0 -> 0.02 over the descent. */
export const sagAt = (L: number) => 0.02 * sm(L, 47, 82);
/** How much of the scorch reads (0 = lost in the contact shade): up L62-72, so it is readable from L70 and not before the descent lands. */
export const scorchAt = (L: number) => sm(L, 62, 72);
/** Relieved breath L4-30: shoulders drop 2 cm and come back. */
const breath = (L: number) => (L >= 4 && L <= 30 ? -0.02 * Math.sin((Math.PI * (L - 4)) / 26) : 0);
const eyesAt = (L: number): Eyes | undefined => (L === 10 || L === 18 ? 'half' : L > 10 && L < 18 ? 'shut' : undefined);

export const shot = makeShot({
  id: 'B03-SH07', N, paper: '#262e38',
  paint: (p, L, G) => {
    const c = camAt(L), t = G / 30, sag = sagAt(L), eyes = eyesAt(L);
    const face = L < 4 ? 'worried' : L < 44 ? 'relieved' : 'neutral';
    paintExterior(p, c, {t, tufts: [], car: {glassOp: 60, inkBreakWheels: true, sag, frDamage: {scorch: scorchAt(L), split: 0.002},
      inside: (q, cc) => paintDriverAt(q, cc, {face, hands: HANDS.thighs, lift: breath(L), tint: 0.1, ...(eyes ? {faceState: {eyes}} : {})}, {t, view: 'right'})}});
    // the sky key comes from above: the door under the shoulder crease in shade (B01-SH02's washes, stopped short of the FR arch so the
    // scorch is not shaded), on the sagged body; it keeps the door out of the caption band while the door is there and eases out L47-75 as
    // the descent brings the road into the band (a dark panel ending before the arch otherwise)
    const cb = sagCam(c, sag), sh = 1 - sm(L, 47, 75);
    if (sh > 0) washAt(p, 42100, '#240c0b', 170 * sh, wp(cb, [[0.93, 0.28, 0.853], [-1.7, 0.28, 0.853], [-1.7, 0.7, 0.853], [0.93, 0.7, 0.853]]), 0.3, 0.3);
    if (sh > 0) washAt(p, 42101, '#240c0b', 80 * sh, wp(cb, [[0.93, 0.66, 0.853], [-1.7, 0.66, 0.853], [-1.7, 0.77, 0.853], [0.93, 0.77, 0.853]]), 0.4, 0.3);
    // as the descent lands the band sits over the wet shoulder in front of the lens (z 1.2-2.0), where the mirrored car lifted the band
    // mean to 0.252 at L70: the near ground eases into shade L55-70 (BG3's `paintNearShade`)
    paintNearShade(p, c, 0.8 * sm(L, 55, 70), 1.2);
    paintRain(p, t);
  },
});
