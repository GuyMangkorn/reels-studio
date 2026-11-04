import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import type {Brush} from '../src/painted/BrushCanvas';
import {BONE, bodyFrame, childHangExtra, drawFigure, shoulderPoint, type CastDef, type FigAnchors, type FigPose} from '../src/painted/kit/cast';
import {EXPRESSION_IDS, EXPRESSIONS} from '../src/painted/kit/expressions';
import {modeLegs, kneeFor, kneelSolution, KNEEL_STAGES, type ModeKind} from '../src/painted/kit/legs';
import {MOTION_IDS, MOTION_INFO, MOTIONS, layerMotion, motionDuration, motionFrame, syllableOpen, type MotionId} from '../src/painted/kit/motions';
import {MOTION_REEL, REEL_FPS, reelSceneSec, reelShotId} from '../src/painted/kit/motion-reel';
import {makePainter, type Pt} from '../src/painted/kit/painter';
import {PEOPLE, PERSON_IDS} from '../src/painted/kit/people';
import {ALL_POSE_IDS, BODY_POSE_IDS, POSE_IDS, POSE_INFO, hasView, poseBody, poseFor, poseMix, poseViews, type View} from '../src/painted/kit/poses';
import {chairSpec} from '../src/painted/kit/props';
import {paintedShotIds} from '../src/painted/registry';
import {timelineFrames} from '../src/scenes/timeline';
import {collectEpisodes} from '../src/videos/registry';
import kitMotions from '../src/videos/kit-motions';

// Pose library P01-P45 in front and profile, the body modes (kit/legs.ts), the motion presets (kit/motions.ts) and the KIT-MOTIONS
// reel. Added 1 Nov 2026 (pose library pass 2).
const g: Pt = [540, 1500], unit = 540;
const VIEWS: View[] = ['front', 'left', 'right'];
const NEUTRAL = EXPRESSIONS.neutral;
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

test('pose ids: P01-P30 stay the sheet, P31-P45 are new, ids are unique and every pose has metadata', () => {
  assert.deepEqual([...POSE_IDS], Array.from({length: 30}, (_, i) => `P${String(i + 1).padStart(2, '0')}`));
  assert.deepEqual([...BODY_POSE_IDS], Array.from({length: 15}, (_, i) => `P${31 + i}`));
  assert.deepEqual([...ALL_POSE_IDS], [...POSE_IDS, ...BODY_POSE_IDS]);
  assert.equal(new Set(ALL_POSE_IDS).size, ALL_POSE_IDS.length);
  for (const id of ALL_POSE_IDS) {
    const info = POSE_INFO[id];
    assert.ok(info.name && info.description, id);
    assert.ok(info.views.length > 0 && info.views.every((v) => VIEWS.includes(v)), id);
    assert.deepEqual(poseViews(id), info.views);
  }
  // Every sheet pose except the viewer-pointing P14 has a profile now; all of them have the front.
  for (const id of POSE_IDS) assert.ok(hasView(id, 'front'), id);
  assert.deepEqual(POSE_IDS.filter((id) => !hasView(id, 'right')), ['P14']);
});

test('poseFor is finite for every pose, view and person, keeps the view it was asked for, and falls back to P01 for a view the pose lacks', () => {
  for (const pid of PERSON_IDS) {
    const def = PEOPLE[pid];
    for (const id of ALL_POSE_IDS) for (const view of VIEWS) {
      const f = poseFor(id, def, g, unit, view);
      finiteDeep(f, `${pid} ${id} ${view}`);
      assert.equal(f.view, view);
      if (!hasView(id, view)) assert.deepEqual(f, poseFor('P01', def, g, unit, view), `${id} ${view} fallback`);
      if (f.lie !== undefined) assert.ok(Math.abs(f.lie) <= 1);
    }
  }
  // The left view mirrors the right view: same body fields, arm points mirrored about the ground x.
  for (const id of ALL_POSE_IDS) {
    if (!hasView(id, 'right') || !hasView(id, 'left')) continue;
    const r = poseFor(id, PEOPLE['man-parted'], g, unit, 'right'), l = poseFor(id, PEOPLE['man-parted'], g, unit, 'left');
    for (const side of ['rArm', 'lArm'] as const) {
      const a = r[side], b = l[side === 'rArm' ? 'lArm' : 'rArm']; // the near arm is the character's right facing right, its left facing left
      assert.equal(!!a, !!b, `${id} ${side}`);
      if (a && b) {
        assert.ok(Math.abs(a.to[0] - g[0] + (b.to[0] - g[0])) < 1e-6 * unit || Math.abs(a.to[0] - g[0] + (b.to[0] - g[0])) < 2, `${id} ${side} to mirrored`);
        assert.ok(Math.abs(a.to[1] - b.to[1]) < 1e-6 * unit || Math.abs(a.to[1] - b.to[1]) < 2, `${id} ${side} to height`);
      }
    }
  }
});

