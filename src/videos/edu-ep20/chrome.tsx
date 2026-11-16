import type {ReactNode} from 'react';
import {useCurrentFrame} from 'remotion';
import {hash} from '../../painted/kit/hash';

/**
 * EDU-EP20-SHORT screen layers on the composition clock G (Editor; scene sheet EDU-EP20-SS-R5). Screen space above the one painted
 * canvas, never painted, no world-derived scale. Pure functions of the frame (no state, no runtime random: seek-safe).
 * - Pressure explainer PX20 (sheet SS-R4 PX20, FD20-R4-01): box x120-888, y860-1084 labelled ภาพอธิบาย; a side section of the cabin with
 *   ~40 seeded air dots that jitter in place and pack (never stream) toward the higher-pressure side, a pressure tint and wall bar there,
 *   two push arrows on a tethered balloon icon whose lengths follow the two sides, a resultant arrow, wheels whose spin follows the car.
 *   INSET_ACCEL G520-704 (PX20-A, rear packs, balloon icon tips to หน้ารถ); INSET_BRAKE G1340-1461 (PX20-B, SS-R5 word sync to narration R2 L13:
 *   recalls the accel end state, air packs front G1356-1386 on อากาศด้านหน้า, labels swap 1388-1400 and the icon tips to ท้ายรถ 1388-1418
 *   on กลับดันแรงกว่า...ด้านหลัง, hold through นั่นเอง to 1449, out 1449-1461), only after the L12 result and out 4 f before the END20 settle (G1465).
 * - Ellipsis label ภาพข้ามช่วงรอ at x120, y760, G905-955 (B04-SH01 local 60-110), 6 f fades.
 * - Direction aids ท้ายรถ / หน้ารถ → (VD20-03 suggested labels) in B01-SH01 G0-71 only, above the caption line.
 * - Reconstruction label ภาพจำลอง (VD20-03) on every frame, x120, y806, 26 px outlined; fades with A_fade G1579-1619 (END20, SS-R5).
 */
export type Span = {from: number; to: number; fadeIn: number; fadeOut: number};
export const INSET_ACCEL: Span = {from: 520, to: 704, fadeIn: 8, fadeOut: 12};
export const INSET_BRAKE: Span = {from: 1340, to: 1461, fadeIn: 8, fadeOut: 12};   // SS-R5 (SS-R4 1340-1432)
export const ELLIPSIS: Span = {from: 905, to: 955, fadeIn: 6, fadeOut: 6};
/** A_fade (END20): the picture fades G1579-1619 (index.ts endFadeSec 40/30; SS-R5, was 1550-1590); the overlay sits above it, so its label fades with it. */
export const END_FADE = {from: 1579, to: 1619};
export const DIRECTION: Span = {from: 0, to: 71, fadeIn: 0, fadeOut: 0};
export const spanOpacity = (f: number, s: Span) => {
  if (f < s.from || f >= s.to) return 0;
  const a = s.fadeIn ? Math.min(1, (f - s.from + 1) / s.fadeIn) : 1;
  const b = s.fadeOut ? Math.min(1, (s.to - f) / s.fadeOut) : 1;
  return Math.min(a, b);
};

const INK = '#26313b', HIGH = '#a8452f', LOW = '#6b7780', CARD = '#f1e9d9';
const thai = {fontFamily: 'Noto Sans Thai', fontWeight: 700} as const;

// ---- PX20 model (box px: origin = box top-left at composition (120,860), +x toward หน้ารถ, +y down) ----
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** ss(a,b,G): smoothstep 3v^2-2v^3 of v = clamp((G-a)/(b-a)). */
export const ss = (a: number, b: number, G: number) => { const v = clamp01((G - a) / (b - a)); return v * v * (3 - 2 * v); };
/** Integral of ss over [a, G] (frames): (b-a)(v^3 - v^4/2) plus the hold after b; the closed form of a smoothstep-ramped rate. */
const ssInt = (a: number, b: number, G: number) => { const v = clamp01((G - a) / (b - a)); return (b - a) * (v ** 3 - v ** 4 / 2) + Math.max(0, G - b); };

