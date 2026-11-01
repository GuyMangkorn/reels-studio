import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {drawFigure} from '../src/painted/kit/cast';
import {EXPRESSIONS} from '../src/painted/kit/expressions';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {PEOPLE, PERSON_IDS, type PersonId} from '../src/painted/kit/people';
import {ALL_POSE_IDS, hasView} from '../src/painted/kit/poses';
import {POV_POSES, SHOT_TEMPLATE_IDS, SHOT_TEMPLATE_INFO, drawShotTemplate, headPoint, povShot, sideWalk, talkingCloseUp, threeShot, twoShot, type CastMember, type ShotTemplate} from '../src/painted/kit/shot-templates';
import {TEMPLATE_REEL, TEMPLATE_SCENE_SEC} from '../src/painted/kit/template-reel';
import {paintedShotIds, paintedShots} from '../src/painted/registry';
import {collectEpisodes} from '../src/videos/registry';
import kitTemplates from '../src/videos/kit-shot-templates';

// Shot templates (`kit/shot-templates.ts`) and the KIT-SHOT-TEMPLATES reel (`kit/template-reel.ts`). Added 1 Nov 2026 (pass 3).
const g: Pt = [540, 1560], unit = 540;
const TIMES = [0, 0.4, 1, 1.7, 2, 3];

const finiteDeep = (v: unknown, path = ''): void => {
  if (typeof v === 'number') assert.ok(Number.isFinite(v), `${path} = ${v}`);
  else if (Array.isArray(v)) v.forEach((x, i) => finiteDeep(x, `${path}[${i}]`));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) finiteDeep(x, `${path}.${k}`);
};
const recorder = () => {
  const log: string[] = [];
  const brush = new Proxy({}, {get: (_t, name) => (...args: unknown[]) => { log.push(`${String(name)}${JSON.stringify(args)}`); }}) as Brush;
  return {brush, log};
};
const mute = new Proxy({}, {get: () => () => undefined}) as Brush;

/** Screen point of a composition point under a camera (camera.tsx `toScreen`, without the import). */
const screenOf = (c: ShotTemplate['camera'], [x, y]: Pt): Pt => [(x - c.fx) * c.s + c.fx + c.dx, (y - c.fy) * c.s + c.fy + c.dy];

const one = (person: PersonId, extra: Partial<CastMember> = {}): CastMember => ({person, ...extra});

test('every template is finite, pure and draws through the painter for every person', () => {
  for (const id of PERSON_IDS) {
    const other = id === 'woman-ponytail' ? 'man-crop' : 'woman-ponytail';
    for (const t of TIMES) {
      const builds: ShotTemplate[] = [
        twoShot({cast: [one(id), one(other)], t, g, unit}),
        twoShot({cast: [one(id), one(other)], t, g, unit, layout: 'side-by-side', speaker: 1}),
        threeShot({cast: [one(id), one(other), one(id, {outfit: 'police'})], t, g, unit, speaker: 1}),
        talkingCloseUp({cast: [one(id)], t, g, unit, amp: () => 0.6}),
        sideWalk({cast: [one(id)], t, g, unit, dir: 'left'}),
        povShot({cast: [one(id, {pose: 'P41'})], t, g: [540, 1880], unit}),
      ];
      for (const tpl of builds) {
        finiteDeep(tpl, `${id} t=${t}`);
        assert.ok(tpl.layers.length > 0);
      }
      assert.deepEqual(twoShot({cast: [one(id), one(other)], t, g, unit}), twoShot({cast: [one(id), one(other)], t, g, unit}), `${id} pure`);
    }
    const rec = recorder();
    drawShotTemplate(makePainter(rec.brush, {t: 0.5, frame: 15}), threeShot({cast: [one(id), one(other), one(id)], t: 0.5, g, unit}), 0.5);
    assert.ok(rec.log.length > 0, `${id} drawn`);
    drawShotTemplate(makePainter(mute, {t: 0, frame: 0}), talkingCloseUp({cast: [one(id)], t: 1, g, unit}), 1);
  }
});

