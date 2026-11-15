---
name: cover-design
description: "Cover in two picks: five pictures without text, the user picks one, then five text versions on that picture, the user picks again. Covers the promise, framing, copy, layout, render, small-size check and score. Use when making, redoing or reviewing a cover or thumbnail (ปกคลิป)."
---

# Cover design

**Status:** procedure. Two-pick flow set by the user on 7 Nov 2026 ("ให้ผมเลือก visual 5 แบบก่อน… แล้วค่อยเอารูปนั้นไปทำ text"); the earlier one-step flow ran on `EDU-EP01…06-SHORT-V2-COVERS`. Owner: **Film**; the coordinator runs both picks. The rules live in [cover-principles](../../../docs/cover-principles.md) (CV01–CV10); this skill is how to meet them. Evidence and sources: [research note](../../../docs/research/2026-11-07-cover-thumbnail-principles.md). Checks marked **(proposed)** come from that note's section 6 and are not rules yet: run them, and report a failure as a note, not a block.

The cover does the **click**, not the stop: Shorts, Reels and TikTok feeds autoplay, so the cover shows on the profile grid, search and channel page. The first frame does the stop. Design both around one question.

## 1. Promise

Read by path and revision: the final script, the title, Boat's fact-check verdicts, the scene sheets or storyboard (plate IDs per line) and the series' previous cover file `src/videos/covers/<episode>.ts`.

Write three lines into the cover file's header comment:

- **Promise:** "the viewer learns ___", with the line ID that pays it off.
- **Gaps:** 3–5 questions the script opens that the viewer half-knows, each with its answer line ID.
- **Never shown:** the payoff word, object or twist (CV04).

Done when every gap has an answer line ID.

## 2. Pick 1: five pictures

Five candidates with **no text**: register them as `<ID>-PIC-COVERS` (`lines: []`). Each is a different **picture idea**, chosen so a headline can later open one of the gaps:

| Picture idea | What the picture does |
| --- | --- |
| Subject close | the subject large, at the moment before the answer (eyes, face, the object) |
| Odd view | an imagined, impossible or "seen by the other side" frame, often with a grade (tint, vignette) |
| Face and emotion | a character's clear reaction; gaze at the viewer or at the key object, chosen on purpose |
| Action | the "try this" moment: a hand, a step, a count |
| Diagram | the set or a chart with a drawn cue (measure line, circle, arrow) that carries a number or comparison |

Each picture: one subject, the highest-contrast region on a low-detail ground (CV03), from an episode plate (CV07), never showing the payoff. Graphic cues (circle, line, arrow) may be drawn now; they belong to the picture. Leave a calm band (top or middle) where a headline can sit later, and note which band in the cover comment.

Check at 270 px and 120 px (section 5), score the picture rows F1–F3 and S2, and hand back (section 6). The coordinator asks the user to pick one picture. Done when the user has picked.

## 3. Pick 2: five texts on the picked picture

Five candidates on the **same plate and frame**: register them as `<ID>-COVERS` for a new deliverable, `<ID>-V<n>-COVERS` for a redo (so the earlier pick stays untouched). Each opens a different gap with a different **text angle**:

| Text angle | Example shape |
| --- | --- |
| Misconception | wrong vs right: "อย่า…", "ที่ทำกันมันผิด?", often a red sticker label |
| Question | the gap as a short question about what the picture shows |
| Imagined view | "ในสายตา…", "ถ้า… เห็น…?" |
| Try this | a "you" action or the count from the script |
| Number | a number the narration says, with what it measures |

The five may also differ in placement, size and look (sticker, plain, two lines, one big word), as long as the picture's cues stay readable.

**Copy** (CV02, CV04): every word or number is said or shown in the film and passes Boat's verdict; a hedge ("อาจ") becomes a question mark, never a flat claim. Headline at most about 8 spacing glyphs per line (combining marks take no width), at most 2 lines, broken by hand at word boundaries. Cover text adds to the title, never repeats it.

Check and score all ten rows, hand back, and the coordinator asks the user to pick. Done when the user has picked; the pick then follows [CV When](../../../docs/cover-principles.md#when).

## 4. Layout

- **Headline band:** the band left calm in pick 1, usually top or middle (baselines about y 470–640) with a dark `edge` grade from the top behind it. Keep the last baseline above y 1540 (grid view-count badge, proposed) and everything inside y 240–1680 and x < 960 (CV06).
- **Series look** (CV08): Noto Sans Thai 800, dark outline, the episode accent from `<EPISODE>_COVER_STYLE`, at most three text colours.
- **Engine fields** (types in [cover-overlay.tsx](../../../src/videos/cover-overlay.tsx)): `scrim: false` per cover; `layout.grade` (`edge`, `tint`, `vignette`); `layout.elements` (`ellipse` circles, `path` lines, arrows and crosses, small `text` labels; draw a dark wider stroke under an accent stroke so the cue survives any ground); `look.label` for a sticker headline.
- **Gotchas (observed 7 Nov 2026):** `layout.plateMove` did not move painted plates. Place elements on the plate's actual coordinates, measured from a render, and pick a different frame when the subject sits badly. A cover's `local` frame is at least 15 (`COVER_STILL`); a smaller one fails the render with "fromSec: expected non-negative seconds" and breaks the shared bundle for every other cover render.

## 5. Render and check

1. `node scripts/render.mjs <COMP-ID> --stills --frames=15,45,75,105,135 > out/logs/<id>-covers.log 2>&1` (stills on one Chrome, [render rules](../../../docs/render-rules.md)).
2. `scripts/qa-sheet.sh <out>.png --cols 5 <stills>` at 270 px, then again with `--width 120` (phone grid, CV10). View both.
3. To place elements, view the affected stills with `--width 540` and convert tile pixels to frame pixels (×2).
4. Repeat until every candidate passes its score below. At most 4 render rounds per pick.

## 6. Score and hand-back

Score each candidate 0–2 per row. Pick 1 scores F1–F3 and S2 (max 8; rework below 6 or any 0 on F1). Pick 2 scores all ten (max 20; rework below 14 or any 0 on T1, F1 or S3).

| Row | 2 means |
| --- | --- |
| T1 | headline reads at 120 px |
| T2 | length and lines within the copy limits |
| T3 | adds to the title, no repeat |
| F1 | one subject, the most salient blob when squinting |
| F2 | face or eyes readable, or a cue (gaze, circle, line) points at the key element |
| F3 | subject (and text) contrast with their ground |
| S1 | opens a gap the video closes |
| S2 | concrete hook: number, odd detail, stakes or wrong vs right |
| S3 | promise paid off at the recorded line ID |
| B1 | series identity kept |

Hand back to the coordinator: the 270 px and 120 px sheet paths (for a redo, also a sheet with the current cover beside the new five), the score table, the recommended pick and the weakest point of each candidate. The coordinator sends the sheet and asks the user with the structured-question tool. After pick 2, also check that frame 0 of the Short shows the same subject and question as the picked cover (proposed CV11) and note the result.
