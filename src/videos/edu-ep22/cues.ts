// EDU-EP22-SHORT caption cues (W6.1 Draft, Editor, 2026-11-17; 25 cards). Pure data. Source: scripts/edu-series/ep22/short/scene-sheets.md EDU-EP22-SCENES-R1 "Narration and subtitles"
// (global frames [from, to) = speech onset to speech end + 6 f, never past the next line's onset; lines with an ellipsis or a named split change card on the inner anchor); Thai verbatim from script R3.
// V01 (child "หืม?") is not subtitled; no caption after G1633 (the hold). Line breaks are authored at word boundaries for cards of 24+ base characters and for every line wider than 696 px at 51 px (the caption-safe box is x 120-888 and the block is centred on x 540: L08, L09, L16b, found by the W6.1 frame measurement) (scripts/caption-breaks.mjs).
export type Edu22Cue = {id: string; from: number; to: number; text: string};
const raw: [string, number, number, string][] = [
  ['L01a', 8, 86, 'ถ้าคุณเป็นขันที\nชิมอาหารให้ฮ่องเต้จีน...'],
  ['L01b', 86, 138, 'คุณต้องชิมก่อนทุกจาน'],
  ['L02a', 146, 186, 'แต่ฮ่องเต้องค์สุดท้าย...'],
  ['L02b', 186, 249, 'ไม่แตะโต๊ะ\nเกือบสามสิบจานนั้นเลยนะ'],
  ['L03', 263, 308, 'อ้าว แล้วเด็กคนนี้กินอะไร?'],
  ['L04a', 321, 403, 'ปูยีกินกับข้าว\nที่ฝั่งไทเฮาส่งมาต่างหาก...'],
  ['L04b', 403, 443, 'ราว ๆ ยี่สิบจาน!'],
  ['L05a', 463, 502, 'แต่ถ้าไม่กิน...'],
  ['L05b', 502, 546, 'โต๊ะยาวนั่นตั้งไว้ทำไม?'],
  ['L06a', 565, 594, 'ดูก่อนนะ...'],
  ['L06b', 594, 668, 'ทุกจานมีแผ่นเงินเล็ก ๆ\nใส่ไว้กันพิษ'],
  ['L07a', 677, 744, 'ขันทีชิมจานละนิดก่อนยกมา'],
  ['L07b', 744, 812, 'แล้วขันทีน้อยก็ร้อง "เปิดฝา!"'],
  ['L08', 823, 886, 'ยิ่งด่านเยอะ\nยิ่งดูปลอดภัย ใช่ไหม?'],
  ['L09', 888, 974, 'แต่แผ่นเงินเนี่ย\nจับพิษได้จริงเหรอ?'],
  ['L10', 974, 1025, 'ไข่ต้ม ยังทำเงินดำได้เลย'],
  ['L11a', 1032, 1077, 'ในไข่มีกำมะถัน'],
  ['L11b', 1077, 1146, 'เงินดำเพราะมัน ไม่ใช่เพราะพิษ'],
  ['L12', 1146, 1217, 'พิษที่ไม่มีกำมะถัน เงินก็เฉย'],
  ['L13', 1225, 1286, 'ด่านนี้ ดูปลอดภัยกว่าที่เป็นนะ'],
  ['L14', 1304, 1369, 'แล้วตกลง โต๊ะยาวนั่นมีไว้ทำไม?'],
  ['L15a', 1384, 1429, 'เพราะมันทำไว้โชว์...'],
  ['L15b', 1429, 1462, 'ไม่ได้ทำไว้กิน'],
  ['L16a', 1463, 1552, 'โต๊ะยาวนั่น มีไว้ให้ดูจริง ๆ...'],
  ['L16b', 1552, 1633, 'ส่วนที่ปูยีกินจริง\nคือจานตรงหน้าเขา'],
];
export const EDU22_CUES: Edu22Cue[] = raw.map(([id, from, to, text]) => ({id, from, to, text}));

/** Caption events for `assemblePaintedTimeline`: every scene starts with a cue ('' = none); a gap between cues is cleared. */
export const edu22CaptionEvents = (cutStarts: number[], total: number): {at: number; text: string}[] => {
  const ev: {at: number; text: string}[] = [];
  const at = (f: number) => EDU22_CUES.find((c) => c.from <= f && f < c.to);
  for (const c of EDU22_CUES) {
    ev.push({at: c.from, text: c.text});
    if (!EDU22_CUES.some((n) => n.from === c.to) && c.to < total && !cutStarts.includes(c.to)) ev.push({at: c.to, text: ''});
  }
  for (const start of cutStarts) if (!ev.some((e) => e.at === start)) ev.push({at: start, text: at(start)?.text ?? ''});
  return ev.sort((a, b) => a.at - b.at);
};
