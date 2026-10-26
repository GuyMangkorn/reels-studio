import {Plane, ScreenPlane} from '../primitives/Plane';
import {Disc} from '../primitives/Disc';
import {pixelPointToWorld, pixelSizeToWorld, stageMetrics} from '../space';
import type {TimeOfDay} from '../../assets/Background';
import type {WatcherPlaceName} from '../../camera/Camera';

export const ScreenCover = ({
  width,
  height,
  z,
  color,
}: {
  width: number;
  height: number;
  z: number;
  color: string;
}) => {
  const metrics = stageMetrics(width, height, z);
  return (
    <Plane
      width={metrics.width * 1.65 + 5}
      height={metrics.height * 1.65 + 5}
      position={[0, metrics.centerY, z]}
      color={color}
    />
  );
};

export const RoomShell = ({
  width,
  height,
  time,
  floorAnchor = 0.8,
  floorColor,
  windowOpening,
}: {
  width: number;
  height: number;
  time: TimeOfDay;
  floorAnchor?: number;
  floorColor?: string;
  windowOpening?: {x: number; y: number; pixelWidth: number; pixelHeight: number};
}) => {
  const night = time === 'night' || time === 'moonlight';
  const wall = night ? '#c9c1d8' : time === 'dusk' ? '#e4d5e4' : '#f4e5db';
  const ceiling = night ? '#ddd5e6' : '#fff4e6';
  const floor = floorColor ?? (night ? '#ded1df' : '#ead7c2');
  const back = stageMetrics(width, height, -6);
  const front = stageMetrics(width, height, 2);
  const floorY = pixelPointToWorld(width / 2, height * floorAnchor, width, height, 1.4)[1];
  const wallWidth = back.width * 1.55 + 5;
  const wallHeight = back.height * 1.55 + 5;
  const windowPoint = windowOpening
    ? pixelPointToWorld(width * windowOpening.x, height * windowOpening.y, width, height, -6)
    : null;
  const windowSize = windowOpening
    ? pixelSizeToWorld(windowOpening.pixelWidth, windowOpening.pixelHeight, width, height, -6)
    : null;
  const leftWidth =
    windowPoint && windowSize ? windowPoint[0] + wallWidth / 2 - windowSize[0] / 2 : 0;
  const rightWidth =
    windowPoint && windowSize ? wallWidth / 2 - windowPoint[0] - windowSize[0] / 2 : 0;
  const topHeight =
    windowPoint && windowSize ? wallHeight / 2 - windowPoint[1] - windowSize[1] / 2 : 0;
  const bottomHeight =
    windowPoint && windowSize
      ? windowPoint[1] - back.centerY + wallHeight / 2 - windowSize[1] / 2
      : 0;

  return (
    <>
      <ScreenCover width={width} height={height} z={-14} color={night ? '#8985a8' : '#f3dfcf'} />
      {windowPoint && windowSize ? (
        <>
          {topHeight > 0 && (
            <Plane
              width={wallWidth}
              height={topHeight}
              position={[0, windowPoint[1] + windowSize[1] / 2 + topHeight / 2, -6]}
              color={wall}
              lit
            />
          )}
          {bottomHeight > 0 && (
            <Plane
              width={wallWidth}
              height={bottomHeight}
              position={[0, windowPoint[1] - windowSize[1] / 2 - bottomHeight / 2, -6]}
              color={wall}
              lit
            />
          )}
          {leftWidth > 0 && (
            <Plane
              width={leftWidth}
              height={windowSize[1]}
              position={[windowPoint[0] - windowSize[0] / 2 - leftWidth / 2, windowPoint[1], -6]}
              color={wall}
              lit
            />
          )}
          {rightWidth > 0 && (
            <Plane
              width={rightWidth}
              height={windowSize[1]}
              position={[windowPoint[0] + windowSize[0] / 2 + rightWidth / 2, windowPoint[1], -6]}
              color={wall}
              lit
            />
          )}
        </>
      ) : (
        <Plane
          width={wallWidth}
          height={wallHeight}
          position={[0, back.centerY, -6]}
          color={wall}
          lit
        />
      )}
      <Plane
        width={front.width * 1.65 + 6}
        height={22}
        position={[0, floorY, 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        color={floor}
        lit
      />
      <Plane
        width={back.height * 1.4}
        height={back.height * 1.55}
        position={[-back.width * 0.57, back.centerY, -1]}
        rotation={[0, Math.PI / 2.45, 0]}
        color={wall}
        lit
      />
      <Plane
        width={back.height * 1.4}
        height={back.height * 1.55}
        position={[back.width * 0.57, back.centerY, -1]}
        rotation={[0, -Math.PI / 2.45, 0]}
        color={wall}
        lit
      />
      <Plane
        width={back.width * 1.7 + 6}
        height={18}
        position={[0, 5.3, -1]}
        rotation={[-Math.PI / 2, 0, 0]}
        color={ceiling}
        lit
      />
    </>
  );
};

export const WindowFrame = ({
  width,
  height,
  time,
  x = 0.72,
  y = 0.37,
  z = -5.6,
  pixelWidth = 300,
  pixelHeight = 440,
  moon = true,
  glassOpacity = 1,
}: {
  width: number;
  height: number;
  time: TimeOfDay;
  x?: number;
  y?: number;
  z?: number;
  pixelWidth?: number;
  pixelHeight?: number;
  moon?: boolean;
  glassOpacity?: number;
}) => {
  const centerX = width * x;
  const centerY = height * y;
  const inset = Math.max(18, pixelWidth * 0.055);
  const night = time === 'night' || time === 'moonlight';
  const outer = '#746778';
  const glass = night ? '#667493' : time === 'dusk' ? '#b9cad5' : '#b9dfe0';
  const [moonDiameter] = pixelSizeToWorld(74, 74, width, height, z - 0.03);
  const moonPosition = pixelPointToWorld(
    centerX + pixelWidth * 0.24,
    centerY - pixelHeight * 0.2,
    width,
    height,
    z - 0.03,
  );

  return (
    <>
      <ScreenPlane
        x={centerX - (pixelWidth - 18) / 2}
        y={centerY}
        pixelWidth={18}
        pixelHeight={pixelHeight - 18}
        compositionWidth={width}
        compositionHeight={height}
        z={z + 0.015}
        color={outer}
      />
      <ScreenPlane
        x={centerX + (pixelWidth - 18) / 2}
        y={centerY}
        pixelWidth={18}
        pixelHeight={pixelHeight - 18}
        compositionWidth={width}
        compositionHeight={height}
        z={z + 0.015}
        color={outer}
      />
      <ScreenPlane
        x={centerX}
        y={centerY - (pixelHeight - 18) / 2}
        pixelWidth={pixelWidth - 18}
        pixelHeight={18}
        compositionWidth={width}
        compositionHeight={height}
        z={z + 0.015}
        color={outer}
      />
      <ScreenPlane
        x={centerX}
        y={centerY + (pixelHeight - 18) / 2}
        pixelWidth={pixelWidth - 18}
        pixelHeight={18}
        compositionWidth={width}
        compositionHeight={height}
        z={z + 0.015}
        color={outer}
      />
      <ScreenPlane
        x={centerX}
        y={centerY}
        pixelWidth={pixelWidth - inset * 2}
        pixelHeight={pixelHeight - inset * 2}
        compositionWidth={width}
        compositionHeight={height}
        z={z + 0.03}
        color={glass}
        opacity={glassOpacity}
        transparent={glassOpacity < 1}
        lit
      />
      <ScreenPlane
        x={centerX}
        y={centerY}
        pixelWidth={15}
        pixelHeight={pixelHeight - inset * 2}
        compositionWidth={width}
        compositionHeight={height}
        z={z + 0.05}
        color="#fff0d8"
      />
      <ScreenPlane
        x={centerX}
        y={centerY}
        pixelWidth={pixelWidth - inset * 2}
        pixelHeight={15}
        compositionWidth={width}
        compositionHeight={height}
        z={z + 0.05}
        color="#fff0d8"
      />
      {moon && night && (
        <Disc radius={moonDiameter / 2} color="#fff0be" position={moonPosition} renderOrder={2} />
      )}
    </>
  );
};

export const TableLamp = ({
  width,
  height,
  x = 0.82,
  y = 0.55,
  z = -2.42,
}: {
  width: number;
  height: number;
  x?: number;
  y?: number;
  z?: number;
}) => (
  <>
    <ScreenPlane
      x={width * x}
      y={height * y}
      pixelWidth={112}
      pixelHeight={70}
      compositionWidth={width}
      compositionHeight={height}
      z={z}
      color="#ffe3a9"
      lit
    />
    <ScreenPlane
      x={width * x}
      y={height * (y + 0.045)}
      pixelWidth={23}
      pixelHeight={105}
      compositionWidth={width}
      compositionHeight={height}
      z={z + 0.01}
      color="#9a7b78"
    />
    <ScreenPlane
      x={width * x}
      y={height * (y + 0.105)}
      pixelWidth={142}
      pixelHeight={23}
      compositionWidth={width}
      compositionHeight={height}
      z={z + 0.02}
      color="#8f7d82"
    />
  </>
);

export const PeekDoor = ({
  width,
  height,
  reveal,
}: {
  width: number;
  height: number;
  reveal: number;
}) => {
  const doorWidth = width * 0.09;
  const doorX = -doorWidth * 0.88 + reveal * doorWidth * 0.45;
  const knob = pixelPointToWorld(doorX + doorWidth * 0.82, height * 0.55, width, height, 4.82);
  const [knobDiameter] = pixelSizeToWorld(22, 22, width, height, 4.82);

  return (
    <>
      <ScreenPlane
        x={doorX}
        y={height * 0.5}
        pixelWidth={doorWidth}
        pixelHeight={height * 1.16}
        compositionWidth={width}
        compositionHeight={height}
        z={4.8}
        color="#78606c"
        lit
        renderOrder={10}
      />
      <ScreenPlane
        x={doorX + doorWidth * 0.93}
        y={height * 0.5}
        pixelWidth={15}
        pixelHeight={height * 1.16}
        compositionWidth={width}
        compositionHeight={height}
        z={4.82}
        color="#d2ae95"
        renderOrder={11}
      />
      {[0.35, 0.69].map((y) => (
        <ScreenPlane
          key={y}
          x={doorX + doorWidth * 0.5}
          y={height * y}
          pixelWidth={doorWidth * 0.62}
          pixelHeight={height * 0.16}
          compositionWidth={width}
          compositionHeight={height}
          z={4.83}
          color="#8e7380"
          opacity={0.9}
          transparent
          renderOrder={11}
        />
      ))}
      <Disc radius={knobDiameter * 0.42} color="#f2c675" position={knob} renderOrder={12} />
    </>
  );
};

/** Soft near-camera occlusion gives watcher shots a hiding-place foreground and parallax. */
export const WatcherForeground = ({
  width,
  height,
  place,
  strength = 1,
}: {
  width: number;
  height: number;
  place: WatcherPlaceName;
  strength?: number;
}) => {
  const z = 5.3;
  const opacity = Math.max(0, Math.min(1, strength));
  const edge = (side: 'left' | 'right', pixelWidth: number, alpha: number, inset: number) => (
    <ScreenPlane
      key={`${side}-${pixelWidth}-${inset}`}
      x={side === 'left' ? inset : width - inset}
      y={height * 0.5}
      pixelWidth={pixelWidth}
      pixelHeight={height * 1.12}
      compositionWidth={width}
      compositionHeight={height}
      z={z + inset * 0.0001}
      color="#3b3145"
      opacity={alpha * opacity}
      transparent
      renderOrder={90}
    />
  );

  return (
    <>
      {/* A translucent full-frame plane and two feathered edges suggest a defocused lens. */}
      <ScreenPlane
        x={width / 2}
        y={height / 2}
        pixelWidth={width * 1.35}
        pixelHeight={height * 1.35}
        compositionWidth={width}
        compositionHeight={height}
        z={z}
        color="#352c41"
        opacity={0.055 * opacity}
        transparent
        renderOrder={80}
      />
      {edge('left', width * 0.1, 0.2, width * 0.035)}
      {edge('right', width * 0.1, 0.2, width * 0.035)}
      {edge('left', width * 0.065, 0.13, width * 0.075)}
      {edge('right', width * 0.065, 0.13, width * 0.075)}
      {place === 'curtains' && (
        <>
          {[width * 0.055, width * 0.945].map((x) => (
            <ScreenPlane
              key={x}
              x={x}
              y={height * 0.5}
              pixelWidth={width * 0.025}
              pixelHeight={height * 1.08}
              compositionWidth={width}
              compositionHeight={height}
              z={z + 0.04}
              color="#a58899"
              opacity={0.22 * opacity}
              transparent
              renderOrder={91}
            />
          ))}
        </>
      )}
      {place === 'outsideWindow' && (
        <>
          <ScreenPlane
            x={width * 0.5}
            y={height * 0.08}
            pixelWidth={width * 0.8}
            pixelHeight={height * 0.055}
            compositionWidth={width}
            compositionHeight={height}
            z={z + 0.04}
            color="#352c41"
            opacity={0.25 * opacity}
            transparent
            renderOrder={91}
          />
          <ScreenPlane
            x={width * 0.08}
            y={height * 0.52}
            pixelWidth={width * 0.04}
            pixelHeight={height * 0.88}
            compositionWidth={width}
            compositionHeight={height}
            z={z + 0.04}
            color="#a58899"
            opacity={0.2 * opacity}
            transparent
            renderOrder={91}
          />
        </>
      )}
      {place === 'stairTop' && (
        <>
          <ScreenPlane
            x={width * 0.5}
            y={height * 0.09}
            pixelWidth={width * 0.58}
            pixelHeight={height * 0.024}
            compositionWidth={width}
            compositionHeight={height}
            z={z + 0.05}
            color="#43374d"
            opacity={0.35 * opacity}
            transparent
            renderOrder={91}
          />
          <ScreenPlane
            x={width * 0.5}
            y={height * 0.16}
            pixelWidth={width * 0.44}
            pixelHeight={height * 0.018}
            compositionWidth={width}
            compositionHeight={height}
            z={z + 0.05}
            color="#a58899"
            opacity={0.18 * opacity}
            transparent
            renderOrder={91}
          />
        </>
      )}
      {place === 'foliage' && (
        <>
          {[
            [0.04, 0.08, 0.16],
            [0.11, 0.19, 0.12],
            [0.96, 0.12, 0.18],
            [0.89, 0.26, 0.13],
          ].map(([x, y, size]) => (
            <Disc
              key={`${x}-${y}`}
              radius={width * size * 0.025}
              color="#465447"
              opacity={0.36 * opacity}
              position={pixelPointToWorld(width * x, height * y, width, height, z + 0.05)}
            />
          ))}
        </>
      )}
      {place === 'furnitureCorner' && (
        <>
          <ScreenPlane
            x={width * 0.12}
            y={height * 0.82}
            pixelWidth={width * 0.28}
            pixelHeight={height * 0.35}
            compositionWidth={width}
            compositionHeight={height}
            z={z + 0.05}
            color="#514453"
            opacity={0.36 * opacity}
            transparent
            renderOrder={91}
          />
          <ScreenPlane
            x={width * 0.29}
            y={height * 0.95}
            pixelWidth={width * 0.45}
            pixelHeight={height * 0.08}
            compositionWidth={width}
            compositionHeight={height}
            z={z + 0.05}
            color="#342d3b"
            opacity={0.26 * opacity}
            transparent
            renderOrder={91}
          />
        </>
      )}
    </>
  );
};
