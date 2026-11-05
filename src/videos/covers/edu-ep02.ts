import type {Cover, CoverLook, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP02-SHORT-COVERS: five cover candidates (docs/cover-principles.md, CV01-CV10) for the onion Short (EDU-SCRIPT-R1.1,
 * the hook "หัวหอมไม่ได้ทำให้คุณร้องไห้ จนกว่าคุณจะทำร้ายมันก่อน"). Plates are the episode's registry plates `EDU2-<shot id>`
 * (CV07); `local` is the shot-local frame. Thai copy uses only what the narration says (CV04): the tears are real in the
 * story, the trick "ใส่แว่นว่ายน้ำ" is shown as an informal try (the script's own hedge), the alarm is the narration's
 * comparison (L-line "สัญญาณกันขโมยของหัวหอม"). Text centred on x 540, inside y 240-1680, last baseline <= 1470 (CV06).
 * Headlines are size 192 (Thai consonant body >= 135 px = 7% of 1920, CV02) at wdth 80, so each headline is at most about
 * ten Thai characters to fit the width (x 120-960).
 */
const HEAD: CoverLook = {stretch: 80};

export const EDU2_COVERS: Cover[] = [
  // A question. S01-B05-SH01 l40: she wipes her tears, a chalk "?" over her head (the episode's question).
  {id: 'A-question', plate: 'EDU2-S01-B05-SH01', local: 40, lines: [{text: 'ทำไมร้องไห้?', y: 1340, size: 192, accent: true, look: HEAD}, {text: 'ตอนหั่นหอม', y: 1470, size: 92}]},
  // B subject. S01-B01-SH01 l30: the whole onion on the board, calm; the hook's "หัวหอมไม่ได้ทำให้คุณร้องไห้".
  {id: 'B-onion', plate: 'EDU2-S01-B01-SH01', local: 30, lines: [{text: 'หัวหอมไม่ผิด', y: 1340, size: 192, accent: true, look: HEAD}, {text: 'จนกว่าจะหั่นมัน', y: 1470, size: 92}]},
  // C face. S01-B04-SH03 l40: deadpan with cartoon tears running down, the knife still in her hand.
  {id: 'C-face', plate: 'EDU2-S01-B04-SH03', local: 40, lines: [{text: 'ร้องไม่หยุด', y: 1340, size: 192, accent: true, look: HEAD}, {text: 'แค่หั่นหอม', y: 1470, size: 92}]},
  // D impossible detail. S01-B07-SH02 l65: the chalk alarm bell drawn over the onion (the L-line comparison).
  {id: 'D-alarm', plate: 'EDU2-S01-B07-SH02', local: 65, lines: [{text: 'สัญญาณเตือน', y: 1340, size: 192, accent: true, look: HEAD}, {text: 'ของหัวหอม', y: 1470, size: 92}]},
  // E trick (swap for the number angle: the script has no number, see the note above). S01-B06-SH02 l45: the swimming goggles on.
  {id: 'E-goggles', plate: 'EDU2-S01-B06-SH02', local: 45, lines: [{text: 'แว่นว่ายน้ำ', y: 1340, size: 192, accent: true, look: HEAD}, {text: 'ลองเองแบบนี้', y: 1470, size: 92}]},
];

/** Onion-gold accent from the kitchen palette; scrim from y 1120 for the pale wall and board plates (as EP01). */
export const EDU2_COVER_STYLE: CoverStyle = {accent: '#f5b041', scrimY: 1120};
