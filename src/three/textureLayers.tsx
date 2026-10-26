import {createElement, type ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {
  backgroundRegistry,
  palettes,
  type BackgroundName,
  type Palette,
  type TimeOfDay,
} from '../assets/Background';
import {
  houseInteriorTextureNodes,
  type BackgroundOptions,
} from '../assets/backgrounds/HouseInterior';
import {bedroomPOVAt, bedroomPovTextureNodes} from '../assets/backgrounds/BedroomPOV';
import type {Scene} from '../scenes/types';
import type {SvgTextureLayerData} from './SvgTexturePlane';
import {pixelPointToWorld, pixelSizeToWorld} from './space';

type ViewBox = {x: number; y: number; width: number; height: number};
type BackgroundContext = {
  w: number;
  h: number;
  p: Palette;
  night: boolean;
  t: number;
  time: TimeOfDay;
  options: BackgroundOptions;
  view: 'front' | 'topDown';
};

const readViewBox = (value: string | undefined, width: number, height: number): ViewBox => {
  const numbers = value?.split(/[ ,]+/).map(Number) ?? [0, 0, width, height];
  return {x: numbers[0], y: numbers[1], width: numbers[2], height: numbers[3]};
};

const expandedBox = (box: ViewBox, overfill: number): ViewBox => {
  const extraX = (box.width * (overfill - 1)) / 2;
  const extraY = (box.height * (overfill - 1)) / 2;
  return {
    x: box.x - extraX,
    y: box.y - extraY,
    width: box.width + extraX * 2,
    height: box.height + extraY * 2,
  };
};

const serializeLayer = (
  node: ReactNode,
  width: number,
  height: number,
  overfill: number,
  viewBox: string | undefined,
  extension?: (box: ViewBox) => ReactNode,
) => {
  const box = readViewBox(viewBox, width, height);
  const full = expandedBox(box, overfill);
  const root = createElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: Math.ceil(width * overfill),
      height: Math.ceil(height * overfill),
      viewBox: `${full.x} ${full.y} ${full.width} ${full.height}`,
      preserveAspectRatio: 'xMidYMid meet',
    },
    extension?.(full),
    node,
  );
  return renderToStaticMarkup(root);
};

const makeLayer = (
  id: string,
  node: ReactNode,
  width: number,
  height: number,
  z: number,
  options: {
    overfill?: number;
    viewBox?: string;
    extension?: (box: ViewBox) => ReactNode;
    lit?: boolean;
    opacity?: number;
    centerX?: number;
    centerY?: number;
    scale?: number;
  } = {},
): SvgTextureLayerData | null => {
  if (!node) return null;
  const overfill = options.overfill ?? 1.24;
  return {
    id,
    svg: serializeLayer(node, width, height, overfill, options.viewBox, options.extension),
    textureWidth: Math.ceil(width * overfill),
    textureHeight: Math.ceil(height * overfill),
    z,
    lit: options.lit ?? true,
    opacity: options.opacity,
    overfill,
    centerX: options.centerX,
    centerY: options.centerY,
    scale: options.scale,
  };
};

const exteriorExtension = (time: TimeOfDay) => (box: ViewBox) => {
  const sky = time === 'day' ? '#FFF1C9' : time === 'dusk' ? '#B5A1C5' : '#424668';
  const ground = time === 'day' ? '#B8F2C9' : '#66667F';
  return (
    <>
      <rect x={box.x} y={box.y} width={box.width} height={box.height} fill={sky} />
      <rect
        x={box.x}
        y={box.y + box.height * 0.8}
        width={box.width}
        height={box.height * 0.2}
        fill={ground}
      />
    </>
  );
};

const interiorExtension =
  (time: TimeOfDay, isStairwell = false) =>
  (box: ViewBox) => {
    const dark = time === 'night' || time === 'moonlight';
    const floor = dark ? '#b0a2b4' : '#DEBFA6';
    const wall = dark ? '#91889E' : '#E9D2CA';
    return (
      <>
        <rect x={box.x} y={box.y} width={box.width} height={box.height} fill={floor} />
        {!isStairwell && (
          <rect x={box.x} y={box.y} width={box.width} height={box.height * 0.66} fill={wall} />
        )}
      </>
    );
  };

const bedroomWallExtension = (time: TimeOfDay) => (box: ViewBox) => {
  const dark = time === 'night' || time === 'moonlight';
  const wall = dark ? '#91889E' : '#f1ded0';
  const floor = dark ? '#b0a2b4' : '#d7c3b3';
  const floorY = 960;
  return (
    <>
      <rect x={box.x} y={box.y} width={box.width} height={box.height} fill={wall} />
      <rect
        x={box.x}
        y={floorY}
        width={box.width}
        height={box.y + box.height - floorY}
        fill={floor}
      />
      <path
        d={`M${box.x} ${floorY} H${box.x + box.width} M${box.x} 990 H${box.x + box.width}`}
        stroke="#A89AAE"
        strokeWidth={12}
      />
    </>
  );
};

