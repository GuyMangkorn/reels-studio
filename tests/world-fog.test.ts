import {test} from 'node:test';
import assert from 'node:assert/strict';
import worldFog from '../src/videos/world-fog/index';
import {collectEpisodes} from '../src/videos/registry';
import {timelineFrames} from '../src/scenes/timeline';
import {paintedSpans, paintedStateAt} from '../src/scenes/painted';
import {cameraAt, paintedShots} from '../src/painted/registry';
import {toScreen} from '../src/painted/camera';
import type {Painter} from '../src/painted/painter';
import {asmPoseAt, assemblyParts, assemblyRaw, JAM_JUDDER, LIT, SIL, TAP_FRAMES} from '../src/painted/worldfog/assembly';
import {doorPt, farShapeAt, SEDAN_DOOR} from '../src/painted/worldfog/car';
import {drawFigure} from '../src/painted/worldfog/cast';
import {PROJ, SHOT_ROWS, TOTAL_FRAMES, asmAt, fogAt, lampAt, lensAt, lightAt, type V3} from '../src/painted/worldfog/space';
import {SH02_TORCH_HAND, VD18_LIGHT} from '../src/painted/shots/worldfog';

const video = worldFog.videos[0];
const fps = 30;
const total = timelineFrames(video.timeline, fps);
const GLASS = PROJ['CAM-GLASS-OUT'];
/** Plate and plate-local frame at composition frame G, through the registered timeline and its ending. */
const plateAt = (G: number) => {
  const s = paintedStateAt(video.timeline, G, fps, {ending: video.ending!, durationInFrames: total, loopBlendFrames: video.loopBlendFrames!})!;
  return s;
};

test('WFOG-EP01-SHORT registers 22 plates on the SS-R3.1 G ranges, 2610 frames, four story scenes', () => {
  collectEpisodes([worldFog]);
  assert.equal(video.id, 'WFOG-EP01-SHORT');
  assert.equal(total, TOTAL_FRAMES);
  assert.equal(video.timeline.length, 4);
  const spans = paintedSpans(video.timeline, fps);
  assert.deepEqual(spans.map((s) => [s.shot, s.startFrame, s.endFrame]), SHOT_ROWS.map((r) => [`WFOG-${r.id}`, r.g0, r.g0 + r.len]));
  for (const r of SHOT_ROWS) assert.deepEqual(paintedShots[`WFOG-${r.id}`].serves, [r.id]);
  // Fiction marker on the opening shot only (ST-08).
  assert.ok(plateAt(125).plates[0].label);
  assert.equal(plateAt(126).plates[0].label, undefined);
});

test('hard-cut ending (MK-WF-DEP-07): C_seamless with loopBlendFrames 0 has no hold, fade or blend', () => {
  assert.equal(video.ending, 'C_seamless');
  assert.equal(video.loopBlendFrames, 0);
  for (const G of [2520, 2580, 2598, 2608, 2609]) {
    const s = plateAt(G);
    assert.equal(s.opacity, 1);
    assert.equal(s.plates.length, 1, `G${G} paints one plate (no frame-0 blend)`);
    assert.equal(s.plates[0].shot, 'WFOG-S04-SH03');
    assert.equal(s.plates[0].frame, G - 2520, `G${G} is not held`);
  }
});

test('S04-SH03 lamps fade to nothing and FOG-STATE reaches FS3 by G2598 (VD14)', () => {
  for (let i = 0; i < 4; i++) {
    assert.equal(lampAt(2525, i), 1);
    assert.equal(lampAt(2598, i), 0);
  }
  assert.equal(fogAt(2526), 2);
  assert.equal(fogAt(2598), 3);
  assert.equal(fogAt(156), 0); // car parked before the fog bank (PD02 order)
});

test('match frame: G1409 and S03-SH03 f0 share the camera and the warp-off silhouette (SP01 b)', () => {
  const end = cameraAt('WFOG-S02-SH09', 179 / fps), start = cameraAt('WFOG-S03-SH03', 0);
  assert.deepEqual(end, {s: 1.3, fx: 560, fy: 650, dx: 0, dy: 0});
  assert.deepEqual(start, end);
  const a = asmPoseAt(1409), b = asmPoseAt(1800);
  assert.equal(a.light, 0);
  assert.equal(b.light, 0);
  assert.equal(a.warp, 1);
  assert.deepEqual(assemblyRaw(GLASS, {...a, warp: 0}).map((p) => p.pts), assemblyRaw(GLASS, {...b, warp: 0}).map((p) => p.pts));
});

