import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import c01 from '../scripts/cat-boxes/short-c01.json';
import c02 from '../scripts/cat-boxes/short-c02.json';
import c03 from '../scripts/cat-boxes/short-c03.json';
import c04 from '../scripts/cat-boxes/short-c04.json';
import c05 from '../scripts/cat-boxes/short-c05.json';
import c06 from '../scripts/cat-boxes/short-c06.json';
import {timelineFrames, validateTimeline} from '../src/scenes/timeline';
import {worldPositionAt, worldPropPositionAt} from '../src/scenes/projection';
import {shouldRenderVisualDiagram, visualAt, visualProgressAt} from '../src/assets/visuals/types';
import type {ScenePropSpec, Timeline} from '../src/scenes/types';
import type {SceneVisual} from '../src/assets/visuals/types';

const checks: Array<[string, Timeline, string]> = [
  ['C01', c01 as Timeline, 'CATBOX-C01-SHORT-S01'],
  ['C02', c02 as Timeline, 'CATBOX-C02-SHORT-S01'],
  ['C03', c03 as Timeline, 'CATBOX-C03-SHORT-S01'],
  ['C04', c04 as Timeline, 'CATBOX-C04-SHORT-S01'],
  ['C05', c05 as Timeline, 'CATBOX-C05-SHORT-S01'],
  ['C06', c06 as Timeline, 'CATBOX-C06-SHORT-S01'],
];

for (const [short, timeline, idPrefix] of checks) {
  test(`${short} Short S01 is four standalone beats and 1,350 frames`, () => {
    validateTimeline(timeline);
    assert.equal(timeline.length, 4);
    assert.equal(timelineFrames(timeline, 30), 1350);
    for (const [i, scene] of timeline.entries()) {
      assert.equal(scene.subtitleCues?.[0]?.atSec, 0);
      assert.equal(scene.subtitleCues?.[0]?.text, scene.subtitle);
      assert.equal(scene.visuals?.length, 1);
      assert.equal(scene.visuals?.[0]?.shotId, `${idPrefix}-SH0${i + 1}`);
      assert.equal(scene.visuals?.[0]?.sourceBeatId, `CATBOX-C${short.slice(-2)}-S01-B0${i + 1}`);
      assert.equal(scene.visuals?.[0]?.startSec, 0);
      assert.equal(scene.visuals?.[0]?.endSec, scene.durationSec);
      assert.ok(['fiction', 'diagram', 'research', 'hypothesis'].includes(scene.visuals?.[0]?.status ?? ''));
    }
  });
}

test('Short timelines point at the checked chapter script revisions', () => {
  const index = readFileSync('storyboards/cat-boxes/index.md', 'utf8');
  for (const revision of ['ch01 R5', 'ch02 R4', 'ch03 R4', 'ch04 R4', 'ch05 R4', 'ch06 R4']) assert.ok(index.includes(revision));
});

test('Short factual labels and the C03 inference keep their reviewed entry timing', () => {
  const c03Opening = c03[0].visuals?.[0] as unknown as SceneVisual | undefined;
  assert.equal(c03Opening?.status, 'fiction');
  assert.deepEqual(c03Opening?.labelsAtSec, [3.2]);

  const c04Opening = c04[0].visuals?.[0];
  assert.ok(c04Opening?.labels.includes('ตรวจคำอ้าง'));
  assert.ok(c04Opening?.labels.includes('ไม่ใช่คำแนะนำตั้งอุณหภูมิ'));

  const c05Opening = c05[0].visuals?.[0];
  assert.ok(c05Opening?.labels.includes('สมมติฐาน — ยังไม่ยืนยันกลไก'));
  assert.ok(c05Opening?.labels.includes('ข้อเสนอในการสัมภาษณ์'));
  assert.ok(c05Opening?.labels.includes('ไม่ใช่ผลทดลองกลไก'));

  const c06Opening = c06[0].visuals?.[0];
  assert.equal(c06Opening?.status, 'research');
  assert.deepEqual(c06Opening?.labels, ['เรื่องสมมติ • กล่องเก่าในห้อง']);
});

