import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {BALLOON, LOOKS, PASSENGER, ROAD_KEYS} from '../src/painted/edu20/cabin-look-data';
import {BALLOON_U_MAX, PASSENGER_LEAN_MAX, ROAD_SPEED_FULL, ROAD_TILE, cabinDriveAt, paintCabinBack, paintRoadStrip, roadSpeedAt, roadStripAt, paintCabinPassenger, paintPassengerBelt, paintTetheredBalloon, passengerLeanAngle, passengerSupport, tetheredBalloonAt, torsoPoint, type DriveKey} from '../src/painted/kit/car-cabin';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {end20At, END20_FROM, END20_START, END20_TO} from '../src/painted/edu20/motion-check';
import {camPoint} from '../src/painted/kit/ycam';

// EDU-EP20 W5.2: kit cabin lean, belt and tether (src/painted/kit/car-cabin.ts) on the LF20-CABIN-B camera.
const cam = LOOKS.B.camera;
const recorder = () => {
  const shapes: {color: string; pts: Pt[]}[] = [];
  let color = '';
  const brush = new Proxy({}, {get: (_, n) => (...a: unknown[]) => {
    if (n === 'fill' || n === 'wash') color = String(a[0]);
    if (n === 'polygon') shapes.push({color, pts: a[0] as Pt[]});
  }}) as Brush;
  return {shapes, p: makePainter(brush, {frame: 0, t: 0})};
};
const close = (a: number, b: number, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);

test('defaults draw the approved look: no lean, upright tether, straight belt', () => {
  const a = recorder(), b = recorder();
  paintCabinPassenger(a.p, cam, PASSENGER, 1, true);
  paintCabinPassenger(b.p, cam, PASSENGER, 1, true, {lean: 0});
  assert.deepEqual(a.shapes, b.shapes);
  const belt = paintPassengerBelt(a.p, cam, PASSENGER);
  assert.deepEqual(belt.upper, [-0.24698333333333333, 1.04, 0.07]);
  assert.equal(tetheredBalloonAt(BALLOON, 0).centre, BALLOON.centre);
});

test('tether keeps the SS-R1 rope and fixed ring at every offset', () => {
  for (const u of [-BALLOON_U_MAX, -0.2, -0.03, 0, 0.2, BALLOON_U_MAX, 0.9]) {
    const b = tetheredBalloonAt(BALLOON, u);
    close(Math.hypot(b.neck[0] - BALLOON.anchor[0], b.neck[1] - BALLOON.anchor[1]), 0.855);
    // SS-R2 FD20-W53-03: the centre continues the string line, 0.195 m past the neck, tilted by asin(u / rope).
    close(Math.hypot(b.centre[0] - b.neck[0], b.centre[1] - b.neck[1]), 0.195);
    close((b.neck[0] - b.anchor[0]) * (b.centre[1] - b.anchor[1]) - (b.neck[1] - b.anchor[1]) * (b.centre[0] - b.anchor[0]), 0);
    close(b.tilt, Math.asin(Math.max(-BALLOON_U_MAX, Math.min(BALLOON_U_MAX, u)) / 0.855));
    assert.deepEqual(b.anchor, BALLOON.anchor);
    const {p} = recorder();
    assert.deepEqual(paintTetheredBalloon(p, cam, BALLOON, true, u).anchor, BALLOON.anchor);
  }
  const b2 = tetheredBalloonAt(BALLOON, 0.2), ny = 0.10 + Math.sqrt(0.855 ** 2 - 0.04);
  close(b2.centre[0], 0.82 + 0.195 * 0.2 / 0.855); close(b2.centre[1], ny + 0.195 * (ny - 0.10) / 0.855);
  close(b2.tilt * 180 / Math.PI, 13.52, 0.01);
});

test('balloon tilt: envelope, knot and highlight turn rigidly about the neck; u 0 draws the approved balloon', () => {
  const rest = recorder(), zero = recorder();
  paintTetheredBalloon(rest.p, cam, BALLOON, true);
  paintTetheredBalloon(zero.p, cam, BALLOON, true, 0);
  assert.deepEqual(zero.shapes, rest.shapes);
  const n0 = tetheredBalloonAt(BALLOON, 0).neck, e0 = paintTetheredBalloon(recorder().p, cam, BALLOON, true).envelope;
  for (const u of [-0.2, 0.13, 0.2]) {
    const b = tetheredBalloonAt(BALLOON, u), e = paintTetheredBalloon(recorder().p, cam, BALLOON, true, u).envelope;
    e.forEach((v, i) => {
      // Same offset from the neck as the upright envelope, turned by -tilt (clockwise for + u, toward the car front).
      const dx = e0[i][0] - n0[0], dy = e0[i][1] - n0[1], c = Math.cos(b.tilt), s = Math.sin(b.tilt);
      close(v[0], b.neck[0] + dx * c + dy * s, 1e-12); close(v[1], b.neck[1] - dx * s + dy * c, 1e-12);
    });
    assert.equal(Math.sign(e.reduce((m, v) => (v[1] > m[1] ? v : m))[0] - b.neck[0]), Math.sign(u), 'top leans the way the string leans');
  }
});

