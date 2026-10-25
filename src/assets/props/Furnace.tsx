import {useCurrentFrame, useVideoConfig} from 'remotion';
/** 240-square reusable prop. Smoke is illustrative, not a depiction of visible CO. */
export const Furnace = ({smoke = .35}: {smoke?: number}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const t = frame / fps;
  const glow = .7 + Math.sin(t * 19) * .15 + Math.sin(t * 31) * .1;
  return <g stroke="#4A3B3B" strokeWidth={4} strokeLinejoin="round"><path d="M155 80 V24 H207" fill="none" stroke="#796B78" strokeWidth={23}/><rect x={45} y={78} width={150} height={145} rx={20} fill="#897D8A"/><rect x={66} y={112} width={108} height={78} rx={13} fill="#4A3B3B"/><g opacity={glow}><rect x={73} y={120} width={94} height={63} rx={9} fill="#FF9F5A"/><path d="M91 178 Q76 151 107 134 Q102 159 122 141 Q142 121 148 156 L153 178Z" fill="#FFD166" stroke="none"/></g>{[87,110,133,156].map(x => <path key={x} d={`M${x} 116 V187`} strokeWidth={6}/>)}<path d="M61 222 V233 M180 222 V233" strokeWidth={10}/><g stroke="none" fill="#D5CAD7" opacity={Math.max(0,Math.min(1,smoke))}>{[0,1,2,3].map(i => {const phase = (t * .4 + i / 4) % 1; return <ellipse key={i} cx={204 + Math.sin(t * 2 + i) * 10} cy={24 - phase * 100} rx={12 + phase * 22} ry={10 + phase * 17} opacity={1-phase}/>;})}</g></g>;
};
