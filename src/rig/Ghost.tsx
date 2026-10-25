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
const Crawler = () => (
  <>
    <ellipse cx={-85} cy={-54} rx={30} ry={32} />
    <path d="M-62-67 Q-10-127 42-66 L75-40 L105-12 H67 L28-44 L-4-46 L-38-15 H-66 L-39-54Z" />
    <path d="M-82-73 Q-122-74-115-19 L-64-31Z" fill="#A894CC" />
  </>
);
/** Bottom-center anchor, same normalized stage placement as other actors. */
export const Ghost = ({
  x,
  y,
  scale = 1,
  opacity = 0.55,
  variant = 'womanBlack',
  flip = false,
}: {
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  variant?: GhostVariant;
  flip?: boolean;
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
        stroke={variant === 'crawler' ? '#A894CC' : '#332D42'}
        strokeWidth={4}
        strokeLinejoin="round"
      >
        {variant === 'crawler' ? (
          <>
            <Crawler />
          </>
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
