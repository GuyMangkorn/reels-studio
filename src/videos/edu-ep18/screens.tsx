import type {CSSProperties, ReactNode} from 'react';
import {FONT} from '../../painted/survival/frame';

// EDU-EP18 screen layers (Editor, 14 Nov 2026): the recipe card RCP with its measured line onsets, the corner chip and the safety strip SAF, from
// scripts/edu-series/ep18/storyboard.md "On-screen text" (R1.1). Look and geometry copy Boss's `RecipeCard`/`Safety` (src/painted/survival/screens.tsx), which draw all three
// lines at once and have no state animation; the reveal (pop per line, card -> chip, strip fades) is timeline staging and lives here. Asset need N18-07: a `lines`/`shrink` prop on the shared layer.
// Every layer stays inside x 120-888. Numerals 88 px while the card is full (f1264-1394).
const T: CSSProperties = {fontFamily: FONT, color: '#2b211c', lineHeight: 1.05, whiteSpace: 'nowrap'};
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => { const k = clamp(v); return k * k * (3 - 2 * k); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const Num = ({children, size}: {children: ReactNode; size: number}) => <span style={{fontWeight: 900, fontSize: size, color: '#b5473a'}}>{children}</span>;

/** Global frame `g`: line pops (6 f, scale .85 -> 1 with fade) at f1264 / f1302 / f1352; full to f1394, shrinks over 10 f to the chip; fades out f1530-1545. */
export const RECIPE_AT = {l1: 1264, l2: 1302, l3: 1352, shrink: 1394, shrinkLen: 10, off: 1530, offLen: 15};
export const RecipeCardAnim = ({g}: {g: number}) => {
  const k = ease((g - RECIPE_AT.shrink) / RECIPE_AT.shrinkLen);
  const op = 1 - clamp((g - RECIPE_AT.off) / RECIPE_AT.offLen);
  if (g < RECIPE_AT.l1 || op <= 0) return null;
  const box = {left: lerp(120, 528, k), top: 160, width: lerp(768, 360, k), height: lerp(340, 170, k), padding: `${lerp(18, 10, k)}px ${lerp(36, 18, k)}px`};
  const w = lerp(60, 30, k), n = lerp(88, 48, k);
  const pop = (at: number): CSSProperties => { const s = clamp((g - at) / 6); return {opacity: s, transform: `scale(${0.85 + 0.15 * s})`, transformOrigin: 'left center'}; };
  return (
    <div style={{position: 'absolute', ...box, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: lerp(6, 2, k), background: '#f4ead2', border: '4px solid #7a5a3a', borderRadius: 18, boxShadow: '0 6px 0 rgba(0,0,0,0.35)', opacity: op}}>
      <div style={{...T, fontSize: w, fontWeight: 700, ...pop(RECIPE_AT.l1)}}>น้ำต้มสุก <Num size={n}>1</Num> ลิตร</div>
      <div style={{...T, fontSize: w, fontWeight: 700, ...pop(RECIPE_AT.l2)}}>น้ำตาล <Num size={n}>6</Num> ช้อนชาปาด</div>
      <div style={{...T, fontSize: w, fontWeight: 700, ...pop(RECIPE_AT.l3)}}>เกลือ <Num size={n}>ครึ่ง</Num> ช้อนชาปาด</div>
      {k < 1 && <div style={{...T, fontSize: 40, fontWeight: 500, color: '#5a4636', marginTop: 2, ...pop(RECIPE_AT.l3), opacity: pop(RECIPE_AT.l3).opacity as number * (1 - k), height: lerp(42, 0, k)}}>ช้อนชามาตรฐาน</div>}
    </div>
  );
};

/** Safety strip SAF: two 44 px lines f1264-1515 (y 515 while the card is full, 345 from f1394-1404 with the chip); second message f1426-1515 at y 459. */
export const SafetyAnim = ({g}: {g: number}) => {
  const on = clamp((g - 1264) / 6) * (1 - clamp((g - 1515) / 8));
  if (on <= 0) return null;
  const top = lerp(515, 345, ease((g - 1394) / 10));
  const on2 = clamp((g - 1426) / 6) * (1 - clamp((g - 1515) / 8));
  return (
    <>
      <div style={{position: 'absolute', left: 120, top, width: 768, height: 104, background: 'rgba(20,16,14,0.82)', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: on}}>
        <span style={{...T, color: '#ffe9a8', fontSize: 44, fontWeight: 700}}>ในชีวิตจริง: ดื่มไม่ได้ หรืออาการหนัก</span>
        <span style={{...T, color: '#ffe9a8', fontSize: 44, fontWeight: 700}}>ต้องรีบหาหมอ</span>
      </div>
      {on2 > 0 && (
        <div style={{position: 'absolute', left: 120, top: 459, width: 768, height: 60, background: 'rgba(20,16,14,0.82)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: on2}}>
          <span style={{...T, color: '#ffffff', fontSize: 44, fontWeight: 700}}>มีซองเกลือแร่ ใช้ซองก่อน</span>
        </div>
      )}
    </>
  );
};
