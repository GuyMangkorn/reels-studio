// Usage: node --import tsx scripts/edu-series/ep20/measure-end20.ts [sheet|kit] > out/qa/edu20/r5-boss/end20-<variant>.json
// SS-R5 (SS-R4 FD20-R4-02 +29 f) Boss capability checks for END20 (B05-SH03 G1443-1618, settle start END20_START G1465) through the kit (src/painted/kit/car-cabin.ts) and the
// sheet's settle written out in `end20At` (src/painted/edu20/motion-check.tsx), every frame:
// (1) balloon sign change: u, tilt, rope, envelope/neck screen motion per frame, forward overshoot, face gap;
// (2) lean release: shoulder offset, belt shoulder/chest per-frame motion, fixed latch/lap/hip/hands/feet drift, chest on the hoodie;
// (3) road strip from the braking ease into the last frame: offset monotonic, per-frame step continuity, steps at the last key and G1618.
import type {Brush} from '../../../src/painted/BrushCanvas';
import {BALLOON, PASSENGER, ROAD_KEYS} from '../../../src/painted/edu20/cabin-look-data';
import {end20At, END20_FROM, END20_START, END20_TO, type End20Variant} from '../../../src/painted/edu20/motion-check';
import {paintCabinPassenger, paintPassengerBelt, paintTetheredBalloon, passengerSupport, roadStripAt, tetheredBalloonAt} from '../../../src/painted/kit/car-cabin';
import {makePainter, type Pt} from '../../../src/painted/kit/painter';
import {camPoint} from '../../../src/painted/kit/ycam';

