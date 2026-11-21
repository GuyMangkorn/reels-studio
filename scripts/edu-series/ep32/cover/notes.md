# EDU-EP32-SHORT cover, pick 1 (five pictures, no text) and pick 2 (below)

Film (Sonnet 5.5), 2026-11-21. Procedure: [cover-design skill](../../../../.agents/skills/cover-design/SKILL.md); rules CV01-CV11. Cover data and hook sheet: [edu-ep32.ts](../../../../src/videos/covers/edu-ep32.ts) (`EDU-EP32-SHORT-PIC-COVERS`). Pictures in `out/ep32-cover/` (`full-P*.png` 1080x1920, `P*-540.png`, `sheet-270.png`, `sheet-120.png`). Not published; final cover not rendered.

Facts respected: no claim on the cat's fate, no breed or colour statement, no memo or stamp (payoff, CV04), no REJECTED, CLASSIFIED or dates, no text on the picture (only the small channel mark and a drawn ring cue).

| ID | Picture idea | Source | Pitch | F1 F2 F3 S2 S4 | Total | Weakest point |
| --- | --- | --- | --- | --- | ---: | --- |
| P1 | Face and emotion + cue | new `EDU32-COVER-EAR` (B01-SH02 push-in, L01) | Big cat head in profile, a red ring on the microphone in its ear | 2 2 2 2 2 | 10 | Cat gaze looks away from the viewer; ring is the cue |
| P2 | Odd view | plate B02-SH03 L30 (L03-L05) | A small cat on a park bench between two stone-faced men in trench coats: who is the spy? | 1 1 2 2 1 | 7 | Three figures, the cat is small at 120 px; no mic visible |
| P3 | Odd view | plate B03-SH04 L60 (clipboard, L06-L08) | Test-field map with a looping paw-print trail: where did it go? | 1 1 2 1 0 | 5 | Prop only, no subject, dullest of the row; rework or drop |
| P4 | Subject close | new `EDU32-COVER-MIC` (B01-SH02 push-in) | Ear and mic fill the frame, wire running down the fur | 2 2 2 2 1 | 9 | Half the face cropped, so less emotional than P1 |
| P5 | Scale shock (small cat, big world) | plate B04-SH01 L60 (L07-L08) | One cat standing in a spot of sun while the agents behind it are blurred | 2 1 1 1 1 | 6 | Cat small, shows the sun-spot gag from the middle of the film; weak contrast |

P2 row: F1 1, F2 1, F3 2, S2 2, S4 1 = 7. Rework flags (below 7 or 0 on F1 or S4 per skill): P3 (5, S4 0) and P5 (6). Not reworked in this pass; options in the question to the user.

Notes
- Stills render with the cover's `local` equal to the plate's shot-local frame, so no captions or callouts appear. B01-SH02 L30 predates its Thai callouts (L32), and the cover shots paint the plate without them.
- Two new cover paintings are camera-only push-ins of the film's own cat and mic dressing. Registry change: `src/painted/registry.ts` lists `edu32CoverShots`, which changes the shared render-input hash, so a pinned EP32 re-render needs `--keep-pinned` or a repaint (skill, section 2).
- Shelf check (120 px beside the two top-viewed edu covers) not run in this pass; 270 and 120 px sheets viewed.
- Render rounds: 4 (ear framing x3, the mic push-in). Frame-0 check is for pick 2.
- Headline bands (named for pick 2): P1 left under the chin y 1150-1550; P2 sky y 250-520; P3 grass above the clipboard y 250-480; P4 left lower third y 1100-1500; P5 grass lower third y 1100-1500.

## Pick 2 (five texts on P1 plus five titles), Film (Sonnet 5.5), 2026-11-21

User pick (2026-11-21): P1 (`EDU32-COVER-EAR`); P3 and P5 dropped. Data: `EDU32_COVERS` in [edu-ep32.ts](../../../../src/videos/covers/edu-ep32.ts), composition `EDU-EP32-SHORT-COVERS`. Files in `out/ep32-cover/pass2/`: `r2-A..E.png` (1080x1920), `r2-sheet-270.png`, `sheet-120.png`, `shelf-120.png` (beside EP05 and EP11), `frame0.png`. Not published; no final render; no publish copy beyond the five titles. Respected: no claim on the cat's fate, no breed or colour statement, no memo, stamp, L13 quote, L14 callback, REJECTED, CLASSIFIED or dates. Render rounds 2 of 4 (r1 edge grade too wide and lines crossing the neck; r2 edge 520 px, sizes 140-150).

