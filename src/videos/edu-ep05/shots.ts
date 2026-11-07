// EDU-EP05-SHORT timing data (W5.3 blockout, Editor, 6 Nov 2026). Pure data, no React. Source: scripts/edu-series/ep05/scene-sheets.md
// (EDU-EP05-SHEETS-R1: shot map, "VO + caption" lines) and review-rows.json start/end. Boss's art (N1-N10, K1) is not in yet, so
// every scene is a placeholder card over a stand-in plate until `EDU5-<shot id>` plates exist in the painted registry.
export const EDU5_FPS = 30;
export const EDU5_TOTAL = 1989;

/** [shot id, frames, Boss items still missing for this shot (scene-sheets "Boss and Editor handoff (W5.2)")]. */
export const EDU5_SHOTS = [
  ['S01-B01-SH01', 41, 'N3 N10'], ['S01-B01-SH02', 96, 'N3'], ['S01-B01-SH03', 71, 'N3 N7 N10'], ['S01-B01-SH04', 32, 'N1 N2 N7 N10'],
  ['S01-B02-SH01', 89, 'N1 N2 N10'], ['S01-B02-SH02', 158, 'N2 drift N10'], ['S01-B02-SH03', 32, 'N3 N10'], ['S01-B02-SH04', 93, 'N1 N2 N10'],
  ['S01-B03-SH01', 77, 'N1 N2 N4'], ['S01-B03-SH02', 86, 'N4 N10'], ['S01-B03-SH03', 119, 'N4 N10'], ['S01-B03-SH04', 132, 'N4 N10'],
  ['S01-B04-SH01', 77, 'N1 N2 K1'], ['S01-B04-SH02', 140, 'N1 N2 N6 N8 N10 K1'], ['S01-B04-SH03', 115, 'N1 N2 N5 N6 N10 K1'],
  ['S01-B05-SH01', 89, 'N1 N2 N5 N6'], ['S01-B05-SH02', 173, 'N1 N2 N6 N9'], ['S01-B05-SH03', 173, 'N1 N2 N5 N6 N10'],
  ['S01-B05-SH04', 196, 'N1 N2 N5 N6 N10'],
] as const satisfies readonly (readonly [string, number, string])[];

const starts = EDU5_SHOTS.map((_, i) => EDU5_SHOTS.slice(0, i).reduce((a, [, n]) => a + n, 0));
export const EDU5_CUTS = EDU5_SHOTS.map(([id, n], i) => ({id, start: starts[i], end: starts[i] + n}));

/** Caption cues, global frames [from, to), text = the spoken line verbatim (script: no subtitle differences). Break after "…" (brief VD19). L02/L05-L16 two-clause cues use "\n". */
export type Edu5Cue = {from: number; to: number; text: string};
export const EDU5_CUES: Edu5Cue[] = [
  {from: 6, to: 41, text: 'ถ้าคุณตัวเล็กเท่ามด…'},
  {from: 45, to: 137, text: 'ตกจากตึกสิบชั้น…\nคุณจะแทบไม่เป็นอะไรเลย'},
  {from: 141, to: 214, text: 'สมมติว่าหดทั้งตัว…\nรวมทั้งน้ำหนักด้วย'},
  {from: 244, to: 329, text: 'ลมพัดวูบเดียว…\nปลิวหลุดจากระเบียงชั้นสิบ'},
  {from: 347, to: 390, text: 'แรงโน้มถ่วงเท่าเดิมนะ…'},                              // L05a (R1.4 A; phrase 1 ends G384, phrase 2 onset G390)
  {from: 390, to: 487, text: 'แต่ตัวยิ่งเล็ก อากาศยิ่งต้านดี\nพอเทียบกับน้ำหนักตัว'}, // L05b (R1.4 A, R1.11 FR40: voiced end G485, cue ends on the cut G487)
  {from: 495, to: 519, text: 'ตกสิบชั้น…'},                                          // L06a
  {from: 519, to: 587, text: 'ถึงพื้นก็แค่ราว ๆ กระโดดลงจากเก้าอี้'},                // L06b
  {from: 616, to: 691, text: 'แต่ข้างล่าง…\nมีหยดน้ำค้างรออยู่'},
  {from: 704, to: 778, text: 'ทำไมน้ำมันเหนียวแบบนี้!'},                              // L08 (TINY)
  {from: 779, to: 895, text: 'ตัวเล็กขนาดนี้…\nแรงตึงผิวน้ำอาจแรงพอจะดึงคุณติดไว้'},
  {from: 898, to: 962, text: 'แรงกว่าน้ำหนักตัวคุณ…\nได้หลายเท่า'},
  {from: 1030, to: 1105, text: 'ในร่มหญ้า…\nศัตรูต่อไปคือความหนาว'},
  {from: 1107, to: 1221, text: 'ยิ่งตัวเล็ก ยิ่งเหมือนเปลือยกลางลม…\nความร้อนหนีออกเร็วขึ้นมาก'},
  {from: 1247, to: 1314, text: 'จะอุ่นได้…\nต้องกินแทบตลอดเวลา'},
  {from: 1382, to: 1448, text: 'มดบางชนิดแบกของหนักได้หลายเท่าของตัว'},
  {from: 1451, to: 1526, text: 'ไม่ใช่เพราะกล้ามมันเยอะหรอก…\nแต่พอตัวเล็กลง…'},          // L15a (R1.4 A; UB-1/UB-2: +-0.18 s)
  {from: 1526, to: 1620, text: 'น้ำหนักลดไปมากกว่าแรง…\nแรงก็เลยเหลือ ๆ'},             // L15b (R1.4 A)
  {from: 1646, to: 1678, text: 'แล้วคุณล่ะ…'},                                          // L16a
  {from: 1678, to: 1793, text: 'ตัวเล็กขนาดนี้ก็ได้เปรียบเรื่องแรงเมื่อเทียบกับน้ำหนักตัวด้วย'}, // L16b
  {from: 1797, to: 1915, text: 'โลกใบเดียวกันแท้ ๆ…\nแค่ขนาดตัวเปลี่ยน เกมก็เปลี่ยนทั้งเกม'},
];

/** Caption events for `assemblePaintedTimeline`: every scene starts with a cue ('' = none); a cue running across a cut repeats at the cut start. */
export const edu5CaptionEvents = (): {at: number; text: string}[] => {
  const ev: {at: number; text: string}[] = [];
  const at = (f: number) => EDU5_CUES.find((c) => c.from <= f && f < c.to);
  for (const c of EDU5_CUES) {
    ev.push({at: c.from, text: c.text});
    const next = EDU5_CUES.find((n) => n.from === c.to);
    if (!next && c.to < EDU5_TOTAL) ev.push({at: c.to, text: ''});
  }
  for (const {start} of EDU5_CUTS) if (!ev.some((e) => e.at === start)) ev.push({at: start, text: at(start)?.text ?? ''});
  // a cue that continues across a cut shows again at the cut start; a clear is placed where its cue ends
  return ev.sort((a, b) => a.at - b.at);
};
