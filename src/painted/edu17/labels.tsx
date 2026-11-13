// EDU-EP17 screen labels (N14; Remotion DOM/SVG above the painted canvas, the series practice of EP14 `edu14/diagram.tsx`): the slots LBL, LBL-W and LBL2, and
// world-anchored labels (OT02, OT03, OT06) with a leader line from a projected point. One text per slot (DF-20261030-painted-label-slots); DOM labels never over a face
// and never in the caption band (caption-zone rule). Pure functions of their props, so a seek or a render gives the same pixels.
import type {CSSProperties} from 'react';
import {Lbl} from '../edu14/diagram';
import {C} from '../edu14/palette';
import {gProject, type GCam} from './geo';

const FONT = "'Noto Sans Thai', sans-serif";
export const labelStyle = (size: number, color = '#ffffff', stroke = 8): CSSProperties => ({fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1.1, WebkitTextStroke: `${stroke}px ${C.ink}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'});

/** Slot rectangles (px on the 1080 x 1920 picture): brief frame zones. */
export const SLOTS = {
  LBL: {x: 816, y: 148, w: 204, h: 56},
  'LBL-W': {x: 600, y: 148, w: 420, h: 88},
  LBL2: {x: 60, y: 160, w: 460, h: 68},
} as const;
export type SlotId = keyof typeof SLOTS;
/** Zones a world-anchored label keeps out of: the caption band, the channel mark (@TamMaiLa, x < 330, y < 140) and the three slots. */
export const KEEP_OUT = {caption: {x: 0, y: 1176, w: 1080, h: 168}, mark: {x: 0, y: 0, w: 330, h: 140}, slots: Object.values(SLOTS)};

/** LBL (816-1020 x 148-204): "ภาพจำลอง" (the EP14 component). */
export const LBL = Lbl;
/** LBL-W (600-1020 x 148-236): OT01, one or two lines, right-aligned in the slot. `lines` replaces `text`; `fade` is the cross-fade from LBL (0-1). */
export const LBLW = ({lines = ['ยืนแน่นประมาณ 4 คน/ตร.ม.', 'ภาพจำลอง'], fade = 1}: {lines?: string[]; fade?: number}) => (
  <div lang="th" style={{position: 'absolute', left: SLOTS['LBL-W'].x, top: SLOTS['LBL-W'].y, width: SLOTS['LBL-W'].w, height: SLOTS['LBL-W'].h, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', opacity: fade, ...labelStyle(lines.length > 1 ? 38 : 40, '#ffffff', 6)}}>
    {lines.map((t, i) => <div key={i}>{t}</div>)}
  </div>
);
/** LBL2 (60-520 x 160-228): OT05 under the channel mark. */
export const LBL2 = ({text, fade = 1}: {text: string; fade?: number}) => (
  <div lang="th" style={{position: 'absolute', left: SLOTS.LBL2.x, top: SLOTS.LBL2.y, width: SLOTS.LBL2.w, height: SLOTS.LBL2.h, display: 'flex', alignItems: 'center', opacity: fade, ...labelStyle(50, '#ffffff', 7)}}>{text}</div>
);

const rectsOverlap = (a: {x: number; y: number; w: number; h: number}, b: {x: number; y: number; w: number; h: number}) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
const estWidth = (text: string, size: number) => text.length * size * 0.52;

export type LabelLayout = {anchor: [number, number]; box: {x: number; y: number; w: number; h: number}; leader: [[number, number], [number, number]]; visible: boolean; clamped: boolean};
/**
 * Where a world-anchored label sits: the text box is placed with its near edge at `to` (default 150 px up-right of the anchor) and clamped into the frame
 * (x 24-1056, y 150-1160 minus the box) so it never reaches the caption band, the channel mark or a slot; the leader runs from a 14 px gap outside the anchor to the
 * box edge. `visible` is false when the anchor is off the picture (the label then draws nothing).
 */
export const layoutLabel = (anchor: [number, number], text: string, o: {size?: number; to?: [number, number]; side?: 'right' | 'left'; w?: number} = {}): LabelLayout => {
  const size = o.size ?? 52, w = o.w ?? estWidth(text, size), h = size * 1.15, side = o.side ?? 'right';
  const to = o.to ?? [anchor[0] + (side === 'right' ? 150 : -150), anchor[1] - 110];
  let x = side === 'right' ? to[0] : to[0] - w, y = to[1] - h / 2;
  const cx = Math.min(1056 - w, Math.max(24, x)), cy = Math.min(1160 - h, Math.max(150, y));
  let clamped = cx !== x || cy !== y;
  x = cx; y = cy;
  let box = {x, y, w, h};
  for (let pass = 0; pass < 8; pass++) {
    const hit = [KEEP_OUT.caption, KEEP_OUT.mark, ...KEEP_OUT.slots].find((k) => rectsOverlap(box, k));
    if (!hit) break;
    y = hit === KEEP_OUT.caption ? hit.y - h - 4 : hit.y + hit.h + 4; box = {x, y, w, h}; clamped = true; // away from the zone, then re-check the others
  }
  const ex = side === 'right' ? box.x : box.x + box.w, ey = box.y + box.h / 2;
  const dx = ex - anchor[0], dy = ey - anchor[1], d = Math.hypot(dx, dy) || 1, gap = Math.min(14, d / 2);
  return {anchor, box, leader: [[anchor[0] + (dx / d) * gap, anchor[1] + (dy / d) * gap], [ex, ey]], visible: anchor[0] > -20 && anchor[0] < 1100 && anchor[1] > -20 && anchor[1] < 1940, clamped};
};

/**
 * A label anchored to a projected point (OT02 province names, OT03 beside the square, OT06 on the dot): the anchor is a picture point the caller took from the shot
 * camera that frame (`gProject` for G, `camPoint` for S). `k` 0-1 pops it in (scale 0.8 -> 1, opacity); `ring` draws a small ring at the anchor; `lineWidth` px.
 */
export const AnchoredLabel = ({anchor, text, size = 52, to, side, w, k = 1, ring = true, lineWidth = 3, color = '#ffffff', lineColor = '#ffffff'}: {anchor: [number, number]; text: string; size?: number; to?: [number, number]; side?: 'right' | 'left'; w?: number; k?: number; ring?: boolean; lineWidth?: number; color?: string; lineColor?: string}) => {
  const L = layoutLabel(anchor, text, {size, to, side, w});
  if (!L.visible || k <= 0) return null;
  const e = 0.8 + 0.2 * Math.min(1, k), o = Math.min(1, k * 2);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: o, pointerEvents: 'none'}}>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={L.leader[0][0]} y1={L.leader[0][1]} x2={L.leader[1][0]} y2={L.leader[1][1]} stroke={C.ink} strokeWidth={lineWidth + 3} strokeLinecap="round" />
        <line x1={L.leader[0][0]} y1={L.leader[0][1]} x2={L.leader[1][0]} y2={L.leader[1][1]} stroke={lineColor} strokeWidth={lineWidth} strokeLinecap="round" />
        {ring && <><circle cx={anchor[0]} cy={anchor[1]} r={9} fill="none" stroke={C.ink} strokeWidth={6} /><circle cx={anchor[0]} cy={anchor[1]} r={9} fill="none" stroke={lineColor} strokeWidth={3} /></>}
      </svg>
      <div lang="th" style={{position: 'absolute', left: L.box.x, top: L.box.y, width: L.box.w, height: L.box.h, display: 'flex', alignItems: 'center', justifyContent: L.leader[1][0] === L.box.x ? 'flex-start' : 'flex-end', transform: `scale(${e})`, transformOrigin: L.leader[1][0] === L.box.x ? 'left center' : 'right center', ...labelStyle(size, color, Math.round(size * 0.14))}}>{text}</div>
    </div>
  );
};

/** A label anchored to a geographic point of `G`: projects (lat, lon) through the shot's `gcam` and hands the picture point to `AnchoredLabel`. */
export const GeoLabel = ({cam, lat, lon, ...rest}: {cam: GCam; lat: number; lon: number} & Omit<Parameters<typeof AnchoredLabel>[0], 'anchor'>) => {
  const p = gProject(cam, lat, lon);
  return p.visible ? <AnchoredLabel anchor={[p.x, p.y]} {...rest} /> : null;
};
