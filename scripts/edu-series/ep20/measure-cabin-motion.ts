// Usage: node --import tsx scripts/edu-series/ep20/measure-cabin-motion.ts > out/edu20-w53/motion-geometry.json
// W5.2 Boss contact/size measurement for the kit cabin lean, belt and tether (src/painted/kit/car-cabin.ts) through the same
// rig and the SS-R1 cameras: lead height, balloon height, fixed contacts (hip, hands, feet, belt ends, ring), chest-on-torso,
// face/balloon gap and caption-band clearance, at rest, the SS-R1 held states and the module limits.
// W5.3 (SS-R2): camera D-R (FD20-W53-01), the torso-carried shoulder strap's screen angle against rest and the strap pixels
// left over visible neck/chin skin (FD20-W53-02), and the tilted envelope's angle and right edge (FD20-W53-03).
import type {Brush} from '../../../src/painted/BrushCanvas';
import {BALLOON, PASSENGER} from '../../../src/painted/edu20/cabin-look-data';
import {BALLOON_U_MAX, PASSENGER_LEAN_MAX, paintCabinPassenger, paintPassengerBelt, paintTetheredBalloon, passengerSupport, tetheredBalloonAt} from '../../../src/painted/kit/car-cabin';
import {makePainter, type Pt} from '../../../src/painted/kit/painter';
import {camPoint, type YCam} from '../../../src/painted/kit/ycam';

