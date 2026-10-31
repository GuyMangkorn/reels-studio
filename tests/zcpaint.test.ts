import {test} from 'node:test';
import assert from 'node:assert/strict';
import {poundJoltFrames, poundJoltPlateFrames, joltAt, B02_TIMING} from '../src/painted/zcpaint/jolts';
import {shadeGate} from '../src/painted/kit/screen';
import {paintedStateAt} from '../src/scenes/painted';
import {timelineFrames} from '../src/scenes/timeline';
import type {Timeline} from '../src/scenes/types';
import {flare, layers, layerPoint, silhouetteParts, slump} from '../src/painted/zcpaint/balcony';
import {b08Bloom} from '../src/painted/zcpaint/overlays';
import {GLOW_PEAK} from '../src/painted/kit/glow';
import type {Pt} from '../src/painted/kit/painter';

test('B02 pound jolts: slam first, seeded spacing 0.30-0.55 s, inside B02-SH01..SH03 (TH to the B03 fade), same list for plates and Editor', () => {
  for (const lang of ['TH', 'EN'] as const) {
    const t = B02_TIMING[lang];
    const f = poundJoltFrames(lang);
    assert.equal(f[0], t.sh01[0] + 2);
    assert.equal(f[1], t.sh01[0] + t.firstRegular);
    for (let i = 2; i < f.length; i++) assert.ok(f[i] - f[i - 1] >= 9 && f[i] - f[i - 1] <= 17, `${lang} spacing at ${i}`);
    // SS-R1.6/SS-R1.7 retime (Boss): TH blows run through B02-SH03 to the end of the B03 fade (blowsTo 551, list 218-535); EN stays at 318.
    assert.equal(t.blowsTo, lang === 'TH' ? 551 : 318, `${lang} blowsTo`);
    assert.ok(f.every((x) => x >= t.sh01[0] && x < t.blowsTo));
    // Plate lists are the same frames in each shot's plate clock; plates read the SH01/SH02 jolts only (SH03 blows are Editor-only).
    const plate = [...poundJoltPlateFrames(lang, 'SH01').map((x) => x + t.sh01[0]), ...poundJoltPlateFrames(lang, 'SH02').map((x) => x - t.sh02FromFrames + t.sh02[0])];
    assert.deepEqual(plate, f.filter((x) => x < t.sh02[1]));
  }
  assert.deepEqual(poundJoltFrames('TH'), poundJoltFrames('TH'));
  const frames = poundJoltPlateFrames('TH', 'SH01');
  assert.equal(joltAt(frames, 1), null);
  assert.equal(joltAt(frames, 2)?.age, 0);
  assert.equal(joltAt(frames, 40)?.kick !== undefined, true);
});

test('ZC-CAPSHADE is cue-gated: nothing without cues, on from the first cue to 6 frames after the last, seek-safe', () => {
  const cues = [[1, 2], [3, 4]] as const;
  assert.equal(shadeGate(0.5, [], 30), 0);
  assert.equal(shadeGate(0, cues, 30), 0);
  assert.equal(shadeGate(1, cues, 30), 1);
  assert.equal(shadeGate(2.5, cues, 30), 1); // between cues the shade holds
  assert.equal(shadeGate(4 + 6 / 30, cues, 30), 1);
  assert.equal(shadeGate(4 + 6 / 30 + 4 / 30, cues, 30), 0);
  assert.equal(shadeGate(10, cues, 30), 0);
  assert.equal(shadeGate(3.9, cues, 30), shadeGate(3.9, cues, 30));
});

import {track, trackHand, trackPt} from '../src/painted/zcpaint/pose';
import {section, SEC_2D} from '../src/painted/zcpaint/space';

