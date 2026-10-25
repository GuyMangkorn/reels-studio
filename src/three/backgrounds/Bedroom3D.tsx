import {bedroomPOVAt} from '../../assets/backgrounds/BedroomPOV';
import {RoomShell, WindowFrame} from './parts';
import {Plane, ScreenPlane} from '../primitives/Plane';
import {pixelPointToWorld, pixelSizeToWorld} from '../space';
import type {ThreeBackgroundProps} from './registry';

export const Bedroom3D = ({
  width,
  height,
  frame,
  fps,
  duration,
  time,
  background,
}: ThreeBackgroundProps) => {
  const state = bedroomPOVAt(frame, fps, duration, background?.blanketPull);
  const bedY = pixelPointToWorld(width / 2, height * 0.58, width, height, -3.4)[1];
  const [bedWidth, bedDepth] = pixelSizeToWorld(720, 1120, width, height, 0);
  const [baseWidth, baseDepth] = pixelSizeToWorld(770, 1180, width, height, 0);
  const blanketDepth = bedDepth * 0.72;
  const blanketZ = -0.9 + state.pull * 0.65;

  return (
    <>
      <RoomShell
        width={width}
        height={height}
        time={time}
        floorAnchor={0.9}
        windowOpening={{x: 0.69, y: 0.33, pixelWidth: 270, pixelHeight: 430}}
        floorColor="#dfd1dd"
      />
      <WindowFrame
        width={width}
        height={height}
        time={time}
        x={0.69}
        y={0.33}
        pixelWidth={270}
        pixelHeight={430}
        z={-5.6}
        glassOpacity={0.2}
      />

      <ScreenPlane
        x={width * 0.5}
        y={height * 0.57}
        pixelWidth={555}
        pixelHeight={240}
        compositionWidth={width}
        compositionHeight={height}
        z={-4.5}
        color="#4a3b3b"
      />
      <ScreenPlane
        x={width * 0.5}
        y={height * 0.57}
        pixelWidth={520}
        pixelHeight={205}
        compositionWidth={width}
        compositionHeight={height}
        z={-4.47}
        color="#948699"
      />

      <Plane
        width={baseWidth}
        height={baseDepth}
        position={[0, bedY - 0.18, -0.15]}
        rotation={[-Math.PI / 2, 0, 0]}
        color="#8e7d89"
        lit
      />
      <Plane
        width={bedWidth}
        height={bedDepth}
        position={[0, bedY, -0.3]}
        rotation={[-Math.PI / 2, 0, 0]}
        color="#f5e5cf"
        lit
      />
      <Plane
        width={bedWidth * 0.43}
        height={bedDepth * 0.12}
        position={[0, bedY + 0.025, -3.45]}
        rotation={[-Math.PI / 2, 0, 0]}
        color="#fff0dc"
      />
      <Plane
        width={bedWidth * 0.82}
        height={blanketDepth}
        position={[0, bedY + 0.045, blanketZ]}
        rotation={[-Math.PI / 2, 0, 0]}
        color={state.pull > 0.25 ? '#a8b9d0' : '#b5c4d9'}
        lit
      />
      <ScreenPlane
        x={width * 0.5}
        y={height * 0.62}
        pixelWidth={620}
        pixelHeight={86}
        compositionWidth={width}
        compositionHeight={height}
        z={2.25}
        color="#927a89"
      />
      <ScreenPlane
        x={width * 0.5}
        y={height * 0.59}
        pixelWidth={595}
        pixelHeight={30}
        compositionWidth={width}
        compositionHeight={height}
        z={2.28}
        color="#bfa8ae"
      />
      <ScreenPlane
        x={width * 0.5}
        y={height * 0.67}
        pixelWidth={560}
        pixelHeight={125}
        compositionWidth={width}
        compositionHeight={height}
        z={2.28}
        color="#8c7988"
      />
      <Plane
        width={bedWidth * 0.86}
        height={0.28}
        position={[0, bedY - 0.2, 2.3]}
        color="#bfa8ae"
      />
    </>
  );
};
