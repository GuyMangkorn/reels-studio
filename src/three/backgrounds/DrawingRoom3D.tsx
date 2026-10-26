import {threeCameraAt} from '../../camera/Camera';
import {PeekDoor, TableLamp} from './parts';
import type {ThreeBackgroundProps} from './registry';

/** The original 2D room is rendered by ThreeStage as separated SVG texture planes. */
export const DrawingRoom3D = ({
  width,
  height,
  frame,
  fps,
  duration,
  camera,
}: ThreeBackgroundProps) => {
  const cameraState = threeCameraAt(camera?.preset, frame, duration, fps);

  return (
    <>
      <TableLamp width={width} height={height} />
      {camera?.preset === 'peek' && (
        <PeekDoor width={width} height={height} reveal={cameraState.reveal} />
      )}
    </>
  );
};
