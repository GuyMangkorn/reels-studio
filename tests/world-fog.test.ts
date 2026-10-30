import {test} from 'node:test';
import assert from 'node:assert/strict';
import worldFog from '../src/videos/world-fog/index';
import {collectEpisodes} from '../src/videos/registry';
import {timelineFrames} from '../src/scenes/timeline';
import {paintedSpans, paintedStateAt} from '../src/scenes/painted';
import {cameraAt, paintedShots} from '../src/painted/registry';
import {toScreen} from '../src/painted/camera';
import {mixColor, type Painter, type Pt} from '../src/painted/painter';
import {asmPoseAt, assemblyParts, assemblyRaw, JAM_JUDDER, LIT, SIL, TAP_FRAMES} from '../src/painted/worldfog/assembly';
import {doorPt, farShapeAt, SEDAN_DOOR} from '../src/painted/worldfog/car';
import {CAST, drawFigure, shoulderHeight, type Arm} from '../src/painted/worldfog/cast';
import {DEG, PROJ, SHOT_ROWS, TOTAL_FRAMES, ambientAt, asmAt, doorAt, fogAt, frontAt, lampAt, lensAt, lightAt, pchip, storyAt, torchOnAt, type V3} from '../src/painted/worldfog/space';
import {siteB, siteFront} from '../src/painted/worldfog/site';
import {CLEAR, FRONT_FADE_M, carCoverAt, headlampAt, paintOutside} from '../src/painted/worldfog/outside';
import {SH02_TORCH_HAND, SH07_TORCH, VD18_LIGHT, beamSH06A, clutch, counterWorkerArms, sh02Arms, sh07NarratorGlance} from '../src/painted/shots/worldfog';

const video = worldFog.videos[0];
const fps = 30;
const total = timelineFrames(video.timeline, fps);
const GLASS = PROJ['CAM-GLASS-OUT'];
/** Plate and plate-local frame at composition frame G, through the registered timeline and its ending. */
const plateAt = (G: number) => {
  const s = paintedStateAt(video.timeline, G, fps, {ending: video.ending!, durationInFrames: total, loopBlendFrames: video.loopBlendFrames!})!;
  return s;
};

test('WFOG-EP01-SHORT registers 25 plates on the SS-R5.1 G ranges, 3766 frames, four story scenes', () => {
  collectEpisodes([worldFog]);
  assert.equal(video.id, 'WFOG-EP01-SHORT');
  assert.equal(total, TOTAL_FRAMES);
  assert.equal(TOTAL_FRAMES, 3766);
  assert.equal(video.timeline.length, 4);
  assert.equal(SHOT_ROWS.length, 25);
  assert.equal(SHOT_ROWS.reduce((n, r) => n + r.len, 0), 3766);
  const spans = paintedSpans(video.timeline, fps);
  assert.deepEqual(spans.map((s) => [s.shot, s.startFrame, s.endFrame]), SHOT_ROWS.map((r) => [`WFOG-${r.id}`, r.g0, r.g0 + r.len]));
  for (const r of SHOT_ROWS) assert.deepEqual(paintedShots[`WFOG-${r.id}`].serves, [r.id]);
  // Fiction marker on the opening shot only (ST-08).
  assert.ok(plateAt(125).plates[0].label);
  assert.equal(plateAt(126).plates[0].label, undefined);
  // SS-R5.1 starts: S01-SH02A G240, S02-SH00A G360 (174 f), S02-SH01 G534, S02-SH02 G630 (156 f), S02-SH03 G786.
  assert.deepEqual([plateAt(240), plateAt(360), plateAt(534), plateAt(630), plateAt(786)].map((s) => [s.plates[0].shot, s.plates[0].frame]),
    [['WFOG-S01-SH02A', 0], ['WFOG-S02-SH00A', 0], ['WFOG-S02-SH01', 0], ['WFOG-S02-SH02', 0], ['WFOG-S02-SH03', 0]]);
  assert.equal(plateAt(629).plates[0].shot, 'WFOG-S02-SH01');
  assert.equal(plateAt(629).plates[0].frame, 95);
  assert.equal(plateAt(785).plates[0].shot, 'WFOG-S02-SH02');
  assert.equal(plateAt(785).plates[0].frame, 155);
});

/**
 * RK-2 (SS-R5.1): from the S02-SH03 start the story key is G − 342; holds and the S04-SH01 stretch are per shot; ambient
 * clocks run straight through the holds.
 */
