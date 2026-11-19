// EDU-EP26-SHORT caption cards (Editor, 2026-11-19; redesign pass "Caption redesign": 61 shorter cards, 71 px text, pop-in transition).
// Pure data on the composition clock G (30 fps, 1894 f). Source text: timed-sheet-a.md / timed-sheet-b.md (EDU-EP26-SHEET-R2) "VO + subtitles",
// Thai verbatim from script EDU-EP26-SCRIPT-R3 (scripts/edu-series/ep26/short/script.md); the voice is the locked EDU-EP26-VOICE-R3 read.
// Split rule: at an acoustic pause of the narration (ffmpeg silencedetect -30 dB, 0.05 s, on public/narration/EDU-EP26-SHORT-narration-v1.wav; the
// card appears 2 f before the next word onset = pause end) or, inside a pause-free phrase, at a Thai word boundary placed by syllable
// interpolation between the pause ends (marked `~` in build-notes.md "Caption redesign"). Low-confidence anchors (L05, L15 first half, L17, L03 vow)
// use the pauses or the line start/end, never the Whisper word onset. Every card is one line (widest 650 px at 71.4 px, box x120-888 centred at
// 540 allows 696), never splits a word, and stays on screen at least 15 f (0.5 s); a card runs to the next card's onset (the line gaps stay
// captioned); no caption from G1834 (the 2.0 s hold). Shared by src/videos/edu-ep26/index.ts (timeline captions, hidden: preset none),
// src/videos/edu-ep26/chrome.tsx (the drawn captions with the pop-in) and the plate overlay (`CaptionShade`, cue-gated, sized by the card's line count).
import type {CaptionCue} from '../kit/screen';
import {FPS, rowOf} from './shots/index';

export type Edu26Card = {id: string; from: number; to: number; text: string};
const raw: [string, number, number, string][] = [
  ['L01a', 0, 42, 'ช่างซักผ้าโรมัน'],
  ['L01b', 42, 76, 'ซักผ้าด้วยฉี่'],
  ['L01c', 76, 114, 'ใช่ ฉี่'],
  ['L01d', 114, 148, 'ฟังไม่ผิดหรอก'],
  ['L02a', 148, 173, 'วันนี้เป็นวันแรก'],
  ['L02b', 173, 195, 'ของมาร์คุส'],
  ['L02c', 195, 240, 'และยังไม่มีใครบอกเขา'],
  ['L03a', 240, 277, 'ผมจะทำให้เสื้อตัวนี้'],
  ['L03b', 277, 318, 'ขาวที่สุดในโรม'],
  ['L03c', 318, 360, 'ด้วยสองมือนี้เลยครับ'],
  ['L04a', 360, 389, 'รุ่นพี่ยิ้ม'],
  ['L04b', 389, 430, 'ยื่นไหให้ใบหนึ่ง'],
  ['L04c', 430, 460, 'ฝาเปิดปุ๊บ'],
  ['L04d', 460, 484, 'กลิ่นมาถึงก่อน'],
  ['L04e', 484, 516, 'คำอธิบาย'],
  ['L05a', 516, 543, 'พี่…'],
  ['L05b', 543, 620, 'ไหนี่มันฉี่ใช่ไหม'],
  ['L06a', 620, 650, 'ของดีนะ'],
  ['L06b', 650, 669, 'ใส่เยอะ ๆ'],
  ['L06c', 669, 695, 'ไม่ต้องเกรงใจ'],
  ['L07a', 695, 714, 'มาร์คุสคิดว่า'],
  ['L07b', 714, 746, 'นี่แย่สุดแล้ว'],
  ['L07c', 746, 767, 'ผิดจ้ะ'],
  ['L08a', 767, 803, 'สองมือที่สัญญาไว้'],
  ['L08b', 803, 840, 'เปลี่ยนเป็นสองเท้า'],
  ['L08c', 840, 871, 'ลงไปยืนในอ่าง'],
  ['L08d', 871, 900, 'ย่ำผ้าในน้ำ'],
  ['L08e', 900, 926, 'ผสมฉี่'],
  ['L10a', 926, 944, 'แม่ครับ…'],
  ['L10b', 944, 971, 'ผมสมัคร'],
  ['L10c', 971, 994, 'งานผิดร้าน'],
  ['L10d', 994, 1042, 'แน่เลย'],
  ['L12a', 1042, 1063, 'ตกเย็น'],
  ['L12b', 1063, 1086, 'ลูกค้ามารับ'],
  ['L12c', 1086, 1125, 'ยกเสื้อขึ้นส่องแดด'],
  ['L13a', 1125, 1151, 'ขาวดีนะ'],
  ['L13b', 1151, 1187, 'ใช้อะไรซักเนี่ย'],
  ['L14a', 1187, 1204, 'เอ่อ…'],
  ['L14b', 1204, 1231, 'สูตรลับ'],
  ['L14c', 1231, 1267, 'ของร้านครับ'],
  ['L15a', 1267, 1312, 'ได้ค่าแรงเหรียญแรก'],
  ['L15b', 1312, 1336, 'มาร์คุสรีบ'],
  ['L15c', 1336, 1367, 'ยกขึ้นมาดม'],
  ['L16a', 1367, 1420, 'ไม่มีกลิ่น…'],
  ['L16b', 1420, 1446, 'รอดแล้ว'],
  ['L17a', 1446, 1464, 'ตลกคือ'],
  ['L17b', 1464, 1505, 'จักรพรรดิเวสปาเซียน'],
  ['L17c', 1505, 1522, 'เก็บภาษี'],
  ['L17d', 1522, 1550, 'ฉี่จริง ๆ'],
  ['L18a', 1550, 1568, 'ลูกชายบ่น'],
  ['L18b', 1568, 1588, 'เขาเลยเอาเหรียญ'],
  ['L18c', 1588, 1618, 'จ่อจมูกลูก'],
  ['L18d', 1618, 1648, 'ถามว่าเหม็นไหม'],
  ['L19a', 1648, 1665, 'ลูกบอกไม่'],
  ['L19b', 1665, 1687, 'เขาก็บอก'],
  ['L19c', 1687, 1705, 'นั่นแหละ'],
  ['L19d', 1705, 1736, 'ได้มาจาก'],
  ['L19e', 1736, 1753, 'ฉี่'],
  ['L20a', 1753, 1775, 'เงินน่ะไม่มี'],
  ['L20b', 1775, 1805, 'กลิ่นหรอก…'],
  ['L20c', 1805, 1834, 'แต่มาร์คุสยังมี'],
];
export const EDU26_CARDS: readonly Edu26Card[] = raw.map(([id, from, to, text]) => ({id, from, to, text}));
export const CAPTION_END = 1834;