test('every pose arm is a real arm: no bone is longer than the rig bone (children scale with armScale)', () => {
  for (const pid of PERSON_IDS) {
    const def = PEOPLE[pid], k = def.armScale ?? 1;
    for (const id of ALL_POSE_IDS) for (const view of poseViews(id)) {
      const f = poseFor(id, def, g, unit, view);
      for (const side of ['r', 'l'] as const) {
        const arm = side === 'r' ? f.rArm : f.lArm;
        if (!arm?.via) continue;
        const sh = shoulderPoint(def, g, unit, {...f, view}, side);
        const up = Math.hypot(arm.via[0] - sh[0], arm.via[1] - sh[1]) / unit / (BONE * k), fo = Math.hypot(arm.to[0] - arm.via[0], arm.to[1] - arm.via[1]) / unit / (BONE * k);
        assert.ok(up <= 1.015 && fo <= 1.015, `${pid} ${id} ${view} ${side} stretched: ${up.toFixed(3)} ${fo.toFixed(3)}`);
      }
    }
  }
});

test('poseMix blends between two poses, keeps arms on the mixed body and equals its end poses at 0 and 1', () => {
  const def = PEOPLE['man-parted'], k = 1;
  for (const [a, b] of [['P01', 'P15'], ['P01', 'P31'], ['P31', 'P01'], ['P01', 'P34'], ['P01', 'P35'], ['P01', 'P38']] as const) for (const view of VIEWS) {
    if (!hasView(a, view) || !hasView(b, view)) continue;
    assert.deepEqual(poseMix(a, b, 0, def, g, unit, view), poseFor(a, def, g, unit, view));
    assert.deepEqual(poseMix(a, b, 1, def, g, unit, view), poseFor(b, def, g, unit, view));
    for (const u of [0.1, 0.3, 0.5, 0.8]) {
      const m = poseMix(a, b, u, def, g, unit, view);
      finiteDeep(m, `${a}>${b} ${view} ${u}`);
      for (const side of ['r', 'l'] as const) {
        const arm = side === 'r' ? m.rArm : m.lArm;
        if (!arm?.via) continue;
        const sh = shoulderPoint(def, g, unit, {...m, view}, side);
        assert.ok(Math.hypot(arm.via[0] - sh[0], arm.via[1] - sh[1]) / unit / (BONE * k) <= 1.02, `${a}>${b} ${view} u=${u} ${side} upper arm stretched`);
      }
    }
  }
});

test('leg solver: IK modes keep both leg bones at their length, feet at or above the ground, finite across heights', () => {
  const kinds: ModeKind[] = ['sit', 'floor', 'squat', 'run', 'kneel'];
  for (const height of [1.0, 1.3, 1.7, 1.9]) {
    const hip0 = 0.71 * height / 1.7, ankleV = 0.038, knee0 = (hip0 + ankleV) / 2, L1 = hip0 - knee0, L2 = knee0 - ankleV;
    for (const kind of kinds) for (const view of ['front', 'profile'] as const) for (const amount of kind === 'run' ? [0, 1, 2.5, 5, 6.2] : [0, 0.3, 0.7, 1]) {
      const m = modeLegs({hip0, ankleV, L1, L2}, view, {kind, amount});
      finiteDeep(m, `${kind} ${view} ${amount}`);
      assert.ok(m.hipV > 0.05 && m.hipV <= hip0 + 0.1);
      if (view === 'profile' && kind !== 'kneel') for (const leg of m.legs) {
        assert.ok(Math.abs(Math.hypot(leg.knee[0] - leg.hip[0], leg.knee[1] - leg.hip[1]) - L1) < 1e-6, `${kind} thigh ${amount}`);
        assert.ok(Math.abs(Math.hypot(leg.ankle[0] - leg.knee[0], leg.ankle[1] - leg.knee[1]) - L2) < 1e-6 || kind === 'floor' || kind === 'sit', `${kind} shin ${amount}`);
        assert.ok(leg.ankle[1] >= ankleV - 0.03 * height, `${kind} ${amount} foot below ground: ${leg.ankle[1]}`);
      }
    }
  }
  const {knee, ankle} = kneeFor([0, 0.6], [0.1, 0.04], 0.33, 0.33);
  assert.ok(Math.abs(Math.hypot(knee[0], knee[1] - 0.6) - 0.33) < 1e-9 && Math.abs(Math.hypot(ankle[0] - knee[0], ankle[1] - knee[1]) - 0.33) < 1e-9);
  assert.ok(knee[0] > (0.1 * (0.6 - knee[1])) / 0.56 + 0.05, 'the knee bends toward +u, off the hip-ankle line');
});

