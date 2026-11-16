// EDU-EP19 look-frame / field-shot measures (Boss W3.1; reused at W5): lead heights from the cast's drawn extents (a bbox-recording brush, the
// same anchors the canvas paints with) and, given a glow-on and a glow-off frame, the mean luma lift of each glow spot.
//   node --import tsx scripts/edu-series/ep19/lf-measure.ts LF02 [on.png off.png]
// Prints one JSON object. Lead height = visible top to bottom (px) after the camera, as boss-asset-workflow's lead-size rule measures it.
import {spawnSync} from 'node:child_process';
import type {Brush} from '../../../src/painted/BrushCanvas';
import {drawAnimal} from '../../../src/painted/kit/animals';
import {makePainter} from '../../../src/painted/kit/painter';
import {camPoint, camUnit} from '../../../src/painted/kit/ycam';
import {DOG, HARNESS} from '../../../src/painted/edu19/cast';
import {B01_SH01} from '../../../src/painted/edu19/shots/B01-SH01';
import {B01_SH02} from '../../../src/painted/edu19/shots/B01-SH02';
import {B01_SH07} from '../../../src/painted/edu19/shots/B01-SH07';
import {B03_SH05} from '../../../src/painted/edu19/shots/B03-SH05';
import {B02_SH05} from '../../../src/painted/edu19/shots/B02-SH05';
import {GLOW_STEPS, glowStep} from '../../../src/painted/edu19/glow';
import {paintFieldShot, type FieldProbe, type FieldShotDef} from '../../../src/painted/edu19/stage';

import {B01_SH04} from '../../../src/painted/edu19/shots/B01-SH04';
const LOOKS: Record<string, [FieldShotDef, number]> = {
  LF01: [B01_SH01, 0], LF02: [B01_SH02, 102], LF03: [B01_SH07, 16], 'LF03-FALL': [B01_SH07, 34], LF04: [B01_SH04, 79], LF05: [B03_SH05, 38],
  'GLOW-LADDER': [B01_SH04, 40], 'VANTAGE-B02': [B02_SH05, 106], 'LF01-END': [B01_SH01, 47],
};
const box = () => {
  const b = {x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9};
  const add = (pts: unknown) => { if (Array.isArray(pts)) for (const q of pts) if (Array.isArray(q) && Number.isFinite(q[0])) { b.x0 = Math.min(b.x0, q[0]); b.x1 = Math.max(b.x1, q[0]); b.y0 = Math.min(b.y0, q[1]); b.y1 = Math.max(b.y1, q[1]); } };
  const brush = new Proxy({}, {get: (_t, k) => (...a: unknown[]) => { if (k === 'polygon' || k === 'spline') add(a[0]); }}) as Brush;
  return {p: makePainter(brush, {t: 0, frame: 0}), b};
};
const luma = (png: string) => {
  const r = spawnSync('ffmpeg', ['-v', 'error', '-i', png, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], {maxBuffer: 1080 * 1920 * 4});
  const d = r.stdout as Buffer;
  return (x: number, y: number) => { const i = (Math.round(y) * 1080 + Math.round(x)) * 3; return (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255; };
};

const [id, on, off] = process.argv.slice(2);
const [sh, L] = LOOKS[id];
const cam = sh.cam(L), st = sh.state(L), probe: FieldProbe = {};
paintFieldShot(makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0}), cam, {...st, probe});
const out: Record<string, unknown> = {id, shot: sh.id, L};
if (st.dog && probe.dog?.g) {
  const {p, b} = box();
  drawAnimal(p, DOG.seed, DOG, probe.dog.g, camUnit(cam, st.dog.at), {...st.dog.pose, harness: HARNESS}, st.t);
  out.dog = {height: Math.round(b.y1 - b.y0), top: Math.round(b.y0), bottom: Math.round(b.y1), x: [Math.round(b.x0), Math.round(b.x1)], nose: probe.dog.mouth?.map(Math.round), ring: probe.dog.ring?.map(Math.round)};
}
for (const k of ['girl', 'mum'] as const) { const a = probe[k]; if (a) out[k] = {height: Math.round(a.bottom - a.top), top: Math.round(a.top), bottom: Math.round(a.bottom), head: a.head.map(Math.round)}; }
// FR (sheets #fr-frame-rule): FR1 = centre of the lead group's vertical extent (highest lead top to lowest drawn bottom), target 860-1010;
// FR2 = faces / the dog's nose <= 1160. `lowest` names whose bottom sets the extent.
{
  const leads = (['dog', 'girl', 'mum'] as const).map((k) => [k, out[k] as {top: number; bottom: number} | undefined] as const).filter(([, v]) => v && v.bottom > 0 && v.top < 1920);
  if (leads.length) {
    const top = Math.min(...leads.map(([, v]) => v!.top)), low = leads.reduce((a, b) => (b[1]!.bottom > a[1]!.bottom ? b : a));
    const faces: number[] = [];
    if (probe.dog?.mouth) faces.push(probe.dog.mouth[1]);
    for (const k of ['girl', 'mum'] as const) { const a = probe[k]; if (a) faces.push(a.head[1]); }
    out.FR = {extent: [top, low[1]!.bottom], lowest: low[0], centre: Math.round((top + low[1]!.bottom) / 2), FR1: (top + low[1]!.bottom) / 2 >= 860 && (top + low[1]!.bottom) / 2 <= 1010, maxFaceY: Math.round(Math.max(...faces)), FR2: Math.max(...faces) <= 1160};
  }
}
const spots = sh.glow?.(L) ?? [];
if (spots.length) {
  const fOn = on ? luma(on) : null, fOff = off ? luma(off) : null;
  out.glow = spots.map((s) => {
    const q = camPoint(cam, s.at), r = (s.r ?? 0.22) * GLOW_STEPS[glowStep(s.level)] * (s.k ?? 1) * camUnit(cam, s.at) * 0.5;
    let lift: number | undefined;
    if (q && fOn && fOff && q[0] > 0 && q[0] < 1080) {
      let sum = 0, n = 0;
      for (let dy = -r * 0.4; dy <= r * 0.4; dy += 2) for (let dx = -r; dx <= r; dx += 2) { const x = q[0] + dx, y = q[1] + dy; if (x >= 0 && x < 1080 && y >= 0 && y < 1920) { sum += fOn(x, y) - fOff(x, y); n++; } }
      lift = Math.round((sum / Math.max(1, n)) * 1000) / 1000;
    }
    return {at: s.at, level: Math.round(s.level * 1000) / 1000, k: s.k, rPx: Math.round(r * 2), px: q?.map(Math.round), inFrame: !!q && q[0] > 0 && q[0] < 1080, lumaLift: lift};
  });
}
console.log(JSON.stringify(out));
