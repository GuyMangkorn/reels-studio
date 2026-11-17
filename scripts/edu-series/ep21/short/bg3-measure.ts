// EDU-EP21-SHORT W5.2 BG3 plate measurements (Boss, 2026-11-16): projects the car and DRIVER through the cameras typed into the BG3 shot
// files (imported, so the eased SH10/SH13 moves are measured exactly as rendered) at their key frames from shots/index.ts.
// Car lead: roof -> ground contact (the silhouette's top to the lowest of the four tyre contacts (+-CAR.wheelX, 0, +-0.85)), the body
// silhouette's own height and its x span. DRIVER: hip (-0.15, 0.40, 0.38) ->
// crown (hip + 0.97 m) projected, the face point (-0.15, 1.15, 0.38). SH10 also gives the cluster face centre (0.519, 0.97, 0.38) and the
// A-pillar's inner edge at the same height (the cluster sits behind it at the end of the push). Usage:
//   npx tsx scripts/edu-series/ep21/short/bg3-measure.ts
import {camOf} from '../../../../src/painted/kit/cam-moves';
import {camPoint, type YCam} from '../../../../src/painted/kit/ycam';
import {CAR, carSilhouette, ghPt} from '../../../../src/painted/edu21/car';
import {CAM as SH06} from '../../../../src/painted/edu21/shots/B02-SH06';
import {CAM as SH10} from '../../../../src/painted/edu21/shots/B04-SH10';
import {camAt as sh13} from '../../../../src/painted/edu21/shots/B05-SH13';
import {EDU21_SHOTS as SHOTS} from '../../../../src/painted/edu21/shots/index';

const f = (q: readonly number[] | null) => (q ? `(${q.map((n) => n.toFixed(0)).join(', ')})` : 'behind');
const keys = (id: string) => SHOTS.find((s) => s.id === id)!.keys;
const CAMS: Record<string, (L: number) => YCam> = {
  'B02-SH06': (L) => camOf(SH06, L / 139),
  'B04-SH10': (L) => camOf(SH10, L / 107),
  'B05-SH13': sh13,
};
for (const id of Object.keys(CAMS)) {
  console.log(id);
  for (const L of keys(id)) {
    const c = CAMS[id](L), sil = carSilhouette(c), ys = sil.map((q) => q[1]), xs = sil.map((q) => q[0]);
    const hip = camPoint(c, [-0.15, 0.4, 0.38]), crown = camPoint(c, [-0.15, 1.37, 0.38]), face = camPoint(c, [-0.15, 1.15, 0.38]);
    const contact = Math.max(...[CAR.wheelX, -CAR.wheelX].flatMap((x) => [0.85, -0.85].map((z) => camPoint(c, [x, 0, z])?.[1] ?? 0)));
    let line = `  L${L} roof->contact ${(Math.min(1920, contact) - Math.max(0, Math.min(...ys))).toFixed(0)} px · body h ${(Math.min(1920, Math.max(...ys)) - Math.max(0, Math.min(...ys))).toFixed(0)} px (y ${Math.min(...ys).toFixed(0)}..${Math.max(...ys).toFixed(0)}, x ${Math.min(...xs).toFixed(0)}..${Math.max(...xs).toFixed(0)})`;
    line += ` · hip->crown ${hip && crown ? Math.abs(hip[1] - crown[1]).toFixed(0) : '-'} px · face ${f(face)}`;
    if (id === 'B04-SH10') line += ` · cluster ${f(camPoint(c, [0.519, 0.97, 0.38]))} pillar inner ${f(camPoint(c, ghPt('glassR', 0.06, 0.1)))}`;
    console.log(line);
  }
}
