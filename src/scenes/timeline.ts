import {backgroundRegistry} from '../assets/Background';
import {propRegistry} from '../assets/Props';
import {costumes} from '../rig/costumes';
import {ghostVariants} from '../rig/Ghost';
import {interiorVariants} from '../assets/backgrounds/HouseInterior';
import {
  poses,
  smoothstep,
  transitionAtTrack,
  type PoseName,
  type PoseTrack,
  type PoseTransition,
} from '../rig/poses';
import {HUMAN_HIP_FROM_ANCHOR} from '../rig/geometry';
import {cameraPresetNames} from '../camera/Camera';
import type {Actor, Timeline} from './types';
const bgNames = Object.keys(backgroundRegistry);
const propNames = Object.keys(propRegistry);
const animalPoses = ['idle', 'walk', 'sit', 'wave'];
const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const record = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v);
/** Validate external JSON before rendering, with a path to every invalid value. */
export function validateTimeline(value: unknown): asserts value is Timeline {
  const fail = (path: string, message: string): never => {
    throw new Error(`Timeline ${path}: ${message}`);
  };
  if (!Array.isArray(value) || value.length === 0) fail('scenes', 'expected a non-empty array');
  (value as unknown[]).forEach((raw, i) => {
    if (!record(raw)) fail(`[${i}]`, 'expected scene object');
    const s = raw as Record<string, unknown>;
    const path = `[${i}]`;
    if (!finite(s.durationSec) || s.durationSec <= 0)
      fail(`${path}.durationSec`, 'must be positive');
    if (!bgNames.includes(String(s.bg))) fail(`${path}.bg`, 'unknown background');
    if (s.time !== undefined && !['day', 'dusk', 'night', 'moonlight'].includes(String(s.time)))
      fail(`${path}.time`, 'unknown time of day');
    if (typeof s.subtitle !== 'string') fail(`${path}.subtitle`, 'expected text');
    for (const key of ['title', 'eyebrow'])
      if (s[key] !== undefined && typeof s[key] !== 'string')
        fail(`${path}.${key}`, 'expected text');
    if (
      s.channelName !== undefined &&
      s.channelName !== null &&
      s.channelName !== false &&
      typeof s.channelName !== 'string'
    )
      fail(`${path}.channelName`, 'expected text, null or false');
    if (!Array.isArray(s.actors)) fail(`${path}.actors`, 'expected array');
    const ids = new Set<string>();
    (s.actors as unknown[]).forEach((rawActor, j) => {
      const ap = `${path}.actors[${j}]`;
      if (!record(rawActor)) fail(ap, 'expected actor object');
      const a = rawActor as Record<string, unknown>;
      if (!['narrator', 'cat', 'dog', 'ghost'].includes(String(a.type)))
        fail(`${ap}.type`, 'unknown actor');
      if (a.id !== undefined) {
        if (typeof a.id !== 'string' || ids.has(a.id)) fail(`${ap}.id`, 'expected unique string');
        ids.add(a.id as string);
      }
      const checkPose = (p: unknown) => {
        if (
          typeof p !== 'string' ||
          !Object.hasOwn(poses, p) ||
          ((a.type === 'cat' || a.type === 'dog') && !animalPoses.includes(p))
        )
          fail(`${ap}.pose`, 'unsupported pose for this actor');
      };
      if (a.pose !== undefined) checkPose(a.pose);
      for (const key of ['x', 'y', 'from', 'to', 'scale'])
        if (a[key] !== undefined && !finite(a[key])) fail(`${ap}.${key}`, 'expected finite number');
      if (a.scale !== undefined && (a.scale as number) <= 0)
        fail(`${ap}.scale`, 'must be positive');
      for (const key of ['flip', 'talking', 'showPivots'])
        if (a[key] !== undefined && typeof a[key] !== 'boolean')
          fail(`${ap}.${key}`, 'expected boolean');
      if (
        a.hairStyle !== undefined &&
        !['short', 'long', 'bald', 'bun'].includes(String(a.hairStyle))
      )
        fail(`${ap}.hairStyle`, 'unknown hair style');
      if (
        a.expression !== undefined &&
        !['neutral', 'happy', 'shock', 'think'].includes(String(a.expression))
      )
        fail(`${ap}.expression`, 'unknown expression');
      if (a.seat !== undefined && (a.seat !== 'sofa' || a.type !== 'narrator' || s.bg !== 'room'))
        fail(`${ap}.seat`, 'sofa seating requires a narrator in the room');
      for (const key of ['skinColor', 'shirtColor', 'pantsColor', 'color', 'hairColor'])
        if (a[key] !== undefined && typeof a[key] !== 'string')
          fail(`${ap}.${key}`, 'expected CSS color string');
      if (
        a.character !== undefined &&
        (a.type !== 'narrator' ||
          typeof a.character !== 'string' ||
          !Object.hasOwn(costumes, a.character))
      )
        fail(`${ap}.character`, 'unknown human costume');
      if (
        a.ghostVariant !== undefined &&
        (a.type !== 'ghost' ||
          !ghostVariants.includes(a.ghostVariant as (typeof ghostVariants)[number]))
      )
        fail(`${ap}.ghostVariant`, 'unknown ghost variant');
      if (a.opacity !== undefined && (!finite(a.opacity) || a.opacity < 0 || a.opacity > 1))
        fail(`${ap}.opacity`, 'expected 0..1');
      if (
        a.depth !== undefined &&
        !(
          a.depth === 'bedEnd' &&
          s.bg === 'houseInterior' &&
          record(s.background) &&
          s.background.variant === 'bedroomPOV'
        ) &&
        !(
          a.depth === 'window' &&
          s.bg === 'houseInterior' &&
          record(s.background) &&
          s.background.variant === 'window'
        )
      )
        fail(`${ap}.depth`, 'depth must match bedroomPOV bedEnd or window');
      if (a.poses !== undefined) {
        if (!Array.isArray(a.poses)) fail(`${ap}.poses`, 'expected array');
        let last = -1;
        (a.poses as unknown[]).forEach((key, k) => {
          if (
            !record(key) ||
            !finite(key.atSec) ||
            key.atSec < 0 ||
            key.atSec >= (s.durationSec as number) ||
            key.atSec <= last
          )
            fail(`${ap}.poses[${k}]`, 'times must increase and fall inside scene');
          const item = key as {atSec: number; pose: unknown};
          checkPose(item.pose);
          last = item.atSec;
        });
      }
    });
    if (s.background !== undefined) {
      if (!record(s.background)) fail(`${path}.background`, 'expected options object');
      const bg = s.background as Record<string, unknown>;
      if (
        bg.variant !== undefined &&
        (s.bg !== 'houseInterior' ||
          !interiorVariants.includes(bg.variant as (typeof interiorVariants)[number]))
      )
        fail(`${path}.background.variant`, 'unknown interior variant');
      if (bg.blanketPull !== undefined) {
        const pull = bg.blanketPull;
        const unit = (v: unknown) => finite(v) && v >= 0 && v <= 1;
        if (
          bg.variant !== 'bedroomPOV' ||
          !(unit(pull) || (Array.isArray(pull) && pull.length === 2 && pull.every(unit)))
        )
          fail(
            `${path}.background.blanketPull`,
            'bedroomPOV expects 0..1 or a pair of 0..1 endpoints',
          );
      }
      if (
        bg.vignette !== undefined &&
        (bg.variant !== 'bedroomPOV' || typeof bg.vignette !== 'boolean')
      )
        fail(`${path}.background.vignette`, 'expected bedroomPOV boolean');
      if (bg.windowLights !== undefined && typeof bg.windowLights !== 'boolean')
        fail(`${path}.background.windowLights`, 'expected boolean');
    }
    if (s.impact !== undefined) {
      const impact = s.impact;
      if (!record(impact)) fail(`${path}.impact.atSec`, 'expected a finite time');
      const rawAtSec = (impact as Record<string, unknown>).atSec;
      if (!finite(rawAtSec)) fail(`${path}.impact.atSec`, 'expected a finite time');
      const atSec = rawAtSec as number;
      if (atSec < 0 || atSec >= (s.durationSec as number))
        fail(`${path}.impact.atSec`, 'must fall inside the scene');
      if (
        s.bg !== 'houseInterior' ||
        !record(s.background) ||
        s.background.variant !== 'bedroomPOV'
      )
        fail(`${path}.impact`, 'impact is only supported for houseInterior bedroomPOV scenes');
    }
    if (s.camera !== undefined) {
      if (!record(s.camera)) fail(`${path}.camera`, 'expected camera object');
      const c = s.camera as Record<string, unknown>;
      if (
        c.preset !== undefined &&
        !cameraPresetNames.includes(String(c.preset) as (typeof cameraPresetNames)[number])
      )
        fail(`${path}.camera.preset`, 'unknown camera preset');
      const pair = (v: unknown): v is [number, number] =>
        Array.isArray(v) && v.length === 2 && v.every(finite);
      if (c.zoom !== undefined && (!pair(c.zoom) || c.zoom.some((v) => v < 1 || v > 4)))
        fail(`${path}.camera.zoom`, 'expected two zooms in 1..4');
      if (c.pan !== undefined && (!record(c.pan) || !pair(c.pan.from) || !pair(c.pan.to)))
        fail(`${path}.camera.pan`, 'expected from/to coordinate pairs');
      if (c.parallax !== undefined && (!finite(c.parallax) || c.parallax < 0 || c.parallax > 1))
        fail(`${path}.camera.parallax`, 'expected 0..1');
      if (c.view !== undefined && !['front', 'topDown'].includes(String(c.view)))
        fail(`${path}.camera.view`, 'unknown view');
      if (c.view === 'topDown' && s.bg !== 'houseInterior')
        fail(`${path}.camera.view`, 'topDown requires houseInterior');
      if (c.view === 'topDown' && (!record(s.background) || s.background.variant !== 'staircase'))
        fail(`${path}.camera.view`, 'topDown requires the authored staircase variant');
      if (c.lighting !== undefined && !['normal', 'silhouette'].includes(String(c.lighting)))
        fail(`${path}.camera.lighting`, 'unknown lighting');
    }
    if (s.props !== undefined) {
      if (!Array.isArray(s.props)) fail(`${path}.props`, 'expected array');
      (s.props as unknown[]).forEach((p, j) => {
        const pp = `${path}.props[${j}]`;
        if (!record(p) || !propNames.includes(String(p.type)) || !finite(p.x))
          fail(pp, 'expected known type and numeric x');
        const prop = p as Record<string, unknown>;
        for (const key of ['y', 'size'])
          if (prop[key] !== undefined && !finite(prop[key]))
            fail(`${pp}.${key}`, 'expected finite number');
        if (
          prop.smoke !== undefined &&
          (prop.type !== 'furnace' || !finite(prop.smoke) || prop.smoke < 0 || prop.smoke > 1)
        )
          fail(`${pp}.smoke`, 'expected furnace smoke 0..1');
        if (prop.size !== undefined && (prop.size as number) <= 0)
          fail(`${pp}.size`, 'must be positive');
      });
    }
  });
}
export const sceneFrames = (seconds: number, fps: number) => Math.max(1, Math.round(seconds * fps));
export const timelineFrames = (timeline: Timeline, fps: number) =>
  timeline.reduce((sum, s) => sum + sceneFrames(s.durationSec, fps), 0);
