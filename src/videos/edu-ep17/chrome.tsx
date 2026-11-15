import {useCurrentFrame} from 'remotion';
import {Card, Lbl} from '../../painted/edu17/frame';

/**
 * EDU-EP17-SHORT screen layers on the composition clock (Editor, W5.3 redraft; scene sheets EDU-EP17-SHEETS-R1.2 shot map): the reconstruction grade (saturation 45 %, cool grey
 * tint #9aa6ad 15 %, soft vignette; brief VD) over G1064-1207 and G1252-1364, LBL "ภาพจำลอง" G1064-1364, CARD "2024 · ทะเลแดง" G1064-1207. The overlay layer sits above the canvas,
 * captions and mark, so the grade is a backdrop filter plus two blend layers and the LBL/CARD are drawn after it (they stay in colour). Pure function of the frame.
 */
export const GRADE_SPANS: readonly (readonly [number, number])[] = [[1064, 1207], [1252, 1364]];
export const LBL_SPAN = [1064, 1364] as const;
export const CARD_SPAN = [1064, 1207] as const;
export const chromeAt = (f: number) => ({
  grade: GRADE_SPANS.some(([a, b]) => f >= a && f < b),
  lbl: f >= LBL_SPAN[0] && f < LBL_SPAN[1],
  card: f >= CARD_SPAN[0] && f < CARD_SPAN[1],
});

export const Edu17Chrome = () => {
  const o = chromeAt(useCurrentFrame());
  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {o.grade && <>
        <div style={{position: 'absolute', inset: 0, backdropFilter: 'saturate(0.45)', WebkitBackdropFilter: 'saturate(0.45)'}} />
        <div style={{position: 'absolute', inset: 0, background: '#9aa6ad', mixBlendMode: 'color', opacity: 0.15}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, rgba(15,18,22,0) 55%, rgba(15,18,22,0.4) 100%)'}} />
      </>}
      {o.lbl && <Lbl />}
      {o.card && <Card />}
    </div>
  );
};
