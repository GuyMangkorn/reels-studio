// EDU-EP14 speed gauges (N9; brief VD07, VD16, VD17): screen layers (Remotion DOM/SVG above the painted canvas, never graded), pure functions of their props;
// the needle clocks are in `clock.ts`. The no-air dial (0-700, numerals every 100, "แบบจำลอง", "กม./ชม.", red past 500, pop-in and slam scale) in slot G1 centre (790, 860)
// r 160, and the split real dial (0-50, only "30", "กม./ชม.", needle A amber, needle B pale blue, outside labels) in G2 centre (540, 470) r 230. The single real dial
// (G1, B02-SH02) is `RealDial` in diagram.tsx.
import type {CSSProperties} from 'react';
import {C} from './palette';

const FONT = "'Noto Sans Thai', sans-serif";
const ang = (v: number, max: number) => ((225 - (v / max) * 270) * Math.PI) / 180;
const edu = (size: number, color = '#ffffff', stroke = 8): CSSProperties => ({fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, WebkitTextStroke: `${stroke}px ${C.ink}`, paintOrder: 'stroke fill'});
const NOAIR = {face: '#171d20', tick: '#e3eaec', red: '#e9503f', needle: '#ffffff'} as const;

export type NoAirDialProps = {
  /** Needle value 0-700. */
  v: number;
  /** Pop-in 0..1 (scale from 0.6 with fade). */
  pop?: number;
  /** Slam scale-up 0..1 (x1 -> x1.5, centre moves to the frame centre). */
  slam?: number;
  cx?: number; cy?: number; r?: number;
  /** Shows "แบบจำลอง" under the hub (always true in the film; false for tests). */
  tag?: boolean;
};
export const NoAirDial = ({v, pop = 1, slam = 0, cx = 790, cy = 860, r = 160, tag = true}: NoAirDialProps) => {
  if (pop <= 0) return null;
  const k = (0.6 + 0.4 * pop) * (1 + 0.5 * slam), X = cx + (540 - cx) * slam, Y = cy + (900 - cy) * slam;
  const pt = (val: number, rr: number) => [Math.cos(ang(val, 700)) * rr, -Math.sin(ang(val, 700)) * rr];
  const arc = (a: number, b: number, rr: number) => { const p0 = pt(a, rr), p1 = pt(b, rr); return `M ${p0[0]} ${p0[1]} A ${rr} ${rr} 0 0 1 ${p1[0]} ${p1[1]}`; };
  const t = pt(Math.max(0, Math.min(700, v)), r - 24), b = pt(Math.max(0, Math.min(700, v)) + 350, 16);
  return (
    <div style={{position: 'absolute', left: X - r - 20, top: Y - r - 20, width: 2 * r + 40, height: 2 * r + 40, transform: `scale(${k})`, opacity: Math.min(1, pop * 1.6)}}>
      <svg width={2 * r + 40} height={2 * r + 40} viewBox={`${-r - 20} ${-r - 20} ${2 * r + 40} ${2 * r + 40}`} style={{position: 'absolute', inset: 0}}>
        <circle r={r} fill={NOAIR.face} fillOpacity={0.82} stroke={C.ink} strokeWidth={8} />
        <circle r={r - 6} fill="none" stroke={NOAIR.tick} strokeOpacity={0.5} strokeWidth={2} />
        <path d={arc(500, 700, r - 18)} fill="none" stroke={NOAIR.red} strokeWidth={9} strokeLinecap="butt" />
        {Array.from({length: 15}, (_, i) => i * 50).map((val) => {
          const maj = val % 100 === 0, p0 = pt(val, r - (maj ? 34 : 22)), p1 = pt(val, r - 10);
          return <line key={val} x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke={val > 500 ? '#ffd0c8' : NOAIR.tick} strokeWidth={maj ? 4 : 2} strokeLinecap="round" />;
        })}
        {Array.from({length: 8}, (_, i) => i * 100).map((val) => { const q = pt(val, r - 56); return <text key={val} x={q[0]} y={q[1] + 9} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={val === 0 ? 26 : 26} fill={val > 500 ? '#ffb4a8' : NOAIR.tick}>{val}</text>; })}
        <line x1={b[0]} y1={b[1]} x2={t[0]} y2={t[1]} stroke={C.ink} strokeWidth={12} strokeLinecap="round" />
        <line x1={b[0]} y1={b[1]} x2={t[0]} y2={t[1]} stroke={v > 500 ? NOAIR.red : NOAIR.needle} strokeWidth={6} strokeLinecap="round" />
        <circle r={11} fill={NOAIR.needle} stroke={C.ink} strokeWidth={3} />
      </svg>
      <div lang="th" style={{position: 'absolute', left: 0, right: 0, top: r + 20 + 40, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 24, color: NOAIR.tick, lineHeight: 1}}>กม./ชม.</div>
      {tag && <div lang="th" style={{position: 'absolute', left: 0, right: 0, top: r + 20 - 78, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 28, color: '#ffd9a0', lineHeight: 1}}>แบบจำลอง</div>}
    </div>
  );
};

