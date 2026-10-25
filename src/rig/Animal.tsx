import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Joint} from './Joint';
export type AnimalProps = {x?: number; y?: number; scale?: number; flip?: boolean; pose?: 'idle' | 'walk' | 'sit' | 'wave'; color?: string; frame?: number};
/** Shared quadruped skeleton; species supply silhouette, ears, muzzle and tail. */
export const Animal = ({species, x = 0, y = 0, scale = 1, flip = false, pose = 'idle', color, frame: clock}: AnimalProps & {species: 'dog' | 'cat'}) => {
  const current = useCurrentFrame(); const {fps} = useVideoConfig(); const t = (clock ?? current) / fps; const dog = species === 'dog';
  const fur = color ?? (dog ? '#eab278' : '#c7b5e7'); const p = t * Math.PI * 2 / 0.7;
  const walking = pose === 'walk'; const sitting = pose === 'sit';
  return <svg aria-label={`${species} cut-out rig`} viewBox="-150 -170 300 210" width={300 * scale} height={210 * scale} style={{position: 'absolute', left: x - 150 * scale, top: y - 200 * scale, overflow: 'visible'}}>
    <g transform={`scale(${flip ? -1 : 1} 1)`}>
      <ellipse cy={30} rx={103} ry={10} fill="#253047" opacity={0.13}/>
      <g transform={`translate(0 ${walking ? -Math.abs(Math.sin(p)) * 4 : Math.sin(t * 3) * 1.3})`}>
        <Joint name="tail" x={-75} y={-62} angle={Math.sin(t * (dog ? 12 : 4)) * (dog ? 23 : 12)}>
          <path d={dog ? 'M0 0 Q-53-17-42-53' : 'M0 0 Q-75-5-66-62 Q-61-91-80-88'} fill="none" stroke={fur} strokeWidth={dog ? 22 : 17} strokeLinecap="round"/>
        </Joint>
        {[0, 1, 2, 3].map((i) => <Joint key={i} name={`upperLeg${i}`} x={i < 2 ? -52 : 51} y={-45} angle={sitting ? (i < 2 ? -60 : 0) : walking ? Math.sin(p + (i % 2 ? Math.PI : 0) + (i < 2 ? 0 : Math.PI)) * 25 : pose === 'wave' && i === 3 ? -75 : 0}>
          <rect x={-10} y={-3} width={20} height={44} rx={10} fill={i % 2 ? fur : dog ? '#c99366' : '#a798c6'}/>
          <Joint name={`lowerLeg${i}`} y={30} angle={walking ? Math.max(0, Math.sin(p + i * Math.PI)) * 22 : sitting && i < 2 ? 65 : 0}><rect x={-9} y={-3} width={18} height={41} rx={9} fill={fur}/><ellipse cx={7} cy={35} rx={19} ry={9} fill="#fbedd9"/></Joint>
        </Joint>)}
        <ellipse cx={-9} cy={-64} rx={78} ry={42} fill={fur}/><ellipse cx={25} cy={-55} rx={27} ry={26} fill="#fff0d9"/>
        <Joint name="head" x={69} y={-101} angle={Math.sin(t * 2) * 3}>
          {[-28, 25].map((ex, i) => <Joint key={ex} name={`ear${i}`} x={ex} y={-30} angle={Math.sin(t * 5 + i) * 4 + (t % 3 > 2.8 ? Math.sin(t * 45) * 8 : 0)}>
            <path d={dog ? 'M-14-7 Q-28 44-7 47 Q16 36 15-7Z' : 'M-17 9 L-14-39 Q-8-48 17 3Z'} fill={dog ? '#ac795e' : fur}/>{!dog && <path d="M-9 0 L-9-25 L8-1Z" fill="#edb1b9"/>}
          </Joint>)}
          <ellipse rx={44} ry={41} fill={fur}/><ellipse cx={26} cy={15} rx={26} ry={19} fill="#fff0d9"/>
          <ellipse cx={10} cy={-5} rx={5} ry={t % 3.1 > 2.98 ? 1 : 7} fill="#39374b"/>
          <path d="M38 6 Q49 1 45 14 Q39 20 35 13Z" fill="#66516c"/>
          <path d="M36 20 Q27 30 20 22" fill="none" stroke="#7a596c" strokeWidth={3} strokeLinecap="round"/>
          {dog ? <path d="M26 24 Q42 20 34 37 Q24 43 26 24" fill="#ee9caa"/> : <path d="M18 16 L-11 11 M18 23 L-12 28" stroke="#88799e" strokeWidth={2}/>}
        </Joint>
      </g>
    </g>
  </svg>;
};
export const Dog = (props: AnimalProps) => <Animal {...props} species="dog"/>;
export const Cat = (props: AnimalProps) => <Animal {...props} species="cat"/>;