test('RK-2 story key: G786 reads story frame 444; offset-only shots keep G − 342; holds and the stretch are per shot', () => {
  assert.equal(storyAt('S02-SH03', 0), 444);
  assert.equal(storyAt('S03-SH02', 143), 1799);
  assert.equal(storyAt('S03-SH03', 0), 1800);
  assert.equal(storyAt('S03-SH03', 119), 1919);
  assert.equal(storyAt('S03-SH03', 159), 1919, 'S03-SH03 holds 1919 f120-f159');
  assert.equal(storyAt('S03-SH04', 45), 1961, 'S03-SH04 holds 1961 f42-f45');
  assert.equal(storyAt('S03-SH05', 99), 2033, 'S03-SH05 holds 2033 f72-f99');
  assert.equal(storyAt('S03-SH06', 0), 2034);
  assert.equal(storyAt('S03-SH06A', 215), 2189, 'S03-SH06A holds 2189 f120-f215');
  assert.equal(storyAt('S03-SH07', 71), 2261);
  assert.equal(storyAt('S03-SH07', 127), 2261, 'S03-SH07 holds 2261 f72-f127');
  assert.equal(storyAt('S03-SH07', 128), 2262);
  assert.equal(storyAt('S03-SH07', 205), 2339);
  assert.equal(storyAt('S04-SH01', 137), 2477);
  assert.ok(Math.abs(storyAt('S04-SH01', 433) - (2478 + 295 * 192 / 296)) < 1e-9, 'talk span stretched over 2478-2670');
  assert.equal(storyAt('S04-SH02', 0), 2670);
  assert.equal(storyAt('S04-SH03', 305), 3095);
  assert.equal(storyAt('S02-SH00A', 0), 360);
  assert.equal(storyAt('S02-SH01', 78), 588, 'torch off the hook at S02-SH01 f78 = G612');
  assert.equal(storyAt('S01-SH02A', 0), 240);
  // Ambient clocks: continuous through every hold.
  assert.equal(ambientAt('S03-SH03', 159), 1959);
  assert.equal(ambientAt('S03-SH06A', 215), 2285);
  assert.equal(ambientAt('S04-SH01', 433), 2773);
});

test('SS-R5.1 fog level (B5-3, ST-05): FS0 before G360, the S02-SH00A front G390-G516 (PCHIP keys), FS2 from G516', () => {
  assert.equal(fogAt(156), 0);
  assert.equal(fogAt(239), 0);
  assert.equal(fogAt(359), 0);
  assert.equal(fogAt(390), 0);
  assert.equal(fogAt(516), 2);
  assert.equal(fogAt(600), 2);
  // The front: 14.0 m until G390, 1.8 m from G516 (the glass); PCHIP keys between (no overshoot).
  assert.equal(frontAt(360), 14);
  assert.equal(frontAt(390), 14);
  for (const [G, F] of [[420, 11.0], [434, 9.3], [446, 7.0], [454, 6.0], [490, 4.2], [510, 2.0], [516, 1.8], [533, 1.8]] as const) {
    assert.ok(Math.abs(frontAt(G) - F) < 1e-9, `front at G${G} is ${F}`);
  }
  for (let G = 390; G < 516; G++) assert.ok(frontAt(G + 1) <= frontAt(G) + 1e-12, `front does not rise at G${G + 1}`);
  assert.ok(Math.abs(pchip([[0, 0], [1, 1]], 0.5) - 0.5) < 1e-9, 'PCHIP is linear on two keys');
  for (const G of [400, 430, 460, 480]) assert.ok(Math.abs(fogAt(G) - 2 * (14 - frontAt(G)) / 12.2) < 1e-9, `G${G} level follows the front`);
});

test('WORLD-SITE fog wall (ST-05, MK-WF-DEP-12): zF(x) = 14 + B · smoothstep(2.5, 20, |x|), B 46 easing to 0 at f114', () => {
  assert.equal(siteB(0), 46);
  assert.ok(Math.abs(siteB(60) - 21.2) < 0.1, 'f60 B 21.2');
  assert.ok(Math.abs(siteB(80) - 9.8) < 0.1, 'f80 B 9.8');
  assert.equal(siteB(114), 0);
  assert.equal(siteFront(0, 0), 14);
  assert.equal(siteFront(0, 2), 14, 'the lane mouth is under the wall from f0');
  assert.ok(Math.abs(siteFront(0, 10) - 14 - 46 * 0.394) < 0.1, 'x 10 m at f0 is the road edge (about z 32)');
  assert.equal(siteFront(119, 40), 14, 'one straight wall at z 14 from f114');
});

/** A recording Painter: the wash calls of `paintOutside` in order (colour, opacity, polygon). */
const recorder = () => {
  const calls: {color: string; opacity: number; pts: Pt[]}[] = [];
  const p = {
    brush: null, t: 0, frame: 0, alpha: 1,
    wash: (color: string, opacity: number, pts: Pt[]) => { calls.push({color, opacity, pts}); },
    flat: () => {}, ink: () => {}, inkStill: () => {}, group: () => {},
    layer: () => p,
  } as unknown as Painter;
  return {p, calls};
};
const washed = (color: string, front?: number) => {
  const {p, calls} = recorder();
  paintOutside(p, PROJ['CAM-GLASS-SWALLOW'], 400, front === undefined ? {} : {front});
  return calls.some((c) => c.color === color);
};

