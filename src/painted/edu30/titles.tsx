import {newsreelWeave} from './newsreel';

// EDU-EP30 newsreel title cards (VD30-09; ticket T02 r1). Screen space, drawn by the T03 adapter above the NewsreelOverlay and below the captions.
// Outside the CSS tint filter (cream is already in the tint family); moves with the gate weave only, never with the VD30-11 canvas shake.

export type TitleSize = 92 | 58;
export type TitleRow = {shot: string; text: string; in: number; out: number; size: TitleSize};

/** The six cards in global frames [in, out) (SCENE-R2 Title overlay lines). */
export const TITLES: TitleRow[] = [
  {shot: 'B02-SH01', text: 'แคมเปียน รัฐเวสเทิร์นออสเตรเลีย · 1932', in: 206, out: 240, size: 58},
  {shot: 'B03-SH01', text: 'แผน 1', in: 704, out: 734, size: 92},
  {shot: 'B04-SH01', text: 'แผน 2', in: 868, out: 898, size: 92},
  {shot: 'B05-SH01', text: 'แผน 3', in: 1150, out: 1180, size: 92},
  {shot: 'B05-SH03', text: 'ถอนทัพ รอบที่ 1', in: 1363, out: 1388, size: 92},
  {shot: 'B06-SH04', text: 'ถอนทัพ รอบที่ 2', in: 1715, out: 1737, size: 92},
];

export const BAND = {top: 300, bottom: 475, cx: 540, pad: 72, minW: 420} as const;
export const FLICKER = [0, 0.8, 0.35, 1] as const;
const CREAM = '#efe3c4';
const SPACING = 0.02;

/** Advance widths in em of Noto Sans Thai 700 (public/fonts/NotoSansThai.ttf, canvas measureText, no letter-spacing); other strings use 0.5 em per base glyph. */
const EM: Record<string, number> = {
  'แคมเปียน รัฐเวสเทิร์นออสเตรเลีย · 1932': 17.055, 'แผน 1': 2.802, 'แผน 2': 2.802, 'แผน 3': 2.802, 'ถอนทัพ รอบที่ 1': 6.716, 'ถอนทัพ รอบที่ 2': 6.716,
};
const COMBINING = /[ัิ-ฺ็-๎]/g;
export const textWidth = (text: string, size: number): number => {
  const em = EM[text] ?? text.replace(COMBINING, '').length * 0.5;
  return em * size + text.length * SPACING * size;
};
export const boxWidth = (text: string, size: number): number => Math.max(BAND.minW, textWidth(text, size) + 2 * BAND.pad);

/** Frame opacity: 0.0, 0.8, 0.35, 1.0 over in+0 … in+3, then 1.0. */
export const titleOpacity = (frame: number, inFrame: number): number => (frame - inFrame < FLICKER.length ? FLICKER[frame - inFrame] : 1);

export const NewsreelTitle = ({text, frame, inFrame, outFrame, size}: {text: string; frame: number; inFrame: number; outFrame: number; size: TitleSize}) => {
  if (frame < inFrame || frame >= outFrame) return null;
  const w = boxWidth(text, size), h = BAND.bottom - BAND.top, left = BAND.cx - w / 2;
  const R = w, B = h, i = 22;
  // inner rule: two 10 px steps cut each corner
  const inner = `M${i + 20},${i} H${R - i - 20} V${i + 10} H${R - i - 10} V${i + 20} H${R - i} V${B - i - 20} H${R - i - 10} V${B - i - 10} H${R - i - 20} V${B - i} H${i + 20} V${B - i - 10} H${i + 10} V${B - i - 20} H${i} V${i + 20} H${i + 10} V${i + 10} H${i + 20} Z`;
  return (
    <div data-band-top={BAND.top} data-band-bottom={BAND.bottom} data-box-w={w.toFixed(1)} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, pointerEvents: 'none', ...newsreelWeave({frame})}}>
      <div data-opacity={titleOpacity(frame, inFrame)} style={{position: 'absolute', left, top: BAND.top, width: w, height: h, opacity: titleOpacity(frame, inFrame)}}>
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', left: 0, top: 0}}>
          <rect x={0} y={0} width={w} height={h} fill="rgba(20,14,8,0.62)" />
          <rect x={14} y={14} width={w - 28} height={h - 28} fill="none" stroke={CREAM} strokeWidth={3} />
          <path d={inner} fill="none" stroke={CREAM} strokeWidth={1.5} />
        </svg>
        <div lang="th" style={{position: 'absolute', left: 0, top: 0, width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', fontFamily: 'Noto Sans Thai', fontWeight: 700, fontSize: size, letterSpacing: `${SPACING}em`, color: CREAM}}>{text}</div>
      </div>
    </div>
  );
};
