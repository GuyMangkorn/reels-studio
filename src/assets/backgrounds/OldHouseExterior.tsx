import type {BackgroundBuilder} from '../Background';
/** Three occupied floors, tower, porch and steep Victorian roof. */
export const oldHouseExterior: BackgroundBuilder = ({w,h,time,options}) => {
  const dark = time !== 'day'; const lit = options.windowLights ?? dark;
  return {
    far: <><rect width={w} height={h} fill={time === 'day' ? '#FFF1C9' : time === 'dusk' ? '#B5A1C5' : '#424668'}/><circle cx={w*.83} cy={h*.18} r={Math.min(w,h)*.065} fill="#FFD166"/><path d={`M0 ${h*.8} Q${w*.4} ${h*.65} ${w} ${h*.8} V${h} H0Z`} fill={dark ? '#66667F' : '#B8F2C9'}/></>,
    mid: <g transform={`translate(${w/2} ${h*.76}) scale(${Math.min(w/1040,h/1700)})`} stroke="#4A3B3B" strokeWidth={5} strokeLinejoin="round">
      <rect x={-370} y={-650} width={740} height={650} fill={dark ? '#A99CB2' : '#F0D7C6'}/>
      <path d="M-410-650 L-230-830 L-55-650 L150-830 L410-650Z" fill="#7B718D"/>
      {[-570,-370,-170].map((y,floor) => <g key={y}><path d={`M-370 ${y+128} H370`} stroke="#FFF3D9" strokeWidth={12}/>{[-260,-80,100,280].map(x => <g key={x}><path d={`M${x-43} ${y+90} V${y+5} Q${x} ${y-40} ${x+43} ${y+5} V${y+90}Z`} fill={lit ? '#FFD166' : dark ? '#555E83' : '#BCDDE3'}/><path d={`M${x} ${y-12} V${y+90} M${x-43} ${y+39} H${x+43}`} stroke="#FFF3D9"/>{floor === 2 && x === -80 && <rect x={x-45} y={y-12} width={90} height={182} rx={10} fill="#917F89"/>}</g>)}</g>)}
      <path d="M200-740 V-900 L310-1040 L420-900 V0 H200Z" fill={dark ? '#B3A4B9' : '#E6C9CF'}/><path d="M185-900 L310-1060 L435-900Z" fill="#7B718D"/>
      {[-815,-585,-355].map(y => <g key={y}><rect x={260} y={y} width={100} height={125} rx={40} fill={lit ? '#FFD166' : '#555E83'}/><path d={`M310 ${y} V${y+125} M260 ${y+62} H360`} stroke="#FFF3D9"/></g>)}
      <path d="M-390-105 H185 L225-45 H-425Z" fill="#9A869D"/>{[-365,-130,150].map(x => <path key={x} d={`M${x}-44 V53`} stroke="#FFF3D9" strokeWidth={17}/>)}<path d="M-425 55 H225 M-440 75 H240" stroke="#B4A2A2" strokeWidth={20}/>
    </g>,
    near: <><path d={`M${w*.44} ${h*.79} L${w*.27} ${h} H${w*.76} L${w*.57} ${h*.79}Z`} fill={dark ? '#9B8B9F' : '#DEC8AD'}/><path d={`M0 ${h*.88} H${w*.22} M${w*.8} ${h*.88} H${w}`} stroke="#4A3B3B" strokeWidth={8}/></>,
  };
};
