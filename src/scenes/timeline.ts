import {poses, smoothstep, transitionAtTrack, type PoseName, type PoseTransition} from '../rig/poses';
import type {Actor, Timeline} from './types';
const bgNames = ['forest', 'city', 'room', 'sea', 'nightSky'];
const propNames = ['tree', 'house', 'car', 'boat', 'sign'];
const animalPoses = ['idle', 'walk', 'sit', 'wave'];
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
      for (const key of ['flip', 'talking']) if (a[key] !== undefined && typeof a[key] !== 'boolean') fail(`${ap}.${key}`, 'expected boolean');
      if (a.hairStyle !== undefined && !['short', 'long', 'bald'].includes(String(a.hairStyle))) fail(`${ap}.hairStyle`, 'unknown hair style');
      if (a.expression !== undefined && !['neutral', 'happy', 'shock', 'think'].includes(String(a.expression))) fail(`${ap}.expression`, 'unknown expression');
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
        if (!record(p) || !propNames.includes(String(p.type)) || !finite(p.x)) fail(pp, 'expected known type and numeric x');
        const prop = p as Record<string, unknown>;
        for (const key of ['y', 'size']) if (prop[key] !== undefined && !finite(prop[key])) fail(`${pp}.${key}`, 'expected finite number');
        if (prop.size !== undefined && (prop.size as number) <= 0) fail(`${pp}.size`, 'must be positive');
      });
    }
  });
}
export const sceneFrames = (seconds: number, fps: number) => Math.max(1, Math.round(seconds * fps));
export const timelineFrames = (timeline: Timeline, fps: number) => timeline.reduce((sum, s) => sum + sceneFrames(s.durationSec, fps), 0);
export const actorIdentity = (actor: Actor, index: number) => actor.id ?? `${actor.type}-${index}`;
export function poseAt(actor: Actor, frame: number, fps: number, previous: PoseName = 'idle'): PoseTransition {
  return transitionAtTrack({initial: actor.pose ?? 'idle', from: previous, keys: (actor.poses ?? []).map(key => ({frame: Math.round(key.atSec * fps), pose: key.pose}))}, frame, fps);
}
export function actorPosition(actor: Actor, frame: number, duration: number) {
  const from = actor.from ?? actor.x ?? .5; const to = actor.to ?? actor.x ?? from;
  return from + (to - from) * smoothstep(frame / Math.max(1, duration - 1));
}
/** Coordinates are normalized. Portrait compresses horizontal spacing and uses a taller stage. */
export function layoutActor(actor: Actor, normalizedX: number, width: number, height: number) {
  const portrait = height > width;
  return {x: width * (portrait ? .06 + normalizedX * .88 : normalizedX), y: height * (actor.y ?? (portrait ? (actor.type === 'dog' ? .835 : .79) : .81)), scale: (actor.scale ?? 1) * (actor.type === 'narrator' ? (portrait ? 1.75 : 1.42) : (portrait ? 1.05 : 1.08))};
}