test('depth gate (MK-WF-DEP-11): with no front every layer is painted; a front removes layers beyond it in depth order', () => {
  // Pump island (z 9.1) and the road (z 24) go first, then the car flank (z 4.2) and the kerb (z 2) last (front palette: CLEAR).
  assert.ok(washed('#77796f') && washed('#3a403f') && washed('#3f4746') && washed('#8c8f88'), 'no front: all layers');
  assert.ok(!washed(CLEAR.road, 14) && washed(CLEAR.road, 25), 'road (z 24) gone at F 14, back at F 25');
  assert.ok(!washed(CLEAR.lane, 14) && washed(CLEAR.lane, 15), 'lane (z 14) is gone at 14 and back at 15');
  assert.ok(!washed(CLEAR.island, 9) && washed(CLEAR.island, 10), 'pump islands (z 9.1) gone at F 9, present at F 10');
  assert.ok(!washed('#3f4746', 4) && washed('#3f4746', 5), 'car flank (z 4.2) gone at F 4, present at F 5');
  assert.ok(washed(CLEAR.kerb, 2.5) && !washed(CLEAR.kerb, 2), 'kerb (z 2) gone at F 2');
});

test('r9b: a layer the front reaches fades over FRONT_FADE_M (no pop); without front the window opacities are unchanged', () => {
  const opacityOf = (color: string, G: number, front?: number) => {
    const {p, calls} = recorder();
    paintOutside(p, PROJ['CAM-GLASS-SWALLOW'], G, front === undefined ? {} : {front});
    return calls.filter((c) => c.color === color).map((c) => c.opacity);
  };
  // Pump tops at z 9.3 with the front 0.4 m short of the next fade step: half of their clear-palette opacity (240).
  const half = opacityOf(CLEAR.pump, 239, 9.3 + FRONT_FADE_M / 2);
  assert.ok(half.length > 0 && Math.abs(half[0] - 240 / 2) < 1e-9, `half-faded pump top (${half[0]})`);
  // Without front the pump tops keep the SS-R4.1 opacity 220 at FS0.
  const window = opacityOf('#d9d6c8', 239);
  assert.ok(window.length === 4 && window.every((o) => o === 220), `window pump tops keep opacity 220 (${window})`);
  // The car flank cover (S02-SH00A): taken from the far face at F 6.0 to the flank at F 4.2, the headlamp last.
  assert.equal(carCoverAt(6), 0);
  assert.equal(carCoverAt(4.2), 1);
  assert.ok(Math.abs(carCoverAt(5.1) - 0.5) < 1e-9);
  assert.equal(headlampAt(4.2), 1);
  assert.ok(Math.abs(headlampAt(3.6) - 0.5) < 1e-9);
  assert.equal(headlampAt(3.0), 0);
});

test('the far wall (F ≥ 60) is painted at z 60 with the road and forecourt in front of it (S01-SH02 clear FS0)', () => {
  const {p, calls} = recorder();
  paintOutside(p, PROJ['CAM-FORECOURT'], 239, {noCarGhost: true, front: 60});
  const wall = calls.find((c) => c.color === CLEAR.wallFar);
  assert.ok(wall, 'pale wall painted');
  const ys = wall!.pts.map((q) => q[1]);
  assert.ok(Math.min(...ys) > 430 && Math.max(...ys) < 820, 'wall between about y 454 and 794 at the back of frame');
  assert.ok(calls.some((c) => c.color === CLEAR.road), 'road kept in front of the wall');
});

test('hard-cut ending (MK-WF-DEP-07): C_seamless with loopBlendFrames 0 has no hold, fade or blend', () => {
  assert.equal(video.ending, 'C_seamless');
  assert.equal(video.loopBlendFrames, 0);
  for (const G of [3460, 3610, 3720, 3750, 3765]) {
    const s = plateAt(G);
    assert.equal(s.opacity, 1);
    assert.equal(s.plates.length, 1, `G${G} paints one plate (no frame-0 blend)`);
    assert.equal(s.plates[0].shot, 'WFOG-S04-SH03');
    assert.equal(s.plates[0].frame, G - 3460, `G${G} is not held`);
  }
  assert.equal(plateAt(3765).plates[0].frame, 305); // last painted frame G3765 (shot-local f305)
});

