import type {Scene} from '../../scenes/types';
import type {CameraConfig, ImpactConfig} from '../../camera/Camera';
import type {TimeOfDay} from '../../assets/Background';
import type {BackgroundOptions} from '../../assets/backgrounds/HouseInterior';

export type ThreeBackgroundName = 'drawingRoom' | 'bedroom' | 'staircase' | 'window' | 'exterior';
export type ThreeBackgroundProps = {
  width: number;
  height: number;
  frame: number;
  fps: number;
  duration: number;
  time: TimeOfDay;
  background?: BackgroundOptions;
  camera?: CameraConfig;
  impact?: ImpactConfig;
};

/** Return a 3D set ID only where a reusable 3D scene has been authored. */
export function resolveThreeBackground(
  scene: Pick<Scene, 'bg' | 'background'>,
): ThreeBackgroundName | null {
  if (scene.bg === 'oldHouseExterior') return 'exterior';
  if (scene.bg !== 'houseInterior') return null;

  switch (scene.background?.variant ?? 'drawing') {
    case 'drawing':
    case 'dining':
    case 'kitchen':
      return 'drawingRoom';
    case 'bedroomPOV':
      return 'bedroom';
    case 'staircase':
      return 'staircase';
    case 'window':
      return 'window';
    default:
      return null;
  }
}
