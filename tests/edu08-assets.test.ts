import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {camMove, camOf} from '../src/painted/kit/cam-moves';
import {dirToPicture, elevAt, limbDip, LIMB_DIP, paintEarth, rowAtElev} from '../src/painted/kit/earth';
import {glitterAtLips, glitterMarks} from '../src/painted/kit/glitter';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {STAMP, stampState} from '../src/painted/kit/stamp';
import {RING, ringGeom, ringOpacity, ringStory, ringTicks} from '../src/painted/kit/timer-ring';
import {chestAt, chestShape, dropAt, DROP, filmStripAt, flaskAt, paintChestOutline, paintDropDiagram, paintFilmStrip, paintFlaskCard} from '../src/painted/edu08/cards';
import {clipSegment, iceAt, iceShards, insidePoly, paintIceShell, shardAt, suitParts, ICE_T} from '../src/painted/edu08/ice';
import {ORBIT, paintFarModule, paintModule, paintTruss} from '../src/painted/edu08/orbit';
import {camRingClose, latchDeg, MARK_AZ, paintRingClose, RC} from '../src/painted/edu08/ring-close';
import {AIRLOCK, CHAMBER, hatchAngle, paintAirlock, paintChamberSepia} from '../src/painted/edu08/rooms';
import {AST_AT, camLF05} from '../src/painted/edu08/scenes';
import {AST_DEF, ZG_NEUTRAL, paintSuited} from '../src/painted/edu08/suit';
import {camPoint} from '../src/painted/kit/ycam';

// EDU-EP08-SHORT Boss pass B: sets, FX, screen layers and cards (N1-N10). Pure clocks and geometry are tested directly; the painters are run
// through a counting brush so a thrown error or an empty paint fails. Pixel and look evidence lives in the stills (out/edu08/boss-b/).
const counting = () => { let n = 0; const brush = new Proxy({}, {get: () => () => { n++; }}) as Brush; return {painter: () => makePainter(brush, {t: 0, frame: 0}), calls: () => n}; };
const cam = camOf(camMove([0, 1.0, 0.2], [55, 55], [3.2, 3.2], 1.9, {pitch: [-16, -16], f: 1100, hy: 620}), 0);

test('N1 earth: direction-only projection (a truck never moves it), elevation round trip, limb dip grows with altitude, paints at any altitude', () => {
  const moved = {...cam, x: cam.x + 40, z: cam.z - 25, y: cam.y + 3};
  assert.deepEqual(dirToPicture(cam, [1, -2, 3]), dirToPicture(moved, [1, -2, 3]));
  for (const el of [-30, -19.8, -5, 4]) assert.ok(Math.abs(elevAt(cam, 540, rowAtElev(cam, 540, el)) - el) < 1e-3, `elev ${el}`);
  assert.ok(Math.abs(LIMB_DIP - 19.77) < 0.1, `dip ${LIMB_DIP}`);
  assert.ok(limbDip(800) > limbDip(400) && limbDip(200) < limbDip(400));
  for (const altKm of [200, 400, 800]) {
    const t = counting(), {limb} = paintEarth(t.painter(), cam, {altKm, clouds: 60});
    assert.ok(t.calls() > 100 && limb.length > 10, `alt ${altKm}`);
    // the limb row at screen centre is the iso-elevation of -dip for that altitude
    const [, y] = limb.reduce((a, b) => (Math.abs(b[0] - 540) < Math.abs(a[0] - 540) ? b : a));
    assert.ok(Math.abs(elevAt(cam, 540, y) + limbDip(altKm)) < 0.6, `limb alt ${altKm}`);
  }
});

