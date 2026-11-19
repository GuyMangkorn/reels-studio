import type {Cover, CoverStyle} from '../cover-overlay';

/**
 * EDU-EP26-SHORT-PIC-COVERS, Film pick 1, 2026-11-19 (cover-design skill sections 1-2, 6-7). Inputs EDU-EP26-SCRIPT-R3, film-brief-r4.md and the
 * plates of the final cut (out/EDU-EP26-SHORT/EDU-EP26-SHORT.mp4, 19 Nov 2026). Picture direction from the coordinator for this pick: thumbnail
 * energy (tight zoom, exaggerated reaction, bold contrast and saturation, one subject).
 * Promise: the viewer finds out that Roman launderers really washed clothes with urine, treading it with bare feet (L01, L08), and that an emperor
 * really taxed urine and held the coin to his son's nose (L17-L19).
 * Stakes: Marcus, on his first day, stands barefoot in a tub of water mixed with urine (L08) and carries the smell home (L20).
 * Gaps: Did Romans really wash clothes in pee? (yes/no) -> L01, L08. What is in the jar? -> L05-L06. Does the white shirt give it away? -> L13-L14.
 *   Does the money smell? (yes/no) -> L16, L19-L20. Why would an emperor sniff a coin? -> L17-L19.
 * Never shown (CV04): the white shirt at pickup and "สูตรลับ" (L13-L14), Titus's "no" and Vespasian's reply (L19), the ending line (L20).
 * Plates: five cover-only paintings in src/painted/edu26/cover-shots.tsx (CV07 reasons there): P1 and P2 repaint the staging with a pushed face
 *   (wide eyes, open mouth; the film's faces are YUCK/worried), P3-P5 are camera-only zooms of film frames with the film's faces.
 * Headline bands: P1 tunic and bench under his chin, y ~1300-1600; P2 the liquid and stall rim, y ~1350-1650; P3 the wall right of his hand,
 *   x ~560-960, y ~1050-1450; P4 the togas, y ~1250-1600; P5 the street left of her, x ~40-560, y ~1000-1600.
 * Score (pick 1: F1 F2 F3 S2 S4, max 10): P1 2 2 2 2 2 = 10; P2 2 2 1 2 1 = 8 (ribbons cross him); P3 2 2 2 1 1 = 8 (calm face, coin ~90 px);
 *   P4 1 1 2 2 1 = 7 (two faces, the coin small at 120 px: a ring cue at pick 2 would lift F1/F2); P5 2 2 2 1 1 = 8 (the film's mild disgust).
 * Render rounds 4 of 4 (r1 framing, r2 zoom/eye, r3 jar arm to HANG + tub lens + P4 to B06-SH02 l 90, r4 P2 face to shout + sweat). Sheets
 *   out/EDU-EP26-SHORT-PIC-COVERS/sheet-270.png, sheet-120.png, shelf-120.png (beside EP05 and EP11, the two top-viewed covers).
 * Channel mark redrawn over the grade.
 */
const INK = '#1b222b';
const MARK = [
  {kind: 'text' as const, text: '@TamMaiLa', x: 120, y: 151, size: 22, fill: INK, stroke: INK, sw: 6},
  {kind: 'text' as const, text: '@TamMaiLa', x: 120, y: 151, size: 22, fill: '#f2f6ff'},
];
const P = (id: string, plate: string): Cover => ({id, plate, local: 15, scrim: false, lines: []});
const L = (vignette: number) => ({grade: {vignette}, elements: MARK});
export const EDU26_PICS: Cover[] = [
  {...P('P1-jar-face', 'EDU26-COVER-JAR'), layout: L(0.45)},
  {...P('P2-tub-lowangle', 'EDU26-COVER-TUB'), layout: L(0.45)},
  {...P('P3-coin-sniff', 'EDU26-COVER-COIN'), layout: L(0.45)},
  {...P('P4-emperor-coin', 'EDU26-COVER-NOSE'), layout: L(0.45)},
  {...P('P5-passerby-nose', 'EDU26-COVER-PASS'), layout: L(0.45)},
];
export const EDU26_COVER_STYLE: CoverStyle = {accent: '#ffd21f'};

