import type {BackgroundBuilder} from '../Background';
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
const ArchAndWindow = ({dark}: {dark: boolean}) => (
  <>
    <path d="M75 1240 V610 Q250 360 425 610 V1240" fill="#A69AB2" />
    <path d="M105 1240 V630 Q250 420 395 630 V1240" fill={dark ? '#424668' : '#F7E8D4'} />
    <rect x={630} y={420} width={320} height={490} rx={80} fill={dark ? '#424668' : '#BBDDE3'} />
    <path d="M790 425 V910 M630 665 H950" stroke="#FFF3D9" strokeWidth={15} />
    <circle cx={855} cy={530} r={42} fill="#FFF3B0" />
  </>
);
const Kitchen = () => (
  <>
    <rect x={120} y={1020} width={840} height={320} rx={18} fill="#A9C5B5" />
    <path d="M100 1015 H980" stroke="#FFF3D9" strokeWidth={28} />
    {[150, 410, 670].map((x) => (
      <rect key={x} x={x} y={1070} width={220} height={230} rx={12} fill="#C8DDC5" />
    ))}
    <ellipse cx={730} cy={1015} rx={110} ry={20} fill="#6D7686" />
    <path d="M810 1000 V930 Q810 885 755 930" fill="none" strokeWidth={12} />
    <rect x={150} y={600} width={300} height={280} rx={12} fill="#A9C5B5" />
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
    <rect x={260} y={1120} width={560} height={235} rx={60} fill="#C39CAC" />
    <rect x={310} y={1190} width={460} height={130} rx={30} fill="#E3B4BC" />
    <path d="M300 1355 V1430 M780 1355 V1430" strokeWidth={20} />
    <ellipse cx={540} cy={1470} rx={420} ry={90} fill="#D3BFD5" />
  </>
);
/** One shell and shared furnishings; only the staircase keeps authored overhead geometry. */
export const houseInterior: BackgroundBuilder = ({w, h, time, options, view, t}) => {
  const variant = options.variant ?? 'drawing';
  const dark = time === 'night' || time === 'moonlight';
  const overhead = view === 'topDown' || variant === 'staircase';
  const layout = setLayout(w, h);
  const floor = dark ? '#80758D' : '#DEBFA6';
  const wall = dark ? '#5C5775' : '#E9D2CA';
  return {
    far: (
      <>
        <rect width={w} height={h} fill={floor} />
        {Array.from({length: 20}, (_, i) => (
          <path
            key={i}
            d={`M0 ${(i * h) / 18} H${w}`}
            stroke={dark ? '#716A81' : '#CDAE98'}
            strokeWidth={3}
          />
        ))}
        {!overhead && <rect width={w} height={h * 0.66} fill={wall} />}
      </>
    ),
    mid: (
      <g
        transform={`translate(${layout.x} 0) scale(${layout.scale})`}
        stroke="#4A3B3B"
        strokeWidth={5}
        strokeLinejoin="round"
      >
        {overhead ? (
          <Staircase t={t} left={layout.left} span={layout.span} />
        ) : (
          <>
            {Array.from({length: Math.ceil(layout.span / 180)}, (_, i) => (
              <path
                key={i}
                d={`M${layout.left + i * 180} 0 V1265`}
                stroke={dark ? '#69617E' : '#DEC1BC'}
                strokeWidth={3}
              />
            ))}
            <ArchAndWindow dark={dark} />
            {variant === 'kitchen' ? (
              <Kitchen />
            ) : variant === 'dining' ? (
              <DiningRoom />
            ) : (
              <DrawingRoom />
            )}
          </>
        )}
      </g>
    ),
    near: (
      <>
        {time === 'moonlight' && (
          <path
            d={
              overhead
                ? `M${w * 0.95} ${h * 0.2} L${w * 0.22} ${h * 0.7} L${w * 0.8} ${h * 0.8}Z`
                : `M${w * 0.75} ${h * 0.3} L${w * 0.2} ${h * 0.85} H${w}Z`
            }
            fill="#D6E5FF"
            opacity={0.2}
          />
        )}
      </>
    ),
  };
};
