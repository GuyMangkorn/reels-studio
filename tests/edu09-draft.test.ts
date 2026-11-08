import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SHOT_RANGES, TOTAL} from '../src/painted/edu09/clock';
import {camAt, lookMove} from '../src/painted/edu09/stage';
import {SH07_MOVE, SH08_MOVE, LF02_MOVE} from '../src/painted/edu09/scenes';
import {edu09Shots} from '../src/painted/shots/edu09';
import {EDU9_CUES, edu9CaptionEvents} from '../src/videos/edu-ep09/cues';
import episode from '../src/videos/edu-ep09/index';

// EDU-EP09-SHORT W5.3 draft assembly (Editor): the timeline against SHEETS-R2 and the draft's runtime contract.
const video = episode.videos[0];

test('W5.3 timeline: 19 scenes, 1606 f, contiguous, one registered plate per shot, B_loop with no freeze', () => {
  assert.equal(SHOT_RANGES.length, 19);
  assert.equal(TOTAL, 1606);
  assert.equal(video.timeline.length, 19);
  assert.equal(video.id, 'EDU-EP09-SHORT');
  assert.equal(video.ending, 'B_loop');
  assert.equal(video.endHoldSec, 0);
  SHOT_RANGES.forEach(([id, a, b], i) => {
    if (i) assert.equal(a, SHOT_RANGES[i - 1][2], `${id} contiguous`);
    assert.equal(video.timeline[i].durationSec, Math.round(((b - a) / 30) * 1e4) / 1e4, id);
    assert.equal(video.timeline[i].painted?.shots[0].shot, `EDU9-${id}`);
  });
  assert.deepEqual(edu09Shots.map((s) => s.id).sort(), SHOT_RANGES.map(([id]) => `EDU9-${id}`).sort());
});

test('W5.3 captions: 22 cues in order, Thai verbatim from the script, none in the try window, retry/D01 or closing hold', () => {
  assert.equal(EDU9_CUES.length, 22);
  EDU9_CUES.forEach((c, i) => { assert.ok(c.to > c.from); if (i) assert.ok(c.from >= EDU9_CUES[i - 1].to - 0, `cue ${i} overlaps`); });
  const script = readFileSync('scripts/edu-series/ep09/script.md', 'utf8').replace(/\s+/g, '');
  for (const c of EDU9_CUES) { const t = c.text.replace(/\s+/g, ''); if (!t.startsWith('ไม่ขึ้น')) assert.ok(script.includes(t.replace(/…$/, '')) || t.length < 5, `not in script: ${c.text}`); }
  const on = (f: number) => EDU9_CUES.some((c) => c.from <= f && f < c.to);
  for (const f of [130, 150, 170, 1360, 1400, 1414, 1540, 1600]) assert.ok(!on(f), `caption at G${f}`);
  const ev = edu9CaptionEvents(SHOT_RANGES.map(([, a]) => a), TOTAL);
  assert.ok(ev.every((e, i) => !i || e.at >= ev[i - 1].at));
  assert.ok(EDU9_CUES.every((c) => !c.text.split('\n').some((l) => l.startsWith('ๆ'))), 'no line starts with ๆ');
});

test('W5.3 cameras: SD01-SD03 hy drifts end where the sheet says, B03-SH03 lens 2350 -> 2000, hold shots keep their last frame', () => {
  assert.equal(camAt(LF02_MOVE, 0, 48, {hy: [780, 748]}).hy, 780);
  assert.equal(camAt(LF02_MOVE, 47, 48, {hy: [780, 748]}).hy, 748);
  assert.equal(camAt(SH07_MOVE, 40, 41, {hy: [768, 752]}).hy, 752);
  assert.equal(camAt(SH08_MOVE, 45, 46, {hy: [780, 764]}).hy, 764);
  const m = lookMove([[0.3, 1.5, 12], [-1.2, 1.8, 3]], 0, [33, 16], [50, 24], {f: 2350, hy: 660, ease: [0.3, 0.72]});
  assert.equal(camAt(m, 0, 138, {f: [2350, 2000]}).f, 2350);
  assert.equal(Math.round(camAt(m, 137, 138, {f: [2350, 2000]}).f), 2000);
  // B05-SH03 ends on B01-SH01's first camera (loop seam, SP4): CAM-POV r 28, eye 40
  const seam = lookMove([0, 1.5, 1], 0, [26.8, 28], [39, 40], {f: 3500, hy: 750, ease: [0, 0.6]});
  const a = camAt(seam, 74, 75), povStart = lookMove([0, 1.5, 1], 0, 28, 40, {f: 3500, hy: 750}), b = camAt(povStart, 0, 1);
  for (const k of ['x', 'y', 'z', 'yaw', 'f', 'hy', 'pitch'] as const) assert.ok(Math.abs((a[k] ?? 0) - (b[k] ?? 0)) < 1e-9, `seam ${k}`);
});
