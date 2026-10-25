import {BedroomPOV} from './backgrounds/BedroomPOV';
import {oldHouseExterior} from './backgrounds/OldHouseExterior';
import {houseInterior, type BackgroundOptions} from './backgrounds/HouseInterior';
import {basement} from './backgrounds/Basement';
import type {ReactNode} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Sofa} from './props/Sofa';
import {Tree, House} from './Props';
export type BackgroundName =
  | 'forest'
  | 'city'
  | 'room'
  | 'sea'
  | 'nightSky'
  | 'oldHouseExterior'
  | 'houseInterior'
  | 'basement';
export type TimeOfDay = 'day' | 'dusk' | 'night' | 'moonlight';
type Palette = {sky: string; far: string; mid: string; near: string; accent: string};
const palettes: Record<TimeOfDay, Palette> = {
  day: {sky: '#f6e8d5', far: '#d8e0c2', mid: '#a9d0b8', near: '#83b69e', accent: '#ffce89'},
  dusk: {sky: '#B5A1C5', far: '#A99CB2', mid: '#8185ad', near: '#66667F', accent: '#FFD166'},
  moonlight: {sky: '#424668', far: '#686b92', mid: '#8185ad', near: '#555e83', accent: '#D6E5FF'},
  night: {sky: '#424668', far: '#686b92', mid: '#8185ad', near: '#555e83', accent: '#ffe0a8'},
};
type Context = {
  w: number;
  h: number;
  p: Palette;
  night: boolean;
  t: number;
  time: TimeOfDay;
  options: BackgroundOptions;
  view?: 'front' | 'topDown';
};
type Layers = {far: ReactNode; mid: ReactNode; near: ReactNode};
export type BackgroundBuilder = (ctx: Context) => Layers;
const cloud = (x: number, y: number, s = 1) => (
  <g key={x} transform={`translate(${x} ${y}) scale(${s})`} fill="#fff8eb" opacity={0.7}>
    <ellipse rx={90} ry={20} />
    <ellipse cx={-26} cy={-17} rx={38} ry={29} />
    <ellipse cx={27} cy={-11} rx={37} ry={25} />
  </g>
);
const hills = (w: number, h: number, color: string, level: number) => (
  <path
    d={`M-120 ${h * level} Q${w * 0.12} ${h * (level - 0.22)} ${w * 0.4} ${h * level} T${w + 150} ${h * (level - 0.06)} V${h + 100} H-120Z`}
    fill={color}
  />
);
const stars = (w: number, h: number) =>
  Array.from({length: 32}, (_, i) => {
    const x = (((i * 277 + 35) % 997) / 997) * w;
    const y = (((i * 113 + 37) % 431) / 431) * h * 0.58;
    return (
      <path
        key={i}
        d={`M${x - 4} ${y} h8 M${x} ${y - 4} v8`}
        stroke="#fff0cb"
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.35 + (i % 3) * 0.2}
      />
    );
  });