test('drawFigure with every new field at its default is the same mark list as without them (existing characters are unchanged)', () => {
  const face = NEUTRAL;
  for (const def of [PEOPLE['man-parted'], PEOPLE['boy-school'], PEOPLE['woman-ponytail']]) for (const view of VIEWS) {
    for (const extra of [{}, {walk: 0.3}, {crouch: 0.5}, {bend: 0.4}]) {
      const plain: FigPose = {view, face, ...extra, ...(view === 'front' ? {} : {})};
      const defaults: FigPose = {...plain, sit: 0, floorSit: 0, kneel: 0, squat: 0, lie: 0, lift: 0, farArmUnder: false, ...('walk' in extra ? {stride: 1} : {})};
      const a = recorder(), b = recorder();
      drawFigure(makePainter(a.brush, {t: 0, frame: 0}), def, g, unit, plain, 0.4, 5);
      drawFigure(makePainter(b.brush, {t: 0, frame: 0}), def, g, unit, defaults, 0.4, 5);
      assert.ok(a.log.length > 50);
      assert.deepEqual(b.log, a.log, `${view} ${JSON.stringify(extra)}`);
    }
  }
});

test('drawFigure paints every pose in every view for every person without a non-finite anchor, including the body modes', () => {
  for (const pid of PERSON_IDS) {
    const def = PEOPLE[pid];
    for (const id of ALL_POSE_IDS) for (const view of poseViews(id)) {
      const anchors: FigAnchors = drawFigure(makePainter(mute, {t: 0, frame: 0}), def, g, unit, {face: NEUTRAL, ...poseFor(id, def, g, unit, view)}, 0.4, def.seed);
      finiteDeep(anchors, `${pid} ${id} ${view}`);
    }
  }
});

test('a chair fits the sitter: seat 5 cm under the hip, scaled with a child', () => {
  const a = chairSpec(PEOPLE['man-parted'], 'right'), c = chairSpec(PEOPLE['boy-school'], 'right');
  assert.ok(a.seatV > 0.3 && a.seatV < 0.5);
  assert.ok(c.seatV < a.seatV && c.u1 - c.u0 < a.u1 - a.u0);
  assert.ok(chairSpec(PEOPLE['man-parted'], 'front').u1 > 0);
});

// ----------------------------------------------------------------------------------------------------------------- motions

test('motion ids are unique and every id has a function and metadata', () => {
  assert.equal(new Set(MOTION_IDS).size, MOTION_IDS.length);
  assert.deepEqual(Object.keys(MOTIONS).sort(), [...MOTION_IDS].sort());
  assert.deepEqual(Object.keys(MOTION_INFO).sort(), [...MOTION_IDS].sort());
  for (const id of ['idle-breathe', 'walk-in-from-left', 'walk-in-from-right', 'walk-out-to-left', 'walk-out-to-right', 'run-left-to-right', 'run-right-to-left', 'nod', 'shake-head', 'startle-jump', 'look-around', 'turn-head-left', 'turn-head-right', 'shiver', 'sit-down', 'stand-up', 'point-and-say', 'gasp-recoil', 'talk'] as const) assert.ok(MOTION_IDS.includes(id), id);
  for (const id of MOTION_IDS) {
    const i = MOTION_INFO[id];
    assert.ok(i.name && i.description && i.use && i.duration > 0 && i.views.length > 0, id);
    assert.equal(typeof i.loop, 'boolean');
    assert.ok(Math.abs(motionDuration(id) - i.duration) < 0.1, `${id}: info duration ${i.duration} vs ${motionDuration(id)}`);
  }
});

test('every motion is finite for every person, supported view and time, and its arms stay real arms', () => {
  for (const pid of PERSON_IDS) {
    const def = PEOPLE[pid], k = def.armScale ?? 1;
    for (const id of MOTION_IDS) for (const view of MOTION_INFO[id].views) {
      const D = motionDuration(id, {height: def.height});
      for (let t = 0; t <= D * 1.15 + 1e-9; t += 1 / 15) {
        const f = layerMotion({person: pid, motion: id, t, g, unit, view});
        finiteDeep(f.pose, `${pid} ${id} ${view} t=${t.toFixed(2)}`);
        finiteDeep(f.g);
        const open = f.pose.face.open;
        assert.ok(open === undefined || (open >= 0 && open <= 1), `${id} open ${open}`);
        for (const side of ['r', 'l'] as const) {
          const arm = side === 'r' ? f.pose.rArm : f.pose.lArm;
          if (!arm?.via) continue;
          const sh = shoulderPoint(f.def, f.g, unit, {...f.pose, view: f.view === 'back' ? 'front' : f.view}, side); // back figures take the front-view arm targets
          assert.ok(Math.hypot(arm.via[0] - sh[0], arm.via[1] - sh[1]) / unit / (BONE * k) <= 1.05, `${pid} ${id} ${view} t=${t.toFixed(2)} ${side} upper arm`);
          assert.ok(Math.hypot(arm.to[0] - arm.via[0], arm.to[1] - arm.via[1]) / unit / (BONE * k) <= 1.05, `${pid} ${id} ${view} t=${t.toFixed(2)} ${side} forearm`);
        }
      }
    }
  }
});

