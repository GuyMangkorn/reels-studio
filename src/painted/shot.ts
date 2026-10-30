import type {ReactNode} from 'react';
import type {Camera} from './kit/camera';
import type {Painter} from './kit/painter';

export type ShotContext = {
  /** Shot-local seconds after `clock` (the plate clock). */
  tl: number;
  width: number;
  height: number;
};

/**
 * One registered painted plate. A timeline scene selects it by `id` (`scene.painted.shots[].shot`) and supplies only
 * timing; art, staging, camera and glow live here, as pure functions of the shot clock.
 */
export type PaintedShot = {
  id: string;
  /** Deliverable shot IDs this plate serves (for QA labels and Editor mapping). */
  serves: string[];
  /** Clear colour under the plate; a drained plate shows this. */
  paper: string;
  /** Shared camera of the canvas and the glow layers. */
  camera: (tl: number) => Camera;
  /** Optional remap of the shot clock (a freeze holds every mark, boil included). */
  clock?: (tl: number) => number;
  /** Optional plate opacity over the (unmapped) shot clock: a drain to paper. */
  alpha?: (tl: number) => number;
  /** World marks, painted inside the camera transform. */
  paint: (p: Painter, ctx: ShotContext) => void;
  /** Screen-space marks after the camera (rain, particles). */
  screen?: (p: Painter, ctx: ShotContext) => void;
  /** Remotion glow layers: a `CameraLayer` given `camera` and `opacity` (the plate's glow opacity during dissolves). */
  Overlay?: (props: ShotContext & {camera: Camera; opacity: number}) => ReactNode;
};
