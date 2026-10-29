import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BrushCanvas, hash, type PaintContext} from '../BrushCanvas';

type Pt = [number, number];

// Spike shot for WORLD FOG (WFOG-EP01-SHORT S02-B02, scripts/world-fog/short/script.md): from inside the shop,
// fog swallows the forecourt while the composite shape (worker + cart + carton stack + helmet) walks toward the
// glass. Its truth must stay unreadable here: one dark mass, wobbling top, a dragging wheel. 1080x1920 frame.

const ramp = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});

// A soft blob whose outline breathes with t; phases come from the id so neighbouring banks do not move in step.
const blob = (id: number, cx: number, cy: number, rx: number, ry: number, t: number): Pt[] => {
  const pts: Pt[] = [];
  const p1 = hash(id + 11) * 6.28, p2 = hash(id + 23) * 6.28;
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const r = 1 + 0.14 * Math.sin(3 * a + p1 + t * 0.4) + 0.08 * Math.sin(5 * a + p2 - t * 0.3);
    pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]);
  }
  return pts;
};

// Shot clock: fog density 0 -> 1 over the first 3 s; the shape walks from the far pumps to the glass.
const fogAt = (t: number) => ramp(t, 0.2, 3.2);
const walkAt = (t: number) => ramp(t, 0.8, 6);
// Ground point and scale of the shape: far (small, high on the forecourt) to near (large, low).
const shapeAt = (t: number) => {
  const u = walkAt(t);
  return {x: interpolate(u, [0, 1], [470, 330]), y: interpolate(u, [0, 1], [1130, 1470]), s: interpolate(u, [0, 1], [0.35, 1.15])};
};

// Canopy lights (sodium), in frame pixels; shared by the paint and the glow layer.
const LAMPS: Pt[] = [[230, 640], [430, 625], [650, 625], [860, 640]];
const FOG = '#b9c2bf';