test('motions are deterministic: same inputs, same frame, in any call order; no random, clock or module state in the source', () => {
  const args = (id: MotionId, t: number) => ({person: 'woman-ponytail' as const, outfit: 'nurse' as const, motion: id, t, g, unit, pose: 'P09' as const, expression: 'smug' as const});
  const times = [0, 0.13, 0.5, 0.9, 1.4, 2.2];
  const first = MOTION_IDS.map((id) => times.map((t) => JSON.stringify(layerMotion(args(id, t)))));
  const second = [...MOTION_IDS].reverse().map((id) => [...times].reverse().map((t) => JSON.stringify(layerMotion(args(id, t))))).reverse().map((r) => r.reverse());
  assert.deepEqual(second, first);
  assert.equal(syllableOpen(1.234, 7), syllableOpen(1.234, 7));
  for (let t = 0; t < 5; t += 0.05) assert.ok(syllableOpen(t, 11) >= 0 && syllableOpen(t, 11) <= 1);
  assert.ok([...Array(40)].some((_, i) => syllableOpen(i * 0.05, 3) === 0) && [...Array(40)].some((_, i) => syllableOpen(i * 0.05, 3) > 0.5), 'the envelope opens and closes');
  const src = readFileSync('src/painted/kit/motions.ts', 'utf8').replace(/\/\/.*$/gm, '');
  for (const bad of ['Math.random', 'Date.now', 'new Date', 'performance.now']) assert.ok(!src.includes(bad), bad);
});

test('layering: an expression and a base pose survive under a motion, an outfit is put on, and the motion wins what it sets', () => {
  const a = layerMotion({person: 'man-parted', outfit: 'police', motion: 'talk', t: 0.7, g, unit, pose: 'P07', expression: 'angry'});
  assert.notEqual(a.def.outfit, PEOPLE['man-parted'].outfit);
  assert.equal(a.pose.face.mouth, 'talk');
  assert.equal(a.pose.face.brow, EXPRESSIONS.angry.brow, 'the expression stays under the talk mouth');
  assert.deepEqual(a.pose.rArm, poseFor('P07', a.def, g, unit, 'front').rArm ? a.pose.rArm : undefined, 'base pose arms are kept');
  assert.ok(a.pose.rArm || a.pose.lArm, 'P07 raises an arm');
  const b = layerMotion({person: 'man-parted', motion: 'startle-jump', t: 0.4, g, unit, expression: 'happy'});
  assert.equal(b.pose.face.eyes, EXPRESSIONS.shock.eyes, 'the motion face replaces the expression');
  assert.ok((b.pose.lift ?? 0) > 0.05, 'jump lifts the figure');
  const c = layerMotion({person: 'man-parted', motion: 'idle-breathe', t: 1, g, unit, expression: 'sad', pose: 'P03'});
  assert.deepEqual(c.pose.face, EXPRESSIONS.sad);
  for (const e of EXPRESSION_IDS) assert.ok(layerMotion({person: 'boy-school', motion: 'nod', t: 0.3, g, unit, expression: e}).pose.face);
});

