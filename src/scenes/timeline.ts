import {visualModes} from '../assets/visuals/types';
import {poses, smoothstep, transitionAtTrack, type PoseName, type PoseTrack, type PoseTransition} from '../rig/poses';
import {HUMAN_HIP_FROM_ANCHOR} from '../rig/geometry';
import {propNames, propSpecs, type PropName} from '../assets/Props';
import {PHYSICAL_ACTOR_SPECS} from '../rig/physicalScale';
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
    if (s.projection !== undefined && s.bg !== 'room') fail(`${path}.bg`, 'background has no implementation for the physical metre stage');
    if (s.time !== undefined && !['day', 'night'].includes(String(s.time))) fail(`${path}.time`, 'expected day or night');
    if (typeof s.subtitle !== 'string') fail(`${path}.subtitle`, 'expected text');
    for (const key of ['title', 'eyebrow']) if (s[key] !== undefined && typeof s[key] !== 'string') fail(`${path}.${key}`, 'expected text');
    if (s.visuals !== undefined) {
      if (!Array.isArray(s.visuals) || s.visuals.length === 0) fail(`${path}.visuals`, 'expected non-empty timed visuals');
      let end = 0;
      const shotIds = new Set<string>();
      (s.visuals as unknown[]).forEach((rawVisual, j) => {
        const vp = `${path}.visuals[${j}]`;
        if (!record(rawVisual)) fail(vp, 'expected visual object');
        const visual = rawVisual as Record<string, unknown>;
        if (!(visualModes as readonly string[]).includes(String(visual.id))) fail(`${vp}.id`, 'unknown visual mode');
        if (typeof visual.shotId !== 'string' || !visual.shotId.trim() || shotIds.has(visual.shotId)) fail(`${vp}.shotId`, 'expected unique stable shot ID');
        shotIds.add(visual.shotId as string);
        if (typeof visual.sourceBeatId !== 'string' || !visual.sourceBeatId.trim()) fail(`${vp}.sourceBeatId`, 'expected the source script beat ID');
        if (!finite(visual.startSec) || visual.startSec < end || !finite(visual.endSec) || visual.endSec <= visual.startSec || visual.endSec > (s.durationSec as number)) fail(vp, 'visual intervals must be ordered, non-overlapping and inside scene');
        end = visual.endSec as number;
        if (!finite(visual.phase) || !Number.isInteger(visual.phase) || visual.phase < 0 || visual.phase > 3) fail(`${vp}.phase`, 'expected phase 0–3');
        if (!['fiction', 'diagram', 'research', 'hypothesis'].includes(String(visual.status))) fail(`${vp}.status`, 'expected factual image status');
        if (typeof visual.heading !== 'string' || !visual.heading.trim()) fail(`${vp}.heading`, 'expected heading');
        if (!Array.isArray(visual.labels) || visual.labels.length > 8 || visual.labels.some(label => typeof label !== 'string')) fail(`${vp}.labels`, 'expected up to eight text labels');
        if (visual.showDiagram !== undefined && typeof visual.showDiagram !== 'boolean') fail(`${vp}.showDiagram`, 'expected boolean');
        if (visual.labelsAtSec !== undefined) {
          if (!Array.isArray(visual.labelsAtSec) || visual.labelsAtSec.length !== (visual.labels as unknown[]).length) fail(`${vp}.labelsAtSec`, 'expected one reveal time per visual label');
          (visual.labelsAtSec as unknown[]).forEach((atSec, k) => {
            if (!finite(atSec) || atSec < (visual.startSec as number) || atSec >= (visual.endSec as number)) fail(`${vp}.labelsAtSec[${k}]`, 'reveal time must fall inside the visual interval');
          });
        }
      });
    }
    if (s.projection !== undefined) {
      if (!record(s.projection)) fail(`${path}.projection`, 'expected orthographic projection object');
      const projection = s.projection as Record<string, unknown>;
      if (projection.unit !== 'm') fail(`${path}.projection.unit`, 'expected metre units');
      const readBounds = (rawBounds: unknown, boundsPath: string) => {
        if (!record(rawBounds)) fail(boundsPath, 'expected bounds object');
        const bounds = rawBounds as Record<string, unknown>;
        for (const edge of ['left', 'right', 'bottom', 'top']) if (!finite(bounds[edge])) fail(`${boundsPath}.${edge}`, 'expected finite metres');
        if ((bounds.right as number) <= (bounds.left as number) || (bounds.top as number) <= (bounds.bottom as number)) fail(boundsPath, 'right/top must exceed left/bottom');
        return bounds as {left: number; right: number; bottom: number; top: number};
      };
      const stage = readBounds(projection.stage, `${path}.projection.stage`);
      if (!record(projection.views)) fail(`${path}.projection.views`, 'expected short and long view objects');
      const views = projection.views as Record<string, unknown>;
      for (const [name, ratio] of [['short', 1080 / 1920], ['long', 1920 / 1080]] as const) {
        if (!record(views[name])) fail(`${path}.projection.views.${name}`, 'expected view object');
        const view = views[name] as Record<string, unknown>;
        const bounds = readBounds(view.bounds, `${path}.projection.views.${name}.bounds`);
        if (bounds.left < stage.left || bounds.right > stage.right || bounds.bottom < stage.bottom || bounds.top > stage.top) fail(`${path}.projection.views.${name}.bounds`, 'view must stay inside the authored stage bounds');
        const aspect = (bounds.right - bounds.left) / (bounds.top - bounds.bottom);
        if (Math.abs(aspect - ratio) / ratio > 0.005) fail(`${path}.projection.views.${name}.bounds`, 'view aspect ratio must match its output composition');
        if (view.cameraMoves !== undefined) {
          if (!Array.isArray(view.cameraMoves) || view.cameraMoves.length < 2) fail(`${path}.projection.views.${name}.cameraMoves`, 'expected at least two camera keys');
          let last = -1;
          let previousKey: Record<string, unknown> | undefined;
          (view.cameraMoves as unknown[]).forEach((rawKey, k) => {
            const kp = `${path}.projection.views.${name}.cameraMoves[${k}]`;
            if (!record(rawKey) || !finite(rawKey.atSec) || rawKey.atSec < 0 || rawKey.atSec > (s.durationSec as number) || rawKey.atSec <= last) fail(kp, 'camera times must increase within the scene');
            const key = rawKey as Record<string, unknown>;
            if (k === 0 && key.atSec !== 0) fail(`${kp}.atSec`, 'first camera key must start at zero');
            for (const axis of ['x', 'y']) if (!finite(key[axis])) fail(`${kp}.${axis}`, 'expected finite metre offset');
            if (key.zoom !== undefined && (!finite(key.zoom) || key.zoom <= 0 || key.zoom > 8)) fail(`${kp}.zoom`, 'must be greater than zero and at most 8');
            if (key.cut !== undefined && typeof key.cut !== 'boolean') fail(`${kp}.cut`, 'expected boolean');
            const zoom = (key.zoom as number | undefined) ?? 1;
            const centerX = (bounds.left + bounds.right) / 2 + (key.x as number);
            const centerY = (bounds.bottom + bounds.top) / 2 + (key.y as number);
            const halfWidth = (bounds.right - bounds.left) / (2 * zoom);
            const halfHeight = (bounds.top - bounds.bottom) / (2 * zoom);
            if (centerX - halfWidth < stage.left || centerX + halfWidth > stage.right || centerY - halfHeight < stage.bottom || centerY + halfHeight > stage.top) fail(kp, 'camera view must stay inside the physical stage bounds');
            if (previousKey && key.cut !== true) {
              const previousZoom = (previousKey.zoom as number | undefined) ?? 1;
              const maxHalfWidth = (bounds.right - bounds.left) / (2 * Math.min(previousZoom, zoom));
              const maxHalfHeight = (bounds.top - bounds.bottom) / (2 * Math.min(previousZoom, zoom));
              const previousCenterX = (bounds.left + bounds.right) / 2 + (previousKey.x as number);
              const previousCenterY = (bounds.bottom + bounds.top) / 2 + (previousKey.y as number);
              if (Math.min(centerX, previousCenterX) - maxHalfWidth < stage.left || Math.max(centerX, previousCenterX) + maxHalfWidth > stage.right || Math.min(centerY, previousCenterY) - maxHalfHeight < stage.bottom || Math.max(centerY, previousCenterY) + maxHalfHeight > stage.top) fail(kp, 'interpolated camera move may expose outside the physical stage bounds');
            }
            previousKey = key;
            last = key.atSec as number;
          });
        }
      }
    }
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
      if (s.projection !== undefined) {
        if (a.world === undefined || !record(a.world)) fail(`${ap}.world`, 'projected scenes require a metre-space world path');
        if (a.seat !== undefined) fail(`${ap}.seat`, 'physical projection uses explicit world anchors; normalized sofa seating is unavailable');
        if (typeof a.type !== 'string' || !Object.hasOwn(PHYSICAL_ACTOR_SPECS, a.type)) fail(`${ap}.type`, 'actor has no CATBOX physical dimension spec');
        for (const key of ['x', 'y', 'from', 'to', 'scale', 'portrait']) if (a[key] !== undefined) fail(`${ap}.${key}`, 'normalized or actor-only portrait layout is not allowed with physical projection');
        const world = a.world as Record<string, unknown>;
        if (!Array.isArray(world.keys) || world.keys.length === 0) fail(`${ap}.world.keys`, 'expected at least one position key');
        let last = -1;
        (world.keys as unknown[]).forEach((rawKey, k) => {
          const kp = `${ap}.world.keys[${k}]`;
          if (!record(rawKey) || !finite(rawKey.atSec) || rawKey.atSec < 0 || rawKey.atSec > (s.durationSec as number) || rawKey.atSec <= last) fail(kp, 'position times must increase within scene');
          const key = rawKey as Record<string, unknown>;
          if (k === 0 && key.atSec !== 0) fail(`${kp}.atSec`, 'first world key must start at zero');
          for (const axis of ['x', 'y']) if (!finite(key[axis])) fail(`${kp}.${axis}`, 'expected finite metres');
          last = key.atSec as number;
        });
      } else if (a.world !== undefined) {
        fail(`${ap}.world`, 'metre-space actor paths require a scene projection');
      }
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
      if (a.poseTransitionFrames !== undefined && (!Number.isInteger(a.poseTransitionFrames) || (a.poseTransitionFrames as number) < 1 || (a.poseTransitionFrames as number) > 120)) fail(`${ap}.poseTransitionFrames`, 'expected 1–120 frames');
    });
    if (s.props !== undefined) {
      if (!Array.isArray(s.props)) fail(`${path}.props`, 'expected array');
      (s.props as unknown[]).forEach((p, j) => {
        const pp = `${path}.props[${j}]`;
        if (!record(p) || !propNames.includes(String(p.type) as PropName)) fail(pp, 'expected known prop type');
        const prop = p as Record<string, unknown>;
        const projectedScene = s.projection !== undefined;
        if (projectedScene) {
          if (!['screen', 'world'].includes(String(prop.space))) fail(`${pp}.space`, 'projected scenes must declare screen or world space');
          if (prop.space === 'world') {
            if (!record(prop.world) || !finite(prop.world.x) || !finite(prop.world.y)) fail(`${pp}.world`, 'expected metre-space floor anchor');
            if (prop.x !== undefined || prop.y !== undefined || prop.size !== undefined || prop.portrait !== undefined) fail(pp, 'world props use canonical dimensions and metre anchors only');
            if (!propSpecs[prop.type as PropName].physicalEstimate || !propSpecs[prop.type as PropName].floorAnchor) fail(`${pp}.type`, 'world prop has no physical bounds/floor anchor');
            if (prop.worldMotion !== undefined) {
              if (!Array.isArray(prop.worldMotion) || prop.worldMotion.length === 0) fail(`${pp}.worldMotion`, 'expected a non-empty scene-local path');
              let motionLast = -1;
              (prop.worldMotion as unknown[]).forEach((rawKey, k) => {
                const kp = `${pp}.worldMotion[${k}]`;
                if (!record(rawKey) || !finite(rawKey.atSec) || rawKey.atSec < 0 || rawKey.atSec > (s.durationSec as number) || rawKey.atSec <= motionLast) fail(kp, 'position times must increase within scene');
                const key = rawKey as Record<string, unknown>;
                if (k === 0 && key.atSec !== 0) fail(`${kp}.atSec`, 'first world path key must start at zero');
                for (const axis of ['x', 'y']) if (!finite(key[axis])) fail(`${kp}.${axis}`, 'expected finite metres');
                motionLast = key.atSec as number;
              });
            }
          } else {
            if (prop.world !== undefined) fail(`${pp}.world`, 'screen-space props cannot also specify a world anchor');
            if (prop.worldMotion !== undefined) fail(`${pp}.worldMotion`, 'world prop paths require world space');
            if (!finite(prop.x) || (prop.x as number) < 0 || (prop.x as number) > 1) fail(`${pp}.x`, 'expected normalized screen position from 0 to 1');
          }
        } else {
          if (!finite(prop.x)) fail(`${pp}.x`, 'expected numeric x');
          if (prop.space === 'world' || prop.world !== undefined) fail(`${pp}.world`, 'metre-space props require a scene projection');
        }
        for (const key of ['y', 'size']) if (prop[key] !== undefined && !finite(prop[key])) fail(`${pp}.${key}`, 'expected finite number');
        if (prop.size !== undefined && (prop.size as number) <= 0) fail(`${pp}.size`, 'must be positive');
        for (const key of ['color', 'label', 'detail']) if (prop[key] !== undefined && typeof prop[key] !== 'string') fail(`${pp}.${key}`, 'expected text');
        if (prop.variant !== undefined && (prop.type !== 'catbox-stimulus' || !stimulusVariants.includes(String(prop.variant)))) fail(`${pp}.variant`, 'unsupported variant for prop');
        if (prop.tone !== undefined && (prop.type !== 'catbox-card' || !propTones.includes(String(prop.tone)))) fail(`${pp}.tone`, 'unsupported tone for prop');
        if (prop.layer !== undefined && !['back', 'front'].includes(String(prop.layer))) fail(`${pp}.layer`, 'expected back or front');
        if (prop.startSec !== undefined && (!finite(prop.startSec) || prop.startSec < 0 || prop.startSec >= (s.durationSec as number))) fail(`${pp}.startSec`, 'must fall inside scene');
        if (prop.endSec !== undefined && (!finite(prop.endSec) || prop.endSec <= (prop.startSec as number ?? 0) || prop.endSec > (s.durationSec as number))) fail(`${pp}.endSec`, 'must follow startSec and stay within scene');
        if (prop.portrait !== undefined) {
          if (projectedScene) fail(`${pp}.portrait`, 'projected screen props use one screen-space layout; physical world props cannot use portrait overrides');
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
    x: (layout?.x ?? prop.x ?? .5) * width,
    y: (layout?.y ?? prop.y ?? .8) * height,
    size: (layout?.size ?? prop.size ?? 240) * (portrait ? 1.1 : 1),
  };
}
export const actorIdentity = (actor: Actor, index: number) => actor.id ?? `${actor.type}-${index}`;
export const actorPoseTrack = (actor: Actor, fps: number, previous: PoseName = 'idle'): PoseTrack => ({initial: actor.pose ?? 'idle', from: previous, keys: (actor.poses ?? []).map(key => ({frame: Math.round(key.atSec * fps), pose: key.pose})), ...(actor.poseTransitionFrames === undefined ? {} : {durationFrames: actor.poseTransitionFrames})});
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
