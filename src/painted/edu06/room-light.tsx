import {AbsoluteFill} from 'remotion';
import {Spot} from '../kit/glow';
import {camPoint, type YCam} from '../kit/ycam';
import {LAMP, type RoomLightState} from './room';

// Screen-space light of SET-LIVINGROOM, one layer above the painted plate (brief EDU-EP06-BRIEF-R1.2 N1; the W3 look-frame overlay of
// LF01 made reusable). 'night': the lamp pool (ENV-GLOW `Spot`, peak <= 0.3) at the shade's picture point plus a cool night gradient
// to the right and the top and bottom edges. 'day' (B04-SH04): no lamp; a soft pale gradient from the window side (back right).
export const roomLightPx = (c: YCam) => camPoint(c, LAMP);

export const RoomLight = ({cam, light = 'night'}: {cam: YCam; light?: RoomLightState}) => {
  if (light === 'day') {
    return <AbsoluteFill style={{pointerEvents: 'none', background: 'linear-gradient(255deg, rgba(235,244,250,0.22) 0%, rgba(0,0,0,0) 55%), linear-gradient(180deg, rgba(200,215,228,0.12) 0%, rgba(0,0,0,0) 30%)'}} />;
  }
  const lamp = roomLightPx(cam);
  return (
    <>
      <AbsoluteFill style={{pointerEvents: 'none', background: 'linear-gradient(105deg, rgba(0,0,0,0) 45%, rgba(40,46,84,0.45) 100%), linear-gradient(180deg, rgba(40,46,84,0.35) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 78%, rgba(20,18,36,0.45) 100%)'}} />
      {lamp && (
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, mixBlendMode: 'screen'}}>
          <Spot x={lamp[0]} y={lamp[1]} r={900} color="#ffcf8a" level={0.3} />
          <Spot x={lamp[0]} y={lamp[1]} r={260} color="#fff0d0" level={0.3} />
        </svg>
      )}
    </>
  );
};
