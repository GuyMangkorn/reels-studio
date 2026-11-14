// EDU-EP17 spinoStride moving test (shots 22-23): feet picture drift in stance, per step, through the shot cameras at mid-shot. Run: npx tsx scripts/edu-series/ep17/spino-walk-probe.mts
import * as C from '../../../src/painted/survival/creatures';
import * as CM from '../../../src/painted/kit/cam-moves';
const camOf = ((CM as any).default ?? CM).camOf, camMove = ((CM as any).default ?? CM).camMove;
const M: any = (C as any).default ?? C;
const E: [number, number] = [0.4, 0.6];
const cases: [string, any, any, number, number][] = [
  ['22', camMove([-1.8, 0, 5.2], [181, 179], 7.8, 3.3, {f: 820, hy: 720, pitch: [-8, -8], ease: E}), {O: [5.4, 8.0], b: [-0.985, -0.17], v: 2.0}, 25 / 50, 51],
  ['23', camMove([2, 1, 2], [-80, -84], [5, 5.6], 1, {f: 850, hy: 760, ease: E}), {O: [14.25, -4.33], b: [-0.866, 0.5], v: 2.0}, 66 / 131, 132]];
const S = Number(process.env.STRIDE ?? 2.6);
for (const [id, cam, sp, u] of cases) {
  const c = camOf(cam, u);
  const rows: string[] = []; let prev: any = null; const stanceDrift: number[] = [];
  const N = 60;
  for (let i = 0; i <= N; i++) {
    const ph = i / N, st = M.spinoStride(ph, S), adv = (S / 0.6) * ph;
    const O: [number, number] = [sp.O[0] - adv * sp.b[0], sp.O[1] - adv * sp.b[1]];
    const a = M.paintSpino(null, c, {O, b: sp.b, fire: [0, 0.4, 6], t: 0, amb: 0.55, reach: 8, pose: {...st, head: 0.6}});
    const f = a.feet, lifts = [st.legs.near[1], st.legs.far[1]];
    // a foot is in stance when its lift is ~0; between two stance frames its picture position under the walking body should be constant
    const cur = {n: f[0], f: f[1], ln: lifts[0], lf: lifts[1]};
    if (prev) for (const [k, l] of [['n', 'ln'], ['f', 'lf']] as const) if (cur[l] < 0.02 && prev[l] < 0.02 && cur[k] && prev[k]) stanceDrift.push(Math.hypot(cur[k][0] - prev[k][0], cur[k][1] - prev[k][1]));
    prev = cur;
    if (i % 6 === 0) rows.push(`ph ${ph.toFixed(2)} near ${f[0] ? f[0].map((x: number) => x.toFixed(1)).join(',') : '-'} far ${f[1] ? f[1].map((x: number) => x.toFixed(1)).join(',') : '-'} lift n${lifts[0].toFixed(2)} f${lifts[1].toFixed(2)}`);
  }
  console.log('shot', id, 'stance steps', stanceDrift.length, 'mean px/step', (stanceDrift.reduce((x, y) => x + y, 0) / Math.max(1, stanceDrift.length)).toFixed(2), 'max', Math.max(0, ...stanceDrift).toFixed(2));
  console.log(rows.join('\n'));
}
