// EDU-EP16-SHORT caption cues (W5.3 Draft, Editor, 2026-11-10; C01-C13 + V01 + V02). Pure data. Source: scripts/edu-series/ep16/storyboard.md ROWS-R2.0 "Voice and subtitle cues" (voice [start, end) global frames),
// Thai verbatim from script R3. Cue = [voice start, voice end + 6) capped at the next cue's start; V01 holds to f446, V02 to f731 (before C07 at f733). V03 (young-crow caw) has no caption.
// Every scene starts with a cue ('' = none). A line wider than ~960 px at the 51 px caption font is broken by hand (C02, C12, C13: caption-check measured 1120/1010/972 px); otherwise a cue that wraps breaks after "… " or at the middle space.
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
  ['C01', 8, 138, 'อีกาบางชนิด จำหน้าคนที่เคยจับมันได้… แล้วลูกมันก็จะร้องด่าหน้านั้นด้วย'],
  ['C02', 157, 272, 'ที่อเมริกา… คนใส่หน้ากาก จับอีกามาไม่กี่ตัว\nใส่ห่วงขา แล้วปล่อยไป'],
  ['C03', 284, 405, 'พอเขาใส่หน้ากากนี้ เดินผ่านอีกที… อีการุมร้องด่า บินตามไปด้วย'],
  ['V01', 420, 442, 'เอ้ย! อะไรเนี่ย'],
  ['C04', 448, 496, 'แต่… มันจำเขาได้จริงเหรอ'],
  ['C05', 513, 608, 'วันที่ไม่ใส่หน้ากาก หรือใส่หน้ากากอื่น… อีกาแทบไม่สนใจ'],
  ['C06', 617, 686, 'แต่… ถ้าคนอื่นใส่หน้ากากอันนี้ล่ะ'],
  ['V02', 700, 727, 'ทำไมเป็นฉันล่ะ!'],
  ['C07', 733, 809, 'โดนเหมือนกัน… มันไม่ได้จำคน… มันจำหน้า'],
  ['C08', 846, 911, 'อีกาที่รุมด่า หลายตัวไม่เคยโดนจับเลย'],
  ['C09', 934, 1028, 'มันเห็นตัวอื่นด่า… ก็ด่าตาม ลามออกไปไกลเป็นกิโล'],
  ['C10', 1063, 1133, 'หลายปีผ่านไป… หน้ากากเดิมออกมาเดินอีกครั้ง'],
  ['C11', 1154, 1235, 'ลูกอีกาที่เกิดหลังวันนั้น… ก็ร้องด่าเหมือนพ่อแม่มัน'],
  ['C12', 1263, 1386, 'นานหลังจากนั้น… อีกาที่เห็นวันนั้น\nตายไปเกือบหมด เสียงด่าก็เบาลง'],
  ['C13', 1402, 1522, 'วันนั้นโดนจับไปไม่กี่ตัว… แต่ความจำนี้\nส่งต่อถึงตัวที่ไม่เคยเห็นวันนั้นเลย'],
];
const HOLD = 6;
export const EDU16_CUES: Edu16Cue[] = raw.map(([id, from, end, text], i) => {
  const next = raw[i + 1]?.[1] ?? Infinity;
  return {id, from, to: Math.min(end + HOLD, next), text: br(text)};
});

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
