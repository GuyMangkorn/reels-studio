import {mouthAt} from '../../../rig/drivers';
import {ease, lenOf, G_ZERO as _z} from '../clock';
import {makeShot} from '../shot';
import {orbit, paintSoi} from '../soi';

// S01-B04-SH02 (G1055-1160): LF03 silence, "ไฟดับเหรอ" (silence L0-37, D03 L38-94, dog L95). Night n = 1, camera orbit((0.85, 1.05, -0.40), az 15 -> 14, r 3.00 -> 2.95,
// eye 1.25, f 1150, hy 900). VEN frozen with the pestle at the top (breath runs on the ambient clock), `surprised` held. CUS `surprised` until L38, then the seated
// kit motion `look-around` on the motion clock L - 38. No card, no electric light; the Moon gives the cool rim (LF03).
const ID = 'S01-B04-SH02', N = lenOf(ID);
const cam = (L: number) => { const e = ease(L, 0, N - 1); return orbit([0.85, 1.05, -0.4], 15 - e, 3.0 - 0.05 * e, 1.25, 0, 1150, 900); };
void _z;
// D03 (CUS, "เอ้า… ไฟดับเหรอ") voiced G1093-1149 = L38-94: per-frame RMS envelope of the placed take, L36 onward, normalised (W5.3 round 3 G2: the mouth must move).
const D03_ENV = [0, 0.01, 0.18, 0.34, 0.6, 0.61, 0.58, 0.46, 0.36, 0.32, 0.22, 0.15, 0.09, 0.06, 0.05, 0.04, 0.04, 0.04, 0.04, 0.04, 0.03, 0.03, 0.03, 0.02, 0.02, 0.01, 0.02, 0.01, 0.01, 0.03, 0.05, 0.05, 0.05, 0.06,
  0.83, 0.73, 0.84, 1, 0.76, 0.38, 0.43, 0.63, 0.61, 0.56, 0.43, 0.14, 0.23, 0.36, 0.47, 0.42, 0.59, 0.7, 0.76, 0.28, 0.11, 0.05, 0.03, 0.02, 0.01, 0.01, 0];
// Chin fix (user, draft v4, 2026-11-08: "the chin enlarges while speaking"): at open 1 the turned head (look-around L57-76) drops the kit jaw
// 0.19 head units in one frame (L69 -> L70). Open is capped at OPEN_MAX and its rise slewed to OPEN_RISE per frame; the pause L50-69 stays shut.
// Chin fix 2 (user, draft v10: "the chin is uneven while the head turns, the face gets longer"): the cap still left the turned jaw 5-8 px low
// (G1126-1130) and the `surprised` o-mouth dropped it 11 px in the right turn (G1152-1159). `jaw: 0` holds the kit chin line in both turns; the
// turned talk mouth opens inside the face instead (kit FaceState.jaw).
const OPEN_MAX = 0.3, OPEN_RISE = 0.1;
const mouthOpen = (L: number) => {
  let o = 0;
  for (let l = 36; l <= Math.floor(L); l++) { const t = Math.min(OPEN_MAX, mouthAt(D03_ENV, l, 36) * 1.5); o = t > o ? Math.min(t, o + OPEN_RISE) : t; }
  return o;
};
const talking = (L: number) => L >= 37 && L <= 95;

export const shot = makeShot(ID, {
  paper: '#101a38',
  paint: (p, L, G) => {
    paintSoi(p, cam(L), {t: G / 30, night: 1, stroke: 1, rimLift: 0, ven: {face: 'surprised'},
      cus: L >= 38 ? {face: 'surprised', faceState: {eyes: 'wide', jaw: 0, ...(talking(L) ? {mouth: 'talk', open: mouthOpen(L)} : {})}, motion: {id: 'look-around', t: (L - 38) / 30}} : {face: 'surprised', faceState: {eyes: 'wide', look: [-0.8, 0.1]}}});
  },
});
