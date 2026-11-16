// EDU-EP19-SHORT W5.3 shot measures (Boss, 2026-11-15): for every shot's key frames (src/painted/edu19/shots/index.ts) the lead heights from the
// cast's drawn extents (a bbox-recording brush, the same anchors the canvas paints with), FR1 (lead-group centre 860-1010) and FR2 (faces and the
// dog's nose <= 1160), plus the girl's planted-foot slide over each run (the stance ankle's ground x while the same leg is down, metres).
//   node --import tsx scripts/edu-series/ep19/shot-measure.ts [SHOT-ID ...] > out/edu19-shots/measure.jsonl
// One JSON object per key frame, then one per run check. Shot files are loaded by dynamic import (the shot-file import rule stays intact).
import type {Brush} from '../../../src/painted/BrushCanvas';
import {drawAnimal} from '../../../src/painted/kit/animals';
import {makePainter} from '../../../src/painted/kit/painter';
import {camUnit} from '../../../src/painted/kit/ycam';
import {DOG, GIRL, HARNESS} from '../../../src/painted/edu19/cast';
import {runStance} from '../../../src/painted/edu19/motion19';
import {EDU19_SHOTS} from '../../../src/painted/edu19/shots/index';
import {paintFieldShot, type FieldProbe, type FieldShotDef} from '../../../src/painted/edu19/stage';

const nullP = () => makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0});
const box = () => {
  const b = {x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9};
  const add = (pts: unknown) => { if (Array.isArray(pts)) for (const q of pts) if (Array.isArray(q) && Number.isFinite(q[0])) { b.x0 = Math.min(b.x0, q[0]); b.x1 = Math.max(b.x1, q[0]); b.y0 = Math.min(b.y0, q[1]); b.y1 = Math.max(b.y1, q[1]); } };
  const brush = new Proxy({}, {get: (_t, k) => (...a: unknown[]) => { if (k === 'polygon' || k === 'spline') add(a[0]); }}) as Brush;
  return {p: makePainter(brush, {t: 0, frame: 0}), b};
};
const defOf = async (id: string): Promise<FieldShotDef> => {
  const m = await import(`../../../src/painted/edu19/shots/${id}`);
  return Object.values(m).find((v) => v && typeof v === 'object' && (v as FieldShotDef).id === id && typeof (v as FieldShotDef).state === 'function') as FieldShotDef;
};
const r = Math.round;
const measure = (def: FieldShotDef, L: number) => {
  const cam = def.cam(L), st = def.state(L), probe: FieldProbe = {};
  paintFieldShot(nullP(), cam, {...st, probe});
  const out: Record<string, unknown> = {shot: def.id, L};
  if (st.dog && probe.dog?.g) {
    const {p, b} = box();
    drawAnimal(p, DOG.seed, DOG, probe.dog.g, camUnit(cam, st.dog.at), {...st.dog.pose, harness: HARNESS}, st.t);
    out.dog = {height: r(b.y1 - b.y0), top: r(b.y0), bottom: r(b.y1), x: [r(b.x0), r(b.x1)], nose: probe.dog.mouth?.map(r)};
  }
  for (const k of ['girl', 'mum'] as const) {
    const a = probe[k] as (FieldProbe['girl'] & {top: number; bottom: number}) | null | undefined;
    if (a) out[k] = {height: r(a.bottom - a.top), top: r(a.top), bottom: r(a.bottom), head: a.head.map(r)};
  }
  type Ext = {top: number; bottom: number; x?: number[]; head?: number[]};
  const leads = (['dog', 'girl', 'mum'] as const).map((k) => [k, out[k] as Ext | undefined] as const)
    .filter(([, v]) => v && v.bottom > 0 && v.top < 1920 && (!v.x || (v.x[1] > 0 && v.x[0] < 1080)) && (!v.head || (v.head[0] > -50 && v.head[0] < 1130)));
  if (leads.length) {
    const top = Math.min(...leads.map(([, v]) => v!.top)), bottom = Math.max(...leads.map(([, v]) => Math.min(1920, v!.bottom)));
    const faces: number[] = [];
    for (const [k, v] of leads) faces.push(k === 'dog' ? ((v as {nose?: number[]}).nose?.[1] ?? v!.top) : v!.head![1]);
    const c = (top + bottom) / 2, maxFace = Math.max(...faces);
    out.FR = {extent: [top, bottom], centre: r(c), FR1: c >= 860 && c <= 1010, maxFaceY: r(maxFace), FR2: maxFace <= 1160};
  }
  return out;
};
/** Girl run slide: the stance ankle's ground x (body x + ankle offset) while the same leg stays down, per frame step; max drift in m. */
const runSlide = (def: FieldShotDef, from: number, to: number) => {
  let prev: {x: number; far: boolean} | null = null, max = 0;
  for (let L = from; L <= to; L++) {
    const g = def.state(L).girl;
    if (!g || g.pose !== 'P38' || typeof g.fig?.run !== 'number') { prev = null; continue; }
    const s = runStance(GIRL, g.fig.run), dir = g.view === 'left' ? -1 : 1, x = g.at[0] + dir * s.x;
    if (prev && prev.far === s.far) max = Math.max(max, Math.abs(x - prev.x));
    prev = {x, far: s.far};
  }
  return {shot: def.id, run: [from, to], maxStanceSlidePerFrame_m: Math.round(max * 10000) / 10000};
};

const ids = process.argv.slice(2);
void (async () => {
for (const row of EDU19_SHOTS.filter((s) => !ids.length || ids.includes(s.id))) {
  const def = await defOf(row.id);
  if (!def) { console.log(JSON.stringify({shot: row.id, error: 'no FieldShotDef export'})); continue; }
  for (const L of row.keys) console.log(JSON.stringify(measure(def, L)));
  if (row.id === 'B02-SH02') console.log(JSON.stringify(runSlide(def, 0, row.len - 1)));
  if (row.id === 'B02-SH04') console.log(JSON.stringify(runSlide(def, 58, row.len - 1)));
}
})();
