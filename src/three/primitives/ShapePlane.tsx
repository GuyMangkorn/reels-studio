import {useEffect, useMemo} from 'react';
import {DoubleSide, Shape, ShapeGeometry} from 'three';
import {linearOutputColor} from '../color';

export type ShapePlaneProps = {
  shape: Shape;
  color: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  opacity?: number;
  transparent?: boolean;
  lit?: boolean;
};

export const ShapePlane = ({
  shape,
  color,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  opacity = 1,
  transparent = opacity < 1,
  lit = false,
}: ShapePlaneProps) => {
  const geometry = useMemo(() => new ShapeGeometry(shape), [shape]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} position={position} rotation={rotation}>
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
};
