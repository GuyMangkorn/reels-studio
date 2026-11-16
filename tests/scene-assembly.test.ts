import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assemblePaintedTimeline} from '../src/scenes/assemble';
import {cueStartFrame, sceneFrames, subtitleAt} from '../src/scenes/timeline';
import edu20 from '../src/videos/edu-ep20/index';
import {EDU20_CUES} from '../src/videos/edu-ep20/cues';
import {buildTimeline as buildZcpaintTimeline} from '../src/videos/zombie-condo-paint';

const cuts = [{id: 'A', start: 0, end: 30}, {id: 'B', start: 30, end: 60}];
const shots = [{at: 0, cue: {shot: 'SHOT-A'}}, {at: 30, cue: {shot: 'SHOT-B', fromSec: 0}}];
const captions = [{at: 0, text: 'แรก'}, {at: 30, text: 'ถัดไป'}];

test('cuts own onset cues on [start,end), with local clocks and no implicit carry', () => {
  const result = assemblePaintedTimeline({cuts, shots, captions, clockRate: 30,
    sounds: [{at: -1, cue: {src: 'before.wav'}}, {at: 30, cue: {src: 'cut.wav'}}, {at: 60, cue: {src: 'after.wav'}}],
  });
  assert.deepEqual(result, [
    {durationSec: 1, bg: 'none', actors: [], subtitle: 'แรก', subtitleCues: [{atSec: 0, text: 'แรก'}], painted: {shots: [{shot: 'SHOT-A', atSec: 0}]}},
    {durationSec: 1, bg: 'none', actors: [], subtitle: 'ถัดไป', subtitleCues: [{atSec: 0, text: 'ถัดไป'}], painted: {shots: [{shot: 'SHOT-B', fromSec: 0, atSec: 0}]}, sfx: [{src: 'cut.wav', atSec: 0}]},
  ]);
  assert.equal(Object.hasOwn(result[0], 'sfx'), false);
  assert.equal(Object.hasOwn(result[0].painted!.shots[0], 'fromSec'), false);
  assert.equal(Object.hasOwn(result[1].painted!.shots[0], 'fromSec'), true);
});

test('native frame subtraction precedes conversion and event payloads stay unchanged', () => {
  const input = {
    cuts: [{id: 'OFFSET', start: 198, end: 399}], clockRate: 30,
    shots: [{at: 198, cue: {shot: 'SHOT', fromSec: 1.234567, dissolveSec: 0.3, label: ['หนึ่ง', 'สอง'] as [string, string]}}],
    captions: [{at: 198, text: ''}, {at: 224, text: 'คำ'}],
    sounds: [{at: 300, cue: {src: 'late.wav', durationSec: 20, trimStartSec: 2}}, {at: 224, cue: {src: 'early.wav'}}],
  };
  const original = structuredClone(input);
  const [scene] = assemblePaintedTimeline(input);
  assert.equal(scene.durationSec, (399 - 198) / 30);
  assert.equal(scene.subtitleCues![1].atSec, (224 - 198) / 30);
  assert.notEqual(scene.subtitleCues![1].atSec, 224 / 30 - 198 / 30);
  assert.equal(scene.painted!.shots[0].fromSec, 1.234567);
  assert.deepEqual(scene.painted!.shots[0].label, ['หนึ่ง', 'สอง']);
  assert.deepEqual(scene.sfx, [{src: 'late.wav', durationSec: 20, trimStartSec: 2, atSec: 102 / 30}, {src: 'early.wav', atSec: 26 / 30}]);
  assert.equal(scene.subtitle, 'คำ');
  assert.deepEqual(input, original, 'assembly must not mutate or sort authoring inputs');
});

test('second-based projects round differences without snapping to frames or rounding source clocks', () => {
  const [scene] = assemblePaintedTimeline({clockRate: 1, precision: 3,
    cuts: [{id: 'SEC', start: 19.333, end: 21.6667}],
    shots: [{at: 19.333, cue: {shot: 'SHOT', fromSec: 0.1234567}}],
    captions: [{at: 19.333, text: ''}, {at: 19.7886, text: 'ซับ'}],
    sounds: [{at: 19.7886, cue: {src: 'hit.wav', durationSec: 9.87654}}],
  });
  assert.equal(scene.durationSec, 2.334);
  assert.equal(scene.subtitleCues![1].atSec, 0.456);
  assert.equal(scene.sfx![0].atSec, 0.456);
  assert.equal(scene.sfx![0].durationSec, 9.87654);
  assert.equal(scene.painted!.shots[0].fromSec, 0.1234567);
});

test('assembly rejects ambiguous cuts, invalid clocks and missing starting picture/caption', () => {
  const input = {cuts, shots, captions, clockRate: 30};
  for (const clockRate of [0, -1, NaN, Infinity]) assert.throws(() => assemblePaintedTimeline({...input, clockRate}), /clockRate/);
  assert.throws(() => assemblePaintedTimeline({...input, precision: -1}), /precision/);
  assert.throws(() => assemblePaintedTimeline({...input, cuts: []}), /cuts/);
  assert.throws(() => assemblePaintedTimeline({...input, cuts: [{id: 'X', start: 0, end: 0}]}), /X/);
  assert.throws(() => assemblePaintedTimeline({...input, cuts: [cuts[0], {...cuts[1], start: 29}]}), /B/);
  assert.throws(() => assemblePaintedTimeline({...input, shots: [shots[0]]}), /B.*painted/);
  assert.throws(() => assemblePaintedTimeline({...input, captions: [captions[0]]}), /B.*caption/);
  assert.throws(() => assemblePaintedTimeline({...input, sounds: [{at: NaN, cue: {src: 'invalid.wav'}}]}), /sound/);
});

