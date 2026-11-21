// EDU-EP31-SHORT caption cards (Editor, W5.3 Draft, 2026-11-21; 57 cards, 71.4 px). Pure data on the composition clock G (30 fps, 1795 f).
// Source: the "VO + subtitles" cards of scripts/edu-series/ep31/short/scene-sheets/b01.md-b07.md (EDU-EP31-SCENE-R1, speech measured on
// EDU-EP31-VOICE-R1), Thai verbatim from script EDU-EP31-SCRIPT-R2. Final split (Editor): the sheet's cards kept except the three whose text is
// wider than the box (widest allowed 682 px + 14 px stroke inside x120-888, measured in Chrome at 71.4 px, Noto Sans Thai 700):
// L03 "น้ำมะนาวเป็นหมึกล่องหน" 730 px -> "น้ำมะนาว" | "เป็นหมึกล่องหน" (split at the Whisper onset of "เป็น", f418, +1 for the 15 f minimum),
// L05 "ตอนแรกเขาก็ไม่เชื่อหรอก" 749 px -> "ตอนแรกเขาก็" | "ไม่เชื่อหรอก" (Whisper onset of "ไม่", f622),
// L14 "แต่ผมทาน้ำมะนาวแล้วนะ…" 784 px -> "แต่" (to the 12 f pause end, f1434) | "ผมทาน้ำมะนาว" | "แล้วนะ…" (syllable interpolation 1434-1476, `~`).
// Every card is one line, never splits a word, stays on screen at least 15 f and runs to the next card's onset (line gaps stay captioned); the
// last card holds to G1765 (sheet: Editor may hold to 1765); no caption in the rest of the hold. Bold lines of the script (L01, L06, L12, L15)
// are drawn at the shared weight (`Subtitles` has no bold variant). Shared by src/videos/edu-ep31/index.ts (timeline captions, hidden: preset none),
// src/videos/edu-ep31/chrome.tsx (drawn captions with the pop-in) and shot.tsx (`CaptionShade`, cue-gated, one-line cards).
import type {CaptionCue} from '../kit/screen';
import {FPS, rowOf} from './shots/index';

export type Edu31Card = {id: string; from: number; to: number; text: string};
const raw: [string, number, number, string][] = [
  ['L01a', 0, 40, 'ปี 1995'],
  ['L01b', 40, 75, 'ผู้ชายคนนี้กับเพื่อน'],
  ['L01c', 75, 108, 'ปล้นธนาคารสองแห่ง'],
  ['L01d', 108, 139, 'ในวันเดียว'],
  ['L01e', 139, 178, 'ไม่ใส่หน้ากากเลย…'],
  ['L01f', 178, 206, 'เพราะเขาทาน้ำมะนาว'],
  ['L01g', 206, 236, 'ที่หน้าไว้แล้ว'],
  ['L02a', 236, 292, 'น้ำมะนาว ใช่'],
  ['L02b', 292, 315, 'ที่บีบใส่ส้มตำ'],
  ['L02c', 315, 335, 'นั่นแหละ'],
  ['L03a', 335, 367, 'แมคอาเธอร์ วีลเลอร์'],
  ['L03b', 367, 404, 'ได้สูตรจากเพื่อน…'],
  ['L03c', 404, 419, 'น้ำมะนาว'],
  ['L03d', 419, 449, 'เป็นหมึกล่องหน'],
  ['L03e', 449, 469, 'ทาหน้าแล้ว'],
  ['L03f', 469, 506, 'กล้องมองไม่เห็น'],
  ['L04a', 506, 521, 'จริงนะ…'],
  ['L04b', 521, 547, 'บนกระดาษ'],
  ['L04c', 547, 564, 'แต่หน้าคน'],
  ['L04d', 564, 605, 'ไม่ใช่กระดาษจ้ะ'],
  ['L05a', 605, 622, 'ตอนแรกเขาก็'],
  ['L05b', 622, 642, 'ไม่เชื่อหรอก'],
  ['L05c', 642, 674, 'เลยทดสอบก่อน…'],
  ['L05d', 674, 704, 'ทาน้ำมะนาว'],
  ['L05e', 704, 743, 'ถ่ายโพลารอยด์ตัวเอง'],
  ['L06a', 743, 768, 'รูปออกมา…'],
  ['L06b', 768, 810, 'ไม่มีเขาเลยจริง ๆ'],
  ['L07a', 810, 834, 'ผลทดสอบ…'],
  ['L07b', 834, 860, 'ผ่าน!'],
  ['L07c', 860, 903, 'ได้เวลาไปปล้นธนาคาร'],
  ['L08a', 903, 936, 'เราเปิดกล้องหน้ายัง'],
  ['L08b', 936, 962, 'หามุมก่อน…'],
  ['L08c', 962, 989, 'เขาให้กล้องธนาคาร'],
  ['L08d', 989, 1029, 'ถ่ายหน้าเต็ม ๆ'],
  ['L09a', 1029, 1058, 'แล้วก็…'],
  ['L09b', 1058, 1099, 'รอดไปสามเดือนครึ่ง'],
  ['L09c', 1099, 1134, 'น้ำมะนาวได้ผล'],
  ['L09d', 1134, 1154, 'เหรอเนี่ย'],
  ['L10a', 1154, 1176, 'จนเดือนเมษา'],
  ['L10b', 1176, 1200, 'ภาพจากกล้องธนาคาร'],
  ['L10c', 1200, 1243, 'ขึ้นข่าวห้าทุ่ม'],
  ['L11a', 1243, 1280, 'ใครจำชายคนนี้ได้'],
  ['L11b', 1280, 1308, 'แจ้งตำรวจเลยครับ'],
  ['L12a', 1308, 1337, 'ไม่ถึงชั่วโมง…'],
  ['L12b', 1337, 1377, 'ตำรวจจับได้แล้ว'],
  ['L13', 1377, 1419, 'นี่คุณใช่ไหม'],
  ['L14a', 1419, 1434, 'แต่'],
  ['L14b', 1434, 1464, 'ผมทาน้ำมะนาว'],
  ['L14c', 1464, 1488, 'แล้วนะ…'],
  ['L14d', 1488, 1523, 'ผมทาน้ำมะนาวแล้ว'],
  ['L15a', 1523, 1554, 'นักจิตวิทยาคนหนึ่ง'],
  ['L15b', 1554, 1579, 'อ่านเรื่องนี้'],
  ['L15c', 1579, 1615, 'ถึงกับไปวิจัยเลยว่า'],
  ['L15d', 1615, 1652, 'ทำไมคนถึงมั่นใจ'],
  ['L15e', 1652, 1679, 'ได้ขนาดนี้'],
  ['L15f', 1679, 1707, 'ทั้งที่เรื่องนั้น…'],
  ['L15g', 1707, 1765, 'ไม่ได้รู้จริงเลย'],
];
export const EDU31_CARDS: readonly Edu31Card[] = raw.map(([id, from, to, text]) => ({id, from, to, text}));
export const CAPTION_END = 1765;

