# EDU-EP19-SHORT titles

Title candidates for cover pick 2 (V2 redo), Film, 2026-11-16. Rules: [cover-design skill section 4](../../../../.agents/skills/cover-design/SKILL.md#title), [CV11](../../../../docs/cover-principles.md). Inputs: script EDU-EP19-SCRIPT-R4, Boat fact-check R1 + R3 recheck ([fact-check.md](fact-check.md); Q8: plain "หมา" needs "ตามรอย" or "ฝึกมา"). Covers: `EDU-EP19-SHORT-V2-COVERS` in [src/videos/covers/edu-ep19.ts](../../../../src/videos/covers/edu-ep19.ts). The user picks one title with the cover; the pick is published with `store.py publish --title` and its formula logged in the delivery record.

## Candidates

| ID | Formula | Title | Chars | Supporting lines |
| --- | --- | --- | ---: | --- |
| T1 | You transformed | ถ้าคุณเล่นซ่อนแอบกับหมาตามรอย… ชนะได้ไง? | 40 | L01, L08, V06, L10 |
| T2 | Survival yes/no | หมาตามรอยตามหาคุณ… รอ 20 นาทีรอดมั้ย? | 37 | L01, V02, L05, V04 |
| T3 | Contradiction | ทุกรอยก็กลิ่นคุณ… ทำไมหมาตามรอยรู้ทาง? | 38 | L02, L03, L03b |
| T4 | Scale / extreme | ดมแค่ห้ารอย หมาตามรอยรู้ทางคุณได้มั้ย? | 38 | L01, L03 |
| T5 | Myth / mistake | รอ 20 นาทีกลิ่นหาย? ผิด! หมาตามรอยยังเจอ | 40 | V02, V03, L05, V04 |

Chars = Python `len` (code points). "รอดมั้ย" is hide-and-seek only (being found), never bodily danger. Unused: ตำรวจ, หนี (unsupported), ลำดับ / สลับ / mats (the twist, CV04).

## Pairing with the covers (CV02, no repeat)

"ตามรอย" inside Boat's required compound "หมาตามรอย" is not counted as a repeat of the cover word "รอย".

| Cover | Headline | Clean titles |
| --- | --- | --- |
| C1 survival bet | ซ่อน / รอดมั้ย? | T3, T4, T5 |
| C2 you | มันรู้ทาง / คุณ | T5 |
| C3 extreme number | แค่ 5 รอย | T1, T2, T5 |
| C4 wrong vs right | อย่ารอ / 20 นาที | T1, T3, T4 |
| C5 contradiction | กลิ่นหายแล้ว / ยังเจอ!? | T1, T2, T4 |

## Scores (0-2; S1-S4, T3 on the best clean pair, B2, B3; max 14)

| ID | S1 | S2 | S3 | S4 | T3 | B2 | B3 | Total | Weakest point |
| --- | --: | --: | --: | --: | --: | --: | --: | --: | --- |
| T1 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 14 | 40 chars, at the limit; "ชนะ" stakes are mild |
| T2 | 2 | 2 | 1 | 2 | 2 | 2 | 2 | 13 | "ตามหาคุณ… รอดมั้ย" can read as a chase with bodily danger without the cover |
| T3 | 2 | 1 | 2 | 1 | 2 | 1 | 2 | 11 | a calm "ทำไม" explainer, no stakes; the mid-performing shape on this channel |
| T4 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 14 | L01 answers the yes at 0.3 s; the gap that holds is the "how" (L03) |
| T5 | 1 | 2 | 2 | 2 | 2 | 2 | 1 | 12 | gives gap 3's answer away; flat "ผิด!" is about the dog still picking the way (L05), not the scent itself |

Recommended pair: cover C1 + title T4.