test('ZCPAINT captions keep their authored beat near the next cut and never round onto the scene end', () => {
  const line = (id: string, beat: string, onsetSec: number, speechEndSec: number) => ({id, beat, text: id, caption: id, onsetSec, speechEndSec});
  const sheet = {
    durationSec: 2, audio: [], sfx: [], beats: [
      {beat: 'A', startSec: 0, shots: [{shot: 'SHOT-A', atSec: 0}]},
      {beat: 'B', startSec: 1, shots: [{shot: 'SHOT-B', atSec: 1}]},
    ],
  };
  const {timeline} = buildZcpaintTimeline('TH', [line('first', 'A', 0, 0.2), line('late', 'A', 0.9, 0.95), line('next', 'B', 1, 1.2)], sheet);
  assert.deepEqual(timeline[0].subtitleCues, [{atSec: 0, text: 'first'}, {atSec: 0.3, text: ''}, {atSec: 0.9, text: 'late'}]);
  assert.deepEqual(timeline[1].subtitleCues, [{atSec: 0, text: 'next'}, {atSec: 0.3, text: ''}]);
  // 0.9997 rounds to 1.000, the end of beat A: it would never be shown, so the build fails instead of moving it.
  assert.throws(() => buildZcpaintTimeline('TH', [line('first', 'A', 0, 0.2), line('late', 'A', 0.9997, 0.9998), line('next', 'B', 1, 1.2)], sheet),
    /A.*rounds onto the end/);
});

test('ZCPAINT rejects a caption authored outside its beat instead of assigning it to another beat', () => {
  assert.throws(() => buildZcpaintTimeline('TH', [
    {id: 'wrong', beat: 'A', text: 'wrong', caption: 'wrong', onsetSec: 1, speechEndSec: 1.2},
  ], {
    durationSec: 2, audio: [], sfx: [], beats: [
      {beat: 'A', startSec: 0, shots: [{shot: 'SHOT-A', atSec: 0}]},
      {beat: 'B', startSec: 1, shots: [{shot: 'SHOT-B', atSec: 1}]},
    ],
  }), /A.*caption.*outside/);
});

test('precision-4 frame-clock captions start and end on their exact frame (no 1/3-frame round-up delay)', () => {
  // One cue per local frame 1..90 after a long cut offset: every residue mod 3, the old late case being frame ≡ 2 (mod 3).
  const start = 1332;
  const events = [{at: start, text: 'f0'}, ...Array.from({length: 90}, (_, i) => ({at: start + 1 + i, text: `f${i + 1}`}))];
  const [scene] = assemblePaintedTimeline({clockRate: 30, precision: 4, cuts: [{id: 'C', start, end: start + 120}],
    shots: [{at: start, cue: {shot: 'S'}}], captions: events});
  assert.equal(scene.subtitleCues![17].atSec, 0.5667, 'local 17 ≡ 2 (mod 3) is stored rounded up');
  for (let f = 0; f <= 90; f++) {
    assert.equal(cueStartFrame(scene.subtitleCues![f].atSec, 30), f);
    assert.equal(subtitleAt(scene, f, 30), `f${f}`, `local frame ${f}`);
  }
  assert.equal(subtitleAt(scene, 119, 30), 'f90');
  // Seconds-authored onsets between frames still start on the next frame (ZCPAINT 0.401 s = frame 12.03 → 13).
  assert.equal(cueStartFrame(0.401, 30), 13);
  assert.equal(cueStartFrame(2, 30), 60);
  assert.equal(cueStartFrame(2.001, 30), 61);
});

test('EDU-EP20-SHORT captions start on their sheet frame, incl. L13a/L13b G1384 and the END20 hard-off at G1529', () => {
  const {timeline} = edu20.videos[0];
  const starts = timeline.reduce<number[]>((acc, s, i) => [...acc, i ? acc[i - 1] + sceneFrames(timeline[i - 1].durationSec, 30) : 0], []);
  const captionAt = (g: number) => {
    const i = starts.filter(s => s <= g).length - 1;
    return subtitleAt(timeline[i], g - starts[i], 30);
  };
  for (const cue of EDU20_CUES) {
    assert.equal(captionAt(cue.from), cue.text, `${cue.id} on G${cue.from}`);
    if (cue.from > 0) assert.notEqual(captionAt(cue.from - 1), cue.text, `${cue.id} not before G${cue.from}`);
    assert.equal(captionAt(cue.to - 1), cue.text, `${cue.id} through G${cue.to - 1}`);
  }
  const l13b = EDU20_CUES.find(c => c.id === 'L13b')!;
  assert.deepEqual([l13b.from, l13b.to], [1384, 1529]);
  assert.equal(captionAt(1528), l13b.text);
  assert.equal(captionAt(1529), '');
  assert.equal(captionAt(1530), '');
});
