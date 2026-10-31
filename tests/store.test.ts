import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';

const script = path.resolve('scripts/store.py');

const setup = () => {
  const root = mkdtempSync(path.join(tmpdir(), 'store-test-'));
  const store = path.join(root, 'store');
  const repo = path.join(root, 'repo');
  mkdirSync(path.join(repo, 'src/videos/demo'), {recursive: true});
  const run = (...args: string[]) => {
    const r = spawnSync('python3', ['-I', script, ...args], {cwd: repo, env: {...process.env, REELS_STORE: store}, encoding: 'utf8'});
    return {code: r.status, out: r.stdout + r.stderr};
  };
  const write = (rel: string, text: string) => {
    const p = path.join(root, rel);
    mkdirSync(path.dirname(p), {recursive: true});
    writeFileSync(p, text);
    return p;
  };
  return {root, store, repo, run, write};
};

test('put stores a file once, keeps its sidecar and records it in the manifest', () => {
  const {store, run, write} = setup();
  const src = write('in/splash.wav', 'RIFF-splash');
  write('in/splash.wav.json', '{"seed": 1}');
  const r = run('put', src, 'library/sound/sfx/water/water_splash_01.wav');
  assert.equal(r.code, 0, r.out);
  assert.equal(readFileSync(path.join(store, 'library/sound/sfx/water/water_splash_01.wav'), 'utf8'), 'RIFF-splash');
  assert.equal(readFileSync(path.join(store, 'library/sound/sfx/water/water_splash_01.json'), 'utf8'), '{"seed": 1}');
  const manifest = readFileSync(path.join(store, 'manifest.tsv'), 'utf8').trim().split('\n');
  assert.equal(manifest.length, 2);
  assert.match(manifest[1], /library\/sound\/sfx\/water\/water_splash_01\.wav/);

  // Same content again is a no-op; different content at the same path is refused (stored files are immutable).
  assert.equal(run('put', src, 'library/sound/sfx/water/water_splash_01.wav').code, 0);
  assert.equal(readFileSync(path.join(store, 'manifest.tsv'), 'utf8').trim().split('\n').length, 2);
  const other = write('in/other.wav', 'RIFF-other');
  const refused = run('put', other, 'library/sound/sfx/water/water_splash_01.wav');
  assert.equal(refused.code, 1);
  assert.match(refused.out, /immutable/);
});

test('store paths must stay inside the store', () => {
  const {run, write} = setup();
  const src = write('in/a.wav', 'a');
  for (const bad of ['../escape.wav', '/abs/a.wav', 'library/../../x.wav', 'manifest.tsv']) {
    assert.equal(run('put', src, bad).code, 2, bad);
  }
});

test('use locks the file for an episode and fetch restores it after the cache is deleted', () => {
  const {store, repo, run, write} = setup();
  run('put', write('in/hum.wav', 'hum'), 'library/sound/ambience/room/room_hum_01.wav');
  const r = run('use', 'library/sound/ambience/room/room_hum_01.wav', 'public/audio/room/room_hum_01.wav', '--episode', 'demo');
  assert.equal(r.code, 0, r.out);
  const lock = JSON.parse(readFileSync(path.join(repo, 'src/videos/demo/assets.lock.json'), 'utf8'));
  assert.equal(lock['public/audio/room/room_hum_01.wav'].store, 'library/sound/ambience/room/room_hum_01.wav');
  assert.match(lock['public/audio/room/room_hum_01.wav'].sha256, /^[0-9a-f]{64}$/);

  const cached = path.join(repo, 'public/audio/room/room_hum_01.wav');
  assert.equal(readFileSync(cached, 'utf8'), 'hum');
  spawnSync('rm', [cached]);
  const f = run('fetch');
  assert.equal(f.code, 0, f.out);
  assert.equal(readFileSync(cached, 'utf8'), 'hum');
  assert.ok(existsSync(path.join(store, 'manifest.tsv')));
});

test('fetch and verify catch changed files instead of hiding them', () => {
  const {store, repo, run, write} = setup();
  run('put', write('in/hit.wav', 'hit'), 'library/sound/sfx/impact/impact_hit_01.wav');
  run('use', 'library/sound/sfx/impact/impact_hit_01.wav', 'public/sfx/impact/impact_hit_01.wav', '--episode', 'demo');

  // A cache copy edited in place is reported, not overwritten, unless --force.
  writeFileSync(path.join(repo, 'public/sfx/impact/impact_hit_01.wav'), 'edited');
  const f = run('fetch', 'demo');
  assert.equal(f.code, 1);
  assert.match(f.out, /differs/);
  assert.equal(run('fetch', 'demo', '--force').code, 0);
  assert.equal(readFileSync(path.join(repo, 'public/sfx/impact/impact_hit_01.wav'), 'utf8'), 'hit');

  assert.equal(run('verify').code, 0);
  // A stored file changed behind the manifest's back fails verify and blocks fetch.
  writeFileSync(path.join(store, 'library/sound/sfx/impact/impact_hit_01.wav'), 'tampered');
  const v = run('verify');
  assert.equal(v.code, 1);
  assert.match(v.out, /hash mismatch/);
  spawnSync('rm', [path.join(repo, 'public/sfx/impact/impact_hit_01.wav')]);
  assert.equal(run('fetch', 'demo').code, 1);
});

test('use refuses to repoint a locked public path unless asked', () => {
  const {run, write} = setup();
  run('put', write('in/a.wav', 'a'), 'library/sound/sfx/ui/ui_a_01.wav');
  run('put', write('in/b.wav', 'b'), 'library/sound/sfx/ui/ui_b_01.wav');
  assert.equal(run('use', 'library/sound/sfx/ui/ui_a_01.wav', 'public/sfx/ui/click.wav', '--episode', 'demo').code, 0);
  assert.equal(run('use', 'library/sound/sfx/ui/ui_b_01.wav', 'public/sfx/ui/click.wav', '--episode', 'demo').code, 1);
  assert.equal(run('use', 'library/sound/sfx/ui/ui_b_01.wav', 'public/sfx/ui/click.wav', '--episode', 'demo', '--replace').code, 0);
  assert.equal(run('use', 'library/sound/sfx/ui/missing.wav', 'public/sfx/ui/x.wav', '--episode', 'demo').code, 1);
  assert.equal(run('use', 'library/sound/sfx/ui/ui_a_01.wav', 'public/sfx/ui/y.wav', '--episode', 'nope').code, 1);
});
