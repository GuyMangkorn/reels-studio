import type {BackgroundBuilder} from '../Background';
import {uniformStageTransform} from '../../layout/uniformStage';
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
const STAIR_COUNT = 12;
/** Spiral treads seen from above. Later steps are nearer: lower, wider, and shifted left. */
export const staircaseSteps = Array.from({length: STAIR_COUNT}, (_, i) => {
  const t = i / (STAIR_COUNT - 1);
  const ang = -Math.PI * 0.72 + t * Math.PI * 1.85;
  const rad = 140 + t * 320;
  const cx = 520 + Math.cos(ang) * rad * 0.78;
  const width = 70 + i * 15;
  return {
    x: cx - width / 2,
    y: 340 + i * 86,
    width,
    height: 28 + i * 5,
    angle: (ang * 180) / Math.PI,
  };
});
const treadColor = (u: number) => {
  const v = Math.round(52 + u * 96);
  return `rgb(${v + 12},${v - 4},${v + 8})`;
};
/** Plan view of one flight. Treads share edges and run to the side walls, so the frame has no empty panel. */
const Stairwell = ({w, h}: {w: number; h: number}) => {
  const count = 14;
  const margin = Math.min(w, h) * 0.035;
  const top = h * 0.02;
  const bottom = h * 0.98;
  const treadH = (bottom - top) / count;
  const rail = Math.max(4, Math.min(w, h) * 0.006);
  const footprints: {x: number; y: number; rx: number; ry: number; opacity: number}[] = [];
  return (
    <g data-stairwell="top-down">
      <rect width={w} height={h} fill="#2A2436" />
      {Array.from({length: 24}, (_, i) => (
        <path
          key={`course-${i}`}
          d={`M0 ${((i + 1) * h) / 25} H${w}`}
          stroke="#3A3348"
          strokeWidth={2}
        />
      ))}
      {Array.from({length: count}, (_, i) => {
        const u = i / (count - 1);
        const inset = (1 - u) * w * 0.045;
        const x = margin + inset;
        const tw = w - margin * 2 - inset * 2;
        const y = top + i * treadH;
        const side = i % 2 === 0 ? 0.36 : 0.64;
        footprints.push({
          x: x + tw * side,
          y: y + treadH * 0.64,
          rx: tw * (0.028 + u * 0.018),
          ry: Math.max(3.5, treadH * 0.16),
          opacity: 0.3 + u * 0.32,
        });
        return (
          <g key={i}>
            <rect x={x} y={y} width={tw} height={treadH + 0.8} fill={treadColor(u)} />
            <rect
              x={x}
              y={y}
              width={tw}
              height={Math.max(4, treadH * 0.2)}
              fill="#120E1A"
              opacity={0.28 + (1 - u) * 0.28}
            />
            <path
              d={`M${x} ${y + treadH - 1.2} H${x + tw}`}
              stroke="#F4E7D6"
              strokeWidth={Math.max(1.4, treadH * 0.05)}
              opacity={0.42}
            />
          </g>
        );
      })}
      <path
        d={`M${margin} ${top} V${bottom} M${w - margin} ${top} V${bottom}`}
        fill="none"
        stroke="#D9C6B2"
        strokeWidth={rail}
      />
      <g data-footstep-track="stairwell">
        {footprints.map((step, i) => (
          <ellipse
            key={i}
            data-footstep
            cx={step.x}
            cy={step.y}
            rx={step.rx}
            ry={step.ry}
            fill="#100C16"
            opacity={step.opacity}
          />
        ))}
      </g>
    </g>
  );
};
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
    {/* Counter sits below the arch. The wall cabinet is under the window, clear of the doorway. */}
    <rect x={150} y={1292} width={780} height={200} rx={16} fill="#A9C5B5" />
    <path d="M130 1288 H960" stroke="#FFF3D9" strokeWidth={26} />
    {[180, 420, 660].map((x) => (
      <rect key={x} x={x} y={1340} width={200} height={130} rx={10} fill="#C8DDC5" />
    ))}
    <ellipse cx={700} cy={1288} rx={90} ry={16} fill="#6D7686" />
    <path d="M770 1274 V1216 Q770 1176 722 1216" fill="none" strokeWidth={12} />
    <rect x={640} y={968} width={250} height={190} rx={12} fill="#A9C5B5" />
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
        {overhead ? (
          <rect width={w} height={h} fill="#3C384C" />
        ) : (
          <rect width={w} height={h * 0.66} fill={wall} />
        )}
      </>
    ),
    mid: overhead ? (
      <Stairwell w={w} h={h} />
    ) : (
      <g
        data-uniform-scale="interior"
        transform={uniformStageTransform(w, h)}
        stroke="#4A3B3B"
        strokeWidth={5}
        strokeLinejoin="round"
      >
        <ArchAndWindow dark={dark} />
        {variant === 'kitchen' ? (
          <Kitchen />
        ) : variant === 'dining' ? (
          <DiningRoom />
        ) : (
          <DrawingRoom />
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
