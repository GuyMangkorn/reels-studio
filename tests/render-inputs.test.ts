import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {describeReasons, repaintReasons, segmentKeys, sourceHash, sourceInputs} from '../scripts/segments.mjs';

const fixture = () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'reels-inputs-'));
  const put = (file: string, text: string) => {
    mkdirSync(path.dirname(path.join(root, file)), {recursive: true});
    writeFileSync(path.join(root, file), text);
  };
  put('package.json', '{}');
  put('package-lock.json', '{}');
  put('src/index.ts', "import './shared'; import './painted/registry';");
  put('src/shared.ts', 'export const shared = 1;');
  put('src/painted/kit/character.ts', "import palette from './palette.json'; export const character = palette;");
  put('src/painted/kit/palette.json', '{"ink":"black"}');
  put('src/painted/shots/a.ts', "import {character} from '../kit/character'; export const aShots = [{id:'A-SH01', character}];");
  put('src/painted/shots/b.ts', "import {character} from '../kit/character'; export const bShots = [{id:'B-SH01', character}];");
  put('src/painted/shots/c.ts', "export const cShots = [{id:'C-SH01'}];");
  put('src/painted/registry.ts', "import {aShots} from './shots/a'; import {bShots} from './shots/b'; import {cShots} from './shots/c'; export const paintedShots = Object.fromEntries([...aShots,...bShots,...cShots].map(s=>[s.id,s]));");
  for (const name of ['a', 'b', 'c']) {
    const id = name.toUpperCase();
    put(`src/videos/${name}/index.ts`, `export default {episode:'${name}', videos:[{id:'${id}'}]};`);
    put(`src/videos/${name}/assets.lock.json`, '{}');
  }
  const hash = (id = 'A', extra = {}) => {
    const timeline = [{durationSec: 1, painted: {shots: [{shot: `${id}-SH01`, atSec: 0}]}}];
    return sourceHash(root, {
      id, width: 1080, height: 1920, fps: 30, durationInFrames: 30,
      props: {timeline, ...extra},
    });
  };
  return {root, put, hash, dispose: () => rmSync(root, {recursive: true, force: true})};
};

test('unrelated project art and locks preserve the selected project digest', () => {
  const f = fixture();
  try {
    const before = f.hash();
    assert.equal(f.hash(), before, 'known inputs must reuse, not bypass');
    f.put('src/painted/shots/b.ts', "export const bShots = [{id:'B-SH01', colour:'red'}];");
    f.put('src/videos/b/assets.lock.json', '{"changed":"other project"}');
    assert.equal(f.hash(), before);
    f.put('src/painted/shots/a.ts', "export const aShots = [{id:'A-SH01', colour:'blue'}];");
    assert.notEqual(f.hash(), before);
  } finally {f.dispose();}
});

test('a transitive shared character edit invalidates both consumers but not a third project', () => {
  const f = fixture();
  try {
    const before = ['A', 'B', 'C'].map(id => f.hash(id));
    f.put('src/painted/kit/palette.json', '{"ink":"blue"}');
    assert.notEqual(f.hash('A'), before[0]);
    assert.notEqual(f.hash('B'), before[1]);
    assert.equal(f.hash('C'), before[2]);
    f.put('src/shared.ts', 'export const shared = 2;');
    assert.notEqual(f.hash('C'), before[2], 'shared renderer changes invalidate all consumers');
  } finally {f.dispose();}
});

test('selected locks, effective props media, code media and build settings track file contents', () => {
  const f = fixture();
  try {
    f.put('public/image.png', 'original');
    f.put('public/fonts/font.ttf', 'font one');
    f.put('src/shared.ts', "export const font = 'fonts/font.ttf';");
    const props = {media: {src: 'image.png'}};
    let before = f.hash('A', props);
    f.put('public/image.png', 'changed without a lock update');
    assert.notEqual(f.hash('A', props), before);
    before = f.hash('A', props);
    f.put('public/fonts/font.ttf', 'font two');
    assert.notEqual(f.hash('A', props), before);
    before = f.hash('A', props);
    f.put('src/videos/a/assets.lock.json', '{"public/image.png":{"sha256":"updated-lock"}}');
    assert.notEqual(f.hash('A', props), before);
    before = f.hash();
    f.put('remotion.config.ts', 'export const config = 1;');
    assert.notEqual(f.hash(), before);
    before = f.hash();
    f.put('scripts/render.mjs', '// a new CLI flag');
    f.put('package.json', '{"scripts":{"new":"true"}}');
    assert.equal(f.hash(), before, 'render tooling and package scripts do not change pixels');
  } finally {f.dispose();}
});

