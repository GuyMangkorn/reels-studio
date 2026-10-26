import type {Actor} from '../scenes/types';
import {PHYSICAL_ACTOR_SPECS} from '../rig/physicalScale';
import {propSpecs} from '../assets/Props';
import type {BoundsMeters, OrthographicProjection, OrthographicView, ScenePropSpec, WorldPositionKey} from './types';
import {smoothstep} from '../rig/poses';

export type ProjectedView = {
  view: BoundsMeters;
  pixelsPerMeter: number;
  letterboxX: number;
  letterboxY: number;
};

export function worldToOutputPoint(point: {x: number; y: number}, view: ProjectedView) {
  return {x: view.letterboxX + (point.x - view.view.left) * view.pixelsPerMeter, y: view.letterboxY + (view.view.top - point.y) * view.pixelsPerMeter};
}

const cameraOffsetAt = (view: OrthographicView, frame: number, fps: number) => {
  const keys = view.cameraMoves;
  if (!keys?.length) return {x: 0, y: 0, zoom: 1};
  const seconds = Math.max(0, frame / fps);
  let from = keys[0];
  for (let i = 1; i < keys.length; i++) {
    const to = keys[i];
    if (seconds < to.atSec) {
      if (to.cut) return {x: from.x, y: from.y, zoom: from.zoom ?? 1};
      const progress = smoothstep((seconds - from.atSec) / (to.atSec - from.atSec));
      const fromZoom = from.zoom ?? 1; const toZoom = to.zoom ?? 1;
      return {x: from.x + (to.x - from.x) * progress, y: from.y + (to.y - from.y) * progress,
        zoom: fromZoom + (toZoom - fromZoom) * progress};
    }
    from = to;
  }
  return {x: from.x, y: from.y, zoom: from.zoom ?? 1};
};

/** Resolve the camera bounds and one uniform metres-to-output-pixels mapping. */
export function orthographicViewAt(projection: OrthographicProjection, width: number, height: number, frame: number, fps: number, portrait: boolean): ProjectedView {
  const camera = projection.views[portrait ? 'short' : 'long'];
  const offset = cameraOffsetAt(camera, frame, fps);
  const centerX = (camera.bounds.left + camera.bounds.right) / 2 + offset.x;
  const centerY = (camera.bounds.bottom + camera.bounds.top) / 2 + offset.y;
  const viewWidth = (camera.bounds.right - camera.bounds.left) / offset.zoom;
  const viewHeight = (camera.bounds.top - camera.bounds.bottom) / offset.zoom;
  const view = {left: centerX - viewWidth / 2, right: centerX + viewWidth / 2, bottom: centerY - viewHeight / 2, top: centerY + viewHeight / 2};
  const pixelsPerMeter = Math.min(width / (view.right - view.left), height / (view.top - view.bottom));
  const letterboxX = (width - (view.right - view.left) * pixelsPerMeter) / 2;
  const letterboxY = (height - (view.top - view.bottom) * pixelsPerMeter) / 2;
  return {
    view,
    pixelsPerMeter,
    letterboxX,
    letterboxY,
  };
}

/** Resolve a deterministic actor path in metres using the scene-local clock. */
export function worldPositionAt(keys: readonly WorldPositionKey[], frame: number, fps: number) {
  const seconds = Math.max(0, frame / fps);
  let from = keys[0];
  for (let i = 1; i < keys.length; i++) {
    const to = keys[i];
    if (seconds <= to.atSec) {
      const progress = smoothstep((seconds - from.atSec) / (to.atSec - from.atSec));
      return {x: from.x + (to.x - from.x) * progress, y: from.y + (to.y - from.y) * progress,
        direction: Math.sign(to.x - from.x)};
    }
    from = to;
  }
  const last = keys.at(-1)!;
  return {x: last.x, y: last.y, direction: Math.sign(last.x - (keys.at(-2)?.x ?? last.x))};
}

/** Project a world floor anchor while preserving the rig's canonical proportions. */
export function layoutWorldActor(actor: Actor, point: {x: number; y: number; direction?: number}, view: ProjectedView) {
  if (!actor.world) throw new Error(`Actor ${actor.id ?? actor.type} is missing a world path`);
  const spec = actor.type === 'narrator' || actor.type === 'cat' ? PHYSICAL_ACTOR_SPECS[actor.type] : undefined;
  if (!spec) throw new Error(`No physical-scale spec for actor ${actor.type}`);
  const position = worldToOutputPoint(point, view);
  const scaleY = spec.heightM / (spec.solidBounds.bottom - spec.solidBounds.top) * view.pixelsPerMeter;
  return {
    ...position,
    scale: scaleY,
    flip: actor.flip ?? (actor.type !== 'narrator' && (point.direction ?? 0) < 0),
    seatWeight: 0,
  };
}

/** Place a physical prop by its named floor anchor and preserve its authored solid bounds. */
export function layoutWorldProp(prop: ScenePropSpec, view: ProjectedView) {
  if (!prop.world) throw new Error(`World prop ${prop.type} is missing a metre-space anchor`);
  const spec = propSpecs[prop.type];
  const physical = spec.physicalEstimate;
  const floorAnchor = spec.floorAnchor;
  if (!physical || !floorAnchor) throw new Error(`${prop.type} has no physical bounds/floor anchor`);
  const scaleX = physical.widthM / (physical.solidBounds.right - physical.solidBounds.left) * view.pixelsPerMeter;
  const scaleY = physical.heightM / (physical.solidBounds.bottom - physical.solidBounds.top) * view.pixelsPerMeter;
  const anchor = worldToOutputPoint(prop.world, view);
  return {
    x: anchor.x + (spec.pivot.x - floorAnchor.x) * scaleX,
    y: anchor.y + (spec.pivot.y - floorAnchor.y) * scaleY,
    width: spec.bounds.width * scaleX,
    height: spec.bounds.height * scaleY,
  };
}