const backgroundContext = (
  kind: BackgroundName,
  time: TimeOfDay,
  width: number,
  height: number,
  options: BackgroundOptions,
  frame: number,
  fps: number,
  view: 'front' | 'topDown' = 'front',
): BackgroundContext => {
  const palette = palettes[time];
  const night = time === 'night' || time === 'moonlight';
  return {
    w: width,
    h: height,
    p: palette,
    night,
    t: frame / fps,
    time,
    options,
    view,
  };
};

const backdropNodes = (kind: BackgroundName, context: BackgroundContext) => {
  const p = context.p;
  const layers = backgroundRegistry[kind](context);
  return {
    far: (
      <>
        <rect x={0} y={0} width={context.w} height={context.h} fill={p.sky} />
        <circle
          cx={context.w * 0.81}
          cy={context.h * 0.18}
          r={Math.min(context.w, context.h) * 0.065}
          fill={p.accent}
        />
        {layers.far}
      </>
    ),
    mid: layers.mid,
    near: layers.near,
  };
};

const getExteriorTextureLayers = (
  scene: Scene,
  width: number,
  height: number,
  frame: number,
  fps: number,
) => {
  const time = scene.time ?? 'day';
  const context = backgroundContext(
    'oldHouseExterior',
    time,
    width,
    height,
    scene.background ?? {},
    frame,
    fps,
  );
  const art = backdropNodes('oldHouseExterior', context);
  return [
    makeLayer('exterior-sky', art.far, width, height, -13, {
      overfill: 1.32,
      extension: exteriorExtension(time),
      lit: false,
    }),
    makeLayer('exterior-house', art.mid, width, height, -5.2, {overfill: 1.2}),
    makeLayer('exterior-path', art.near, width, height, 1.75, {
      overfill: 1.28,
      lit: true,
      centerY: height / 2,
    }),
  ].filter((layer): layer is SvgTextureLayerData => layer !== null);
};

const getBedroomTextureLayers = (
  scene: Scene,
  width: number,
  height: number,
  frame: number,
  fps: number,
  duration: number,
) => {
  const nodes = bedroomPovTextureNodes(width, height);
  const state = bedroomPOVAt(frame, fps, duration, scene.background?.blanketPull);
  const blanketScale = 1 - state.pull * 0.12;
  const anchorY = height * (1040 / 1920);
  const centerY =
    anchorY +
    (height / 2 - anchorY) * blanketScale +
    (state.blanketY + state.pull * 220) * (height / 1920);
  const viewBox = nodes.viewBox;
  return [
    makeLayer('bedroom-wall', nodes.wall, width, height, -11, {
      overfill: 1.3,
      viewBox,
      extension: bedroomWallExtension(scene.time ?? 'moonlight'),
      lit: true,
    }),
    makeLayer('bedroom-bed', nodes.bed, width, height, 2.15, {
      overfill: 1.22,
      viewBox: nodes.stageViewBox,
      lit: true,
    }),
    makeLayer('bedroom-blanket', nodes.blanket, width, height, 3.05, {
      overfill: 1.22,
      viewBox: nodes.stageViewBox,
      lit: true,
      scale: blanketScale,
      centerX: width / 2,
      centerY,
    }),
    makeLayer('bedroom-bed-rails', nodes.rails, width, height, 3.2, {
      overfill: 1.22,
      viewBox: nodes.stageViewBox,
      lit: true,
    }),
  ].filter((layer): layer is SvgTextureLayerData => layer !== null);
};

const stairTreadArtwork = (
  <g stroke="#4A3B3B" strokeLinejoin="round" strokeWidth={12}>
    <path
      d="M18 56 Q32 24 70 20 H670 Q693 23 682 55 L652 176 Q646 190 622 190 H38 Q15 184 18 164Z"
      fill="#d9b9a5"
    />
    <path
      d="M36 63 Q45 46 75 44 H652 Q672 46 663 68 L643 157 H50Z"
      fill="#f1d7bd"
      stroke="#b28f84"
      strokeWidth={7}
    />
    <path d="M80 90 H622 M110 122 H590" fill="none" stroke="#d1b39f" strokeWidth={5} />
    <path d="M42 165 H645" fill="none" stroke="#fff0d8" strokeWidth={8} />
  </g>
);

const stairRiserArtwork = (
  <g stroke="#4A3B3B" strokeLinejoin="round" strokeWidth={12}>
    <path d="M16 15 H684 V185 H16Z" fill="#b3908c" />
    <path d="M42 43 H658 V163 H42Z" fill="#c6a49b" stroke="#d9bdb0" strokeWidth={7} />
    <path d="M72 75 H628 M72 116 H628" stroke="#b48f88" strokeWidth={5} />
  </g>
);

const stairRailArtwork = (
  <g fill="none" stroke="#4A3B3B" strokeLinejoin="round" strokeLinecap="round">
    <path d="M38 500 L650 45" strokeWidth={38} />
    <path d="M38 484 L650 29" stroke="#d8b79d" strokeWidth={18} />
    {[100, 230, 360, 490, 620].map((x) => {
      const y = 465 - ((x - 38) / 612) * 455;
      return <path key={x} d={`M${x} ${y} l-15 130`} strokeWidth={18} />;
    })}
    <path d="M27 594 L655 127" stroke="#9d7e7b" strokeWidth={24} />
  </g>
);

