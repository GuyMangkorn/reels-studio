# EDU-EP21-SHORT cover notes (Film)

## Pick 1 — five pictures, no text (EDU-EP21-COVER-PICK1-R1, 2026-11-17)

Inputs: SCRIPT-R1 (L01–L12), FACT-R1 (ready-for-storyboard, zero must-fix), SHEETS-R4, Final cut v1 (`out/EDU-EP21-SHORT/clips/_final_cut.full.mp4`, store `projects/edu/EDU/final/EDU-EP21-SHORT-final-v1.mp4`). Skill: `.agents/skills/cover-design/SKILL.md` section 2; rules CV01–CV11.

Composition `EDU-EP21-SHORT-PIC-COVERS` (`src/videos/covers/edu-ep21.ts`, registered in `src/videos/covers/index.ts`). Plates are cover-only paintings `EDU21-COVER-*` in `src/painted/edu21/cover-shots.tsx`, listed in `src/painted/shots/edu21-covers.tsx`, appended to `src/painted/registry.ts`.

**Registry side effect (read before re-rendering the episode):** the registry line changes every painted deliverable's shared render-input hash, so a re-render of the pinned EDU-EP21-SHORT (or any pinned painted episode) needs `--keep-pinned` or a repaint (skill section 2). The episode inventory `src/painted/shots/edu21.tsx` is unchanged. The delivery render had finished (`out/logs/edu21-delivery.log` "exit 0") before any cover render ran.

### Hook sheet

- **Promise:** the viewer finds out that it is not the tyres but the closed metal shell that helps protect the person inside (L01–L03), because the current runs along the outer metal around her into the ground (L05, L12).
- **Stakes:** a bolt lands on the roof of the car with a woman at the wheel (B01-SH01 G12, L01); the tyre is damaged (L07), the dash dies (L08–L09); protection is not a guarantee (L11).
- **Gaps:** Do the rubber tyres save her? (yes/no) → L01–L03. Metal conducts, so how can it help? → L04–L05. Is the car unharmed? → L06–L07. Why did the dash go dark? → L08–L09. Is everyone inside always safe? (yes/no) → L11.
- **Never shown:** the route glow on the shell (B02-SH06, SH13 echo), the explanation chip, the damaged tyre (B03-SH08), the dead dash (B04), any "safe" verdict.

### Why new paintings (CV07)

The film's strike frames (B01-SH01 G12–16, B05-SH13 L143/L161) keep the car about 600 px wide with a thin bolt and no readable face; on the 120 px survey of the Final cut the strike is a grey line. The plates reuse the locked SET-ROAD21 / CAR21 / DRIVER / bolt assembly (`paintExterior`, `paintCabin`, `paintDriverAt`, `Bolt`, `paintStrikeRim`) with a cover camera. Every subject and event is in the film. Pushed only: framing, bolt width (×1.4–1.8), flare size, and her startle (`B01_DRIVER` G37, surprised, hands near the face) drawn on the stroke frame; in the film it peaks about 0.8 s after the stroke. The tyre stays intact (SH01 shows no damage, SD12).

### Candidates

| Still (frame) | ID / plate | Picture idea | Camera (orbit at, yaw, r, eye; f, hy, pitch) | Headline band |
| --- | --- | --- | --- | --- |
| 15 | P1-strike-poster / EDU21-COVER-STRIKE | Danger moment | (-0.15, 1.0, 0.4), 28°, 3.6 m, 0.4 m; 820, 1150, +10° | lower road and verge y 1350–1540 |
| 45 | P2-startled-face / EDU21-COVER-FACE | Face and emotion | (-0.3, 1.2, 0.5), 22°, 1.7 m, 1.2 m; 1000, 900, +6° | red door panel y 1250–1540 |
| 75 | P3-tyre-close / EDU21-COVER-TYRE | Subject close (red ring on the intact tyre) | (-1.3, 0.55, 0.85), 24°, 1.45 m, 0.18 m; 760, 1100, +24° | sky left of the bolt y 300–650 |
| 105 | P4-giant-bolt / EDU21-COVER-WIDE | Scale shock | (-3.2, 3.5, 0), 35°, 13 m, 1.0 m; 1000, 1330, +8° | sky left of the bolt y 450–900 |
| 135 | P5-inside-view / EDU21-COVER-INSIDE | Odd view (passenger seat, bonnet strike through the windscreen, B05-SH13 E2) | (0.46, 1.05, 0.57), 207°, 1.05 m, 1.12 m; 420, 900, +2° | roof lining y 300–600 |