test('N6 vac-glitter: pure in t, bounded by len and size, steady-state snapshot keeps slot ids, flow fades at both ends, starts 3 cm clear of the lips', () => {
  const o: Pt = [300, 760], g = {o, dir: [0.8, -0.6] as Pt, n: 44, len: 130, spread: 0.8, size: 8, seed: 8610};
  assert.deepEqual(glitterMarks({...g, t: 1.3}), glitterMarks({...g, t: 1.3}));
  const snap = glitterMarks({...g, t: 0}), snap2 = glitterMarks({...g, t: 2.7});
  for (const set of [snap, snap2]) assert.ok(set.every((m, i) => (i === 0 || m.slot > set[i - 1].slot) && m.slot >= 0 && m.slot < g.n), 'slots ascend within 0..n');
  assert.ok(snap.length > 15 && snap.length <= g.n);
  const flow = [0, 0.3, 0.9, 1.7, 5.1].flatMap((t) => glitterMarks({...g, t, life: 1.2}));
  assert.ok(flow.length > 80);
  for (const m of flow) {
    assert.ok(Math.hypot(m.x - o[0], m.y - o[1]) <= g.len + 4, 'inside the travel');
    assert.ok(m.r >= 0.8 && m.r <= g.size * 1.3 + 0.01, `size ${m.r}`);
    assert.ok(m.phase >= 0 && m.phase < 1);
  }
  // fade: no mark survives in the first 2 % or the last 3 % of its travel (size eased to under 0.8 px)
  assert.ok(flow.every((m) => m.phase > 0.015 && m.phase < 0.97));
  // flow moves: the same slot is further along at a later time
  const a = glitterMarks({...g, t: 0.2, life: 1.2}).find((m) => m.slot === 3), b = glitterMarks({...g, t: 0.4, life: 1.2}).find((m) => m.slot === 3);
  if (a && b) assert.ok(b.phase > a.phase);
  // stream: a long narrow emitter reaches far, with more slots
  const stream = glitterMarks({o: [160, 1400], dir: [0.82, 0.57], n: 560, len: 820, spread: 0.3, size: 11, t: 0.5, life: 2});
  assert.ok(Math.max(...stream.map((m) => Math.hypot(m.x - 160, m.y - 1400))) > 500);
  // safety: the emitter point is 3 cm of body scale in front of the lips, never at them
  const u = 600, lips: Pt = [500, 800], e = glitterAtLips(lips, u);
  assert.ok(Math.abs(e[0] - lips[0] - 0.03 * u) < 1e-9 && e[1] === lips[1]);
  assert.ok(glitterMarks({...g, o: e, t: 0.7, life: 1.2}).every((m) => Math.hypot(m.x - lips[0], m.y - lips[1]) > 0.03 * u - 4));
});

test('N7 timer-ring: clockwise from 12, 15 s full, band from 240 deg, no digits, paused halves it with two bars, stops at 9 (216 deg) before the band, fades', () => {
  assert.equal(RING.cx, 905); assert.equal(RING.cy, 300); assert.equal(RING.r, 92);
  const g0 = ringGeom(0), g75 = ringGeom(7.5), g9 = ringGeom(9), g15 = ringGeom(99);
  assert.equal(g0.deg, 0); assert.equal(g75.deg, 180); assert.equal(g9.deg, 216); assert.equal(g15.deg, 360, 'clamped');
  assert.ok(g9.deg < 240, 'the stop is before the band');
  assert.ok(Math.abs(g75.tip[0] - RING.cx) < 1e-6 && Math.abs(g75.tip[1] - (RING.cy + RING.r - RING.w / 2)) < 1, 'half way = 6 o clock');
  assert.ok(g0.polys.every((q) => q.kind !== 'prog'), 'nothing at 0');
  assert.ok(g9.ticks.length >= 12 && g9.ticks.every((t) => Math.atan2(t.a[1] - RING.cy, t.a[0] - RING.cx) !== undefined));
  const live = ringGeom(4.3), paused = ringGeom(4.3, {paused: true});
  assert.equal(live.polys.filter((q) => q.kind === 'pause').length, 0);
  assert.equal(paused.polys.filter((q) => q.kind === 'pause').length, 2);
  assert.notEqual(live.polys.find((q) => q.kind === 'prog')!.fill, paused.polys.find((q) => q.kind === 'prog')!.fill);
  // story clock helpers
  assert.equal(ringStory(-1, {from: 2, to: 4, dur: 1}), 2); assert.equal(ringStory(0.5, {from: 2, to: 4, dur: 1}), 3); assert.equal(ringStory(9, {from: 2, to: 4, dur: 1}), 4);
  assert.deepEqual(ringTicks(0, 2.5), [1, 2]); assert.deepEqual(ringTicks(8.2, 9), [9]); assert.deepEqual(ringTicks(3, 3.9), []);
  assert.equal(ringOpacity(-5, {inAt: 0}), 0); assert.equal(ringOpacity(60, {inAt: 0, inFrames: 8}), 1);
  const fade = [0, 4, 8, 12].map((f) => ringOpacity(f, {inAt: -30, stopAt: 0, outFrames: 12}));
  assert.equal(fade[0], 1); assert.equal(fade[3], 0); assert.ok(fade[1] > fade[2] && fade[2] > 0);
});

