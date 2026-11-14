import type {CSSProperties, ReactNode} from 'react';
import {FONT} from './frame';

// Screen layers (crisp SVG/HTML over the painted plate, never painted): recipe card RCP, chip, safety strip SAF (EP18, VD18-02/03), rule sign RC (EP17, N17-04),
// phone screen (EP18 sh6, EP17 sh4, N18-06 / N17-06). All stay inside x 120-888 (clear of the right rail) and none sits in the caption band y 1176-1344 unless placed there.
// W3 change: every layer stays inside the caption-safe x 120-888 (clear of the right rail): card 120-888, chip 528-888; the safety line
// does not fit one 48 px line in 768 px, so it breaks into two 44 px lines (y 515-619 on shot 18; 345-449 plus line 2 at 459-519 on shot 19).
const T: CSSProperties = {fontFamily: FONT, color: '#2b211c', lineHeight: 1.05, whiteSpace: 'nowrap'};
const Num = ({children, size}: {children: ReactNode; size: number}) => <span style={{fontWeight: 900, fontSize: size, color: '#b5473a'}}>{children}</span>;
export const RecipeCard = ({chip = false}: {chip?: boolean}) => {
  const box: CSSProperties = chip
    ? {left: 528, top: 160, width: 360, height: 170, padding: '10px 18px', gap: 2}
    : {left: 120, top: 160, width: 768, height: 340, padding: '18px 36px', gap: 6};
  const w = chip ? 30 : 60, n = chip ? 48 : 88;
  return (
    <div style={{position: 'absolute', ...box, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#f4ead2', border: '4px solid #7a5a3a', borderRadius: 18, boxShadow: '0 6px 0 rgba(0,0,0,0.35)'}}>
      <div style={{...T, fontSize: w, fontWeight: 700}}>น้ำต้มสุก <Num size={n}>1</Num> ลิตร</div>
      <div style={{...T, fontSize: w, fontWeight: 700}}>น้ำตาล <Num size={n}>6</Num> ช้อนชาปาด</div>
      <div style={{...T, fontSize: w, fontWeight: 700}}>เกลือ <Num size={n}>ครึ่ง</Num> ช้อนชาปาด</div>
      {!chip && <div style={{...T, fontSize: 40, fontWeight: 500, color: '#5a4636', marginTop: 2}}>ช้อนชามาตรฐาน</div>}
    </div>
  );
};
export const Safety = ({top, line2}: {top: number; line2?: number}) => (
  <>
    <div style={{position: 'absolute', left: 120, top, width: 768, height: 104, background: 'rgba(20,16,14,0.82)', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <span style={{...T, color: '#ffe9a8', fontSize: 44, fontWeight: 700}}>ในชีวิตจริง: ดื่มไม่ได้ หรืออาการหนัก</span>
      <span style={{...T, color: '#ffe9a8', fontSize: 44, fontWeight: 700}}>ต้องรีบหาหมอ</span>
    </div>
    {line2 !== undefined && (
      <div style={{position: 'absolute', left: 120, top: line2, width: 768, height: 60, background: 'rgba(20,16,14,0.82)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <span style={{...T, color: '#ffffff', fontSize: 44, fontWeight: 700}}>มีซองเกลือแร่ ใช้ซองก่อน</span>
      </div>
    )}
  </>
);


/** EP17 wooden rule sign (N17-04, slot RC): a weathered plank with two pegs and up to three Thai lines, width 120-888 by default. Pop it with a 6 f scale from `left+w/2`. */
export const RuleSign = ({lines, top = 160, left = 120, width = 768, size = 64, accent}: {lines: string[]; top?: number; left?: number; width?: number; size?: number; accent?: string}) => {
  const h = 52 + lines.length * (size * 1.18) + 30;
  return (
    <div style={{position: 'absolute', left, top, width, height: h, boxSizing: 'border-box', background: 'linear-gradient(180deg,#c49a62 0%,#b08650 50%,#a07a46 100%)', border: '5px solid #5e402c', borderRadius: 14,
      boxShadow: '0 7px 0 rgba(0,0,0,0.38)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 10}}>
      {[28, width - 28].map((x) => <div key={x} style={{position: 'absolute', left: x - 9, top: 12, width: 18, height: 18, borderRadius: 9, background: '#5e402c', boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.18)'}} />)}
      {[0.28, 0.62, 0.85].map((u) => <div key={u} style={{position: 'absolute', left: 18, right: 18, top: h * u, height: 2, background: 'rgba(94,64,44,0.32)'}} />)}
      {lines.map((t, i) => <div key={t} style={{...T, fontSize: size, fontWeight: i === 0 ? 800 : 600, color: i === 0 && accent ? accent : '#2b1a10'}}>{t}</div>)}
    </div>
  );
};

/** Phone screen card (N18-06): `state` 'nobars' = dark lock screen with an empty signal icon crossed out and a low red battery; 'wake' = the screen just lit. Place over the held phone at `x, y` (centre) `w` wide. */
export const PhoneScreen = ({x, y, w, state = 'nobars', battery = 9}: {x: number; y: number; w: number; state?: 'nobars' | 'wake'; battery?: number}) => {
  const h = w * 1.9;
  return (
    <svg width={w} height={h} viewBox={`0 0 100 190`} style={{position: 'absolute', left: x - w / 2, top: y - h / 2}}>
      <rect x={1} y={1} width={98} height={188} rx={10} fill="#0e1218" stroke="#2a3038" strokeWidth={2} />
      <rect x={6} y={8} width={88} height={174} rx={6} fill={state === 'wake' ? '#1c2a44' : '#0a0e14'} />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={12 + i * 7} y={30 - i * 4} width={4.5} height={4 + i * 4} fill="none" stroke="#9aa4b0" strokeWidth={1.1} />)}
      <path d="M11 36 L45 12 M45 36 L11 12" stroke="#e24a3a" strokeWidth={2.6} strokeLinecap="round" />
      <g transform="translate(60 16)">
        <rect x={0} y={0} width={26} height={11} rx={2.5} fill="none" stroke="#c9d2dc" strokeWidth={1.4} />
        <rect x={26.8} y={3.5} width={2.4} height={4} fill="#c9d2dc" />
        <rect x={1.8} y={1.8} width={Math.max(2, (battery / 100) * 22)} height={7.4} fill="#e24a3a" />
      </g>
      <text x={50} y={104} textAnchor="middle" fontFamily={FONT} fontWeight={300} fontSize={30} fill="#dfe6ee">{state === 'wake' ? '2:14' : ''}</text>
      <rect x={30} y={168} width={40} height={3} rx={1.5} fill="#4a525c" />
    </svg>
  );
};

/** Flower-pop card frames (N16-09): four crisp tile borders over the painted tiles of `paintFlowerPopCard` (cards.ts), sliding up with `slide` 0..1 (`flowerSlide(frame)`). No text. */
export const FlowerPopFrame = ({slide = 1}: {slide?: number}) => {
  const dy = (1 - slide) * 900;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      {[[335, 485], [745, 485], [335, 895], [745, 895]].map(([cx, cy]) => <rect key={`${cx}-${cy}`} x={cx - 185} y={cy - 185 + dy} width={370} height={370} rx={14} fill="none" stroke="#7a5a3a" strokeWidth={6} />)}
    </svg>
  );
};