test('lean turns the torso about the fixed hip; hands, feet and belt ends stay', () => {
  const rest = paintCabinPassenger(recorder().p, cam, PASSENGER, 1, true)!;
  const restBelt = paintPassengerBelt(recorder().p, cam, PASSENGER);
  const {hip} = passengerSupport(PASSENGER);
  for (const lean of [-PASSENGER_LEAN_MAX, -0.07, 0.07, PASSENGER_LEAN_MAX]) {
    const a = paintCabinPassenger(recorder().p, cam, PASSENGER, 1, true, {lean})!;
    assert.deepEqual([a.rHand, a.lHand, a.feet], [rest.rHand, rest.lHand, rest.feet]);
    assert.equal(Math.sign(a.head[0] - rest.head[0]), Math.sign(lean), 'head moves with the lean');
    const rb = recorder(), belt = paintPassengerBelt(rb.p, cam, PASSENGER, undefined, lean);
    assert.deepEqual([belt.upper, belt.latch, belt.lap], [restBelt.upper, restBelt.latch, restBelt.lap]);
    close(Math.hypot(belt.chest[0] - hip[0], belt.chest[1] - hip[1]), Math.hypot(restBelt.chest[0] - hip[0], restBelt.chest[1] - hip[1]));
    // SS-R2 FD20-W53-02: the drawn strap starts at the torso-carried shoulder point, not the fixed upper support.
    assert.deepEqual(belt.shoulder, torsoPoint(PASSENGER, restBelt.upper, lean));
    const strapTop = Math.min(...rb.shapes[0].pts.map((v) => v[1]));
    const sh = camPoint(cam, belt.shoulder)!, up = camPoint(cam, belt.upper)!;
    assert.ok(Math.abs(strapTop - sh[1]) < 1 && Math.abs(strapTop - up[1]) > 1, 'strap top is the carried shoulder');
    // The strap turns with the torso: upper segment angle = rest angle + torso tilt.
    const ang = (a: number[], b: number[]) => Math.atan2(b[0] - a[0], b[1] - a[1]);
    close(ang(belt.shoulder, belt.chest) - ang(restBelt.upper, restBelt.chest), passengerLeanAngle(PASSENGER.person, lean), 1e-12);
  }
  assert.deepEqual(restBelt.shoulder, restBelt.upper);
  const shoulder = torsoPoint(PASSENGER, [hip[0], hip[1] + 0.49348, 0], 0.07);
  close(shoulder[0] - hip[0], 0.07, 1e-6);
});

const KEYS: DriveKey[] = [{at: 30, phase: 'accelerate'}, {at: 120, phase: 'cruise'}, {at: 270, phase: 'brake'}];
test('drive: acceleration, settled cruise and braking are distinct held states', () => {
  const pre = cabinDriveAt(0, KEYS), acc = cabinDriveAt(100, KEYS), cru = cabinDriveAt(260, KEYS), brk = cabinDriveAt(350, KEYS);
  assert.ok(pre.settled && pre.u === 0 && pre.lean === 0);
  close(acc.u, 0.2); close(acc.lean, -0.07);
  assert.ok(cru.settled && Math.abs(cru.u) < 0.004 && cru.lean === 0);
  close(brk.u, -0.2); close(brk.lean, 0.07);
  // A settling swing never reaches a braking-sized rearward offset.
  for (let f = 120; f < 270; f++) assert.ok(cabinDriveAt(f, KEYS).u > -0.04, `F${f}`);
});

test('drive: pure in frame (seek parity) and continuous across phase changes', () => {
  const frames = Array.from({length: 360}, (_, f) => f);
  const forward = frames.map((f) => cabinDriveAt(f, KEYS));
  const shuffled = [...frames].reverse().map((f) => [f, cabinDriveAt(f, [...KEYS].reverse())] as const);
  for (const [f, s] of shuffled) assert.deepEqual(s, forward[f]);
  for (let f = 1; f < 360; f++) {
    assert.ok(Math.abs(forward[f].u - forward[f - 1].u) < 0.025, `u jump at F${f}`);
    assert.ok(Math.abs(forward[f].lean - forward[f - 1].lean) < 0.01, `lean jump at F${f}`);
  }
});

