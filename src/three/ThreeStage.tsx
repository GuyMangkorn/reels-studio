import {ThreeCanvas} from '@remotion/three';
import {useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode} from 'react';
import {useDelayRender} from 'remotion';
import {CanvasTexture, LinearSRGBColorSpace, SRGBColorSpace, PerspectiveCamera} from 'three';
import {useThree} from '@react-three/fiber';
import {Disc} from './primitives/Disc';
import {
  fovForAspect,
  threeCameraAt,
  type CameraConfig,
  type ThreeCameraState,
  type ImpactConfig,
  impactAt,
} from '../camera/Camera';
import {lampFlickerAt} from './lighting';
import {pixelPointToWorld} from './space';
import {CutoutPlane, type CutoutPlaneData} from './CutoutPlane';
import {SvgTexturePlane, type SvgTextureLayerData} from './SvgTexturePlane';
import {WatcherForeground} from './backgrounds/parts';

type ThreeStageProps = {
  width: number;
  height: number;
  frame: number;
  fps: number;
  duration: number;
  camera?: CameraConfig;
  impact?: ImpactConfig;
  lamp?: {x: number; y: number; z?: number};
  children?: ReactNode;
  cutouts?: CutoutPlaneData[];
  textureLayers?: SvgTextureLayerData[];
};

const rasterizeCutout = (cutout: CutoutPlaneData) =>
  new Promise<CanvasTexture>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.ceil(cutout.artworkWidth * cutout.scale * 2));
      canvas.height = Math.max(1, Math.ceil(cutout.artworkHeight * cutout.scale * 2));
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Could not create a 2D canvas for a character cutout'));
        return;
      }
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const texture = new CanvasTexture(canvas);
      texture.colorSpace = SRGBColorSpace;
      texture.needsUpdate = true;
      texture.anisotropy = 8;
      resolve(texture);
    };
    image.onerror = () => reject(new Error(`Could not load cutout ${cutout.id} as an SVG texture`));
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cutout.svg)}`;
  });

const rasterizeSvgLayer = (layer: SvgTextureLayerData) =>
  new Promise<CanvasTexture>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, layer.textureWidth);
      canvas.height = Math.max(1, layer.textureHeight);
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error(`Could not create a 2D canvas for SVG layer ${layer.id}`));
        return;
      }
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const texture = new CanvasTexture(canvas);
      // The linear WebGL output expects color-authored SVG channel values as-is.
      texture.colorSpace = LinearSRGBColorSpace;
      texture.needsUpdate = true;
      texture.anisotropy = 8;
      resolve(texture);
    };
    image.onerror = () => reject(new Error(`Could not load ${layer.id} as an SVG texture`));
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(layer.svg)}`;
  });

const CutoutTextureCommit = ({
  revision,
  onPainted,
}: {
  revision: string;
  onPainted: (revision: string) => void;
}) => {
  const advance = useThree((store) => store.advance);
  useLayoutEffect(() => {
    if (!revision) return;
    advance(performance.now());
    requestAnimationFrame(() => onPainted(revision));
  }, [advance, onPainted, revision]);
  return null;
};

const SvgLayerTextureCommit = ({
  revision,
  onPainted,
}: {
  revision: string;
  onPainted: (revision: string) => void;
}) => {
  const advance = useThree((store) => store.advance);
  useLayoutEffect(() => {
    if (!revision) return;
    advance(performance.now());
    requestAnimationFrame(() => onPainted(revision));
  }, [advance, onPainted, revision]);
  return null;
};

const CameraProjection = ({state, fov}: {state: ThreeCameraState; fov: number}) => {
  const camera = useThree((store) => store.camera);

  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;
    camera.fov = fov;
    camera.position.set(...state.position);
    camera.lookAt(...state.target);
    camera.updateProjectionMatrix();
  }, [camera, fov, state]);

  return null;
};

