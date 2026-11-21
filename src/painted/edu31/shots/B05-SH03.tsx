import {elbowIK, LANDMARKS, specHand, toneFromSkin} from '../../kit/hand-place';
import type {V3} from '../../kit/space';
import {camPoint, camUnit} from '../../kit/ycam';
import {paintBox, qy, wFill, wInk, wWash} from '../../kit/world';
import {DESK_PHONE, paintDeskPhone} from '../props31';
import {glow, POLICE} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {camMove, ein, ez, lin, mix3} from '../stage31';

// B05-SH03 · F [1305, 1334) · tips: the phones light up (SCENE-R1 b05). From above, three beige `new: desk-phone-1990s` in a row on the desk
// (top 0.75; x -0.35, 0, +0.35; base centre z -0.10). Phone 1 rings from L0, phone 2 from L5, phone 3 from L10: red line light on, handset
// jiggling 1-2 mm (about 2 px) at 15 Hz (alternate frames). The POLICE RIGHT hand (navy cuff, `us-police-1995`) enters L14 and lifts handset 1
// out of frame L18-22; it is a five-finger 3D hand (insert scale, hand-drawing 4) in a `grip` across the handset, back of the hand up. Reach:
// the shoulder sits beyond the frame's lower-left corner (-0.68, 0.95, +0.30), so the arm enters from the bottom left (the sheet's "frame bottom"
// would need a 0.77 m arm from below the lens; bones 0.29 / 0.26). L24 (F1329): every ring stops dead; lights 2 and 3 stay on, still. Notepad
// and pen at the right, desk-lamp glow at the left. No clock, no text.
const N = 29, SHOT = 'B05-SH03';
const CAM = camMove({eye: [0, 1.1, 0.7], yaw: 0, pitch: -25, f: 900, hy: 700}, {eye: [0, 1.1, 0.7], yaw: 0, pitch: -25, f: 954, hy: 700}, 0, N - 1);
const DESK = 0.75, XS = [-0.35, 0, 0.35], STARTS = [0, 5, 10], STOP = 24;
const HANDSET1: V3 = [-0.35, DESK + DESK_PHONE.h + 0.024, -DESK_PHONE.d * 0.74];
const SHOULDER: V3 = [-0.68, 0.95, 0.3], POLE: V3 = [-0.9, 0.45, 0.55];
const OFF: V3 = [-0.6, 0.8, 0.38], UP: V3 = [-0.62, 1.02, 0.22];
const TONE = toneFromSkin(POLICE.head.skin, '#1e2a44');
/** Handset 1 grip point on the shot clock: resting until L18, then carried up and out (L18-22). */
const handsetAt = (L: number): V3 => mix3(HANDSET1, UP, ein(lin(L, 18, 23)));
const handAt = (L: number): V3 => L < 18 ? mix3(OFF, HANDSET1, ez(L, 14, 18)) : handsetAt(L);
const ringing = (i: number, L: number) => L >= STARTS[i] && L < STOP && !(i === 0 && L >= 18);

export const def: Shot31 = {
  id: SHOT, N, paper: '#2a2018', vignette: 0.45,
  cam: CAM,
  hands: (L) => {
    if (L < 14) return [];
    const at = handAt(L);
    const hand = specHand({gesture: 'grip', side: 'right', forward: [0.15, -0.25, -1], back: [0, 1, 0.12], put: {landmark: (sk) => LANDMARKS.grip(sk, 0.018), at}, size: 1.0, tone: TONE, base: 3720});
    return [{arms: [{hand, elbow: elbowIK(SHOULDER, hand.wrist, POLE), shoulder: SHOULDER, sleeve: '#1e2a44', cuff: 0.12}]}];
  },
  paint: (p, L, c, pr) => {
    // the desk: worn wood top, front edge, lamp glow from the left
    paintBox(p, c, 38800, {x0: -1.2, x1: 1.2, y0: 0, y1: DESK, z0: -0.7, z1: 0.35}, '#6e5236', {}, {ink: true, grain: 60});
    for (let i = 0; i < 9; i++) wWash(p, c, 38810 + i, '#5c432c', 80, qy(DESK + 0.0005, -1.2, 1.2, -0.68 + i * 0.11, -0.64 + i * 0.11), 0.15, 0.6);
    const lg = camPoint(c, [-0.75, DESK, -0.35]); if (lg) glow(p, 38830, lg[0], lg[1], 0.7 * camUnit(c, [-0.75, DESK, -0.35]), 0.45 * camUnit(c, [-0.75, DESK, -0.35]), '#f2c27a', 60);
    // notepad and pen (blank, no writing)
    wFill(p, c, 38840, '#f1ead2', qy(DESK + 0.001, 0.52, 0.72, -0.02, 0.26));
    wFill(p, c, 38841, '#c9b46a', qy(DESK + 0.0012, 0.52, 0.72, -0.02, 0.01));
    for (let r = 0; r < 6; r++) wInk(p, c, 38842 + r, [[0.54, DESK + 0.0014, 0.05 + r * 0.035], [0.7, DESK + 0.0014, 0.05 + r * 0.035]], {weight: 0.3, color: '#a9b8d0'});
    wInk(p, c, 38850, [[0.6, DESK + 0.008, 0.3], [0.78, DESK + 0.008, 0.18]], {weight: 2.2, color: '#1e3a8a'});
    XS.forEach((x, i) => {
      const jig = ringing(i, L) ? (L % 2 ? 1 : -1) : 0;
      const lift: V3 = i === 0 && L >= 18 ? [handsetAt(L)[0] - HANDSET1[0], handsetAt(L)[1] - HANDSET1[1], handsetAt(L)[2] - HANDSET1[2]] : [0.0008 * jig, 0.0012 * (jig > 0 ? 1 : 0), 0];
      paintDeskPhone(p, c, 38900 + i * 60, [x, DESK, 0], {light: L >= STARTS[i] ? 1 : 0, lift});
      if (pr) {
        const l = camPoint(c, [x - DESK_PHONE.w / 2, DESK, -0.1]), r = camPoint(c, [x + DESK_PHONE.w / 2, DESK, -0.1]);
        if (l && r) pr.lead(`PHONE${i + 1}`, {top: l[1], bottom: r[1], left: l[0], right: r[0], x: (l[0] + r[0]) / 2});
      }
    });
    if (pr) { const h = camPoint(c, handsetAt(L)); if (h) pr.lead('HANDSET1', {top: h[1], bottom: h[1], x: h[0]}); const s = camPoint(c, SHOULDER); if (s) pr.lead('SHOULDER', {top: s[1], bottom: s[1], x: s[0]}); }
  },
};
export const shot = makeShot(def);
