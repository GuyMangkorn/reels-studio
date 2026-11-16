// test-scope: shared
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync, readFileSync} from 'node:fs';
import type {Brush} from '../src/painted/BrushCanvas';
import {BONE, drawFigure, shoulderHeight, type CastDef} from '../src/painted/kit/cast';
import {NEW_CUTS, hairFront, hairSide} from '../src/painted/kit/hair';
import type {Brow, Eyes, FaceState, Mouth} from '../src/painted/kit/head';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {PEOPLE, PEOPLE_INFO, PERSON_IDS} from '../src/painted/kit/people';
import {POSE_IDS, POSES, poseArms, shoulderAnchors} from '../src/painted/kit/poses';
import {paintedShotIds} from '../src/painted/registry';
import {timelineFrames} from '../src/scenes/timeline';
import {CAST} from '../src/painted/worldfog/cast';
import {collectEpisodes} from '../src/videos/registry';
import kitPeople from '../src/videos/kit-people';

// People library (src/painted/kit/people.ts): central template characters of the painted kit. Added 1 Nov 2026.
const OLD_CUTS = ['short', 'tied', 'bob', 'hood', 'long'];
const brush = new Proxy({}, {get: () => () => undefined}) as Brush;
const FACE: FaceState = {brow: 'flat', eyes: 'dot', look: [0, 0], mouth: 'smile'};

test('the library lists 10-14 templates covering men, women, children and older people, each with metadata', () => {
  assert.ok(PERSON_IDS.length >= 10 && PERSON_IDS.length <= 14, `${PERSON_IDS.length} people`);
  assert.deepEqual(Object.keys(PEOPLE_INFO).sort(), [...PERSON_IDS].sort());
  const of = (group: string, gender?: string) => PERSON_IDS.filter((id) => PEOPLE_INFO[id].group === group && (!gender || PEOPLE_INFO[id].gender === gender));
  assert.ok(of('working-age', 'male').length >= 3, 'working-age men');
  assert.ok(of('working-age', 'female').length >= 2, 'working-age women');
  assert.equal(of('child', 'male').length, 1);
  assert.equal(of('child', 'female').length, 1);
  assert.equal(of('older', 'male').length, 1);
  assert.equal(of('older', 'female').length, 1);
  for (const id of PERSON_IDS) {
    assert.match(id, /^[a-z]+-[a-z]+$/, 'stable English id');
    const info = PEOPLE_INFO[id];
    assert.ok(info.description.length > 30 && !info.description.includes('\n'), `${id} one-line description`);
    assert.ok(info.description.includes(PEOPLE[id].height.toFixed(2)), `${id} description states its height`);
  }
});

test('seeds are unique and outside the WFOG / ZC range; no recurring cast entry gained a people-library field', () => {
  const seeds = PERSON_IDS.map((id) => PEOPLE[id].seed);
  assert.equal(new Set(seeds).size, seeds.length);
  const used = Object.values(CAST).map((d) => d.seed);
  for (const s of seeds) assert.ok(!used.includes(s) && s >= 700, `seed ${s}`);
  for (const def of Object.values(CAST)) {
    assert.ok(OLD_CUTS.includes(def.head.cut), 'recurring cast keeps its cut');
    assert.equal(def.headScale, undefined);
    assert.equal(def.armScale, undefined);
    assert.equal(def.outfit.skirtHem, undefined);
    assert.equal(def.head.facial, undefined);
    assert.equal(def.head.glasses, undefined);
  }
});

test('children are 1.2-1.35 m with a smaller head and shorter arms; adults keep the 4-head rig', () => {
  for (const id of PERSON_IDS) {
    const def = PEOPLE[id], child = PEOPLE_INFO[id].group === 'child';
    if (child) {
      assert.ok(def.height >= 1.2 && def.height <= 1.35, `${id} height ${def.height}`);
      assert.ok(def.headScale! >= 0.85 && def.headScale! < 1 && def.armScale! >= 0.65 && def.armScale! < 0.85, `${id} scales`);
    } else {
      assert.equal(def.headScale, undefined);
      assert.equal(def.armScale, undefined);
      assert.ok(def.height >= 1.5 && def.height <= 1.85, `${id} height ${def.height}`);
    }
  }
});

test('every new cut has finite front and profile geometry and every head cut is known', () => {
  for (const cut of NEW_CUTS) {
    for (const hair of [hairFront(cut), hairSide(cut)]) {
      for (const poly of [...hair.hair, ...(hair.back ?? []), ...(hair.accent ?? [])]) {
        assert.ok(poly.length >= 4, `${cut} polygon`);
        for (const [x, y] of poly) assert.ok(Number.isFinite(x) && Number.isFinite(y) && Math.abs(x) < 2.2 && y > -2 && y < 2.2, `${cut} point ${x},${y}`);
      }
    }
  }
  for (const id of PERSON_IDS) assert.ok(([...OLD_CUTS, ...NEW_CUTS] as string[]).includes(PEOPLE[id].head.cut), id);
  assert.ok(new Set(PERSON_IDS.map((id) => PEOPLE[id].head.cut)).size >= 9, 'people use varied cuts');
});