export type SplitDialProps = {a: number; b: number; showA?: boolean; showB?: boolean; cx?: number; cy?: number; r?: number; labels?: [string, string]};
/** G2 split dial (B02-SH03): 0-50, only "30" numbered, no digital readout; needle A (amber) and B (pale blue) with their labels outside the tips. */
export const SplitDial = ({a, b, showA = true, showB = false, cx = 540, cy = 470, r = 230, labels = ['เม็ดใหญ่ที่สุด', 'เม็ดทั่วไป']}: SplitDialProps) => {
  const pt = (val: number, rr: number) => [cx + Math.cos(ang(val, 50)) * rr, cy - Math.sin(ang(val, 50)) * rr];
  const needle = (val: number, color: string, id: string) => { const t = pt(val, r - 30), s = pt(val + 25, 18); return (
    <g key={id}>
      <line x1={s[0]} y1={s[1]} x2={t[0]} y2={t[1]} stroke={C.ink} strokeWidth={15} strokeLinecap="round" />
      <line x1={s[0]} y1={s[1]} x2={t[0]} y2={t[1]} stroke={color} strokeWidth={8} strokeLinecap="round" />
    </g>); };
  const n30 = pt(30, r - 84), tipA = pt(a, r + 26), tipB = pt(b, r + 26);
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <circle cx={cx} cy={cy} r={r} fill={C.realFace} fillOpacity={0.75} stroke={C.ink} strokeWidth={10} />
        <circle cx={cx} cy={cy} r={r - 8} fill="none" stroke={C.realTick} strokeOpacity={0.5} strokeWidth={2} />
        {Array.from({length: 11}, (_, i) => i * 5).map((val) => { const maj = val % 10 === 0, p0 = pt(val, r - (maj ? 48 : 30)), p1 = pt(val, r - 14); return <line key={val} x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke={C.realTick} strokeWidth={maj ? 5 : 3} strokeLinecap="round" />; })}
        {showB && needle(b, C.needleB, 'B')}
        {showA && needle(a, C.needleA, 'A')}
        <circle cx={cx} cy={cy} r={15} fill={C.needleA} stroke={C.ink} strokeWidth={4} />
      </svg>
      <div lang="th" style={{position: 'absolute', left: n30[0] - 40, top: n30[1] - 26, width: 80, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 52, color: C.realTick, lineHeight: 1}}>30</div>
      <div lang="th" style={{position: 'absolute', left: cx - 100, top: cy + 70, width: 200, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 34, color: C.realTick, lineHeight: 1}}>กม./ชม.</div>
      {showA && a >= 31 && <div lang="th" style={{position: 'absolute', left: tipA[0] - 6, top: tipA[1] - 34, whiteSpace: 'nowrap', ...edu(46, C.needleA, 8)}}>{labels[0]}</div>}
      {showB && b >= 19.5 && <div lang="th" style={{position: 'absolute', right: 1080 - tipB[0] + 6, top: tipB[1] - 34, whiteSpace: 'nowrap', textAlign: 'right', ...edu(46, C.needleB, 8)}}>{labels[1]}</div>}
    </>
  );
};
