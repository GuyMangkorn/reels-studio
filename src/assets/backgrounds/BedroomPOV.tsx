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
    scale: (height / 1920) * (actor.scale ?? 1) * 0.82,
  };
}

// Bed and window use uniform authored units; the shell extends into the wider viewport.
const BackWall = ({left, span}: {left: number; span: number}) => (
  <>
    <rect x={left - 100} y={-100} width={span + 200} height={2120} fill="#91889E" />
    <path d={`M${left - 100} 960 h${span + 200} V2020 H${left - 100}Z`} fill="#b0a2b4" />
    <path
      d={`M${left - 100} 960 h${span + 200} M${left - 100} 990 h${span + 200}`}
      stroke="#c9bac8"
      strokeWidth={12}
    />
    {Array.from({length: Math.ceil(span / 190) + 1}, (_, i) => left + i * 190).map((x) => (
      <path key={x} d={`M${x} 0 V950`} stroke="#aaa0b4" strokeWidth={3} />
    ))}
    <rect x={660} y={250} width={265} height={520} rx={90} fill="#596681" />
    <circle cx={810} cy={390} r={55} fill="#FFF3B0" />
    <path d="M790 250 V770 M660 510 H925" stroke="#DAD8E6" strokeWidth={12} />
    <path d="M660 770 L175 1610 H1080 L925 770Z" fill="#CEDCF4" opacity={0.11} stroke="none" />
    <path d="M80 960 V460 Q210 290 340 460 V960" fill="#68627a" />
  </>
);
const BedEnd = () => (
  <>
    <path d="M335 1040 L745 1040 L1100 2050 H-20Z" fill="#F5E5CF" />
    <path d="M335 1044 L300 1058 L-20 1960 L48 1983 L390 1064Z" fill="#b99fa9" />
    <path d="M745 1044 L780 1058 L1100 1960 L1032 1983 L690 1064Z" fill="#b99fa9" />
    <path
      d="M326 1062 L52 1940 M754 1062 L1048 1940"
      fill="none"
      stroke="#e3cfd1"
      strokeWidth={12}
    />
    <rect x={305} y={960} width={470} height={100} rx={25} fill="#927A89" />
    <path
      d="M325 978 Q540 997 755 978 M328 1035 H752"
      fill="none"
      stroke="#ab94a2"
      strokeWidth={8}
    />
    <path d="M330 995 H750 M340 1050 V1140 M740 1050 V1140" stroke="#BFA8AE" strokeWidth={14} />
    <path d="M450 1046 Q540 1017 630 1046" fill="none" stroke="#fff0dc" strokeWidth={9} />
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

/** The existing POV illustration split into independently placeable texture layers. */
export function bedroomPovTextureNodes(width: number, height: number) {
  const layout = setLayout(width, height);
  const shared = {left: layout.left, span: layout.span};
  const stageViewBox = `0 0 ${width} ${height}`;
  return {
    wall: (
      <g stroke="#4A3B3B" strokeWidth={5} strokeLinejoin="round">
        <BackWall {...shared} />
      </g>
    ),
    bed: (
      <g stroke="#4A3B3B" strokeWidth={5} strokeLinejoin="round">
        <g transform={`translate(${layout.x} 0) scale(${layout.scale})`}>
          <BedEnd />
        </g>
      </g>
    ),
    blanket: (
      <g transform={`translate(${layout.x} 0) scale(${layout.scale})`}>
        <Duvet />
      </g>
    ),
    rails: (
      <g transform={`translate(${layout.x} 0) scale(${layout.scale})`}>
        <path
          d="M326 1060 L42 1950 M754 1060 L1058 1950"
          fill="none"
          stroke="#6f626f"
          strokeWidth={25}
        />
        <path
          d="M326 1054 L42 1938 M754 1054 L1058 1938"
          fill="none"
          stroke="#d3bcc4"
          strokeWidth={9}
        />
        <path
          d="M198 1450 L115 1710 M886 1450 L980 1710"
          fill="none"
          stroke="#b69eaa"
          strokeWidth={9}
        />
      </g>
    ),
    viewBox: `${layout.left} 0 ${layout.span} 1920`,
    stageViewBox,
  };
}

const Layer = ({
  width,
  height,
  y,
  children,
  name,
  viewBox,
}: {
  width: number;
  height: number;
  y: number;
  children: ReactNode;
  name: string;
  viewBox?: string;
}) => (
  <svg
    data-depth={name}
    width={width}
    height={height}
    viewBox={viewBox ?? `${setLayout(width, height).left} 0 ${setLayout(width, height).span} 1920`}
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
  const layout = setLayout(width, height);
  const stageViewBox = `0 0 ${width} ${height}`;
  return (
    <div
      aria-label="Bedroom from the pillow toward the foot of the bed"
      style={{position: 'absolute', inset: 0, overflow: 'hidden'}}
    >
      <Layer width={width} height={height} y={state.wallY} name="back-wall">
        <BackWall left={setLayout(width, height).left} span={setLayout(width, height).span} />
      </Layer>
      <Layer width={width} height={height} y={state.bedY} name="bed-end" viewBox={stageViewBox}>
        <g transform={`translate(${layout.x} 0) scale(${layout.scale})`}>
          <BedEnd />
        </g>
      </Layer>
      <div data-depth="figures" style={{position: 'absolute', inset: 0}}>
        {children}
      </div>
      <Layer width={width} height={height} y={state.blanketY} name="blanket" viewBox={stageViewBox}>
        <g transform={`translate(${layout.x} 0) scale(${layout.scale})`}>
          <g
            data-blanket-motion="toward-foot"
            transform={`translate(0 ${state.pull * 220}) translate(540 1040) scale(${1 - state.pull * 0.12}) translate(-540 -1040)`}
          >
            <Duvet />
          </g>
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
