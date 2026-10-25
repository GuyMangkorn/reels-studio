import type {BackgroundBuilder} from '../Background';
export const basement: BackgroundBuilder = ({w,h}) => ({
  far: <><rect width={w} height={h} fill="#897985"/>{Array.from({length:12},(_,row) => <g key={row}>{Array.from({length:9},(_,col) => <rect key={col} x={(col-(row%2)*.5)*w/8} y={row*h*.065} width={w/8-5} height={h*.065-5} rx={5} fill={(row+col)%3 ? '#9D8890' : '#AC9297'}/>)}</g>)}</>,
  mid: <><path d={`M${w*.12} 0 V${h*.37} H${w*.85} V${h*.64}`} fill="none" stroke="#4A3B3B" strokeWidth={30}/><path d={`M${w*.12} 0 V${h*.37} H${w*.85} V${h*.64}`} fill="none" stroke="#B0A0AC" strokeWidth={20}/><path d={`M0 ${h*.75} H${w} V${h} H0Z`} fill="#645F74"/></>,
  near: <><ellipse cx={w*.55} cy={h*.83} rx={w*.4} ry={h*.07} fill="#FFD166" opacity={.12}/></>,
});
