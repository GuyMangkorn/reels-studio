/** Degrees, clockwise in SVG coordinates. Local joints inherit their parent's rotation. */
export const joints = ['torso', 'head', 'upperArmL', 'upperArmR', 'lowerArmL', 'lowerArmR', 'handL', 'handR', 'upperLegL', 'upperLegR', 'lowerLegL', 'lowerLegR', 'footL', 'footR'] as const;
export type Joint = typeof joints[number];
export type JointAngles = Record<Joint, number>;
export type PoseName = 'idle' | 'walk' | 'point' | 'shock' | 'think' | 'wave' | 'sit';
const base: JointAngles = {torso: 0, head: 0, upperArmL: 8, upperArmR: -8, lowerArmL: -8, lowerArmR: 8, handL: 0, handR: 0, upperLegL: 0, upperLegR: 0, lowerLegL: 0, lowerLegR: 0, footL: 0, footR: 0};
export const poses: Record<PoseName, JointAngles> = {
  idle: {...base}, walk: {...base},
  point: {...base, upperArmR: -100, lowerArmR: 8, handR: -12, head: -5},
  shock: {...base, upperArmL: 145, upperArmR: -145, lowerArmL: 24, lowerArmR: -24, head: -5, upperLegL: 7, upperLegR: -7},
  think: {...base, upperArmR: -25, lowerArmR: -140, handR: 20, head: 12, upperArmL: 20, lowerArmL: -55},
  wave: {...base, upperArmR: -150, lowerArmR: -15, handR: -15, head: -6},
  sit: {...base, upperLegL: -83, upperLegR: -83, lowerLegL: 85, lowerLegR: 85, lowerArmL: -22, lowerArmR: 22},
};
export type PoseTransition = {from: PoseName; to: PoseName; startFrame: number; durationFrames?: number; fromAngles?: JointAngles};
export type PoseTrack = {initial: PoseName; from?: PoseName; keys: {frame: number; pose: PoseName}[]; durationFrames?: number};
export type PoseInput = PoseName | PoseTransition | PoseTrack;
export const mixAngles = (a: JointAngles, b: JointAngles, t: number): JointAngles => t <= 0 ? {...a} : t >= 1 ? {...b} : Object.fromEntries(joints.map(j => [j, a[j] + (b[j] - a[j]) * t])) as JointAngles;
export const smoothstep = (t: number) => {const v = Math.max(0, Math.min(1, t)); return v * v * (3 - 2 * v);};
export function samplePose(name: PoseName, frame: number, fps: number): JointAngles {
  const a = {...poses[name]};
  const p = frame / fps * Math.PI * 2 / 0.9;
  if (name === 'walk') {
    a.upperLegL = Math.sin(p) * 25; a.upperLegR = -Math.sin(p) * 25;
    a.lowerLegL = Math.max(0, -Math.sin(p)) * 36; a.lowerLegR = Math.max(0, Math.sin(p)) * 36;
    a.upperArmL = -Math.sin(p - 0.3) * 20; a.upperArmR = Math.sin(p - 0.3) * 20;
    a.lowerArmL = -10 - Math.sin(p - 0.6) * 9; a.lowerArmR = 10 + Math.sin(p - 0.6) * 9;
    a.footL = -a.upperLegL - a.lowerLegL; a.footR = -a.upperLegR - a.lowerLegR;
  }
  if (name === 'wave') {a.lowerArmR += Math.sin(p) * 17; a.handR += Math.sin(p - 0.7) * 14;}
  // Small delayed pendulum on top of the authored pose, never dependent on playback history.
  a.upperArmL += Math.sin(p * 0.38) * 1.8; a.upperArmR += Math.sin(p * 0.38 + 0.6) * 1.8;
  a.lowerArmL += Math.sin(p * 0.38 - 0.4) * 2; a.lowerArmR += Math.sin(p * 0.38 + 0.2) * 2;
  a.handL += Math.sin(p * 0.38 - 0.8) * 3; a.handR += Math.sin(p * 0.38 - 0.2) * 3;
  return a;
}
/** Pass a transition descriptor when changing poses; explicit history makes seeking deterministic. */
export function resolvePose(pose: PoseInput, frame: number, fps: number): JointAngles {
  if (typeof pose === 'string') return samplePose(pose, frame, fps);
  if ('initial' in pose) return resolvePose(transitionAtTrack(pose, frame, fps), frame, fps);
  const duration = pose.durationFrames ?? Math.round(fps * 0.4);
  const t = smoothstep(duration <= 0 ? 1 : (frame - pose.startFrame) / duration);
  return mixAngles(pose.fromAngles ?? samplePose(pose.from, frame, fps), samplePose(pose.to, frame, fps), t);
}

/** Reconstruct each interruption from the preceding blend; random-access rendering stays continuous. */
export function transitionAtTrack(track: PoseTrack, frame: number, fps: number): PoseTransition {
  let transition: PoseTransition = {from: track.from ?? track.initial, to: track.initial, startFrame: 0, durationFrames: track.durationFrames ?? Math.round(fps * .4)};
  for (const key of track.keys) {
    if (frame < key.frame) break;
    const fromAngles = resolvePose(transition, key.frame, fps);
    transition = {from: transition.to, to: key.pose, startFrame: key.frame, durationFrames: transition.durationFrames, fromAngles};
  }
  return transition;
}
export type PoseChangeState = {name: PoseName; pose: PoseInput; lastFrame: number};
/** Tracks live prop edits. Render-authored changes should use PoseTrack, which carries complete history. */
export function advancePoseChange(previous: PoseChangeState | null, name: PoseName, frame: number, fps: number): PoseChangeState {
  if (!previous || frame < previous.lastFrame) return {name, pose: name, lastFrame: frame};
  if (previous.name === name) return {...previous, lastFrame: frame};
  return {name, lastFrame: frame, pose: {from: previous.name, to: name, startFrame: frame, durationFrames: Math.round(fps * .4), fromAngles: resolvePose(previous.pose, frame, fps)}};
}