test('two-shot face-off: the figures face each other in profile; side by side both stand front on', () => {
  const faceOff = twoShot({cast: [one('man-parted'), one('woman-ponytail')], t: 0, g, unit, gap: 1.2});
  const [l, r] = faceOff.layers;
  assert.equal(l.view, 'right');
  assert.equal(r.view, 'left');
  assert.ok(l.g[0] < r.g[0]);
  assert.ok(Math.abs(r.g[0] - l.g[0] - 1.2 * unit) < 1e-9, 'gap is centre to centre');
  assert.equal(l.unit, unit);
  assert.equal(l.g[1], g[1]);
  const side = twoShot({cast: [one('man-parted'), one('woman-ponytail')], t: 0, g, unit, layout: 'side-by-side'});
  assert.deepEqual(side.layers.map((x) => x.view), ['front', 'front']);
  assert.ok(Math.abs(side.layers[1].g[0] - side.layers[0].g[0] - 0.9 * unit) < 1e-9);
});

test('two-shot: the speaker talks with the mouth from amp, the listener keeps its own expression', () => {
  const tpl = twoShot({cast: [one('man-parted'), one('woman-ponytail', {expression: 'worried'})], t: 1, g, unit, speaker: 0, amp: () => 0.5});
  assert.equal(tpl.layers[0].pose.face.mouth, 'talk');
  assert.equal(tpl.layers[0].pose.face.open, 0.5);
  assert.equal(tpl.layers[1].pose.face.mouth, EXPRESSIONS.worried.mouth);
  assert.equal(tpl.layers[1].pose.face.open, undefined);
});

test('three-shot: the middle figure stands front on and is drawn last; the outer two are profiles facing in', () => {
  const tpl = threeShot({cast: [one('woman-ponytail'), one('man-parted'), one('boy-school')], t: 0, g, unit: 420});
  assert.deepEqual(tpl.layers.map((l) => l.view), ['right', 'left', 'front']);
  assert.equal(tpl.layers[2].g[0], g[0]);
  assert.ok(tpl.layers[0].g[0] < g[0] && g[0] < tpl.layers[1].g[0]);
  assert.equal(tpl.layers[0].unit, 420);
});

test('talking close-up: the head stays on headAt while the camera pushes in, and the mouth follows amp', () => {
  const amp = (t: number) => Math.min(1, t / 2);
  const head = headPoint('woman-ponytail', g, unit);
  for (const t of TIMES) {
    const tpl = talkingCloseUp({cast: [one('woman-ponytail')], t, g, unit, amp});
    const at = screenOf(tpl.camera, head);
    assert.ok(Math.abs(at[0] - 540) < 1e-9 && Math.abs(at[1] - 900) < 1e-9, `head on screen at t=${t}: ${at}`);
    assert.equal(tpl.layers[0].pose.face.mouth, 'talk');
    assert.ok(Math.abs(tpl.layers[0].pose.face.open! - amp(t)) < 1e-12, `mouth at t=${t}`);
  }
  assert.ok(talkingCloseUp({cast: [one('woman-ponytail')], t: 2, g, unit}).camera.s > talkingCloseUp({cast: [one('woman-ponytail')], t: 0, g, unit}).camera.s);
  assert.equal(talkingCloseUp({cast: [one('woman-ponytail')], t: 0, g, unit}).camera.s, 3.2);
});

test('headPoint is the head centre drawFigure paints, for every person', () => {
  const mute2 = mute;
  for (const id of PERSON_IDS) {
    const anchors = drawFigure(makePainter(mute2, {t: 0, frame: 0}), PEOPLE[id], g, unit, {view: 'front', face: EXPRESSIONS.neutral}, 0.4, PEOPLE[id].seed);
    const h = headPoint(id, g, unit);
    assert.ok(Math.abs(anchors.head[0] - h[0]) < 1e-6 && Math.abs(anchors.head[1] - h[1]) < 1e-6, `${id}: ${anchors.head} vs ${h}`);
  }
});

