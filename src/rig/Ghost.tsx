export const ghostVariants = ['womanBlack', 'seatedPair', 'crawler'] as const;
export type GhostVariant = (typeof ghostVariants)[number];
const SilhouettePerson = ({offset = 0, seated = false}: {offset?: number; seated?: boolean}) => (
  <g transform={`translate(${offset} 0)`}>
    <ellipse cy={-205} rx={28} ry={36} />
    <path
      d={
        seated
          ? 'M-26-174 Q0-190 26-174 L37-80 H65 V-30 H32 L14-84 H-31Z'
          : 'M-26-174 Q0-190 26-174 L70-8 Q0 7-70-8Z'
      }
    />
    <path d="M-22-156 L-49-87 M22-156 L49-87" strokeWidth={18} strokeLinecap="round" />
  </g>
);
const CrawlerLimb = ({x, y, side, phase}: {x: number; y: number; side: -1 | 1; phase: number}) => {
  const upper = side * (18 + Math.sin(phase) * 18);
  const lower = side * (-34 + Math.sin(phase + 0.9) * 24);
  return (
    <g data-crawler-joint transform={`translate(${x} ${y}) rotate(${upper})`}>
      <path d="M0 0 L0 42" fill="none" strokeWidth={15} strokeLinecap="round" />
      <circle data-crawler-joint cx={0} cy={42} r={7} fill="#A894CC" stroke="none" />
      <g transform={`translate(0 42) rotate(${lower})`}>
        <path d="M0 0 L0 44" fill="none" strokeWidth={12} strokeLinecap="round" />
        <circle data-crawler-joint cx={0} cy={44} r={6} fill="#8C71AD" stroke="none" />
        <path
          d={`M0 44 L${side * 17} 53 M0 44 L${side * 7} 59`}
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
    {x: -52, y: -59, side: -1 as const, phase: gait},
    {x: -24, y: -45, side: 1 as const, phase: gait + 1.8},
    {x: 14, y: -47, side: -1 as const, phase: gait + 3.1},
    {x: 43, y: -38, side: 1 as const, phase: gait + 4.6},
  ];
  return (
    <g data-crawler="articulated" transform={`translate(0 ${drift}) scale(-1 1)`}>
      {limbs.map((limb, i) => (
        <CrawlerLimb key={i} {...limb} />
      ))}
      <ellipse cx={0} cy={-17} rx={86} ry={13} fill="#241D31" opacity={0.28} stroke="none" />
      <path d="M-78-69 Q-45-119 17-102 Q60-89 77-53 Q42-24-11-28 Q-56-28-78-69Z" fill="#C8B5E1" />
      <path
        d="M-66-65 Q-27-89 38-70 M-49-49 Q-13-69 43-54"
        fill="none"
        stroke="#9C83BD"
        strokeWidth={7}
        strokeLinecap="round"
      />
      <g data-crawler-face="nightmare" transform="rotate(-12 -91 -94)">
        <path
          d="M-119-117 Q-94-143-70-120 Q-56-97-69-75 Q-91-52-113-70 Q-126-94-119-117Z"
          fill="#D8C8EB"
        />
        <path
          d="M-111-104 Q-102-111-94-104 M-88-102 Q-80-109-72-101"
          fill="none"
          stroke="#241D31"
          strokeWidth={5}
          strokeLinecap="round"
        />
        <circle cx={-101} cy={-105} r={2} fill="#FFF3B0" stroke="none" />
        <circle cx={-80} cy={-103} r={2} fill="#FFF3B0" stroke="none" />
        <path
          d="M-120-80 Q-94-39-63-76 Q-89-58-120-80Z"
          fill="#171223"
          stroke="#241D31"
          strokeWidth={3}
        />
        <path d="M-108-69 L-103-58 L-97-68 L-90-56 L-84-66 L-77-61" fill="#EADFF7" stroke="none" />
      </g>
      <path d="M-112-67 Q-98-53-82-58" fill="none" stroke="#8C71AD" strokeWidth={5} />
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