// EDU-EP20 W5.2b: far-window road strip (src/painted/kit/car-cabin.ts).
const back = (road?: {offset: number; speed: number}) => {
  const r = recorder();
  paintCabinBack(r.p, cam, LOOKS.B.palette, PASSENGER, true, road);
  return r.shapes;
};
const strip = (offset: number, speed = 0.001) => {
  const r = recorder();
  paintRoadStrip(r.p, cam, LOOKS.B.palette, {offset, speed});
  return r.shapes;
};
test('road: no strip argument or a stopped car paints the approved still back', () => {
  const still = back();
  assert.deepEqual(back({offset: 0, speed: 0}), still);
  assert.deepEqual(back({offset: 0.37, speed: 0}), still);
  assert.ok(back({offset: 0, speed: 0.0007}).length > still.length);
});

test('road: offset is the exact integral of the keyed speed and never runs backward', () => {
  // Fixed W5.2b values (SS-R1 speeds), independent of Film's current ROAD_KEYS data.
  const R1 = [{at: 0, speed: 0.0007}, {at: 187, speed: 0.0007}, {at: 352, speed: 0.0012}, {at: 1209, speed: 0.0012}, {at: 1414, speed: 0.0007}];
  close(roadStripAt(187, R1).offset, 0.0007 * 187, 1e-12);
  // Smoothstep ease 187 -> 352 covers the mean of both speeds.
  close(roadStripAt(352, R1).offset, 0.0007 * 187 + 165 * 0.00095, 1e-12);
  close(roadStripAt(1209, R1).offset, 0.0007 * 187 + 165 * 0.00095 + 857 * 0.0012, 1e-12);
  // The episode data (cabin-look-data ROAD_KEYS, Film-owned): offset at each key = trapezoid sum of the key speeds.
  close(roadStripAt(0, ROAD_KEYS).offset, 0);
  let acc = 0;
  for (let i = 1; i < ROAD_KEYS.length; i++) {
    acc += (ROAD_KEYS[i].at - ROAD_KEYS[i - 1].at) * (ROAD_KEYS[i].speed + ROAD_KEYS[i - 1].speed) / 2;
    close(roadStripAt(ROAD_KEYS[i].at, ROAD_KEYS).offset, acc, 1e-12);
    close(roadSpeedAt(ROAD_KEYS[i].at, ROAD_KEYS), ROAD_KEYS[i].speed);
  }
  let prev = roadStripAt(-1, ROAD_KEYS);
  for (let f = 0; f <= 1618; f++) {
    const s = roadStripAt(f, ROAD_KEYS);
    assert.ok(s.offset > prev.offset, `G${f} offset must advance`);
    // Per-frame step matches the mean speed across the frame (no jump at key boundaries).
    assert.ok(Math.abs(s.offset - prev.offset - (s.speed + prev.speed) / 2) < 2e-6, `G${f} step`);
    prev = s;
  }
  const rev = [...ROAD_KEYS].reverse();
  for (const f of [ROAD_KEYS[ROAD_KEYS.length - 1].at, 1430, 3, 900, 250, 1300, 0]) assert.deepEqual(roadStripAt(f, rev), roadStripAt(f, ROAD_KEYS));
  assert.equal(roadSpeedAt(10, [{at: 0, speed: -0.002}]), 0, 'a negative speed never reverses the scenery');
});

test('road: wrap is seamless, speed changes only the scroll, marks stay in the window band', () => {
  // One tile later the picture is the same polygons (seeds may differ, geometry may not).
  const geo = (o: number) => strip(o).map((q) => q.pts.map(([x, y]) => [Math.round(x * 1e6), Math.round(y * 1e6)]));
  for (const o of [0, 0.4123, 1.1]) assert.deepEqual(geo(o + ROAD_TILE), geo(o));
  // Above the fade the strip looks the same at every speed: only the offset carries acceleration or braking.
  assert.deepEqual(strip(0.5, 0.0007), strip(0.5, 0.0012));
  assert.deepEqual(strip(0.5, ROAD_SPEED_FULL), strip(0.5, 0.01));
  // Across a whole tile at the steady SS-R1 step, entering and leaving marks stay inside the far window band.
  for (let o = 0; o < ROAD_TILE; o += 0.0012) {
    const ys = strip(o).flatMap((q) => q.pts.map((v) => v[1]));
    assert.ok(Math.min(...ys) > 300 && Math.max(...ys) < 420, `offset ${o}: strip stays in the far window band, far above the caption band`);
  }
});

