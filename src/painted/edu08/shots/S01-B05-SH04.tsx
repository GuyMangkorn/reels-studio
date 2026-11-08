import {camMove} from '../../kit/cam-moves';
import type {FaceState} from '../../kit/head';
import type {Pt} from '../../kit/painter';
import {ease} from '../clock';
import {paintAirlock} from '../rooms';
import {camAt, openEyesT} from '../stage';
import {makeShot} from '../shot';
import {twoShot} from './S01-B05-SH03';

// S01-B05-SH04 (G 1610-1679, SHEETS-R2.4: time shift only, +14; R2.3 1596-1665, R2 1592-1696 L13) LF05 "breathe out" (L13b "สิ่งที่ช่วยปอดคุณ คือหายใจออก"; "สิ่งที่ช่วยปอด" G1613 = L3, "คือหายใจออก" G1653 = L43,
// voiced end G1675 = L65). SD17: no smile; the expression keys on the exhale: parted lips (`talk` 0.12) L0-47 -> rounded `o` (breathing out) from L48 to the cut
// (SH05 opens on `o`), chest sinks 0.012 m more L47-62, brows ease 35 % toward flat L47-62 (SH05 opens there). Shoulders hold SH03's drop (-0.012 m), lean 1. Stinger from G1676 (L66). Eyes forced open on L0-1, L44-62, L67-68.
// cam: (-0.15, 0.55, 0.20), yaw 190->184, r 1.36->1.30, eye 0.55, pitch -2, f 1000, hy 800 (u = L / 69).
const N = 69, cam = (L: number) => camAt(camMove([-0.15, 0.55, 0.2], [190, 184], [1.36, 1.3], 0.55, {pitch: [-2, -2], f: 1000, hy: 800}), L, N);
const faceAt = (L: number): Partial<FaceState> => {
  const brows = {brow: 'worry' as const, browTo: 'flat' as const, browMix: 0.35 * ease(L, 47, 62), eyes: 'dot' as const, look: [-0.4, 0.05] as Pt};
  return L < 48 ? {...brows, mouth: 'talk', open: 0.12} : {...brows, mouth: 'o', open: 0.12};
};
export const shot = makeShot('S01-B05-SH04', {
  paper: '#8a97a8',
  paint: (p, L, G) => {
    const c = cam(L);
    paintAirlock(p, c, {lamp: 0, needle: 0});
    const tAst = L < 2 || (L >= 44 && L <= 62) || L >= N - 2 ? openEyesT(G / 30, 7201) : G / 30;
    twoShot(p, c, G, {k: 1, face: 'neutral', faceState: faceAt(L), quarter: 'left', rise: -0.012 - 0.012 * ease(L, 47, 62), tAst});
  },
});
