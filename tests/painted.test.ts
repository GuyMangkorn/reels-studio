import {test} from 'node:test';
import assert from 'node:assert/strict';
import {timelineFrames, validateTimeline} from '../src/scenes/timeline';
import {paintedSpans, paintedStateAt} from '../src/scenes/painted';
import {cameraAt, paintedShotIds, paintedShots} from '../src/painted/registry';
import {SH03B} from '../src/painted/shots/shipwreck';
import {paintedProofTimeline} from '../src/painted/spike/timelineProof';
import type {Scene, Timeline} from '../src/scenes/types';

const painted = (shots: NonNullable<Scene['painted']>['shots'], extra: Partial<Scene> = {}): Scene => ({durationSec: 2, bg: 'none', actors: [], subtitle: '', painted: {shots}, ...extra});
const state = (timeline: Timeline, frame: number, ending: 'B_loop' | 'C_seamless' = 'B_loop') =>
  paintedStateAt(timeline, frame, 30, {ending, durationInFrames: timelineFrames(timeline, 30), loopBlendFrames: 15});

test('painted scenes validate and keep the summed duration', () => {
  validateTimeline(paintedProofTimeline);
  assert.equal(timelineFrames(paintedProofTimeline, 30), 447);
  assert.ok(paintedShotIds.includes('SHIPWRECK-SH01'));
});

test('invalid painted scenes are rejected with a path', () => {
  assert.throws(() => validateTimeline([painted([{shot: 'NOPE', atSec: 0}])]), /\[0\]\.painted\.shots\[0\]\.shot/);
  assert.throws(() => validateTimeline([painted([{shot: 'SHIPWRECK-SH01', atSec: 0}], {bg: 'sea'})]), /\[0\]\.bg: painted scenes/);
  assert.throws(() => validateTimeline([painted([{shot: 'SHIPWRECK-SH01', atSec: 0.5}])]), /must start at zero/);
  assert.throws(() => validateTimeline([painted([{shot: 'SHIPWRECK-SH01', atSec: 0}, {shot: 'SHIPWRECK-SH06', atSec: 0}])]), /shots\[1\]\.atSec/);
  assert.throws(() => validateTimeline([painted([{shot: 'SHIPWRECK-SH01', atSec: 0, label: ' '}])]), /label/);
  // A dissolve needs a plate under it and must end before the next cue.
  assert.throws(() => validateTimeline([painted([{shot: 'SHIPWRECK-SH01', atSec: 0, dissolveSec: 0.5}])]), /needs a painted plate/);
  assert.throws(() => validateTimeline([{durationSec: 2, bg: 'none', actors: [], subtitle: ''}, painted([{shot: 'SHIPWRECK-SH01', atSec: 0, dissolveSec: 0.5}])]), /needs a painted plate/);
  assert.throws(() => validateTimeline([painted([{shot: 'SHIPWRECK-SH01', atSec: 0}, {shot: 'SHIPWRECK-SH06', atSec: 1, dissolveSec: 1.5}])]), /must finish before/);
  // Two canvases cannot coexist, so the Remotion entry transition is refused on painted scenes.
  assert.throws(() => validateTimeline([painted([{shot: 'SHIPWRECK-SH01', atSec: 0}]), painted([{shot: 'SHIPWRECK-SH06', atSec: 0}], {transitionIn: {type: 'fade', frames: 6}})]), /transitionIn/);
});

test('plates follow the composition clock, dissolve across a scene boundary and carry the label', () => {
  const spans = paintedSpans(paintedProofTimeline, 30);
  assert.deepEqual(spans.map((s) => [s.shot, s.startFrame, s.endFrame]), [
    ['SHIPWRECK-SH01', 0, 60], ['SHIPWRECK-SH03a', 60, 114], ['SHIPWRECK-SH03b', 114, 192], ['SHIPWRECK-SH04a', 192, 282], ['SHIPWRECK-SH06', 282, 447],
  ]);
  // Inside SH03b: one plate on its own shot clock, labelled.
  const b = state(paintedProofTimeline, 150)!;
  assert.deepEqual(b.plates.map((p) => [p.shot, p.frame, p.alpha, p.label]), [['SHIPWRECK-SH03b', 36, 1, 'ภาพจำลอง']]);
  // First dissolve frame: SH03b keeps running underneath (and keeps its label), SH04a enters at 1/31.
  const d0 = state(paintedProofTimeline, 192)!;
  assert.deepEqual(d0.plates.map((p) => [p.shot, p.frame]), [['SHIPWRECK-SH03b', 78], ['SHIPWRECK-SH04a', 0]]);
  assert.equal(d0.plates[1].alpha, 1 / 31);
  assert.equal(d0.plates[0].label, 'ภาพจำลอง');
  // Opacity rises monotonically through the dissolve, then the incoming plate is alone at full opacity.
  const mixes = Array.from({length: 30}, (_, i) => state(paintedProofTimeline, 192 + i)!.plates[1].alpha);
  assert.ok(mixes.every((m, i) => i === 0 || m > mixes[i - 1]));
  assert.deepEqual(state(paintedProofTimeline, 222)!.plates.map((p) => [p.shot, p.alpha, p.label]), [['SHIPWRECK-SH04a', 1, undefined]]);
});

