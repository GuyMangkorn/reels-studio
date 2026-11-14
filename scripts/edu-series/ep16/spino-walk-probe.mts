// Spino stride moving test (shots 22-23): feet picture drift in stance under a static camera. Run: npx tsx scripts/edu-series/ep16/spino-walk-probe.mts
import * as C from '../../../src/painted/survival/creatures';
import * as B from '../../../src/painted/survival/look-b';
import * as CM from '../../../src/painted/kit/cam-moves';
const camOf = ((CM as any).default ?? CM).camOf;
const M: any = (C as any).default ?? C, LB: any = (B as any).default ?? B;
const S = 2.6, v = 2.0, cyc = S / 0.6 / v;
const cases: [string, any, any, number][] = [['22', LB.CAM17_22, LB.SPINO_22, 25 / 50], ['23', LB.CAM17_23, LB.SPINO_23, 20 / 131]];
for (const [id, cam, sp, u] of cases) {
  const c = camOf(cam, u);
  let maxDrift = 0, rows: string[] = [], prev: any = null;
  for (let i = 0; i <= 48; i++) {
    const ph = i / 48, st = M.spinoStride(ph, S), adv = (S / 0.6) * ph;
    const O: [number, number] = [sp.O[0] - adv * sp.b[0], sp.O[1] - adv * sp.b[1]];
    const a = M.paintSpino(null, c, {O, b: sp.b, fire: [0, 0.4, 6], t: 0, amb: 0.55, reach: 8, pose: {...st, head: 0.6}});
    const f = a.feet;
    rows.push(`ph ${ph.toFixed(2)} near ${f[0] ? f[0].map((x: number) => x.toFixed(1)).join(',') : '-'} far ${f[1] ? f[1].map((x: number) => x.toFixed(1)).join(',') : '-'} lift n${st.legs.near[1].toFixed(2)} f${st.legs.far[1].toFixed(2)}`);
  }
  console.log('shot', id, 'cycle s', cyc.toFixed(2)); console.log(rows.filter((_, i) => i % 4 === 0).join('\n'));
}
