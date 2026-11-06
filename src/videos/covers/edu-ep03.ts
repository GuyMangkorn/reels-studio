import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP03-SHORT-COVERS: three cover options (user, 6 Nov 2026: A/B/C, a deviation from CV09's five) for the red-ball Short
 * (script R1.1, "ลูกบอลสีแดงที่หมามองไม่เห็น"). Plates are the episode's registry plates `EDU3-<shot id>` (CV07); `local` is the
 * shot-local frame. Thai copy uses only what the film says (CV04): O2 "ตรงนั้นไง!", L03 "มันไม่ได้ซื่อบื้อนะ", L08 "หมาเห็นสี แค่เห็นไม่เหมือนเรา".
 * The dog-view picture carries the episode tag `ภาพจำลอง (โดยประมาณ)` as on the video (F012). Text centred on x 540, inside y 240-1680,
 * last baseline <= 1470, clear of the right 120 px (CV06); headlines size 184-192 as EP01/EP02 (CV08).
 * Found 6 Nov 2026: `stretch` (font-stretch) is a no-op here, because the shared loadFont declares no stretch range for
 * NotoSansThai.ttf (wdth 62.5-100 exists in the file), so it is clamped to 100% (EP01/EP02's 80 never applied either); and
 * `plateMove` does not move a painted plate (the plate is on the shared canvas under the scene div). Neither is used here;
 * headline widths are kept inside x 120-960 by wording and size.
 */
const TAG = 'ภาพจำลอง (โดยประมาณ)';

export const EDU3_COVERS: Cover[] = [
  // A question. S01-B02-SH02 l32: the dog gallops straight past the red ball in front of it (the miss, F011 dramatization).
  {id: 'A-miss', plate: 'EDU3-S01-B02-SH02', local: 32,
    lines: [{text: 'ตรงนั้นไง!', y: 1340, size: 192, accent: true}, {text: 'ทำไมหมาวิ่งผ่าน?', y: 1470, size: 92}]},
  // B impossible detail. S01-B03-SH03 l32: the VD09a split sweep crosses the ball, half our view (red), half the dog view (olive).
  {id: 'B-split', plate: 'EDU3-S01-B03-SH03', local: 32,
    layout: {elements: [
      {kind: 'rect', x: 330, y: 236, w: 420, h: 62, rx: 31, fill: '#0b0d16', opacity: 0.55},
      {kind: 'text', text: TAG, x: 540, y: 280, size: 36, anchor: 'middle', fill: '#f4efe6', weight: 600},
    ]},
    lines: [
      {text: 'ตาคน', x: 300, y: 790, size: 84}, {text: 'ตาหมา', x: 780, y: 790, size: 84},
      {text: 'ลูกเดียวกัน', y: 1340, size: 180, accent: true}, {text: 'หมาเห็นไม่เหมือนเรา', y: 1470, size: 92},
    ]},
  // C face. S01-B02-SH04 l64: the dog sits facing us, puzzled, after the miss (L03 "มันไม่ได้ซื่อบื้อนะ").
  {id: 'C-face', plate: 'EDU3-S01-B02-SH04', local: 64,
    lines: [{text: 'หาไม่เจอ?', y: 1340, size: 192, accent: true}, {text: 'มันไม่ได้ซื่อบื้อนะ', y: 1470, size: 92}]},
];

/** Ball-red accent (the red ball of the park palette); scrim from y 1120 for the bright lawn plates (as EP01/EP02). */
export const EDU3_COVER_STYLE: CoverStyle = {accent: '#ff5a46', scrimY: 1120};
