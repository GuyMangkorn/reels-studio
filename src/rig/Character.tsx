import {useRef} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Joint} from './Joint';
import {advancePoseChange, resolvePose, type PoseInput, type PoseChangeState} from './poses';
export type Expression = 'neutral' | 'happy' | 'shock' | 'think';
export type CharacterProps = {
  x?: number; y?: number; scale?: number; flip?: boolean; skinColor?: string; shirtColor?: string; pantsColor?: string;
  hairStyle?: 'short' | 'long' | 'bald'; expression?: Expression; pose?: PoseInput; talking?: boolean;
  /** Optional explicit animation clock in scene-local frames. */ frame?: number;
};
export const Character = ({x = 0, y = 0, scale = 1, flip = false, skinColor = '#efb78e', shirtColor = '#fb947e', pantsColor = '#666cac', hairStyle = 'short', expression = 'happy', pose = 'idle', talking = false, frame: clock}: CharacterProps) => {
  const current = useCurrentFrame(); const {fps} = useVideoConfig(); const frame = clock ?? current;
  const livePose = useRef<PoseChangeState | null>(null);
  if (typeof pose === 'string') livePose.current = advancePoseChange(livePose.current, pose, frame, fps);
  else livePose.current = null;
  const a = resolvePose(typeof pose === 'string' ? livePose.current!.pose : pose, frame, fps); const t = frame / fps;
  // Repeating 2.7 / 3.3 / 2.4-second intervals, with a 130ms triangular blink.
  const cycle = ((t % 8.4) + 8.4) % 8.4;
  const blink = Math.max(...[2.7, 6, 8.4].map(at => Math.max(0, 1 - Math.abs(cycle - (at - 0.1)) / 0.065)));
  const eye = Math.max(0.09, 1 - blink);
  const mouth = talking ? 4 + (0.5 + Math.sin(t * 26) * 0.5) * 12 : expression === 'shock' ? 12 : 3;
  const leg = (side: 'L' | 'R') => <Joint name={`upperLeg${side}`} x={side === 'L' ? -23 : 23} angle={a[`upperLeg${side}`]}>
    <rect x={-17} y={-7} width={34} height={91} rx={17} fill={pantsColor}/>
    <Joint name={`lowerLeg${side}`} y={78} angle={a[`lowerLeg${side}`]}><rect x={-15} y={-7} width={30} height={84} rx={15} fill={pantsColor}/>
      <Joint name={`foot${side}`} y={72} angle={a[`foot${side}`]}><path d="M-15-2 Q3-6 14 3 L31 14 Q37 30 17 30 H-16Z" fill="#faf2df"/><path d="M-16 25 H32 V32 H-16Z" fill="#d7bdaf"/></Joint>
    </Joint></Joint>;
  const arm = (side: 'L' | 'R') => <Joint name={`upperArm${side}`} x={side === 'L' ? -44 : 44} y={-99} angle={a[`upperArm${side}`]}>
    <rect x={-18} y={-7} width={36} height={48} rx={18} fill={shirtColor}/><rect x={-13} y={25} width={26} height={47} rx={13} fill={skinColor}/>
    <Joint name={`lowerArm${side}`} y={65} angle={a[`lowerArm${side}`]}><rect x={-12} y={-9} width={24} height={68} rx={12} fill={skinColor}/>
      <Joint name={`hand${side}`} y={54} angle={a[`hand${side}`]}><ellipse cy={10} rx={15} ry={21} fill={skinColor}/><ellipse cx={side === 'L' ? 12 : -12} cy={6} rx={7} ry={11} fill={skinColor}/></Joint>
    </Joint></Joint>;
  return <svg aria-label="Narrator cut-out rig" width={320 * scale} height={430 * scale} viewBox="-160 -230 320 430" style={{position: 'absolute', left: x - 160 * scale, top: y - 415 * scale, overflow: 'visible'}}>
    <g transform={`scale(${flip ? -1 : 1} 1)`}>
      <ellipse cx={8} cy={185} rx={68} ry={10} fill="#253047" opacity={0.12}/>
      <g transform={`translate(0 ${Math.sin(t * 2.7) * 2.3})`}>
        {leg('L')}{leg('R')}
        <Joint name="torso" angle={a.torso}>
          {arm('L')}
          <path d="M-41-113 Q0-132 41-113 L47-11 Q0 7-47-11Z" fill={shirtColor}/>
          <path d="M-16-119 V-145 H16 V-119 Q0-102-16-119" fill={skinColor}/>
          <path d="M-15-118 Q0-105 15-118" stroke="#fff0dc" strokeWidth={6} fill="none"/>
          <rect x={17} y={-86} width={18} height={21} rx={4} fill="#ffd7ad"/>
          {arm('R')}
          <Joint name="head" y={-145} angle={a.head}>
            {hairStyle === 'long' && <path d="M-48-35 Q-65 20-51 64 Q-27 76-14 52 H43 Q63 47 53-35Z" fill="#493b55"/>}
            <ellipse cx={-50} cy={-8} rx={11} ry={16} fill={skinColor}/><ellipse cx={50} cy={-8} rx={11} ry={16} fill={skinColor}/>
            <rect x={-50} y={-67} width={100} height={115} rx={46} fill={skinColor}/>
            {hairStyle !== 'bald' && <path d="M-50-10 Q-64-71-16-74 Q34-94 53-49 L51-12 L36-41 Q7-25-14-48 Q-20-30-42-27Z" fill="#493b55"/>}
            <ellipse cx={-31} cy={17} rx={12} ry={6} fill="#e68d85" opacity={0.55}/><ellipse cx={31} cy={17} rx={12} ry={6} fill="#e68d85" opacity={0.55}/>
            <path d={expression === 'shock' ? 'M-31-25 L-14-30 M14-30 L31-25' : expression === 'think' ? 'M-31-20 L-14-26 M14-23 L31-17' : 'M-31-23 Q-22-27-14-23 M14-23 Q23-27 31-23'} stroke="#493b55" strokeWidth={3.5} strokeLinecap="round" fill="none"/>
            {[-22, 22].map(cx => <ellipse key={cx} cx={cx} cy={-7} rx={expression === 'shock' ? 6 : 4.5} ry={(expression === 'shock' ? 10 : 7) * eye} fill="#39374b"/>)}
            <path d="M0-2 L-4 9 H3" stroke="#ce8d75" strokeWidth={3} strokeLinecap="round" fill="none"/>
            {talking || expression === 'shock' ? <ellipse cy={27} rx={expression === 'shock' ? 10 : 12} ry={mouth} fill="#7a4255"/> : <path d={expression === 'happy' ? 'M-14 23 Q0 44 14 23Z' : expression === 'think' ? 'M-8 29 L7 25' : 'M-11 27 Q0 31 11 27'} fill={expression === 'happy' ? '#fff9ec' : 'none'} stroke="#7a4255" strokeWidth={3} strokeLinecap="round"/>}
          </Joint>
        </Joint>
      </g>
    </g>
  </svg>;
};
