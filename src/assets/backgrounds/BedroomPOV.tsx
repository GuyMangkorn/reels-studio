import type {ReactNode} from 'react';
import {setLayout} from './layout';
import {smoothstep} from '../../rig/poses';
import {impactAt, type ImpactConfig} from '../../camera/Camera';
import type {Actor} from '../../scenes/types';

export type BedroomPOVOptions = {blanketPull?: number | [number, number]; vignette?: boolean};

/** Explicit clock keeps breathing and blanket motion stable during out-of-order rendering. */
export function bedroomPOVAt(
  frame: number,
  fps: number,
  duration: number,
  blanketPull: BedroomPOVOptions['blanketPull'] = 0,
) {
  const endpoints = typeof blanketPull === 'number' ? [blanketPull, blanketPull] : blanketPull;
  const progress = smoothstep(frame / Math.max(1, duration - 1));
  const breath = Math.sin(((frame / fps) * Math.PI * 2) / 4.8);
  return {
    pull: endpoints[0] + (endpoints[1] - endpoints[0]) * progress,
    wallY: breath * 0.3,
    bedY: breath * 0.9,
    figuresY: breath * 1.5,
    blanketY: breath * 4,
  };
}

type Placement = {x: number; y: number; scale: number};
export function bedEndPlacement<T extends Placement>(
  base: T,
  actor: Actor,
  height: number,
  state: ReturnType<typeof bedroomPOVAt>,
): T {
  return {
    ...base,
    y: (actor.y ?? 0.55) * height + state.figuresY,
    scale: (height / 1920) * (actor.scale ?? 1) * 0.5,
  };
}

// Bed and window use uniform authored units; the shell extends into the wider viewport.
const BackWall = ({left, span}: {left: number; span: number}) => (
  <>
    <rect x={left - 100} y={-100} width={span + 200} height={2120} fill="#57536D" />
    <path d={`M${left - 100} 960 h${span + 200} V2020 H${left - 100}Z`} fill="#786A80" />
    <path
      d={`M${left - 100} 960 h${span + 200} M${left - 100} 990 h${span + 200}`}
      stroke="#A89AAE"
      strokeWidth={12}
    />
    {Array.from({length: Math.ceil(span / 190) + 1}, (_, i) => left + i * 190).map((x) => (
      <path key={x} d={`M${x} 0 V950`} stroke="#655F7A" strokeWidth={3} />
    ))}
    <rect x={660} y={250} width={265} height={520} rx={90} fill="#343951" />
    <circle cx={810} cy={390} r={55} fill="#FFF3B0" />
    <path d="M790 250 V770 M660 510 H925" stroke="#DAD8E6" strokeWidth={12} />
    <path d="M660 770 L175 1610 H1080 L925 770Z" fill="#CEDCF4" opacity={0.11} stroke="none" />
    <path d="M80 960 V460 Q210 290 340 460 V960" fill="#454157" />
  </>
);
const BedEnd = () => (
  <>
    <path d="M335 1040 L745 1040 L1100 2050 H-20Z" fill="#F5E5CF" />
    <rect x={305} y={960} width={470} height={100} rx={25} fill="#927A89" />
    <path d="M330 995 H750 M340 1050 V1140 M740 1050 V1140" stroke="#BFA8AE" strokeWidth={14} />
  </>
);
const Duvet = () => (
  <g data-duvet-edge="only">
    <path d="M345 1040 H735 L1100 1960 H-20Z" fill="#A8B9D0" />
    <path d="M345 1040 H735 L762 1110 H318Z" fill="#D1DAE8" />
    <path
      d="M300 1140 L85 1890 M780 1140 L995 1890 M540 1200 V1920"
      fill="none"
      stroke="#899DBB"
      strokeWidth={5}
    />
  </g>
);

const Layer = ({
  width,
  height,
  y,
  children,
  name,
}: {
  width: number;
  height: number;
  y: number;
  children: ReactNode;
  name: string;
}) => (
  <svg
    data-depth={name}
    width={width}
    height={height}
    viewBox={`${setLayout(width, height).left} 0 ${setLayout(width, height).span} 1920`}
    preserveAspectRatio="xMidYMid meet"
    style={{position: 'absolute', inset: 0, overflow: 'visible', transform: `translateY(${y}px)`}}
  >
    <g stroke="#4A3B3B" strokeWidth={5} strokeLinejoin="round">
      {children}
    </g>
  </svg>
);

/** The duvet deliberately renders after the bed-end actors, giving real foreground occlusion. */
export const BedroomPOV = ({
  width,
  height,
  frame,
  fps,
  duration,
  options = {},
  impact,
  children,
}: {
  width: number;
  height: number;
  frame: number;
  fps: number;
  duration: number;
  options?: BedroomPOVOptions;
  impact?: ImpactConfig;
  children?: ReactNode;
}) => {
  const state = bedroomPOVAt(frame, fps, duration, options.blanketPull);
  const impactState = impactAt(impact, frame, fps);
  return (
    <div
      aria-label="Bedroom from the pillow toward the foot of the bed"
      style={{position: 'absolute', inset: 0, overflow: 'hidden'}}
    >
      <Layer width={width} height={height} y={state.wallY} name="back-wall">
        <BackWall left={setLayout(width, height).left} span={setLayout(width, height).span} />
      </Layer>
      <Layer width={width} height={height} y={state.bedY} name="bed-end">
        <BedEnd />
      </Layer>
      <div data-depth="figures" style={{position: 'absolute', inset: 0}}>
        {children}
      </div>
      <Layer width={width} height={height} y={state.blanketY} name="blanket">
        <g
          data-blanket-motion="toward-foot"
          transform={`translate(0 ${state.pull * 160}) translate(540 1040) scale(${1 - state.pull * 0.09}) translate(-540 -1040)`}
        >
          <Duvet />
        </g>
      </Layer>
      {impactState.flicker > 0 && (
        <div
          data-impact-flicker
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            mixBlendMode: 'multiply',
            background:
              'radial-gradient(ellipse at 52% 56%, rgba(30,24,54,0.08), rgba(30,24,54,0.7) 100%)',
            opacity: impactState.flicker,
          }}
        />
      )}
      {options.vignette !== false && (
        <div
          data-vignette
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse at 50% 48%, transparent 35%, rgba(28,24,44,0.48) 100%)',
          }}
        />
      )}
    </div>
  );
};