/**
 * EDU-EP26-SHORT-COVERS, Film pick 2, 2026-11-19 (cover-design skill sections 3-7). The user picked P5 (EDU26-COVER-PASS, the passer-by
 * pinching her nose at Marcus's ribbons, B06-SH05 l 70 zoomed). Direction kept from pick 1: MrBeast energy, big bold text, high contrast, huge
 * subject. No ring or arrow: her face and pinch are the one subject and the ribbons already lead in from the left (F2 by the face itself).
 * Never on a cover or title (CV04): the white shirt, "สูตรลับ", Titus's "no" and Vespasian's reply (L19), the L20 line ("แต่มาร์คุสยังมี").
 * Angles (CV09): C1 survival bet (yes/no, L18's own question, answer withheld to L19), C2 you, C3 extreme (swap for the number angle: the film
 *   states no number; its true extreme is an emperor taxing urine, L17, F006 supported), C4 wrong vs right (red sticker), C5 contradiction
 *   (washing = clean, with urine, L01/L08).
 * Bands: C1/C4 top band over the sky and wall (baselines y ~400-560, above her hair top y ~545 at x > 510) with a top edge grade; C2 the same
 *   band in two lines; C3/C5 the street left of her (x 40-560, y ~1150-1500) with a left edge grade.
 * Titles (CV11; formula; first-three-word hook; about 40 characters; never repeats the picked cover's words, pairs noted):
 *   T1 you transformed: ถ้าคุณเป็นช่างซักผ้าโรมัน วันแรกเจออะไร?  (L02-L08; avoid with C5 ซักผ้า)
 *   T2 survival yes/no: วันแรกที่ร้านซักผ้าโรมัน รอดมั้ย?  (L02, L16 "รอดแล้ว"; avoid with C5)
 *   T3 contradiction:   ซักผ้าเสร็จ… ทำไมคนเดินผ่านปิดจมูก?  (B06-SH05 shown, why withheld to L20; avoid with C5)
 *   T4 true extreme:    จักรพรรดิเอาเหรียญจ่อจมูกลูก… ทำไม?  (L18, answer withheld to L19)
 *   T5 myth:            ฉี่สกปรก? ช่างซักผ้าโรมันไม่คิดงั้น  (F001/L01, L08; avoid with C3 and C5, both say ฉี่)
 *   (r1 T5 "อย่าสมัครงานร้านซักผ้าโรมัน 😂" scored 6/10, no concrete stake: replaced.)
 * Score pick 2 (T1 T2 T3 F1 F2 F3 S1 S2 S3 S4 B1 B2 B3, max 26):
 *   C1 2 2 2 2 2 2 2 1 2 2 2 2 2 = 25 (her pinch already answers "yes"; the noun comes from the title)
 *   C2 2 2 2 2 2 2 1 1 2 1 2 2 1 = 22 (softest hook; "ทนไหว" is not a film word, kept as a question)
 *   C3 2 2 2 2 2 2 1 2 2 2 2 2 2 = 25 (spends the L17 wow fact on the cover; the picture is not the emperor)
 *   C4 2 2 2 2 2 2 1 2 2 2 2 2 1 = 24 (the red sticker outranks the face at first glance; red leaves the yellow series accent)
 *   C5 2 2 1 2 2 1 2 2 2 2 2 2 2 = 24 (line 2 crosses her torso; ซักผ้า clashes with T1, T2, T3, T5; best frame-0 match)
 * Titles (S1 S2 S3 S4 T3, max 10): T1 2 1 2 1 2 = 8; T2 2 1 2 2 2 = 9; T3 2 2 2 2 2 = 10; T4 2 2 2 2 2 = 10; T5 2 2 2 1 2 = 9.
 * Frame-0 check (proposed): frame 0 of out/EDU-EP26-SHORT/EDU-EP26-SHORT.mp4 is the treading feet in the tub (caption "ช่างซักผ้าโรมัน",
 *   label "แต่งเติมจากเรื่องจริง"). Subject differs on all five (the cover is the B06-SH05 passer-by); question matches on C5 (L01), partly on
 *   C1, C2, C4 (smell), not on C3 (L17). The cover is a zoomed repaint, so no video frame equals it.
 * Render rounds 2 of 4 (r1 placement, r2 C5 line 2 size 180 -> 160). Sheets out/EDU-EP26-SHORT-COVERS/sheet-270.png, sheet-120.png,
 *   shelf-120.png (beside EP05 and EP11).
 */
const RED = '#ff3b30';
const CV = {plate: EDU26_PICS[4].plate, local: EDU26_PICS[4].local, scrim: false as const};
const TOP = {grade: {vignette: 0.45, edge: {side: 'top' as const, size: 760, opacity: 0.7}}, elements: MARK};
const LEFT = {grade: {vignette: 0.45, edge: {side: 'left' as const, size: 640, opacity: 0.7}}, elements: MARK};
const STICKER = {label: {color: RED, ink: '#ffffff', pad: 0.3}};
export const EDU26_COVERS: Cover[] = [
  {...CV, id: 'C1-bet-smell', lines: [
    {text: 'เหม็นมั้ย?', y: 470, size: 205, accent: true, x: 520}], layout: TOP},
  {...CV, id: 'C2-you-endure', lines: [
    {text: 'ถ้าเป็นคุณ', y: 370, size: 150, x: 520},
    {text: 'ทนไหวมั้ย?', y: 525, size: 160, accent: true, x: 520}], layout: TOP},
  {...CV, id: 'C3-extreme-tax', lines: [
    {text: 'ภาษีฉี่', y: 1290, size: 200, accent: true, x: 50, anchor: 'start'},
    {text: 'มีจริง!', y: 1470, size: 170, x: 50, anchor: 'start'}], layout: LEFT},
  {...CV, id: 'C4-wrong-sniff', lines: [
    {text: 'อย่าดม!', y: 480, size: 190, accent: true, x: 500, rotate: -5, look: STICKER}], layout: TOP},
  {...CV, id: 'C5-contra-wash', lines: [
    {text: 'ซักผ้า', y: 1290, size: 190, x: 50, anchor: 'start'},
    {text: 'ด้วยฉี่?!', y: 1470, size: 160, accent: true, x: 50, anchor: 'start'}], layout: LEFT},
];