const paint = ({brush, t, width: W, height: H, still}: PaintContext) => {
  const fog = fogAt(t);
  const push = interpolate(t, [0, 6], [1, 1.04], {easing: Easing.inOut(Easing.cubic)});
  brush.push();
  brush.translate(W / 2, H * 0.55);
  brush.scale(push);
  brush.translate(-W / 2, -H * 0.55);

  let washId = 0;
  const wash = (color: string, opacity: number, pts: Pt[], bleed = 0.25, texture = 0.5) => {
    still(++washId);
    if (opacity < 2) return;
    brush.noStroke();
    brush.fill(color, Math.round(Math.min(255, opacity)));
    brush.fillBleed(bleed);
    brush.fillTexture(texture, 0.4);
    brush.polygon(pts);
    brush.noFill();
  };
  // Near-opaque fill (no bleed, almost no texture) for the silhouette core. Not brush.wash():
  // drawn after textured fills it renders a few pixels differently on every run (determinism check, 29 Oct 2026).
  // One watercolour pass leaves paper gaps, so three passes build an opaque layer.
  const flat = (color: string, opacity: number, pts: Pt[]) => {
    for (let i = 0; i < 3; i++) wash(color, opacity, pts, 0, 0.05);
  };
  const rect = (x0: number, y0: number, x1: number, y1: number): Pt[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

  // Night sky and far road, already hazy.
  wash('#3c4548', 240, rect(-80, -80, W + 80, 760), 0.15, 0.5);
  wash('#56605e', 200, rect(-80, 700, W + 80, 1150), 0.3, 0.5);
  // Forecourt concrete, lit warm under the canopy.
  wash('#4a4c46', 235, [[-80, 1100], [W + 80, 1100], [W + 80, 1560], [-80, 1560]], 0.1, 0.4);
  wash('#8a7a52', 120 * (1 - 0.6 * fog), [[120, 1110], [960, 1110], [1060, 1380], [20, 1380]], 0.5, 0.4);

  // Canopy roof, columns and two pumps: the set the fog swallows.
  wash('#262b2c', 240, [[60, 540], [1020, 540], [1000, 610], [80, 610]], 0.05, 0.3);
  for (const x of [150, 930]) wash('#2c3132', 235, rect(x - 18, 600, x + 18, 1120), 0.04, 0.3);
  for (const [x, w] of [[330, 70], [770, 70]] as const) {
    wash('#3a4a4c', 240, rect(x - w, 930, x + w, 1120), 0.05, 0.3);
    wash('#9a3a30', 200, rect(x - w, 930, x + w, 975), 0.05, 0.3);
  }
  for (const [x, y] of LAMPS) wash('#ffd88a', 240, rect(x - 55, y - 12, x + 55, y + 12), 0.1, 0.2);

  // Far veil: the forecourt fades out behind the shape as the fog closes in.
  wash(FOG, 70 + 165 * fog, rect(-80, -80, W + 80, 1200), 0.4, 0.5);
  wash(FOG, 40 + 150 * fog, rect(-80, 1100, W + 80, 1560), 0.5, 0.5);

  // Drifting banks behind the shape: the fog visibly moves, left to right. Banks drawn over the shape feather into
  // its wet washes and eat white holes in it, so only the low ground banks pass in front.
  const bank = (i: number, op: number, x0: number, y0: number, rx: number, ry: number, drift: number) =>
    wash(i % 2 ? '#c8d0cc' : '#a9b3b0', op * (0.3 + 0.7 * fog), blob(i, x0 + t * drift, y0, rx, ry, t), 0.6, 0.45);
  bank(0, 120, -100, 760, 520, 160, 26);
  bank(1, 110, 700, 880, 560, 150, 18);
  bank(2, 130, 200, 1060, 620, 140, 34);


  // The composite shape, one silhouette: cart frame and wheels, carton stack, helmet on top, a raincoat body behind,
  // an umbrella handle sticking forward. The stack sways; the front wheel drags (no turn), so it reads as a limp.
  const {x, y, s} = shapeAt(t);
  const sway = 0.06 * Math.sin(t * 2.6) + 0.03 * Math.sin(t * 4.1 + 1);
  const bob = Math.abs(Math.sin(t * 3.2)) * 8 * s;
  const ink = '#1d2224';
  const L = (u: number, v: number): Pt => [x + u * s, y - v * s];
  // Stack points lean about the cart deck by `sway`.
  const S = (u: number, v: number): Pt => {
    const dv = v - 120;
    return [x + (u * Math.cos(sway) + dv * Math.sin(sway)) * s, y - (120 + dv * Math.cos(sway) - u * Math.sin(sway)) * s - bob];
  };
  const part = (pts: Pt[]) => {
    flat(ink, 245, pts);
    wash('#2a3032', 200, pts, 0.08, 0.5);
  };
  // Ragged outline between corners so the cartons and coat read as one soft mass, not clean boxes (static jitter).
  const rag = (id: number, corners: [number, number][], amp: number): [number, number][] =>
    corners.flatMap(([u, v], i) => {
      const [u2, v2] = corners[(i + 1) % corners.length];
      return [0, 1, 2].map((k) => [u + ((u2 - u) * k) / 3 + (hash(id + i * 3 + k) - 0.5) * amp, v + ((v2 - v) * k) / 3 + (hash(id + 50 + i * 3 + k) - 0.5) * amp] as [number, number]);
    });
  part(rag(300, [[10, 10], [170, 0], [200, 60], [185, 330], [150, 420], [90, 470], [60, 300], [40, 120]], 26).map(([u, v]) => L(u, v))); // raincoat, hood up against the stack
  part([L(-150, 60), L(110, 60), L(110, 120), L(-150, 120)]); // cart deck
  part([L(-150, 60), L(-142, 0), L(-112, 0), L(-122, 60)]); // front leg + dragging wheel
  part([L(80, 60), L(90, 0), L(118, 0), L(106, 60)]);
  part(rag(400, [[-140, 120], [90, 120], [100, 420], [70, 530], [-30, 545], [-125, 540], [-150, 420]], 34).map(([u, v]) => S(u, v))); // cartons
  const hx = -30, hy = 590;
  const helmet: Pt[] = [];
  for (let i = 0; i <= 12; i++) {
    const a = Math.PI + (i / 12) * Math.PI;
    helmet.push(S(hx + 70 * Math.cos(a), hy - 60 * Math.sin(a)));
  }
  part([...helmet, S(hx + 70, hy - 10), S(hx - 70, hy - 10)]); // helmet: the "head"
  part([L(130, 300), L(-60, 380), L(-200, 470), L(-215, 455), L(-70, 360), L(120, 280)]); // umbrella: the "reach"

  // Mid fog over the shape: thick while it is far, thinning as it nears the glass, never clearing.
  const near = walkAt(t);
  wash(FOG, (60 + 120 * fog) * (1 - 0.55 * near), rect(-80, 300, W + 80, 1520), 0.5, 0.5);
  bank(3, 70, 860, 1230, 520, 120, 22);
  bank(4, 60, -200, 1380, 640, 110, 40);
  brush.pop();
};

// p5.brush cannot glow; the canopy lights bloom in a screen-blended Remotion layer, getting wider and dimmer as the
// fog thickens (light scattering), then nearly gone.
const Glow = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fog = fogAt(frame / fps);
  const spread = 9 + 10 * fog;
  const glows = LAMPS.map(([x, y]) => `radial-gradient(ellipse ${spread}% ${spread * 0.55}% at ${(x / 1080) * 100}% ${(y / 1920) * 100}%, rgba(255,214,140,0.85), rgba(255,190,110,0.25) 45%, rgba(0,0,0,0) 100%)`);
  return <AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.75 - 0.45 * fog, background: glows.join(',')}} />;
};

// Inside the shop, in front of the glass: wall, window frame, shelf end and counter as a solid Remotion layer over the
// canvas. Painted, the dark interior picked up the fog washes beneath it (wet feathering), so it reads as a backlit
// silhouette here instead; the frame keeps a dark ink edge.
const FRAME = '#1e2223', EDGE = '#0d1011';
const Interior = () => {
  const {width: W, height: H} = useVideoConfig();
  const bar = (x0: number, y0: number, x1: number, y1: number) => <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={FRAME} stroke={EDGE} strokeWidth={5} />;
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        {bar(-10, -10, W + 10, 340)}
        {bar(-10, 300, 40, 1590)}
        {bar(660, 300, 700, 1590)}
        {bar(1040, 300, W + 10, 1590)}
        {bar(-10, 1540, W + 10, 1590)}
        <rect x={0} y={1586} width={W} height={H - 1586} fill="#171a1b" />
        <path d={`M0 1600 L380 1600 L420 ${H} L0 ${H} Z`} fill="#24292a" />
        <path d={`M760 1640 L${W} 1610 L${W} ${H} L720 ${H} Z`} fill="#2b3131" />
        {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={0} y1={1660 + i * 55} x2={360 + i * 8} y2={1660 + i * 55} stroke={EDGE} strokeWidth={5} />)}
      </svg>
    </AbsoluteFill>
  );
};

export const WorldFog = () => (
  <AbsoluteFill style={{backgroundColor: '#3c4548'}}>
    <BrushCanvas paint={paint} paper="#4a5250" />
    <Glow />
    <Interior />
  </AbsoluteFill>
);
