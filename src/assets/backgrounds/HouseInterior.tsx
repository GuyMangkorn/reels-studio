import type {BackgroundBuilder} from '../Background';
import type {ReactNode} from 'react';
import {Sofa} from '../props/Sofa';
import {setLayout} from './layout';
export const interiorVariants = [
  'drawing',
  'dining',
  'staircase',
  'kitchen',
  'bedroomPOV',
  'window',
] as const;
export type InteriorVariant = (typeof interiorVariants)[number];
export type BackgroundOptions = {
  variant?: InteriorVariant;
  windowLights?: boolean;
  blanketPull?: number | [number, number];
  vignette?: boolean;
  /** Internal texturing hint for actors placed outside a window. */
  transparentWindow?: boolean;
};
const polar = (r: number, angle: number) => {
  const a = (angle * Math.PI) / 180;
  return `${540 + r * Math.cos(a)} ${900 + r * Math.sin(a)}`;
};
/** Looking vertically into a spiral well: concentric turns descend into darkness. */
export const staircaseSteps = Array.from({length: 36}, (_, i) => {
  const angle = -90 + i * 20;
  const outer = 690 - i * 12;
  const inner = outer - 205;
  return {
    angle,
    outer,
    inner,
    d: `M${polar(inner, angle)} L${polar(outer, angle)} A${outer} ${outer} 0 0 1 ${polar(outer, angle + 20)} L${polar(inner, angle + 20)} A${inner} ${inner} 0 0 0 ${polar(inner, angle)}Z`,
  };
});
export const stairFootsteps = Array.from({length: 14}, (_, i) => {
  const step = staircaseSteps[i + 2];
  const radius = (step.outer + step.inner) / 2 + (i % 2 ? 22 : -22);
  const angle = step.angle + 10;
  return {
    x: 540 + radius * Math.cos((angle * Math.PI) / 180),
    y: 900 + radius * Math.sin((angle * Math.PI) / 180),
    angle: angle + 90,
    atSec: i * 0.16,
  };
});
const Staircase = ({t, left, span}: {t: number; left: number; span: number}) => (
  <g data-view="spiral-top-down">
    <rect x={left - 100} y={-100} width={span + 200} height={2120} fill="#4A4258" />
    {Array.from({length: Math.ceil(span / 140) + 2}, (_, i) => (
      <path key={i} d={`M${left + i * 140} -100 V2020`} stroke="#66586C" strokeWidth={4} />
    ))}
    {[820, 745].map((r) => (
      <circle key={r} cx={540} cy={900} r={r} fill="none" stroke="#8D7887" strokeWidth={22} />
    ))}
    <circle cx={540} cy={900} r={705} fill="#272335" />
    {staircaseSteps.map((step, i) => (
      <path
        key={i}
        d={step.d}
        fill={i % 2 ? '#BC9F9A' : '#D2B8A8'}
        style={{filter: `brightness(${1 - i * 0.018})`}}
      />
    ))}
    <circle cx={540} cy={900} r={62} fill="#1C1929" />
    {stairFootsteps.map((foot, i) => (
      <g
        key={i}
        data-footstep-shadow
        transform={`translate(${foot.x} ${foot.y}) rotate(${foot.angle})`}
        opacity={t >= foot.atSec ? 0.52 : 0}
        fill="#211B30"
        stroke="none"
      >
        <path d="M-11-24 Q-18-5-9 10 Q0 17 9 7 L10-19 Q0-34-11-24Z" />
        <ellipse cy={23} rx={9} ry={10} />
      </g>
    ))}
    <circle cx={540} cy={900} r={710} fill="none" stroke="#E4CBAF" strokeWidth={12} />
    {Array.from({length: 32}, (_, i) => (
      <path
        key={i}
        d={`M${polar(710, i * 11.25)} L${polar(750, i * 11.25)}`}
        stroke="#B3A1A8"
        strokeWidth={9}
      />
    ))}
  </g>
);
const Curtains = ({dark}: {dark: boolean}) => {
  const fabric = dark ? '#967e9d' : '#d7aab0';
  const fold = dark ? '#735f82' : '#b88791';
  return (
    <g data-prop="curtains">
      <path d="M604 402 Q650 420 660 464 L652 905 Q630 870 612 900Z" fill={fabric} />
      <path d="M976 402 Q930 420 920 464 L928 905 Q950 870 968 900Z" fill={fabric} />
      <path
        d="M624 434 Q641 462 636 855 M646 448 Q655 485 645 882"
        fill="none"
        stroke={fold}
        strokeWidth={7}
      />
      <path
        d="M956 434 Q939 462 944 855 M934 448 Q925 485 935 882"
        fill="none"
        stroke={fold}
        strokeWidth={7}
      />
      <path d="M596 404 Q790 374 984 404" fill="none" stroke="#8e737f" strokeWidth={13} />
    </g>
  );
};
const WallFrames = () => (
  <g data-prop="wall-frames">
    <rect x={455} y={468} width={134} height={186} rx={8} fill="#f5e5cf" />
    <rect x={468} y={481} width={108} height={160} rx={3} fill="#8e9aaa" />
    <path d="M480 617 Q510 550 535 595 T565 546 V638 H480Z" fill="#d8b8bb" stroke="none" />
    <circle cx={525} cy={517} r={17} fill="#ffe2a8" stroke="none" />
    <path
      d="M480 621 Q507 581 532 621 M538 621 Q556 589 569 621"
      fill="none"
      stroke="#fff0d8"
      strokeWidth={5}
    />
  </g>
);
const ArchAndWindow = ({
  dark,
  transparentWindow = false,
}: {
  dark: boolean;
  transparentWindow?: boolean;
}) => (
  <>
    <path d="M75 1240 V610 Q250 360 425 610 V1240" fill="#A69AB2" />
    <path d="M105 1240 V630 Q250 420 395 630 V1240" fill={dark ? '#424668' : '#F7E8D4'} />
    <rect
      x={630}
      y={420}
      width={320}
      height={490}
      rx={80}
      fill={dark ? '#424668' : '#BBDDE3'}
      opacity={transparentWindow ? 0.2 : 1}
    />
    <path d="M790 425 V910 M630 665 H950" stroke="#FFF3D9" strokeWidth={15} />
    <circle cx={855} cy={530} r={42} fill="#FFF3B0" />
    <Curtains dark={dark} />
    <WallFrames />
  </>
);
const Kitchen = () => (
  <>
    <rect x={120} y={905} width={840} height={110} rx={8} fill="#e3e6d8" />
    {Array.from({length: 9}, (_, i) => (
      <path key={`tile-v-${i}`} d={`M${160 + i * 90} 910 V1008`} stroke="#ccd8cf" strokeWidth={4} />
    ))}
    {[930, 975].map((y) => (
      <path key={y} d={`M130 ${y} H950`} stroke="#d3ddd2" strokeWidth={4} />
    ))}
    <rect x={120} y={1020} width={840} height={320} rx={18} fill="#A9C5B5" />
    <path d="M100 1015 H980" stroke="#4A3B3B" strokeWidth={38} />
    <path d="M100 1007 H980" stroke="#FFF3D9" strokeWidth={22} />
    {[150, 410, 670].map((x) => (
      <g key={x}>
        <rect x={x} y={1070} width={220} height={230} rx={12} fill="#C8DDC5" />
        <rect
          x={x + 12}
          y={1082}
          width={196}
          height={205}
          rx={9}
          fill="none"
          stroke="#a3bba8"
          strokeWidth={5}
        />
        <path d={`M${x + 110} 1080 V1290`} stroke="#a3bba8" strokeWidth={4} />
        <rect x={x + 92} y={1162} width={10} height={56} rx={5} fill="#8e9b94" stroke="none" />
        <rect x={x + 118} y={1162} width={10} height={56} rx={5} fill="#8e9b94" stroke="none" />
      </g>
    ))}
    <path d="M650 1012 Q735 988 822 1012" fill="#dbe4dc" stroke="#6d7686" strokeWidth={9} />
    <path d="M810 1000 V930 Q810 885 755 930" fill="none" strokeWidth={12} />
    <rect x={150} y={600} width={300} height={280} rx={12} fill="#A9C5B5" />
    <rect
      x={165}
      y={615}
      width={270}
      height={248}
      rx={8}
      fill="none"
      stroke="#d8e6d9"
      strokeWidth={6}
    />
    {[245, 380].map((x) => (
      <path key={x} d={`M${x} 630 V850`} stroke="#d8e6d9" strokeWidth={7} />
    ))}
    <path d="M150 880 H450" stroke="#4A3B3B" strokeWidth={18} />
    <rect x={230} y={875} width={140} height={13} rx={7} fill="#879f91" />
    <rect x={560} y={955} width={62} height={38} rx={8} fill="#77868a" />
    <path
      d="M575 956 V934 Q575 920 590 920 Q605 920 605 934 V956"
      fill="none"
      stroke="#77868a"
      strokeWidth={7}
    />
  </>
);
const DiningRoom = () => (
  <>
    <ellipse cx={540} cy={1240} rx={400} ry={125} fill="#B49286" />
    <path d="M270 1310 V1460 M810 1310 V1460" strokeWidth={25} />
    {[290, 540, 790].map((x) => (
      <ellipse key={x} cx={x} cy={1220} rx={60} ry={30} fill="#FFF3D9" />
    ))}
  </>
);
const DrawingRoom = () => (
  <>
    <ellipse cx={540} cy={1480} rx={420} ry={92} fill="#D3BFD5" />
    <ellipse cx={540} cy={1480} rx={365} ry={65} fill="none" stroke="#b9a7c4" strokeWidth={6} />
    <path
      d="M250 1480 Q540 1370 830 1480 M330 1510 Q540 1435 750 1510"
      fill="none"
      stroke="#b9a7c4"
      strokeWidth={5}
    />
    <rect x={758} y={1280} width={188} height={22} rx={8} fill="#8f7d82" />
    <rect x={770} y={1302} width={164} height={126} rx={10} fill="#ad9193" />
    <rect x={784} y={1320} width={136} height={77} rx={8} fill="#c8a9a5" />
    <circle cx={852} cy={1358} r={6} fill="#fff0d8" stroke="none" />
    <path d="M790 1428 V1470 M914 1428 V1470" strokeWidth={13} />
  </>
);
export type InteriorTextureNodes = {
  far: ReactNode;
  wall: ReactNode;
  props: ReactNode;
  near: ReactNode;
  mid: ReactNode;
};