test('side walk: enters from off screen left and stops at g; with follow 1 the walker holds its screen place', () => {
  const at = (t: number) => {
    const tpl = sideWalk({cast: [one('man-spiky')], t, g, unit, dir: 'right', distance: 2, follow: 1});
    return {x: tpl.layers[0].g[0] + tpl.camera.dx, layer: tpl.layers[0], cam: tpl.camera};
  };
  assert.equal(at(0).layer.view, 'right');
  assert.ok(Math.abs(at(0).layer.g[0] - (g[0] - 2 * unit)) < 1e-9, 'starts 2 m left of g');
  for (const t of [0, 0.3, 0.9, 1.4, 1.9, 2.5, 4]) assert.ok(Math.abs(at(t).x - g[0]) < 1e-9, `walker holds its screen place at t=${t}`);
  assert.equal(at(4).layer.g[0], g[0], 'stops at g');
  assert.equal(at(4).cam.dx, 0, 'camera settles');
  assert.ok(at(0.9).layer.pose.walk! > 0 && at(0.9).layer.pose.stride! > 0, 'walking at 0.9 s');
  assert.equal(at(4).layer.pose.stride, 0, 'stride eases to 0 at rest');
  // A still camera: follow 0 leaves the walker moving across the frame.
  const still = (t: number) => sideWalk({cast: [one('man-spiky')], t, g, unit, follow: 0});
  assert.equal(still(0).camera.dx, 0);
  assert.ok(Math.abs(still(0).layers[0].g[0] + still(0).camera.dx - g[0]) > 100, 'walker moves on screen with follow 0');
  // Left: mirror image, off screen right.
  const left = sideWalk({cast: [one('man-spiky')], t: 0, g, unit, dir: 'left', distance: 2});
  assert.equal(left.layers[0].view, 'left');
  assert.ok(Math.abs(left.layers[0].g[0] - (g[0] + 2 * unit)) < 1e-9);
  // The camera never leaves the street washes: at most the walk distance in px.
  for (const t of TIMES) assert.ok(Math.abs(sideWalk({cast: [one('man-spiky')], t, g, unit, distance: 2}).camera.dx) <= 2 * unit + 1e-9);
});

test('POV: the other person is nearer the lens (unit x closeness), faces the viewer, and the head does not move on screen', () => {
  const tpl = (t: number, pose?: CastMember['pose']) => povShot({cast: [one('man-buzz', pose ? {pose} : {})], t, g: [540, 1880], unit});
  const head = headPoint('man-buzz', [540, 1880], unit * 1.35);
  for (const t of TIMES) {
    const p = tpl(t);
    assert.equal(p.layers[0].unit, unit * 1.35);
    assert.equal(p.layers[0].view, 'front');
    const at = screenOf(p.camera, head);
    assert.ok(Math.abs(at[0] - head[0]) < 1e-9 && Math.abs(at[1] - head[1]) < 1e-9, `head fixed at t=${t}`);
  }
  assert.ok(tpl(2).camera.s > tpl(0).camera.s, 'pushes in');
  assert.deepEqual(POV_POSES, ['P13', 'P14', 'P16', 'P41']);
  const poses = POV_POSES.map((id) => tpl(1, id).layers[0].pose);
  assert.equal(new Set(poses.map((x) => JSON.stringify(x))).size, POV_POSES.length, 'each POV pose draws differently');
  assert.deepEqual(tpl(1).layers[0].pose, tpl(1, 'P16').layers[0].pose, 'default pose is P16');
  assert.throws(() => povShot({cast: [one('man-buzz', {pose: 'P01'})], t: 0, g, unit}), /does not face the viewer/);
});

test('cast size is checked: a template given the wrong number of members throws', () => {
  assert.throws(() => twoShot({cast: [one('man-crop')], t: 0, g, unit}), /twoShot takes 2 cast members, got 1/);
  assert.throws(() => threeShot({cast: [one('man-crop'), one('man-crop')], t: 0, g, unit}), /threeShot takes 3 cast members, got 2/);
  assert.throws(() => talkingCloseUp({cast: [one('man-crop'), one('man-crop')], t: 0, g, unit}), /talkingCloseUp takes 1 cast member, got 2/);
  assert.throws(() => sideWalk({cast: [], t: 0, g, unit}), /sideWalk takes 1 cast member, got 0/);
  assert.throws(() => povShot({cast: [one('man-crop'), one('man-crop')], t: 0, g, unit}), /povShot takes 1 cast member, got 2/);
});

