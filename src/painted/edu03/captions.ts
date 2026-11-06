// EDU-EP03-SHORT captions (W5.3, Editor, 5 Nov 2026): script EDU-SCRIPT-R1.1 wording with the sub frames of the scene sheets SS-R3.1
// (scripts/edu-series/ep03/scenes/*.md, "VO + subtitles" lines; composition clock, [from, to) in global frames at 30 fps). Pure data, no React.
import {EDU3_SHOTS, EDU3_START} from './shots';

export type Edu3Cue = {from: number; to: number; text: string};

/** Caption anchor (SS-R3.1 index, brief VD11): block bottom edge y 1344, band y 1176-1344, at most two lines. */
export const EDU3_CAPTION_BOTTOM_Y = 1344;
/** Caption shade = the EP02 shade (user, 5 Nov 2026, "ตาม ep02"): outline + dark halo, no band. */
export {EDU2_CAPTION_SHADE as EDU3_CAPTION_SHADE} from '../edu02/captions';

export const EDU3_CUES: Edu3Cue[] = [
  {from: 8, to: 58, text: 'ลูกบอลสีแดง ที่คุณซื้อให้หมา…'},
  {from: 64, to: 146, text: 'ในสายตามัน อาจดูคล้ายหญ้า\nมากกว่าที่คุณคิด'},
  {from: 166, to: 218, text: 'ไปเลย! เอามา!'},
  {from: 318, to: 376, text: 'ตรงนั้นไง! ข้างหน้าเลย!'},
  {from: 384, to: 466, text: 'มันไม่ได้ซื่อบื้อนะ…\nลองดูโลกผ่านตาหมากัน'},
  {from: 477, to: 552, text: 'สีแดงกับสีเขียว…\nแยกยากสำหรับหมา'},
  {from: 560, to: 624, text: 'แต่สีฟ้ากับสีเหลือง\nมันเห็นได้ดี'},
  {from: 637, to: 724, text: 'ลูกบอลแดงบนหญ้าเขียว…\nเลยอาจไม่เด่นเท่าที่เราเห็น'},
  {from: 739, to: 871, text: 'ทำไมล่ะ?… ในตาคนมีเซลล์รับสี สามแบบ…\nหมามีแค่ สองแบบ'},
  {from: 882, to: 936, text: 'แต่ไม่ได้แปลว่าหมาเห็นเป็นขาวดำนะ'},
  {from: 988, to: 1048, text: 'หมาเห็นสี แค่เห็นไม่เหมือนเรา'},
  {from: 1069, to: 1192, text: 'สุดท้ายมันก็หาเจอ…\nเพราะหมาไม่ได้ใช้แค่ตา มันใช้จมูกช่วยด้วย'},
  {from: 1210, to: 1253, text: 'คราวนี้ลองลูกสีฟ้า…'},
  {from: 1269, to: 1353, text: 'บนหญ้าเขียว\nหมาน่าจะเห็นชัดกว่าสีแดง'},
  {from: 1386, to: 1571, text: 'ครั้งหน้าที่ซื้อของเล่น…\nลองถามตัวเองว่า… หมาเห็นมันไหม'},
];

export const EDU3_TOTAL = EDU3_SHOTS.reduce((a, [, n]) => a + n, 0);
export const EDU3_CUTS = EDU3_SHOTS.map(([id, n]) => ({id, start: EDU3_START[id], end: EDU3_START[id] + n}));
/** VD04/VD08 tag ranges (SS-R3.1 shot map): from the first flip frame to the last flip-back frame; B07 untagged. */
export const EDU3_TAG = 'ภาพจำลอง (โดยประมาณ)';
export const EDU3_TAG_TOP = 200;
export const EDU3_TAGGED = new Set(['S01-B03-SH01', 'S01-B03-SH02', 'S01-B03-SH03', 'S01-B04-SH01', 'S01-B04-SH02', 'S01-B06-SH02']);

/** Caption events on the composition clock: text at a cue start, blank at its end, every scene opens with an event (repeats a cue live at the cut). */
export const edu3CaptionEvents = () => {
  const ev = new Map<number, string>();
  for (const c of EDU3_CUES) ev.set(c.to, ev.get(c.to) ?? '');
  for (const c of EDU3_CUES) ev.set(c.from, c.text);
  EDU3_CUTS.forEach(({start: s}) => {
    if (ev.has(s)) return;
    const live = EDU3_CUES.find((c) => c.from < s && c.to > s);
    ev.set(s, live ? live.text : '');
  });
  return [...ev].sort((a, b) => a[0] - b[0]).map(([at, text]) => ({at, text}));
};
