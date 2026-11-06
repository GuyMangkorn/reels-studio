// EDU-EP02-SHORT captions (W5.3, Editor, 5 Nov 2026): script EDU-SCRIPT-R1.1 "Sub" wording with the cue frames of the scene sheets
// SS-R2 (scripts/edu-series/ep02/scenes/*.md, "VO + subtitles" lines; composition clock, [from, to) in global frames at 30 fps).
// Pure data, no React. Shot starts come from EDU2_SHOTS in shots.tsx; this file never re-implements a shot.
import {EDU2_SHOTS} from './shots';

export type Edu2Cue = {from: number; to: number; text: string};

/** Video-level caption anchor (SS-R2 index): block bottom edge y 1344, band y 1176-1344, at most two lines. */
export const EDU2_CAPTION_BOTTOM_Y = 1344;
export const EDU2_CAPTION_BAND = '1176:1344';
/**
 * Caption shade on bright grounds (user, 5 Nov 2026): a text edge, not a dark band. `outline` preset with a heavier warm-black stroke and a soft
 * dark halo; stroke width is the CSS stroke centred on the glyph edge (paint-order stroke fill), so half of it shows.
 */
export {CAPTION_OUTLINE as EDU2_CAPTION_SHADE} from '../../scenes/media';

export const EDU2_CUES: Edu2Cue[] = [
  {from: 8, to: 59, text: 'หัวหอมไม่ได้ทำให้คุณร้องไห้…'},
  {from: 59, to: 119, text: 'จนกว่าคุณจะทำร้ายมันก่อน'},
  {from: 172, to: 230, text: 'หัวหอมทั้งหัว วางไว้เฉย ๆ…'},
  {from: 230, to: 276, text: 'แทบไม่มีอะไรเกิดขึ้น'},
  {from: 287, to: 321, text: 'แต่พอมีดลงปุ๊บ…'},
  {from: 330, to: 415, text: 'ในเซลล์ มีเอนไซม์ กับสารที่มีกำมะถัน'},
  {from: 415, to: 460, text: 'ซึ่งปกติแยกกันอยู่'},
  {from: 461, to: 526, text: 'พอเซลล์แตก ทั้งสองก็เจอกัน…'},
  {from: 526, to: 590, text: 'แล้วเอนไซม์อีกตัว เปลี่ยนให้เป็นแก๊ส'},
  {from: 590, to: 632, text: 'ที่ทำให้น้ำตาไหล'},
  {from: 635, to: 686, text: 'แก๊สลอยขึ้นมาถึงผิวตา…'},
  {from: 686, to: 732, text: 'ปลายประสาทที่กระจกตาจับได้'},
  {from: 732, to: 784, text: 'ก็สั่งให้น้ำตาไหลออกมาล้าง'},
  {from: 789, to: 822, text: 'ไม่ได้ซึ้งนะ…'},
  {from: 822, to: 866, text: 'ตาแค่กำลังล้างตัวเอง'},
  {from: 879, to: 925, text: 'แล้วเคล็ดลับที่เขาว่ากัน?'},
  {from: 933, to: 976, text: 'คาบขนมปังไว้ในปาก…'},
  {from: 976, to: 1028, text: 'แต่ที่โดนแก๊สคือตา ไม่ใช่ปาก'},
  {from: 1055, to: 1082, text: 'จุดเทียน…'},
  {from: 1082, to: 1143, text: 'ผลที่คนลองกันเอง ยังไม่ตรงกัน'},
  {from: 1158, to: 1182, text: 'แช่ตู้เย็น?'},
  {from: 1182, to: 1222, text: 'หลักฐานยังไม่ชัด'},
  {from: 1239, to: 1319, text: 'ที่ดูได้ผลที่สุด\nในการลองแบบไม่เป็นทางการ…'},
  {from: 1319, to: 1347, text: 'คือแว่นว่ายน้ำ'},
  {from: 1358, to: 1379, text: 'ดูตลก…'},
  {from: 1379, to: 1423, text: 'แต่แก๊สไปถึงตาไม่ค่อยได้'},
  {from: 1431, to: 1490, text: 'ส่วนมีดคม ๆ กับการหั่นช้า ๆ'},
  {from: 1490, to: 1542, text: 'ช่วยลดละอองที่กระเด็นออกมา'},
  {from: 1553, to: 1606, text: 'หัวหอมไม่ได้ตั้งใจแกล้งใครหรอก'},
  {from: 1612, to: 1638, text: 'น้ำตาคุณ…'},
  {from: 1638, to: 1691, text: 'ก็เหมือนสัญญาณกันขโมยของหัวหอม'},
  {from: 1691, to: 1732, text: 'ที่ดังเฉพาะตอนโดนบุก'},
];

export const EDU2_TOTAL = EDU2_SHOTS.reduce((a, [, n]) => a + n, 0);
const starts = EDU2_SHOTS.map((_, i) => EDU2_SHOTS.slice(0, i).reduce((a, [, n]) => a + n, 0));
export const EDU2_SHOT_START: Record<string, number> = Object.fromEntries(EDU2_SHOTS.map(([id], i) => [id, starts[i]]));
export const EDU2_CUTS = EDU2_SHOTS.map(([id, n], i) => ({id, start: starts[i], end: starts[i] + n}));

/** Caption events on the composition clock: text at a cue start, blank at its end, every scene opens with an event (repeats a cue live at the cut). */
export const edu2CaptionEvents = () => {
  const ev = new Map<number, string>();
  for (const c of EDU2_CUES) ev.set(c.to, ev.get(c.to) ?? '');
  for (const c of EDU2_CUES) ev.set(c.from, c.text);
  starts.forEach((s) => {
    if (ev.has(s)) return;
    const live = EDU2_CUES.find((c) => c.from < s && c.to > s);
    ev.set(s, live ? live.text : '');
  });
  return [...ev].sort((a, b) => a[0] - b[0]).map(([at, text]) => ({at, text}));
};
