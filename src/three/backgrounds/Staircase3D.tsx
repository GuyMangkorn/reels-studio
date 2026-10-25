import {Plane} from '../primitives/Plane';
import {pixelPointToWorld, pixelSizeToWorld, stageMetrics} from '../space';
import {threeCameraAt} from '../../camera/Camera';
import type {ThreeBackgroundProps} from './registry';

export const Staircase3D = ({
  width,
  height,
  frame,
  fps,
  duration,
  camera,
  time,
}: ThreeBackgroundProps) => {
  const night = time === 'night' || time === 'moonlight';
  const background = stageMetrics(width, height, -12);
  const floor = stageMetrics(width, height, 4);
  const floorY = pixelPointToWorld(width / 2, height * 0.86, width, height, 1.4)[1];
  const cameraState = threeCameraAt(camera?.preset, frame, duration, fps);
  const [treadWidth, treadDepth] = pixelSizeToWorld(820, 150, width, height, 0);
  const riserHeight = 0.34;
  const stepCount = 12;

  return (
    <>
      <Plane
        width={background.width * 1.6 + 7}
        height={background.height * 1.6 + 7}
        position={[0, background.centerY, -12]}
        color={night ? '#9690b2' : '#e8d2c9'}
      />
      <Plane
        width={background.width * 1.4 + 4}
        height={background.height * 1.4 + 4}
        position={[0, background.centerY, -7]}
        color={night ? '#a49ab5' : '#e5cfc1'}
      />
      <Plane
        width={floor.width * 1.5 + 5}
        height={25}
        position={[0, floorY, 4]}
        rotation={[-Math.PI / 2, 0, 0]}
        color={night ? '#b9aebe' : '#d9baa2'}
        lit
      />
      <Plane
        width={1}
        height={9}
        position={[-3.5, -0.8, -1]}
        rotation={[0, 0.2, 0]}
        color={night ? '#847990' : '#a98f92'}
      />
      {Array.from({length: stepCount}, (_, index) => {
        const x = -2.65 + index * 0.47;
        const y = floorY + index * 0.25;
        const z = -4.3 + index * 0.52;
        const topColor = index % 2 ? '#d6c2b4' : '#c9b4a9';
        return (
          <group key={index}>
            <Plane
              width={treadWidth}
              height={treadDepth}
              position={[x, y, z]}
              rotation={[-Math.PI / 2, 0, 0]}
              color={topColor}
              lit
            />
            <Plane
              width={treadWidth}
              height={riserHeight}
              position={[x, y - riserHeight / 2, z + treadDepth / 2]}
              color="#ad9594"
              lit
            />
            <Plane
              width={0.09}
              height={riserHeight + 0.06}
              position={[x - treadWidth / 2, y - 0.08, z + treadDepth / 2]}
              color="#6e626f"
            />
          </group>
        );
      })}
      {cameraState.foregroundBlur > 0 && (
        <Plane
          width={stageMetrics(width, height, 5.4).width * 0.9}
          height={stageMetrics(width, height, 5.4).height * 0.2}
          position={[
            Math.sin((frame / fps) * 0.3) * 0.12,
            pixelPointToWorld(width / 2, height * 0.87, width, height, 5.4)[1],
            5.4,
          ]}
          color="#7e738b"
          opacity={0.14}
          transparent
        />
      )}
    </>
  );
};