test('the C03 toy follows its metre-space floor path deterministically', () => {
  const toy = c03[0].props?.find(prop => prop.type === 'catbox-toy') as unknown as ScenePropSpec | undefined;
  assert.ok(toy?.worldMotion);
  assert.deepEqual(worldPropPositionAt(toy, 0, 30), {x: -.5, y: 0});
  const entering = worldPropPositionAt(toy, 60, 30);
  assert.ok(Math.abs(entering.x - .22) < 1e-9);
  assert.equal(entering.y, .18);
  const pawContact = worldPropPositionAt(toy, 120, 30);
  assert.deepEqual(pawContact, {x: .15, y: 0});
  const middle = worldPropPositionAt(toy, 45, 30);
  assert.ok(middle.x > -.5 && middle.x < .1);
  for (const frame of [180, 0, 60, 15, 210, 45]) worldPropPositionAt(toy, frame, 30);
  assert.deepEqual(worldPropPositionAt(toy, 45, 30), middle);
  assert.deepEqual(worldPropPositionAt(toy, 8 * 30 - 1, 30), {x: .15, y: 0});
  assert.equal(toy.layer, 'back');
  const cat = c03[0].actors.find(actor => actor.id === 'mochi');
  assert.ok(cat?.world);
  assert.deepEqual(worldPositionAt(cat.world.keys, 90, 30).x, 0.06);
});

test('the C03 owner inference appears after the fictional pounce', () => {
  const visual = c03[0].visuals?.[0] as SceneVisual;
  assert.equal(visual.status, 'fiction');
  assert.deepEqual(visual.labelsAtSec, [3.2]);
  assert.equal(visualProgressAt(visual, 90, 30), 90 / 240);
});

test('every chapter Short keeps Mochi and the owner in the metre-space living room', () => {
  for (const [short, timeline] of checks) {
    for (const [i, scene] of timeline.entries()) {
      assert.ok(scene.projection, `${short} scene ${i + 1} has no room projection`);
      assert.ok(scene.actors.some(actor => actor.id === 'mochi' && actor.world), `${short} scene ${i + 1} has no projected Mochi`);
      assert.ok(scene.actors.some(actor => actor.id === 'owner' && actor.world), `${short} scene ${i + 1} has no projected owner`);
      assert.equal(scene.bg, 'room');
    }
  }
});

test('chapter overlay headlines differ from their subtitle cues', () => {
  for (const [, timeline] of checks) {
    for (const scene of timeline) assert.notEqual(scene.visuals?.[0]?.heading, scene.subtitleCues?.[0]?.text);
  }
});

test('visual intervals are half-open and progress is stable after out-of-order seeks', () => {
  const visual = c01[1].visuals[0] as unknown as SceneVisual;
  assert.equal(visualAt([visual], 0, 30)?.shotId, visual.shotId);
  assert.equal(visualAt([visual], 13 * 30 - 1, 30)?.shotId, visual.shotId);
  assert.equal(visualAt([visual], 13 * 30, 30), undefined);
  const middle = visualProgressAt(visual, 195, 30);
  for (const frame of [345, 0, 180, 390, 195]) visualProgressAt(visual, frame, 30);
  assert.equal(visualProgressAt(visual, 195, 30), middle);
});

