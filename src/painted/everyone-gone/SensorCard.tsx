import {loadFont} from '@remotion/fonts';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {INK} from '../kit/draw';

if (typeof document !== 'undefined') loadFont({family: 'Noto Sans Thai', url: staticFile('fonts/NotoSansThai.ttf'), weight: '100 900'});

// EG-EP01-SHORT S03 sensor diagram card (brief R1.2 VD07; storyboard S03-B01-SH01..SH03). Crisp flat SVG on paper: "this part
// is true" against the painted story. Look-defining first version by Film (W3.1, 3 Nov 2026); Boss hardens it (siren panel,
// the still-field half, timing). Radar only (FC-04/FC-06): sensor box, outgoing arcs, a plain moving shape (a circle, never
// a person), returning arcs bunched closer. Exactly four Thai labels; no numbers, no GHz, no speed, no fact tag.
// Layout: diagram in y 200..820 and the rule label at y 1400, so the caption band (about y 860..1248) stays clear.

export const CARD_PAPER = '#F4F1EA';
export const CARD_ACCENT = '#3f7f8c';
export const CARD_RETURN = '#c0623f';
export const CARD_LABELS = ['เซนเซอร์', 'คลื่นไมโครเวฟ', 'สะท้อนกลับ', 'ขยับ → คลื่นที่สะท้อนกลับเปลี่ยนความถี่'] as const;

const FPS = 30;
const SX = 540, SY = 300; // sensor box centre

export const SensorCard = ({showRule = true}: {showRule?: boolean}) => {
  const t = useCurrentFrame() / FPS;
  const cx = 470 + 40 * Math.sin(t * 1.4), cy = 720; // the moving shape, drifting left-right
  const out = Array.from({length: 5}, (_, i) => ((t * 0.6 + i / 5) % 1));
  const back = Array.from({length: 6}, (_, i) => ((t * 0.9 + i / 6) % 1));
  const label = {fontFamily: 'Noto Sans Thai', fontWeight: 600, fill: INK} as const;
  return (
    <AbsoluteFill style={{background: CARD_PAPER}}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1920">
        {/* Door frame (simplified), floor line. */}
        <line x1={160} y1={840} x2={920} y2={840} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <rect x={380} y={370} width={320} height={470} fill="none" stroke={INK} strokeWidth={5} />
        <line x1={540} y1={370} x2={540} y2={840} stroke={INK} strokeWidth={3} />
        {/* Sensor box on the transom. */}
        <rect x={SX - 70} y={SY - 30} width={140} height={60} rx={8} fill="#ffffff" stroke={INK} strokeWidth={5} />
        <circle cx={SX} cy={SY + 6} r={9} fill={INK} />
        {/* Outgoing arcs: even spacing, spreading down and out. */}
        {out.map((u, i) => {
          const r = 60 + u * 520;
          return <path key={`o${i}`} d={`M ${SX - r * 0.62} ${SY + r * 0.78} A ${r} ${r} 0 0 0 ${SX + r * 0.62} ${SY + r * 0.78}`} fill="none" stroke={CARD_ACCENT} strokeWidth={5} strokeLinecap="round" opacity={0.25 + 0.75 * (1 - u)} />;
        })}
        {/* Returning arcs from the moving shape: bunched (shorter spacing) on the way back to the sensor. */}
        {back.map((u, i) => {
          const r = 30 + u * 300;
          const ang = Math.atan2(SY - cy, SX - cx);
          const a0 = ang - 0.5, a1 = ang + 0.5;
          return <path key={`b${i}`} d={`M ${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)}`} fill="none" stroke={CARD_RETURN} strokeWidth={4.5} strokeLinecap="round" opacity={0.3 + 0.7 * (1 - u)} />;
        })}
        {/* The plain moving shape (not a person) with two motion ticks. */}
        <circle cx={cx} cy={cy} r={58} fill="#ffffff" stroke={INK} strokeWidth={5} />
        <line x1={cx - 100} y1={cy - 14} x2={cx - 72} y2={cy - 14} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <line x1={cx - 110} y1={cy + 12} x2={cx - 76} y2={cy + 12} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        {/* Labels (Thai, exactly the brief's strings). */}
        <text x={SX + 92} y={SY + 14} fontSize={44} {...label}>{CARD_LABELS[0]}</text>
        <text x={130} y={500} fontSize={42} {...label} fill={CARD_ACCENT}>{CARD_LABELS[1]}</text>
        <text x={720} y={560} fontSize={42} {...label} fill={CARD_RETURN}>{CARD_LABELS[2]}</text>
        {showRule && (
          <text x={540} y={1420} fontSize={46} textAnchor="middle" {...label}>{CARD_LABELS[3]}</text>
        )}
      </svg>
    </AbsoluteFill>
  );
};
