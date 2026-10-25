export const ghostVariants = ['womanBlack', 'seatedPair', 'crawler'] as const;
export type GhostVariant = (typeof ghostVariants)[number];
/** Opaque overlapping parts. Transparency was letting the bed rail slice the legs off. */
const SeatedFigure = ({tilt = -4, fill}: {tilt?: number; fill: string}) => (
  <g transform={`rotate(${tilt})`} fill={fill} stroke="none">
    <path d="M-36-16 C-62 0 -66 52 -46 96 C-34 122 -4 118 6 88 L14 24 C12-4 -12-24 -36-16 Z" />
    <path d="M-4-12 C14-24 52-4 60 42 C68 86 38 118 14 104 L-2 30 C-8 2 -14-4 -4-12 Z" />
    <path d="M-42-108 C-60-86 -58-36 -44 0 C-34 22 0 28 16 12 C36-4 48-40 40-82 C32-116 8-132 -10-124 C-24-118 -32-112 -42-108 Z" />
    <ellipse cx={-4} cy={-136} rx={30} ry={34} />
  </g>
);
/** Narrow gown, arms inside the silhouette and hanging, head tilted. Not a raised cheer. */
const WomanBlack = () => (
  <g transform="rotate(-8)">
    <path d="M-12-234 C-32-234 -40-212 -34-194 C-44-184 -22-170 -6-172 L-4-154 C-20-152 -24-136 -20-70 L-16 6 C-14 18 16 18 18 6 L22-70 C26-136 22-152 6-154 L8-172 C24-170 42-184 36-196 C44-216 32-234 12-234 C4-216 -2-216 -12-234 Z" />
  </g>
);
const CrawlerLimb = ({x, y, side, phase}: {x: number; y: number; side: -1 | 1; phase: number}) => {
  const upper = side * (36 + Math.sin(phase) * 7);
  const lower = -78 + Math.sin(phase + 0.8) * 10;
  const upperLen = 118;
  const lowerLen = 132;
  return (
    <g data-crawler-joint transform={`translate(${x} ${y}) rotate(${upper})`}>
      <path d={`M0 0 L0 ${upperLen}`} fill="none" strokeWidth={2.6} strokeLinecap="round" />
      <circle data-crawler-joint cx={0} cy={upperLen} r={2.2} fill="#140E1C" stroke="none" />
      <g transform={`translate(0 ${upperLen}) rotate(${lower})`}>
        <path d={`M0 0 L0 ${lowerLen}`} fill="none" strokeWidth={1.7} strokeLinecap="round" />
        <circle data-crawler-joint cx={0} cy={lowerLen} r={1.6} fill="#0C0A10" stroke="none" />
      </g>
    </g>
  );
};
const Crawler = ({frame, fps}: {frame: number; fps: number}) => {
  const gait = (frame / fps) * ((Math.PI * 2) / 0.9);
  const drift = Math.sin(gait * 0.5) * 2;
  const hunch = Math.sin(gait * 0.5) * 3;
  const limbs = [
    {x: -48, y: -46, side: -1 as const, phase: gait},
    {x: -8, y: -28, side: 1 as const, phase: gait + 2.4},
    {x: 28, y: -52, side: -1 as const, phase: gait + 1.2},
    {x: 58, y: -22, side: 1 as const, phase: gait + 3.6},
  ];
  return (
    <g data-crawler="articulated" transform={`translate(0 ${drift - 30}) scale(-1 1)`}>
      {limbs.map((limb, i) => (
        <CrawlerLimb key={i} {...limb} />
      ))}
      <ellipse cx={6} cy={36} rx={70} ry={7} fill="#140E1C" opacity={0.4} stroke="none" />
      <g transform={`translate(0 ${hunch}) rotate(-28)`} fill="#CDBFE0">
        <path d="M-86 18 L-70-8 L-28-34 L8-18 L22 6 L4 16 L-24-2 L-58 8 Z" />
        <path d="M-62-4 H-18 M-54 6 H-8" fill="none" stroke="#5C4672" strokeWidth={2} />
        <g data-crawler-face="nightmare" transform="translate(18 -36)" stroke="none" fill="#D4C8E2">
          <path d="M2 18 C-8 6 -4-16 12-24 C28-30 40-12 34 8 C28 20 12 22 2 18 Z" stroke="none" />
          <ellipse cx={12} cy={-2} rx={8} ry={10} fill="#07060C" stroke="none" />
          <ellipse cx={26} cy={0} rx={7} ry={9} fill="#07060C" stroke="none" />
        </g>
      </g>
    </g>
  );
};
/** Bottom-center anchor, same normalized stage placement as other actors. */
export const Ghost = ({
  x,
  y,
  scale = 1,
  opacity = 0.55,
  variant = 'womanBlack',
  flip = false,
  frame = 0,
  fps = 30,
}: {
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  variant?: GhostVariant;
  flip?: boolean;
  frame?: number;
  fps?: number;
}) => {
  return (
    <svg
      aria-label={`Ghost ${variant}`}
      viewBox="-150 -260 300 280"
      width={300 * scale}
      height={280 * scale}
      style={{
        position: 'absolute',
        left: x - 150 * scale,
        top: y - 260 * scale,
        overflow: 'visible',
        opacity: variant === 'seatedPair' ? 1 : Math.max(0, Math.min(1, opacity)),
      }}
    >
      <g
        transform={`scale(${flip ? -1 : 1} 1)`}
        fill={variant === 'crawler' ? '#EADFF7' : '#332D42'}
        stroke={variant === 'crawler' ? '#6E537F' : '#332D42'}
        strokeWidth={4}
        strokeLinejoin="round"
      >
        {variant === 'crawler' ? (
          <Crawler frame={frame} fps={fps} />
        ) : variant === 'seatedPair' ? (
          <>
            <g transform="translate(-64 -22) scale(0.76)" style={{filter: 'blur(0.85px)'}}>
              <SeatedFigure tilt={-7} fill="#14111C" />
            </g>
            <g transform="translate(36 6)">
              <SeatedFigure tilt={5} fill="#241E32" />
            </g>
          </>
        ) : (
          <WomanBlack />
        )}
      </g>
    </svg>
  );
};
