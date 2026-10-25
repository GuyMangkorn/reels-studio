import {DoubleSide} from 'three';
import {linearOutputColor} from '../color';

export type DiscProps = {
  radius: number;
  color: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  opacity?: number;
  lit?: boolean;
  renderOrder?: number;
};

export const Disc = ({
  radius,
  color,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  opacity = 1,
  lit = false,
  renderOrder,
}: DiscProps) => (
  <mesh position={position} rotation={rotation} renderOrder={renderOrder}>
    <circleGeometry args={[radius, 64]} />
    {lit ? (
      <meshLambertMaterial
        color={linearOutputColor(color)}
        emissive={linearOutputColor(color)}
        emissiveIntensity={0.24}
        opacity={opacity}
        transparent={opacity < 1}
        side={DoubleSide}
        depthWrite={opacity === 1}
      />
    ) : (
      <meshBasicMaterial
        color={linearOutputColor(color)}
        opacity={opacity}
        transparent={opacity < 1}
        side={DoubleSide}
        depthWrite={opacity === 1}
      />
    )}
  </mesh>
);
