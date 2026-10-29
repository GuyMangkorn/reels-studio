import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BrushCanvas, hash, type PaintContext} from '../BrushCanvas';

type Pt = [number, number];

// Spike shot: fire fog. A burning horizon at night, banks of ember-lit haze drifting across and smoke plumes
// climbing; glow and embers are Remotion layers above the canvas. Coordinates are in a 1080x1920 frame.

// Fire flicker as a pure function of time: a few incommensurate sines, so it never visibly loops in a shot.
const flicker = (t: number, k: number) =>
  0.8 + 0.1 * Math.sin(t * 7.3 + k) + 0.06 * Math.sin(t * 13.1 + k * 2.3) + 0.04 * Math.sin(t * 2.9 + k * 0.7);

// A soft blob whose outline breathes with t; phases come from the blob's id so neighbours do not move in step.
const blob = (id: number, cx: number, cy: number, rx: number, ry: number, t: number): Pt[] => {
  const pts: Pt[] = [];
  const p1 = hash(id + 11) * 6.28, p2 = hash(id + 23) * 6.28;
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const r = 1 + 0.16 * Math.sin(3 * a + p1 + t * 0.5) + 0.09 * Math.sin(5 * a + p2 - t * 0.35);
    pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]);
  }
  return pts;
};

const paint = ({brush, t, width: W, height: H, still, boil}: PaintContext) => {
  const push = interpolate(t, [0, 5], [1, 1.05], {easing: Easing.inOut(Easing.cubic)});
  brush.push();
  brush.translate(W / 2, H * 0.6);
  brush.scale(push);
  brush.translate(-W / 2, -H * 0.6);

  let washId = 0;
  const wash = (color: string, opacity: number, pts: Pt[], bleed = 0.25, texture = 0.5) => {
    still(++washId);
    brush.noStroke();
    brush.fill(color, Math.round(opacity));
    brush.fillBleed(bleed);
    brush.fillTexture(texture, 0.4);
    brush.polygon(pts);
    brush.noFill();
  };

  // Night sky: cold above, wine-dark toward the fire.
  wash('#1c1826', 245, [[-80, -80], [W + 80, -80], [W + 80, 900], [-80, 980]], 0.15, 0.6);
  wash('#4a2026', 220, [[-80, 700], [W + 80, 640], [W + 80, 1250], [-80, 1250]], 0.3, 0.5);
  // The fire band on the horizon: the one warm light, flickering.
  wash('#c8461e', 200 * flicker(t, 0), [[-80, 1080], [260, 1010], [560, 1050], [820, 990], [W + 80, 1040], [W + 80, 1230], [-80, 1230]], 0.45, 0.35);
  wash('#ffb04a', 170 * flicker(t, 1.7), [[60, 1150], [380, 1100], [700, 1130], [1000, 1095], [1000, 1215], [60, 1215]], 0.5, 0.25);

  // Fire fog: banks of lit haze drifting right and rising. Back banks sit behind the ridge, front banks over it.
  const bank = (i: number, color: string, op: number, x0: number, y0: number, rx: number, ry: number, drift: number) =>
    wash(color, op * (0.85 + 0.15 * flicker(t, i)), blob(i, x0 + t * drift, y0 - t * 8, rx, ry, t), 0.6, 0.4);
  bank(0, '#7a3034', 130, 150, 860, 520, 150, 22);
  bank(1, '#a8442e', 120, 820, 940, 480, 140, 30);
  bank(2, '#d0703a', 110, 380, 1080, 600, 150, 38);
  // Smoke: dark soft plumes climbing out of the fire into the sky.
  for (let i = 0; i < 4; i++) {
    const x = 160 + i * 250 + hash(i + 40) * 80 + t * 14;
    const y = 820 - hash(i + 60) * 160 - t * 30;
    wash('#2a1c24', 115, blob(i + 20, x, y, 150 + hash(i + 80) * 60, 240, t), 0.7, 0.5);
  }

  // Far ridge with a ragged treeline, black against the fire.
  const ridge: Pt[] = [[-80, 1250]];
  for (let x = -80; x <= W + 80; x += 30) ridge.push([x, 1190 - hash(x) * 70 - (x % 90 === 0 ? 40 : 0)]);
  ridge.push([W + 80, 1250], [W + 80, H + 80], [-80, H + 80]);
  wash('#140e10', 250, ridge, 0.08, 0.3);

  // Front banks: thin and hot, low over the burnt land, so the ridge still reads through them.
  bank(3, '#ff9a48', 40, 980, 1210, 460, 90, 26);
  bank(4, '#e0603a', 48, -60, 1290, 560, 100, 44);
  bank(5, '#ffb860', 30, 620, 1360, 520, 85, 34);

  // Foreground: a burnt tree in ink on the near ground.
  wash('#0e0a0b', 252, [[-80, 1560], [300, 1500], [700, 1540], [W + 80, 1480], [W + 80, H + 80], [-80, H + 80]], 0.06, 0.3);
  boil(2);
  brush.set('2B', '#0a0708', 2.2);
  brush.line(250, 1540, 270, 1060);
  brush.line(262, 1300, 150, 1180);
  brush.line(266, 1200, 380, 1090);
  brush.line(150, 1180, 110, 1120);
  brush.line(380, 1090, 430, 1060);
  brush.pop();
};

// p5.brush paints like watercolour and cannot glow, so the light comes from a screen-blended Remotion layer.
const Glow = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill
      style={{
        mixBlendMode: 'screen',
        opacity: 0.55 * flicker(t, 3.1),
        background:
          'radial-gradient(ellipse 75% 22% at 50% 62%, rgba(255,150,60,0.9), rgba(200,70,30,0.35) 55%, rgba(0,0,0,0) 100%)',
      }}
    />
  );
};

// Embers in screen space, as light: p5.brush draws circles this small as squares, so they live in an SVG layer.
// Each rises on its own lane with a little sway, and fades near the top.
const EMBER_COLORS = ['#ffd27a', '#ff8a3a'];
const Embers = () => {
  const frame = useCurrentFrame();
  const {fps, width: W, height: H} = useVideoConfig();
  const t = frame / fps;
  const embers = Array.from({length: 70}, (_, i) => {
    const speed = 90 + hash(i + 900) * 160;
    const y = H - ((hash(i + 1000) * (H + 200) + t * speed) % (H + 200));
    const x = hash(i + 1100) * W + Math.sin(t * 1.8 + i) * 30;
    const life = Math.min(1, Math.max(0, (y - 300) / 900));
    const r = 3 + hash(i + 1200) * 4;
    const k = hash(i) > 0.5 ? 0 : 1;
    return {i, x, y, r, k, opacity: 0.9 * life * flicker(t, i)};
  });
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen'}}>
      <svg width={W} height={H}>
        <defs>
          {EMBER_COLORS.map((c, k) => (
            <radialGradient key={c} id={`ember-halo-${k}`}>
              <stop offset="0%" stopColor={c} stopOpacity={0.45} />
              <stop offset="100%" stopColor={c} stopOpacity={0} />
            </radialGradient>
          ))}
        </defs>
        {embers.map(({i, x, y, r, k, opacity}) => (
          <g key={i} opacity={opacity}>
            <circle cx={x} cy={y} r={r * 4} fill={`url(#ember-halo-${k})`} />
            <circle cx={x} cy={y} r={r} fill={EMBER_COLORS[k]} />
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export const FireFog = () => (
  <AbsoluteFill style={{backgroundColor: '#1c1826'}}>
    <BrushCanvas paint={paint} paper="#2a2028" />
    <Glow />
    <Embers />
  </AbsoluteFill>
);