test('two figures of one id get distinct seeds, so their fills never match', () => {
  const tpl = twoShot({cast: [one('man-crop'), one('man-crop')], t: 0, g, unit});
  assert.equal(tpl.layers[0].seed, PEOPLE['man-crop'].seed);
  assert.equal(tpl.layers[1].seed, PEOPLE['man-crop'].seed + 1000);
});

test('every template moves: its camera or a figure changes between 0 s and 1 s', () => {
  const sets: [string, () => ShotTemplate, () => ShotTemplate][] = [
    ['two-shot', () => twoShot({cast: [one('man-crop'), one('woman-pixie')], t: 0, g, unit}), () => twoShot({cast: [one('man-crop'), one('woman-pixie')], t: 1, g, unit})],
    ['three-shot', () => threeShot({cast: [one('man-crop'), one('woman-pixie'), one('boy-school')], t: 0, g, unit}), () => threeShot({cast: [one('man-crop'), one('woman-pixie'), one('boy-school')], t: 1, g, unit})],
    ['talking-close-up', () => talkingCloseUp({cast: [one('man-crop')], t: 0, g, unit}), () => talkingCloseUp({cast: [one('man-crop')], t: 1, g, unit})],
    ['side-walk', () => sideWalk({cast: [one('man-crop')], t: 0, g, unit}), () => sideWalk({cast: [one('man-crop')], t: 1, g, unit})],
    ['pov', () => povShot({cast: [one('man-crop')], t: 0, g, unit}), () => povShot({cast: [one('man-crop')], t: 1, g, unit})],
  ];
  for (const [name, a, b] of sets) {
    const x = a(), y = b();
    const moved = JSON.stringify(x.camera) !== JSON.stringify(y.camera) || JSON.stringify(x.layers) !== JSON.stringify(y.layers);
    assert.ok(moved, name);
  }
});

test('the reel covers every template once or more, with cast sizes that match and registered unique shot IDs', () => {
  const shotIds = TEMPLATE_REEL.map((e) => e.shot);
  assert.equal(new Set(shotIds).size, shotIds.length, 'unique shot IDs');
  for (const id of shotIds) assert.ok(paintedShotIds.includes(id), `${id} registered`);
  assert.deepEqual([...new Set(TEMPLATE_REEL.map((e) => e.template))].sort(), [...SHOT_TEMPLATE_IDS].sort());
  const size: Record<string, number> = {'two-shot': 2, 'three-shot': 3, 'talking-close-up': 1, 'side-walk': 1, pov: 1};
  for (const e of TEMPLATE_REEL) {
    assert.equal(e.cast.length, size[e.template], `${e.shot} cast size`);
    assert.equal(e.build(0).layers.length, e.cast.length, `${e.shot} layers`);
    assert.ok(e.title.length > 0 && SHOT_TEMPLATE_INFO[e.template].description.length > 0);
  }
  const video = kitTemplates.videos[0];
  assert.equal(video.id, 'KIT-SHOT-TEMPLATES');
  assert.equal(video.timeline.length, TEMPLATE_REEL.length);
  for (const scene of video.timeline) assert.equal(scene.durationSec, TEMPLATE_SCENE_SEC);
  assert.doesNotThrow(() => collectEpisodes([kitTemplates]));
  for (const id of shotIds) assert.deepEqual(paintedShots[id].serves, ['KIT-SHOT-TEMPLATES']);
});

test('template ids and POV poses are real ids; the poses face the viewer in front view', () => {
  assert.deepEqual([...SHOT_TEMPLATE_IDS], ['two-shot', 'three-shot', 'talking-close-up', 'side-walk', 'pov']);
  for (const p of POV_POSES) {
    assert.ok((ALL_POSE_IDS as readonly string[]).includes(p), p);
    assert.ok(hasView(p, 'front'), `${p} front`);
  }
});
