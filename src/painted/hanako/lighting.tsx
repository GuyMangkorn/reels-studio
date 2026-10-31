import {useId} from 'react';

/** Set light for painted wide/medium shots (polish pass C, P08/P10): world-space pigment haze, separate from cast and foreground art.
 * Cast profiles stop the warm pool above heads. Screen vignette never adds light to captions.
 */
export const SetLight = ({shot, level=.2}: {shot:string;level?:number}) => {
  const id=useId();
  const corridor=shot==='B01-SH02'||shot==='B08-SH01';
  const cast=shot==='B03-SH01'||shot==='B07-SH01'||shot==='B08-SH01';
  const x=corridor?540:shot==='B02-SH01'?540:200;
  const y=corridor?274:180;
  const rx=corridor?470:540, ry=cast?105:250;
  return <g>
    <defs><radialGradient id={id}>
      <stop offset="0" stopColor="#e1c789" stopOpacity={Math.min(.3,level)}/>
      <stop offset=".28" stopColor="#c7b784" stopOpacity={level*.65}/>
      <stop offset=".66" stopColor="#b3b28c" stopOpacity={level*.21}/>
      <stop offset="1" stopColor="#b3b28c" stopOpacity={0}/>
    </radialGradient></defs>
    <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={`url(#${id})`}/>
    {corridor && <ellipse cx={540} cy={285} rx={260} ry={27} fill={`url(#${id})`} opacity={.55}/>}
  </g>;
};
export const SetVignette = ({shot}:{shot:string}) => {
  const id=useId();
  const cast=shot==='B03-SH01'||shot==='B07-SH01';
  return <svg width={1080} height={1920} style={{position:'absolute',inset:0,pointerEvents:'none'}}>
    <defs><radialGradient id={id} gradientUnits="userSpaceOnUse" cx={540} cy={480} r={900}>
      <stop offset=".25" stopColor="#071719" stopOpacity={0}/>
      <stop offset=".7" stopColor="#071719" stopOpacity={cast?.04:.09}/>
      <stop offset="1" stopColor="#071719" stopOpacity={cast?.08:.17}/>
    </radialGradient></defs>
    <rect width={1080} height={1920} fill={`url(#${id})`}/>
  </svg>;
};