test('extensionless image contents invalidate pictures and remote src bypasses reuse', () => {
  const f = fixture();
  try {
    f.put('public/image', 'one');
    const props = {media: [{kind: 'image', src: 'image'}]};
    const before = f.hash('A', props);
    assert.equal(f.hash('A', props), before);
    f.put('public/image', 'two');
    assert.notEqual(f.hash('A', props), before);
    const remote = {media: [{kind: 'image', src: 'https://example.com/image?id=1'}]};
    assert.equal(f.hash('A', remote), null);
  } finally {f.dispose();}
});

test('import-equals dependencies cannot silently reuse an old digest', () => {
  const f = fixture();
  try {
    f.put('src/shared.ts', "import palette = require('./palette'); export const shared = palette;");
    f.put('src/palette.ts', 'export const ink = 1;');
    const before = f.hash();
    f.put('src/palette.ts', 'export const ink = 2;');
    assert.notEqual(f.hash(), before);
  } finally {f.dispose();}
});

test('computed staticFile paths bypass reuse when their inputs cannot be proven', () => {
  const f = fixture();
  try {
    f.put('src/shared.ts', "declare function staticFile(s:string):string; export const image = (name:string) => staticFile('images/' + name + '.png');");
    assert.equal(f.hash(), null);
  } finally {f.dispose();}
});

test('readonly local picture metadata resolves without bypassing project reuse', () => {
  const f = fixture();
  try {
    f.put('public/poster', 'poster one');
    f.put('src/shared.ts', "declare function staticFile(s:string):string; const CARD = {src:'poster'} as const; export const image = () => staticFile(CARD.src);");
    const before = f.hash();
    assert.equal(f.hash(), before, 'readonly source metadata is a known input');
    f.put('public/poster', 'poster two');
    assert.notEqual(f.hash(), before);
    f.put('src/shared.ts', "declare function staticFile(s:string):string; const CARD = {src:'poster'} as const; export const image = (CARD:{src:string}) => staticFile(CARD.src);");
    assert.equal(f.hash(), null, 'a shadowing parameter must not resolve to the outer constant');
    f.put('src/shared.ts', "declare function staticFile(s:string):string; const BASE = {src:'other'}; const CARD = {src:'poster',...BASE} as const; export const image = () => staticFile(CARD.src);");
    assert.equal(f.hash(), null, 'an overriding spread is not a proven literal');
  } finally {f.dispose();}
});

test('sound paths, bytes and sound-only lock edits preserve all picture keys', () => {
  const f = fixture();
  try {
    f.put('public/sound.wav', 'sound one');
    const props = {audio: [{src: 'sound.wav'}], narration: {src: 'sound.wav', amplitude: [0.5]}};
    const before = f.hash('A', props);
    f.put('public/sound.wav', 'sound two');
    assert.equal(f.hash('A', props), before);
    f.put('src/videos/a/assets.lock.json', '{"public/other.wav":{"sha256":"sound-only-change"}}');
    assert.equal(f.hash('A', {audio: [{src: 'other.wav'}], narration: props.narration}), before);
    const timeline = [{durationSec: 1, painted: {shots: [{shot: 'A-SH01', atSec: 0}]}, sfx: [{src: 'missing-sound.wav', atSec: 0}]}];
    assert.equal(f.hash('A', {...props, timeline}), before);
  } finally {f.dispose();}
});

test('unknown ownership, unresolved imports and missing media bypass reuse', () => {
  const f = fixture();
  try {
    assert.equal(f.hash('UNKNOWN'), null);
    const missing = {media: {src: 'missing.png'}};
    assert.equal(f.hash('A', missing), null);
    f.put('src/painted/shots/a.ts', "import './missing'; export const aShots = [{id:'A-SH01'}];");
    assert.equal(f.hash(), null);
  } finally {f.dispose();}
});

test('dynamic dependency discovery bypasses reuse instead of guessing', () => {
  const f = fixture();
  try {
    f.put('src/shared.ts', "export const load = (name:string) => import(name);");
    assert.equal(f.hash(), null);
  } finally {f.dispose();}
});

test('authoring-only caption edits preserve the source digest and existing per-scene reuse', () => {
  const f = fixture();
  try {
    const source = f.hash() ?? assert.fail('known inputs must not bypass');
    f.put('src/videos/a/index.ts', "export default {episode:'a', videos:[{id:'A', note:'new caption authored'}]};");
    assert.equal(f.hash(), source, 'serialized props already account for authoring changes');
    const timeline = Array.from({length: 5}, () => ({durationSec: 1, subtitle: 'old'}));
    const composition = {id: 'A', width: 1080, height: 1920, fps: 30, durationInFrames: 150, props: {timeline}};
    const before = segmentKeys(composition, {}, {}, source);
    const edited = timeline.map((scene, i) => i === 2 ? {...scene, subtitle: 'new'} : scene);
    const after = segmentKeys({...composition, props: {timeline: edited}}, {}, {}, f.hash() ?? assert.fail('known inputs must not bypass'));
    assert.deepEqual(before.flatMap((key, i) => key === after[i] ? [] : [i]), [2]);
  } finally {f.dispose();}
});

