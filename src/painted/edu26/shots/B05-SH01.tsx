import {LANDMARKS} from '../../kit/hand-place';
import type {V3} from '../../kit/space';
import {camPoint, camUnit} from '../../kit/ycam';
import {paintFullonica, STALL_Z0} from '../fullonica';
import {act, COIN_SCALE, layer} from '../r4-looks';
import {paintCoin, paintRibbons, SENIOR} from '../r4-cast';
import {bodyFacing, facePoint, pick3D, rigHands} from '../r4-hands';
import {CoinLayer, makeShot, type Shot26} from '../shot';
import {talkShot} from '../talk26';
import {armTo, MARCUS_DAMP} from '../acts26';
import {ease, easeIn, lerp, lerp3, rec, yc} from '../stage26';

// B05-SH01 · G [1267, 1446) · the first coin, sniffed; CL03 template (SHEET-R1 part B). Profile medium close square to Marcus (facing +x, his
// right side to the lens), `evening`. The senior's hand enters from screen right at L13 and drops the coin into Marcus's right hand at L22
// ("เหรียญแรก", LC); he studies it L28-L68 (eyes down), lifts it on "ยกขึ้นมาดม" L76 to the nose by L90 and holds (sniff); on "รอดแล้ว" L144 he
// exhales, shoulders drop, `worried` -> `relieved`. UT14 exception: the coin hand is the five-finger 3D pinch with the 3D coin (KP-MARCUS-CLOSE
// `sniff` cell spec, approved), the painted arm to the wrist. Two ribbons behind his head (left), none near the coin. Transition push L161-L178:
// a bronze coin disc grows from the coin (42 px) to cover the frame (ease-in), the first half of the coin flip into B06-SH01.
// Camera: the sheet line is an estimate; the CL03 screen values (nose (388, 767), coin (436, 767), about 42 px) are the contract, tuned with
// measure-shots.ts (W5.2 values below).
const N = 179;
const CAM = yc(-0.547, 1.25, 0.85, 0, 0, 1000, 879);
const AT: V3 = [-0.85, 0, -0.35], SEN: V3 = [0.05, 0, -0.35];
const body = bodyFacing(MARCUS_DAMP, AT, [1, 0]);
const NOSE = facePoint(body, 0.12, -0.03), SNIFF: V3 = [NOSE[0] + 0.058, NOSE[1], NOSE[2] + 0.03], CHEST: V3 = [AT[0] + 0.3, 1.0, AT[2] + 0.05];
const coinAt = (L: number): V3 => lerp3(CHEST, SNIFF, ease(L, 76, 90));
// Draft fix B (19 Nov 2026): the elbow hangs under the hand instead of jutting 0.4 m forward (the KP sniff cell pole [0.1, -1, 0.6] read as a
// long horizontal upper arm at the nose); the painted arm is `exact` so the three-quarter turn no longer pulls its end off the 3D wrist.
const POLE: V3 = [0.15, -1, 0.25];
const rigAt = (L: number) => {
  const c = coinAt(L), has = L >= 22;
  return rigHands(body, {right: {gesture: 'pinch', put: {landmark: LANDMARKS.pinch, at: [c[0], c[1] - 0.012 * COIN_SCALE * 2.6, c[2]]}, f: [0.1, 1, 0.1], b: [0.5, 0, -1]}},
    45500, has ? {coin: 'right', coinScale: COIN_SCALE, coinFace: [0, 0, 1], coinLift: 2.6, pole: {right: POLE}} : {pole: {right: POLE}});
};
const DROP: V3 = [CHEST[0] + 0.03, CHEST[1] + 0.16, CHEST[2]];
export const def: Shot26 = {
  id: 'B05-SH01', N,
  cam: () => CAM,
  paint: (p, L, c, pr) => {
    const t = L / 30, r = rigAt(L), study = ease(L, 26, 32) * (1 - ease(L, 70, 78)), relief = ease(L, 142, 150);
    const reach = ease(L, 11, 20) * (1 - ease(L, 26, 36));
    paintFullonica(p, c, {mood: 'evening', t}, {
      noPoles: true,
      stallLiquidFrom: [STALL_Z0, STALL_Z0, STALL_Z0],
      room: (q, cc) => {
        // the senior at the right edge: only his reaching arm and hand enter the frame
        rec(pr, 'senior', act(q, cc, {def: SENIOR, at: SEN, facing: [-1, 0], face: 'happy', seed: 2621, t,
          arms: () => (reach > 0.01 ? {rArm: armTo(cc, lerp3([SEN[0] - 0.1, 0.8, SEN[2] + 0.1], [DROP[0] + 0.04, DROP[1] + 0.03, DROP[2]], reach), 1, {fist: true, drop: 0.18})} : {})}));
        const m = act(q, cc, {def: MARCUS_DAMP, at: AT, facing: [1, 0], face: relief > 0.5 ? 'relieved' : 'worried', faceState: talkShot('B05-SH01', L, 'L16'), seed: 2622, t,
          look: [0.6, 0.6 * study], fig: {rise: -0.025 * relief},
          arms: () => {
            const w = camPoint(cc, r.placed.right!.hand.wrist), e = camPoint(cc, r.placed.right!.E);
            return w && e ? {rArm: {to: w, via: e, noHand: true, exact: true}} : {};
          }});
        rec(pr, 'marcus', m);
        // the falling coin L13-L22 (painted; it becomes the 3D coin in the pinch at L22)
        if (L >= 13 && L < 22) {
          const k = (L - 13) / 9, at: V3 = [DROP[0], lerp(DROP[1], coinAt(22)[1], k * k), DROP[2]], g = camPoint(cc, at);
          if (g) paintCoin(q, g, 0.012 * COIN_SCALE * camUnit(cc, at), 35950, 0.2 + 0.6 * Math.abs(Math.sin(k * 6)));
        }
        if (m) {
          const K = (m.chin - m.headTop) / 2.39, u = camUnit(cc, [AT[0], 1.3, AT[2]]);
          paintRibbons(q, 35960, [m.head[0] - 0.9 * K, m.chin + 0.3 * K], [m.head[0] - 2.4 * K, m.headTop - 0.25 * u], {w: 0.06 * u, op: 190, spread: 0.05 * u, count: 2, bow: -0.25, waves: 1.6, t, strength: 0.55});
        }
        const n = camPoint(cc, NOSE), k = camPoint(cc, coinAt(L));
        if (pr && n && k) Object.assign(pr, {noseX: Math.round(n[0]), noseY: Math.round(n[1]), coinX: Math.round(k[0]), coinY: Math.round(k[1]), coinPx: Math.round(0.024 * COIN_SCALE * camUnit(cc, coinAt(L)))});
      },
    });
  },
  hands: (L, c) => [layer(c, pick3D(rigAt(L), ['right'], L >= 22 ? 'right' : undefined))],
  fx: (L, c) => {
    if (L < 161) return null;
    const k = camPoint(c, SNIFF);
    if (!k) return null;
    const d = lerp(0.024 * COIN_SCALE * camUnit(c, SNIFF), 2700, easeIn(L, 161, 178));
    return <CoinLayer c={{cx: lerp(k[0], 540, easeIn(L, 161, 178)), cy: lerp(k[1], 960, easeIn(L, 161, 178)), d, rot: 0, op: Math.min(1, (L - 160) / 2)}} />;
  },
};
export const shot = makeShot(def);
