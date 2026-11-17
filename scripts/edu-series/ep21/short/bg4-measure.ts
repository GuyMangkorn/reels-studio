// EDU-EP21-SHORT W5.2 BG4 plate measurements (Boss, 2026-11-16): projects the sagged car, the FR tyre, its scorch and DRIVER through the
// cameras and the sag/scorch tracks exported by the BG4 shot files (B03-SH07, B03-SH08, B05-SH11) and the sagged B04-SH10/B05-SH13, at
// their key frames from shots/index.ts. Car lead: the sagged body silhouette's top -> the lowest road contact of the four tyres
// (+-CAR.wheelX, 0, +-0.85). DRIVER hip (-0.15, 0.40, 0.38) -> crown (+0.97 m) and face (y 1.15) through the sagged camera. FR tyre: top
// (hub + r), road contact, hub (hub drops with the sag), scorch centre on the outer sidewall. Rigidity: the sag transform's distance error
// between DRIVER's hip and the greenhouse corners, glass and dash (must be 0). Usage:
//   npx tsx scripts/edu-series/ep21/short/bg4-measure.ts
import {bodyPoint, camPoint, type YCam} from '../../../../src/painted/kit/ycam';
import {CAR, carSilhouette, SAG_FULL, sagBody, sagCam, SCORCH} from '../../../../src/painted/edu21/car';
import {camAt as sh07, sagAt as sag07, scorchAt} from '../../../../src/painted/edu21/shots/B03-SH07';
import {camAt as sh08, sagAt as sag08} from '../../../../src/painted/edu21/shots/B03-SH08';
import {camAt as sh11, SAG_SH11} from '../../../../src/painted/edu21/shots/B05-SH11';
import {camAt as sh13} from '../../../../src/painted/edu21/shots/B05-SH13';
import {CAM as SH10} from '../../../../src/painted/edu21/shots/B04-SH10';
import {camOf} from '../../../../src/painted/kit/cam-moves';
import {EDU21_SHOTS as SHOTS} from '../../../../src/painted/edu21/shots/index';
import type {V3} from '../../../../src/painted/kit/space';

const f = (q: readonly number[] | null) => (q ? `(${q.map((n) => n.toFixed(0)).join(', ')})` : 'behind');
const keys = (id: string) => SHOTS.find((s) => s.id === id)!.keys;
const SHOT: Record<string, {cam: (L: number) => YCam; sag: (L: number) => number; scorch?: (L: number) => number}> = {
  'B03-SH07': {cam: sh07, sag: sag07, scorch: scorchAt},
  'B03-SH08': {cam: sh08, sag: sag08},
  'B04-SH10': {cam: (L) => camOf(SH10, L / 107), sag: () => SAG_FULL},
  'B05-SH11': {cam: sh11, sag: () => SAG_SH11}, // FX2: SHEETS-R2 SD17 (the hub drops HUB_SH11, see fx2-measure.ts)
  'B05-SH13': {cam: sh13, sag: () => SAG_FULL},
};

// rigidity of the transform (world distances before/after)
const b = sagBody(SAG_FULL), pts: [string, V3][] = [['hip', [-0.15, 0.4, 0.38]], ['TF+', [0.4, 1.49, 0.64]], ['TR+', [-0.98, 1.49, 0.64]], ['glass', [-0.2, 1.2, 0.82]], ['cluster', [0.519, 0.97, 0.38]], ['FRcorner', [1.3, 0, 0.75]]];
let err = 0;
for (const [, a] of pts) for (const [, c] of pts) {
  const d0 = Math.hypot(a[0] - c[0], a[1] - c[1], a[2] - c[2]), A = bodyPoint(b, a), C = bodyPoint(b, c);
  err = Math.max(err, Math.abs(Math.hypot(A[0] - C[0], A[1] - C[1], A[2] - C[2]) - d0));
}
const fr = bodyPoint(b, [1.3, 0, 0.75]), rl = bodyPoint(b, [-1.3, 0, -0.75]), rr = bodyPoint(b, [-1.3, 0, 0.75]), fl = bodyPoint(b, [1.3, 0, -0.75]);
console.log(`sag ${SAG_FULL} m: rigid max distance error ${err.toExponential(2)} m · corner drops FR ${(-fr[1]).toFixed(4)} RL ${(-rl[1]).toFixed(4)} RR ${(-rr[1]).toFixed(4)} FL ${(-fl[1]).toFixed(4)} m · hip moves ${f(bodyPoint(b, [-0.15, 0.4, 0.38]).map((v, i) => (v - [-0.15, 0.4, 0.38][i]) * 1000))} mm`);

for (const id of Object.keys(SHOT)) {
  console.log(id);
  const S = SHOT[id];
  for (const L of keys(id)) {
    const c = S.cam(L), s = S.sag(L), cb = sagCam(c, s), sil = carSilhouette(cb), ys = sil.map((q) => q[1]), xs = sil.map((q) => q[0]);
    const contact = Math.max(...[CAR.wheelX, -CAR.wheelX].flatMap((x) => [0.85, -0.85].map((z) => camPoint(c, [x, 0, z])?.[1] ?? 0)));
    const hip = camPoint(cb, [-0.15, 0.4, 0.38]), crown = camPoint(cb, [-0.15, 1.37, 0.38]), face = camPoint(cb, [-0.15, 1.15, 0.38]);
    const cy = CAR.wheelR - s, rm = (SCORCH.r0 + SCORCH.r1) / 2;
    const top = camPoint(c, [CAR.wheelX, cy + CAR.wheelR, 0.86]), bot = camPoint(c, [CAR.wheelX, 0, 0.86]), hub = camPoint(c, [CAR.wheelX, cy, 0.86]);
    const sc = camPoint(c, [CAR.wheelX + rm * Math.cos(SCORCH.a), cy + rm * Math.sin(SCORCH.a), 0.86]);
    const inFrame = (q: readonly number[] | null) => !!q && q[0] >= 0 && q[0] <= 1080 && q[1] >= 0 && q[1] <= 1920;
    const roof = Math.min(...[[0.4, 0.64], [-0.98, 0.64], [0.4, -0.64], [-0.98, -0.64]].map(([x, z]) => camPoint(cb, [x, 1.49, z])?.[1] ?? 1920));
    let line = `  L${L} sag ${(s * 100).toFixed(1)} cm · roof->contact ${(Math.min(1920, contact) - Math.max(0, Math.min(...ys))).toFixed(0)} px, roof corners->contact ${(Math.min(1920, contact) - Math.max(0, roof)).toFixed(0)} px (body y ${Math.min(...ys).toFixed(0)}..${Math.max(...ys).toFixed(0)}, x ${Math.min(...xs).toFixed(0)}..${Math.max(...xs).toFixed(0)})`;
    line += ` · hip->crown ${hip && crown ? Math.abs(hip[1] - crown[1]).toFixed(0) : '-'} px · face ${f(face)}`;
    line += ` · FR top ${f(top)} contact ${f(bot)} hub ${f(hub)} tyre ${top && bot ? (bot[1] - top[1]).toFixed(0) : '-'} px · scorch ${f(sc)}${inFrame(sc) ? '' : ' OFF'}${S.scorch ? ` level ${S.scorch(L).toFixed(2)}` : ''}`;
    console.log(line);
  }
}
