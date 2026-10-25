import type {BackgroundBuilder} from '../Background';
export const interiorVariants = [
  'drawing',
  'dining',
  'staircase',
  'kitchen',
  'bedroomPOV',
] as const;
export type InteriorVariant = (typeof interiorVariants)[number];
export type BackgroundOptions = {
  variant?: InteriorVariant;
  windowLights?: boolean;
  blanketPull?: number | [number, number];
  vignette?: boolean;
};
const Staircase = () => (
  <>
    <rect x={250} y={390} width={580} height={920} fill="#524C61" />
    {staircaseSteps.map((step, i) => (
      <rect key={i} {...step} fill={i % 2 ? '#BC9F9A' : '#D2B8A8'} />
    ))}
    <path d="M280 410 V1320 M810 410 V1320" stroke="#FFF3B0" strokeWidth={14} />
  </>
);
export const staircaseSteps = Array.from({length: 12}, (_, i) => ({
  x: 399 - i * 9,
  y: 420 + i * 66,
  width: 282 + i * 18,
  height: 64,
}));
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
export const houseInterior: BackgroundBuilder = ({w, h, time, options, view}) => {
  const variant = options.variant ?? 'drawing';
  const dark = time === 'night' || time === 'moonlight';
  const overhead = view === 'topDown' || variant === 'staircase';
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
        transform={`scale(${w / 1080} ${h / 1920})`}
        stroke="#4A3B3B"
        strokeWidth={5}
        strokeLinejoin="round"
      >
        {overhead ? (
          <>
            <rect
              x={42}
              y={250}
              width={996}
              height={1220}
              rx={20}
              fill="none"
              stroke={wall}
              strokeWidth={50}
            />
            <Staircase />
          </>
        ) : (
          <>
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
