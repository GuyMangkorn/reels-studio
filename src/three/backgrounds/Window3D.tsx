import {threeCameraAt} from '../../camera/Camera';
import {Disc} from '../primitives/Disc';
import {Plane, ScreenPlane} from '../primitives/Plane';
import {pixelPointToWorld, pixelSizeToWorld, stageMetrics} from '../space';
import {PeekDoor, RoomShell, TableLamp, WindowFrame} from './parts';
import type {ThreeBackgroundProps} from './registry';

export const windowMoonPixelPoint = (
  width: number,
  height: number,
  x: number,
  y: number,
  pixelWidth: number,
  pixelHeight: number,
): [number, number] => [width * x + pixelWidth * 0.24, height * y - pixelHeight * 0.2];

export const Window3D = ({
  width,
  height,
  frame,
  fps,
  duration,
  time,
  camera,
}: ThreeBackgroundProps) => {
  const cameraState = threeCameraAt(camera?.preset, frame, duration, fps);
  const windowX = 0.53;
  const windowY = 0.46;
  const windowWidth = 620;
  const windowHeight = 700;
  const [moonX, moonY] = windowMoonPixelPoint(
    width,
    height,
    windowX,
    windowY,
    windowWidth,
    windowHeight,
  );
  const moonPosition = pixelPointToWorld(moonX, moonY, width, height, -10.2);
  const [moonDiameter] = pixelSizeToWorld(142, 142, width, height, -10.2);
  const distant = stageMetrics(width, height, -10.5);

  return (
    <>
      <Plane
        width={distant.width * 1.4 + 6}
        height={distant.height * 1.4 + 6}
        position={[0, distant.centerY, -10.5]}
        color="#777a9e"
      />
      <RoomShell
        width={width}
        height={height}
        time={time}
        floorAnchor={0.82}
        windowOpening={{x: windowX, y: windowY, pixelWidth: windowWidth, pixelHeight: windowHeight}}
      />
      <ScreenPlane
        x={width * 0.5}
        y={height * 0.73}
        pixelWidth={width * 1.2}
        pixelHeight={240}
        compositionWidth={width}
        compositionHeight={height}
        z={-10.1}
        color="#797c9d"
      />
      <Disc radius={moonDiameter / 2} color="#fff0bd" position={moonPosition} renderOrder={1} />
      <WindowFrame
        width={width}
        height={height}
        time={time}
        x={windowX}
        y={windowY}
        pixelWidth={windowWidth}
        pixelHeight={windowHeight}
        z={-5.6}
        moon={false}
        glassOpacity={0.16}
      />
      <TableLamp width={width} height={height} x={0.2} y={0.63} />
      {camera?.preset === 'peek' && (
        <PeekDoor width={width} height={height} reveal={cameraState.reveal} />
      )}
    </>
  );
};