test('SS-R5.1 captions and sound on the fog beat: VO-03a on the swallow (G386), VO-03b on the phone (G648), the phone ding at G636 (S02-SH02 f6)', () => {
  const s02 = worldFog.videos[0].timeline[1];
  const at = (text: string) => Math.round(((s02.subtitleCues ?? []).find((c) => c.text === text)?.atSec ?? -1) * 30) + 360;
  assert.equal(at('แต่พอเข้าร้าน'), 386);
  assert.equal(at('หมอกก็กลืนลานจอดจนหมด'), 439);
  assert.equal(at('ข่าวในมือถือ…'), 648);
  assert.equal(at('ก็มีแต่ภาพเดียวกัน'), 708);
  assert.ok((s02.subtitleCues ?? []).some((c) => c.text === '' && Math.round(c.atSec * 30) + 360 === 502), 'VO-03a closes at G502');
  assert.ok(s02.sfx?.some((c) => Math.abs(c.atSec * 30 + 360 - 636) < 0.5 && c.src.includes('ui_notification-ding')), 'ding at G636');
  // Cues after the fog beat move with their shot: the S02-SH03 line `ใครอยู่ตรงนั้น?` (SS-R5.1 cue G810).
  assert.equal(at('ใครอยู่ตรงนั้น?'), 810);
});

test('S04-SH03 lamps on the story key 2790 + f (SS-R5.1): far pair out by G2910 (f120), near-left out by G3010 (f220), near-right 0.35 held to G3050 (f260), out by G3068 (f278)', () => {
  for (const i of [0, 1, 2, 3]) assert.equal(lampAt(2801, i), 1, `lamp ${i} lit before the shot's dimming`);
  for (const i of [2, 3]) assert.equal(lampAt(2910, i), 0, `far lamp ${i} out by G2910`);
  assert.equal(lampAt(3010, 0), 0, 'near-left out by G3010');
  assert.ok(Math.abs(lampAt(3010, 1) - 0.35) < 1e-9, 'near-right at 0.35 at G3010');
  assert.ok(Math.abs(lampAt(3050, 1) - 0.35) < 1e-9, 'near-right still 0.35 at G3050 (held)');
  assert.ok(lampAt(3059, 1) > 0 && lampAt(3059, 1) < 0.35, 'near-right fading G3050-G3068');
  for (const i of [0, 1, 2, 3]) assert.equal(lampAt(3068, i), 0, `lamp ${i} out by G3068`);
});

test('FOG-STATE reaches FS3 at G3068 (S04-SH03 f278, SS-R5.1); torch off G2680; door leaf G2262-G2292 open and G2352-G2376 shut (RT-2, RT-3)', () => {
  assert.equal(fogAt(2526), 2);
  assert.equal(fogAt(2801), 2);
  assert.equal(fogAt(3068), 3);
  assert.equal(fogAt(156), 0); // car parked before the fog bank (PD02 order)
  assert.equal(torchOnAt(2679), 1);
  assert.equal(torchOnAt(2680), 0);
  assert.equal(doorAt(2261), 0);
  assert.equal(doorAt(2292), 1);
  assert.equal(doorAt(2351), 1);
  assert.equal(doorAt(2376), 0);
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
  // SS-R4 RT-1/RT-2: the stack holds at (-0.10, 0.74) through S03-SH06A and the S03-SH07 glance, then pushes in G2286-G2339.
  assert.ok(Math.abs(asmAt(2286).zs - 0.74) < 1e-9);
  assert.equal(asmAt(2200).zs, asmAt(2280).zs);
  assert.ok(Math.abs(asmAt(2339).zs + 0.45) < 1e-9);
  assert.ok(!asmAt(2280).moving && asmAt(2300).moving && !asmAt(2339).moving);
  // Lurch: hold frames do not move.
  assert.deepEqual(asmAt(565), asmAt(565));
  assert.equal(asmAt(562).zs, asmAt(565).zs);
});

