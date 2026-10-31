import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
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

test('import copies a folder verbatim and is safe to re-run', () => {
  const {store, run, write} = setup();
  write('lib/sfx/water/a.wav', 'a');
  write('lib/sfx/water/a.json', '{}');
  write('lib/.DS_Store', 'x');
  write('lib/_mirror/a.wav', 'a');
  const lib = path.join(path.dirname(store), 'lib');
  const r = run('import', lib, 'library/sound', '--skip', '_mirror');
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /stored 2, already 0, updated 0, conflicts 0/);
  assert.match(run('import', lib, 'library/sound', '--skip', '_mirror').out, /stored 0, already 2/);
  assert.ok(!existsSync(path.join(store, 'library/sound/.DS_Store')));
  assert.ok(!existsSync(path.join(store, 'library/sound/_mirror')));
});

test('adopt reuses stored bytes, stores the rest under the project and reports missing files', () => {
  const {store, repo, run, write} = setup();
  run('put', write('in/hit.wav', 'hit'), 'library/sound/_raw/impact_hit_01_v2.wav');
  run('put', write('in/hit.wav', 'hit'), 'library/sound/sfx/impact/impact_hit_01.wav');
  write('repo/public/sfx/impact/hit.wav', 'hit');
  write('repo/public/pool-depth/shot.png', 'png');
  const r = run('adopt', 'demo', '--project', 'DEMO', 'public/sfx/impact/hit.wav', 'pool-depth/shot.png', 'public/sfx/gone.wav');
  assert.equal(r.code, 1);
  assert.match(r.out, /reused 1, stored 1, missing 1/);
  const lock = JSON.parse(readFileSync(path.join(repo, 'src/videos/demo/assets.lock.json'), 'utf8'));
  assert.equal(lock['public/sfx/impact/hit.wav'].store, 'library/sound/sfx/impact/impact_hit_01.wav');
  assert.equal(lock['public/pool-depth/shot.png'].store, 'projects/DEMO/public/pool-depth/shot.png');
  assert.ok(existsSync(path.join(store, 'projects/DEMO/public/pool-depth/shot.png')));
  assert.equal(run('verify').code, 0);
});

test('backfill-chat stores user-attached images with the user text, not tool screenshots', () => {
  const {store, run, write} = setup();
  const png = Buffer.from('fake-png').toString('base64');
  const lines = [
    {type: 'user', sessionId: 'abcdef1234', timestamp: '2026-10-29T13:59:27Z', message: {content: [
      {type: 'image', source: {type: 'base64', media_type: 'image/png', data: png}}, {type: 'text', text: 'ทำแบบนี้'}]}},
    {type: 'user', sessionId: 'abcdef1234', timestamp: '2026-10-29T14:00:00Z', message: {content: [
      {type: 'tool_result', content: [{type: 'image', source: {type: 'base64', media_type: 'image/png', data: png}}]}]}},
  ];
  const t = write('transcripts/s.jsonl', lines.map((l) => JSON.stringify(l)).join('\n'));
  const r = run('backfill-chat', t);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /chat images 1: stored 1/);
  const dir = path.join(store, 'projects/_unsorted/references/user');
  const side = JSON.parse(readFileSync(path.join(dir, readdirSync(dir).find((f) => f.endsWith('.json'))!), 'utf8'));
  assert.equal(side.user_text, 'ทำแบบนี้');
  assert.match(run('backfill-chat', t).out, /stored 0, already 1/);
});

test('archive files out/<ID>/ by project and commit, skips scratch and repeats, and lists folders without an ID', () => {
  const {store, run, write} = setup();
  write('repo/out/ZCPAINT-SHORT/ZCPAINT-SHORT.mp4', 'mp4-a');
  write('repo/out/ZCPAINT-SHORT/stills/0.png', 'png');
  write('repo/out/ZCPAINT-SHORT/qa/sheet.png', 'scratch');
  write('repo/out/gemini-tts/take.wav', 'take');
  write('repo/out/loose.mp4', 'loose');
  write('repo/out/bundle/x.png', 'scratch');
  const r = run('archive', 'ZCPAINT-SHORT', 'gemini-tts', 'loose.mp4', 'bundle');
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /archived 2, already stored 0, not archived 2/);
  assert.match(r.out, /gemini-tts \(1 of 1 media files not in the store/);
  const base = path.join(store, 'projects/ZCONDO/renders/ZCPAINT-SHORT');
  const [version] = readdirSync(base);
  assert.equal(readFileSync(path.join(base, version, 'ZCPAINT-SHORT.mp4'), 'utf8'), 'mp4-a');
  assert.ok(!existsSync(path.join(base, version, 'qa')));
  assert.match(run('archive', 'ZCPAINT-SHORT').out, /archived 0, already stored 2/);

  // A re-render with new bytes at the same version keeps both instead of failing.
  write('repo/out/ZCPAINT-SHORT/ZCPAINT-SHORT.mp4', 'mp4-b');
  assert.match(run('archive', 'ZCPAINT-SHORT').out, /archived 1/);
  assert.equal(readdirSync(path.join(base, version)).filter((f) => f.endsWith('.mp4')).length, 2);

  const takes = run('archive', '--path', path.join(path.dirname(store), 'repo/out/gemini-tts'), '--project', 'WFOG', '--kind', 'audio/gemini-tts');
  assert.match(takes.out, /archived 1/);
  assert.ok(existsSync(path.join(store, 'projects/WFOG/audio/gemini-tts/take.wav')));
  assert.equal(run('archive', '--path', 'x').code, 2);
  assert.equal(run('verify').code, 0);
});

test('metadata files may be replaced; media may not', () => {
  const {run, write} = setup();
  run('put', write('in/a.json', '{"v": 1}'), 'library/sound/INDEX.json');
  assert.match(run('put', write('in/b.json', '{"v": 2}'), 'library/sound/INDEX.json').out, /updated/);
  assert.equal(run('verify').code, 0);
});

test('sound-library file records the filed master in the store manifest', () => {
  const {store, run, write} = setup();
  write('store/library/sound/INDEX.md', '# Index\n');
  const wav = write('in/proc.wav', 'RIFF');
  write('in/proc.wav.json', '{"seconds": 1.2}');
  const r = spawnSync('python3', ['-I', path.resolve('scripts/sound-library.py'), 'file', wav, 'sfx/ui/ui_click-soft_01', '--description', 'soft click', '--tags', 'ui click'],
    {env: {...process.env, REELS_STORE: store, SOUND_LIBRARY: ''}, encoding: 'utf8'});
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(readFileSync(path.join(store, 'manifest.tsv'), 'utf8'), /library\/sound\/sfx\/ui\/ui_click-soft_01\.wav/);
  assert.match(readFileSync(path.join(store, 'library/sound/INDEX.md'), 'utf8'), /ui_click-soft_01/);
  assert.equal(run('verify').code, 0);
});