export const AIR = {x0: 222, x1: 546, y0: 66, y1: 188};
const DOT_R = 4.5, TETHER = 0.855;
const inWedge = (x: number, y: number) => x > 500 && y < 104;
/** Windshield bound for a dot centre: the glass line (512,58)->(554,112) less the dot radius and the 3 px stroke. */
const xMaxAt = (y: number) => Math.min(AIR.x1 - DOT_R, 512 + (y - 58) * (42 / 54) - 7);
type Dot = {hx: number; hy: number; P: number; Q: number; ph: number; ps: number};
/** 7 x 6 seeded home points (seed 20520+i), jittered +-10 x / +-6 y; points in the windshield wedge dropped. */
export const PX20_DOTS: readonly Dot[] = (() => {
  const out: Dot[] = [];
  for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) {
    const i = r * 7 + c, h = (j: number) => hash((20520 + i) * 7 + j);
    const hx = 232 + c * (304 / 6) + (h(0) * 2 - 1) * 10, hy = 72 + r * 22.4 + (h(1) * 2 - 1) * 6;
    if (inWedge(hx, hy)) continue;
    out.push({hx, hy, P: 36 + 24 * h(2), Q: 36 + 24 * h(3), ph: 2 * Math.PI * h(4), ps: 2 * Math.PI * h(5)});
  }
  return out;
})();

export type Px20State = {g: number; ui: number; r: number; sign: 1 | -1; phi: number; arrowR: number; arrowF: number; labelHigh: number; labelLow: number; brake: boolean};
/** PX20 state at G: packing g (+ rear, - front), inset balloon u_i (m), resultant r and its sign, wheel angle phi (deg), the push-arrow
 * grow factors, and the pressure-label opacities (labelHigh = left/rear label in its HIGH wording, cross-faded on the brake flip). */
export const px20At = (G: number): Px20State => {
  if (G < 1000) {   // PX20-A, B03-SH01
    const phi = 4 * (G - 520) + 9 * ssInt(539, 567, G);
    return {g: 0.45 * ss(541, 590, G), ui: 0.2 * ss(641, 671, G), r: ss(645, 665, G), sign: 1, phi, arrowR: ss(571, 583, G), arrowF: ss(598, 610, G),
      labelHigh: clamp01((G - 567) / 8), labelLow: clamp01((G - 594) / 8), brake: false};
  }
  // PX20-B, B05-SH03 (SS-R5 keys): recall the accel end state, then flip. g packs front 1356-1386 (อากาศด้านหน้า), w 13 -> 3 deg/f over
  // 1356-1396; u_i tips back 1388-1418; resultant shrinks 1388-1398, is 0 to 1402, then regrows toward ท้ายรถ 1402-1418.
  const phi = 13 * (G - 1340) - 10 * ssInt(1356, 1396, G);
  const early = G < 1400;
  return {g: 0.45 - 0.9 * ss(1356, 1386, G), ui: 0.2 - 0.4 * ss(1388, 1418, G), r: early ? 1 - ss(1388, 1398, G) : ss(1402, 1418, G), sign: early ? 1 : -1,
    phi, arrowR: 1, arrowF: 1, labelHigh: 1, labelLow: 1, brake: true};
};

/** Dot centre i at G: packing s' = s - g s(1-s) (walls fixed, order kept), plus thermal jitter, clamped inside the air region. */
export const dotAt = (d: Dot, g: number, G: number): [number, number] => {
  const s = (d.hx - AIR.x0) / (AIR.x1 - AIR.x0), sp = s - g * s * (1 - s);
  const y = Math.max(AIR.y0 + DOT_R, Math.min(AIR.y1 - DOT_R, d.hy + 2 * Math.cos((2 * Math.PI * G) / d.Q + d.ps)));
  const x = Math.max(AIR.x0 + DOT_R, Math.min(xMaxAt(y), AIR.x0 + (AIR.x1 - AIR.x0) * sp + 3 * Math.sin((2 * Math.PI * G) / d.P + d.ph)));
  return [x, y];
};