test('direct seeks resolve the same state as sequential playback, and the ending hold applies to plates', () => {
  const forward = Array.from({length: 447}, (_, f) => JSON.stringify(state(paintedProofTimeline, f)));
  for (const f of [446, 0, 300, 192, 113, 221, 60]) assert.equal(JSON.stringify(state(paintedProofTimeline, f)), forward[f]);
  // B_loop holds the final scene's last three seconds: frame 446 paints the plate of frame 357.
  assert.equal(JSON.stringify(state(paintedProofTimeline, 446)), forward[357]);
  // C_seamless blends frame 0's plate over the last frames.
  const last = state(paintedProofTimeline, 446, 'C_seamless')!;
  assert.deepEqual(last.plates.map((p) => [p.shot, p.alpha]), [['SHIPWRECK-SH06', 1], ['SHIPWRECK-SH01', 1]]);
  // The outgoing plate's overlay layers fade out as frame 0's fade in: by the last frame only frame 0 shows.
  assert.deepEqual(last.plates.map((p) => p.overlayOpacity), [0, 1]);
});

test('B_loop endHoldSec 2 freezes the 90 f final scene at local 30 instead of local 0', () => {
  const at = (frame: number, endingOptions?: {holdSec: number}) =>
    JSON.stringify(paintedStateAt(paintedProofTimeline, frame, 30, {ending: 'B_loop', durationInFrames: 447, loopBlendFrames: 15, endingOptions}));
  const sh = (frame: number, h?: {holdSec: number}) => JSON.parse(at(frame, h)).plates[0].frame;
  assert.equal(sh(446, {holdSec: 2}), 105); // authored frame 387 (local 30) in the 90 f final scene
  assert.equal(sh(446), 75); // default 3 s hold: authored frame 357 (local 0)
  assert.equal(sh(386, {holdSec: 2}), 104);
  assert.equal(at(446, {holdSec: 2}), at(400, {holdSec: 2}));
  assert.notEqual(at(446, {holdSec: 2}), at(446));
  assert.equal(at(446), at(357));
  assert.equal(at(300, {holdSec: 2}), at(300));
});

// EG-EP02 SS-R2.3: S03-B01-SH02 and S04-B01-SH01 are one camera chain at 0.92-0.94 (Boss extends sky/walls past the plate); every other camera stays >= 1.
const EG2_SOI_CHAIN = ['EG2-S03-B01-SH02', 'EG2-S04-B01-SH01'];
test('non-painted scenes paint nothing; shot cameras are finite and respect clock freezes', () => {
  const mixed: Timeline = [{durationSec: 1, bg: 'none', actors: [], subtitle: ''}, painted([{shot: 'SHIPWRECK-SH01', atSec: 0}])];
  validateTimeline(mixed);
  assert.equal(state(mixed, 10), null);
  assert.equal(state(mixed, 30)!.plates[0].frame, 0);
  for (const id of paintedShotIds) {
    for (const tl of [0, 1, 3, 6]) {
      const c = cameraAt(id, tl);
      assert.ok([c.s, c.fx, c.fy, c.dx, c.dy].every(Number.isFinite) && c.s >= (EG2_SOI_CHAIN.includes(id) ? 0.9 : 1), `${id} camera at ${tl}`);
    }
    assert.ok(paintedShots[id].serves.length > 0, `${id} names the shots it serves`);
  }
  // SH03b freezes on the doubt line: the camera (and so every glow layer) holds too.
  assert.deepEqual(cameraAt('SHIPWRECK-SH03b', SH03B.freezeAt + 0.7), cameraAt('SHIPWRECK-SH03b', SH03B.freezeAt));
});
