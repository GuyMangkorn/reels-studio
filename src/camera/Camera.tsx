import type {ReactNode} from 'react';
import {smoothstep} from '../rig/poses';
export type CameraConfig = {
  zoom?: [number, number]; pan?: {from: [number, number]; to: [number, number]};
  parallax?: number; view?: 'front' | 'topDown'; lighting?: 'normal' | 'silhouette';
};
/** Pan offsets are fractions of stage width/height; progress is local to each shot. */
export function cameraAt(camera: CameraConfig = {}, frame: number, duration: number) {
  const t = smoothstep(frame / Math.max(1,duration-1));
  const zoom = camera.zoom ?? [1,1]; const pan = camera.pan ?? {from:[0,0],to:[0,0]};
  const scale = zoom[0]+(zoom[1]-zoom[0])*t;
  const margin = (scale-1)/2;
  const cropSafe = (value: number) => Math.max(-margin,Math.min(margin,value));
  return {zoom: scale, x:cropSafe(pan.from[0]+(pan.to[0]-pan.from[0])*t), y:cropSafe(pan.from[1]+(pan.to[1]-pan.from[1])*t)};
}
export const Camera = ({camera, frame, duration, width, height, children}: {camera?: CameraConfig; frame: number; duration: number; width: number; height: number; children: ReactNode}) => {
  const state = cameraAt(camera,frame,duration);
  return <div style={{position:'absolute',inset:0,transformOrigin:'50% 50%',transform:`translate(${state.x*width}px, ${state.y*height}px) scale(${state.zoom})`}}>{children}</div>;
};
