import {useLayoutEffect, useRef} from 'react';
import {mixYCam} from '../../kit/ycam';
import {cam, LF04_AZ} from '../looks-cams';
import {drawCrowd, paintStadium, roofPoly, STADIUM} from '../stadium';
import {k01, makeShot, type Frame} from '../shotkit';
import type {Pass} from '../stack';

// EDU-EP18-SHORT B03-SH04: the full stadium, a crane up and back L0-56 (hold L56-60). The dot crowd on a plain 2D canvas (stadium.ts drawCrowd).
const A = cam([0, 8, 0], 55, 110, 52, 1000, 840, {pitch: -22}), Z = cam([0, 8, 0], 65, 141.6, 189.2, 1000, 840, {pitch: -52});
const Crowd = ({c, az, frame}: {c: typeof A; az: number; frame: number}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 1080, 1920);
    drawCrowd(ctx, c, {occluder: roofPoly(c, az), az, frame});
  });
  return <canvas ref={ref} width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, filter: 'blur(0.35px)'}} />;
};
export const B03_SH04 = makeShot('B03-SH04', (L, G): Frame => {
  const e = k01(L, 0, 56), c = mixYCam(A, Z, e), az = 55 + 10 * e;
  const back: Pass = (p) => paintStadium(p, c, az);
  return {
    paper: STADIUM.haze, back, mid: <Crowd c={c} az={az} frame={G} />, grain: 0.06,
    overlay: <div style={{position: 'absolute', left: 0, top: 1380, width: 1080, height: 540, background: 'linear-gradient(rgba(58,66,74,0), rgba(58,66,74,0.2) 60%, rgba(58,66,74,0.26))'}} />,
  };
});
void LF04_AZ;
