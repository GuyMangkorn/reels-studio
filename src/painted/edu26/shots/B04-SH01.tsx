import type {Arm, CastDef} from '../../kit/cast';
import {elbowIK} from '../../kit/hand-place';
import {bodyShoulder} from '../../kit/mid-hands';
import type {V3} from '../../kit/space';
import {camPoint, camUnit, type YCam} from '../../kit/ycam';
import {paintFullonica, SHIRT_POLE, STALL_Z0} from '../fullonica';
import {act} from '../r4-looks';
import {bodyFacing} from '../r4-hands';
import {CUSTOMER, paintShirt} from '../r4-cast';
import {makeShot, type Shot26} from '../shot';
import {handsOf, MARCUS_DAMP, shoulderRibbons, walkBetween} from '../acts26';
import {camKeys, ease, lerp, lerp3, rec, yc} from '../stage26';

// B04-SH01 · G [1042, 1125), pre-roll from G1037 under the time-passing dissolve (SHEET-R1 part B). `evening` light: low gold beam through the
// street door, long shadows, dust motes, the stalls empty and flat, the customer's ivory shirt dry on the back pole. Marcus (barefoot, hem damp
// to the knee) takes it down L0-L14, walks it to (-0.50, 0, +0.15) by L34; the customer (madder stola, the one saturated red) enters the door at
// L16 and walks to (-0.95, 0, +0.55) by L34; hand-over on clear contact (both hold one edge L40-L46, Marcus lets go at L46); she lifts it into the
// beam L48-L60 and holds. Camera: the B01-SH05 end angle held to L52, then tilting up with the shirt to pitch +4 by L82. Two ribbons on Marcus
// (60 %); the customer never reacts to them.
//
// Draft fix B (user, 19 Nov 2026: "the shirt floats oddly, the body movement is wrong, odd anatomy"). Causes: the pole (2.6 m) is a metre over
// the four-head Marcus's reach (shoulder 1.12 + two 0.26 m bones = 1.64 m), so his hands met air under the shirt; the hand targets were picture
// points that the back / three-quarter rig mirrored and pulled toward the body, so the hands missed the shirt the whole shot; he turned and she
// turned in one frame; she lifted it overhead on straight arms. Now: the shirt is a knee-length tunic (drop 1.0 m) hung by its shoulders, so
// its hem hangs at 1.58 m; Marcus stands under it, takes the hem in both hands (L-5..L2), pulls it down off the pole (L2-L8), lets it fold over
// his hands (L5-L14: the grip slides from the hem to the middle, the drop shortens to 0.45 m), turns into his walk (L10-L16) and carries it in
// front of his chest, turns to her (L28-L36) and offers it by the shoulders (L34-L40: grip to the top edge, it unfolds to 0.7 m); both hold one
// shoulder L40-L46; she raises it a little and holds it out at arm's length at chest height (face clear above it, no overhead lift) to look at it in the beam (L48-L60). Every arm is an exact world chain
// (shoulder, elbow solved two-bone, hand on the shirt) so the hands stay on the cloth in every view.
const N = 83;
const C0 = yc(1.3, 1.5, 0.8, -62, -6, 900, 930), C1: YCam = {...C0, pitch: 4 * Math.PI / 180};
const M0: V3 = [-0.9, 0, -1.05], M1: V3 = [-0.5, 0, 0.15], K0: V3 = [-2.9, 0, 0.3], K1: V3 = [-0.95, 0, 0.55];
const MF: [number, number] = [-0.45, 0.4], KF: [number, number] = [0.45, -0.4];
const TOP = 2.58, LONG = 1.0, FOLD = 0.45, OPEN = 0.7, SZ = SHIRT_POLE[2] + 0.04;
const nf = (a: [number, number], b: [number, number], k: number): [number, number] => {
  const x = lerp(a[0], b[0], k), z = lerp(a[1], b[1], k), n = Math.hypot(x, z) || 1;
  return [x / n, z / n];
};
const WALK: [number, number] = nf([M1[0] - M0[0], M1[2] - M0[2]], [M1[0] - M0[0], M1[2] - M0[2]], 1);
/** One arm as an exact world chain: the drawn hand on `w`, the elbow solved two-bone from the rig shoulder (down and out). */
const chain = (c: YCam, def: CastDef, at: V3, facing: [number, number], side: 'right' | 'left', w: V3): Arm | undefined => {
  const b = bodyFacing(def, at, facing), S = bodyShoulder(b, side), s = side === 'right' ? 1 : -1, l = 0.26 * (def.armScale ?? 1);
  const pole: V3 = [b.x[0] * s * 0.6 - b.z[0] * 0.2, -1, b.x[2] * s * 0.6 - b.z[2] * 0.2];
  const E = elbowIK(S, w, pole, l * 1.03, l * 1.03), to = camPoint(c, w), via = camPoint(c, E);
  return to && via ? {to, via, open: s as 1 | -1, exact: true} : undefined;
};
export const def: Shot26 = {
  id: 'B04-SH01', N, crossfade: true,
  cam: (L) => camKeys([[52, C0], [82, C1]], L),
  paint: (p, L0, c, pr) => {
    const L = Math.max(0, L0), t = L0 / 30;
    // Marcus: under the shirt facing the pole, turning into the walk L10-L16, walking L14-L34 (turning to her L28-L36)
    const mw = L < 14 ? {at: M0, walk: undefined, stride: 0} : walkBetween(L, 14, 34, M0, M1);
    const mFacing = L < 16 ? nf([0, -1], WALK, ease(L, 10, 16)) : nf(WALK, MF, ease(L, 28, 36));
    const kw = L < 16 ? null : walkBetween(L, 16, 34, K0, K1);
    // she turns a quarter toward the room's light (the lens) to look at the shirt L48-L60, so Marcus's back no longer covers it
    const kFacing = L < 46 ? nf([1, 0.12], KF, ease(L, 32, 38)) : nf(KF, [0.95, 0.3], ease(L, 48, 60));
    // Marcus's grip: hem corners on the pole -> pulled down -> gathered at the chest -> carried -> offered by the shoulders
    const pull = ease(L, 2, 8), gather = ease(L, 5, 14), offer = ease(L, 34, 40);
    // [his right, his left]: facing the pole (-z) his right is +x
    const hem: [V3, V3] = [[SHIRT_POLE[0] + 0.2, TOP - LONG, SZ + 0.02], [SHIRT_POLE[0] - 0.2, TOP - LONG, SZ + 0.02]];
    const carry = handsOf(mw.at, mFacing, lerp(1.05, 1.2, offer), lerp(0.3, 0.36, offer), lerp(0.16, 0.2, offer));
    const down: [V3, V3] = [[hem[0][0], 1.2, SZ + 0.12], [hem[1][0], 1.2, SZ + 0.12]];
    const gripAt = (i: 0 | 1): V3 => lerp3(lerp3(hem[i], down[i], pull), carry[i], gather);
    // the grip's place on the shirt (metres below its top edge) and the shirt's drop
    // (as the hem comes off the pole the cloth slides down through his hands: the top edge drops to them by L7, no cloth standing up unheld)
    const g = L < 14 ? lerp(LONG, 0.2, ease(L, 2, 7)) : lerp(0.2, 0, offer);
    const drop = L < 14 ? lerp(LONG, FOLD, gather) : lerp(FOLD, OPEN, offer);
    // the customer: hands meet the shirt's shoulders at L40, she holds them L46-, lifting to her right to chest-chin height L48-L60
    const kAt = kw?.at ?? K0, rise = ease(L, 48, 60);
    const kh0 = handsOf(kAt, kFacing, 1.2, 0.36, 0.2), kr: V3 = [kFacing[0] * 0.08 * rise, 0, kFacing[1] * 0.08 * rise];
    const kh: [V3, V3] = [[kh0[0][0] + kr[0], 1.2 + 0.05 * rise, kh0[0][2] + kr[2]], [kh0[1][0] + kr[0], 1.2 + 0.05 * rise, kh0[1][2] + kr[2]]];
    const mHand: [V3, V3] = [gripAt(0), gripAt(1)];
    // the shirt's top edge (shoulders), wider than the hands when they hold the hem
    let top: [V3, V3];
    const wide = (a: V3, b: V3, up: number, k: number): [V3, V3] => {
      const m = lerp3(a, b, 0.5), h: V3 = [(b[0] - a[0]) / 2 * k, (b[1] - a[1]) / 2 * k, (b[2] - a[2]) / 2 * k];
      return [[m[0] - h[0], m[1] + up, m[2] - h[2]], [m[0] + h[0], m[1] + up, m[2] + h[2]]];
    };
    // hand-over: L40-L46 the shirt's right shoulder travels from Marcus's grip to her right hand (his hand on it), L46 he lets go
    const pass = ease(L, 40, 46), right0: V3 = lerp3(carry[0], kh[0], pass);
    if (L < 40) top = wide(mHand[0], mHand[1], g, lerp(1.45, 1, L < 14 ? gather : 1));
    else if (L < 46) top = [right0, kh[1]];
    else top = kh;
    const shirtDrop = L < 40 ? drop : OPEN;
    // a released hand lowers to beside the hip over six frames (then the rig's own hanging arm takes over)
    const hipOf = (def: CastDef, at: V3, f: [number, number], side: 'right' | 'left'): V3 => {
      const S = bodyShoulder(bodyFacing(def, at, f), side), b = bodyFacing(def, at, f), s = side === 'right' ? 1 : -1;
      return [S[0] + b.x[0] * s * 0.03, S[1] - 0.49 * (def.armScale ?? 1), S[2] + b.x[2] * s * 0.03];
    };
    const sway = L >= 2 && L < 14 ? 0.05 * Math.sin((L - 2) / 12 * Math.PI) : 0;
    paintFullonica(p, c, {mood: 'evening', t}, {
      stallLiquidFrom: [STALL_Z0, STALL_Z0, STALL_Z0],
      shirtOnPole: false, shirtGap: true,
      room: (q, cc) => {
        const shirt = () => paintShirt(q, cc, top[0], top[1], shirtDrop, 31700, {lit: 0.4 + 0.5 * rise, warm: true, sway});
        if (kw) rec(pr, 'customer', act(q, cc, {def: CUSTOMER, at: kAt, facing: kFacing, face: rise > 0.3 ? 'happy' : 'neutral', seed: 2671, t, look: [0, -0.3 * rise],
          fig: kw.walk !== undefined ? {walk: kw.walk, stride: kw.stride} : {},
          arms: () => {
            if (L < 36) return {};
            // her hands come up from her sides: the left to the shirt's left shoulder by L40, the right to its right shoulder by L46
            const hang = (i: 0 | 1) => hipOf(CUSTOMER, kAt, kFacing, i ? 'left' : 'right');
            return {rArm: chain(cc, CUSTOMER, kAt, kFacing, 'right', lerp3(hang(0), kh[0], ease(L, 36, 46))),
              lArm: chain(cc, CUSTOMER, kAt, kFacing, 'left', lerp3(hang(1), kh[1], ease(L, 36, 40)))};
          }}));
        // the shirt is behind Marcus while his back is to the lens (at the pole), in front of him once he faces the room
        const camDir: [number, number] = [c.x - mw.at[0], c.z - mw.at[2]], front = mFacing[0] * camDir[0] + mFacing[1] * camDir[1] > 0.4;
        if (!front) shirt();
        const m = act(q, cc, {def: MARCUS_DAMP, at: mw.at, facing: mFacing, face: 'worried', seed: 2622, t,
          fig: mw.walk !== undefined ? {walk: mw.walk, stride: mw.stride} : {},
          arms: () => {
            const hip = (side: 'right' | 'left') => hipOf(MARCUS_DAMP, mw.at, mFacing, side);
            const r: V3 | null = L < 40 ? mHand[0] : L < 46 ? right0 : L < 52 ? lerp3(kh[0], hip('right'), ease(L, 46, 52)) : null;
            const l: V3 | null = L < 40 ? mHand[1] : L < 46 ? lerp3(carry[1], hip('left'), ease(L, 40, 46)) : null;
            return {...(r ? {rArm: chain(cc, MARCUS_DAMP, mw.at, mFacing, 'right', r)} : {}), ...(l ? {lArm: chain(cc, MARCUS_DAMP, mw.at, mFacing, 'left', l)} : {})};
          }});
        rec(pr, 'marcus', m);
        if (front) shirt();
        if (m) shoulderRibbons(q, m, camUnit(cc, [mw.at[0], 1.3, mw.at[2]]), t, {n: 2, strength: 0.6, seed: 35800});
      },
    });
  },
};
export const shot = makeShot(def);
