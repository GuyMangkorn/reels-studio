import React from "react";
import { Costume, Pose } from "./types";

export const DEFAULT_COSTUME: Costume = {
  skin: "#FFD9B8", shirt: "#FF8FA3", shirtAccent: "#FFF3B0", pants: "#7ED6B2",
  shoes: "#FF9F5A", hair: "#6B4A3A", cheek: "#FFADAD", outline: "#4A3B3B",
};

// Rig dimensions (local units, origin = hip center)
export const RIG = {
  shoulderX: 70, shoulderY: -222, upperArm: 112, forearm: 100,
  hipX: 40, thigh: 118, shin: 112, neckY: -250, headR: 96,
};

type Props = {
  pose: Pose; costume?: Partial<Costume>; x?: number; y?: number; scale?: number;
  rightHand?: "open" | "point"; showPivots?: boolean;
};

const Capsule: React.FC<{ len: number; w: number; fill: string; stroke: string }> = ({ len, w, fill, stroke }) => (
  <rect x={-w / 2} y={-w / 2} width={w} height={len + w} rx={w / 2} fill={fill} stroke={stroke} strokeWidth={5} />
);
const Pivot: React.FC<{ on?: boolean }> = ({ on }) => (on ? <circle r={7} fill="#ff0055" /> : null);

const Arm: React.FC<{ side: 1 | -1; p: Pose; c: Costume; hand: "open" | "point"; piv?: boolean }> = ({ side, p, c, hand, piv }) => {
  const sh = side === -1 ? p.lShoulder : p.rShoulder;
  const el = side === -1 ? p.lElbow : p.rElbow;
  const wr = side === -1 ? p.lWrist : p.rWrist;
  return (
    // shoulder > elbow > wrist hierarchy
    <g transform={`translate(${side * RIG.shoulderX},${RIG.shoulderY}) rotate(${sh})`}>
      <Capsule len={RIG.upperArm} w={46} fill={c.shirt} stroke={c.outline} />
      <g transform={`translate(0,${RIG.upperArm}) rotate(${el})`}>
        <Capsule len={RIG.forearm} w={38} fill={c.skin} stroke={c.outline} />
        <g transform={`translate(0,${RIG.forearm}) rotate(${wr})`}>
          {hand === "point" ? (
            <>
              <rect x={-7} y={10} width={14} height={50} rx={7} fill={c.skin} stroke={c.outline} strokeWidth={4} />
              <circle cx={0} cy={18} r={22} fill={c.skin} stroke={c.outline} strokeWidth={5} />
            </>
          ) : (
            <>
              <circle cx={side * -14} cy={12} r={10} fill={c.skin} stroke={c.outline} strokeWidth={4} />
              <circle cx={0} cy={20} r={25} fill={c.skin} stroke={c.outline} strokeWidth={5} />
            </>
          )}
          <Pivot on={piv} />
        </g>
        <Pivot on={piv} />
      </g>
      <Pivot on={piv} />
    </g>
  );
};

const Leg: React.FC<{ side: 1 | -1; p: Pose; c: Costume; piv?: boolean }> = ({ side, p, c, piv }) => {
  const hip = side === -1 ? p.lHip : p.rHip;
  const knee = side === -1 ? p.lKnee : p.rKnee;
  const foot = side === -1 ? p.lFootLift : p.rFootLift;
  const up = side === -1 ? p.lLegUp : p.rLegUp;
  return (
    // hip > knee > ankle hierarchy
    <g transform={`translate(${side * RIG.hipX},${-up}) rotate(${hip})`}>
      <Capsule len={RIG.thigh} w={54} fill={c.pants} stroke={c.outline} />
      <g transform={`translate(0,${RIG.thigh}) rotate(${knee})`}>
        <Capsule len={RIG.shin} w={46} fill={c.pants} stroke={c.outline} />
        <g transform={`translate(0,${RIG.shin}) rotate(${foot})`}>
          <ellipse cx={side * 18} cy={16} rx={44} ry={22} fill={c.shoes} stroke={c.outline} strokeWidth={5} />
          <Pivot on={piv} />
        </g>
        <Pivot on={piv} />
      </g>
      <Pivot on={piv} />
    </g>
  );
};

