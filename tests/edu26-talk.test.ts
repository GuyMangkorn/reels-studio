import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {TALK_LINES, talkFace, talkOpen, talkShot} from '../src/painted/edu26/talk26';
import {rowOf} from '../src/painted/edu26/shots/index';

// EDU-EP26-SHORT talking mouths (Boss, draft fix round A, 2026-11-19): src/painted/edu26/talk26.ts, generated from the locked voice.
const timeline: {line: string; speaker: string; start_s: number; end_s: number}[] =
  JSON.parse(readFileSync('scripts/edu-series/ep26/short/timeline-r3.json', 'utf8'));

test('talk26: one envelope per character line, frames from timeline-r3, no NARR mouth', () => {
  const chars = timeline.filter((r) => r.speaker !== 'NARR');
  assert.deepEqual(TALK_LINES.map((l) => l.line), chars.map((r) => r.line));
  for (const l of TALK_LINES) {
    const r = chars.find((c) => c.line === l.line)!;
    assert.equal(l.start, Math.round(r.start_s * 30));
    assert.equal(l.end, Math.round(r.end_s * 30));
    assert.equal(l.open.length, l.end - l.start);
    assert.match(l.open, /^[0-9]+$/);
    assert.ok(/0/.test(l.open) && /[6-9]/.test(l.open), `${l.line} opens and shuts`);
  }
});

test('talk26: shut outside the line, rest face kept, pure in the frame (seek order does not matter)', () => {
  const l = TALK_LINES[0];
  assert.equal(talkOpen(l.start - 1, l.line), 0);
  assert.equal(talkOpen(l.end, l.line), 0);
  assert.equal(talkFace(l.end, l.line, {mouth: 'grin'})?.mouth, 'grin');
  assert.equal(talkFace(l.start, l.line, {mouth: 'grin'})?.mouth, 'talk');
  const frames = Array.from({length: l.end - l.start}, (_, i) => l.start + i);
  const fwd = frames.map((g) => talkOpen(g, l.line)), rev = [...frames].reverse().map((g) => talkOpen(g, l.line)).reverse();
  assert.deepEqual(fwd, rev);
  // the shot clock: B01-SH06 L0 is the L03 start
  assert.equal(rowOf('B01-SH06').start, l.start);
  assert.deepEqual(talkShot('B01-SH06', 3, 'L03'), talkFace(l.start + 3, 'L03'));
});
