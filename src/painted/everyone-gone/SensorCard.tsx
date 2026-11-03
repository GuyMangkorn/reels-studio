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
/** Reflected wave of the still field (S03-B01-SH03): green, 56 px spacing, against the orange 34 px of the moving field. */
export const CARD_STILL = '#4f9a63';
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

// ---- Timed card of the scene sheets (EG-SC-R1 S03-B01-SH01 / SH03; Boss W5.2, 3 Nov 2026) -------------------------------
// Layout from sc03: box (540, 960) 200x70 above a simplified door (top y 1100), arcs radiate downward, the plain circle path
// (1200 -> 700, 1130), labels at the sheet's centre points; everything below the high caption band (y 560) and inside the
// caption-safe box. `SensorCard` above is the approved look still `LF04` and stays as it was. Pure in `F`, the frame count
// of S03-B01-SH01 (SH03 continues the same clock: F = 256 + SH03 frame), so arcs are continuous across the hard cut.

export const CARD_BOX = {x: 540, y: 960, w: 200, h: 70} as const;
export const ARC_SPACING = {still: 56, moving: 34} as const;
const RATE = 56 / 24; // px per frame: an arc launches every 24 f and 56 px apart
const BOX_BASE = {x: 540, y: 960 + 35};
const prog01 = (F: number, a: number, b: number) => Math.min(1, Math.max(0, (F - a) / (b - a)));
const ease3 = (u: number) => 1 - (1 - u) ** 3;
const rad = (d: number) => (d * Math.PI) / 180;
/** Arc of radius r about the box base between two angles (deg, measured from +x, positive downward on screen). */
const arcPath = (r: number, a0: number, a1: number) => {
  const p0 = [BOX_BASE.x + r * Math.cos(rad(a0)), BOX_BASE.y + r * Math.sin(rad(a0))], p1 = [BOX_BASE.x + r * Math.cos(rad(a1)), BOX_BASE.y + r * Math.sin(rad(a1))];
  return `M ${p0[0]} ${p0[1]} A ${r} ${r} 0 0 1 ${p1[0]} ${p1[1]}`;
};
/** Radii of a returning field: `spacing` px apart, flowing inward at RATE, between 16 and 16 + 9 spacings. */
export const returnRadii = (F: number, spacing: number) => {
  const period = spacing * 9;
  return Array.from({length: 9}, (_, k) => 16 + ((((-RATE * F + spacing * k) % period) + period) % period));
};
/** Centre x of the moving circle at card-clock F (px); y is 1130. It enters to 740 in SH01 and keeps drifting to 700 over SH03 f0-90 (Final note 1, 3 Nov 2026). */
export const circleX = (F: number) => (F < 256 ? 1200 - 460 * ease3(prog01(F, 100, 160)) : 740 - 40 * ease3(prog01(F, 256, 346)));

