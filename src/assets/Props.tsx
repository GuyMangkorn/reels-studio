import {Furnace} from './props/Furnace';
import type {ReactNode} from 'react';
export type PropName = 'tree' | 'house' | 'car' | 'boat' | 'sign' | 'furnace';
export type PropProps = {color?: string; night?: boolean; smoke?: number};
/** All prop artwork uses a 240x240 canvas; bottom center is the placement anchor. */
export const Tree = ({color = '#8bcbb2'}: PropProps) => (
  <>
    <path d="M109 224 L114 77 H128 L135 224Z" fill="#b38777" />
    <circle cx={119} cy={80} r={64} fill={color} />
    <circle cx={73} cy={118} r={48} fill={color} />
    <circle cx={162} cy={121} r={52} fill={color} />
    <path
      d="M122 163 V101 M122 144 L91 126 M123 122 L147 103"
      stroke="#629d8a"
      opacity={0.5}
      strokeWidth={7}
      strokeLinecap="round"
    />
  </>
);
export const House = ({color = '#f6bdad', night}: PropProps) => (
  <>
    <rect x={31} y={103} width={177} height={123} rx={7} fill={color} />
    <path d="M16 108 L120 23 L224 108Z" fill="#a190bc" />
    <rect x={98} y={151} width={42} height={75} rx={7} fill="#b18880" />
    <rect x={52} y={131} width={29} height={37} rx={5} fill={night ? '#ffe5a0' : '#d1edf0'} />
    <rect x={157} y={131} width={29} height={37} rx={5} fill={night ? '#ffe5a0' : '#d1edf0'} />
    <circle cx={129} cy={189} r={3} fill="#fce5ab" />
  </>
);
export const Car = ({color = '#f4a4a2'}: PropProps) => (
  <>
    <path
      d="M23 155 L57 102 Q63 91 82 91 H150 Q165 91 182 134 L213 144 Q225 149 225 178 V201 H16 V173Z"
      fill={color}
    />
    <path d="M68 106 H111 V143 H47Z M122 106 H150 L174 143 H122Z" fill="#cfe8ec" />
    <rect x={181} y={160} width={28} height={12} rx={5} fill="#ffeec5" />
    {[61, 180].map((x) => (
      <g key={x}>
        <circle cx={x} cy={200} r={25} fill="#615c78" />
        <circle cx={x} cy={200} r={12} fill="#eae0d9" />
      </g>
    ))}
  </>
);
export const Boat = ({color = '#a58dbf'}: PropProps) => (
  <>
    <path d="M19 170 H222 Q209 218 178 218 H64 Q32 210 19 170" fill={color} />
    <path d="M119 167 V26" stroke="#b78b72" strokeWidth={8} />
    <path d="M109 36 L35 154 H109Z" fill="#fff1d6" />
    <path d="M129 57 L197 154 H129Z" fill="#f6ae9b" />
    <path d="M49 188 H193" stroke="#d2bde1" strokeWidth={7} strokeLinecap="round" />
  </>
);
export const Sign = ({color = '#ffd8a0'}: PropProps) => (
  <>
    <rect x={111} y={93} width={17} height={137} rx={5} fill="#b38b78" />
    <path d="M24 54 H177 L218 92 L177 130 H24Z" fill={color} />
    <path
      d="M67 92 H164 M146 77 L164 92 L146 107"
      stroke="#a38073"
      strokeWidth={9}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </>
);
export const propRegistry: Record<PropName, (props: PropProps) => ReactNode> = {
  furnace: Furnace,
  tree: Tree,
  house: House,
  car: Car,
  boat: Boat,
  sign: Sign,
};
export const SceneProp = ({
  type,
  x,
  y,
  size = 240,
  ...props
}: PropProps & {type: PropName; x: number; y: number; size?: number}) => {
  const Asset = propRegistry[type];
  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size,
        overflow: type === 'furnace' ? 'visible' : undefined,
      }}
    >
      <Asset {...props} />
    </svg>
  );
};
