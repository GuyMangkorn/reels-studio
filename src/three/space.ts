import {fovForAspect} from '../camera/Camera';

export const STAGE_WORLD_HEIGHT = 10.8;
export const STAGE_CAMERA_Y = 1.6;
export const STAGE_TARGET_Y = -0.8;

export type StageMetrics = {
  width: number;
  height: number;
  unitsPerPixel: number;
  cameraDistance: number;
  centerY: number;
};

/** Visible world dimensions at a plane depth, using the stage's uniform pixel scale. */
export function stageMetrics(width: number, height: number, z = 0): StageMetrics {
  const fov = fovForAspect(width, height);
  const cameraDistance = STAGE_WORLD_HEIGHT / (2 * Math.tan((fov * Math.PI) / 360));
  const depthRatio = (cameraDistance - z) / cameraDistance;
  const visibleHeight = STAGE_WORLD_HEIGHT * depthRatio;
  const centerY = STAGE_CAMERA_Y + (STAGE_TARGET_Y - STAGE_CAMERA_Y) * depthRatio;

  return {
    width: visibleHeight * (width / height),
    height: visibleHeight,
    unitsPerPixel: visibleHeight / height,
    cameraDistance,
    centerY,
  };
}

/** Convert a pixel-authored point to world coordinates at a fixed z plane. */
export function pixelPointToWorld(
  x: number,
  y: number,
  width: number,
  height: number,
  z = 0,
): [number, number, number] {
  const metrics = stageMetrics(width, height, z);
  return [
    (x / width - 0.5) * metrics.width,
    metrics.centerY + (0.5 - y / height) * metrics.height,
    z,
  ];
}

/** Convert pixel dimensions uniformly so circles and windows keep their true shape. */
export function pixelSizeToWorld(
  pixelWidth: number,
  pixelHeight: number,
  width: number,
  height: number,
  z = 0,
): [number, number] {
  const unitsPerPixel = stageMetrics(width, height, z).unitsPerPixel;
  return [pixelWidth * unitsPerPixel, pixelHeight * unitsPerPixel];
}

/** Screen-locked ground anchor at z=0; the floor plane can extend into depth below it. */
export function groundAnchorY(normalizedY: number): number {
  return STAGE_TARGET_Y + (0.5 - normalizedY) * STAGE_WORLD_HEIGHT;
}
