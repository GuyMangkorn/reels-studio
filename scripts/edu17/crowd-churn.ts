// EDU-EP17 fix pass D: crowd identity churn between consecutive frames, no render needed.
//   node --import tsx scripts/edu17/crowd-churn.ts [SH17 SH18 SH19 SH20]
// Paints every frame of a stadium shot through a recording brush and matches polygons by (seed, occurrence). Per frame pair it counts
// pops (a seed present in only one frame), jumps (same seed, centroid moved > 30 px away from the local median motion of its 96 px cell: the person was reseeded or reshuffled; parallax between depths stays under that)
// and prints the worst pair and the shot totals. A stable crowd has near-zero jumps and only the pops of people leaving the picture.
import type {Brush} from '../../src/painted/BrushCanvas';
import {makePainter} from '../../src/painted/kit/painter';
import {paintStadiumShot, STADIUM_SHOTS, type StadiumShot} from '../../src/painted/edu17/stadium';

type Rec = Map<string, [number, number, string]>;
export const record = (sh: StadiumShot, f: number): Rec => {
  const out: Rec = new Map(), occ = new Map<number, number>();
  let seed = 0, col = '';
  const brush = new Proxy({}, {get: (_t, k) => (...a: unknown[]) => {
    if (k === 'seed') seed = a[0] as number;
    if (k === 'wash' || k === 'fill') col = a[0] as string;
    if (k === 'polygon') { const pts = a[0] as [number, number][], n = occ.get(seed) ?? 0; occ.set(seed, n + 1); out.set(`${seed}#${n}`, [pts.reduce((s, q) => s + q[0], 0) / pts.length, pts.reduce((s, q) => s + q[1], 0) / pts.length, col]); }
  }}) as Brush;
  paintStadiumShot(makePainter(brush, {t: 0, frame: 0}), sh, f);
  return out;
};
export const churn = (sh: StadiumShot) => {
  let prev = record(sh, 0), pops = 0, jumps = 0, worst = {f: 0, v: 0}, n0 = prev.size;
  for (let f = 1; f < STADIUM_SHOTS[sh].len; f++) {
    const cur = record(sh, f), cells = new Map<string, [number, number][]>(); let p = 0, j = 0;
    const cell = (v: [number, number, string]) => `${Math.floor(v[0] / 96)},${Math.floor(v[1] / 96)}`;
    for (const [k, v] of cur) { const o = prev.get(k); if (!o) p++; else { const key = cell(o); (cells.get(key) ?? cells.set(key, []).get(key)!).push([v[0] - o[0], v[1] - o[1]]); } }
    for (const k of prev.keys()) if (!cur.has(k)) p++;
    const med = (a: number[]) => a.sort((x, y) => x - y)[Math.floor(a.length / 2)];
    const flow = new Map([...cells].filter(([, a]) => a.length >= 5).map(([k, a]) => [k, [med(a.map((q) => q[0])), med(a.map((q) => q[1]))] as [number, number]]));
    for (const [k, v] of cur) { const o = prev.get(k); if (!o) continue; const fl = flow.get(cell(o)); if (fl && (Math.hypot(v[0] - o[0] - fl[0], v[1] - o[1] - fl[1]) > 30)) j++; }
    pops += p; jumps += j; if (p + j > worst.v) worst = {f, v: p + j}; prev = cur;
  }
  return {sh, polys0: n0, pops, jumps, worstFrame: worst.f, worstPopsAndJumps: worst.v};
};
if (process.argv[1]?.endsWith('crowd-churn.ts')) for (const sh of (process.argv.slice(2).length ? process.argv.slice(2) : ['SH17', 'SH18', 'SH19', 'SH20']) as StadiumShot[]) console.log(JSON.stringify(churn(sh)));
