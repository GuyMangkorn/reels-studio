import {AbsoluteFill} from 'remotion';
import {hash} from '../kit/hash';
import {camPoint, type YCam} from '../kit/ycam';
import {arrowsAt, bracketAt, fallY, ghostAt, rewindStreakAt, streakAlphaAt} from './clock';

// N8 diagram layer (speed arrows, ghost chip, fall bracket) and the shaft speed streaks: DOM screen layers in frame px, never moving with the camera.
// The ghost figure itself is painted (`story.ts` / `shaft.ts` through the `figure` callback) as a 60 % tint copy of the crouched WOMAN.
export const Pill = ({children, left = 816, top = 148, width = 204, height = 56, fontSize = 30}: {children: string; left?: number; top?: number; width?: number; height?: number; fontSize?: number}) => (
  <div lang="th" style={{position: 'absolute', left, top, width, height, borderRadius: height / 2, background: 'rgba(255,255,255,0.88)', color: '#2b211c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 700, fontSize}}>{children}</div>
);
/** Caption slot CAP (x 48-440, y 150-206): "นิวยอร์ก 1854", "1857". */
export const Cap = ({children}: {children: string}) => <Pill left={48} top={150} width={392} height={56} fontSize={30}>{children}</Pill>;
/** Label slot LBL (x 816-1020, y 148-204): "ภาพประกอบ". */
export const Lbl = ({children = 'ภาพประกอบ'}: {children?: string}) => <Pill>{children}</Pill>;

const Arrow = ({x, len, scale}: {x: number; len: number; scale: number}) => {
  const w = 70, y0 = 700, hh = Math.min(80, len * 0.3), sw = 30, cx = x + w / 2, yh = y0 + len - hh, k = scale;
  const pts = `${cx - (sw / 2) * k},${y0} ${cx + (sw / 2) * k},${y0} ${cx + (sw / 2) * k},${yh} ${cx + (w / 2) * k},${yh} ${cx},${y0 + len} ${cx - (w / 2) * k},${yh} ${cx - (sw / 2) * k},${yh}`;
  return <polygon points={pts} fill="#ffffff" stroke="#2b211c" strokeWidth={5} strokeLinejoin="round" />;
};
/** B02-SH01/SH02 speed arrows: the car's (x 925) and hers (x 505), identical, 70 x 260 px (VD09). */
export const SpeedArrows = ({g}: {g: number}) => {
  const a = arrowsAt(g);
  if (a.car <= 0 && a.her <= 0) return null;
  return <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>{a.car > 1 && <Arrow x={925} len={a.car} scale={a.pulse} />}{a.her > 1 && <Arrow x={505} len={a.her} scale={a.pulse} />}</svg>;
};
/** Chip beside the ghost (x 610-790, y 400-450). */
export const GhostChip = ({g}: {g: number}) => (ghostAt(g).chip ? <Pill left={610} top={400} width={180} height={50} fontSize={26}>−10 กม./ชม.</Pill> : null);

/** B02-SH03 fall bracket on the tower's left (x = tower edge - 36 px): a vertical bracket from the top floor to the ground, with the "ชั้น N" pill. `cam` is the wide camera. */
export const FallBracket = ({cam, g}: {cam: YCam; g: number}) => {
  const b = bracketAt(g), top = camPoint(cam, [-8, b.top, 0]), bot = camPoint(cam, [-8, 0, 0]);
  if (!top || !bot) return null;
  const x = top[0] - 36, y0 = top[1], y1 = bot[1];
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <polyline points={`${x + 18},${y0} ${x},${y0} ${x},${y1} ${x + 18},${y1}`} fill="none" stroke="#2b211c" strokeWidth={11} strokeLinejoin="round" />
        <polyline points={`${x + 18},${y0} ${x},${y0} ${x},${y1} ${x + 18},${y1}`} fill="none" stroke="#ffffff" strokeWidth={6} strokeLinejoin="round" />
      </svg>
      <Pill left={x - 150} top={y0 - 20} width={140} height={44} fontSize={26}>{`ชั้น ${b.floor}`}</Pill>
    </AbsoluteFill>
  );
};

/** Shaft speed streaks (R1.2): screen-aligned strokes over the shaft only, never over the car (`car` = [x0, y0, x1, y1] px), alpha from `streakAlphaAt` (or `alpha`), length = px/frame x 3, scrolled upward by the fall so they stream. `r` = the shot's orbit radius (px/m = 2600 / r). */
export const ShaftStreaks = ({g, r, car, alpha}: {g: number; r: number; car: [number, number, number, number]; alpha?: number}) => {
  const a = alpha ?? streakAlphaAt(g);
  if (a <= 0) return null;
  const pxm = 2600 / r, ppf = Math.max(2, (fallY(g - 1) - fallY(g)) * pxm), len = Math.round(ppf * 3), scroll = (fallY(39) - fallY(g)) * pxm, items: {x: number; y: number; w: number; c: string}[] = [];
  const H = 1920 + len;
  for (let i = 0; items.length < 12 && i < 300; i++) {
    const x = Math.round(hash(i * 5 + 11) * 1060 + 10), w = 2 + Math.round(hash(i * 3 + 7) * 2), y = ((hash(i * 9 + 3) * H + scroll * (0.8 + 0.4 * hash(i))) % H) - len;
    if (x + w > car[0] - 6 && x < car[2] + 6 && y + len > car[1] - 6 && y < car[3] + 6) continue;
    items.push({x, y, w, c: i % 4 === 0 ? '#ffe9b0' : '#dfe6ec'});
  }
  return <>{items.map((q, i) => <div key={i} style={{position: 'absolute', left: q.x, top: Math.round(q.y), width: q.w, height: len, borderRadius: q.w / 2, background: q.c, opacity: a}} />)}</>;
};
/** Rewind streaks (B05-SH01, G1325-1340): thin full-width strokes, 5 % base to 15 % peak. */
export const RewindStreaks = ({g}: {g: number}) => {
  const a = rewindStreakAt(g);
  return a > 0 ? <AbsoluteFill style={{pointerEvents: 'none'}}>{Array.from({length: 26}, (_, i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 40 + i * 73 + (i % 3) * 11, height: 2 + (i % 2), background: `rgba(255,255,255,${a})`}} />)}</AbsoluteFill> : null;
};
