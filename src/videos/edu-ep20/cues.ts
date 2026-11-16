// EDU-EP20-SHORT caption cues (W5.3 Draft, Editor, 2026-11-16). Pure data. Source: storyboards/edu-ep20/short/scene-sheet.md EDU-EP20-SS-R3 (SS-R5: L13a/L13b SCRIPT-R2 text and measured R2 windows, L13b ends G1529),
// "Subtitles — estimated display windows, G clock" of each shot: global frames [from, to), contiguous from G0 (hook caption visible at G0)
// to G1619; SS-R5 END20: the last line holds to G1529, then an empty cue to G1619. Thai verbatim from the sheet (SCRIPT-R1 wording L01-L12, SCRIPT-R2 L13).
// Audible-word check (W5.3 Editor): faster-whisper word times on the locked E read + 10 ms energy valleys moved 11 chunk boundaries once each, inside the
// neighbouring quiet window as the sheet allows (sheet -> draft): L03b 227->240, L03c 256->270, L03d 336->329, L06b 524->539, L06c 546->567, L08b 764->780,
// L08c 824->829, L09b 908->915, L10b 1031->1034, L11d 1217->1227 (the R1 L13b move is superseded by the SS-R5 measured windows). Order, text and shot ownership unchanged (build-notes "W5.3 Editor draft").
export type Edu20Cue = {id: string; from: number; to: number; text: string};
const raw: [string, number, number, string][] = [
  ['L01a', 0, 21, 'รถเร่ง...'],
  ['L01b', 21, 71, 'ลูกโป่งจะเอนไปทางไหน?'],
  ['L02a', 71, 123, 'เอาลูกโป่งฮีเลียมที่ลอยได้'],
  ['L02b', 123, 163, 'ผูกเชือกไว้กับพื้นรถ'],
  ['L02c', 163, 187, 'แล้วปิดกระจก'],
  ['L03a', 187, 240, 'พอรถเร่งไปข้างหน้า'],
  ['L03b', 240, 270, 'คุณเอนติดเบาะ'],
  // W6.2 (Editor, 2026-11-16): L03c one line ran x147-932 past the x888 caption-safe box; split verbatim at the subject|predicate phrase boundary,
  // switch at the 10 ms energy valley between "จะ" and "เอน" (9.76 s = G292.8 -> G293), window G270-329 unchanged.
  ['L03c1', 270, 293, 'ลูกโป่งก็น่าจะ'],
  ['L03c2', 293, 329, 'เอนไปข้างหลังตามคุณ...'],
  ['L03d', 329, 352, 'ใช่ไหม?'],
  ['L04a', 352, 362, 'ผิด!'],
  ['L04b', 362, 414, 'มันกลับเอนไปข้างหน้า'],
  ['L05a', 414, 465, 'แต่ไม่มีใครจับมันดัน'],
  ['L05b', 465, 496, 'แล้วอะไรดัน?'],
  ['L06a', 496, 539, 'อากาศในรถไง'],
  ['L06b', 539, 567, 'ตอนรถเร่ง'],
  ['L06c', 567, 594, 'แรงดันอากาศด้านหลัง'],
  ['L06d', 594, 637, 'จะมากกว่าด้านหน้า'],
  ['L07a', 637, 684, 'มันเลยดันลูกโป่งที่ลอยได้'],
  ['L07b', 684, 704, 'ไปทางหน้ารถ'],
  ['L08a', 704, 780, 'แต่ถ้าตอนนี้รถยังวิ่งเร็วอยู่'],
  ['L08b', 780, 829, 'คุณว่าลูกโป่งจะเอนค้างแบบนั้น'],
  ['L08c', 829, 845, 'ไปตลอดไหม?'],
  ['L09a', 845, 915, 'ลองวิ่งตรงด้วยความเร็วคงที่'],
  ['L09b', 915, 958, 'รอให้ลูกโป่งหยุดแกว่ง'],
  ['L09c', 958, 995, 'มันกลับมาตั้งตรง'],
  ['L10a', 995, 1034, 'ตัวที่ทำให้เอน'],
  ['L10b', 1034, 1094, 'คือการเร่ง ไม่ใช่ความเร็ว'],
  ['L11a', 1094, 1130, 'ทีนี้ทายอีกรอบ'],
  ['L11b', 1130, 1186, 'ถ้ารถยังวิ่งไปข้างหน้า'],
  ['L11c', 1186, 1227, 'แต่กำลังชะลอ'],
  ['L11d', 1227, 1273, 'คราวนี้คุณเอนไปหน้า...'],
  ['L12', 1273, 1332, 'ส่วนลูกโป่งกลับเอนไปท้ายรถ!'],
  ['L13a', 1332, 1384, 'เพราะคราวนี้ อากาศด้านหน้า'],          // SS-R5 (SCRIPT-R2, narration R2): switch at the deepest frame of the 1379-1385 pause
  ['L13b', 1384, 1529, 'กลับดันแรงกว่าด้านหลังนั่นเอง'],         // spoken G1386-1438, held 91 f after the last word
  ['END20', 1529, 1619, ''],   // SS-R5 END20: no caption after G1529 (the sheet's 6 f caption fade G1523-1529 has no runtime field: hard off)
];
export const EDU20_CUES: Edu20Cue[] = raw.map(([id, from, to, text]) => ({id, from, to, text}));

/** Caption events for `assemblePaintedTimeline`: cues are contiguous, so one event per cue onset plus each scene start. */
export const edu20CaptionEvents = (cutStarts: number[]): {at: number; text: string}[] => {
  const ev = EDU20_CUES.map((c) => ({at: c.from, text: c.text}));
  for (const start of cutStarts) if (!ev.some((e) => e.at === start)) ev.push({at: start, text: EDU20_CUES.find((c) => c.from <= start && start < c.to)?.text ?? ''});
  return ev.sort((a, b) => a.at - b.at);
};