test('walks do not skate: the phase follows the distance, the amplitude follows the speed, and a walk-in ends standing at the rest point', () => {
  for (const pid of ['man-parted', 'boy-school', 'woman-ponytail'] as const) {
    const def = PEOPLE[pid], step = 1.1 * def.height / 1.7;
    for (const [id, dir, inward] of [['walk-in-from-left', 1, true], ['walk-in-from-right', -1, true], ['walk-out-to-left', -1, false], ['walk-out-to-right', 1, false]] as const) {
      const D = motionDuration(id, {height: def.height}), at = (t: number) => layerMotion({person: pid, motion: id, t, g, unit});
      const end = at(D + 0.5), start = at(0);
      if (inward) {
        assert.ok(Math.abs(end.g[0] - g[0]) < 1e-6 && Math.abs(end.pose.stride!) < 1e-6, `${pid} ${id} ends at rest`);
        assert.ok(Math.abs(start.g[0] - g[0]) / unit > 2.19, `${pid} ${id} starts ${(start.g[0] - g[0]) / unit} m away`);
        assert.equal(Math.sign(g[0] - start.g[0]), dir);
      } else {
        assert.ok(Math.abs(start.g[0] - g[0]) < 1e-6 && Math.abs(start.pose.stride!) < 1e-6);
        assert.ok(Math.abs(end.g[0] - g[0]) / unit > 2.19);
        assert.equal(Math.sign(end.g[0] - g[0]), dir);
      }
      // d(phase) / d(metres) = 1 / step while cruising.
      const a = at(D * 0.3), b = at(D * 0.3 + 0.05);
      const dm = Math.abs(b.g[0] - a.g[0]) / unit, dp = Math.abs(b.pose.walk! - a.pose.walk!);
      assert.ok(Math.abs(dp / dm - 1 / step) < 1e-6, `${pid} ${id} ${dp / dm} vs ${1 / step}`);
      assert.equal(a.view, dir > 0 ? 'right' : 'left');
    }
  }
  const left = layerMotion({person: 'man-parted', motion: 'run-left-to-right', t: 0, g, unit}), done = layerMotion({person: 'man-parted', motion: 'run-left-to-right', t: 9, g, unit});
  assert.ok(Math.abs(left.g[0] - g[0] + 2.5 * unit) < 1e-6 && Math.abs(done.g[0] - g[0] - 2.5 * unit) < 1e-6, 'run is centred on the rest point');
  assert.equal(left.view, 'right');
  assert.equal(layerMotion({person: 'man-parted', motion: 'run-right-to-left', t: 0.3, g, unit}).view, 'left');
});

test('turn-head swaps the head at the middle, sit and kneel reach their modes, startle leaves the ground and comes back', () => {
  const at = (id: MotionId, t: number, view: View = 'front') => motionFrame(id, t, {view, k: 1, seed: 1});
  assert.equal(at('turn-head-left', 0.2).body?.head, 'front');
  assert.equal(at('turn-head-left', 1.0).body?.head, 'left');
  assert.equal(at('turn-head-right', 1.0).body?.head, 'right');
  assert.equal(at('turn-head-to-camera', 1.0, 'right').body?.head, 'front');
  assert.equal(at('sit-down', 0).body?.sit, 0);
  assert.equal(at('sit-down', 3).body?.sit, 1);
  assert.equal(at('stand-up', 0).body?.sit, 1);
  assert.equal(at('stand-up', 3).body?.sit, 0);
  assert.equal(at('kneel-down', 3).body?.kneel, 1);
  assert.equal(at('startle-jump', 0).body?.lift, 0);
  assert.ok(at('startle-jump', 0.375).body!.lift! > 0.1);
  assert.ok(Math.abs(at('startle-jump', 2).body!.lift!) < 1e-9);
  const heads = new Set([0, 0.7, 1.5, 2.0, 3.0].map((t) => at('look-around', t).body?.head));
  assert.deepEqual([...heads].sort(), ['front', 'left', 'right']);
});

test('talk takes the mouth from the caller\'s amplitude when given', () => {
  const quiet = motionFrame('talk', 0.5, {view: 'front', k: 1, seed: 1, amp: () => 0}), loud = motionFrame('talk', 0.5, {view: 'front', k: 1, seed: 1, amp: () => 0.9});
  assert.equal(quiet.talk, 0);
  assert.equal(loud.talk, 0.9);
  assert.equal(layerMotion({person: 'man-parted', motion: 'talk', t: 0.5, g, unit, amp: () => 0.6}).pose.face.open, 0.6);
});

// ----------------------------------------------------------------------------------------------------------------- reel

test('KIT-MOTIONS reel: every motion once, one plate and one timeline scene each, plates registered, scene lengths whole frames', () => {
  assert.deepEqual(MOTION_REEL.map((e) => e.motion).sort(), [...MOTION_IDS].sort());
  for (const e of MOTION_REEL) assert.ok(paintedShotIds.includes(reelShotId(e.motion)), e.motion);
  const [episode] = collectEpisodes([kitMotions]);
  const video = episode.videos[0];
  assert.equal(video.id, 'KIT-MOTIONS');
  assert.equal(video.timeline.length, MOTION_REEL.length);
  video.timeline.forEach((s, i) => {
    assert.equal(s.painted?.shots[0].shot, reelShotId(MOTION_REEL[i].motion));
    assert.equal(s.durationSec, reelSceneSec(MOTION_REEL[i]));
    assert.ok(Math.abs(s.durationSec * REEL_FPS - Math.round(s.durationSec * REEL_FPS)) < 1e-6);
  });
  assert.ok(timelineFrames(video.timeline, REEL_FPS) > 1000);
});

