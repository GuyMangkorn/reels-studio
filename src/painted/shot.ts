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
  /** C_seamless: this shot is the first of a video whose last frame is built to equal its frame 0. The loop blend then crossfades only the
   * overlay layers (grade, glow, shade); frame 0's ink is not laid at partial alpha (faded ink mixes toward paper and bleaches the picture
   * mid-blend, EDU-EP01 W5.3) and cuts in on the last frame, which equals the frame before it. */
  loopExact?: boolean;
  /** World marks, painted inside the camera transform. */
  paint: (p: Painter, ctx: ShotContext) => void;
  /** Screen-space marks after the camera (rain, particles). */
  screen?: (p: Painter, ctx: ShotContext) => void;
  /** Remotion glow layers: a `CameraLayer` given `camera` and `opacity` (the plate's glow opacity during dissolves). */
  Overlay?: (props: ShotContext & {camera: Camera; opacity: number}) => ReactNode;
};
