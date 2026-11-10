// Screen layers of EDU-EP14 (N9, N10; Remotion DOM/SVG above the painted canvas, the series practice): label slot LBL, the "~2 กม." bracket with its dotted fall line, pin and ring
// markers, the up and "น้ำหนัก" arrows, and the real speed dial (0-50, only "30" and "กม./ชม."). Look-frame versions: static, a pure function of their props (the clocks come with W5.2).
import type {CSSProperties} from 'react';
import {C} from './palette';

const FONT = "'Noto Sans Thai', sans-serif";
const edu = (size: number, color = '#ffffff', stroke = 8): CSSProperties => ({fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, WebkitTextStroke: `${stroke}px ${C.ink}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'});

/** LBL slot (816-1020 x 148-204): "ภาพจำลอง". */
export const Lbl = ({text = 'ภาพจำลอง'}: {text?: string}) => (
  <div lang="th" style={{position: 'absolute', left: 816, top: 148, width: 204, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', ...edu(40, '#ffffff', 6)}}>{text}</div>
);

/** The "~2 กม." bracket at the left of the column (x 100-180) from the cloud base to the ground, its label beside it, the dotted fall line to the pin and a ring marker on the line. */
export const ColumnDiagram = ({baseY, groundY, pinX = 540, label = true, ringAt = 0.1, bracket = 1, dotted = 1, pin = true}: {baseY: number; groundY: number; pinX?: number; label?: boolean; ringAt?: number; bracket?: number; dotted?: number; pin?: boolean}) => {
  const mid = (baseY + groundY) / 2, ry = baseY + (groundY - baseY) * ringAt, br = `M 180 ${baseY} L 130 ${baseY} L 130 ${groundY} L 180 ${groundY}`;
  const y2 = baseY + 8 + (groundY - 56 - baseY - 8) * dotted, dash = {pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - bracket};
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {bracket > 0 && <g strokeLinecap="round" fill="none"><path d={br} stroke={C.ink} strokeWidth={13} {...dash} /><path d={br} stroke="#ffffff" strokeWidth={6} {...dash} />{bracket >= 1 && <><line x1={130} y1={mid} x2={100} y2={mid} stroke={C.ink} strokeWidth={13} /><line x1={130} y1={mid} x2={100} y2={mid} stroke="#ffffff" strokeWidth={6} /></>}</g>}
        {dotted > 0 && <><line x1={pinX} y1={baseY + 8} x2={pinX} y2={y2} stroke={C.ink} strokeWidth={9} strokeLinecap="round" strokeDasharray="1 22" />
        <line x1={pinX} y1={baseY + 8} x2={pinX} y2={y2} stroke="#ffffff" strokeWidth={5} strokeLinecap="round" strokeDasharray="1 22" /></>}
        <circle cx={pinX} cy={ry} r={22} fill="none" stroke={C.ink} strokeWidth={9} /><circle cx={pinX} cy={ry} r={22} fill="none" stroke="#ffffff" strokeWidth={5} />
        <circle cx={pinX} cy={ry} r={6} fill={C.drop} stroke="#ffffff" strokeWidth={2} />
        {pin && <g transform={`translate(${pinX} ${groundY})`}>
          <path d="M 0 0 C -4 -14 -17 -22 -17 -36 A 17 17 0 1 1 17 -36 C 17 -22 4 -14 0 0 Z" fill="#e9503f" stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
          <circle cx={0} cy={-36} r={6.5} fill="#ffffff" />
        </g>}
      </svg>
      {label && <div lang="th" style={{position: 'absolute', left: 205, top: mid - 40, ...edu(76)}}>~2 กม.</div>}
    </>
  );
};

/** Ring marker (white chalk circle, ink edge) of diameter `d` at (x, y). */
export const Ring = ({x, y, d = 100}: {x: number; y: number; d?: number}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    <circle cx={x} cy={y} r={d / 2} fill="none" stroke={C.ink} strokeWidth={9} /><circle cx={x} cy={y} r={d / 2} fill="none" stroke="#ffffff" strokeWidth={5} />
  </svg>
);

/** Vertical arrow of `len` px with its tail at (x, y0): `dir` up or down. Up: white 80 %; down ("น้ำหนัก"): amber. Ink edge. */
export const Arrow = ({x, y0, len, dir, color, label}: {x: number; y0: number; len: number; dir: 'up' | 'down'; color: string; label?: string}) => {
  const s = dir === 'up' ? -1 : 1, y1 = y0 + s * len, hw = 22, hh = 40, w = 11;
  const pts = [[x - w, y0], [x - w, y1 - s * hh], [x - hw, y1 - s * hh], [x, y1], [x + hw, y1 - s * hh], [x + w, y1 - s * hh], [x + w, y0]].map((q) => q.join(',')).join(' ');
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}><polygon points={pts} fill={color} fillOpacity={dir === 'up' ? 0.8 : 1} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" /></svg>
      {label && <div lang="th" style={{position: 'absolute', left: x + 34, top: y0 + (s * len) / 2 - 26, ...edu(52, C.amber, 8)}}>{label}</div>}
    </>
  );
};

/** Real speed dial (G1: centre (790, 860), r 160): 0-50, ticks every 5 (major every 10), only "30" numbered, "กม./ชม." under the hub; needle A (amber) at `a`. */
export const RealDial = ({a = 32, cx = 790, cy = 860, r = 160}: {a?: number; cx?: number; cy?: number; r?: number}) => {
  const ang = (v: number) => ((225 - (v / 50) * 270) * Math.PI) / 180, pt = (v: number, rr: number) => [cx + rr * Math.cos(ang(v)), cy - rr * Math.sin(ang(v))];
  const t = pt(a, r - 22), b = pt(a + 25, 14), n30 = pt(30, r - 62);
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <circle cx={cx} cy={cy} r={r} fill={C.realFace} fillOpacity={0.75} stroke={C.ink} strokeWidth={8} />
        <circle cx={cx} cy={cy} r={r - 6} fill="none" stroke={C.realTick} strokeOpacity={0.5} strokeWidth={2} />
        {Array.from({length: 11}, (_, i) => i * 5).map((v) => { const maj = v % 10 === 0, p0 = pt(v, r - (maj ? 34 : 22)), p1 = pt(v, r - 10); return <line key={v} x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke={C.realTick} strokeWidth={maj ? 4 : 2.2} strokeLinecap="round" />; })}
        <line x1={b[0]} y1={b[1]} x2={t[0]} y2={t[1]} stroke={C.ink} strokeWidth={11} strokeLinecap="round" />
        <line x1={b[0]} y1={b[1]} x2={t[0]} y2={t[1]} stroke={C.needleA} strokeWidth={6} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={11} fill={C.needleA} stroke={C.ink} strokeWidth={3} />
      </svg>
      <div lang="th" style={{position: 'absolute', left: n30[0] - 30, top: n30[1] - 20, width: 60, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 38, color: C.realTick, lineHeight: 1}}>30</div>
      <div lang="th" style={{position: 'absolute', left: cx - 70, top: cy + 50, width: 140, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 24, color: C.realTick, lineHeight: 1}}>กม./ชม.</div>
    </>
  );
};

// ---- N10 remaining diagram parts (B01-SH08, B03, B04): sting glyph (N7), teardrop icon + cross, bun/bag outlines, the 5 mm ruler with its label.
/** Sting glyph (N7): a pale-yellow starburst `#fff1a8` with an ink edge, radius `r` px, popping 0 -> 1 (scale 0.4 -> 1, then settles). */
export const StingGlyph = ({x, y, r = 46, pop = 1, rot = 0}: {x: number; y: number; r?: number; pop?: number; rot?: number}) => {
  if (pop <= 0) return null;
  const pts = Array.from({length: 16}, (_, i) => { const a = (i / 16) * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? r * 0.52 : r; return `${Math.cos(a) * rr},${Math.sin(a) * rr}`; }).join(' ');
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: Math.min(1, pop * 2)}}>
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${0.4 + 0.6 * Math.min(1, pop)})`}>
        <polygon points={pts} fill="#fff1a8" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
      </g>
    </svg>
  );
};

/** White teardrop icon (the false "teardrop" picture) of height `h` at its centre (x, y), with an optional red cross (`cross` 0..1 draws the two strokes). */
export const TeardropIcon = ({x, y, h = 220, cross = 0}: {x: number; y: number; h?: number; cross?: number}) => {
  const s = h / 100, d = 'M 0 -50 C -6 -30 -34 -14 -34 14 A 34 34 0 1 0 34 14 C 34 -14 6 -30 0 -50 Z';
  const c1 = Math.min(1, cross * 2), c2 = Math.max(0, cross * 2 - 1);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d={d} fill="#ffffff" stroke={C.ink} strokeWidth={4 / s * 1.6} strokeLinejoin="round" />
        <ellipse cx={-12} cy={22} rx={6} ry={9} fill={C.drop} opacity={0.7} />
        {cross > 0 && <g strokeLinecap="round" fill="none">
          <line x1={-52} y1={-52} x2={-52 + 104 * c1} y2={-52 + 104 * c1} stroke={C.ink} strokeWidth={22} /><line x1={52} y1={-52} x2={52 - 104 * c2} y2={-52 + 104 * c2} stroke={C.ink} strokeWidth={22} />
          <line x1={-52} y1={-52} x2={-52 + 104 * c1} y2={-52 + 104 * c1} stroke="#e9503f" strokeWidth={13} /><line x1={52} y1={-52} x2={52 - 104 * c2} y2={-52 + 104 * c2} stroke="#e9503f" strokeWidth={13} />
        </g>}
      </g>
    </svg>
  );
};

/** White dashed outline of a drop shape (bun / bag), `pts` already in picture px, popping in over `pop` 0..1 (stroke-dash draw). */
export const DashedOutline = ({pts, pop = 1}: {pts: [number, number][]; pop?: number}) => {
  if (pop <= 0) return null;
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + ' Z';
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: Math.min(1, pop * 2.2)}}>
      <path d={d} fill="none" stroke={C.ink} strokeWidth={11} strokeLinejoin="round" strokeDasharray="22 16" />
      <path d={d} fill="none" stroke="#ffffff" strokeWidth={6} strokeLinejoin="round" strokeDasharray="22 16" />
    </svg>
  );
};

/** The 5 mm ruler: a white bar `len` px wide with end ticks centred at (x, y), and the label under it ("ส่วนใหญ่ไม่เกินราวครึ่งเซน"), both appear over `pop`. */
export const Ruler = ({x, y, len, pop = 1, label = 'ส่วนใหญ่ไม่เกินราวครึ่งเซน'}: {x: number; y: number; len: number; pop?: number; label?: string | false}) => {
  if (pop <= 0) return null;
  const x0 = x - len / 2, x1 = x + len / 2;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: Math.min(1, pop * 2)}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <g strokeLinecap="round">
          <line x1={x0} y1={y} x2={x1} y2={y} stroke={C.ink} strokeWidth={16} /><line x1={x0} y1={y - 22} x2={x0} y2={y + 22} stroke={C.ink} strokeWidth={14} /><line x1={x1} y1={y - 22} x2={x1} y2={y + 22} stroke={C.ink} strokeWidth={14} />
          <line x1={x0} y1={y} x2={x1} y2={y} stroke="#ffffff" strokeWidth={8} /><line x1={x0} y1={y - 22} x2={x0} y2={y + 22} stroke="#ffffff" strokeWidth={6} /><line x1={x1} y1={y - 22} x2={x1} y2={y + 22} stroke="#ffffff" strokeWidth={6} />
        </g>
      </svg>
      {label && <div lang="th" style={{position: 'absolute', left: 0, right: 0, top: y + 40, textAlign: 'center', ...edu(54, '#ffffff', 9)}}>{label}</div>}
    </div>
  );
};

/** Three or more small up-arrows pressing on a drop from below (macro): n arrows of `len` px, spread `gap` px, tails at y0. `grow` 0..1 scales them. */
export const PressArrows = ({x, y0, n = 3, gap = 90, len = 120, grow = 1}: {x: number; y0: number; n?: number; gap?: number; len?: number; grow?: number}) => (
  <>{Array.from({length: n}, (_, i) => <Arrow key={i} x={x + (i - (n - 1) / 2) * gap} y0={y0} len={Math.max(1, len * grow)} dir="up" color={C.white} />)}</>
);

/** N7 BB ghost as a screen layer (above the grade, so it stays orange in the grey no-air world): 6 mm ball `r` px, flat ink, 85 % opaque. */
export const BBBall = ({x, y, r}: {x: number; y: number; r: number}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    <g transform={`translate(${x} ${y})`} opacity={0.85}>
      <circle r={r} fill="#f08a3c" />
      <path d={`M ${-r * 0.8} ${r * 0.5} A ${r} ${r} 0 0 0 ${r * 0.8} ${r * 0.5} A ${r * 0.8} ${r * 0.7} 0 0 1 ${-r * 0.8} ${r * 0.5} Z`} fill="#c9611f" />
      <ellipse cx={-r * 0.2} cy={-r * 0.25} rx={r * 0.5} ry={r * 0.44} fill="#ffc88a" opacity={0.7} />
      <ellipse cx={-r * 0.4} cy={-r * 0.48} rx={r * 0.2} ry={r * 0.11} fill="#ffffff" transform={`rotate(-30 ${-r * 0.4} ${-r * 0.48})`} />
      <circle r={r} fill="none" stroke="#7a3410" strokeWidth={Math.max(3, r / 22)} />
    </g>
  </svg>
);
