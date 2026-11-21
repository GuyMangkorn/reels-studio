# EDU-EP31-SHORT cover notes

- Revision **`EDU-EP31-COVER-R1`**, Film, 2026-11-21: pick 1 (five pictures without text), [cover-design skill](../../../../.agents/skills/cover-design/SKILL.md) sections 1, 2, 6 and 7; rules [cover-principles](../../../../docs/cover-principles.md) CV01–CV11. Pick 2 (texts and titles) is revision **`EDU-EP31-COVER-R2`** below.
- Inputs: [script](script.md) `EDU-EP31-SCRIPT-R2`; [fact-check](fact-check.md) `EDU-EP31-FACT-R1` (and its rechecks); [review rows](review-rows.json) (shot IDs and frames, read only); Final cut `out/EDU-EP31-SHORT/final-ok-v1.mp4` (21 Nov 2026, scouting only). No change to any shot, caption, audio or row.
- Cover data: [src/videos/covers/edu-ep31.ts](../../../../src/videos/covers/edu-ep31.ts) (`EDU31_PICS`), registered as `EDU-EP31-SHORT-PIC-COVERS` in [covers/index.ts](../../../../src/videos/covers/index.ts). Runtime status: `existing-integrated` (render below).

## Change log

- COVER-R2 (Film, 2026-11-21): pick 2 on the user's picked picture P1-wink-lemon (EDU31-B01-SH03 f41, plate frame, no repaint, `src/painted/registry.ts` untouched; user, chat 2026-11-21) with no reconstruction tag on the cover (user, same chat; closes open questions 1 and 2). Five text versions `EDU31_COVERS` registered as `EDU-EP31-SHORT-COVERS`, five titles, scores, shelf and frame-0 checks. Render round 4 of 4.
- COVER-R1 (Film, 2026-11-21): hook sheet, five plate-frame pictures, bands and pick-1 scores. Render round 2 of 4 (r1 all five; r2 P4 swapped from B01-SH02 f80, a small walking figure that was the dullest on the shelf, to B05-SH01 f86).

## Hook sheet

- **Promise:** the viewer finds out why a man robbed two banks in 1995 without a mask (lemon juice as "invisible ink", L01, L03), whether it worked (L06 his test photo really is blank; L09 three and a half months free; L12 caught in under an hour) and what he said when shown his photo (L14).
- **Stakes:** McArthur Wheeler stands bare-faced in front of the bank camera (L08, B04-SH02); his face then fills the 11 pm news (L10, B05-SH01) and police have him in under an hour (L12). The victim of the bait is his plan and his own face, never the tellers.
- **Gaps:**
  1. Does lemon juice really hide a face from cameras? (yes/no) → L04 (only on paper), L06, L12.
  2. Why rob a bank with no mask? → L01.
  3. Where did he get the idea? → L03.
  4. Did his own test fool him? (yes/no) → L06.
  5. How long until he was caught? → L09, L12.
