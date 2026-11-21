import type {CSSProperties, ReactNode} from 'react';
import type {Pt} from '../kit/painter';
import {POSTER} from './cast';
import {CO, b01Sh02Anchors} from './b01-sh02';

// EDU-EP32-SHORT B01-SH02 screen-space callouts (VD32-06; timed sheet EDU-EP32-SHEET-R1 B01-SH02; Boss G1, 2026-11-21). One SVG over the plate,
// under Grade + Grain, anchored each frame on the hero cat (b01-sh02.ts `b01Sh02Anchors`): ink navy lines, cream label cards, Noto Sans Thai.
//   CO1 ear circle 60 px on the ear mic, drawn L32-L44, label "ไมค์ · ในหู" in front of the face;
//   CO2 a separate small box behind the back with "เครื่องส่ง · ในตัว" and a dashed arrow to the torso centre, L65-L77 (no organ, no outline);
//   CO3 the back-fur thread lights from the shoulders toward the hips L104-L124, label "เสาอากาศ · ถักในขน" at L110.
// Labels stay above y 1100 and inside x 120-960 (clamped); every line keeps 20 px from the tail tip (checked in tests/edu32-b01.test.ts).

const INK = POSTER.navy, CREAM = POSTER.cream, LIT = '#ffe7b0';
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const prog = (L: number, [a, b]: readonly [number, number]) => clamp01((L - a) / (b - a));
const len = (pts: Pt[]) => pts.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]), 0);
const path = (pts: Pt[]) => pts.map((q, i) => `${i ? 'L' : 'M'}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' ');

/** The thread's middle point (half its length along the path). */
export const threadMid = (pts: Pt[]): Pt => {
  let rest = len(pts) / 2;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (d >= rest) return [pts[i - 1][0] + ((pts[i][0] - pts[i - 1][0]) * rest) / d, pts[i - 1][1] + ((pts[i][1] - pts[i - 1][1]) * rest) / d];
    rest -= d;
  }
  return pts[pts.length - 1];
};

export const LABELS = {co1: 'ไมค์ · ในหู', co2: 'เครื่องส่ง · ในตัว', co3: 'เสาอากาศ · ถักในขน'} as const;
export const LABEL_H = 64;
/** Label card boxes (picture px, left/top/width) at shot frame L, clamped to x 120-960 and above y 1100. */
export const calloutLayout = (L: number) => {
  const a = b01Sh02Anchors(L);
  if (!a) return null;
  const w1 = 250, w2 = 290, w3 = 340, cl = (x: number, w: number) => Math.max(120, Math.min(960 - w, x)), ct = (y: number) => Math.min(1100 - LABEL_H, y);
  const r = 30;
  // CO1 above and behind the ear (the cat faces dir; -1 = screen-left), clear of the @TamMaiLa mark box; leader from the circle edge
  const l1 = {x: cl(a.ear[0] - a.dir * 70 - (a.dir < 0 ? 0 : w1), w1), y: ct(a.ear[1] - 150), w: w1};
  // CO3 behind the back, level with the middle of the thread
  const tm = threadMid(a.thread), back = a.dir < 0 ? Math.max(...a.thread.map((q) => q[0])) : Math.min(...a.thread.map((q) => q[0]));
  const l3 = {x: cl(back - a.dir * 110 - (a.dir < 0 ? 0 : w3), w3), y: ct(tm[1] - LABEL_H / 2 - 40), w: w3};
  // CO2 behind the back (dir -1: right-aligned at x 960), at the lowest row above the torso where the box clears the card outline by 24 px and the
  // CO3 label by 30 px; dashed arrow down to the torso centre
  const x2 = a.dir < 0 ? 960 - w2 : 120;
  const clear = (y: number) => a.outline.filter((q) => q[1] >= y - 10 && q[1] <= y + LABEL_H + 10).every((q) => (a.dir < 0 ? q[0] <= x2 - 24 : q[0] >= x2 + w2 + 24));
  let y2 = a.torso[1] - 160;
  while (y2 > l3.y + LABEL_H + 30 && !clear(y2)) y2 -= 8;
  const l2 = {x: x2, y: ct(y2), w: w2};
  return {a, r, l1, l2, l3};
};

const card = (x: number, y: number, w: number, k: number, text: string): ReactNode => {
  const s: CSSProperties = {position: 'absolute', left: x, top: y, width: w, height: LABEL_H, boxSizing: 'border-box', background: CREAM, border: `3px solid ${INK}`,
    borderRadius: 6, color: INK, fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 700, fontSize: 33, lineHeight: `${LABEL_H - 6}px`, textAlign: 'center',
    opacity: k, transform: `scale(${0.88 + 0.12 * k})`, transformOrigin: 'center', boxShadow: '0 3px 0 rgba(14,10,8,0.35)', whiteSpace: 'nowrap'};
  return <div lang="th" style={s}>{text}</div>;
};

/** The callouts at shot frame L (absolute, 1080 x 1920). */
export const B01Callouts = ({L}: {L: number}) => {
  const lay = calloutLayout(L);
  if (!lay) return null;
  const {a, r, l1, l2, l3} = lay;
  const p1 = prog(L, CO.co1), p2 = prog(L, CO.co2), p3 = prog(L, CO.co3);
  const k1 = clamp01((L - (CO.co1[1] - 4)) / 4), k2 = clamp01((L - (CO.co2[1] - 4)) / 4), k3 = clamp01((L - CO.co3Label) / 4);
  const circ = 2 * Math.PI * r;
  // CO1 leader: from the circle edge toward the label's near bottom corner
  const c1: Pt = [l1.x + (a.dir < 0 ? 24 : l1.w - 24), l1.y + LABEL_H], d1 = Math.hypot(c1[0] - a.ear[0], c1[1] - a.ear[1]) || 1;
  const e1: Pt = [a.ear[0] + ((c1[0] - a.ear[0]) / d1) * r, a.ear[1] + ((c1[1] - a.ear[1]) / d1) * r];
  // CO2 arrow: from the box's near side to the torso centre, head at the torso
  const s2: Pt = [a.dir < 0 ? l2.x : l2.x + l2.w, l2.y + LABEL_H / 2], v2: Pt = [a.torso[0] - s2[0], a.torso[1] - s2[1]], d2 = Math.hypot(...v2) || 1;
  const tip: Pt = [s2[0] + v2[0] * p2, s2[1] + v2[1] * p2], ux = v2[0] / d2, uy = v2[1] / d2;
  const head = `M${tip[0] - ux * 22 - uy * 11} ${tip[1] - uy * 22 + ux * 11} L${tip[0]} ${tip[1]} L${tip[0] - ux * 22 + uy * 11} ${tip[1] - uy * 22 - ux * 11}`;
  // CO3 lit thread (drawn on along its length) and a short leader to the label
  const tl = len(a.thread), tm = threadMid(a.thread);
  const c3: Pt = [a.dir < 0 ? l3.x : l3.x + l3.w, l3.y + LABEL_H / 2];
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {p1 > 0 && <circle cx={a.ear[0]} cy={a.ear[1]} r={r} fill="none" stroke={INK} strokeWidth={5} strokeDasharray={`${circ * p1} ${circ}`} transform={`rotate(-90 ${a.ear[0]} ${a.ear[1]})`} />}
        {k1 > 0 && <path d={path([e1, c1])} stroke={INK} strokeWidth={4} opacity={k1} />}
        {p2 > 0 && <>
          <path d={path([s2, tip])} stroke={INK} strokeWidth={4} strokeDasharray="14 10" fill="none" />
          <path d={head} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={a.torso[0]} cy={a.torso[1]} r={7 * p2} fill={INK} opacity={p2 >= 1 ? 1 : 0} />
        </>}
        {p3 > 0 && <>
          <path d={path(a.thread)} stroke={LIT} strokeWidth={12} strokeOpacity={0.45} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${tl * p3} ${tl + 10}`} style={{filter: 'blur(3px)'}} />
          <path d={path(a.thread)} stroke={LIT} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${tl * p3} ${tl + 10}`} />
        </>}
        {k3 > 0 && <path d={path([[tm[0] - a.dir * 14, tm[1]], c3])} stroke={INK} strokeWidth={4} opacity={k3} />}
      </svg>
      {k1 > 0 && card(l1.x, l1.y, l1.w, k1, LABELS.co1)}
      {p2 > 0 && card(l2.x, l2.y, l2.w, Math.max(0.35, k2) * Math.min(1, p2 * 3), LABELS.co2)}
      {k3 > 0 && card(l3.x, l3.y, l3.w, k3, LABELS.co3)}
    </div>
  );
};
