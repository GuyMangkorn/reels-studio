import type {BackgroundBuilder} from '../Background';
import type {Actor} from '../../scenes/types';
export const exteriorScale = (w: number, h: number) => Math.min(w / 1040, h / 1600);
export function exteriorPlacement<T extends {x: number; y: number; scale: number}>(
  base: T,
  actor: Actor,
  w: number,
  h: number,
  scaleFactor = 0.28,
): T {
  return {
    ...base,
    x: w * (0.3 + 0.4 * (base.x / w)),
    y: h * (actor.y ?? 0.84),
    scale: exteriorScale(w, h) * scaleFactor * (actor.scale ?? 1),
  };
}
type HouseColors = {dark: boolean; lit: boolean};
const HouseFloors = ({dark, lit}: HouseColors) => (
  <>
    <rect x={-370} y={-650} width={740} height={650} fill={dark ? '#A99CB2' : '#F0D7C6'} />
    <path d="M-410-650 L-230-830 L-55-650 L150-830 L410-650Z" fill="#7B718D" />
    {[-570, -370, -170].map((y, floor) => (
      <g key={y}>
        <path d={`M-370 ${y + 128} H370`} stroke="#FFF3D9" strokeWidth={12} />
        {[-260, -80, 100, 280].map((x) => (
          <g key={x}>
            <path
              d={`M${x - 43} ${y + 90} V${y + 5} Q${x} ${y - 40} ${x + 43} ${y + 5} V${y + 90}Z`}
              fill={lit ? '#FFD166' : dark ? '#555E83' : '#BCDDE3'}
            />
            <path
              d={`M${x} ${y - 12} V${y + 90} M${x - 43} ${y + 39} H${x + 43}`}
              stroke="#FFF3D9"
            />
            {floor === 2 && x === -80 && (
              <rect x={x - 45} y={y - 12} width={90} height={182} rx={10} fill="#917F89" />
            )}
          </g>
        ))}
      </g>
    ))}
  </>
);
const Tower = ({dark, lit}: HouseColors) => (
  <>
    <path d="M200-740 V-900 L310-1040 L420-900 V0 H200Z" fill={dark ? '#B3A4B9' : '#E6C9CF'} />
    <path d="M185-900 L310-1060 L435-900Z" fill="#7B718D" />
    {[-815, -585, -355].map((y) => (
      <g key={y}>
        <rect x={260} y={y} width={100} height={125} rx={40} fill={lit ? '#FFD166' : '#555E83'} />
        <path d={`M310 ${y} V${y + 125} M260 ${y + 62} H360`} stroke="#FFF3D9" />
      </g>
    ))}
  </>
);
const Porch = () => (
  <>
    <path d="M-390-105 H185 L225-45 H-425Z" fill="#9A869D" />
    {[-365, -130, 150].map((x) => (
      <path key={x} d={`M${x}-44 V53`} stroke="#FFF3D9" strokeWidth={17} />
    ))}
    <path d="M-425 55 H225 M-440 75 H240" stroke="#B4A2A2" strokeWidth={20} />
  </>
);
/** Three occupied floors, tower, porch and steep Victorian roof. */
export const oldHouseExterior: BackgroundBuilder = ({w, h, time, options}) => {
  const dark = time !== 'day';
  const lit = options.windowLights ?? dark;
  return {
    far: (
      <>
        <rect
          width={w}
          height={h}
          fill={time === 'day' ? '#FFF1C9' : time === 'dusk' ? '#B5A1C5' : '#424668'}
        />
        <circle cx={w * 0.83} cy={h * 0.18} r={Math.min(w, h) * 0.065} fill="#FFD166" />
        <path
          d={`M0 ${h * 0.8} Q${w * 0.4} ${h * 0.65} ${w} ${h * 0.8} V${h} H0Z`}
          fill={dark ? '#66667F' : '#B8F2C9'}
        />
      </>
    ),
    mid: (
      <g
        transform={`translate(${w / 2} ${h * 0.76}) scale(${exteriorScale(w, h)})`}
        stroke="#4A3B3B"
        strokeWidth={5}
        strokeLinejoin="round"
      >
        <HouseFloors dark={dark} lit={lit} />
        <Tower dark={dark} lit={lit} />
        <Porch />
      </g>
    ),
    near: (
      <>
        <path
          d={`M${w * 0.44} ${h * 0.79} L${w * 0.27} ${h} H${w * 0.76} L${w * 0.57} ${h * 0.79}Z`}
          fill={dark ? '#9B8B9F' : '#DEC8AD'}
        />
        <path
          d={`M0 ${h * 0.88} H${w * 0.22} M${w * 0.8} ${h * 0.88} H${w}`}
          stroke="#4A3B3B"
          strokeWidth={8}
        />
      </>
    ),
  };
};