const SharedLighting = ({
  frame,
  width,
  height,
  impactFlicker,
  lamp,
}: {
  frame: number;
  width: number;
  height: number;
  impactFlicker: number;
  lamp?: {x: number; y: number; z?: number};
}) => {
  const flicker = lampFlickerAt(frame) * (1 + impactFlicker * 0.65);
  const lampPosition = lamp
    ? pixelPointToWorld(width * lamp.x, height * lamp.y, width, height, lamp.z ?? -2.42)
    : null;

  return (
    <>
      <ambientLight color="#c8bdf0" intensity={2.6} />
      {lampPosition && (
        <>
          <pointLight
            color="#ffe0ae"
            intensity={3.2 * flicker}
            distance={10}
            decay={2}
            position={lampPosition}
          />
          <Disc
            radius={0.92}
            color="#ffe0ae"
            opacity={0.12 * flicker}
            position={[lampPosition[0], lampPosition[1], lampPosition[2] - 0.035]}
          />
          <Disc
            radius={0.48}
            color="#ffe0ae"
            opacity={0.18 * flicker}
            position={[lampPosition[0], lampPosition[1], lampPosition[2] - 0.03]}
          />
        </>
      )}
      <pointLight color="#d0dcff" intensity={0.82} distance={22} decay={2} position={[-4, 5, 1]} />
    </>
  );
};