const Head: React.FC<{ p: Pose; c: Costume }> = ({ p, c }) => {
  const R = RIG.headR;
  const eyeRy = Math.max(1.5, 15 * (1 - p.blink));
  const mOpen = p.mouth;
  return (
    <g transform={`translate(0,${RIG.neckY}) rotate(${p.head})`}>
      <rect x={-20} y={-30} width={40} height={45} rx={12} fill={c.skin} stroke={c.outline} strokeWidth={5} />
      <g transform={`translate(0,${-R + 8})`}>
        <circle r={R} fill={c.skin} stroke={c.outline} strokeWidth={6} />
        <path d={`M ${-R + 4} -10 Q ${-R + 10} ${-R - 20} 0 ${-R - 6} Q ${R - 10} ${-R - 20} ${R - 4} -10 Q ${R - 30} -55 0 -60 Q ${-R + 30} -55 ${-R + 4} -10 Z`}
          fill={c.hair} stroke={c.outline} strokeWidth={5} strokeLinejoin="round" />
        <circle cx={-48} cy={28} r={16} fill={c.cheek} opacity={0.7} />
        <circle cx={48} cy={28} r={16} fill={c.cheek} opacity={0.7} />
        <ellipse cx={-32} cy={0} rx={11} ry={eyeRy} fill={c.outline} />
        <ellipse cx={32} cy={0} rx={11} ry={eyeRy} fill={c.outline} />
        {p.blink < 0.5 && (<><circle cx={-28} cy={-5} r={3.5} fill="#fff" /><circle cx={36} cy={-5} r={3.5} fill="#fff" /></>)}
        {mOpen < 0.08 ? (
          <path d="M -22 40 Q 0 58 22 40" fill="none" stroke={c.outline} strokeWidth={6} strokeLinecap="round" />
        ) : (
          <g>
            <ellipse cx={0} cy={46} rx={18 + mOpen * 6} ry={4 + mOpen * 20} fill="#8C2F39" stroke={c.outline} strokeWidth={5} />
            <ellipse cx={0} cy={50 + mOpen * 10} rx={9 + mOpen * 3} ry={2 + mOpen * 6} fill="#FF7B8A" />
          </g>
        )}
      </g>
    </g>
  );
};

export const Character: React.FC<Props> = ({ pose: p, costume, x = 0, y = 0, scale = 1, rightHand = "open", showPivots }) => {
  const c = { ...DEFAULT_COSTUME, ...costume };
  const chest = 1 + p.breath * 0.025;
  return (
    <g transform={`translate(${x},${y + p.bodyY}) scale(${scale})`}>
      <Leg side={-1} p={p} c={c} piv={showPivots} />
      <Leg side={1} p={p} c={c} piv={showPivots} />
      <g transform={`rotate(${p.torso})`}>
        <g transform={`scale(1,${chest})`}>
          <rect x={-88} y={-262} width={176} height={292} rx={60} fill={c.shirt} stroke={c.outline} strokeWidth={6} />
          <rect x={-88} y={-20} width={176} height={50} rx={22} fill={c.pants} stroke={c.outline} strokeWidth={6} />
          <circle cx={0} cy={-150} r={30} fill={c.shirtAccent} stroke={c.outline} strokeWidth={5} />
        </g>
        <g transform={`translate(0,${-262 * (chest - 1)})`}>
          <Head p={p} c={c} />
          <Arm side={-1} p={p} c={c} hand="open" piv={showPivots} />
          <Arm side={1} p={p} c={c} hand={rightHand} piv={showPivots} />
        </g>
      </g>
    </g>
  );
};
