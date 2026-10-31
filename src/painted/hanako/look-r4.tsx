import {useCallback} from 'react';
import {AbsoluteFill} from 'remotion';
import {Spot} from '../kit/glow';
import {Grade, Grain} from '../kit/screen';
import {Cool, HK, LF01, makeDoorPaint} from './look';
import {BrushCanvas} from '../BrushCanvas';

// Film look stills for HANAKO-SHORT, brief HANAKO-SHORT-FILM-R4 (31 Oct 2026, VD21-VD23).
// LF06 B09-SH01 door-alone stretch at the glow peak (F2335, s ~1.01, hand off-frame, faint amber spill);
// LF06-EYE the rejected fallback (an eye in the latch seam) painted only so the user can compare;
// LF01-HOOK F0 with the larger hook line (FQ2) and no Japanese line (FQ3). Look stills only: no timeline, no sound.

const W = 1080, H = 1920;
const IVORY = '#efe3c4';

/** Latch-side seam glow (VD13 hue). Strip hugs the right post, spills onto the door face, fades out by y 860. */
const SeamGlow = ({level}: {level: number}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
    <defs>
      <linearGradient id="sgx" gradientUnits="userSpaceOnUse" x1={1080} y1={0} x2={920} y2={0}>
        <stop offset="0" stopColor={IVORY} stopOpacity={level * 1.8} />
        <stop offset="0.25" stopColor={IVORY} stopOpacity={level * 1.2} />
        <stop offset="1" stopColor={IVORY} stopOpacity={0} />
      </linearGradient>
      <linearGradient id="sgy" gradientUnits="userSpaceOnUse" x1={0} y1={130} x2={0} y2={860}>
        <stop offset="0" stopColor="#fff" stopOpacity={0} />
        <stop offset="0.12" stopColor="#fff" stopOpacity={1} />
        <stop offset="0.7" stopColor="#fff" stopOpacity={0.8} />
        <stop offset="1" stopColor="#fff" stopOpacity={0} />
      </linearGradient>
      <mask id="sgm"><rect x={0} y={130} width={W} height={730} fill="url(#sgy)" /></mask>
    </defs>
    <g mask="url(#sgm)" style={{mixBlendMode: 'screen'}}>
      <rect x={920} y={130} width={160} height={730} fill="url(#sgx)" />
      <rect x={1050} y={130} width={16} height={730} fill={IVORY} opacity={Math.min(1, level * 3.5)} />
    </g>
  </svg>
);

const Eye = () => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
    <defs><clipPath id="slit"><rect x={1046} y={590} width={22} height={120} rx={8} /></clipPath></defs>
    <rect x={1046} y={590} width={22} height={120} rx={8} fill="#0d1514" />
    <g clipPath="url(#slit)" opacity={0.85}>
      <ellipse cx={1060} cy={650} rx={16} ry={40} fill="#c9c3ad" />
      <ellipse cx={1057} cy={650} rx={10} ry={19} fill="#2b2118" />
      <circle cx={1053} cy={644} r={2} fill="#efe3c4" />
      <path d="M1040 622 Q1058 604 1074 622" stroke="#0d1514" strokeWidth={9} fill="none" />
      <path d="M1040 680 Q1058 696 1074 680" stroke="#0d1514" strokeWidth={9} fill="none" />
    </g>
  </svg>
);

export const LF06 = ({eye = false, level = 0.2, dim = 0.4}: {eye?: boolean; level?: number; dim?: number}) => {
  const paint = useCallback(makeDoorPaint(false), []);
  return (
    <AbsoluteFill style={{background: HK.ink}}>
      <AbsoluteFill style={{transform: 'scale(1.011)', transformOrigin: '660px 740px'}}>
        <BrushCanvas paint={paint} paper={HK.ink} />
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
          <text x={540} y={514} textAnchor="middle" fontFamily="Noto Sans Thai, sans-serif" fontWeight={800} fontSize={92} fill="#1d2a2c">3</text>
        </svg>
        <div style={{position: 'absolute', inset: 0, background: `rgba(6,12,13,${dim})`}} />
        <SeamGlow level={level} />
        {eye && <Eye />}
      </AbsoluteFill>
      <Cool />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
        <Spot x={540} y={700} r={1100} level={0.1} color={HK.amber} />
      </svg>
      <Grade />
      <Grain />
    </AbsoluteFill>
  );
};

/** F0 with the hook line (overlay layer, not plate). `lines` are the Thai wording; the Japanese line is off (FQ3). */
export const LF01HOOK = ({lines}: {lines: string[]}) => (
  <AbsoluteFill>
    <LF01 jp={false} />
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
      {lines.map((t, i) => (
        <text key={t} x={540} y={(lines.length === 1 ? 356 : 322) + i * 72} textAnchor="middle" fontFamily="Noto Sans Thai, sans-serif"
          fontWeight={800} fontSize={lines.length === 1 ? 64 : 60} fill="#f2f4ee" stroke="#10181a" strokeWidth={9} paintOrder="stroke" strokeLinejoin="round">{t}</text>
      ))}
    </svg>
  </AbsoluteFill>
);
