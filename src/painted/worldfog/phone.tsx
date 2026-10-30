import {useId} from 'react';
import {AbsoluteFill} from 'remotion';
import {hash} from '../hash';
import {lerp, type Painter, type Pt} from '../painter';
import {INK} from './draw';

// S02-SH02 phone insert (MK-WF-DEP-09; brief VD09 R3 PHONE-SVG, adopted by the user SS-R2 Q4; sheet sc02-b01 SS-R3).
// Promoted from the spike `src/painted/spike/WfogPhone.tsx` (sample WFOG-PREVIEW-S02-SH02): painted shop background
// (L0) and the narrator's hand + handset (L1, olive jacket cuff), the screen as crisp React SVG (L2, Noto Sans Thai,
// loaded by the caption layer) masked by the painted thumb and fingertips so they read in front. PD06: no outlet,
// logo, anchor, ticker, authority, date or place anywhere; the article top-bar pill is neutral grey.

const HEADLINE = 'หมอกหนาปกคลุมทั่วโลก';
// Sheet: screen x 300-760, y 330-960 (aspect 0.73, reads as a tablet). Sample uses a phone proportion (0.61) with the
// same top, thumb points and caption clearance: deviation recorded for Mark (SS-R2) in build-notes.
const SCREEN = {x0: 336, y0: 312, x1: 744, y1: 978, r: 46};
const BODY = {x0: 318, y0: 288, x1: 762, y1: 1000, r: 64};
const SKIN = '#e9c2a2', SKIN_SHADE = '#d0a283', NAIL = '#f4dccd', CUFF = '#6b7a5a', CUFF_SHADE = '#56634a';

const ease = (u: number) => u * u * (3 - 2 * u);
const seg = (f: number, a: number, b: number) => Math.max(0, Math.min(1, (f - a) / (b - a)));

/** Thumb tip (sheet): (735, 900) until f48, slides to (735, 760) over f48-f78 with the scroll. */
const thumbTip = (f: number): Pt => [735, lerp(900, 760, ease(seg(f, 48, 78)))];
const THUMB_BASE: Pt = [880, 1110];
const BONE = [190, 182];

/** Two-bone thumb from the base at the heel of the hand to the tip; the knuckle bulges outward (right, down). */
const thumbJoints = (f: number) => {
  const T = thumbTip(f), B = THUMB_BASE;
  const dx = T[0] - B[0], dy = T[1] - B[1], d = Math.min(Math.hypot(dx, dy), BONE[0] + BONE[1] - 1);
  const a = Math.atan2(dy, dx) + Math.acos((BONE[0] ** 2 + d * d - BONE[1] ** 2) / (2 * BONE[0] * d));
  const K: Pt = [B[0] + BONE[0] * Math.cos(a), B[1] + BONE[0] * Math.sin(a)];
  return {B, K, T};
};
/** A rounded segment a-b, width w0 at a and w1 at b. */
const capsule = (a: Pt, b: Pt, w0: number, w1: number): Pt[] => {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const arc = (c: Pt, r: number, from: number): Pt[] =>
    Array.from({length: 9}, (_, i): Pt => [c[0] + r * Math.cos(from + (Math.PI * i) / 8), c[1] + r * Math.sin(from + (Math.PI * i) / 8)]);
  return [...arc(b, w1 / 2, ang - Math.PI / 2), ...arc(a, w0 / 2, ang + Math.PI / 2)];
};
/** The thumb outline (proximal + distal segments with a round tip), shared by the paint and the screen mask. */
const thumbShape = (f: number) => {
  const {B, K, T} = thumbJoints(f);
  return {prox: capsule(B, K, 84, 64), dist: capsule(K, T, 64, 56), tip: ring(T[0], T[1], 28), K, T};
};
const ring = (cx: number, cy: number, rx: number, ry = rx, n = 18): Pt[] => Array.from({length: n}, (_, i) => [cx + rx * Math.cos((i / n) * 6.283), cy + ry * Math.sin((i / n) * 6.283)]);
/** Fingertips curling round the phone's left edge from behind (static grip). */
const FINGERTIPS: [number, number, number, number][] = [[318, 575, 21, 31], [314, 650, 22, 32], [316, 726, 21, 31], [321, 800, 19, 27]];

