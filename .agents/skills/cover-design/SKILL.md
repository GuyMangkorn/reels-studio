---
name: cover-design
description: "Cover and title in two picks: five clickbait pictures without text (plate frames or new cover paintings), the user picks one, then five text versions on that picture plus five titles, the user picks a cover and a title. Covers the hook, legitbait limits, framing, copy, title formulas, layout, render, small-size check and score. Use when making, redoing or reviewing a cover, thumbnail or video title (ปกคลิป, ชื่อคลิป)."
---

# Cover and title design

**Status:** procedure. Two-pick flow set by the user on 7 Nov 2026 ("ให้ผมเลือก visual 5 แบบก่อน… แล้วค่อยเอารูปนั้นไปทำ text"); pushed to clickbait with titles and new cover paintings on 16 Nov 2026 ("ปรับแต่ง skill ทำปกและทำ title ให้ clickbait หน่อย … วาดใหม่ได้นะ"). Owner: **Film**; the coordinator runs both picks. Rules: [cover-principles](../../../docs/cover-principles.md) (CV01–CV11); this skill is how to meet them. Evidence: [clickbait note](../../../docs/research/2026-11-16-clickbait-titles-covers.md) (channel data, Veritasium, MrBeast memo, vidIQ) and the [7 Nov cover note](../../../docs/research/2026-11-07-cover-thumbnail-principles.md). Checks marked **(proposed)** are not rules yet: run them, report a failure as a note, not a block.

The cover and title do the **click** (profile grid, search, channel page, Shorts shelf); the first frame does the stop. All three answer to one hook.

## 0. The bait

**Legitbait, not clicktrap (CV04).** Push the hook as hard as the video can pay. The test for every title, cover and picture: *a viewer who watched to the end agrees the promise was kept.* Fail that and it is a clicktrap: rework it.