test('VD17 relaxes to exactly zero from G1822: the drawn parts are the honest geometry', () => {
  assert.equal(lensAt(1801), 1);
  assert.ok(lensAt(1812) > 0 && lensAt(1812) < 1);
  for (const G of [1822, 1830, 1900, 2050]) {
    assert.equal(lensAt(G), 0);
    const pose = asmPoseAt(G);
    assert.deepEqual(assemblyParts(GLASS, pose), assemblyParts(GLASS, pose)); // pure
    assert.deepEqual(assemblyParts(GLASS, pose), assemblyRaw(GLASS, pose));
  }
  assert.equal(lightAt(1806), 0);
  assert.equal(lightAt(1830), 1);
  assert.equal(lensAt(1260), 0.7); // SH09 plateau
  assert.ok(Math.abs(lensAt(540) - 1.2) < 1e-9); // SH04 at zs 2.40
});

test('taps: the umbrella tip is on the glass plane on G951, G969, G987 only (CL03)', () => {
  for (const f of TAP_FRAMES) {
    assert.equal(asmPoseAt(900 + f).umbrella.tip[2], 0);
    assert.ok(asmPoseAt(900 + f - 1).umbrella.tip[2] > 0);
    assert.ok(asmPoseAt(900 + f + 1).umbrella.tip[2] > 0);
  }
  assert.ok(Math.abs(asmPoseAt(1028).umbrella.tip[2] - 0.05) < 1e-9);
});

test('catch (SS-R3.1): helmet centre (710, 917) +- 6 px at G1275, catch hand below the leaned shoulder', () => {
  const cam = cameraAt('WFOG-S02-SH09', 45 / fps);
  const pose = asmPoseAt(1275);
  const [x, y] = toScreen(cam, GLASS.P(pose.helmet.c));
  assert.ok(Math.abs(x - 710) <= 6 && Math.abs(y - 917) <= 6, `helmet centre ${x}, ${y}`);
  assert.ok(pose.rHand[1] < 1.15 && pose.helmet.c[1] < 1.15);
});

test('ASM-PATH keys and the S03 pull-back / push-in (ST-04)', () => {
  assert.deepEqual([asmAt(540).xs, asmAt(540).zs], [0.3, 2.4]);
  const stop = asmAt(930);
  assert.deepEqual([stop.xs, stop.zs, stop.sway], [-0.1, 0.62, 0]);
  assert.ok(Math.abs(asmAt(2064).zs - 0.74) < 1e-9);
  assert.ok(Math.abs(asmAt(2159).zs + 0.45) < 1e-9);
  // Lurch: hold frames do not move.
  assert.deepEqual(asmAt(565), asmAt(565));
  assert.equal(asmAt(562).zs, asmAt(565).zs);
});

test('SS-R3.2 camera and rise staging: CAM-INT-SIDE at z -0.6, S03-SH04 pivot, S03-SH01 tilt-follow and rise clock', () => {
  assert.deepEqual(PROJ['CAM-INT-SIDE'].setup?.pos, [2.4, 1.45, -0.6]);
  // The seated helmet centre is the pivot of the S03-SH04 insert: (540, 560) at every push scale (sheet acceptance G1940).
  for (const f of [0, 20, 41]) {
    const [x, y] = toScreen(cameraAt('WFOG-S03-SH04', f / fps), GLASS.P([-0.1, 1.725, 0.62]));
    assert.ok(Math.abs(x - 540) <= 1 && Math.abs(y - 560) <= 1, `S03-SH04 f${f} helmet (${x}, ${y})`);
  }
  // S03-SH01 tilt-follow dy 0 -> +130 over f110-f125; the picture is still at the cut's start.
  assert.equal(cameraAt('WFOG-S03-SH01', 110 / fps).dy, 0);
  assert.equal(cameraAt('WFOG-S03-SH01', 125 / fps).dy, 130);
  // The near mullion (x 1.75) is off frame in S03-SH07 (sheet acceptance G2140).
  assert.ok(toScreen(cameraAt('WFOG-S03-SH07', 0), PROJ['CAM-INT-SIDE'].P([1.75, 1, -0.03]))[0] >= 1080);
});

test('S01-SH01 far shape keeps the ST-09 scale: 134 px at 16 m (f0) and 196 px at 11 m (f125)', () => {
  const a = farShapeAt(0), b = farShapeAt(125);
  assert.ok(Math.abs(a.h - 134.5) < 0.6, `height f0 ${a.h}`);
  assert.ok(Math.abs(b.h - 195.7) < 0.6, `height f125 ${b.h}`);
  assert.deepEqual(a.g.map(Math.round), [190, 780]);
  assert.deepEqual(b.g.map(Math.round), [492, 790]);
});

test('an authored arm elbow (via) places the hand on its target: no IK splay or reach clamp (SS-R3.2 crouch arms)', () => {
  // A painter that accepts every call and draws nothing: drawFigure then returns its anchors only.
  const noop: unknown = new Proxy(() => undefined, {get: (_t, k) => (k === 'alpha' ? 1 : noop), apply: () => undefined});
  const face = {brow: 'worry' as const, eyes: 'dot' as const, look: [0, 0] as [number, number], mouth: 'flat' as const};
  const unit = 800;
  const a = drawFigure(noop as Painter, 'narrator', [540, 1500], unit, {view: 'front', crouch: 1, face, rArm: {to: [470, 1150], via: [440, 1290]}}, 0);
  // The hand sits 0.03 m past the target along the forearm (drawArm), never farther.
  assert.ok(Math.hypot(a.rHand[0] - 470, a.rHand[1] - 1150) <= 0.035 * unit, `hand ${a.rHand}`);
});

