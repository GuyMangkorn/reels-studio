import { Pose, ZERO } from "./types";
// All presets: (frame, fps) => Pose. Angles in degrees, SVG convention
// (positive = clockwise). Arms hang at 0; right arm raises with negative angles.
const TAU = Math.PI * 2;
const s = (f: number, fps: number, hz: number, phase = 0) => Math.sin(TAU * hz * (f / fps) - phase);

const breathe = (f: number, fps: number): Partial<Pose> => ({
  breath: (s(f, fps, 0.3) + 1) / 2,
  bodyY: s(f, fps, 0.3) * 3,
  head: s(f, fps, 0.2, 1) * 2,
});

// pendulum arms with lagging forearm/hand (phase offset = secondary motion)
const armSwing = (f: number, fps: number, amp: number, hz: number) => {
  const lag1 = 0.9, lag2 = 1.6;
  return {
    lShoulder: 6 + amp * s(f, fps, hz),
    lElbow: 8 + amp * 0.55 * s(f, fps, hz, lag1),
    lWrist: amp * 0.35 * s(f, fps, hz, lag2),
    rShoulder: -6 - amp * s(f, fps, hz),
    rElbow: -8 - amp * 0.55 * s(f, fps, hz, lag1),
    rWrist: -amp * 0.35 * s(f, fps, hz, lag2),
  };
};

export const idle = (f: number, fps: number): Pose => ({
  ...ZERO, ...breathe(f, fps), ...armSwing(f, fps, 4, 0.3),
});

export const walk = (f: number, fps: number): Pose => {
  const hz = 1.1; // step cycle (front-view march in place)
  const ph = s(f, fps, hz);
  const lLift = Math.max(0, ph), rLift = Math.max(0, -ph);
  const arms = armSwing(f, fps, 9, hz);
  return {
    ...ZERO, ...breathe(f, fps), ...arms,
    lShoulder: arms.lShoulder + 8, rShoulder: arms.rShoulder - 8, // keep swing outside the body
    bodyY: -Math.abs(ph) * 12 + 6,
    torso: ph * 2,
    lLegUp: lLift * 34, lHip: lLift * 8, lKnee: -lLift * 16, lFootLift: lLift * 6,
    rLegUp: rLift * 34, rHip: -rLift * 8, rKnee: rLift * 16, rFootLift: -rLift * 6,
  };
};

export const wave = (f: number, fps: number): Pose => {
  const base = idle(f, fps);
  return {
    ...base,
    rShoulder: -150 + s(f, fps, 0.8) * 4,
    rElbow: -25 + s(f, fps, 2.2) * 28,
    rWrist: s(f, fps, 2.2, 0.8) * 18, // hand lags the forearm
    head: base.head + 4,
    torso: -2,
  };
};

export const point = (f: number, fps: number): Pose => {
  const base = idle(f, fps);
  return {
    ...base,
    rShoulder: -82 + s(f, fps, 0.5) * 2,
    rElbow: -6, rWrist: -4,
    lShoulder: 14, lElbow: 25,
    head: base.head - 6,
    torso: -4,
  };
};

export const presets = { idle, walk, wave, point };
export type PresetName = keyof typeof presets;