/** Caption events for `assemblePaintedTimeline`: every scene starts with a cue ('' = none); a gap between cards is cleared. */
export const edu31CaptionEvents = (cutStarts: readonly number[], total: number): {at: number; text: string}[] => {
  const ev: {at: number; text: string}[] = [];
  const at = (f: number) => EDU31_CARDS.find((c) => c.from <= f && f < c.to);
  for (const c of EDU31_CARDS) {
    ev.push({at: c.from, text: c.text});
    if (!EDU31_CARDS.some((n) => n.from === c.to) && c.to < total && !cutStarts.includes(c.to)) ev.push({at: c.to, text: ''});
  }
  for (const start of cutStarts) if (!ev.some((e) => e.at === start)) ev.push({at: start, text: at(start)?.text ?? ''});
  return ev.sort((a, b) => a.at - b.at);
};

const lines = (text: string) => text.split('\n').length;

/** `CaptionShade` cues of one plate in the plate's own clock (seconds from its start), `[from, to, lines]`, clipped to the span the plate is on screen. */
export const shadeCuesFor = (shotId: string): CaptionCue[] => {
  const row = rowOf(shotId), zero = row.start, end = row.start + row.N;
  return EDU31_CARDS.filter((c) => c.to > zero && c.from < end).map((c) => [
    Math.max(0, c.from - zero) / FPS, (Math.min(end, c.to) - zero) / FPS, lines(c.text),
  ] as const);
};

/**
 * Peak strength of the caption shade per shot (production-requirements#caption-backdrop: the lowest value that reads). Measured with
 * scripts/caption-zone.py --band 1100:1344 on shade-only stills (scripts/edu-series/ep31/short/clean-stills.mjs) and judged on a phone-size frame
 * check (build-notes.md "W5.3 Draft"); `default` unless the shot is listed.
 */
export const SHADE_STRENGTH: {default: number; [shot: string]: number} = {
  default: 0.2,   // raw band mean <= 0.35 or already passing (B03-SH03, B05-SH01..03, B07-*)
  'B01-SH01': 0.35, 'B01-SH02': 0.35, 'B01-SH03': 0.35, 'B02-SH01': 0.35, 'B02-SH02': 0.35, 'B03-SH01': 0.35, 'B03-SH02': 0.35, 'B03-SH04': 0.35,
  'B04-SH01': 0.35, 'B04-SH03': 0.35, 'B06-SH01': 0.35, 'B06-SH02': 0.35,   // raw mean 0.35-0.64
  'B01-SH04': 0.5, 'B02-SH03': 0.5, 'B03-SH05': 0.5, 'B04-SH02': 0.5, 'B05-SH04': 0.5,   // raw mean >= 0.70
};
export const shadeStrengthFor = (shotId: string): number => SHADE_STRENGTH[shotId] ?? SHADE_STRENGTH.default;

/** Caption text scale on the shared 51 px portrait caption (stroke 14 px, halo unchanged). 51 x 1.4 = 71.4 px (memory caption-size-ep26-default). */
export const CAPTION_SCALE = 1.4;

/** Caption transition: the EP26 pop-in (5 f ease-out rise 22 px, scale 0.9 -> 1, opacity over 3 f); the first card (G0) and a card that follows another do not fade. Pure function of G. */
export const POP_IN_FRAMES = 5, POP_OPACITY_FRAMES = 3, POP_FADE_OUT_FRAMES = 4, POP_RISE_PX = 22, POP_FROM_SCALE = 0.9;
export const captionPose = (g: number): {card: Edu31Card; opacity: number; dy: number; scale: number} | null => {
  const card = EDU31_CARDS.find((c) => c.from <= g && g < c.to);
  if (!card) return null;
  if (card.from === 0) return {card, opacity: 1, dy: 0, scale: 1};
  const k = g - card.from, e = 1 - Math.pow(1 - Math.min(1, k / POP_IN_FRAMES), 3);
  const followed = EDU31_CARDS.some((n) => n.from === card.to);
  const fadeOut = followed ? 1 : Math.min(1, (card.to - g) / POP_FADE_OUT_FRAMES);
  return {card, opacity: Math.min(1, (k + 1) / POP_OPACITY_FRAMES) * fadeOut, dy: (1 - e) * POP_RISE_PX, scale: POP_FROM_SCALE + (1 - POP_FROM_SCALE) * e};
};
