import type {ReactNode} from 'react';
import {smoothstep} from '../rig/poses';
export const cameraPresetNames = ['dolly', 'truck', 'povCreep', 'peek', 'watcher'] as const;
export type CameraPresetName = (typeof cameraPresetNames)[number];
export type ThreeCameraState = {
  preset: CameraPresetName;
  position: [number, number, number];
  target: [number, number, number];
  reveal: number;
  foregroundBlur: number;
};

/** Use a wider vertical field of view in portrait to keep the stage legible. */
export function fovForAspect(width: number, height: number): number {
  return height > width ? 62 : 42;
}

/** Declarative 3D camera presets; all motion is a pure function of the local frame. */
export function threeCameraAt(
  preset: CameraPresetName | undefined,
  frame: number,
  duration: number,
  fps = 30,
): ThreeCameraState {
  const selected = preset ?? 'dolly';
  const lastFrame = Math.max(1, duration - 1);
  const localFrame = Math.max(0, Math.min(frame, lastFrame));
  const progress = smoothstep(localFrame / lastFrame);
  const seconds = localFrame / Math.max(1, fps);
  const bob = Math.sin((seconds * Math.PI * 2) / 4.8);

  switch (selected) {
    case 'truck': {
      const x = -0.7 + progress * 1.4;
      return {
        preset: selected,
        position: [x, 1.6, 9],
        target: [x * 0.55, -0.8, 0],
        reveal: 1,
        foregroundBlur: 0,
      };
    }
    case 'povCreep':
      return {
        preset: selected,
        position: [0, 1.6 + bob * 0.035, 9 - progress * 1.7],
        target: [0, -0.8 + bob * 0.025, 0],
        reveal: 1,
        foregroundBlur: 0,
      };
    case 'peek': {
      const x = -1.05 + progress * 0.7;
      return {
        preset: selected,
        position: [x, 1.55, 9],
        target: [0.25 * progress, -0.8, 0],
        reveal: progress,
        foregroundBlur: 0,
      };
    }
    case 'watcher': {
      const drift = Math.sin(seconds * 0.32) * 0.18;
      return {
        preset: selected,
        position: [drift, 0.72, 8.9],
        target: [drift * 0.35, -0.8, 0],
        reveal: 1,
        foregroundBlur: 1,
      };
    }
    case 'dolly':
    default:
      return {
        preset: 'dolly',
        position: [0, 1.6, 9 - progress * 1.25],
        target: [0, -0.8, 0],
        reveal: 1,
        foregroundBlur: 0,
      };
  }
}
export type ImpactConfig = {atSec: number};
export type ImpactState = {x: number; y: number; flicker: number};

/** Deterministic, short-lived shoulder-hit motion for first-person bedroom shots. */
export function impactAt(
  impact: ImpactConfig | undefined,
  frame: number,
  fps: number,
): ImpactState {
  if (!impact) return {x: 0, y: 0, flicker: 0};
  const elapsed = frame - impact.atSec * fps;
  const duration = Math.max(1, fps * 0.36);
  if (elapsed < 0 || elapsed > duration) return {x: 0, y: 0, flicker: 0};
  const phase = elapsed / duration;
  const envelope = Math.sin(Math.PI * phase);
  return {
    x: Math.sin(elapsed * 1.9) * 0.009 * envelope,
    y: Math.cos(elapsed * 2.4) * 0.007 * envelope,
    flicker: envelope * (1 - phase * 0.35),
  };
}

export type CameraConfig = {
  preset?: CameraPresetName;
  zoom?: [number, number];
  pan?: {from: [number, number]; to: [number, number]};
  parallax?: number;
  view?: 'front' | 'topDown';
  lighting?: 'normal' | 'silhouette';
};
/** Pan offsets are fractions of stage width/height; progress is local to each shot. */
export function cameraAt(
  camera: CameraConfig = {},
  frame: number,
  duration: number,
  fps = 30,
  impact?: ImpactConfig,
) {
  const t = smoothstep(frame / Math.max(1, duration - 1));
  const zoom = camera.zoom ?? [1, 1];
  const pan = camera.pan ?? {from: [0, 0], to: [0, 0]};
  const scale = zoom[0] + (zoom[1] - zoom[0]) * t;
  const margin = (scale - 1) / 2;
  const cropSafe = (value: number) => Math.max(-margin, Math.min(margin, value));
  const shake = impactAt(impact, frame, fps);
  return {
    zoom: scale,
    x: cropSafe(pan.from[0] + (pan.to[0] - pan.from[0]) * t) + shake.x,
    y: cropSafe(pan.from[1] + (pan.to[1] - pan.from[1]) * t) + shake.y,
  };
}
export const Camera = ({
  camera,
  frame,
  duration,
  fps = 30,
  impact,
  width,
  height,
  children,
}: {
  camera?: CameraConfig;
  frame: number;
  duration: number;
  fps?: number;
  impact?: ImpactConfig;
  width: number;
  height: number;
  children: ReactNode;
}) => {
  const state = cameraAt(camera, frame, duration, fps, impact);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transformOrigin: '50% 50%',
        transform: `translate(${state.x * width}px, ${state.y * height}px) scale(${state.zoom})`,
      }}
    >
      {children}
    </div>
  );
};