What pulls clicks on this channel (edu, Oct–Nov 2026; the [note](../../../docs/research/2026-11-16-clickbait-titles-covers.md#1-channel-evidence-edu-studio-18-oct--14-nov-2026)):

| Pulls | Example (views) |
| --- | --- |
| **You** in an impossible body or place | ถ้าคุณตัวเล็กเท่ามด… โลกจะอันตรายแค่ไหน? (33k) |
| A body in **danger** + survival yes/no | ลิฟต์ขาด กระโดดตอนท้ายรอดมั้ย? (25k) |
| Everyday act + **contradiction** | จ้องตาแมวด้วยความรัก… ทำไมมันหนี? (6.8k) |
| **Scale** up or down + yes/no | ถ้าหมัดตัวเท่าคน จะกระโดดข้ามตึกได้มั้ย? (5.9k) |

| Does not pull | Example (views) |
| --- | --- |
| Topic name + description | เวนดิโก ปีศาจแห่งความหิว (1.0k) |
| Vague poetic phrase, no concrete noun | เมืองที่ไม่รอคุณ (325) |
| Teaser with no stakes for the viewer | เรืออับปางที่เก่าที่สุดในโลก… ไม่เหลือเรือสักชิ้น (1.0k) |

Bait levers, strongest first: **danger to a body** (falling, crushed, eaten, drowning) → **"คุณ"** placed in the situation → **yes/no question** the viewer bets on → **true extreme** (ที่สุด, a big number, ×1000) → **wrong vs right** ("อย่า…", "ที่ทำกันผิด") → **forbidden** ("ห้าม…"). Use one or two per cover, not all.

Never: a claim the film does not make, a number it does not say, a scene it does not show, a hedge ("อาจ") turned flat, a real person or brand implied to do something they did not, or a generic teaser ("ดูจนจบแล้วจะอึ้ง") with no concrete noun.

## 1. Hook sheet

Read by path and revision: the final script, Boat's fact-check verdicts, the scene sheets or storyboard (plate IDs per line), the series' previous cover file `src/videos/covers/<episode>.ts` and the channel's latest analytics snapshot (`channels/<id>/analytics/`).

Write four lines into the cover file's header comment:

- **Promise:** "the viewer finds out ___", with the line ID that pays it off.
- **Stakes:** the worst thing that happens or could happen in the film, to whom, at which line ID. This is the bait's raw material.
- **Gaps:** 3–5 questions the script opens that the viewer half-knows, each with its answer line ID. At least one is a yes/no.
- **Never shown:** the payoff word, object or twist (CV04).

Done when every gap and the stakes have a line ID.

## 2. Pick 1: five pictures

Five candidates with **no text**: register them as `<ID>-PIC-COVERS` (`lines: []`). Each is a different **picture idea**:

| Picture idea | What the picture does |
| --- | --- |
| Danger moment | the instant before harm: the fall, the jaw, the wave; the subject still safe for one more frame |
| Scale shock | tiny vs huge in one frame (the ant-size person under a raindrop, the flea beside a tower) |
| Face and emotion | a big face with fear, shock or disbelief; gaze at the threat or at the viewer, chosen on purpose |
| Subject close | the subject or object huge, cropped tight, at the moment before the answer |
| Odd view | an impossible or "seen by the other side" frame, with a grade (tint, vignette) |

A Diagram (set or chart with a drawn measure line, circle or arrow) may replace one idea when the hook is a number.

**Source (CV07).** Each picture is either an episode plate at a chosen frame or a **new cover painting**. Paint new when a frame is too wide, too calm or too small to sell the hook: push closer, bigger, more danger, more contrast, poster framing (low angle, the threat looming, rim light). Every subject, setting and event in a new painting happens in the film; only framing, scale emphasis and light are pushed. A new painting is a cover-only painted shot: Film writes it as a one-shot sheet (`<EPISODE>-CV<n>`, casting lines per [story first](../../../AGENTS.md#story-first)), Boss paints it with the [painted-2d skill](../../painted-2d/SKILL.md) and the cover's `plate` names it. Keep cover shots in a module the episode does not import, so no episode shot file or per-scene key reads them. Cover shots are registered like any plate (runtime status `existing-integrated`, Boss 16 Nov 2026, EDU19-CV1/CV2): paint them in `src/painted/<ep>/cover-shots.tsx`, list them in a cover inventory `src/painted/shots/<ep>-covers.tsx` and append that list to `src/painted/registry.ts`, the one lookup the cover's `plate` (validator `src/scenes/painted.ts`, `PaintedStage`) resolves; the episode's per-scene keys stay unchanged, but the registry line changes every painted deliverable's shared render-input hash (as any new episode's registration does), so a pinned episode re-render then needs `--keep-pinned` or a repaint.

Each picture: one subject, the highest-contrast region on a low-detail ground (CV03), the payoff never shown, a calm band (top or middle) left for a headline and named in the cover comment. Graphic cues (red circle, arrow, measure line, cross) may be drawn now; they belong to the picture.

Check at 270 px and 120 px (section 6), score the picture rows, hand back (section 7). The coordinator asks the user to pick one picture. Done when the user has picked. Under the [fast lane](../../../docs/delivery-workflow.md#fast-lane) the highest-scoring picture is taken without the question, and pick 2 is asked with the Final verdict (R4), showing the sheet of the other four pictures.

## 3. Pick 2: five texts on the picked picture

Five candidates on the **same picture**: register them as `<ID>-COVERS` for a new deliverable, `<ID>-V<n>-COVERS` for a redo (so the earlier pick stays untouched). Each uses a different **text angle**:

| Text angle | Example shape |
| --- | --- |
| Survival bet | "รอดมั้ย?", "ตายไหม?", one big yes/no |
| You | "ถ้าเป็นคุณ?", "คุณจะ…?" |
| Extreme number | the film's number huge, with its unit: "×1000", "8 นาที" |
| Wrong vs right | "อย่า…!", "ทำแบบนี้ผิด", red sticker or red cross |
| Forbidden / contradiction | "ห้าม…", "ยิ่ง… ยิ่ง…" |

They may also differ in placement, size and look (sticker, plain, one huge word, two lines), as long as the picture's cues stay readable.

**Copy** (CV02, CV04): one to three big words is the default, five the most; every word or number is said or shown in the film and passes Boat's verdict; a hedge becomes a question mark. The stakes word (รอด, ตาย, ห้าม, a number) takes the accent colour, red when the episode palette allows. Headline at most about 8 spacing glyphs per line (combining marks take no width), at most 2 lines, broken by hand at word boundaries. Cover text adds to the title, never repeats it.

<a id="title"></a>
## 4. Title (CV11)

With pick 2, write **five title candidates** into the cover file's header comment, each with a different formula:

| Formula | Shape | Channel example |
| --- | --- | --- |
| You transformed | ถ้าคุณ [เปลี่ยนร่าง/ไปอยู่ที่…]… [อันตราย/เกิดอะไร]? | ถ้าคุณตัวเล็กเท่ามด… โลกจะอันตรายแค่ไหน? |
| Survival yes/no | [หายนะ] [ทำ X] รอดมั้ย? | ลิฟต์ขาด กระโดดตอนท้ายรอดมั้ย? |
| Contradiction | [ทำสิ่งดี/ปกติ]… ทำไม [ผลตรงข้าม]? | จ้องตาแมวด้วยความรัก… ทำไมมันหนี? |
| Scale / extreme | ถ้า [สิ่งเล็ก] ตัวเท่า [สิ่งใหญ่] จะ [ทำสิ่งเกินจริง] ได้มั้ย? | ถ้าหมัดตัวเท่าคน จะกระโดดข้ามตึกได้มั้ย? |
| Myth / mistake | [สิ่งที่ทุกคนเชื่อ] ผิด? / อย่า [ทำสิ่งที่ทำกัน] | — |

Title rules:

- The hook (คุณ, the disaster, the number, the contradiction) sits in the **first three words**.
- Name a **concrete situation** the viewer can picture, not the topic's name (Veritasium: name the mystery, not the term). A proper name (Dark Forest, The Bloop, Wendigo) comes after the hook, never as the opening label.
- About **40 characters** or fewer so the Shorts overlay does not cut it; at most one emoji, at the end.
- "…" only before a payoff clause that names something; never a bare teaser.
- Extremes (ที่สุด, ทุกคน, เสมอ) only when Boat's verdict supports them.
- The title asks; the cover shows. No word of the cover headline repeats in the title (CV02).

The coordinator asks the user to pick a title in the same question round as the cover. The picked title is published with `python3 -I scripts/store.py publish <ID> --title "<title>" --reason "<why>"` and its formula logged in the delivery record, so later analytics can compare formulas.

## 5. Layout

- **Headline band:** the band left calm in pick 1, usually top or middle (baselines about y 470–640) with a dark `edge` grade from the top behind it. Keep the last baseline above y 1540 (grid view-count badge, proposed) and everything inside y 240–1680 and x < 960 (CV06).
- **Series look** (CV08): Noto Sans Thai 800, dark outline, the episode accent from `<EPISODE>_COVER_STYLE`, at most three text colours.
- **Engine fields** (types in [cover-overlay.tsx](../../../src/videos/cover-overlay.tsx)): `scrim: false` per cover; `layout.grade` (`edge`, `tint`, `vignette`, `desat`); `layout.elements` (`ellipse` circles, `path` lines, arrows and crosses, small `text` labels; draw a dark wider stroke under an accent stroke so the cue survives any ground); `look.label` for a sticker headline.
- **Gotchas (observed 7 Nov 2026):** `layout.plateMove` did not move painted plates: to get closer, pick another frame or paint a cover shot. Place elements on the plate's actual coordinates, measured from a render. A cover's `local` frame is at least 15 (`COVER_STILL`); a smaller one fails the render with "fromSec: expected non-negative seconds" and breaks the shared bundle for every other cover render.

## 6. Render and check

1. `node scripts/render.mjs <COMP-ID> --stills --frames=15,45,75,105,135 > out/logs/<id>-covers.log 2>&1` (load the [render skill](../render/SKILL.md) first).
2. `scripts/qa-sheet.sh <out>.png --cols 5 <stills>` at 270 px, then again with `--width 120` (phone grid, CV10). View both.
3. **Shelf check:** a 120 px sheet with each candidate beside the channel's two top-viewed covers (from `$REELS_STORE/publish/<channel>/`). A candidate that is the dullest of its row reworks.
4. To place elements, view the affected stills with `--width 540` and convert tile pixels to frame pixels (×2).
5. Repeat until every candidate passes its score. At most 4 render rounds per pick.

## 7. Score and hand-back

Score each candidate 0–2 per row. Pick 1 scores F1–F3, S2 and S4 (max 10; rework below 7 or any 0 on F1 or S4). Pick 2 scores all rows (max 26; rework below 18 or any 0 on T1, F1, S3 or S4). Titles score S1–S4 and T3 (max 10; rework below 7 or any 0 on S3).

| Row | 2 means |
| --- | --- |
| T1 | headline reads at 120 px |
| T2 | length and lines within the copy limits |
| T3 | cover and title add to each other, no repeat |
| F1 | one subject, the most salient blob when squinting |
| F2 | face or eyes readable, or a cue (gaze, circle, arrow) points at the key element |
| F3 | subject (and text) contrast with their ground |
| S1 | opens a gap the video closes |
| S2 | concrete hook: danger, number, odd detail or wrong vs right |
| S3 | legitbait: the promise is paid off at the recorded line ID, nothing implied that the film lacks |
| S4 | bait strength: a stranger would click this over its shelf neighbours (section 6 step 3) |
| B1 | series identity kept |
| B2 | the hook sits in the first glance: first three title words, or the biggest cover word |
| B3 | Boat's verdict supports every word and number |

Hand back to the coordinator: the 270 px, 120 px and shelf sheet paths (for a redo, also the current cover beside the new five), the five titles, the score tables, the recommended cover and title and each candidate's weakest point. The coordinator sends the sheets and asks the user with the structured-question tool (cover and title in one round). After pick 2, also check that frame 0 of the Short shows the same subject and question as the picked cover (proposed) and note the result.