/** Caption events for `assemblePaintedTimeline`: every scene starts with a cue ('' = none); a gap between cards is cleared. */
export const edu26CaptionEvents = (cutStarts: number[], total: number): {at: number; text: string}[] => {
  const ev: {at: number; text: string}[] = [];
  const at = (f: number) => EDU26_CARDS.find((c) => c.from <= f && f < c.to);
  for (const c of EDU26_CARDS) {
    ev.push({at: c.from, text: c.text});
    if (!EDU26_CARDS.some((n) => n.from === c.to) && c.to < total && !cutStarts.includes(c.to)) ev.push({at: c.to, text: ''});
  }
  for (const start of cutStarts) if (!ev.some((e) => e.at === start)) ev.push({at: start, text: at(start)?.text ?? ''});
  return ev.sort((a, b) => a.at - b.at);
};

const lines = (text: string) => text.split('\n').length;

/**
 * `CaptionShade` cues of one plate in the plate's own clock (seconds from its timeline cue: `row.start - pre`, so B04-SH01 starts at
 * G1037 with its dissolve), `[from, to, lines]`, clipped to the span the plate is on screen.
 */
export const shadeCuesFor = (shotId: string): CaptionCue[] => {
  const row = rowOf(shotId), zero = row.start - (row.pre ?? 0), end = row.start + row.len;
  return EDU26_CARDS.filter((c) => c.to > zero && c.from < end).map((c) => [
    Math.max(0, c.from - zero) / FPS, (Math.min(end, c.to) - zero) / FPS, lines(c.text),
  ] as const);
};

/**
 * Peak strength of the caption shade (production-requirements#caption-backdrop: the lowest value that reads). Measured per shot with
 * scripts/caption-zone.py on the band under the caption (build-notes.md "W5 Editor integration"); `default` unless the shot is listed.
 */
export const SHADE_STRENGTH: {default: number; [shot: string]: number} = {default: 0.2};
export const shadeStrengthFor = (shotId: string): number => SHADE_STRENGTH[shotId] ?? SHADE_STRENGTH.default;

/** Caption text scale on the shared 51 px portrait caption (production-requirements#caption-look unchanged: stroke 14 px, halo). 51 x 1.4 = 71.4 px. */
export const CAPTION_SCALE = 1.4;

/**
 * Caption transition (one pop-in, pure function of the composition frame G, seek-safe). Chosen over a slide or a plain fade: the cards are
 * short and run back to back, so the new card must be readable from its first frames and the old one needs no exit. In: 5 f ease-out
 * (cubic), rise 22 px to rest, scale 0.9 -> 1, opacity 0 -> 1 over 3 f (a card is fully opaque 3 f = 0.1 s after it starts, so the
 * 17-18 f cards keep about 0.4 s fully settled). Out: only a card followed by no caption (the last, G1834) fades over 4 f; a card followed
 * by another is replaced at the new card's first frame. The first card (G0) is at rest from frame 0. Returns null when no card is on screen.
 */
export const POP_IN_FRAMES = 5, POP_OPACITY_FRAMES = 3, POP_FADE_OUT_FRAMES = 4, POP_RISE_PX = 22, POP_FROM_SCALE = 0.9;
export const captionPose = (g: number): {card: Edu26Card; opacity: number; dy: number; scale: number} | null => {
  const card = EDU26_CARDS.find((c) => c.from <= g && g < c.to);
  if (!card) return null;
  if (card.from === 0) return {card, opacity: 1, dy: 0, scale: 1};   // subtitles from frame 0: the first card does not pop
  const k = g - card.from, e = 1 - Math.pow(1 - Math.min(1, k / POP_IN_FRAMES), 3);
  const followed = EDU26_CARDS.some((n) => n.from === card.to);
  const fadeOut = followed ? 1 : Math.min(1, (card.to - g) / POP_FADE_OUT_FRAMES);
  return {card, opacity: Math.min(1, (k + 1) / POP_OPACITY_FRAMES) * fadeOut, dy: (1 - e) * POP_RISE_PX, scale: POP_FROM_SCALE + (1 - POP_FROM_SCALE) * e};
};