test('pose tracks ease between keys, hold the last value and are pure in the plate frame', () => {
  const keys = [[0, 0], [10, 1], [20, 3, 'linear']] as const;
  assert.equal(track(keys, -5), 0);
  assert.equal(track(keys, 10), 1);
  assert.equal(track(keys, 15), 2);
  assert.equal(track(keys, 99), 3);
  assert.ok(Math.abs(track(keys, 5) - 0.5) < 1e-9); // smoothstep midpoint
  assert.deepEqual(trackPt([[0, [0, 0]], [10, [10, 20], 'linear']], 5), [5, 10]);
  const h = trackHand([[0, {side: 1, base: 0, wrist: [0, 0], dir: 0, curl: 0}, 'linear'], [10, {side: 1, base: 0, wrist: [10, 0], dir: 0, curl: 1}, 'linear']], 5);
  assert.equal(h.curl, 0.5);
  assert.deepEqual(h.wrist, [5, 0]);
});

test('SEC-2D projection reproduces the B03 sheet values (Yc 1.295)', () => {
  const {P, pxPerM} = section(SEC_2D, 1.295);
  const near = (a: number, b: number) => Math.abs(a - b) < 1;
  assert.ok(near(P(0, 0, 0)[0], 48) && near(P(0.18, 0, 0)[0], 116));
  const cab = P(0.58, 1.2, 0.35);
  assert.ok(near(cab[0], 283) && near(cab[1], 779));
  const head = P(0.8, 1.7, 0.75);
  assert.ok(near(head[0], 373) && near(head[1], 615));
  assert.ok(Math.abs(pxPerM(0.75) * 1.7 - 574) < 1);
});

import {persp, truckYc} from '../src/painted/zcpaint/space';
import {paintedShotIds} from '../src/painted/registry';

test('B10 perspective matches the staging values and the section truck eases at both ends', () => {
  const P = persp(1844, 1.58, {Y: 3.25, d: 0.52}, [540, 525]);
  const door = [P(0.18, 2.1, 0.3), P(0.18, 2.1, 1.2), P(0.18, 0, 0.3)];
  assert.ok(Math.abs(door[0][0] - 408) < 1 && Math.abs(door[1][0] - 948) < 1, 'door x 408-948');
  assert.ok(Math.abs(door[0][1] - 213) < 1, 'door top y 213');
  assert.equal(truckYc(0, 1.3, 2.7, 85), 1.3);
  assert.ok(Math.abs(truckYc(85, 1.3, 2.7, 85) - 2.7) < 1e-9);
  const step = truckYc(40, 1.3, 2.7, 85) - truckYc(39, 1.3, 2.7, 85);
  assert.ok(Math.abs(step - (1.4 / 75)) < 1e-9, 'constant middle speed');
  assert.ok(truckYc(3, 1.3, 2.7, 85) - 1.3 < step, 'eased start');
});

test('ZCPAINT plates are registered by ID; B03 is the first-person POV plate, not a section plate', () => {
  const ids = ['ZCP-B02-SH01-TH', 'ZCP-B02-SH01-EN', 'ZCP-B02-SH02-TH', 'ZCP-B02-SH02-EN', 'ZCP-B03-SH01-TH', 'ZCP-B03-SH01-EN',
    'ZCP-B04-SH01', 'ZCP-B04-SH02-TH', 'ZCP-B04-SH02-EN', 'ZCP-B06-SH01', 'ZCP-B07-SH02', 'ZCP-B08-SH01', 'ZCP-B09-SH01-TH',
    'ZCP-B09-SH01-EN', 'ZCP-B09-SH02B', 'ZCP-B09-SH03', 'ZCP-B10-SH01'];
  for (const id of ids) assert.ok(paintedShotIds.includes(id), id);
  assert.ok(!paintedShotIds.includes('ZCP-B03-SH01'), 'per-language IDs only');
});

import {B03_KEYS, WHIP_FRAMES, b03Offset, b03Lights, boltAngle, sh01Edge, sh02Slide, sh02Bob, poundState} from '../src/painted/zcpaint/povshots';
import {CAM_B09_SH02B} from '../src/painted/shots/zcpaint';