const VARIANT = (process.argv[2] ?? 'sheet') as End20Variant;
const SHIRT = PASSENGER.person.outfit.shirt;
const inside = ([x, y]: Pt, poly: Pt[]) => {
  let r = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) r = !r;
  }
  return r;
};
const recorder = () => {
  const shapes: {color: string; pts: Pt[]}[] = [];
  let color = '';
  const brush = new Proxy({}, {get: (_, n) => (...a: unknown[]) => {
    if (n === 'fill' || n === 'wash') color = String(a[0]);
    if (n === 'polygon') shapes.push({color, pts: a[0] as Pt[]});
  }}) as Brush;
  return {shapes, p: makePainter(brush, {frame: 0, t: 0})};
};
const r = (v: number, d = 1) => Math.round(v * 10 ** d) / 10 ** d;
const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
type Row = {rest: {latch: Pt; lap: Pt; rHand: Pt; feet: Pt}; G: number; u: number; tiltDeg: number; ropeM: number; lean: number; leadPx: number; headLeft: number; gap: number | null; env: Pt; neck: Pt; shoulder: Pt; chest: Pt; latch: Pt; lap: Pt; hip: Pt; rHand: Pt; feet: Pt; chestOnShirt: boolean; balloonBottom: number; leadBottom: number};
const rows: Row[] = [];
for (let G = END20_FROM; G < END20_TO; G++) {
  const s = end20At(G, VARIANT), cam = s.camera, {shapes, p} = recorder();
  const a = paintCabinPassenger(p, cam, PASSENGER, G / 30, true, {lean: s.lean, face: s.face})!;
  const fig = shapes.splice(0);
  const xs = fig.flatMap((q) => q.pts.map((v) => v[0])), ys = fig.flatMap((q) => q.pts.map((v) => v[1]));
  const belt = paintPassengerBelt(p, cam, PASSENGER, undefined, s.lean);
  shapes.splice(0);
  const bal = paintTetheredBalloon(p, cam, BALLOON, true, s.u);
  const env = bal.envelope.map((v) => camPoint(cam, v)!), ex = env.map((v) => v[0]), ey = env.map((v) => v[1]);
  const solved = tetheredBalloonAt(BALLOON, s.u);
  const faceFront = Math.max(...fig.flatMap((q) => q.pts.filter((v) => v[1] < a.chin).map((v) => v[0])));
  const chest = camPoint(cam, belt.chest)!;
  const q = recorder(), a0 = paintCabinPassenger(q.p, cam, PASSENGER, G / 30, true, {})!, b0 = paintPassengerBelt(q.p, cam, PASSENGER, undefined, 0);
  rows.push({
    rest: {latch: camPoint(cam, b0.latch)!, lap: camPoint(cam, b0.lap)!, rHand: a0.rHand, feet: a0.feet},
    G, u: s.u, tiltDeg: (solved.tilt * 180) / Math.PI, ropeM: Math.hypot(solved.neck[0] - BALLOON.anchor[0], solved.neck[1] - BALLOON.anchor[1]), lean: s.lean,
    leadPx: Math.max(...ys) - Math.min(...ys), headLeft: Math.min(...xs), gap: Math.min(...ey) < a.chin ? Math.min(...ex) - faceFront : null,
    env: [ex.reduce((x, y) => x + y) / ex.length, ey.reduce((x, y) => x + y) / ey.length], neck: camPoint(cam, solved.neck)!,
    shoulder: camPoint(cam, s.lean ? belt.shoulder : belt.upper)!, chest, latch: camPoint(cam, belt.latch)!, lap: camPoint(cam, belt.lap)!,
    hip: camPoint(cam, passengerSupport(PASSENGER).hip)!, rHand: a.rHand, feet: a.feet,
    chestOnShirt: fig.filter((q) => q.color === SHIRT).some((q) => inside(chest, q.pts)), balloonBottom: Math.max(...ey), leadBottom: Math.max(...ys),
  });
}
// Per-frame screen steps. The camera itself moves D->A over ss(END20_START, +120), so world-fixed points also move on screen; their step is the
// camera's, so the belt ends are compared against the hip (fixed world point under the same camera) instead of against rest.
const steps = (k: 'env' | 'neck' | 'shoulder' | 'chest') => rows.slice(1).map((x, i) => dist(x[k], rows[i][k]));
const maxOf = (v: number[]) => r(Math.max(...v), 2);
// Largest change of the per-frame step (a velocity jump) and the G of the later frame of that pair.
const accel = (k: 'env' | 'neck' | 'shoulder' | 'chest') => {
  const s = steps(k), d = s.slice(1).map((x, i) => Math.abs(x - s[i])), i = d.indexOf(Math.max(...d));
  return {px: r(d[i], 2), atG: rows[i + 2].G, nearZeroCrossingPx: r(Math.max(...d.filter((_, j) => rows.slice(1).some((x, z) => Math.sign(x.u) !== Math.sign(rows[z].u) && Math.abs(x.G - rows[j + 2].G) <= 3))), 2)};
};
// Fixed contacts against the same frame painted upright (lean 0, u 0) on the same camera: the lean adapter must not move them.
const rel = (k: 'latch' | 'lap' | 'rHand' | 'feet') => maxOf(rows.map((x) => dist(x[k], x.rest[k])));
const at = (G: number) => rows.find((x) => x.G === G)!;
const fwd = rows.filter((x) => x.u > 0);
const zeroCross = rows.slice(1).filter((x, i) => Math.sign(x.u) !== Math.sign(rows[i].u)).map((x) => x.G);
const gaps = rows.filter((x) => x.gap !== null).map((x) => x.gap as number);
const ROAD_FROM = 1380, KEY = ROAD_KEYS[ROAD_KEYS.length - 1].at;
const road = Array.from({length: END20_TO - ROAD_FROM}, (_, i) => ROAD_FROM + i).map((G) => roadStripAt(G, ROAD_KEYS));
const roadSteps = road.slice(1).map((x, i) => x.offset - road[i].offset);
const out = {
  revision: 'EDU-EP20-SS-R5 END20', settleStart: END20_START, variant: VARIANT, frames: [END20_FROM, END20_TO - 1],
  stills: Object.fromEntries([1443, 1465, 1469, 1475, 1483, 1501, 1537, 1561, 1585, 1604, 1618].map((G) => { const x = at(G); return [`F${G}`, {u: r(x.u, 4), tiltDeg: r(x.tiltDeg, 2), lean: r(x.lean, 4), leadPx: r(x.leadPx), headLeftPx: r(x.headLeft), faceGapPx: x.gap === null ? 'no vertical overlap' : r(x.gap), chestOnShirt: x.chestOnShirt, balloonBottomPx: r(x.balloonBottom), leadBottomPx: r(x.leadBottom)}]; })),
  balloon: {
    uRange: [r(Math.min(...rows.map((x) => x.u)), 4), r(Math.max(...rows.map((x) => x.u)), 4)], zeroCrossings: zeroCross,
    maxForwardU: fwd.length ? r(Math.max(...fwd.map((x) => x.u)), 4) : 0, maxForwardAt: fwd.length ? fwd.reduce((m, x) => (x.u > m.u ? x : m)).G : null,
    ropeM: [r(Math.min(...rows.map((x) => x.ropeM)), 6), r(Math.max(...rows.map((x) => x.ropeM)), 6)],
    minFaceGapPx: gaps.length ? r(Math.min(...gaps)) : 'no vertical overlap', envelopeCentreMaxStepPx: maxOf(steps('env')), envelopeCentreMaxStepChangePx: accel('env'),
    neckMaxStepPx: maxOf(steps('neck')), neckMaxStepChangePx: accel('neck'),
  },
  lean: {
    range: [r(Math.min(...rows.map((x) => x.lean)), 4), r(Math.max(...rows.map((x) => x.lean)), 4)], restFromG: rows.find((x) => x.lean === 0)?.G,
    shoulderMaxStepPx: maxOf(steps('shoulder')), shoulderMaxStepChangePx: accel('shoulder'), chestMaxStepPx: maxOf(steps('chest')), chestMaxStepChangePx: accel('chest'),
    chestOnShirtEveryFrame: rows.every((x) => x.chestOnShirt), fixedContactDriftVsUprightPx: {latch: rel('latch'), lap: rel('lap'), rHand: rel('rHand'), feet: rel('feet')},
    minLeadPx: r(Math.min(...rows.map((x) => x.leadPx))), minHeadLeftPx: r(Math.min(...rows.map((x) => x.headLeft))),
    maxLeadBottomPx: r(Math.max(...rows.map((x) => x.leadBottom))), maxBalloonBottomPx: r(Math.max(...rows.map((x) => x.balloonBottom))),
  },
  road: {
    frames: [ROAD_FROM, END20_TO - 1], lastKey: KEY, monotonic: roadSteps.every((d) => d >= 0), stepMetres: {min: r(Math.min(...roadSteps), 7), max: r(Math.max(...roadSteps), 7)},
    maxStepChange: r(Math.max(...roadSteps.slice(1).map((d, i) => Math.abs(d - roadSteps[i]))), 8),
    stepIntoLastKey: r(roadSteps[KEY - ROAD_FROM - 1], 7), stepAfterLastKey: r(roadSteps[KEY - ROAD_FROM], 7), stepIntoLastFrame: r(roadSteps.at(-1)!, 7),
    offsetAt: Object.fromEntries([1414, KEY, 1465, 1530, 1585, 1618].map((G) => [`F${G}`, r(roadStripAt(G, ROAD_KEYS).offset, 5)])),
  },
};
console.log(JSON.stringify(out, null, 1));