test('S03-SH06A held look (SS-R4 RT-1): LIT-LOWER at S (-0.10, 0.74), fog lens A 0 and the lit window camera; breath, bow, blink, gaze', () => {
  const f = (k: number) => 2070 + k;
  const cam = (k: number) => cameraAt('WFOG-S03-SH06A', k / fps);
  assert.deepEqual(cam(0), {s: 1.24, fx: 560, fy: 650, dx: 0, dy: 0});
  assert.ok(Math.abs(cam(215).s - 1.28) < 1e-9, 'push over the 216 f hold ends at s 1.28');
  const pose = asmPoseAt(f(30));
  assert.equal(pose.warp, 0, 'PD12: no fog-lens amount in the held look');
  assert.equal(pose.light, 1);
  assert.deepEqual([pose.S.xs, pose.S.zs], [-0.1, 0.74]);
  // Hand, umbrella and helmet anchors: the LIT-LOWER values of the sheet (no movement of hand, umbrella or helmet).
  const near = (a: V3, b: V3) => a.every((v, i) => Math.abs(v - b[i]) < 1e-9);
  assert.ok(near(pose.rHand, [0.15, 1.05, 0.97]) && near(pose.lHand, [0.45, 0.95, 1.02]) && near(pose.umbrella.tip, [0.5, 0.02, 0.94]));
  for (const k of [0, 30, 66, 100, 119]) assert.ok(near(asmPoseAt(f(k)).rHand, pose.rHand) && near(asmPoseAt(f(k)).helmet.c, asmPoseAt(f(0)).helmet.c));
  // Fog lens off: the drawn parts are the honest geometry (no warp).
  assert.deepEqual(assemblyParts(GLASS, pose), assemblyRaw(GLASS, pose));
  // Breath: shoulders rise 0.012 m per 20-frame period above the dip.
  assert.equal(asmPoseAt(f(0)).dip, -0.015);
  assert.ok(Math.abs(asmPoseAt(f(10)).dip - (-0.003)) < 1e-9);
  // No head bow in the held look (SS-R4.1 R8-5); blink f84-f88 (peak f86), pupils down from f48.
  for (const k of [0, 40, 66, 119]) assert.equal(asmPoseAt(f(k)).bow, 0, `f${k} bow`);
  assert.equal(asmPoseAt(f(80)).blink ?? 0, 0);
  assert.ok(Math.abs((asmPoseAt(f(86)).blink ?? 0) - 1) < 1e-9);
  assert.ok((asmPoseAt(f(60)).gazeDown ?? 0) > 0.99 && (asmPoseAt(f(47)).gazeDown ?? 0) === 0);
  // Outside the shot the held-look fields are zero and the breath dip is the old constant.
  assert.equal(asmPoseAt(2069).dip, -0.015);
  assert.equal(asmPoseAt(2069).bow ?? 0, 0);
  assert.equal(asmPoseAt(2190).blink ?? 0, 0);
});

test('S03-SH06A has no head bow (SS-R4.1 R8-5); the tilt helper, given a bow, moves only the hood and face', () => {
  const pose = asmPoseAt(2136);
  assert.equal(pose.bow, 0, 'R8-5: no bow in the held look');
  const flat = assemblyRaw(GLASS, pose);
  const bowed = assemblyRaw(GLASS, {...pose, bow: 5 * DEG});
  assert.equal(flat.length, bowed.length);
  const pts = (parts: typeof flat, lit: string) => parts.filter((p) => p.lit === lit).flatMap((p) => p.pts);
  for (const lit of [LIT.helmet, LIT.kraft, LIT.cart]) assert.deepEqual(pts(bowed, lit), pts(flat, lit), `${lit} unmoved`);
  // The face (skin) moves: the tilt is about the neck, so the centre of the face drops and moves toward the lens.
  const meanY = (ps: Pt[]) => ps.reduce((s, q) => s + q[1], 0) / ps.length;
  const dy = meanY(pts(bowed, LIT.skin)) - meanY(pts(flat, LIT.skin));
  assert.ok(dy > 0 && dy < 3, `face centre moved ${dy.toFixed(2)} px at s 1.0 (front-view foreshortening)`);
});

test('S03-SH06A hood and face hold the f30 positions at G2136 and G2189 apart from the breath (SS-R4.1 R8-5)', () => {
  const h30 = asmPoseAt(2100);
  for (const G of [2136, 2189]) {
    // Same breath (shoulder dip), gaze and blink as f30: any remaining difference would be a head tilt.
    const pk = {...asmPoseAt(G), dip: h30.dip, gazeDown: h30.gazeDown, blink: h30.blink};
    const a = assemblyRaw(GLASS, h30), b = assemblyRaw(GLASS, pk);
    for (const lit of [LIT.coat, LIT.skin]) {
      const pa = a.filter((p) => p.lit === lit).flatMap((p) => p.pts), pb = b.filter((p) => p.lit === lit).flatMap((p) => p.pts);
      assert.equal(pa.length, pb.length, `${lit} point count G${G}`);
      const maxD = Math.max(...pa.map((q, i) => Math.hypot(q[0] - pb[i][0], q[1] - pb[i][1])));
      assert.ok(maxD <= 1, `${lit} at G${G}: max move ${maxD.toFixed(3)} px`);
    }
  }
});