export const ThreeStage = ({
  width,
  height,
  frame,
  fps,
  duration,
  camera,
  impact,
  lamp,
  children,
  cutouts = [],
  textureLayers = [],
}: ThreeStageProps) => {
  const {delayRender, continueRender, cancelRender} = useDelayRender();
  const [cutoutTextures, setCutoutTextures] = useState<Record<string, CanvasTexture>>({});
  const [loadedCutoutRevision, setLoadedCutoutRevision] = useState('');
  const [layerTextures, setLayerTextures] = useState<Record<string, CanvasTexture>>({});
  const [loadedLayerRevision, setLoadedLayerRevision] = useState('');
  const pendingCutoutReady = useRef<{revision: string; release: () => void} | null>(null);
  const pendingLayerReady = useRef<{revision: string; release: () => void} | null>(null);
  const cutoutsRef = useRef(cutouts);
  cutoutsRef.current = cutouts;
  const layersRef = useRef(textureLayers);
  layersRef.current = textureLayers;
  const cutoutRevision = JSON.stringify(cutouts.map(({id, svg}) => [id, svg]));
  const layerRevision = JSON.stringify(
    textureLayers.map(({id, svg, textureWidth, textureHeight}) => [
      id,
      svg,
      textureWidth,
      textureHeight,
    ]),
  );
  const onCutoutsPainted = useCallback((revision: string) => {
    const pending = pendingCutoutReady.current;
    if (!pending || pending.revision !== revision) return;
    pendingCutoutReady.current = null;
    pending.release();
  }, []);

  useLayoutEffect(() => {
    const currentCutouts = cutoutsRef.current;
    if (currentCutouts.length === 0) {
      setCutoutTextures({});
      setLoadedCutoutRevision(cutoutRevision);
      return;
    }

    const handle = delayRender('Rasterizing shared SVG rig cutouts for the Three.js scene');
    let cancelled = false;
    let released = false;
    const createdTextures: CanvasTexture[] = [];
    const release = () => {
      if (released) return;
      released = true;
      continueRender(handle);
    };

    Promise.all(
      currentCutouts.map(async (cutout) => {
        const texture = await rasterizeCutout(cutout);
        createdTextures.push(texture);
        return [cutout.id, texture] as const;
      }),
    )
      .then((entries) => {
        if (cancelled) {
          createdTextures.forEach((texture) => texture.dispose());
          return;
        }
        pendingCutoutReady.current = {revision: cutoutRevision, release};
        setCutoutTextures(Object.fromEntries(entries));
        setLoadedCutoutRevision(cutoutRevision);
      })
      .catch((error: unknown) => {
        createdTextures.forEach((texture) => texture.dispose());
        if (!cancelled) cancelRender(error instanceof Error ? error : new Error(String(error)));
        release();
      });

    return () => {
      cancelled = true;
      if (pendingCutoutReady.current?.revision === cutoutRevision)
        pendingCutoutReady.current = null;
      release();
    };
  }, [cancelRender, continueRender, cutoutRevision, delayRender]);

  const onLayersPainted = useCallback((revision: string) => {
    const pending = pendingLayerReady.current;
    if (!pending || pending.revision !== revision) return;
    pendingLayerReady.current = null;
    pending.release();
  }, []);

  useLayoutEffect(() => {
    if (textureLayers.length === 0) {
      setLayerTextures({});
      setLoadedLayerRevision(layerRevision);
      return;
    }

    const handle = delayRender(
      'Rasterizing the legacy SVG background layers for the Three.js scene',
    );
    let cancelled = false;
    let released = false;
    const createdTextures: CanvasTexture[] = [];
    const release = () => {
      if (released) return;
      released = true;
      continueRender(handle);
    };

    Promise.all(
      layersRef.current.map(async (layer) => {
        const texture = await rasterizeSvgLayer(layer);
        createdTextures.push(texture);
        return [layer.id, texture] as const;
      }),
    )
      .then((entries) => {
        if (cancelled) {
          createdTextures.forEach((texture) => texture.dispose());
          return;
        }
        pendingLayerReady.current = {revision: layerRevision, release};
        setLayerTextures(Object.fromEntries(entries));
        setLoadedLayerRevision(layerRevision);
      })
      .catch((error: unknown) => {
        createdTextures.forEach((texture) => texture.dispose());
        if (!cancelled) cancelRender(error instanceof Error ? error : new Error(String(error)));
        release();
      });

    return () => {
      cancelled = true;
      if (pendingLayerReady.current?.revision === layerRevision) pendingLayerReady.current = null;
      release();
    };
  }, [cancelRender, continueRender, delayRender, layerRevision]);

  useEffect(() => {
    return () => {
      Object.values(cutoutTextures).forEach((texture) => texture.dispose());
    };
  }, [cutoutTextures]);

  useEffect(() => {
    return () => {
      Object.values(layerTextures).forEach((texture) => texture.dispose());
    };
  }, [layerTextures]);

  const fov = fovForAspect(width, height);
  const baseState = threeCameraAt(camera?.preset, frame, duration, fps);
  const cameraDistance = 10.8 / (2 * Math.tan((fov * Math.PI) / 360));
  const aspectScale = cameraDistance / 9;
  const impactState = impactAt(impact, frame, fps);
  const horizontalShake = impactState.x * (10.8 * (width / height));
  const verticalShake = impactState.y * 10.8;
  const cameraState: ThreeCameraState = {
    ...baseState,
    position: [
      baseState.position[0] + horizontalShake,
      baseState.position[1] + verticalShake,
      baseState.position[2] * aspectScale,
    ],
    target: [
      baseState.target[0] + horizontalShake,
      baseState.target[1] + verticalShake,
      baseState.target[2],
    ],
  };

  return (
    <ThreeCanvas
      width={width}
      height={height}
      linear
      flat
      camera={{fov, position: cameraState.position, near: 0.1, far: 100}}
      style={{position: 'absolute', inset: 0, backgroundColor: 'transparent'}}
    >
      <CameraProjection state={cameraState} fov={fov} />
      <SharedLighting
        frame={frame}
        width={width}
        height={height}
        impactFlicker={impactState.flicker}
        lamp={lamp}
      />
      <CutoutTextureCommit revision={loadedCutoutRevision} onPainted={onCutoutsPainted} />
      <SvgLayerTextureCommit revision={loadedLayerRevision} onPainted={onLayersPainted} />
      {textureLayers.map((layer) => {
        const texture = layerTextures[layer.id];
        return texture ? (
          <SvgTexturePlane
            key={layer.id}
            layer={layer}
            texture={texture}
            compositionWidth={width}
            compositionHeight={height}
          />
        ) : null;
      })}
      {cutouts.map((cutout) => {
        const texture = cutoutTextures[cutout.id];
        return texture ? <CutoutPlane key={cutout.id} {...cutout} texture={texture} /> : null;
      })}
      {children}
      {camera?.preset === 'watcher' && (
        <WatcherForeground
          width={width}
          height={height}
          place={camera.place ?? 'curtains'}
          strength={cameraState.foregroundBlur}
        />
      )}
    </ThreeCanvas>
  );
};
