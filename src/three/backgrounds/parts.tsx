import {Plane, ScreenPlane} from '../primitives/Plane';
import {Disc} from '../primitives/Disc';
import {pixelPointToWorld, pixelSizeToWorld, stageMetrics} from '../space';
import type {TimeOfDay} from '../../assets/Background';

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
  z = 1.79,
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
  const doorX = width * (0.18 - reveal * 0.75);
  const doorWidth = width * 0.44;
  const knob = pixelPointToWorld(doorX + doorWidth * 0.82, height * 0.5, width, height, 4.82);
  const [knobDiameter] = pixelSizeToWorld(22, 22, width, height, 4.82);

  return (
    <>
      <ScreenPlane
        x={doorX}
        y={height * 0.5}
        pixelWidth={doorWidth}
        pixelHeight={height * 1.3}
        compositionWidth={width}
        compositionHeight={height}
        z={4.8}
        color="#a38c93"
        lit
        renderOrder={10}
      />
      <ScreenPlane
        x={doorX + doorWidth * 0.5}
        y={height * 0.5}
        pixelWidth={12}
        pixelHeight={height * 1.3}
        compositionWidth={width}
        compositionHeight={height}
        z={4.82}
        color="#e2c0a4"
        renderOrder={11}
      />
      <Disc radius={knobDiameter * 0.42} color="#f2c675" position={knob} renderOrder={12} />
    </>
  );
};
