import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { Character } from "./rig/Character";
import { presets, PresetName } from "./rig/presets";
import { mixPose, Pose } from "./rig/types";
import { blinkAt, mouthAt } from "./rig/drivers";
import amp from "./amplitude.json";

const VO_START = 12;
// [preset, startFrame]; consecutive segments cross-fade over BLEND frames
const TIMELINE: [PresetName, number][] = [["idle", 0], ["wave", 14], ["walk", 112], ["point", 166]];
const BLEND = 12;

export const poseAt = (frame: number, fps: number): Pose => {
  let i = 0;
  while (i + 1 < TIMELINE.length && frame >= TIMELINE[i + 1][1]) i++;
  const cur = presets[TIMELINE[i][0]](frame, fps);
  if (i === 0) return cur;
  const prev = presets[TIMELINE[i - 1][0]](frame, fps);
  const t = interpolate(frame, [TIMELINE[i][1], TIMELINE[i][1] + BLEND], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  return mixPose(prev, cur, t);
};

export const Demo: React.FC<{ showPivots?: boolean }> = ({ showPivots }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const pose = { ...poseAt(frame, fps), blink: blinkAt(frame, fps), mouth: mouthAt(amp as number[], frame, VO_START) };
  const pointing = frame >= TIMELINE[3][1] + 4;
  // Laid out at 1080×1920. sx/sy keep that frame identical and fit the same scene into 1920×1080.
  const sx = width / 1080;
  const sy = height / 1920;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#FFF1C9 0%, #FFE0E6 60%, #FFE0E6 100%)" }}>
      <Sequence from={VO_START}><Audio src={staticFile("narration.mp3")} /></Sequence>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <circle cx={820 * sx} cy={330 * sy} r={110 * Math.min(sx, sy)} fill="#FFD166" />
        {[[220, 300], [640, 520]].map(([x, y], k) => (
          <g key={k} transform={`translate(${x * sx + Math.sin(frame / 60 + k) * 20 * sx},${y * sy})`} fill="#FFFFFF">
            <ellipse rx={110 * sx} ry={45 * Math.min(sx, sy)} /><ellipse cx={-60 * sx} cy={10 * sy} rx={60 * sx} ry={35 * Math.min(sx, sy)} /><ellipse cx={60 * sx} cy={8 * sy} rx={70 * sx} ry={40 * Math.min(sx, sy)} />
          </g>
        ))}
        <rect x={0} y={1420 * sy} width={width} height={Math.max(500 * sy, height - 1420 * sy)} fill="#B8F2C9" />
        <ellipse cx={540 * sx} cy={1440 * sy} rx={230 * sx} ry={30 * Math.min(sx, sy)} fill="#000" opacity={0.08} />
        <Character pose={pose} x={540 * sx} y={1180 * sy} scale={1.65 * Math.min(sx, sy)} rightHand={pointing ? "point" : "open"} showPivots={showPivots} />
      </svg>
    </AbsoluteFill>
  );
};