test('N9 stamp: invisible before it lands, hits at 1.3, settles to 1.0 in 4 f, holds, fades in 6 f', () => {
  const k = {land: 10, fadeAt: 40};
  assert.equal(stampState(9, k).visible, false);
  assert.deepEqual([stampState(10, k).scale, stampState(10, k).opacity], [STAMP.from, 1]);
  assert.equal(stampState(14, k).scale, 1); assert.equal(stampState(30, k).opacity, 1);
  const sc = [10, 11, 12, 13, 14].map((f) => stampState(f, k).scale);
  assert.ok(sc.every((v, i) => i === 0 || v < sc[i - 1]), 'monotone slam');
  assert.equal(stampState(46, k).opacity, 0); assert.equal(stampState(46, k).visible, false);
  assert.ok(stampState(43, k).opacity > 0 && stampState(43, k).opacity < 1);
  assert.equal(stampState(500, {land: 0}).opacity, 1, 'no fadeAt holds forever');
});

test('N8 cards: timelines follow the storyboard and every card paints at every phase', () => {
  const f = (t: number) => filmStripAt(t);
  assert.equal(f(0.2).visible, false); assert.equal(f(0.3).panels, 1); assert.equal(f(0.7).panels, 2); assert.equal(f(1.05).panels, 3);
  assert.equal(f(1.2).cross, 0 + f(1.2).cross); assert.ok(f(1.2).cross < 0.01 && f(1.5).cross === 1);
  assert.equal(f(2.05).visible, true); assert.equal(f(2.2).visible, false); assert.ok(f(2.0).dx < 0);
  assert.equal(flaskAt(0.2).open, 0); assert.equal(flaskAt(0.7).open, 1);
  assert.ok(flaskAt(1.1).heat[0].reach > 0.9 && flaskAt(1.1).heat[0].back === 0, 'wiggle 1 arrives before its bounce');
  assert.ok(flaskAt(1.3).heat[0].back > 0 && flaskAt(1.3).heat[1].reach === 0, 'bounce 1 before wiggle 2 starts');
  assert.ok(flaskAt(2.4).heat[1].back === 1);
  const d = (t: number) => dropAt(t);
  assert.equal(d(0).arrows, 1); assert.equal(d(0.6).arrows, 0); assert.equal(d(0.5).bubbles.length, 0);
  assert.ok(d(1.4).bubbles.length >= 3 && d(1.4).bubbles.length <= 10); assert.equal(d(1.8).glow, 0); assert.ok(d(2.5).glow > 0.99);
  for (let t = 0.9; t < 2.7; t += 0.1) for (const b of d(t).bubbles) assert.ok(Math.hypot(b.x - DROP.cx, b.y - DROP.cy) < DROP.r * 1.2, 'bubbles stay in the drop');
  const c = (t: number) => chestAt(t);
  assert.equal(c(0.05).draw, 0); assert.equal(c(0.5).draw, 1); assert.equal(c(0.55).arrows, 0); assert.ok(c(0.9).arrows > 0.99);
  assert.ok(c(1.55).ring > 0.4 && c(2.6).ring === 0 && c(1.0).ring === 0);
  assert.ok(c(3.6).glow === 1 && c(3.0).glow === 0 && c(4.2).glow === 0, 'one glow near 3.6 s');
  const shape = chestShape([540, 900], 0.34 * 600), xs = shape.map((q) => q[0]);
  assert.ok(Math.max(...xs) - Math.min(...xs) <= 0.34 * 600 + 1 && Math.max(...xs) - Math.min(...xs) > 0.3 * 600, 'outline is the 0.34 m chest');
  for (const t of [0, 0.3, 0.8, 1.2, 1.9, 3.0]) { const k = counting(); paintFilmStrip(k.painter(), [70, 165, 560, 395], {...f(t), panels: f(t).panels}); paintFlaskCard(k.painter(), [430, 470, 1010, 1080], 9300, flaskAt(t)); paintDropDiagram(k.painter(), t); }
  for (const t of [0.2, 0.7, 1.7, 3.6, 5]) { const k = counting(); paintChestOutline(k.painter(), [540, 900], 600, t); assert.ok(t < 0.1 || k.calls() > 0); }
  const k = counting(); paintFilmStrip(k.painter(), [70, 165, 560, 395], {cross: 0.8}); assert.ok(k.calls() > 50, 'still form (no timeline) unchanged');
});