const Arrow = ({x0, x1, y, w, head, color}: {x0: number; x1: number; y: number; w: number; head: number; color: string}) => {
  const len = Math.abs(x1 - x0);
  if (len < 1) return null;
  const dir = Math.sign(x1 - x0), h = Math.min(head, len), back = x1 - dir * h;
  return <g>
    {len > h && <line x1={x0} y1={y} x2={back + dir * 1} y2={y} stroke={color} strokeWidth={w} strokeLinecap="round" />}
    <path d={`M${x1} ${y} L${back} ${y - h * 0.62} L${back} ${y + h * 0.62} Z`} fill={color} />
  </g>;
};

const PressureInset = ({G}: {G: number}) => {
  const s = px20At(G), a = Math.abs(s.g) / 0.45, rearHigh = s.g >= 0;
  const th = Math.asin(s.ui / TETHER), sx = Math.sin(th), sy = -Math.cos(th);
  const ring = [384, 190] as const, N = [ring[0] + 62 * sx, ring[1] + 62 * sy], C = [N[0] + 23 * sx, N[1] + 23 * sy];
  const Lr = 30 * (1 + s.g) * s.arrowR, Lf = 30 * (1 - s.g) * s.arrowF;
  // brake label swap inside the sheet's cross-fade window 1388-1400 (SS-R5; left HIGH->LOW wording, right LOW->HIGH), sequential so two
  // Thai strings never overlap: the old wording fades out 1388-1394, the new one fades in 1394-1400 (a true cross-fade stacked them unreadably)
  const out = s.brake ? clamp01((G - 1388) / 6) : 0, inn = s.brake ? clamp01((G - 1394) / 6) : 0;
  const label = (x: number, anchor: 'start' | 'end', place: string, startsHigh: boolean, op: number): ReactNode => {
    const hi = s.brake ? (startsHigh ? 1 - out : inn) : startsHigh ? 1 : 0, lo = s.brake ? (startsHigh ? inn : 1 - out) : startsHigh ? 0 : 1;
    return <g>
      <text x={x} y={100} textAnchor={anchor} fontSize={28} fill={INK} style={thai}>{place}</text>
      {op * hi > 0 && <text x={x} y={142} textAnchor={anchor} fontSize={25} fill={HIGH} opacity={op * hi} style={thai}>แรงดันมากกว่า</text>}
      {op * lo > 0 && <text x={x} y={142} textAnchor={anchor} fontSize={25} fill={LOW} opacity={op * lo} style={thai}>แรงดันน้อยกว่า</text>}
    </g>;
  };
  const wheel = (cx: number) => {
    const t = (s.phi * Math.PI) / 180;
    return <g key={cx}><circle cx={cx} cy={207} r={11} fill={CARD} stroke={INK} strokeWidth={3} /><line x1={cx} y1={207} x2={cx + 11 * Math.cos(t)} y2={207 + 11 * Math.sin(t)} stroke={INK} strokeWidth={3} strokeLinecap="round" /></g>;
  };
  const hiX = rearHigh ? 218 : 550, loX = rearHigh ? 550 : 218;
  return (
    <svg width={768} height={224} viewBox="0 0 768 224" style={{position: 'absolute', left: 120, top: 860, overflow: 'visible'}}>
      <defs>
        <linearGradient id="px20-tint" x1={AIR.x0} x2={AIR.x1} y1={0} y2={0} gradientUnits="userSpaceOnUse">
          <stop offset={0} stopColor={HIGH} stopOpacity={rearHigh ? 0.16 * a : 0} />
          <stop offset={1} stopColor={HIGH} stopOpacity={rearHigh ? 0 : 0.16 * a} />
        </linearGradient>
        <clipPath id="px20-cabin"><path d="M214 196 L214 84 Q218 60 250 56 L470 50 Q512 50 540 80 L554 112 L554 196 Z" /></clipPath>
      </defs>
      <rect x={1.5} y={1.5} width={765} height={221} rx={16} fill={CARD} fillOpacity={0.94} stroke={INK} strokeWidth={3} />
      <text x={20} y={34} fontSize={22} fill={LOW} style={thai}>ภาพอธิบาย</text>
      {a > 0 && <rect x={AIR.x0} y={AIR.y0 - 20} width={AIR.x1 - AIR.x0} height={AIR.y1 - AIR.y0 + 28} fill="url(#px20-tint)" clipPath="url(#px20-cabin)" />}
      {PX20_DOTS.map((d, i) => { const [x, y] = dotAt(d, s.g, G); return <circle key={i} cx={x} cy={y} r={DOT_R} fill={INK} fillOpacity={0.7} />; })}
      <path d="M214 196 L214 84 Q218 60 250 56 L470 50 Q512 50 540 80 L554 112 L554 196 Z" fill="none" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      {wheel(268)}{wheel(500)}
      {a > 0 && <>
        <line x1={hiX} y1={86} x2={hiX} y2={188} stroke={HIGH} strokeWidth={8} strokeLinecap="round" opacity={a} />
        <line x1={loX} y1={100} x2={loX} y2={188} stroke={LOW} strokeWidth={3} strokeLinecap="round" strokeDasharray="6 7" opacity={a} />
      </>}
      <line x1={ring[0]} y1={ring[1]} x2={N[0]} y2={N[1]} stroke={INK} strokeWidth={2.5} />
      <circle cx={ring[0]} cy={ring[1]} r={5} fill={CARD} stroke={INK} strokeWidth={2.5} />
      <ellipse cx={C[0]} cy={C[1]} rx={19} ry={23} fill="#db7566" stroke="#9e4e4a" strokeWidth={2.5} transform={`rotate(${(th * 180) / Math.PI} ${C[0]} ${C[1]})`} />
      <Arrow x0={C[0] - 24 - Lr} x1={C[0] - 24} y={C[1]} w={4} head={10} color={INK} />
      <Arrow x0={C[0] + 24 + Lf} x1={C[0] + 24} y={C[1]} w={4} head={10} color={INK} />
      <Arrow x0={C[0]} x1={C[0] + 84 * s.r * s.sign} y={30} w={7} head={14} color={HIGH} />
      {label(20, 'start', 'ท้ายรถ', true, s.labelHigh)}
      {label(748, 'end', 'หน้ารถ', false, s.labelLow)}
    </svg>
  );
};

