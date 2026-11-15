// EDU-EP16-SHORT caption cues (W5.3 Draft, Editor, 2026-11-15; 18 cues C01-C18). Pure data. Source: scripts/edu-series/ep16/storyboard.md EDU-EP16-SHEETS-R2 "Voice and subtitle cues"
// (global frames [start, end) = line onset to line end on the voice-lock v2 measure, placed N1-N4); Thai verbatim from the narration (script R3 has no subtitle differences). No caption in W-PING, W-STOP, W-STRIKE,
// W-OFF or the end hold. A cue that wraps breaks after "… " or at the middle space. Cue = the sheet range as is (no hold added): C09 runs +16 f over SH11's head, C12 +2 f into SH15.
export type Edu16Cue = {id: string; from: number; to: number; text: string};
const br = (t: string) => {
  if (t.length <= 22 || t.includes('\n')) return t;
  if (t.includes('… ')) return t.replace('… ', '…\n');
  const sp = [...t].map((c, i) => (c === ' ' ? i : -1)).filter((i) => i > 0);
  if (!sp.length) return t;
  const mid = t.length / 2, at = sp.reduce((a, b) => (Math.abs(b - mid) < Math.abs(a - mid) ? b : a));
  return `${t.slice(0, at)}\n${t.slice(at + 1)}`;
};
const raw: [string, number, number, string][] = [
  ['C01', 31, 114, 'ถ้าคืนนี้… มีเสียงจากต่างดาว ส่งมาถึงคุณ'],
  ['C02', 123, 148, 'อย่าเพิ่งตอบนะ'],
  ['C03', 167, 218, 'ทำไมล่ะ… ถ้าเขาใจดีล่ะ?'],
  ['C04', 237, 303, 'นั่นแหละปัญหา… คุณไม่มีทางรู้เลย'],
  ['C05', 322, 398, 'แต่… ดาวดวงนั้นอยู่ไกลหลายสิบปีแสง'],
  ['C06', 404, 482, 'ทักไปหนึ่งคำ… กว่าจะได้คำตอบ คุณก็ผมหงอกแล้ว'],
  ['C07', 496, 561, 'คุยกันไม่ได้… ก็ไม่รู้ใจกัน'],
  ['C08', 575, 631, 'แต่… เสียงนี้ก็มาจากหลายสิบปีก่อน'],
  ['C09', 640, 691, 'ป่านนี้… คนส่งยังอยู่ไหม'],
  ['C10', 735, 791, 'แล้วใครกัน… ที่กล้าส่งเสียงออกมา'],
  ['C11', 809, 902, 'ฝั่งเขาก็เหมือนกัน… ต่อให้คุณใจดี เขาก็ไม่รู้'],
  ['C12', 913, 961, 'แต่… ระหว่างรอคำตอบหลายสิบปี'],
  ['C13', 961, 1064, 'ใครที่ตอนนี้ตัวเล็กกว่า… อาจโตจนแซงคุณไปแล้ว'],
  ['C14', 1105, 1162, 'ไม่รู้ใจกัน… ก็ต้องเงียบไว้ก่อน'],
  ['C15', 1177, 1312, 'ถ้าทุกคนคิดแบบนี้… จักรวาลก็จะเหมือน\nป่าตอนกลางคืน ที่ไม่มีใครกล้าส่งเสียง'],
  ['C16', 1329, 1446, 'คนที่ส่งมา… อาจเป็นใครสักคน\nที่ยังไม่รู้เรื่องนี้… เหมือนคุณเมื่อกี้'],
  ['C17', 1497, 1612, 'นี่เป็นแค่คำตอบหนึ่ง ว่าทำไมฟ้าจริง ๆ\nยังเงียบ… แต่ถ้ามันใช่'],
  ['C18', 1632, 1755, 'ป่าที่ไม่มีใครเลย… กับป่าที่ทุกคนกลั้นหายใจ…\nฟังดูเงียบเหมือนกัน'],
];
export const EDU16_CUES: Edu16Cue[] = raw.map(([id, from, to, text]) => ({id, from, to, text: br(text)}));

/** Caption events for `assemblePaintedTimeline`: every scene starts with a cue ('' = none); a gap between cues is cleared. */
export const edu16CaptionEvents = (cutStarts: number[], total: number): {at: number; text: string}[] => {
  const ev: {at: number; text: string}[] = [];
  const at = (f: number) => EDU16_CUES.find((c) => c.from <= f && f < c.to);
  for (const c of EDU16_CUES) {
    ev.push({at: c.from, text: c.text});
    if (!EDU16_CUES.some((n) => n.from === c.to) && c.to < total && !cutStarts.includes(c.to)) ev.push({at: c.to, text: ''});
  }
  for (const start of cutStarts) if (!ev.some((e) => e.at === start)) ev.push({at: start, text: at(start)?.text ?? ''});
  return ev.sort((a, b) => a.at - b.at);
};