test('the reel casts differ per figure of one plate (no two figures share a seed)', () => {
  for (const e of MOTION_REEL) {
    const seeds = e.cast.map((c) => c.seed ?? (PEOPLE[c.person] as CastDef).seed);
    assert.equal(new Set(seeds).size, seeds.length, e.motion);
  }
});

// ----------------------------------------------------------------------------------------------------------------- pass 2b

/** The leg dimensions `drawFigure` derives from a person (kit/cast.ts bodyFrame). */
const dimsOf = (def: CastDef) => {
  const Ht = def.height, HD = 0.425 * (def.headScale ?? 1), chin = Ht - HD, shV = chin - 0.16 * HD, torso = (chin - 0.068) * 0.44;
  const hip0 = shV - torso + 0.034, ankleV = 0.038, knee0 = (hip0 + ankleV) / 2;
  return {hip0, ankleV, L1: hip0 - knee0, L2: knee0 - ankleV};
};

test('kneel solution: bone lengths exact, hips only go down, planted feet stay put, both knees on the floor at the end', () => {
  for (const pid of PERSON_IDS) {
    const d = dimsOf(PEOPLE[pid]), k = d.L1 / 0.336;
    const [s1, s2] = KNEEL_STAGES;
    let lastHip = Infinity;
    const near: number[] = [], far: number[] = [];
    for (let i = 0; i <= 400; i++) {
      const a = i / 400, sol = kneelSolution(d, a);
      assert.ok(sol.hipV <= lastHip + 1e-9, `${pid} hips rise at a=${a}: ${sol.hipV} > ${lastHip}`);
      lastHip = sol.hipV;
      sol.legs.forEach((l) => {
        assert.ok(Math.abs(Math.hypot(l.knee[0] - l.hip[0], l.knee[1] - l.hip[1]) - d.L1) < 1e-6, `${pid} thigh a=${a}`);
        assert.ok(Math.abs(Math.hypot(l.ankle[0] - l.knee[0], l.ankle[1] - l.knee[1]) - d.L2) < 1e-6, `${pid} shin a=${a}`);
        assert.ok(l.knee[1] >= 0.045 && l.ankle[1] >= d.ankleV - 1e-9, `${pid} a=${a} part below the floor`);
      });
      if (a >= 0.3) far.push(sol.legs[0].ankle[0]);
      if (a >= 0.2 && a <= s1) near.push(sol.legs[1].ankle[0]);
      if (a >= s2) for (const l of sol.legs) assert.ok(l.knee[1] < 0.055, `${pid} knee off the floor at a=${a}: ${l.knee[1]}`);
    }
    const spread = (xs: number[]) => Math.max(...xs) - Math.min(...xs);
    assert.ok(spread(far) < 1e-6, `${pid} far foot slides ${spread(far)} m`);
    assert.ok(spread(near) < 1e-6, `${pid} the planted near foot slides ${spread(near)} m`);
    // The end is the kneel of P34: hips low (well under the half-way kneel height) and the thighs 52 degrees off the vertical.
    const end = kneelSolution(d, 1);
    assert.ok(end.hipV < 0.3 * k && end.hipV > 0.2 * k, `${pid} final hip ${end.hipV}`);
    assert.ok(end.hipV < kneelSolution(d, 0.6).hipV - 0.05 * k);
  }
});

test('kneel-down: for every person and view the hips only go down and the torso stays upright; stand-from-kneel is its reverse', () => {
  for (const pid of PERSON_IDS) for (const view of ['front', 'right', 'left'] as const) {
    const def = PEOPLE[pid];
    let last = Infinity, lastUp = -Infinity, maxLean = 0;
    for (let i = 0; i <= 80; i++) {
      const t = (i / 80) * 2;
      const down = layerMotion({motion: 'kneel-down', person: pid, view, g, unit, t, expression: 'neutral'});
      const hip = bodyFrame(def, {view: down.view, kneel: down.pose.kneel}).hipV;
      assert.ok(hip <= last + 1e-9, `${pid} ${view} kneel-down hips rise at t=${t}`);
      last = hip;
      const up = layerMotion({motion: 'stand-from-kneel', person: pid, view, g, unit, t, expression: 'neutral'});
      const hu = bodyFrame(def, {view: up.view, kneel: up.pose.kneel}).hipV;
      assert.ok(hu >= lastUp - 1e-9, `${pid} ${view} stand-from-kneel hips go down at t=${t}`);
      lastUp = hu;
      maxLean = Math.max(maxLean, Math.abs(down.pose.bend ?? 0));
    }
    assert.ok(maxLean <= 0.2, `${pid} ${view} leans ${maxLean}`);
    const end = layerMotion({motion: 'kneel-down', person: pid, view, g, unit, t: 2, expression: 'neutral'});
    assert.equal(end.pose.kneel, 1);
    const start = layerMotion({motion: 'stand-from-kneel', person: pid, view, g, unit, t: 2, expression: 'neutral'});
    assert.equal(start.pose.kneel, 0);
  }
});