const getStairTextureLayers = (width: number, height: number): SvgTextureLayerData[] => {
  const floorY = pixelPointToWorld(width / 2, height * 0.84, width, height, 0)[1];
  const [treadWidth, treadDepth] = pixelSizeToWorld(245, 116, width, height, 0);
  const [riserWidth, riserHeight] = pixelSizeToWorld(245, 70, width, height, 0);
  const stepCount = 10;
  const steps = Array.from({length: stepCount}, (_, index) => {
    const x = -3.05 + index * 0.46;
    const y = floorY + index * 0.32;
    const z = 1.4 - index * 0.48;
    return [
      svgArtTexture(`stair-tread-${index}`, stairTreadArtwork, 700, 210, z, {
        worldPosition: [x, y, z],
        worldSize: [treadWidth, treadDepth],
        rotation: [-Math.PI / 2, 0, 0],
        lit: true,
        renderOrder: 2 + index,
      }),
      svgArtTexture(`stair-riser-${index}`, stairRiserArtwork, 700, 210, z + 0.03, {
        worldPosition: [x, y - riserHeight / 2, z + treadDepth / 2],
        worldSize: [riserWidth, riserHeight],
        lit: true,
        renderOrder: 3 + index,
      }),
    ];
  }).flat();
  const rail = svgArtTexture('stair-banister', stairRailArtwork, 700, 620, -0.9, {
    worldPosition: [-0.7, floorY + 1.9, -0.9],
    worldSize: [5.5, 3.2],
    lit: true,
    renderOrder: 20,
  });
  return [...steps, rail];
};

const getInteriorTextureLayers = (
  scene: Scene,
  width: number,
  height: number,
  frame: number,
  fps: number,
) => {
  const time = scene.time ?? 'day';
  const variant = scene.background?.variant ?? 'drawing';
  // The old spiral is kept as the landing below the newly depth-separated stair treads.
  const sourceVariant = variant === 'staircase' ? 'drawing' : variant;
  const options = {...scene.background, variant: sourceVariant};
  const nodes = houseInteriorTextureNodes({
    ...backgroundContext('houseInterior', time, width, height, options, frame, fps),
    options,
  });
  const includeFurnishings = variant !== 'staircase';
  const transparentWindowOptions = {...options, transparentWindow: true};
  const wallArt =
    variant === 'window'
      ? houseInteriorTextureNodes({
          ...backgroundContext(
            'houseInterior',
            time,
            width,
            height,
            transparentWindowOptions,
            frame,
            fps,
          ),
          options: transparentWindowOptions,
        }).wall
      : nodes.wall;
  const stairLayers = variant === 'staircase' ? getStairTextureLayers(width, height) : [];
  return [
    makeLayer('interior-floor-wall', nodes.far, width, height, -12, {
      overfill: 1.32,
      extension: interiorExtension(time),
      lit: true,
    }),
    makeLayer('interior-wall-art', wallArt, width, height, -7, {
      overfill: 1.24,
    }),
    includeFurnishings
      ? makeLayer('interior-furnishings', nodes.props, width, height, -2.6, {
          overfill: 1.2,
        })
      : null,
    makeLayer('interior-moonbeam', nodes.near, width, height, -1.8, {
      overfill: 1.24,
      lit: false,
      opacity: 0.9,
    }),
    ...stairLayers,
  ].filter((layer): layer is SvgTextureLayerData => layer !== null);
};

/** Serialize the existing SVG background art into separately depth-positioned scene textures. */
export function createSceneTextureLayers(
  scene: Scene,
  width: number,
  height: number,
  frame: number,
  fps: number,
  duration: number,
): SvgTextureLayerData[] {
  if (scene.bg === 'oldHouseExterior') {
    return getExteriorTextureLayers(scene, width, height, frame, fps);
  }
  if (scene.bg !== 'houseInterior') return [];
  if (scene.background?.variant === 'bedroomPOV') {
    return getBedroomTextureLayers(scene, width, height, frame, fps, duration);
  }
  return getInteriorTextureLayers(scene, width, height, frame, fps);
}

/** Shared resolution helper for step and rail art authored as small standalone SVGs. */
export function svgArtTexture(
  id: string,
  artwork: ReactNode,
  width: number,
  height: number,
  z: number,
  placement: Pick<
    SvgTextureLayerData,
    'worldPosition' | 'worldSize' | 'rotation' | 'lit' | 'renderOrder'
  >,
  overfill = 1,
): SvgTextureLayerData {
  return {
    ...placement,
    id,
    svg: serializeLayer(artwork, width, height, overfill, undefined),
    textureWidth: Math.ceil(width * overfill),
    textureHeight: Math.ceil(height * overfill),
    z,
    overfill,
  };
}
