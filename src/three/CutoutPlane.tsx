import {DoubleSide, type Texture} from 'three';
import {pixelPointToWorld, stageMetrics} from './space';

export type CutoutPlaneData = {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  z: number;
  scale: number;
  artworkWidth: number;
  artworkHeight: number;
  footOffset: number;
  svg: string;
};

type CutoutPlaneProps = CutoutPlaneData & {texture: Texture};

/** Display an existing rig SVG as a transparent billboard in the 3D set. */
export const CutoutPlane = ({
  width,
  height,
  x,
  y,
  z,
  scale,
  artworkWidth,
  artworkHeight,
  footOffset,
  texture,
}: CutoutPlaneProps) => {
  const metrics = stageMetrics(width, height, z);
  const position = pixelPointToWorld(x, y - footOffset * scale, width, height, z);

  return (
    <group position={position} scale={metrics.unitsPerPixel}>
      <mesh>
        <planeGeometry args={[artworkWidth * scale, artworkHeight * scale]} />
        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.01}
          depthWrite={false}
          side={DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};