| ID | Angle | Headline (accent word) | Line IDs | T1 T2 T3 F1 F2 F3 S1 S2 S3 S4 B1 B2 B3 | Total | Weakest point |
| --- | --- | --- | --- | --- | ---: | --- |
| C1 | Survival bet (yes/no) | แมวสายลับ / **ได้ผลมั้ย?** | L06-L08, L12 | 2 2 2 2 2 2 2 1 2 1 2 2 2 | 24 | "ได้ผล" is abstract; not the most arresting word |
| C2 | You | ถ้าแมวคุณ / **โดนใส่ไมค์?** | L01 | 2 2 2 2 2 2 1 2 1 2 2 2 1 | 23 | Hypothetical about the viewer's cat; the film is about the CIA's |
| C3 | True extreme | CIA / **ทำจริง!** | L01, F001 | 2 2 2 2 2 2 1 2 2 1 2 2 2 | 24 | Answers the question L01 raises (spends the hook) |
| C4 | Wrong vs right (red sticker) | อย่าไว้ใจ / **แมว!** | L02-L08 | 2 2 2 1 2 2 2 1 1 2 1 2 1 | 21 | "Do not trust a cat" is a gag, not a film line; red leaves the yellow series accent |
| C5 | Contradiction / versus | CIA vs แมว / **ใครชนะ?** | L14 question, L01 | 2 2 2 2 2 1 2 1 2 2 2 2 2 | 24 | Yellow second line touches the neck edge (F3 1) |

All five pass the pick-2 bar (18 and no 0 on T1, F1, S3, S4). Shelf check: the dullest of the 7-up row by brightness, but legible; C3 and C4 stand out most.

Titles (formula; S1 S2 S3 S4 T3, max 10; T3 scored against the recommended C5):

| ID | Formula | Title | S1 S2 S3 S4 T3 | Total | Note |
| --- | --- | --- | --- | ---: | --- |
| T1 | You transformed | ถ้า CIA ใส่ไมค์ในหูแมวคุณ… มันจะไปไหน? | 2 2 2 2 1 | 9 | "แมว" and "CIA" repeat C5's words (subject nouns); answer L08 |
| T2 | Survival yes/no | แมวที่ CIA ใส่ไมค์ ทำภารกิจสำเร็จมั้ย? | 2 1 2 1 1 | 7 | Same bet as C1; abstract "ภารกิจ" |
| T3 | Contradiction | ฝังเครื่องส่งในตัวแมว… ทำไมยังคุมมันไม่ได้? | 2 2 2 2 2 | 10 | Answer L08-L09; no C5 headline word except the subject noun |
| T4 | Scale / extreme | หน่วยลับเก่งที่สุดในโลก vs แมวตัวเดียว ใครชนะ? | 2 2 1 2 1 | 8 | "เก่งที่สุดในโลก" is the narrator's attitude (L01), not a Boat claim; about 42 characters; repeats C5 |
| T5 | Myth | ใครว่าแมวสายลับมีแค่ในหนัง? CIA ทำจริง | 2 2 2 1 2 | 9 | Repeats C3 (ทำจริง); fine with C1, C2, C4, C5 |

Recommended pair: **C5 + T3** (cover asks "who wins", title asks "why can it not be controlled"; the cover carries the central question, the title the contradiction). Runner-up: C1 + T5.

Frame-0 check (proposed): frame 0 of the Short (`frame0.png`) is the cat sitting on the blueprint with the caption "CIA". Subject matches (the same cat, the CIA); the ring and the mic are not in frame 0 (they arrive with the L01 callouts), and the cover is a pushed-in painting, so no video frame equals it. If Shorts offers no custom cover upload (CV-P, unverified), pick a frame near the first callout (about frame 30 to 150) or accept the mismatch.

Registry hash: `src/painted/registry.ts` lists `edu32CoverShots`; any byte change to that file changes the shared render-input hash and cannot be made neutral. A later EP32 render needs `--keep-pinned`. The pass-2 covers add no registry change (covers are registered only in `src/videos/covers/`).