- **Never shown (CV04):** the arrest and the interrogation room (B05-SH04, B06-SH01, B06-SH02), "ไม่ถึงชั่วโมง" (L12), his line (L14), the psychologist and the research ending (L15, B07). Also off every cover: the cause of the blank Polaroid (B03-SH04 is a labelled guess, F006 unproven), the gun (the film's toy gun stays out), any smile at the camera (F011), any link of his name or face to the 1999 paper (F015).

## Pick 1: five pictures

All five are episode plates at a chosen shot-local frame (CV07), with a 0.4 vignette and the channel mark redrawn; no cover paintings this round, because a cover-shot module adds a line to `src/painted/registry.ts`, which moves every painted deliverable's shared render-input hash while the Final is about to be pinned (open question 2). A plate frame also exists in the video, which matters where a platform only lets the cover be picked from a video frame (CV-P). The plates carry the episode's baked caption shade (a soft dark band about y 1050–1350), which helps a headline sit there.

| ID | Picture idea | Plate, shot-local frame | One-line idea | Calm band for the headline (frame px, estimated from the 270 px tile) |
| --- | --- | --- | --- | --- |
| P1-wink-lemon | Face and emotion | `EDU31-B01-SH03` f41 | In the bank lobby he pats a lemon half on his cheek with a sparkle, sure he is now invisible | lower: jacket and floor y ~1150–1550 over the baked shade; alt. the wall right of his head x ~620–960, y ~300–650 |
| P2-cctv-face | Odd view (seen by the other side) | `EDU31-B04-SH02` f66 | The bank's CCTV freeze: his bare face, eyes to the lens, REC CAM 2, JAN 06 1995 | lower: body y ~1150–1420, above the date stamp (y ~1470) |
| P3-blank-polaroid | Subject close | `EDU31-B03-SH03` f50 | His own hands hold the test Polaroid, and nobody is in it | lower: dark table y ~1250–1650 (cleanest band of the five); alt. top y ~240–480 |
| P4-face-on-tv | Danger moment | `EDU31-B05-SH01` f86 | Dark room, a 1990s TV fills the frame with his CCTV face: the instant before the city recognises him | lower: dark desk y ~1150–1650, above the VCR blocks (y ~1700+) |
| P5-lemon-cheeks | Swap for scale shock: absurd act | `EDU31-B03-SH02` f19 | Eyes shut, a lemon half on each cheek, believing completely (the film has no scale contrast to sell, so the absurd act takes that slot, CV09) | top: kitchen wall y ~300–560 (calendar at x ~130–260); lower half is busy |

Thai one-liners for the user (contact sheet captions): P1 หน้ายิ้มมั่นใจ ตบมะนาวที่แก้ม; P2 กล้องธนาคารเห็นหน้าเต็ม ๆ; P3 รูปทดสอบออกมา ไม่มีเขาเลย; P4 หน้าเขาขึ้นจอข่าวห้าทุ่ม; P5 แปะมะนาวสองแก้ม หลับตาเชื่อสนิท.

### Score (pick 1: F1 F2 F3 S2 S4, max 10)

| ID | F1 | F2 | F3 | S2 | S4 | Total | Weakest point |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P1 | 2 | 2 | 2 | 2 | 1 | 9 | a calm mid-shot: the face is about a third of the width; the absurd lemon is small at 120 px until a pick-2 ring or headline points at it |
| P2 | 2 | 2 | 1 | 2 | 1 | 8 | grey on grey; the dullest colour on the shelf; hints at how he is caught |
| P3 | 2 | 1 | 2 | 2 | 1 | 8 | no face; without a headline it reads as a blank card |
| P4 | 2 | 1 | 2 | 2 | 2 | 9 | his face is small and grey inside the TV; leans toward the catch (L10 is setup, L12 stays hidden, but the direction is guessable) |
| P5 | 2 | 1 | 2 | 2 | 2 | 9 | eyes closed (no gaze); kitchen props behind; lemon on face repeats P1's idea |

All five pass (no 0 on F1 or S4, every total at least 7).

### Checks

- 270 px sheet `out/EDU-EP31-SHORT-PIC-COVERS/sheet-270.png`, 120 px sheet `sheet-120.png`, shelf sheet `shelf-120.png` (beside EDU-EP05 and EDU-EP11, the two top-viewed covers in [performance](../../../../channels/edu/performance.md)), Thai-captioned contact sheet `contact-270-th.png`; all viewed. On the shelf, P2 is the dullest of the row (low saturation); P1 and P5 are the most colourful; P4 the highest contrast.
- Safe areas (CV06) are checked at pick 2 with the text; every candidate keeps its subject inside x < 960, y 240–1680.

### Recommendation

**P1-wink-lemon.** It puts the whole hook in one picture: a bank, a bare face and the lemon he thinks hides it, with the confidence the ending turns on, and it gives away nothing past L01. Runner-up **P4-face-on-tv** for the strongest danger and contrast, at the cost of hinting at the catch.

## Pick 2: five texts and five titles (COVER-R2)

Picture: P1-wink-lemon for all five (`EDU31-B01-SH03` f41, vignette 0.4, bottom `edge` grade 900 px at 0.75, channel mark redrawn). No reconstruction tag (user). Headlines sit in the lower band over the jacket and floor; C4 adds a red sticker on the ceiling band above his head. Series look (CV08): Noto Sans Thai 800, dark outline, the episode accent `#ffd21f` (the lemon's own yellow); C4 adds red `#ff3b30` for the wrong-vs-right sticker and ring (three text colours at most: white, yellow, red). The payoff stays off every candidate and title (hook sheet "Never shown").

| ID | Text angle | Headline (lines) | One-line idea | Cue | Text extent, frame px (measured on the r4 PNG) |
| --- | --- | --- | --- | --- | --- |
| C1-bet-survive | Survival bet | รอดมั้ย? | A bank, a bare face, a lemon: does he get away? (L09 "รอด", then L12) | yellow ring on the lemon | x 122–920, y 1186–1422 |
| C2-you-believe | You | ถ้าเป็นคุณ / เชื่อมั้ย? | Would you trust the lemon trick too? (L03 tip, L05 "ไม่เชื่อ" then the test) | none | x 204–844, y 1131–1452 |
| C3-extreme-2banks | Extreme number | 2 ธนาคาร / ไม่ใส่หน้ากาก | The true extreme of L01: two banks, no mask | none | x 134–904, y 1132–1440 |
| C4-wrong-recipe | Wrong vs right | สูตรเพื่อน (red sticker) / ผิดตรงไหน? | The friend's recipe has a flaw: where? (L03, answered at L04) | red ring on the lemon | headline x 94–914, y 1296–1431; sticker x ~444–890, y ~256–400 (from the 540 px tile) |
| C5-contra-invisible | Contradiction | ทามะนาว / ล่องหน?! | A kitchen lemon as an invisibility cloak (L02–L03) | none | x 104–930, y 1164–1452 |

Copy limits (CV02): one to three words; at most 2 lines; spacing glyphs per line 4 to 8, except C3 line 2 "ไม่ใส่หน้ากาก" (10, scored T2 1). Every word is said in the film: รอด L09, ถ้าเป็นคุณ (the You angle), เชื่อ L05, 2 ธนาคาร / ไม่ใส่หน้ากาก L01, สูตร / เพื่อน L03, ทา / มะนาว L01–L03, ล่องหน L03. Safe areas (CV06): every headline inside x < 960 and y 240–1540 (C4 r3 reached x 984 and was cut from 180 to 160 px in r4; the C4 sticker sits below the y 240 line after r4).

### Titles (CV11)

| ID | Formula | Title | Characters (code points / spacing) | Pays off at | Do not pair with |
| --- | --- | --- | --- | --- | --- |
| T1 | You transformed | ถ้าคุณทามะนาวที่หน้า กล้องจะเห็นมั้ย? | 37 / 28 | L03–L04, L08 | C5 (ทามะนาว) |
| T2 | Survival yes/no | ปล้นธนาคารไม่ใส่หน้ากาก รอดมั้ย? | 32 / 26 | L01, L09, L12 | C1 (รอดมั้ย), C3 (ธนาคาร, หน้ากาก) |
| T3 | Contradiction | ทาน้ำมะนาวที่หน้า… ทำไมกล้าปล้นธนาคาร? | 38 / 32 | L01, L03 | C3 (ธนาคาร), C5 (ทา มะนาว) |
| T4 | Scale / extreme | ปล้น 2 ธนาคารวันเดียว ไม่ใส่หน้ากากเลย | 38 / 32 | L01 | C3 (same words) |
| T5 | Myth / mistake | น้ำมะนาวทำให้ล่องหนจากกล้อง? เขาเชื่อสนิท | 41 / 34 | L03, L05–L07, L14 | C5 (ล่องหน), C2 (เชื่อ) |

Every title holds the hook in its first three words, uses no extreme the fact-check lacks and states no false claim as fact: the invisibility is asked (T1, T5) or framed as his belief (T3 "กล้า", T5 "เขาเชื่อ"). "…" in T3 sits before a clause that names the act. No emoji.

### Score (pick 2: T1 T2 T3 F1 F2 F3 S1 S2 S3 S4 B1 B2 B3, max 26; T3 counted with a non-clashing title)

| ID | T1 | T2 | T3 | F1 | F2 | F3 | S1 | S2 | S3 | S4 | B1 | B2 | B3 | Total | Weakest point |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C1 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 1 | 2 | 2 | 2 | 2 | 2 | 25 | the picture shows no danger, so "รอด" needs the title (T3, T4, T5) to name the robbery |
| C2 | 2 | 2 | 2 | 2 | 1 | 2 | 1 | 1 | 2 | 1 | 2 | 2 | 2 | 22 | softest hook: "believe what?" is left to the lemon and the title |
| C3 | 2 | 1 | 2 | 2 | 1 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 24 | the reason (lemon) is not pointed at; line 2 is 10 glyphs |
| C4 | 2 | 2 | 2 | 1 | 2 | 2 | 2 | 2 | 1 | 2 | 1 | 2 | 1 | 22 | three elements compete; "สูตรเพื่อน" states Wheeler's account of the tip as fact and points at a second real person (L03 supported-with-limits, FC03); red leaves the yellow series accent |
| C5 | 2 | 2 | 2 | 2 | 1 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 25 | no ring: the lemon is found by colour alone at 120 px |

All five pass (at least 18, no 0 on T1, F1, S3 or S4).

Titles (S1 S2 S3 S4 T3, max 10): T1 2 2 2 1 2 = 9 (hypothetical "คุณ" with no body danger); T2 2 2 2 2 2 = 10 (the channel's second-best formula, ลิฟต์ขาด 25k); T3 2 2 2 1 2 = 9; T4 1 2 2 2 2 = 9 (states, does not ask; the gap is "why"); T5 2 2 2 1 2 = 9. All pass.

### Checks

- Sheets (all viewed): `out/EDU-EP31-SHORT-COVERS/sheet-270.png`, `sheet-120.png`, `shelf-120.png` (beside EDU-EP05 and EDU-EP11 published covers from `publish/edu/EDU/`), Thai-captioned `contact-270-th.png` (manifest `contact.tsv`). Asset store: `projects/edu/EDU/covers/EDU-EP31-SHORT-COVERS/` (the five PNGs and the four sheets); pick 1 already stored under `projects/edu/EDU/renders/EDU-EP31-SHORT-PIC-COVERS/`.
- 120 px: every headline reads; C4's sticker is the smallest text but legible. Shelf: none is the dullest of its row; the warm lobby and yellow type hold up against EP05's green and EP11's grey; C1 and C5 carry the biggest word.
- Frame-0 check (proposed): frame 0 of `out/EDU-EP31-SHORT/final-ok-v1.mp4` is the bank lobby wide (B01-SH01) with the same man in the teal jacket beside his friend, caption "ปี 1995" and the reconstruction label. Subject matches every candidate (same man, same lobby; the cover is a closer frame two shots later, B01-SH03 f41). Question: matches C3 (L01) directly; C1, C5 and C2 are answered from L01–L03 within the first 17 s; C4 at L04.
- Render: `node scripts/render.mjs EDU-EP31-SHORT-COVERS --stills --frames=15,45,75,105,135` (logs `out/logs/ep31-covers-r1.log` to `-r4.log`). No shot, caption, audio, review row, pin or registry change.

### Recommendation

**Cover C5-contra-invisible with title T2** ("ปล้นธนาคารไม่ใส่หน้ากาก รอดมั้ย?"). The cover shows the absurd belief in two words over the lemon he pats on (CV09 contradiction), the title names the danger and asks the survival bet the channel's numbers favour; together they say robbery, no mask, lemon, will he get away, and the film answers it (three and a half months, then under an hour) without the cover giving that away. Runner-up **C1-bet-survive with T4** ("ปล้น 2 ธนาคารวันเดียว ไม่ใส่หน้ากากเลย"): the biggest single word and the ring on the lemon, the title supplying the robbery.

## Open questions

1. **Reconstruction tag on the cover** (resolved COVER-R2: none, user 2026-11-21). The film carries "แต่งเติมจากเรื่องจริง · ภาพและเสียงจำลอง ไม่ใช่ภาพจริง" from frame 0 because Wheeler is a real person who may be alive (F016). Film proposes a small "ภาพจำลอง" tag under the mark at pick 2; earlier edu covers (EP26) carried none. User call.
2. **Push-in repaint for the picked picture** (resolved COVER-R2: plate frame, no repaint, user 2026-11-21). If the user wants the picked picture closer and bigger (skill section 2), Boss paints a cover shot in `src/painted/edu31/cover-shots.tsx`; that adds a registry line and moves the shared render-input hash, so it waits until the Final is pinned and archived (later re-renders then need `--keep-pinned`). Otherwise pick 2 stays on the plate frame.