const roundRect = ({x0, y0, x1, y1, r}: {x0: number; y0: number; x1: number; y1: number; r: number}, n = 6): Pt[] => {
  const c: [number, number, number][] = [[x1 - r, y0 + r, -Math.PI / 2], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, Math.PI / 2], [x0 + r, y0 + r, Math.PI]];
  return c.flatMap(([cx, cy, a0]) => Array.from({length: n + 1}, (_, i): Pt => [cx + r * Math.cos(a0 + (Math.PI / 2) * (i / n)), cy + r * Math.sin(a0 + (Math.PI / 2) * (i / n))]));
};

// ------------------------------------------------------------------ painted layers

/** L0: the shop behind the phone, defocused: fluorescent tubes, a shelf aisle of products, the fogged glass far right. */
const paintShop = (p: Painter, f: number) => {
  const {brush} = p;
  brush.push();
  brush.translate(-20 * (f / 89), 0);
  p.group(10);
  p.wash('#7a8582', 250, [[-100, -100], [1200, -100], [1200, 2100], [-100, 2100]], 0.2, 0.45);
  // Ceiling and fluorescent tubes in perspective, each with a soft cool bloom.
  p.wash('#5c6664', 220, [[-100, -100], [1200, -100], [1200, 170], [-100, 260]], 0.35, 0.45);
  [[40, 150, 470, 104], [560, 96, 1120, 50], [150, 236, 430, 214], [600, 196, 960, 172]].forEach(([x0, y0, x1, y1]) => {
    p.wash('#dfe9e5', 45, ring((x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2 + 50, 40, 32), 0.5, 0.1);
    p.wash('#f6fbf9', 245, [[x0, y0 - 8], [x1, y1 - 6], [x1, y1 + 6], [x0, y0 + 8]], 0.05, 0.1);
  });
  // Shelf aisle on the left: five rows of products (plain colour blocks, no labels or brands), price rails, shadows.
  p.group(100);
  p.wash('#4f5957', 200, [[-100, 330], [690, 380], [690, 1560], [-100, 1640]], 0.25, 0.45);
  const tints = ['#c9a660', '#7fa8a0', '#c0705a', '#e6ddca', '#6b8aa6', '#a3b98e', '#d9b97c', '#8f7fa6'];
  for (let r = 0; r < 5; r++) {
    const y = 560 + r * 210, slope = 0.06;
    for (let i = 0; i < 8; i++) {
      const x = -70 + i * 96 + hash(r * 31 + i) * 20, w = 72 + hash(r * 31 + i + 7) * 18, h = 90 + hash(r * 31 + i + 3) * 60;
      const yb = y + slope * x;
      p.wash(tints[(r * 3 + i) % 8], 150, [[x, yb - h], [x + w, yb - h + slope * w], [x + w, yb + slope * w], [x, yb]], 0.3, 0.4);
    }
    p.wash('#d9e0dd', 170, [[-100, y - 6 * slope], [700, y + 700 * slope], [700, y + 700 * slope + 14], [-100, y + 8]], 0.08, 0.25);
    p.wash('#3e4746', 120, [[-100, y + 14], [700, y + 700 * slope + 14], [700, y + 700 * slope + 46], [-100, y + 44]], 0.4, 0.4);
  }
  // The glass front far right: grey fog (FS2 reached at G348), two warm lamp smudges, a dark mullion.
  p.group(300);
  p.wash('#a1a8a3', 230, [[720, 230], [1200, 190], [1200, 1480], [730, 1420]], 0.35, 0.45);
  p.wash('#c3ae84', 90, ring(860, 420, 120, 70), 0.6, 0.4);
  p.wash('#c3ae84', 80, ring(1060, 390, 100, 60), 0.6, 0.4);
  p.wash('#2f3534', 220, [[714, 220], [744, 218], [756, 1440], [726, 1440]], 0.1, 0.3);
  // Floor with tube reflections.
  p.wash('#5d6764', 230, [[-100, 1560], [1200, 1460], [1200, 2100], [-100, 2100]], 0.3, 0.45);
  for (let i = 0; i < 3; i++) p.wash('#93a09c', 60, [[280 + i * 260, 1600], [310 + i * 260, 1600], [330 + i * 260, 2100], [270 + i * 260, 2100]], 0.15, 0.3);
  // Counter edge in the near foreground (she stands at the counter), soft.
  p.wash('#4a4540', 230, [[-100, 1500], [1200, 1440], [1200, 2100], [-100, 2100]], 0.3, 0.45);
  p.wash('#9a9184', 150, [[-100, 1490], [1200, 1430], [1200, 1452], [-100, 1514]], 0.2, 0.3);
  // Defocus veil: pushes the room back behind the phone.
  p.wash('#7a8582', 70, [[-100, -100], [1200, -100], [1200, 2100], [-100, 2100]], 0.5, 0.5);
  // Lower shelves fall into shadow under the counter edge: keeps the caption band (y 1000-1248) dark behind captions.
  p.wash('#2a302f', 120, [[-100, 900], [1200, 860], [1200, 2100], [-100, 2100]], 0.12, 0.45);
  p.wash('#262c2b', 150, [[-100, 990], [1200, 960], [1200, 1330], [-100, 1360]], 0.12, 0.45);
  brush.pop();
};

/** Solid seeded fill (no watercolour border), `n` passes. */
const solid = (p: Painter, seed: number, color: string, pts: Pt[], n = 6, texture = 0.06) => {
  const {brush} = p;
  for (let k = 0; k < n; k++) {
    brush.seed(seed * 16 + k);
    brush.noiseSeed(seed * 16 + k);
    brush.noStroke();
    brush.fill(color, 255);
    brush.fillBleed(0);
    brush.fillTexture(texture, 0.15);
    brush.polygon(pts);
    brush.noFill();
  }
};
const inkLine = (p: Painter, id: number, pts: Pt[], w = 1.1, curve = 0.2) => {
  p.ink(id, 'rotring', INK, w);
  p.brush.spline([...pts, pts[0]], curve);
};

/** L1: the hand behind the phone, the handset, then the thumb and fingertips in front. */
const paintHand = (p: Painter, f: number) => {
  // Jacket sleeve (olive, SS-R3) and the back of the hand, exiting lower right.
  const sleeve: Pt[] = [[880, 1250], [990, 1196], [1140, 1520], [1180, 1700], [1010, 1760]];
  solid(p, 4000, CUFF, sleeve);
  solid(p, 4010, CUFF_SHADE, [[880, 1250], [990, 1196], [1004, 1228], [894, 1284]], 4, 0.08); // hem band at the wrist
  solid(p, 4011, CUFF_SHADE, [[1060, 1350], [1140, 1520], [1180, 1700], [1120, 1720], [1090, 1520]], 4, 0.08); // fold shade on the outer side
  inkLine(p, 401, sleeve);
  const palm: Pt[] = [[762, 860], [812, 900], [880, 990], [960, 1110], [990, 1210], [905, 1262], [835, 1150], [770, 1060], [720, 1000], [762, 1000]];
  solid(p, 4100, SKIN, palm);
  solid(p, 4101, SKIN_SHADE, [[762, 975], [840, 1030], [905, 1140], [905, 1262], [835, 1150], [770, 1060], [720, 1000], [762, 1000]], 4);
  inkLine(p, 402, palm);

  // Handset: graphite body, a lighter edge where the fluorescent light catches it, the screen glass under the SVG.
  const body = roundRect(BODY, 8);
  solid(p, 4200, '#24272b', body, 8, 0.03);
  solid(p, 4201, '#454b51', [[BODY.x0 + 6, BODY.y0 + 50], [BODY.x0 + 50, BODY.y0 + 7], [BODY.x1 - 60, BODY.y0 + 5], [BODY.x1 - 60, BODY.y0 + 12], [BODY.x0 + 54, BODY.y0 + 14], [BODY.x0 + 13, BODY.y0 + 54], [BODY.x0 + 12, BODY.y1 - 80], [BODY.x0 + 6, BODY.y1 - 80]], 4, 0.05);
  solid(p, 4202, '#0e1113', roundRect(SCREEN, 8), 8, 0);
  inkLine(p, 403, body, 1.0, 0.05);
  solid(p, 4203, '#33373c', [[BODY.x1 - 2, 470], [BODY.x1 + 6, 472], [BODY.x1 + 6, 560], [BODY.x1 - 2, 562]], 4, 0); // side button

  // Fingertips round the left edge (slim, short natural nails).
  FINGERTIPS.forEach(([x, y, rx, ry], i) => {
    const tip = ring(x, y, rx, ry, 16);
    solid(p, 4300 + i, SKIN, tip);
    solid(p, 4310 + i, SKIN_SHADE, ring(x - rx * 0.3, y + ry * 0.2, rx * 0.6, ry * 0.7, 12), 3);
    solid(p, 4320 + i, NAIL, ring(x - rx * 0.35, y, rx * 0.36, ry * 0.5, 10), 4, 0.02);
    inkLine(p, 410 + i, tip, 1.0, 0.4);
  });

  // Thumb in front of the screen: proximal, distal, tip; one cel shade along the underside; nail toward camera.
  const {prox, dist, tip, K, T} = thumbShape(f);
  solid(p, 4400, SKIN, prox);
  solid(p, 4401, SKIN, dist);
  solid(p, 4402, SKIN, tip);
  const along = Math.atan2(T[1] - K[1], T[0] - K[0]);
  const nx = -Math.sin(along), ny = Math.cos(along);
  solid(p, 4403, SKIN_SHADE, [[K[0] + nx * 30, K[1] + ny * 30], [T[0] + nx * 26, T[1] + ny * 26], [T[0] + nx * 14, T[1] + ny * 14], [K[0] + nx * 14, K[1] + ny * 14]], 3);
  const nail: Pt[] = Array.from({length: 14}, (_, i) => {
    const a = (i / 14) * 6.283, u = 24 * Math.cos(a), v = 17 * Math.sin(a);
    return [T[0] - Math.cos(along) * 6 + u * Math.cos(along) - v * Math.sin(along), T[1] - Math.sin(along) * 6 + u * Math.sin(along) + v * Math.cos(along)];
  });
  solid(p, 4404, NAIL, nail, 4, 0.02);
  // Outline of the whole thumb: both sides from the base to the tip, round over the tip.
  const {B} = thumbJoints(f);
  const side = (sgn: number): Pt[] => {
    const a0 = Math.atan2(K[1] - B[1], K[0] - B[0]);
    return [[B[0] - sgn * Math.sin(a0) * 46, B[1] + sgn * Math.cos(a0) * 46], [K[0] - sgn * Math.sin(a0) * 38 - sgn * nx * 0, K[1] + sgn * Math.cos(a0) * 38], [T[0] - sgn * Math.sin(along) * 30, T[1] + sgn * Math.cos(along) * 30]];
  };
  p.ink(421, 'rotring', INK, 1.1);
  p.brush.spline(side(1), 0.3);
  p.brush.spline(side(-1), 0.3);
  p.ink(422, 'rotring', INK, 1.1);
  p.brush.spline(Array.from({length: 9}, (_, i): Pt => [T[0] + 28 * Math.cos(along - Math.PI / 2 + (Math.PI * i) / 8), T[1] + 28 * Math.sin(along - Math.PI / 2 + (Math.PI * i) / 8)]), 0.4);
  p.ink(423, 'rotring', '#9c6f52', 0.8);
  p.brush.spline([...nail, nail[0]], 0.3);
  p.ink(424, 'rotring', '#9c6f52', 0.8);
  p.brush.spline([[K[0] - nx * 18, K[1] - ny * 18], [K[0] + Math.cos(along) * 10 - nx * 4, K[1] + Math.sin(along) * 10 - ny * 4]], 0.4); // knuckle crease
};

// ------------------------------------------------------------------ SVG screen (L2)

const FogPhoto = ({x, y, w, h, uid}: {x: number; y: number; w: number; h: number; uid: string}) => (
  <g transform={`translate(${x} ${y})`} clipPath={`url(#${uid}cc)`}>
    <rect width={w} height={h} rx={14} fill={`url(#${uid}fg)`} />
    {/* A generic skyline barely visible through the fog (no landmark, no sign), softened like a photo in haze. */}
    <g opacity={0.3} fill="#7f8b88" filter={`url(#${uid}bl)`}>
      {[0.04, 0.13, 0.22, 0.3, 0.41, 0.5, 0.6, 0.69, 0.79, 0.88].map((u, i) => (
        <rect key={i} x={u * w} y={h * (0.48 + 0.16 * hash(i + 500))} width={w * (0.07 + 0.03 * hash(i + 510))} height={h} />
      ))}
      <rect x={w * 0.56} y={h * 0.3} width={w * 0.025} height={h} />
    </g>
    <circle cx={w * 0.3} cy={h * 0.62} r={h * 0.12} fill="#e8dcc0" opacity={0.18} filter={`url(#${uid}bl)`} />
    <rect width={w} height={h} rx={14} fill={`url(#${uid}fv)`} />
    <rect width={w} height={h} rx={14} filter={`url(#${uid}ft)`} opacity={0.45} />
  </g>
);

const Screen = ({f}: {f: number}) => {
  const id = useId().replace(/:/g, '');
  const {x0, y0, x1, y1, r} = SCREEN, W = x1 - x0;
  const {prox, dist, tip} = thumbShape(f);
  const toPts = (pts: Pt[]) => pts.map((q) => q.join(',')).join(' ');
  // Banner: slides in f6-f14 (ease-out, small overshoot), pressed f22-f27, expands into the article f26-f32.
  const inU = seg(f, 6, 14), drop = 1 - (1 - inU) ** 3 + 0.04 * Math.sin(Math.PI * inU);
  const bTop = lerp(y0 - 120, 350, drop), press = f >= 22 && f < 27 ? 0.97 : 1;
  const ex = ease(seg(f, 26, 32));
  const banner = {x: lerp(x0 + 12, x0, ex), y: lerp(bTop, y0, ex), w: lerp(W - 24, W, ex), h: lerp(104, y1 - y0, ex), r: lerp(24, r, ex)};
  const article = seg(f, 28, 33);
  const scroll = -180 * ease(seg(f, 48, 78));
  const cards = [0, 1, 2, 3];
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <defs>
        <clipPath id={`${id}clip`}>
          <rect x={x0} y={y0} width={W} height={y1 - y0} rx={r} />
        </clipPath>
        <mask id={`${id}mask`} maskUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}>
          <rect width={1080} height={1920} fill="#fff" />
          {[prox, dist, tip, ...FINGERTIPS.map(([fx, fy, rx, ry]) => ring(fx, fy, rx, ry, 16))].map((pts, i) => (
            <polygon key={i} points={toPts(pts)} fill="#000" stroke="#000" strokeWidth={5} strokeLinejoin="round" />
          ))}
        </mask>
        <linearGradient id={`${id}wp`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#2e3d47" />
          <stop offset="0.6" stopColor="#4c5a60" />
          <stop offset="1" stopColor="#6c6a63" />
        </linearGradient>
        <linearGradient id={`${id}fg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c5cdca" />
          <stop offset="1" stopColor="#a9b4b1" />
        </linearGradient>
        <linearGradient id={`${id}fv`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9d0cd" stopOpacity={0.55} />
          <stop offset="0.55" stopColor="#b9c2bf" stopOpacity={0.25} />
          <stop offset="1" stopColor="#b2bcb9" stopOpacity={0.6} />
        </linearGradient>
        <clipPath id={`${id}cc`}>
          <rect width={SCREEN.x1 - SCREEN.x0 - 48} height={196} rx={14} />
        </clipPath>
        <filter id={`${id}bl`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation={3.5} />
        </filter>
        <filter id={`${id}ft`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves={3} seed={11} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.78  0 0 0 0 0.82  0 0 0 0 0.8  0 0 0 0.9 -0.25" />
        </filter>
        <linearGradient id={`${id}gl`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0.07} />
          <stop offset="0.45" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <filter id={`${id}sh`} x="-10%" y="-20%" width="120%" height="160%">
          <feDropShadow dx={0} dy={6} stdDeviation={8} floodColor="#000" floodOpacity={0.35} />
        </filter>
      </defs>
      <g clipPath={`url(#${id}clip)`} mask={`url(#${id}mask)`}>
        {/* Home screen: generic wallpaper, status icons, app tiles with plain glyphs (no names, no logos). */}
        <rect x={x0} y={y0} width={W} height={y1 - y0} fill={`url(#${id}wp)`} />
        <circle cx={(x0 + x1) / 2} cy={y0 + 22} r={9} fill="#05070a" />
        <g fill="#e9eef0" opacity={0.85}>
          {[0, 1, 2, 3].map((i) => <rect key={i} x={x0 + 26 + i * 8} y={y0 + 30 - i * 4} width={5} height={6 + i * 4} rx={1} />)}
          <rect x={x1 - 66} y={y0 + 16} width={36} height={17} rx={4} fill="none" stroke="#e9eef0" strokeWidth={2} />
          <rect x={x1 - 63} y={y0 + 19} width={24} height={11} rx={2} />
          <rect x={x1 - 29} y={y0 + 21} width={3} height={7} rx={1} />
        </g>
        {Array.from({length: 16}, (_, i) => {
          const c = i % 4, rr = Math.floor(i / 4), s = 78, gx = x0 + 34 + c * ((W - 68 - s) / 3), gy = y0 + 130 + rr * 112;
          const col = ['#5d7a8c', '#7d8f6a', '#8c6f5d', '#6a6f8c', '#5f8a83', '#8a7f5a', '#6d6d6d', '#7a5f73'][(i * 5) % 8];
          return (
            <g key={i} opacity={0.92}>
              <rect x={gx} y={gy} width={s} height={s} rx={20} fill={col} />
              {i % 4 === 0 && <circle cx={gx + s / 2} cy={gy + s / 2} r={18} fill="none" stroke="#f2f2ee" strokeWidth={5} />}
              {i % 4 === 1 && <rect x={gx + 24} y={gy + 24} width={30} height={30} rx={6} fill="#f2f2ee" />}
              {i % 4 === 2 && <path d={`M${gx + 22} ${gy + 54} L${gx + 39} ${gy + 24} L${gx + 56} ${gy + 54} Z`} fill="#f2f2ee" />}
              {i % 4 === 3 && <path d={`M${gx + 18} ${gy + 42} q 10 -14 21 0 t 21 0`} stroke="#f2f2ee" strokeWidth={5} fill="none" />}
            </g>
          );
        })}
        <rect x={x0 + 22} y={y1 - 128} width={W - 44} height={100} rx={30} fill="#ffffff" opacity={0.14} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={x0 + 48 + i * ((W - 96 - 70) / 3)} y={y1 - 113} width={70} height={70} rx={18} fill={['#6f8a7a', '#7a7d8f', '#8f7c6a', '#5f7f8f'][i]} />)}
        <rect x={(x0 + x1) / 2 - 60} y={y1 - 16} width={120} height={5} rx={3} fill="#e9eef0" opacity={0.7} />

        {/* Notification banner, then the article it opens. */}
        {f >= 6 && (
          <g transform={`translate(${banner.x + banner.w / 2} ${banner.y + 40}) scale(${press}) translate(${-(banner.x + banner.w / 2)} ${-(banner.y + 40)})`}>
            <rect x={banner.x} y={banner.y} width={banner.w} height={banner.h} rx={banner.r} fill={article > 0 ? '#14181a' : '#f2f4f3'} opacity={0.97} filter={`url(#${id}sh)`} />
            {article < 1 && (
              <g opacity={1 - article}>
                {/* Row 1: a generic news-app icon and grey placeholder bars (no app name, no source, no time). */}
                <rect x={banner.x + 16} y={banner.y + 14} width={32} height={32} rx={9} fill="#7f918c" />
                <path d={`M${banner.x + 22} ${banner.y + 25} q 5 -4 10 0 t 10 0 M${banner.x + 22} ${banner.y + 32} q 5 -4 10 0 t 10 0 M${banner.x + 22} ${banner.y + 39} q 5 -4 10 0 t 10 0`} stroke="#eef2f0" strokeWidth={2.4} fill="none" strokeLinecap="round" />
                <rect x={banner.x + 58} y={banner.y + 25} width={92} height={10} rx={5} fill="#a8b0ae" />
                <rect x={banner.x + banner.w - 54} y={banner.y + 25} width={36} height={10} rx={5} fill="#c3c9c7" />
                {/* Row 2: the story text, verbatim, Noto Sans Thai bold 34 px, one line. */}
                <text x={banner.x + 18} y={banner.y + 84} fontFamily="Noto Sans Thai" fontWeight={700} fontSize={34} fill="#15191b" lang="th">{HEADLINE}</text>
                {f >= 22 && f < 30 && <circle cx={banner.x + banner.w * 0.6} cy={banner.y + 40} r={10 + 60 * seg(f, 22, 30)} fill="#000" opacity={0.08 * (1 - seg(f, 22, 30))} />}
              </g>
            )}
          </g>
        )}
        {article > 0 && (
          <g opacity={article}>
            <rect x={x0} y={y0} width={W} height={y1 - y0} fill="#14181a" />
            <g transform={`translate(0 ${scroll})`}>
              {/* Headline 44 px: one line does not fit the screen width, so it breaks at the phrase boundary. */}
              <text x={x0 + 24} y={404} fontFamily="Noto Sans Thai" fontWeight={700} fontSize={44} fill="#f1f3f2" lang="th">หมอกหนาปกคลุม</text>
              <text x={x0 + 24} y={460} fontFamily="Noto Sans Thai" fontWeight={700} fontSize={44} fill="#f1f3f2" lang="th">ทั่วโลก</text>
              <rect x={x0 + 24} y={478} width={150} height={8} rx={4} fill="#5b6466" />
              {cards.map((i) => {
                const cy = 506 + i * 268;
                return (
                  <g key={i}>
                    <FogPhoto x={x0 + 24} y={cy} w={W - 48} h={196} uid={id} />
                    <rect x={x0 + 24} y={cy + 210} width={W - 90} height={11} rx={5} fill="#4a5355" />
                    <rect x={x0 + 24} y={cy + 230} width={200} height={11} rx={5} fill="#3a4244" />
                  </g>
                );
              })}
            </g>
            <rect x={x0} y={y0} width={W} height={52} fill="#14181a" />
            <rect x={x0} y={y0 + 52} width={W} height={1.5} fill="#2c3335" />
            <rect x={x1 - 96} y={y0 + 20} width={64} height={16} rx={8} fill="#6f777a" />
            <path d={`M${x0 + 36} ${y0 + 19} l -10 9 l 10 9`} stroke="#d9dedd" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
        <rect x={x0} y={y0} width={W} height={y1 - y0} fill={`url(#${id}gl)`} />
      </g>
    </svg>
  );
};

/** Screen light falling on the thumb and the fingertips (cool, low, <= GLOW_PEAK). */
const Spill = ({f}: {f: number}) => {
  const id = useId().replace(/:/g, '');
  const [tx, ty] = thumbTip(f);
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none'}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <radialGradient id={id}>
            <stop offset="0" stopColor="#cfe0ff" stopOpacity={0.16} />
            <stop offset="1" stopColor="#cfe0ff" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={tx - 20} cy={ty - 10} r={150} fill={`url(#${id})`} />
        <ellipse cx={530} cy={640} rx={420} ry={520} fill={`url(#${id})`} opacity={0.7} />
      </svg>
    </AbsoluteFill>
  );
};

/** S02-SH02 painted layers (L0 shop, L1 hand + handset) at shot-local frame f. */
export const paintPhone = (p: Painter, f: number) => {
  paintShop(p, f);
  paintHand(p, f);
};

/** S02-SH02 SVG layers (L2 screen masked by the thumb and fingertips, screen spill). */
export const PhoneOverlay = ({f}: {f: number}) => (
  <>
    <Screen f={f} />
    <Spill f={f} />
  </>
);
