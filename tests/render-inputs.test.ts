import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {segmentKeys, sourceHash} from '../scripts/segments.mjs';

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
    assert.notEqual(f.hash('A', remote), f.hash('A', remote));
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
    assert.notEqual(f.hash(), f.hash());
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
    assert.notEqual(f.hash(), f.hash(), 'a shadowing parameter must not resolve to the outer constant');
    f.put('src/shared.ts', "declare function staticFile(s:string):string; const BASE = {src:'other'}; const CARD = {src:'poster',...BASE} as const; export const image = () => staticFile(CARD.src);");
    assert.notEqual(f.hash(), f.hash(), 'an overriding spread is not a proven literal');
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
    assert.notEqual(f.hash('UNKNOWN'), f.hash('UNKNOWN'));
    const missing = {media: {src: 'missing.png'}};
    assert.notEqual(f.hash('A', missing), f.hash('A', missing));
    f.put('src/painted/shots/a.ts', "import './missing'; export const aShots = [{id:'A-SH01'}];");
    assert.notEqual(f.hash(), f.hash());
  } finally {f.dispose();}
});

test('dynamic dependency discovery bypasses reuse instead of guessing', () => {
  const f = fixture();
  try {
    f.put('src/shared.ts', "export const load = (name:string) => import(name);");
    assert.notEqual(f.hash(), f.hash());
  } finally {f.dispose();}
});

test('authoring-only caption edits preserve the source digest and existing per-scene reuse', () => {
  const f = fixture();
  try {
    const source = f.hash();
    f.put('src/videos/a/index.ts', "export default {episode:'a', videos:[{id:'A', note:'new caption authored'}]};");
    assert.equal(f.hash(), source, 'serialized props already account for authoring changes');
    const timeline = Array.from({length: 5}, () => ({durationSec: 1, subtitle: 'old'}));
    const composition = {id: 'A', width: 1080, height: 1920, fps: 30, durationInFrames: 150, props: {timeline}};
    const before = segmentKeys(composition, {}, {}, source);
    const edited = timeline.map((scene, i) => i === 2 ? {...scene, subtitle: 'new'} : scene);
    const after = segmentKeys({...composition, props: {timeline: edited}}, {}, {}, f.hash());
    assert.deepEqual(before.flatMap((key, i) => key === after[i] ? [] : [i]), [2]);
  } finally {f.dispose();}
});