One-line hooks and legitbait:

- **P1** — a bolt hits the roof with a woman inside: does she survive? Paid: the strike is SH01 (frame 0–29), the answer L02–L03, scoped by L11 (no guarantee); a pick-2 yes/no must stay a question.
- **P2** — her shocked face as the bolt lands right above her head. Paid: SH01 strike + SH02 startle (G29–100); she is unhurt through the end, and the cover makes no safety claim.
- **P3** — the tyre circled: "is it the rubber?" (wrong vs right). Paid: L01 denies the tyre at 0 s, L07 shows the tyre damaged; the ring marks the myth, not a fact.
- **P4** — a giant bolt on one small car. Paid: the same strike; the scale is camera distance only (the bolt is the film's channel, 70 m cloud base).
- **P5** — you are in the passenger seat as the windscreen goes white. Paid: B05-SH13 E2 bonnet strike (L161) with her inside; the passenger lens is a cover-only vantage (SH12 family).

### Checks

- Sheets: 270 px `out/EDU-EP21-SHORT-PIC-COVERS/pick1-270.png`, 120 px `pick1-120.png`, shelf `pick1-shelf-120.png` (beside EP05 and EP11 published covers). Store copies: `projects/edu/EDU/covers/` (archived 2026-11-17, generic file names `pick1-*.png`, `stills/<frame>.<hash>.png`).
- Shelf: P1, P2 and P3 pop beside EP05 and EP11 (red car and white bolt on grey). P4 holds through its bolt. P5 is the dullest of the row (grey cabin) and stays as the alternative after one rework round (vignette 0.55, windscreen glow); render rounds used: 4 full + 4 single-plate.
- Safe zones: subjects inside y 240–1680. P3 tyre bottom reaches about y 1530; P5 her ponytail reaches about x 1040 (inside the right 120 px button strip by about 80 px; her face at about x 880 is clear).

### Score (F1, F2, F3, S2, S4; max 10)

| Pic | F1 | F2 | F3 | S2 | S4 | Total | Weakest point |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P1 | 2 | 1 | 2 | 2 | 2 | 9 | her face is small (about 70 px), the bolt carries it |
| P2 | 2 | 2 | 2 | 2 | 2 | 10 | rear of the car cropped; red door is the only calm band |
| P3 | 2 | 2 | 2 | 2 | 1 | 9 | the bolt competes with the tyre for the eye; needs pick-2 text to say "tyre" |
| P4 | 2 | 1 | 2 | 2 | 1 | 8 | the bolt's upper half is a straight column (cloud-base continuation) |
| P5 | 1 | 2 | 1 | 2 | 1 | 7 | grey and low contrast; bolt small; legs float without the seat cushion |

**Recommended: P2** (face and emotion): the only one with a readable face at 120 px, the bolt lands right beside her head, and it pairs with the strongest title levers (a body in danger + yes/no "รอดมั้ย?" / "ยางช่วยจริงไหม?"). Second: P3 if the user wants the myth angle (wrong vs right).

## Pick 2 — five texts on P2 plus five titles (EDU-EP21-COVER-PICK2-R1, 2026-11-17)

User picked **P2-startled-face** (EDU21-COVER-FACE, local 15). Composition `EDU-EP21-SHORT-COVERS` (`EDU21_COVERS` in `src/videos/covers/edu-ep21.ts`, registered in `src/videos/covers/index.ts`). Accent: episode yellow `#ffd23f` (red would vanish on the red door). Bands: red door y 1180–1540 behind a bottom edge grade (C1, C3–C5); sky right of the bolt x 430–920, y 300–720 behind a right edge grade (C2).

| Still | Cover | Angle | Text (accent) | Paid at | Weakest point |
| --- | --- | --- | --- | --- | --- |
| 15 / A | C1-survival-in-car | Survival bet | ในรถ / **รอดมั้ย?** | L01–L03 (protects her in the closed car); L10–L11 scope (question only, no guarantee) | "รอด" is not spoken: it is the bet form of L01 "ช่วยป้องกันคนในรถ" + L11 "ปลอดภัย" (B3 = 1) |
| 45 / B | C2-you | You | ถ้าเป็น / **คุณ?** | L03 "รอบคุณ", L12 "รอบตัวคุณ" | the gap is implicit; least concrete hook |
| 75 / C | C3-wrong-tyre | Wrong vs right (replaces extreme number: the film says no number, CV09 swap) | ยางช่วย? / sticker **ผิด!** | L01 at 0 s, L07 | the tyre is barely in frame (left edge), so "ยาง" rests on the text alone |
| 105 / D | C4-contradiction-metal | Contradiction | โลหะนำไฟ / **กลับช่วย!?** | L04, L03/L12 | hints the gap-1 answer that L03 states at 6.5 s; most words |
| 135 / E | C5-forbidden-window | Forbidden | **ห้ามเปิด** / กระจก! | L02 "ปิดกระจกด้วย" | the film states the window condition in 3 s without explaining it (S3 = 1) |

Not used: any "safe" verdict or "100%" (L11), volts or numbers (FACT-R1 has none), the damaged tyre or dead dash as picture.

### Titles (CV11)

| ID | Formula | Title | Paid at | Clean with (no cover word repeated) | S1 S2 S3 S4 T3 = total |
| --- | --- | --- | --- | --- | --- |
| T1 | You transformed | ฟ้าผ่าหลังคาตอนคุณขับ… อะไรป้องกันไว้? | L01–L03 | C1 C3 C4 C5 | 2 2 2 2 2 = 10 |
| T2 | Survival yes/no | ฟ้าผ่ากลางถนน คนขับปลอดภัยจริงไหม? | L02–L03, L11 ("จริงไหม" answered: helps, not every time) | all five | 2 2 2 1 2 = 9 |
| T3 | Contradiction | ตัวถังเป็นตัวนำไฟฟ้า… ทำไมกลับเป็นที่หลบ? | L04–L05, L12 | C1 C3 C5 | 2 1 2 1 2 = 8 |
| T4 | Myth (replaces scale/extreme; no number in the film) | ยางกันฟ้าผ่าได้? เชื่อแบบนี้ผิดนะ | L01, L07 | C1 C2 C4 C5 | 2 2 2 1 2 = 9 |
| T5 | Myth / mistake | ฟ้าผ่าแล้วรถไม่เป็นไร? งั้นหน้าปัดดับทำไม | L06, L08–L09 | C3 C4 C5 | 2 2 2 1 2 = 9 |

Lengths 33–41 code points (24–32 spacing glyphs); hook in the first three words of each. No extreme words (ที่สุด, ทุกคน, เสมอ).

### Checks

- Render rounds 2 of 4: r1 all five; r2 C2 "คุณ?" moved x 740 → 690, size 270 → 250 (its right edge was about x 1028, inside the button strip; now x 430–920 measured on the 540 px view).
- Sheets: 270 px `out/EDU-EP21-SHORT-COVERS/pick2-270.png`, 120 px `pick2-120.png`, shelf `pick2-shelf-120.png` (beside the EP05 and EP11 published covers). Every headline reads at 120 px; on the shelf all five hold beside EP05/EP11 (red car, white bolt, yellow word); C2 and C3 read first.
- Safe zones: all lines inside x 100–920; last baselines y 1530 (C1, C3–C5) and 700 (C2), above 1540; her face (about x 500–760, y 900–1170) clear of every line.
- Frame-0 check (proposed): frame 0 of the Short is SH01's wide strike: same car, bolt and woman, smaller and without text; the cover question (rubber, survival) matches L01. Pass with a size difference.

### Score (13 rows, max 26)

| Cover | T1 T2 T3 F1 F2 F3 S1 S2 S3 S4 B1 B2 B3 | Total |
| --- | --- | --- |
| C1 | 2 2 2 2 2 2 2 2 2 2 2 2 1 | 25 |
| C2 | 2 2 2 2 2 2 1 1 2 2 2 2 2 | 24 |
| C3 | 2 2 2 2 2 2 2 2 2 2 2 2 2 | 26 |
| C4 | 2 2 2 2 2 2 2 2 2 1 2 1 2 | 24 |
| C5 | 2 2 2 2 2 2 1 2 1 2 2 2 2 | 24 |

**Recommended: C1 + T1** (survival bet is the channel's strongest lever, 25k on the lift episode; T1 adds "you" and the roof strike without repeating a cover word). **Alternative: C3 + T2** (top score; the myth angle the film opens on at 0 s, T2 pairs clean with all five). Store: `projects/edu/EDU/renders/EDU-EP21-SHORT-COVERS/3f050e1558a8-dirty-202611171133/` (covers A–E and the three sheets).

Change log: 2026-11-17 Film — R1 created (pick 1 only; no text, no title, nothing published). 2026-11-17 Film — pick 2 R1 added (five texts on P2, five titles; nothing published, no pins or locks touched).