// Episode D keeps each shot in its own file named after the shot, imported by the inventory (shot-own code).
const perShot = (f: ReturnType<typeof fixture>) => {
  f.put('src/painted/d/D-SH01.ts', "import {character} from '../kit/character'; export const shot = {id:'D-SH01', character, pose:1};");
  f.put('src/painted/d/D-SH02.ts', "import {eye} from '../kit/eye'; export const shot = {id:'D-SH02', eye, pose:1};");
  f.put('src/painted/d/D-SH03.ts', "export const shot = {id:'D-SH03', pose:1};");
  f.put('src/painted/kit/eye.ts', 'export const eye = 1;');
  f.put('src/painted/shots/d.ts', "import {shot as one} from '../d/D-SH01'; import {shot as two} from '../d/D-SH02'; import {shot as three} from '../d/D-SH03'; export const dShots = [one, two, three];");
  f.put('src/painted/registry.ts', "import {aShots} from './shots/a'; import {dShots} from './shots/d'; export const paintedShots = Object.fromEntries([...aShots,...dShots].map(s=>[s.id,s]));");
  f.put('src/videos/d/index.ts', "export default {episode:'d', videos:[{id:'D'}]};");
  const timeline = ['D-SH01', 'D-SH02', 'D-SH03'].map(shot => ({durationSec: 1, painted: {shots: [{shot, atSec: 0}]}}));
  const composition = {id: 'D', width: 1080, height: 1920, fps: 30, durationInFrames: 90, props: {timeline, ending: 'A_fade'}};
  const inputs = () => sourceInputs(f.root, composition) ?? assert.fail('known inputs must not bypass');
  const keys = () => {const i = inputs(); return segmentKeys(composition, {}, {}, i.hash, i.scenes);};
  const changed = (a: string[], b: string[]) => a.flatMap((key, i) => key === b[i] ? [] : [i]);
  return {inputs, keys, changed};
};

test('a shot-own file edit repaints only the scene showing that shot', () => {
  const f = fixture();
  try {
    const d = perShot(f);
    const before = d.keys();
    f.put('src/painted/d/D-SH02.ts', "import {eye} from '../kit/eye'; export const shot = {id:'D-SH02', eye, pose:2};");
    assert.deepEqual(d.changed(before, d.keys()), [1]);
  } finally {f.dispose();}
});

test('shared art repaints every scene that uses it, and only those', () => {
  const f = fixture();
  try {
    const d = perShot(f);
    let before = d.keys();
    f.put('src/painted/kit/palette.json', '{"ink":"blue"}');
    assert.deepEqual(d.changed(before, d.keys()), [0], 'the character reaches only D-SH01');
    before = d.keys();
    f.put('src/shared.ts', 'export const shared = 2;');
    assert.deepEqual(d.changed(before, d.keys()), [0, 1, 2], 'shared renderer code reaches every scene');
  } finally {f.dispose();}
});

test('a loop ending carries the first shot\'s code into the last scene', () => {
  const f = fixture();
  try {
    const d = perShot(f);
    const i = d.inputs();
    const timeline = ['D-SH01', 'D-SH02', 'D-SH03'].map(shot => ({durationSec: 1, painted: {shots: [{shot, atSec: 0}]}}));
    const composition = {id: 'D', width: 1080, height: 1920, fps: 30, durationInFrames: 90, props: {timeline, ending: 'C_seamless'}};
    const edited = [i.scenes[0] + 'x', i.scenes[1], i.scenes[2]];
    const before = segmentKeys(composition, {}, {}, i.hash, i.scenes), after = segmentKeys(composition, {}, {}, i.hash, edited);
    assert.deepEqual(d.changed(before, after), [0, 2]);
  } finally {f.dispose();}
});

test('a shot file that shared code imports stays shared', () => {
  const f = fixture();
  try {
    const d = perShot(f);
    f.put('src/shared.ts', "import {shot} from './painted/d/D-SH03'; export const shared = shot;");
    const before = d.keys();
    assert.equal(d.inputs().scenes[2], '', 'D-SH03 is no longer shot-own');
    f.put('src/painted/d/D-SH03.ts', "export const shot = {id:'D-SH03', pose:2};");
    assert.deepEqual(d.changed(before, d.keys()), [0, 1, 2]);
  } finally {f.dispose();}
});

