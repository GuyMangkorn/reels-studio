import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtempSync, readFileSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';

const script = path.resolve('scripts/ep.py');
const dir = () => mkdtempSync(path.join(tmpdir(), 'ep-test-'));
const run = (...args: string[]) => {
  const r = spawnSync('python3', ['-I', script, ...args], {encoding: 'utf8'});
  return {code: r.status, out: r.stdout + r.stderr};
};
const file = (d: string, name: string, text: string) => {
  const p = path.join(d, name);
  writeFileSync(p, text);
  return p;
};

const TASK = `# Tasks

## EP01-SHORT

**Now:** W1 started. **Next:** Boat research

- [ ] W1 Script lock
  - [ ] W1.1 Boat research
  - [ ] W1.10 Something else

## EP02-SHORT

**Now:** nothing. **Next:** ideation
`;

test('tick marks one step, keeps its text, and refuses an ambiguous or missing ID', () => {
  const p = file(dir(), 'task.md', TASK);
  assert.equal(run('tick', p, 'W1.1').code, 0);
  assert.match(readFileSync(p, 'utf8'), /- \[x\] W1\.1 Boat research\n {2}- \[ \] W1\.10/);
  assert.equal(run('tick', p, 'W1.1', '--text', 'Boat research (R1)').code, 0);
  assert.match(readFileSync(p, 'utf8'), /- \[x\] W1\.1 Boat research \(R1\)\n/);
  assert.equal(run('tick', p, 'W1.1', '--undo').code, 0);
  assert.match(readFileSync(p, 'utf8'), /- \[ \] W1\.1 Boat research \(R1\)\n/);
  const before = readFileSync(p, 'utf8');
  assert.equal(run('tick', p, 'W9').code, 1);
  assert.equal(readFileSync(p, 'utf8'), before);
});

test('tick --deliverable edits a step ID repeated per deliverable; --undo --text edits an open step', () => {
  const p = file(dir(), 'task.md', '# Tasks\n\n## A\n\n- [x] W5.2 plates A\n\n## B\n\n- [ ] W5.2 plates B\n');
  assert.equal(run('tick', p, 'W5.2', '--undo', '--text', 'x').code, 1); // two matches, no scope
  assert.equal(run('tick', p, 'W5.2', '--deliverable', 'B', '--undo', '--text', 'plates B (G-B)').code, 0);
  assert.equal(readFileSync(p, 'utf8'), '# Tasks\n\n## A\n\n- [x] W5.2 plates A\n\n## B\n\n- [ ] W5.2 plates B (G-B)\n');
});

test('now replaces the Now/Next line, scoped to a deliverable when the file has several', () => {
  const p = file(dir(), 'task.md', TASK);
  assert.equal(run('now', p, 'W1.1 done.', 'Preaw script').code, 1); // two Now lines, no scope
  assert.equal(run('now', p, 'W1.1 done.', 'Preaw script', '--deliverable', 'EP01-SHORT').code, 0);
  const t = readFileSync(p, 'utf8');
  assert.match(t, /\*\*Now:\*\* W1\.1 done\. \*\*Next:\*\* Preaw script\n/);
  assert.match(t, /\*\*Now:\*\* nothing\. \*\*Next:\*\* ideation/);
});

test('cell reads and writes one table cell by row key and header, keeping escaped pipes', () => {
  const p = file(dir(), 'delivery.md', `| Deliverable | Stage / Next owner | Script |
| --- | --- | --- |
| EP01-SHORT | W5 draft \\| Boss | R1 |
| EP02-SHORT | W0 | - |
`);
  const got = run('cell', p, 'EP01-SHORT', 'Stage / Next owner');
  assert.equal(got.out.trim(), 'W5 draft \\| Boss');
  assert.equal(run('cell', p, 'EP01-SHORT', 'Stage / Next owner', 'W6 final, Editor').code, 0);
  const t = readFileSync(p, 'utf8');
  assert.match(t, /\| EP01-SHORT \| W6 final, Editor \| R1 \|/);
  assert.match(t, /\| EP02-SHORT \| W0 \| - \|/);
  assert.equal(run('cell', p, 'EP01-SHORT', 'Stage / Next owner', 'a | b').code, 1);
  assert.equal(run('cell', p, 'EP03-SHORT', 'Script', 'x').code, 1);
});

test('rows lists shots and sets typed values on shots, looks and the top level', () => {
  const rowsJson = {
    deliverable: 'EP01',
    shots: [{id: 'S01-B01-SH01', beat: 'B01', start: 0, end: 60, title: 'ห้องนอน', vo: [['ผู้บรรยาย', 'กำลังจะหลับ']]}],
    beats: [{id: 'B01', name: 'เปิด'}],
    looks: {LF01: {src: 'a.png', caption: 'old'}},
  };
  const p = file(dir(), 'review-rows.json', JSON.stringify(rowsJson, null, 1) + '\n');
  assert.match(run('rows', p, 'list').out, /S01-B01-SH01\s+0-60\s+ห้องนอน \| กำลังจะหลับ/);
  assert.equal(run('rows', p, 'set', 'S01-B01-SH01', 'end=72', 'flag=ตรวจ', 'title=').code, 0);
  assert.equal(run('rows', p, 'set', 'look:LF01', 'src=out/v2/LF01.png').code, 0);
  assert.equal(run('rows', p, 'set', 'top', 'revision="SS-R2"').code, 0);
  const d = JSON.parse(readFileSync(p, 'utf8'));
  assert.equal(d.shots[0].end, 72);
  assert.equal(d.shots[0].flag, 'ตรวจ');
  assert.equal('title' in d.shots[0], false);
  assert.equal(d.looks.LF01.src, 'out/v2/LF01.png');
  assert.equal(d.revision, 'SS-R2');
  assert.match(readFileSync(p, 'utf8'), /^\{\n "deliverable": "EP01"/); // indent 1, Thai kept as text
  assert.match(readFileSync(p, 'utf8'), /ตรวจ/);
  assert.equal(run('rows', p, 'set', 'S09', 'end=1').code, 1);
});