export const actorIdentity = (actor: Actor, index: number) => actor.id ?? `${actor.type}-${index}`;
export const actorPoseTrack = (
  actor: Actor,
  fps: number,
  previous: PoseName = 'idle',
): PoseTrack => ({
  initial: actor.pose ?? 'idle',
  from: previous,
  keys: (actor.poses ?? []).map((key) => ({frame: Math.round(key.atSec * fps), pose: key.pose})),
});
export function poseAt(
  actor: Actor,
  frame: number,
  fps: number,
  previous: PoseName = 'idle',
): PoseTransition {
  return transitionAtTrack(actorPoseTrack(actor, fps, previous), frame, fps);
}
export function actorPosition(actor: Actor, frame: number, duration: number) {
  const from = actor.from ?? actor.x ?? 0.5;
  const to = actor.to ?? actor.x ?? from;
  return from + (to - from) * smoothstep(frame / Math.max(1, duration - 1));
}
/** Coordinates are normalized. Portrait compresses horizontal spacing and uses a taller stage. */
export function layoutActor(
  actor: Actor,
  normalizedX: number,
  width: number,
  height: number,
  seat?: {y: number; amount: number},
) {
  const portrait = height > width;
  const scale =
    (actor.scale ?? 1) *
    (actor.type === 'narrator' ? (portrait ? 1.75 : 1.42) : portrait ? 1.05 : 1.08);
  const standingY = height * (actor.y ?? (portrait ? (actor.type === 'dog' ? 0.835 : 0.79) : 0.81));
  const seatWeight = actor.type === 'narrator' && seat ? Math.max(0, Math.min(1, seat.amount)) : 0;
  const seatedY = seat ? seat.y + HUMAN_HIP_FROM_ANCHOR * scale : standingY;
  const from = actor.from ?? actor.x ?? 0.5;
  const to = actor.to ?? actor.x ?? from;
  const flip = actor.flip ?? (actor.type !== 'narrator' && from > to);
  return {
    x: width * (portrait ? 0.06 + normalizedX * 0.88 : normalizedX),
    y: standingY + (seatedY - standingY) * seatWeight,
    scale,
    flip,
    seatWeight,
  };
}
