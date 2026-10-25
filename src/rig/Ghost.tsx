export const ghostVariants = ['womanBlack', 'seatedPair', 'crawler'] as const;
export type GhostVariant = (typeof ghostVariants)[number];
/** Each seated figure is one closed contour, from head through bent knees and hanging calves. */
const SilhouettePerson = ({offset = 0, seated = false}: {offset?: number; seated?: boolean}) => (
  <g transform={`translate(${offset} 0)`}>
    {seated ? (
      <path
        data-connected-seated
        d="M-20-180 C-43-192-40-238-11-244 C19-250 35-220 20-194 L27-178 Q39-165 38-136 L38-92 Q77-98 85-68 L81-9 Q70 1 59-10 L57-58 L26-60 L20-9 Q7 1-2-9 L0-68 Q-26-72-28-98 L-32-145 L-39-91 Q-48-78-56-91 L-48-159 Q-42-177-20-180Z"
      />
    ) : (
      <g data-woman-pose="still-arms-down">
        <path d="M-21-181 Q-43-172-45-142 L-52-42 Q-47-28-38-42 L-29-118 L-23-68 L-64-6 Q-10 9 62-6 L26-78 L29-130 L38-44 Q47-29 51-44 L43-148 Q39-174 21-181Z" />
        <g transform="rotate(11 0 -198)">
          <path d="M-27-178 Q-43-211-27-238 Q-8-258 17-242 Q40-227 29-180 L18-163 L-22-163Z" />
          <path d="M-17-220 Q-6-237 13-222 L16-187 Q0-178-15-193Z" fill="#81768A" stroke="none" />
          <path d="M-28-230 Q-2-250 17-223 L4-179 L-18-174Z" />
        </g>
      </g>
    )}
  </g>
);
const CrawlerLimb = ({x, y, side, phase}: {x: number; y: number; side: -1 | 1; phase: number}) => {
  const upper = side * (18 + Math.sin(phase) * 18);
  const lower = side * (-34 + Math.sin(phase + 0.9) * 24);
  return (
    <g data-crawler-joint transform={`translate(${x} ${y}) rotate(${upper})`}>
      <path d="M0 0 L0 82" fill="none" strokeWidth={10} strokeLinecap="round" />
      <circle data-crawler-joint cx={0} cy={82} r={7} fill="#A894CC" stroke="none" />
      <g transform={`translate(0 82) rotate(${lower})`}>
        <path d="M0 0 L0 88" fill="none" strokeWidth={8} strokeLinecap="round" />
        <circle data-crawler-joint cx={0} cy={88} r={6} fill="#8C71AD" stroke="none" />
        <path
          d={`M0 88 L${side * 24} 100 M0 88 L${side * 10} 112 M0 88 L${side * 32} 92`}
          fill="none"
          strokeWidth={5}
          strokeLinecap="round"
        />
      </g>
    </g>
  );
};
const Crawler = ({frame, fps}: {frame: number; fps: number}) => {
  const gait = (frame / fps) * ((Math.PI * 2) / 0.9);
  const drift = Math.sin(gait * 0.5) * 2;
  const limbs = [
    {x: -77, y: -137, side: -1 as const, phase: gait},
    {x: -61, y: -130, side: 1 as const, phase: gait + 1.8},
    {x: 60, y: -101, side: -1 as const, phase: gait + 3.1},
    {x: 73, y: -93, side: 1 as const, phase: gait + 4.6},
  ];
  return (
    <g data-crawler="articulated" transform={`translate(0 ${drift}) scale(-1 1)`}>
      <ellipse cy={51} rx={140} ry={12} fill="#241D31" opacity={0.28} stroke="none" />
      {limbs.map((limb, i) => (
        <CrawlerLimb key={i} {...limb} />
      ))}
      <path
        d="M-91-144 L-59-168 Q-10-184 38-133 L86-100 L65-75 Q22-97-10-110 L-66-112Z"
        fill="#B3A1C9"
      />
      <path
        d="M-67-148 Q-14-164 54-108 M-38-145 L-35-122 M-15-140 L-13-115 M8-130 L12-106"
        fill="none"
        stroke="#745C90"
        strokeWidth={5}
      />
      <path d="M-80-135 L-104-117 L-116-83" fill="none" stroke="#D8C8EB" strokeWidth={16} />
      <g data-crawler-face="nightmare" transform="rotate(24 -119 -84)">
        <path
          d="M-137-117 L-109-121 L-96-102 L-101-62 L-119-42 L-139-63 L-146-97Z"
          fill="#DFD4E9"
        />
        <path
          d="M-142-106 L-130-121 L-109-121 L-99-104 L-118-93 L-126-65 L-142-53Z"
          fill="#42334F"
        />
        <path
          d="M-112-95 L-102-98 M-116-76 L-110-53"
          stroke="#251D31"
          strokeWidth={4}
          fill="none"
        />
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
        opacity: Math.max(0, Math.min(1, opacity)),
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
            <SilhouettePerson offset={-66} seated />
            <SilhouettePerson offset={44} seated />
          </>
        ) : (
          <SilhouettePerson />
        )}
      </g>
    </svg>
  );
};
