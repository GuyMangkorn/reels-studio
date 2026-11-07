// EDU-EP06-SHORT timing data (W5.3 Draft, Editor, 7 Nov 2026). Pure data, no React. Source: scripts/edu-series/ep06/scene-sheets.md (EDU-EP06-SHEETS-R1.1:
// shot map, caption plan, shot blocks) and the store shots.json (OWN table, 1685 f). Shot lengths come from the plate list so the picture and the
// timeline cannot disagree.
import {EDU6_SHOTS, EDU6_TOTAL} from '../../painted/edu06/plates';

export const EDU6_FPS = 30;
export {EDU6_TOTAL};
const starts = EDU6_SHOTS.map((_, i) => EDU6_SHOTS.slice(0, i).reduce((a, [, n]) => a + n, 0));
export const EDU6_CUTS = EDU6_SHOTS.map(([id, n], i) => ({id, start: starts[i], end: starts[i] + n}));

/** Caption cues, global frames [from, to). Text = the spoken line verbatim (L03 = Film's "น่ารักจังเลย"); V01/V02 carry none. Cue rule: word onset to voiced end + 6, capped at the next cue or the cut. */
export type Edu6Cue = {from: number; to: number; text: string};
export const EDU6_CUES: Edu6Cue[] = [
  {from: 4, to: 46, text: 'จ้องตาแมวด้วยความรัก…'},                                   // L01
  {from: 50, to: 115, text: 'แมวหลายตัว…\nอาจอ่านสายตาแบบนี้ว่า…'},                      // L02a
  {from: 117, to: 156, text: 'เป็นการท้าทาย'},                                           // L02b
  {from: 160, to: 246, text: 'น่ารักจังเลย'},                                            // L03 (Film's one allowed subtitle choice)
  {from: 294, to: 339, text: 'ลองนึกจากฝั่งแมวดู…'},                                      // L04
  {from: 343, to: 407, text: 'ตาโต… ไม่กะพริบ… จ้องไม่วาง'},                             // L05
  {from: 411, to: 495, text: 'ในภาษากายแมว…\nแบบนี้อาจดูเป็นการข่มขู่…'},                 // L06a
  {from: 495, to: 522, text: 'มากกว่าความรัก'},                                          // L06b
  {from: 526, to: 584, text: 'ถ้าอยากส่งสัญญาณที่นุ่มกว่านั้น…'},                       // L07a
  {from: 584, to: 640, text: 'ลองกะพริบตาช้า ๆ'},                                        // L07b
  {from: 644, to: 709, text: 'หรี่ตาเหมือนยิ้ม…\nค่อย ๆ หลับ…'},                         // L08a
  {from: 717, to: 787, text: 'หนึ่ง… สอง…\nแล้วค่อย ๆ ลืม'},                              // L08b
  {from: 851, to: 884, text: 'ตอบกลับมาด้วย…'},                                          // L03b (OWN whisper)
  {from: 888, to: 955, text: 'งานวิจัยเล็ก ๆ ในอังกฤษพบว่า…'},                           // L09a
  {from: 957, to: 1040, text: 'แมวมีแนวโน้มหรี่ตา\nหรือกะพริบช้า ๆ ตอบ'},                 // L09b
  {from: 1044, to: 1112, text: 'และยอมขยับเข้าหามือคนแปลกหน้า…'},                        // L10a
  {from: 1112, to: 1179, text: 'มากกว่าตอนคนหันหน้าหนี\nนิดนึง'},                        // L10b
  {from: 1183, to: 1269, text: 'ลองคืนนี้ดู…\nนั่งห่างสักเมตรนึง…'},                      // L11a
  {from: 1269, to: 1308, text: 'แล้วกะพริบช้า ๆ'},                                       // L11b
  {from: 1312, to: 1406, text: 'ไม่ใช่ทุกตัวจะตอบ…\nและให้มันเดินมาหาเอง'},                // L12
  {from: 1410, to: 1462, text: 'แต่ถ้ามันกะพริบกลับมา…'},                                // L13a
  {from: 1462, to: 1619, text: 'นั่นคือสัญญาณที่ดี ที่คนเลี้ยงแมว\nหลายคนเชื่อว่ามันกำลังบอก… รัก'}, // L13b: ends on the cut, no caption over SH04/SH05
];

/** Caption events for `assemblePaintedTimeline`: every scene starts with a cue ('' = none); a gap between cues is cleared. */
export const edu6CaptionEvents = (): {at: number; text: string}[] => {
  const ev: {at: number; text: string}[] = [];
  const at = (f: number) => EDU6_CUES.find((c) => c.from <= f && f < c.to);
  for (const c of EDU6_CUES) {
    ev.push({at: c.from, text: c.text});
    if (!EDU6_CUES.some((n) => n.from === c.to) && c.to < EDU6_TOTAL && !EDU6_CUTS.some((k) => k.start === c.to)) ev.push({at: c.to, text: ''});
  }
  for (const {start} of EDU6_CUTS) if (!ev.some((e) => e.at === start)) ev.push({at: start, text: at(start)?.text ?? ''});
  return ev.sort((a, b) => a.at - b.at);
};
