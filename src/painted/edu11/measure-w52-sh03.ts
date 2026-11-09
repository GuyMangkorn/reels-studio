import {camPoint, camUnit} from '../kit/ycam';
import {camAt} from './cams';
import {crowdRecoilHero, heroAxeAt, hallDrop, ropeParted, SH03_ASSISTANT} from './hall';
import type {V3} from '../kit/space';

// EDU-EP11 W5.2 fix (B04-SH03, SD15): measured screen values of the SH03 marks and keys. Usage: npx tsx src/painted/edu11/measure-w52-sh03.ts
const r = (v: number) => Math.round(v * 10) / 10;
for (const g of [1091, 1095, 1101, 1106, 1133]) {
  const cam = camAt('S01-B04-SH03', g)!, P = (v: V3) => camPoint(cam, v)!.map(r), K: V3 = [-1.05, 2.6, 0.4];
  const k = heroAxeAt(g), drop = hallDrop(g), e = ropeParted(g);
  console.log(JSON.stringify({
    g, hy: cam.hy, cx: cam.cx, K: P(K), ropePx: r(0.05 * camUnit(cam, K)), edge: P(k.edge), handF: P(k.front), handR: P(k.rear),
    deckCorner: P([-0.9, 2.4 - drop, 0.9]), showFeet: P([0, 2.4 - drop, 0.3]), showHeadTop: P([0, 2.4 - drop + 1.7, 0.3]), asstFeet: P(SH03_ASSISTANT), asstHeadTop: P([SH03_ASSISTANT[0], SH03_ASSISTANT[1] + 1.75, SH03_ASSISTANT[2]]),
    ropeUpEnd: P([-1.05 - 0.08 * (0.5 - 0.5 * Math.cos(e * Math.PI * 2)) * (1 - 0.5 * e), 2.6 + 0.9 * (1 - Math.pow(1 - e, 2.2)), 0.4]), c2head: P([0.55, 1.65, 2.6]), c4head: P([1.55, 1.78, 2.2]), k: r(crowdRecoilHero(g)),
  }));
}