test('S03-SH07 torch (SS-R4.1 R8-1): hand, lens 0.16 m along the aim, pool on the floor before the threshold; sheet projection', () => {
  const {hand, lens, target} = SH07_TORCH;
  const dist = (p: V3, q: V3) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
  assert.ok(Math.abs(dist(hand, lens) - 0.16) < 0.001, `lens ${dist(hand, lens).toFixed(4)} m from the hand`);
  // The pool lies on the aim line: target - hand is parallel to lens - hand.
  const aim = lens.map((v, i) => v - hand[i]), toT = target.map((v, i) => v - hand[i]), k = toT[0] / aim[0];
  assert.ok(aim.every((v, i) => Math.abs(v * k - toT[i]) < 0.01), 'pool on the aim line');
  // Pool on the floor, just inside the threshold (x 0.20, z -0.10 is behind the leaf line -0.05), off the faces.
  assert.equal(target[1], 0);
  assert.ok(target[0] >= 0 && target[0] <= 0.4 && target[2] <= -0.05 && target[2] >= -0.2, `pool ${target}`);
  // Projection at s 1.00 (shot f0, story G2190) and s 1.05 (shot f205, story G2339): hand, lens and pool (sheet values, +-2 px).
  const at = (f: number, p: V3) => toScreen(cameraAt('WFOG-S03-SH07', f / fps), PROJ['CAM-INT-SIDE'].P(p));
  const near = (got: Pt, want: Pt) => Math.abs(got[0] - want[0]) <= 2 && Math.abs(got[1] - want[1]) <= 2;
  assert.ok(near(at(0, hand), [540, 1107]) && near(at(0, lens), [584, 1164]) && near(at(0, target), [790, 1425]), 'G2190 torch');
  assert.ok(near(at(205, hand), [540, 1127]) && near(at(205, lens), [586, 1187]) && near(at(205, target), [802, 1461]), 'G2339 torch');
});

test('S03-SH07 narrator glance is eyes only (SS-R4.1 R8-9): head profile toward the door at every frame; pupils back f6-f78, eyes return f78-f84', () => {
  const g = sh07NarratorGlance;
  for (let f = 0; f <= 149; f++) assert.equal(g(f).head, 'right', `f${f} head stays in profile`);
  for (const f of [0, 5, 84, 100, 149]) assert.equal(g(f).look[0], 1, `f${f} pupils forward`);
  for (const f of [6, 40, 77, 78]) assert.equal(g(f).look[0], -1, `f${f} pupils back toward screen-left`);
  assert.ok(g(81).look[0] > -1 && g(81).look[0] < 1, 'f81 eyes returning');
  for (let f = 78; f < 84; f++) assert.ok(g(f + 1).look[0] >= g(f).look[0], `return monotone f${f}`);
  for (const f of [6, 40, 77]) assert.equal(g(f).brow, 'up', `f${f} brow up`);
  for (const f of [0, 5, 84, 149]) assert.equal(g(f).brow, 'worry', `f${f} brow worry`);
  assert.equal(g(78).browMix, 0, 'f78 brow still up (blend starts at 0)');
  assert.equal(g(84).browTo, undefined, 'f84 no brow blend: SS-R4 face');
});

test('S03-SH06A sheet numbers (SS-R4 RT-1): worker 674 +-15 px and face (615, 705) +-15 at G2100; beam centre (595, 861) +-20 at G2136', () => {
  const cam = cameraAt('WFOG-S03-SH06A', 30 / fps);
  const pose = asmPoseAt(2100);
  const parts = assemblyRaw(GLASS, pose);
  const pts = (lit: string) => parts.filter((p) => p.lit === lit).flatMap((p) => p.pts);
  const skin = pts(LIT.skin);
  const faceAt = toScreen(cam, [skin.reduce((s, q) => s + q[0], 0) / skin.length, skin.reduce((s, q) => s + q[1], 0) / skin.length]);
  // Worker height on screen: feet (ground at the worker's plate point) to the top of the hood, both at camera scale s.
  const feet = toScreen(cam, GLASS.P([pose.S.xs + 0.3, 0, pose.S.zs + 0.45]));
  const hoodTop = toScreen(cam, [0, Math.min(...pts(LIT.coat).map((q) => q[1]))]);
  const height = feet[1] - hoodTop[1];
  assert.ok(Math.abs(height - 674) <= 15, `worker ${height.toFixed(1)} px`);
  assert.ok(Math.abs(faceAt[0] - 615) <= 15 && Math.abs(faceAt[1] - 705) <= 15, `face ${faceAt.map((v) => v.toFixed(1))}`);
  const beam = toScreen(cameraAt('WFOG-S03-SH06A', 66 / fps), beamSH06A(2136));
  assert.ok(Math.abs(beam[0] - 595) <= 20 && Math.abs(beam[1] - 861) <= 20, `beam centre ${beam.map((v) => v.toFixed(1))}`);
  // SS-R4.1 R8-2: the hold is BEAM_END (583, 689) from f0 to f30, the S03-SH03 exit value.
  assert.deepEqual(beamSH06A(2070), [583, 689]);
  assert.deepEqual(beamSH06A(2100), [583, 689]);
  const end = beamSH06A(2136);
  assert.ok(Math.abs(end[0] - 588) < 1e-9 && Math.abs(end[1] - 820) < 1e-9, `f66 end ${end}`);
});

