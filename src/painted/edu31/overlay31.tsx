import type {CSSProperties, ReactNode} from 'react';
import type {Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, type YCam} from '../kit/ycam';
import type {WorldText} from './set31';

// EDU-EP31-SHORT shared screen layers (Boss W5.2 batch 1, 2026-11-21): one home for the DOM layers the W3 look frames (look.tsx) and the
// registered plates (shot.tsx) both draw: world text mapped through the shot camera, the VD31-12/-19 joke label plate (with its soft pop-in and
// optional arrow), the warm lamp pool, the edge vignette and the off-frame flash wash. Pure functions of their props (no state).

/** CSS matrix3d mapping a w x h element onto the picture quad p0..p3 (top-left, top-right, bottom-right, bottom-left). */
export const quadMatrix = (w: number, h: number, [p0, p1, p2, p3]: Pt[]): string => {
  const dx1 = p1[0] - p2[0], dx2 = p3[0] - p2[0], dx3 = p0[0] - p1[0] + p2[0] - p3[0];
  const dy1 = p1[1] - p2[1], dy2 = p3[1] - p2[1], dy3 = p0[1] - p1[1] + p2[1] - p3[1];
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den, hh = (dx1 * dy3 - dx3 * dy1) / den;
  const a = p1[0] - p0[0] + g * p1[0], b = p3[0] - p0[0] + hh * p3[0], c = p0[0];
  const d = p1[1] - p0[1] + g * p1[1], e = p3[1] - p0[1] + hh * p3[1], f = p0[1];
  return `matrix3d(${a / w},${d / w},0,${g / w},${b / h},${e / h},0,${hh / h},0,0,1,0,${c},${f},0,1)`;
};
export const projectQuad = (c: YCam, q: V3[]): Pt[] | null => {
  const pts = q.map((v) => camPoint(c, v));
  return pts.every(Boolean) ? (pts as Pt[]) : null;
};
export const onQuad = (c: YCam, corners: V3[], w: number, h: number, child: ReactNode, style: CSSProperties = {}, key?: string) => {
  const pts = projectQuad(c, corners);
  if (!pts) return null;
  return <div key={key} style={{position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: '0 0', transform: quadMatrix(w, h, pts), ...style}}>{child}</div>;
};

/** English signage (TELLERS, JANUARY 1995, TELLER 1-3) as DOM text on world rectangles, through the shot camera. */
export const WorldTexts = ({cam, texts}: {cam: YCam; texts: WorldText[]}) => (
  <>
    {texts.map((t, i) => {
      const [a, b, , d] = t.corners, wm = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]), hm = Math.hypot(d[0] - a[0], d[1] - a[1], d[2] - a[2]);
      const W = 1000, H = (W * hm) / wm, fs = Math.min(H * 0.92, W / (t.text.length * 0.68));
      return onQuad(cam, t.corners, W, H, <div style={{width: W, height: H, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: t.font ?? "'Arial Black', 'Helvetica Neue', Arial, sans-serif", fontWeight: t.weight ?? 800, fontSize: fs, lineHeight: 1, color: t.color, letterSpacing: fs * 0.04, whiteSpace: 'nowrap'}}>{t.text}</div>, {opacity: 0.94}, `t${i}`);
    })}
  </>
);

/** VD31-19 joke label: text, left x or centred, top y, font px, optional hand-drawn arrow (picture px, three points). */
export type Tag31 = {text: string; x?: number; y: number; size: number; center?: boolean; arrow?: [number, number][]};
/** VD31-19 joke label (R6): cream Thai on a dark translucent rounded plate, outside every screen layer; the arrow is a soft hand-drawn stroke.
 *  `pop` 0..1 is the soft pop-in (scale 0.8 -> 1, a small overshoot, readable from its first frame), 1 = settled. */
export const TagPlate = ({tag, pop = 1}: {tag: Tag31; pop?: number}) => {
  const k = Math.max(0, Math.min(1, pop)), s = 0.8 + 0.2 * (1 - (1 - k) * (1 - k)) + 0.04 * Math.sin(Math.PI * k);
  const plate = <span lang="th" style={{display: 'inline-block', fontFamily: 'Noto Sans Thai', fontWeight: 700, fontSize: tag.size, lineHeight: 1.25, color: '#f6ecd2',
    background: 'rgba(22,15,10,0.78)', padding: `${tag.size * 0.22}px ${tag.size * 0.55}px`, borderRadius: tag.size * 0.42, boxShadow: '0 3px 10px rgba(0,0,0,0.35)',
    transform: k < 1 ? `scale(${s})` : undefined}}>{tag.text}</span>;
  const a = tag.arrow;
  return (
    <>
      <div style={tag.center ? {position: 'absolute', left: 0, right: 0, top: tag.y, display: 'flex', justifyContent: 'center'} : {position: 'absolute', left: tag.x ?? 120, top: tag.y}}>{plate}</div>
      {a && a.length > 2 && (() => {
        const [p0, p1, p2] = a, ang = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]), L = 16;
        const h1 = [p2[0] - L * Math.cos(ang - 0.5), p2[1] - L * Math.sin(ang - 0.5)], h2 = [p2[0] - L * Math.cos(ang + 0.5), p2[1] - L * Math.sin(ang + 0.5)];
        return <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
          <g fill="none" stroke="#f6ecd2" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" style={{filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.5))'}}>
            <path d={`M${p0[0]},${p0[1]} Q${p1[0]},${p1[1]} ${p2[0]},${p2[1]}`} />
            <path d={`M${h1[0]},${h1[1]} L${p2[0]},${p2[1]} L${h2[0]},${h2[1]}`} />
          </g>
        </svg>;
      })()}
    </>
  );
};

/** Warm lamp pool: a smooth screen-space light (picture px centre, radius, rgb triple, peak opacity), mix-blend screen. */
export type Pool31 = {x: number; y: number; r: number; color: string; op: number};
export const PoolLayer = ({pool}: {pool: Pool31}) => (
  <div style={{position: 'absolute', left: pool.x - pool.r, top: pool.y - pool.r, width: pool.r * 2, height: pool.r * 2, borderRadius: '50%', mixBlendMode: 'screen',
    background: `radial-gradient(circle, rgba(${pool.color},${pool.op}) 0%, rgba(${pool.color},${pool.op * 0.45}) 35%, transparent 70%)`}} />
);
export const VignetteLayer = ({amount}: {amount: number}) => (
  <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 38%, transparent 42%, rgba(8,6,4,${amount}) 100%)`}} />
);
/** Off-frame flash light (B03-SH02): a white-warm wash blooming from one screen edge, `op` peak opacity at the edge, falling off by `reach` px. */
export const FlashWash = ({op, side = 'left', reach = 620, y = 700}: {op: number; side?: 'left' | 'right'; reach?: number; y?: number}) => op <= 0 ? null : (
  <div style={{position: 'absolute', inset: 0, mixBlendMode: 'screen', pointerEvents: 'none',
    background: `radial-gradient(ellipse ${reach}px ${reach * 1.5}px at ${side === 'left' ? 0 : 1080}px ${y}px, rgba(255,246,222,${op}) 0%, rgba(255,236,200,${op * 0.55}) 40%, transparent 100%)`}} />
);