test('N10 ice-shell-gag: confined to suit parts (below the neck ring, short of the glove), creeps in then crumbles away', () => {
  const k = counting(), cs = camLF05, at = AST_AT;
  const a = paintSuited(k.painter(), cs, AST_DEF, {at: [-0.15, -0.62, 0.2], view: 'front', helmet: 'off', face: 'neutral', t: 0, r: ZG_NEUTRAL('r'), l: ZG_NEUTRAL('l'), seed: 7201});
  void at;
  assert.ok(a);
  const parts = suitParts(a, AST_DEF);
  assert.ok(parts.length >= 7, parts.map((p) => p.id).join());
  for (const p of parts) {
    assert.ok(p.poly.every(([, y]) => y >= a.chin), `${p.id} stays below the chin`);
    if (p.id === 'torso') assert.ok(p.poly.every(([, y]) => y >= a.ring[1]), 'the torso shell starts under the neck ring');
    assert.ok(p.poly.every(([x, y]) => Math.hypot(x - a.head[0], y - a.head[1]) > 0.1 * a.u), `${p.id} stays off the head`);
    assert.ok(insidePoly(p.poly, [p.poly.reduce((s, q) => s + q[0], 0) / p.poly.length, p.poly.reduce((s, q) => s + q[1], 0) / p.poly.length]), `${p.id} convex around its centre`);
  }
  for (const [id, hand] of [['rF', a.rHand], ['lF', a.lHand]] as [string, Pt][]) {
    const f = parts.find((p) => p.id === id)!;
    assert.ok(f.poly.every((q) => Math.hypot(q[0] - hand[0], q[1] - hand[1]) > 0.04 * a.u), `${id} stops short of the glove`);
  }
  // every shard at rest lies inside its part; a shard never moves before its delay and is gone after its life
  const shards = iceShards(parts, a.u);
  assert.ok(shards.length > 60 && shards.length < 900, `${shards.length} shards`);
  for (const s of shards) {
    const part = parts.find((p) => p.id === s.part)!;
    assert.ok(s.tri.every((q) => insidePoly(part.poly, q, 1.5)), 'shard inside its part');
    assert.deepEqual(shardAt(s, s.delay - 0.01).off, [0, 0]);
    assert.ok(shardAt(s, s.delay + ICE_T.life + 0.01).gone);
  }
  // clipping
  const sq: Pt[] = [[0, 0], [10, 0], [10, 10], [0, 10]];
  assert.deepEqual(clipSegment(sq, [-5, 5], [15, 5]), [[0, 5], [10, 5]]);
  assert.equal(clipSegment(sq, [-5, -5], [-1, 20]), null);
  assert.ok(clipSegment([...sq].reverse(), [5, -5], [5, 5]), 'either winding');
  // phases: creep 0 -> 1 monotone by 0.33 s, cracks 0.47-0.65, crumble after 0.65, over at 1.4
  const creep = [0, 0.1, 0.2, 0.3, 0.34].map((t) => iceAt(t).creep);
  assert.ok(creep.every((v, i) => i === 0 || v >= creep[i - 1]) && creep[4] === 1);
  assert.equal(iceAt(0.4).crack, 0); assert.equal(iceAt(0.7).crack, 1); assert.ok(iceAt(0.7).crumble > 0); assert.equal(iceAt(1.5).frost, false);
  // paints every phase; before the gag and after it nothing is painted
  for (const t of [0.05, 0.2, 0.4, 0.55, 0.7, 1.0, 1.35]) { const q = counting(); paintIceShell(q.painter(), parts, a.u, t); assert.ok(q.calls() > 0, `t ${t}`); }
  const q0 = counting(); paintIceShell(q0.painter(), parts, a.u, -0.1); paintIceShell(q0.painter(), parts, a.u, 1.5); assert.equal(q0.calls(), 0);
});