test('B03 whip: 7 frames, View A to View B, then the lamps go out near -> far, neighbour last (per language)', () => {
  for (const lang of ['TH', 'EN'] as const) {
    const k = B03_KEYS[lang];
    assert.equal(b03Offset(k.whip - 1, lang), 0);
    assert.equal(b03Offset(k.whip + WHIP_FRAMES, lang), 1080);
    assert.ok(k.key1 < k.whip, `${lang} key 1 before the whip`);
    assert.ok(k.lamps.bath <= k.lamps.kitchen && k.lamps.kitchen <= k.lamps.living, `${lang} near -> far`);
    assert.ok(k.neighbour >= k.lamps.living, `${lang} neighbour after the living lamp`);
    assert.equal(b03Lights(k.lamps.bath + 2, lang).bath, 0, `${lang} bath lamp fully out two frames after its key (value lerp)`);
    assert.equal(b03Lights(k.lamps.bath, lang).bath, 1, `${lang} bath lamp still lit on its key frame`);
    assert.equal(b03Lights(0, lang).corridor, 1, `${lang} corridor lit at the start`);
  }
  assert.equal(B03_KEYS.TH.whip, 11);
  assert.equal(B03_KEYS.EN.whip, 20);
});

test('B02 keys: latch shut at f 2, bolt turns 90 degrees per language, drag from the right, shove to flush at f 54', () => {
  assert.equal(sh01Edge(0), 900);
  assert.equal(sh01Edge(2), 950);
  assert.equal(boltAngle('TH', 3), 0);
  // SS-R1.7 (Boss retime, SS-R1.6 keys): TH bolt re-keyed to plate frames 22-26 (word "ล็อก!" at f 26); f 7 is before the turn.
  assert.equal(boltAngle('TH', 7), 0);
  assert.equal(boltAngle('TH', 22), 0);
  assert.equal(boltAngle('TH', 26), 90);
  assert.equal(boltAngle('EN', 16), 0);
  assert.equal(boltAngle('EN', 21), 90);
  // R2.5 (pass 8): no drag; the last 24 px of the shove over pf 0-6, then a ±3 px wobble that decays by pf 20.
  assert.equal(sh02Slide(0), 24);
  assert.equal(sh02Slide(6), 0);
  assert.equal(sh02Bob(6), 0);
  assert.ok(Math.abs(sh02Bob(9)) <= 3 && Math.abs(sh02Bob(19)) < Math.abs(sh02Bob(9)) + 1e-9, 'the wobble is within 3 px and decays');
  assert.ok(poundState('TH', 'SH01', 2).press > 0, 'the slam squeezes the palm');
});

test('B09-SH02B tilt: the view starts 1100 px low on the knees and is level from 18 frames on', () => {
  assert.equal(CAM_B09_SH02B(0).dy, -1100);
  assert.ok(Math.abs(CAM_B09_SH02B(0.6).dy) < 1e-9);
  assert.ok(CAM_B09_SH02B(0.3).dy > -1100 && CAM_B09_SH02B(0.3).dy < 0, 'eased in between');
});

// B08-SH01 production plate (`ZCP-B08-SH01`, Boss pass 6): clock, timing, silhouette and glow from the plate's own functions.
const b08Cue = (fromSec: number, durationSec: number): Timeline => [
  {durationSec, bg: 'none', actors: [], subtitle: '', painted: {shots: [{shot: 'ZCP-B08-SH01', atSec: 0, fromSec}]}},
  {durationSec: 1, bg: 'none', actors: [], subtitle: ''},
];
const b08Frame = (timeline: Timeline, frame: number) => paintedStateAt(timeline, frame, 30, {ending: 'B_loop', durationInFrames: timelineFrames(timeline, 30), loopBlendFrames: 0})!.plates[0];
/** Even-odd ray casting: is the point inside the polygon. */
const inside = ([x, y]: Pt, poly: Pt[]) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
/** The dark mass (head, ears, body) on the frame, after the rail layer's transform. */
const massAt = (pf: number) => silhouetteParts(pf).map((poly) => poly.map((p) => layerPoint(layers(pf).fore, p)));