const CAMS: Record<string, {cam: YCam; band: number}> = {
  'A (look B, SH01 start / B04-SH01)': {cam: {x: 0.46, y: 1.04, z: 2.49, yaw: -0.022, f: 1300, hy: 305}, band: 860},
  'D-R (SS-R2 end of B02-SH01 / B03-SH01 / B03-SH02)': {cam: {x: 0.36, y: 0.975, z: 2.3655, yaw: 0.03, f: 1300, hy: 305}, band: 860},
  'D (B01-SH01 end / B04-SH02 / B05-SH02,SH03)': {cam: {x: 0.46, y: 0.975, z: 2.3655, yaw: 0.03, f: 1300, hy: 305}, band: 860},
  'CLOSE start (B01-SH03 / B05-SH01)': {cam: {x: -0.24, y: 1.04, z: 1.95, yaw: 0, f: 1500, hy: 300}, band: 1140},
  'CLOSE end': {cam: {x: -0.23, y: 1.035, z: 1.94, yaw: -0.008, f: 1500, hy: 310}, band: 1140},
};
const STATES = [
  {name: 'rest', lean: 0, u: 0},
  {name: 'accel SS-R1', lean: -0.07, u: 0.2},
  {name: 'brake SS-R1', lean: 0.07, u: -0.2},
  {name: 'cruise rebound (default drive)', lean: 0, u: -0.03},
  {name: 'accel limit', lean: -PASSENGER_LEAN_MAX, u: BALLOON_U_MAX},
  {name: 'brake limit', lean: PASSENGER_LEAN_MAX, u: -BALLOON_U_MAX},
];
const SKIN = PASSENGER.person.head.skin;
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
const deg = (a: Pt, b: Pt) => (Math.atan2(b[0] - a[0], b[1] - a[1]) * 180) / Math.PI;
const r = (v: number) => Math.round(v * 10) / 10;
const rp = (q: Pt | null) => (q ? [r(q[0]), r(q[1])] : null);
const out: Record<string, unknown> = {};
for (const [camName, {cam, band}] of Object.entries(CAMS)) {
  const rows: Record<string, unknown> = {};
  let rest: {hands: Pt[]; feet: Pt; hip: Pt; strapDeg: number; latch: Pt; lap: Pt} | undefined;
  for (const s of STATES) {
    const {shapes, p} = recorder();
    const a = paintCabinPassenger(p, cam, PASSENGER, 1, true, {lean: s.lean})!;
    const fig = shapes.splice(0);
    const xs = fig.flatMap((q) => q.pts.map((v) => v[0])), ys = fig.flatMap((q) => q.pts.map((v) => v[1]));
    const belt = paintPassengerBelt(p, cam, PASSENGER, undefined, s.lean);
    const strap = shapes.splice(0)[0].pts;
    // Strap pixels (1 px grid) above the chest bend whose topmost figure shape is skin: strap painted over jaw/neck skin.
    // `w52` is the W5.2 strap (drawn from the fixed upper support) on the same body, for comparison.
    const chestY = camPoint(cam, belt.chest)![1];
    const onSkin = (poly: Pt[]) => {
      const sx = poly.map((v) => v[0]), sy = poly.map((v) => v[1]);
      let n = 0;
      for (let py = Math.floor(Math.min(...sy)); py <= chestY; py++) for (let px = Math.floor(Math.min(...sx)); px <= Math.max(...sx); px++) {
        if (!inside([px + 0.5, py + 0.5], poly)) continue;
        const top = [...fig].reverse().find((q) => inside([px + 0.5, py + 0.5], q.pts));
        if (top && top.color === SKIN) n++;
      }
      return n;
    };
    const strapOnSkin = onSkin(strap);
    const w = 0.02, U = belt.upper, C = belt.chest, L = belt.latch;
    const w52 = s.lean ? onSkin(([[U[0] - w, U[1], U[2]], [U[0] + w, U[1], U[2]], [C[0] + w, C[1], C[2]], [L[0] + w, L[1], L[2]], [L[0] - w, L[1], L[2]], [C[0] - w, C[1], C[2]]] as [number, number, number][]).map((v) => camPoint(cam, v)!)) : strapOnSkin;
    const strapDeg = deg(camPoint(cam, s.lean ? belt.shoulder : belt.upper)!, camPoint(cam, belt.chest)!);
    const bal = paintTetheredBalloon(p, cam, BALLOON, true, s.u);
    const env = bal.envelope.map((v) => camPoint(cam, v)!);
    const ex = env.map((v) => v[0]), ey = env.map((v) => v[1]);
    const solved = tetheredBalloonAt(BALLOON, s.u);
    const chest = camPoint(cam, belt.chest)!;
    const shirt = fig.filter((q) => q.color === SHIRT);
    // Face front: rightmost figure point above the chin (hair/skin), against the envelope's leftmost point.
    const faceFront = Math.max(...fig.flatMap((q) => q.pts.filter((v) => v[1] < a.chin).map((v) => v[0])));
    const envOverlapsHeadRows = Math.min(...ey) < a.chin;
    const hip = camPoint(cam, passengerSupport(PASSENGER).hip)!;
    const latchPx = camPoint(cam, belt.latch)!, lapPx = camPoint(cam, belt.lap)!;
    if (s.name === 'rest') rest = {hands: [a.rHand, a.lHand], feet: a.feet, hip, strapDeg, latch: latchPx, lap: lapPx};
    const drift = (q: Pt, q0: Pt) => r(Math.hypot(q[0] - q0[0], q[1] - q0[1]));
    rows[s.name] = {
      lean: s.lean, u: s.u,
      leadPx: r(Math.max(...ys) - Math.min(...ys)), leadTop: r(Math.min(...ys)), leadBottom: r(Math.max(...ys)), leadLeft: r(Math.min(...xs)), leadRight: r(Math.max(...xs)),
      headInFrame: Math.min(...xs) >= 0 && Math.min(...ys) >= 0,
      balloonPx: r(Math.max(...ey) - Math.min(...ey)), balloonBox: [r(Math.min(...ex)), r(Math.min(...ey)), r(Math.max(...ex)), r(Math.max(...ey))],
      ropeM: Math.round(Math.hypot(solved.neck[0] - BALLOON.anchor[0], solved.neck[1] - BALLOON.anchor[1]) * 1e6) / 1e6,
      stringAnchorPx: rp(camPoint(cam, bal.anchor)), ringPx: rp(camPoint(cam, BALLOON.anchor)), neckPx: rp(camPoint(cam, solved.neck)),
      beltPx: {upper: rp(camPoint(cam, belt.upper)), shoulder: rp(camPoint(cam, belt.shoulder)), chest: rp(chest), latch: rp(latchPx), lap: rp(lapPx)},
      upperStrapDeg: r(strapDeg), upperStrapDegFromRest: rest ? r(strapDeg - rest.strapDeg) : 0, strapOnJawNeckSkinPx: strapOnSkin, w52StrapOnJawNeckSkinPx: w52, w52UpperStrapDegFromRest: rest ? r(deg(camPoint(cam, U)!, camPoint(cam, C)!) - rest.strapDeg) : 0,
      beltEndDriftPx: rest ? {latch: drift(latchPx, rest.latch), lap: drift(lapPx, rest.lap)} : null,
      balloonTiltDeg: r((solved.tilt * 180) / Math.PI), balloonRightPx: r(Math.max(...ex)), balloonInFrame: Math.min(...ex) >= 0 && Math.max(...ex) <= 1080 && Math.min(...ey) >= 0,
      chestOnShirt: shirt.some((q) => inside(chest, q.pts)),
      faceToBalloonGapPx: envOverlapsHeadRows ? r(Math.min(...ex) - faceFront) : 'no vertical overlap',
      contactDriftPx: rest ? {rHand: drift(a.rHand, rest.hands[0]), lHand: drift(a.lHand, rest.hands[1]), feet: drift(a.feet, rest.feet), hip: drift(hip, rest.hip)} : null,
      captionBandTop: band, leadAboveBand: Math.max(...ys) < band, balloonAndRingAboveBand: Math.max(...ey, camPoint(cam, BALLOON.anchor)![1]) < band,
    };
  }
  out[camName] = {camera: cam, states: rows};
}
console.log(JSON.stringify(out, null, 1));