test('VD18 light (brief VD18 table): every interior setup has a key and a rim; glass-behind-camera setups halve the rim', () => {
  for (const id of ['CAM-COUNTER-IN', 'CAM-COUNTER-OUT', 'CAM-LOW-SHELF', 'CAM-LOW-CU', 'CAM-INT-REV', 'CAM-INT-SIDE', 'CAM-INT-2S', 'CAM-INT-DOOR-REV'] as const) {
    const L = VD18_LIGHT[id];
    assert.ok(Math.hypot(...L.key) > 0 && Math.hypot(...L.rim) > 0, `${id} key/rim`);
    // The fog glass is behind the camera in the -z setups, so its rim is weak (rimMix x 0.5).
    assert.equal(L.rimScale ?? 1, PROJ[id].setup?.look === '-z' ? 0.5 : 1, `${id} rim strength`);
  }
});

test('S03-SH02 torch hand (ST-07): below the chin line, clear of the mouth, 0.40-0.52 m from the right shoulder', () => {
  // Standing narrator: chin 1.275 m (1.70 m less one 0.425 m head), mouth about 0.11 m below the head centre (1.39 m).
  const mouth: V3 = [-0.95, 1.39, -1.3], shoulder: V3 = [-0.77, 1.40, -1.3];
  const dist = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  assert.ok(SH02_TORCH_HAND[1] < 1.275, `hand height ${SH02_TORCH_HAND[1]} above the chin line`);
  assert.ok(dist(SH02_TORCH_HAND, mouth) >= 0.25, `hand ${dist(SH02_TORCH_HAND, mouth).toFixed(3)} m from the mouth`);
  const reach = dist(SH02_TORCH_HAND, shoulder);
  assert.ok(reach >= 0.40 && reach <= 0.52, `arm length ${reach.toFixed(3)} m`);
});

test('caster tyres: darker than the cart silhouette unlit (S02-SH05), near-black rubber when lit (S03-SH06 core luma <= 0.12)', () => {
  const luma = (hex: string) => {
    const n = parseInt(hex.slice(1), 16);
    return (0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
  };
  const parts = assemblyRaw(PROJ['CAM-LOW-SHELF'], asmPoseAt(760));
  const tyres = parts.filter((q) => q.base === '#15181a');
  assert.equal(tyres.length, 4, 'four casters');
  for (const t of tyres) {
    assert.ok(luma(t.base!) * 255 < luma(SIL) * 255, `tyre base ${t.base} darker than the cart silhouette ${SIL}`);
    assert.ok(luma(LIT.wheel) <= 0.12, `lit tyre ${LIT.wheel} luma ${luma(LIT.wheel).toFixed(3)}`);
  }
});

test('S02-SH03 counter-out camera (ST-02, SS-R3.3): eye 1.10 m and y_h 780 put the counter far top at y 929 and the nosing at y 1003', () => {
  const proj = PROJ['CAM-COUNTER-OUT'];
  assert.ok(Math.abs(proj.P([-2.0, 0.9, -3.2])[1] - 929) <= 1, 'counter far top');
  assert.ok(Math.abs(proj.P([-2.0, 0.9, -2.6])[1] - 1003) <= 1, 'counter nosing');
});

test('S01-SH02 driver door at 55 deg (SS-R3.3 G186): the free edge projects to x 242 +- 15 on the forecourt camera', () => {
  const free = doorPt(0, SEDAN_DOOR.open, 1, 0.9);
  assert.ok(Math.abs(PROJ['CAM-FORECOURT'].P(free)[0] - 242) <= 15, `free edge x ${PROJ['CAM-FORECOURT'].P(free)[0].toFixed(1)}`);
});

test('S03-SH06 caster judder (SS-R3.3 Q4): 2 px on the jammed caster and deck in alternate 5-frame blocks, f6-f30 only', () => {
  const on = (G: number) => (asmPoseAt(G).judder ?? 0) > 0;
  const blocks = [2040, 2050, 2060].map((g) => [g, g + 4] as const);
  for (const [a, b] of blocks) for (let G = a; G <= b; G++) assert.ok(on(G), `judder on at G${G}`);
  for (const [a, b] of [[2034, 2039], [2045, 2049], [2055, 2059], [2065, 2070]] as const) for (let G = a; G <= b; G++) assert.ok(!on(G), `judder off at G${G}`);
  const k = PROJ['CAM-GLASS-OUT'].k([-0.1, 0, 0.62]);
  assert.ok(Math.abs(JAM_JUDDER * k * 3 - 2) < 0.1, `judder ${(JAM_JUDDER * k * 3).toFixed(2)} px at s 3.0`);
});