export const backgroundRegistry: Record<BackgroundName, BackgroundBuilder> = {
  oldHouseExterior,
  houseInterior,
  basement,
  forest: ({w, h, p, night}) => ({
    far: (
      <>
        {night ? (
          stars(w, h)
        ) : (
          <>
            {cloud(w * 0.22, h * 0.2)}
            {cloud(w * 0.77, h * 0.3, 1.4)}
          </>
        )}
        {hills(w, h, p.far, 0.62)}
      </>
    ),
    mid: (
      <>
        {hills(w, h, p.mid, 0.73)}
        {Array.from({length: 9}, (_, i) => (
          <g
            key={i}
            transform={`translate(${(i * w) / 7 - 160} ${h * 0.78 - (224 * Math.min(w, h)) / 650}) scale(${Math.min(w, h) / 650})`}
          >
            <Tree color={night ? '#737fa0' : i % 2 ? '#91bea9' : '#a8cbb1'} />
          </g>
        ))}
      </>
    ),
    near: (
      <>
        <rect x={-100} y={h * 0.78} width={w + 200} height={h * 0.3} fill={p.near} />
        <path
          d={`M${w * 0.46} ${h * 0.78} L${w * 0.73} ${h} H${w * 0.14}Z`}
          fill={night ? '#7d7998' : '#e7d1ad'}
        />
        {Array.from({length: 17}, (_, i) => (
          <ellipse
            key={i}
            cx={(i * w) / 15}
            cy={h * (0.86 + (i % 3) * 0.045)}
            rx={8}
            ry={4}
            fill={p.accent}
            opacity={0.6}
          />
        ))}
      </>
    ),
  }),
  city: ({w, h, p, night}) => ({
    far: (
      <>
        {Array.from({length: 12}, (_, i) => (
          <rect
            key={i}
            x={(i * w) / 10 - 100}
            y={h * (0.35 + (i % 4) * 0.055)}
            width={w / 9}
            height={h * 0.5}
            rx={12}
            fill={p.far}
          />
        ))}
      </>
    ),
    mid: (
      <>
        {Array.from({length: 7}, (_, i) => (
          <g key={i} transform={`translate(${(i * w) / 5 - 130} ${h * 0.49}) scale(${h / 850})`}>
            <House night={night} color={['#dfb5b3', '#c7badc', '#e7c6a3'][i % 3]} />
          </g>
        ))}
      </>
    ),
    near: (
      <>
        <rect
          x={-100}
          y={h * 0.77}
          width={w + 200}
          height={h * 0.3}
          fill={night ? '#787894' : '#cec8d1'}
        />
        <rect
          x={-100}
          y={h * 0.82}
          width={w + 200}
          height={h * 0.2}
          fill={night ? '#555d78' : '#a9b5bd'}
        />
        <path
          d={`M-100 ${h * 0.92} H${w + 100}`}
          stroke="#f9dfae"
          strokeWidth={8}
          strokeDasharray="65 50"
        />
      </>
    ),
  }),
  room: ({w, h, p, night}) => ({
    far: (
      <>
        <rect width={w} height={h} fill={night ? '#69647e' : '#f0d7c6'} />
        {Array.from({length: 18}, (_, i) => (
          <path
            key={i}
            d={`M${(i * w) / 16} 0 V${h}`}
            stroke={night ? '#79758d' : '#e8cbbd'}
            strokeWidth={3}
          />
        ))}
        <rect x={w * 0.59} y={h * 0.25} width={w * 0.28} height={h * 0.32} rx={20} fill="#fff1d9" />
        <rect
          x={w * 0.605}
          y={h * 0.265}
          width={w * 0.25}
          height={h * 0.29}
          rx={10}
          fill={night ? '#454b70' : '#b7d9df'}
        />
        <circle cx={w * 0.76} cy={h * 0.34} r={h * 0.035} fill={p.accent} />
        <path
          d={`M${w * 0.73} ${h * 0.26} V${h * 0.57} M${w * 0.59} ${h * 0.41} H${w * 0.87}`}
          stroke="#fff1d9"
          strokeWidth={10}
        />
      </>
    ),
    mid: <Sofa width={w} height={h} night={night} />,
    near: (
      <>
        <rect
          x={-100}
          y={h * 0.8}
          width={w + 200}
          height={h * 0.3}
          fill={night ? '#8d8091' : '#dfbca0'}
        />
        <ellipse
          cx={w * 0.5}
          cy={h * 0.89}
          rx={w * 0.35}
          ry={h * 0.075}
          fill={night ? '#b2a0ac' : '#f0d7bb'}
        />
      </>
    ),
  }),
  sea: ({w, h, p, night, t}) => ({
    far: (
      <>
        {cloud(w * 0.21, h * 0.3, 1.3)}
        {cloud(w * 0.78, h * 0.23)}
        <path
          d={`M-100 ${h * 0.58} H${w + 100} V${h} H-100Z`}
          fill={night ? '#667fa4' : '#a1d3d6'}
        />
      </>
    ),
    mid: (
      <>
        {[0.62, 0.68, 0.74].map((level, i) => (
          <path
            key={level}
            d={`M-120 ${h * level} Q${w * 0.2} ${h * level - 20 + Math.sin(t + i) * 6} ${w * 0.5} ${h * level} T${w + 120} ${h * level}`}
            stroke={night ? '#94aaca' : '#d4f0e9'}
            strokeWidth={10}
            fill="none"
          />
        ))}
      </>
    ),
    near: (
      <>
        <path
          d={`M-100 ${h * 0.82} Q${w * 0.25} ${h * 0.73} ${w * 0.55} ${h * 0.81} T${w + 120} ${h * 0.78} V${h + 100} H-100Z`}
          fill={night ? '#bab0bb' : '#f1d4a8'}
        />
        {[0.12, 0.45, 0.83].map((x) => (
          <path
            key={x}
            d={`M${w * x} ${h * 0.92} q15-20 30 0`}
            stroke="#e4b99f"
            strokeWidth={4}
            fill="none"
          />
        ))}
      </>
    ),
  }),
  nightSky: ({w, h, p, night, t}) => ({
    far: (
      <>
        {stars(w, h)}
        <path
          d={`M${w * 0.13} ${h * 0.4} Q${w * 0.48} ${h * 0.15} ${w * 0.9} ${h * 0.4}`}
          fill="none"
          stroke={night ? '#7b799b' : '#eed5d8'}
          strokeWidth={h * 0.07}
          opacity={0.45}
        />
      </>
    ),
    mid: (
      <>
        {hills(w, h, p.far, 0.7)}
        <g opacity={0.8} transform={`translate(${Math.sin(t * 0.2) * 10} 0)`}>
          {hills(w, h, p.mid, 0.8)}
        </g>
      </>
    ),
    near: (
      <>
        {hills(w, h, p.near, 0.91)}
        <rect x={-100} y={h * 0.9} width={w + 200} height={h * 0.2} fill={p.near} />
      </>
    ),
  }),
};
export const Background = ({
  kind,
  time = 'day',
  options = {},
  view,
  panX = 0,
  parallax = 0,
}: {
  kind: BackgroundName;
  time?: TimeOfDay;
  options?: BackgroundOptions;
  view?: 'front' | 'topDown';
  panX?: number;
  parallax?: number;
}) => {
  const {width: w, height: h, fps, durationInFrames} = useVideoConfig();
  const frame = useCurrentFrame();
  const t = frame / fps;
  if (kind === 'houseInterior' && options.variant === 'bedroomPOV')
    return (
      <BedroomPOV
        width={w}
        height={h}
        fps={fps}
        frame={frame}
        duration={durationInFrames}
        options={options}
      />
    );
  const p = palettes[time];
  const layers = backgroundRegistry[kind]({
    w,
    h,
    p,
    night: time === 'night' || time === 'moonlight',
    t,
    time,
    options,
    view,
  });
  return (
    <svg width={w} height={h} style={{position: 'absolute', inset: 0}}>
      <rect width={w} height={h} fill={p.sky} />
      <circle cx={w * 0.81} cy={h * 0.18} r={Math.min(w, h) * 0.065} fill={p.accent} />
      {(['far', 'mid', 'near'] as const).map((layer, i) => (
        <g
          key={layer}
          data-parallax={layer}
          transform={`translate(${Math.sin(t * 0.18) * (i + 1) * 7 - panX * w * parallax * (2 - i) * 0.15} 0) translate(${w / 2} ${h / 2}) scale(${1.04 + parallax * 0.08}) translate(${-w / 2} ${-h / 2})`}
        >
          {layers[layer]}
        </g>
      ))}
    </svg>
  );
};