test('SS-R5.1 picture pushes: S03-SH07 s 1.00-1.05 over 206 frames, S04-SH01 s 1.00-1.04 over 434, S04-SH03 s 1.00-1.06 over 306', () => {
  assert.ok(Math.abs(cameraAt('WFOG-S03-SH07', 0).s - 1) < 1e-9 && Math.abs(cameraAt('WFOG-S03-SH07', 205 / fps).s - 1.05) < 1e-9);
  assert.ok(Math.abs(cameraAt('WFOG-S04-SH01', 433 / fps).s - 1.04) < 1e-9);
  assert.ok(Math.abs(cameraAt('WFOG-S04-SH03', 305 / fps).s - 1.06) < 1e-9);
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
  // Right shoulder: the rig anchor (SS-R3.4; r3 used (-0.77, 1.40, -1.3)).
  const mouth: V3 = [-0.95, 1.39, -1.3], shoulder: V3 = [-0.814, 1.18, -1.3];
  const dist = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  assert.ok(SH02_TORCH_HAND[1] < 1.275, `hand height ${SH02_TORCH_HAND[1]} above the chin line`);
  assert.ok(dist(SH02_TORCH_HAND, mouth) >= 0.25, `hand ${dist(SH02_TORCH_HAND, mouth).toFixed(3)} m from the mouth`);
  const reach = dist(SH02_TORCH_HAND, shoulder);
  assert.ok(reach >= 0.40 && reach <= 0.52, `arm length ${reach.toFixed(3)} m`);
});

/** A painter that accepts every call and records each brush fill colour in order (SS-R3.4 draw-order checks). */
const fillOrder = () => {
  const seen: string[] = [];
  const brush: unknown = new Proxy(() => undefined, {get: (_t, k) => (k === 'fill' ? (c: string) => seen.push(c) : brush), apply: () => undefined});
  const p: unknown = new Proxy(() => undefined, {get: (_t, k) => (k === 'brush' ? brush : k === 'alpha' ? 1 : p), apply: () => undefined});
  return {p: p as Painter, seen};
};
const plainFace = () => ({brow: 'flat' as const, eyes: 'dot' as const, look: [0, 0] as [number, number], mouth: 'flat' as const});

test('SS-R3.4 behind (front view): an upper arm behind the torso is painted before the shirt, behind all before it too, no behind after it', () => {
  const n = CAST.narrator;
  const far = mixColor(n.outfit.sleeve, '#000000', 0.15), skin = n.head.skin;
  const hand = {to: [470, 1150] as Pt, via: [440, 1290] as Pt};
  const order = (rArm: Arm) => {
    const {p, seen} = fillOrder();
    drawFigure(p, 'narrator', [540, 1500], 800, {view: 'front', face: plainFace(), rArm}, 0);
    return seen;
  };
  const upper = order({...hand, behind: 'upper'}), whole = order({...hand, behind: 'all'}), front = order(hand);
  assert.ok(upper.indexOf(far) >= 0 && upper.indexOf(far) < upper.indexOf(n.outfit.shirt), "'upper': the far-tint upper arm comes before the shirt");
  assert.ok(whole.indexOf(skin) >= 0 && whole.indexOf(skin) < whole.indexOf(n.outfit.shirt), "'all': the hand comes before the shirt");
  assert.equal(front.indexOf(far), -1, 'no behind: no far-tint sleeve');
  assert.ok(front.indexOf(skin) > front.indexOf(n.outfit.shirt), 'no behind: the hand comes after the torso');
});

test('shoulderHeight (SS-R3.4) is the front-view shoulder anchor drawFigure paints, at any crouch', () => {
  const {p} = fillOrder();
  for (const who of ['narrator', 'occupant'] as const) {
    for (const crouch of [0, 0.3, 1]) {
      const a = drawFigure(p, who, [540, 1500], 800, {view: 'front', crouch, face: plainFace()}, 0);
      assert.ok(Math.abs((1500 - a.rShoulder[1]) / 800 - shoulderHeight(who, crouch)) < 1e-9, `${who} crouch ${crouch}`);
    }
  }
});

