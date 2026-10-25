import {DoubleSide} from 'three';
import {pixelPointToWorld, pixelSizeToWorld} from '../space';
import {linearOutputColor} from '../color';

export type PlaneProps = {
  width: number;
  height: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  opacity?: number;
  transparent?: boolean;
  lit?: boolean;
  renderOrder?: number;
};

export const Plane = ({
  width,
  height,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color,
  opacity = 1,
  transparent = opacity < 1,
  lit = false,
  renderOrder,
}: PlaneProps) => (
  <mesh position={position} rotation={rotation} renderOrder={renderOrder}>
    <planeGeometry args={[width, height]} />
    {lit ? (
      <meshLambertMaterial
        color={linearOutputColor(color)}
        emissive={linearOutputColor(color)}
        emissiveIntensity={0.24}
        opacity={opacity}
        transparent={transparent}
        side={DoubleSide}
        depthWrite={!transparent}
      />
    ) : (
      <meshBasicMaterial
        color={linearOutputColor(color)}
        opacity={opacity}
        transparent={transparent}
        side={DoubleSide}
        depthWrite={!transparent}
      />
    )}
  </mesh>
);

export type ScreenPlaneProps = Omit<PlaneProps, 'width' | 'height' | 'position'> & {
  x: number;
  y: number;
  pixelWidth: number;
  pixelHeight: number;
  compositionWidth: number;
  compositionHeight: number;
  z?: number;
};

/** Pixel-authored billboard plane, uniformly mapped to the scene's world scale. */
export const ScreenPlane = ({
  x,
  y,
  pixelWidth,
  pixelHeight,
  compositionWidth,
  compositionHeight,
  z = 0,
  ...props
}: ScreenPlaneProps) => {
  const [width, height] = pixelSizeToWorld(
    pixelWidth,
    pixelHeight,
    compositionWidth,
    compositionHeight,
    z,
  );
  const position = pixelPointToWorld(x, y, compositionWidth, compositionHeight, z);
  return <Plane {...props} width={width} height={height} position={position} />;
};