test('B08 shared plate: TH f 81 and EN f 57 both land on plate frame 96 through fromSec 0.5 / 1.3; the visible spans are TH pf 15-164, EN pf 39-173', () => {
  assert.deepEqual([b08Frame(b08Cue(0.5, 5), 81).shot, b08Frame(b08Cue(0.5, 5), 81).frame], ['ZCP-B08-SH01', 96]);
  assert.equal(b08Frame(b08Cue(1.3, 4.5), 57).frame, 96);
  assert.equal(b08Frame(b08Cue(0.5, 5), 0).frame, 15);
  assert.equal(b08Frame(b08Cue(0.5, 5), 149).frame, 164);
  assert.equal(b08Frame(b08Cue(1.3, 4.5), 0).frame, 39);
  assert.equal(b08Frame(b08Cue(1.3, 4.5), 134).frame, 173);
});

test('B08 flare and slump on the line: half way at pf 96 +/- 2, full by pf 110, monotone; the slump starts at pf 127 +/- 2', () => {
  const half = (flare(0) + 1) / 2;
  const mid = Array.from({length: 205}, (_, pf) => pf).find((pf) => flare(pf) >= half - 1e-9);
  assert.ok(mid !== undefined && Math.abs(mid - 96) <= 2, `half-way at pf ${mid}`);
  assert.ok(flare(110) >= 1 - 1e-9 && flare(109) < 1, 'full by pf 110');
  for (let pf = 1; pf <= 204; pf++) assert.ok(flare(pf) >= flare(pf - 1), `flare falls at pf ${pf}`);
  assert.equal(slump(127), 0);
  assert.ok(slump(129) > 0 && slump(129) < 16, 'the slump has started by pf 129');
  assert.ok(Math.abs(slump(137) - 16) < 1e-9 && Math.abs(slump(160) - 16) < 1e-9, 'a 16 px drop, then held');
});

test('B08 silhouette: the dark mass stays inside x >= 480 and y >= 1340 on every visible frame (TH 15-164, EN 39-173)', () => {
  for (let pf = 15; pf <= 173; pf++) {
    const parts = massAt(pf);
    for (let y = 1320; y < 1920; y += 8) {
      for (let x = 440; x < 1080; x += 8) {
        if (parts.some((poly) => inside([x, y], poly))) assert.ok(x >= 480 && y >= 1340, `pf ${pf}: mass at ${x},${y}`);
      }
    }
  }
});

test('B08 silhouette coverage: the dark mass covers at most 14 % of the 1080 x 1920 frame (sampled at pf 15, 96, 110, 173)', () => {
  for (const pf of [15, 96, 110, 173]) {
    const parts = massAt(pf);
    let hit = 0, total = 0;
    for (let y = 4; y < 1920; y += 8) for (let x = 4; x < 1080; x += 8) {
      total++;
      if (parts.some((poly) => inside([x, y], poly))) hit++;
    }
    const share = hit / total;
    assert.ok(share <= 0.14 && share > 0.05, `pf ${pf}: ${(share * 100).toFixed(1)} %`);
  }
});

test('B08 glow: the bloom peaks at or below GLOW_PEAK and its spots stay above the caption band (y 1040) on every plate frame', () => {
  for (let pf = 0; pf <= 203; pf++) {
    for (const s of b08Bloom(pf)) {
      assert.ok(s.opacity <= GLOW_PEAK + 1e-9, `pf ${pf} spot ${s.id} opacity ${s.opacity}`);
      assert.ok(layerPoint(s.layer, [s.x, s.y + s.r * 0.9])[1] < 1040, `pf ${pf} spot ${s.id} reaches the caption band`);
    }
  }
});
