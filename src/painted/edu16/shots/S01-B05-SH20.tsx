import type {V3} from '../../kit/space';
import {withdrawToChest} from '../../kit/poses-seated-reach';
import {ease, mix} from '../clock';
import {RF, ROOF} from '../roof';
import {SH21_HAND} from '../scenes-roof';
import {makeShot} from '../shot';
import {LF_WOMAN, orbitMix, paintRoofWoman, roofState, type Orbit} from '../stage';

// S01-B05-SH20 W-OFF a [1450, 1472) (sheet #21). Camera: orbit((-0.06, 0.62, 0.04), r 1.05 -> 1.00, az -28 -> -27, eye 0.78, f 950, hy 600, pitch -6),
// near-still (eased over the shot). WOMAN `left`, `scared`, held breath, `withdraw-to-chest`: the right hand lifts off the button +2..+12 and closes to a
// fist at her chest +12..+16; +17..+21 it leaves the chest again down-left toward the lamp switch (continuity into SH21's SH21_HAND). Button still lit.
const A: Orbit = {at: [-0.06, 0.62, 0.04], r: 1.05, az: -28, eye: 0.78, f: 950, hy: 600, pitch: -6};
const B: Orbit = {...A, r: 1.0, az: -27};
const REACH = {wrist: LF_WOMAN.reach as V3, elbow: [-0.06, 0.52, 0.12] as V3};
const CHEST = {wrist: [-0.07, 0.78, 0.0] as V3, elbow: [0.0, 0.62, -0.06] as V3};
const lerp3 = (a: V3, b: V3, k: number): V3 => [mix(a[0], b[0], k), mix(a[1], b[1], k), mix(a[2], b[2], k)];
export const shot = makeShot('S01-B05-SH20', {
  paper: RF.zen,
  paint: (p, L, G) => {
    const w = withdrawToChest(ease(L, 2, 16), REACH, CHEST, {fistFrom: 12 / 14});
    const leave = ease(L, 17, 21), wrist = lerp3(w.wrist, lerp3(CHEST.wrist, SH21_HAND, 0.45), leave), elbow = lerp3(w.elbow, lerp3(CHEST.elbow, REACH.elbow, 0.4), leave);
    const fist = w.fist && leave < 0.5, hover = L < 2;
    paintRoofWoman(p, orbitMix(A, B, ease(L, 0, 22)), roofState('S01-B05-SH20', G), {
      w: {face: 'scared', t: 0.4 + G / 30, reach: wrist, rVia: elbow, look: [-0.6, 0.35], warm: 0.4, faceState: {mouth: 'flat'},
        mitts: [...(LF_WOMAN.mitts ?? []), ...(hover ? [] : [{hand: 'r' as const, kind: fist ? 'fist' as const : 'rest' as const, side: 1 as const, skin: '#b8a28e', ...(fist ? {} : {aimAt: leave > 0 ? ROOF.rocker : undefined})}])]},
      point: hover ? undefined : null, fall: [1150, 70], relight: true,
    });
  },
});
