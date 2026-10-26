import {DoubleSide, type Texture} from 'three';
import {pixelPointToWorld, stageMetrics} from './space';

export type SvgTextureLayerData = {
  id: string;
  svg: string;
  textureWidth: number;
  textureHeight: number;
  z?: number;
  lit?: boolean;
  opacity?: number;
  renderOrder?: number;
  overfill?: number;
  scale?: number;
  centerX?: number;
  centerY?: number;
  worldPosition?: [number, number, number];
  worldSize?: [number, number];
  rotation?: [number, number, number];
};

export const SvgTexturePlane = ({
  layer,
  compositionWidth,
  compositionHeight,
  texture,
}: {
  layer: SvgTextureLayerData;
  compositionWidth: number;
  compositionHeight: number;
  texture: Texture;
}) => {
  const z = layer.z ?? 0;
  const scale = layer.scale ?? 1;
  const metrics = stageMetrics(compositionWidth, compositionHeight, z);
  const position =
    layer.worldPosition ??
    pixelPointToWorld(
      layer.centerX ?? compositionWidth / 2,
      layer.centerY ?? compositionHeight / 2,
      compositionWidth,
      compositionHeight,
      z,
    );
  const width = layer.worldSize?.[0] ?? metrics.width * (layer.overfill ?? 1.24) * scale;
  const height = layer.worldSize?.[1] ?? metrics.height * (layer.overfill ?? 1.24) * scale;
  const materialProps = {
    map: texture,
    opacity: layer.opacity ?? 1,
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    toneMapped: false,
  } as const;

  return (
    <mesh
      position={position}
      rotation={layer.rotation ?? [0, 0, 0]}
      renderOrder={layer.renderOrder}
    >
      <planeGeometry args={[width, height]} />
      {layer.lit ? (
        <meshLambertMaterial
          {...materialProps}
          color="#808080"
          emissive="#ffffff"
          emissiveMap={texture}
          emissiveIntensity={0.8}
          alphaTest={0.005}
        />
      ) : (
        <meshBasicMaterial {...materialProps} alphaTest={0.005} />
      )}
    </mesh>
  );
};
