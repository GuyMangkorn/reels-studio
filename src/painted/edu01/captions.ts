// EDU-EP01-SHORT captions (W5.3, Editor, 4 Nov 2026): script EDU-SCRIPT-R1.1 "Sub" wording, timed to the locked Kore v1 take
// (narration-measure-kore.json phrase onsets/ends, frames = sheet EDU-SHEETS-R1.1 per-shot L-ranges) on the composition clock.
// Cue [from, to) in global frames; `to` = phrase end + 6 f, clamped to the end of the shot that holds it. Pure data, no React.
import {EDU1_SHOTS} from './plates';

export type EduCue = {from: number; to: number; text: string};

/** Composition y of the caption block's vertical centre (2-line block with bottom edge 1248; faces sit above y 840). */
export const EDU1_CAPTION_CENTRE_Y = 1164;
/** CaptionShade peak opacity: the lowest rung of the UT12 ladder 0.5 / 0.4 / 0.3 that passes caption-zone.py (delivery.md W5.3). */
export const EDU1_SHADE_STRENGTH = 0.3;

export const EDU1_CUES: EduCue[] = [
  {from: 10, to: 124, text: 'กำลังจะหลับ… แล้วจู่ ๆ ก็รู้สึก\nเหมือนตกจากที่สูง และตัวกระตุก'},
  {from: 128, to: 161, text: 'คุณก็เคยใช่ไหม?'},
  {from: 165, to: 274, text: 'ตอนที่เราเริ่มเคลิ้ม…\nจากตื่น ไปสู่หลับตื้น ๆ'},
  {from: 278, to: 331, text: 'กล้ามเนื้อ จะเริ่มคลายลง'},
  {from: 335, to: 411, text: 'บางที ก็มีภาพแวบเข้ามา…'},
  {from: 415, to: 461, text: 'เหมือนก้าวพลาด ตรงขอบหน้าผา'},
  {from: 466, to: 490, text: 'ที่ไม่มีอยู่จริง'},
  {from: 579, to: 613, text: 'อาการนี้มีชื่อนะ'},
  {from: 617, to: 719, text: 'เรียกว่า ฮิปนิก เจิร์ก\nหรือ อาการกระตุกตอนเคลิ้มหลับ'},
  {from: 723, to: 842, text: 'แล้วมันเกิดจากอะไร?\nยังไม่มีใครรู้แน่ชัด'},
  {from: 846, to: 882, text: 'มีหลายสมมติฐาน'},
  {from: 886, to: 1008, text: 'บ้างว่า สมองทำงานสะดุด\nตอนสลับจากตื่นไปหลับ'},
  {from: 1012, to: 1053, text: 'บ้างว่า สมองอาจเข้าใจผิด'},
  {from: 1056, to: 1153, text: 'คิดว่ากล้ามเนื้อที่คลาย คือกำลังตก'},
  {from: 1157, to: 1198, text: 'เลยสั่งกระตุกไว้ก่อน'},
  {from: 1202, to: 1269, text: 'แต่ทั้งหมดนี้…\nยังไม่มีใครพิสูจน์ได้'},
  {from: 1273, to: 1415, text: 'มีรายงานว่า มันเชื่อมโยงกับ…\nคาเฟอีน · ความเครียด · การอดนอน'},
  {from: 1419, to: 1483, text: 'ออกกำลังหนัก ๆ ใกล้เวลานอน'},
  {from: 1487, to: 1582, text: 'อาการนี้พบได้บ่อย\nและส่วนใหญ่ ไม่อันตราย'},
  {from: 1586, to: 1637, text: 'ถ้าสะดุ้งถี่จนนอนไม่หลับ'},
  {from: 1641, to: 1746, text: 'หรือมีอาการกระตุกแบบอื่นด้วย\nควรปรึกษาแพทย์'},
  // L16: the trailing "…" stays on screen into the seam (script), so the cue runs to the last frame.
  {from: 1750, to: 1860, text: 'คืนนี้ ลองสังเกตดูนะ\nว่าตอนที่คุณ…'},
];

const starts = EDU1_SHOTS.map((_, i) => EDU1_SHOTS.slice(0, i).reduce((a, [, n]) => a + n, 0));
export const EDU1_SHOT_START: Record<string, number> = Object.fromEntries(EDU1_SHOTS.map(([id], i) => [id, starts[i]]));

/** Shade cues of one shot in shot-local seconds `[from, to, lines]` (cues clipped to the shot). */
export const eduShadeCues = (shotId: string): [number, number, number][] => {
  const i = EDU1_SHOTS.findIndex(([id]) => id === shotId);
  const s = starts[i], e = s + EDU1_SHOTS[i][1];
  return EDU1_CUES.filter((c) => c.from < e && c.to > s)
    .map((c): [number, number, number] => [(Math.max(c.from, s) - s) / 30, (Math.min(c.to, e) - s) / 30, c.text.split('\n').length]);
};

/** Caption events on the composition clock: text at a cue start, blank at its end, every scene opens with an event (repeats a cue live at the cut). */
export const eduCaptionEvents = () => {
  const ev = new Map<number, string>();
  for (const c of EDU1_CUES) if (c.to < 1860) ev.set(c.to, ev.get(c.to) ?? '');
  for (const c of EDU1_CUES) ev.set(c.from, c.text);
  starts.forEach((s) => {
    if (ev.has(s)) return;
    const live = EDU1_CUES.find((c) => c.from < s && c.to > s);
    ev.set(s, live ? live.text : '');
  });
  return [...ev].sort((a, b) => a[0] - b[0]).map(([at, text]) => ({at, text}));
};