/** Return the original authored SVG room as separate wall, furnishing and floor layers. */
export const houseInteriorTextureNodes = ({
  w,
  h,
  time,
  options = {},
  view,
  t = 0,
}: Parameters<BackgroundBuilder>[0]): InteriorTextureNodes => {
  const variant = options.variant ?? 'drawing';
  const dark = time === 'night' || time === 'moonlight';
  const overhead = view === 'topDown' || variant === 'staircase';
  const layout = setLayout(w, h);
  const floor = dark ? '#b0a2b4' : '#DEBFA6';
  const wall = dark ? '#91889E' : '#E9D2CA';
  const transform = `translate(${layout.x} 0) scale(${layout.scale})`;
  const wallArt = overhead ? null : (
    <g transform={transform} stroke="#4A3B3B" strokeWidth={5} strokeLinejoin="round">
      {Array.from({length: Math.ceil(layout.span / 180)}, (_, i) => (
        <path
          key={i}
          d={`M${layout.left + i * 180} 0 V1265`}
          stroke={dark ? '#69617E' : '#DEC1BC'}
          strokeWidth={3}
        />
      ))}
      <ArchAndWindow dark={dark} transparentWindow={options.transparentWindow} />
    </g>
  );
  const propArt = (
    <g transform={transform} stroke="#4A3B3B" strokeWidth={5} strokeLinejoin="round">
      {overhead ? (
        <Staircase t={t} left={layout.left} span={layout.span} />
      ) : variant === 'kitchen' ? (
        <Kitchen />
      ) : variant === 'dining' ? (
        <DiningRoom />
      ) : (
        <>
          <DrawingRoom />
          <g transform="translate(245 0)">
            <Sofa width={w} height={h} night={dark} />
          </g>
        </>
      )}
    </g>
  );
  const floorArt = (
    <>
      <rect x={0} y={0} width={w} height={h} fill={floor} />
      {Array.from({length: 20}, (_, i) => (
        <path
          key={i}
          d={`M0 ${(i * h) / 18} H${w}`}
          stroke={dark ? '#716A81' : '#CDAE98'}
          strokeWidth={3}
        />
      ))}
      {!overhead && <rect x={0} y={0} width={w} height={h * 0.66} fill={wall} />}
    </>
  );
  const moonBeam = (
    <>
      {time === 'moonlight' && (
        <path
          d={
            overhead
              ? `M${w * 0.95} ${h * 0.2} L${w * 0.22} ${h * 0.7} L${w * 0.8} ${h * 0.8}Z`
              : `M${w * 0.75} ${h * 0.3} L${w * 0.2} ${h * 0.85} H${w}Z`
          }
          fill="#D6E5FF"
          opacity={variant === 'window' ? 0.08 : 0.2}
        />
      )}
    </>
  );
  return {
    far: floorArt,
    wall: wallArt,
    props: propArt,
    near: moonBeam,
    mid: (
      <>
        {wallArt}
        {propArt}
      </>
    ),
  };
};

/** One shell and shared furnishings; only the staircase keeps authored overhead geometry. */
export const houseInterior: BackgroundBuilder = (context) => {
  const nodes = houseInteriorTextureNodes(context);
  return {far: nodes.far, mid: nodes.mid, near: nodes.near};
};
