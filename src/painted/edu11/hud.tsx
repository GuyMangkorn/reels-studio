import {AbsoluteFill} from 'remotion';
import {hudNumbers, hudStateAt, type HudState} from './clock';

// N6 lift-hud: floor counter, ticks-only gauge, readout pill, tag pill. Screen layer in slot HUD x 800-1040, y 224-600 (brief "Frame zones"); numbers come
// from the one fall clock (`clock.ts`). `HudLayer g={G}` is the shot-level component: slide-in G45-54, fades, off in the black / 1854 / 1857 / B05-SH05-06.
/** HUD numbers at a fall-clock frame `s` (kept for the spike code): counter, needle fraction, readout pill. */
export const hudAt = hudNumbers;
const SWEEP = 240; // dial sweep in degrees, needle 0 at -120
export const Hud = ({counter, needle, pill, opacity = 1, tag = true, slide = 1}: {counter: number; needle: number; pill: boolean; opacity?: number; tag?: boolean; slide?: number}) => {
  const a = (-120 + SWEEP * needle) * (Math.PI / 180), cx = 920, cy = 410, r = 100;
  const ticks = Array.from({length: 13}, (_, i) => { const t = (-120 + (SWEEP * i) / 12) * (Math.PI / 180); return {x1: cx + Math.sin(t) * r * 0.8, y1: cy - Math.cos(t) * r * 0.8, x2: cx + Math.sin(t) * r * 0.95, y2: cy - Math.cos(t) * r * 0.95}; });
  const dx = (1 - slide) * 280; // slides in from the right edge
  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none', transform: `translateX(${dx}px)`}}>
      <div style={{position: 'absolute', left: 800, top: 224, width: 240, height: 376, borderRadius: 18, background: 'rgba(20,24,28,0.8)'}} />
      <div style={{position: 'absolute', left: 830, top: 224, width: 180, height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontWeight: 800, fontSize: 74, color: '#ff5a36', letterSpacing: 6}}>{String(counter).padStart(2, '0')}</div>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <circle cx={cx} cy={cy} r={r} fill="#f4f1ea" />
        {ticks.map((t, i) => <line key={i} {...t} stroke="#2b211c" strokeWidth={i % 3 === 0 ? 5 : 3} />)}
        <line x1={cx} y1={cy} x2={cx + Math.sin(a) * r * 0.78} y2={cy - Math.cos(a) * r * 0.78} stroke="#e0443a" strokeWidth={6} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={9} fill="#2b211c" />
      </svg>
      {pill && <div lang="th" style={{position: 'absolute', left: 806, top: 520, width: 228, height: 36, borderRadius: 18, background: '#f4f1ea', color: '#2b211c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 700, fontSize: 22}}>ราว 120 กม./ชม.</div>}
      {tag && <div lang="th" style={{position: 'absolute', left: 806, top: 562, width: 228, height: 38, borderRadius: 19, background: '#ffb347', color: '#2b211c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 800, fontSize: 24}}>ถ้า…ร่วงจริง</div>}
    </AbsoluteFill>
  );
};
export const HudFrom = ({h}: {h: HudState}) => (h.on && h.opacity > 0 ? <Hud counter={h.counter} needle={h.needle} pill={h.pill} tag={h.tag} opacity={h.opacity} slide={h.slide} /> : null);
/** The HUD for composition frame G (a pure function of G; null when off). */
export const HudLayer = ({g}: {g: number}) => <HudFrom h={hudStateAt(g)} />;