const Outlined = ({children, style}: {children: ReactNode; style: React.CSSProperties}) => (
  <div lang="th" style={{position: 'absolute', ...thai, fontSize: 34, color: '#ffffff', lineHeight: 1.2, ...style}}>
    <span style={{WebkitTextStroke: '6px #1d2129', paintOrder: 'stroke fill', textShadow: '0 3px 0 #1d2129'}}>{children}</span>
  </div>
);

export const Edu20Chrome = () => {
  const f = useCurrentFrame();
  const inset = Math.max(spanOpacity(f, INSET_ACCEL), spanOpacity(f, INSET_BRAKE)), ell = spanOpacity(f, ELLIPSIS), dirn = spanOpacity(f, DIRECTION);
  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {inset > 0 && <div style={{position: 'absolute', inset: 0, opacity: inset}}><PressureInset G={f} /></div>}
      <Outlined style={{left: 120, top: 806, fontSize: 26, opacity: Math.max(0, Math.min(1, (END_FADE.to - 1 - f) / (END_FADE.to - 1 - END_FADE.from)))}}>ภาพจำลอง</Outlined>
      {ell > 0 && <Outlined style={{left: 120, top: 760, opacity: ell}}>ภาพข้ามช่วงรอ</Outlined>}
      {dirn > 0 && <>
        <Outlined style={{left: 120, top: 878, fontSize: 30}}>ท้ายรถ</Outlined>
        <Outlined style={{right: 1080 - 888, top: 878, fontSize: 30}}>หน้ารถ →</Outlined>
      </>}
    </div>
  );
};
