# Cover principles

Rules for the cover image (thumbnail) of every deliverable: the 9:16 cover of a Short/Reel and the 16:9 thumbnail of a long video. **Owner: Film.** Status: **proposed** (3 Nov 2026, user request "มี principle อะไรในการทำปกคลิป … ให้ agent สักคนนึงถือไว้"); first used on `WDG-EP01-SHORT-COVERS` and `EG-EP01-SHORT-COVERS`.

Rule levels follow [AGENTS.md](../AGENTS.md#language-and-rule-conventions). Platform facts in [CV-P](#cv-p-platforms) are **Reference**, unverified against current platform docs; recheck before relying on one.

## When

**Requirement.** Covers come with the delivery render. Before the delivery render, covers are chosen in **two picks** (CV09, user 7 Nov 2026; procedure in the [cover-design skill](../.agents/skills/cover-design/SKILL.md)): Film registers `<ID>-PIC-COVERS` with five pictures without text and the user picks one, then Film registers `<ID>-COVERS` with five text versions on that picture; `scripts/render.mjs <ID>` then renders them into `out/<ID>/covers/` (`<ID>_cover-A.png` … `-E.png`), archived beside the MP4. The coordinator sends the sheet and the user picks one with the structured-question tool; the pick is published with `python3 -I scripts/store.py publish <ID> --cover <path> --reason "<why>"` into `publish/<channel>/<PROJECT>/<ID>/<ID>_cover.png`, the one folder the user takes files from to upload ([publish folder](../README.md#publish-folder)), and recorded in the delivery record. A later re-pick or cover fix is published the same way in the same turn; the old file is replaced there and kept in `history.tsv`. A deliverable rendered before its covers existed gets them with `render.mjs <ID> --covers` (stills only, no video). A stage with no subject (for example a look-frame composition) is recorded `N/A`.

## Rules

- **CV01 — One idea at a glance.** A cover says one thing a scrolling viewer gets in about one second. It is judged at phone-grid size (CV10), not full size.
- **CV02 — Few words, big.** At most about five Thai words: one headline plus at most one short sub-line. The headline cap height is at least 7% of the frame height (about 135 px on 1920). The cover text adds to the title; it does not repeat it word for word.
- **CV03 — One large subject.** One readable subject: a face with a clear emotion, the creature or object of the story, or one striking shape. Large and high in contrast against its ground; no busy background behind it.
- **CV04 — Open a question, keep the promise.** Show the setup or the question, not the answer or the twist. Everything the cover implies must happen in the video (no clickbait beyond the content). Factual covers follow Boat's verdicts; cultural subjects keep the respect rules of the script.
- **CV05 — Contrast and colour.** Text in a heavy weight with a dark outline; one accent colour taken from the episode palette (for example the lantern orange of WDG) for the key word, the rest near-white. At most three colours of text.
- **CV06 — Safe zones.** Headline and subject sit inside the centre 3:4 crop of a 9:16 cover (y 240–1680 on 1080×1920), clear of the bottom 20% (caption and app UI) and the right 120 px (action buttons). A 16:9 thumbnail keeps the bottom-right corner free (duration badge).
- **CV07 — From the film.** Default: the cover uses an actual episode plate at a chosen frame, so it matches what the viewer then sees. A new painting only when no frame fits, with the reason recorded. Text is drawn as an overlay, never painted in.
- **CV08 — Series identity.** Same font family (Noto Sans Thai, weight 800), outline style and text position across a series; the deliverable's channel mark (`@TamMaiLa` for `edu`, `@mg.fiction` for `fiction`) stays small top-left as on the video ([channel mark default](delivery-workflow.md)).
- **CV09 — Two picks, five each.** Pick 1: five pictures without text that differ in picture idea (subject close, odd view, face and emotion, action, diagram), each leaving a calm band for a headline. Pick 2: five texts on the picked picture that differ in angle, not only in wording (misconception, question, imagined view, try this, number). An episode may swap one idea or angle for another with a reason.
- **CV10 — Check small.** Render full size through `scripts/render.mjs <ID> --stills`, then look at each cover at 120 px wide (phone grid) and at the 3:4 crop. The headline must read at 120 px; a sub-line that does not is acceptable only if the headline carries the idea alone.

<a id="cv-p-platforms"></a>
## CV-P — Platforms (Reference, unverified)

- Instagram Reels: custom cover upload; the profile grid shows a centre 3:4 crop.
- YouTube Shorts: the cover is picked from a frame of the video in the mobile app; a custom image may not be available. When it is not, the chosen cover frame must exist in the video (for example the first frame, or a frame the cover was built from).
- YouTube long video: 1280×720 or larger, 16:9, under 2 MB; "Test & compare" can A/B up to three thumbnails.
- TikTok: cover picked from a video frame or uploaded, with text added in the app.

## Implementation

- Data: `src/videos/covers/<episode>.ts` lists the five covers (plate ID, shot-local frame, text lines) and the episode's cover style (accent colour, optional scrim); `src/videos/covers/index.ts` registers `<ID>-COVERS` with `coversVideo` ([src/videos/cover-overlay.tsx](../src/videos/cover-overlay.tsx)). Covers stay out of the episode modules: an episode's scene keys hash its own imports, so a cover edit there would mark every pinned scene changed.
- Look: the shared `covers` overlay draws the text from `overlayProps` (data), one 1 s scene per candidate; the cover is scene frame 15.
- Check: `node scripts/render.mjs <ID>-COVERS --stills --frames=15,45,75,105,135`, then `scripts/qa-sheet.sh` at 270 px and 120 px (CV10).
