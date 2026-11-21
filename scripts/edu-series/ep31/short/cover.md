# EDU-EP31-SHORT cover notes

- Revision **`EDU-EP31-COVER-R1`**, Film, 2026-11-21: pick 1 (five pictures without text), [cover-design skill](../../../../.agents/skills/cover-design/SKILL.md) sections 1, 2, 6 and 7; rules [cover-principles](../../../../docs/cover-principles.md) CV01–CV11. Pick 2 (texts and titles) is not started.
- Inputs: [script](script.md) `EDU-EP31-SCRIPT-R2`; [fact-check](fact-check.md) `EDU-EP31-FACT-R1` (and its rechecks); [review rows](review-rows.json) (shot IDs and frames, read only); Final cut `out/EDU-EP31-SHORT/final-ok-v1.mp4` (21 Nov 2026, scouting only). No change to any shot, caption, audio or row.
- Cover data: [src/videos/covers/edu-ep31.ts](../../../../src/videos/covers/edu-ep31.ts) (`EDU31_PICS`), registered as `EDU-EP31-SHORT-PIC-COVERS` in [covers/index.ts](../../../../src/videos/covers/index.ts). Runtime status: `existing-integrated` (render below).

## Change log

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

## Open questions

1. **Reconstruction tag on the cover.** The film carries "แต่งเติมจากเรื่องจริง · ภาพและเสียงจำลอง ไม่ใช่ภาพจริง" from frame 0 because Wheeler is a real person who may be alive (F016). Film proposes a small "ภาพจำลอง" tag under the mark at pick 2; earlier edu covers (EP26) carried none. User call.
2. **Push-in repaint for the picked picture.** If the user wants the picked picture closer and bigger (skill section 2), Boss paints a cover shot in `src/painted/edu31/cover-shots.tsx`; that adds a registry line and moves the shared render-input hash, so it waits until the Final is pinned and archived (later re-renders then need `--keep-pinned`). Otherwise pick 2 stays on the plate frame.