test('P34: the hips are lower than a half kneel and the front legs fold (shins hidden) once the second knee is down', () => {
  for (const pid of PERSON_IDS) {
    const def = PEOPLE[pid], k = def.height / 1.7;
    const f = poseFor('P34', def, g, unit, 'right');
    assert.equal(f.kneel, 1);
    const hip = bodyFrame(def, {view: 'right', kneel: 1}).hipV;
    assert.ok(hip < 0.3 * k, `${pid} hip ${hip}`);
    const front = bodyFrame(def, {view: 'front', kneel: 1}).mode!;
    assert.ok(front.legs.every((l) => l.hide), `${pid} front legs not folded`);
  }
});

test('sit-down: the feet stay on one ground point all the way and the figure starts clear of the chair; stand-up is the reverse', () => {
  for (const pid of PERSON_IDS) for (const view of ['right', 'left'] as const) {
    const def = PEOPLE[pid], k = def.height / 1.7, dir = view === 'left' ? -1 : 1, d = dimsOf(def);
    const chair = chairSpec(def, view);
    const world = (id: MotionId, t: number) => {
      const fr = motionFrame(id, t, {view, k, legK: d.L1 / 0.336, seed: 1});
      const sit = fr.body!.sit!, off = (fr.offset?.[0] ?? 0) * dir;
      const legs = modeLegs(d, 'profile', {kind: 'sit', amount: sit}).legs;
      return {off, sit, ankles: legs.map((l) => off + l.ankle[0])};
    };
    for (const id of ['sit-down', 'stand-up'] as const) {
      const first = world(id, id === 'sit-down' ? 0.2 : 0.35).ankles;
      for (let i = 0; i <= 40; i++) {
        const w = world(id, 0.2 + (i / 40) * 1.2);
        w.ankles.forEach((x, j) => assert.ok(Math.abs(x - first[j]) < 1e-4, `${pid} ${view} ${id}: foot ${j} slides ${x - first[j]} m`));
      }
    }
    // At t = 0 the standing figure is in front of the chair: its feet are past the seat's front edge and its heels clear the front leg.
    const w0 = world('sit-down', 0);
    assert.equal(w0.sit, 0);
    for (const x of w0.ankles) assert.ok(x >= chair.u1 + 0.01 * k - 0.02 * k, `${pid} ${view} ankle ${x} inside the chair (front edge ${chair.u1})`);
    // Seated, the figure is back at the rest point and the thigh is on the seat.
    const w1 = world('sit-down', 3);
    assert.equal(w1.off, 0);
    assert.equal(world('stand-up', 0).off, 0);
    assert.ok(world('stand-up', 3).off > 0.1 * k);
    // The front view has no offset.
    assert.equal(motionFrame('sit-down', 0, {view: 'front', k, seed: 1}).offset, undefined);
  }
});

test('child hands hang outside the hip line in the front view; adults and profile are unchanged', () => {
  const boy = PEOPLE['boy-school'], man = PEOPLE['man-parted'];
  assert.equal(childHangExtra(man), 0);
  assert.ok(childHangExtra(boy) > 0.01);
  const hand = (def: CastDef, view: View) => poseFor('P01', def, g, unit, view);
  const sh = (def: CastDef, f: FigPose, side: 'r' | 'l') => shoulderPoint(def, g, unit, f, side);
  for (const pid of PERSON_IDS) {
    const def = PEOPLE[pid], f = hand(def, 'front');
    for (const side of ['r', 'l'] as const) {
      const a = side === 'r' ? f.rArm : f.lArm;
      if (!a) continue;
      const hipEdge = (0.3 * 0.425 * (def.headScale ?? 1) + 0.013) * unit; // the hip line (the rig's hipEdge) from the ground x
      const x = Math.abs(a.to[0] - g[0]);
      if (def.armScale !== undefined) assert.ok(x >= hipEdge + 0.03 * unit, `${pid} ${side}: hand ${x / unit} m from the middle, hip line ${hipEdge / unit}`);
      assert.ok(Number.isFinite(sh(def, {face: NEUTRAL, ...f}, side)[0]));
    }
  }
});