test('S03-SH02 arms (SS-R3.5): elbows keep their offset through the rise, both upper arms stay behind f0-f143 (no switch), sheet points G1680 and G1764 within 15 px', () => {
  const proj = PROJ['CAM-INT-REV'];
  const near = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]) <= 15;
  // The rig's right shoulder at the narrator's ground point (-0.95, -1.3) against the sheet reference (-0.814, 1.18, -1.30).
  const {p} = fillOrder();
  const shoulder = drawFigure(p, 'narrator', proj.P([-0.95, 0, -1.3]), proj.k([-0.95, 0, -1.3]), {view: 'front', face: plainFace()}, 0).rShoulder;
  assert.ok(near(shoulder, proj.P([-0.814, 1.18, -1.3])), `rig shoulder ${shoulder}`);
  // Upright, the elbow is 0.25 m below the shoulder anchor; during the rise (f0-f12) it moves with the crouched anchor.
  const offset = 0.93 - shoulderHeight('narrator', 0);
  for (const f of [0, 6, 12]) {
    const a = sh02Arms(proj, f);
    assert.ok(Math.abs(a.elbowR[1] - shoulderHeight('narrator', a.crouch) - offset) < 1e-9, `f${f} elbow offset`);
  }
  assert.equal(sh02Arms(proj, 24).elbowR[1], 0.93);
  // SS-R3.5: both upper arms stay behind the torso for the whole shot; the r5 layer switch at f68 is gone (CP-P06).
  for (let f = 0; f <= 143; f++) {
    assert.equal(sh02Arms(proj, f).r.behind, 'upper', `f${f} right upper arm`);
    assert.equal(sh02Arms(proj, f).l.behind, 'upper', `f${f} left upper arm`);
  }
  // Sheet rows: G1680 (f24) elbow (436, 1256), hand (366, 1283); G1764 (f108) elbow (403, 1301), hand (350, 1180), left elbow (784, 1256), left hand (723, 1187).
  const at24 = sh02Arms(proj, 24), at108 = sh02Arms(proj, 108);
  assert.ok(near(at24.r.via!, [436, 1256]) && near(at24.r.to, [366, 1283]), `G1680 right arm ${at24.r.via} ${at24.r.to}`);
  assert.ok(near(at108.r.via!, [403, 1301]) && near(at108.r.to, [350, 1180]), `G1764 right arm ${at108.r.via} ${at108.r.to}`);
  assert.ok(near(at108.l.via!, [784, 1256]) && near(at108.l.to, [723, 1187]), `G1764 left arm ${at108.l.via} ${at108.l.to}`);
  for (let f = 0; f <= 143; f++) assert.ok(sh02Arms(proj, f).r.via![0] >= 380, `f${f} right elbow x ${sh02Arms(proj, f).r.via![0]}`);
});

test('S02-SH03 shop worker arms (SS-R3.5 AB1): elbows at the torso edge and hands on the counter at the G474 plate points, upper arms behind', () => {
  const a = counterWorkerArms(PROJ['CAM-COUNTER-OUT']);
  const dist = (p: Pt, q: Pt) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  assert.equal(a.rArm.behind, 'upper');
  assert.equal(a.lArm.behind, 'upper');
  // Sheet row G474 (f30, constant arms): elbows (428, 830) and (652, 830) +-10; hands (444, 905) and (636, 905) +-15.
  assert.ok(dist(a.rArm.via!, [428, 830]) <= 10 && dist(a.lArm.via!, [652, 830]) <= 10, `G474 elbows ${a.rArm.via} ${a.lArm.via}`);
  assert.ok(dist(a.rArm.to, [444, 905]) <= 15 && dist(a.lArm.to, [636, 905]) <= 15, `G474 hands ${a.rArm.to} ${a.lArm.to}`);
});

test('S02-SH06 occupant clutch (SS-R3.5 AB1): upper arms behind f30-f107, elbows at her sides; G850 left elbow and hand within 10/15 px', () => {
  const proj = PROJ['CAM-INT-REV'];
  const dist = (p: Pt, q: Pt) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  assert.deepEqual(clutch(proj, 29), {}, 'no arms before f30');
  for (let f = 30; f <= 107; f++) {
    assert.equal(clutch(proj, f).rArm?.behind, 'upper', `f${f} right upper arm`);
    assert.equal(clutch(proj, f).lArm?.behind, 'upper', `f${f} left upper arm`);
  }
  // Sheet row G850 (f58, the ease is complete): left elbow (922, 1077), left hand (889, 934); right elbow (685, 1077).
  const at58 = clutch(proj, 58);
  assert.ok(dist(at58.lArm!.via!, [922, 1077]) <= 10, `G850 left elbow ${at58.lArm!.via}`);
  assert.ok(dist(at58.lArm!.to, [889, 934]) <= 15, `G850 left hand ${at58.lArm!.to}`);
  assert.ok(dist(at58.rArm!.via!, [685, 1077]) <= 10, `G850 right elbow ${at58.rArm!.via}`);
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
