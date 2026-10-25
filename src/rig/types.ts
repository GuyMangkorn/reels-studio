export type Pose = {
  bodyY: number; // vertical offset of hips (px, + = down)
  torso: number; // lean deg
  breath: number; // 0..1 chest scale amount
  head: number;
  lShoulder: number; lElbow: number; lWrist: number;
  rShoulder: number; rElbow: number; rWrist: number;
  lHip: number; lKnee: number; rHip: number; rKnee: number;
  lFootLift: number; rFootLift: number; // extra ankle rotation
  lLegUp: number; rLegUp: number; // px lift of hip pivot (front-view knee raise, hidden under pants band)
  mouth: number; // 0..1 open
  blink: number; // 0 open .. 1 closed
};
export type Costume = {
  skin: string; shirt: string; shirtAccent: string; pants: string;
  shoes: string; hair: string; cheek: string; outline: string;
};
export const ZERO: Pose = {
  bodyY: 0, torso: 0, breath: 0, head: 0,
  lShoulder: 0, lElbow: 0, lWrist: 0, rShoulder: 0, rElbow: 0, rWrist: 0,
  lHip: 0, lKnee: 0, rHip: 0, rKnee: 0, lFootLift: 0, rFootLift: 0, lLegUp: 0, rLegUp: 0,
  mouth: 0, blink: 0,
};
export const mixPose = (a: Pose, b: Pose, t: number): Pose => {
  const o = {} as Pose;
  (Object.keys(a) as (keyof Pose)[]).forEach((k) => { o[k] = a[k] + (b[k] - a[k]) * t; });
  return o;
};