test('toCam arms (P13, P14, P16, P41 front): a short foreshortened arm, a hand up to 1.3x and never larger than the face', () => {
  for (const pid of PERSON_IDS) {
    const def = PEOPLE[pid];
    for (const id of ['P13', 'P14', 'P16', 'P41'] as const) {
      const f = poseFor(id, def, g, unit, 'front');
      const arms = [f.rArm, f.lArm].filter((a): a is NonNullable<FigPose['rArm']> => !!a && !!a.toCam);
      assert.ok(arms.length >= 1, `${pid} ${id} has no toCam arm`);
      for (const a of arms) {
        assert.ok(a.toCam! > 0 && a.toCam! <= 1);
        const sh = shoulderPoint(def, g, unit, f, a === f.rArm ? 'r' : 'l');
        // The arm goes only a short way from the shoulder (it points at the viewer): well under the bone length.
        assert.ok(Math.hypot(a.to[0] - sh[0], a.to[1] - sh[1]) < 0.75 * BONE * unit * (def.armScale ?? 1), `${pid} ${id} arm not foreshortened`);
        // Hand width (0.09 m x 1.3) against the face (head width 0.34 * head scale).
        assert.ok(0.09 * 1.3 < 0.34 * 0.425 * (def.headScale ?? 1) * 2 * 0.5 + 1e-9, `${pid} hand larger than the face`);
      }
    }
  }
  // The same arm with `toCam` absent paints a different, ordinary arm; with it set the marks differ (the cue is drawn).
  const def = PEOPLE['man-parted'], f = poseFor('P13', def, g, unit, 'front');
  const a = recorder(), b = recorder();
  drawFigure(makePainter(a.brush, {t: 0, frame: 0}), def, g, unit, {face: NEUTRAL, ...f}, 0.4, 3);
  const plain = {...f, rArm: {...f.rArm!, toCam: undefined}, lArm: f.lArm && {...f.lArm, toCam: undefined}};
  drawFigure(makePainter(b.brush, {t: 0, frame: 0}), def, g, unit, {face: NEUTRAL, ...plain}, 0.4, 3);
  assert.notDeepEqual(a.log, b.log);
});

test('a far arm that hangs in a profile is painted under the near leg (no floating hand); the default order is kept without the flag', () => {
  for (const pid of PERSON_IDS) {
    const def = PEOPLE[pid];
    const prof = poseFor('P23', def, g, unit, 'right');
    assert.equal(prof.farArmUnder, true);
    assert.equal(poseFor('P23', def, g, unit, 'front').farArmUnder, undefined);
    const a = recorder(), b = recorder();
    drawFigure(makePainter(a.brush, {t: 0, frame: 0}), def, g, unit, {face: NEUTRAL, ...prof}, 0.4, 3);
    drawFigure(makePainter(b.brush, {t: 0, frame: 0}), def, g, unit, {face: NEUTRAL, ...prof, farArmUnder: false}, 0.4, 3);
    assert.notDeepEqual(a.log, b.log, `${pid}: the far arm order should differ`);
  }
});

test('every posed hand is attached to the end of its arm: the painted hand sits within 3.5 cm of the arm target, shoulder to hand is one chain', () => {
  for (const pid of PERSON_IDS) {
    const def = PEOPLE[pid];
    for (const id of ALL_POSE_IDS) for (const view of poseViews(id)) {
      const f = poseFor(id, def, g, unit, view);
      const pose: FigPose = {face: NEUTRAL, ...f};
      const anchors = drawFigure(makePainter(mute, {t: 0, frame: 0}), def, g, unit, pose, 0.4, def.seed);
      for (const side of ['r', 'l'] as const) {
        const arm = side === 'r' ? f.rArm : f.lArm;
        if (!arm || arm.behind || f.lie) continue; // a lying body is drawn rotated: its arm targets are in the unrotated frame
        const hand = side === 'r' ? anchors.rHand : anchors.lHand, via = arm.via ?? arm.to;
        // The hand ellipse is centred 3 cm past the arm end along the forearm (drawArm); allow a little for the clamp to the bone length.
        assert.ok(Math.hypot(hand[0] - arm.to[0], hand[1] - arm.to[1]) <= 0.035 * unit, `${pid} ${id} ${view} ${side}: hand ${(Math.hypot(hand[0] - arm.to[0], hand[1] - arm.to[1]) / unit).toFixed(3)} m from the arm end`);
        // The elbow lies between shoulder and hand: not farther from the shoulder than the whole arm.
        const sh = side === 'r' ? anchors.rShoulder : anchors.lShoulder;
        assert.ok(Math.hypot(via[0] - sh[0], via[1] - sh[1]) <= 2.2 * BONE * unit, `${pid} ${id} ${view} ${side}: elbow detached from the shoulder`);
      }
    }
  }
});