// SS-R5 END20 (B05-SH03 G1443-1618, SS-R4 FD20-R4-02 +29 f, start S = END20_START G1465): the three Boss capability checks,
// through the check's settle (`end20At`).
test('END20: tether takes a small forward u right after a rearward one (no hysteresis); lean release keeps the belt on the body', () => {
  // Pure in u: a forward value gives the same neck whether reached from a rearward state or alone, and 0 is the approved balloon.
  const fwd = tetheredBalloonAt(BALLOON, 0.0446);
  for (const before of [-0.2, -0.01, 0]) { tetheredBalloonAt(BALLOON, before); assert.deepEqual(tetheredBalloonAt(BALLOON, 0.0446), fwd); }
  close(fwd.tilt * 180 / Math.PI, 2.99, 0.01);
  // Continuous through the sign change: neck and tilt approach the upright values from both sides.
  const up = tetheredBalloonAt(BALLOON, 0), e = 1e-6;
  for (const s of [-1, 1]) { const b = tetheredBalloonAt(BALLOON, s * e); close(b.neck[0], up.neck[0], 1e-5); close(b.centre[0], up.centre[0], 1e-5); close(b.tilt, 0, 1e-5); }
  // The kit release (zero start velocity) lands the sheet's prose numbers; the sheet formula as written peaks at 0.0498 m (S+31).
  const S = END20_START, n = END20_TO - END20_FROM, i0 = S - END20_FROM;
  assert.equal(S, 1465);
  assert.equal(ROAD_KEYS[ROAD_KEYS.length - 1].at <= END20_FROM, true, 'braking ends before the settle starts');
  const kit = Array.from({length: n}, (_, i) => end20At(END20_FROM + i, 'kit').u), sheet = Array.from({length: n}, (_, i) => end20At(END20_FROM + i, 'sheet').u);
  close(Math.max(...kit), end20At(S + 36, 'kit').u, 1e-12);
  close(Math.max(...sheet), end20At(S + 31, 'sheet').u, 1e-12);
  assert.ok(Math.max(...kit) <= 0.045 && Math.max(...kit) > 0.044);
  assert.ok(Math.max(...sheet) > 0.0497 && Math.max(...sheet) < 0.0499);
  for (let i = 1; i <= i0; i++) { close(kit[i], -0.2, 1e-12); close(sheet[i], -0.2, 1e-12); } // held through S
  assert.ok(Math.abs(kit[i0 + 1] - kit[i0]) < 0.002, 'kit release starts at rest');
  assert.ok(Math.abs(sheet[i0 + 1] - sheet[i0]) > 0.008, 'sheet formula starts with a velocity jump at S');
  // No jump anywhere in the kit settle (per-frame u step changes by < 0.002 m, measured max 0.0017 at S+1); u at rest by the end.
  for (let i = 2; i < n; i++) assert.ok(Math.abs(kit[i] - 2 * kit[i - 1] + kit[i - 2]) < 0.002, `G${END20_FROM + i} u step change`);
  assert.ok(Math.abs(kit[n - 1]) < 0.001);
  // Lean +0.07 -> 0: belt shoulder and chest converge on the upright strap; latch and lap never move.
  const b0 = paintPassengerBelt(recorder().p, cam, PASSENGER, undefined, 0);
  let prev = paintPassengerBelt(recorder().p, cam, PASSENGER, undefined, end20At(S).lean);
  close(end20At(S).lean, 0.07, 1e-12);
  for (let G = S + 1; G <= S + 30; G++) {
    const b = paintPassengerBelt(recorder().p, cam, PASSENGER, undefined, end20At(G).lean);
    assert.deepEqual([b.latch, b.lap], [b0.latch, b0.lap]);
    assert.ok(Math.hypot(b.shoulder[0] - prev.shoulder[0], b.shoulder[1] - prev.shoulder[1]) < 0.006, `G${G} shoulder step`);
    prev = b;
  }
  assert.equal(end20At(S + 30).lean, 0);
  assert.deepEqual(prev.shoulder, b0.upper);
});

test('END20: road strip holds the cruise step from the last key (SS-R5 G1443) to the last frame G1618', () => {
  const end = ROAD_KEYS[ROAD_KEYS.length - 1].at;
  assert.equal(end, 1443);
  let last = roadStripAt(end - 1, ROAD_KEYS).offset;
  for (let G = end; G < END20_TO; G++) {
    const r = roadStripAt(G, ROAD_KEYS);
    close(r.offset - last, 0.0006, 1e-7);
    close(r.speed, 0.0006);
    last = r.offset;
  }
});