export const SensorCardShot = ({F}: {F: number}) => {
  const label = {fontFamily: 'Noto Sans Thai', fontWeight: 600, fill: INK, textAnchor: 'middle'} as const;
  const cx = circleX(F), cy = 1130;
  const retOn = prog01(F, 100, 120);
  const mixMoving = prog01(F, 112, 140); // 0 = still spacing, 1 = bunched
  const fade = (a: number) => prog01(F, a, a + 8);
  const arcAlpha = (r: number) => Math.max(0, Math.min(1, (520 - r) / 120)) * Math.min(1, (r - 16) / 40);
  const out = F < 40 ? [] : Array.from({length: Math.floor((F - 40) / 24) + 1}, (_, k) => 60 + (F - 40 - 24 * k) * RATE).filter((r) => r < 520);
  const still = returnRadii(F, ARC_SPACING.still), moving56 = still, moving34 = returnRadii(F, ARC_SPACING.moving);
  return (
    <AbsoluteFill style={{background: CARD_PAPER}}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1920">
        {/* User note 3 Nov 2026: the explanation diagram sits 110 px higher, closing the gap under the caption slate (slate stays put). */}
        <g transform="translate(0 -110)">
        <line x1={160} y1={1440} x2={920} y2={1440} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <rect x={370} y={1100} width={340} height={340} fill="none" stroke={INK} strokeWidth={5} />
        <line x1={540} y1={1100} x2={540} y2={1440} stroke={INK} strokeWidth={3} />
        {out.map((r, i) => (
          <path key={`o${i}`} d={arcPath(r, 55, 125)} fill="none" stroke={CARD_ACCENT} strokeWidth={6} strokeLinecap="round" opacity={arcAlpha(r)} />
        ))}
        {still.map((r, i) => (
          <path key={`s${i}`} d={arcPath(r, 132, 168)} fill="none" stroke={F >= 256 ? CARD_STILL : CARD_RETURN} strokeWidth={5} strokeLinecap="round" opacity={retOn * arcAlpha(r)} />
        ))}
        {moving56.map((r, i) => (
          <path key={`m${i}`} d={arcPath(r, 12, 48)} fill="none" stroke={CARD_RETURN} strokeWidth={5} strokeLinecap="round" opacity={retOn * (1 - mixMoving) * arcAlpha(r)} />
        ))}
        {moving34.map((r, i) => (
          <path key={`b${i}`} d={arcPath(r, 12, 48)} fill="none" stroke={CARD_RETURN} strokeWidth={5} strokeLinecap="round" opacity={retOn * mixMoving * arcAlpha(r)} />
        ))}
        <rect x={CARD_BOX.x - CARD_BOX.w / 2} y={CARD_BOX.y - CARD_BOX.h / 2} width={CARD_BOX.w} height={CARD_BOX.h} rx={10} fill="#ffffff" stroke={INK} strokeWidth={5} />
        <circle cx={CARD_BOX.x} cy={CARD_BOX.y + 8} r={11} fill={INK} />
        {cx < 1160 && (
          <g>
            <circle cx={cx} cy={cy} r={60} fill="#ffffff" stroke={INK} strokeWidth={5} />
            {/* Speed lines trail behind the orb (it travels left, so they sit on its right) and follow cx. */}
            <line x1={cx + 76} y1={cy - 14} x2={cx + 104} y2={cy - 14} stroke={INK} strokeWidth={4} strokeLinecap="round" />
            <line x1={cx + 80} y1={cy + 12} x2={cx + 114} y2={cy + 12} stroke={INK} strokeWidth={4} strokeLinecap="round" />
            <line x1={cx + 76} y1={cy + 38} x2={cx + 98} y2={cy + 38} stroke={INK} strokeWidth={4} strokeLinecap="round" />
          </g>
        )}
        <text x={540} y={860} fontSize={44} {...label} opacity={fade(40)}>{CARD_LABELS[0]}</text>
        <text x={300} y={1010} fontSize={42} {...label} fill={CARD_ACCENT} opacity={fade(70)}>{CARD_LABELS[1]}</text>
        <text x={800} y={990} fontSize={42} {...label} fill={CARD_RETURN} opacity={fade(120)}>{CARD_LABELS[2]}</text>
        {/* Still field (S03-B01-SH03): second orb at rest at (300, 1130), same size, no motion ticks. */}
        <circle cx={300} cy={1130} r={60} fill="#ffffff" stroke={INK} strokeWidth={5} opacity={prog01(F, 256, 264)} />
        {/* Label 4 (fix pass 1: lifted from y 1720 to 1600, floor line 1620 -> 1520): one text, centred (540, 1600) below the floor line; the 40 px of clear space around it is the card's. */}
        <text x={540} y={1520} fontSize={38} {...label} opacity={fade(264)}>{CARD_LABELS[3]}</text>
        </g>
        {/* Caption slate (VD14): cold ink strip behind the white caption zone y 330..590, fading in with the first caption of SH01 (f26) and standing through the SH01 -> SH03 cut (fix pass 1: no blink); grain below runs over it. */}
        <defs><linearGradient id="eg-card-slate" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a343c" stopOpacity={0} /><stop offset="0.08" stopColor="#2a343c" stopOpacity={0.9} /><stop offset="0.92" stopColor="#2a343c" stopOpacity={0.9} /><stop offset="1" stopColor="#2a343c" stopOpacity={0} /></linearGradient></defs>
        <rect x={0} y={320} width={1080} height={280} fill="url(#eg-card-slate)" opacity={F < 256 ? prog01(F, 26, 34) : 1} />
        {/* Paper grain (Film's tone note): fixed turbulence, multiplied at low strength over the whole card. */}
        <filter id="eg-card-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" /><feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0.9 -0.35" /></filter>
        <rect x={0} y={0} width={1080} height={1920} filter="url(#eg-card-grain)" opacity={0.28} />
      </svg>
    </AbsoluteFill>
  );
};