test('every person draws in front, left and right with every face control, and the head and shoulder anchors are finite', () => {
  const brows: Brow[] = ['flat', 'up', 'worry', 'angry', 'quirk'], eyes: Eyes[] = ['dot', 'wide', 'half', 'shut'];
  const mouths: Mouth[] = ['flat', 'smile', 'o', 'wavy', 'frown', 'gasp', 'talk'];
  const g: Pt = [540, 1500], unit = 600;
  for (const id of PERSON_IDS) {
    const def = PEOPLE[id];
    for (const view of ['front', 'left', 'right'] as const) {
      for (const [i, mouth] of mouths.entries()) {
        const face: FaceState = {brow: brows[i % brows.length], eyes: eyes[i % eyes.length], look: [0.5, -0.2], mouth, open: 0.6, squint: 0.5};
        const a = drawFigure(makePainter(brush, {t: 0.3, frame: 9}), def, g, unit, {view, face}, 0.3);
        for (const v of [...a.head, ...a.rHand, ...a.lHand, a.headTop, a.chin]) assert.ok(Number.isFinite(v), `${id} ${view} ${mouth}`);
        assert.ok(a.headTop < a.chin && a.chin < g[1], `${id} head above feet`);
      }
    }
    // The head top sits at the character's height (the head is 1.17 K above its centre, as for the recurring cast).
    const a = drawFigure(makePainter(brush, {t: 0.3, frame: 9}), def, g, unit, {view: 'front', face: FACE}, 0.3);
    assert.ok(Math.abs((g[1] - a.headTop) / unit - def.height) < 0.03 * def.height, `${id} drawn height ${((g[1] - a.headTop) / unit).toFixed(3)} vs ${def.height}`);
  }
});

test('pose arms follow the arm scale: shoulder anchors match the drawn figure and no arm stretches past its bone', () => {
  const g: Pt = [540, 1500], unit = 600;
  for (const id of PERSON_IDS) {
    const def: CastDef = PEOPLE[id], k = def.armScale ?? 1;
    const S = shoulderAnchors(def);
    for (const pose of POSE_IDS) {
      const a = drawFigure(makePainter(brush, {t: 0, frame: 0}), def, g, unit, {view: 'front', face: FACE, ...poseArms(pose, def, g, unit)}, 0);
      assert.ok(Math.abs(a.rShoulder[1] - (g[1] - S.r[1] * unit)) < 1e-6 && Math.abs(a.rShoulder[0] - (g[0] + S.r[0] * unit)) < 1e-6, `${id} ${pose} shoulder anchor`);
      for (const side of ['r', 'l'] as const) {
        const arm = POSES[pose][side], upper = Math.hypot(arm.via[0], arm.via[1]) * k;
        assert.ok(upper <= BONE * k + 0.002, `${id} ${pose} ${side} upper arm ${upper.toFixed(3)}`);
      }
    }
    assert.ok(Math.abs(shoulderHeight(def) - S.r[1]) < 1e-9, `${id} shoulderHeight matches the pose anchor`);
    // P01 hang: the hands reach about crotch height, as on the adult rig (CP-L09).
    const hang = poseArms('P01', def, g, unit).rArm!.to;
    const handM = (g[1] - hang[1]) / unit;
    assert.ok(handM > 0.3 * def.height && handM < 0.45 * def.height, `${id} hanging hand at ${handM.toFixed(2)} m`);
  }
});

test('the kit stays episode-neutral: no kit module (except the catalog and env sheets) imports an episode module', () => {
  const dir = new URL('../src/painted/kit/', import.meta.url);
  for (const file of readdirSync(dir).filter((f) => /\.tsx?$/.test(f) && !['catalog.tsx', 'env-sheet.tsx'].includes(f))) {
    const text = readFileSync(new URL(file, dir), 'utf8');
    assert.doesNotMatch(text, /from '\.\.\/(worldfog|zcpaint|bloop|shipwreck|hanako|kuchisake|nyos|spike)\//, `${file} imports an episode module`);
  }
});

test('KIT-PEOPLE-TALK is a registered, valid 3.5 s painted clip', () => {
  assert.ok(paintedShotIds.includes('kit-people-talk'));
  const [{episode, videos}] = collectEpisodes([kitPeople]);
  assert.equal(episode, 'kit-people');
  assert.equal(videos[0].id, 'KIT-PEOPLE-TALK');
  assert.equal(timelineFrames(videos[0].timeline, 30), 105);
});

test('every PEOPLE head carries a face look (the bare round-eye face is for episode casts only)', () => {
  for (const id of PERSON_IDS) assert.ok(PEOPLE[id].head.look, `${id} has no head.look`);
});