test('projected diagrams require opt-in and keep the safe overlay as the default', () => {
  const timeline = structuredClone(c01) as unknown as Timeline;
  const visual = timeline[0].visuals![0] as unknown as SceneVisual;
  assert.equal(shouldRenderVisualDiagram(visual, false), true);
  assert.equal(shouldRenderVisualDiagram(visual, true), false);

  visual.showProjectedDiagram = true;
  visual.projectedLayout = 'catbox-short-r6';
  assert.doesNotThrow(() => validateTimeline(timeline));
  assert.equal(shouldRenderVisualDiagram(visual, true), true);

  const hidden = structuredClone(timeline) as unknown as Timeline;
  hidden[0].visuals![0].showDiagram = false;
  assert.equal(shouldRenderVisualDiagram(hidden[0].visuals![0], true), false);
  assert.throws(() => validateTimeline(hidden), /cannot opt in to a diagram that is explicitly hidden/);

  const unprojected = structuredClone(timeline) as unknown as Timeline;
  delete (unprojected[0] as unknown as {projection?: unknown}).projection;
  assert.throws(() => validateTimeline(unprojected), /projected diagram opt-in requires a projected scene/);

  const invalid = structuredClone(timeline) as unknown as Timeline;
  (invalid[0].visuals![0] as unknown as {showProjectedDiagram?: unknown}).showProjectedDiagram = 'yes';
  assert.throws(() => validateTimeline(invalid), /showProjectedDiagram: expected boolean/);

  const layoutWithoutOptIn = structuredClone(c01) as unknown as Timeline;
  layoutWithoutOptIn[0].visuals![0].projectedLayout = 'catbox-short-r6';
  assert.throws(() => validateTimeline(layoutWithoutOptIn), /projected layout requires explicit diagram opt-in/);
});

test('C06 preserves the calibrated short view and holds the return for the final three seconds', () => {
  const finalScene = c06[3];
  const projection = finalScene.projection;
  assert.ok(projection);
  assert.deepEqual(projection.views.short.bounds, {left: -0.3234375, right: 0.3234375, bottom: -0.275, top: 0.875});
  assert.equal(finalScene.durationSec, 11);
  assert.equal(finalScene.visuals?.[0]?.endSec, 11);
  const cat = finalScene.actors.find(actor => actor.id === 'mochi');
  assert.ok(cat?.world);
  assert.deepEqual(cat.world.keys[0], {atSec: 0, x: -0.55, y: 0});
  assert.deepEqual(cat.world.keys.at(-1), {atSec: 11, x: 0, y: 0.09191489361702128});
});

test('C06 plants BOX-OLD at frame 0 and introduces the shared flat outline at an estimated 0.5s beat', () => {
  const opening = c06[0];
  const props = opening.props as unknown as ScenePropSpec[] | undefined;
  assert.ok(props?.some(prop => prop.type === 'catbox-old'));
  const outline = props?.find(prop => prop.type === 'catbox-outline');
  assert.equal(outline?.startSec, 0.5);
  assert.equal(outline?.endSec, 8);
});

test('validation rejects unknown Short modes and malformed prop paths', () => {
  const unknownMode = structuredClone(c01) as unknown as Timeline;
  (unknownMode[0].visuals![0] as unknown as {id: string}).id = 'novelty-visit';
  assert.throws(() => validateTimeline(unknownMode), /unknown visual mode/);

  const brokenPath = structuredClone(c03) as unknown as Timeline;
  const toy = brokenPath[0].props!.find(prop => prop.type === 'catbox-toy')!;
  toy.worldMotion![1].atSec = 0;
  assert.throws(() => validateTimeline(brokenPath), /worldMotion\[1\]/);

  const missingSourceBeat = structuredClone(c01) as unknown as Timeline;
  delete (missingSourceBeat[0].visuals![0] as unknown as {sourceBeatId?: string}).sourceBeatId;
  assert.throws(() => validateTimeline(missingSourceBeat), /visuals\[0\]\.sourceBeatId/);
  const emptySourceBeat = structuredClone(c01) as unknown as Timeline;
  (emptySourceBeat[0].visuals![0] as unknown as {sourceBeatId: string}).sourceBeatId = '';
  assert.throws(() => validateTimeline(emptySourceBeat), /visuals\[0\]\.sourceBeatId/);

  const invalidLabelReveal = structuredClone(c03) as unknown as Timeline;
  (invalidLabelReveal[0].visuals![0] as unknown as {labelsAtSec: number[]}).labelsAtSec = [8];
  assert.throws(() => validateTimeline(invalidLabelReveal), /visuals\[0\]\.labelsAtSec\[0\]/);
});