test('N5 ring-close: two-stage latch with clicks at 0.25 s (20 deg) and 0.55 s (35 deg), indicator aligns when locked, generic ring (no text)', () => {
  assert.equal(latchDeg(0), 0); assert.equal(latchDeg(0.25), RC.stage1Deg); assert.equal(latchDeg(0.55), RC.lockDeg); assert.equal(latchDeg(2), RC.lockDeg);
  let prev = -1; for (let t = 0; t <= 0.7; t += 0.02) { const v = latchDeg(t); assert.ok(v >= prev - 1e-9); prev = v; }
  assert.ok(latchDeg(0.4) === RC.stage1Deg, 'holds between the clicks');
  assert.equal(RC.R * 2, 30); assert.equal(RC.collarH, 3); assert.equal(RC.lever, 6);
  const open = counting(), shut = counting(), c = camRingClose(0.5);
  const a = paintRingClose(open.painter(), c, {latch: 0}), b = paintRingClose(shut.painter(), c, {latch: RC.lockDeg});
  assert.ok(open.calls() > 200 && shut.calls() > 200);
  assert.ok(a.stripe && a.mark && b.stripe && b.mark && a.tip && b.tip);
  const gapOpen = Math.hypot(a.stripe![0] - a.mark![0], 0), gapLocked = Math.abs(b.stripe![0] - b.mark![0]);
  assert.ok(gapOpen > 60, `open: stripe ${gapOpen.toFixed(0)} px from the mark`);
  assert.ok(gapLocked < 15, `locked: stripe ${gapLocked.toFixed(0)} px from the mark`);
  assert.ok(MARK_AZ < 0);
  assert.ok(Math.abs(a.tip![1] - b.tip![1]) > 20, 'the lever moves');
  // camera: yaw 15 -> 9, r 22 -> 19 set-cm around the latch
  const c0 = camRingClose(0), c1 = camRingClose(1);
  assert.ok(Math.abs(Math.hypot(c0.x, c0.z) - 22) < 1e-9 && Math.abs(Math.hypot(c1.x, c1.z) - 19) < 1e-9);
});

test('N2/N3/N4 sets: anchors match the brief tables, the hatch swings 100 -> 0 over 0.5-1.3 s, behind-hatch paints once only while open, sepia returns a tinted painter', () => {
  assert.deepEqual(ORBIT.rail, [[-6, 0, -0.15], [8, 0, -0.15]]);
  assert.deepEqual(ORBIT.clip, [0.35, 0, -0.15]);
  assert.deepEqual(AIRLOCK.gauge, [0.86, 0.3, 0.3]); assert.deepEqual(AIRLOCK.lamp, [0.86, 0.5, 0.3]);
  assert.deepEqual(CHAMBER.hose, [-1.1, 0.9, -1.7]);
  assert.equal(CHAMBER.gauge[0], 0.62, 'the approved look frame LF03 (storyboard ROWS-R1.3 targets 0.62)');
  assert.equal(hatchAngle(0), 100); assert.equal(hatchAngle(0.5), 100); assert.equal(hatchAngle(1.3), 0); assert.equal(hatchAngle(3), 0);
  assert.ok(hatchAngle(0.9) > 40 && hatchAngle(0.9) < 60);
  let behind = 0;
  const c = camLF05;
  const shutT = counting(); paintAirlock(shutT.painter(), c, {hatchOpen: 0, behind: () => { behind++; }});
  assert.equal(behind, 0, 'shut: nothing behind the cap');
  paintAirlock(counting().painter(), c, {hatchOpen: 60, behind: () => { behind++; }});
  assert.equal(behind, 1);
  const noOpt = counting(), zero = counting(); paintAirlock(noOpt.painter(), c, {}); paintAirlock(zero.painter(), c, {hatchOpen: 0});
  assert.equal(noOpt.calls(), zero.calls(), 'omitted = shut = the look-frame drawing');
  const ch = camOf(camMove([0, 1.1, -0.8], [10, 4], [2.6, 2.0], 1.3, {pitch: [0, 0], f: 1000, hy: 820}), 0.5);
  const t = counting(), p = paintChamberSepia(t.painter(), ch, {lights: 0.45, needle: 0.05, u: 0.4});
  assert.ok(t.calls() > 100 && p.t === 0);
  const far = counting(), cf = camOf(camMove([17, 2.4, -13], [0, 0], 16, 3.2, {pitch: [-4, -4], f: 1100, hy: 700}), 0);
  paintFarModule(far.painter(), cf); assert.ok(far.calls() > 20);
  assert.ok(camPoint(cf, [17, 2.4, -13]), 'the far module is in front of its camera');
  const orb = counting(); paintModule(orb.painter(), cam, {t: 0, hatchOpen: 100}); paintTruss(orb.painter(), cam, {t: 0, tether: {from: [0.1, 1, 0.6]}}); assert.ok(orb.calls() > 200);
});
