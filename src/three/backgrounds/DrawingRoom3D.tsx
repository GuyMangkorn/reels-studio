import {threeCameraAt} from '../../camera/Camera';
import {Disc} from '../primitives/Disc';
import {ScreenPlane} from '../primitives/Plane';
import {pixelPointToWorld, pixelSizeToWorld} from '../space';
import {PeekDoor, RoomShell, TableLamp, WindowFrame} from './parts';
import type {ThreeBackgroundProps} from './registry';

export const DrawingRoom3D = ({
  width,
  height,
  frame,
  fps,
  duration,
  time,
  background,
  camera,
}: ThreeBackgroundProps) => {
  const variant = background?.variant ?? 'drawing';
  const floorAnchor = variant === 'kitchen' ? 0.84 : 0.8;
  const cameraState = threeCameraAt(camera?.preset, frame, duration, fps);
  const floorY = pixelPointToWorld(width / 2, height * floorAnchor, width, height, 1.4)[1];
  const rugX = pixelPointToWorld(width * 0.52, height * floorAnchor, width, height, 0.4)[0];
  const [rugDiameter] = pixelSizeToWorld(650, 650, width, height, 0.4);

  return (
    <>
      <RoomShell
        width={width}
        height={height}
        time={time}
        floorAnchor={floorAnchor}
        windowOpening={{x: 0.72, y: 0.37, pixelWidth: 300, pixelHeight: 440}}
      />
      <WindowFrame width={width} height={height} time={time} glassOpacity={0.42} />

      {variant === 'kitchen' ? (
        <>
          <ScreenPlane
            x={width * 0.5}
            y={height * 0.62}
            pixelWidth={820}
            pixelHeight={315}
            compositionWidth={width}
            compositionHeight={height}
            z={0.25}
            color="#9fbeaF"
            lit
          />
          <ScreenPlane
            x={width * 0.5}
            y={height * 0.535}
            pixelWidth={850}
            pixelHeight={34}
            compositionWidth={width}
            compositionHeight={height}
            z={0.3}
            color="#fff0dc"
          />
          {[0.23, 0.5, 0.77].map((x) => (
            <ScreenPlane
              key={x}
              x={width * x}
              y={height * 0.64}
              pixelWidth={220}
              pixelHeight={235}
              compositionWidth={width}
              compositionHeight={height}
              z={0.32}
              color="#c9dfc6"
            />
          ))}
          <ScreenPlane
            x={width * 0.69}
            y={height * 0.53}
            pixelWidth={140}
            pixelHeight={25}
            compositionWidth={width}
            compositionHeight={height}
            z={0.34}
            color="#657284"
          />
        </>
      ) : variant === 'dining' ? (
        <>
          <ScreenPlane
            x={width * 0.52}
            y={height * 0.67}
            pixelWidth={620}
            pixelHeight={145}
            compositionWidth={width}
            compositionHeight={height}
            z={0.2}
            color="#a88178"
            lit
          />
          <ScreenPlane
            x={width * 0.52}
            y={height * 0.63}
            pixelWidth={660}
            pixelHeight={35}
            compositionWidth={width}
            compositionHeight={height}
            z={0.25}
            color="#fff0dc"
          />
          {[0.34, 0.7].map((x) => (
            <ScreenPlane
              key={x}
              x={width * x}
              y={height * 0.76}
              pixelWidth={42}
              pixelHeight={230}
              compositionWidth={width}
              compositionHeight={height}
              z={0.15}
              color="#9b7b73"
            />
          ))}
          {[0.27, 0.77].map((x) => (
            <ScreenPlane
              key={x}
              x={width * x}
              y={height * 0.74}
              pixelWidth={150}
              pixelHeight={230}
              compositionWidth={width}
              compositionHeight={height}
              z={0.1}
              color="#c7a4a0"
              lit
            />
          ))}
        </>
      ) : (
        <>
          <Disc
            radius={rugDiameter * 0.44}
            color="#d1bfd3"
            position={[rugX, floorY + 0.03, 0.4]}
            rotation={[-Math.PI / 2, 0, 0]}
            lit
          />
          <ScreenPlane
            x={width * 0.28}
            y={height * 0.66}
            pixelWidth={590}
            pixelHeight={300}
            compositionWidth={width}
            compositionHeight={height}
            z={0.22}
            color="#4a3b3b"
          />
          <ScreenPlane
            x={width * 0.28}
            y={height * 0.645}
            pixelWidth={558}
            pixelHeight={270}
            compositionWidth={width}
            compositionHeight={height}
            z={0.25}
            color="#c39cac"
            lit
          />
          <ScreenPlane
            x={width * 0.28}
            y={height * 0.715}
            pixelWidth={485}
            pixelHeight={105}
            compositionWidth={width}
            compositionHeight={height}
            z={0.28}
            color="#e3b4bc"
            lit
          />
          {[0.12, 0.43].map((x) => (
            <ScreenPlane
              key={x}
              x={width * x}
              y={height * 0.79}
              pixelWidth={26}
              pixelHeight={95}
              compositionWidth={width}
              compositionHeight={height}
              z={0.23}
              color="#987e75"
            />
          ))}
        </>
      )}

      <TableLamp width={width} height={height} />

      {camera?.preset === 'peek' && (
        <PeekDoor width={width} height={height} reveal={cameraState.reveal} />
      )}
    </>
  );
};