test('episodes without shot-own files keep their keys', () => {
  const f = fixture();
  try {
    const painted = {id: 'A', width: 1080, height: 1920, fps: 30, durationInFrames: 30,
      props: {timeline: [{durationSec: 1, painted: {shots: [{shot: 'A-SH01', atSec: 0}]}}]}};
    const i = sourceInputs(f.root, painted) ?? assert.fail('known inputs must not bypass');
    assert.deepEqual(i.scenes, ['']);
    const timeline = Array.from({length: 3}, () => ({durationSec: 1}));
    const composition = {id: 'A', width: 1080, height: 1920, fps: 30, durationInFrames: 90, props: {timeline}};
    assert.deepEqual(segmentKeys(composition, {}, {}, i.hash, ['', '', '']), segmentKeys(composition, {}, {}, i.hash));
  } finally {f.dispose();}
});

test('an inventory that computes with shot files keeps them shared, with a warning', () => {
  const f = fixture();
  try {
    const d = perShot(f);
    f.put('src/painted/shots/d.ts', "import {shot as one} from '../d/D-SH01'; import {shot as two} from '../d/D-SH02'; import {shot as three} from '../d/D-SH03'; export const dShots = [one, two, three].map(s => ({...s, pose: two.pose}));");
    const i = d.inputs();
    assert.deepEqual(i.scenes, ['', '', '']);
    assert.ok(i.warnings.some(w => w.includes('D-SH02') && w.includes('counts as shared')), i.warnings.join('\n'));
    const before = d.keys();
    f.put('src/painted/d/D-SH02.ts', "import {eye} from '../kit/eye'; export const shot = {id:'D-SH02', eye, pose:2};");
    assert.deepEqual(d.changed(before, d.keys()), [0, 1, 2]);
  } finally {f.dispose();}
});

test('an inventory imported by shared code other than the registry keeps its shot files shared', () => {
  const f = fixture();
  try {
    const d = perShot(f);
    f.put('src/shared.ts', "import {dShots} from './painted/shots/d'; export const shared = dShots.length;");
    const i = d.inputs();
    assert.deepEqual(i.scenes, ['', '', '']);
    assert.ok(i.warnings.some(w => w.includes('src/shared.ts imports its inventory')), i.warnings.join('\n'));
  } finally {f.dispose();}
});

test('a shot file named almost like its shot is shared and named in a warning', () => {
  const f = fixture();
  try {
    const d = perShot(f);
    f.put('src/painted/d/d_sh03.ts', "export const shot = {id:'D-SH03', pose:1};");
    f.put('src/painted/shots/d.ts', "import {shot as one} from '../d/D-SH01'; import {shot as two} from '../d/D-SH02'; import {shot as three} from '../d/d_sh03'; export const dShots = [one, two, three];");
    const i = d.inputs();
    assert.equal(i.scenes[2], '');
    assert.ok(i.warnings.some(w => w.includes('d_sh03') && w.includes('rename it to the shot ID')), i.warnings.join('\n'));
  } finally {f.dispose();}
});

test('a shot file that imports another shot file repaints both shots when the imported one changes', () => {
  const f = fixture();
  try {
    const d = perShot(f);
    f.put('src/painted/d/D-SH01.ts', "import {character} from '../kit/character'; import {shot as next} from './D-SH02'; export const shot = {id:'D-SH01', character, pose:next.pose};");
    const before = d.keys();
    assert.deepEqual(d.inputs().own, [['src/painted/d/D-SH01.ts'], ['src/painted/d/D-SH02.ts'], ['src/painted/d/D-SH03.ts']]);
    f.put('src/painted/d/D-SH02.ts', "import {eye} from '../kit/eye'; export const shot = {id:'D-SH02', eye, pose:2};");
    assert.deepEqual(d.changed(before, d.keys()), [0, 1]);
  } finally {f.dispose();}
});

test('repaint reasons name the input that changed', () => {
  const ranges = [[0, 29], [30, 59], [60, 89]];
  const previous = {source: 's1', scenes: ranges.map((range, i) => ({range, key: `k${i}`, ...(i === 1 ? {code: 'c1'} : {})}))};
  const current = {source: 's1', scenes: ['', 'c2', ''], own: [[], ['src/painted/d/D-SH02.ts'], []], keys: ['k0', 'k1x', 'k2x'], ranges};
  assert.deepEqual(repaintReasons(previous, current, [0, 1, 2]),
    ['segment missing from the cache', 'shot file src/painted/d/D-SH02.ts', 'timeline, neighbour or render options']);
  assert.deepEqual(repaintReasons(previous, {...current, source: 's2'}, [0]), ['shared code or art']);
  assert.deepEqual(repaintReasons(previous, {...current, ranges: [[0, 29], [30, 59], [60, 99]]}, [0]), ['video length or scene count']);
  assert.deepEqual(repaintReasons(undefined, current, [0]), ['first render']);
  assert.equal(describeReasons([1, 2], ['shared code or art', 'shared code or art']), 'shared code or art → scenes 2, 3');
});
