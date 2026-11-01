import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtempSync, readFileSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';

const script = path.resolve('scripts/storyboard-page/build.py');
const example = JSON.parse(readFileSync('scripts/storyboard-page/example.json', 'utf8'));

// Builds the page from rows and returns the data block the template carries.
const build = (rows: unknown) => {
  const dir = mkdtempSync(path.join(tmpdir(), 'sb-page-'));
  const json = path.join(dir, 'rows.json');
  writeFileSync(json, JSON.stringify(rows));
  const r = spawnSync('python3', ['-I', script, json, '--out', path.join(dir, 'page')], {encoding: 'utf8'});
  assert.equal(r.status, 0, r.stderr);
  const html = readFileSync(path.join(dir, 'page/index.html'), 'utf8');
  const data = html.match(/id="page-data" type="application\/json">([\s\S]*?)<\/script>/)![1];
  return JSON.parse(data.replaceAll('<\\/', '</'));
};
const hashes = (d: {shots: {id: string; hash: string}[]}) => Object.fromEntries(d.shots.map((s) => [s.id, s.hash]));

test('a shot keeps its hash across a retime, a new revision and a "changed" note', () => {
  const before = hashes(build(example));
  const next = structuredClone(example);
  next.revision = 'SS-R2';
  next.shots[0].end += 15;
  next.shots[1].start += 15;
  next.shots[1].end += 15;
  next.shots[1].changed = 'ทิศว่ายเปลี่ยน';
  next.shots[2].start += 15;
  next.shots[2].end += 15;
  assert.deepEqual(hashes(build(next)), before);
});

test('a changed storyboard cell changes only that shot\'s hash, and a changed question its own', () => {
  const base = build(example);
  const next = structuredClone(example);
  next.shots[1].seen = 'นักดำน้ำว่ายเข้ามาจากซ้าย';
  next.questions[0].detail = 'อีกแบบ';
  const after = build(next);
  const [a, b] = [hashes(base), hashes(after)];
  assert.equal(b['B01-SH01'], a['B01-SH01']);
  assert.notEqual(b['B01-SH02'], a['B01-SH02']);
  assert.equal(b['B02-SH01'], a['B02-SH01']);
  assert.notEqual(after.questions[0].hash, base.questions[0].hash);
});

test('a clip carries the hash of its file, so a re-render under the same name asks again', () => {
  const rows = structuredClone(example);
  rows.shots[0].clips = {draft: {src: 'public/images/oldest-shipwreck/arad-jar-card.png', in: 0, out: 1}};
  const d = build(rows);
  assert.match(d.shots[0].clips.draft.hash, /^[0-9a-f]{12}$/);
});
