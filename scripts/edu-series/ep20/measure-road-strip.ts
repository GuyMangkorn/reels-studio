// Usage: node --import tsx scripts/edu-series/ep20/measure-road-strip.ts > out/qa/edu20/r5-boss/road-geometry.json
// W5.2b Boss measurement of the far-window road strip (src/painted/kit/car-cabin.ts) on the episode cameras: picture rows the
// strip occupies against each caption band, apparent scroll in px/frame and px/s at the current ROAD_KEYS speeds, and the
// largest single-frame move (and move change) of any strip mark over the whole G0-G1618 clock (SS-R5; a wrap or snap would
// show as a jump). Offsets must advance on every frame (monotone).
import type {Brush} from '../../../src/painted/BrushCanvas';
import {LOOKS, ROAD_KEYS} from '../../../src/painted/edu20/cabin-look-data';
import {paintRoadStrip, roadStripAt} from '../../../src/painted/kit/car-cabin';
import {makePainter, type Pt} from '../../../src/painted/kit/painter';
import {camPoint, type YCam} from '../../../src/painted/kit/ycam';

const CAMS: Record<string, {cam: YCam; band: number}> = {
  'A (look B, SH01 start / B04-SH01)': {cam: LOOKS.B.camera, band: 860},
  'D (SH01 end / B05-SH02,SH03)': {cam: {x: 0.46, y: 0.975, z: 2.3655, yaw: 0.03, f: 1300, hy: 305}, band: 860},
  'D-R (end B02-SH01 / B03-SH01 / B03-SH02)': {cam: {x: 0.36, y: 0.975, z: 2.3655, yaw: 0.03, f: 1300, hy: 305}, band: 860},
  'CLOSE start (B01-SH03 / B05-SH01)': {cam: {x: -0.24, y: 1.04, z: 1.95, yaw: 0, f: 1500, hy: 300}, band: 1140},
  'CLOSE end': {cam: {x: -0.23, y: 1.035, z: 1.94, yaw: -0.008, f: 1500, hy: 310}, band: 1140},
};
const recorder = () => {
  const shapes: {color: string; seed: number; pts: Pt[]}[] = [];
  let color = '', seed = 0;
  const brush = new Proxy({}, {get: (_, n) => (...a: unknown[]) => {
    if (n === 'fill' || n === 'wash') color = String(a[0]);
    if (n === 'seed') seed = Number(a[0]);
    if (n === 'polygon') shapes.push({color, seed, pts: a[0] as Pt[]});
  }}) as Brush;
  return {shapes, p: makePainter(brush, {frame: 0, t: 0})};
};
const r3 = (v: number) => Math.round(v * 1000) / 1000;
const LAST = 1618, speeds = [...new Set(ROAD_KEYS.map((k) => k.speed))].sort((a, b) => a - b);
let monotone = true;
for (let g = 1; g <= LAST; g++) if (!(roadStripAt(g, ROAD_KEYS).offset > roadStripAt(g - 1, ROAD_KEYS).offset)) monotone = false;
const out: Record<string, unknown> = {revision: 'EDU-EP20-SS-R5 (FD20-R5-02)', roadKeys: ROAD_KEYS, frames: [0, LAST], offsetMonotone: monotone};
for (const [name, {cam, band}] of Object.entries(CAMS)) {
  const pxPerM = Math.abs(camPoint(cam, [1, 0.88, -0.83])![0] - camPoint(cam, [0, 0.88, -0.83])![0]);
  let top = Infinity, bottom = -Infinity, maxStep = 0, maxStepAt = -1, maxChange = 0, maxChangeAt = -1;
  let prev: Map<number, Pt> | null = null, prevStep: Map<number, number> = new Map();
  for (let g = 0; g <= LAST; g++) {
    const {shapes, p} = recorder();
    paintRoadStrip(p, cam, LOOKS.B.palette, roadStripAt(g, ROAD_KEYS));
    const pts = shapes.flatMap((s) => s.pts);
    for (const [, y] of pts) { top = Math.min(top, y); bottom = Math.max(bottom, y); }
    // Mark-by-mark step: each moving mark keeps its seed while it crosses; compare its left/right picture edges with the
    // same mark last frame (an edge held by the window clip moves 0, the free edge by the scroll).
    const edges = new Map(shapes.slice(1).map((s) => [s.seed, [Math.min(...s.pts.map((v) => v[0])), Math.max(...s.pts.map((v) => v[0]))] as Pt]));
    const steps = new Map<number, number>();
    if (prev) for (const [k, [l, rr]] of edges) {
      const q = prev.get(k);
      if (!q) continue;
      // Free (unclipped) edge: the one that moved more.
      const d = Math.max(Math.abs(q[0] - l), Math.abs(q[1] - rr));
      if (d > maxStep) { maxStep = d; maxStepAt = g; }
      steps.set(k, d);
      const ps = prevStep.get(k);
      // Step change only while both edges are free (|step| equals the scroll): skip frames where the clip holds an edge.
      const scroll = (roadStripAt(g, ROAD_KEYS).offset - roadStripAt(g - 1, ROAD_KEYS).offset) * pxPerM;
      if (ps !== undefined && Math.abs(d - scroll) < 0.05 && Math.abs(ps - (roadStripAt(g - 1, ROAD_KEYS).offset - roadStripAt(g - 2, ROAD_KEYS).offset) * pxPerM) < 0.05) {
        const c = Math.abs(d - ps);
        if (c > maxChange) { maxChange = c; maxChangeAt = g; }
      }
    }
    prev = edges; prevStep = steps;
  }
  const at = (speed: number) => ({pxPerFrame: r3(speed * pxPerM), pxPerSecond: r3(speed * pxPerM * 30)});
  out[name] = {
    pxPerMetreOnPane: r3(pxPerM), speeds: Object.fromEntries(speeds.map((v) => [`${v * 1000} mm/f`, at(v)])),
    stripRowsPx: [r3(top), r3(bottom)], captionBandTop: band, clearOfCaptionBandPx: r3(band - bottom),
    largestMarkStepPx: r3(maxStep), largestMarkStepAtG: maxStepAt, largestMarkStepChangePx: Math.round(maxChange * 1e5) / 1e5, largestMarkStepChangeAtG: maxChangeAt,
    scrollPxAt: Object.fromEntries([1209, 1300, 1414, 1442, 1443, 1444, 1530, 1618].map((g) => [`G${g}`, Math.round((roadStripAt(g, ROAD_KEYS).offset - roadStripAt(g - 1, ROAD_KEYS).offset) * pxPerM * 1e4) / 1e4])),
  };
}
console.log(JSON.stringify(out, null, 2));
