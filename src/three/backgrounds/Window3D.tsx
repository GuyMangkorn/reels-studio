import {pixelPointToWorld} from '../space';
import {setLayout} from '../../assets/backgrounds/layout';
import type {ThreeBackgroundProps} from './registry';

/** Keep the moon placement proportional to the same hand-drawn window at either aspect ratio. */
export const windowMoonPixelPoint = (
  width: number,
  height: number,
  x: number,
  y: number,
  pixelWidth: number,
  pixelHeight: number,
): [number, number] => [width * x + pixelWidth * 0.24, height * y - pixelHeight * 0.2];

/** The window and moon are part of the existing wall SVG; this scene adds only their cool light. */
export const Window3D = ({width, height}: ThreeBackgroundProps) => {
  const layout = setLayout(width, height);
  const moonX = layout.x + 855 * layout.scale;
  const moonY = 530 * layout.scale;
  const moonPosition = pixelPointToWorld(moonX, moonY, width, height, -6.45);

  return (
    <pointLight color="#d6e5ff" intensity={1.15} distance={7.5} decay={2} position={moonPosition} />
  );
};
