// EDU-EP09 FX01-06: projected phalanx lengths (px) per finger for a shot frame. Usage: npx tsx scripts/edu-series/ep09/measure-segments.ts
import {blendHand, macroSkeleton} from '../../../src/painted/kit/hands';
import {boyHand, povCam} from '../../../src/painted/edu09/handclose';
import {camPoint} from '../../../src/painted/kit/ycam';
const seg = (h: ReturnType<typeof boyHand>, cam: ReturnType<typeof povCam>) => {
  const sk = macroSkeleton(h), out: Record<string, string> = {};
  for (const f of ['index', 'middle', 'ring', 'little'] as const) {
    const j = sk.fingers[f].joints.map((w) => camPoint(cam, w)!);
    const d = (a: number) => Math.hypot(j[a + 1][0] - j[a][0], j[a + 1][1] - j[a][1]);
    out[f] = [d(0), d(1), d(2)].map((x) => x.toFixed(0)).join('/') + ` (mid/prox ${(d(1) / d(0)).toFixed(2)})`;
  }
  return out;
};
const N = 155;
for (const L of [0, 60, 120]) {
  const tp = boyHand('test-fold-middle', L >= 92 ? {strain: {ring: 1}} : {});
  console.log('B01-SH01 L', L, seg(L >= 60 ? tp : blendHand(boyHand('flat'), tp, 0), povCam(L / (N - 1))));
}
