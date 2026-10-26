import {poses, smoothstep, transitionAtTrack, type PoseName, type PoseTrack, type PoseTransition} from '../rig/poses';
import {HUMAN_HIP_FROM_ANCHOR} from '../rig/geometry';
import {propNames, type PropName} from '../assets/Props';
import type {Actor, Scene, ScenePropSpec, Timeline} from './types';
const bgNames = ['forest', 'city', 'room', 'sea', 'nightSky'];
const animalPoses = ['idle', 'walk', 'sit', 'wave'];
const stimulusVariants = ['square', 'kanizsa', 'outward-control'];
const propTones = ['observed', 'hypothesis', 'warning', 'fiction', 'neutral'];
const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const record = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v);
/** Validate external JSON before rendering, with a path to every invalid value. */
export function validateTimeline(value: unknown): asserts value is Timeline {
  const fail = (path: string, message: string): never => {throw new Error(`Timeline ${path}: ${message}`);};
  if (!Array.isArray(value) || value.length === 0) fail('scenes', 'expected a non-empty array');
  (value as unknown[]).forEach((raw, i) => {
    if (!record(raw)) fail(`[${i}]`, 'expected scene object');
    const s = raw as Record<string, unknown>; const path = `[${i}]`;
    if (!finite(s.durationSec) || s.durationSec <= 0) fail(`${path}.durationSec`, 'must be positive');
    if (!bgNames.includes(String(s.bg))) fail(`${path}.bg`, 'unknown background');
    if (s.time !== undefined && !['day', 'night'].includes(String(s.time))) fail(`${path}.time`, 'expected day or night');
    if (typeof s.subtitle !== 'string') fail(`${path}.subtitle`, 'expected text');
    for (const key of ['title', 'eyebrow']) if (s[key] !== undefined && typeof s[key] !== 'string') fail(`${path}.${key}`, 'expected text');
    if (s.pictureMove !== undefined) {
      if (!Array.isArray(s.pictureMove) || s.pictureMove.length < 2) fail(`${path}.pictureMove`, 'expected at least two keyframes');
      let last = -1;
      (s.pictureMove as unknown[]).forEach((rawKey, j) => {
        const kp = `${path}.pictureMove[${j}]`;
        if (!record(rawKey)) fail(kp, 'expected keyframe object');
        const key = rawKey as Record<string, unknown>;
        if (!finite(key.atSec) || key.atSec < 0 || key.atSec > (s.durationSec as number) || key.atSec <= last) fail(`${kp}.atSec`, 'times must increase within scene');
        if (j === 0 && key.atSec !== 0) fail(`${kp}.atSec`, 'first keyframe must start at zero');
        for (const axis of ['x', 'y']) if (!finite(key[axis]) || Math.abs(key[axis] as number) > .05) fail(`${kp}.${axis}`, 'expected normalized offset between -0.05 and 0.05');
        if (!finite(key.scale) || key.scale < 1 || key.scale > 1.2) fail(`${kp}.scale`, 'must be between 1 and 1.2 to keep the picture stage padded');
        last = key.atSec as number;
      });
    }
    if (s.subtitleCues !== undefined) {
      if (!Array.isArray(s.subtitleCues) || s.subtitleCues.length === 0) fail(`${path}.subtitleCues`, 'expected a non-empty array');
      let last = -1;
      (s.subtitleCues as unknown[]).forEach((rawCue, j) => {
        const cp = `${path}.subtitleCues[${j}]`;
        if (!record(rawCue)) fail(cp, 'expected cue object');
        const cue = rawCue as Record<string, unknown>;
        if (!finite(cue.atSec) || cue.atSec < 0 || cue.atSec >= (s.durationSec as number) || cue.atSec <= last) fail(`${cp}.atSec`, 'times must increase and fall inside scene');
        if (typeof cue.text !== 'string' || cue.text.trim().length === 0) fail(`${cp}.text`, 'expected non-empty text');
        if (j === 0 && cue.atSec !== 0) fail(`${cp}.atSec`, 'first cue must start at zero so subtitles are visible from frame 0');
        last = cue.atSec as number;
      });
    }
    if (!Array.isArray(s.actors)) fail(`${path}.actors`, 'expected array');
    const ids = new Set<string>();
    (s.actors as unknown[]).forEach((rawActor, j) => {
      const ap = `${path}.actors[${j}]`;
      if (!record(rawActor)) fail(ap, 'expected actor object');
      const a = rawActor as Record<string, unknown>;
      if (!['narrator', 'cat', 'dog'].includes(String(a.type))) fail(`${ap}.type`, 'unknown actor');
      if (a.id !== undefined) {if (typeof a.id !== 'string' || ids.has(a.id)) fail(`${ap}.id`, 'expected unique string'); ids.add(a.id as string);}
      const checkPose = (p: unknown) => {if (typeof p !== 'string' || !Object.hasOwn(poses, p) || (a.type !== 'narrator' && !animalPoses.includes(p))) fail(`${ap}.pose`, 'unsupported pose for this actor');};
      if (a.pose !== undefined) checkPose(a.pose);
      for (const key of ['x', 'y', 'from', 'to', 'scale']) if (a[key] !== undefined && !finite(a[key])) fail(`${ap}.${key}`, 'expected finite number');
      if (a.scale !== undefined && (a.scale as number) <= 0) fail(`${ap}.scale`, 'must be positive');
      if (a.portrait !== undefined) {
        if (!record(a.portrait)) fail(`${ap}.portrait`, 'expected portrait layout object');
        const layout = a.portrait as Record<string, unknown>;
        for (const key of ['from', 'to', 'scale']) if (layout[key] !== undefined && !finite(layout[key])) fail(`${ap}.portrait.${key}`, 'expected finite number');
        if (layout.scale !== undefined && (layout.scale as number) <= 0) fail(`${ap}.portrait.scale`, 'must be positive');
      }
      for (const key of ['flip', 'talking']) if (a[key] !== undefined && typeof a[key] !== 'boolean') fail(`${ap}.${key}`, 'expected boolean');
      if (a.hairStyle !== undefined && !['short', 'long', 'bald'].includes(String(a.hairStyle))) fail(`${ap}.hairStyle`, 'unknown hair style');
      if (a.expression !== undefined && !['neutral', 'happy', 'shock', 'think'].includes(String(a.expression))) fail(`${ap}.expression`, 'unknown expression');
      if (a.seat !== undefined && (a.seat !== 'sofa' || a.type !== 'narrator' || s.bg !== 'room')) fail(`${ap}.seat`, 'sofa seating requires a narrator in the room');
      for (const key of ['skinColor', 'shirtColor', 'pantsColor', 'color']) if (a[key] !== undefined && typeof a[key] !== 'string') fail(`${ap}.${key}`, 'expected CSS color string');
      if (a.poses !== undefined) {
        if (!Array.isArray(a.poses)) fail(`${ap}.poses`, 'expected array');
        let last = -1;
        (a.poses as unknown[]).forEach((key, k) => {
          if (!record(key) || !finite(key.atSec) || key.atSec < 0 || key.atSec >= (s.durationSec as number) || key.atSec <= last) fail(`${ap}.poses[${k}]`, 'times must increase and fall inside scene');
          const item = key as {atSec: number; pose: unknown}; checkPose(item.pose); last = item.atSec;
        });
      }
    });
    if (s.props !== undefined) {
      if (!Array.isArray(s.props)) fail(`${path}.props`, 'expected array');
      (s.props as unknown[]).forEach((p, j) => {
        const pp = `${path}.props[${j}]`;
        if (!record(p) || !propNames.includes(String(p.type) as PropName) || !finite(p.x)) fail(pp, 'expected known type and numeric x');
        const prop = p as Record<string, unknown>;
        for (const key of ['y', 'size']) if (prop[key] !== undefined && !finite(prop[key])) fail(`${pp}.${key}`, 'expected finite number');
        if (prop.size !== undefined && (prop.size as number) <= 0) fail(`${pp}.size`, 'must be positive');
        for (const key of ['color', 'label', 'detail']) if (prop[key] !== undefined && typeof prop[key] !== 'string') fail(`${pp}.${key}`, 'expected text');
        if (prop.variant !== undefined && (prop.type !== 'catbox-stimulus' || !stimulusVariants.includes(String(prop.variant)))) fail(`${pp}.variant`, 'unsupported variant for prop');
        if (prop.tone !== undefined && (prop.type !== 'catbox-card' || !propTones.includes(String(prop.tone)))) fail(`${pp}.tone`, 'unsupported tone for prop');
        if (prop.layer !== undefined && !['back', 'front'].includes(String(prop.layer))) fail(`${pp}.layer`, 'expected back or front');
        if (prop.startSec !== undefined && (!finite(prop.startSec) || prop.startSec < 0 || prop.startSec >= (s.durationSec as number))) fail(`${pp}.startSec`, 'must fall inside scene');
        if (prop.endSec !== undefined && (!finite(prop.endSec) || prop.endSec <= (prop.startSec as number ?? 0) || prop.endSec > (s.durationSec as number))) fail(`${pp}.endSec`, 'must follow startSec and stay within scene');
        if (prop.portrait !== undefined) {
          if (!record(prop.portrait)) fail(`${pp}.portrait`, 'expected portrait layout object');
          const layout = prop.portrait as Record<string, unknown>;
          for (const key of ['x', 'y']) if (layout[key] !== undefined && (!finite(layout[key]) || layout[key] < 0 || layout[key] > 1)) fail(`${pp}.portrait.${key}`, 'expected normalized position from 0 to 1');
          if (layout.size !== undefined && (!finite(layout.size) || layout.size <= 0)) fail(`${pp}.portrait.size`, 'must be positive');
        }
      });
    }
  });
}
export const sceneFrames = (seconds: number, fps: number) => Math.max(1, Math.round(seconds * fps));
export const timelineFrames = (timeline: Timeline, fps: number) => timeline.reduce((sum, s) => sum + sceneFrames(s.durationSec, fps), 0);
/** Frame-sampled picture transform. The initial 1× crop stays padded to avoid exposed edges. */
export function pictureMoveAt(scene: Scene, frame: number, fps: number) {
  const keys = scene.pictureMove;
  if (!keys?.length) return {x: 0, y: 0, scale: 1};
  const seconds = Math.max(0, frame / fps);
  let from = keys[0];
  for (let i = 1; i < keys.length; i++) {
    const to = keys[i];
    if (seconds <= to.atSec) {
      const progress = smoothstep((seconds - from.atSec) / (to.atSec - from.atSec));
      return {
        x: from.x + (to.x - from.x) * progress,
        y: from.y + (to.y - from.y) * progress,
        scale: from.scale + (to.scale - from.scale) * progress,
      };
    }
    from = to;
  }
  return {x: from.x, y: from.y, scale: from.scale};
}
/** Subtitle cues use scene-local seconds and hold until the next cue. */
export function subtitleAt(scene: Scene, frame: number, fps: number) {
  if (!scene.subtitleCues?.length) return scene.subtitle;
  const seconds = Math.max(0, frame / fps);
  let text = scene.subtitleCues[0].text;
  for (const cue of scene.subtitleCues) {
    if (seconds < cue.atSec) break;
    text = cue.text;
  }
  return text;
}
/** Optional visibility interval for cards and other scene-local prop cues. */
export function propVisibleAt(prop: {startSec?: number; endSec?: number}, frame: number, fps: number, durationSec: number) {
  const seconds = Math.max(0, frame / fps);
  return seconds >= (prop.startSec ?? 0) && seconds < (prop.endSec ?? durationSec);
}
/** Resolve authored stage coordinates and portrait-specific crop placement for one reusable prop. */
export function layoutSceneProp(prop: ScenePropSpec, width: number, height: number) {
  const portrait = height > width;
  const layout = portrait ? prop.portrait : undefined;
  return {
    x: (layout?.x ?? prop.x) * width,
    y: (layout?.y ?? prop.y ?? .8) * height,
    size: (layout?.size ?? prop.size ?? 240) * (portrait ? 1.1 : 1),
  };
}
export const actorIdentity = (actor: Actor, index: number) => actor.id ?? `${actor.type}-${index}`;
export const actorPoseTrack = (actor: Actor, fps: number, previous: PoseName = 'idle'): PoseTrack => ({initial: actor.pose ?? 'idle', from: previous, keys: (actor.poses ?? []).map(key => ({frame: Math.round(key.atSec * fps), pose: key.pose}))});
export function poseAt(actor: Actor, frame: number, fps: number, previous: PoseName = 'idle'): PoseTransition {
  return transitionAtTrack(actorPoseTrack(actor, fps, previous), frame, fps);
}
export function actorPosition(actor: Actor, frame: number, duration: number, portrait = false) {
  const layout = portrait ? actor.portrait : undefined;
  const from = layout?.from ?? actor.from ?? actor.x ?? .5; const to = layout?.to ?? actor.to ?? actor.x ?? from;
  return from + (to - from) * smoothstep(frame / Math.max(1, duration - 1));
}
/** Coordinates are normalized. Portrait compresses horizontal spacing and uses a taller stage. */
export function layoutActor(actor: Actor, normalizedX: number, width: number, height: number, seat?: {y: number; amount: number}) {
  const portrait = height > width;
  const scale = (portrait ? actor.portrait?.scale ?? actor.scale ?? 1 : actor.scale ?? 1) * (actor.type === 'narrator' ? (portrait ? 1.75 : 1.42) : (portrait ? 1.05 : 1.08));
  const standingY = height * (actor.y ?? (portrait ? (actor.type === 'dog' ? .835 : .79) : .81));
  const seatWeight = actor.type === 'narrator' && seat ? Math.max(0, Math.min(1, seat.amount)) : 0;
  const seatedY = seat ? seat.y + HUMAN_HIP_FROM_ANCHOR * scale : standingY;
  const layout = portrait ? actor.portrait : undefined;
  const from = layout?.from ?? actor.from ?? actor.x ?? .5; const to = layout?.to ?? actor.to ?? actor.x ?? from;
  const flip = actor.flip ?? (actor.type !== 'narrator' && from > to);
  return {x: width * (portrait ? .06 + normalizedX * .88 : normalizedX), y: standingY + (seatedY - standingY) * seatWeight, scale, flip, seatWeight};
}
